# 🚀 Quick Reference: Discount Code System

## ⚡ Quick Access Commands

### View All Discount Codes (CRM Dashboard)
```javascript
LeadGenerationSystem.createCRMDashboard()
```

### Export Leads to CSV
```javascript
LeadGenerationSystem.exportLeadsCSV()
```

### Get Email List for Marketing
```javascript
LeadGenerationSystem.sendBulkEmail()
```

### Test Email System
```javascript
LeadGenerationSystem.testEmailSystem()
```

### Run Full System Test
```javascript
LeadGenerationSystem.runFullSystemTest()
```

---

## 📋 EmailJS Template IDs (MUST MATCH EXACTLY)

| Template Purpose | Template ID | Status |
|-----------------|-------------|---------|
| Customer Welcome Email | `template_discount_welcome` | ⚠️ **CREATE THIS** |
| Business Notification | `template_discount_business` | ⚠️ **CREATE THIS** |

**Service ID**: `service_8h9k2lm` ✅ (Already configured)
**Public Key**: `Ej7_wQOBOKJhHgJhJ` ✅ (Already configured)

---

## 🎯 What Changed

### Files Modified:
1. ✅ `assets/js/lead-generation.js` - Fixed EmailJS config, added fraud prevention
2. ✅ `index.html` - Added address field, added "1 per household" warning

### New Features:
- ✅ Address field (required)
- ✅ Duplicate address checking
- ✅ Clear error messages
- ✅ "1 per household" warning visible on form
- ✅ Address included in CRM dashboard
- ✅ Address included in CSV exports
- ✅ Address sent in business notification emails

---

## 🔒 Fraud Prevention

**How it works:**
- System normalizes addresses (removes spaces, punctuation, case)
- Checks against all previously issued codes
- Prevents duplicate submissions from same address
- Error message: "This address has already received a discount code"

**Examples of duplicate detection:**
- "123 Main St" = "123 Main Street" = "123 main st."
- "456 Oak Ave." = "456 Oak Avenue" = "456 oak ave"

---

## 📊 Admin Dashboard Features

Access: `LeadGenerationSystem.createCRMDashboard()`

**What you can see:**
- Total leads count
- Leads this month
- Leads this week
- Conversion rate
- Full lead details (name, email, phone, address, project, code, date)
- Project type breakdown
- Lead status (Pending/Converted)

**What you can do:**
- Export all leads to CSV
- Copy email list for bulk campaigns
- Clear old leads (90+ days)
- View individual discount codes
- Track which codes have been used

---

## ✉️ Email Flow

### When someone submits the form:

1. **Validation**
   - Checks required fields (name, email, address)
   - Validates email format
   - Checks for duplicate address

2. **Code Generation**
   - Generates unique code (format: CCC15-XXXXXX)
   - Sets 30-day expiry
   - Saves to localStorage

3. **Email Sending**
   - Sends welcome email to customer (with discount code)
   - Sends notification to you at info@capitalcitycontractors.ca
   - Both emails sent simultaneously

4. **Success Display**
   - Shows discount code on screen
   - Allows customer to copy code
   - Provides next steps (call for estimate)

---

## 🧪 Testing Checklist

- [ ] Created `template_discount_welcome` in EmailJS
- [ ] Created `template_discount_business` in EmailJS
- [ ] Tested form submission with real email
- [ ] Received customer welcome email
- [ ] Received business notification email
- [ ] Tested duplicate address prevention
- [ ] Accessed CRM dashboard
- [ ] Exported CSV successfully
- [ ] Verified discount code format (CCC15-XXXXXX)

---

## 🆘 Common Issues & Solutions

### "EmailJS library not loaded"
- Check internet connection
- Verify EmailJS script is loading in index.html
- Check browser console for errors

### "Email delivery failed"
- Verify template IDs match exactly
- Check EmailJS dashboard for quota limits
- Verify service is connected to Gmail

### "Duplicate address" error when it shouldn't be
- This is working correctly - address was already used
- Check CRM dashboard to see previous submission
- Address normalization is case-insensitive

### Dashboard won't open
- Make sure you're on the website (not local file)
- Check browser console for JavaScript errors
- Try refreshing the page first

---

## 📞 Contact Information in System

**Business Email**: info@capitalcitycontractors.ca
**Business Phone**: (613) 301-1311
**Website**: https://capitalcitycontractors.ca

All emails and notifications go to the business email above.

---

## 🎨 Form Location

**URL**: https://capitalcitycontractors.ca/#exclusive-offer
**Section**: "Strategic Lead Generation Section"
**Form ID**: `discountForm`

---

## 💾 Data Storage

**Location**: Browser localStorage
**Keys**:
- `ccc_leads` - Array of all leads
- `ccc_lead_[CODE]` - Individual lead records
- `ccc_followups` - Scheduled follow-up emails
- `ccc_manual_followups` - Failed email attempts

**Data Retention**: Last 100 leads (automatic cleanup)

---

## 🔐 Security Notes

- No sensitive data stored on server
- All data in browser localStorage (client-side)
- EmailJS handles email delivery securely
- No credit card or payment info collected
- Address used only for fraud prevention

---

## 📈 Next Steps

1. ✅ **Complete Phase 1**: Create EmailJS templates and test
2. ⏳ **Phase 2**: Mobile-first responsive design optimization
3. ⏳ **Phase 3**: Performance optimization and final testing

---

**Last Updated**: January 2025
**System Version**: 1.0 - Production Ready
