/**
 * API Configuration & Security Module
 * Capital City Contractors
 * 
 * IMPORTANT SECURITY NOTES:
 * - These keys are visible in client-side code (this is unavoidable for static sites)
 * - Security is enforced through API restrictions in Google Cloud Console and EmailJS
 * - Always restrict keys to your domain and specific APIs
 * - Monitor usage regularly for unusual activity
 */

const API_SECURITY_CONFIG = {
    // Google Places API Configuration
    google: {
        apiKey: 'AIzaSyCoYgZoPvlBxiR2ud7OuWJxF5ChnG5_Dr8',
        
        // Security settings (enforced in Google Cloud Console)
        restrictions: {
            allowedDomains: [
                'https://capitalcitycontractors.ca',
                'https://www.capitalcitycontractors.ca'
            ],
            allowedAPIs: ['Places API'],
            quotaLimit: 1000 // requests per day
        },
        
        // Rate limiting (client-side)
        rateLimiting: {
            enabled: true,
            maxRequestsPerMinute: 10,
            maxRequestsPerHour: 100
        }
    },
    
    // EmailJS Configuration
    emailjs: {
        publicKey: 'Ej7_wQOBOKJhHgJhJ',
        serviceId: 'service_8h9k2lm',
        templates: {
            quoteRequest: 'template_quote_request',
            discountWelcome: 'template_lr9bhr9',
            discountBusiness: 'template_discount_business'
        },
        
        // Security settings (enforced in EmailJS dashboard)
        restrictions: {
            allowedDomains: [
                'https://capitalcitycontractors.ca',
                'https://www.capitalcitycontractors.ca'
            ],
            reCaptchaEnabled: false // Set to true when configured
        },
        
        // Rate limiting (client-side)
        rateLimiting: {
            enabled: true,
            maxEmailsPerMinute: 2,
            maxEmailsPerHour: 10,
            cooldownPeriod: 60000 // 1 minute in milliseconds
        }
    },
    
    // Security monitoring
    monitoring: {
        enabled: true,
        logToConsole: true,
        trackUsage: true,
        alertOnSuspiciousActivity: true
    }
};

/**
 * Rate Limiter Class
 * Prevents abuse by limiting request frequency
 */
class RateLimiter {
    constructor(maxPerMinute, maxPerHour) {
        this.maxPerMinute = maxPerMinute;
        this.maxPerHour = maxPerHour;
        this.requests = [];
    }
    
    /**
     * Check if request is allowed
     */
    isAllowed() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        const oneHourAgo = now - 3600000;
        
        // Remove old requests
        this.requests = this.requests.filter(time => time > oneHourAgo);
        
        // Count recent requests
        const requestsLastMinute = this.requests.filter(time => time > oneMinuteAgo).length;
        const requestsLastHour = this.requests.length;
        
        // Check limits
        if (requestsLastMinute >= this.maxPerMinute) {
            console.warn('⚠️ Rate limit exceeded: Too many requests per minute');
            return false;
        }
        
        if (requestsLastHour >= this.maxPerHour) {
            console.warn('⚠️ Rate limit exceeded: Too many requests per hour');
            return false;
        }
        
        // Allow request and track it
        this.requests.push(now);
        return true;
    }
    
    /**
     * Get time until next request is allowed
     */
    getTimeUntilNextRequest() {
        if (this.requests.length === 0) return 0;
        
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        const recentRequests = this.requests.filter(time => time > oneMinuteAgo);
        
        if (recentRequests.length >= this.maxPerMinute) {
            const oldestRecent = Math.min(...recentRequests);
            return Math.ceil((oldestRecent + 60000 - now) / 1000); // seconds
        }
        
        return 0;
    }
}

/**
 * Security Monitor Class
 * Tracks and logs API usage
 */
class SecurityMonitor {
    constructor() {
        this.usageLog = [];
        this.suspiciousActivity = [];
    }
    
