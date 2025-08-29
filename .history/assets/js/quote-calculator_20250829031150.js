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

// Initialize calculator when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCalculator);
} else {
    initializeCalculator();
}
