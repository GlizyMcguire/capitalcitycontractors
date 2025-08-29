/**
 * API Configuration for Capital City Contractors
 * Secure configuration management for Google Places API
 * 
 * IMPORTANT SECURITY NOTES:
 * 1. Never commit actual API keys to version control
 * 2. Use environment variables in production
 * 3. Implement proper API key restrictions in Google Cloud Console
 * 4. Monitor API usage and set up billing alerts
 */

// API Configuration
const API_CONFIG = {
    // Google Places API Configuration
    google: {
        // Place ID for Capital City Contractors
        // This is public information and safe to include
        placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
        
        // API Key - MUST be set via environment variable or server configuration
        // DO NOT hardcode the actual API key here
        apiKey: null, // Will be loaded from server-side configuration
        
        // API Settings
        settings: {
            maxReviews: 5,
            minRating: 4,
            fields: 'reviews,rating,user_ratings_total,name',
            cacheTimeout: 3600000, // 1 hour in milliseconds
            retryAttempts: 3,
            retryDelay: 2000 // 2 seconds
        }
    },
    
    // Rate Limiting Configuration
    rateLimiting: {
        enabled: true,
        requestsPerHour: 100,
        requestsPerDay: 1000,
        burstLimit: 10 // Max requests in 1 minute
    },
    
    // Error Handling Configuration
    errorHandling: {
        enableFallback: true,
        logErrors: true,
        showUserErrors: false, // Don't show technical errors to users
        fallbackMessage: 'Showing recent customer reviews'
    },
    
    // Security Configuration
    security: {
        allowedOrigins: [
            'https://capitalcitycontractors.ca',
            'https://www.capitalcitycontractors.ca'
        ],
        enableCORS: true,
        validateReferer: true
    }
};

// Development Configuration (for local testing)
const DEV_CONFIG = {
    ...API_CONFIG,
    security: {
        ...API_CONFIG.security,
        allowedOrigins: [
            ...API_CONFIG.security.allowedOrigins,
            'http://localhost',
            'http://127.0.0.1',
            'http://localhost:3000',
            'http://localhost:8080'
        ]
    },
    errorHandling: {
        ...API_CONFIG.errorHandling,
        showUserErrors: true, // Show errors in development
        logErrors: true
    }
};

// Environment Detection
function getEnvironment() {
    if (typeof window !== 'undefined') {
        // Client-side environment detection
        const hostname = window.location.hostname;
        return hostname === 'localhost' || hostname === '127.0.0.1' ? 'development' : 'production';
    } else if (typeof process !== 'undefined' && process.env) {
        // Server-side environment detection
        return process.env.NODE_ENV || 'production';
    }
    return 'production';
}

// Get Configuration Based on Environment
function getConfig() {
    const env = getEnvironment();
    return env === 'development' ? DEV_CONFIG : API_CONFIG;
}

// API Key Management
function getApiKey() {
    // Priority order for API key sources:
    // 1. Environment variable (server-side)
    // 2. Server-side configuration
    // 3. Client-side configuration (not recommended for production)
    
    if (typeof process !== 'undefined' && process.env) {
        // Server-side: Use environment variable
        return process.env.GOOGLE_PLACES_API_KEY;
    }
    
    if (typeof window !== 'undefined' && window.GOOGLE_PLACES_API_KEY) {
        // Client-side: Use global variable (set by server)
        return window.GOOGLE_PLACES_API_KEY;
    }
    
    // No API key found
    return null;
}

// Validation Functions
function validateConfig(config) {
    const errors = [];
    
    if (!config.google.placeId) {
        errors.push('Google Place ID is required');
    }
    
    if (!getApiKey()) {
        errors.push('Google Places API key is not configured');
    }
    
    if (config.google.settings.maxReviews < 1 || config.google.settings.maxReviews > 10) {
        errors.push('maxReviews must be between 1 and 10');
    }
    
    if (config.google.settings.minRating < 1 || config.google.settings.minRating > 5) {
        errors.push('minRating must be between 1 and 5');
    }
    
    return errors;
}

// Configuration Initialization
function initializeConfig() {
    const config = getConfig();
    const errors = validateConfig(config);
    
    if (errors.length > 0) {
        console.warn('API Configuration Issues:', errors);
        
        if (config.errorHandling.logErrors) {
            // Log configuration errors
            console.error('Google Reviews API Configuration Errors:', {
                errors: errors,
                environment: getEnvironment(),
                timestamp: new Date().toISOString()
            });
        }
    }
    
    return config;
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    // Node.js/Server-side export
    module.exports = {
        getConfig,
        getApiKey,
        validateConfig,
        initializeConfig,
        API_CONFIG,
        DEV_CONFIG
    };
} else if (typeof window !== 'undefined') {
    // Browser/Client-side export
    window.API_CONFIG = getConfig();
    window.getApiKey = getApiKey;
    window.initializeConfig = initializeConfig;
}

// Instructions for Setup
console.log(`
🔧 Google Reviews API Setup Instructions:

1. GET GOOGLE PLACES API KEY:
   - Go to Google Cloud Console (console.cloud.google.com)
   - Create a new project or select existing project
   - Enable the Places API
   - Create credentials (API Key)
   - Restrict the API key to your domain

2. CONFIGURE API KEY:
   Server-side (Recommended):
   - Set environment variable: GOOGLE_PLACES_API_KEY=your_api_key_here
   - Or configure in your server's configuration file

   Client-side (Not recommended for production):
   - Set window.GOOGLE_PLACES_API_KEY = 'your_api_key_here'

3. VERIFY PLACE ID:
   - Current Place ID: ${API_CONFIG.google.placeId}
   - Verify this is correct for Capital City Contractors
   - Use Google Place ID Finder if needed

4. TEST THE INTEGRATION:
   - Check browser console for any errors
   - Verify reviews are loading in the testimonials section
   - Test fallback functionality by temporarily disabling API

For support, check the documentation or contact the development team.
`);
