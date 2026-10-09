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

        const observer = new IntersectionObserver((entries, obs) => {
            if (entries.some(entry => entry.isIntersecting)) {
                triggerAnimation();
                obs.disconnect();
            }
        }, { threshold: 0.25 });
        observer.observe(section);

        // Safety fallback: if user jumps past glance section via anchor or after 4s
        setTimeout(() => {
            if (!animated) {
                items.forEach(item => render(item, item.target));
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
       6. REPORT VIEWER (page count from <select>, preloads adjacent SVGs,
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
                img.src = `assets/report/page_${pageNum}.svg`;
            }
        };

        const accessibleContent = $('#report-accessible-content');

        const pageDigests = {
            1: `<h4>Page 1: Introduction &amp; Project Overview</h4>
                <p><strong>Academic Course:</strong> Environmental Studies (CA1) &bull; <strong>Department:</strong> Department of Environmental Studies</p>
                <p><strong>Context &amp; Need:</strong> India is the third-largest consumer of energy worldwide. Rapid economic expansion has historically been tied to thermal coal and oil imports, leading to carbon emissions and environmental stress. This academic research investigates the renewable energy transition as a vital pathway to energy security and sustainable development.</p>`,
            2: `<h4>Page 2: Review of Literature &amp; Institutional Data</h4>
                <p><strong>Key Sources:</strong> Ministry of New and Renewable Energy (MNRE), International Energy Agency (IEA), Central Electricity Authority (CEA), and International Renewable Energy Agency (IRENA).</p>
                <p><strong>Official RE Capacity Breakdown (30 September 2026):</strong></p>
                <ul>
                    <li>☀️ <strong>Solar power:</strong> 171.05 GW (57.16%)</li>
                    <li>🌬️ <strong>Wind power:</strong> 59.20 GW (19.78%)</li>
                    <li>🌱 <strong>Bioenergy:</strong> 11.75 GW (3.93%)</li>
                    <li>💧 <strong>Small hydropower (&le;25 MW):</strong> 5.18 GW (1.73%)</li>
                    <li>🏞️ <strong>Large hydropower (&gt;25 MW):</strong> 52.06 GW (17.40%)</li>
                    <li>⚡ <strong>Total Renewable Capacity:</strong> 299.25 GW</li>
                </ul>
                <p>Over 83% of power-sector investment in 2024 was committed to clean energy. Flagship commitments include 500 GW of non-fossil capacity by 2030 and net-zero greenhouse gas emissions by 2070.</p>`,
            3: `<h4>Page 3: Description of Product &amp; Attachments</h4>
                <p><strong>Primary Academic Product:</strong> A 5:02 research-based educational documentary synthesizing India's clean energy transition.</p>
                <p><strong>Supporting Evidence Portal:</strong> Interactive website hub containing detailed data summaries, challenge breakdowns, social media verification, and academic documentation (Figures 1 through 6).</p>`,
            4: `<h4>Page 4: Significance of Product / Documentary</h4>
                <p><strong>Educational Impact:</strong> The audiovisual format makes complex technical topics—such as grid intermittency, pumped-hydro storage, and levelized costs—accessible to students and the wider public.</p>
                <p><strong>Pedagogical Value:</strong> Blends rigorous secondary research with modern digital communication to inspire sustainable lifestyle choices and public awareness.</p>`,
            5: `<h4>Page 5: Social Media Coverage &amp; Public Outreach</h4>
                <p><strong>Platform:</strong> Instagram Reels public dissemination campaign posted on 8 October 2026.</p>
                <p><strong>Evaluation Snapshot:</strong> Reached 215 views, 15 likes, 5 comments, and 6 shares during the initial academic evaluation window, demonstrating measurable community engagement and digital dissemination.</p>`,
            6: `<h4>Page 6: Analytical Findings &amp; Future Scope</h4>
                <p><strong>Synthesis:</strong> Expanding generation capacity is only the first phase. Long-term success requires battery energy storage systems (BESS), Green Energy Corridors for cross-state transmission, and decentralized programs like PM Surya Ghar and PM-KUSUM.</p>
                <p><strong>Future Scope:</strong> Accelerating green hydrogen adoption in heavy industry and establishing domestic clean technology manufacturing ecosystems.</p>`,
            7: `<h4>Page 7: Bibliography &amp; References</h4>
                <p><strong>Official Citations:</strong></p>
                <ul>
                    <li>Ministry of New and Renewable Energy (MNRE), Govt. of India &ndash; Monthly Progress Reports.</li>
                    <li>International Energy Agency (IEA) &ndash; World Energy Investment 2025: India Overview.</li>
                    <li>International Renewable Energy Agency (IRENA) &ndash; Renewable Capacity Statistics 2026.</li>
                    <li>Central Electricity Authority (CEA) &ndash; National Electricity Plan &amp; Generation Reports.</li>
                </ul>
                <p><em>Submitted for Environmental Studies CA1 Academic Assessment.</em></p>`
        };

        const show = (page) => {
            current = Math.min(Math.max(page, 1), total);
            const pageTitle = select.options[current - 1] ? select.options[current - 1].textContent : `Page ${current}`;

            image.onerror = () => {
                image.alt = `Failed to load preview for ${pageTitle}. Please use the "Download Report (DOCX)" button above to view the complete document.`;
            };
            image.onload = () => {
                image.alt = `CA1 Report: ${pageTitle}`;
            };

            image.src = `assets/report/page_${current}.svg`;
            label.textContent = `Page ${current} of ${total}`;
            select.value = String(current);
            prev.disabled = current === 1;
            next.disabled = current === total;

            if (accessibleContent && pageDigests[current]) {
                accessibleContent.innerHTML = pageDigests[current];
            }

            // Preload adjacent pages for seamless navigation
            preload(current + 1);
            preload(current - 1);
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
