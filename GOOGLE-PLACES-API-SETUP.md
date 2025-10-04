# 🗺️ Google Places API Setup Guide - Address Autocomplete

## 📋 Overview

Your discount code form now includes **address autocomplete** functionality that:
- ✅ Suggests real addresses as users type
- ✅ Validates addresses are legitimate
- ✅ Improves fraud prevention (harder to fake addresses)
- ✅ Provides better data quality (consistent formatting)
- ✅ Restricts to Ottawa area for relevant results

---

## 🚀 Quick Setup (15 minutes)

### Step 1: Get Google API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click "Select a project" at the top
   - Click "New Project"
   - Name: "Capital City Contractors Website"
   - Click "Create"

3. **Enable Places API**
   - In the left sidebar, go to "APIs & Services" → "Library"
   - Search for "Places API"
   - Click on "Places API"
   - Click "Enable"

4. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key (starts with "AIza...")
   - **IMPORTANT**: Don't close this window yet!

5. **Restrict Your API Key (CRITICAL for security)**
   - Click "Edit API key" (or the pencil icon)
   - Under "Application restrictions":
     - Select "HTTP referrers (websites)"
     - Click "Add an item"
     - Add: `https://capitalcitycontractors.ca/*`
     - Add: `https://www.capitalcitycontractors.ca/*`
     - (Optional for testing) Add: `http://localhost/*`
   - Under "API restrictions":
     - Select "Restrict key"
     - Check "Places API"
   - Click "Save"

---

### Step 2: Add API Key to Your Website

1. **Open `index.html`**
2. **Find this line** (around line 168):
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&libraries=places&callback=initAddressAutocomplete" async defer></script>
   ```

3. **Replace `YOUR_GOOGLE_API_KEY`** with your actual API key:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC1234567890abcdefghijklmnop&libraries=places&callback=initAddressAutocomplete" async defer></script>
   ```

4. **Save the file**

---

### Step 3: Test the Address Autocomplete

1. **Open your website**: https://capitalcitycontractors.ca
2. **Scroll to the discount code form**
3. **Click in the "Street Address" field**
4. **Start typing an address** (e.g., "123 Main")
5. **You should see address suggestions appear**
6. **Select an address from the dropdown**
7. **You should see a green checkmark** ✅ indicating validation

---

## 🎯 How It Works

### User Experience:

1. **User starts typing address**
   - Autocomplete suggestions appear
   - Prioritizes Ottawa area addresses
   - Shows full street addresses only

2. **User selects an address**
   - Address is validated by Google
   - Green checkmark appears ✅
   - Full address data is stored

3. **Form submission**
   - Validated address data is included
   - Better fraud prevention
   - Consistent address formatting

### Technical Details:

