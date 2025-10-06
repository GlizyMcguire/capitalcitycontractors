# 🚀 Backend Setup Guide - Live Data Syncing

## Overview

This guide will help you set up a backend server so your desktop app can fetch **real live data** from a central database instead of using local storage.

## What You're Building

```
┌─────────────────┐
│  Website CRM    │────┐
└─────────────────┘    │
                       │
┌─────────────────┐    │    ┌──────────────┐    ┌──────────────┐
│  Desktop App    │────┼───→│ Backend API  │───→│   Database   │
└─────────────────┘    │    └──────────────┘    └──────────────┘
                       │
┌─────────────────┐    │
│  Mobile PWA     │────┘
└─────────────────┘

All clients connect to the same backend → All data syncs automatically!
```

## Prerequisites

- ✅ Node.js installed (you already have this)
- ✅ Basic command line knowledge
- ✅ A way to host the backend (we'll use free options)

---

## Part 1: Local Setup (Testing)

### Step 1: Install Backend Dependencies

Open Command Prompt (doesn't need to be Administrator):

```bash
cd C:\Users\D\Documents\GitHub\capitalcitycontractors\backend
npm install
```

This will install:
- Express (web server)
- SQLite (database)
- JWT (authentication)
- And other dependencies

### Step 2: Configure Environment

```bash
# Copy the example environment file
copy .env.example .env
```

Then edit `.env` file and change the JWT_SECRET to something random:
```
JWT_SECRET=your-random-secret-key-here-make-it-long-and-random
```

### Step 3: Initialize Database

```bash
npm run init-db
```

You should see:
```
🔧 Initializing database...
✅ Database tables created
✅ Default admin user created
   Username: admin
   Password: REDACTED_LEGACY_PASSWORD
```

### Step 4: Start the Server

```bash
npm start
```

You should see:
```
🚀 CRM Backend API running on port 3000
📊 Database: C:\Users\D\Documents\GitHub\capitalcitycontractors\backend\crm.db
```

### Step 5: Test the API

Open a new browser tab and go to:
```
http://localhost:3000/api/health
```

You should see:
```json
{"status":"ok","timestamp":"2025-01-05T..."}
```

✅ **Success!** Your backend is running locally!

---

## Part 2: Deploy to the Internet (Free)

Now we need to deploy the backend so it's accessible from anywhere.

### Option A: Render.com (Recommended - Easiest)

**Why Render:**
- ✅ Free tier available
- ✅ Easy setup
- ✅ Automatic deployments from GitHub
- ✅ HTTPS included
- ✅ No credit card required for free tier

**Steps:**

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub (easiest)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `capitalcitycontractors` repo

3. **Configure Service**
   - Name: `ccc-crm-api`
   - Region: Choose closest to you
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install && npm run init-db`
   - Start Command: `npm start`
   - Instance Type: `Free`

4. **Add Environment Variables**
   - Click "Environment" tab
   - Add variable:
     - Key: `JWT_SECRET`
     - Value: `your-random-secret-key-make-it-long`
   - Add variable:
     - Key: `PORT`
     - Value: `10000` (Render uses this port)

5. **Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - You'll get a URL like: `https://ccc-crm-api.onrender.com`

6. **Test Deployment**
   - Visit: `https://ccc-crm-api.onrender.com/api/health`
   - Should see: `{"status":"ok",...}`

✅ **Your backend is now live on the internet!**

### Option B: Railway.app (Alternative)

1. Go to https://railway.app
2. Sign up with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Set root directory to `backend`
6. Add environment variables (JWT_SECRET)
7. Deploy!

---

## Part 3: Connect CRM to Backend

Now we need to modify the CRM to use the backend API instead of localStorage.

### Step 1: Update CRM Configuration

I'll need to modify the CRM code to:
1. Add API client
2. Replace localStorage calls with API calls
3. Add login screen
4. Handle authentication

**This is a significant code change. Would you like me to:**

**Option A:** Create a new "API-enabled" version of the CRM that uses the backend

**Option B:** Modify the existing CRM to support both modes (localStorage OR API)

**Option C:** Create a hybrid that syncs localStorage with API periodically

---

## Part 4: What Happens Next

Once connected:

1. **Desktop App:**
   - Opens → Shows login screen
   - Enter username/password
   - Fetches all data from backend
   - Changes sync to backend in real-time

2. **Website CRM:**
   - Same login screen
   - Same data as desktop
   - All changes sync

3. **Mobile:**
   - Same experience
   - All data synced

---

## Important Notes

### Free Tier Limitations

**Render.com Free Tier:**
- ✅ 750 hours/month (enough for 24/7)
- ✅ Automatic HTTPS
- ⚠️ Spins down after 15 min of inactivity (first request takes 30 seconds to wake up)
- ⚠️ Database stored in memory (resets on restart)

**For Production:**
- Upgrade to paid tier ($7/month) for:
  - No spin-down
  - Persistent disk storage
  - Better performance

### Database Persistence

The free tier uses in-memory storage. For persistent data:
1. Upgrade to paid tier, OR
2. Use external database (PostgreSQL, MySQL), OR
3. Implement periodic backups to GitHub

---

## Security Considerations

✅ **Already Implemented:**
- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- CORS protection
- Helmet security headers

⚠️ **You Should:**
- Change default admin password
- Use strong JWT_SECRET
- Enable HTTPS (automatic on Render)
- Regular backups

---

## Next Steps

1. ✅ **Test locally** - Make sure backend works on your computer
2. ✅ **Deploy to Render** - Get it on the internet
3. ⏳ **Modify CRM** - Connect CRM to backend (I'll do this)
4. ⏳ **Test syncing** - Verify data syncs between devices
5. ⏳ **Go live** - Start using it!

---

## Cost Summary

**Free Option:**
- Render.com free tier: $0/month
- Limitations: Spins down, no persistent disk

**Paid Option (Recommended for Production):**
- Render.com Starter: $7/month
- Benefits: Always on, persistent storage, better performance

**Alternative:**
- Your own VPS (DigitalOcean, Linode): $5-10/month
- More control, more setup required

---

## Questions?

Before I proceed with modifying the CRM code, please:

1. **Test the local backend** - Follow Part 1 and confirm it works
2. **Choose deployment option** - Render.com or Railway?
3. **Choose CRM modification approach** - Option A, B, or C above?

Let me know when you're ready for the next step!

