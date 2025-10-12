/**
 * EmailJS Integration for Capital City Contractors Quote Form
 * SIMPLIFIED VERSION - Direct form handling
 */

// Initialize EmailJS and form handler on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 INITIALIZING QUOTE FORM');
    
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init('Ej7_wQOBOKJhHgJhJ');
        console.log('✅ EmailJS initialized');
    } else {
        console.error('❌ EmailJS not loaded');
        return;
    }
    
    // Get form
    const form = document.getElementById('quoteForm');
    if (!form) {
        console.error('❌ Form not found');
        return;
    }
    console.log('✅ Form found');
    
    // Get submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) {
        console.error('❌ Submit button not found');
        return;
    }
    console.log('✅ Submit button found');
    
    // Add submit handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('🎯 FORM SUBMITTED!');
        
        // Get form values
        const name = form.querySelector('[name="name"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const phone = form.querySelector('[name="phone"]').value.trim();
        const service = form.querySelector('[name="service"]').value;
        const message = form.querySelector('[name="message"]').value.trim();
        
        console.log('📋 Form data:', { name, email, phone, service, message });
        
        // Simple validation
        if (!name || !email || !phone || !service || !message) {
            alert('Please fill in all required fields');
            console.log('❌ Validation failed');
            return;
        }
        
        // Disable button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        console.log('⏳ Sending email...');
        
        try {
            // Send email
            const response = await emailjs.send(
                'service_8h9k2lm',
                'template_quote_request',
                {
                    from_name: name,
                    from_email: email,
                    from_phone: phone,
                    service_type: service,
                    message: message,
                    to_name: 'Capital City Contractors',
                    reply_to: email
                }
            );
            
            console.log('✅ Email sent!', response);

            // Track Lead conversion with Meta Pixel
            try {
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: 'Quote Request',
                        content_category: 'Quote Form',
                        currency: 'CAD',
                        value: 0.00
                    }, {
                        eventID: 'quote_' + Date.now(),
                        test_event_code: 'TEST42844'  // Facebook Test Events code
                    });
                    console.log('✅ Meta Pixel Lead event tracked with test code TEST42844');
                } else {
                    console.log('⚠️ Meta Pixel not loaded');
                }
            } catch (error) {
                console.warn('⚠️ Meta Pixel tracking failed (non-critical):', error);
            }

            // Show success modal
            const modal = document.getElementById('successModal');
            if (modal) {
                modal.style.display = 'block';
                console.log('✅ Modal shown');
            }

            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('❌ Send failed:', error);
            alert('Failed to send. Please try again or call us at (613) 301-1311');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Quote Request';
        }
    });
    
    console.log('✅ Form handler attached');
    
    // Setup modal close handlers
    const modal = document.getElementById('successModal');
    const closeBtn = document.getElementById('closeModal');
    
    if (closeBtn && modal) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
        console.log('✅ Modal handlers attached');
    }
});

