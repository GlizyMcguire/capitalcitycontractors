const crypto = require('crypto');
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

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'crm.db');
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_ISSUER = process.env.JWT_ISSUER || 'capitalcitycontractors-crm';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'capitalcitycontractors-crm-users';
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '12h';
const VISIT_IP_HASH_SALT = process.env.VISIT_IP_HASH_SALT || JWT_SECRET;

function envInt(name, fallback) {
    const value = Number.parseInt(process.env[name] || '', 10);
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

function hasStrongSecret(value) {
    return typeof value === 'string'
        && value.length >= 32
        && value !== 'your-secret-key-change-this'
        && !value.toLowerCase().includes('change-this');
}

function buildAllowedOrigins() {
    const productionDefaults = [
        'https://capitalcitycontractors.ca',
        'https://www.capitalcitycontractors.ca',
        'https://glizymcguire.github.io'
    ];
    const developmentDefaults = [
        ...productionDefaults,
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:8080',
        'http://127.0.0.1:8080'
    ];

    const rawOrigins = process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
        : (isProduction ? productionDefaults : developmentDefaults);

    return new Set(rawOrigins);
}

function clampString(value, maxLength) {
    if (typeof value !== 'string') {
        return null;
    }

    const normalized = value.trim();
    if (!normalized) {
        return null;
    }

    return normalized.slice(0, maxLength);
}

function normalizePage(value) {
    const normalized = clampString(value, 2048);
    if (!normalized) {
        return null;
    }

    if (normalized.startsWith('/')) {
        return normalized;
    }

    if (/^https?:\/\//i.test(normalized)) {
        try {
            return new URL(normalized).pathname || '/';
        } catch (_) {
            return null;
        }
    }

    return null;
}

function safeParseJSON(value) {
    if (!value) {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch (_) {
        return null;
    }
}

function hashIpAddress(value) {
    if (!value || !VISIT_IP_HASH_SALT) {
        return null;
    }

    const ip = value.split(',')[0].trim();
    if (!ip) {
        return null;
    }

    return crypto.createHmac('sha256', VISIT_IP_HASH_SALT).update(ip).digest('hex');
}

function ensureSecureConfiguration() {
    if (!Number.isFinite(PORT) || PORT <= 0) {
        throw new Error('PORT must be a positive integer');
    }

    if (isProduction && !hasStrongSecret(JWT_SECRET)) {
        throw new Error('JWT_SECRET must be set to a strong random value of at least 32 characters');
    }

    if (isProduction && !hasStrongSecret(VISIT_IP_HASH_SALT)) {
        throw new Error('VISIT_IP_HASH_SALT must be set to a strong random value of at least 32 characters');
    }

    if (!isProduction && !hasStrongSecret(JWT_SECRET)) {
        console.warn('Security warning: JWT_SECRET is weak or missing. Set a strong secret before deploying.');
    }
}

ensureSecureConfiguration();

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');

const allowedOrigins = buildAllowedOrigins();

app.disable('x-powered-by');
if (isProduction || process.env.TRUST_PROXY === '1') {
    app.set('trust proxy', 1);
}

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

app.use(cors({
    origin(origin, callback) {
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.has(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Origin not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400
}));

app.use(express.json({
    limit: process.env.JSON_BODY_LIMIT || '100kb',
    strict: true
}));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: envInt('API_RATE_LIMIT_MAX', 100),
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: (req) => req.originalUrl === '/api/health' || req.path === '/health',
    handler: (_req, res) => {
        res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: envInt('LOGIN_RATE_LIMIT_MAX', 5),
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (_req, res) => {
        res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
    }
});

const visitLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: envInt('VISIT_RATE_LIMIT_MAX', 120),
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(429).json({ error: 'Too many tracking requests. Please try again later.' });
    }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', loginLimiter);
app.use('/api/visits/track', visitLimiter);

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length)
        : null;

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const user = jwt.verify(token, JWT_SECRET, {
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE
        });
        req.user = user;
        next();
    } catch (_) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

