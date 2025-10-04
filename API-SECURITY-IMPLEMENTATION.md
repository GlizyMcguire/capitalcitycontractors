# 🔒 API Security Implementation Guide

## ⚠️ IMPORTANT: Understanding Client-Side API Security

**Reality Check:**
Your website is a **static site** (HTML/CSS/JavaScript only, no backend server). This means:
- ❌ API keys in client-side code are **always visible** to users
- ❌ Anyone can view your source code and see the keys
- ✅ **BUT** we can implement restrictions to prevent abuse

**The Solution:**
We'll implement **API key restrictions** and **usage monitoring** to protect against unauthorized use.

---

## 🛡️ Security Measures Implemented

### 1. Google Places API Key Protection

**Current Status:** ⚠️ Your API key is UNRESTRICTED (anyone can use it)

**CRITICAL: Restrict Your API Key NOW**

#### Step 1: Add Domain Restrictions

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/apis/credentials

2. **Find your API key:**
   - Look for key ending in `...Dr8`
   - Click the pencil icon (Edit)

3. **Set Application Restrictions:**
   - Select **"HTTP referrers (websites)"**
   - Click **"Add an item"**
   - Add these referrers:
     ```
     https://capitalcitycontractors.ca/*
     https://www.capitalcitycontractors.ca/*
     ```
   - (Optional for testing) Add: `http://localhost/*`

4. **Set API Restrictions:**
   - Select **"Restrict key"**
   - Check **ONLY** "Places API"
   - Uncheck all other APIs

5. **Click "Save"**

**Result:** ✅ Your API key will ONLY work on your domain and ONLY for Places API

---

### 2. EmailJS Security Configuration

**Current Status:** ⚠️ EmailJS credentials are visible (but this is normal)

**EmailJS is designed for client-side use** - the public key is meant to be visible.

#### Step 1: Restrict EmailJS to Your Domain

1. **Go to EmailJS Dashboard:**
   - https://dashboard.emailjs.com/admin

2. **Click on "Security" or "Settings"**

3. **Add Allowed Origins:**
   ```
   https://capitalcitycontractors.ca
   https://www.capitalcitycontractors.ca
   ```

4. **Enable reCAPTCHA (if available):**
   - Adds bot protection
   - Prevents automated abuse

5. **Set Rate Limits:**
   - Limit emails per day/hour
   - Prevents spam attacks

**Result:** ✅ EmailJS will only accept requests from your domain

---

### 3. Usage Monitoring & Alerts

#### Google Cloud Console Monitoring

1. **Set Up Billing Alerts:**
   - Go to: https://console.cloud.google.com/billing
   - Click "Budgets & alerts"
   - Create budget: $10/month
   - Set alert at 50%, 90%, 100%

2. **Monitor API Usage:**
   - Go to: https://console.cloud.google.com/apis/dashboard
   - Click "Places API"
   - View usage charts daily for first week

3. **Set Usage Quotas:**
   - Go to: https://console.cloud.google.com/apis/api/places-backend.googleapis.com/quotas
   - Set daily quota: 1,000 requests/day (adjust as needed)

#### EmailJS Monitoring

1. **Check EmailJS Dashboard:**
   - https://dashboard.emailjs.com/admin
   - Monitor email count
   - Check for unusual activity

2. **Set Up Email Notifications:**
   - Get alerts when quota is reached
   - Monitor failed sends

---

### 4. Client-Side Rate Limiting

**Implemented in Code:**
- Prevents rapid-fire form submissions
- Adds delays between requests
- Tracks submission attempts

---

## 🔐 Additional Security Measures

### A. Content Security Policy (CSP)

Add to your `<head>` section in index.html:

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://cdn.emailjs.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
    font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
    img-src 'self' data: https:;
    connect-src 'self' https://maps.googleapis.com https://api.emailjs.com;
