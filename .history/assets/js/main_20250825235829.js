// Main JavaScript File for Capital City Contractors Website

// User Message Display Function - Better than alert()
function showUserMessage(message, type = 'info') {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `user-message user-message-${type}`;
    messageDiv.textContent = message;

    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        max-width: 300px;
        word-wrap: break-word;
        animation: slideInRight 0.3s ease-out;
    `;

    // Add animation styles
    if (!document.getElementById('message-styles')) {
        const style = document.createElement('style');
        style.id = 'message-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(messageDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);

    // Click to dismiss
    messageDiv.addEventListener('click', () => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    });
}

// Cache Busting - Force reload of cached resources when needed
function forceCacheRefresh() {
    const timestamp = new Date().getTime();
    const links = document.querySelectorAll('link[rel="stylesheet"]');

    links.forEach(link => {
        if (link.href.includes('assets/css/')) {
            const url = new URL(link.href);
            url.searchParams.set('v', timestamp);
            link.href = url.toString();
        }
    });
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initTestimonialSlider();
    initAnimations();
    initFormHandling();
    initSmoothScrolling();

    // Initialize AOS (Animate On Scroll) if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100
        });
    }
});

// Navigation Functions - Clean and Modern
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');

    // Hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Toggle classes
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active nav link highlighting
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    // Fix footer links on homepage to anchor-scroll instead of navigating away
    const footerLinks = document.querySelectorAll('.footer .footer-links a');
    footerLinks.forEach(link => {
        try {
            const href = link.getAttribute('href');
            // Normalize to anchors on the same page
            const anchorMatch = href && href.match(/#(services|about|portfolio|contact)$/);
            if (anchorMatch) {
                link.setAttribute('href', `#${anchorMatch[1]}`);
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.getElementById(anchorMatch[1]);
                    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            }
        } catch (e) { /* no-op */ }
    });

    });
}

// Scroll Effects
function initScrollEffects() {
    // Parallax effect for hero background
    const heroBackground = document.querySelector('.hero-bg-img');
    if (heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        });
    }

    // Scroll indicator
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const servicesSection = document.querySelector('.services-preview');
            if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Hide scroll indicator when scrolling
    window.addEventListener('scroll', function() {
        if (scrollIndicator) {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '0.8';
            }
        }
    });
}

// Load and Display Real Reviews from reviews.js
function initTestimonialSlider() {
    const container = document.getElementById('testimonials-container');

    if (!container || typeof reviewsData === 'undefined') {
        return;
    }

    let currentReviewIndex = 0;
    const totalReviews = reviewsData.length;

    // Generate initials from name
    function getInitials(name) {
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    }

    // Generate color based on name
    function getAvatarColor(name) {
        const colors = ['#667eea', '#764ba2', '#4facfe', '#43e97b', '#f093fb', '#f5576c'];
        const index = name.length % colors.length;
        return colors[index];
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            return `${diffDays} days ago`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
    }

    // Create review card HTML
    function createReviewCard(review, index) {
        const initials = getInitials(review.customerName);
        const avatarColor = getAvatarColor(review.customerName);
        const formattedDate = formatDate(review.date);
        const stars = '★'.repeat(review.rating);

        return `
            <div class="testimonial-wrapper">
                <div class="testimonial-card">

                    <!-- Navigation Arrows positioned outside card -->
                    <button class="card-nav-btn prev-btn" ${index === 0 ? 'disabled' : ''}
                            style="position: absolute; left: -55px; top: 50%; transform: translateY(-50%); z-index: 10;">
                        <i class="fas fa-chevron-left"></i>
                    </button>

                    <button class="card-nav-btn next-btn" ${index === totalReviews - 1 ? 'disabled' : ''}
                            style="position: absolute; right: -55px; top: 50%; transform: translateY(-50%); z-index: 10;">
                        <i class="fas fa-chevron-right"></i>
                    </button>

                    <div class="testimonial-header">
                        <div class="customer-info">
                            <div class="customer-avatar" style="background: ${avatarColor}">
                                <span class="avatar-initials">${initials}</span>
                            </div>
                            <div class="customer-details">
                                <h4 class="customer-name">${review.customerName}</h4>
                                <div class="customer-rating">
                                    <span class="stars">${stars}</span>
                                    <span class="rating-date">${formattedDate}</span>
                                </div>
                            </div>
                        </div>
                        <div class="google-logo" title="Google Review">
                            <i class="fab fa-google"></i>
                        </div>
                    </div>
                    <div class="testimonial-content">
                        <div class="quote-icon">
                            <i class="fas fa-quote-left"></i>
                        </div>
                        <p class="testimonial-text">"${review.reviewText}"</p>
                    </div>
                    <div class="testimonial-footer">
                        <div class="testimonial-service">
                            <i class="fas fa-tools"></i>
                            ${review.service}
                        </div>
                        ${review.verified ? '<div class="verified-badge"><i class="fas fa-check-circle"></i> Verified</div>' : ''}
                    </div>
                </div>

                <!-- Navigation dots below card -->
                <div class="review-navigation">
                    <div class="review-dots">
                        ${reviewsData.map((_, i) =>
                            `<span class="dot ${i === index ? 'active' : ''}" data-index="${i}"></span>`
                        ).join('')}
                    </div>
                    <div class="review-counter">
                        ${index + 1} of ${totalReviews} reviews
                    </div>
                </div>
            </div>
        `;
    }

    // Display current review
    function displayReview(index) {
        if (index < 0 || index >= totalReviews) return;

        const review = reviewsData[index];
        container.innerHTML = createReviewCard(review, index);

        // Add event listeners to navigation buttons
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        const dots = container.querySelectorAll('.dot');

        if (prevBtn && !prevBtn.disabled) {
            prevBtn.addEventListener('click', () => {
                if (currentReviewIndex > 0) {
                    currentReviewIndex--;
                    displayReview(currentReviewIndex);
                }
            });
        }

        if (nextBtn && !nextBtn.disabled) {
            nextBtn.addEventListener('click', () => {
                if (currentReviewIndex < totalReviews - 1) {
                    currentReviewIndex++;
                    displayReview(currentReviewIndex);
                }
            });
        }

        // Add event listeners to dots
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'));
                if (index !== currentReviewIndex) {
                    currentReviewIndex = index;
                    displayReview(currentReviewIndex);
                }
            });
        });
    }

    // Initialize with first review
    displayReview(0);
}

