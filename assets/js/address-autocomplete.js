/**
 * Google Places Address Autocomplete for Discount Code Form
 * Capital City Contractors - Address Validation
 * 
 * This script adds address autocomplete functionality to validate
 * that users enter real, verified addresses for fraud prevention.
 */

// Global variable to store autocomplete instance
let addressAutocomplete = null;
let validatedAddress = null;

/**
 * Initialize Address Autocomplete
 * Called by Google Maps API callback
 */
function initAddressAutocomplete() {
    console.log('🗺️ Initializing Google Places Address Autocomplete...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupAutocomplete);
    } else {
        setupAutocomplete();
    }
}

/**
 * Setup autocomplete on the address field
 */
function setupAutocomplete() {
    const addressInput = document.getElementById('discount-address');
    
    if (!addressInput) {
        console.warn('⚠️ Address input field not found. Autocomplete not initialized.');
        return;
    }
    
    // Check if Google Places API is loaded
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
        console.warn('⚠️ Google Places API not loaded. Address autocomplete disabled.');
        addManualValidationFallback(addressInput);
        return;
    }
    
    try {
        // Create autocomplete instance
        addressAutocomplete = new google.maps.places.Autocomplete(addressInput, {
            componentRestrictions: { country: 'ca' }, // Restrict to Canada
            fields: ['address_components', 'formatted_address', 'geometry', 'name'],
            types: ['address'], // Only show full addresses, not businesses or regions
            // Bias results to Ottawa area
            bounds: {
                north: 45.5375,
                south: 45.2505,
                east: -75.4500,
                west: -76.3550
            },
            strictBounds: false // Allow addresses outside bounds but prioritize Ottawa
        });
        
        // Listen for place selection
        addressAutocomplete.addListener('place_changed', handlePlaceSelect);
        
        // Add visual indicator that autocomplete is active
        addressInput.placeholder = 'Start typing your address...';
        addressInput.setAttribute('aria-label', 'Street address with autocomplete');
        
        // Add helper text
        addAutocompleteHelper(addressInput);
        
        // Clear validation when user starts typing again
        addressInput.addEventListener('input', function() {
            if (this.value.length < 3) {
                validatedAddress = null;
                removeValidationIndicator(this);
            }
        });
        
        console.log('✅ Address autocomplete initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing address autocomplete:', error);
        addManualValidationFallback(addressInput);
    }
}

/**
 * Handle place selection from autocomplete
 */
function handlePlaceSelect() {
    const place = addressAutocomplete.getPlace();
    const addressInput = document.getElementById('discount-address');
    
    if (!place || !place.address_components) {
        console.warn('⚠️ No valid address selected');
        validatedAddress = null;
        removeValidationIndicator(addressInput);
        return;
    }
    
    // Extract address components
    const addressComponents = extractAddressComponents(place.address_components);
    
    // Store validated address
    validatedAddress = {
        formatted: place.formatted_address,
        street_number: addressComponents.street_number,
        street_name: addressComponents.route,
        city: addressComponents.locality,
        province: addressComponents.administrative_area_level_1,
        postal_code: addressComponents.postal_code,
        country: addressComponents.country,
        full_address: place.formatted_address,
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
        validated: true,
        timestamp: new Date().toISOString()
    };
    
    // Update input with formatted address
    addressInput.value = place.formatted_address;
    
    // Add visual validation indicator
    addValidationIndicator(addressInput, true);
    
    console.log('✅ Address validated:', validatedAddress);
}

/**
 * Extract address components into structured format
 */
function extractAddressComponents(components) {
    const result = {
        street_number: '',
        route: '',
        locality: '',
        administrative_area_level_1: '',
        postal_code: '',
        country: ''
    };
    
    components.forEach(component => {
        const type = component.types[0];
        if (result.hasOwnProperty(type)) {
            result[type] = component.long_name;
        }
    });
    
    return result;
}

/**
 * Add visual indicator for validated address
 */
function addValidationIndicator(input, isValid) {
    removeValidationIndicator(input);
    
    const indicator = document.createElement('div');
    indicator.className = 'address-validation-indicator';
    indicator.style.cssText = `
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 18px;
        pointer-events: none;
    `;
    
    if (isValid) {
        indicator.innerHTML = '<i class="fas fa-check-circle" style="color: #10b981;"></i>';
        indicator.title = 'Address verified';
        input.style.borderColor = '#10b981';
        input.style.paddingRight = '40px';
    } else {
        indicator.innerHTML = '<i class="fas fa-exclamation-circle" style="color: #ef4444;"></i>';
        indicator.title = 'Please select an address from the dropdown';
        input.style.borderColor = '#ef4444';
        input.style.paddingRight = '40px';
    }
    
    // Make parent position relative if not already
    const parent = input.parentElement;
    if (getComputedStyle(parent).position === 'static') {
        parent.style.position = 'relative';
    }
    
    parent.appendChild(indicator);
}

/**
 * Remove validation indicator
 */
function removeValidationIndicator(input) {
    const parent = input.parentElement;
    const existing = parent.querySelector('.address-validation-indicator');
    if (existing) {
        existing.remove();
    }
    input.style.borderColor = '';
    input.style.paddingRight = '';
}

/**
 * Add helper text below address field
 */
function addAutocompleteHelper(input) {
    const helper = document.createElement('small');
    helper.className = 'address-autocomplete-helper';
    helper.style.cssText = `
        display: block;
        margin-top: 4px;
        font-size: 12px;
        color: #6b7280;
    `;
    helper.innerHTML = '<i class="fas fa-info-circle"></i> Select your address from the dropdown for verification';
    
    input.parentElement.appendChild(helper);
}

/**
 * Fallback validation when Google API is not available
 */
function addManualValidationFallback(input) {
    console.log('📝 Using manual address validation (Google API not available)');
    
    // Add basic validation
    input.addEventListener('blur', function() {
        const value = this.value.trim();
        
        // Basic validation: must have number and street name
        const hasNumber = /\d/.test(value);
        const hasStreet = value.length > 10;
        
        if (value && hasNumber && hasStreet) {
            validatedAddress = {
                formatted: value,
                full_address: value,
                validated: false, // Not validated by Google
                manual: true,
                timestamp: new Date().toISOString()
            };
            console.log('✅ Manual address validation passed:', value);
        } else if (value) {
            console.warn('⚠️ Address may be incomplete:', value);
        }
    });
}

/**
 * Get validated address data
 * Called by lead-generation.js when form is submitted
 */
function getValidatedAddress() {
    return validatedAddress;
}

/**
 * Check if address has been validated
 */
function isAddressValidated() {
    return validatedAddress !== null && validatedAddress.validated === true;
}

/**
 * Reset address validation
 */
function resetAddressValidation() {
    validatedAddress = null;
    const addressInput = document.getElementById('discount-address');
    if (addressInput) {
        removeValidationIndicator(addressInput);
    }
}

// Export functions for use by other scripts
window.getValidatedAddress = getValidatedAddress;
window.isAddressValidated = isAddressValidated;
window.resetAddressValidation = resetAddressValidation;
window.initAddressAutocomplete = initAddressAutocomplete;

console.log('📍 Address autocomplete module loaded');

