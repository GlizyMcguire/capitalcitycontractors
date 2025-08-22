// Review Management System - Display Logic
// This file automatically displays reviews from the reviews.js data file

class ReviewManager {
    constructor() {
        this.reviews = reviewsData || [];
        this.init();
    }

    init() {
        this.displayReviews();
        this.updateRatingDisplay();
    }

    // Display reviews as a slideshow with navigation
    displayReviews() {
        const reviewsContainer = document.querySelector('#testimonials-container');
        if (!reviewsContainer) return;

        this.currentReviewIndex = 0;
        this.totalReviews = this.reviews.length;

        // Create slideshow structure
        this.createSlideshow(reviewsContainer);
        this.displayCurrentReview();
    }

    // Create slideshow structure
    createSlideshow(container) {
        container.innerHTML = `
            <div class="testimonial-card-container">
                <button class="card-nav-btn prev-btn" id="prevReviewBtn">
                    <i class="fas fa-chevron-left"></i>
                </button>

                <div class="testimonial-card" id="currentReviewCard">
                    <!-- Review content will be inserted here -->
                </div>

                <button class="card-nav-btn next-btn" id="nextReviewBtn">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        // Add event listeners
        const prevBtn = document.getElementById('prevReviewBtn');
        const nextBtn = document.getElementById('nextReviewBtn');

        prevBtn.addEventListener('click', () => this.previousReview());
        nextBtn.addEventListener('click', () => this.nextReview());
    }

    // Display current review in the slideshow
    displayCurrentReview() {
        const reviewCard = document.getElementById('currentReviewCard');
        const prevBtn = document.getElementById('prevReviewBtn');
        const nextBtn = document.getElementById('nextReviewBtn');

        if (!reviewCard || !this.reviews[this.currentReviewIndex]) return;

        const review = this.reviews[this.currentReviewIndex];
        const initials = this.getCustomerInitials(review.customerName);
        const formattedDate = this.formatDate(review.date);

        reviewCard.innerHTML = `
            <div class="testimonial-header">
                <div class="customer-info">
                    <div class="customer-avatar" style="background: ${this.getAvatarColor(review.customerName)}">
                        <span class="avatar-initials">${initials}</span>
                    </div>
                    <div class="customer-details">
                        <h4 class="customer-name">${review.customerName}</h4>
                        <div class="customer-rating">
                            ${this.generateStars(review.rating)}
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
        `;

        // Update button states
        prevBtn.disabled = this.currentReviewIndex === 0;
        nextBtn.disabled = this.currentReviewIndex === this.totalReviews - 1;
    }

    // Navigate to previous review
    previousReview() {
        if (this.currentReviewIndex > 0) {
            this.currentReviewIndex--;
            this.displayCurrentReview();
        }
    }

    // Navigate to next review
    nextReview() {
        if (this.currentReviewIndex < this.totalReviews - 1) {
            this.currentReviewIndex++;
            this.displayCurrentReview();
        }
    }

    // Get customer initials for avatar
    getCustomerInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    // Generate consistent avatar colors based on name
    getAvatarColor(name) {
        const colors = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
        ];

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }

    // Format date nicely
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 7) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffDays <= 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else {
            const months = Math.floor(diffDays / 30);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        }
    }

    // Generate star rating HTML
    generateStars(rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHTML += '<i class="fas fa-star"></i>';
            } else {
                starsHTML += '<i class="far fa-star"></i>';
            }
        }
        return starsHTML;
    }

    // Update the rating display in the header
    updateRatingDisplay() {
        const ratingText = document.querySelector('.rating-text');
        const ratingStars = document.querySelector('.rating-stars');
        
        if (ratingText) {
            const avgRating = calculateAverageRating();
            const totalReviews = this.reviews.length;
            ratingText.textContent = `${avgRating} on Google Reviews (${totalReviews} reviews)`;
        }

        if (ratingStars) {
            const avgRating = parseFloat(calculateAverageRating());
            ratingStars.innerHTML = this.generateStars(Math.round(avgRating));
        }
    }

    // Add a new review (for future use)
    addReview(reviewData) {
        this.reviews.push(reviewData);
        this.displayReviews();
        this.updateRatingDisplay();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure reviews data is loaded
    setTimeout(() => {
        if (typeof reviewsData !== 'undefined') {
            new ReviewManager();
        }
    }, 100);
});
