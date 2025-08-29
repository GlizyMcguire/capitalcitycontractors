/**
 * Image Enhancements - Phase 2 UI/UX Improvements
 * Advanced image loading, lazy loading, and visual enhancements
 */

class ImageEnhancements {
    constructor() {
        this.lazyImages = [];
        this.imageObserver = null;
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageOptimizations();
        this.setupImageErrorHandling();
        this.setupProgressiveLoading();
        
        console.log('🖼️ Image enhancements initialized');
    }

    setupLazyLoading() {
        // Enhanced lazy loading with Intersection Observer
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Find all lazy images
        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });

        this.imageObserver = lazyImageObserver;
    }

    loadImage(img) {
        return new Promise((resolve, reject) => {
            // Add loading class
            img.classList.add('loading');
            
            // Create a new image to preload
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
                // Image loaded successfully
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                // Add fade-in animation
                img.classList.remove('loading');
                img.classList.add('loaded');
                
                resolve(img);
            };
            
            imageLoader.onerror = () => {
                // Handle loading error
                img.classList.remove('loading');
                img.classList.add('error');
                this.handleImageError(img);
                reject(new Error('Image failed to load'));
            };
            
            // Start loading
            imageLoader.src = img.dataset.src || img.src;
        });
    }

    setupImageOptimizations() {
        // Add CSS classes for image loading states
        const style = document.createElement('style');
        style.textContent = `
            img.loading {
                opacity: 0;
                filter: blur(5px);
                transition: all 0.3s ease;
            }
            
            img.loaded {
                opacity: 1;
                filter: blur(0);
            }
            
            img.error {
                opacity: 0.5;
                filter: grayscale(100%);
            }
            
            .image-placeholder {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
            }
            
            @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
        document.head.appendChild(style);
    }

    setupImageErrorHandling() {
        // Global image error handler
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);
    }

    handleImageError(img) {
        // Create fallback placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'image-error-placeholder';
        placeholder.style.cssText = `
            width: ${img.width || 300}px;
            height: ${img.height || 200}px;
            background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6b7280;
            font-size: 14px;
            border-radius: 8px;
            border: 2px dashed #d1d5db;
        `;
        placeholder.innerHTML = '📷 Image unavailable';
        
        // Replace image with placeholder
        img.parentNode.replaceChild(placeholder, img);
    }

    setupProgressiveLoading() {
        // Progressive image loading for better perceived performance
        const images = document.querySelectorAll('img[data-src]');
        
        images.forEach(img => {
            // Create low-quality placeholder
            if (img.dataset.placeholder) {
                const placeholder = new Image();
                placeholder.onload = () => {
                    img.src = img.dataset.placeholder;
                    img.classList.add('placeholder-loaded');
                };
                placeholder.src = img.dataset.placeholder;
            }
        });
    }

    // Method to manually trigger image loading
    loadImagesInContainer(container) {
        const images = container.querySelectorAll('img[data-src]');
        images.forEach(img => {
            this.loadImage(img);
        });
    }

    // Method to add new images to lazy loading
    observeNewImages(images) {
        if (this.imageObserver) {
            images.forEach(img => {
                this.imageObserver.observe(img);
            });
        }
    }
}

// Performance monitoring for images
class ImagePerformanceMonitor {
    constructor() {
        this.metrics = {
            totalImages: 0,
            loadedImages: 0,
            failedImages: 0,
            averageLoadTime: 0
        };
        this.loadTimes = [];
        this.init();
    }

    init() {
        this.monitorImageLoading();
        console.log('📊 Image performance monitoring initialized');
    }

    monitorImageLoading() {
        const images = document.querySelectorAll('img');
        this.metrics.totalImages = images.length;

        images.forEach(img => {
            const startTime = performance.now();
            
            const onLoad = () => {
                const loadTime = performance.now() - startTime;
                this.loadTimes.push(loadTime);
                this.metrics.loadedImages++;
                this.updateAverageLoadTime();
                img.removeEventListener('load', onLoad);
                img.removeEventListener('error', onError);
            };
            
            const onError = () => {
                this.metrics.failedImages++;
                img.removeEventListener('load', onLoad);
                img.removeEventListener('error', onError);
            };
            
            if (img.complete) {
                onLoad();
            } else {
                img.addEventListener('load', onLoad);
                img.addEventListener('error', onError);
            }
        });
    }

    updateAverageLoadTime() {
        if (this.loadTimes.length > 0) {
            const sum = this.loadTimes.reduce((a, b) => a + b, 0);
            this.metrics.averageLoadTime = sum / this.loadTimes.length;
        }
    }

    getMetrics() {
        return {
            ...this.metrics,
            successRate: (this.metrics.loadedImages / this.metrics.totalImages) * 100
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize image enhancements
    window.imageEnhancements = new ImageEnhancements();
    
    // Initialize performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.imagePerformanceMonitor = new ImagePerformanceMonitor();
        
        // Log metrics after 5 seconds
        setTimeout(() => {
            console.log('📊 Image Performance Metrics:', window.imagePerformanceMonitor.getMetrics());
        }, 5000);
    }
});

// Export for use in other scripts
window.ImageEnhancements = ImageEnhancements;
window.ImagePerformanceMonitor = ImagePerformanceMonitor;
