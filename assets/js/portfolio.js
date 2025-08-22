// Portfolio Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initPortfolioFilter();
    initPortfolioAnimations();
});

// Portfolio Filter Functionality
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                
                if (filter === 'all' || categories.includes(filter)) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hidden');
                    setTimeout(() => {
                        if (item.classList.contains('hidden')) {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

// Portfolio Animations
function initPortfolioAnimations() {
    // Animate portfolio items on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Initially hide items for animation
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Animate stats on scroll
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Modal functionality for project details (placeholder)
function openModal(projectId) {
    // This is a placeholder for modal functionality
    // In a real implementation, you would:
    // 1. Create a modal overlay
    // 2. Load project details based on projectId
    // 3. Display before/after images, project description, etc.
    
    const projectData = {
        'painting-1': {
            title: 'Modern Living Room',
            category: 'Interior Painting',
            description: 'Complete interior painting transformation of a modern living room with custom color consultation and premium paint application.',
            details: [
                'Surface preparation and priming',
                'Custom color matching',
                'Premium paint application',
                'Clean-up and final inspection'
            ],
            duration: '3 days',
            size: '400 sq ft'
        },
        'painting-2': {
            title: 'Victorian Home Exterior',
            category: 'Exterior Painting',
            description: 'Full exterior painting of a historic Victorian home with period-appropriate colors and weather-resistant materials.',
            details: [
                'Pressure washing and surface prep',
                'Historical color research',
                'Weather-resistant paint system',
                'Detailed trim work'
            ],
            duration: '2 weeks',
            size: '2,800 sq ft'
        },
        'drywall-1': {
            title: 'Office Renovation',
            category: 'Drywall Installation',
            description: 'Complete drywall installation for modern office space renovation with soundproofing considerations.',
            details: [
                'Framing and layout',
                'Drywall installation',
                'Taping and finishing',
                'Texture application'
            ],
            duration: '1 week',
            size: '1,200 sq ft'
        },
        'drywall-2': {
            title: 'Basement Finishing',
            category: 'Drywall & Insulation',
            description: 'Basement finishing project including moisture-resistant drywall and proper insulation installation.',
            details: [
                'Moisture barrier installation',
                'Insulation placement',
                'Moisture-resistant drywall',
                'Professional finishing'
            ],
            duration: '10 days',
            size: '800 sq ft'
        },
        'taping-1': {
            title: 'Seamless Finish',
            category: 'Taping & Finishing',
            description: 'Expert taping and finishing work creating perfectly smooth walls ready for painting.',
            details: [
                'Joint compound application',
                'Professional taping',
                'Multiple coat finishing',
                'Smooth sanding'
            ],
            duration: '5 days',
            size: '600 sq ft'
        },
        'carpet-1': {
            title: 'Luxury Bedroom',
            category: 'Carpet Installation',
            description: 'High-end carpet installation in master bedroom with premium padding and professional finishing.',
            details: [
                'Subfloor preparation',
                'Premium padding installation',
                'Precision carpet fitting',
                'Professional edge finishing'
            ],
            duration: '1 day',
            size: '300 sq ft'
        },
        'carpet-2': {
            title: 'Corporate Office',
            category: 'Commercial Carpet',
            description: 'Large-scale commercial carpet installation with high-traffic rated materials and professional installation.',
            details: [
                'Commercial-grade materials',
                'High-traffic padding',
                'Seaming and layout planning',
                'Professional installation'
            ],
            duration: '3 days',
            size: '2,000 sq ft'
        },
        'mixed-1': {
            title: 'Complete Renovation',
            category: 'Drywall & Painting',
            description: 'Full room renovation including drywall repair, texturing, and complete painting transformation.',
            details: [
                'Drywall repair and patching',
                'Texture matching',
                'Primer and paint application',
                'Trim and detail work'
            ],
            duration: '1 week',
            size: '500 sq ft'
        }
    };
    
    const project = projectData[projectId];
    if (project) {
        // Simple alert for now - replace with actual modal
        alert(`${project.title}\n\n${project.description}\n\nDuration: ${project.duration}\nSize: ${project.size}`);
        
        // In a real implementation, you would create and show a modal here
        console.log('Project details:', project);
    }
}

// Lazy loading for portfolio images
function initLazyLoading() {
    const images = document.querySelectorAll('.portfolio-img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Portfolio item hover effects
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
        this.style.boxShadow = 'var(--shadow-2xl)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'var(--shadow-lg)';
    });
});

// Smooth scrolling for filter buttons
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Smooth scroll to portfolio grid after filter
        setTimeout(() => {
            const portfolioGrid = document.querySelector('.portfolio-grid');
            if (portfolioGrid) {
                portfolioGrid.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    });
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const suffix = counter.textContent.replace(/[\d]/g, '');
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + suffix;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.project-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}
