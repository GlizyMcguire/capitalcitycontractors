# Meta Pixel Lead Tracking Setup - TEST42844

## ✅ Implementation Complete

Meta Pixel Lead event tracking has been successfully added to your quote form with the test event code **TEST42844** for verification in Facebook Test Events.

---

## 🎯 What Was Implemented

### Lead Event Tracking on Quote Form
When a visitor successfully submits the quote form on your website, the following Meta Pixel event is automatically fired:

```javascript
fbq('track', 'Lead', {
    content_name: 'Quote Request',
    content_category: 'Quote Form',
    currency: 'CAD',
    value: 0.00
}, {
    eventID: 'quote_' + Date.now(),
    test_event_code: 'TEST42844'
});
```

### Event Parameters
- **Event Type:** `Lead` (Standard Facebook conversion event)
- **content_name:** "Quote Request"
- **content_category:** "Quote Form"
- **currency:** CAD (Canadian Dollars)
- **value:** 0.00 (can be updated later if you want to assign a value to leads)
- **eventID:** Unique identifier for deduplication (format: `quote_1234567890`)
- **test_event_code:** `TEST42844` (for Facebook Test Events verification)

---

## 🧪 How to Test & Verify

### Step 1: Open Facebook Test Events
1. Go to: https://business.facebook.com/events_manager2
2. Select your Pixel (ID: **1827378347888391**)
3. Click the **"Test Events"** tab at the top
4. Keep this tab open

### Step 2: Submit a Test Quote
1. Visit: https://capitalcitycontractors.ca
2. Scroll to the "Get a Free Quote" section
3. Fill out the quote form with test data:
   - Name: Test User
   - Phone: 613-555-0100
   - Email: test@example.com
   - Service: Any service
   - Message: This is a test quote
4. Click **"Send Quote Request"**
5. Wait for the success modal to appear

### Step 3: Verify in Facebook Test Events
1. Go back to the Facebook Test Events tab
2. Within 10-30 seconds, you should see:
   - **Event Name:** Lead
   - **Test Event Code:** TEST42844
   - **Event Time:** Current timestamp
   - **Event Source:** Browser
   - **Parameters:** content_name, content_category, currency, value

### Step 4: Check Browser Console (Optional)
1. Press F12 to open Developer Tools
2. Go to the Console tab
3. Submit the quote form
4. You should see: `✅ Meta Pixel Lead event tracked with test code TEST42844`

---

## 📊 What This Enables

### 1. Conversion Tracking
- Track exactly how many quote requests come from your Facebook/Instagram ads
- Measure the true ROI of your ad campaigns
- See which ads generate the most leads

### 2. Campaign Optimization
- Facebook will automatically optimize ad delivery to people most likely to submit quotes
- Reduce cost per lead over time
- Improve ad performance automatically

### 3. Custom Audiences
- **Lead Form Submitters** - Retarget people who submitted quotes
- **Non-Converters** - Target visitors who didn't submit a quote
- **Lookalike Audiences** - Find new customers similar to your lead submitters

### 4. Reporting & Analytics
- See lead conversion rates in Facebook Ads Manager
- Track conversion funnel: PageView → Lead
- Calculate cost per lead for each campaign
- Compare performance across different ad sets

---

## 🔧 Technical Details

### File Modified
- **File:** `capitalcitycontractors/assets/js/emailjs-integration.js`
- **Method:** `showSuccess()` (line 384-425)
- **Trigger:** Fires immediately after successful quote form submission

### Event Flow
1. User fills out quote form
2. Form is validated
3. Email is sent via EmailJS
4. **Meta Pixel Lead event fires** ← NEW
5. Success modal is displayed
6. Form is reset

### Error Handling
- If Meta Pixel (`fbq`) is not loaded, the event is skipped gracefully
- No impact on form submission if pixel fails
- Console warnings logged for debugging

### Deduplication
- Each event has a unique `eventID` (format: `quote_1234567890`)
- Prevents duplicate counting if the same event is sent multiple times
- Uses timestamp to ensure uniqueness

---

## 🚀 Next Steps After Testing

### Remove Test Event Code (After Verification)
Once you've confirmed the Lead event is working in Facebook Test Events, you should remove the test code for production:

