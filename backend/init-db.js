const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const db = new Database(path.join(__dirname, 'crm.db'));

console.log('🔧 Initializing database...\n');

// Create tables
db.exec(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

    -- Contacts table
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

    -- Leads table
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

    -- Projects table
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

    -- Tasks table
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

    -- Campaigns table
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

    -- Form submissions table
    CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        formType TEXT NOT NULL,
        payload TEXT NOT NULL,
        processed INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    );

    -- Discount codes table
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

    -- Settings table
    CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
    CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);
    CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
    CREATE INDEX IF NOT EXISTS idx_leads_contactId ON leads(contactId);
    CREATE INDEX IF NOT EXISTS idx_tasks_dueDate ON tasks(dueDate);
    CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
`);

// Create visits tracking table and indexes
db.exec(`
    -- Visits tracking table
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

    CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(date);
    CREATE INDEX IF NOT EXISTS idx_visits_source ON visits(utm_source);
    CREATE INDEX IF NOT EXISTS idx_visits_page ON visits(page);
`);


console.log('✅ Database tables created\n');

// Create default admin user
const defaultUsername = 'admin';
const defaultPassword = 'Coolguy1!'; // Same as your CRM password

const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(defaultUsername);

if (!existingUser) {
    const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
    db.prepare('INSERT INTO users (username, password, created_at) VALUES (?, ?, ?)').run(
        defaultUsername,
        hashedPassword,
        new Date().toISOString()
    );
    console.log('✅ Default admin user created');
    console.log(`   Username: ${defaultUsername}`);
    console.log(`   Password: ${defaultPassword}`);
    console.log('   ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!\n');
} else {
    console.log('ℹ️  Admin user already exists\n');
}

console.log('✅ Database initialization complete!');
console.log('📊 Database location:', path.join(__dirname, 'crm.db'));

db.close();

