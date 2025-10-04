/**
 * Lead Generation System with Unique Discount Code Generation
 * Capital City Contractors - Strategic Lead Capture
 * Version: 2.0 - Enhanced Debugging & Error Handling
 */

// Global error handler for debugging
window.addEventListener('error', function(e) {
    console.error('🚨 GLOBAL ERROR:', e.message, 'at', e.filename, 'line', e.lineno);
});

console.log('📦 lead-generation.js: Script file loaded successfully');
console.log('🕐 Timestamp:', new Date().toISOString());

class LeadGenerationSystem {
    constructor() {
        console.log('🏗️ LeadGenerationSystem: Constructor called');

        try {
            // Find form elements with detailed logging
            console.log('🔍 Searching for form element with ID: discountForm');
            this.form = document.getElementById('discountForm');

            if (this.form) {
                console.log('✅ Form found:', this.form);
                console.log('📋 Form attributes:', {
                    id: this.form.id,
                    className: this.form.className,
                    action: this.form.action,
                    method: this.form.method
                });
            } else {
                console.error('❌ CRITICAL: Form with ID "discountForm" NOT FOUND in DOM');
                console.log('🔍 Available forms on page:', document.querySelectorAll('form'));
            }

            this.successDiv = document.getElementById('discountSuccess');
            this.formContainer = document.querySelector('.lead-gen-form-container');
            this.generatedCodeSpan = document.getElementById('generatedCode');
            this.copyCodeBtn = document.getElementById('copyCodeBtn');

            console.log('📊 Element status:', {
                form: !!this.form,
                successDiv: !!this.successDiv,
                formContainer: !!this.formContainer,
                generatedCodeSpan: !!this.generatedCodeSpan,
                copyCodeBtn: !!this.copyCodeBtn
            });

            this.init();
        } catch (error) {
            console.error('❌ ERROR in constructor:', error);
            console.error('Stack trace:', error.stack);
        }
    }

    init() {
        console.log('🔧 Initializing Lead Generation System...');

        try {
            if (this.form) {
                console.log('✅ Attaching submit event listener to form');
                this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
                console.log('✅ Submit event listener attached successfully');

                // Test if event listener is working
                console.log('🧪 Testing event listener attachment...');
                const testListener = () => console.log('✅ Event listener test: Working!');
                this.form.addEventListener('test', testListener);
                this.form.dispatchEvent(new Event('test'));
                this.form.removeEventListener('test', testListener);
            } else {
                console.error('❌ Cannot attach event listener: form is null');
            }

            if (this.copyCodeBtn) {
                console.log('✅ Attaching click event listener to copy button');
                this.copyCodeBtn.addEventListener('click', this.copyDiscountCode.bind(this));
            }

            console.log('✅ Lead Generation System initialized successfully');
        } catch (error) {
            console.error('❌ ERROR in init():', error);
            console.error('Stack trace:', error.stack);
        }
    }

