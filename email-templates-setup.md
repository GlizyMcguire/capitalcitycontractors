# Capital City Contractors - Email Marketing System Setup Guide

## 📧 AUTOMATED EMAIL MARKETING & CRM SYSTEM

This guide explains how to set up and use the comprehensive lead generation and email marketing system.

## 🔧 CURRENT DATA STORAGE

### Lead Data Storage Location:
- **Primary Storage**: Browser localStorage (client-side)
- **Storage Key**: `ccc_leads`
- **Backup Storage**: Individual lead records stored as `ccc_lead_[DISCOUNT_CODE]`
- **Follow-up Storage**: `ccc_followups` for scheduled email campaigns
- **Manual Follow-up**: `ccc_manual_followups` for failed automation

### Data Persistence:
- Data persists across browser sessions
- Survives page refreshes and browser restarts
- Automatically managed with size limits (100 most recent leads)
- Exportable to CSV for external CRM integration

## 📊 CRM DASHBOARD ACCESS

### How to Access Your Lead Management Dashboard:

1. **Open Browser Console** (F12 or right-click → Inspect → Console)
2. **Type Command**: `showCRMDashboard()`
3. **Press Enter** to open the full CRM interface

### Quick Console Commands:
```javascript
// View lead statistics
getLeadStats()

// Export leads to CSV
exportLeads()

// Open full CRM dashboard
showCRMDashboard()
```

### Dashboard Features:
- ✅ Total leads and monthly/weekly statistics
- ✅ Conversion rate tracking
- ✅ Recent leads table with contact information
- ✅ Project type breakdown analysis
- ✅ Export leads to CSV functionality
- ✅ Bulk email list generation
- ✅ Old lead cleanup tools

## 📧 EMAIL AUTOMATION SETUP

### EmailJS Configuration Required:

1. **Create EmailJS Account**: https://www.emailjs.com/
2. **Set up Email Service** (Gmail, Outlook, etc.)
3. **Create Email Templates** (see templates below)
4. **Update Configuration** in lead-generation.js

### Email Templates Needed:

#### 1. Welcome Email Template (`template_welcome`)
```html
Subject: Your 15% Discount Code is Ready! - Capital City Contractors

Dear {{to_name}},

Thank you for your interest in Capital City Contractors! Your exclusive 15% discount code is ready:

🎁 DISCOUNT CODE: {{discount_code}}
📅 EXPIRES: {{expiry_date}}
💰 SAVINGS: 15% off your first project

PROJECT INTEREST: {{project_type}}

How to Use Your Code:
1. Call us at {{company_phone}} to discuss your project
2. Mention your discount code: {{discount_code}}
3. Schedule your FREE estimate
4. Save 15% on your renovation project!

Why Choose Capital City Contractors?
✅ 14+ years of experience in Ottawa
✅ Fully licensed and insured
✅ 500+ satisfied customers
✅ 5-star Google rating

Ready to get started? Call {{company_phone}} or visit {{website}}

Best regards,
The Capital City Contractors Team
{{company_email}}
```

#### 2. Business Notification Template (`template_business_notification`)
```html
Subject: New Lead Generated - {{lead_name}}

New lead captured from website:

Name: {{lead_name}}
Email: {{lead_email}}
Phone: {{lead_phone}}
Project: {{project_type}}
Discount Code: {{discount_code}}
Source: {{source}}
Timestamp: {{timestamp}}

Follow up immediately for best conversion rates!
```

#### 3. Follow-up Email Templates

**1-Day Follow-up (`template_followup_1`)**:
```html
Subject: Don't Forget Your 15% Discount - Capital City Contractors

Hi {{to_name}},

Just a friendly reminder about your exclusive 15% discount code!

We're here to help with your renovation project. Have any questions? 
Call us at {{company_phone}} - we'd love to discuss your plans.

Best regards,
Capital City Contractors
```

**1-Week Follow-up (`template_followup_2`)**:
```html
Subject: Winter Renovation Tips + Your Discount Code

Hi {{to_name}},

Winter is actually a great time for interior renovations! Here are some benefits:

✅ Better contractor availability
✅ Indoor comfort during work
✅ Ready for spring entertaining
✅ Your 15% discount is still valid!

Ready to start your project? Call {{company_phone}}

Best regards,
Capital City Contractors
```

**Monthly Newsletter (`template_monthly`)**:
```html
Subject: Ottawa Home Renovation Tips - Capital City Contractors

Hi {{to_name}},

This month's renovation tips for Ottawa homeowners:

🏠 Seasonal maintenance checklist
🎨 Latest paint color trends
🔧 DIY vs. professional projects
💡 Energy efficiency improvements

Need professional help? We're here for you!
Call {{company_phone}} or visit {{website}}

Best regards,
Capital City Contractors
```

## 🔐 PRIVACY & COMPLIANCE

### GDPR/Privacy Features:
- ✅ Clear opt-in mechanism in form
- ✅ Privacy disclaimer and unsubscribe options
- ✅ Data retention limits (90-day cleanup)
- ✅ Secure client-side storage
- ✅ No sensitive data transmission

### Unsubscribe Functionality:
- Add unsubscribe links to all email templates
- Implement unsubscribe handling in EmailJS
- Remove unsubscribed emails from follow-up sequences

## 🚀 INTEGRATION WITH POPULAR PLATFORMS

### Mailchimp Integration:
1. Export leads using `exportLeads()` command
2. Import CSV into Mailchimp audience
3. Set up automated email sequences
4. Use Mailchimp's advanced analytics

### Constant Contact Integration:
1. Use bulk email function to copy email list
2. Import into Constant Contact
3. Create automated drip campaigns
4. Track engagement and conversions

### HubSpot Integration:
1. Export lead data to CSV
2. Import into HubSpot CRM
3. Set up lead scoring and automation
4. Track full customer journey

## 📈 CONVERSION OPTIMIZATION

### Lead Nurturing Sequence:
1. **Immediate**: Welcome email with discount code
2. **24 Hours**: Reminder about discount and benefits
3. **1 Week**: Educational content + discount reminder
4. **Monthly**: Newsletter with tips and special offers

### Tracking & Analytics:
- Lead source attribution
- Conversion rate monitoring
- Email open and click tracking (via EmailJS)
- Project type analysis for service optimization

## 🛠️ TECHNICAL IMPLEMENTATION

### Current System Status:
- ✅ Visual enhancement with eye-catching animations
- ✅ Functional discount code generation
- ✅ Automated email system framework
- ✅ CRM dashboard for lead management
- ✅ CSV export functionality
- ✅ Privacy compliance features

### Next Steps for Full Automation:
1. Set up EmailJS account and templates
2. Configure email service (Gmail/Outlook)
3. Test email automation with sample leads
4. Monitor delivery rates and engagement
5. Optimize email content based on performance

## 📞 SUPPORT & MAINTENANCE

### Regular Maintenance Tasks:
- Weekly: Review new leads and follow up manually if needed
- Monthly: Export leads for backup and CRM integration
- Quarterly: Clean up old leads and optimize email templates
- Annually: Review and update email automation sequences

### Troubleshooting:
- Check browser console for error messages
- Verify EmailJS configuration and templates
- Test email delivery with sample addresses
- Monitor localStorage storage limits

---

**Your lead generation system is now ready to capture and nurture leads automatically!**

For technical support or customization, refer to the lead-generation.js file or contact your web developer.
