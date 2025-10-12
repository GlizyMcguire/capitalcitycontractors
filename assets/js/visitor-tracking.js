/**
 * Website Visitor Tracking System
 * Tracks real human visitors (filters out bots and crawlers)
 * Respects privacy - no personal data without consent
 */

class VisitorTracker {
    constructor() {
        this.storageKey = 'ccc_visitor_analytics';
        this.sessionKey = 'ccc_visitor_session';
        this.visitorIdKey = 'ccc_visitor_id';
        
        // Bot detection patterns
        this.botPatterns = [
            /bot/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i,
            /googlebot/i, /bingbot/i, /yandex/i, /baidu/i, /duckduck/i,
            /facebookexternalhit/i, /linkedinbot/i, /twitterbot/i,
            /whatsapp/i, /telegram/i, /slack/i, /discord/i,
            /headless/i, /phantom/i, /selenium/i, /webdriver/i,
            /preview/i, /prerender/i, /lighthouse/i, /pagespeed/i
        ];
        
        this.init();
    }
    
    init() {
        // Don't track if it's a bot
        if (this.isBot()) {
            console.log('🤖 Bot detected - skipping visitor tracking');
            return;
        }
        
        // Don't track if user has Do Not Track enabled
        if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
            console.log('🚫 Do Not Track enabled - skipping visitor tracking');
            return;
        }
        
        console.log('👤 Initializing visitor tracking');
        
        // Get or create visitor ID
        const visitorId = this.getOrCreateVisitorId();
        
        // Get or create session
        const session = this.getOrCreateSession(visitorId);
        
        // Track page view
        this.trackPageView(visitorId, session);
        
        // Track time on page
        this.trackTimeOnPage(session);
        
