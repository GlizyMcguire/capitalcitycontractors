/**
 * Live Google Reviews Integration for Capital City Contractors
 * Uses third-party service to bypass CORS and PHP limitations
 * Place ID: ChIJAZyYC-K4a04RRe9kJq7UZKo
 */

class LiveGoogleReviews {
    constructor() {
        this.config = {
            placeId: 'ChIJAZyYC-K4a04RRe9kJq7UZKo',
            businessName: 'Capital City Contractors',
            // Using Google My Business API alternative approach
            reviewsApiUrl: 'https://maps.googleapis.com/maps/api/place/details/json',
            // Backup: Use JSONP approach for CORS bypass
            corsProxyUrl: 'https://api.allorigins.win/raw?url=',
            maxReviews: 5,
            autoRefresh: true,
            refreshInterval: 3600000 // 1 hour
        };
        
        this.reviews = [];
        this.isLoading = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        this.init();
    }
    
    async init() {
        console.log('🚀 Initializing Live Google Reviews Integration');
        console.log('📍 Place ID:', this.config.placeId);
        
        // Remove all fallback/hardcoded reviews first
        this.clearFallbackReviews();
        
        // Try multiple approaches to get live reviews
        await this.fetchLiveReviews();
        
        // Set up auto-refresh if enabled
        if (this.config.autoRefresh) {
            this.setupAutoRefresh();
        }
    }
    
    clearFallbackReviews() {
        // Clear hardcoded reviews from global scope
        if (window.reviewsData) {
            window.reviewsData = [];
        }
        
        // Clear any existing fallback data
        localStorage.removeItem('fallback_reviews');
        
        console.log('🗑️ Cleared all fallback/hardcoded reviews');
    }
    
    async fetchLiveReviews() {
        console.log('📡 Fetching live Google Reviews...');
        this.isLoading = true;
        
        // Try multiple methods in order of preference
        const methods = [
            () => this.tryDirectAPIWithProxy(),
            () => this.tryAlternativeAPI(),
            () => this.tryJSONPApproach(),
            () => this.tryEmbedScraping()
        ];
        
        for (let i = 0; i < methods.length; i++) {
            try {
                console.log(`🔄 Trying method ${i + 1}...`);
                const reviews = await methods[i]();
                
                if (reviews && reviews.length > 0) {
                    console.log(`✅ Success with method ${i + 1}! Found ${reviews.length} reviews`);
                    this.reviews = reviews;
                    this.displayLiveReviews();
                    this.isLoading = false;
                    return;
                }
            } catch (error) {
                console.warn(`❌ Method ${i + 1} failed:`, error.message);
            }
        }
        
        // If all methods fail, try the widget approach
        console.log('🔄 All direct methods failed, implementing widget solution...');
        this.implementWidgetSolution();
        this.isLoading = false;
    }
    
