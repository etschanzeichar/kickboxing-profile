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

        getTranslatedContent(card) {
            const achievementId = card.dataset.achievement;
            const lang = LanguageSwitcher.currentLang;
            const translations = LanguageSwitcher.translations.de;

            if (lang === 'de' && achievementId) {
                return {
                    category: translations[`achievements.${achievementId}.category`] || card.dataset.category,
                    title: translations[`achievements.${achievementId}.title`] || card.dataset.title,
                    location: translations[`achievements.${achievementId}.location`] || card.dataset.location,
                    result: translations[`achievements.${achievementId}.result`] || card.dataset.result,
                    description: translations[`achievements.${achievementId}.description`] || card.dataset.description,
                    quote: translations[`achievements.${achievementId}.quote`] || card.dataset.quote
                };
            }

            return {
                category: card.dataset.category,
                title: card.dataset.title,
                location: card.dataset.location,
                result: card.dataset.result,
                description: card.dataset.description,
                quote: card.dataset.quote
            };
        },

        init() {
            const closeBtn = document.getElementById('modalClose');
            const carousel = document.querySelector('.achievements-carousel');

            Modal.setup(this.modal, { closeButton: closeBtn });

            // Event delegation for card clicks
            if (carousel) {
                carousel.addEventListener('click', (e) => {
                    const card = e.target.closest('.achievement-card');
                    if (!card) return;

                    const content = this.getTranslatedContent(card);

                    document.getElementById('modalCategory').textContent = content.category;
                    document.getElementById('modalTitle').textContent = content.title;
                    document.getElementById('modalLocation').textContent = content.location;
                    document.getElementById('modalResult').textContent = content.result;
                    document.getElementById('modalDescription').textContent = content.description;

                    const quoteEl = document.getElementById('modalQuote');
                    if (content.quote) {
                        quoteEl.textContent = '"' + content.quote + '"';
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
    // Language Switcher Module
    // ============================================
    const LanguageSwitcher = {
        currentLang: 'en',
        toggle: null,
        translations: {
            de: {
                // Navigation
                'nav.about': 'Über mich',
                'nav.achievements': 'Erfolge',
                'nav.journey': 'Mein Weg',
                'nav.contacts': 'Kontakt',
                'nav.partner': 'Partner werden',

                // Hero
                'hero.tagline': 'Junge, aufstrebende Kickboxerin aus der Schweiz mit internationalen Erfolgen – ein Symbol für Talent, Disziplin und Ambition auf internationaler Ebene.',
                'hero.badge.european': 'Europameisterin',
                'hero.badge.swiss': '2x Schweizer Meisterin',
                'hero.badge.national': 'Nationalmannschaft',
                'hero.cta': 'Sponsor werden',

                // About
                'about.title': 'Über Eva Tschanz-Eichar',
                'about.text': 'Beständigkeit, persönliches Wachstum, Lebensfreude sowie Respekt und Freundlichkeit gegenüber anderen stehen für mich an erster Stelle.',
                'about.age': 'Alter',
                'about.age.value': '17 Jahre',
                'about.nationality': 'Nationalität',
                'about.nationality.value': 'Schweiz & Kanada',
                'about.location': 'Standort',
                'about.location.value': 'Bern, Schweiz',
                'about.discipline': 'Disziplin',
                'about.gym': 'Gym',
                'about.competing': 'Teilnahme an Wettkämpfen seit',
                'about.cta': '→ Kontakt aufnehmen',

                // Achievements
                'achievements.title': 'Erfolge',
                'achievements.euro.category': 'Europameisterschaft',
                'achievements.euro.result': '3 Kämpfe, 3 Siege --> Goldmedaille',
                'achievements.euro.preview': '9 Teilnehmerinnen in der Kategorie. Jeden Kampf dominiert und den Europatitel nach intensiver Vorbereitung geholt.',
                'achievements.cups.category': 'Internationale Wettkämpfe',
                'achievements.cups.result': 'Mehrere Goldmedaillen & Wachstum',
                'achievements.cups.preview': 'Sarajevo: Erste internationale Goldmedaille | Budapest: Dominanter Sieg | Antalya: TKO-Sieg, Kampf gegen Weltmeisterin | Jesolo: Lernerfahrung - Motivation zur Verbesserung',
                'achievements.swiss.category': 'Schweizer Meisterschaften',
                'achievements.swiss.result': 'Nationale Meisterin (WAKO & SCOS)',
                'achievements.swiss.location': 'Schweiz',
                'achievements.swiss.preview': 'WAKO: Dominanter Sieg auf nationaler Ebene | SCOS: Nach einem Jahr Qualifikationen fast alle gewonnen und einen klaren Sieg im Finale errungen',
                'achievements.expand': 'Klicken für mehr →',

                // Achievement modal content
                'achievements.euro.title': 'Europameisterschaft 2025',
                'achievements.euro.location': 'Jesolo, Italien',
                'achievements.euro.description': '9 Teilnehmerinnen in der Kategorie. Jeden Kampf dominiert und den Titel geholt.',
                'achievements.euro.quote': 'Ich habe den ganzen Sommer für diesen Wettkampf trainiert. Ich bin nicht in die Ferien gefahren, sondern zu Hause geblieben und habe mehrmals am Tag trainiert. Ich habe mich stark auf meine Ernährung und Gesundheit konzentriert, alles gegeben und am Ende gewonnen.',

                'achievements.cups.title': 'Internationale Wettkämpfe 2025',
                'achievements.cups.location': 'Sarajevo, Ungarn, Türkei, Italien',
                'achievements.cups.description': 'European Cup Grand Prix (Sarajevo): Zwei harte Kämpfe im Turniers, gewann meine erste Goldmedaille in einem internationalen Wettkampf.\n\nWeltcup Ungarn (Budapest): Dominanter Sieg gegen eine erfahrene Gegnerin, technische Überlegenheit und Kampfintelligenz gezeigt.\n\nWeltcup Türkei (Antalya): Ersten Kampf durch TKO gewonnen. Zweiten Kampf gegen dieselbe Gegnerin aus Italien verloren - eine Weltmeisterin und Europameisterin, die selten verliert. Diese Niederlage hat noch mehr Feuer entfacht, härter zu arbeiten. Ziel: 2026 gegen sie gewinnen.\n\nInternational Open (Jesolo): Meinen ersten internationalen Kampf nach Punkten verloren. Eine harte Lernerfahrung, die zur Motivation für Verbesserungen wurde.',

                'achievements.swiss.title': 'Schweizer Meisterschaften 2024',
                'achievements.swiss.description': 'WAKO Meisterschaften: Die Konkurrenz bei den Schweizer WAKO Meisterschaften dominiert, gute Technik und Kondition gezeigt.\n\nSCOS Meisterschaften: Nach einem ganzen Jahr Qualifikationen, die meisten davon gewonnen, qualifizierte ich mich fürs Finale. Erziehlte einen klaren Sieg in den Meisterschaftsfinals.',

                // Timeline
                'timeline.title': 'Der Weg nach vorne',
                'timeline.section1': 'Die bisherige Reise',
                'timeline.section1.sub': '2021 - 2025',
                'timeline.section2': '2026 Ziele',
                'timeline.section2.sub': 'Nächstes Kapitel',
                'timeline.section3': 'Langfristige Vision',
                'timeline.section3.sub': 'Der Traum',
                'timeline.hint': 'Klicke auf einen Abschnitt zum Vergrössern',

                // Budget
                'budget.title': 'Investitionsübersicht',
                'budget.subtitle': 'Ein transparenter Einblick in das, was es braucht, um auf höchstem Niveau im Kickboxen zu konkurrieren',
                'budget.training': 'Training & Coaching',
                'budget.training.desc': 'Mitgliedschaften, professionelles Athletiktraining',
                'budget.competition': 'Wettkampf & Reisen',
                'budget.competition.desc': 'Startgebühren, Flüge, Unterkunft für internationale Events',
                'budget.equipment': 'Ausrüstung',
                'budget.equipment.desc': 'Handschuhe, Schutzausrüstung, Trainingskleidung, Wettkampfkleidung',
                'budget.nutrition': 'Ernährung',
                'budget.nutrition.desc': 'Spezialisierter Ernährungsplan, Nahrungsergänzungsmittel',
                'budget.camps': 'Trainingscamps',
                'budget.camps.desc': 'Intensive Vorbereitungscamps mit Spitzentrainern im Ausland',
                'budget.total': 'Jährliche Investition',
                'budget.summary.title': 'Wohin deine Unterstützung geht',
                'budget.summary.text1': 'Jeder Franken wird direkt in Training, Wettkampf und Entwicklung investiert. Als Amateursportlerin balance ich meine sportliche Karriere mit Studium und Arbeit und widme jede verfügbare Ressource dem Ziel, die Spitze meines Sports zu erreichen.',
                'budget.summary.text2': 'Dein Sponsoring hilft, diese wesentlichen Kosten zu decken, damit ich mich auf das Wichtigste konzentrieren kann: die beste Kickboxerin zu werden, die ich sein kann, und die Schweiz auf der Weltbühne zu vertreten.',
                'budget.cta': '→ Sponsoring besprechen',

                // Education
                'education.title': 'Ausbildung & Ziele',
                'education.text1': 'Ausserhalb des Rings besuche ich das Sportgymnasium Neufeld in Bern mit dem Ziel, professionelle Kickboxerin zu werden, mit dem langfristigen Ziel, an den Olympischen Spielen teilzunehmen und Kämpferin in der Weltklasse-Kampforganisation ONE Championship zu werden.',
                'education.text2': 'Neben meinen sportlichen Ambitionen interessiere ich mich für ein Studium in Informatik oder Ingenieurwesen.',
                'education.text3': 'Ich habe den Schweizer J+S Leiterkurs abgeschlossen und trainiere Kinderkurse in meinem Gym.',
                'education.text4': 'Als Vorbild für junge Mädchen im Kampfsport möchte ich sie inspirieren, ihren eigenen Weg zu gehen und durch Disziplin und harte Arbeit Selbstvertrauen zu gewinnen.',

                // Kickboxing
                'kickboxing.title': 'K1 Kickboxen',
                'kickboxing.text1': 'K1 Kickboxen ist eine der intensivsten Schlagkampfsportarten der Welt, die Techniken aus Muay Thai, Karate und westlichem Boxen zu einem schnellen, explosiven Kampfsport kombiniert.',
                'kickboxing.text2': 'Kämpfer nutzen Schläge, Tritte und Kniestösse, um Punkte zu sammeln oder Knockouts zu erzielen. Anders als bei Muay Thai sind Ellbogen nicht erlaubt und Clinchen ist begrenzt, was den Fokus auf dynamische Schlagaustausche legt.',
                'kickboxing.text3': 'Kämpfe bestehen aus drei 3-Minuten-Runden für Profis oder drei 2-Minuten-Runden für Amateure. Der Sieg kann durch Knockout, technischen Knockout (3 Niederschläge in einer Runde) oder Punktrichterentscheidung basierend auf effektiven Treffern, Schaden und Aggressivität erreicht werden.',
                'kickboxing.text4': 'K1 ist zu einem globalen Phänomen gewachsen mit grossen internationalen Wettkämpfen wie Europameisterschaften, Weltcups und Weltmeisterschaften, organisiert von Verbänden wie WAKO (World Association of Kickboxing Organizations).',

                // Values
                'values.title': 'Wofür ich stehe',
                'values.text': 'Diese Grundwerte leiten alles, was ich tue - von frühmorgendlichen Trainingseinheiten bis hin zu Wettkämpfen auf internationaler Bühne. Sie prägen, wer ich als Sportlerin und als Mensch bin.',
                'values.consistency': 'Beständigkeit',
                'values.consistency.desc': 'Jeden Tag erscheinen, die Arbeit investieren und dem Prozess vertrauen',
                'values.growth': 'Wachstum',
                'values.growth.desc': 'Die beste Version meiner selbst werden, Tag für Tag',
                'values.respect': 'Respekt',
                'values.respect.desc': 'Jeden mit Freundlichkeit behandeln, im Ring und ausserhalb',
                'values.inspiration': 'Inspiration',
                'values.inspiration.desc': 'Ein Vorbild für junge Sportler sein, besonders für Mädchen im Kampfsport',

                // Sponsorship
                'sponsorship.title': 'Partner einer Meisterin werden',
                'sponsorship.intro': 'Eine Investition in Eva verbindet deine Marke mit Beständigkeit, Wachstum, Respekt und Inspiration — die Grundlage wahrer Exzellenz.',
                'sponsorship.content': 'Authentischer Content',
                'sponsorship.content.desc': 'Wirkungsvoller Content aus Training, Wettkampf und dem täglichen Kampfleben',
                'sponsorship.visibility': 'Markensichtbarkeit',
                'sponsorship.visibility.desc': 'Starke Präsenz bei nationalen und internationalen K1- und Kickbox-Events',
                'sponsorship.representation': 'Konstante Repräsentation',
                'sponsorship.representation.desc': 'Vertretung deiner Marke in Training, Medien und auf sozialen Plattformen',
                'sponsorship.ambassador': 'Inspirierende Botschafterin',
                'sponsorship.ambassador.desc': 'Eine motivierte junge Athletin, die andere durch Kampfsport inspiriert',
                'sponsorship.cta': '→ Sponsor werden',

                // Partners
                'partners.title': 'Aktuelle Partner',
                'partners.edubily.desc': 'Erstellung von ansprechendem Content zur Unterstützung ihrer Marke durch authentische, hochwertige Inhalte aus meiner sportlichen Reise.',
                'partners.edubily.role': 'Content Creator',
                'partners.mcdonalds.desc': 'Stolze Partnerschaft durch Sporthilfe, sie unterstützen meine sportliche Reise und ich halte während der Saison engen Kontakt.',
                'partners.mcdonalds.role': 'Athletenpartnerschaft via Sporthilfe',

                // Contact
                'contact.title': 'Lass uns verbinden',
                'contact.text': 'Interesse an Sponsoring-Möglichkeiten, Medienanfragen oder Zusammenarbeit? Melde dich und lass uns besprechen, wie wir zusammenarbeiten können.',
                'contact.email': 'E-Mail',

                // Footer
                'footer.subtitle': 'Schweizer Kickbox-Meisterin',
                'footer.timeline': 'Zeitachse',
                'footer.education': 'Ausbildung',
                'footer.values': 'Werte',
                'footer.sponsorship': 'Sponsoring',
                'footer.partners': 'Partner',
                'footer.contact': 'Kontakt'
            }
        },
        originalTexts: {},

        init() {
            this.toggle = document.getElementById('langToggle');
            if (!this.toggle) return;

            // Store original English texts
            this.storeOriginalTexts();

            // Check for saved preference
            const savedLang = localStorage.getItem('preferredLanguage');
            if (savedLang === 'de') {
                this.toggle.checked = true;
                this.switchLanguage('de');
            }

            // Listen for toggle changes
            this.toggle.addEventListener('change', () => {
                const newLang = this.toggle.checked ? 'de' : 'en';
                this.switchLanguage(newLang);
                localStorage.setItem('preferredLanguage', newLang);
            });
        },

        storeOriginalTexts() {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                this.originalTexts[key] = el.textContent;
            });
        },

        switchLanguage(lang) {
            this.currentLang = lang;

            // Update label styling
            document.querySelector('.lang-en').classList.toggle('active', lang === 'en');
            document.querySelector('.lang-de').classList.toggle('active', lang === 'de');

            // Update all translatable elements
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (lang === 'de' && this.translations.de[key]) {
                    el.textContent = this.translations.de[key];
                } else if (lang === 'en' && this.originalTexts[key]) {
                    el.textContent = this.originalTexts[key];
                }
            });

            // Update HTML lang attribute
            document.documentElement.lang = lang;
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
        LanguageSwitcher.init();
    }

    // Run initialization
    init();

    // ============================================
    // Public API (exposed to global scope)
    // ============================================
    window.printPortfolio = () => window.print();

})();
