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
       1. NAVIGATION: scroll progress, active link, mobile menu
       ---------------------------------------------------------------------- */
    function initScrollProgress() {
        const bar = $('#progress-bar');
        if (!bar) return;
        let ticking = false;

        const update = () => {
            const root = document.documentElement;
            const max = root.scrollHeight - root.clientHeight;
            bar.style.width = (max > 0 ? (root.scrollTop / max) * 100 : 0) + '%';
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        }, { passive: true });
        update();
    }

    function initActiveNavLink() {
        const links = $$('.nav-links a[href^="#"]');
        const sections = $$('section[id]');
        if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

        const setActive = (id) => {
            links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
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
       this only wires up the button.
       ---------------------------------------------------------------------- */
    function initThemeToggle() {
        const button = $('#theme-toggle-btn');
        if (!button) return;
        const root = document.documentElement;

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
        render();
    }

    /* ----------------------------------------------------------------------
       3. ANIMATED STATISTICS (final values are already in the HTML, so the
       numbers are correct without JS or with reduced motion)
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

        items.forEach(item => render(item, 0));

        const observer = new IntersectionObserver((entries, obs) => {
            if (entries.some(entry => entry.isIntersecting)) {
                items.forEach(animate);
                obs.disconnect();
            }
        }, { threshold: 0.3 });
        observer.observe(section);
    }

    /* ----------------------------------------------------------------------
       4. CHALLENGES ACCORDION + KEYBOARD ACTIVATION
       ---------------------------------------------------------------------- */
    function initChallengeAccordion() {
        const cards = $$('.challenge-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const wasExpanded = card.classList.contains('expanded');
                cards.forEach(c => {
                    c.classList.remove('expanded');
                    c.setAttribute('aria-expanded', 'false');
                });
                if (!wasExpanded) {
                    card.classList.add('expanded');
                    card.setAttribute('aria-expanded', 'true');
                }
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
       5. MODALS (shared open/close, focus trap, Esc, click-outside)
       ---------------------------------------------------------------------- */
    const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])';
    let activeModal = null;
    let lastFocused = null;

    function openModal(modal) {
        lastFocused = document.activeElement;
        activeModal = modal;
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

    // Documentary: the player URL lives in the iframe's data-src and is only
    // loaded while the modal is open (closing unloads it, which stops playback).
    function initVideoModal() {
        const modal = $('#video-modal');
        const frame = $('#doc-modal-video-frame');
        if (!modal || !frame) return;

        $$('[data-open-video]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                frame.src = frame.dataset.src;
                openModal(modal);
            });
        });

        modal.addEventListener('modal:close', () => {
            frame.src = 'about:blank';
        });
    }

    /* ----------------------------------------------------------------------
       6. REPORT VIEWER (page count comes from the <select>, not a constant)
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

        const show = (page) => {
            current = Math.min(Math.max(page, 1), total);
            image.src = `assets/report/page_${current}.svg`;
            image.alt = `CA1 report page ${current}`;
            label.textContent = `Page ${current} of ${total}`;
            select.value = String(current);
            prev.disabled = current === 1;
            next.disabled = current === total;
        };

        prev.addEventListener('click', () => show(current - 1));
        next.addEventListener('click', () => show(current + 1));
        select.addEventListener('change', () => show(parseInt(select.value, 10)));
        show(current);
    }

    /* ---------------------------------------------------------------------- */
    function init() {
        initScrollProgress();
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
