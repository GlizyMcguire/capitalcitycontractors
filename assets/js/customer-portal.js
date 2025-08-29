/**
 * Customer Portal System
 * Real-time project tracking and communication
 */

// Portal Configuration
const PORTAL_CONFIG = {
    // Demo data - in production this would come from your backend
    demoProjects: {
        'demo@example.com': {
            accessCode: 'DEMO123',
            customer: {
                name: 'John Smith',
                email: 'demo@example.com',
                phone: '(613) 555-0123'
            },
            project: {
                id: 'CCC-2024-001',
                type: 'Kitchen Renovation',
                status: 'in_progress',
                startDate: '2024-03-15',
                expectedCompletion: '2024-04-20',
                progress: 65,
                projectManager: {
                    name: 'Mike Johnson',
                    email: 'mike@capitalcitycontractors.ca',
                    phone: '(613) 301-1311 ext. 102'
                }
            },
            milestones: [
                {
                    id: 1,
                    title: 'Initial Consultation',
                    description: 'Project planning and design approval',
                    status: 'completed',
                    date: '2024-03-15',
                    completedDate: '2024-03-15'
                },
                {
                    id: 2,
                    title: 'Demolition',
                    description: 'Remove existing kitchen fixtures and cabinets',
                    status: 'completed',
                    date: '2024-03-18',
                    completedDate: '2024-03-20'
                },
                {
                    id: 3,
                    title: 'Electrical & Plumbing',
                    description: 'Update electrical and plumbing systems',
                    status: 'completed',
                    date: '2024-03-21',
                    completedDate: '2024-03-25'
                },
                {
                    id: 4,
                    title: 'Drywall & Painting',
                    description: 'Install drywall and apply primer/paint',
                    status: 'current',
                    date: '2024-03-26',
                    estimatedCompletion: '2024-03-27'
                },
                {
                    id: 5,
                    title: 'Cabinet Installation',
                    description: 'Install new kitchen cabinets',
                    status: 'pending',
                    date: '2024-03-28',
                    estimatedCompletion: '2024-03-30'
                },
                {
                    id: 6,
                    title: 'Countertop Installation',
                    description: 'Install granite countertops',
                    status: 'pending',
                    date: '2024-04-02',
                    estimatedCompletion: '2024-04-03'
                },
                {
                    id: 7,
                    title: 'Final Touches',
                    description: 'Install fixtures, hardware, and cleanup',
                    status: 'pending',
                    date: '2024-04-15',
                    estimatedCompletion: '2024-04-20'
                }
            ],
            photos: [
                {
                    id: 1,
                    url: 'assets/images/portfolio/kitchen-before.jpg',
                    caption: 'Before - Original Kitchen',
                    date: '2024-03-15',
                    category: 'before'
                },
                {
                    id: 2,
                    url: 'assets/images/portfolio/demolition-progress.jpg',
                    caption: 'Demolition Complete',
                    date: '2024-03-20',
                    category: 'progress'
                },
                {
                    id: 3,
                    url: 'assets/images/portfolio/electrical-work.jpg',
                    caption: 'New Electrical Installation',
                    date: '2024-03-23',
                    category: 'progress'
                },
                {
                    id: 4,
                    url: 'assets/images/portfolio/drywall-progress.jpg',
                    caption: 'Drywall Installation in Progress',
                    date: '2024-03-26',
                    category: 'progress'
                }
            ],
            messages: [
                {
                    id: 1,
                    sender: 'Mike Johnson',
                    senderType: 'contractor',
                    message: 'Hi John! Just wanted to update you that we\'ve completed the electrical work ahead of schedule. The new outlets and lighting circuits are all installed and tested. We\'ll start on the drywall tomorrow morning.',
                    timestamp: '2024-03-25T14:30:00Z',
                    read: true
                },
                {
                    id: 2,
                    sender: 'John Smith',
                    senderType: 'customer',
                    message: 'That\'s great news! Thanks for the update. Quick question - will you be able to install the under-cabinet lighting we discussed?',
                    timestamp: '2024-03-25T15:45:00Z',
                    read: true
                },
                {
                    id: 3,
                    sender: 'Mike Johnson',
                    senderType: 'contractor',
                    message: 'Absolutely! The under-cabinet lighting is scheduled for installation with the cabinets next week. We\'ve already run the necessary wiring for it.',
                    timestamp: '2024-03-25T16:20:00Z',
                    read: true
                },
                {
                    id: 4,
                    sender: 'Mike Johnson',
                    senderType: 'contractor',
                    message: 'Drywall installation is progressing well. We should have the primer coat applied by end of day tomorrow. The kitchen is really taking shape!',
                    timestamp: '2024-03-26T11:15:00Z',
                    read: false
                }
            ]
        }
    },
    
    currentProject: null,
    currentSection: 'overview'
};