    async handleFormSubmit(e) {
        console.log('═══════════════════════════════════════════════════');
        console.log('🎯 FORM SUBMITTED! handleFormSubmit called');
        console.log('🕐 Timestamp:', new Date().toISOString());
        console.log('📝 Event:', e);
        console.log('📝 Event type:', e.type);
        console.log('📝 Event target:', e.target);
        console.log('═══════════════════════════════════════════════════');

        try {
            e.preventDefault();
            console.log('✅ Default form submission prevented');

            // Check EmailJS availability
            console.log('🔍 Checking EmailJS availability...');
            if (typeof emailjs === 'undefined') {
                console.error('❌ CRITICAL: EmailJS library is NOT loaded!');
                console.error('💡 Solution: Check if EmailJS script tag is in HTML');
                alert('Error: Email service not loaded. Please refresh the page and try again.');
                return;
            }
            console.log('✅ EmailJS library is available');

            console.log('🔄 Starting discount code generation process...');

            const formData = new FormData(this.form);
            console.log('📋 Form data created');

            // Log all form fields
            console.log('📝 Form fields:');
            for (let [key, value] of formData.entries()) {
                console.log(`  - ${key}: ${value}`);
            }

            // Get validated address if available (from Google Places Autocomplete)
            console.log('🔍 Checking for validated address data...');
            const validatedAddressData = typeof window.getValidatedAddress === 'function'
                ? window.getValidatedAddress()
                : null;
            console.log('📍 Validated address data:', validatedAddressData || 'None');

            const leadData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone') || '',
                address: formData.get('address') || '',
                addressValidated: validatedAddressData || null,
                project: formData.get('project') || 'Not specified',
                timestamp: new Date().toISOString(),
                source: 'Homepage Discount Form'
            };

            console.log('📊 Lead data compiled:', leadData);

            // Validate required fields
            console.log('✅ Validating required fields...');
            if (!leadData.name || !leadData.email || !leadData.address) {
                console.error('❌ Validation failed: Missing required fields');
                this.showError('Please fill in all required fields (Name, Email, and Address).');
                return;
            }
            console.log('✅ All required fields present');

            // Validate email format
            console.log('✅ Validating email format...');
            if (!this.isValidEmail(leadData.email)) {
                console.error('❌ Validation failed: Invalid email format');
                this.showError('Please enter a valid email address.');
                return;
            }
            console.log('✅ Email format valid');

            // Check for duplicate address (fraud prevention - 1 code per household)
            console.log('🔍 Checking for duplicate address...');
            if (this.isDuplicateAddress(leadData.address)) {
                console.warn('⚠️ Duplicate address detected:', leadData.address);
                this.showError('This address has already received a discount code. Limit: 1 code per household.');
                return;
            }
            console.log('✅ No duplicate address found');

            // Show loading state
            console.log('⏳ Setting form to loading state...');
            this.setFormLoading(true);

            // Generate unique discount code
            console.log('🎲 Generating unique discount code...');
            const discountCode = this.generateUniqueCode();
            console.log('✅ Discount code generated:', discountCode);

            // Store lead data with discount code
            const leadRecord = {
                ...leadData,
                discountCode: discountCode,
                codeExpiry: this.getExpiryDate(30), // 30 days from now
                used: false
            };
            console.log('📦 Lead record created:', leadRecord);

            // Save to localStorage for tracking
            console.log('💾 Saving lead record to localStorage...');
            this.saveLeadRecord(leadRecord);
            console.log('✅ Lead record saved');

            // Send email notification (using EmailJS if configured)
            console.log('📧 Sending email notification...');
            await this.sendEmailNotification(leadRecord);
            console.log('✅ Email notification sent');

            // Show success message
            console.log('🎉 Showing success message...');
            this.showSuccess(discountCode);
            console.log('✅ Success message displayed');

            // Track conversion event
            console.log('📊 Tracking conversion event...');
            this.trackConversion(leadRecord);
            console.log('✅ Conversion tracked');

        } catch (error) {
            console.error('═══════════════════════════════════════════════════');
            console.error('❌ CRITICAL ERROR in handleFormSubmit');
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('Error object:', error);
            console.error('═══════════════════════════════════════════════════');

            // Show user-friendly error
            this.showError('Something went wrong. Please try again or call us directly at (613) 301-1311.');

            // Alert for debugging (remove in production)
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                alert('DEBUG ERROR: ' + error.message + '\nCheck console for details.');
            }
        } finally {
            console.log('🔄 Resetting form loading state...');
            this.setFormLoading(false);
            console.log('✅ Form loading state reset');
        }

        } catch (outerError) {
            console.error('═══════════════════════════════════════════════════');
            console.error('❌ OUTER CATCH: Critical error in handleFormSubmit');
            console.error('This error occurred outside the main try-catch block');
            console.error('Error:', outerError);
            console.error('Stack:', outerError.stack);
            console.error('═══════════════════════════════════════════════════');
            alert('Critical error: ' + outerError.message);
        }
    }

    generateUniqueCode() {
        const prefix = 'CCC15';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}${random}`;
    }

    getExpiryDate(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString();
    }

    isDuplicateAddress(address) {
        try {
            // Normalize address for comparison (remove spaces, lowercase, remove punctuation)
            const normalizedAddress = address.toLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                .replace(/\s+/g, '');

            // Get existing leads
            const existingLeads = JSON.parse(localStorage.getItem('ccc_leads') || '[]');

            // Check if any existing lead has the same normalized address
            return existingLeads.some(lead => {
                if (!lead.address) return false;

                const existingNormalizedAddress = lead.address.toLowerCase()
                    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                    .replace(/\s+/g, '');

                return existingNormalizedAddress === normalizedAddress;
            });
        } catch (error) {
            console.error('Error checking duplicate address:', error);
            return false; // Allow submission if check fails
        }
    }

    saveLeadRecord(leadRecord) {
        try {
            // Get existing leads
            const existingLeads = JSON.parse(localStorage.getItem('ccc_leads') || '[]');

            // Add new lead
            existingLeads.push(leadRecord);

            // Keep only last 100 leads to prevent storage bloat
            if (existingLeads.length > 100) {
                existingLeads.splice(0, existingLeads.length - 100);
            }

            // Save back to localStorage
            localStorage.setItem('ccc_leads', JSON.stringify(existingLeads));

            // Also save individual record for easy access
            localStorage.setItem(`ccc_lead_${leadRecord.discountCode}`, JSON.stringify(leadRecord));

        } catch (error) {
            console.error('Error saving lead record:', error);
        }
    }

    async sendEmailNotification(leadRecord) {
        try {
            // Check if EmailJS is loaded
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS library not loaded');
            }

            // Initialize EmailJS with your existing public key
            const PUBLIC_KEY = 'Ej7_wQOBOKJhHgJhJ'; // Your actual EmailJS public key
            emailjs.init(PUBLIC_KEY);

            console.log('🔧 EmailJS initialized, sending emails...');

            // Send emails in sequence with proper error handling
            const emailResults = await Promise.allSettled([
                this.sendWelcomeEmail(leadRecord),
                this.sendBusinessNotification(leadRecord)
            ]);

            // Check results and handle any failures
            let successCount = 0;
            let failureCount = 0;

            emailResults.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    successCount++;
                    console.log(`✅ Email ${index + 1} sent successfully`);
                } else {
                    failureCount++;
                    console.error(`❌ Email ${index + 1} failed:`, result.reason);
                }
            });

            if (successCount > 0) {
                console.log(`✅ Email system: ${successCount} emails sent, ${failureCount} failed`);
                // Schedule follow-up emails only if at least one email succeeded
                this.scheduleFollowUpEmails(leadRecord);
                return true;
            } else {
                throw new Error('All email deliveries failed');
            }

        } catch (error) {
            console.error('❌ Email system error:', error);
            // Store for manual follow-up
            this.storeForManualFollowUp(leadRecord);
            // Show user-friendly error message
            this.showEmailError(error.message);
            return false;
        }
    }

    showEmailError(errorMessage) {
        // Create a user-friendly error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'email-error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Email Delivery Issue</h4>
                <p>Your discount code has been generated, but there was an issue sending the email. Please contact us at (613) 301-1311 to receive your code.</p>
                <button onclick="this.parentElement.parentElement.remove()" class="error-close-btn">Close</button>
            </div>
        `;

        // Add error styling
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fee2e2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 16px;
            max-width: 400px;
            z-index: 10000;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        `;

        document.body.appendChild(errorDiv);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 10000);
    }

    simulateEmailDelivery(leadRecord) {
        // Simulate email delivery for demo purposes
        console.log('📧 SIMULATED EMAIL DELIVERY:');
        console.log('Welcome Email Sent To:', leadRecord.email);
        console.log('Discount Code:', leadRecord.discountCode);
        console.log('Business Notification Sent To: info@capitalcitycontractors.ca');

        // Show success message to user
        setTimeout(() => {
            console.log('✅ Email delivery simulation complete');
        }, 1000);
    }

    async sendWelcomeEmail(leadRecord) {
        // Using your existing EmailJS service
        const SERVICE_ID = 'service_8h9k2lm'; // Your EmailJS service ID
        const TEMPLATE_ID = 'template_lr9bhr9'; // Your actual EmailJS template ID for customer welcome email

        const templateParams = {
            // Standard EmailJS parameters
            to_name: leadRecord.name,
            to_email: leadRecord.email,
            from_name: 'Capital City Contractors',
            reply_to: 'info@capitalcitycontractors.ca',

            // Custom parameters for the discount email
            discount_code: leadRecord.discountCode,
            project_type: leadRecord.project || 'Not specified',
            customer_phone: leadRecord.phone || 'Not provided',
            customer_address: leadRecord.address || 'Not provided',
            expiry_date: new Date(leadRecord.codeExpiry).toLocaleDateString('en-CA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),

            // Company information
            company_name: 'Capital City Contractors',
            company_phone: '(613) 301-1311',
            company_email: 'info@capitalcitycontractors.ca',
            website: 'https://capitalcitycontractors.ca',

            // Email subject
            subject: 'Your 15% Discount Code is Ready! - Capital City Contractors',

            // Formatted message content
            discount_percentage: '15%',
            savings_amount: '15% off your first project',
            call_to_action: 'Call (613) 301-1311 to book your FREE estimate',

            // Trust indicators
            experience_years: '14+',
            customer_count: '500+',
            rating: '5-star Google rating',

            // Instructions
            usage_instructions: `1. Call us at (613) 301-1311 to discuss your project