    async tryDirectAPIWithProxy() {
        const proxyUrl = this.config.corsProxyUrl;
        const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.config.placeId}&fields=reviews,rating,user_ratings_total,name&key=AIzaSyCoeZ8b6mDNFaLVbqTx5H9FgNjpTBbWW1s`;
        
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        const data = await response.json();
        
        if (data.result && data.result.reviews) {
            return this.formatReviews(data.result.reviews);
        }
        
        throw new Error('No reviews in API response');
    }
    
    async tryAlternativeAPI() {
        // Try alternative approach using Google Places Web Service
        const url = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.config.placeId}&fields=reviews,rating,user_ratings_total,name&key=AIzaSyCoeZ8b6mDNFaLVbqTx5H9FgNjpTBbWW1s`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.result && data.result.reviews) {
            return this.formatReviews(data.result.reviews);
        }
        
        throw new Error('Alternative API failed');
    }
    
    async tryJSONPApproach() {
        // JSONP approach for cross-origin requests
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            const callbackName = 'googleReviewsCallback' + Date.now();
            
            window[callbackName] = (data) => {
                document.head.removeChild(script);
                delete window[callbackName];
                
                if (data && data.result && data.result.reviews) {
                    resolve(this.formatReviews(data.result.reviews));
                } else {
                    reject(new Error('JSONP: No reviews found'));
                }
            };
            
            script.src = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.config.placeId}&fields=reviews,rating,user_ratings_total,name&key=AIzaSyCoeZ8b6mDNFaLVbqTx5H9FgNjpTBbWW1s&callback=${callbackName}`;
            script.onerror = () => {
                document.head.removeChild(script);
                delete window[callbackName];
                reject(new Error('JSONP request failed'));
            };
            
            document.head.appendChild(script);
            
            // Timeout after 10 seconds
            setTimeout(() => {
                if (window[callbackName]) {
                    document.head.removeChild(script);
                    delete window[callbackName];
                    reject(new Error('JSONP timeout'));
                }
            }, 10000);
        });
    }
    
    async tryEmbedScraping() {
        // Try to extract reviews from Google Maps embed
        const embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyCoeZ8b6mDNFaLVbqTx5H9FgNjpTBbWW1s&q=place_id:${this.config.placeId}`;
        
        // This approach would require server-side processing, so skip for now
        throw new Error('Embed scraping requires server-side processing');
    }
    
    implementWidgetSolution() {
        console.log('🔧 Implementing third-party widget solution...');
        
        // Create a container for the widget
        const container = this.findTestimonialsContainer();
        if (!container) {
            console.error('❌ Testimonials container not found');
            return;
        }
        
        // Replace existing content with live reviews widget
        container.innerHTML = `
            <div class="live-reviews-widget">
                <div class="widget-header">
                    <h3>Live Google Reviews</h3>
                    <div class="google-rating">
                        <div class="stars">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <span class="rating-text">Google Business Profile</span>
                    </div>
                </div>
                <div id="elfsight-google-reviews" class="elfsight-app-${this.generateWidgetId()}"></div>
                <div class="widget-footer">
                    <a href="https://www.google.com/maps/place/Capital+City+Contractors/@45.2501659,-76.1298893,10z/data=!3m1!4b1!4m6!3m5!1s0x63eab8e20b989c01:0xa3640dae264def45!8m2!3d45.2501566!4d-75.8002569!16s%2Fg%2F11v0x2x8qr" 
                       target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                        <i class="fab fa-google"></i>
                        View All Reviews
                    </a>
                </div>
            </div>
        `;
        
        // Load the widget script
        this.loadWidgetScript();
        
        console.log('✅ Widget solution implemented');
    }
    
    loadWidgetScript() {
        // Load Elfsight widget script
        const script = document.createElement('script');
        script.src = 'https://static.elfsight.com/platform/platform.js';
        script.async = true;
        script.onload = () => {
            console.log('✅ Widget script loaded');
            this.initializeWidget();
        };
        document.head.appendChild(script);
    }
    
    initializeWidget() {
        // Initialize the widget with your Place ID
        if (window.eapps) {
            window.eapps.GoogleReviews({
                id: this.generateWidgetId(),
                placeId: this.config.placeId,
                layout: 'slider',
                theme: 'light',
                showHeader: false,
                showFooter: false,
                reviewsLimit: this.config.maxReviews,
                minRating: 4
            });
        }
    }
    
    generateWidgetId() {
        return 'ccc-reviews-' + Math.random().toString(36).substr(2, 9);
    }
    
    formatReviews(reviews) {
        return reviews.slice(0, this.config.maxReviews).map(review => ({
            author_name: review.author_name,
            rating: review.rating,
            text: review.text,
            time: review.time,
            relative_time_description: review.relative_time_description,
            profile_photo_url: review.profile_photo_url
        }));
    }
    
    displayLiveReviews() {
        console.log('🎨 Displaying live Google Reviews...');
        
        // Update global reviews data for existing slideshow
        window.reviewsData = this.reviews.map((review, index) => ({
            id: index + 1,
            customerName: review.author_name,
            rating: review.rating,
            reviewText: review.text,
            service: "Live Google Review",
            date: new Date(review.time * 1000).toISOString().split('T')[0],
            verified: true,
            source: 'google_live'
        }));
        
        // Refresh testimonials slideshow
        if (window.refreshTestimonials) {
            window.refreshTestimonials();
        }
        
        // Cache the reviews
        this.cacheReviews();
        
        console.log('✅ Live reviews displayed successfully');
    }
    
    findTestimonialsContainer() {
        const selectors = [
            '.testimonials-section',
            '#testimonials',
            '.reviews-container',
            '.review-card'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }
        
        return null;
    }
    
    cacheReviews() {
        try {
            const cacheData = {
                reviews: this.reviews,
                timestamp: Date.now(),
                placeId: this.config.placeId
            };
            localStorage.setItem('live_google_reviews', JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Failed to cache reviews:', error);
        }
    }
    
    setupAutoRefresh() {
        setInterval(() => {
            console.log('🔄 Auto-refreshing reviews...');
            this.fetchLiveReviews();
        }, this.config.refreshInterval);
    }
    
    // Public method to manually refresh
    async refresh() {
        console.log('🔄 Manually refreshing live reviews...');
        await this.fetchLiveReviews();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Starting Live Google Reviews Integration');
    window.liveGoogleReviews = new LiveGoogleReviews();
});

// Global refresh function
window.refreshLiveReviews = function() {
    if (window.liveGoogleReviews) {
        window.liveGoogleReviews.refresh();
    }
};
