/**
 * Advanced Quote Calculator System
 * Provides instant estimates for Ottawa renovation projects
 */

// Calculator Configuration
const CALCULATOR_CONFIG = {
    totalSteps: 6,
    currentStep: 1,
    
    // Pricing data (base rates in CAD)
    pricing: {
        painting: {
            interior: {
                base_rate: 3.50, // per sq ft
                prep_work: 1.25, // per sq ft
                premium_paint: 0.75, // per sq ft
                ceiling: 2.25 // per sq ft
            },
            exterior: {
                base_rate: 4.25, // per sq ft
                prep_work: 2.00, // per sq ft
                premium_paint: 1.00, // per sq ft
                trim: 8.50 // per linear ft
            }
        },
        drywall: {
            installation: 2.75, // per sq ft
            repair: 45.00, // per hole/patch
            taping_mudding: 1.85, // per sq ft
            texture: 1.25 // per sq ft
        },
        renovation: {
            basement: {
                basic: 45.00, // per sq ft
                mid_range: 75.00, // per sq ft
                high_end: 125.00 // per sq ft
            },
            kitchen: {
                basic: 125.00, // per sq ft
                mid_range: 200.00, // per sq ft
                high_end: 350.00 // per sq ft
            },
            bathroom: {
                basic: 150.00, // per sq ft
                mid_range: 250.00, // per sq ft
                high_end: 400.00 // per sq ft
            }
        },
        flooring: {
            carpet: 8.50, // per sq ft installed
            hardwood: 12.75, // per sq ft installed
            laminate: 6.25, // per sq ft installed
            tile: 15.50 // per sq ft installed
        }
    },
    
    // Multipliers for various factors
    multipliers: {
        urgency: {
            standard: 1.0,
            rush: 1.25,
            emergency: 1.5
        },
        complexity: {
            simple: 1.0,
            moderate: 1.2,
            complex: 1.5
        },
        access: {
            easy: 1.0,
            moderate: 1.1,
            difficult: 1.3
        },
        season: {
            peak: 1.1, // Spring/Summer
            standard: 1.0, // Fall
            off_season: 0.9 // Winter
        }
    }
};

// Calculator state
let calculatorData = {
    service_type: '',
    project_details: {},
    dimensions: {},
    timeline: '',
    budget_range: '',
    contact_info: {}
};

/**
 * Initialize Quote Calculator
 */
function initializeCalculator() {
    setupEventListeners();
    updateProgressBar();
    
    // Track calculator start
    if (typeof AnalyticsTracker !== 'undefined') {
        AnalyticsTracker.trackFormInteraction('quote_calculator', 'started');
    }
    
    console.log('🧮 Quote Calculator initialized');
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Option card selection
    document.addEventListener('click', function(e) {
        const optionCard = e.target.closest('.option-card');
        if (optionCard) {
            selectOption(optionCard);
        }
    });
    
    // Input field changes
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('input-field')) {
            validateCurrentStep();
        }
    });
    
    // Form submissions
    document.addEventListener('submit', function(e) {
        if (e.target.id === 'contact-form') {
            e.preventDefault();
            submitQuoteRequest();
        }
    });
}

/**
 * Select Option Card
 */
function selectOption(card) {
    const step = card.dataset.step;
    const value = card.dataset.value;
    
    // Remove selection from other cards in the same step
    const stepElement = document.getElementById(`step-${step}`);
    stepElement.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    
    // Select current card
    card.classList.add('selected');
    
    // Store selection
    storeStepData(parseInt(step), value);
    
    // Enable next button
    document.getElementById('btn-next').disabled = false;
    
    // Track selection
    if (typeof AnalyticsTracker !== 'undefined') {
        AnalyticsTracker.trackFormInteraction('quote_calculator', 'option_selected', `step_${step}_${value}`);
    }
}

/**
 * Store Step Data
 */
function storeStepData(step, value) {
    switch(step) {
        case 1:
            calculatorData.service_type = value;
            break;
        case 2:
            calculatorData.project_details.type = value;
            break;
        case 3:
            // Dimensions will be stored from input fields
            break;
        case 4:
            calculatorData.timeline = value;
            break;
        case 5:
            calculatorData.budget_range = value;
            break;
    }
}

