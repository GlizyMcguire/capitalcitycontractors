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
        // Check if EmailJS is available and configured
        if (typeof emailjs !== 'undefined' && window.emailjsConfig) {
            try {
                const templateParams = {
                    to_name: leadRecord.name,
                    to_email: leadRecord.email,
                    discount_code: leadRecord.discountCode,
                    project_type: leadRecord.project,
                    phone: leadRecord.phone,
                    expiry_date: new Date(leadRecord.codeExpiry).toLocaleDateString(),
                    company_name: 'Capital City Contractors',
                    company_phone: '(613) 301-1311'
                };

                await emailjs.send(
                    window.emailjsConfig.serviceId,
                    window.emailjsConfig.discountTemplateId,
                    templateParams
                );
            } catch (error) {
                console.error('Email sending failed:', error);
                // Don't throw error - form should still succeed
            }
        }
    }

    showSuccess(discountCode) {
        // Hide form
        this.formContainer.style.display = 'none';
        
        // Update discount code in success message
        this.generatedCodeSpan.textContent = discountCode;
        
        // Show success message
        this.successDiv.classList.remove('hidden');
        
        // Scroll to success message
        this.successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

    // Static method to get lead statistics (for admin use)
    static getLeadStatistics() {
        try {
            const leads = JSON.parse(localStorage.getItem('ccc_leads') || '[]');
            const now = new Date();
            
            return {
                total: leads.length,
                thisMonth: leads.filter(lead => {
                    const leadDate = new Date(lead.timestamp);
                    return leadDate.getMonth() === now.getMonth() && 
                           leadDate.getFullYear() === now.getFullYear();
                }).length,
                byProject: leads.reduce((acc, lead) => {
                    acc[lead.project] = (acc[lead.project] || 0) + 1;
                    return acc;
                }, {}),
                recentLeads: leads.slice(-10).reverse()
            };
        } catch (error) {
            console.error('Error getting lead statistics:', error);
            return { total: 0, thisMonth: 0, byProject: {}, recentLeads: [] };
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new LeadGenerationSystem();
});

// Export for admin access
window.LeadGenerationSystem = LeadGenerationSystem;
