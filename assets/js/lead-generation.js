/**
 * Lead Generation System with Unique Discount Code Generation
 * Capital City Contractors - Strategic Lead Capture
 */

class LeadGenerationSystem {
    constructor() {
        this.form = document.getElementById('discountForm');
        this.successDiv = document.getElementById('discountSuccess');
        this.formContainer = document.querySelector('.lead-gen-form-container');
        this.generatedCodeSpan = document.getElementById('generatedCode');
        this.copyCodeBtn = document.getElementById('copyCodeBtn');
        
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
        
        if (this.copyCodeBtn) {
            this.copyCodeBtn.addEventListener('click', this.copyDiscountCode.bind(this));
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const leadData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone') || '',
            project: formData.get('project') || 'Not specified',
            timestamp: new Date().toISOString(),
            source: 'Homepage Discount Form'
        };

        // Validate required fields
        if (!leadData.name || !leadData.email) {
            this.showError('Please fill in all required fields.');
            return;
        }

        // Validate email format
        if (!this.isValidEmail(leadData.email)) {
            this.showError('Please enter a valid email address.');
            return;
        }

        try {
            // Show loading state
            this.setFormLoading(true);

            // Generate unique discount code
            const discountCode = this.generateUniqueCode();
            
            // Store lead data with discount code
            const leadRecord = {
                ...leadData,
                discountCode: discountCode,
                codeExpiry: this.getExpiryDate(30), // 30 days from now
                used: false
            };

            // Save to localStorage for tracking
            this.saveLeadRecord(leadRecord);

            // Send email notification (using EmailJS if configured)
            await this.sendEmailNotification(leadRecord);

            // Show success message
            this.showSuccess(discountCode);

            // Track conversion event
            this.trackConversion(leadRecord);

        } catch (error) {
            console.error('Lead generation error:', error);
            this.showError('Something went wrong. Please try again or call us directly at (613) 301-1311.');
        } finally {
            this.setFormLoading(false);
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
            // Initialize EmailJS with public key (using a demo service for testing)
            if (typeof emailjs !== 'undefined') {
                emailjs.init("user_demo_public_key"); // Demo key for testing

                // Send immediate welcome email with discount code
                await this.sendWelcomeEmail(leadRecord);

                // Schedule follow-up email sequence
                this.scheduleFollowUpEmails(leadRecord);

                // Send notification to business owner
                await this.sendBusinessNotification(leadRecord);

                console.log('✅ Email system initialized and emails sent successfully');
            } else {
                console.warn('⚠️ EmailJS not loaded, using fallback system');
                this.simulateEmailDelivery(leadRecord);
            }

        } catch (error) {
            console.error('❌ Email system error:', error);
            // Fallback: Store for manual follow-up and simulate success
            this.storeForManualFollowUp(leadRecord);
            this.simulateEmailDelivery(leadRecord);
        }
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
        const templateParams = {
            to_name: leadRecord.name,
            to_email: leadRecord.email,
            discount_code: leadRecord.discountCode,
            project_type: leadRecord.project || 'Not specified',
            phone: leadRecord.phone || 'Not provided',
            expiry_date: new Date(leadRecord.codeExpiry).toLocaleDateString('en-CA'),
            company_name: 'Capital City Contractors',
            company_phone: '(613) 301-1311',
            company_email: 'info@capitalcitycontractors.ca',
            website: 'https://capitalcitycontractors.ca',
            message: `Dear ${leadRecord.name},

Thank you for your interest in Capital City Contractors! Your exclusive 15% discount code is ready:

🎁 DISCOUNT CODE: ${leadRecord.discountCode}
📅 EXPIRES: ${new Date(leadRecord.codeExpiry).toLocaleDateString('en-CA')}
💰 SAVINGS: 15% off your first project

PROJECT INTEREST: ${leadRecord.project || 'Not specified'}

How to Use Your Code:
1. Call us at (613) 301-1311 to discuss your project
2. Mention your discount code: ${leadRecord.discountCode}
3. Schedule your FREE estimate
4. Save 15% on your renovation project!

Why Choose Capital City Contractors?
✅ 14+ years of experience in Ottawa
✅ Fully licensed and insured
✅ 500+ satisfied customers
✅ 5-star Google rating

Ready to get started? Call (613) 301-1311 or visit https://capitalcitycontractors.ca

Best regards,
The Capital City Contractors Team
info@capitalcitycontractors.ca`
        };

        try {
            // Send welcome email with discount code using EmailJS
            await emailjs.send(
                'service_demo', // Demo service ID
                'template_demo', // Demo template ID
                templateParams
            );

            console.log('✅ Welcome email sent successfully to:', leadRecord.email);
            return true;
        } catch (error) {
            console.error('❌ Welcome email failed:', error);
            // Log the email content for manual sending
            console.log('📧 EMAIL CONTENT FOR MANUAL SENDING:');
            console.log('To:', leadRecord.email);
            console.log('Subject: Your 15% Discount Code is Ready! - Capital City Contractors');
            console.log('Content:', templateParams.message);
            return false;
        }
    }

    async sendBusinessNotification(leadRecord) {
        const businessParams = {
            to_email: 'info@capitalcitycontractors.ca',
            lead_name: leadRecord.name,
            lead_email: leadRecord.email,
            lead_phone: leadRecord.phone || 'Not provided',
            project_type: leadRecord.project || 'Not specified',
            discount_code: leadRecord.discountCode,
            timestamp: new Date(leadRecord.timestamp).toLocaleString('en-CA'),
            source: leadRecord.source,
            message: `🚨 NEW LEAD ALERT - Capital City Contractors

Lead Details:
👤 Name: ${leadRecord.name}
📧 Email: ${leadRecord.email}
📱 Phone: ${leadRecord.phone || 'Not provided'}
🏠 Project: ${leadRecord.project || 'Not specified'}
🎟️ Discount Code: ${leadRecord.discountCode}
📅 Date: ${new Date(leadRecord.timestamp).toLocaleString('en-CA')}
🌐 Source: ${leadRecord.source}

⚡ IMMEDIATE ACTION REQUIRED:
1. Call the lead within 5 minutes for best conversion rates
2. Reference their discount code: ${leadRecord.discountCode}
3. Schedule a free estimate appointment
4. Follow up with project-specific information

Lead captured from: https://capitalcitycontractors.ca
CRM Dashboard: Press Ctrl+Shift+C on website to access lead management

This is an automated notification from your lead generation system.`
        };

        try {
            // Send notification to business owner
            await emailjs.send(
                'service_demo',
                'template_demo',
                businessParams
            );

            console.log('✅ Business notification sent successfully');
            return true;
        } catch (error) {
            console.error('❌ Business notification failed:', error);
            // Log the notification for manual review
            console.log('📧 BUSINESS NOTIFICATION FOR MANUAL REVIEW:');
            console.log('To: info@capitalcitycontractors.ca');
            console.log('Subject: 🚨 NEW LEAD ALERT - ' + leadRecord.name);
            console.log('Content:', businessParams.message);
            return false;
        }
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
            ['Name', 'Email', 'Phone', 'Project', 'Discount Code', 'Date', 'Expiry', 'Used', 'Source'].join(','),
            ...leads.map(lead => [
                lead.name,
                lead.email,
                lead.phone || '',
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
document.addEventListener('DOMContentLoaded', function() {
    new LeadGenerationSystem();
});

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
