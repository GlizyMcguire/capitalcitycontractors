/**
 * Capital City Contractors - Lean CRM Dashboard
 * Version: 3.0 - Construction Edition
 * Phase 4: Tasks & Marketing
 * Build: 2025-01-05
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

class Campaign {
    constructor(data = {}) {
        this.id = data.id || 'campaign_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        this.name = data.name || '';
        this.type = data.type || 'email'; // 'email' | 'sms'
        this.subject = data.subject || '';
        this.status = data.status || 'draft'; // 'draft' | 'scheduled' | 'sent'
        this.recipients = data.recipients || [];
        this.stats = data.stats || { sent: 0, opened: 0, replied: 0 };
        this.createdAt = data.createdAt || new Date().toISOString();
        this.sentAt = data.sentAt || null;
    }
}

class FormSubmission {
    constructor(data = {}) {
        this.id = data.id || 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        this.name = data.name || '';
        this.email = data.email || '';
        this.phone = data.phone || '';
        this.formType = data.formType || 'contact'; // 'contact' | 'quote' | 'discount'
        this.payload = data.payload || {};
        this.submittedAt = data.submittedAt || new Date().toISOString();
        this.contactId = data.contactId || null; // linked after processing
        this.leadId = data.leadId || null; // set if a lead is created
    }
}

class DiscountCode {
    constructor(data = {}) {
        this.id = data.id || 'code_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        this.code = data.code || '';
        this.value = data.value || '';
        this.contactId = data.contactId || null;
        this.contactEmail = data.contactEmail || '';
        this.sentAt = data.sentAt || new Date().toISOString();
        this.expiresAt = data.expiresAt || null;
        this.status = data.status || 'pending'; // 'pending' | 'applied' | 'expired'
        this.redeemedAt = data.redeemedAt || null;
        this.notes = data.notes || '';
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
        this.campaigns = this.load('ccc_campaigns', []);
        this.submissions = this.load('ccc_submissions', []);
        this.discountCodes = this.load('ccc_discount_codes', []);

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
        this.sidebarCollapsed = false;
        this.hotkeysAttached = false;

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

        if (!this.hotkeysAttached) {
            this.hotkeysAttached = true;
            window.addEventListener('keydown', (e) => {
                const tag = (e.target && e.target.tagName) || '';
                if (tag === 'INPUT' || tag === 'TEXTAREA') return; // don't hijack typing
                if (e.key === 'n' || e.key === 'N') {
                    e.preventDefault(); this.showQuickAdd('lead');
                } else if (e.key === 't' || e.key === 'T') {
                    e.preventDefault(); this.showQuickAdd('task');
                } else if (e.key === '/') {
                    e.preventDefault(); alert('Global search coming soon.');
                }
            });
        }
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
                <div class="crm-shell ${this.sidebarCollapsed ? 'collapsed' : ''}">
                    <aside class="crm-sidebar">
                        <div class="crm-sidebar-header">
                            <div class="crm-logo">🏗️</div>
                            <button class="crm-icon-btn" title="Collapse" onclick="window.crmDashboard.toggleSidebar()">${this.sidebarCollapsed ? '➡️' : '⬅️'}</button>
                        </div>
                        <nav class="crm-nav-vertical">
                            <button class="crm-nav-item ${this.currentView === 'dashboard' ? 'active' : ''}" onclick="window.crmDashboard.switchView('dashboard')">📊 <span class="label">Dashboard</span></button>
                            <button class="crm-nav-item ${this.currentView === 'pipeline' ? 'active' : ''}" onclick="window.crmDashboard.switchView('pipeline')">🎯 <span class="label">Leads</span></button>
                            <button class="crm-nav-item ${this.currentView === 'projects' ? 'active' : ''}" onclick="window.crmDashboard.switchView('projects')">🏗️ <span class="label">Projects</span></button>
                            <button class="crm-nav-item ${this.currentView === 'contacts' ? 'active' : ''}" onclick="window.crmDashboard.switchView('contacts')">👥 <span class="label">Contacts</span></button>
                            <button class="crm-nav-item ${this.currentView === 'tasks' ? 'active' : ''}" onclick="window.crmDashboard.switchView('tasks')">✅ <span class="label">Tasks</span></button>
                            <button class="crm-nav-item ${this.currentView === 'marketing' ? 'active' : ''}" onclick="window.crmDashboard.switchView('marketing')">📧 <span class="label">Marketing</span></button>
                            <button class="crm-nav-item ${this.currentView === 'forms-codes' ? 'active' : ''}" onclick="window.crmDashboard.switchView('forms-codes')">📋 <span class="label">Forms & Codes</span></button>
                            <button class="crm-nav-item ${this.currentView === 'reports' ? 'active' : ''}" onclick="window.crmDashboard.switchView('reports')">📈 <span class="label">Reports</span></button>
                            <button class="crm-nav-item ${this.currentView === 'settings' ? 'active' : ''}" onclick="window.crmDashboard.switchView('settings')">⚙️ <span class="label">Settings</span></button>
                        </nav>
                    </aside>

                    <main class="crm-main">
                        <div class="crm-main-header">
                            <h1 class="crm-page-title">${this.getPageTitle()}</h1>
                            <button class="crm-btn-close" onclick="window.crmDashboard.close()">✕</button>
                        </div>
                        <div class="crm-content">
                            ${this.renderCurrentView()}
                        </div>
                        <button class="crm-quick-add-fab" title="Quick Add" onclick="window.crmDashboard.openQuickAddMenu()">＋</button>
                    </main>
                </div>
            </div>
            ${ (this.selectedLead || this.selectedContact || this.selectedProject) ? `<div class="crm-drawer-backdrop" onclick="window.crmDashboard.closeDrawer()"></div>` : ''}
            ${ this.dayPopoverDateKey ? this.renderDayPopover() : '' }
        `;
    }

    renderDayPopover(){
        const key = this.dayPopoverDateKey; if (!key) return '';
        const [y,m,d] = key.split('-').map(n=>parseInt(n,10));
        const day = new Date(y, m-1, d);
        const today = new Date(); const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const tasks = this.tasks.filter(t=>{
            if (!t.dueDate) return false; const dt = new Date(t.dueDate);
            const k = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
            return k === key && !t.archived;
        }).sort((a,b)=> new Date(a.dueDate) - new Date(b.dueDate));
        const title = day.toLocaleDateString();
        return `
          <div class="crm-modal-backdrop" onclick="window.crmDashboard.closeDayView()"></div>
          <div class="crm-modal" role="dialog" aria-modal="true">
            <div class="crm-modal-header">
              <h3>Tasks on ${title}</h3>
              <div style="display:flex; gap:8px;">
                <button class="crm-btn-sm" onclick="window.crmDashboard.filterTasksByDate('${key}')">Filter List</button>
                <button class="crm-btn-sm" onclick="window.crmDashboard.closeDayView()">Close</button>
              </div>
            </div>
            <div class="crm-modal-body">
              <div class="crm-template-add-row" style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
                <select class="crm-input crm-input-sm" id="day-template-select">
                  <option value="">Add from template...</option>
                  ${this.getTaskTemplates().map(t=>`<option value="${t.id}">${t.title}</option>`).join('')}
                </select>
                <button class="crm-btn-sm" onclick="const sel=document.getElementById('day-template-select'); if(sel.value) window.crmDashboard.addTemplateTaskOnDate(sel.value, '${key}')">Add</button>
              </div>
              ${tasks.length ? tasks.map(t=>{
                const due = t.dueDate ? new Date(t.dueDate) : null;
                const overdue = due && new Date(due.getFullYear(), due.getMonth(), due.getDate()) < todayOnly && !t.completed;
                const related = this.getRelatedName(t.relatedTo);
                const actions = [];
                if (t.relatedTo?.type==='lead') actions.push(`<button class=\"crm-btn-xs\" onclick=\"window.crmDashboard.openLead('${t.relatedTo.id}')\">Open Lead</button>`);
                if (t.relatedTo?.type==='project') actions.push(`<button class=\"crm-btn-xs\" onclick=\"window.crmDashboard.selectedProject='${t.relatedTo.id}'; window.crmDashboard.currentView='projects'; window.crmDashboard.render();\">Open Project</button>`);
                return `<div class=\"crm-day-task-row ${overdue?'overdue':''}\">`
                  + `<input type=\"checkbox\" ${t.completed?'checked':''} onchange=\"window.crmDashboard.completeTask('${t.id}'); window.crmDashboard.render();\">`
                  + `<span class=\"ttl\">${t.title}${related?` <small>(${related})</small>`:''}</span>`
                  + `<span class=\"meta\">${t.type||''}</span>`
                  + `<span class=\"acts\">${actions.join(' ')}</span>`
                  + `</div>`;
              }).join('') : '<p class="crm-empty">No tasks on this date.</p>'}
            </div>
          </div>`;
    }

    openLead(leadId) {
        this.currentView = 'pipeline';
        this.selectedLead = leadId;
        this.render();
    }
    closeDrawer() {
        this.selectedLead = null; this.selectedContact = null; this.selectedProject = null; this.render();
    }

    renderCurrentView() {
        switch(this.currentView) {
            case 'dashboard': return this.renderDashboard();
            case 'pipeline': return this.renderPipeline();
            case 'contacts': return this.renderContacts();
            case 'projects': return this.renderProjects();
            case 'tasks': return this.renderTasks();
            case 'marketing': return this.renderMarketing();
            case 'forms-codes': return this.renderFormsAndCodes();
            default: return this.renderDashboard();
        }
    }

    switchView(view) {
        this.currentView = view;
        this.selectedLead = null;
        this.render();
    }

    getPageTitle() {
        const map = {
            dashboard: 'Dashboard',
            pipeline: 'Leads',
            contacts: 'Contacts',
            projects: 'Projects',
            tasks: 'Tasks',
            marketing: 'Marketing',
            'forms-codes': 'Forms & Codes',
            reports: 'Reports',
            settings: 'Settings'
        };
        return map[this.currentView] || 'Dashboard';
    }

    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        this.render();
    }

    openQuickAddMenu() {
        const existing = document.getElementById('crm-quick-add-menu');
        if (existing) { existing.remove(); return; }
        const m = document.createElement('div');
        m.id = 'crm-quick-add-menu';
        m.className = 'crm-quick-add-menu';
        m.innerHTML = `
            <button onclick="window.crmDashboard.showQuickAdd('lead'); this.parentElement.remove();">+ Lead</button>
            <button onclick="window.crmDashboard.showQuickAdd('contact'); this.parentElement.remove();">+ Contact</button>
            <button onclick="window.crmDashboard.showQuickAdd('task'); this.parentElement.remove();">+ Task</button>
        `;
        document.body.appendChild(m);
        setTimeout(() => m.classList.add('open'), 10);
        // Close when clicking outside
        const onClick = (e) => {
            if (!m.contains(e.target)) { m.remove(); document.removeEventListener('click', onClick); }
        };
        setTimeout(() => document.addEventListener('click', onClick), 0);
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
        const fromWeb = !!lead.fromForm || (lead.leadSource && lead.leadSource.toLowerCase().includes('website'));

        return `
            <div class="crm-lead-card ${isStale ? 'stale' : ''}"
                 draggable="true"
                 data-lead-id="${lead.id}"
                 ondragstart="window.crmDashboard.handleDragStart(event, '${lead.id}')"
                 onclick="window.crmDashboard.selectLead('${lead.id}')">
                <div class="crm-card-header">
                    <strong>${contact?.name || 'Unknown'}</strong>
                    <div style="display:flex;gap:6px;align-items:center;">
                        ${fromWeb ? '<span class="crm-badge crm-badge-info">WEB</span>' : ''}
                        ${isStale ? '<span class="crm-badge-warning">⚠️ 3+ days</span>' : ''}
                    </div>
                </div>
                <div class="crm-card-body">
                    <div class="crm-card-row">🏠 ${lead.jobType}</div>
                    <div class="crm-card-row">📍 ${lead.city || lead.propertyAddress}</div>
                    <div class="crm-card-row">💰 $${this.formatMoney(lead.estimatedValue)}</div>
                    <div class="crm-card-row">📊 ${lead.leadSource}</div>
                    ${lead.nextAction ? `<div class=\"crm-card-row\">📌 ${lead.nextAction}</div>` : ''}
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
            <div class="crm-detail-panel open">
                <div class="crm-detail-header">
                    <h3>${contact?.name || 'Unknown'}</h3>
                    <button class="crm-btn-close" onclick="window.crmDashboard.selectedLead = null; window.crmDashboard.render();">✕</button>
                </div>
                <div class="crm-detail-body">
                    <div class="crm-detail-section">
                        <strong>Smart Summary</strong>
                        <p>Last activity: ${this.daysSince(lead.lastActivity)} days ago • Next action: ${this.nextActionText(lead)}</p>
                    </div>
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
                    <div class="crm-detail-section">
                        <strong>Activity Timeline</strong>
                        ${this.renderLeadTimeline(lead, contact)}
                    </div>
                    <div class="crm-detail-section">
                        <strong>Related Tasks</strong>
                        ${this.renderRelatedTasks({ type: 'lead', id: lead.id })}
                        <div style="margin-top:8px;">
                          <button class="crm-btn-sm" onclick="window.crmDashboard.addLeadTask('${lead.id}')">+ Add Task</button>
                          <button class="crm-btn-sm" onclick="window.crmDashboard.addLeadNote('${lead.id}')">+ Add Note</button>
                        </div>
                    </div>
                    <div class="crm-detail-actions">
                        <button class="crm-btn" onclick="window.crmDashboard.convertToProject('${lead.id}')">✅ Convert to Project</button>
                        <button class="crm-btn-secondary" onclick="window.crmDashboard.markAsLost('${lead.id}')">❌ Mark as Lost</button>
                    </div>
                </div>
            </div>
        `;
    }

    daysSince(iso) {
        if (!iso) return 'N/A';
        const ms = new Date() - new Date(iso);
        return Math.max(0, Math.floor(ms / (1000*60*60*24)));
    }
    nextActionText(lead) {
        if (!lead.nextActionDate) return 'No next action';
        const days = Math.ceil((new Date(lead.nextActionDate) - new Date())/(1000*60*60*24));
        if (days < 0) return `Overdue by ${Math.abs(days)}d`;
        if (days === 0) return 'Due today';
        return `Due in ${days}d`;
    }
    renderLeadTimeline(lead, contact) {
        const items = [];
        items.push({ when: lead.createdAt, text: 'Lead created' });
        if (lead.lastActivity) items.push({ when: lead.lastActivity, text: 'Activity updated' });
        const relTasks = this.tasks.filter(t => t.relatedTo?.type === 'lead' && t.relatedTo?.id === lead.id);
        relTasks.forEach(t => items.push({ when: t.createdAt || t.dueDate, text: `Task: ${t.title}${t.completed ? ' (completed)' : ''}` }));
        if (contact?.id) {
            const subs = this.submissions.filter(s => s.contactId === contact.id);
            subs.forEach(s => items.push({ when: s.submittedAt, text: `Form submission (${s.formType})` }));
        }
        items.sort((a,b) => new Date(b.when) - new Date(a.when));
        return `<ul class=\"crm-timeline\">${items.slice(0,10).map(i => `<li><span>${new Date(i.when).toLocaleString()}</span> — ${i.text}</li>`).join('')}</ul>`;
    }
    renderRelatedTasks(relatedTo) {
        const list = this.tasks.filter(t => JSON.stringify(t.relatedTo) === JSON.stringify(relatedTo) && !t.archived);
        if (list.length === 0) return '<p class="crm-empty">No related tasks.</p>';
        return list.map(t => `
            <div class=\"crm-detail-item\">
                <input type=\"checkbox\" ${t.completed ? 'checked' : ''}
                       onchange=\"window.crmDashboard.completeTask('${t.id}'); window.crmDashboard.render();\">
                <span>${t.title} ${t.dueDate ? `— <small>${new Date(t.dueDate).toLocaleDateString()}</small>` : ''}</span>
            </div>
        `).join('');
    }
    addLeadTask(leadId) {
        const title = prompt('Task title:');
        if (!title) return;
        this.addTask({ title, type: 'follow-up', relatedTo: { type: 'lead', id: leadId }, dueDate: new Date().toISOString() });
        this.render();
    }
    addLeadNote(leadId) {
        const note = prompt('Add note:');
        if (!note) return;
        const lead = this.leads.find(l => l.id === leadId);
        if (!lead) return;
        const stamp = new Date().toISOString();
        lead.notes = (lead.notes ? lead.notes + '\n' : '') + `[${stamp.slice(0,10)}] ${note}`;
        lead.lastActivity = stamp;
        this.save('ccc_leads', this.leads);
        this.render();
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
            <div class="crm-detail-panel open">
                <div class="crm-detail-header">
                    <h3>${contact.name}</h3>
                    <button class="crm-btn-close" onclick="window.crmDashboard.selectedContact = null; window.crmDashboard.render();">✕</button>
                </div>
                <div class="crm-detail-body">
                    <div class="crm-detail-section">
                        <strong>Smart Summary</strong>
                        <p>Leads: ${contactLeads.length} • Projects: ${contactProjects.length} • Last activity: ${this.daysSince(this.getContactLastActivity(contact))} days ago</p>
                        <div style="margin-top:8px;">
                          <button class="crm-btn-sm" onclick="window.crmDashboard.addContactTask('${contact.id}')">+ Add Task</button>
                          <button class="crm-btn-sm" onclick="window.crmDashboard.addContactNote('${contact.id}')">+ Add Note</button>
                        </div>
                    </div>
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

                        <div class="crm-detail-section">
                            <strong>Activity Timeline</strong>
                            ${this.renderContactTimeline(contact)}
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

    getContactLastActivity(contact) {
        const leads = this.leads.filter(l => l.contactId === contact.id);
        const times = leads.map(l => l.lastActivity).filter(Boolean).map(t => +new Date(t));
        return times.length ? new Date(Math.max(...times)).toISOString() : null;
    }
    renderContactTimeline(contact) {
        const items = [];
        const leads = this.leads.filter(l => l.contactId === contact.id);
        leads.forEach(l => items.push({ when: l.createdAt, text: `Lead created (${l.jobType})` }));
        leads.forEach(l => { if (l.lastActivity) items.push({ when: l.lastActivity, text: 'Lead activity' }); });
        const projects = this.projects.filter(p => p.contactId === contact.id);
        projects.forEach(p => items.push({ when: p.createdAt, text: `Project created (${p.name})` }));
        const subs = this.submissions.filter(s => s.contactId === contact.id);
        subs.forEach(s => items.push({ when: s.submittedAt, text: `Form submission (${s.formType})` }));
        items.sort((a,b) => new Date(b.when) - new Date(a.when));
        return `<ul class=\"crm-timeline\">${items.slice(0,10).map(i => `<li><span>${new Date(i.when).toLocaleString()}</span> — ${i.text}</li>`).join('')}</ul>`;
    }
    addContactTask(contactId) {
        const title = prompt('Task title:');
        if (!title) return;
        this.addTask({ title, type: 'follow-up', dueDate: new Date().toISOString() });
        this.render();
    }
    addContactNote(contactId) {
        const note = prompt('Add note:');
        if (!note) return;
        const c = this.contacts.find(x => x.id === contactId);
        if (!c) return;
        const stamp = new Date().toISOString();
        c.notes = (c.notes ? c.notes + '\n' : '') + `[${stamp.slice(0,10)}] ${note}`;
        this.save('ccc_contacts', this.contacts);
        this.render();
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
            <div class="crm-detail-panel open">
                <div class="crm-detail-header">
                    <h3>${project.name}</h3>
                    <button class="crm-btn-close" onclick="window.crmDashboard.selectedProject = null; window.crmDashboard.render();">✕</button>
                </div>
                <div class="crm-detail-body">
                    <div class="crm-detail-section">
                        <strong>Smart Summary</strong>
                        <p>Progress: ${project.progress}%  b7  Next action: ${project.progress < 100 ? 'Continue work' : 'Completed'}</p>
                        <div style="margin-top:8px;">
                          <button class="crm-btn-sm" onclick="window.crmDashboard.addProjectTask('${project.id}')">+ Add Task</button>
                          <button class="crm-btn-sm" onclick="window.crmDashboard.addProjectNote('${project.id}')">+ Add Note</button>
                        </div>
                    </div>
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

                        <div class="crm-detail-section">
                            <strong>Activity Timeline</strong>
                            ${this.renderProjectTimeline(project)}
                        </div>

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

    renderProjectTimeline(project) {
        const items = [];
        if (project.createdAt) items.push({ when: project.createdAt, text: 'Project created' });
        const tasks = this.tasks.filter(t => t.relatedTo?.type === 'project' && t.relatedTo?.id === project.id);
        tasks.forEach(t => items.push({ when: t.createdAt || t.dueDate, text: `Task: ${t.title}${t.completed ? ' (completed)' : ''}` }));
        items.sort((a,b) => new Date(b.when) - new Date(a.when));
        return `<ul class=\"crm-timeline\">${items.slice(0,10).map(i => `<li><span>${new Date(i.when).toLocaleString()}</span>    ${i.text}</li>`).join('')}</ul>`;
    }
    addProjectNote(projectId) {
        const note = prompt('Add note:');
        if (!note) return;
        const p = this.projects.find(x => x.id === projectId);
        if (!p) return;
        const stamp = new Date().toISOString();
        p.notes = (p.notes ? p.notes + '\n' : '') + `[${stamp.slice(0,10)}] ${note}`;
        this.save('ccc_projects', this.projects);
        this.render();
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

            <div class="crm-filters-bar">
                <button class="crm-filter-btn ${!this.tasksQuickFilter ? 'active' : ''}"
                        onclick="window.crmDashboard.setTaskQuickFilter(null)">All</button>
                <button class="crm-filter-btn ${this.tasksQuickFilter === 'today' ? 'active' : ''}"
                        onclick="window.crmDashboard.setTaskQuickFilter('today')">Due Today</button>
                <button class="crm-filter-btn ${this.tasksQuickFilter === 'overdue' ? 'active' : ''}"
                        onclick="window.crmDashboard.setTaskQuickFilter('overdue')">Overdue</button>
                <button class="crm-filter-btn ${this.tasksQuickFilter === 'week' ? 'active' : ''}"
                        onclick="window.crmDashboard.setTaskQuickFilter('week')">This Week</button>
                <button class="crm-filter-btn ${this.tasksQuickFilter === 'lead' ? 'active' : ''}"
                        onclick="window.crmDashboard.setTaskQuickFilter('lead')">Linked to Leads</button>
                <button class="crm-filter-btn ${this.tasksQuickFilter === 'project' ? 'active' : ''}"
                        onclick="window.crmDashboard.setTaskQuickFilter('project')">Linked to Projects</button>
                <span style="flex:1"></span>
                <input class="crm-input crm-input-sm" style="max-width:200px" placeholder="Search tasks..."
                       value="${this.tasksSearchQuery||''}"
                       oninput="window.crmDashboard.setTasksSearchQuery(this.value)">
                <select class="crm-input crm-input-sm" onchange="window.crmDashboard.setTasksTypeFilter(this.value)">
                    ${['All', ...Array.from(new Set(this.tasks.map(t => t.type || 'other')))].map(x=>`<option ${((this.tasksTypeFilter||'All')===x)?'selected':''}>${x}</option>`).join('')}
                </select>
                    <button class="crm-filter-btn ${this.tasksCompact ? 'active' : ''}" onclick="window.crmDashboard.toggleTasksCompact()">Compact</button>

                <div class="crm-toggle">
                    <button class="crm-filter-btn ${this.tasksMode !== 'calendar' ? 'active' : ''}" onclick="window.crmDashboard.setTasksMode('list')">List</button>
                    <button class="crm-filter-btn ${this.tasksMode === 'calendar' ? 'active' : ''}" onclick="window.crmDashboard.setTasksMode('calendar')">Calendar</button>
                </div>
                <div class="crm-saved-filter">
                  <select class="crm-input crm-input-sm" id="tasks-saved-filter" onchange="window.crmDashboard.applySavedTaskFilter(this.value)">
                    <option value="">Saved filters...</option>
                    ${this.getSavedTaskFilters().map(f=>`<option value="${f.name}">${f.name}</option>`).join('')}
                  </select>
                  <button class="crm-btn-sm" onclick="window.crmDashboard.saveCurrentTaskFilter()">Save</button>
                  <button class="crm-btn-sm" onclick="const sel=document.getElementById('tasks-saved-filter'); if(sel.value) window.crmDashboard.deleteSavedTaskFilter(sel.value)">Delete</button>
                </div>
            </div>


            <div class="crm-templates-bar">
              <div class="lbl">Templates:</div>
              <div class="chips">
                ${this.getTaskTemplates().length ? this.getTaskTemplates().map(t=>`<span class=\"chip\">${t.title}<button class=\"x\" title=\"Delete\" onclick=\"window.crmDashboard.deleteTaskTemplate('${t.id}')\">×</button></span>`).join('') : '<span class="muted">None</span>'}
              </div>
              <button class="crm-btn-sm" onclick="window.crmDashboard.addTaskTemplate()">+ New Template</button>
            </div>

            ${this.tasksMode === 'calendar' ? this.renderTaskCalendar() : this.renderTaskList()}
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
        // Apply quick filter if any
        tasks = tasks.filter(t => this.taskMatchesQuickFilter(t, today));


        if (tasks.length === 0) {
            return `<p class="crm-empty">${emptyMessage}</p>`;
        }

        const visibleIds = tasks.map(t=>t.id);
        const bulk = (this.selectedTaskIds && this.selectedTaskIds.size) ? `
            <div class=\"crm-bulk-bar\">${this.selectedTaskIds.size} selected
              <button class=\"crm-btn-sm\" onclick=\"window.crmDashboard.completeSelectedTasks()\">Complete</button>
              <button class=\"crm-btn-sm\" onclick=\"window.crmDashboard.archiveSelectedTasks()\">Archive</button>
              <button class=\"crm-btn-sm\" onclick=\"window.crmDashboard.rescheduleSelectedTasks()\">Reschedule</button>
              <button class=\"crm-btn-sm\" onclick=\"if(confirm('Delete selected tasks?')) window.crmDashboard.deleteSelectedTasks()\">Delete</button>
              <span style=\"flex:1\"></span>
              <button class=\"crm-btn-sm\" onclick=\"window.crmDashboard.selectAllVisibleTasks(${JSON.stringify(visibleIds)})\">Select All</button>
              <button class=\"crm-btn-sm\" onclick=\"window.crmDashboard.clearTaskSelection()\">Clear</button>
            </div>` : '';

        const groups = this.groupTasks(tasks, today);
        return `
            ${bulk}
            <div class="crm-tasks-list ${this.tasksCompact ? 'compact' : ''}">
              ${groups.map(g => g.items.length ? `
                <div class=\"crm-task-group\">
                  <div class=\"crm-task-group-title\">${g.title}</div>
                  ${g.items.map(task => {
                    const related = this.getRelatedName(task.relatedTo);
                    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                    const dueDateOnly = dueDate ? new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()) : null;
                    const isOverdue = dueDateOnly && dueDateOnly < today && !task.completed;
                    const isToday = dueDateOnly && dueDateOnly.getTime() === today.getTime();
                    const selected = this.isTaskSelected(task.id) ? 'selected' : '';
                    return `
                      <div class=\"crm-task-row ${selected} ${isOverdue ? 'overdue' : ''} ${task.completed ? 'completed' : ''}\">
                        <div class=\"crm-task-select\">
                          <input type=\"checkbox\" ${this.isTaskSelected(task.id)?'checked':''} onchange=\"window.crmDashboard.toggleTaskSelect('${task.id}')\">
                        </div>
                        <div class=\"crm-task-checkbox\">
                          ${!task.archived ? `<input type=\"checkbox\" ${task.completed?'checked':''} onchange=\"window.crmDashboard.completeTask('${task.id}'); window.crmDashboard.render();\">` : ''}
                        </div>
                        <div class=\"crm-task-content\">
                          <div class=\"crm-task-title\">${isOverdue ? '⚠️ ' : ''}${task.title} ${related ? `<span class=\"crm-task-related\">- ${related}</span>` : ''}</div>
                          <div class=\"crm-task-meta\">
                            <span class=\"crm-task-type\">${task.type||''}</span>
                            ${task.dueDate ? `<span class=\"crm-task-due ${isOverdue?'overdue':''}\">${isToday ? 'Today' : dueDate.toLocaleDateString()}</span>` : ''}
                            ${task.completedAt ? `<span class=\"crm-task-completed\">✓ ${new Date(task.completedAt).toLocaleDateString()}</span>` : ''}
                          </div>
                        </div>
                        <div class=\"crm-task-actions\">
                          ${!task.archived && task.completed ? `<button class=\"crm-icon-btn\" onclick=\"window.crmDashboard.archiveTask('${task.id}'); window.crmDashboard.render();\" title=\"Archive\">📦</button>` : ''}
                          ${!task.archived ? `<button class=\"crm-icon-btn\" onclick=\"if(confirm('Delete this task?')) { window.crmDashboard.deleteTask('${task.id}'); window.crmDashboard.render(); }\" title=\"Delete\">🗑️</button>` : ''}
                        </div>
                      </div>`;
                  }).join('')}
                </div>` : '').join('')}
            </div>
        `;
    }
    setTasksMode(mode) { this.tasksMode = mode; this.render(); }
    setTaskQuickFilter(filter) { this.tasksQuickFilter = filter; this.render(); }
    toggleTasksCompact(){ this.tasksCompact = !this.tasksCompact; this.render(); }
    isTaskSelected(id){ if(!this.selectedTaskIds) this.selectedTaskIds = new Set(); return this.selectedTaskIds.has(id); }
    toggleTaskSelect(id){ if(!this.selectedTaskIds) this.selectedTaskIds = new Set(); if(this.selectedTaskIds.has(id)) this.selectedTaskIds.delete(id); else this.selectedTaskIds.add(id); this.render(); }
    selectAllVisibleTasks(ids){ if(!this.selectedTaskIds) this.selectedTaskIds = new Set(); ids.forEach(id=>this.selectedTaskIds.add(id)); this.render(); }
    clearTaskSelection(){ if(this.selectedTaskIds) this.selectedTaskIds.clear(); this.render(); }

    completeSelectedTasks(){ if(!this.selectedTaskIds) return; this.tasks.forEach(t=>{ if(this.selectedTaskIds.has(t.id) && !t.archived && !t.completed){ t.completed = true; t.completedAt = new Date().toISOString(); }}); this.save('ccc_tasks', this.tasks); this.render(); }
    archiveSelectedTasks(){ if(!this.selectedTaskIds) return; this.tasks.forEach(t=>{ if(this.selectedTaskIds.has(t.id) && t.completed && !t.archived){ t.archived = true; }}); this.save('ccc_tasks', this.tasks); this.render(); }
    deleteSelectedTasks(){ if(!this.selectedTaskIds) return; this.tasks = this.tasks.filter(t=>!this.selectedTaskIds.has(t.id)); this.save('ccc_tasks', this.tasks); this.selectedTaskIds.clear(); this.render(); }
    rescheduleSelectedTasks(){ if(!this.selectedTaskIds) return; const d = prompt('Reschedule to date (YYYY-MM-DD):'); if(!d) return; const iso = new Date(`${d}T09:00:00`).toISOString(); this.tasks.forEach(t=>{ if(this.selectedTaskIds.has(t.id) && !t.archived){ t.dueDate = iso; t.completed = false; }}); this.save('ccc_tasks', this.tasks); this.render(); }

    groupTasks(tasks, today){
        const startOfWeek = new Date(today); startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate()+6);
        const groups = [
          { key:'overdue', title:'Overdue', items:[] },
          { key:'today', title:'Today', items:[] },
          { key:'week', title:'This Week', items:[] },
          { key:'later', title:'Later', items:[] },
          { key:'none', title:'No Due Date', items:[] },
        ];
        for(const t of tasks){
          const d = t.dueDate ? new Date(t.dueDate) : null;
          const only = d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null;
          let bucket = 'none';
          if(only){
            if(only.getTime() === today.getTime()) bucket='today';
            else if(only < today && !t.completed) bucket='overdue';
            else if(only >= startOfWeek && only <= endOfWeek) bucket='week';
            else if(only > endOfWeek) bucket='later';
          }
          const g = groups.find(g=>g.key===bucket); g.items.push(t);
        }
        // sort within groups by due date
        for(const g of groups){ g.items.sort((a,b)=>{
          const ad = a.dueDate?new Date(a.dueDate).getTime():Infinity;
          const bd = b.dueDate?new Date(b.dueDate).getTime():Infinity;
          return ad-bd;
        }); }
        return groups;
    }
    getTaskTemplates(){ if(!this.taskTemplates) this.taskTemplates = this.load('ccc_task_templates', []); return this.taskTemplates; }
    saveTaskTemplates(arr){ this.taskTemplates = arr; this.save('ccc_task_templates', arr); }
    addTaskTemplate(){ const title = prompt('Template title:'); if(!title) return; const type = prompt('Type (e.g., follow-up, call, email):','follow-up'); const tmpl = { id: crypto.randomUUID(), title, type: type||'other' }; const arr = this.getTaskTemplates(); arr.push(tmpl); this.saveTaskTemplates(arr); this.render(); }
    deleteTaskTemplate(id){ const arr = this.getTaskTemplates().filter(t=>t.id!==id); this.saveTaskTemplates(arr); this.render(); }
    addTemplateTaskOnDate(templateId, dateKey){ if(!templateId) return; const tmpl = this.getTaskTemplates().find(t=>t.id===templateId); if(!tmpl) return; const iso = new Date(`${dateKey}T09:00:00`).toISOString(); this.addTask({ title: tmpl.title, type: tmpl.type, dueDate: iso }); this.render(); }


    taskMatchesQuickFilter(task, today) {
        // Normalize key dates
        const d = task.dueDate ? new Date(task.dueDate) : null;
        const dueOnly = d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null;
        const startOfWeek = new Date(today); startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate() + 6);

        // Quick filters
        if (this.tasksQuickFilter === 'today') {
            if (!dueOnly) return false; return dueOnly.getTime() === today.getTime();
        }
        if (this.tasksQuickFilter === 'overdue') {
            if (!dueOnly) return false; return (dueOnly < today) && !task.completed;
        }
        if (this.tasksQuickFilter === 'week') {
            if (!dueOnly) return false; return (dueOnly >= startOfWeek && dueOnly <= endOfWeek);
        }
        if (this.tasksQuickFilter === 'lead') {
            if (task.relatedTo?.type !== 'lead') return false;
        }
        if (this.tasksQuickFilter === 'project') {
            if (task.relatedTo?.type !== 'project') return false;
        }
        if (this.tasksQuickFilter === 'date') {
            if (!dueOnly || !this.tasksDateKey) return false;
            const key = `${dueOnly.getFullYear()}-${String(dueOnly.getMonth()+1).padStart(2,'0')}-${String(dueOnly.getDate()).padStart(2,'0')}`;
            if (key !== this.tasksDateKey) return false;
        }

        // Type filter
        if (this.tasksTypeFilter && this.tasksTypeFilter !== 'All') {
            if ((task.type || 'other') !== this.tasksTypeFilter) return false;
        }

        // Status filter (optional hook; currently covered by quick filters)
        if (this.tasksStatusFilter === 'completed' && !task.completed) return false;
        if (this.tasksStatusFilter === 'active' && task.completed) return false;

        // Search filter
        const q = (this.tasksSearchQuery || '').trim().toLowerCase();
        if (q) {
            const related = this.getRelatedName(task.relatedTo) || '';
            const hay = `${task.title || ''} ${related}`.toLowerCase();
            if (!hay.includes(q)) return false;
        }

        return true;
    }

    renderTaskCalendar() {
        const now = new Date();
        const year = (this.tasksCalYear != null) ? this.tasksCalYear : now.getFullYear();
        const month = (this.tasksCalMonth != null) ? this.tasksCalMonth : now.getMonth();
        const first = new Date(year, month, 1);
        const firstDow = first.getDay();
        const daysInMonth = new Date(year, month+1, 0).getDate();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const cells = [];
        for (let i=0;i<firstDow;i++) cells.push(null);
        for (let d=1; d<=daysInMonth; d++) cells.push(new Date(year, month, d));
        while (cells.length % 7 !== 0) cells.push(null);
        if (cells.length < 42) while (cells.length < 42) cells.push(null);

        // Build per-day tasks and find max for heat
        const ongoing = this.tasks.filter(t => !t.archived);
        const dayTasks = {};
        ongoing.forEach(t => {
            if (!t.dueDate) return; const dt = new Date(t.dueDate);
            const key = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
            (dayTasks[key] ||= []).push(t);
        });
        const maxCount = Math.max(1, ...Object.values(dayTasks).map(arr => arr.length));

        const grid = cells.map(cell => {
            if (!cell) return `<div class=\"crm-calendar-cell empty\"></div>`;
            const key = `${cell.getFullYear()}-${cell.getMonth()}-${cell.getDate()}`;
            let items = (dayTasks[key] || []).filter(t => this.taskMatchesQuickFilter(t, today));
            items.sort((a,b)=> new Date(a.dueDate) - new Date(b.dueDate));
            const isToday = cell.getTime() === today.getTime();
            const count = items.length;
            const heatLevel = count === 0 ? 0 : Math.min(5, Math.ceil((count / maxCount) * 5));
            const dateKey = `${cell.getFullYear()}-${String(cell.getMonth()+1).padStart(2,'0')}-${String(cell.getDate()).padStart(2,'0')}`;
            return `
                <div class=\"crm-calendar-cell ${isToday?'today':''} ${heatLevel?('heat-'+heatLevel):''}\" onclick=\"window.crmDashboard.openDayView('${dateKey}')\" ondragover=\"event.preventDefault()\" ondrop=\"window.crmDashboard.onCalendarCellDrop('${dateKey}')\">
                    <div class=\"crm-calendar-date\">${cell.getDate()}</div>
                    <div class=\"crm-calendar-list\">
                        ${items.slice(0,3).map(t=>{
                            const overdue = t.dueDate && new Date(t.dueDate) < today && !t.completed;
                            const related = this.getRelatedName(t.relatedTo);
                            return `<div class=\"crm-calendar-task ${overdue?'overdue':''}\" title=\"${t.title}\" draggable=\"true\" ondragstart=\"window.crmDashboard.onCalendarTaskDragStart('${t.id}')\">\u2022 ${t.title}${related?` <small>(${related})</small>`:''}</div>`;
                        }).join('')}
                        ${items.length>3?`<div class=\"crm-calendar-more\">+${items.length-3} more</div>`:''}
                    </div>
                </div>`;
        }).join('');

        const monthName = new Date(year, month, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' });
        return `
            <div class=\"crm-calendar\">
                <div class=\"crm-calendar-header\">
                    <button class=\"crm-btn-sm\" onclick=\"window.crmDashboard.shiftTasksMonth(-1)\">◀</button>
                    <div class=\"crm-calendar-title\">${monthName}</div>
                    <button class=\"crm-btn-sm\" onclick=\"window.crmDashboard.shiftTasksMonth(1)\">▶</button>
                </div>
                <div class=\"crm-calendar-weekdays\"><div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div></div>
                <div class=\"crm-calendar-grid\">${grid}</div>
            </div>
        `;
    }
    onCalendarTaskDragStart(id){ this.dragTaskId = id; }
    onCalendarCellDrop(dateKey){
        if (!this.dragTaskId) return;
        const t = this.tasks.find(x=>x.id===this.dragTaskId); if (!t) { this.dragTaskId=null; return; }
        const iso = new Date(`${dateKey}T09:00:00`).toISOString();
        t.dueDate = iso; this.save('ccc_tasks', this.tasks); this.dragTaskId = null; this.render();
    }

    openDayView(dateKey){ this.dayPopoverDateKey = dateKey; this.render(); }
    closeDayView(){ this.dayPopoverDateKey = null; this.render(); }

    shiftTasksMonth(delta){
        const now = new Date();
        if (this.tasksCalYear == null) this.tasksCalYear = now.getFullYear();
        if (this.tasksCalMonth == null) this.tasksCalMonth = now.getMonth();
        let m = this.tasksCalMonth + delta; let y = this.tasksCalYear;
        if (m < 0){ m = 11; y -= 1; } else if (m > 11){ m = 0; y += 1; }
        this.tasksCalMonth = m; this.tasksCalYear = y; this.render();
    }
    filterTasksByDate(dateKey){
        this.tasksDateKey = dateKey; this.tasksQuickFilter = 'date'; this.tasksMode = 'list'; this.render();
    }
    setTasksTypeFilter(val){ this.tasksTypeFilter = val; this.render(); }
    setTasksStatusFilter(val){ this.tasksStatusFilter = val; this.render(); }
    setTasksSearchQuery(val){ this.tasksSearchQuery = val; this.render(); }

    getSavedTaskFilters(){
        if (!this.taskSavedFilters){ this.taskSavedFilters = this.load('ccc_task_filters', []); }
        return this.taskSavedFilters;
    }
    saveCurrentTaskFilter(){
        const name = prompt('Name this filter:'); if (!name) return;
        const filt = { name,
            quick: this.tasksQuickFilter||null,
            type: this.tasksTypeFilter||null,
            status: this.tasksStatusFilter||null,
            search: this.tasksSearchQuery||'',
        };
        const arr = this.getSavedTaskFilters().filter(f=>f.name!==name);
        arr.push(filt);
        this.taskSavedFilters = arr; this.save('ccc_task_filters', arr); this.render();
    }
    applySavedTaskFilter(name){
        if (!name) return; const f = this.getSavedTaskFilters().find(x=>x.name===name); if (!f) return;
        this.tasksQuickFilter = f.quick; this.tasksTypeFilter = f.type; this.tasksStatusFilter = f.status; this.tasksSearchQuery = f.search;
        this.render();
    }
    deleteSavedTaskFilter(name){
        const arr = this.getSavedTaskFilters().filter(f=>f.name!==name);
        this.taskSavedFilters = arr; this.save('ccc_task_filters', arr); this.render();
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

    // ============== Forms & Codes View ==============
    renderFormsAndCodes() {
        const totalCodes = this.discountCodes.length;
        const usedCodes = this.discountCodes.filter(c => c.status === 'applied').length;
        const convRate = totalCodes > 0 ? Math.round((usedCodes / totalCodes) * 100) : 0;

        // Derive expired statuses for display
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const displayCodes = this.discountCodes.map(c => {
            const ex = c.expiresAt ? new Date(c.expiresAt) : null;
            const isExpired = ex && new Date(ex.getFullYear(), ex.getMonth(), ex.getDate()) < today && c.status !== 'applied';
            return { ...c, derivedStatus: isExpired ? 'expired' : c.status };
        });

        return `
            <div class="crm-view-header">
                <h2>📋 Forms & Codes</h2>
                <div class="crm-view-actions">
                    <button class="crm-btn" onclick="window.crmDashboard.addDiscountCode()">+ Add Code</button>
                </div>
            </div>

            <div class="crm-forms-codes-grid">
                <div class="crm-marketing-section">
                    <h3>📝 Form Submissions</h3>
                    <p class="crm-help-text">Website contact/quote/discount submissions</p>

                    ${this.submissions.length === 0 ? `<p class="crm-empty">No submissions yet.</p>` : `
                        <div class="crm-table">
                            <div class="crm-table-head">
                                <div>Name</div><div>Email</div><div>Phone</div><div>Date</div><div>Type</div><div>Actions</div>
                            </div>
                            ${this.submissions
                                .slice()
                                .sort((a,b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                                .map(s => `
                                <div class="crm-table-row">
                                    <div>${s.name || '-'}</div>
                                    <div>${s.email || '-'}</div>
                                    <div>${s.phone || '-'}</div>
                                    <div>${new Date(s.submittedAt).toLocaleString()}</div>
                                    <div>${s.formType} ${s.leadId ? '<span class=\"crm-badge-success\">Lead</span>' : ''}</div>
                                    <div>
                                        <button class="crm-btn-sm" onclick="window.crmDashboard.viewSubmission('${s.id}')">View</button>
                                        ${s.leadId ? `<button class="crm-btn-sm" onclick="window.crmDashboard.openLead('${s.leadId}')">View Lead</button>` : `<button class="crm-btn-sm" onclick="window.crmDashboard.createLeadFromSubmission('${s.id}')">Create Lead</button>`}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>

                <div class="crm-marketing-section">
                    <h3>🏷️ Discount Codes</h3>
                    <p class="crm-help-text">Conversion: ${usedCodes}/${totalCodes} used (${convRate}%)</p>

                    ${displayCodes.length === 0 ? `<p class="crm-empty">No discount codes yet.</p>` : `
                        <div class="crm-table">
                            <div class="crm-table-head">
                                <div>Code</div><div>Value</div><div>Contact</div><div>Sent</div><div>Expires</div><div>Status</div><div>Actions</div>
                            </div>
                            ${displayCodes
                                .slice()
                                .sort((a,b) => new Date(b.sentAt) - new Date(a.sentAt))
                                .map(c => {
                                    const contact = c.contactId ? this.contacts.find(x => x.id === c.contactId) : null;
                                    return `
                                    <div class="crm-table-row">
                                        <div>${c.code}</div>
                                        <div>${c.value || '-'}</div>
                                        <div>${contact?.name || c.contactEmail || '-'}</div>
                                        <div>${new Date(c.sentAt).toLocaleDateString()}</div>
                                        <div>${c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '-'}</div>
                                        <div><span class="crm-badge ${c.derivedStatus}">${c.derivedStatus}</span></div>
                                        <div>
                                            ${c.status !== 'applied' ? `<button class=\"crm-btn-sm\" onclick=\"window.crmDashboard.markCodeApplied('${c.id}')\">Mark Applied</button>` : ''}
                                            <button class="crm-btn-sm" onclick="window.crmDashboard.recordCodeRedemption('${c.id}')">Record Redemption</button>
                                        </div>
                                    </div>`;
                                }).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    // Public API to log a form submission from the website
    // payload is expected to optionally include: { address, city, jobType, estimatedValue, notes }
    logFormSubmission({ name, email, phone, formType = 'contact', payload = {}, submittedAt = null }) {
        const contact = this.findOrCreateContactByEmailOrPhone(name, email, phone);
        const sub = new FormSubmission({ name, email, phone, formType, payload, submittedAt: submittedAt || new Date().toISOString(), contactId: contact?.id || null });
        this.submissions.push(sub);
        this.save('ccc_submissions', this.submissions);

        // Auto lead upsert from submission (create or update existing)
        const lead = this.upsertLeadFromSubmission(sub, contact);
        if (lead) {
            sub.leadId = lead.id;
            this.save('ccc_submissions', this.submissions);
        }
        // No alerts here; keep UX quiet. Views reflect automatically on next render.
        this.render();
        return sub.id;
    }

    viewSubmission(id) {
        const s = this.submissions.find(x => x.id === id);
        if (!s) return;
        alert(`Submission Details\n\nName: ${s.name}\nEmail: ${s.email}\nPhone: ${s.phone}\nType: ${s.formType}\nDate: ${new Date(s.submittedAt).toLocaleString()}\n\nPayload:\n${JSON.stringify(s.payload, null, 2)}`);
    }

    createLeadFromSubmission(id) {
        const s = this.submissions.find(x => x.id === id);
        if (!s) return;
        const contact = this.findOrCreateContactByEmailOrPhone(s.name, s.email, s.phone);
        const lead = this.upsertLeadFromSubmission(s, contact, { forceNewIfNoAddress: false });
        if (lead) {
            s.leadId = lead.id;
            s.contactId = contact?.id || null;
            this.save('ccc_submissions', this.submissions);
            alert('✅ Lead created/updated from submission');
            this.openLead(lead.id);
        }
    }

    // Normalize addresses for comparison (lowercase, remove non-alphanumerics)
    normalizeAddress(str) {
        return (str || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    }

    // Create or update a lead from a website form submission
    upsertLeadFromSubmission(submission, contact, opts = {}) {
        const payload = submission.payload || {};
        const addr = payload.address || payload.propertyAddress || contact?.address || '';
        const addrNorm = this.normalizeAddress(addr);
        const type = (submission.formType || '').toLowerCase();
        const sourceLabel = type.includes('discount') ? 'Website - Discount Form' : (type.includes('quote') ? 'Website - Quote Form' : 'Website - Form');

        // Find existing candidate
        let existing = null;
        if (addrNorm) {
            existing = this.leads.find(l => this.normalizeAddress(l.propertyAddress) === addrNorm);
        }
        if (!existing && contact?.id) {
            existing = this.leads.find(l => l.contactId === contact.id && !['won','lost'].includes(l.status));
        }

        const nowIso = new Date().toISOString();
        if (existing) {
            // Update with any new info
            if (addr && !existing.propertyAddress) existing.propertyAddress = addr;
            if (payload.city && !existing.city) existing.city = payload.city;
            if (payload.jobType && !existing.jobType) existing.jobType = payload.jobType;
            if (payload.estimatedValue && !existing.estimatedValue) existing.estimatedValue = parseInt(payload.estimatedValue) || 0;
            if (!existing.leadSource || existing.leadSource.indexOf('Website') === -1) existing.leadSource = sourceLabel;
            existing.lastActivity = nowIso;
            existing.notes = (existing.notes ? existing.notes + '\n' : '') + `[${nowIso.slice(0,10)}] Form submission received (${submission.formType}); lead updated.`;
            existing.fromForm = true;
            this.save('ccc_leads', this.leads);

            // If stale (3+ days), add a follow-up task
            const daysOld = Math.floor((new Date() - new Date(existing.lastActivity)) / (1000 * 60 * 60 * 24));
            if (daysOld >= 3) {
                this.addTask({
                    title: `Follow up: website ${type} form - ${contact?.name || contact?.email || contact?.phone || ''}`,
                    type: 'follow-up',
                    relatedTo: { type: 'lead', id: existing.id },
                    dueDate: new Date(Date.now() + 24*60*60*1000).toISOString()
                });
            }
            return existing;
        }

        // Create new lead
        const lead = this.addLead({
            contactId: contact?.id || null,
            jobType: payload.jobType || 'General',
            propertyAddress: addr || '',
            city: payload.city || '',
            estimatedValue: parseInt(payload.estimatedValue) || 0,
            leadSource: sourceLabel,
            status: 'new',
            nextAction: 'Review website submission',
            nextActionDate: new Date(Date.now() + 24*60*60*1000).toISOString(),
            lastActivity: nowIso
        });
        lead.fromForm = true;
        // Initial follow-up task for new lead
        this.addTask({
            title: `Call ${contact?.name || contact?.email || contact?.phone || 'lead'} - website ${type || 'form'}`,
            type: 'call',
            relatedTo: { type: 'lead', id: lead.id },
            dueDate: new Date(Date.now() + 24*60*60*1000).toISOString()
        });
        this.save('ccc_leads', this.leads);
        return lead;
    }


    addDiscountCode() {
        const code = prompt('Code:');
        if (!code) return;
        const value = prompt('Value/Description (e.g., 10% Off):') || '';
        const contactEmail = prompt('Contact Email (optional):') || '';
        const expiresAt = prompt('Expiry date (YYYY-MM-DD, optional):');
        let contactId = null;
        if (contactEmail) {
            const contact = this.contacts.find(c => c.email && c.email.toLowerCase() === contactEmail.toLowerCase());
            if (contact) contactId = contact.id;
        }
        const rec = new DiscountCode({ code, value, contactEmail, contactId, expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null });
        this.discountCodes.push(rec);
        this.save('ccc_discount_codes', this.discountCodes);
        this.render();
    }

    markCodeApplied(id) {
        const rec = this.discountCodes.find(x => x.id === id);
        if (!rec) return;
        rec.status = 'applied';
        rec.redeemedAt = new Date().toISOString();
        this.save('ccc_discount_codes', this.discountCodes);
        this.render();
    }

    recordCodeRedemption(id) {
        const rec = this.discountCodes.find(x => x.id === id);
        if (!rec) return;
        const when = prompt('Redemption date (YYYY-MM-DD):');
        if (!when) return;
        rec.redeemedAt = new Date(when).toISOString();
        rec.status = 'applied';
        this.save('ccc_discount_codes', this.discountCodes);
        this.render();
    }

    renderReports() {
        const leads = this.leads;
        const contacts = this.contacts;
        // Lead source performance
        const bySource = {};
        leads.forEach(l => { const s = l.leadSource || 'Unknown'; bySource[s] = (bySource[s]||0)+1; });
        const totalLeads = leads.length || 1;
        // Monthly growth (YYYY-MM)
        const monthKey = d => { const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`; };
        const growth = {};
        contacts.forEach(c => { if (c.createdAt) { const k = monthKey(c.createdAt); growth[k] = growth[k]||{contacts:0,leads:0}; growth[k].contacts++; }});
        leads.forEach(l => { if (l.createdAt) { const k = monthKey(l.createdAt); growth[k] = growth[k]||{contacts:0,leads:0}; growth[k].leads++; }});
        const months = Object.keys(growth).sort();
        // Job type conversion
        const jobConv = this.settings.jobTypes.map(j => {
            const all = leads.filter(l => l.jobType === j).length;
            const won = leads.filter(l => l.jobType === j && l.status === 'won').length;
            return { job:j, all, won, rate: all ? Math.round((won/all)*100) : 0 };
        });
        // Pipeline value by stage
        const byStageVal = {};
        this.settings.stages.forEach(s => { byStageVal[s.id]=0; });
        leads.forEach(l => { byStageVal[l.status] = (byStageVal[l.status]||0) + (parseInt(l.estimatedValue)||0); });
        // Won/Lost ratio
        const won = leads.filter(l => l.status==='won').length;
        const lost = leads.filter(l => l.status==='lost').length;

        return `
            <div class="crm-view-header">
              <h2>📊 Reports</h2>
              <div class="crm-view-actions">
                <button class="crm-btn" onclick="window.crmDashboard.exportReportsCSV()">Export CSV</button>
              </div>
            </div>

            <div class="crm-grid-2">
              <div class="crm-card">
                <h3>Lead Source Performance</h3>
                ${Object.entries(bySource).sort((a,b)=>b[1]-a[1]).map(([s,c])=>{
                    const pct = Math.round((c/totalLeads)*100);
                    return `<div class=\"crm-bar-row\"><span>${s}</span><div class=\"crm-bar\"><div style=\"width:${pct}%\"></div></div><span>${c}</span></div>`;
                }).join('')}
              </div>

              <div class="crm-card">
                <h3>Won / Lost Ratio</h3>
                <p><strong>Won:</strong> ${won} &nbsp; <strong>Lost:</strong> ${lost}</p>
              </div>

              <div class="crm-card">
                <h3>Monthly Growth (Contacts / Leads)</h3>
                <div class="crm-table">
                  <div class="crm-table-row crm-table-head"><div>Month</div><div>Contacts</div><div>Leads</div></div>
                  ${months.map(m=>`<div class=\"crm-table-row\"><div>${m}</div><div>${growth[m].contacts}</div><div>${growth[m].leads}</div></div>`).join('')}
                </div>
              </div>

              <div class="crm-card">
                <h3>Job Type Conversion</h3>
                ${jobConv.map(x=>`<div class=\"crm-bar-row\"><span>${x.job}</span><div class=\"crm-bar\"><div style=\"width:${x.rate}%\"></div></div><span>${x.won}/${x.all}</span></div>`).join('')}
              </div>

              <div class="crm-card">
                <h3>Pipeline Value by Stage</h3>
                ${this.settings.stages.map(s=>{
                    const val = byStageVal[s.id]||0;
                    const max = Math.max(1, ...Object.values(byStageVal));
                    const pct = Math.round((val/max)*100);
                    return `<div class=\"crm-bar-row\"><span>${s.name}</span><div class=\"crm-bar\"><div style=\"width:${pct}%\"></div></div><span>$${this.formatMoney(val)}</span></div>`;
                }).join('')}
              </div>
            </div>
        `;
    }

    exportReportsCSV() {
        const rows = [];
        rows.push(['Section','Metric','Value'].join(','));
        // Lead sources
        const bySource = {};
        this.leads.forEach(l=>{ const s=l.leadSource||'Unknown'; bySource[s]=(bySource[s]||0)+1; });
        Object.entries(bySource).forEach(([s,c])=>rows.push(['Lead Sources',s,c].join(',')));
        // Won/Lost
        const won = this.leads.filter(l=>l.status==='won').length;
        const lost = this.leads.filter(l=>l.status==='lost').length;
        rows.push(['Won/Lost','Won',won].join(','));
        rows.push(['Won/Lost','Lost',lost].join(','));
        // Monthly growth
        const monthKey = d => { const dt = new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`; };
        const growth = {};
        this.contacts.forEach(c=>{ if(c.createdAt){ const k=monthKey(c.createdAt); growth[k]=growth[k]||{contacts:0,leads:0}; growth[k].contacts++; }});
        this.leads.forEach(l=>{ if(l.createdAt){ const k=monthKey(l.createdAt); growth[k]=growth[k]||{contacts:0,leads:0}; growth[k].leads++; }});
        Object.keys(growth).sort().forEach(m=>{
            rows.push(['Monthly Growth',`${m} contacts`,growth[m].contacts].join(','));
            rows.push(['Monthly Growth',`${m} leads`,growth[m].leads].join(','));
        });
        // Job type conversion
        this.settings.jobTypes.forEach(j=>{
            const all=this.leads.filter(l=>l.jobType===j).length;
            const w=this.leads.filter(l=>l.jobType===j && l.status==='won').length;
            rows.push(['Job Conversion',`${j} won/total`,`${w}/${all}`].join(','));
        });
        // Pipeline values
        const byStageVal={}; this.settings.stages.forEach(s=>byStageVal[s.id]=0);
        this.leads.forEach(l=>{ byStageVal[l.status]=(byStageVal[l.status]||0)+(parseInt(l.estimatedValue)||0); });
        this.settings.stages.forEach(s=>{
            rows.push(['Pipeline Value',s.name,`$${this.formatMoney(byStageVal[s.id]||0)}`].join(','));
        });
        const csv = rows.join('\n');
        this.downloadFile('reports.csv', csv, 'text/csv');
    }
    downloadFile(filename, content, mime='text/plain') {
        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
    }

    renderSettings() {
        const s = this.settings || {};
        s.business = s.business || { companyName: 'Capital City Contractors', phone: '', email: '' };
        s.notifications = s.notifications || { email: true, sms: false };
        return `
          <div class="crm-view-header"><h2>⚙️ Settings</h2></div>
          <div class="crm-grid-2">
            <div class="crm-card">
              <h3>Business Info</h3>
              <input class="crm-input" id="set-biz-name" placeholder="Company Name" value="${s.business.companyName||''}">
              <input class="crm-input" id="set-biz-phone" placeholder="Phone" value="${s.business.phone||''}">
              <input class="crm-input" id="set-biz-email" placeholder="Email" value="${s.business.email||''}">
              <button class="crm-btn" onclick="window.crmDashboard.saveBusinessInfo()">Save</button>
            </div>

            <div class="crm-card">
              <h3>Notifications</h3>
              <label><input type="checkbox" id="set-notify-email" ${s.notifications.email?'checked':''}> Email alerts</label><br>
              <label><input type="checkbox" id="set-notify-sms" ${s.notifications.sms?'checked':''}> SMS alerts</label><br>
              <button class="crm-btn" onclick="window.crmDashboard.saveNotifications()">Save</button>
            </div>

            <div class="crm-card">
              <h3>Job Types</h3>
              <div class="crm-chip-list">
                ${s.jobTypes.map((jt,i)=>`<span class=\"crm-chip\">${jt}<button onclick=\"window.crmDashboard.removeJobType(${i})\">✕</button></span>`).join('')}
              </div>
              <div style="display:flex;gap:8px;margin-top:8px;">
                <input class="crm-input" id="new-jobtype" placeholder="Add job type">
                <button class="crm-btn" onclick="window.crmDashboard.addJobType()">Add</button>
              </div>
            </div>

            <div class="crm-card">
              <h3>Lead Sources</h3>
              <div class="crm-chip-list">
                ${s.leadSources.map((ls,i)=>`<span class=\"crm-chip\">${ls}<button onclick=\"window.crmDashboard.removeLeadSource(${i})\">✕</button></span>`).join('')}
              </div>
              <div style="display:flex;gap:8px;margin-top:8px;">
                <input class="crm-input" id="new-leadsource" placeholder="Add lead source">
                <button class="crm-btn" onclick="window.crmDashboard.addLeadSource()">Add</button>
              </div>
            </div>

            <div class="crm-card" style="grid-column:1 / -1;">
              <h3>Pipeline Stages</h3>
              <div class="crm-table">
                <div class="crm-table-row crm-table-head"><div>Stage</div><div>Color</div><div>Order</div><div>Actions</div></div>
                ${s.stages.map((st,idx)=>`
                  <div class=\"crm-table-row\">
                    <div><input class=\"crm-input\" value=\"${st.name}\" onchange=\"window.crmDashboard.renameStage('${st.id}', this.value)\"></div>
                    <div><input type=\"color\" value=\"${st.color}\" onchange=\"window.crmDashboard.setStageColor('${st.id}', this.value)\"></div>
                    <div>
                      <button class=\"crm-btn-sm\" ${idx===0?'disabled':''} onclick=\"window.crmDashboard.moveStage('${st.id}', -1)\">↑</button>
                      <button class=\"crm-btn-sm\" ${idx===s.stages.length-1?'disabled':''} onclick=\"window.crmDashboard.moveStage('${st.id}', 1)\">↓</button>
                    </div>
                    <div><button class=\"crm-btn-sm\" onclick=\"window.crmDashboard.removeStage('${st.id}')\">Delete</button></div>
                  </div>
                `).join('')}
              </div>
              <div style="display:flex;gap:8px;margin-top:8px;">
                <input class="crm-input" id="new-stage-name" placeholder="New stage name">
                <input type="color" id="new-stage-color" value="#64748b">
                <button class="crm-btn" onclick="window.crmDashboard.addStage()">Add Stage</button>
              </div>
            </div>

            <div class="crm-card" style="grid-column:1 / -1;">
              <h3>Data Management</h3>
              <button class="crm-btn" onclick="window.crmDashboard.exportAllData()">Export All Data</button>
              <button class="crm-btn" onclick="window.crmDashboard.importData()">Import Data</button>
              <button class="crm-btn-secondary" onclick="window.crmDashboard.clearAllData()">Clear All Data</button>
            </div>
          </div>
        `;
    }
    saveBusinessInfo() {
        this.settings.business = {
            companyName: document.getElementById('set-biz-name').value,
            phone: document.getElementById('set-biz-phone').value,
            email: document.getElementById('set-biz-email').value,
        };
        this.save('ccc_settings', this.settings); this.render();
    }
    saveNotifications() {
        this.settings.notifications = {
            email: document.getElementById('set-notify-email').checked,
            sms: document.getElementById('set-notify-sms').checked,
        };
        this.save('ccc_settings', this.settings); this.render();
    }
    addJobType() {
        const v = document.getElementById('new-jobtype').value.trim();
        if (!v) return; this.settings.jobTypes.push(v); this.save('ccc_settings', this.settings); this.render();
    }
    removeJobType(idx) { this.settings.jobTypes.splice(idx,1); this.save('ccc_settings', this.settings); this.render(); }
    addLeadSource() {
        const v = document.getElementById('new-leadsource').value.trim();
        if (!v) return; this.settings.leadSources.push(v); this.save('ccc_settings', this.settings); this.render();
    }
    removeLeadSource(idx) { this.settings.leadSources.splice(idx,1); this.save('ccc_settings', this.settings); this.render(); }
    renameStage(id, name) {
        const st = this.settings.stages.find(s=>s.id===id); if (!st) return; st.name = name; this.save('ccc_settings', this.settings); this.render();
    }
    setStageColor(id, color) {
        const st = this.settings.stages.find(s=>s.id===id); if (!st) return; st.color = color; this.save('ccc_settings', this.settings); this.render();
    }
    moveStage(id, dir) {
        const i = this.settings.stages.findIndex(s=>s.id===id); if (i<0) return;
        const j = i + dir; if (j<0 || j>=this.settings.stages.length) return;
        const arr = this.settings.stages; const [it] = arr.splice(i,1); arr.splice(j,0,it);
        this.save('ccc_settings', this.settings); this.render();
    }
    addStage() {
        const name = document.getElementById('new-stage-name').value.trim(); if (!name) return;
        const color = document.getElementById('new-stage-color').value || '#64748b';
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
        if (this.settings.stages.find(s=>s.id===id)) return alert('Stage id exists');
        this.settings.stages.push({ id, name, color }); this.save('ccc_settings', this.settings); this.render();
    }
    removeStage(id) {
        this.settings.stages = this.settings.stages.filter(s=>s.id!==id); this.save('ccc_settings', this.settings); this.render();
    }
    exportAllData() {
        const snapshot = {
            contacts: this.contacts,
            leads: this.leads,
            projects: this.projects,
            tasks: this.tasks,
            campaigns: this.campaigns,
            submissions: this.submissions,
            discountCodes: this.discountCodes,
            settings: this.settings,
        };
        this.downloadFile('ccc_data.json', JSON.stringify(snapshot, null, 2), 'application/json');
    }
    importData() {
        const text = prompt('Paste JSON exported from this app:');
        if (!text) return; try {
            const data = JSON.parse(text);
            if (data.contacts) { this.contacts = data.contacts; this.save('ccc_contacts', this.contacts); }
            if (data.leads) { this.leads = data.leads; this.save('ccc_leads', this.leads); }
            if (data.projects) { this.projects = data.projects; this.save('ccc_projects', this.projects); }
            if (data.tasks) { this.tasks = data.tasks; this.save('ccc_tasks', this.tasks); }
            if (data.campaigns) { this.campaigns = data.campaigns; this.save('ccc_campaigns', this.campaigns); }
            if (data.submissions) { this.submissions = data.submissions; this.save('ccc_submissions', this.submissions); }
            if (data.discountCodes) { this.discountCodes = data.discountCodes; this.save('ccc_discount_codes', this.discountCodes); }
            if (data.settings) { this.settings = data.settings; this.save('ccc_settings', this.settings); }
            alert('Data imported.'); this.render();
        } catch(e) { alert('Invalid JSON.'); }
    }
    clearAllData() {
        if (!confirm('This will erase all CRM data. Continue?')) return;
        ['ccc_contacts','ccc_leads','ccc_projects','ccc_tasks','ccc_campaigns','ccc_submissions','ccc_discount_codes','ccc_settings']
          .forEach(k=>localStorage.removeItem(k));
        this.contacts=[]; this.leads=[]; this.projects=[]; this.tasks=[]; this.campaigns=[]; this.submissions=[]; this.discountCodes=[];
        this.settings = this.load('ccc_settings', this.settings); this.render();
    }

    findOrCreateContactByEmailOrPhone(name, email, phone) {
        let contact = null;
        if (email) contact = this.contacts.find(c => c.email && c.email.toLowerCase() === email.toLowerCase());
        if (!contact && phone) contact = this.contacts.find(c => c.phone && c.phone === phone);
        if (!contact) {
            contact = new Contact({ name: name || email || phone || 'Unknown', email, phone, emailConsent: !!email, smsConsent: !!phone, consentDate: new Date().toISOString() });
            this.contacts.push(contact);
            this.save('ccc_contacts', this.contacts);
        }
        return contact;
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

            .crm-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 100001; }
            .crm-modal { position: fixed; z-index: 100002; top: 10%; left: 50%; transform: translateX(-50%); width: min(640px, 92vw); background: #fff; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
            .crm-modal-header { display:flex; align-items:center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
            .crm-modal-body { padding: 12px 16px; max-height: 60vh; overflow: auto; }
            .crm-day-task-row { display:grid; grid-template-columns: auto 1fr auto auto; gap: 8px; align-items:center; padding: 8px 0; border-bottom: 1px dashed #e5e7eb; }
            .crm-day-task-row.overdue .ttl { color: #b91c1c; }
            .crm-btn-xs { font-size: 12px; padding: 2px 6px; border-radius: 6px; border: 1px solid #e5e7eb; background: #f9fafb; cursor:pointer; }

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
            }
            .crm-calendar-header { display:flex; align-items:center; justify-content:center; gap:12px; margin-top:8px; margin-bottom:8px; }
            .crm-calendar-title { font-weight:600; color:#374151; }
            .crm-calendar-cell.heat-1 { background: #f3f4f6; }
            .crm-calendar-cell.heat-2 { background: #e5f0ff; }
            .crm-calendar-cell.heat-3 { background: #d0e4ff; }
            .crm-calendar-cell.heat-4 { background: #bcd7ff; }
            .crm-calendar-cell.heat-5 { background: #a6caff; }
            .crm-input-sm { height: 28px; padding: 4px 8px; font-size: 13px; }
            .crm-saved-filter { display:flex; gap:6px; align-items:center; }

            /* === 3-Panel Layout === */
            .crm-shell {
                display: grid;
                grid-template-columns: 260px 1fr;
                gap: 0;
                min-height: 70vh;
            }
            .crm-shell.collapsed {
                grid-template-columns: 72px 1fr;
            }
            .crm-sidebar {
                position: sticky;
                top: 0;
                align-self: start;
                height: 100%;
                border-right: 2px solid #e5e7eb;
                padding: 12px 8px;
            }
            .crm-sidebar-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            .crm-logo {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                background: #3b82f6;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
            }
            .crm-nav-vertical {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .crm-nav-item {
                display: flex;
                align-items: center;
                gap: 10px;
                width: 100%;
                background: #f3f4f6;
                border: none;
                border-radius: 8px;
                padding: 10px 12px;
                cursor: pointer;
                color: #374151;
                font-weight: 600;
            }
            .crm-shell.collapsed .crm-nav-item .label { display: none; }
            .crm-nav-item.active { background: #3b82f6; color: #fff; }
            .crm-nav-item:hover { background: #e5e7eb; }
            .crm-nav-item.active:hover { background: #2563eb; }

            .crm-main {
                padding-left: 16px;
            }
            .crm-main-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16px;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 8px;
            }
            .crm-page-title {
                margin: 0;
                font-size: 20px;
            }

            /* Quick Add FAB */
            .crm-quick-add-fab {
                position: fixed;
                right: 40px;
                bottom: 40px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                border: none;
                background: #10b981;
                color: white;
                font-size: 28px;
                cursor: pointer;
                box-shadow: 0 10px 24px rgba(0,0,0,0.15);
            }
            .crm-quick-add-fab:hover { background: #059669; }

            .crm-calendar { margin-top: 8px; }
            .crm-calendar-weekdays { display:grid; grid-template-columns: repeat(7,1fr); gap:8px; font-size:12px; color:#6b7280; padding:4px 0; }
            .crm-calendar-grid { display:grid; grid-template-columns: repeat(7,1fr); gap:8px; }
            .crm-calendar-cell { background:#fff; border:1px solid #e5e7eb; border-radius:8px; padding:8px; min-height:96px; display:flex; flex-direction:column; }
            .crm-calendar-cell.today { outline:2px solid #3b82f6; }
            .crm-calendar-cell.empty { background: #f9fafb; border-style: dashed; }
            .crm-calendar-date { font-weight:600; color:#374151; margin-bottom:6px; }
            .crm-calendar-task { font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
            .crm-calendar-task.overdue { color:#b91c1c; }
            .crm-calendar-more { font-size:12px; color:#6b7280; margin-top:4px; }

            .crm-quick-add-menu {
                position: fixed;
                right: 40px;
                bottom: 104px;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 8px;
                display: flex;
                flex-direction: column;
                gap: 6px;
                box-shadow: 0 10px 24px rgba(0,0,0,0.15);
                opacity: 0;
                transform: translateY(10px);
                transition: all .15s ease;
                z-index: 1000000;
            }
            .crm-quick-add-menu.open { opacity: 1; transform: translateY(0); }
            .crm-quick-add-menu button {
                background: #f3f4f6;
                border: none;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                text-align: left;
            }
            .crm-quick-add-menu button:hover { background: #e5e7eb; }

            @media (max-width: 900px) {
                .crm-shell { grid-template-columns: 72px 1fr; }
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

            .crm-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
            .crm-bar-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; align-items: center; margin: 6px 0; }
            .crm-bar { background: #f3f4f6; height: 8px; border-radius: 4px; overflow: hidden; }
            .crm-bar > div { background: #3b82f6; height: 8px; }
            .crm-chip-list { display: flex; flex-wrap: wrap; gap: 8px; }
            .crm-chip { background: #e5e7eb; color: #374151; padding: 4px 8px; border-radius: 16px; display: inline-flex; align-items: center; gap: 6px; }
            .crm-drawer-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 99999; animation: crmFade .2s ease; }
            @keyframes crmFade { from { opacity: 0; } to { opacity: 1; } }

            .crm-chip button { background: transparent; border: none; cursor: pointer; color: #6b7280; }
            .crm-timeline { list-style: none; padding: 0; margin: 0; }
            .crm-timeline li { padding: 6px 0; border-bottom: 1px dashed #e5e7eb; font-size: 13px; display:flex; gap:8px; }
            .crm-timeline li span { color: #6b7280; min-width: 140px; display:inline-block; }

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
                width: 420px;
                background: white;
                box-shadow: -10px 0 24px rgba(0,0,0,0.08);
                z-index: 100000;
                overflow-y: auto;
                transform: translateX(100%);
                transition: transform .2s ease;
            }
            .crm-detail-panel.open { transform: translateX(0); }

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
            .crm-badge-info { background: #dbeafe; color: #1d4ed8; }

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
            .crm-templates-bar { display:flex; flex-wrap:wrap; gap:8px; align-items:center; padding:8px 12px; background:#fff; border:1px solid #e5e7eb; border-radius:8px; margin-bottom:12px; }
            .crm-templates-bar .lbl { font-weight:600; color:#374151; }
            .crm-templates-bar .chips { display:flex; gap:6px; align-items:center; }
            .crm-templates-bar .chip { display:inline-flex; align-items:center; gap:6px; padding:4px 8px; background:#f3f4f6; border:1px solid #e5e7eb; border-radius:999px; }
            .crm-templates-bar .chip .x { border:none; background:transparent; cursor:pointer; font-size:14px; line-height:1; }

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

            .crm-tasks-list.compact .crm-task-row { padding: 8px; gap: 8px; }
            .crm-task-group-title { margin: 12px 0 6px; font-weight: 600; color: #374151; }
            .crm-bulk-bar { display:flex; align-items:center; gap:8px; padding:8px 12px; background:#f3f4f6; border:1px solid #e5e7eb; border-radius:8px; margin-bottom:8px; }
            .crm-task-select input { width:16px; height:16px; }

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

            /* Forms & Codes */
            .crm-forms-codes-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
            }
            .crm-table {
                width: 100%;
                display: grid;
                gap: 6px;
            }
            .crm-table-head, .crm-table-row {
                display: grid;
                grid-template-columns: 1.2fr 1.2fr 1fr 1fr 0.8fr 0.8fr 1.2fr;
                gap: 8px;
                align-items: center;
            }
            .crm-table-head {
                font-weight: 600;
                color: #374151;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 8px;
            }
            .crm-table-row {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                padding: 10px;
            }
            .crm-badge.pending { background: #f3f4f6; color: #374151; }
            .crm-badge.applied { background: #d1fae5; color: #065f46; }
            .crm-badge.expired { background: #fee2e2; color: #991b1b; }

            @media (max-width: 768px) {
                .crm-marketing-grid {
                    grid-template-columns: 1fr;
                }
                .crm-forms-codes-grid {
                    grid-template-columns: 1fr;
                }
                .crm-table-head, .crm-table-row {
                    grid-template-columns: 1fr 1fr;
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

