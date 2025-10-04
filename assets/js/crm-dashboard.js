/**
 * Capital City Contractors - Lean CRM Dashboard
 * Version: 3.0 - Construction Edition
 * Phase 2: Full Pipeline Board with Drag-and-Drop
 */

// ==================== DATA MODELS ====================

class Contact {
    constructor(data = {}) {
        this.id = data.id || 'contact_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        this.name = data.name || '';
        this.email = data.email || '';
        this.phone = data.phone || '';
        this.address = data.address || '';
        this.city = data.city || '';
        this.tags = data.tags || [];
        this.emailConsent = data.emailConsent || false;
        this.smsConsent = data.smsConsent || false;
        this.consentDate = data.consentDate || null;
        this.notes = data.notes || '';
        this.createdAt = data.createdAt || new Date().toISOString();
    }
}

class Lead {
    constructor(data = {}) {
        this.id = data.id || 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        this.contactId = data.contactId || null;
        this.jobType = data.jobType || '';
        this.propertyAddress = data.propertyAddress || '';
        this.city = data.city || '';
        this.estimatedValue = data.estimatedValue || 0;
        this.leadSource = data.leadSource || '';
        this.status = data.status || 'new'; // new, qualified, estimate-sent, negotiation, won, lost
        this.nextAction = data.nextAction || '';
        this.nextActionDate = data.nextActionDate || null;
        this.notes = data.notes || '';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.lastActivity = data.lastActivity || new Date().toISOString();
    }
}

class Project {
    constructor(data = {}) {
        this.id = data.id || 'project_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        this.leadId = data.leadId || null;
        this.contactId = data.contactId || null;
        this.name = data.name || '';
        this.jobType = data.jobType || '';
        this.address = data.address || '';
        this.value = data.value || 0;
        this.startDate = data.startDate || null;
        this.progress = data.progress || 0;
        this.status = data.status || 'active'; // active, at-risk, closed
        this.notes = data.notes || '';
        this.createdAt = data.createdAt || new Date().toISOString();
    }
}

class Task {
    constructor(data = {}) {
        this.id = data.id || 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        this.title = data.title || '';
        this.type = data.type || 'follow-up'; // call, email, sms, follow-up, estimate
        this.relatedTo = data.relatedTo || null; // {type: 'lead'|'project', id: '...'}
        this.dueDate = data.dueDate || null;
        this.completed = data.completed || false;
        this.createdAt = data.createdAt || new Date().toISOString();
    }
}

// ==================== MAIN CRM CLASS ====================

class CRMDashboard {
    constructor() {
        console.log('🚀 Initializing CRM v3.0 - Phase 1...');
        
        // Storage
        this.contacts = this.load('ccc_contacts', []);
        this.leads = this.load('ccc_leads', []);
        this.projects = this.load('ccc_projects', []);
        this.tasks = this.load('ccc_tasks', []);
        
        // Settings
        this.settings = this.load('ccc_settings', {
            jobTypes: ['Interior Painting', 'Exterior Painting', 'Kitchen Reno', 'Bathroom Reno', 'Basement Reno', 'Drywall', 'Roofing', 'Deck', 'General'],
            leadSources: ['Google Ads', 'Website', 'Referral', 'Instagram', 'Facebook', 'Yard Sign', 'Walk-in', 'Repeat'],
            stages: [
                { id: 'new', name: 'New', color: '#3b82f6' },
                { id: 'qualified', name: 'Qualified', color: '#8b5cf6' },
                { id: 'estimate-sent', name: 'Estimate Sent', color: '#f59e0b' },
                { id: 'negotiation', name: 'Negotiation', color: '#10b981' },
                { id: 'won', name: 'Won', color: '#22c55e' },
                { id: 'lost', name: 'Lost', color: '#ef4444' }
            ]
        });
        
        // Migrate old data
        this.migrateOldData();

        // Create seed data if empty
        if (this.leads.length === 0) {
            this.createSeedData();
        }

        // Current view state
        this.currentView = 'dashboard';
        this.selectedLead = null;

        console.log(`✅ Loaded: ${this.contacts.length} contacts, ${this.leads.length} leads, ${this.projects.length} projects`);
    }
    