/**
 * Next Step
 */
function nextStep() {
    if (CALCULATOR_CONFIG.currentStep < CALCULATOR_CONFIG.totalSteps) {
        // Validate current step
        if (!validateCurrentStep()) {
            return;
        }
        
        // Hide current step
        document.getElementById(`step-${CALCULATOR_CONFIG.currentStep}`).classList.remove('active');
        
        // Move to next step
        CALCULATOR_CONFIG.currentStep++;
        
        // Show next step or results
        if (CALCULATOR_CONFIG.currentStep <= CALCULATOR_CONFIG.totalSteps) {
            showStep(CALCULATOR_CONFIG.currentStep);
        } else {
            showResults();
        }
        
        updateProgressBar();
        updateButtons();
        
        // Track step progression
        if (typeof AnalyticsTracker !== 'undefined') {
            AnalyticsTracker.trackFormInteraction('quote_calculator', 'step_completed', `step_${CALCULATOR_CONFIG.currentStep - 1}`);
        }
    }
}

/**
 * Previous Step
 */
function previousStep() {
    if (CALCULATOR_CONFIG.currentStep > 1) {
        // Hide current step
        document.getElementById(`step-${CALCULATOR_CONFIG.currentStep}`).classList.remove('active');
        
        // Move to previous step
        CALCULATOR_CONFIG.currentStep--;
        
        // Show previous step
        showStep(CALCULATOR_CONFIG.currentStep);
        
        updateProgressBar();
        updateButtons();
    }
}

/**
 * Show Step
 */
function showStep(stepNumber) {
    // Generate step content dynamically based on previous selections
    if (stepNumber === 2) {
        generateStep2Content();
    } else if (stepNumber === 3) {
        generateStep3Content();
    } else if (stepNumber === 4) {
        generateStep4Content();
    } else if (stepNumber === 5) {
        generateStep5Content();
    } else if (stepNumber === 6) {
        generateStep6Content();
    }
    
    // Show the step
    const stepElement = document.getElementById(`step-${stepNumber}`);
    if (stepElement) {
        stepElement.classList.add('active');
    }
}

/**
 * Generate Step 2 Content (Project Type)
 */
function generateStep2Content() {
    const step2 = document.getElementById('step-2');
    if (step2) return; // Already generated
    
    const serviceType = calculatorData.service_type;
    let options = [];
    
    switch(serviceType) {
        case 'painting':
            options = [
                { value: 'interior', icon: 'fas fa-home', title: 'Interior Painting', desc: 'Walls, ceilings, trim work' },
                { value: 'exterior', icon: 'fas fa-building', title: 'Exterior Painting', desc: 'Siding, trim, doors, windows' },
                { value: 'both', icon: 'fas fa-paint-brush', title: 'Interior & Exterior', desc: 'Complete painting project' }
            ];
            break;
        case 'drywall':
            options = [
                { value: 'installation', icon: 'fas fa-plus', title: 'New Installation', desc: 'Fresh drywall installation' },
                { value: 'repair', icon: 'fas fa-tools', title: 'Repair Work', desc: 'Holes, cracks, damage repair' },
                { value: 'finishing', icon: 'fas fa-check', title: 'Taping & Mudding', desc: 'Professional finishing work' }
            ];
            break;
        case 'renovation':
            options = [
                { value: 'basement', icon: 'fas fa-stairs', title: 'Basement Renovation', desc: 'Complete basement finishing' },
                { value: 'kitchen', icon: 'fas fa-utensils', title: 'Kitchen Renovation', desc: 'Kitchen remodeling project' },
                { value: 'bathroom', icon: 'fas fa-bath', title: 'Bathroom Renovation', desc: 'Bathroom remodeling project' },
                { value: 'other', icon: 'fas fa-home', title: 'Other Room', desc: 'Living room, bedroom, etc.' }
            ];
            break;
        case 'flooring':
            options = [
                { value: 'carpet', icon: 'fas fa-th', title: 'Carpet Installation', desc: 'Residential & commercial carpet' },
                { value: 'hardwood', icon: 'fas fa-tree', title: 'Hardwood Flooring', desc: 'Solid & engineered hardwood' },
                { value: 'laminate', icon: 'fas fa-layer-group', title: 'Laminate Flooring', desc: 'Durable laminate installation' },
                { value: 'tile', icon: 'fas fa-th-large', title: 'Tile Installation', desc: 'Ceramic, porcelain, natural stone' }
            ];
            break;
    }
    
    createStepHTML(2, 'What type of project?', 'Select the specific type of work needed', options);
}