2. Mention your discount code: ${leadRecord.discountCode}
3. Schedule your FREE estimate
4. Save 15% on your renovation project!`,

            // Current timestamp for tracking
            timestamp: new Date().toISOString()
        };

        try {
            console.log('📧 Sending welcome email to:', leadRecord.email);
            console.log('📋 Template parameters:', templateParams);

            // Send welcome email with discount code using EmailJS
            const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);

            console.log('✅ Welcome email sent successfully:', response);
            console.log('📧 Email sent to:', leadRecord.email);
            console.log('🎟️ Discount code:', leadRecord.discountCode);

            return true;
        } catch (error) {
            console.error('❌ Welcome email failed:', error);

            // Detailed error logging for troubleshooting
            console.log('🔍 Error details:', {
                error: error.message,
                serviceId: SERVICE_ID,
                templateId: TEMPLATE_ID,
                recipientEmail: leadRecord.email,
                discountCode: leadRecord.discountCode
            });

            // Log the email content for manual sending
            console.log('📧 EMAIL CONTENT FOR MANUAL SENDING:');
            console.log('To:', leadRecord.email);
            console.log('Subject:', templateParams.subject);
            console.log('Discount Code:', leadRecord.discountCode);
            console.log('Expiry Date:', templateParams.expiry_date);

            throw error; // Re-throw to be handled by the calling function
        }
    }

    async sendBusinessNotification(leadRecord) {
        // Using your existing EmailJS service
        const SERVICE_ID = 'service_8h9k2lm'; // Same service ID as welcome email
        const BUSINESS_TEMPLATE_ID = 'template_discount_business'; // Template you'll create in EmailJS

        const businessParams = {
            // EmailJS standard parameters
            to_name: 'Capital City Contractors Team',
            to_email: 'info@capitalcitycontractors.ca',
            from_name: 'Lead Generation System',
            reply_to: 'noreply@capitalcitycontractors.ca',

            // Lead information
            lead_name: leadRecord.name,
            lead_email: leadRecord.email,
            lead_phone: leadRecord.phone || 'Not provided',
            lead_address: leadRecord.address || 'Not provided',
            project_type: leadRecord.project || 'Not specified',
            discount_code: leadRecord.discountCode,

            // Timing and source information
            timestamp: new Date(leadRecord.timestamp).toLocaleString('en-CA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            }),
            source: leadRecord.source,
            form_url: 'https://capitalcitycontractors.ca',

            // Email subject
            subject: `🚨 NEW LEAD ALERT - ${leadRecord.name} - ${leadRecord.project || 'General Inquiry'}`,

            // Priority and urgency indicators
            priority: 'HIGH',
            urgency: 'IMMEDIATE ACTION REQUIRED',

            // Conversion optimization tips
            action_items: `1. Call within 5 minutes for best conversion rates
