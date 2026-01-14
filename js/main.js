/**
 * Eva Tschanz Portfolio - Main JavaScript
 * Organized into namespaces using IIFE pattern
 */
(function() {
    'use strict';

    // ============================================
    // Modal Utilities
    // ============================================
    const Modal = {
        /**
         * Close a modal by removing 'active' class and restoring body scroll
         * @param {HTMLElement} modalElement - The modal element to close
         */
        close(modalElement) {
            if (modalElement) {
                modalElement.classList.remove('active');
                document.body.style.overflow = '';
            }
        },

        /**
         * Open a modal by adding 'active' class and preventing body scroll
         * @param {HTMLElement} modalElement - The modal element to open
         */
        open(modalElement) {
            if (modalElement) {
                modalElement.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        },

        /**
         * Set up standard modal behavior (close on backdrop click, close button)
         * @param {HTMLElement} modalElement - The modal element
         * @param {Object} options - Configuration options
         * @param {HTMLElement} options.closeButton - Optional close button element
         * @param {HTMLElement} options.contentElement - Optional content element (clicks won't close modal)
         */
        setup(modalElement, options = {}) {
            if (!modalElement) return;

            // Close on backdrop click
            modalElement.addEventListener('click', (e) => {
                if (e.target === modalElement) {
                    Modal.close(modalElement);
                }
            });

            // Close button
            if (options.closeButton) {
                options.closeButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    Modal.close(modalElement);
                });
            }

            // Prevent clicks on content from closing modal
            if (options.contentElement) {
                options.contentElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        }
    };

    // ============================================
    // Navigation Module
    // ============================================
    const Navigation = {
        navbar: document.getElementById('navbar'),
        menuToggle: document.getElementById('menuToggle'),
        sidebarNav: document.getElementById('sidebarNav'),
        sidebarOverlay: document.getElementById('sidebarOverlay'),
        lastScrolled: false,

        init() {
            this.initNavbarScroll();
            this.initSidebar();
            this.initSmoothScroll();
        },

        initNavbarScroll() {
            window.addEventListener('scroll', () => {
                const isScrolled = window.scrollY > 100;
                if (isScrolled !== this.lastScrolled) {
                    this.navbar.classList.toggle('scrolled', isScrolled);
                    this.lastScrolled = isScrolled;
                }
            });
        },

        initSidebar() {
            this.menuToggle.addEventListener('click', () => {
                if (this.sidebarNav.classList.contains('active')) {
                    this.closeSidebar();
                } else {
                    this.openSidebar();
                }
            });

            // Close sidebar when clicking overlay
            this.sidebarOverlay.addEventListener('click', () => this.closeSidebar());

            // Close sidebar when clicking a link
            this.sidebarNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.closeSidebar());
            });
        },

        openSidebar() {
            this.menuToggle.classList.add('active');
            this.sidebarNav.classList.add('active');
            this.sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        },

        closeSidebar() {
            this.menuToggle.classList.remove('active');
            this.sidebarNav.classList.remove('active');
            this.sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        },

        initSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const href = anchor.getAttribute('href');
                    const target = document.querySelector(href);
                    if (target) {
                        const navbarHeight = this.navbar.offsetHeight;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                        window.scrollTo({
                            top: targetPosition - navbarHeight,
                            behavior: 'smooth'
                        });
                        history.pushState(null, null, href);
                    }
                });
            });
        },

        isSidebarActive() {
            return this.sidebarNav && this.sidebarNav.classList.contains('active');
        }
    };

    // ============================================
    // Scroll Effects Module
    // ============================================
    const ScrollEffects = {
        init() {
            const reveals = document.querySelectorAll('.reveal');

            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        // Stop observing once revealed (one-time animation)
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                // Trigger when element is 100px from bottom of viewport
                rootMargin: '0px 0px -100px 0px',
                threshold: 0
            });

            reveals.forEach(element => revealObserver.observe(element));
        }
    };

    // ============================================
    // Timeline Module
    // ============================================
    const Timeline = {
        container: null,
        currentSection: 1,
        totalSections: 3,

        init() {
            // SVG is now embedded in HTML, just setup interactions
            this.setupInteractions();
        },

        setupInteractions() {
            this.container = document.getElementById('timelineContainer');
            const zoomOutBtn = document.getElementById('timelineZoomOut');
            const sectionAreas = document.querySelectorAll('.timeline-section-area');
            const svg = document.querySelector('.timeline-svg');
            const navPrev = document.getElementById('timelineNavPrev');
            const navNext = document.getElementById('timelineNavNext');

            // Initialize zoom state for mobile
            if (this.isMobile()) {
                this.zoomToSection(1);
                this.container.classList.add('mobile-mode');
            }

            // Handle resize
            window.addEventListener('resize', () => {
                if (this.isMobile()) {
                    // On mobile, always stay zoomed
                    if (!this.container.classList.contains('zoomed')) {
                        this.zoomToSection(1);
                    }
                    this.container.classList.add('mobile-mode');
                } else {
                    // On desktop, zoom out if in mobile mode
                    if (this.container.classList.contains('mobile-mode')) {
                        this.zoomOut();
                        this.container.classList.remove('mobile-mode');
                    }
                }
            });

            // Section click handlers (desktop only)
            sectionAreas.forEach(section => {
                section.addEventListener('click', (e) => {
                    if (this.isMobile()) return;
                    e.stopPropagation();
                    this.zoomToSection(section.dataset.section);
                });
            });

            // Zoom controls
            zoomOutBtn.addEventListener('click', () => this.zoomOut());

            navPrev.addEventListener('click', () => {
                if (this.currentSection > 1) {
                    this.zoomToSection(this.currentSection - 1);
                }
            });

            navNext.addEventListener('click', () => {
                if (this.currentSection < this.totalSections) {
                    this.zoomToSection(this.currentSection + 1);
                }
            });

            // Click on SVG to zoom out (desktop only)
            if (svg) {
                svg.addEventListener('click', (e) => {
                    if (this.isMobile()) return;
                    if (this.container.classList.contains('zoomed') && !e.target.closest('.timeline-section-area')) {
                        this.zoomOut();
                    }
                });
            }

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                // On mobile, always allow arrow navigation
                // On desktop, only when zoomed
                if (!this.isMobile() && !this.container.classList.contains('zoomed')) return;

                if (e.key === 'ArrowLeft' && this.currentSection > 1) {
                    this.zoomToSection(this.currentSection - 1);
                } else if (e.key === 'ArrowRight' && this.currentSection < this.totalSections) {
                    this.zoomToSection(this.currentSection + 1);
                }
            });
        },

        isMobile() {
            return window.innerWidth <= 768;
        },

        zoomToSection(sectionNum) {
            this.currentSection = parseInt(sectionNum, 10);
            this.container.classList.remove('zoom-section-1', 'zoom-section-2', 'zoom-section-3');
            this.container.classList.add('zoomed', `zoom-section-${sectionNum}`);
            this.updateNavButtons();
        },

        zoomOut() {
            if (this.isMobile()) return;
            this.container.classList.remove('zoomed', 'zoom-section-1', 'zoom-section-2', 'zoom-section-3');
            this.updateNavButtons();
        },

        updateNavButtons() {
            const navPrev = document.getElementById('timelineNavPrev');
            const navNext = document.getElementById('timelineNavNext');
            navPrev.disabled = this.currentSection <= 1;
            navNext.disabled = this.currentSection >= this.totalSections;
        },

        isZoomed() {
            return this.container && this.container.classList.contains('zoomed');
        }
    };

    // ============================================
    // Achievement Modal Module
    // ============================================
    const AchievementModal = {
        modal: document.getElementById('achievementModal'),

        init() {
            const closeBtn = document.getElementById('modalClose');
            const carousel = document.querySelector('.achievements-carousel');

            Modal.setup(this.modal, { closeButton: closeBtn });

            // Event delegation for card clicks
            if (carousel) {
                carousel.addEventListener('click', (e) => {
                    const card = e.target.closest('.achievement-card');
                    if (!card) return;

                    document.getElementById('modalCategory').textContent = card.dataset.category;
                    document.getElementById('modalTitle').textContent = card.dataset.title;
                    document.getElementById('modalLocation').textContent = card.dataset.location;
                    document.getElementById('modalResult').textContent = card.dataset.result;
                    document.getElementById('modalDescription').textContent = card.dataset.description;

                    const quoteEl = document.getElementById('modalQuote');
                    if (card.dataset.quote) {
                        quoteEl.textContent = '"' + card.dataset.quote + '"';
                        quoteEl.style.display = 'block';
                    } else {
                        quoteEl.style.display = 'none';
                    }

                    Modal.open(this.modal);
                });
            }
        },

        isActive() {
            return this.modal && this.modal.classList.contains('active');
        }
    };

    // ============================================
    // Partner Modal Module
    // ============================================
    const PartnerModal = {
        modal: document.getElementById('partnerModal'),
        content: document.getElementById('partnerModalContent'),

        init() {
            const closeBtn = document.querySelector('.partner-modal-close');
            const grid = document.querySelector('.partners-grid');

            Modal.setup(this.modal, {
                closeButton: closeBtn,
                contentElement: this.content
            });

            // Event delegation for card clicks
            if (grid) {
                grid.addEventListener('click', (e) => {
                    const card = e.target.closest('.partner-card');
                    if (!card) return;

                    const cardClone = card.cloneNode(true);
                    this.content.innerHTML = '';
                    this.content.appendChild(cardClone);
                    Modal.open(this.modal);
                });
            }
        },

        isActive() {
            return this.modal && this.modal.classList.contains('active');
        }
    };

    // ============================================
    // Keyboard Handler Module
    // ============================================
    const KeyboardHandler = {
        init() {
            document.addEventListener('keydown', (e) => {
                if (e.key !== 'Escape') return;

                // Check modals in order of priority
                if (AchievementModal.isActive()) {
                    Modal.close(AchievementModal.modal);
                } else if (PartnerModal.isActive()) {
                    Modal.close(PartnerModal.modal);
                } else if (Navigation.isSidebarActive()) {
                    Navigation.closeSidebar();
                } else if (Timeline.isZoomed()) {
                    Timeline.zoomOut();
                }
            });
        }
    };

    // ============================================
    // Initialize All Modules
    // ============================================
    function init() {
        Navigation.init();
        ScrollEffects.init();
        Timeline.init();
        AchievementModal.init();
        PartnerModal.init();
        KeyboardHandler.init();
    }

    // Run initialization
    init();

    // ============================================
    // Public API (exposed to global scope)
    // ============================================
    window.printPortfolio = () => window.print();

})();
