document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const header = document.querySelector('header');
    
    function openMobileMenu() {
        mobileNav.classList.add('active');
        mobileMenuToggle.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    function closeMobileMenu() {
        mobileNav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    mobileMenuToggle.addEventListener('click', openMobileMenu);
    
    // Close mobile menu when clicking on close button
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileMenu);
    }
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenuToggle.contains(event.target) && !mobileNav.contains(event.target)) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Header blur on scroll
    const SCROLL_THRESHOLD = 20;
    function updateHeaderOnScroll() {
        if (!header) return;
        if (window.scrollY > SCROLL_THRESHOLD) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    updateHeaderOnScroll();
    window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
    
    // Lightbox gallery for About Us page
    const galleryImages = document.querySelectorAll('.about-us-page .lightbox-trigger');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    let currentImageIndex = 0;
    let startX = 0;
    let currentX = 0;

    function openLightbox(src, alt) {
        if (!lightboxOverlay || !lightboxImage) return;
        lightboxImage.src = src;
        lightboxImage.alt = alt || '';
        currentImageIndex = Array.from(galleryImages).findIndex(img => img.src === src);
        lightboxOverlay.classList.add('open');
        lightboxOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightboxOverlay || !lightboxImage) return;
        lightboxOverlay.classList.remove('open');
        lightboxOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Delay clearing src to avoid flash
        setTimeout(() => { lightboxImage.src = ''; }, 150);
    }

    function showImage(index) {
        if (index < 0) index = galleryImages.length - 1;
        if (index >= galleryImages.length) index = 0;
        currentImageIndex = index;
        const img = galleryImages[currentImageIndex];
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt || '';
    }

    function nextImage() {
        showImage(currentImageIndex + 1);
    }

    function prevImage() {
        showImage(currentImageIndex - 1);
    }

    galleryImages.forEach(img => {
        img.style.cursor = 'default';
        img.addEventListener('click', () => openLightbox(img.src, img.alt));
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(img.src, img.alt);
            }
        });
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', 'Open image');
    });

    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                closeLightbox();
            }
        });
    }

    // Touch events for swipe navigation on the image content
    const lightboxContent = document.querySelector('.lightbox-content');
    if (lightboxContent) {
        lightboxContent.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        lightboxContent.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
        });

        lightboxContent.addEventListener('touchend', (e) => {
            const diffX = startX - currentX;
            const threshold = 50; // minimum swipe distance

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    // Swipe left - next image
                    nextImage();
                } else {
                    // Swipe right - previous image
                    prevImage();
                }
            }
        });
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxOverlay && lightboxOverlay.classList.contains('open')) {
            closeLightbox();
        } else if (e.key === 'ArrowLeft' && lightboxOverlay && lightboxOverlay.classList.contains('open')) {
            prevImage();
        } else if (e.key === 'ArrowRight' && lightboxOverlay && lightboxOverlay.classList.contains('open')) {
            nextImage();
        }
    });

    // Particle animation system
    function createParticle() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random starting position
        const startX = Math.random() * window.innerWidth;
        particle.style.left = startX + 'px';
        
        // Random animation duration
        const duration = 6 + Math.random() * 4; // 6-10 seconds
        particle.style.animationDuration = duration + 's';
        
        // Random size
        const size = 8 + Math.random() * 4; // 2-6px
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random color
        const colors = ['var(--primary-blue)'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = randomColor;
        
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000);
    }

    // Create particles at regular intervals
    function startParticleSystem() {
        // Create initial particles
        for (let i = 0; i < 15; i++) {
            setTimeout(() => createParticle(), i * 150);
        }
        
        // Continue creating particles
        setInterval(createParticle, 1000);
    }

    // Start particle system when page loads
    startParticleSystem();

    // Pause particles when page is not visible (performance optimization)
    document.addEventListener('visibilitychange', function() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            if (document.hidden) {
                particle.style.animationPlayState = 'paused';
            } else {
                particle.style.animationPlayState = 'running';
            }
        });
    });
});