**Address Validation Data Stored:**
```javascript
{
    formatted: "123 Main Street, Ottawa, ON K1A 0A1, Canada",
    street_number: "123",
    street_name: "Main Street",
    city: "Ottawa",
    province: "ON",
    postal_code: "K1A 0A1",
    country: "Canada",
    lat: 45.4215,
    lng: -75.6972,
    validated: true,
    timestamp: "2025-01-04T12:00:00.000Z"
}
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Restrict API key to your domain only
- Enable only Places API (not all Google APIs)
- Monitor API usage in Google Cloud Console
- Set up billing alerts

### ❌ DON'T:
- Share your API key publicly
- Commit API key to version control (use environment variables in production)
- Leave API key unrestricted
- Enable unnecessary APIs

---

## 💰 Pricing

**Google Places API Pricing:**
- **Autocomplete (per session)**: $2.83 per 1,000 sessions
- **Free tier**: $200 credit per month
- **Estimated usage**: ~100-500 sessions/month = $0.28 - $1.42/month
- **Likely cost**: FREE (within free tier)

**What's a session?**
- User starts typing → suggestions appear → selects address = 1 session
- Sessions last 3 minutes or until address is selected

**Cost Calculator:**
https://mapsplatform.google.com/pricing/

---

## 🧪 Testing Checklist

- [ ] API key created in Google Cloud Console
- [ ] Places API enabled
- [ ] API key restricted to your domain
- [ ] API key added to index.html
- [ ] Website deployed with new code
- [ ] Address field shows autocomplete suggestions
- [ ] Can select address from dropdown
- [ ] Green checkmark appears after selection
- [ ] Form submits successfully with validated address
- [ ] Address data visible in CRM dashboard

---

## 🐛 Troubleshooting

### Issue: No autocomplete suggestions appear

**Possible causes:**
1. API key not added to index.html
2. API key is incorrect
3. Places API not enabled in Google Cloud Console
4. API key restrictions too strict
5. Browser console shows errors

**Solution:**
- Open browser console (F12)
- Look for error messages
- Check API key is correct
- Verify Places API is enabled
- Check API key restrictions allow your domain

### Issue: "This API key is not authorized to use this service"

**Solution:**
- Go to Google Cloud Console
- Edit API key restrictions
- Make sure "Places API" is checked
- Add your domain to HTTP referrers

### Issue: Autocomplete works but form won't submit

**Solution:**
- This is normal - the address autocomplete is optional
- Form will still work without Google API
- Check browser console for JavaScript errors

### Issue: Getting charged unexpectedly

**Solution:**
- Check Google Cloud Console → Billing
- Set up budget alerts
- Review API usage
- Make sure API key is restricted to your domain only

---

## 📊 Monitoring Usage

### Check API Usage:

1. Go to Google Cloud Console
2. Navigate to "APIs & Services" → "Dashboard"
3. Click on "Places API"
4. View usage charts and statistics

### Set Up Billing Alerts:

1. Go to "Billing" in Google Cloud Console
2. Click "Budgets & alerts"
3. Create a budget alert (e.g., $10/month)
4. Get email notifications if exceeded

---

## 🔄 Fallback Behavior

**If Google Places API is not configured:**
- Address field still works as regular text input
- No autocomplete suggestions
- Basic validation still applies (must have number and street)
- Form submission works normally
- Fraud prevention still active (duplicate address checking)

**The system gracefully degrades** - it works with or without the API!

---

## 🎨 Customization Options

### Change Autocomplete Region:

Edit `assets/js/address-autocomplete.js` (line 50):

```javascript
// Current: Ottawa area
bounds: {
    north: 45.5375,
    south: 45.2505,
    east: -75.4500,
    west: -76.3550
}

// Change to different city:
// Toronto: north: 43.9, south: 43.5, east: -79.1, west: -79.6
// Montreal: north: 45.7, south: 45.4, east: -73.4, west: -73.9
```

### Change Country Restriction:

Edit `assets/js/address-autocomplete.js` (line 48):

```javascript
componentRestrictions: { country: 'ca' }, // 'ca' = Canada, 'us' = USA
```

### Change Address Types:

Edit `assets/js/address-autocomplete.js` (line 50):

```javascript
types: ['address'], // Only full addresses
// Other options: ['geocode'], ['establishment'], ['(regions)']
```

---

## 📚 Additional Resources

- **Google Places API Documentation**: https://developers.google.com/maps/documentation/places/web-service/overview
- **Autocomplete Documentation**: https://developers.google.com/maps/documentation/javascript/place-autocomplete
- **Pricing Calculator**: https://mapsplatform.google.com/pricing/
- **API Key Best Practices**: https://developers.google.com/maps/api-security-best-practices

---

## ✅ Benefits of Address Autocomplete

### For You (Business Owner):
- ✅ Better data quality (real, validated addresses)
- ✅ Stronger fraud prevention (harder to fake)
- ✅ Consistent address formatting
- ✅ Easier to contact customers
- ✅ Better analytics (geographic data)

### For Your Customers:
- ✅ Faster form completion
- ✅ No typos in addresses
- ✅ Better user experience
- ✅ Mobile-friendly (especially helpful on phones)

---

## 🚀 Next Steps

1. **Complete Google API Setup** (15 minutes)
2. **Test address autocomplete** (5 minutes)
3. **Monitor usage for first week** (check daily)
4. **Set up billing alerts** (one-time, 5 minutes)
5. **Ready for Phase 2: Mobile Optimization!**

---

**Status**: ✅ Code implemented, awaiting Google API key configuration
**Estimated Setup Time**: 15-20 minutes
**Monthly Cost**: FREE (within $200 free tier)
