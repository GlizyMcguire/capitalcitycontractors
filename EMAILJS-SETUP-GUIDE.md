# 📧 EmailJS Setup Guide - Capital City Contractors Lead Generation System

## 🚀 COMPLETE IMPLEMENTATION GUIDE

This guide provides step-by-step instructions to set up a fully functional email automation system for the lead generation discount code feature.

---

## 📋 PREREQUISITES

### Required Accounts:
1. **EmailJS Account** (Free tier available)
2. **Gmail or Outlook Account** (for sending emails)
3. **Access to website files** (to update configuration)

### Technical Requirements:
- Basic understanding of HTML/JavaScript
- Access to website hosting/deployment
- Email account with app passwords enabled (for Gmail)

---

## 🔧 STEP 1: CREATE EMAILJS ACCOUNT

### 1.1 Account Setup
1. Go to **https://www.emailjs.com/**
2. Click **"Sign Up"** and create a free account
3. Verify your email address
4. Log in to your EmailJS dashboard

### 1.2 Get Your Public Key
1. In EmailJS dashboard, go to **"Account"** → **"General"**
2. Copy your **Public Key** (starts with "user_")
3. Save this key - you'll need it for configuration

---

## 📧 STEP 2: SET UP EMAIL SERVICE

### 2.1 Add Email Service
1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (recommended)
   - **Outlook/Hotmail**
   - **Yahoo**
   - **Custom SMTP**

### 2.2 Gmail Configuration (Recommended)
1. Select **"Gmail"**
2. Click **"Connect Account"**
3. Sign in with your business Gmail account
4. Grant necessary permissions
5. Copy the **Service ID** (e.g., "service_abc123")

### 2.3 Alternative: App Password Method
If you prefer not to use OAuth:
1. Enable 2-Factor Authentication on your Gmail
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this password in EmailJS manual setup

---

## 📝 STEP 3: CREATE EMAIL TEMPLATES

### 3.1 Welcome Email Template
1. Go to **"Email Templates"** → **"Create New Template"**
2. **Template Name**: "Customer Welcome - Discount Code"
3. **Template Content**:

```html
Subject: Your 15% Discount Code is Ready! - {{company_name}}

Dear {{to_name}},

Thank you for your interest in {{company_name}}! Your exclusive discount code is ready:

🎁 DISCOUNT CODE: {{discount_code}}
📅 EXPIRES: {{expiry_date}}
💰 SAVINGS: {{discount_percentage}} off your first project

PROJECT INTEREST: {{project_type}}

How to Use Your Code:
{{usage_instructions}}

Why Choose {{company_name}}?
✅ {{experience_years}} years of experience in Ottawa
✅ Fully licensed and insured
✅ {{customer_count}} satisfied customers
✅ {{rating}}

Ready to get started? {{call_to_action}}

Best regards,
The {{company_name}} Team
{{company_email}}
```

4. **Save Template** and copy the **Template ID**

### 3.2 Business Notification Template
1. Create another template: **"Business Lead Notification"**
2. **Template Content**:

```html
Subject: {{subject}}

{{urgency}} - New Lead Alert

Lead Details:
👤 Name: {{lead_name}}
📧 Email: {{lead_email}}
📱 Phone: {{lead_phone}}
🏠 Project: {{project_type}}
🎟️ Discount Code: {{discount_code}}
📅 Date: {{timestamp}}
🌐 Source: {{source}}
📊 Lead Score: {{lead_score}}/100

{{action_items}}

Contact Methods: {{lead_contact_methods}}

System Info: {{system_info}}
CRM Access: {{crm_access}}

Generated: {{notification_timestamp}}
```

3. **Save Template** and copy the **Template ID**

---

## ⚙️ STEP 4: UPDATE WEBSITE CONFIGURATION

### 4.1 Update JavaScript Configuration
Open `assets/js/lead-generation.js` and replace these values:

```javascript
// Line ~98: Replace with your actual public key
const PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';

// Line ~230: Replace with your service ID
const SERVICE_ID = 'YOUR_SERVICE_ID';

// Line ~231: Replace with your welcome template ID
const TEMPLATE_ID = 'YOUR_WELCOME_TEMPLATE_ID';

// Line ~315: Replace with your business template ID
const BUSINESS_TEMPLATE_ID = 'YOUR_BUSINESS_TEMPLATE_ID';
```

