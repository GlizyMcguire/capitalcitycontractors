const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'crm.db');
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

function ensureDirectoryExists(filePath) {
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

function isStrongPassword(value) {
    return typeof value === 'string'
        && value.length >= 16
        && /[a-z]/.test(value)
        && /[A-Z]/.test(value)
        && /\d/.test(value)
        && /[^A-Za-z0-9]/.test(value);
}

ensureDirectoryExists(DB_PATH);

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');

console.log('Initializing CRM database...');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        emailConsent INTEGER DEFAULT 0,
        smsConsent INTEGER DEFAULT 0,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        contactId TEXT,
        jobType TEXT,
        propertyAddress TEXT,
        estimatedValue REAL,
        stage TEXT DEFAULT 'new',
        source TEXT,
        notes TEXT,
        relatedTo TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (contactId) REFERENCES contacts(id)
    );

    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        leadId TEXT,
        contactId TEXT,
        name TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        startDate TEXT,
        endDate TEXT,
        budget REAL,
        notes TEXT,
        progress INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (leadId) REFERENCES leads(id),
        FOREIGN KEY (contactId) REFERENCES contacts(id)
    );

    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT,
        dueDate TEXT,
        completed INTEGER DEFAULT 0,
        archived INTEGER DEFAULT 0,
        relatedTo TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT,
        subject TEXT,
        message TEXT,
        segment TEXT,
        status TEXT DEFAULT 'draft',
        sentAt TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        formType TEXT NOT NULL,
        payload TEXT NOT NULL,
        processed INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS discount_codes (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        type TEXT,
        value REAL,
        expiresAt TEXT,
        usageLimit INTEGER,
        usageCount INTEGER DEFAULT 0,
        active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS visits (
        id TEXT PRIMARY KEY,
        visitorId TEXT,
        sessionId TEXT,
        page TEXT NOT NULL,
        title TEXT,
        referrer TEXT,
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        utm_term TEXT,
        utm_content TEXT,
        userAgent TEXT,
        ip TEXT,
        date TEXT NOT NULL,
        timestamp TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
    CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);
    CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
    CREATE INDEX IF NOT EXISTS idx_leads_contactId ON leads(contactId);
    CREATE INDEX IF NOT EXISTS idx_tasks_dueDate ON tasks(dueDate);
    CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
    CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(date);
    CREATE INDEX IF NOT EXISTS idx_visits_source ON visits(utm_source);
    CREATE INDEX IF NOT EXISTS idx_visits_page ON visits(page);
`);

console.log('Database tables ready.');

const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(ADMIN_USERNAME);

if (!existingUser) {
    if (!isStrongPassword(ADMIN_PASSWORD)) {
        console.warn('No bootstrap admin user was created.');
        console.warn('Set ADMIN_USERNAME and a strong ADMIN_PASSWORD in backend/.env before first login.');
    } else {
        const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 12);
        db.prepare('INSERT INTO users (username, password, created_at) VALUES (?, ?, ?)')
            .run(ADMIN_USERNAME, hashedPassword, new Date().toISOString());
        console.log(`Bootstrap admin user created for "${ADMIN_USERNAME}".`);
    }
} else {
    console.log(`Admin user "${ADMIN_USERNAME}" already exists.`);
}

console.log(`Database location: ${DB_PATH}`);
db.close();
