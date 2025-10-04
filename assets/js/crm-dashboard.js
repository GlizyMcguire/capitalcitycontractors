/**
 * Capital City Contractors - Professional CRM Dashboard
 * Version: 2.0
 * 
 * A comprehensive Customer Relationship Management dashboard for tracking,
 * managing, and analyzing lead data with modern UI and advanced features.
 * 
 * Features:
 * - Real-time analytics and metrics
 * - Advanced filtering and search
 * - Sortable data tables
 * - Data visualization (charts)
 * - Export to CSV/Excel
 * - Print reports
 * - Inline editing
 * - Bulk operations
 * - Responsive design
 * 
 * Access: Type `showCRM()` in browser console
 */

class CRMDashboard {
    constructor() {
        console.log('🚀 Initializing CRM Dashboard v2.0...');
        
        this.storageKey = 'ccc_leads';
        this.leads = this.loadLeads();
        this.filteredLeads = [...this.leads];
        this.sortColumn = 'timestamp';
        this.sortDirection = 'desc';
        this.selectedLeads = new Set();
        
        // Filter state
        this.filters = {
            status: 'all',
            projectType: 'all',
            dateRange: 'all',
            codeStatus: 'all',
            searchQuery: ''
        };
        
        console.log(`✅ Loaded ${this.leads.length} leads from storage`);
    }
    
    // ==================== DATA MANAGEMENT ====================
    
    loadLeads() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return [];
            
            const leads = JSON.parse(data);
            