### 4.2 Configuration Example
```javascript
// Example configuration (replace with your actual values)
const PUBLIC_KEY = 'user_abc123def456';
const SERVICE_ID = 'service_gmail_xyz789';
const TEMPLATE_ID = 'template_welcome_123';
const BUSINESS_TEMPLATE_ID = 'template_business_456';
```

---

## 🧪 STEP 5: TESTING THE SYSTEM

### 5.1 Browser Console Testing
1. Open your website in a browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Run these commands:

```javascript
// Test the complete system
runSystemTest()

// Test email functionality only
testEmailSystem()

// Test form validation
LeadGenerationSystem.testFormValidation()

// Test discount code generation
LeadGenerationSystem.testDiscountCodeGeneration()
```

### 5.2 Live Form Testing
1. Go to your website's lead generation section
2. Fill out the form with test data:
   - **Name**: Test Customer
   - **Email**: your-test-email@gmail.com
   - **Phone**: (613) 555-0123
   - **Project**: Interior Painting
3. Click **"Get My 15% Discount Code"**
4. Check for:
   - Success message appears
   - Welcome email received (check spam folder)
   - Business notification email received
   - Console shows success messages

### 5.3 Expected Results
✅ **Customer Email**: Welcome email with discount code within 30 seconds
✅ **Business Email**: Lead notification with complete details
✅ **Console Logs**: Success messages and email delivery confirmation
✅ **Form Behavior**: Success animation and discount code display
✅ **Error Handling**: Graceful error messages if emails fail

---

## 🔍 STEP 6: TROUBLESHOOTING

### Common Issues & Solutions:

#### 6.1 "EmailJS library not loaded"
- **Cause**: EmailJS script not loading
- **Solution**: Check internet connection, verify script URL in HTML

#### 6.2 "Service ID is invalid"
- **Cause**: Wrong service ID in configuration
- **Solution**: Double-check service ID in EmailJS dashboard

#### 6.3 "Template not found"
- **Cause**: Wrong template ID in configuration
- **Solution**: Verify template IDs in EmailJS dashboard

#### 6.4 "Authentication failed"
- **Cause**: Wrong public key or service configuration
- **Solution**: Regenerate public key, reconnect email service

#### 6.5 Emails not received
- **Cause**: Spam filters, wrong email addresses
- **Solution**: Check spam folder, verify email addresses, test with different email

### 6.6 Debug Mode
Enable detailed logging by adding this to console:
```javascript
// Enable debug mode
localStorage.setItem('emailjs_debug', 'true');
```

---

## 📊 STEP 7: MONITORING & MAINTENANCE

### 7.1 EmailJS Dashboard Monitoring
- Check **"Logs"** section for email delivery status
- Monitor **"Usage"** to track email volume
- Review **"Statistics"** for delivery rates

### 7.2 Regular Maintenance Tasks
- **Weekly**: Check email delivery logs
- **Monthly**: Review and update email templates
- **Quarterly**: Test complete system functionality
- **Annually**: Review EmailJS plan and usage limits

### 7.3 Performance Optimization
- Monitor email delivery times
- Optimize template content for better engagement
- A/B test different subject lines
- Track conversion rates from email to phone calls

---

## 🎯 SUCCESS CRITERIA CHECKLIST

✅ **EmailJS Account**: Created and configured
✅ **Email Service**: Connected (Gmail/Outlook)
✅ **Templates**: Created for customer and business emails
✅ **Configuration**: Updated in JavaScript files
✅ **Testing**: All tests pass successfully
✅ **Live Testing**: Form submission sends emails within 30 seconds
✅ **Error Handling**: Graceful error messages displayed
✅ **Monitoring**: Dashboard setup for ongoing maintenance

---

## 📞 SUPPORT & RESOURCES

### EmailJS Resources:
- **Documentation**: https://www.emailjs.com/docs/
- **Support**: https://www.emailjs.com/support/
- **Community**: https://github.com/emailjs/emailjs-sdk

### Capital City Contractors Support:
- **Technical Issues**: Check browser console for error messages
- **Email Delivery**: Verify spam folders and email addresses
- **Configuration**: Double-check all IDs and keys

---

**🎉 Your email automation system is now ready to capture and nurture leads automatically!**
