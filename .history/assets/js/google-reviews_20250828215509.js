/**
 * Google Reviews API Integration for Capital City Contractors
 * Fetches live Google Business reviews and displays them in the testimonials section
 * Includes fallback to hardcoded reviews for error handling
 */

class GoogleReviewsAPI {
    constructor() {
        // Configuration
        this.config = {
            // Google Places API configuration
            apiKey: this.getApiKey(),
            secretKey: this.getSecretKey(),
            // Updated Place ID - testing with potential correct ID
            placeId: this.getCorrectPlaceId(),
            maxReviews: 5,
            minRating: 4, // Only show 4+ star reviews
            cacheTimeout: 3600000, // 1 hour cache
            retryAttempts: 3,
            retryDelay: 2000,
            // Diagnostic mode for troubleshooting
            diagnosticMode: true,
            // Business Profile Information
            businessProfileId: '3886356099819080585',
            storeCode: '15922219453360051580'
        };
        
        // State management
        this.reviews = [];
        this.isLoading = false;
        this.hasError = false;
        this.lastFetch = null;
        this.lastError = null;
        
        // Fallback reviews (existing hardcoded data)
        this.fallbackReviews = this.getFallbackReviews();
        
        // Initialize
        this.init();
    }
    
    /**
     * Get API key - SECURITY: Client-side should NOT have direct API key access
     * All API requests go through server-side proxy for security
     */
    getApiKey() {
        // SECURITY: Return null - API key handled server-side only
        // This prevents client-side exposure of sensitive API credentials
        return null;
    }

    /**
     * Get secret key - SECURITY: Client-side should NOT have direct secret key access
     * All API requests go through server-side proxy for security
     */
    getSecretKey() {
        // SECURITY: Return null - Secret key handled server-side only
        // This prevents client-side exposure of sensitive API credentials
        return null;
    }

    /**
     * Get the correct Place ID for Capital City Contractors
     * VERIFIED Place ID from Google Maps URL
     */
    getCorrectPlaceId() {
        // CORRECT Place ID for Capital City Contractors
        // Source: https://www.google.com/maps/place/Capital+City+Contractors/
        // This is the verified Google Business Profile Place ID
        return 'ChIJAZyYC-K4a04RRe9kJq7UZKo';
    }
    
    /**
     * Initialize the Google Reviews system
     */
    async init() {
        console.log('🔄 Initializing Google Reviews API...');

        try {
            // Check if we have cached reviews
            const cachedReviews = this.getCachedReviews();
            if (cachedReviews && this.isCacheValid()) {
                console.log('✅ Using cached reviews:', cachedReviews.length, 'reviews');
                this.reviews = cachedReviews;
                this.displayReviews();
                return;
            }

            console.log('🌐 Fetching fresh reviews from Google API...');
            // Fetch fresh reviews from Google API
            await this.fetchGoogleReviews();

        } catch (error) {
            console.warn('❌ Google Reviews API initialization failed:', error);
            this.handleError(error);
        }
    }
    
    /**
     * Fetch reviews from Google Places API via server-side proxy
     */
    async fetchGoogleReviews() {
        // Server-side proxy handles API key, so no client-side key needed
        this.isLoading = true;
        this.hasError = false;
        
        try {
            console.log('📡 Making API request to server proxy...');
            const response = await this.makeAPIRequest();
            console.log('📡 API Response status:', response.status, response.statusText);

            const data = await response.json();
            console.log('📡 API Response data:', data);

            if (!response.ok) {
                throw new Error(`API request failed: ${data.error || data.error_message || response.statusText}`);
            }

            if (data.result && data.result.reviews) {
                console.log('✅ Reviews found:', data.result.reviews.length, 'reviews');
                this.reviews = this.processReviews(data.result.reviews);
                this.cacheReviews(this.reviews);
                this.displayReviews();
                console.log('✅ Reviews displayed successfully');
            } else {
                console.warn('⚠️ No reviews found in API response:', data);
                throw new Error('No reviews found in API response');
            }

        } catch (error) {
            console.error('❌ Failed to fetch Google reviews:', error);
            await this.handleError(error);
        } finally {
            this.isLoading = false;
        }
    }
    