    // ==================== STORAGE ====================
    
    load(key, defaultValue) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }
    
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    migrateOldData() {
        const oldLeads = this.load('ccc_leads', []);
        if (oldLeads.length > 0 && this.leads.length === 0) {
            console.log('🔄 Migrating old data...');
            oldLeads.forEach(old => {
                const contact = new Contact({
                    name: old.name,
                    email: old.email,
                    phone: old.phone || '',
                    address: old.address || '',
                    emailConsent: true,
                    tags: ['migrated'],
                    createdAt: old.timestamp
                });
                this.contacts.push(contact);
                
                const lead = new Lead({
                    contactId: contact.id,
                    jobType: old.project || 'General',
                    propertyAddress: old.address || '',
                    leadSource: 'Website',
                    status: 'new',
                    createdAt: old.timestamp
                });
                this.leads.push(lead);
            });
            this.save('ccc_contacts', this.contacts);
            this.save('ccc_leads', this.leads);
        }
    }
    
    createSeedData() {
        console.log('🌱 Creating seed data...');
        
        // Sample contacts
        const sampleContacts = [
            { name: 'John Smith', email: 'john@example.com', phone: '613-555-0101', city: 'Ottawa', emailConsent: true },
            { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '613-555-0102', city: 'Kanata', emailConsent: true, smsConsent: true },
            { name: 'Mike Brown', email: 'mike@example.com', phone: '613-555-0103', city: 'Nepean', emailConsent: true }
        ];
        
        sampleContacts.forEach(data => {
            const contact = new Contact(data);
            this.contacts.push(contact);
            
            // Create a lead for each
            const lead = new Lead({
                contactId: contact.id,
                jobType: ['Kitchen Reno', 'Bathroom Reno', 'Interior Painting'][Math.floor(Math.random() * 3)],
                propertyAddress: contact.address || '123 Main St',
                city: contact.city,
                estimatedValue: Math.floor(Math.random() * 20000) + 5000,
                leadSource: ['Google Ads', 'Referral', 'Website'][Math.floor(Math.random() * 3)],
                status: ['new', 'qualified', 'estimate-sent'][Math.floor(Math.random() * 3)],
                nextAction: 'Follow up call',
                nextActionDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            });
            this.leads.push(lead);
        });
        
        this.save('ccc_contacts', this.contacts);
        this.save('ccc_leads', this.leads);
    }
    
    // ==================== CRUD ====================
    
    addContact(data) {
        const contact = new Contact(data);
        this.contacts.push(contact);
        this.save('ccc_contacts', this.contacts);
        return contact;
    }
    
    addLead(data) {
        const lead = new Lead(data);
        this.leads.push(lead);
        this.save('ccc_leads', this.leads);
        return lead;
    }
    
    updateLead(id, updates) {
        const lead = this.leads.find(l => l.id === id);
        if (lead) {
            Object.assign(lead, updates);
            lead.lastActivity = new Date().toISOString();
            this.save('ccc_leads', this.leads);
        }
    }
    
    addTask(data) {
        const task = new Task(data);
        this.tasks.push(task);
        this.save('ccc_tasks', this.tasks);
        return task;
    }
    
    completeTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = true;
            this.save('ccc_tasks', this.tasks);
        }
    }
    
    convertToProject(leadId) {
        const lead = this.leads.find(l => l.id === leadId);
        if (!lead) return;

        const contact = this.contacts.find(c => c.id === lead.contactId);
        const project = new Project({
            leadId: lead.id,
            contactId: lead.contactId,
            name: `${contact?.name || 'Client'} - ${lead.jobType}`,
            jobType: lead.jobType,
            address: lead.propertyAddress,
            value: lead.estimatedValue
        });

        this.projects.push(project);
        this.updateLead(leadId, { status: 'won' });
        this.save('ccc_projects', this.projects);

        alert(`✅ Converted to project: ${project.name}`);
        this.selectedLead = null;
        this.render();
    }

    markAsLost(leadId) {
        const reason = prompt('Reason for losing this lead? (optional)');
        this.updateLead(leadId, { status: 'lost', notes: reason || '' });
        this.selectedLead = null;
        this.render();
    }

    // ==================== DRAG AND DROP ====================

    handleDragStart(event, leadId) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', leadId);
        event.target.classList.add('dragging');
    }

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    handleDrop(event, newStatus) {
        event.preventDefault();
        const leadId = event.dataTransfer.getData('text/plain');

        if (leadId) {
            this.updateLead(leadId, { status: newStatus });

            // Check for auto-reminders
            if (newStatus === 'estimate-sent') {
                // Create follow-up tasks
                this.addTask({
                    title: 'Follow up on estimate (Day 2)',
                    type: 'follow-up',
                    relatedTo: { type: 'lead', id: leadId },
                    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
                });
                this.addTask({
                    title: 'Follow up on estimate (Day 7)',
                    type: 'follow-up',
                    relatedTo: { type: 'lead', id: leadId },
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                });
            }

            this.render();
        }
    }

    // ==================== QUICK ACTIONS ====================

    selectLead(leadId) {
        this.selectedLead = leadId;
        this.render();
    }

    quickAction(leadId, action) {
        const lead = this.leads.find(l => l.id === leadId);
        if (!lead) return;

        const contact = this.contacts.find(c => c.id === lead.contactId);

        if (action === 'call') {
            if (contact?.phone) {
                window.open(`tel:${contact.phone}`);
                this.addTask({
                    title: `Called ${contact.name}`,
                    type: 'call',
                    relatedTo: { type: 'lead', id: leadId },
                    completed: true
                });
                this.updateLead(leadId, { lastActivity: new Date().toISOString() });
            } else {
                alert('No phone number on file');
            }
        } else if (action === 'email') {
            if (contact?.email) {
                window.open(`mailto:${contact.email}`);
                this.addTask({
                    title: `Emailed ${contact.name}`,
                    type: 'email',
                    relatedTo: { type: 'lead', id: leadId },
                    completed: true
                });
                this.updateLead(leadId, { lastActivity: new Date().toISOString() });
            } else {
                alert('No email on file');
            }
        } else if (action === 'sms') {
            if (contact?.phone) {
                window.open(`sms:${contact.phone}`);
                this.addTask({
                    title: `Texted ${contact.name}`,
                    type: 'sms',
                    relatedTo: { type: 'lead', id: leadId },
                    completed: true
                });
                this.updateLead(leadId, { lastActivity: new Date().toISOString() });
            } else {
                alert('No phone number on file');
            }
        }
    }

    // ==================== DUPLICATE DETECTION ====================

    checkDuplicate(email, phone) {
        const existing = this.contacts.find(c =>
            (email && c.email.toLowerCase() === email.toLowerCase()) ||
            (phone && c.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''))
        );

        if (existing) {
            return {
                isDuplicate: true,
                contact: existing,
                message: `Contact already exists: ${existing.name} (${existing.email || existing.phone})`
            };
        }

        return { isDuplicate: false };
    }

    // ==================== AUTO-REMINDERS ====================

    checkStaleLeads() {
        const now = new Date();
        const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000);

        this.leads.forEach(lead => {
            if (['new', 'qualified'].includes(lead.status)) {
                const lastActivity = new Date(lead.lastActivity);
                if (lastActivity < threeDaysAgo) {
                    // Check if reminder task already exists
                    const hasReminder = this.tasks.some(t =>
                        t.relatedTo?.id === lead.id &&
                        t.type === 'follow-up' &&
                        !t.completed
                    );

                    if (!hasReminder) {
                        const contact = this.contacts.find(c => c.id === lead.contactId);
                        this.addTask({
                            title: `Follow up with ${contact?.name || 'lead'} (3+ days no activity)`,
                            type: 'follow-up',
                            relatedTo: { type: 'lead', id: lead.id },
                            dueDate: new Date().toISOString()
                        });
                    }
                }
            }
        });
    }

    attachEventListeners() {
        // Check for stale leads on render
        this.checkStaleLeads();
    }
    
    // ==================== METRICS ====================
    
    getMetrics() {
        const now = new Date();
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        
        const newLeadsThisWeek = this.leads.filter(l => new Date(l.createdAt) >= weekAgo).length;
        const overdueTasks = this.tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < now).length;
        const pipelineValue = this.leads.filter(l => !['won', 'lost'].includes(l.status))
            .reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
        const wonThisMonth = this.leads.filter(l => {
            if (l.status !== 'won') return false;
            const created = new Date(l.createdAt);
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length;
        const listGrowth = this.contacts.filter(c => c.emailConsent || c.smsConsent).length;
        
        return { newLeadsThisWeek, overdueTasks, pipelineValue, wonThisMonth, listGrowth };
    }

    // ==================== RENDER ====================

    render() {
        const existing = document.getElementById('crm-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'crm-overlay';
        overlay.innerHTML = this.getHTML();
        document.body.appendChild(overlay);

        this.injectStyles();
        this.attachEventListeners();
        console.log('✅ CRM rendered');
    }

    getHTML() {
        return `
            <div class="crm-container">
                <div class="crm-header">
                    <div class="crm-nav">
                        <button class="crm-nav-btn ${this.currentView === 'dashboard' ? 'active' : ''}"
                                onclick="window.crmDashboard.switchView('dashboard')">📊 Dashboard</button>
                        <button class="crm-nav-btn ${this.currentView === 'pipeline' ? 'active' : ''}"
                                onclick="window.crmDashboard.switchView('pipeline')">🎯 Pipeline</button>
                    </div>
                    <button class="crm-btn-close" onclick="window.crmDashboard.close()">✕</button>
                </div>

                <div class="crm-content">
                    ${this.currentView === 'dashboard' ? this.renderDashboard() : this.renderPipeline()}
                </div>
            </div>
        `;
    }

    switchView(view) {
        this.currentView = view;
        this.selectedLead = null;
        this.render();
    }

    renderDashboard() {
        const metrics = this.getMetrics();
        const todayTasks = this.tasks.filter(t => {
            if (t.completed || !t.dueDate) return false;
            return new Date(t.dueDate).toDateString() === new Date().toDateString();
        });

        return `

            <!-- Metrics Cards -->
            <div class="crm-metrics">
                <div class="crm-card">
                    <div class="crm-card-value">${metrics.newLeadsThisWeek}</div>
                    <div class="crm-card-label">New Leads This Week</div>
                </div>
                <div class="crm-card">
                    <div class="crm-card-value ${metrics.overdueTasks > 0 ? 'text-danger' : ''}">${metrics.overdueTasks}</div>
                    <div class="crm-card-label">Overdue Follow-ups</div>
                </div>
                <div class="crm-card">
                    <div class="crm-card-value">$${this.formatMoney(metrics.pipelineValue)}</div>
                    <div class="crm-card-label">Pipeline Value</div>
                </div>
                <div class="crm-card">
                    <div class="crm-card-value">${metrics.wonThisMonth}</div>
                    <div class="crm-card-label">Won This Month</div>
                </div>
                <div class="crm-card">
                    <div class="crm-card-value">${metrics.listGrowth}</div>
                    <div class="crm-card-label">List Growth</div>
                </div>
            </div>

            <!-- Mini Pipeline Board -->
            <div class="crm-section">
                <h2>Pipeline</h2>
                <div class="crm-pipeline-mini">
                    ${this.settings.stages.map(stage => {
                        const count = this.leads.filter(l => l.status === stage.id).length;
                        return `
                            <div class="crm-stage" style="border-top: 3px solid ${stage.color};">
                                <div class="crm-stage-header">
                                    <span>${stage.name}</span>
                                    <span class="crm-stage-count">${count}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Today Panel -->
            <div class="crm-section">
                <h2>Today</h2>
                <div class="crm-today">
                    ${todayTasks.length > 0 ? todayTasks.map(task => {
                        const related = this.getRelatedName(task.relatedTo);
                        return `
                            <div class="crm-task-item">
                                <input type="checkbox" onchange="window.crmDashboard.completeTask('${task.id}'); window.crmDashboard.render();">
                                <span>${task.title} ${related ? `- ${related}` : ''}</span>
                            </div>
                        `;
                    }).join('') : '<p class="crm-empty">No tasks due today</p>'}
                </div>
            </div>

            <!-- Quick Add -->
            <div class="crm-section">
                <h2>Quick Add</h2>
                <div class="crm-quick-add">
                    <button class="crm-btn" onclick="window.crmDashboard.showQuickAdd('lead')">+ New Lead</button>
                    <button class="crm-btn" onclick="window.crmDashboard.showQuickAdd('contact')">+ New Contact</button>
                    <button class="crm-btn" onclick="window.crmDashboard.showQuickAdd('task')">+ New Task</button>
                </div>
            </div>
        `;
    }

    renderPipeline() {
        return `
            <div class="crm-pipeline-header">
                <h2>Pipeline Board</h2>
                <button class="crm-btn" onclick="window.crmDashboard.showQuickAdd('lead')">+ New Lead</button>
            </div>

            <div class="crm-pipeline-board">
                ${this.settings.stages.filter(s => !['won', 'lost'].includes(s.id)).map(stage => {
                    const stageLeads = this.leads.filter(l => l.status === stage.id);
                    return `
                        <div class="crm-pipeline-column" data-stage="${stage.id}">
                            <div class="crm-column-header" style="background: ${stage.color};">
                                <span>${stage.name}</span>
                                <span class="crm-column-count">${stageLeads.length}</span>
                            </div>
                            <div class="crm-column-body"
                                 ondrop="window.crmDashboard.handleDrop(event, '${stage.id}')"
                                 ondragover="window.crmDashboard.handleDragOver(event)">
                                ${stageLeads.map(lead => this.renderLeadCard(lead)).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            ${this.selectedLead ? this.renderLeadDetail() : ''}
        `;
    }

    renderLeadCard(lead) {
        const contact = this.contacts.find(c => c.id === lead.contactId);
        const daysOld = Math.floor((new Date() - new Date(lead.lastActivity)) / (1000 * 60 * 60 * 24));
        const isStale = daysOld >= 3;

        return `
            <div class="crm-lead-card ${isStale ? 'stale' : ''}"
                 draggable="true"
                 data-lead-id="${lead.id}"
                 ondragstart="window.crmDashboard.handleDragStart(event, '${lead.id}')"
                 onclick="window.crmDashboard.selectLead('${lead.id}')">
                <div class="crm-card-header">
                    <strong>${contact?.name || 'Unknown'}</strong>
                    ${isStale ? '<span class="crm-badge-warning">⚠️ 3+ days</span>' : ''}
                </div>
                <div class="crm-card-body">
                    <div class="crm-card-row">🏠 ${lead.jobType}</div>
                    <div class="crm-card-row">📍 ${lead.city || lead.propertyAddress}</div>
                    <div class="crm-card-row">💰 $${this.formatMoney(lead.estimatedValue)}</div>
                    <div class="crm-card-row">📊 ${lead.leadSource}</div>
                    ${lead.nextAction ? `<div class="crm-card-row">📌 ${lead.nextAction}</div>` : ''}
                </div>
                <div class="crm-card-actions">
                    <button class="crm-icon-btn" onclick="event.stopPropagation(); window.crmDashboard.quickAction('${lead.id}', 'call');" title="Call">📞</button>
                    <button class="crm-icon-btn" onclick="event.stopPropagation(); window.crmDashboard.quickAction('${lead.id}', 'email');" title="Email">📧</button>
                    <button class="crm-icon-btn" onclick="event.stopPropagation(); window.crmDashboard.quickAction('${lead.id}', 'sms');" title="SMS">💬</button>
                </div>
            </div>
        `;
    }

    renderLeadDetail() {
        const lead = this.leads.find(l => l.id === this.selectedLead);
        if (!lead) return '';

        const contact = this.contacts.find(c => c.id === lead.contactId);

        return `
            <div class="crm-detail-panel">
                <div class="crm-detail-header">
                    <h3>${contact?.name || 'Unknown'}</h3>
                    <button class="crm-btn-close" onclick="window.crmDashboard.selectedLead = null; window.crmDashboard.render();">✕</button>
                </div>
                <div class="crm-detail-body">
                    <div class="crm-detail-section">
                        <strong>Contact Info</strong>
                        <p>📧 ${contact?.email || 'N/A'}</p>
                        <p>📞 ${contact?.phone || 'N/A'}</p>
                        <p>📍 ${lead.propertyAddress || 'N/A'}</p>
                    </div>
                    <div class="crm-detail-section">
                        <strong>Lead Details</strong>
                        <p>🏠 Job Type: ${lead.jobType}</p>
                        <p>💰 Est. Value: $${this.formatMoney(lead.estimatedValue)}</p>
                        <p>📊 Source: ${lead.leadSource}</p>
                        <p>📅 Created: ${new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                    ${lead.notes ? `
                        <div class="crm-detail-section">
                            <strong>Notes</strong>
                            <p>${lead.notes}</p>
                        </div>
                    ` : ''}
                    <div class="crm-detail-actions">
                        <button class="crm-btn" onclick="window.crmDashboard.convertToProject('${lead.id}')">✅ Convert to Project</button>
                        <button class="crm-btn-secondary" onclick="window.crmDashboard.markAsLost('${lead.id}')">❌ Mark as Lost</button>
                    </div>
                </div>
            </div>
        `;
    }

    showQuickAdd(type) {
        const modal = document.createElement('div');
        modal.className = 'crm-modal';
        modal.innerHTML = `
            <div class="crm-modal-content">
                <h3>Add ${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                ${this.getQuickAddForm(type)}
                <div class="crm-modal-actions">
                    <button class="crm-btn" onclick="window.crmDashboard.submitQuickAdd('${type}')">Save</button>
                    <button class="crm-btn-secondary" onclick="this.closest('.crm-modal').remove()">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    getQuickAddForm(type) {
        if (type === 'lead') {
            return `
                <input type="text" id="qa-name" placeholder="Contact Name *" class="crm-input">
                <input type="email" id="qa-email" placeholder="Email *" class="crm-input">
                <input type="tel" id="qa-phone" placeholder="Phone *" class="crm-input">
                <input type="text" id="qa-address" placeholder="Property Address" class="crm-input">
                <select id="qa-jobtype" class="crm-input">
                    <option value="">Job Type *</option>
                    ${this.settings.jobTypes.map(jt => `<option value="${jt}">${jt}</option>`).join('')}
                </select>
                <input type="number" id="qa-value" placeholder="Est. Value" class="crm-input">
                <select id="qa-source" class="crm-input">
                    <option value="">Lead Source *</option>
                    ${this.settings.leadSources.map(ls => `<option value="${ls}">${ls}</option>`).join('')}
                </select>
            `;
        } else if (type === 'contact') {
            return `
                <input type="text" id="qa-name" placeholder="Name *" class="crm-input">
                <input type="email" id="qa-email" placeholder="Email" class="crm-input">
                <input type="tel" id="qa-phone" placeholder="Phone" class="crm-input">
                <input type="text" id="qa-address" placeholder="Address" class="crm-input">
                <label><input type="checkbox" id="qa-email-consent"> Email consent</label>
                <label><input type="checkbox" id="qa-sms-consent"> SMS consent</label>
            `;
        } else if (type === 'task') {
            return `
                <input type="text" id="qa-title" placeholder="Task Title *" class="crm-input">
                <select id="qa-type" class="crm-input">
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="follow-up">Follow-up</option>
                </select>
                <input type="date" id="qa-due" class="crm-input">
            `;
        }
    }

    submitQuickAdd(type) {
        if (type === 'lead') {
            const name = document.getElementById('qa-name').value;
            const email = document.getElementById('qa-email').value;
            const phone = document.getElementById('qa-phone').value;
            const jobType = document.getElementById('qa-jobtype').value;
            const source = document.getElementById('qa-source').value;

            if (!name || !email || !phone || !jobType || !source) {
                alert('Please fill required fields');
                return;
            }

            // Check for duplicates
            const dupCheck = this.checkDuplicate(email, phone);
            if (dupCheck.isDuplicate) {
                const proceed = confirm(`${dupCheck.message}\n\nDo you want to create a new lead for this contact?`);
                if (!proceed) return;

                // Use existing contact
                const lead = this.addLead({
                    contactId: dupCheck.contact.id,
                    jobType,
                    propertyAddress: document.getElementById('qa-address').value,
                    estimatedValue: parseInt(document.getElementById('qa-value').value) || 0,
                    leadSource: source,
                    nextAction: 'Initial contact',
                    nextActionDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                });

                this.addTask({
                    title: `Call ${dupCheck.contact.name} - ${jobType}`,
                    type: 'call',
                    relatedTo: { type: 'lead', id: lead.id },
                    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                });

                alert('✅ Lead added to existing contact!');
            } else {
                // Create new contact
                const contact = this.addContact({ name, email, phone, emailConsent: true });
                const lead = this.addLead({
                    contactId: contact.id,
                    jobType,
                    propertyAddress: document.getElementById('qa-address').value,
                    estimatedValue: parseInt(document.getElementById('qa-value').value) || 0,
                    leadSource: source,
                    nextAction: 'Initial contact',
                    nextActionDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                });

                this.addTask({
                    title: `Call ${name} - ${jobType}`,
                    type: 'call',
                    relatedTo: { type: 'lead', id: lead.id },
                    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                });

                alert('✅ Lead added!');
            }
        } else if (type === 'contact') {
            const name = document.getElementById('qa-name').value;
            if (!name) {
                alert('Name is required');
                return;
            }
            this.addContact({
                name,
                email: document.getElementById('qa-email').value,
                phone: document.getElementById('qa-phone').value,
                address: document.getElementById('qa-address').value,
                emailConsent: document.getElementById('qa-email-consent').checked,
                smsConsent: document.getElementById('qa-sms-consent').checked,
                consentDate: new Date().toISOString()
            });
            alert('✅ Contact added!');
        } else if (type === 'task') {
            const title = document.getElementById('qa-title').value;
            if (!title) {
                alert('Title is required');
                return;
            }
            this.addTask({
                title,
                type: document.getElementById('qa-type').value,
                dueDate: document.getElementById('qa-due').value || null
            });
            alert('✅ Task added!');
        }

        document.querySelector('.crm-modal').remove();
        this.render();
    }

    getRelatedName(relatedTo) {
        if (!relatedTo) return '';
        if (relatedTo.type === 'lead') {
            const lead = this.leads.find(l => l.id === relatedTo.id);
            if (lead) {
                const contact = this.contacts.find(c => c.id === lead.contactId);
                return contact?.name || 'Unknown';
            }
        }
        return '';
    }

    formatMoney(value) {
        return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    close() {
        document.getElementById('crm-overlay')?.remove();
    }

    // ==================== STYLES ====================

    injectStyles() {
        if (document.getElementById('crm-styles')) return;

        const style = document.createElement('style');
        style.id = 'crm-styles';
        style.textContent = `
            #crm-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 999999;
                overflow-y: auto;
                padding: 20px;
            }

            .crm-container {
                max-width: 1200px;
                margin: 0 auto;
                background: #fff;
                border-radius: 12px;
                padding: 24px;
            }

            .crm-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 2px solid #e5e7eb;
            }

            .crm-nav {
                display: flex;
                gap: 8px;
            }

            .crm-nav-btn {
                background: #f3f4f6;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                color: #6b7280;
            }

            .crm-nav-btn.active {
                background: #3b82f6;
                color: white;
            }

            .crm-nav-btn:hover {
                background: #e5e7eb;
            }

            .crm-nav-btn.active:hover {
                background: #2563eb;
            }

            .crm-btn-close {
                background: #ef4444;
                color: white;
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 18px;
            }

            .crm-content {
                min-height: 400px;
            }

            .crm-metrics {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }

            .crm-card {
                background: #f9fafb;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #3b82f6;
            }

            .crm-card-value {
                font-size: 32px;
                font-weight: bold;
                color: #1f2937;
                margin-bottom: 4px;
            }

            .crm-card-label {
                font-size: 14px;
                color: #6b7280;
            }

            .text-danger {
                color: #ef4444 !important;
            }

            .crm-section {
                margin-bottom: 24px;
            }

            .crm-section h2 {
                font-size: 18px;
                color: #1f2937;
                margin-bottom: 12px;
            }

            .crm-pipeline-mini {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 12px;
            }

            .crm-stage {
                background: #fff;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                padding: 12px;
            }

            .crm-stage-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
            }

            .crm-stage-count {
                background: #e5e7eb;
                padding: 2px 8px;
                border-radius: 12px;
                font-weight: bold;
            }

            .crm-today {
                background: #fef3c7;
                padding: 16px;
                border-radius: 8px;
            }

            .crm-task-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 0;
                border-bottom: 1px solid #fde68a;
            }

            .crm-task-item:last-child {
                border-bottom: none;
            }

            .crm-empty {
                color: #6b7280;
                font-style: italic;
            }

            .crm-quick-add {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }

            .crm-btn {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
            }

            .crm-btn:hover {
                background: #2563eb;
            }

            .crm-btn-secondary {
                background: #6b7280;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            }

            .crm-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999999;
            }

            .crm-modal-content {
                background: white;
                padding: 24px;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
            }

            .crm-modal-content h3 {
                margin: 0 0 16px 0;
            }

            .crm-input {
                width: 100%;
                padding: 10px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                margin-bottom: 12px;
                font-size: 14px;
            }

            .crm-modal-actions {
                display: flex;
                gap: 12px;
                margin-top: 16px;
            }

            /* Pipeline Board */
            .crm-pipeline-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }

            .crm-pipeline-board {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
                margin-bottom: 24px;
            }

            .crm-pipeline-column {
                background: #f9fafb;
                border-radius: 8px;
                min-height: 500px;
            }

            .crm-column-header {
                padding: 12px;
                border-radius: 8px 8px 0 0;
                color: white;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .crm-column-count {
                background: rgba(255, 255, 255, 0.3);
                padding: 2px 8px;
                border-radius: 12px;
            }

            .crm-column-body {
                padding: 12px;
                min-height: 450px;
            }

            .crm-lead-card {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .crm-lead-card:hover {
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transform: translateY(-2px);
            }

            .crm-lead-card.dragging {
                opacity: 0.5;
            }

            .crm-lead-card.stale {
                border-left: 4px solid #f59e0b;
            }

            .crm-card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .crm-badge-warning {
                background: #fef3c7;
                color: #92400e;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 11px;
            }

            .crm-card-body {
                font-size: 13px;
                color: #6b7280;
            }

            .crm-card-row {
                margin-bottom: 4px;
            }

            .crm-card-actions {
                display: flex;
                gap: 8px;
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid #e5e7eb;
            }

            .crm-icon-btn {
                background: #f3f4f6;
                border: none;
                padding: 6px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }

            .crm-icon-btn:hover {
                background: #e5e7eb;
            }

            /* Lead Detail Panel */
            .crm-detail-panel {
                position: fixed;
                right: 0;
                top: 0;
                bottom: 0;
                width: 400px;
                background: white;
                box-shadow: -4px 0 6px rgba(0, 0, 0, 0.1);
                z-index: 10;
                overflow-y: auto;
            }

            .crm-detail-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 2px solid #e5e7eb;
            }

            .crm-detail-header h3 {
                margin: 0;
            }

            .crm-detail-body {
                padding: 20px;
            }

            .crm-detail-section {
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid #e5e7eb;
            }

            .crm-detail-section:last-child {
                border-bottom: none;
            }

            .crm-detail-section strong {
                display: block;
                margin-bottom: 8px;
                color: #1f2937;
            }

            .crm-detail-section p {
                margin: 4px 0;
                color: #6b7280;
            }

            .crm-detail-actions {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            @media (max-width: 768px) {
                .crm-metrics {
                    grid-template-columns: 1fr;
                }

                .crm-pipeline-mini {
                    grid-template-columns: repeat(2, 1fr);
                }

                .crm-pipeline-board {
                    grid-template-columns: 1fr;
                }

                .crm-detail-panel {
                    width: 100%;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// ==================== GLOBAL INIT ====================

window.showCRM = function() {
    if (!window.crmDashboard) {
        window.crmDashboard = new CRMDashboard();
    }
    window.crmDashboard.render();
};

window.showCRMDashboard = window.showCRM;

console.log('✅ CRM v3.0 Phase 2 loaded. Type showCRM() to open.');