/**
 * Create Step HTML
 */
function createStepHTML(stepNumber, title, description, options) {
    const stepHTML = `
        <div class="calculator-step" id="step-${stepNumber}">
            <div class="step-header">
                <div class="step-number">${stepNumber}</div>
                <h2 class="step-title">${title}</h2>
                <p class="step-description">${description}</p>
            </div>
            <div class="option-grid">
                ${options.map(option => `
                    <div class="option-card" data-value="${option.value}" data-step="${stepNumber}">
                        <div class="option-icon"><i class="${option.icon}"></i></div>
                        <h3 class="option-title">${option.title}</h3>
                        <p class="option-description">${option.desc}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Insert before buttons
    const buttonsElement = document.querySelector('.calculator-buttons');
    buttonsElement.insertAdjacentHTML('beforebegin', stepHTML);
}

/**
 * Generate Step 3 Content (Dimensions)
 */
function generateStep3Content() {
    const step3 = document.getElementById('step-3');
    if (step3) return;
    
    const dimensionsHTML = `
        <div class="calculator-step" id="step-3">
            <div class="step-header">
                <div class="step-number">3</div>
                <h2 class="step-title">Project Dimensions</h2>
                <p class="step-description">Help us calculate the scope of your project</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-4);">
                <div class="input-group">
                    <label class="input-label">Length (feet)</label>
                    <input type="number" class="input-field" id="length" placeholder="Enter length" min="1" max="1000">
                </div>
                <div class="input-group">
                    <label class="input-label">Width (feet)</label>
                    <input type="number" class="input-field" id="width" placeholder="Enter width" min="1" max="1000">
                </div>
                <div class="input-group">
                    <label class="input-label">Height (feet) - Optional</label>
                    <input type="number" class="input-field" id="height" placeholder="Enter height" min="6" max="20" value="8">
                </div>
                <div class="input-group">
                    <label class="input-label">Number of Rooms/Areas</label>
                    <select class="input-field" id="room-count">
                        <option value="1">1 Room/Area</option>
                        <option value="2">2 Rooms/Areas</option>
                        <option value="3">3 Rooms/Areas</option>
                        <option value="4">4 Rooms/Areas</option>
                        <option value="5+">5+ Rooms/Areas</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    
    const buttonsElement = document.querySelector('.calculator-buttons');
    buttonsElement.insertAdjacentHTML('beforebegin', dimensionsHTML);
}

/**
 * Validate Current Step
 */
function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step-${CALCULATOR_CONFIG.currentStep}`);
    
    if (CALCULATOR_CONFIG.currentStep === 3) {
        // Validate dimensions
        const length = document.getElementById('length')?.value;
        const width = document.getElementById('width')?.value;
        
        if (!length || !width || length < 1 || width < 1) {
            return false;
        }
        
        // Store dimensions
        calculatorData.dimensions = {
            length: parseFloat(length),
            width: parseFloat(width),
            height: parseFloat(document.getElementById('height')?.value || 8),
            room_count: document.getElementById('room-count')?.value || 1
        };
        
        return true;
    }
    
    // For option-based steps, check if an option is selected
    const selectedOption = currentStepElement?.querySelector('.option-card.selected');
    return selectedOption !== null;
}

/**
 * Calculate Quote
 */
