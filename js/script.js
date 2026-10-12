/* ==========================================================================
   RENEWABLE ENERGY TRANSITION IN INDIA - CA1 PROJECT SCRIPT
   Client-side behaviour: navigation, theme, counters, accordion, modals,
   report viewer. No inline handlers: markup uses data-* attributes.
   ========================================================================== */
(() => {
    'use strict';

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // localStorage can throw (private mode, blocked storage); never let that break the page.
    const storage = {
        get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
        set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ } }
    };

    /* ----------------------------------------------------------------------
       1. NAVIGATION: active link, mobile menu
       ---------------------------------------------------------------------- */
    function initActiveNavLink() {
        const links = $$('.nav-links a[href^="#"]');
        const sections = $$('section[id]');
        if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

        const navIds = new Set(links.map(link => link.getAttribute('href').slice(1)));
        const sectionToNavId = {};
        let lastNavId = 'home';
        sections.forEach(section => {
            if (navIds.has(section.id)) lastNavId = section.id;
            sectionToNavId[section.id] = lastNavId;
        });

        const setActive = (id) => {
            const targetId = sectionToNavId[id] || id;
            links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${targetId}`));
        };

        // Active section = the one crossing a band just below the sticky header.
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        }, { rootMargin: '-120px 0px -60% 0px' });

        sections.forEach(section => observer.observe(section));
    }

    function initMobileMenu() {
        const toggle = $('.hamburger');
        const menu = $('.nav-links');
        if (!toggle || !menu) return;
        const icon = $('i', toggle);

        const setOpen = (open) => {
            menu.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', String(open));
            if (icon) icon.className = open ? 'fas fa-times' : 'fas fa-bars';
        };

        toggle.addEventListener('click', () => setOpen(!menu.classList.contains('active')));
        $$('a', menu).forEach(link => link.addEventListener('click', () => setOpen(false)));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                setOpen(false);
                toggle.focus();
            }
        });
    }

    /* ----------------------------------------------------------------------
       2. THEME TOGGLE
       The initial theme is applied by a tiny inline script in <head> (no flash);
       this wires up the button and listens to OS theme changes if not overridden.
       ---------------------------------------------------------------------- */
    function initThemeToggle() {
        const button = $('#theme-toggle-btn');
        if (!button) return;
        const root = document.documentElement;
        const mediaDark = window.matchMedia('(prefers-color-scheme: dark)');

        const render = () => {
            const dark = root.getAttribute('data-theme') === 'dark';
            button.innerHTML = `<i class="fas ${dark ? 'fa-sun' : 'fa-moon'}"></i>`;
            button.setAttribute('aria-pressed', String(dark));
        };

        button.addEventListener('click', () => {
            const dark = root.getAttribute('data-theme') !== 'dark';
            if (dark) root.setAttribute('data-theme', 'dark');
            else root.removeAttribute('data-theme');
            storage.set('re_theme', dark ? 'dark' : 'light');
            render();
        });

        // Dynamic OS theme change listener (only applies if user hasn't set explicit preference)
        mediaDark.addEventListener('change', (e) => {
            if (!storage.get('re_theme')) {
                if (e.matches) root.setAttribute('data-theme', 'dark');
                else root.removeAttribute('data-theme');
                render();
            }
        });

        render();
    }

    /* ----------------------------------------------------------------------
       3. ANIMATED STATISTICS (safe initialization: numbers stay intact if
       IntersectionObserver is skipped, and animate on view)
       ---------------------------------------------------------------------- */
    function initStatsCounter() {
        const section = $('#glance');
        const items = $$('.stat-number').map(el => {
            const raw = el.dataset.target || '0';
            return {
                el,
                target: parseFloat(raw),
                decimals: (raw.split('.')[1] || '').length,
                suffix: el.dataset.suffix || ''
            };
        });
        if (!section || !items.length) return;

        const render = (item, value) => {
            item.el.textContent = value.toFixed(item.decimals) + item.suffix;
        };

        if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

        const DURATION = 1800;
        let animated = false;

        const animate = (item) => {
            const start = performance.now();
            const step = (now) => {
                const progress = Math.min((now - start) / DURATION, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                render(item, item.target * eased);
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        const triggerAnimation = () => {
            if (animated) return;
            animated = true;
            // Only zero immediately before animating to prevent sticking at 0
            items.forEach(item => {
                render(item, 0);
                animate(item);
            });
        };

        let observer = null;
        observer = new IntersectionObserver((entries, obs) => {
            if (entries.some(entry => entry.isIntersecting)) {
                triggerAnimation();
                obs.disconnect();
            }
        }, { threshold: 0.25 });
        observer.observe(section);

        // Safety fallback: if user jumps past glance section via anchor or after 4s
        setTimeout(() => {
            if (!animated) {
                // Treat the fallback as completion too. Otherwise, a user who
                // reaches this section after the timeout sees the counters jump
                // back to zero and animate a second time.
                animated = true;
                items.forEach(item => render(item, item.target));
                observer.disconnect();
            }
        }, 4000);
    }

    /* ----------------------------------------------------------------------
       4. CHALLENGES ACCORDION + KEYBOARD ACTIVATION
       (Independent toggle allows comparing multiple challenges)
       ---------------------------------------------------------------------- */
    function initChallengeAccordion() {
        const cards = $$('.challenge-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const isExpanded = card.classList.contains('expanded');
                card.classList.toggle('expanded', !isExpanded);
                card.setAttribute('aria-expanded', String(!isExpanded));
            });
        });
    }

    // Elements marked role="button" need Enter/Space support. Only react when the
    // element itself has focus so links/buttons inside a card keep working.
    function initKeyboardActivation() {
        $$('[role="button"][tabindex="0"]').forEach(el => {
            el.addEventListener('keydown', (e) => {
                if (e.target !== el) return;
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    el.click();
                }
            });
        });
    }

    /* ----------------------------------------------------------------------
       5. MODALS (shared open/close, focus trap, Esc, click-outside, body scroll lock)
       ---------------------------------------------------------------------- */
    // Note: Cross-origin iframes are excluded from the trap so Tab navigation does not get lost
    const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    let activeModal = null;
    let lastFocused = null;

    function openModal(modal) {
        lastFocused = document.activeElement;
        activeModal = modal;
        document.body.classList.add('modal-open');
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        const closeButton = $('.modal-close', modal);
        if (closeButton) closeButton.focus();
    }

    function closeModal(modal = activeModal) {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        modal.dispatchEvent(new CustomEvent('modal:close'));
        if (activeModal === modal) activeModal = null;
        if (!$$('.modal-overlay.active').length) {
            document.body.classList.remove('modal-open');
        }
        if (lastFocused) {
            lastFocused.focus();
            lastFocused = null;
        }
    }

    function trapFocus(modal, e) {
        if (e.key !== 'Tab') return;
        const focusable = $$(FOCUSABLE, modal);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    function initModals() {
        $$('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.closest('[data-close-modal]')) closeModal(modal);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (!activeModal) return;
            if (e.key === 'Escape') closeModal();
            else trapFocus(activeModal, e);
        });

        initLightbox();
        initVideoModal();
    }

    // Evidence gallery: any element with data-lightbox-title opens its own <img> enlarged.
    function initLightbox() {
        const modal = $('#lightbox-modal');
        const image = $('#lightbox-img');
        const title = $('#lightbox-title');
        const desc = $('#lightbox-desc');
        if (!modal || !image) return;

        $$('[data-lightbox-title]').forEach(trigger => {
            trigger.addEventListener('click', () => {
                const source = $('img', trigger);
                const captionEl = $('.evidence-caption', trigger);
                const exactTitle = captionEl ? captionEl.textContent.trim() : (trigger.dataset.lightboxTitle || '');
                const text = trigger.dataset.lightboxDesc || '';
                image.src = source ? source.getAttribute('src') : '';
                image.alt = exactTitle;
                title.textContent = exactTitle;
                desc.textContent = text;
                desc.hidden = !text;
                openModal(modal);
            });
        });
    }

    // Documentary: the player URL lives in the iframe's data-src and is loaded while open.
    // Handles loading placeholder, timeout fallback, and stops playback on close.
    function initVideoModal() {
        const modal = $('#video-modal');
        const frame = $('#doc-modal-video-frame');
        const placeholder = $('#video-loading-placeholder');
        if (!modal || !frame) return;

        let loadTimeout = null;

        $$('[data-open-video]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                if (placeholder) placeholder.classList.remove('hidden');
                frame.src = frame.dataset.src;
                openModal(modal);

                frame.onload = () => {
                    if (placeholder) placeholder.classList.add('hidden');
                };

                // Safety timeout: if iframe takes > 6s, hide placeholder so it never blocks
                clearTimeout(loadTimeout);
                loadTimeout = setTimeout(() => {
                    if (placeholder) placeholder.classList.add('hidden');
                }, 6000);
            });
        });

        modal.addEventListener('modal:close', () => {
            clearTimeout(loadTimeout);
            frame.src = 'about:blank';
            if (placeholder) placeholder.classList.remove('hidden');
        });
    }

    /* ----------------------------------------------------------------------
       6. REPORT VIEWER (page count from <select>, preloads adjacent PNGs,
       handles error state)
       ---------------------------------------------------------------------- */
    function initReportViewer() {
        const image = $('#report-page-img');
        const label = $('#report-page-num');
        const select = $('#report-page-select');
        const prev = $('#report-prev-btn');
        const next = $('#report-next-btn');
        if (!image || !select || !label || !prev || !next) return;

        const total = select.options.length;
        let current = parseInt(select.value, 10) || 1;

        const preload = (pageNum) => {
            if (pageNum >= 1 && pageNum <= total) {
                const img = new Image();
                img.src = `assets/report/page_${pageNum}.png`;
            }
        };

        const show = (page) => {
            current = Math.min(Math.max(page, 1), total);
            const pageTitle = select.options[current - 1] ? select.options[current - 1].textContent : `Page ${current}`;

            image.onerror = () => {
                image.alt = `Failed to load preview for ${pageTitle}. Please use the "Download Report (DOCX)" button below to view the complete document.`;
            };
            image.onload = () => {
                image.alt = `CA1 Report: ${pageTitle}`;
            };

            image.src = `assets/report/page_${current}.png`;
            label.textContent = `Page ${current} of ${total}`;
            select.value = String(current);
            prev.disabled = current === 1;
            next.disabled = current === total;

            // Preload adjacent pages for seamless navigation
            preload(current + 1);
            preload(current - 1);
        };

        prev.addEventListener('click', () => show(current - 1));
        next.addEventListener('click', () => show(current + 1));
        select.addEventListener('change', () => show(parseInt(select.value, 10)));

        const card = $('#report-card');
        const view = $('#report-view');
        const zoomBadge = $('#report-zoom-badge');
        if (card && view) {
            const setZoom = (zoomed) => {
                card.classList.toggle('is-zoomed', zoomed);
                view.setAttribute('aria-expanded', String(zoomed));
                view.setAttribute('aria-label', zoomed ? 'Click to zoom out of report page' : 'Click to zoom in on report page');
                if (zoomBadge) {
                    zoomBadge.innerHTML = zoomed
                        ? '<i class="fas fa-times"></i> Click to shrink'
                        : '<i class="fas fa-search-plus"></i> Click to zoom';
                }
            };

            view.addEventListener('click', () => {
                setZoom(!card.classList.contains('is-zoomed'));
            });

            card.addEventListener('keydown', (e) => {
                if (e.target === select) return;
                if (e.key === 'ArrowLeft' && current > 1) {
                    e.preventDefault();
                    show(current - 1);
                } else if (e.key === 'ArrowRight' && current < total) {
                    e.preventDefault();
                    show(current + 1);
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && card.classList.contains('is-zoomed') && !activeModal) {
                    setZoom(false);
                }
            });
        }

        show(current);
    }

    /* ---------------------------------------------------------------------- */
    function init() {
        initActiveNavLink();
        initMobileMenu();
        initThemeToggle();
        initStatsCounter();
        initChallengeAccordion();
        initKeyboardActivation();
        initModals();
        initReportViewer();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
