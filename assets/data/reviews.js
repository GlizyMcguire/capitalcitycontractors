// Capital City Contractors - Customer Reviews Data
// Professional Review Management System
//
// CURRENT STATUS: Service-Area Business (No Physical Storefront)
// Capital City Contractors serves Ottawa and surrounding areas as a mobile service business
//
// HOW TO ADD NEW REVIEWS:
// 1. Copy a review from Google Business Profile (when available)
// 2. Add it to the reviewsData array below
// 3. Save this file
// 4. Your website will automatically show the new review!
//
// GOOGLE BUSINESS PROFILE SETUP:
// For service-area businesses like contractors, create a Google Business Profile
// without a physical address - focus on service areas (Ottawa, Kanata, etc.)

const reviewsData = [
    {
        id: 1,
        customerName: "Moe Chamma",
        rating: 5,
        reviewText: "I had my rental unit renovated by CCC and was stunned by the quality and service they provided. Adam is a great person to deal with and he provided 100% customer satisfaction at all time. Workmanship was excellent and I Highly recommend for any of your upcoming projects! See the before and after pictures",
        service: "Interior Painting",
        date: "2024-05-12",
        verified: true
    },
    {
        id: 2,
        customerName: "Tamer Salem", 
        rating: 5,
        reviewText: "Hired this company to paint my house before selling it, and they did a fantastic job. I would highly recommend them for professionalism and fair pricing",
        service: "Interior Painting",
        date: "2024-05-11",
        verified: true
    },
    {
        id: 3,
        customerName: "Adam Zein",
        rating: 5,
        reviewText: "Had them do my whole basement after a flooding and they were great. Great prices and great turn around time.",
        service: "Multiple Services", 
        date: "2023-10-01",
        verified: true
    },
    {
        id: 4,
        customerName: "Al Cham",
        rating: 5,
        reviewText: "Very honest and amazing prices. Gave them my budget and they made my kitchen look brand new. Will definitely call them for any future work. I would totally recommend. Thank you again guys",
        service: "Multiple Services",
        date: "2023-10-01",
        verified: true
    },
    {
        id: 5,
        customerName: "Sarah M.",
        rating: 5,
        reviewText: "Capital City Contractors transformed our living room with professional painting and drywall repair. Adam and his team were punctual, clean, and delivered exactly what they promised. Highly recommend for anyone in the Ottawa area!",
        service: "Interior Painting & Drywall",
        date: "2024-03-15",
        verified: true
    },
    {
        id: 6,
        customerName: "Mike R.",
        rating: 5,
        reviewText: "Excellent service from start to finish. They provided a detailed quote, completed the work on time, and the quality exceeded our expectations. Will definitely use them again for future projects.",
        service: "Home Renovation",
        date: "2024-02-28",
        verified: true
    }

    // TO ADD A NEW REVIEW, COPY THIS TEMPLATE:
    /*
    ,{
        id: 4, // Increase the number
        customerName: "Customer Name Here",
        rating: 5, // 1-5 stars
        reviewText: "Copy the review text from Google here...",
        service: "Service Type (Painting, Drywall, Carpet, etc.)",
        date: "2024-MM-DD", // Date of review
        verified: true // Always keep as true
    }
    */
];

// Calculate average rating automatically
const calculateAverageRating = () => {
    const total = reviewsData.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviewsData.length).toFixed(1);
};

// Get total number of reviews
const getTotalReviews = () => {
    return reviewsData.length;
};

// Export for use in website
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { reviewsData, calculateAverageRating, getTotalReviews };
}
