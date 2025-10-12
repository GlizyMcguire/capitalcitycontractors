# Meta Pixel Verification Guide

## ✅ Installation Complete

Meta Pixel (Facebook Pixel) tracking has been successfully installed on all customer-facing pages of capitalcitycontractors.ca.

**Pixel ID:** `1827378347888391`

---

## 📄 Pages with Meta Pixel Installed

### Main Pages
- ✅ Homepage (`index.html`)
- ✅ About (`about.html`)
- ✅ Services (`services.html`)
- ✅ Contact (`contact.html`)
- ✅ Blog (`blog.html`)
- ✅ Portfolio (`portfolio.html`)
- ✅ Thank You (`thank-you.html`)

### SEO Landing Pages
- ✅ Kitchen Renovations Ottawa (`kitchen-renovations-ottawa.html`)
- ✅ Basement Renovations Ottawa (`basement-renovations-ottawa.html`)
- ✅ Ottawa Painting Contractors (`ottawa-painting-contractors.html`)
- ✅ Ottawa Contractors (`ottawa-contractors.html`)

---

## 🧪 How to Verify Meta Pixel is Working

### Method 1: Use the Test Page (Easiest)
1. Visit: `https://capitalcitycontractors.ca/test-meta-pixel.html`
2. The page will automatically check if the pixel is loaded
3. You should see: "✅ Meta Pixel is ACTIVE and working correctly!"
4. Use the test buttons to send custom events

### Method 2: Browser Developer Tools
1. Open any page on your website
2. Press `F12` or right-click → "Inspect"
3. Go to the **Console** tab
4. Type: `fbq`
5. Press Enter
6. **Expected Result:** You should see a function definition (not "undefined")
7. Type: `fbq('track', 'PageView')`
8. Press Enter
9. **Expected Result:** No errors, event is sent

### Method 3: Network Tab
1. Open any page on your website
2. Press `F12` → Go to **Network** tab
3. Reload the page
4. Filter by "facebook" or search for "fbevents"
5. **Expected Result:** You should see:
   - Request to `connect.facebook.net/en_US/fbevents.js` (Status: 200)
   - Request to `www.facebook.com/tr/?id=1827378347888391&ev=PageView`

### Method 4: Facebook Events Manager (Most Reliable)
1. Go to: https://business.facebook.com/events_manager2
2. Select your Pixel (ID: 1827378347888391)
3. Click **"Test Events"** tab
4. In the "Test Events" section, you can either:
   - **Option A:** Enter your website URL and click "Open Website"
   - **Option B:** Enter your browser session ID (shown in the test events tool)
5. Visit your website in another tab
6. **Expected Result:** You should see PageView events appearing in real-time in the Test Events panel