// Animation Functions
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // Special handling for service cards
                if (entry.target.classList.contains('services-grid')) {
                    const serviceCards = entry.target.querySelectorAll('.service-card');
                    serviceCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }

                // Special handling for feature items
                if (entry.target.classList.contains('features-list')) {
                    const featureItems = entry.target.querySelectorAll('.feature-item');
                    featureItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.section-header, .services-grid, .features-list, .about-content');
    animateElements.forEach(el => observer.observe(el));
}

// Form Handling
function initFormHandling() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic form validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            // Email validation
            const emailInputs = form.querySelectorAll('input[type="email"]');
            emailInputs.forEach(input => {
                if (input.value && !isValidEmail(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                }
            });

            if (isValid) {
                // Show success message
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
            } else {
                showNotification('Please fill in all required fields correctly.', 'error');
            }
        });
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimized scroll handler
const optimizedScrollHandler = throttle(function() {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// Lazy loading disabled for better performance
// Images now load immediately for faster slideshow and gallery performance

// Initialize counter animations
initCounterAnimations();

// Counter Animation Function
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCounter(counter);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const target = parseInt(text.replace(/[^\d]/g, ''));
    const suffix = text.replace(/[\d]/g, '');
    const isPercentage = text.includes('%');
    const hasPlus = text.includes('+');

    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 seconds
    const stepTime = duration / 100;

    element.textContent = '0' + suffix;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            let finalText = target.toString();
            if (hasPlus) finalText += '+';
            if (isPercentage) finalText += '%';
            if (text.includes('/7')) finalText = '24/7';

            element.textContent = finalText;
            clearInterval(timer);
        } else {
            let displayValue = Math.floor(current).toString();
            if (hasPlus && current > 0) displayValue += '+';
            if (isPercentage) displayValue += '%';

            element.textContent = displayValue;
        }
    }, stepTime);
}

// Error handling
window.addEventListener('error', function(e) {
    // Log errors in development only
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('JavaScript error:', e.error);
    }
});

// Service Worker registration with update flow
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                if (reg.waiting) {
                    reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                }
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    if (!newWorker) return;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                            window.location.reload();
                        }
                    });
                });
            })
            .catch(() => {
                // Service worker registration failed silently
            });
    });
}

// Portfolio Slideshow Functionality
let currentSlideIndex = 0;
let slideInterval;