            // Enhance legacy leads with new fields
            return leads.map(lead => ({
                ...lead,
                status: lead.status || 'new',
                notes: lead.notes || '',
                contactedDate: lead.contactedDate || null,
                convertedDate: lead.convertedDate || null,
                lastModified: lead.lastModified || lead.timestamp,
                tags: lead.tags || []
            }));
        } catch (error) {
            console.error('❌ Error loading leads:', error);
            return [];
        }
    }
    
    saveLeads() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.leads));
            console.log('✅ Leads saved to storage');
            return true;
        } catch (error) {
            console.error('❌ Error saving leads:', error);
            return false;
        }
    }
    
    updateLead(discountCode, updates) {
        const index = this.leads.findIndex(l => l.discountCode === discountCode);
        if (index === -1) return false;
        
        this.leads[index] = {
            ...this.leads[index],
            ...updates,
            lastModified: new Date().toISOString()
        };
        
        this.saveLeads();
        return true;
    }
    
    deleteLead(discountCode) {
        this.leads = this.leads.filter(l => l.discountCode !== discountCode);
        this.saveLeads();
    }
    
    deleteSelectedLeads() {
        if (this.selectedLeads.size === 0) return;
        
        if (!confirm(`Delete ${this.selectedLeads.size} selected leads? This cannot be undone.`)) {
            return;
        }
        
        this.leads = this.leads.filter(l => !this.selectedLeads.has(l.discountCode));
        this.selectedLeads.clear();
        this.saveLeads();
        this.applyFilters();
        this.render();
    }
    
    // ==================== FILTERING & SEARCH ====================
    
    applyFilters() {
        let filtered = [...this.leads];
        
        // Status filter
        if (this.filters.status !== 'all') {
            filtered = filtered.filter(l => l.status === this.filters.status);
        }
        
        // Project type filter
        if (this.filters.projectType !== 'all') {
            filtered = filtered.filter(l => l.project === this.filters.projectType);
        }
        
        // Code status filter
        if (this.filters.codeStatus !== 'all') {
            const now = new Date();
            filtered = filtered.filter(l => {
                const isExpired = new Date(l.codeExpiry) < now;
                if (this.filters.codeStatus === 'used') return l.used;
                if (this.filters.codeStatus === 'unused') return !l.used && !isExpired;
                if (this.filters.codeStatus === 'expired') return isExpired;
                return true;
            });
        }
        
        // Date range filter
        if (this.filters.dateRange !== 'all') {
            const now = new Date();
            const ranges = {
                'today': 1,
                'week': 7,
                'month': 30,
                '3months': 90
            };
            
            const days = ranges[this.filters.dateRange];
            if (days) {
                const cutoff = new Date(now - days * 24 * 60 * 60 * 1000);
                filtered = filtered.filter(l => new Date(l.timestamp) >= cutoff);
            }
        }
        
        // Search query
        if (this.filters.searchQuery) {
            const query = this.filters.searchQuery.toLowerCase();
            filtered = filtered.filter(l => 
                l.name.toLowerCase().includes(query) ||
                l.email.toLowerCase().includes(query) ||
                l.address.toLowerCase().includes(query) ||
                l.discountCode.toLowerCase().includes(query) ||
                (l.phone && l.phone.toLowerCase().includes(query)) ||
                (l.notes && l.notes.toLowerCase().includes(query))
            );
        }
        
        this.filteredLeads = filtered;
        this.sortLeads();
    }
    
    sortLeads() {
        this.filteredLeads.sort((a, b) => {
            let aVal = a[this.sortColumn];
            let bVal = b[this.sortColumn];
            
            // Handle dates
            if (this.sortColumn === 'timestamp' || this.sortColumn === 'lastModified') {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            }
            
            // Handle strings
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            
            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }
    
    setSortColumn(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.sortLeads();
        this.renderTable();
    }
    
    // ==================== ANALYTICS ====================
    
    getMetrics() {
        const now = new Date();
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
        
        const leadsThisWeek = this.leads.filter(l => new Date(l.timestamp) >= weekAgo).length;
        const leadsThisMonth = this.leads.filter(l => new Date(l.timestamp) >= monthAgo).length;
        const convertedLeads = this.leads.filter(l => l.status === 'converted').length;
        const conversionRate = this.leads.length > 0 
            ? ((convertedLeads / this.leads.length) * 100).toFixed(1)
            : 0;
        
        const projectTypes = {};
        this.leads.forEach(l => {
            const type = l.project || 'Not specified';
            projectTypes[type] = (projectTypes[type] || 0) + 1;
        });
        
        const codesUsed = this.leads.filter(l => l.used).length;
        const codesUnused = this.leads.filter(l => !l.used && new Date(l.codeExpiry) >= now).length;
        
        return {
            totalLeads: this.leads.length,
            leadsThisWeek,
            leadsThisMonth,
            convertedLeads,
            conversionRate,
            projectTypes,
            codesUsed,
            codesUnused,
            filteredCount: this.filteredLeads.length
        };
    }
    
    getLeadsByDate() {
        const leadsByDate = {};
        this.leads.forEach(lead => {
            const date = new Date(lead.timestamp).toLocaleDateString('en-CA');
            leadsByDate[date] = (leadsByDate[date] || 0) + 1;
        });
        
        // Get last 30 days
        const dates = [];
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now - i * 24 * 60 * 60 * 1000);
            const dateStr = date.toLocaleDateString('en-CA');
            dates.push({
                date: dateStr,
                count: leadsByDate[dateStr] || 0
            });
        }
        
        return dates;
    }
    
    // ==================== EXPORT ====================
    
    exportToCSV() {
        const headers = ['Date', 'Name', 'Email', 'Phone', 'Address', 'Project', 'Discount Code', 'Status', 'Used', 'Expiry', 'Notes'];
        const rows = this.filteredLeads.map(lead => [
            new Date(lead.timestamp).toLocaleString(),
            lead.name,
            lead.email,
            lead.phone || '',
            lead.address,
            lead.project || 'Not specified',
            lead.discountCode,
            lead.status,
            lead.used ? 'Yes' : 'No',
            new Date(lead.codeExpiry).toLocaleDateString(),
            (lead.notes || '').replace(/"/g, '""')
        ]);
        
        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CCC_Leads_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('✅ Exported', this.filteredLeads.length, 'leads to CSV');
    }
    
    printReport() {
        window.print();
    }

    // ==================== UI RENDERING ====================

    render() {
        // Remove existing dashboard
        const existing = document.getElementById('crm-dashboard-overlay');
        if (existing) existing.remove();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'crm-dashboard-overlay';
        overlay.innerHTML = this.getHTML();
        document.body.appendChild(overlay);

        // Add styles
        this.injectStyles();

        // Attach event listeners
        this.attachEventListeners();

        // Initial render
        this.applyFilters();
        this.renderMetrics();
        this.renderTable();
        this.renderCharts();

        console.log('✅ CRM Dashboard rendered');
    }

    getHTML() {
        return `
            <div class="crm-dashboard">
                <div class="crm-header">
                    <div class="crm-header-left">
                        <img src="assets/images/logo.png" alt="CCC" class="crm-logo" onerror="this.style.display='none'">
                        <div>
                            <h1>CRM Dashboard</h1>
                            <p>Capital City Contractors Lead Management</p>
                        </div>
                    </div>
                    <div class="crm-header-right">
                        <button class="crm-btn crm-btn-secondary" onclick="window.crmDashboard.exportToCSV()">
                            <span>📊</span> Export CSV
                        </button>
                        <button class="crm-btn crm-btn-secondary" onclick="window.crmDashboard.printReport()">
                            <span>🖨️</span> Print
                        </button>
                        <button class="crm-btn crm-btn-danger" onclick="window.crmDashboard.close()">
                            <span>✕</span> Close
                        </button>
                    </div>
                </div>

                <div class="crm-metrics" id="crm-metrics"></div>

                <div class="crm-filters">
                    <div class="crm-filter-group">
                        <label>Status:</label>
                        <select id="filter-status" class="crm-select">
                            <option value="all">All Status</option>
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="converted">Converted</option>
                            <option value="lost">Lost</option>
                        </select>
                    </div>

                    <div class="crm-filter-group">
                        <label>Project:</label>
                        <select id="filter-project" class="crm-select">
                            <option value="all">All Projects</option>
                            <option value="interior-painting">Interior Painting</option>
                            <option value="exterior-painting">Exterior Painting</option>
                            <option value="drywall-installation-repair">Drywall</option>
                            <option value="kitchen-renovation">Kitchen Renovation</option>
                            <option value="basement-renovation">Basement Renovation</option>
                            <option value="bathroom-renovation">Bathroom Renovation</option>
                        </select>
                    </div>

                    <div class="crm-filter-group">
                        <label>Date:</label>
                        <select id="filter-date" class="crm-select">
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                            <option value="3months">Last 3 Months</option>
                        </select>
                    </div>

                    <div class="crm-filter-group">
                        <label>Code Status:</label>
                        <select id="filter-code" class="crm-select">
                            <option value="all">All Codes</option>
                            <option value="unused">Unused</option>
                            <option value="used">Used</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>

                    <div class="crm-filter-group crm-search-group">
                        <label>Search:</label>
                        <input type="text" id="filter-search" class="crm-input" placeholder="Name, email, address, code...">
                    </div>

                    <button class="crm-btn crm-btn-secondary" onclick="window.crmDashboard.resetFilters()">
                        Reset Filters
                    </button>
                </div>

                <div class="crm-bulk-actions">
                    <button class="crm-btn crm-btn-sm" onclick="window.crmDashboard.selectAll()">Select All</button>
                    <button class="crm-btn crm-btn-sm" onclick="window.crmDashboard.deselectAll()">Deselect All</button>
                    <button class="crm-btn crm-btn-danger crm-btn-sm" onclick="window.crmDashboard.deleteSelectedLeads()">
                        Delete Selected (<span id="selected-count">0</span>)
                    </button>
                </div>

                <div class="crm-table-container" id="crm-table-container"></div>

                <div class="crm-charts">
                    <div class="crm-chart-container">
                        <h3>Leads by Project Type</h3>
                        <canvas id="chart-projects" width="400" height="300"></canvas>
                    </div>
                    <div class="crm-chart-container">
                        <h3>Leads Over Time (Last 30 Days)</h3>
                        <canvas id="chart-timeline" width="400" height="300"></canvas>
                    </div>
                </div>
            </div>
        `;
    }

    renderMetrics() {
        const metrics = this.getMetrics();
        const container = document.getElementById('crm-metrics');

        container.innerHTML = `
            <div class="crm-metric-card">
                <div class="crm-metric-icon">📊</div>
                <div class="crm-metric-content">
                    <div class="crm-metric-value">${metrics.totalLeads}</div>
                    <div class="crm-metric-label">Total Leads</div>
                </div>
            </div>

            <div class="crm-metric-card">
                <div class="crm-metric-icon">📅</div>
                <div class="crm-metric-content">
                    <div class="crm-metric-value">${metrics.leadsThisWeek}</div>
                    <div class="crm-metric-label">This Week</div>
                </div>
            </div>

            <div class="crm-metric-card">
                <div class="crm-metric-icon">📈</div>
                <div class="crm-metric-content">
                    <div class="crm-metric-value">${metrics.conversionRate}%</div>
                    <div class="crm-metric-label">Conversion Rate</div>
                </div>
            </div>

            <div class="crm-metric-card">
                <div class="crm-metric-icon">✅</div>
                <div class="crm-metric-content">
                    <div class="crm-metric-value">${metrics.convertedLeads}</div>
                    <div class="crm-metric-label">Converted</div>
                </div>
            </div>

            <div class="crm-metric-card">
                <div class="crm-metric-icon">🎟️</div>
                <div class="crm-metric-content">
                    <div class="crm-metric-value">${metrics.codesUsed}/${metrics.codesUsed + metrics.codesUnused}</div>
                    <div class="crm-metric-label">Codes Used</div>
                </div>
            </div>

            <div class="crm-metric-card">
                <div class="crm-metric-icon">🔍</div>
                <div class="crm-metric-content">
                    <div class="crm-metric-value">${metrics.filteredCount}</div>
                    <div class="crm-metric-label">Filtered Results</div>
                </div>
            </div>
        `;
    }

    renderTable() {
        const container = document.getElementById('crm-table-container');

        if (this.filteredLeads.length === 0) {
            container.innerHTML = `
                <div class="crm-empty-state">
                    <div class="crm-empty-icon">📭</div>
                    <h3>No leads found</h3>
                    <p>Try adjusting your filters or search query</p>
                </div>
            `;
            return;
        }

        const getSortIcon = (column) => {
            if (this.sortColumn !== column) return '⇅';
            return this.sortDirection === 'asc' ? '↑' : '↓';
        };

        const getStatusBadge = (status) => {
            const badges = {
                'new': '<span class="crm-badge crm-badge-new">New</span>',
                'contacted': '<span class="crm-badge crm-badge-contacted">Contacted</span>',
                'qualified': '<span class="crm-badge crm-badge-qualified">Qualified</span>',
                'converted': '<span class="crm-badge crm-badge-converted">Converted</span>',
                'lost': '<span class="crm-badge crm-badge-lost">Lost</span>'
            };
            return badges[status] || badges['new'];
        };

        const rows = this.filteredLeads.map(lead => {
            const isExpired = new Date(lead.codeExpiry) < new Date();
            const isChecked = this.selectedLeads.has(lead.discountCode);

            return `
                <tr class="crm-table-row" data-code="${lead.discountCode}">
                    <td>
                        <input type="checkbox" class="crm-checkbox"
                               ${isChecked ? 'checked' : ''}
                               onchange="window.crmDashboard.toggleSelect('${lead.discountCode}')">
                    </td>
                    <td>${new Date(lead.timestamp).toLocaleDateString()}</td>
                    <td><strong>${lead.name}</strong></td>
                    <td>${lead.email}</td>
                    <td>${lead.phone || '-'}</td>
                    <td>${lead.project || 'Not specified'}</td>
                    <td><code>${lead.discountCode}</code></td>
                    <td>
                        <select class="crm-status-select" onchange="window.crmDashboard.updateStatus('${lead.discountCode}', this.value)">
                            <option value="new" ${lead.status === 'new' ? 'selected' : ''}>New</option>
                            <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                            <option value="qualified" ${lead.status === 'qualified' ? 'selected' : ''}>Qualified</option>
                            <option value="converted" ${lead.status === 'converted' ? 'selected' : ''}>Converted</option>
                            <option value="lost" ${lead.status === 'lost' ? 'selected' : ''}>Lost</option>
                        </select>
                    </td>
                    <td>
                        <button class="crm-btn-icon" onclick="window.crmDashboard.toggleRow('${lead.discountCode}')" title="View Details">
                            👁️
                        </button>
                        <button class="crm-btn-icon" onclick="window.crmDashboard.editNotes('${lead.discountCode}')" title="Edit Notes">
                            📝
                        </button>
                        <button class="crm-btn-icon" onclick="window.crmDashboard.deleteLead('${lead.discountCode}')" title="Delete">
                            🗑️
                        </button>
                    </td>
                </tr>
                <tr class="crm-details-row" id="details-${lead.discountCode}" style="display: none;">
                    <td colspan="9">
                        <div class="crm-details-content">
                            <div class="crm-details-grid">
                                <div class="crm-detail-item">
                                    <strong>Address:</strong>
                                    <span>${lead.address}</span>
                                </div>
                                <div class="crm-detail-item">
                                    <strong>Code Expiry:</strong>
                                    <span>${new Date(lead.codeExpiry).toLocaleDateString()} ${isExpired ? '(Expired)' : ''}</span>
                                </div>
                                <div class="crm-detail-item">
                                    <strong>Code Used:</strong>
                                    <span>${lead.used ? 'Yes' : 'No'}</span>
                                </div>
                                <div class="crm-detail-item">
                                    <strong>Last Modified:</strong>
                                    <span>${new Date(lead.lastModified).toLocaleString()}</span>
                                </div>
                            </div>
                            <div class="crm-notes-section">
                                <strong>Notes:</strong>
                                <p>${lead.notes || '<em>No notes</em>'}</p>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        container.innerHTML = `
            <table class="crm-table">
                <thead>
                    <tr>
                        <th style="width: 40px;"></th>
                        <th onclick="window.crmDashboard.setSortColumn('timestamp')" style="cursor: pointer;">
                            Date ${getSortIcon('timestamp')}
                        </th>
                        <th onclick="window.crmDashboard.setSortColumn('name')" style="cursor: pointer;">
                            Name ${getSortIcon('name')}
                        </th>
                        <th onclick="window.crmDashboard.setSortColumn('email')" style="cursor: pointer;">
                            Email ${getSortIcon('email')}
                        </th>
                        <th>Phone</th>
                        <th onclick="window.crmDashboard.setSortColumn('project')" style="cursor: pointer;">
                            Project ${getSortIcon('project')}
                        </th>
                        <th>Code</th>
                        <th onclick="window.crmDashboard.setSortColumn('status')" style="cursor: pointer;">
                            Status ${getSortIcon('status')}
                        </th>
                        <th style="width: 120px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    }

    toggleRow(discountCode) {
        const row = document.getElementById(`details-${discountCode}`);
        if (row) {
            row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
        }
    }

    updateStatus(discountCode, newStatus) {
        const updates = { status: newStatus };

        if (newStatus === 'contacted' && !this.leads.find(l => l.discountCode === discountCode).contactedDate) {
            updates.contactedDate = new Date().toISOString();
        }

        if (newStatus === 'converted' && !this.leads.find(l => l.discountCode === discountCode).convertedDate) {
            updates.convertedDate = new Date().toISOString();
        }

        this.updateLead(discountCode, updates);
        this.applyFilters();
        this.renderMetrics();
        this.renderTable();

        console.log(`✅ Updated lead ${discountCode} status to ${newStatus}`);
    }

    editNotes(discountCode) {
        const lead = this.leads.find(l => l.discountCode === discountCode);
        if (!lead) return;

        const notes = prompt('Edit notes for ' + lead.name + ':', lead.notes || '');
        if (notes !== null) {
            this.updateLead(discountCode, { notes });
            this.renderTable();
            console.log(`✅ Updated notes for ${discountCode}`);
        }
    }

    toggleSelect(discountCode) {
        if (this.selectedLeads.has(discountCode)) {
            this.selectedLeads.delete(discountCode);
        } else {
            this.selectedLeads.add(discountCode);
        }
        this.updateSelectedCount();
    }

    selectAll() {
        this.filteredLeads.forEach(lead => this.selectedLeads.add(lead.discountCode));
        this.renderTable();
        this.updateSelectedCount();
    }

    deselectAll() {
        this.selectedLeads.clear();
        this.renderTable();
        this.updateSelectedCount();
    }

    updateSelectedCount() {
        const countEl = document.getElementById('selected-count');
        if (countEl) countEl.textContent = this.selectedLeads.size;
    }

    // ==================== CHARTS ====================

    renderCharts() {
        this.renderProjectsChart();
        this.renderTimelineChart();
    }

    renderProjectsChart() {
        const canvas = document.getElementById('chart-projects');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const metrics = this.getMetrics();
        const projectTypes = metrics.projectTypes;

        // Prepare data
        const labels = Object.keys(projectTypes);
        const values = Object.values(projectTypes);
        const maxValue = Math.max(...values, 1);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw bar chart
        const barWidth = canvas.width / labels.length - 20;
        const chartHeight = canvas.height - 60;

        labels.forEach((label, index) => {
            const value = values[index];
            const barHeight = (value / maxValue) * chartHeight;
            const x = index * (barWidth + 20) + 10;
            const y = canvas.height - barHeight - 40;

            // Draw bar
            ctx.fillStyle = '#1e40af';
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw value
            ctx.fillStyle = '#1e293b';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + barWidth / 2, y - 5);

            // Draw label
            ctx.save();
            ctx.translate(x + barWidth / 2, canvas.height - 10);
            ctx.rotate(-Math.PI / 4);
            ctx.textAlign = 'right';
            ctx.fillText(label.substring(0, 15), 0, 0);
            ctx.restore();
        });
    }

    renderTimelineChart() {
        const canvas = document.getElementById('chart-timeline');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.getLeadsByDate();

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const maxValue = Math.max(...data.map(d => d.count), 1);
        const chartHeight = canvas.height - 60;
        const chartWidth = canvas.width - 40;
        const pointSpacing = chartWidth / (data.length - 1);

        // Draw axes
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, 10);
        ctx.lineTo(30, canvas.height - 40);
        ctx.lineTo(canvas.width - 10, canvas.height - 40);
        ctx.stroke();

        // Draw line
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((point, index) => {
            const x = 30 + index * pointSpacing;
            const y = canvas.height - 40 - (point.count / maxValue) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            // Draw point
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.stroke();

        // Draw labels (every 5 days)
        ctx.fillStyle = '#64748b';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        data.forEach((point, index) => {
            if (index % 5 === 0) {
                const x = 30 + index * pointSpacing;
                const date = new Date(point.date);
                ctx.fillText(`${date.getMonth() + 1}/${date.getDate()}`, x, canvas.height - 25);
            }
        });
    }

    // ==================== EVENT HANDLERS ====================

    attachEventListeners() {
        // Filter listeners
        document.getElementById('filter-status').addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.applyFilters();
            this.renderMetrics();
            this.renderTable();
        });

        document.getElementById('filter-project').addEventListener('change', (e) => {
            this.filters.projectType = e.target.value;
            this.applyFilters();
            this.renderMetrics();
            this.renderTable();
        });

        document.getElementById('filter-date').addEventListener('change', (e) => {
            this.filters.dateRange = e.target.value;
            this.applyFilters();
            this.renderMetrics();
            this.renderTable();
        });

        document.getElementById('filter-code').addEventListener('change', (e) => {
            this.filters.codeStatus = e.target.value;
            this.applyFilters();
            this.renderMetrics();
            this.renderTable();
        });

        document.getElementById('filter-search').addEventListener('input', (e) => {
            this.filters.searchQuery = e.target.value;
            this.applyFilters();
            this.renderMetrics();
            this.renderTable();
        });
    }

    resetFilters() {
        this.filters = {
            status: 'all',
            projectType: 'all',
            dateRange: 'all',
            codeStatus: 'all',
            searchQuery: ''
        };

        document.getElementById('filter-status').value = 'all';
        document.getElementById('filter-project').value = 'all';
        document.getElementById('filter-date').value = 'all';
        document.getElementById('filter-code').value = 'all';
        document.getElementById('filter-search').value = '';

        this.applyFilters();
        this.renderMetrics();
        this.renderTable();
    }

    close() {
        const overlay = document.getElementById('crm-dashboard-overlay');
        if (overlay) overlay.remove();
        console.log('✅ CRM Dashboard closed');
    }

    // ==================== STYLES ====================

    injectStyles() {
        if (document.getElementById('crm-dashboard-styles')) return;

        const style = document.createElement('style');
        style.id = 'crm-dashboard-styles';
        style.textContent = `
            #crm-dashboard-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 999999;
                overflow-y: auto;
                padding: 20px;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .crm-dashboard {
                max-width: 1400px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                overflow: hidden;
            }

            .crm-header {
                background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
                color: white;
                padding: 24px 32px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .crm-header-left {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .crm-logo {
                width: 50px;
                height: 50px;
                border-radius: 8px;
                background: white;
                padding: 4px;
            }

            .crm-header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
            }

            .crm-header p {
                margin: 4px 0 0 0;
                opacity: 0.9;
                font-size: 14px;
            }

            .crm-header-right {
                display: flex;
                gap: 12px;
            }

            .crm-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }

            .crm-btn-secondary {
                background: rgba(255, 255, 255, 0.2);
                color: white;
            }

            .crm-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .crm-btn-danger {
                background: #dc2626;
                color: white;
            }

            .crm-btn-danger:hover {
                background: #b91c1c;
            }

            .crm-btn-sm {
                padding: 6px 12px;
                font-size: 12px;
            }

            .crm-metrics {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
                padding: 24px 32px;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
            }

            .crm-metric-card {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .crm-metric-icon {
                font-size: 32px;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #eff6ff;
                border-radius: 8px;
            }

            .crm-metric-value {
                font-size: 28px;
                font-weight: 700;
                color: #1e293b;
            }

            .crm-metric-label {
                font-size: 13px;
                color: #64748b;
                margin-top: 4px;
            }

            .crm-filters {
                padding: 20px 32px;
                background: white;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                flex-wrap: wrap;
                gap: 16px;
                align-items: flex-end;
            }

            .crm-filter-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .crm-filter-group label {
                font-size: 12px;
                font-weight: 600;
                color: #475569;
                text-transform: uppercase;
            }

            .crm-select, .crm-input {
                padding: 8px 12px;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                font-size: 14px;
                min-width: 150px;
            }

            .crm-search-group {
                flex: 1;
                min-width: 250px;
            }

            .crm-bulk-actions {
                padding: 12px 32px;
                background: #f1f5f9;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                gap: 12px;
            }

            .crm-table-container {
                padding: 24px 32px;
                overflow-x: auto;
            }

            .crm-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
            }

            .crm-table thead {
                background: #f8fafc;
                border-bottom: 2px solid #e2e8f0;
            }

            .crm-table th {
                padding: 12px;
                text-align: left;
                font-weight: 600;
                color: #475569;
                white-space: nowrap;
            }

            .crm-table td {
                padding: 12px;
                border-bottom: 1px solid #f1f5f9;
            }

            .crm-table-row:hover {
                background: #f8fafc;
            }

            .crm-details-row {
                background: #fefce8 !important;
            }

            .crm-details-content {
                padding: 16px;
            }

            .crm-details-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 16px;
                margin-bottom: 16px;
            }

            .crm-detail-item {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .crm-detail-item strong {
                color: #64748b;
                font-size: 12px;
            }

            .crm-notes-section {
                padding: 12px;
                background: white;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
            }

            .crm-notes-section strong {
                display: block;
                margin-bottom: 8px;
                color: #475569;
            }

            .crm-status-select {
                padding: 4px 8px;
                border: 1px solid #cbd5e1;
                border-radius: 4px;
                font-size: 13px;
            }

            .crm-btn-icon {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 4px;
                opacity: 0.7;
                transition: opacity 0.2s;
            }

            .crm-btn-icon:hover {
                opacity: 1;
            }

            .crm-checkbox {
                width: 18px;
                height: 18px;
                cursor: pointer;
            }

            .crm-empty-state {
                text-align: center;
                padding: 60px 20px;
                color: #64748b;
            }

            .crm-empty-icon {
                font-size: 64px;
                margin-bottom: 16px;
            }

            .crm-charts {
                padding: 24px 32px;
                background: #f8fafc;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 24px;
            }

            .crm-chart-container {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }

            .crm-chart-container h3 {
                margin: 0 0 16px 0;
                font-size: 16px;
                color: #1e293b;
            }

            @media print {
                #crm-dashboard-overlay {
                    position: static;
                    background: white;
                    padding: 0;
                }

                .crm-header-right,
                .crm-filters,
                .crm-bulk-actions,
                .crm-btn-icon,
                .crm-checkbox {
                    display: none !important;
                }

                .crm-dashboard {
                    box-shadow: none;
                }
            }

            @media (max-width: 768px) {
                .crm-header {
                    flex-direction: column;
                    gap: 16px;
                }

                .crm-metrics {
                    grid-template-columns: 1fr;
                }

                .crm-filters {
                    flex-direction: column;
                }

                .crm-charts {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// ==================== GLOBAL INITIALIZATION ====================

// Initialize and expose globally
window.showCRM = function() {
    if (!window.crmDashboard) {
        window.crmDashboard = new CRMDashboard();
    }
    window.crmDashboard.render();
};

// Legacy support
window.showCRMDashboard = window.showCRM;

console.log('✅ CRM Dashboard v2.0 loaded. Type showCRM() to open.');


