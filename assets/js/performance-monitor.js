/**
 * Performance Monitoring Script
 * Tracks Core Web Vitals and provides performance insights
 */

// Performance monitoring configuration
const PERFORMANCE_CONFIG = {
    enableLogging: true,
    enableReporting: false, // Set to true to send data to analytics
    thresholds: {
        LCP: 2500, // Largest Contentful Paint (ms)
        FID: 100,  // First Input Delay (ms)
        CLS: 0.1   // Cumulative Layout Shift
    }
};

// Performance metrics storage
let performanceMetrics = {
    navigationStart: 0,
    domContentLoaded: 0,
    loadComplete: 0,
    firstPaint: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0
};

/**
 * Initialize performance monitoring
 */
function initPerformanceMonitoring() {
    // Record navigation start
    performanceMetrics.navigationStart = performance.timeOrigin;
    
    // Monitor DOM Content Loaded
    document.addEventListener('DOMContentLoaded', () => {
        performanceMetrics.domContentLoaded = performance.now();
        logMetric('DOM Content Loaded', performanceMetrics.domContentLoaded);
    });
    
    // Monitor window load
    window.addEventListener('load', () => {
        performanceMetrics.loadComplete = performance.now();
        logMetric('Window Load Complete', performanceMetrics.loadComplete);
        
        // Get paint metrics
        getPaintMetrics();
        
        // Get Core Web Vitals
        getCoreWebVitals();
        
        // Generate performance report
        setTimeout(generatePerformanceReport, 1000);
    });
}

/**
 * Get paint timing metrics
 */
function getPaintMetrics() {
    const paintEntries = performance.getEntriesByType('paint');
    
    paintEntries.forEach(entry => {
        if (entry.name === 'first-paint') {
            performanceMetrics.firstPaint = entry.startTime;
            logMetric('First Paint', entry.startTime);
        } else if (entry.name === 'first-contentful-paint') {
            performanceMetrics.firstContentfulPaint = entry.startTime;
            logMetric('First Contentful Paint', entry.startTime);
        }
    });
}

/**
 * Get Core Web Vitals using Web Vitals library approach
 */
function getCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                performanceMetrics.largestContentfulPaint = lastEntry.startTime;
                logMetric('Largest Contentful Paint', lastEntry.startTime);
                
                // Check if LCP is within good threshold
                const lcpStatus = lastEntry.startTime <= PERFORMANCE_CONFIG.thresholds.LCP ? 'GOOD' : 'NEEDS IMPROVEMENT';
                logMetric('LCP Status', lcpStatus);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.warn('LCP monitoring not supported');
        }
        
        // First Input Delay (FID)
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    performanceMetrics.firstInputDelay = entry.processingStart - entry.startTime;
                    logMetric('First Input Delay', performanceMetrics.firstInputDelay);
                    
                    const fidStatus = performanceMetrics.firstInputDelay <= PERFORMANCE_CONFIG.thresholds.FID ? 'GOOD' : 'NEEDS IMPROVEMENT';
                    logMetric('FID Status', fidStatus);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.warn('FID monitoring not supported');
        }
        
        // Cumulative Layout Shift (CLS)
        try {
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                performanceMetrics.cumulativeLayoutShift = clsValue;
                logMetric('Cumulative Layout Shift', clsValue);
                
                const clsStatus = clsValue <= PERFORMANCE_CONFIG.thresholds.CLS ? 'GOOD' : 'NEEDS IMPROVEMENT';
                logMetric('CLS Status', clsStatus);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.warn('CLS monitoring not supported');
        }
    }
}

/**
 * Log performance metric
 */
function logMetric(name, value) {
    if (PERFORMANCE_CONFIG.enableLogging) {
        const formattedValue = typeof value === 'number' ? `${Math.round(value)}ms` : value;
        console.log(`🚀 Performance: ${name} - ${formattedValue}`);
    }
}

/**
 * Generate comprehensive performance report
 */
function generatePerformanceReport() {
    const report = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        connection: getConnectionInfo(),
        metrics: performanceMetrics,
        resourceTiming: getResourceTiming(),
        recommendations: generateRecommendations()
    };
    
    if (PERFORMANCE_CONFIG.enableLogging) {
        console.group('📊 Performance Report');
        console.table(performanceMetrics);
        console.log('🔍 Recommendations:', report.recommendations);
        console.groupEnd();
    }
    
    // Store report for potential analytics
    window.performanceReport = report;
    
    return report;
}

/**
 * Get connection information
 */
function getConnectionInfo() {
    if ('connection' in navigator) {
        return {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt
        };
    }
    return null;
}

/**
 * Get resource timing information
 */
function getResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    const resourceSummary = {
        totalResources: resources.length,
        totalSize: 0,
        slowestResource: null,
        resourceTypes: {}
    };
    
    let slowestTime = 0;
    
    resources.forEach(resource => {
        const duration = resource.responseEnd - resource.startTime;
        const type = getResourceType(resource.name);
        
        if (!resourceSummary.resourceTypes[type]) {
            resourceSummary.resourceTypes[type] = { count: 0, totalTime: 0 };
        }
        
        resourceSummary.resourceTypes[type].count++;
        resourceSummary.resourceTypes[type].totalTime += duration;
        
        if (duration > slowestTime) {
            slowestTime = duration;
            resourceSummary.slowestResource = {
                name: resource.name,
                duration: Math.round(duration),
                type: type
            };
        }
        
        if (resource.transferSize) {
            resourceSummary.totalSize += resource.transferSize;
        }
    });
    
    return resourceSummary;
}

/**
 * Determine resource type from URL
 */
function getResourceType(url) {
    if (url.includes('.css')) return 'CSS';
    if (url.includes('.js')) return 'JavaScript';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'Image';
    if (url.includes('font')) return 'Font';
    return 'Other';
}

/**
 * Generate performance recommendations
 */
function generateRecommendations() {
    const recommendations = [];
    
    // LCP recommendations
    if (performanceMetrics.largestContentfulPaint > PERFORMANCE_CONFIG.thresholds.LCP) {
        recommendations.push('Consider optimizing images and preloading critical resources to improve LCP');
    }
    
    // FID recommendations
    if (performanceMetrics.firstInputDelay > PERFORMANCE_CONFIG.thresholds.FID) {
        recommendations.push('Reduce JavaScript execution time to improve FID');
    }
    
    // CLS recommendations
    if (performanceMetrics.cumulativeLayoutShift > PERFORMANCE_CONFIG.thresholds.CLS) {
        recommendations.push('Add size attributes to images and reserve space for dynamic content to improve CLS');
    }
    
    // General recommendations
    if (performanceMetrics.domContentLoaded > 1500) {
        recommendations.push('Consider reducing DOM complexity or deferring non-critical JavaScript');
    }
    
    return recommendations;
}

// Initialize performance monitoring when script loads
initPerformanceMonitoring();

// Export for external use
window.PerformanceMonitor = {
    getMetrics: () => performanceMetrics,
    generateReport: generatePerformanceReport,
    config: PERFORMANCE_CONFIG
};