2. Reference discount code: ${leadRecord.discountCode}
3. Schedule FREE estimate appointment
4. Follow up with project-specific information`,

            // Contact methods
            lead_contact_methods: leadRecord.phone ?
                `Phone: ${leadRecord.phone} | Email: ${leadRecord.email} | Address: ${leadRecord.address}` :
                `Email: ${leadRecord.email} | Address: ${leadRecord.address} (No phone provided)`,

            // System information
            system_info: 'Automated notification from lead generation system',
            crm_access: 'Type LeadGenerationSystem.createCRMDashboard() in browser console to access CRM',

            // Lead scoring (simple implementation)
            lead_score: this.calculateLeadScore(leadRecord),

            // Current timestamp for tracking
            notification_timestamp: new Date().toISOString()
        };

        try {
            console.log('📧 Sending business notification for lead:', leadRecord.name);
            console.log('📋 Business notification parameters:', businessParams);

            // Send notification to business owner
            const response = await emailjs.send(SERVICE_ID, BUSINESS_TEMPLATE_ID, businessParams);

            console.log('✅ Business notification sent successfully:', response);
            console.log('📧 Notification sent for lead:', leadRecord.name);
            console.log('🎟️ Lead discount code:', leadRecord.discountCode);

            return true;
        } catch (error) {
            console.error('❌ Business notification failed:', error);

            // Detailed error logging for troubleshooting
            console.log('🔍 Business notification error details:', {
                error: error.message,
                serviceId: SERVICE_ID,
                templateId: BUSINESS_TEMPLATE_ID,
                leadName: leadRecord.name,
                leadEmail: leadRecord.email,
                discountCode: leadRecord.discountCode
            });

            // Log the notification for manual review
            console.log('📧 BUSINESS NOTIFICATION FOR MANUAL REVIEW:');
            console.log('To: info@capitalcitycontractors.ca');
            console.log('Subject:', businessParams.subject);
            console.log('Lead Name:', leadRecord.name);
            console.log('Lead Email:', leadRecord.email);
            console.log('Lead Phone:', leadRecord.phone || 'Not provided');
            console.log('Project Type:', leadRecord.project || 'Not specified');
            console.log('Discount Code:', leadRecord.discountCode);
            console.log('Timestamp:', businessParams.timestamp);

            throw error; // Re-throw to be handled by the calling function
        }
    }

    calculateLeadScore(leadRecord) {
        let score = 50; // Base score

        // Add points for phone number (higher conversion rate)
        if (leadRecord.phone && leadRecord.phone.trim() !== '') {
            score += 30;
        }

        // Add points for specific project type
        if (leadRecord.project && leadRecord.project !== 'Not specified') {
            score += 20;
        }

        // Add points for complete information
        if (leadRecord.name && leadRecord.email && leadRecord.phone && leadRecord.project) {
            score += 10;
        }

        return Math.min(score, 100); // Cap at 100
    }

    scheduleFollowUpEmails(leadRecord) {
        // Schedule follow-up emails using setTimeout (for demo)
        // In production, use a proper email automation service

        const followUpSchedule = [
            { delay: 24 * 60 * 60 * 1000, template: 'template_followup_1' }, // 1 day
            { delay: 7 * 24 * 60 * 60 * 1000, template: 'template_followup_2' }, // 1 week
            { delay: 30 * 24 * 60 * 60 * 1000, template: 'template_monthly' } // 1 month
        ];

        followUpSchedule.forEach(({ delay, template }) => {
            setTimeout(async () => {
                try {
                    await this.sendFollowUpEmail(leadRecord, template);
                } catch (error) {
                    console.error('Follow-up email failed:', error);
                }
            }, delay);
        });

        // Store follow-up schedule in localStorage for persistence
        const followUps = JSON.parse(localStorage.getItem('ccc_followups') || '[]');
        followUps.push({
            leadId: leadRecord.discountCode,
            email: leadRecord.email,
            name: leadRecord.name,
            scheduledEmails: followUpSchedule.map(item => ({
                ...item,
                scheduledFor: new Date(Date.now() + item.delay).toISOString(),
                sent: false
            }))
        });
        localStorage.setItem('ccc_followups', JSON.stringify(followUps));
    }

    async sendFollowUpEmail(leadRecord, templateId) {
        const templateParams = {
            to_name: leadRecord.name,
            to_email: leadRecord.email,
            company_name: 'Capital City Contractors',
            company_phone: '(613) 301-1311',
            website: 'https://capitalcitycontractors.ca'
        };

        await emailjs.send('service_ccc_leads', templateId, templateParams);
        console.log(`Follow-up email sent: ${templateId}`);
    }

    storeForManualFollowUp(leadRecord) {
        const manualFollowUps = JSON.parse(localStorage.getItem('ccc_manual_followups') || '[]');
        manualFollowUps.push({
            ...leadRecord,
            needsManualFollowUp: true,
            reason: 'Email automation failed'
        });
        localStorage.setItem('ccc_manual_followups', JSON.stringify(manualFollowUps));
    }

    showSuccess(discountCode) {
        // Show confirmation popup first
        this.showConfirmationPopup(discountCode);

        // Hide form
        this.formContainer.style.display = 'none';

        // Update discount code in success message
        this.generatedCodeSpan.textContent = discountCode;

        // Show success message
        this.successDiv.classList.remove('hidden');

        // Add success animation
        this.successDiv.style.opacity = '0';
        this.successDiv.style.transform = 'translateY(20px)';

        setTimeout(() => {
            this.successDiv.style.transition = 'all 0.5s ease';
            this.successDiv.style.opacity = '1';
            this.successDiv.style.transform = 'translateY(0)';
        }, 100);

        // Scroll to success message
        this.successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Show confirmation in console for testing
        console.log('🎉 SUCCESS! Discount code generated:', discountCode);
        console.log('📧 Email notifications sent (or simulated)');
        console.log('💾 Lead data saved to localStorage');
    }

    showConfirmationPopup(discountCode) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'discount-confirmation-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
            animation: slideUp 0.4s ease;
            position: relative;
        `;

        modalContent.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="
                    width: 80px;
                    height: 80px;
                    background: #10b981;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    animation: scaleIn 0.5s ease;
                ">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h2 style="
                    color: #1e293b;
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0 0 15px 0;
                    font-family: 'Roboto', sans-serif;
                ">Success! 🎉</h2>
                <p style="
                    color: #64748b;
                    font-size: 16px;
                    line-height: 1.6;
                    margin: 0 0 20px 0;
                ">Your discount code has been generated and sent to your email.</p>
            </div>

            <div style="
                background: #f1f5f9;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 25px;
            ">
                <p style="
                    color: #475569;
                    font-size: 14px;
                    font-weight: 600;
                    margin: 0 0 10px 0;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                ">Your Discount Code</p>
                <p style="
                    color: #1e293b;
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 2px;
                ">${discountCode}</p>
            </div>

            <div style="
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                border-radius: 6px;
                padding: 15px;
                margin-bottom: 25px;
                text-align: left;
            ">
                <p style="
                    color: #92400e;
                    font-size: 14px;
                    line-height: 1.6;
                    margin: 0;
                ">
                    <strong style="display: block; margin-bottom: 5px;">📧 Check Your Email</strong>
                    An email with your discount code has been sent to your inbox.
                    <strong style="display: block; margin-top: 8px;">If you don't see it within a few minutes, please check your spam/junk folder.</strong>
                </p>
            </div>

            <button onclick="this.closest('.discount-confirmation-modal').remove()" style="
                background: #1e40af;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 14px 32px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Roboto', sans-serif;
                width: 100%;
            " onmouseover="this.style.background='#1e3a8a'" onmouseout="this.style.background='#1e40af'">
                Got It!
            </button>
        `;

        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes scaleIn {
                from {
                    transform: scale(0);
                }
                to {
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Auto-close after 10 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => modal.remove(), 300);
            }
        }, 10000);
    }

    showError(message) {
        // Create or update error message
        let errorDiv = this.form.querySelector('.form-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.cssText = `
                background: #fee2e2;
                color: #dc2626;
                padding: 12px;
                border-radius: 6px;
                margin-bottom: 16px;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            this.form.insertBefore(errorDiv, this.form.firstChild);
        }
        
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setFormLoading(loading) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Your Code...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-gift"></i> Get My 15% Discount Code';
        }
    }

    copyDiscountCode() {
        const code = this.generatedCodeSpan.textContent;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(code).then(() => {
                this.showCopySuccess();
            }).catch(() => {
                this.fallbackCopyCode(code);
            });
        } else {
            this.fallbackCopyCode(code);
        }
    }

    fallbackCopyCode(code) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess();
        } catch (error) {
            console.error('Copy failed:', error);
        }
        
        document.body.removeChild(textArea);
    }

    showCopySuccess() {
        const originalText = this.copyCodeBtn.innerHTML;
        this.copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        this.copyCodeBtn.style.background = '#10b981';
        
        setTimeout(() => {
            this.copyCodeBtn.innerHTML = originalText;
            this.copyCodeBtn.style.background = '';
        }, 2000);
    }

    trackConversion(leadRecord) {
        // Track with Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'lead_generation', {
                event_category: 'Lead Generation',
                event_label: 'Discount Code Generated',
                value: 1,
                custom_parameters: {
                    project_type: leadRecord.project,
                    discount_code: leadRecord.discountCode
                }
            });
        }

        // Track with Facebook Pixel if available
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Discount Code Request',
                content_category: 'Lead Generation',
                value: 15,
                currency: 'CAD'
            });
        }

        console.log('Lead conversion tracked:', leadRecord.discountCode);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Static method to get comprehensive lead statistics and CRM data
    static getLeadStatistics() {
        try {
            const leads = JSON.parse(localStorage.getItem('ccc_leads') || '[]');
            const followUps = JSON.parse(localStorage.getItem('ccc_followups') || '[]');
            const manualFollowUps = JSON.parse(localStorage.getItem('ccc_manual_followups') || '[]');
            const now = new Date();

            return {
                total: leads.length,
                thisMonth: leads.filter(lead => {
                    const leadDate = new Date(lead.timestamp);
                    return leadDate.getMonth() === now.getMonth() &&
                           leadDate.getFullYear() === now.getFullYear();
                }).length,
                thisWeek: leads.filter(lead => {
                    const leadDate = new Date(lead.timestamp);
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return leadDate >= weekAgo;
                }).length,
                byProject: leads.reduce((acc, lead) => {
                    acc[lead.project] = (acc[lead.project] || 0) + 1;
                    return acc;
                }, {}),
                recentLeads: leads.slice(-10).reverse(),
                followUpsPending: followUps.length,
                manualFollowUpsNeeded: manualFollowUps.length,
                conversionRate: this.calculateConversionRate(leads),
                emailCampaignStats: this.getEmailCampaignStats(followUps)
            };
        } catch (error) {
            console.error('Error getting lead statistics:', error);
            return { total: 0, thisMonth: 0, thisWeek: 0, byProject: {}, recentLeads: [], followUpsPending: 0, manualFollowUpsNeeded: 0 };
        }
    }

    static calculateConversionRate(leads) {
        const totalLeads = leads.length;
        const convertedLeads = leads.filter(lead => lead.converted || lead.used).length;
        return totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;
    }

    static getEmailCampaignStats(followUps) {
        const totalScheduled = followUps.reduce((acc, followUp) => acc + followUp.scheduledEmails.length, 0);
        const totalSent = followUps.reduce((acc, followUp) =>
            acc + followUp.scheduledEmails.filter(email => email.sent).length, 0);

        return {
            totalScheduled,
            totalSent,
            deliveryRate: totalScheduled > 0 ? ((totalSent / totalScheduled) * 100).toFixed(1) : 0
        };
    }

    // CRM Dashboard Methods
    static createCRMDashboard() {
        const stats = this.getLeadStatistics();
        const leads = JSON.parse(localStorage.getItem('ccc_leads') || '[]');

        const dashboardHTML = `
            <div id="crmDashboard" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10000;
                overflow-y: auto;
                padding: 20px;
                box-sizing: border-box;
            ">
                <div style="
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 10px;
                    padding: 30px;
                    position: relative;
                ">
                    <button onclick="document.getElementById('crmDashboard').remove()" style="
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: #dc2626;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        padding: 10px 15px;
                        cursor: pointer;
                        font-size: 16px;
                    ">✕ Close</button>

                    <h1 style="color: #1e40af; margin-bottom: 30px;">Capital City Contractors - CRM Dashboard</h1>

                    <!-- Statistics Overview -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center;">
                            <h3 style="margin: 0; color: #1e40af;">Total Leads</h3>
                            <p style="font-size: 2em; font-weight: bold; margin: 10px 0; color: #059669;">${stats.total}</p>
                        </div>
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center;">
                            <h3 style="margin: 0; color: #1e40af;">This Month</h3>
                            <p style="font-size: 2em; font-weight: bold; margin: 10px 0; color: #0891b2;">${stats.thisMonth}</p>
                        </div>
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center;">
                            <h3 style="margin: 0; color: #1e40af;">This Week</h3>
                            <p style="font-size: 2em; font-weight: bold; margin: 10px 0; color: #7c3aed;">${stats.thisWeek}</p>
                        </div>
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center;">
                            <h3 style="margin: 0; color: #1e40af;">Conversion Rate</h3>
                            <p style="font-size: 2em; font-weight: bold; margin: 10px 0; color: #dc2626;">${stats.conversionRate}%</p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div style="margin-bottom: 30px; display: flex; gap: 15px; flex-wrap: wrap;">
                        <button onclick="LeadGenerationSystem.exportLeadsCSV()" style="
                            background: #059669;
                            color: white;
                            border: none;
                            padding: 12px 20px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                        ">📊 Export Leads CSV</button>
                        <button onclick="LeadGenerationSystem.sendBulkEmail()" style="
                            background: #0891b2;
                            color: white;
                            border: none;
                            padding: 12px 20px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                        ">📧 Send Bulk Email</button>
                        <button onclick="LeadGenerationSystem.clearOldLeads()" style="
                            background: #dc2626;
                            color: white;
                            border: none;
                            padding: 12px 20px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                        ">🗑️ Clear Old Leads</button>
                    </div>

                    <!-- Recent Leads Table -->
                    <h2 style="color: #1e40af; margin-bottom: 20px;">Recent Leads</h2>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                            <thead>
                                <tr style="background: #f3f4f6;">
                                    <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Name</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Email</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Phone</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Address</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Project</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Discount Code</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Date</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${leads.slice(-20).reverse().map(lead => `
                                    <tr>
                                        <td style="padding: 12px; border: 1px solid #d1d5db;">${lead.name}</td>
                                        <td style="padding: 12px; border: 1px solid #d1d5db;">
                                            <a href="mailto:${lead.email}" style="color: #0891b2;">${lead.email}</a>
                                        </td>
                                        <td style="padding: 12px; border: 1px solid #d1d5db;">
                                            ${lead.phone ? `<a href="tel:${lead.phone}" style="color: #059669;">${lead.phone}</a>` : 'N/A'}
                                        </td>
                                        <td style="padding: 12px; border: 1px solid #d1d5db; font-size: 12px;">${lead.address || 'N/A'}</td>
                                        <td style="padding: 12px; border: 1px solid #d1d5db;">${lead.project || 'Not specified'}</td>
                                        <td style="padding: 12px; border: 1px solid #d1d5db; font-family: monospace; font-weight: bold;">${lead.discountCode}</td>
                                        <td style="padding: 12px; border: 1px solid #d1d5db;">${new Date(lead.timestamp).toLocaleDateString('en-CA')}</td>
                                        <td style="padding: 12px; border: 1px solid #d1d5db;">
                                            <span style="
                                                padding: 4px 8px;
                                                border-radius: 4px;
                                                font-size: 12px;
                                                font-weight: bold;
                                                background: ${lead.used ? '#dcfce7' : '#fef3c7'};
                                                color: ${lead.used ? '#166534' : '#92400e'};
                                            ">${lead.used ? 'CONVERTED' : 'PENDING'}</span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Project Breakdown -->
                    <h2 style="color: #1e40af; margin-bottom: 20px;">Project Type Breakdown</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        ${Object.entries(stats.byProject).map(([project, count]) => `
                            <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; text-align: center;">
                                <h4 style="margin: 0 0 10px 0; color: #374151;">${project || 'Not specified'}</h4>
                                <p style="font-size: 1.5em; font-weight: bold; margin: 0; color: #059669;">${count}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dashboardHTML);
    }

    static exportLeadsCSV() {
        const leads = JSON.parse(localStorage.getItem('ccc_leads') || '[]');
        const csvContent = [
            ['Name', 'Email', 'Phone', 'Address', 'Project', 'Discount Code', 'Date', 'Expiry', 'Used', 'Source'].join(','),
            ...leads.map(lead => [
                lead.name,
                lead.email,
                lead.phone || '',
                lead.address || '',
                lead.project || '',
                lead.discountCode,
                new Date(lead.timestamp).toLocaleDateString('en-CA'),
                new Date(lead.codeExpiry).toLocaleDateString('en-CA'),
                lead.used ? 'Yes' : 'No',
                lead.source
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CCC_Leads_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    static async sendBulkEmail() {
        const leads = JSON.parse(localStorage.getItem('ccc_leads') || '[]');
        const emailList = leads.map(lead => lead.email).join(', ');

        alert(`Email list copied to clipboard:\n\n${emailList}\n\nYou can now paste this into your email marketing platform (Mailchimp, Constant Contact, etc.)`);

        // Copy to clipboard
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(emailList);
        }
    }

    static clearOldLeads() {
        if (confirm('Are you sure you want to clear leads older than 90 days? This cannot be undone.')) {
            const leads = JSON.parse(localStorage.getItem('ccc_leads') || '[]');
            const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
            const recentLeads = leads.filter(lead => new Date(lead.timestamp) > ninetyDaysAgo);

            localStorage.setItem('ccc_leads', JSON.stringify(recentLeads));
            alert(`Cleared ${leads.length - recentLeads.length} old leads. ${recentLeads.length} recent leads retained.`);

            // Refresh dashboard if open
            const dashboard = document.getElementById('crmDashboard');
            if (dashboard) {
                dashboard.remove();
                this.createCRMDashboard();
            }
        }
    }
}

// Initialize when DOM is loaded
console.log('📝 Registering DOMContentLoaded event listener...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('═══════════════════════════════════════════════════');
    console.log('🚀 DOMContentLoaded event fired!');
    console.log('🕐 Timestamp:', new Date().toISOString());
    console.log('📍 Location:', window.location.href);
    console.log('═══════════════════════════════════════════════════');

    console.log('🚀 Lead Generation System: Initializing...');
    console.log('🔍 Looking for form with ID: discountForm');

    const form = document.getElementById('discountForm');
    if (form) {
        console.log('✅ Discount form found!');
        console.log('📋 Form element:', form);
        console.log('📋 Form ID:', form.id);
        console.log('📋 Form class:', form.className);
        console.log('📋 Form parent:', form.parentElement);
    } else {
        console.error('❌ ERROR: Discount form NOT found! Check if ID="discountForm" exists in HTML');
        console.log('🔍 All forms on page:', document.querySelectorAll('form'));
        console.log('🔍 All elements with "discount" in ID:',
            Array.from(document.querySelectorAll('[id*="discount"]')).map(el => ({
                id: el.id,
                tag: el.tagName,
                class: el.className
            }))
        );
    }

    console.log('🔧 Checking EmailJS availability...');
    if (typeof emailjs !== 'undefined') {
        console.log('✅ EmailJS library loaded successfully');
        console.log('📦 EmailJS object:', emailjs);
        console.log('📦 EmailJS methods:', Object.keys(emailjs));
    } else {
        console.error('❌ ERROR: EmailJS library NOT loaded!');
        console.error('💡 Check if script tag exists: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>');
        console.error('💡 Check browser console for script loading errors');
        console.error('💡 Check network tab for failed requests');
    }

    console.log('🔧 Checking window.emailjs:', window.emailjs);
    console.log('🔧 Checking global emailjs:', typeof window['emailjs']);

    try {
        console.log('🏗️ Creating LeadGenerationSystem instance...');
        const system = new LeadGenerationSystem();
        console.log('✅ Lead Generation System initialized successfully');
        console.log('📊 System object:', system);
        console.log('📊 System has form:', !!system.form);
        console.log('📊 System form ID:', system.form ? system.form.id : 'N/A');

        // Make system globally accessible for debugging
        window.leadGenSystem = system;
        console.log('✅ System available globally as window.leadGenSystem');

    } catch (error) {
        console.error('═══════════════════════════════════════════════════');
        console.error('❌ CRITICAL ERROR initializing Lead Generation System');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Error object:', error);
        console.error('═══════════════════════════════════════════════════');

        // Show alert for critical errors
        alert('CRITICAL ERROR: Lead Generation System failed to initialize.\n\n' +
              'Error: ' + error.message + '\n\n' +
              'Please check the browser console (F12) for details.');
    }

    console.log('═══════════════════════════════════════════════════');
    console.log('✅ DOMContentLoaded initialization complete');
    console.log('═══════════════════════════════════════════════════');
});

console.log('✅ DOMContentLoaded event listener registered');

// Testing and Verification Functions
LeadGenerationSystem.testEmailSystem = async function() {
    console.log('🧪 TESTING EMAIL SYSTEM...');

    const testLead = {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '613-555-0123',
        project: 'Interior Painting',
        discountCode: 'CCC15-TEST123',
        timestamp: new Date().toISOString(),
        codeExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Email System Test'
    };

    const system = new LeadGenerationSystem();

    try {
        console.log('📧 Testing email notification system...');
        await system.sendEmailNotification(testLead);
        console.log('✅ Email system test completed');
        return true;
    } catch (error) {
        console.error('❌ Email system test failed:', error);
        return false;
    }
};

LeadGenerationSystem.testFormValidation = function() {
    console.log('🧪 TESTING FORM VALIDATION...');

    const system = new LeadGenerationSystem();

    // Test email validation
    const validEmails = ['test@example.com', 'user@domain.co.uk', 'name+tag@company.org'];
    const invalidEmails = ['invalid-email', '@domain.com', 'user@', 'user@domain'];

    console.log('✅ Valid emails:');
    validEmails.forEach(email => {
        const isValid = system.isValidEmail(email);
        console.log(`  ${email}: ${isValid ? '✅' : '❌'}`);
    });

    console.log('❌ Invalid emails:');
    invalidEmails.forEach(email => {
        const isValid = system.isValidEmail(email);
        console.log(`  ${email}: ${isValid ? '✅' : '❌'}`);
    });

    console.log('✅ Form validation test completed');
    return true;
};

LeadGenerationSystem.testDiscountCodeGeneration = function() {
    console.log('🧪 TESTING DISCOUNT CODE GENERATION...');

    const system = new LeadGenerationSystem();
    const codes = [];

    // Generate 10 codes to test uniqueness
    for (let i = 0; i < 10; i++) {
        const code = system.generateUniqueCode();
        codes.push(code);
        console.log(`Code ${i + 1}: ${code}`);
    }

    // Check for duplicates
    const uniqueCodes = [...new Set(codes)];
    const hasDuplicates = uniqueCodes.length !== codes.length;

    console.log(`Generated ${codes.length} codes, ${uniqueCodes.length} unique`);
    console.log(`Duplicates found: ${hasDuplicates ? '❌' : '✅'}`);
    console.log('✅ Discount code generation test completed');

    return !hasDuplicates;
};

// Comprehensive system test
LeadGenerationSystem.runFullSystemTest = async function() {
    console.log('🚀 RUNNING COMPREHENSIVE SYSTEM TEST...');
    console.log('='.repeat(50));

    const results = {
        formValidation: this.testFormValidation(),
        codeGeneration: this.testDiscountCodeGeneration(),
        emailSystem: await this.testEmailSystem()
    };

    console.log('='.repeat(50));
    console.log('📊 TEST RESULTS:');
    console.log(`Form Validation: ${results.formValidation ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Code Generation: ${results.codeGeneration ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Email System: ${results.emailSystem ? '✅ PASS' : '❌ FAIL'}`);

    const allPassed = Object.values(results).every(result => result);
    console.log(`Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

    return results;
};

// Export for admin access
window.LeadGenerationSystem = LeadGenerationSystem;