app.post('/api/auth/login', async (req, res) => {
    try {
        const username = clampString(req.body?.username, 64);
        const password = typeof req.body?.password === 'string' ? req.body.password : '';

        if (!username || !password || password.length > 256) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

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
            {
                expiresIn: ACCESS_TOKEN_TTL,
                issuer: JWT_ISSUER,
                audience: JWT_AUDIENCE
            }
        );

        res.json({ token, username: user.username, expiresIn: ACCESS_TOKEN_TTL });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/contacts', authenticateToken, (_req, res) => {
    try {
        const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
        res.json(contacts);
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

app.post('/api/contacts', authenticateToken, (req, res) => {
    try {
        const contact = req.body || {};
        const stmt = db.prepare(`
            INSERT INTO contacts (id, name, email, phone, address, city, emailConsent, smsConsent, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const now = new Date().toISOString();
        stmt.run(
            contact.id,
            clampString(contact.name, 200),
            clampString(contact.email, 320),
            clampString(contact.phone, 50),
            clampString(contact.address, 500),
            clampString(contact.city, 120),
            contact.emailConsent ? 1 : 0,
            contact.smsConsent ? 1 : 0,
            clampString(contact.notes, 5000),
            now,
            now
        );

        res.json({ success: true, id: contact.id });
    } catch (error) {
        console.error('Create contact error:', error);
        res.status(500).json({ error: 'Failed to create contact' });
    }
});

app.put('/api/contacts/:id', authenticateToken, (req, res) => {
    try {
        const contact = req.body || {};
        const stmt = db.prepare(`
            UPDATE contacts
            SET name = ?, email = ?, phone = ?, address = ?, city = ?,
                emailConsent = ?, smsConsent = ?, notes = ?, updated_at = ?
            WHERE id = ?
        `);

        stmt.run(
            clampString(contact.name, 200),
            clampString(contact.email, 320),
            clampString(contact.phone, 50),
            clampString(contact.address, 500),
            clampString(contact.city, 120),
            contact.emailConsent ? 1 : 0,
            contact.smsConsent ? 1 : 0,
            clampString(contact.notes, 5000),
            new Date().toISOString(),
            req.params.id
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Update contact error:', error);
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

app.delete('/api/contacts/:id', authenticateToken, (req, res) => {
    try {
        db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

app.get('/api/leads', authenticateToken, (_req, res) => {
    try {
        const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
        leads.forEach((lead) => {
            lead.relatedTo = safeParseJSON(lead.relatedTo);
        });
        res.json(leads);
    } catch (error) {
        console.error('Get leads error:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

app.post('/api/leads', authenticateToken, (req, res) => {
    try {
        const lead = req.body || {};
        const stmt = db.prepare(`
            INSERT INTO leads (id, contactId, jobType, propertyAddress, estimatedValue,
                              stage, source, notes, relatedTo, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const now = new Date().toISOString();
        stmt.run(
            lead.id,
            clampString(lead.contactId, 120),
            clampString(lead.jobType, 120),
            clampString(lead.propertyAddress, 500),
            typeof lead.estimatedValue === 'number' ? lead.estimatedValue : null,
            clampString(lead.stage, 50) || 'new',
            clampString(lead.source, 120),
            clampString(lead.notes, 5000),
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

app.put('/api/leads/:id', authenticateToken, (req, res) => {
    try {
        const lead = req.body || {};
        const stmt = db.prepare(`
            UPDATE leads
            SET contactId = ?, jobType = ?, propertyAddress = ?, estimatedValue = ?,
                stage = ?, source = ?, notes = ?, relatedTo = ?, updated_at = ?
            WHERE id = ?
        `);

        stmt.run(
            clampString(lead.contactId, 120),
            clampString(lead.jobType, 120),
            clampString(lead.propertyAddress, 500),
            typeof lead.estimatedValue === 'number' ? lead.estimatedValue : null,
            clampString(lead.stage, 50) || 'new',
            clampString(lead.source, 120),
            clampString(lead.notes, 5000),
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

app.delete('/api/leads/:id', authenticateToken, (req, res) => {
    try {
        db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete lead error:', error);
        res.status(500).json({ error: 'Failed to delete lead' });
    }
});

app.get('/api/projects', authenticateToken, (_req, res) => {
    try {
        const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.post('/api/projects', authenticateToken, (req, res) => {
    try {
        const project = req.body || {};
        const now = new Date().toISOString();
        db.prepare(`
            INSERT INTO projects (id, leadId, contactId, name, status, startDate, endDate, budget, notes, progress, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            project.id,
            clampString(project.leadId, 120),
            clampString(project.contactId, 120),
            clampString(project.name, 200),
            clampString(project.status, 50) || 'active',
            clampString(project.startDate, 50),
            clampString(project.endDate, 50),
            typeof project.budget === 'number' ? project.budget : null,
            clampString(project.notes, 5000),
            Number.isFinite(project.progress) ? project.progress : 0,
            now,
            now
        );
        res.json({ success: true, id: project.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});

app.get('/api/tasks', authenticateToken, (_req, res) => {
    try {
        const tasks = db.prepare('SELECT * FROM tasks ORDER BY dueDate ASC').all();
        tasks.forEach((task) => {
            task.relatedTo = safeParseJSON(task.relatedTo);
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

app.post('/api/tasks', authenticateToken, (req, res) => {
    try {
        const task = req.body || {};
        const now = new Date().toISOString();
        db.prepare(`
            INSERT INTO tasks (id, title, type, dueDate, completed, archived, relatedTo, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            task.id,
            clampString(task.title, 200),
            clampString(task.type, 80),
            clampString(task.dueDate, 50),
            task.completed ? 1 : 0,
            task.archived ? 1 : 0,
            task.relatedTo ? JSON.stringify(task.relatedTo) : null,
            clampString(task.notes, 5000),
            now,
            now
        );
        res.json({ success: true, id: task.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

app.put('/api/tasks/:id', authenticateToken, (req, res) => {
    try {
        const task = req.body || {};
        db.prepare(`
            UPDATE tasks
            SET title = ?, type = ?, dueDate = ?, completed = ?, archived = ?, relatedTo = ?, notes = ?, updated_at = ?
            WHERE id = ?
        `).run(
            clampString(task.title, 200),
            clampString(task.type, 80),
            clampString(task.dueDate, 50),
            task.completed ? 1 : 0,
            task.archived ? 1 : 0,
            task.relatedTo ? JSON.stringify(task.relatedTo) : null,
            clampString(task.notes, 5000),
            new Date().toISOString(),
            req.params.id
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

app.get('/api/campaigns', authenticateToken, (_req, res) => {
    try {
        const campaigns = db.prepare('SELECT * FROM campaigns ORDER BY created_at DESC').all();
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
});

app.get('/api/submissions', authenticateToken, (_req, res) => {
    try {
        const submissions = db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all();
        submissions.forEach((submission) => {
            submission.payload = safeParseJSON(submission.payload);
        });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

app.post('/api/sync', authenticateToken, (_req, res) => {
    try {
        res.json({ success: true, message: 'Data synced successfully (no-op)' });
    } catch (error) {
        res.status(500).json({ error: 'Sync failed' });
    }
});

app.post('/api/visits/track', (req, res) => {
    try {
        const visitorId = clampString(req.body?.visitorId, 128);
        const sessionId = clampString(req.body?.sessionId, 128);
        const page = normalizePage(req.body?.page);

        if (!visitorId || !sessionId || !page) {
            return res.status(400).json({ error: 'Missing required fields: visitorId, sessionId, page' });
        }

        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const userAgent = clampString(req.headers['user-agent'], 512);
        const hashedIp = hashIpAddress(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '');

        const stmt = db.prepare(`
            INSERT INTO visits (
                id, visitorId, sessionId, page, title, referrer,
                utm_source, utm_medium, utm_campaign, utm_term, utm_content,
                userAgent, ip, date, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            clampString(req.body?.id, 160) || `visit_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            visitorId,
            sessionId,
            page,
            clampString(req.body?.title, 300),
            clampString(req.body?.referrer, 2048),
            clampString(req.body?.utm_source, 120),
            clampString(req.body?.utm_medium, 120),
            clampString(req.body?.utm_campaign, 200),
            clampString(req.body?.utm_term, 200),
            clampString(req.body?.utm_content, 200),
            userAgent,
            hashedIp,
            dateStr,
            now.toISOString()
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Track visit error:', error);
        res.status(500).json({ error: 'Failed to record visit' });
    }
});

app.get('/api/analytics/summary', authenticateToken, (req, res) => {
    try {
        const range = (req.query.range || '30d').toLowerCase();
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const sinceDate = range === '7d'
            ? sevenDaysAgo
            : (range === '30d' ? thirtyDaysAgo : clampString(req.query.start, 20) || '0000-01-01');
        const untilDate = clampString(req.query.end, 20) || today;

        const dailyStatsRows = db.prepare(`
            SELECT date, COUNT(*) as pageViews, COUNT(DISTINCT visitorId) as uniqueVisitors
            FROM visits
            WHERE date BETWEEN ? AND ?
            GROUP BY date
            ORDER BY date ASC
        `).all(sinceDate, untilDate);

        const dailyStats = dailyStatsRows.map((row) => ({
            date: row.date,
            uniqueVisitors: Array.from({ length: row.uniqueVisitors }),
            pageViews: row.pageViews,
            sessions: []
        }));

        const todayRow = db.prepare(`
            SELECT COUNT(*) as pageViews, COUNT(DISTINCT visitorId) as uniqueVisitors
            FROM visits WHERE date = ?
        `).get(today) || { pageViews: 0, uniqueVisitors: 0 };
        const last7Rows = db.prepare(`
            SELECT COUNT(*) as pageViews, COUNT(DISTINCT visitorId) as uniqueVisitors
            FROM visits WHERE date >= ?
        `).get(sevenDaysAgo) || { pageViews: 0, uniqueVisitors: 0 };
        const last30Rows = db.prepare(`
            SELECT COUNT(*) as pageViews, COUNT(DISTINCT visitorId) as uniqueVisitors
            FROM visits WHERE date >= ?
        `).get(thirtyDaysAgo) || { pageViews: 0, uniqueVisitors: 0 };
        const allTimeRows = db.prepare(`
            SELECT COUNT(*) as pageViews, COUNT(DISTINCT visitorId) as uniqueVisitors
            FROM visits
        `).get() || { pageViews: 0, uniqueVisitors: 0 };

        const topPages = db.prepare(`
            SELECT page, COUNT(*) as views
            FROM visits WHERE date BETWEEN ? AND ?
            GROUP BY page ORDER BY views DESC LIMIT 10
        `).all(sinceDate, untilDate);
        const topReferrers = db.prepare(`
            SELECT COALESCE(NULLIF(referrer, ''), 'direct') as referrer, COUNT(*) as visits
            FROM visits WHERE date BETWEEN ? AND ?
            GROUP BY referrer ORDER BY visits DESC LIMIT 10
        `).all(sinceDate, untilDate).map((row) => ({ referrer: row.referrer, visits: row.visits }));

        const sources = db.prepare(`
            SELECT COALESCE(NULLIF(utm_source, ''), 'direct') as source,
                   COUNT(*) as pageViews,
                   COUNT(DISTINCT visitorId) as visitors
            FROM visits WHERE date BETWEEN ? AND ?
            GROUP BY source ORDER BY pageViews DESC
        `).all(sinceDate, untilDate);

        const recentPageViews = db.prepare(`
            SELECT page, title, referrer, timestamp
            FROM visits ORDER BY timestamp DESC LIMIT 50
        `).all();

        res.json({
            today: { visitors: todayRow.uniqueVisitors, pageViews: todayRow.pageViews },
            last7Days: { visitors: last7Rows.uniqueVisitors, pageViews: last7Rows.pageViews },
            last30Days: { visitors: last30Rows.uniqueVisitors, pageViews: last30Rows.pageViews },
            allTime: { visitors: allTimeRows.uniqueVisitors, pageViews: allTimeRows.pageViews },
            dailyStats,
            recentPageViews,
            topPages,
            topReferrers,
            sources,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Analytics summary error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics summary' });
    }
});

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, _req, res, next) => {
    if (err && err.message === 'Origin not allowed') {
        return res.status(403).json({ error: 'Origin not allowed' });
    }

    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON body' });
    }

    return next(err);
});

app.listen(PORT, () => {
    console.log(`CRM Backend API running on port ${PORT}`);
    console.log(`Database: ${DB_PATH}`);
});
