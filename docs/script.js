/**
 * TEKBOT 2025 - Advanced Interactive Documentation
 * Revolutionary JavaScript for Modern User Experience
 */

class TekbotDocumentation {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.isSearchOpen = false;
        this.isSidebarOpen = false;
        this.currentMarkdownFile = null;
        this.searchIndex = [];
        this.observers = new Map();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.createSearchIndex();
        this.setupIntersectionObservers();
        this.initializeAnimations();
        this.handleLoading();
        
        // Initialize after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.postInit());
        } else {
            this.postInit();
        }
    }

    postInit() {
        this.setupScrollEffects();
        this.initializeParticles();
        setTimeout(() => this.removeLoadingScreen(), 2000);
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Menu toggle
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Search toggle
        const searchToggle = document.getElementById('searchToggle');
        if (searchToggle) {
            searchToggle.addEventListener('click', () => this.toggleSearch());
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchClose = document.getElementById('searchClose');
        const searchOverlay = document.getElementById('searchOverlay');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeSearch();
            });
        }

        if (searchClose) {
            searchClose.addEventListener('click', () => this.closeSearch());
        }

        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) this.closeSearch();
            });
        }

        // Sidebar controls
        const sidebarClose = document.getElementById('sidebarClose');
        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => this.closeSidebar());
        }

        // Domain toggles
        document.addEventListener('click', (e) => {
            if (e.target.closest('.domain-toggle')) {
                e.preventDefault();
                this.toggleDomain(e.target.closest('.domain-toggle'));
            }
        });

        // Navigation links
        document.addEventListener('click', (e) => {
            const markdownLink = e.target.closest('.markdown-link');
            const navLink = e.target.closest('.nav-link');
            
            if (markdownLink) {
                e.preventDefault();
                const filePath = markdownLink.getAttribute('data-file');
                if (filePath) {
                    this.loadMarkdownFile(filePath);
                    this.updateActiveNavItem(markdownLink);
                }
            } else if (navLink && navLink.getAttribute('href')?.startsWith('#')) {
                e.preventDefault();
                const target = navLink.getAttribute('href').substring(1);
                this.scrollToSection(target);
                this.updateActiveNavItem(navLink);
                if (window.innerWidth <= 768) {
                    this.closeSidebar();
                }
            }
        });

        // CTA buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.cta-button')) {
                const btn = e.target.closest('.cta-button');
                this.animateButton(btn);
            }
        });

        // Back button
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', () => this.showMainContent());
        }

        // Scroll to top
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => this.scrollToTop());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Window resize
        window.addEventListener('resize', () => this.handleResize());

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());
    }

    initializeTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('#themeToggle i');
        
        if (this.currentTheme === 'dark') {
            body.classList.add('dark-theme');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        } else {
            body.classList.remove('dark-theme');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
        }
    }

    toggleTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('#themeToggle i');
        
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            this.currentTheme = 'light';
            if (themeIcon) themeIcon.className = 'fas fa-moon';
        } else {
            body.classList.add('dark-theme');
            this.currentTheme = 'dark';
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        }
        
        localStorage.setItem('theme', this.currentTheme);
        this.animateThemeTransition();
    }

    animateThemeTransition() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${this.currentTheme === 'dark' ? '#111827' : '#ffffff'};
            z-index: 10001;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '0.8';
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => document.body.removeChild(overlay), 300);
            }, 150);
        }, 10);
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
        const sidebar = document.getElementById('sidebar');
        
        if (sidebar) {
            if (this.isSidebarOpen) {
                sidebar.classList.add('active');
                this.createOverlay();
            } else {
                sidebar.classList.remove('active');
                this.removeOverlay();
            }
        }
    }

    closeSidebar() {
        this.isSidebarOpen = false;
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
            this.removeOverlay();
        }
    }

    createOverlay() {
        if (document.querySelector('.page-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'page-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 899;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => overlay.style.opacity = '1', 10);
        
        overlay.addEventListener('click', () => this.closeSidebar());
    }

    removeOverlay() {
        const overlay = document.querySelector('.page-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }

    toggleSearch() {
        this.isSearchOpen = !this.isSearchOpen;
        const searchOverlay = document.getElementById('searchOverlay');
        const searchInput = document.getElementById('searchInput');
        
        if (searchOverlay) {
            if (this.isSearchOpen) {
                searchOverlay.classList.add('active');
                setTimeout(() => {
                    if (searchInput) searchInput.focus();
                }, 300);
            } else {
                searchOverlay.classList.remove('active');
            }
        }
    }

    closeSearch() {
        this.isSearchOpen = false;
        const searchOverlay = document.getElementById('searchOverlay');
        if (searchOverlay) {
            searchOverlay.classList.remove('active');
        }
    }

    createSearchIndex() {
        // Create a searchable index of all content
        const navLinks = document.querySelectorAll('.markdown-link');
        
        navLinks.forEach(link => {
            const title = link.textContent.trim();
            const file = link.getAttribute('data-file');
            const section = this.getSection(link);
            
            if (title && file) {
                this.searchIndex.push({
                    title,
                    file,
                    section,
                    element: link
                });
            }
        });
    }

    getSection(element) {
        const weekSection = element.closest('.week-section');
        if (weekSection) {
            const weekTitle = weekSection.querySelector('.week-header h3');
            const domainSection = element.closest('.domain-section');
            if (domainSection) {
                const domainName = domainSection.querySelector('.domain-name');
                return `${weekTitle?.textContent} - ${domainName?.textContent}`;
            }
            return weekTitle?.textContent || 'Unknown';
        }
        return 'Navigation';
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.clearSearchResults();
            return;
        }

        const results = this.searchIndex.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.section.toLowerCase().includes(query.toLowerCase())
        );

        this.displaySearchResults(results, query);
    }

    displaySearchResults(results, query) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Aucun résultat pour "${query}"</p>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map(result => `
            <div class="search-result" data-file="${result.file}">
                <div class="result-title">${this.highlightQuery(result.title, query)}</div>
                <div class="result-section">${result.section}</div>
            </div>
        `).join('');

        resultsContainer.innerHTML = resultsHTML;

        // Add click handlers to results
        resultsContainer.querySelectorAll('.search-result').forEach(result => {
            result.addEventListener('click', () => {
                const file = result.getAttribute('data-file');
                this.loadMarkdownFile(file);
                this.closeSearch();
            });
        });
    }

    highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    clearSearchResults() {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
    }

    toggleDomain(toggleElement) {
        const domainId = toggleElement.getAttribute('data-domain');
        const content = document.getElementById(domainId);
        const expandIcon = toggleElement.querySelector('.expand-icon');
        
        if (!content) return;

        const isExpanded = content.classList.contains('expanded');
        
        if (isExpanded) {
            content.classList.remove('expanded');
            content.classList.add('collapsed');
            expandIcon.style.transform = 'rotate(0deg)';
            toggleElement.classList.remove('expanded');
        } else {
            content.classList.remove('collapsed');
            content.classList.add('expanded');
            expandIcon.style.transform = 'rotate(90deg)';
            toggleElement.classList.add('expanded');
        }

        // Animate the content height
        this.animateHeight(content, isExpanded);
    }

    animateHeight(element, isCollapsing) {
        if (isCollapsing) {
            element.style.maxHeight = element.scrollHeight + 'px';
            setTimeout(() => {
                element.style.maxHeight = '0';
            }, 10);
        } else {
            element.style.maxHeight = element.scrollHeight + 'px';
            setTimeout(() => {
                element.style.maxHeight = '500px';
            }, 500);
        }
    }

    async loadMarkdownFile(filePath) {
        if (!filePath) return;

        this.showLoadingState();
        
        try {
            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error(`Could not load file: ${filePath}`);
            }
            
            const markdownText = await response.text();
            const htmlContent = await this.convertMarkdownToHTML(markdownText);
            
            this.displayMarkdownContent(htmlContent);
            this.currentMarkdownFile = filePath;
            
            // Update URL without page reload
            history.pushState({ file: filePath }, '', `#doc-${filePath.replace(/[^a-zA-Z0-9]/g, '-')}`);
            
        } catch (error) {
            console.error('Error loading markdown file:', error);
            this.showErrorMessage(filePath, error.message);
        }
    }

    async convertMarkdownToHTML(markdown) {
        if (typeof marked !== 'undefined') {
            // Configure marked options
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: true,
                mangle: false
            });
            
            return marked.parse(markdown);
        }
        
        // Fallback simple markdown conversion
        return this.simpleMarkdownToHTML(markdown);
    }

    simpleMarkdownToHTML(markdown) {
        return markdown
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/\n/gim, '<br>');
    }

    displayMarkdownContent(htmlContent) {
        const container = document.getElementById('markdownContainer');
        const content = document.getElementById('markdownContent');
        
        if (!container || !content) return;

        content.innerHTML = `
            <div class="markdown-wrapper">
                ${htmlContent}
            </div>
        `;

        container.classList.add('active');
        this.hideMainContent();
        
        // Initialize syntax highlighting and diagrams
        this.initializeContentFeatures();
        
        // Smooth scroll to top
        container.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async initializeContentFeatures() {
        // Initialize Mermaid diagrams
        if (typeof mermaid !== 'undefined') {
            try {
                await mermaid.run();
            } catch (error) {
                console.warn('Mermaid initialization failed:', error);
            }
        }

        // Add copy buttons to code blocks
        this.addCodeCopyButtons();
        
        // Add zoom functionality to images
        this.addImageZoom();
        
        // Add table responsiveness
        this.makeTablesResponsive();
    }

    addCodeCopyButtons() {
        const codeBlocks = document.querySelectorAll('.markdown-content pre code');
        
        codeBlocks.forEach(block => {
            const pre = block.parentElement;
            if (pre.querySelector('.copy-button')) return; // Already has button
            
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            copyButton.title = 'Copier le code';
            
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(block.textContent).then(() => {
                    copyButton.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                });
            });
            
            pre.style.position = 'relative';
            pre.appendChild(copyButton);
        });
    }

    addImageZoom() {
        const images = document.querySelectorAll('.markdown-content img');
        
        images.forEach(img => {
            img.addEventListener('click', () => this.showImageModal(img));
            img.style.cursor = 'zoom-in';
        });
    }

    showImageModal(img) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal-overlay">
                <img src="${img.src}" alt="${img.alt}" class="modal-image">
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .image-modal.active {
                opacity: 1;
            }
            .modal-image {
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 8px;
            }
            .modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                font-size: 1.5rem;
                padding: 10px;
                border-radius: 50%;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
            .modal-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Close handlers
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }, 300);
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.className === 'image-modal-overlay') {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    }

    makeTablesResponsive() {
        const tables = document.querySelectorAll('.markdown-content table');
        
        tables.forEach(table => {
            if (!table.parentElement.classList.contains('table-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-wrapper';
                wrapper.style.cssText = 'overflow-x: auto; margin: 1rem 0;';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
    }

    showMainContent() {
        const container = document.getElementById('markdownContainer');
        const mainContent = document.getElementById('mainContent');
        
        if (container) {
            container.classList.remove('active');
        }
        
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        this.currentMarkdownFile = null;
        
        // Update URL
        history.pushState({}, '', window.location.pathname);
        
        // Update active nav item to home
        this.updateActiveNavItem(document.querySelector('a[href="#accueil"]'));
    }

    hideMainContent() {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
    }

    showLoadingState() {
        const content = document.getElementById('markdownContent');
        if (content) {
            content.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <p>Chargement du document...</p>
                </div>
            `;
        }
    }

    showErrorMessage(filePath, errorMessage) {
        const container = document.getElementById('markdownContainer');
        const content = document.getElementById('markdownContent');
        
        if (!container || !content) return;

        content.innerHTML = `
            <div class="error-message">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2>Erreur de chargement</h2>
                <p><strong>Fichier :</strong> ${filePath}</p>
                <p><strong>Erreur :</strong> ${errorMessage}</p>
                <button class="retry-button" onclick="tekbot.loadMarkdownFile('${filePath}')">
                    <i class="fas fa-redo"></i>
                    Réessayer
                </button>
            </div>
        `;

        container.classList.add('active');
        this.hideMainContent();
    }

    updateActiveNavItem(activeElement) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-link.active').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        if (activeElement) {
            activeElement.classList.add('active');
        }
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = 70; // Top nav height
            const elementPosition = element.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    handleScroll() {
        const scrollY = window.pageYOffset;
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        
        // Show/hide scroll to top button
        if (scrollTopBtn) {
            if (scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
        
        // Parallax effect for hero background
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground && scrollY < window.innerHeight) {
            heroBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
        
        // Update navigation based on scroll position
        this.updateScrollNavigation();
    }

    updateScrollNavigation() {
        const sections = document.querySelectorAll('.content-section');
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            if (section.offsetTop <= scrollPosition && 
                (section.offsetTop + section.offsetHeight) > scrollPosition) {
                
                const sectionId = section.id;
                const navLink = document.querySelector(`a[href="#${sectionId}"]`);
                
                if (navLink && !navLink.classList.contains('active')) {
                    this.updateActiveNavItem(navLink);
                }
            }
        });
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.toggleSearch();
        }
        
        // Escape to close overlays
        if (e.key === 'Escape') {
            if (this.isSearchOpen) {
                this.closeSearch();
            } else if (this.isSidebarOpen) {
                this.closeSidebar();
            } else if (this.currentMarkdownFile) {
                this.showMainContent();
            }
        }
        
        // Arrow keys for navigation
        if (e.key === 'ArrowLeft' && e.altKey) {
            e.preventDefault();
            if (this.currentMarkdownFile) {
                this.showMainContent();
            }
        }
    }

    handleResize() {
        // Close sidebar on desktop resize
        if (window.innerWidth > 768 && this.isSidebarOpen) {
            this.closeSidebar();
        }
        
        // Recalculate animations
        this.updateAnimations();
    }

    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    initializeAnimations() {
        // Add entrance animations to elements
        const animatedElements = document.querySelectorAll('.hero-content > *, .content-section > *');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => observer.observe(el));
    }

    setupScrollEffects() {
        // Smooth reveal animations
        const reveals = document.querySelectorAll('.team-card, .timeline-item, .highlight-item');
        
        reveals.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.transitionDelay = `${index * 0.1}s`;
        });
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        reveals.forEach(el => revealObserver.observe(el));
    }

    initializeParticles() {
        const particlesContainer = document.getElementById('particles-bg');
        if (!particlesContainer) return;
        
        // Create animated particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: linear-gradient(45deg, #6366f1, #ec4899);
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.1};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 20 + 10}s infinite ease-in-out;
                animation-delay: ${Math.random() * 10}s;
            `;
            
            particlesContainer.appendChild(particle);
        }
        
        // Add CSS for particle animation
        if (!document.querySelector('#particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                        opacity: 0.1;
                    }
                    50% {
                        transform: translateY(-100px) rotate(180deg);
                        opacity: 0.5;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupIntersectionObservers() {
        // Observe sections for active navigation updates
        const sections = document.querySelectorAll('.content-section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const navLink = document.querySelector(`a[href="#${id}"]`);
                    if (navLink) {
                        this.updateActiveNavItem(navLink);
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });
        
        sections.forEach(section => sectionObserver.observe(section));
    }

    updateAnimations() {
        // Update animations based on viewport
        const viewportWidth = window.innerWidth;
        const animations = document.querySelectorAll('[style*="animation"]');
        
        animations.forEach(element => {
            if (viewportWidth < 768) {
                // Reduce animations on mobile
                element.style.animationDuration = '0.5s';
            } else {
                // Full animations on desktop
                element.style.animationDuration = '';
            }
        });
    }

    handleLoading() {
        // Simulate loading progress
        const progressBar = document.querySelector('.loading-progress');
        if (progressBar) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                progressBar.style.width = `${progress}%`;
            }, 100);
        }
    }

    removeLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const body = document.body;
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                body.classList.remove('loading');
                body.classList.add('loaded');
            }, 500);
        }
    }
}

// Global utility functions
window.scrollToSection = function(sectionId) {
    if (window.tekbot) {
        window.tekbot.scrollToSection(sectionId);
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.tekbot = new TekbotDocumentation();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.file) {
        window.tekbot.loadMarkdownFile(e.state.file);
    } else {
        window.tekbot.showMainContent();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TekbotDocumentation;
}