### Method 5: Meta Pixel Helper (Chrome Extension)
1. Install: [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Visit any page on your website
3. Click the Meta Pixel Helper icon in your browser toolbar
4. **Expected Result:** 
   - Icon shows a number (1 or more)
   - Popup shows: "PageView" event detected
   - Pixel ID: 1827378347888391

---

## 🎯 Events Currently Tracked

### Automatic Events
- **PageView** - Tracked on every page load across all 11 pages

### Available for Custom Implementation
You can add these standard events to specific actions:
- `Lead` - When someone submits a quote form
- `Contact` - When someone uses the contact form
- `ViewContent` - When viewing specific service pages
- `InitiateCheckout` - When starting a quote process
- `CompleteRegistration` - When signing up for newsletter/updates

---

## 🔧 Technical Implementation Details

### Code Location
The Meta Pixel code is placed in the `<head>` section of each HTML file, just before the closing `</head>` tag.

### Code Structure
```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1827378347888391');
fbq('track', 'PageView');
</script>
<noscript>
    <img height="1" width="1" src="https://www.facebook.com/tr?id=1827378347888391&ev=PageView&noscript=1"/>
</noscript>
<!-- End Meta Pixel Code -->
```

### Content Security Policy (CSP)
The homepage (`index.html`) has been updated with the following CSP directives to allow Meta Pixel:
- `script-src`: Added `https://connect.facebook.net`
- `img-src`: Added `https://www.facebook.com`
- `connect-src`: Added `https://www.facebook.com`

---

## 📊 What You Can Do with Meta Pixel

### 1. Track Conversions
- Measure how many people submit quote forms
- Track phone calls (with additional setup)
- Monitor newsletter signups

### 2. Build Custom Audiences
- **Website Visitors** - Retarget anyone who visited your site
- **Page Visitors** - Target people who viewed specific services
- **Time-Based** - Target visitors from last 30/60/90 days
- **Engagement** - Target people who spent X seconds on site

### 3. Create Lookalike Audiences
- Find new customers similar to your website visitors
- Target people similar to those who submitted quotes
- Expand reach while maintaining quality

### 4. Optimize Ad Delivery
- Facebook will automatically show ads to people most likely to convert
- Improve ROI by targeting high-intent users
- Reduce cost per lead

### 5. Measure Ad Performance
- See which ads drive the most website traffic
- Track which campaigns generate quote requests
- Calculate true ROI of your ad spend

---

## 🚀 Next Steps (Optional Enhancements)

### Add Conversion Events
To track specific actions (like form submissions), add this code to your form submission handler:

```javascript
// When quote form is submitted
fbq('track', 'Lead', {
    content_name: 'Quote Request',
    content_category: 'Painting',
    value: 0.00,
    currency: 'CAD'
});

// When contact form is submitted
fbq('track', 'Contact', {
    content_name: 'Contact Form',
    content_category: 'General Inquiry'
});
```

### Track Phone Calls
Add this to phone number click events:

```javascript
fbq('track', 'Contact', {
    content_name: 'Phone Call',
    content_category: 'Direct Contact'
});
```

### Track Service Page Views
Add this to specific service pages:

```javascript
fbq('track', 'ViewContent', {
    content_name: 'Kitchen Renovations',
    content_category: 'Services',
    content_ids: ['kitchen-reno'],
    content_type: 'service'
});
```

---

## 🔍 Troubleshooting

### Pixel Not Showing in Events Manager?
1. Wait 20-30 minutes - there can be a delay
2. Clear browser cache and reload the page
3. Check browser console for JavaScript errors
4. Verify CSP is not blocking the pixel (check Network tab)
5. Try in incognito/private browsing mode

### "fbq is not defined" Error?
1. Check if ad blockers are enabled (disable for testing)
2. Verify the pixel code is in the `<head>` section
3. Check CSP allows `connect.facebook.net`
4. Try a different browser

### Events Not Appearing in Test Events?
1. Make sure you're using the correct Pixel ID
2. Verify your browser session is being tracked
3. Disable browser extensions (especially privacy/ad blockers)
4. Try using the Meta Pixel Helper extension

### CSP Blocking the Pixel?
If you see CSP errors in console:
1. Verify `index.html` has the updated CSP (line 10)
2. Other pages don't have CSP, so they should work fine
3. If needed, we can update CSP on other pages too

---

## 📞 Support

If you need help with:
- Setting up conversion events
- Creating custom audiences
- Optimizing ad campaigns
- Troubleshooting pixel issues

Contact your Facebook Ads Manager or refer to:
- [Meta Pixel Documentation](https://www.facebook.com/business/help/952192354843755)
- [Meta Events Manager](https://business.facebook.com/events_manager2)

---

## ✅ Verification Checklist

- [ ] Visited test page: `capitalcitycontractors.ca/test-meta-pixel.html`
- [ ] Confirmed "Meta Pixel is ACTIVE" message
- [ ] Checked Facebook Events Manager - Test Events tab
- [ ] Saw PageView events appearing in real-time
- [ ] Installed Meta Pixel Helper extension (optional)
- [ ] Verified pixel shows on all main pages
- [ ] No console errors related to fbq or Facebook

---

**Last Updated:** January 2025  
**Pixel ID:** 1827378347888391  
**Status:** ✅ Active and Tracking

