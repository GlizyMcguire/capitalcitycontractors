// API Client for CRM Backend
class CRMAPIClient {
    constructor(baseURL) {
        this.baseURL = baseURL || 'http://localhost:3000/api';
        this.token = localStorage.getItem('crm_api_token');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('crm_api_token', token);
    }

    // Clear authentication token
    clearToken() {
        this.token = null;
        localStorage.removeItem('crm_api_token');
    }

    // Make API request
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.clearToken();
                    throw new Error('Authentication required');
                }
                const error = await response.json();
                throw new Error(error.error || 'Request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication
    async login(username, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        this.setToken(response.token);
        return response;
    }

    // Contacts
    async getContacts() {
        return await this.request('/contacts');
    }

    async createContact(contact) {
        return await this.request('/contacts', {
            method: 'POST',
            body: JSON.stringify(contact)
        });
    }

    async updateContact(id, contact) {
        return await this.request(`/contacts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(contact)
        });
    }

    async deleteContact(id) {
        return await this.request(`/contacts/${id}`, {
            method: 'DELETE'
        });
    }

    // Leads
    async getLeads() {
        return await this.request('/leads');
    }

    async createLead(lead) {
        return await this.request('/leads', {
            method: 'POST',
            body: JSON.stringify(lead)
        });
    }

    async updateLead(id, lead) {
        return await this.request(`/leads/${id}`, {
            method: 'PUT',
            body: JSON.stringify(lead)
        });
    }

    async deleteLead(id) {
        return await this.request(`/leads/${id}`, {
            method: 'DELETE'
        });
    }

    // Projects
    async getProjects() {
        return await this.request('/projects');
    }

    async createProject(project) {
        return await this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(project)
        });
    }

    // Tasks
    async getTasks() {
        return await this.request('/tasks');
    }

    async createTask(task) {
        return await this.request('/tasks', {
            method: 'POST',
            body: JSON.stringify(task)
        });
    }

    async updateTask(id, task) {
        return await this.request(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(task)
        });
    }

    // Campaigns
    async getCampaigns() {
        return await this.request('/campaigns');
    }

    // Submissions
    async getSubmissions() {
        return await this.request('/submissions');
    }

    // Health check
    async healthCheck() {
        return await this.request('/health');
    }

    // Sync all data
    async syncData(data) {
        return await this.request('/sync', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Analytics
    async getAnalyticsSummary({ range = '30d', start, end } = {}) {
        const params = new URLSearchParams();
        if (range) params.set('range', range);
        if (start) params.set('start', start);
        if (end) params.set('end', end);
        return await this.request(`/analytics/summary?${params.toString()}`);
    }

    // Public visit tracking (no auth)
    async trackVisit(payload) {
        // Use fetch directly to avoid requiring auth token
        const url = `${this.baseURL}/visits/track`;
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            return await res.json();
        } catch (e) {
            if (process.env && process.env.NODE_ENV !== 'production') {
                console.warn('trackVisit failed', e);
            }
            return { success: false, error: e?.message };
        }
    }
}

// Export for use in CRM
window.CRMAPIClient = CRMAPIClient;

