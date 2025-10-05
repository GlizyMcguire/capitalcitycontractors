/**
 * Capital City Contractors - Lean CRM Dashboard
 * Version: 3.0 - Construction Edition
 * Phase 4: Tasks & Marketing
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
        this.completedAt = data.completedAt || null;
        this.archived = data.archived || false;
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
            task.completedAt = new Date().toISOString();
            this.save('ccc_tasks', this.tasks);
        }
    }

    archiveTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.archived = true;
            this.save('ccc_tasks', this.tasks);
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.save('ccc_tasks', this.tasks);
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
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

        const newLeadsThisWeek = this.leads.filter(l => new Date(l.createdAt) >= weekAgo).length;

        // Task is overdue only if due date is BEFORE today (not including today)
        const overdueTasks = this.tasks.filter(t => {
            if (t.completed || !t.dueDate) return false;
            const dueDate = new Date(t.dueDate);
            const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
            return dueDateOnly < today;
        }).length;

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
                        <button class="crm-nav-btn ${this.currentView === 'contacts' ? 'active' : ''}"
                                onclick="window.crmDashboard.switchView('contacts')">👥 Contacts</button>
                        <button class="crm-nav-btn ${this.currentView === 'projects' ? 'active' : ''}"
                                onclick="window.crmDashboard.switchView('projects')">🏗️ Projects</button>
                        <button class="crm-nav-btn ${this.currentView === 'tasks' ? 'active' : ''}"
                                onclick="window.crmDashboard.switchView('tasks')">✅ Tasks</button>
                        <button class="crm-nav-btn ${this.currentView === 'marketing' ? 'active' : ''}"
                                onclick="window.crmDashboard.switchView('marketing')">📧 Marketing</button>
                    </div>
                    <button class="crm-btn-close" onclick="window.crmDashboard.close()">✕</button>
                </div>

                <div class="crm-content">
                    ${this.renderCurrentView()}
                </div>
            </div>
        `;
    }

    renderCurrentView() {
        switch(this.currentView) {
            case 'dashboard': return this.renderDashboard();
            case 'pipeline': return this.renderPipeline();
            case 'contacts': return this.renderContacts();
            case 'projects': return this.renderProjects();
            case 'tasks': return this.renderTasks();
            case 'marketing': return this.renderMarketing();
            default: return this.renderDashboard();
        }
    }

    switchView(view) {
        this.currentView = view;
        this.selectedLead = null;
        this.render();
    }

    renderDashboard() {
        const metrics = this.getMetrics();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Get tasks due today or overdue
        const todayAndOverdueTasks = this.tasks.filter(t => {
            if (t.completed || !t.dueDate) return false;
            const dueDate = new Date(t.dueDate);
            const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
            // Include today and any past dates
            return dueDateOnly <= today;
        }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

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
                <h2>Today & Overdue Tasks</h2>
                <div class="crm-today">
                    ${todayAndOverdueTasks.length > 0 ? todayAndOverdueTasks.map(task => {
                        const related = this.getRelatedName(task.relatedTo);
                        const dueDate = new Date(task.dueDate);
                        const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
                        const isOverdue = dueDateOnly < today;
                        const isToday = dueDateOnly.getTime() === today.getTime();

                        return `
                            <div class="crm-task-item ${isOverdue ? 'overdue' : ''}">
                                <input type="checkbox" onchange="window.crmDashboard.completeTask('${task.id}'); window.crmDashboard.render();">
                                <span>
                                    ${isOverdue ? '⚠️ ' : ''}${task.title} ${related ? `- ${related}` : ''}
                                    <small class="crm-task-date">${isToday ? 'Today' : dueDate.toLocaleDateString()}</small>
                                </span>
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

    renderContacts() {
        return `
            <div class="crm-view-header">
                <h2>👥 Contacts</h2>
                <div class="crm-view-actions">
                    <button class="crm-btn" onclick="window.crmDashboard.showQuickAdd('contact')">+ New Contact</button>
                </div>
            </div>

            <div class="crm-filters-bar">
                <button class="crm-filter-btn ${!this.contactFilter ? 'active' : ''}"
                        onclick="window.crmDashboard.filterContacts(null)">All (${this.contacts.length})</button>
                <button class="crm-filter-btn ${this.contactFilter === 'email' ? 'active' : ''}"
                        onclick="window.crmDashboard.filterContacts('email')">Has Email (${this.contacts.filter(c => c.email).length})</button>
                <button class="crm-filter-btn ${this.contactFilter === 'phone' ? 'active' : ''}"
                        onclick="window.crmDashboard.filterContacts('phone')">Has Phone (${this.contacts.filter(c => c.phone).length})</button>
                <button class="crm-filter-btn ${this.contactFilter === 'consent' ? 'active' : ''}"
                        onclick="window.crmDashboard.filterContacts('consent')">Marketing Consent (${this.contacts.filter(c => c.emailConsent || c.smsConsent).length})</button>
            </div>

            <div class="crm-contacts-list">
                ${this.getFilteredContacts().map(contact => {
                    const contactLeads = this.leads.filter(l => l.contactId === contact.id);
                    const contactProjects = this.projects.filter(p => p.contactId === contact.id);

                    return `
                        <div class="crm-contact-card" onclick="window.crmDashboard.selectContact('${contact.id}')">
                            <div class="crm-contact-avatar">${contact.name.charAt(0).toUpperCase()}</div>
                            <div class="crm-contact-info">
                                <div class="crm-contact-name">${contact.name}</div>
                                <div class="crm-contact-details">
                                    ${contact.email ? `📧 ${contact.email}` : ''}
                                    ${contact.phone ? `📞 ${contact.phone}` : ''}
                                </div>
                                <div class="crm-contact-meta">
                                    ${contactLeads.length > 0 ? `<span class="crm-badge">🎯 ${contactLeads.length} leads</span>` : ''}
                                    ${contactProjects.length > 0 ? `<span class="crm-badge">🏗️ ${contactProjects.length} projects</span>` : ''}
                                    ${contact.emailConsent ? '<span class="crm-badge-success">✓ Email</span>' : ''}
                                    ${contact.smsConsent ? '<span class="crm-badge-success">✓ SMS</span>' : ''}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            ${this.selectedContact ? this.renderContactDetail() : ''}
        `;
    }

    getFilteredContacts() {
        if (!this.contactFilter) return this.contacts;

        switch(this.contactFilter) {
            case 'email': return this.contacts.filter(c => c.email);
            case 'phone': return this.contacts.filter(c => c.phone);
            case 'consent': return this.contacts.filter(c => c.emailConsent || c.smsConsent);
            default: return this.contacts;
        }
    }

    filterContacts(filter) {
        this.contactFilter = filter;
        this.render();
    }

    selectContact(contactId) {
        this.selectedContact = contactId;
        this.render();
    }

    renderContactDetail() {
        const contact = this.contacts.find(c => c.id === this.selectedContact);
        if (!contact) return '';

        const contactLeads = this.leads.filter(l => l.contactId === contact.id);
        const contactProjects = this.projects.filter(p => p.contactId === contact.id);

        return `
            <div class="crm-detail-panel">
                <div class="crm-detail-header">
                    <h3>${contact.name}</h3>
                    <button class="crm-btn-close" onclick="window.crmDashboard.selectedContact = null; window.crmDashboard.render();">✕</button>
                </div>
                <div class="crm-detail-body">
                    <div class="crm-detail-section">
                        <strong>Contact Info</strong>
                        <p>📧 ${contact.email || 'No email'}</p>
                        <p>📞 ${contact.phone || 'No phone'}</p>
                        <p>📍 ${contact.address || 'No address'}</p>
                    </div>

                    <div class="crm-detail-section">
                        <strong>Marketing Consent</strong>
                        <p>${contact.emailConsent ? '✅ Email consent' : '❌ No email consent'}</p>
                        <p>${contact.smsConsent ? '✅ SMS consent' : '❌ No SMS consent'}</p>
                        ${contact.consentDate ? `<p><small>Consent date: ${new Date(contact.consentDate).toLocaleDateString()}</small></p>` : ''}
                    </div>

                    ${contactLeads.length > 0 ? `
                        <div class="crm-detail-section">
                            <strong>Leads (${contactLeads.length})</strong>
                            ${contactLeads.map(lead => `
                                <div class="crm-detail-item">
                                    <span>${lead.jobType}</span>
                                    <span class="crm-badge">${lead.status}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${contactProjects.length > 0 ? `
                        <div class="crm-detail-section">
                            <strong>Projects (${contactProjects.length})</strong>
                            ${contactProjects.map(project => `
                                <div class="crm-detail-item">
                                    <span>${project.name}</span>
                                    <span class="crm-badge">${project.status}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${contact.notes ? `
                        <div class="crm-detail-section">
                            <strong>Notes</strong>
                            <p>${contact.notes}</p>
                        </div>
                    ` : ''}

                    <div class="crm-detail-actions">
                        <button class="crm-btn" onclick="window.crmDashboard.quickContactAction('${contact.id}', 'call')">📞 Call</button>
                        <button class="crm-btn" onclick="window.crmDashboard.quickContactAction('${contact.id}', 'email')">📧 Email</button>
                        ${contact.phone ? `<button class="crm-btn" onclick="window.crmDashboard.quickContactAction('${contact.id}', 'sms')">💬 SMS</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    quickContactAction(contactId, action) {
        const contact = this.contacts.find(c => c.id === contactId);
        if (!contact) return;

        if (action === 'call' && contact.phone) {
            window.open(`tel:${contact.phone}`);
        } else if (action === 'email' && contact.email) {
            window.open(`mailto:${contact.email}`);
        } else if (action === 'sms' && contact.phone) {
            window.open(`sms:${contact.phone}`);
        }
    }

    renderProjects() {
        const activeProjects = this.projects.filter(p => p.status === 'active');
        const completedProjects = this.projects.filter(p => p.status === 'closed');

        return `
            <div class="crm-view-header">
                <h2>🏗️ Projects</h2>
                <div class="crm-view-actions">
                    <span class="crm-stat-badge">Active: ${activeProjects.length}</span>
                    <span class="crm-stat-badge">Completed: ${completedProjects.length}</span>
                </div>
            </div>

            ${activeProjects.length > 0 ? `
                <div class="crm-section">
                    <h3>Active Projects</h3>
                    <div class="crm-projects-grid">
                        ${activeProjects.map(project => this.renderProjectCard(project)).join('')}
                    </div>
                </div>
            ` : '<p class="crm-empty">No active projects</p>'}

            ${completedProjects.length > 0 ? `
                <div class="crm-section">
                    <h3>Completed Projects</h3>
                    <div class="crm-projects-grid">
                        ${completedProjects.map(project => this.renderProjectCard(project)).join('')}
                    </div>
                </div>
            ` : ''}

            ${this.selectedProject ? this.renderProjectDetail() : ''}
        `;
    }

    renderProjectCard(project) {
        const contact = this.contacts.find(c => c.id === project.contactId);
        const statusColor = project.status === 'active' ? '#10b981' : project.status === 'at-risk' ? '#f59e0b' : '#6b7280';

        return `
            <div class="crm-project-card" onclick="window.crmDashboard.selectProject('${project.id}')">
                <div class="crm-project-header">
                    <h4>${project.name}</h4>
                    <span class="crm-badge" style="background: ${statusColor}; color: white;">${project.status}</span>
                </div>
                <div class="crm-project-body">
                    <p>👤 ${contact?.name || 'Unknown'}</p>
                    <p>🏠 ${project.jobType}</p>
                    <p>📍 ${project.address}</p>
                    <p>💰 $${this.formatMoney(project.value)}</p>
                </div>
                <div class="crm-project-progress">
                    <div class="crm-progress-bar">
                        <div class="crm-progress-fill" style="width: ${project.progress}%; background: ${statusColor};"></div>
                    </div>
                    <span class="crm-progress-text">${project.progress}% Complete</span>
                </div>
            </div>
        `;
    }

    selectProject(projectId) {
        this.selectedProject = projectId;
        this.render();
    }

    renderProjectDetail() {
        const project = this.projects.find(p => p.id === this.selectedProject);
        if (!project) return '';

        const contact = this.contacts.find(c => c.id === project.contactId);
        const projectTasks = this.tasks.filter(t => t.relatedTo?.type === 'project' && t.relatedTo?.id === project.id);

        return `
            <div class="crm-detail-panel">
                <div class="crm-detail-header">
                    <h3>${project.name}</h3>
                    <button class="crm-btn-close" onclick="window.crmDashboard.selectedProject = null; window.crmDashboard.render();">✕</button>
                </div>
                <div class="crm-detail-body">
                    <div class="crm-detail-section">
                        <strong>Project Info</strong>
                        <p>👤 Client: ${contact?.name || 'Unknown'}</p>
                        <p>🏠 Job Type: ${project.jobType}</p>
                        <p>📍 Address: ${project.address}</p>
                        <p>💰 Value: $${this.formatMoney(project.value)}</p>
                        <p>📅 Started: ${project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not started'}</p>
                    </div>

                    <div class="crm-detail-section">
                        <strong>Progress</strong>
                        <div class="crm-progress-bar" style="margin: 8px 0;">
                            <div class="crm-progress-fill" style="width: ${project.progress}%;"></div>
                        </div>
                        <p>${project.progress}% Complete</p>
                        <button class="crm-btn-secondary" onclick="window.crmDashboard.updateProjectProgress('${project.id}')">Update Progress</button>
                    </div>

                    ${projectTasks.length > 0 ? `
                        <div class="crm-detail-section">
                            <strong>Tasks (${projectTasks.filter(t => !t.completed).length} open)</strong>
                            ${projectTasks.map(task => `
                                <div class="crm-detail-item">
                                    <input type="checkbox" ${task.completed ? 'checked' : ''}
                                           onchange="window.crmDashboard.completeTask('${task.id}'); window.crmDashboard.render();">
                                    <span>${task.title}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${project.notes ? `
                        <div class="crm-detail-section">
                            <strong>Notes</strong>
                            <p>${project.notes}</p>
                        </div>
                    ` : ''}

                    <div class="crm-detail-actions">
                        <button class="crm-btn" onclick="window.crmDashboard.addProjectTask('${project.id}')">+ Add Task</button>
                        <button class="crm-btn-secondary" onclick="window.crmDashboard.markProjectComplete('${project.id}')">Mark Complete</button>
                    </div>
                </div>
            </div>
        `;
    }

    updateProjectProgress(projectId) {
        const newProgress = prompt('Enter progress percentage (0-100):');
        if (newProgress !== null) {
            const progress = Math.min(100, Math.max(0, parseInt(newProgress) || 0));
            const project = this.projects.find(p => p.id === projectId);
            if (project) {
                project.progress = progress;
                this.save('ccc_projects', this.projects);
                this.render();
            }
        }
    }

    addProjectTask(projectId) {
        const title = prompt('Task title:');
        if (title) {
            this.addTask({
                title,
                type: 'follow-up',
                relatedTo: { type: 'project', id: projectId },
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            });
            this.render();
        }
    }

    markProjectComplete(projectId) {
        if (confirm('Mark this project as complete?')) {
            const project = this.projects.find(p => p.id === projectId);
            if (project) {
                project.status = 'closed';
                project.progress = 100;
                this.save('ccc_projects', this.projects);
                this.selectedProject = null;
                this.render();
            }
        }
    }

    renderTasks() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Categorize tasks
        const ongoingTasks = this.tasks.filter(t => !t.completed && !t.archived);
        const completedTasks = this.tasks.filter(t => t.completed && !t.archived);
        const archivedTasks = this.tasks.filter(t => t.archived);

        // Sort ongoing by due date
        ongoingTasks.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });

        // Sort completed by completion date (most recent first)
        completedTasks.sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));

        return `
            <div class="crm-view-header">
                <h2>✅ Tasks</h2>
                <div class="crm-view-actions">
                    <button class="crm-btn" onclick="window.crmDashboard.showQuickAdd('task')">+ New Task</button>
                </div>
            </div>

            <div class="crm-filters-bar">
                <button class="crm-filter-btn ${!this.taskFilter ? 'active' : ''}"
                        onclick="window.crmDashboard.filterTasks(null)">Ongoing (${ongoingTasks.length})</button>
                <button class="crm-filter-btn ${this.taskFilter === 'completed' ? 'active' : ''}"
                        onclick="window.crmDashboard.filterTasks('completed')">Completed (${completedTasks.length})</button>
                <button class="crm-filter-btn ${this.taskFilter === 'archived' ? 'active' : ''}"
                        onclick="window.crmDashboard.filterTasks('archived')">Archived (${archivedTasks.length})</button>
            </div>

            ${this.renderTaskList()}
        `;
    }

    renderTaskList() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let tasks = [];
        let emptyMessage = '';

        if (!this.taskFilter) {
            // Ongoing tasks
            tasks = this.tasks.filter(t => !t.completed && !t.archived);
            emptyMessage = 'No ongoing tasks';
        } else if (this.taskFilter === 'completed') {
            // Completed tasks
            tasks = this.tasks.filter(t => t.completed && !t.archived);
            tasks.sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));
            emptyMessage = 'No completed tasks';
        } else if (this.taskFilter === 'archived') {
            // Archived tasks
            tasks = this.tasks.filter(t => t.archived);
            tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            emptyMessage = 'No archived tasks';
        }

        if (tasks.length === 0) {
            return `<p class="crm-empty">${emptyMessage}</p>`;
        }

        return `
            <div class="crm-tasks-list">
                ${tasks.map(task => {
                    const related = this.getRelatedName(task.relatedTo);
                    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                    const dueDateOnly = dueDate ? new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()) : null;
                    const isOverdue = dueDateOnly && dueDateOnly < today && !task.completed;
                    const isToday = dueDateOnly && dueDateOnly.getTime() === today.getTime();

                    return `
                        <div class="crm-task-row ${isOverdue ? 'overdue' : ''} ${task.completed ? 'completed' : ''}">
                            <div class="crm-task-checkbox">
                                ${!task.archived ? `
                                    <input type="checkbox" ${task.completed ? 'checked' : ''}
                                           onchange="window.crmDashboard.completeTask('${task.id}'); window.crmDashboard.render();">
                                ` : ''}
                            </div>
                            <div class="crm-task-content">
                                <div class="crm-task-title">
                                    ${isOverdue ? '⚠️ ' : ''}${task.title}
                                    ${related ? `<span class="crm-task-related">- ${related}</span>` : ''}
                                </div>
                                <div class="crm-task-meta">
                                    <span class="crm-task-type">${task.type}</span>
                                    ${task.dueDate ? `
                                        <span class="crm-task-due ${isOverdue ? 'overdue' : ''}">
                                            ${isToday ? 'Today' : dueDate.toLocaleDateString()}
                                        </span>
                                    ` : ''}
                                    ${task.completedAt ? `
                                        <span class="crm-task-completed">
                                            ✓ ${new Date(task.completedAt).toLocaleDateString()}
                                        </span>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="crm-task-actions">
                                ${!task.archived && task.completed ? `
                                    <button class="crm-icon-btn" onclick="window.crmDashboard.archiveTask('${task.id}'); window.crmDashboard.render();" title="Archive">📦</button>
                                ` : ''}
                                ${!task.archived ? `
                                    <button class="crm-icon-btn" onclick="if(confirm('Delete this task?')) { window.crmDashboard.deleteTask('${task.id}'); window.crmDashboard.render(); }" title="Delete">🗑️</button>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    filterTasks(filter) {
        this.taskFilter = filter;
        this.render();
    }

    renderMarketing() {
        const emailContacts = this.contacts.filter(c => c.emailConsent && c.email).length;
        const smsContacts = this.contacts.filter(c => c.smsConsent && c.phone).length;
        const totalCampaigns = this.campaigns.length;

        return `
            <div class="crm-view-header">
                <h2>📧 Marketing</h2>
                <div class="crm-view-actions">
                    <span class="crm-stat-badge">📧 ${emailContacts} email</span>
                    <span class="crm-stat-badge">💬 ${smsContacts} SMS</span>
                </div>
            </div>

            <div class="crm-marketing-grid">
                <!-- Segments Section -->
                <div class="crm-marketing-section">
                    <h3>📊 Segments</h3>
                    <p class="crm-help-text">Create saved filters to target specific groups</p>

                    <div class="crm-segment-list">
                        <div class="crm-segment-card" onclick="window.crmDashboard.viewSegment('all-email')">
                            <div class="crm-segment-name">All Email Subscribers</div>
                            <div class="crm-segment-count">${emailContacts} contacts</div>
                        </div>

                        <div class="crm-segment-card" onclick="window.crmDashboard.viewSegment('all-sms')">
                            <div class="crm-segment-name">All SMS Subscribers</div>
                            <div class="crm-segment-count">${smsContacts} contacts</div>
                        </div>

                        <div class="crm-segment-card" onclick="window.crmDashboard.viewSegment('past-clients')">
                            <div class="crm-segment-name">Past Clients</div>
                            <div class="crm-segment-count">${this.contacts.filter(c => this.projects.some(p => p.contactId === c.id && p.status === 'closed')).length} contacts</div>
                        </div>

                        <div class="crm-segment-card" onclick="window.crmDashboard.viewSegment('active-leads')">
                            <div class="crm-segment-name">Active Leads</div>
                            <div class="crm-segment-count">${this.contacts.filter(c => this.leads.some(l => l.contactId === c.id && !['won', 'lost'].includes(l.status))).length} contacts</div>
                        </div>
                    </div>

                    <button class="crm-btn-secondary" onclick="alert('Custom segments coming soon!')">+ Create Custom Segment</button>
                </div>

                <!-- Templates Section -->
                <div class="crm-marketing-section">
                    <h3>📝 Templates</h3>
                    <p class="crm-help-text">Pre-written messages for common scenarios</p>

                    <div class="crm-template-list">
                        ${this.getMarketingTemplates().map(template => `
                            <div class="crm-template-card">
                                <div class="crm-template-header">
                                    <strong>${template.name}</strong>
                                    <span class="crm-badge">${template.type}</span>
                                </div>
                                <div class="crm-template-preview">${template.preview}</div>
                                <button class="crm-btn-sm" onclick="window.crmDashboard.useTemplate('${template.id}')">Use Template</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Campaigns Section -->
            <div class="crm-section">
                <div class="crm-section-header">
                    <h3>📨 Campaigns</h3>
                    <button class="crm-btn" onclick="window.crmDashboard.createCampaign()">+ New Campaign</button>
                </div>

                ${this.campaigns.length > 0 ? `
                    <div class="crm-campaigns-list">
                        ${this.campaigns.map(campaign => `
                            <div class="crm-campaign-card">
                                <div class="crm-campaign-header">
                                    <div>
                                        <strong>${campaign.name}</strong>
                                        <span class="crm-badge crm-badge-${campaign.status}">${campaign.status}</span>
                                    </div>
                                    <span class="crm-campaign-type">${campaign.type === 'email' ? '📧' : '💬'} ${campaign.type.toUpperCase()}</span>
                                </div>
                                <div class="crm-campaign-body">
                                    <p><strong>Subject:</strong> ${campaign.subject || 'N/A'}</p>
                                    <p><strong>Recipients:</strong> ${campaign.recipients.length}</p>
                                    ${campaign.sentAt ? `<p><strong>Sent:</strong> ${new Date(campaign.sentAt).toLocaleString()}</p>` : ''}
                                </div>
                                <div class="crm-campaign-stats">
                                    <span>📤 ${campaign.stats.sent} sent</span>
                                    <span>👁️ ${campaign.stats.opened} opened</span>
                                    <span>💬 ${campaign.stats.replied} replied</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="crm-empty">No campaigns yet. Create your first campaign!</p>'}
            </div>

            <!-- Compliance Notice -->
            <div class="crm-compliance-notice">
                <strong>📋 CASL Compliance:</strong> All emails include unsubscribe links. SMS messages include "Reply STOP to opt out".
                Consent timestamps are tracked. Only send to contacts who have given explicit consent.
            </div>
        `;
    }

    getMarketingTemplates() {
        return [
            {
                id: 'welcome',
                name: 'Welcome Email',
                type: 'email',
                preview: 'Thank you for your interest! We\'re excited to help with your project...'
            },
            {
                id: 'follow-up-2',
                name: 'Day 2 Follow-up',
                type: 'email',
                preview: 'Just checking in on the estimate we sent. Do you have any questions?'
            },
            {
                id: 'follow-up-7',
                name: 'Day 7 Follow-up',
                type: 'email',
                preview: 'We wanted to follow up one more time about your project...'
            },
            {
                id: 'seasonal-promo',
                name: 'Seasonal Promotion',
                type: 'email',
                preview: 'Fall special: 10% off all exterior painting projects...'
            },
            {
                id: 'review-request',
                name: 'Review Request',
                type: 'email',
                preview: 'We hope you\'re enjoying your newly renovated space! Would you mind leaving us a review?'
            },
            {
                id: 'sms-reminder',
                name: 'Appointment Reminder',
                type: 'sms',
                preview: 'Hi [Name], reminder: site visit tomorrow at [Time]. Reply CONFIRM or RESCHEDULE.'
            }
        ];
    }

    viewSegment(segmentId) {
        let contacts = [];

        switch(segmentId) {
            case 'all-email':
                contacts = this.contacts.filter(c => c.emailConsent && c.email);
                break;
            case 'all-sms':
                contacts = this.contacts.filter(c => c.smsConsent && c.phone);
                break;
            case 'past-clients':
                contacts = this.contacts.filter(c =>
                    this.projects.some(p => p.contactId === c.id && p.status === 'closed')
                );
                break;
            case 'active-leads':
                contacts = this.contacts.filter(c =>
                    this.leads.some(l => l.contactId === c.id && !['won', 'lost'].includes(l.status))
                );
                break;
        }

        alert(`Segment: ${contacts.length} contacts\n\n${contacts.map(c => `${c.name} (${c.email || c.phone})`).slice(0, 10).join('\n')}${contacts.length > 10 ? '\n...' : ''}`);
    }

    useTemplate(templateId) {
        const template = this.getMarketingTemplates().find(t => t.id === templateId);
        if (template) {
            alert(`Template: ${template.name}\n\nThis would open a campaign composer with this template pre-filled.\n\nFull email/SMS integration coming soon!`);
        }
    }

    createCampaign() {
        const name = prompt('Campaign name:');
        if (!name) return;

        const type = confirm('Email campaign? (Cancel for SMS)') ? 'email' : 'sms';
        const subject = type === 'email' ? prompt('Email subject:') : null;

        if (type === 'email' && !subject) return;

        const campaign = new Campaign({
            name,
            type,
            subject,
            status: 'draft',
            recipients: []
        });

        this.campaigns.push(campaign);
        this.save('ccc_campaigns', this.campaigns);

        alert(`✅ Campaign "${name}" created as draft!\n\nFull campaign editor coming soon.`);
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
        } else if (relatedTo.type === 'project') {
            const project = this.projects.find(p => p.id === relatedTo.id);
            return project?.name || 'Unknown Project';
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

            .crm-task-item.overdue {
                background: #fee2e2;
                padding: 8px;
                border-radius: 4px;
                border-bottom: 1px solid #fecaca;
            }

            .crm-task-date {
                color: #6b7280;
                font-size: 12px;
                margin-left: 8px;
            }

            .crm-task-item.overdue .crm-task-date {
                color: #991b1b;
                font-weight: 600;
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

            /* Contacts View */
            .crm-view-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            .crm-view-actions {
                display: flex;
                gap: 12px;
                align-items: center;
            }

            .crm-stat-badge {
                background: #f3f4f6;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 14px;
                color: #6b7280;
            }

            .crm-filters-bar {
                display: flex;
                gap: 8px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }

            .crm-filter-btn {
                background: #f3f4f6;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                color: #6b7280;
            }

            .crm-filter-btn.active {
                background: #3b82f6;
                color: white;
            }

            .crm-contacts-list {
                display: grid;
                gap: 12px;
            }

            .crm-contact-card {
                display: flex;
                gap: 16px;
                padding: 16px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .crm-contact-card:hover {
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transform: translateY(-1px);
            }

            .crm-contact-avatar {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: #3b82f6;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                font-weight: bold;
                flex-shrink: 0;
            }

            .crm-contact-info {
                flex: 1;
            }

            .crm-contact-name {
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 4px;
            }

            .crm-contact-details {
                font-size: 14px;
                color: #6b7280;
                margin-bottom: 8px;
            }

            .crm-contact-meta {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }

            .crm-badge {
                background: #e5e7eb;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 12px;
                color: #6b7280;
            }

            .crm-badge-success {
                background: #d1fae5;
                color: #065f46;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 12px;
            }

            /* Projects View */
            .crm-projects-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 16px;
            }

            .crm-project-card {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 16px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .crm-project-card:hover {
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transform: translateY(-2px);
            }

            .crm-project-header {
                display: flex;
                justify-content: space-between;
                align-items: start;
                margin-bottom: 12px;
            }

            .crm-project-header h4 {
                margin: 0;
                font-size: 16px;
            }

            .crm-project-body {
                font-size: 14px;
                color: #6b7280;
                margin-bottom: 12px;
            }

            .crm-project-body p {
                margin: 4px 0;
            }

            .crm-project-progress {
                margin-top: 12px;
            }

            .crm-progress-bar {
                width: 100%;
                height: 8px;
                background: #e5e7eb;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 4px;
            }

            .crm-progress-fill {
                height: 100%;
                background: #3b82f6;
                transition: width 0.3s;
            }

            .crm-progress-text {
                font-size: 12px;
                color: #6b7280;
            }

            .crm-detail-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #e5e7eb;
            }

            .crm-detail-item:last-child {
                border-bottom: none;
            }

            /* Tasks View */
            .crm-tasks-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .crm-task-row {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                transition: all 0.2s;
            }

            .crm-task-row:hover {
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .crm-task-row.overdue {
                border-left: 4px solid #ef4444;
                background: #fef2f2;
            }

            .crm-task-row.completed {
                opacity: 0.7;
                background: #f9fafb;
            }

            .crm-task-checkbox {
                flex-shrink: 0;
            }

            .crm-task-checkbox input[type="checkbox"] {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }

            .crm-task-content {
                flex: 1;
            }

            .crm-task-title {
                font-size: 15px;
                font-weight: 500;
                color: #1f2937;
                margin-bottom: 4px;
            }

            .crm-task-row.completed .crm-task-title {
                text-decoration: line-through;
                color: #6b7280;
            }

            .crm-task-related {
                color: #6b7280;
                font-weight: normal;
                font-size: 14px;
            }

            .crm-task-meta {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                font-size: 13px;
            }

            .crm-task-type {
                background: #e5e7eb;
                padding: 2px 8px;
                border-radius: 4px;
                color: #6b7280;
                text-transform: capitalize;
            }

            .crm-task-due {
                color: #6b7280;
            }

            .crm-task-due.overdue {
                color: #dc2626;
                font-weight: 600;
            }

            .crm-task-completed {
                color: #059669;
            }

            .crm-task-actions {
                display: flex;
                gap: 8px;
                flex-shrink: 0;
            }

            /* Marketing View */
            .crm-marketing-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
                margin-bottom: 24px;
            }

            .crm-marketing-section {
                background: #f9fafb;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }

            .crm-marketing-section h3 {
                margin: 0 0 8px 0;
                font-size: 18px;
            }

            .crm-help-text {
                color: #6b7280;
                font-size: 14px;
                margin: 0 0 16px 0;
            }

            .crm-segment-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 16px;
            }

            .crm-segment-card {
                background: white;
                padding: 12px;
                border-radius: 6px;
                border: 1px solid #e5e7eb;
                cursor: pointer;
                transition: all 0.2s;
            }

            .crm-segment-card:hover {
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transform: translateY(-1px);
            }

            .crm-segment-name {
                font-weight: 600;
                margin-bottom: 4px;
            }

            .crm-segment-count {
                color: #6b7280;
                font-size: 14px;
            }

            .crm-template-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .crm-template-card {
                background: white;
                padding: 12px;
                border-radius: 6px;
                border: 1px solid #e5e7eb;
            }

            .crm-template-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .crm-template-preview {
                color: #6b7280;
                font-size: 13px;
                margin-bottom: 12px;
                font-style: italic;
            }

            .crm-btn-sm {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
            }

            .crm-section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }

            .crm-campaigns-list {
                display: grid;
                gap: 16px;
            }

            .crm-campaign-card {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 16px;
            }

            .crm-campaign-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .crm-campaign-type {
                color: #6b7280;
                font-size: 14px;
            }

            .crm-badge-draft {
                background: #f3f4f6;
                color: #6b7280;
            }

            .crm-badge-sent {
                background: #d1fae5;
                color: #065f46;
            }

            .crm-badge-scheduled {
                background: #fef3c7;
                color: #92400e;
            }

            .crm-campaign-body {
                font-size: 14px;
                color: #6b7280;
                margin-bottom: 12px;
            }

            .crm-campaign-body p {
                margin: 4px 0;
            }

            .crm-campaign-stats {
                display: flex;
                gap: 16px;
                padding-top: 12px;
                border-top: 1px solid #e5e7eb;
                font-size: 14px;
                color: #6b7280;
            }

            .crm-compliance-notice {
                background: #fef3c7;
                border: 1px solid #fde68a;
                border-radius: 8px;
                padding: 16px;
                margin-top: 24px;
                font-size: 14px;
                color: #92400e;
            }

            @media (max-width: 768px) {
                .crm-marketing-grid {
                    grid-template-columns: 1fr;
                }
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

                .crm-projects-grid {
                    grid-template-columns: 1fr;
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

console.log('✅ CRM v3.0 Phase 4 loaded. Type showCRM() to open.');

