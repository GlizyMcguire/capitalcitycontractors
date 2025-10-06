# Capital City Contractors CRM - Backend API

## Overview

This is the backend API server for the CRM system. It provides:
- RESTful API endpoints for all CRM data
- SQLite database for data storage
- JWT authentication
- CORS support for web and desktop clients

## Features

- ✅ **Contacts Management** - CRUD operations for contacts
- ✅ **Leads Management** - Track and manage sales leads
- ✅ **Projects Management** - Monitor ongoing projects
- ✅ **Tasks Management** - Task tracking and completion
- ✅ **Campaigns** - Marketing campaign data
- ✅ **Form Submissions** - Store website form submissions
- ✅ **Authentication** - JWT-based secure authentication
- ✅ **Rate Limiting** - Protect against abuse
- ✅ **CORS** - Support for web and desktop clients

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment

```bash
# Copy the example environment file
copy .env.example .env

# Edit .env and change the JWT_SECRET to something random
```

### Step 3: Initialize Database

```bash
npm run init-db
```

This will:
- Create the SQLite database
- Create all necessary tables
- Create a default admin user:
  - Username: `admin`
  - Password: `Coolguy1!`

⚠️ **IMPORTANT:** Change the default password after first login!

### Step 4: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

#### POST /api/auth/login
Login and get JWT token

**Request:**
```json
{
  "username": "admin",
  "password": "Coolguy1!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

### Contacts

All contact endpoints require authentication (Bearer token in Authorization header).

- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Leads

- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task

### Campaigns

- `GET /api/campaigns` - Get all campaigns

### Submissions

- `GET /api/submissions` - Get all form submissions

### Health Check

- `GET /api/health` - Check if server is running

## Authentication

All API endpoints (except `/api/auth/login` and `/api/health`) require authentication.

Include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

## Database

The API uses SQLite for data storage. The database file is located at:
```
backend/crm.db
```

### Database Schema

- **users** - User accounts
- **contacts** - Customer contacts
- **leads** - Sales leads
- **projects** - Active projects
- **tasks** - Tasks and reminders
- **campaigns** - Marketing campaigns
- **submissions** - Website form submissions
- **discount_codes** - Promotional codes
- **settings** - Application settings

## Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)

1. Create account at https://render.com
2. Create new "Web Service"
3. Connect your GitHub repository
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Add environment variables (JWT_SECRET, etc.)
7. Deploy!

### Option 2: Railway.app (Free Tier Available)

1. Create account at https://railway.app
2. Create new project from GitHub repo
3. Set root directory to `backend`
4. Add environment variables
5. Deploy!

### Option 3: Heroku

1. Create Heroku account
2. Install Heroku CLI
3. Create new app
4. Deploy from GitHub or CLI

### Option 4: Your Own Server (VPS)

Requirements:
- Ubuntu/Debian server
- Node.js installed
- PM2 for process management

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name crm-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Security Considerations

### Production Checklist

- [ ] Change default admin password
- [ ] Change JWT_SECRET to a random string
- [ ] Enable HTTPS (use reverse proxy like Nginx)
- [ ] Set up firewall rules
- [ ] Regular database backups
- [ ] Monitor server logs
- [ ] Keep dependencies updated

### Recommended: Use Environment Variables

Never commit sensitive data to Git:
- JWT_SECRET
- Database credentials (if using external DB)
- API keys

## Backup and Restore

### Backup Database

```bash
# Copy the database file
copy crm.db crm-backup-2025-01-05.db
```

### Restore Database

```bash
# Replace current database with backup
copy crm-backup-2025-01-05.db crm.db
```

## Troubleshooting

### Port Already in Use

Change the PORT in `.env` file:
```
PORT=3001
```

### Database Locked

SQLite can only handle one write at a time. If you get "database locked" errors:
- Make sure only one server instance is running
- Check for zombie processes
- Restart the server

### CORS Errors

Add your domain to CORS_ORIGINS in `.env`:
```
CORS_ORIGINS=https://yourdomain.com,https://glizymcguire.github.io
```

## Development

### Running Tests

```bash
npm test
```

### Database Migrations

If you need to modify the database schema:
1. Update `init-db.js`
2. Run `npm run init-db` (this won't delete existing data)
3. Or manually run SQL commands

## Support

For issues or questions:
- Check the logs: `npm start` shows console output
- Check database: Use SQLite browser to inspect `crm.db`
- Review API responses for error messages

## Version

Current version: 1.0.0

## License

Proprietary - Capital City Contractors

