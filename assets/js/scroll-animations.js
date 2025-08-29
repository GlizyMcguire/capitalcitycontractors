/**
 * Scroll Animations - Phase 2 UI/UX Enhancements
 * Adds smooth scroll-triggered animations for better user experience
 */

class ScrollAnimations {
    constructor() {
        this.animatedElements = [];
        this.observer = null;
        this.init();
    }

    init() {
        // Initialize Intersection Observer for scroll animations
        this.setupIntersectionObserver();
        
        // Add animation classes to elements
        this.setupAnimationElements();
        
        // Add smooth scroll behavior for navigation links
        this.setupSmoothScroll();
        
        // Add parallax effects
        this.setupParallaxEffects();

        // Add enhanced navigation behavior
        this.setupEnhancedNavigation();

        console.log('✨ Scroll animations initialized');
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.animation || 'fade-up';
                    
                    element.classList.add('animate-on-scroll', `animate-${animationType}`);
                    
                    // Add staggered delay for multiple elements
                    const delay = element.dataset.delay || 0;
                    if (delay > 0) {
                        element.style.animationDelay = `${delay}ms`;
                    }
                    
                    // Unobserve after animation
                    this.observer.unobserve(element);
                }
            });
        }, options);
    }

    setupAnimationElements() {
        // Add animation attributes to key elements
        const elementsToAnimate = [
            { selector: '.hero-content h1', animation: 'fade-up', delay: 0 },
            { selector: '.hero-content p', animation: 'fade-up', delay: 200 },
            { selector: '.hero-content .btn', animation: 'fade-up', delay: 400 },
            { selector: '.service-card', animation: 'fade-up', delay: 0 },
            { selector: '.testimonial-card', animation: 'fade-left', delay: 0 },
            { selector: '.portfolio-item', animation: 'scale-in', delay: 0 },
            { selector: '.about-content', animation: 'fade-right', delay: 0 },
            { selector: '.contact-form', animation: 'fade-up', delay: 0 },
            { selector: '.stats-item', animation: 'scale-in', delay: 0 }
        ];

        elementsToAnimate.forEach(({ selector, animation, delay }, index) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, elementIndex) => {
                element.dataset.animation = animation;
                element.dataset.delay = delay + (elementIndex * 100);
                this.observer.observe(element);
            });
        });
    }

    setupSmoothScroll() {
        // Enhanced smooth scroll for navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href === '#top') return;
                
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Add focus for accessibility
                    target.focus({ preventScroll: true });
                }
            });
        });
    }

    setupParallaxEffects() {
        // Subtle parallax effect for hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                if (scrolled < window.innerHeight) {
                    heroSection.style.transform = `translateY(${rate}px)`;
                }
            });
        }

        // Parallax for background elements
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    setupEnhancedNavigation() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateNavbar = () => {
            const scrollY = window.scrollY;

            // Add scrolled class when scrolled down
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar based on scroll direction
            if (scrollY > 100) {
                if (scrollY > lastScrollY && !navbar.classList.contains('hidden')) {
                    // Scrolling down - hide navbar
                    navbar.classList.add('hidden');
                    navbar.classList.remove('visible');
                } else if (scrollY < lastScrollY && !navbar.classList.contains('visible')) {
                    // Scrolling up - show navbar
                    navbar.classList.remove('hidden');
                    navbar.classList.add('visible');
                }
            } else {
                // Always show navbar at top
                navbar.classList.remove('hidden');
                navbar.classList.add('visible');
            }

            lastScrollY = scrollY;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });

        // Initial call
        updateNavbar();
    }

    // Add loading animations for dynamic content
    addLoadingAnimation(element) {
        element.classList.add('animate-on-scroll', 'animate-fade-up');
    }

    // Add staggered animations for lists
    staggerElements(selector, delay = 100) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.style.animationDelay = `${index * delay}ms`;
            element.classList.add('animate-on-scroll', 'animate-fade-up');
        });
    }
}

// Enhanced form interactions
class FormEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupInputAnimations();
        this.setupSubmitAnimations();
        
        console.log('📝 Form enhancements initialized');
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Real-time validation feedback
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        this.validateField(input);
                    }
                });
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let message = '';

        // Basic validation
        if (field.required && !value) {
            isValid = false;
            message = 'This field is required';
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        } else if (type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }

        // Update field appearance
        field.classList.toggle('error', !isValid);
        field.classList.toggle('valid', isValid && value);

        // Show/hide error message
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!isValid && message) {
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = message;
        } else if (errorElement) {
            errorElement.remove();
        }

        return isValid;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    setupInputAnimations() {
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentNode.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentNode.classList.remove('focused');
                }
            });
        });
    }

    setupSubmitAnimations() {
        const submitButtons = document.querySelectorAll('button[type="submit"], input[type="submit"]');
        
        submitButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const form = button.closest('form');
                if (form && this.validateForm(form)) {
                    button.classList.add('loading');
                    button.disabled = true;
                    
                    // Re-enable after 3 seconds (adjust based on actual form submission)
                    setTimeout(() => {
                        button.classList.remove('loading');
                        button.disabled = false;
                    }, 3000);
                }
            });
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        new ScrollAnimations();
    }
    
    new FormEnhancements();
});

// Export for use in other scripts
window.ScrollAnimations = ScrollAnimations;
window.FormEnhancements = FormEnhancements;