function initializeSlideshow() {
    const slides = document.querySelectorAll('.slide');

    if (slides.length === 0) return; // Exit if no slides found

    // Pre-decode all slideshow images to avoid decode jank during transitions
    const images = Array.from(document.querySelectorAll('.slideshow-container img'));
    const decodePromises = images.map(img => {
        try {
            // If already complete, no need to decode
            if (img.complete) return Promise.resolve();
            return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
        } catch (e) { return Promise.resolve(); }
    });

    Promise.allSettled(decodePromises).then(() => {
        // Start automatic slideshow after images are decoded
        startSlideshow();
    });

    // Pause on hover
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', stopSlideshow);
        slideshowContainer.addEventListener('mouseleave', startSlideshow);
    }
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');

    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Wrap around if necessary
    if (index >= slides.length) currentSlideIndex = 0;
    if (index < 0) currentSlideIndex = slides.length - 1;

    // Show current slide
    if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.add('active');
    }
    if (indicators[currentSlideIndex]) {
        indicators[currentSlideIndex].classList.add('active');
    }

    // Update counter display
    updateSlideCounter();
}

function updateSlideCounter() {
    const currentSlideNumber = document.getElementById('current-slide-number');
    const totalSlides = document.getElementById('total-slides');

    if (currentSlideNumber) {
        currentSlideNumber.textContent = currentSlideIndex + 1;
    }

    if (totalSlides) {
        const slides = document.querySelectorAll('.slide');
        totalSlides.textContent = slides.length;
    }
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    showSlide(currentSlideIndex);
    stopSlideshow();
    startSlideshow(); // Restart auto-play
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
    stopSlideshow();
    startSlideshow(); // Restart auto-play
}

function nextSlide() {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
}

function startSlideshow() {
    slideInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
}

function stopSlideshow() {
    clearInterval(slideInterval);
}

// Initialize slideshow and other components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeSlideshow();
    initializeQuoteForm();
    initializeEmailJS();
});

// Initialize EmailJS
function initializeEmailJS() {
    // Initialize EmailJS with your public key
    emailjs.init("3WPfc4g2tSskRQYAX");
}