1. Edit `assets/js/emailjs-integration.js`
2. Find line ~395 (in the `showSuccess()` method)
3. Change:
```javascript
fbq('track', 'Lead', {
    content_name: 'Quote Request',
    content_category: 'Quote Form',
    currency: 'CAD',
    value: 0.00
}, {
    eventID: 'quote_' + Date.now(),
    test_event_code: 'TEST42844'  // ← REMOVE THIS LINE
});
```

To:
```javascript
fbq('track', 'Lead', {
    content_name: 'Quote Request',
    content_category: 'Quote Form',
    currency: 'CAD',
    value: 0.00
}, {
    eventID: 'quote_' + Date.now()
});
```

**OR** simply let me know and I can remove it for you!

### Set Up Conversion Campaign
1. In Facebook Ads Manager, create a new campaign
2. Choose **"Leads"** as your campaign objective
3. In the ad set, select **"Lead"** as the conversion event
4. Facebook will now optimize to show ads to people most likely to submit quotes

### Create Custom Audiences
1. Go to Facebook Audiences
2. Create **"Website Custom Audience"**
3. Choose: **"People who took specific actions"**
4. Select: **"Lead"** event
5. Set time window (e.g., last 30 days)
6. Use for retargeting or lookalike audiences

### Assign Value to Leads (Optional)
If you want to track the monetary value of leads:
1. Estimate average customer lifetime value or project value
2. Update the `value` parameter in the code
3. Example: If average project is $5,000, set `value: 5000.00`

---

## 📱 Additional Test Methods

### Method 1: Use the Test Page
1. Visit: https://capitalcitycontractors.ca/test-meta-pixel.html
2. Click **"Test Lead Event"** button
3. Check Facebook Test Events tab
4. You should see the Lead event with test code TEST42844

### Method 2: Browser Console
1. Visit any page on your website
2. Press F12 → Console tab
3. Type: `fbq('track', 'Lead', {content_name: 'Manual Test'}, {test_event_code: 'TEST42844'})`
4. Press Enter
5. Check Facebook Test Events tab

### Method 3: Meta Pixel Helper Extension
1. Install: [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Submit a quote on your website
3. Click the extension icon
4. You should see both PageView and Lead events

---

## 🔍 Troubleshooting

### Lead Event Not Showing in Test Events?
1. **Wait 30-60 seconds** - there can be a delay
2. **Check browser console** for errors (F12 → Console)
3. **Verify fbq is loaded**: Type `fbq` in console, should show function
4. **Disable ad blockers** - they may block the pixel
5. **Try incognito mode** - eliminates extension interference
6. **Check form submission** - make sure success modal appears

### "fbq is not defined" Error?
1. Verify Meta Pixel code is in the `<head>` section
2. Check Content Security Policy allows `connect.facebook.net`
3. Disable browser extensions temporarily
4. Clear browser cache and reload

### Event Shows But No Test Code?
1. Verify you're using the latest version of the code
2. Check that `test_event_code: 'TEST42844'` is in the event parameters
3. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Multiple Lead Events Firing?
1. This is normal if you submit multiple times
2. Each has a unique `eventID` to prevent duplicate counting
3. Facebook will deduplicate based on `eventID`

---

## 📞 Support & Resources

### Facebook Documentation
- [Meta Pixel Events Reference](https://developers.facebook.com/docs/meta-pixel/reference)
- [Test Events Tool Guide](https://www.facebook.com/business/help/1741255202666988)
- [Lead Event Specification](https://developers.facebook.com/docs/meta-pixel/reference#lead)

### Your Pixel Details
- **Pixel ID:** 1827378347888391
- **Test Event Code:** TEST42844
- **Events Tracked:** PageView (all pages), Lead (quote form)

### Need Help?
If you encounter any issues:
1. Check the browser console for error messages
2. Verify the form submission works (email is sent)
3. Test with Meta Pixel Helper extension
4. Contact Facebook support if pixel issues persist

---

## ✅ Verification Checklist

Before going live with ads:
- [ ] Submitted a test quote on the website
- [ ] Saw success modal appear
- [ ] Checked Facebook Test Events tab
- [ ] Confirmed Lead event appeared with TEST42844
- [ ] Verified event parameters are correct
- [ ] Tested on mobile device (optional but recommended)
- [ ] Removed test event code for production (after testing)
- [ ] Created conversion campaign in Ads Manager
- [ ] Set up custom audiences for retargeting

---

**Status:** ✅ Active and Ready for Testing  
**Test Event Code:** TEST42844  
**Last Updated:** January 2025  
**Deployment:** Live on capitalcitycontractors.ca