/**
 * Initialize Customer Portal
 */
function initializePortal() {
    setupEventListeners();
    
    // Check if user is already logged in
    const savedProject = localStorage.getItem('portal_project');
    if (savedProject) {
        try {
            PORTAL_CONFIG.currentProject = JSON.parse(savedProject);
            showDashboard();
        } catch (e) {
            localStorage.removeItem('portal_project');
        }
    }
    
    console.log('🏠 Customer Portal initialized');
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Navigation menu clicks
    document.addEventListener('click', function(e) {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
            e.preventDefault();
            const section = navItem.dataset.section;
            if (section) {
                switchSection(section);
            }
        }
    });
    
    // Message form submission
    document.addEventListener('submit', function(e) {
        if (e.target.id === 'message-form') {
            e.preventDefault();
            sendMessage();
        }
    });
}

/**
 * Login Customer
 */
function loginCustomer(event) {
    event.preventDefault();
    
    const identifier = document.getElementById('login-identifier').value.toLowerCase();
    const accessCode = document.getElementById('login-code').value.toUpperCase();
    
    // Check demo credentials
    const demoProject = PORTAL_CONFIG.demoProjects[identifier];
    if (demoProject && demoProject.accessCode === accessCode) {
        PORTAL_CONFIG.currentProject = demoProject;
        
        // Save to localStorage
        localStorage.setItem('portal_project', JSON.stringify(demoProject));
        
        // Track login
        if (typeof AnalyticsTracker !== 'undefined') {
            AnalyticsTracker.trackFormInteraction('customer_portal', 'login_success');
        }
        
        showDashboard();
    } else {
        // Show error
        alert('Invalid credentials. For demo, use:\nEmail: demo@example.com\nAccess Code: DEMO123');
        
        // Track failed login
        if (typeof AnalyticsTracker !== 'undefined') {
            AnalyticsTracker.trackFormInteraction('customer_portal', 'login_failed');
        }
    }
}

/**
 * Show Dashboard
 */
function showDashboard() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('portal-dashboard').style.display = 'grid';
    
    // Update customer info in sidebar
    updateCustomerInfo();
    
    // Load initial section
    switchSection('overview');
}

/**
 * Update Customer Info
 */
function updateCustomerInfo() {
    const project = PORTAL_CONFIG.currentProject;
    if (!project) return;
    
    // Update customer name and project type in sidebar
    const customerInitials = project.customer.name.split(' ').map(n => n[0]).join('');
    document.querySelector('.portal-sidebar h3').textContent = project.customer.name;
    document.querySelector('.portal-sidebar p').textContent = project.project.type;
    
    // Update initials in avatar
    document.querySelector('.portal-sidebar div[style*="background: var(--primary-color)"]').textContent = customerInitials;
}

/**
 * Switch Section
 */
function switchSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Hide all sections
    document.querySelectorAll('.portal-section').forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const sectionElement = document.getElementById(`${sectionName}-section`);
    if (sectionElement) {
        sectionElement.classList.add('active');
    } else {
        // Create section if it doesn't exist
        createSection(sectionName);
    }
    
    PORTAL_CONFIG.currentSection = sectionName;
    
    // Track section view
    if (typeof AnalyticsTracker !== 'undefined') {
        AnalyticsTracker.trackFormInteraction('customer_portal', 'section_viewed', sectionName);
    }
}

/**
 * Create Section
 */
function createSection(sectionName) {
    const mainContent = document.querySelector('.portal-main');
    let sectionHTML = '';
    
    switch(sectionName) {
        case 'progress':
            sectionHTML = createProgressSection();
            break;
        case 'photos':
            sectionHTML = createPhotosSection();
            break;
        case 'messages':
            sectionHTML = createMessagesSection();
            break;
        case 'documents':
            sectionHTML = createDocumentsSection();
            break;
    }
    
    if (sectionHTML) {
        mainContent.insertAdjacentHTML('beforeend', sectionHTML);
        document.getElementById(`${sectionName}-section`).classList.add('active');
    }
}

