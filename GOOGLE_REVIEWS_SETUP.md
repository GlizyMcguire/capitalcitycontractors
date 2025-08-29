# Google Reviews API Integration Setup Guide

## Overview
This guide explains how to set up the Google Reviews API integration for Capital City Contractors website to display live Google Business reviews in the testimonials section.

## Features
- ✅ Fetches live Google Business reviews automatically
- ✅ Maintains existing slideshow format with navigation arrows
- ✅ 7-second auto-advance functionality preserved
- ✅ Graceful fallback to hardcoded reviews on API errors
- ✅ Caching system to reduce API calls
- ✅ Rate limiting and security measures
- ✅ Mobile-responsive design maintained

## Quick Setup (5 minutes)

### Step 1: Get Google Places API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing project
3. Enable the **Places API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"
4. Create API credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

### Step 2: Secure Your API Key
1. In Google Cloud Console, click on your API key
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add: `https://capitalcitycontractors.ca/*`
   - Add: `https://www.capitalcitycontractors.ca/*`
3. Under "API restrictions":
   - Select "Restrict key"
   - Choose "Places API"
4. Save changes

### Step 3: Configure API Key on Server

#### Option A: Environment Variable (Recommended)
Add to your server's environment variables:
```bash
export GOOGLE_PLACES_API_KEY="REDACTED_GOOGLE_API_KEY"
export GOOGLE_PLACES_SECRET_KEY="REDACTED_GOOGLE_SECRET"
```

#### Option B: PHP Configuration
Edit `api/google-reviews-proxy.php`:
```php
$config = [
    'api_key' => 'REDACTED_GOOGLE_API_KEY', // Replace with your actual API key
    'secret_key' => 'REDACTED_GOOGLE_SECRET', // Replace with your actual secret key
    // ... rest of config
];
```

#### Option C: Client-side (Development Only)
Add to your HTML before the Google Reviews script:
```html
<script>
    window.GOOGLE_PLACES_API_KEY = 'REDACTED_GOOGLE_API_KEY';
    window.GOOGLE_PLACES_SECRET_KEY = 'REDACTED_GOOGLE_SECRET';
</script>
```

### Step 4: Verify Setup
1. Open your website
2. Navigate to the testimonials section
3. Check browser console for any errors
4. Verify reviews are loading (may take a few seconds)

## File Structure
```
/
├── api/
│   └── google-reviews-proxy.php     # Server-side API proxy
├── assets/
│   ├── js/
│   │   ├── google-reviews.js        # Main Google Reviews integration
│   │   └── main.js                  # Updated testimonial slider
│   └── data/
│       └── reviews.js               # Fallback reviews data
├── config/
│   └── api-config.js               # API configuration
└── GOOGLE_REVIEWS_SETUP.md        # This setup guide
```

## How It Works

### 1. API Integration Flow
```
Website → google-reviews.js → google-reviews-proxy.php → Google Places API
```

### 2. Fallback System
- If API fails: Uses hardcoded reviews from `assets/data/reviews.js`
- If API key missing: Automatically uses fallback reviews
- If rate limit exceeded: Shows cached reviews or fallback

### 3. Caching System
- Reviews cached for 1 hour in browser localStorage
- Reduces API calls and improves performance
- Automatic cache invalidation

## Configuration Options

### Review Filtering
```javascript
// In google-reviews.js
maxReviews: 5,        // Maximum number of reviews to display
minRating: 4,         // Only show 4+ star reviews
```

### Cache Settings
```javascript
cacheTimeout: 3600000, // 1 hour cache (in milliseconds)
```

### Rate Limiting
```php
// In google-reviews-proxy.php
'rate_limit' => [
    'requests_per_hour' => 100,
    'requests_per_day' => 1000
]
```

## Troubleshooting

### Reviews Not Loading
1. **Check API Key**: Verify API key is correctly configured
2. **Check Console**: Look for JavaScript errors in browser console
3. **Check Network**: Verify API requests are successful in Network tab
4. **Check Restrictions**: Ensure API key restrictions allow your domain

### Common Error Messages
- `"Google Places API key not configured"`: API key not set
- `"Rate limit exceeded"`: Too many API requests
- `"Origin not allowed"`: Domain not in allowed origins list
- `"API request failed"`: Google API returned an error

### Testing Fallback System
To test the fallback system:
1. Temporarily remove or invalidate the API key
2. Refresh the page
3. Verify hardcoded reviews are displayed
4. Check console for fallback message

## Security Best Practices

### ✅ Implemented Security Measures
- Server-side API proxy to hide API key
- Rate limiting to prevent abuse
- Origin validation for CORS requests
- API key restrictions in Google Cloud Console
- Error logging for monitoring

### 🔒 Additional Recommendations
1. **Monitor API Usage**: Set up billing alerts in Google Cloud Console
2. **Regular Key Rotation**: Rotate API keys periodically
3. **Access Logging**: Monitor API access logs
4. **Backup Strategy**: Keep fallback reviews updated

## Maintenance

### Updating Reviews
- Reviews update automatically every hour
- Manual refresh: Call `window.googleReviews.refreshReviews()`
- Update fallback reviews in `assets/data/reviews.js`

### Monitoring
- Check browser console for errors
- Monitor API usage in Google Cloud Console
- Review error logs in `api/error.log`

## Support

### Getting Help
1. Check browser console for error messages
2. Review this setup guide
3. Test with fallback system first
4. Contact development team if issues persist

### Useful Resources
- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Google Cloud Console](https://console.cloud.google.com)
- [API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)

## Success Indicators
✅ Live Google reviews display in testimonials section  
✅ Slideshow navigation works correctly  
✅ Auto-advance functionality preserved  
✅ Fallback system works when API unavailable  
✅ No JavaScript errors in console  
✅ Mobile responsive design maintained  

---

**Implementation Status**: ✅ Complete and Ready for Production

The Google Reviews API integration is fully functional and ready for use. The system will automatically fetch live reviews from your Google Business Profile and display them in the existing testimonials section with full fallback support.
