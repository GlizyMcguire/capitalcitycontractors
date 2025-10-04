# 🔒 API Security - Quick Reference Guide

## 🚨 CRITICAL: Do These NOW (15 minutes)

### 1. Restrict Google API Key

**Go to:** https://console.cloud.google.com/apis/credentials

1. Click on your API key (ends in ...Dr8)
2. Under "Application restrictions":
   - Select "HTTP referrers (websites)"
   - Add: `https://capitalcitycontractors.ca/*`
   - Add: `https://www.capitalcitycontractors.ca/*`
3. Under "API restrictions":
   - Select "Restrict key"
   - Check ONLY "Places API"
4. Click "Save"

✅ **Done? Your API key is now protected!**

---

### 2. Set Up Billing Alerts

**Go to:** https://console.cloud.google.com/billing

1. Click "Budgets & alerts"
2. Click "Create Budget"
3. Set amount: $10/month
4. Set alerts: 50%, 90%, 100%
5. Add your email
6. Click "Finish"

✅ **Done? You'll be alerted if costs exceed limits!**

---

### 3. Restrict EmailJS

**Go to:** https://dashboard.emailjs.com/admin

1. Find "Security" or "Settings"
2. Add allowed origins:
   - `https://capitalcitycontractors.ca`
   - `https://www.capitalcitycontractors.ca`
3. Enable rate limiting (if available)
4. Save changes

✅ **Done? EmailJS is now restricted to your domain!**

---

## 📊 Monitor Security (Check Weekly)

### View Security Stats on Your Website

Open browser console (F12) and type:

```javascript
SecureAPI.getSecurityStats()
```

**You'll see:**
- Total API requests
- Successful vs failed requests
- Rate limit status
- Suspicious activity alerts

---

### Check Google API Usage

**Go to:** https://console.cloud.google.com/apis/dashboard

1. Click "Places API"
2. View usage charts
3. Look for unusual spikes

**Normal usage:** 10-100 requests/day
**Suspicious:** 500+ requests/day

---

### Check EmailJS Usage

**Go to:** https://dashboard.emailjs.com/admin

1. View email count
2. Check for failed sends
3. Look for unusual patterns

**Normal usage:** 5-20 emails/day
**Suspicious:** 50+ emails/day

---

## 🛡️ Security Features Enabled

### ✅ What's Protecting Your API Keys:

1. **Domain Restrictions**
   - Keys only work on your website
   - Won't work if copied to other sites

2. **API Restrictions**
   - Google key only works for Places API
   - Can't be used for other Google services

3. **Rate Limiting**
   - Max 10 requests per minute
   - Max 100 requests per hour
   - Prevents automated abuse

4. **Usage Monitoring**
   - Tracks all API calls
   - Logs suspicious activity
   - Alerts on unusual patterns

5. **Content Security Policy**
   - Restricts which scripts can run
   - Prevents XSS attacks
   - Limits external connections

---

## 🚨 If You See Suspicious Activity

### Signs of Abuse:

- ⚠️ Unusually high API usage
- ⚠️ Many failed requests
- ⚠️ Unexpected billing charges
- ⚠️ Emails sent you didn't authorize

### Immediate Actions:

1. **Check browser console:**
   ```javascript
   securityMonitor.getUsageStats()
   ```

2. **Check Google Cloud Console:**
   - Review API usage charts
   - Check billing

3. **If compromised:**
   - Regenerate API keys immediately
   - Update your website with new keys
   - Contact Google Cloud support

---

## 💡 Understanding the Security

### What's Visible:
- ❌ API keys are visible in your source code
- ❌ Anyone can view them in browser DevTools
- ❌ This is unavoidable for static websites

### What's Protected:
- ✅ Keys only work on YOUR domain
- ✅ Keys only work for specific APIs
- ✅ Usage is limited and monitored
- ✅ You're alerted to unusual activity

### The Reality:
- Client-side keys are always visible
- Restrictions prevent most abuse
- Monitoring catches abuse quickly
- This is standard for static sites

---

## 📞 Quick Links

| Resource | URL |
|----------|-----|
| Google Cloud Console | https://console.cloud.google.com |
| Google API Credentials | https://console.cloud.google.com/apis/credentials |
| Google API Dashboard | https://console.cloud.google.com/apis/dashboard |
| Google Billing | https://console.cloud.google.com/billing |
| EmailJS Dashboard | https://dashboard.emailjs.com/admin |
| Security Guide | See API-SECURITY-IMPLEMENTATION.md |

---

## ✅ Security Checklist

### One-Time Setup:
- [ ] Restrict Google API key to domain
- [ ] Restrict Google API key to Places API
- [ ] Set up billing alerts ($10/month)
- [ ] Restrict EmailJS to domain
- [ ] Enable EmailJS rate limiting

### Weekly Monitoring:
- [ ] Check Google API usage
- [ ] Check EmailJS usage
- [ ] Review security stats in console
- [ ] Look for suspicious patterns

### Monthly Review:
- [ ] Review Google Cloud billing
- [ ] Review EmailJS quota
- [ ] Check for security updates
- [ ] Verify restrictions still in place

---

## 🎯 Current Security Status

Run this in browser console to check:

```javascript
console.log('🔒 Security Status:');
console.log('Google Rate Limiter:', window.API_SECURITY_CONFIG.google.rateLimiting.enabled);
console.log('EmailJS Rate Limiter:', window.API_SECURITY_CONFIG.emailjs.rateLimiting.enabled);
console.log('Security Monitoring:', window.API_SECURITY_CONFIG.monitoring.enabled);
console.log('\n📊 Usage Stats:');
console.log(window.SecureAPI.getSecurityStats());
```

---

## 🆘 Need Help?

**For Google API issues:**
- Google Cloud Support: https://cloud.google.com/support
- API Security Best Practices: https://developers.google.com/maps/api-security-best-practices

**For EmailJS issues:**
- EmailJS Support: https://www.emailjs.com/docs/
- EmailJS Dashboard: https://dashboard.emailjs.com

**For website issues:**
- Check browser console (F12) for errors
- Review API-SECURITY-IMPLEMENTATION.md
- Check security stats with `SecureAPI.getSecurityStats()`

---

**Remember:** The most important security measure is restricting your API keys in Google Cloud Console and EmailJS dashboard. Do this NOW if you haven't already!