function calculateQuote() {
    const { service_type, project_details, dimensions, timeline } = calculatorData;
    let basePrice = 0;
    let breakdown = [];
    
    const area = dimensions.length * dimensions.width;
    const roomMultiplier = dimensions.room_count === '5+' ? 5 : parseInt(dimensions.room_count) || 1;
    
    // Calculate base price based on service type
    switch(service_type) {
        case 'painting':
            if (project_details.type === 'interior' || project_details.type === 'both') {
                const interiorPrice = area * CALCULATOR_CONFIG.pricing.painting.interior.base_rate * roomMultiplier;
                basePrice += interiorPrice;
                breakdown.push({ item: 'Interior Painting', amount: interiorPrice });
            }
            if (project_details.type === 'exterior' || project_details.type === 'both') {
                const exteriorPrice = area * CALCULATOR_CONFIG.pricing.painting.exterior.base_rate;
                basePrice += exteriorPrice;
                breakdown.push({ item: 'Exterior Painting', amount: exteriorPrice });
            }
            break;
            
        case 'drywall':
            const drywallPrice = area * CALCULATOR_CONFIG.pricing.drywall.installation * roomMultiplier;
            basePrice = drywallPrice;
            breakdown.push({ item: 'Drywall Work', amount: drywallPrice });
            break;
            
        case 'renovation':
            const renovationType = project_details.type;
            if (CALCULATOR_CONFIG.pricing.renovation[renovationType]) {
                const renovationPrice = area * CALCULATOR_CONFIG.pricing.renovation[renovationType].mid_range;
                basePrice = renovationPrice;
                breakdown.push({ item: `${renovationType.charAt(0).toUpperCase() + renovationType.slice(1)} Renovation`, amount: renovationPrice });
            }
            break;
            
        case 'flooring':
            const flooringPrice = area * CALCULATOR_CONFIG.pricing.flooring[project_details.type] * roomMultiplier;
            basePrice = flooringPrice;
            breakdown.push({ item: 'Flooring Installation', amount: flooringPrice });
            break;
    }
    
    // Apply multipliers
    let finalPrice = basePrice;
    
    // Timeline multiplier
    if (timeline === 'rush') {
        finalPrice *= CALCULATOR_CONFIG.multipliers.urgency.rush;
        breakdown.push({ item: 'Rush Timeline (+25%)', amount: basePrice * 0.25 });
    }
    
    // Add taxes
    const hst = finalPrice * 0.13;
    breakdown.push({ item: 'HST (13%)', amount: hst });
    finalPrice += hst;
    
    return {
        total: Math.round(finalPrice),
        breakdown: breakdown,
        area: area,
        room_count: roomMultiplier
    };
}

/**
 * Update Progress Bar
 */
