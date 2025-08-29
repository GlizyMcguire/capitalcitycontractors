/**
 * EmailJS Integration for Capital City Contractors Quote Form
 * Handles form submission and email delivery through EmailJS service
 */

class EmailJSIntegration {
    constructor() {
        this.config = {
            // EmailJS Configuration - Using your actual credentials
            publicKey: 'Ej7_wQOBOKJhHgJhJ', // Your EmailJS public key
            serviceId: 'service_8h9k2lm', // Your EmailJS service ID
            templateId: 'template_quote_request', // Your EmailJS template ID
            // Form configuration
            formId: 'quoteForm',
            maxFileSize: 5 * 1024 * 1024, // 5MB per file
            allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
            maxFiles: 5
        };
        
        this.form = null;
        this.isSubmitting = false;
        this.attachedFiles = [];
        
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing EmailJS Integration for Quote Form');
        
        // Initialize EmailJS
        this.initializeEmailJS();
        
        // Set up form handling
        this.setupFormHandling();
        
        // Set up file upload handling
        this.setupFileUpload();
        
        console.log('✅ EmailJS Integration initialized successfully');
    }
    
    initializeEmailJS() {
        // Initialize EmailJS with your public key
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.config.publicKey);
            console.log('✅ EmailJS initialized with public key');
        } else {
            console.error('❌ EmailJS library not loaded');
        }
    }
    
    setupFormHandling() {
        this.form = document.getElementById(this.config.formId);
        
        if (!this.form) {
            console.error('❌ Quote form not found');
            return;
        }
        
        // Add form submit event listener
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Add real-time validation
        this.setupFormValidation();
        
        console.log('✅ Form handling setup complete');
    }
    
    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
            if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }
    
    showFieldValidation(field, isValid, errorMessage) {
        // Remove existing error styling
        field.classList.remove('error', 'valid');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid && errorMessage) {
            field.classList.add('error');
            
            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        } else if (field.value.trim()) {
            field.classList.add('valid');
        }
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    setupFileUpload() {
        const fileInput = document.getElementById('photos');
        const filePreview = document.getElementById('filePreview');
        
        if (!fileInput || !filePreview) {
            console.warn('⚠️ File upload elements not found');
            return;
        }
        
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        console.log('✅ File upload handling setup complete');
    }
    
    handleFileUpload(event) {
        const files = Array.from(event.target.files);
        const filePreview = document.getElementById('filePreview');
        
        // Clear previous previews
        filePreview.innerHTML = '';
        this.attachedFiles = [];
        
        if (files.length === 0) return;
        
        // Validate and process files
        files.forEach((file, index) => {
            if (this.validateFile(file)) {
                this.attachedFiles.push(file);
                this.createFilePreview(file, index, filePreview);
            }
        });
        
        console.log(`📎 ${this.attachedFiles.length} files attached`);
    }
    
    validateFile(file) {
        // Check file type
        if (!this.config.allowedFileTypes.includes(file.type)) {
            this.showError(`File "${file.name}" is not a supported image format`);
            return false;
        }
        
        // Check file size
        if (file.size > this.config.maxFileSize) {
            this.showError(`File "${file.name}" is too large. Maximum size is 5MB`);
            return false;
        }
        
        return true;
    }
    
    createFilePreview(file, index, container) {
        const previewDiv = document.createElement('div');
        previewDiv.className = 'file-preview-item';
        
        const img = document.createElement('img');
        img.className = 'file-preview-image';
        
        const fileName = document.createElement('span');
        fileName.className = 'file-preview-name';
        fileName.textContent = file.name;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'file-preview-remove';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = () => this.removeFile(index);
        
        // Create image preview
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        previewDiv.appendChild(img);
        previewDiv.appendChild(fileName);
        previewDiv.appendChild(removeBtn);
        container.appendChild(previewDiv);
    }
    
    removeFile(index) {
        this.attachedFiles.splice(index, 1);
        this.updateFilePreview();
    }
    
    updateFilePreview() {
        const filePreview = document.getElementById('filePreview');
        filePreview.innerHTML = '';
        
        this.attachedFiles.forEach((file, index) => {
            this.createFilePreview(file, index, filePreview);
        });
    }
    
    async handleFormSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) {
            console.log('⚠️ Form submission already in progress');
            return;
        }
        
        console.log('📝 Processing quote form submission...');
        
        // Validate form
        if (!this.validateForm()) {
            console.log('❌ Form validation failed');
            return;
        }
        
        this.isSubmitting = true;
        this.showSubmittingState();
        
        try {
            // Prepare form data
            const formData = this.prepareFormData();
            
            // Send email via EmailJS
            await this.sendEmail(formData);
            
            // Show success
            this.showSuccess();
            
            // Reset form
            this.resetForm();
            
        } catch (error) {
            console.error('❌ Form submission failed:', error);
            this.showError('Failed to send quote request. Please try again or call us directly.');
        } finally {
            this.isSubmitting = false;
            this.hideSubmittingState();
        }
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    prepareFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            if (key !== 'photos' && key !== 'bot-field') {
                data[key] = value;
            }
        }
        
        // Add additional data
        data.submission_date = new Date().toLocaleString();
        data.files_attached = this.attachedFiles.length;
        data.file_names = this.attachedFiles.map(f => f.name).join(', ');
        
        return data;
    }
    
    async sendEmail(formData) {
        console.log('📧 Sending email via EmailJS...');
        
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            from_phone: formData.phone,
            service_type: formData.service,
            message: formData.message,
            submission_date: formData.submission_date,
            files_attached: formData.files_attached,
            file_names: formData.file_names,
            // Add any additional fields you want in the email
            to_name: 'Capital City Contractors',
            reply_to: formData.email
        };
        
        const response = await emailjs.send(
            this.config.serviceId,
            this.config.templateId,
            templateParams
        );
        
        console.log('✅ Email sent successfully:', response);
        return response;
    }
    
    showSubmittingState() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
    }
    
    hideSubmittingState() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Quote Request';
        }
    }
    
    showSuccess() {
        // Show success modal
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'block';
            
            // Set up close button
            const closeBtn = document.getElementById('closeModal');
            if (closeBtn) {
                closeBtn.onclick = () => {
                    modal.style.display = 'none';
                };
            }
            
            // Close on outside click
            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            };
        }
        
        console.log('✅ Quote request sent successfully');
    }
    
    showError(message) {
        // Create or update error message
        let errorDiv = document.querySelector('.form-error-message');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error-message';
            this.form.insertBefore(errorDiv, this.form.firstChild);
        }
        
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    resetForm() {
        this.form.reset();
        this.attachedFiles = [];
        
        // Clear file preview
        const filePreview = document.getElementById('filePreview');
        if (filePreview) {
            filePreview.innerHTML = '';
        }
        
        // Clear validation states
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.classList.remove('error', 'valid');
            this.clearFieldError(field);
        });
    }
}

// Initialize EmailJS integration when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Starting EmailJS Integration for Quote Form');
    window.emailJSIntegration = new EmailJSIntegration();
});

// Global function for manual form submission (if needed)
window.submitQuoteForm = function() {
    if (window.emailJSIntegration) {
        const form = document.getElementById('quoteForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
};
