/**
 * Perimeter Official Website - Modern Interactive Scripts (2026)
 * Handles navbar dynamics, mobile navigation, video trailer flow,
 * touch-enabled screenshot carousel, active scroll-spy, and reveal animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Navbar Scroll Effect & Mobile Drawer
    // -------------------------------------------------------------------------
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            const isActive = mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active', isActive);
            mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });

        // Close mobile drawer when clicking a link
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

// -------------------------------------------------------------------------
    // 2. Interactive Video Trailer Facade (Eliminates Error 153 & Accelerates Load)
    // -------------------------------------------------------------------------
    const videoWrapper = document.getElementById('videoWrapper');
    const videoPoster = document.getElementById('videoPoster');
    const videoEmbedContainer = document.getElementById('videoEmbedContainer');

    if (videoPoster && videoEmbedContainer) {
        videoPoster.addEventListener('click', () => {
            const isLocalFile = window.location.protocol === 'file:';
            
            // Mount iframe with correct referrer policy and clean embed params
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', 'https://www.youtube.com/embed/S7LjdiKcKpY?autoplay=1&rel=0');
            iframe.setAttribute('title', 'Perimeter - Official Trailer');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            iframe.setAttribute('allowfullscreen', 'true');
            
            videoEmbedContainer.innerHTML = '';
            videoEmbedContainer.appendChild(iframe);
            videoPoster.style.display = 'none';

            // If running on local file:// protocol, also open directly on YouTube
            if (isLocalFile) {
                window.open('https://www.youtube.com/watch?v=S7LjdiKcKpY', '_blank');
            }
        });
    }

    // -------------------------------------------------------------------------
    // 2. Active Section Scroll Spy
    // -------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    
    const updateActiveNav = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    correspondingLink.classList.add('active');
                } else {
                    correspondingLink.classList.remove('active');
                }
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // -------------------------------------------------------------------------
    // 3. Touch-Enabled Screenshot Carousel with Dot Indicators
    // -------------------------------------------------------------------------
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');

    if (track && prevBtn && nextBtn) {
        const slides = Array.from(track.children);
        let currentIndex = 0;
        let autoPlayTimer = null;

        // Generate dot buttons
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (idx === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
                dot.addEventListener('click', () => {
                    goToSlide(idx);
                    resetAutoPlay();
                });
                dotsContainer.appendChild(dot);
            });
        }

        const updateDots = () => {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        };

        const updateSlidePosition = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const goToSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            updateSlidePosition();
        };

        const nextSlide = () => goToSlide(currentIndex + 1);
        const prevSlide = () => goToSlide(currentIndex - 1);

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        // Keyboard navigation when carousel is focused
        track.parentElement.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoPlay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoPlay();
            }
        });

        // Touch Swipe Gestures for Mobile
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const swipeThreshold = 45;
            if (touchEndX < touchStartX - swipeThreshold) {
                nextSlide(); // Swiped left -> next
                resetAutoPlay();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                prevSlide(); // Swiped right -> prev
                resetAutoPlay();
            }
        };

        // Auto Advance & Pause on Hover
        const startAutoPlay = () => {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(nextSlide, 5000);
        };

        const stopAutoPlay = () => {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        };

        const resetAutoPlay = () => {
            stopAutoPlay();
            startAutoPlay();
        };

        const carouselWrapper = track.parentElement;
        carouselWrapper.addEventListener('mouseenter', stopAutoPlay);
        carouselWrapper.addEventListener('mouseleave', startAutoPlay);

        startAutoPlay();
    }

    // -------------------------------------------------------------------------
    // 4. Scroll Reveal Animations (IntersectionObserver)
    // -------------------------------------------------------------------------
    const revealObserverOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    const animatedElements = document.querySelectorAll(
        '.feature-card, .highlight-item, .roadmap-column, .trailer-container, .banner-content, .hero-content'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });

    // Add CSS class handler
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .in-view {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);
});