">
```

### B. Subresource Integrity (SRI)

For external scripts, add integrity hashes to verify they haven't been tampered with.

### C. HTTPS Only

Ensure your site is ONLY accessible via HTTPS (not HTTP).

---

## 🚨 What to Do If Keys Are Compromised

### If Google API Key is Abused:

1. **Immediately Regenerate Key:**
   - Go to Google Cloud Console
   - Delete compromised key
   - Create new key with restrictions

2. **Update Your Website:**
   - Replace old key with new key
   - Deploy immediately

3. **Review Billing:**
   - Check for unexpected charges
   - Contact Google Cloud support if needed

### If EmailJS is Abused:

1. **Regenerate EmailJS Keys:**
   - Go to EmailJS dashboard
   - Create new service/template IDs
   - Update your code

2. **Enable Additional Security:**
   - Add reCAPTCHA
   - Tighten domain restrictions

---

## 📊 Security Checklist

### Immediate Actions (Do Now):
- [ ] Restrict Google API key to your domain
- [ ] Restrict Google API key to Places API only
- [ ] Set up Google Cloud billing alerts ($10/month)
- [ ] Restrict EmailJS to your domain
- [ ] Set EmailJS rate limits

### Weekly Monitoring:
- [ ] Check Google Cloud Console for usage
- [ ] Check EmailJS dashboard for email count
- [ ] Review any failed requests
- [ ] Check for unusual patterns

### Monthly Review:
- [ ] Review Google Cloud billing
- [ ] Review EmailJS usage
- [ ] Check for security updates
- [ ] Verify restrictions are still in place

---

## 💡 Understanding the Limitations

**What API Restrictions CAN Do:**
✅ Prevent use of your key on other websites
✅ Limit which APIs can be called
✅ Set usage quotas
✅ Alert you to unusual activity
✅ Prevent most automated abuse

**What API Restrictions CANNOT Do:**
❌ Hide the key from users viewing your source code
❌ Prevent a determined attacker from copying your key
❌ Guarantee zero unauthorized use

**The Reality:**
- Client-side API keys are **always visible**
- Restrictions make abuse **difficult and limited**
- Monitoring helps you **catch abuse quickly**
- This is **standard practice** for static websites

---

## 🚀 Advanced Option: Serverless Proxy (Optional)

If you want **maximum security**, you can create a serverless function to proxy API calls:

### Benefits:
- ✅ API keys stored server-side (not visible)
- ✅ Additional validation/rate limiting
- ✅ Better control over requests

### Options:
1. **Netlify Functions** (if hosted on Netlify)
2. **Vercel Serverless Functions** (if hosted on Vercel)
3. **Cloudflare Workers** (works with any host)
4. **AWS Lambda** (more complex setup)

### Implementation:
Would require creating a backend function that:
1. Receives requests from your website
2. Validates the request
3. Calls Google/EmailJS APIs with server-side keys
4. Returns results to your website

**Cost:** Usually free tier available (100k-1M requests/month)

**Let me know if you want me to implement this!**

---

## 📞 Summary

### Current Security Status:

| Security Measure | Status | Priority |
|-----------------|--------|----------|
| Google API Domain Restriction | ⚠️ **NOT SET** | 🔴 **CRITICAL** |
| Google API Usage Restriction | ⚠️ **NOT SET** | 🔴 **CRITICAL** |
| Google Billing Alerts | ⚠️ **NOT SET** | 🟡 **HIGH** |
| EmailJS Domain Restriction | ⚠️ **NOT SET** | 🟡 **HIGH** |
| EmailJS Rate Limiting | ⚠️ **NOT SET** | 🟡 **HIGH** |
| Usage Monitoring | ⚠️ **NOT SET** | 🟡 **HIGH** |

### Action Required:

**🔴 CRITICAL (Do within 24 hours):**
1. Restrict Google API key to your domain
2. Restrict Google API key to Places API only

**🟡 HIGH (Do within 1 week):**
3. Set up billing alerts
4. Restrict EmailJS to your domain
5. Set up usage monitoring

**🟢 RECOMMENDED:**
6. Add Content Security Policy
7. Review security weekly
8. Consider serverless proxy for maximum security

---

## 🆘 Need Help?

**Google Cloud Console:** https://console.cloud.google.com
**EmailJS Dashboard:** https://dashboard.emailjs.com
**Google API Security Best Practices:** https://developers.google.com/maps/api-security-best-practices

---

**Remember:** For static websites, API key restrictions are the PRIMARY security measure. Implement them immediately!