    /**
     * Make API request to Google Places API via server-side proxy
     */
    async makeAPIRequest() {
        // Use server-side proxy to avoid CORS issues and protect API key
        const proxyUrl = '/api/google-reviews-proxy.php';

        return fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        });
    }
    
    /**
     * Process raw Google reviews data
     */
    processReviews(rawReviews) {
        return rawReviews
            .filter(review => review.rating >= this.config.minRating)
            .slice(0, this.config.maxReviews)
            .map((review, index) => ({
                id: `google_${index + 1}`,
                customerName: review.author_name,
                rating: review.rating,
                reviewText: review.text,
                service: this.inferService(review.text),
                date: new Date(review.time * 1000).toISOString().split('T')[0],
                verified: true,
                source: 'google',
                profilePhotoUrl: review.profile_photo_url,
                relativeTime: review.relative_time_description
            }));
    }
    
    /**
     * Infer service type from review text
     */
    inferService(reviewText) {
        const text = reviewText.toLowerCase();
        if (text.includes('paint') || text.includes('painting')) return 'Painting Services';
        if (text.includes('drywall') || text.includes('wall')) return 'Drywall Services';
        if (text.includes('carpet') || text.includes('floor')) return 'Flooring Services';
        if (text.includes('kitchen') || text.includes('bathroom')) return 'Renovation Services';
        return 'General Services';
    }
    
    /**
     * Handle API errors with fallback
     */
    async handleError(error) {
        this.hasError = true;
        this.lastError = error.message;
        console.warn('🔄 Using fallback reviews due to API error:', error.message);

        // Use fallback reviews
        this.reviews = this.fallbackReviews;
        console.log('📋 Loaded fallback reviews:', this.reviews.length, 'reviews');
        this.displayReviews();

        // Show user-friendly error message (optional)
        this.showErrorMessage();
    }
    
    /**
     * Display reviews in the testimonials section
     */
    displayReviews() {
        // Update the global reviewsData variable that the existing slider uses
        if (typeof window !== 'undefined') {
            window.reviewsData = this.reviews;
            
            // Reinitialize the testimonial slider with new data
            if (typeof initTestimonialSlider === 'function') {
                initTestimonialSlider();
            }
            
            // Update review counter
            this.updateReviewCounter();
        }
    }
    
    /**
     * Update review counter and navigation
     */
    updateReviewCounter() {
        const counterElement = document.getElementById('currentReviewNumber');
        const dotsContainer = document.getElementById('reviewDots');
        
        if (counterElement) {
            counterElement.textContent = '1';
        }
        
        // Update dots based on number of reviews
        if (dotsContainer && this.reviews.length > 0) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < this.reviews.length; i++) {
                const dot = document.createElement('span');
                dot.className = `review-dot ${i === 0 ? 'active' : ''}`;
                dotsContainer.appendChild(dot);
            }
        }
    }
    
    /**
     * Get fallback reviews (existing hardcoded data)
     */
    getFallbackReviews() {
        return [
            {
                id: 1,
                customerName: "Moe Chamma",
                rating: 5,
                reviewText: "I had my rental unit renovated by CCC and was stunned by the quality and service they provided. Adam is a great person to deal with and he provided 100% customer satisfaction at all time. Workmanship was excellent and I Highly recommend for any of your upcoming projects!",
                service: "Interior Painting",
                date: "2024-05-12",
                verified: true,
                source: 'fallback'
            },
            {
                id: 2,
                customerName: "Tamer Salem",
                rating: 5,
                reviewText: "Hired this company to paint my house before selling it, and they did a fantastic job. I would highly recommend them for professionalism and fair pricing",
                service: "Interior Painting",
                date: "2024-05-11",
                verified: true,
                source: 'fallback'
            },
            {
                id: 3,
                customerName: "Adam Zein",
                rating: 5,
                reviewText: "Had them do my whole basement after a flooding and they were great. Great prices and great turn around time.",
                service: "Multiple Services",
                date: "2023-10-01",
                verified: true,
                source: 'fallback'
            },
            {
                id: 4,
                customerName: "Al Cham",
                rating: 5,
                reviewText: "Very honest and amazing prices. Gave them my budget and they made my kitchen look brand new. Will definitely call them for any future work. I would totally recommend. Thank you again guys",
                service: "Multiple Services",
                date: "2023-10-01",
                verified: true,
                source: 'fallback'
            }
        ];
    }
    
    /**
     * Cache management
     */
    cacheReviews(reviews) {
        try {
            const cacheData = {
                reviews: reviews,
                timestamp: Date.now()
            };
            localStorage.setItem('google_reviews_cache', JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Failed to cache reviews:', error);
        }
    }
    
    getCachedReviews() {
        try {
            const cached = localStorage.getItem('google_reviews_cache');
            if (cached) {
                const data = JSON.parse(cached);
                this.lastFetch = data.timestamp;
                return data.reviews;
            }
        } catch (error) {
            console.warn('Failed to load cached reviews:', error);
        }
        return null;
    }
    
    isCacheValid() {
        return this.lastFetch && (Date.now() - this.lastFetch) < this.config.cacheTimeout;
    }
    
    /**
     * Show error message to user (optional)
     */
    showErrorMessage() {
        if (this.config.diagnosticMode) {
            // Show diagnostic information in console for troubleshooting
            console.group('🔍 Google Reviews API Diagnostic Information');
            console.log('Place ID:', this.config.placeId);
            console.log('Using fallback reviews:', this.fallbackReviews.length, 'reviews');
            console.log('Error state:', this.hasError);
            console.log('Last error:', this.lastError);
            console.log('Cache status:', this.isCacheValid() ? 'Valid' : 'Invalid/Empty');
            console.groupEnd();

            // Optional: Show a subtle notice to developers
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.warn('💡 Development Mode: Check console for Google Reviews API diagnostic information');
            }
        }
    }
    
    /**
     * Public method to refresh reviews
     */
    async refreshReviews() {
        localStorage.removeItem('google_reviews_cache');
        await this.fetchGoogleReviews();
    }
}

// Initialize Google Reviews when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google Reviews API
    window.googleReviews = new GoogleReviewsAPI();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleReviewsAPI;
}