/**
 * Create Progress Section
 */
function createProgressSection() {
    const project = PORTAL_CONFIG.currentProject;
    if (!project) return '';
    
    const milestonesHTML = project.milestones.map(milestone => {
        let statusClass = 'milestone-pending';
        let iconClass = 'fas fa-circle';
        
        if (milestone.status === 'completed') {
            statusClass = 'milestone-completed';
            iconClass = 'fas fa-check';
        } else if (milestone.status === 'current') {
            statusClass = 'milestone-current';
            iconClass = 'fas fa-play';
        }
        
        return `
            <div class="milestone-item">
                <div class="milestone-icon ${statusClass}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="milestone-content">
                    <h4>${milestone.title}</h4>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-1);">${milestone.description}</p>
                    <div class="milestone-date">
                        ${milestone.status === 'completed' ? 
                            `Completed: ${formatDate(milestone.completedDate)}` :
                            milestone.status === 'current' ?
                            `In Progress • Est. completion: ${formatDate(milestone.estimatedCompletion)}` :
                            `Scheduled: ${formatDate(milestone.date)}`
                        }
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="portal-section" id="progress-section">
            <h2 style="margin-bottom: var(--space-6); color: var(--text-primary);">Project Timeline</h2>
            
            <div class="progress-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
                    <h3>Overall Progress</h3>
                    <span style="font-size: var(--text-lg); font-weight: 700; color: var(--primary-color);">${project.project.progress}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${project.project.progress}%;"></div>
                </div>
                <p style="text-align: center; color: var(--text-secondary);">
                    Started: ${formatDate(project.project.startDate)} • 
                    Expected Completion: ${formatDate(project.project.expectedCompletion)}
                </p>
            </div>
            
            <div class="milestone-list">
                ${milestonesHTML}
            </div>
        </div>
    `;
}

/**
 * Create Photos Section
 */
function createPhotosSection() {
    const project = PORTAL_CONFIG.currentProject;
    if (!project) return '';
    
    const photosHTML = project.photos.map(photo => `
        <div class="photo-item" onclick="openPhotoModal('${photo.url}', '${photo.caption}')">
            <img src="${photo.url}" alt="${photo.caption}" onerror="this.src='assets/images/aboutus.png'">
            <div class="photo-caption">
                <strong>${photo.caption}</strong><br>
                <small>${formatDate(photo.date)}</small>
            </div>
        </div>
    `).join('');
    
    return `
        <div class="portal-section" id="photos-section">
            <h2 style="margin-bottom: var(--space-6); color: var(--text-primary);">Project Photos</h2>
            <p style="color: var(--text-secondary); margin-bottom: var(--space-6);">
                View progress photos and before/after shots of your renovation project.
            </p>
            
            <div class="photo-gallery">
                ${photosHTML}
            </div>
        </div>
    `;
}

/**
 * Create Messages Section
 */
function createMessagesSection() {
    const project = PORTAL_CONFIG.currentProject;
    if (!project) return '';
    
    const messagesHTML = project.messages.map(message => {
        const messageClass = message.senderType === 'contractor' ? 'message-contractor' : 'message-customer';
        return `
            <div class="message ${messageClass}">
                <div class="message-header">
                    <span class="message-sender">${message.sender}</span>
                    <span class="message-time">${formatDateTime(message.timestamp)}</span>
                </div>
                <div class="message-content">${message.message}</div>
            </div>
        `;
    }).join('');
    
    return `
        <div class="portal-section" id="messages-section">
            <h2 style="margin-bottom: var(--space-6); color: var(--text-primary);">Messages</h2>
            
            <div class="message-thread">
                ${messagesHTML}
            </div>
            
            <form class="message-form" id="message-form">
                <textarea class="message-input" placeholder="Type your message here..." required></textarea>
                <button type="submit" class="send-button">
                    <i class="fas fa-paper-plane"></i> Send
                </button>
            </form>
        </div>
    `;
}

/**
 * Create Documents Section
 */
function createDocumentsSection() {
    return `
        <div class="portal-section" id="documents-section">
            <h2 style="margin-bottom: var(--space-6); color: var(--text-primary);">Project Documents</h2>
            
            <div style="display: grid; gap: var(--space-4);">
                <div style="border: 1px solid var(--gray-200); border-radius: var(--radius-md); padding: var(--space-4);">
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                        <i class="fas fa-file-pdf" style="color: #dc3545; font-size: var(--text-xl);"></i>
                        <div>
                            <h4>Project Contract</h4>
                            <p style="color: var(--text-muted); font-size: var(--text-sm);">Signed: March 15, 2024</p>
                        </div>
                        <button class="btn btn-secondary" style="margin-left: auto;">Download</button>
                    </div>
                </div>
                
                <div style="border: 1px solid var(--gray-200); border-radius: var(--radius-md); padding: var(--space-4);">
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                        <i class="fas fa-file-image" style="color: #28a745; font-size: var(--text-xl);"></i>
                        <div>
                            <h4>Design Plans</h4>
                            <p style="color: var(--text-muted); font-size: var(--text-sm);">Updated: March 18, 2024</p>
                        </div>
                        <button class="btn btn-secondary" style="margin-left: auto;">Download</button>
                    </div>
                </div>
                
                <div style="border: 1px solid var(--gray-200); border-radius: var(--radius-md); padding: var(--space-4);">
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                        <i class="fas fa-file-alt" style="color: #007bff; font-size: var(--text-xl);"></i>
                        <div>
                            <h4>Material Specifications</h4>
                            <p style="color: var(--text-muted); font-size: var(--text-sm);">Created: March 20, 2024</p>
                        </div>
                        <button class="btn btn-secondary" style="margin-left: auto;">Download</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Send Message
 */
function sendMessage() {
    const messageInput = document.querySelector('.message-input');
    const messageText = messageInput.value.trim();
    
    if (!messageText) return;
    
    // Add message to thread
    const messageThread = document.querySelector('.message-thread');
    const newMessage = document.createElement('div');
    newMessage.className = 'message message-customer';
    newMessage.innerHTML = `
        <div class="message-header">
            <span class="message-sender">${PORTAL_CONFIG.currentProject.customer.name}</span>
            <span class="message-time">Just now</span>
        </div>
        <div class="message-content">${messageText}</div>
    `;
    
    messageThread.appendChild(newMessage);
    messageThread.scrollTop = messageThread.scrollHeight;
    
    // Clear input
    messageInput.value = '';
    
    // Track message sent
    if (typeof AnalyticsTracker !== 'undefined') {
        AnalyticsTracker.trackFormInteraction('customer_portal', 'message_sent');
    }
    
    // Simulate contractor response (in production, this would be real-time)
    setTimeout(() => {
        const response = document.createElement('div');
        response.className = 'message message-contractor';
        response.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${PORTAL_CONFIG.currentProject.project.projectManager.name}</span>
                <span class="message-time">Just now</span>
            </div>
            <div class="message-content">Thanks for your message! I'll get back to you with an update shortly.</div>
        `;
        messageThread.appendChild(response);
        messageThread.scrollTop = messageThread.scrollHeight;
    }, 2000);
}

/**
 * Logout
 */
function logout() {
    localStorage.removeItem('portal_project');
    PORTAL_CONFIG.currentProject = null;
    
    document.getElementById('portal-dashboard').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    
    // Clear form
    document.getElementById('login-identifier').value = '';
    document.getElementById('login-code').value = '';
}

/**
 * Utility Functions
 */
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function openPhotoModal(url, caption) {
    // Simple photo modal - in production you'd use a proper modal library
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.9); display: flex; align-items: center; 
        justify-content: center; z-index: 1000; cursor: pointer;
    `;
    
    modal.innerHTML = `
        <div style="max-width: 90%; max-height: 90%; text-align: center;">
            <img src="${url}" style="max-width: 100%; max-height: 80vh; object-fit: contain;">
            <p style="color: white; margin-top: 1rem; font-size: 1.1rem;">${caption}</p>
        </div>
    `;
    
    modal.onclick = () => document.body.removeChild(modal);
    document.body.appendChild(modal);
}

// Initialize portal when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortal);
} else {
    initializePortal();
}