function updateProgressBar() {
    const progress = (CALCULATOR_CONFIG.currentStep / CALCULATOR_CONFIG.totalSteps) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

/**
 * Update Buttons
 */
function updateButtons() {
    const backBtn = document.getElementById('btn-back');
    const nextBtn = document.getElementById('btn-next');
    
    // Show/hide back button
    backBtn.style.display = CALCULATOR_CONFIG.currentStep > 1 ? 'block' : 'none';
    
    // Update next button text
    if (CALCULATOR_CONFIG.currentStep === CALCULATOR_CONFIG.totalSteps) {
        nextBtn.innerHTML = 'Get My Quote <i class="fas fa-calculator"></i>';
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }
    
    // Disable next button until selection is made
    nextBtn.disabled = !validateCurrentStep();
}

/**
 * Generate Step 4 Content (Timeline)
 */
function generateStep4Content() {
    const step4 = document.getElementById('step-4');
    if (step4) return;

    const options = [
        { value: 'flexible', icon: 'fas fa-calendar', title: 'Flexible Timeline', desc: 'No rush, best pricing available' },
        { value: 'standard', icon: 'fas fa-clock', title: 'Standard (2-4 weeks)', desc: 'Normal project timeline' },
        { value: 'rush', icon: 'fas fa-bolt', title: 'Rush (1-2 weeks)', desc: 'Priority scheduling (+25%)' }
    ];

    createStepHTML(4, 'Project Timeline', 'When do you need this completed?', options);
}

/**
 * Generate Step 5 Content (Budget Range)
 */
function generateStep5Content() {
    const step5 = document.getElementById('step-5');
    if (step5) return;

    const options = [
        { value: 'budget', icon: 'fas fa-dollar-sign', title: 'Budget-Friendly', desc: 'Cost-effective solutions' },
        { value: 'standard', icon: 'fas fa-balance-scale', title: 'Standard Quality', desc: 'Good balance of cost and quality' },
        { value: 'premium', icon: 'fas fa-star', title: 'Premium Quality', desc: 'High-end materials and finishes' }
    ];

    createStepHTML(5, 'Quality Level', 'What quality level are you looking for?', options);
}

/**
 * Generate Step 6 Content (Contact Information)
 */
function generateStep6Content() {
    const step6 = document.getElementById('step-6');
    if (step6) return;

    const contactHTML = `
        <div class="calculator-step" id="step-6">
            <div class="step-header">
                <div class="step-number">6</div>
                <h2 class="step-title">Contact Information</h2>
                <p class="step-description">Get your personalized quote delivered instantly</p>
            </div>
            <form id="contact-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-4);">
                <div class="input-group">
                    <label class="input-label">Full Name *</label>
                    <input type="text" class="input-field" id="contact-name" placeholder="Enter your full name" required>
                </div>
                <div class="input-group">
                    <label class="input-label">Phone Number *</label>
                    <input type="tel" class="input-field" id="contact-phone" placeholder="(613) 555-0123" required>
                </div>
                <div class="input-group">
                    <label class="input-label">Email Address *</label>
                    <input type="email" class="input-field" id="contact-email" placeholder="your@email.com" required>
                </div>
                <div class="input-group">
                    <label class="input-label">Preferred Contact Method</label>
                    <select class="input-field" id="contact-method">
                        <option value="phone">Phone Call</option>
                        <option value="email">Email</option>
                        <option value="text">Text Message</option>
                    </select>
                </div>
                <div class="input-group" style="grid-column: 1 / -1;">
                    <label class="input-label">Additional Details (Optional)</label>
                    <textarea class="input-field" id="additional-details" placeholder="Any specific requirements, preferences, or questions..." rows="3"></textarea>
                </div>
            </form>
        </div>
    `;

    const buttonsElement = document.querySelector('.calculator-buttons');
    buttonsElement.insertAdjacentHTML('beforebegin', contactHTML);
}

/**
 * Show Results
 */
function showResults() {
    // Calculate quote
    const quote = calculateQuote();

    // Store contact information
    calculatorData.contact_info = {
        name: document.getElementById('contact-name')?.value,
        phone: document.getElementById('contact-phone')?.value,
        email: document.getElementById('contact-email')?.value,
        contact_method: document.getElementById('contact-method')?.value,
        additional_details: document.getElementById('additional-details')?.value
    };

    // Create results HTML
    const resultsHTML = `
        <div class="calculator-step active" id="results">
            <div class="step-header">
                <div class="step-number"><i class="fas fa-check"></i></div>
                <h2 class="step-title">Your Instant Quote</h2>
                <p class="step-description">Based on your project requirements</p>
            </div>

            <div class="quote-result">
                <div class="quote-amount">$${quote.total.toLocaleString()}</div>
                <p style="font-size: var(--text-lg); margin-bottom: var(--space-4);">
                    Estimated cost for your ${calculatorData.service_type} project
                </p>

                <div class="quote-breakdown">
                    <h4 style="color: white; margin-bottom: var(--space-3);">Cost Breakdown:</h4>
                    ${quote.breakdown.map(item => `
                        <div class="breakdown-item">
                            <span>${item.item}</span>
                            <span>$${Math.round(item.amount).toLocaleString()}</span>
                        </div>
                    `).join('')}
                    <div class="breakdown-item">
                        <span><strong>Total Estimate</strong></span>
                        <span><strong>$${quote.total.toLocaleString()}</strong></span>
                    </div>
                </div>

                <div class="quote-actions">
                    <button class="btn btn-primary" onclick="scheduleConsultation()" style="background: white; color: var(--primary-color);">
                        <i class="fas fa-calendar"></i> Schedule Consultation
                    </button>
                    <button class="btn btn-secondary" onclick="callNow()" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid white;">
                        <i class="fas fa-phone"></i> Call (613) 301-1311
                    </button>
                </div>

                <div class="quote-disclaimer">
                    <p><i class="fas fa-info-circle"></i> This is an estimated quote based on typical project requirements. Final pricing may vary based on site conditions, material selections, and specific project details. A free in-home consultation will provide an accurate quote.</p>
                </div>
            </div>

            <div style="background: white; border-radius: var(--radius-lg); padding: var(--space-6); margin-top: var(--space-6); text-align: center;">
                <h3 style="color: var(--primary-color); margin-bottom: var(--space-4);">What Happens Next?</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4); text-align: center;">
                    <div>
                        <div style="color: var(--primary-color); font-size: 2rem; margin-bottom: var(--space-2);"><i class="fas fa-phone"></i></div>
                        <h4>We'll Call You</h4>
                        <p style="color: var(--text-secondary); font-size: var(--text-sm);">Within 2 hours to discuss your project</p>
                    </div>
                    <div>
                        <div style="color: var(--primary-color); font-size: 2rem; margin-bottom: var(--space-2);"><i class="fas fa-home"></i></div>
                        <h4>Free Consultation</h4>
                        <p style="color: var(--text-secondary); font-size: var(--text-sm);">In-home assessment and detailed quote</p>
                    </div>
                    <div>
                        <div style="color: var(--primary-color); font-size: 2rem; margin-bottom: var(--space-2);"><i class="fas fa-hammer"></i></div>
                        <h4>Start Your Project</h4>
                        <p style="color: var(--text-secondary); font-size: var(--text-sm);">Professional work with guaranteed results</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Hide all steps and show results
    document.querySelectorAll('.calculator-step').forEach(step => step.classList.remove('active'));

    // Insert results
    const buttonsElement = document.querySelector('.calculator-buttons');
    buttonsElement.insertAdjacentHTML('beforebegin', resultsHTML);

    // Hide navigation buttons
    buttonsElement.style.display = 'none';

    // Update progress to 100%
    document.getElementById('progress-fill').style.width = '100%';

    // Track quote completion
    if (typeof AnalyticsTracker !== 'undefined') {
        AnalyticsTracker.trackQuoteRequest(calculatorData.service_type, 'calculator');
        AnalyticsTracker.trackConversion('quote_calculator_completed', quote.total);
    }

    // Send quote data to backend/email service
    submitQuoteData(quote);

    console.log('📊 Quote calculated:', quote);
    console.log('📋 Calculator data:', calculatorData);
}

/**
 * Submit Quote Data
 */
function submitQuoteData(quote) {
    const quoteData = {
        ...calculatorData,
        quote: quote,
        timestamp: new Date().toISOString(),
        source: 'quote_calculator'
    };

    // Here you would send to your backend or email service
    // For now, we'll use EmailJS as an example
    if (typeof emailjs !== 'undefined') {
        emailjs.send('service_id', 'template_id', {
            to_email: 'info@capitalcitycontractors.ca',
            customer_name: calculatorData.contact_info.name,
            customer_email: calculatorData.contact_info.email,
            customer_phone: calculatorData.contact_info.phone,
            service_type: calculatorData.service_type,
            project_details: JSON.stringify(calculatorData.project_details),
            quote_amount: quote.total,
            quote_breakdown: JSON.stringify(quote.breakdown)
        });
    }

    // Store in localStorage for follow-up
    localStorage.setItem('latest_quote', JSON.stringify(quoteData));
}

/**
 * Schedule Consultation
 */
function scheduleConsultation() {
    // Track consultation request
    if (typeof AnalyticsTracker !== 'undefined') {
        AnalyticsTracker.trackConversion('consultation_requested', 100);
    }

    // Redirect to contact form or show scheduling modal
    window.location.href = 'index.html#contact';
}

/**
 * Call Now Function
 */
function callNow() {
    // Track phone call
    if (typeof AnalyticsTracker !== 'undefined') {
        AnalyticsTracker.trackPhoneCall('quote_calculator');
    }

    // Initiate phone call
    window.location.href = 'tel:+16133011311';
}

/**
 * Enhanced Validation for Step 6
 */
function validateStep6() {
    const name = document.getElementById('contact-name')?.value;
    const phone = document.getElementById('contact-phone')?.value;
    const email = document.getElementById('contact-email')?.value;

    return name && phone && email && email.includes('@');
}

// Override validateCurrentStep for step 6
const originalValidateCurrentStep = validateCurrentStep;
validateCurrentStep = function() {
    if (CALCULATOR_CONFIG.currentStep === 6) {
        return validateStep6();
    }
    return originalValidateCurrentStep();
};

// Initialize calculator when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCalculator);
} else {
    initializeCalculator();
}