    /**
     * Log API request
     */
    logRequest(apiName, endpoint, success = true) {
        const entry = {
            api: apiName,
            endpoint: endpoint,
            timestamp: new Date().toISOString(),
            success: success,
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
        
        this.usageLog.push(entry);
        
        // Keep only last 100 entries
        if (this.usageLog.length > 100) {
            this.usageLog.shift();
        }
        
        // Check for suspicious patterns
        this.checkForSuspiciousActivity();
        
        if (API_SECURITY_CONFIG.monitoring.logToConsole) {
            console.log(`📊 API Request: ${apiName} - ${endpoint} - ${success ? '✅' : '❌'}`);
        }
    }
    
    /**
     * Check for suspicious activity patterns
     */
    checkForSuspiciousActivity() {
        const recentRequests = this.usageLog.filter(entry => {
            const entryTime = new Date(entry.timestamp).getTime();
            const fiveMinutesAgo = Date.now() - 300000;
            return entryTime > fiveMinutesAgo;
        });
        
        // Alert if too many requests in short time
        if (recentRequests.length > 50) {
            this.logSuspiciousActivity('High request volume', recentRequests.length);
        }
        
        // Alert if many failed requests
        const failedRequests = recentRequests.filter(entry => !entry.success);
        if (failedRequests.length > 10) {
            this.logSuspiciousActivity('Multiple failed requests', failedRequests.length);
        }
    }
    
    /**
     * Log suspicious activity
     */
    logSuspiciousActivity(reason, details) {
        const alert = {
            reason: reason,
            details: details,
            timestamp: new Date().toISOString()
        };
        
        this.suspiciousActivity.push(alert);
        
        if (API_SECURITY_CONFIG.monitoring.alertOnSuspiciousActivity) {
            console.warn('🚨 SUSPICIOUS ACTIVITY DETECTED:', reason, details);
        }
    }
    
    /**
     * Get usage statistics
     */
    getUsageStats() {
        return {
            totalRequests: this.usageLog.length,
            successfulRequests: this.usageLog.filter(e => e.success).length,
            failedRequests: this.usageLog.filter(e => !e.success).length,
            suspiciousActivities: this.suspiciousActivity.length,
            recentRequests: this.usageLog.slice(-10)
        };
    }
}

// Initialize rate limiters
const googleRateLimiter = new RateLimiter(
    API_SECURITY_CONFIG.google.rateLimiting.maxRequestsPerMinute,
    API_SECURITY_CONFIG.google.rateLimiting.maxRequestsPerHour
);

const emailRateLimiter = new RateLimiter(
    API_SECURITY_CONFIG.emailjs.rateLimiting.maxEmailsPerMinute,
    API_SECURITY_CONFIG.emailjs.rateLimiting.maxEmailsPerHour
);

// Initialize security monitor
const securityMonitor = new SecurityMonitor();

/**
 * Secure API Request Wrapper
 * Adds rate limiting and monitoring to API calls
 */
const SecureAPI = {
    /**
     * Make a Google Places API request
     */
    async googlePlacesRequest(callback) {
        if (!API_SECURITY_CONFIG.google.rateLimiting.enabled || googleRateLimiter.isAllowed()) {
            try {
                const result = await callback();
                securityMonitor.logRequest('Google Places', 'autocomplete', true);
                return result;
            } catch (error) {
                securityMonitor.logRequest('Google Places', 'autocomplete', false);
                throw error;
            }
        } else {
            const waitTime = googleRateLimiter.getTimeUntilNextRequest();
            throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds.`);
        }
    },
    
    /**
     * Make an EmailJS request
     */
    async emailJSRequest(callback) {
        if (!API_SECURITY_CONFIG.emailjs.rateLimiting.enabled || emailRateLimiter.isAllowed()) {
            try {
                const result = await callback();
                securityMonitor.logRequest('EmailJS', 'send', true);
                return result;
            } catch (error) {
                securityMonitor.logRequest('EmailJS', 'send', false);
                throw error;
            }
        } else {
            const waitTime = emailRateLimiter.getTimeUntilNextRequest();
            throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds before sending another email.`);
        }
    },
    
    /**
     * Get security statistics
     */
    getSecurityStats() {
        return {
            config: API_SECURITY_CONFIG,
            usage: securityMonitor.getUsageStats(),
            rateLimits: {
                google: {
                    requestsRemaining: API_SECURITY_CONFIG.google.rateLimiting.maxRequestsPerMinute - googleRateLimiter.requests.length
                },
                emailjs: {
                    requestsRemaining: API_SECURITY_CONFIG.emailjs.rateLimiting.maxEmailsPerMinute - emailRateLimiter.requests.length
                }
            }
        };
    }
};

// Export for use in other scripts
window.API_SECURITY_CONFIG = API_SECURITY_CONFIG;
window.SecureAPI = SecureAPI;
window.securityMonitor = securityMonitor;

// Log initialization
console.log('🔒 API Security Module Loaded');
console.log('📊 Rate limiting enabled:', {
    google: API_SECURITY_CONFIG.google.rateLimiting.enabled,
    emailjs: API_SECURITY_CONFIG.emailjs.rateLimiting.enabled
});
console.log('🛡️ Security monitoring enabled:', API_SECURITY_CONFIG.monitoring.enabled);

