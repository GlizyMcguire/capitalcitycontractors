/**
 * Advanced Analytics & Conversion Tracking System
 * Comprehensive tracking for business growth optimization
 */

// Analytics Configuration
const ANALYTICS_CONFIG = {
    // Google Analytics 4
    ga4: {
        measurementId: 'G-XXXXXXXXXX', // Replace with actual GA4 ID
        enabled: true
    },
    
    // Google Ads Conversion Tracking
    googleAds: {
        conversionId: 'AW-XXXXXXXXXX', // Replace with actual conversion ID
        enabled: true
    },
    
    // Facebook Pixel
    facebookPixel: {
        pixelId: 'XXXXXXXXXXXXXXXXX', // Replace with actual pixel ID
        enabled: true
    },
    
    // Heat mapping tools
    heatMapping: {
        hotjar: {
            siteId: 'XXXXXXX', // Replace with actual Hotjar site ID
            enabled: false // Set to true when ready
        },
        crazyEgg: {
            accountNumber: 'XXXXXXXX', // Replace with actual Crazy Egg account
            enabled: false // Set to true when ready
        }
    },
    
    // Custom event tracking
    customEvents: {
        enabled: true,
        debug: false // Set to true for debugging
    }
};

/**
 * Initialize Analytics Systems
 */
function initializeAnalytics() {
    // Initialize Google Analytics 4
    if (ANALYTICS_CONFIG.ga4.enabled) {
        initializeGA4();
    }
    
    // Initialize Google Ads Conversion Tracking
    if (ANALYTICS_CONFIG.googleAds.enabled) {
        initializeGoogleAds();
    }
    
    // Initialize Facebook Pixel
    if (ANALYTICS_CONFIG.facebookPixel.enabled) {
        initializeFacebookPixel();
    }
    
    // Initialize Heat Mapping Tools
    initializeHeatMapping();
    
    // Set up custom event tracking
    setupCustomEventTracking();
    
    // Track page view
    trackPageView();
    
    console.log('🎯 Analytics & Conversion Tracking Initialized');
}

/**
 * Initialize Google Analytics 4
 */
