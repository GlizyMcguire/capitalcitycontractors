/**
 * EmailJS quote form integration.
 * Handles the homepage estimate form and keeps the first contact step light.
 */

window.emailJSIntegration = true;

document.addEventListener('DOMContentLoaded', function () {
    if (typeof emailjs === 'undefined') {
        return;
    }

    emailjs.init('Ej7_wQOBOKJhHgJhJ');

    const form = document.getElementById('quoteForm');
    if (!form) {
        return;
    }

    if (typeof window.initializeFileUpload === 'function') {
        window.initializeFileUpload();
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) {
        return;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = form.querySelector('[name="name"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const phone = form.querySelector('[name="phone"]').value.trim();
        const service = form.querySelector('[name="service"]').value;
        const message = form.querySelector('[name="message"]').value.trim();

        if (!name) {
            reportFormMessage('Please enter your name.');
            form.querySelector('[name="name"]').focus();
            return;
        }

        if (!phone && !email) {
            reportFormMessage('Please add a phone number or an email address.');
            form.querySelector('[name="phone"]').focus();
            return;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            reportFormMessage('Please enter a valid email address.');
            form.querySelector('[name="email"]').focus();
            return;
        }

        if (phone && !/^[\d\s+()\-]+$/.test(phone)) {
            reportFormMessage('Please enter a valid phone number.');
            form.querySelector('[name="phone"]').focus();
            return;
        }

        if (!message) {
            reportFormMessage('Please describe the work you need done.');
            form.querySelector('[name="message"]').focus();
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending request...';

        try {
            await emailjs.send('service_8h9k2lm', 'template_quote_request', {
                from_name: name,
                from_email: email || 'Not provided',
                from_phone: phone || 'Not provided',
                service_type: service || 'Not specified',
                message: message,
                to_name: 'Capital City Contractors',
                reply_to: email || 'info@capitalcitycontractors.ca'
            });

            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: 'Quote Request',
                    content_category: 'Quote Form',
                    currency: 'CAD',
                    value: 0.0
                }, {
                    eventID: 'quote_' + Date.now()
                });
            }

            form.reset();

            if (typeof window.clearFilePreview === 'function') {
                window.clearFilePreview();
            }

            const modal = document.getElementById('successModal');
            if (modal) {
                modal.style.display = 'block';
            }
        } catch (error) {
            reportFormMessage('Failed to send. Please try again or call us at (613) 301-1311.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Request Estimate';
        }
    });

    const modal = document.getElementById('successModal');
    const closeBtn = document.getElementById('closeModal');

    if (modal && closeBtn) {
        closeBtn.addEventListener('click', function () {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});

function reportFormMessage(message) {
    if (typeof window.showUserMessage === 'function') {
        window.showUserMessage(message, 'error');
        return;
    }

    window.alert(message);
}
