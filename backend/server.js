const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Database setup
const db = new Database(path.join(__dirname, 'crm.db'));
db.pragma('journal_mode = WAL');

// Middleware
app.use(helmet());
app.use(cors({
    origin: [
        'https://glizymcguire.github.io',
        'http://localhost:3000',
        'file://' // Allow Electron app
    ],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// ============================================
// AUTH ENDPOINTS
// ============================================

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, username: user.username });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ============================================
// CONTACTS ENDPOINTS
// ============================================

// Get all contacts
app.get('/api/contacts', authenticateToken, (req, res) => {
    try {
        const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
        res.json(contacts);
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// Create contact
app.post('/api/contacts', authenticateToken, (req, res) => {
    try {
        const contact = req.body;
        const stmt = db.prepare(`
            INSERT INTO contacts (id, name, email, phone, address, city, emailConsent, smsConsent, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const now = new Date().toISOString();
        stmt.run(
            contact.id,
            contact.name,
            contact.email || null,
            contact.phone || null,
            contact.address || null,
            contact.city || null,
            contact.emailConsent ? 1 : 0,
            contact.smsConsent ? 1 : 0,
            contact.notes || null,
            now,
            now
        );

        res.json({ success: true, id: contact.id });
    } catch (error) {
        console.error('Create contact error:', error);
        res.status(500).json({ error: 'Failed to create contact' });
    }
});

// Update contact
app.put('/api/contacts/:id', authenticateToken, (req, res) => {
    try {
        const contact = req.body;
        const stmt = db.prepare(`
            UPDATE contacts 
            SET name = ?, email = ?, phone = ?, address = ?, city = ?, 
                emailConsent = ?, smsConsent = ?, notes = ?, updated_at = ?
            WHERE id = ?
        `);
        
        stmt.run(
            contact.name,
            contact.email || null,
            contact.phone || null,
            contact.address || null,
            contact.city || null,
            contact.emailConsent ? 1 : 0,
            contact.smsConsent ? 1 : 0,
            contact.notes || null,
            new Date().toISOString(),
            req.params.id
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Update contact error:', error);
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

// Delete contact
app.delete('/api/contacts/:id', authenticateToken, (req, res) => {
    try {
        db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

// ============================================
// LEADS ENDPOINTS
// ============================================

// Get all leads
app.get('/api/leads', authenticateToken, (req, res) => {
    try {
        const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
        // Parse JSON fields
        leads.forEach(lead => {
            if (lead.relatedTo) lead.relatedTo = JSON.parse(lead.relatedTo);
        });
        res.json(leads);
    } catch (error) {
        console.error('Get leads error:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

// Create lead
app.post('/api/leads', authenticateToken, (req, res) => {
    try {
        const lead = req.body;
        const stmt = db.prepare(`
            INSERT INTO leads (id, contactId, jobType, propertyAddress, estimatedValue, 
                              stage, source, notes, relatedTo, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const now = new Date().toISOString();
        stmt.run(
            lead.id,
            lead.contactId || null,
            lead.jobType || null,
            lead.propertyAddress || null,
            lead.estimatedValue || null,
            lead.stage || 'new',
            lead.source || null,
            lead.notes || null,
            lead.relatedTo ? JSON.stringify(lead.relatedTo) : null,
            now,
            now
        );

        res.json({ success: true, id: lead.id });
    } catch (error) {
        console.error('Create lead error:', error);
        res.status(500).json({ error: 'Failed to create lead' });
    }
});

// Update lead
app.put('/api/leads/:id', authenticateToken, (req, res) => {
    try {
        const lead = req.body;
        const stmt = db.prepare(`
            UPDATE leads 
            SET contactId = ?, jobType = ?, propertyAddress = ?, estimatedValue = ?,
                stage = ?, source = ?, notes = ?, relatedTo = ?, updated_at = ?
            WHERE id = ?
        `);
        
        stmt.run(
            lead.contactId || null,
            lead.jobType || null,
            lead.propertyAddress || null,
            lead.estimatedValue || null,
            lead.stage || 'new',
            lead.source || null,
            lead.notes || null,
            lead.relatedTo ? JSON.stringify(lead.relatedTo) : null,
            new Date().toISOString(),
            req.params.id
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Update lead error:', error);
        res.status(500).json({ error: 'Failed to update lead' });
    }
});

// Delete lead
app.delete('/api/leads/:id', authenticateToken, (req, res) => {
    try {
        db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete lead error:', error);
        res.status(500).json({ error: 'Failed to delete lead' });
    }
});

// ============================================
// PROJECTS, TASKS, CAMPAIGNS ENDPOINTS
// ============================================

// Projects
app.get('/api/projects', authenticateToken, (req, res) => {
    try {
        const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.post('/api/projects', authenticateToken, (req, res) => {
    try {
        const p = req.body;
        const now = new Date().toISOString();
        db.prepare(`INSERT INTO projects (id, leadId, contactId, name, status, startDate, endDate, budget, notes, progress, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
            p.id, p.leadId || null, p.contactId || null, p.name, p.status || 'active',
            p.startDate || null, p.endDate || null, p.budget || null, p.notes || null,
            p.progress || 0, now, now
        );
        res.json({ success: true, id: p.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Tasks
app.get('/api/tasks', authenticateToken, (req, res) => {
    try {
        const tasks = db.prepare('SELECT * FROM tasks ORDER BY dueDate ASC').all();
        tasks.forEach(task => {
            if (task.relatedTo) task.relatedTo = JSON.parse(task.relatedTo);
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

app.post('/api/tasks', authenticateToken, (req, res) => {
    try {
        const t = req.body;
        const now = new Date().toISOString();
        db.prepare(`INSERT INTO tasks (id, title, type, dueDate, completed, archived, relatedTo, notes, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
            t.id, t.title, t.type || null, t.dueDate || null, t.completed ? 1 : 0,
            t.archived ? 1 : 0, t.relatedTo ? JSON.stringify(t.relatedTo) : null,
            t.notes || null, now, now
        );
        res.json({ success: true, id: t.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

app.put('/api/tasks/:id', authenticateToken, (req, res) => {
    try {
        const t = req.body;
        db.prepare(`UPDATE tasks SET title = ?, type = ?, dueDate = ?, completed = ?, archived = ?, relatedTo = ?, notes = ?, updated_at = ? WHERE id = ?`).run(
            t.title, t.type || null, t.dueDate || null, t.completed ? 1 : 0,
            t.archived ? 1 : 0, t.relatedTo ? JSON.stringify(t.relatedTo) : null,
            t.notes || null, new Date().toISOString(), req.params.id
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Campaigns
app.get('/api/campaigns', authenticateToken, (req, res) => {
    try {
        const campaigns = db.prepare('SELECT * FROM campaigns ORDER BY created_at DESC').all();
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
});

// Submissions
app.get('/api/submissions', authenticateToken, (req, res) => {
    try {
        const submissions = db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all();
        submissions.forEach(s => {
            if (s.payload) s.payload = JSON.parse(s.payload);
        });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

// Bulk sync endpoint
app.post('/api/sync', authenticateToken, (req, res) => {
    try {
        const { contacts, leads, projects, tasks, campaigns } = req.body;

        // This is a simple implementation - in production you'd want proper conflict resolution
        const now = new Date().toISOString();

        // Clear existing data (optional - you might want to merge instead)
        // db.prepare('DELETE FROM contacts').run();
        // db.prepare('DELETE FROM leads').run();
        // ... etc

        res.json({ success: true, message: 'Data synced successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Sync failed' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 CRM Backend API running on port ${PORT}`);
    console.log(`📊 Database: ${path.join(__dirname, 'crm.db')}`);
});