function initializeGA4() {
    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.ga4.measurementId}`;
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', ANALYTICS_CONFIG.ga4.measurementId, {
        // Enhanced ecommerce and conversion tracking
        send_page_view: true,
        allow_google_signals: true,
        allow_ad_personalization_signals: true,
        
        // Custom parameters for contractor business
        custom_map: {
            'custom_parameter_1': 'service_type',
            'custom_parameter_2': 'project_size',
            'custom_parameter_3': 'lead_source'
        }
    });
    
    if (ANALYTICS_CONFIG.customEvents.debug) {
        console.log('✅ Google Analytics 4 initialized');
    }
}

/**
 * Initialize Google Ads Conversion Tracking
 */
function initializeGoogleAds() {
    // Google Ads conversion tracking will be handled through gtag
    // This is set up in the GA4 initialization
    
    if (ANALYTICS_CONFIG.customEvents.debug) {
        console.log('✅ Google Ads conversion tracking ready');
    }
}

/**
 * Initialize Facebook Pixel
 */
function initializeFacebookPixel() {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', ANALYTICS_CONFIG.facebookPixel.pixelId);
    fbq('track', 'PageView');
    
    if (ANALYTICS_CONFIG.customEvents.debug) {
        console.log('✅ Facebook Pixel initialized');
    }
}

/**
 * Initialize Heat Mapping Tools
 */
function initializeHeatMapping() {
    // Hotjar
    if (ANALYTICS_CONFIG.heatMapping.hotjar.enabled) {
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:ANALYTICS_CONFIG.heatMapping.hotjar.siteId,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        
        if (ANALYTICS_CONFIG.customEvents.debug) {
            console.log('✅ Hotjar initialized');
        }
    }
    
    // Crazy Egg
    if (ANALYTICS_CONFIG.heatMapping.crazyEgg.enabled) {
        setTimeout(function(){
            var a=document.createElement("script");
            var b=document.getElementsByTagName("script")[0];
            a.src=document.location.protocol+"//script.crazyegg.com/pages/scripts/"+ANALYTICS_CONFIG.heatMapping.crazyEgg.accountNumber+"/"+Math.random()*99999999+".js";
            a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b)
        }, 1);
        
        if (ANALYTICS_CONFIG.customEvents.debug) {
            console.log('✅ Crazy Egg initialized');
        }
    }
}

/**
 * Track Page View
 */
function trackPageView() {
    const pageData = {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        content_group1: getContentGroup(),
        custom_parameter_1: getServiceType(),
        custom_parameter_2: getProjectSize(),
        custom_parameter_3: getLeadSource()
    };
    
    // GA4 page view
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', pageData);
    }
    
    // Facebook Pixel page view
    if (typeof fbq !== 'undefined') {
        fbq('track', 'PageView', {
            content_name: document.title,
            content_category: getContentGroup()
        });
    }
    
    if (ANALYTICS_CONFIG.customEvents.debug) {
        console.log('📊 Page view tracked:', pageData);
    }
}

/**
 * Track Conversion Events
 */
function trackConversion(conversionType, value = 0, currency = 'CAD', additionalData = {}) {
    const conversionData = {
        event_category: 'conversion',
        event_label: conversionType,
        value: value,
        currency: currency,
        ...additionalData
    };
    
    // GA4 conversion tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            send_to: `${ANALYTICS_CONFIG.googleAds.conversionId}/${getConversionLabel(conversionType)}`,
            value: value,
            currency: currency,
            transaction_id: generateTransactionId()
        });
        
        // Also track as custom event
        gtag('event', conversionType, conversionData);
    }
    
    // Facebook Pixel conversion
    if (typeof fbq !== 'undefined') {
        const fbEventName = getFacebookEventName(conversionType);
        fbq('track', fbEventName, {
            value: value,
            currency: currency,
            content_name: conversionType
        });
    }
    
    // Hotjar event
    if (typeof hj !== 'undefined') {
        hj('event', conversionType);
    }
    
    if (ANALYTICS_CONFIG.customEvents.debug) {
        console.log('🎯 Conversion tracked:', conversionType, conversionData);
    }
}

/**
 * Track Lead Generation Events
 */
function trackLead(leadType, leadValue = 25, leadSource = 'website') {
    trackConversion('lead_generation', leadValue, 'CAD', {
        lead_type: leadType,
        lead_source: leadSource,
        event_category: 'lead_generation'
    });
    
    // Additional lead-specific tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'generate_lead', {
            event_category: 'lead_generation',
            event_label: leadType,
            value: leadValue,
            currency: 'CAD'
        });
    }
}

/**
 * Track Quote Requests
 */
function trackQuoteRequest(serviceType, projectSize = 'medium') {
    trackConversion('quote_request', 50, 'CAD', {
        service_type: serviceType,
        project_size: projectSize,
        event_category: 'quote_request'
    });
}

/**
 * Track Phone Calls
 */
function trackPhoneCall(callSource = 'website') {
    trackConversion('phone_call', 30, 'CAD', {
        call_source: callSource,
        event_category: 'phone_call'
    });
}

/**
 * Track Email Signups
 */
function trackEmailSignup(signupSource = 'newsletter') {
    trackLead('email_signup', 15, signupSource);
}

/**
 * Track File Downloads
 */
function trackDownload(fileName, fileType = 'pdf') {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'file_download', {
            event_category: 'engagement',
            event_label: fileName,
            file_name: fileName,
            file_extension: fileType
        });
    }
    
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: fileName,
            content_category: 'download'
        });
    }
}

/**
 * Track Form Interactions
 */
function trackFormInteraction(formName, interactionType, fieldName = '') {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_interaction', {
            event_category: 'form',
            event_label: `${formName}_${interactionType}`,
            form_name: formName,
            interaction_type: interactionType,
            field_name: fieldName
        });
    }
}

/**
 * Track Scroll Depth
 */
function trackScrollDepth() {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 90, 100];
    
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && maxScroll < milestone + 5) {
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll', {
                            event_category: 'engagement',
                            event_label: `${milestone}%`,
                            value: milestone
                        });
                    }
                }
            });
        }
    });
}

/**
 * Setup Custom Event Tracking
 */
function setupCustomEventTracking() {
    // Track all phone number clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('a[href^="tel:"]')) {
            trackPhoneCall('click');
        }
    });
    
    // Track all email clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('a[href^="mailto:"]')) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_click', {
                    event_category: 'contact',
                    event_label: 'email_link'
                });
            }
        }
    });
    
    // Track external link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.hostname !== window.location.hostname) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'outbound',
                    event_label: link.href,
                    transport_type: 'beacon'
                });
            }
        }
    });
    
    // Track scroll depth
    trackScrollDepth();
    
    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        if (typeof gtag !== 'undefined' && timeOnPage > 10) {
            gtag('event', 'timing_complete', {
                name: 'time_on_page',
                value: timeOnPage
            });
        }
    });
}

/**
 * Helper Functions
 */
function getContentGroup() {
    const path = window.location.pathname;
    if (path.includes('blog')) return 'blog';
    if (path.includes('services')) return 'services';
    if (path.includes('portfolio')) return 'portfolio';
    if (path.includes('about')) return 'about';
    if (path.includes('contact')) return 'contact';
    return 'home';
}

function getServiceType() {
    const path = window.location.pathname;
    const search = window.location.search;
    
    if (path.includes('painting') || search.includes('painting')) return 'painting';
    if (path.includes('drywall') || search.includes('drywall')) return 'drywall';
    if (path.includes('renovation') || search.includes('renovation')) return 'renovation';
    if (path.includes('flooring') || search.includes('flooring')) return 'flooring';
    
    return 'general';
}

function getProjectSize() {
    // This could be determined by form data or URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('project_size') || 'unknown';
}

function getLeadSource() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const referrer = document.referrer;
    
    if (utmSource) return utmSource;
    if (referrer.includes('google')) return 'google_organic';
    if (referrer.includes('facebook')) return 'facebook';
    if (referrer.includes('instagram')) return 'instagram';
    if (referrer) return 'referral';
    
    return 'direct';
}

function getConversionLabel(conversionType) {
    const labels = {
        'quote_request': 'QUOTE_LABEL',
        'phone_call': 'PHONE_LABEL',
        'lead_generation': 'LEAD_LABEL',
        'email_signup': 'EMAIL_LABEL'
    };
    
    return labels[conversionType] || 'DEFAULT_LABEL';
}

function getFacebookEventName(conversionType) {
    const eventMap = {
        'quote_request': 'Lead',
        'phone_call': 'Contact',
        'lead_generation': 'Lead',
        'email_signup': 'CompleteRegistration'
    };
    
    return eventMap[conversionType] || 'CustomEvent';
}

function generateTransactionId() {
    return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Export functions for global use
window.AnalyticsTracker = {
    trackConversion,
    trackLead,
    trackQuoteRequest,
    trackPhoneCall,
    trackEmailSignup,
    trackDownload,
    trackFormInteraction,
    config: ANALYTICS_CONFIG
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalytics);
} else {
    initializeAnalytics();
}