        // Track interactions (to verify human behavior)
        this.trackInteractions(session);
    }
    
    isBot() {
        const ua = navigator.userAgent;
        
        // Check user agent against bot patterns
        if (this.botPatterns.some(pattern => pattern.test(ua))) {
            return true;
        }
        
        // Check for headless browsers
        if (navigator.webdriver) {
            return true;
        }
        
        // Check for missing features that real browsers have
        if (!navigator.languages || navigator.languages.length === 0) {
            return true;
        }
        
        // Check for suspicious screen dimensions
        if (screen.width === 0 || screen.height === 0) {
            return true;
        }
        
        return false;
    }
    
    getOrCreateVisitorId() {
        let visitorId = localStorage.getItem(this.visitorIdKey);
        
        if (!visitorId) {
            // Create a unique visitor ID
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(this.visitorIdKey, visitorId);
        }
        
        return visitorId;
    }
    
    getOrCreateSession(visitorId) {
        const sessionData = sessionStorage.getItem(this.sessionKey);
        
        if (sessionData) {
            return JSON.parse(sessionData);
        }
        
        // Create new session
        const session = {
            id: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            visitorId: visitorId,
            startTime: new Date().toISOString(),
            pageViews: 0,
            interactions: 0,
            referrer: document.referrer || 'direct',
            landingPage: window.location.pathname,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language
        };
        
        sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
        return session;
    }
    
    trackPageView(visitorId, session) {
        // Update session
        session.pageViews++;
        session.lastPage = window.location.pathname;
        session.lastPageTime = new Date().toISOString();
        sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
        
        // Get analytics data
        const analytics = this.getAnalytics();
        
        // Record page view
        const pageView = {
            id: 'pv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            visitorId: visitorId,
            sessionId: session.id,
            page: window.location.pathname,
            title: document.title,
            referrer: document.referrer || 'direct',
            timestamp: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0]
        };
        
        analytics.pageViews.push(pageView);
        
        // Update visitor record
        let visitor = analytics.visitors.find(v => v.id === visitorId);
        if (!visitor) {
            visitor = {
                id: visitorId,
                firstVisit: new Date().toISOString(),
                lastVisit: new Date().toISOString(),
                totalPageViews: 0,
                totalSessions: 1,
                referrer: session.referrer,
                userAgent: session.userAgent
            };
            analytics.visitors.push(visitor);
        }
        
        visitor.lastVisit = new Date().toISOString();
        visitor.totalPageViews++;
        
        // Update daily stats
        const today = new Date().toISOString().split('T')[0];
        let dailyStat = analytics.dailyStats.find(d => d.date === today);
        if (!dailyStat) {
            dailyStat = {
                date: today,
                uniqueVisitors: new Set(),
                pageViews: 0,
                sessions: new Set()
            };
            analytics.dailyStats.push(dailyStat);
        }
        
        dailyStat.uniqueVisitors.add(visitorId);
        dailyStat.sessions.add(session.id);
        dailyStat.pageViews++;
        
        // Convert Sets to arrays for storage
        dailyStat.uniqueVisitors = Array.from(dailyStat.uniqueVisitors);
        dailyStat.sessions = Array.from(dailyStat.sessions);
        
        // Keep only last 90 days of page views
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
        analytics.pageViews = analytics.pageViews.filter(pv => pv.timestamp > ninetyDaysAgo);
        
        // Keep only last 90 days of daily stats
        analytics.dailyStats = analytics.dailyStats.filter(ds => ds.date > ninetyDaysAgo.split('T')[0]);
        
        this.saveAnalytics(analytics);
        
        console.log('📊 Page view tracked:', pageView.page);
    }
    
    trackTimeOnPage(session) {
        // Track when user leaves the page
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - new Date(session.lastPageTime).getTime();
            const analytics = this.getAnalytics();
            
            // Find the last page view and update time on page
            const lastPageView = analytics.pageViews[analytics.pageViews.length - 1];
            if (lastPageView) {
                lastPageView.timeOnPage = Math.round(timeOnPage / 1000); // in seconds
                this.saveAnalytics(analytics);
            }
        });
    }
    
    trackInteractions(session) {
        // Track clicks, scrolls, and other interactions to verify human behavior
        const trackInteraction = () => {
            session.interactions++;
            sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
        };
        
        // Track clicks
        document.addEventListener('click', trackInteraction, { once: true });
        
        // Track scrolling
        let scrolled = false;
        document.addEventListener('scroll', () => {
            if (!scrolled) {
                scrolled = true;
                trackInteraction();
            }
        }, { once: true });
        
        // Track mouse movement
        let mouseMoved = false;
        document.addEventListener('mousemove', () => {
            if (!mouseMoved) {
                mouseMoved = true;
                trackInteraction();
            }
        }, { once: true });
    }
    
    getAnalytics() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            return JSON.parse(data);
        }
        
        return {
            visitors: [],
            pageViews: [],
            dailyStats: []
        };
    }
    
    saveAnalytics(analytics) {
        localStorage.setItem(this.storageKey, JSON.stringify(analytics));
    }
    
    // Public method to get analytics summary
    static getAnalyticsSummary() {
        const tracker = new VisitorTracker();
        const analytics = tracker.getAnalytics();
        
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        // Calculate metrics
        const todayStats = analytics.dailyStats.find(d => d.date === today) || { uniqueVisitors: [], pageViews: 0 };
        const last7Days = analytics.dailyStats.filter(d => d.date >= sevenDaysAgo);
        const last30Days = analytics.dailyStats.filter(d => d.date >= thirtyDaysAgo);
        
        const uniqueVisitors7d = new Set(last7Days.flatMap(d => d.uniqueVisitors)).size;
        const uniqueVisitors30d = new Set(last30Days.flatMap(d => d.uniqueVisitors)).size;
        const pageViews7d = last7Days.reduce((sum, d) => sum + d.pageViews, 0);
        const pageViews30d = last30Days.reduce((sum, d) => sum + d.pageViews, 0);
        
        return {
            today: {
                visitors: todayStats.uniqueVisitors.length,
                pageViews: todayStats.pageViews
            },
            last7Days: {
                visitors: uniqueVisitors7d,
                pageViews: pageViews7d
            },
            last30Days: {
                visitors: uniqueVisitors30d,
                pageViews: pageViews30d
            },
            allTime: {
                visitors: analytics.visitors.length,
                pageViews: analytics.pageViews.length
            },
            dailyStats: analytics.dailyStats,
            recentPageViews: analytics.pageViews.slice(-50).reverse()
        };
    }
}

// Initialize visitor tracking when page loads
document.addEventListener('DOMContentLoaded', function() {
    new VisitorTracker();
});