// Send quote email using EmailJS
function sendQuoteEmail(formData) {
    return new Promise((resolve, reject) => {
        // Check if EmailJS is loaded
        if (typeof emailjs === 'undefined') {
            reject(new Error('EmailJS not loaded'));
            return;
        }

        // EmailJS template parameters
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            service: formData.service,
            message: formData.message
        };

        // Email sending parameters configured

        // Send email using EmailJS
        emailjs.send('service_l2m9z4m', 'template_kkjppjd', templateParams)
            .then((response) => {
                resolve(response);
            })
            .catch(() => {
                // Fallback to mailto if EmailJS fails
                const subject = `Quote Request - ${formData.service}`;
                const body = `QUOTE REQUEST DETAILS:

Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Service Requested: ${formData.service}

Project Description:
${formData.message}

---
This quote request was submitted through the Capital City Contractors website.
Please respond to the customer within 24 hours.`;

                const mailtoLink = `mailto:info@capitalcitycontractors.ca?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(mailtoLink, '_blank');

                // Resolve anyway since we have a fallback
                resolve({ fallback: true });
            });
    });
}

// Scroll to top function for Home button
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Simple mobile menu toggle function (global for inline onclick)
function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    }
}

// Close mobile menu function
function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
}

// Home button function - simplified and reliable
function goHome() {
    // Always close mobile menu (safe for desktop)
    closeMobileMenu();

    // Always scroll to top with a small delay
    setTimeout(function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 150);
}

// Quote Form Functionality
function initializeQuoteForm() {
    const form = document.getElementById('quoteForm');
    if (!form) return;

    // Initialize file upload functionality
    initializeFileUpload();

    // Store form data on input changes to capture values before submission
    let formData = {};

    function updateFormData() {
        const nameInput = form.querySelector('input[name="name"]');
        const phoneInput = form.querySelector('input[name="phone"]');
        const emailInput = form.querySelector('input[name="email"]');
        const serviceSelect = form.querySelector('select[name="service"]');
        const messageTextarea = form.querySelector('textarea[name="message"]');

        formData = {
            name: nameInput ? nameInput.value.trim() : '',
            phone: phoneInput ? phoneInput.value.trim() : '',
            email: emailInput ? emailInput.value.trim() : '',
            service: serviceSelect ? serviceSelect.value : '',
            message: messageTextarea ? messageTextarea.value.trim() : ''
        };

        // Form data updated
    }

    // Listen for changes on all form inputs
    form.addEventListener('input', updateFormData);
    form.addEventListener('change', updateFormData);

    // Prevent form from submitting normally
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    // Capture form data immediately when submit button is clicked
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Update form data one more time
            updateFormData();

            // Validation using stored form data
            if (!formData.name) {
                showUserMessage('Please enter your name.', 'error');
                form.querySelector('input[name="name"]').focus();
                return false;
            }

            if (!formData.phone) {
                showUserMessage('Please enter your phone number.', 'error');
                form.querySelector('input[name="phone"]').focus();
                return false;
            }

            if (!formData.email) {
                showUserMessage('Please enter your email address.', 'error');
                form.querySelector('input[name="email"]').focus();
                return false;
            }

            if (!formData.service) {
                showUserMessage('Please select a service.', 'error');
                form.querySelector('select[name="service"]').focus();
                return false;
            }

            if (!formData.message) {
                showUserMessage('Please describe your project.', 'error');
                form.querySelector('textarea[name="message"]').focus();
                return false;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showUserMessage('Please enter a valid email address.', 'error');
                form.querySelector('input[name="email"]').focus();
                return false;
            }

            // Phone validation (basic)
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(formData.phone)) {
                showUserMessage('Please enter a valid phone number.', 'error');
                form.querySelector('input[name="phone"]').focus();
                return false;
            }

            console.log('Validation passed, sending email');

            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Send email using EmailJS
            sendQuoteEmail(formData)
                .then((response) => {
                    console.log('Email sent successfully:', response);

                    // Reset form
                    form.reset();
                    clearFilePreview();

                    // Reset button
                    submitBtn.textContent = 'Send Quote Request';
                    submitBtn.disabled = false;

                    // Show success modal
                    showSuccessModal();

                    // Scroll to top
                    scrollToTop();

                    // Show different message if fallback was used
                    if (response && response.fallback) {
                        console.log('Used mailto fallback');
                    }
                })
                .catch((error) => {
                    console.error('Email sending failed completely:', error);

                    // Reset button
                    submitBtn.textContent = 'Send Quote Request';
                    submitBtn.disabled = false;

                    // Show error message with more details
                    showUserMessage('Sorry, there was an error sending your quote request. Please call us directly at (613) 301-1311 or email info@capitalcitycontractors.ca with your request.', 'error');
                });

            return false;
        });
    }


}

// File Upload Functionality
function initializeFileUpload() {
    const fileInput = document.getElementById('photos');
    const filePreview = document.getElementById('filePreview');

    if (!fileInput || !filePreview) return;

    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);

        // Validate files
        const validFiles = files.filter(file => {
            // Check file type
            if (!file.type.startsWith('image/')) {
                showUserMessage(`${file.name} is not an image file.`, 'error');
                return false;
            }

            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                showUserMessage(`${file.name} is too large. Maximum size is 5MB.`, 'error');
                return false;
            }

            return true;
        });

        // Update file input with valid files only
        if (validFiles.length !== files.length) {
            const dt = new DataTransfer();
            validFiles.forEach(file => dt.items.add(file));
            fileInput.files = dt.files;
        }

        // Display file previews
        displayFilePreview(validFiles);
    });
}

function displayFilePreview(files) {
    const filePreview = document.getElementById('filePreview');
    filePreview.innerHTML = '';

    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'file-preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview" class="file-preview-img">
                <button type="button" class="file-preview-remove" onclick="removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            filePreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
}

function removeFile(index) {
    const fileInput = document.getElementById('photos');
    const dt = new DataTransfer();

    // Add all files except the one to remove
    Array.from(fileInput.files).forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });

    fileInput.files = dt.files;

    // Refresh preview
    displayFilePreview(Array.from(fileInput.files));
}

function clearFilePreview() {
    const filePreview = document.getElementById('filePreview');
    if (filePreview) {
        filePreview.innerHTML = '';
    }
}

// Success Modal Functions
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function hideSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Initialize modal close functionality
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('closeModal');
    const modal = document.getElementById('successModal');

    if (closeBtn) {
        closeBtn.addEventListener('click', hideSuccessModal);
    }

    if (modal) {
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideSuccessModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                hideSuccessModal();
            }
        });
    }
});
