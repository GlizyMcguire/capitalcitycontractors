# Capital City Contractors CRM - Complete Setup Guide

## 🎯 Quick Start

You now have **3 ways** to access your CRM:

1. **🌐 Web Browser** - Access from any computer via website
2. **💻 Desktop App** - Secure .exe application for Windows
3. **📱 Mobile** - Access from your phone (iOS/Android)

---

## 1️⃣ Web Browser Access

### Current Setup
- **URL:** https://glizymcguire.github.io/capitalcitycontractors/
- **Access Method:** Press `Ctrl+Shift+C` on the website
- **Password:** `CCC2025Admin` (change this!)

### How to Access
1. Open the website in any browser
2. Press `Ctrl+Shift+C` on your keyboard
3. Enter password when prompted
4. Click the "CRM Dashboard" button that appears
5. Start using the CRM

### Security Features
- ✅ Password required to reveal CRM button
- ✅ 3 failed attempts = locked (refresh to try again)
- ✅ Hidden from public view
- ✅ All data stored locally in browser

### Change the Password
1. Open `index.html` in a text editor
2. Find line 3247: `const CRM_PASSWORD = 'CCC2025Admin';`
3. Change to your secure password
4. Save and push to GitHub
5. Wait 3-5 minutes for deployment

---

## 2️⃣ Desktop Application (.exe)

### Why Use Desktop App?
- ✅ More secure (password-protected login screen)
- ✅ Works completely offline
- ✅ Native file dialogs for export/import
- ✅ Runs like a regular Windows program
- ✅ No browser required

### Building the Desktop App

#### Step 1: Install Node.js
1. Download from: https://nodejs.org/
2. Install the LTS version (v18 or higher)
3. Restart your computer

#### Step 2: Open Command Prompt
1. Press `Windows + R`
2. Type `cmd` and press Enter
3. Navigate to the desktop-app folder:
```bash
cd C:\Users\YourName\Documents\GitHub\capitalcitycontractors\desktop-app
```

#### Step 3: Install Dependencies
```bash
npm install
```
Wait for installation to complete (may take 2-3 minutes)

#### Step 4: Test the App
```bash
npm start
```
This opens the app to test it works correctly.

#### Step 5: Build the .exe
```bash
npm run build-win
```
This creates the installer (takes 3-5 minutes)

#### Step 6: Install
1. Go to `desktop-app/dist/` folder
2. Double-click `Capital City Contractors CRM Setup 3.0.0.exe`
3. Follow installation wizard
4. App installs to `C:\Program Files\Capital City Contractors CRM\`
5. Desktop shortcut created automatically

### Using the Desktop App

**First Launch:**
1. Double-click the desktop icon
2. Enter a secure password (you choose this)
3. Remember this password - you'll need it every time!
4. CRM loads automatically

**Subsequent Launches:**
1. Double-click the desktop icon
2. Enter your password
3. CRM loads

**Forgot Password?**
- Click "Reset Password" on login screen
- Your data stays intact
- Set a new password

### Desktop App Features
- 🔒 Password-protected login
- 💾 Secure local storage
- 📤 Native export/import dialogs
- 🖥️ Full offline functionality
- 🔐 Encrypted password storage

---

## 3️⃣ Mobile Access

### Option A: Progressive Web App (Recommended)

**iPhone/iPad:**
1. Open Safari (must use Safari)
2. Go to: https://glizymcguire.github.io/capitalcitycontractors/
3. Press `Ctrl+Shift+C` and enter password
4. Click CRM Dashboard button
5. Tap Share button → "Add to Home Screen"
6. Name it "CCC CRM"
7. Tap the icon on home screen to use

**Android:**
1. Open Chrome browser
2. Go to: https://glizymcguire.github.io/capitalcitycontractors/
3. Press `Ctrl+Shift+C` and enter password
4. Click CRM Dashboard button
5. Tap menu (⋮) → "Add to Home screen"
6. Name it "CCC CRM"
7. Tap the icon on home screen to use

### Option B: Browser Bookmark
- Simply bookmark the CRM page in your mobile browser
- Access anytime from bookmarks

### Mobile Features
- ✅ Fully responsive design
- ✅ Touch-optimized interface
- ✅ Works offline after first load
- ✅ All CRM features available
- ✅ Collapsible sidebar for small screens

---

## 🔐 Security Best Practices

### 1. Change Default Passwords

**Web Version:**
- Edit `index.html` line 3247
- Change `CCC2025Admin` to your password
- Push to GitHub

**Desktop App:**
- First launch sets your password
- Change via Settings → Security (future feature)

### 2. Regular Backups

**Export Data Weekly:**
1. Settings → Data tab
2. Click "Export All Data"
3. Save JSON file to secure location
4. Keep multiple backups

**Backup Locations:**
- External hard drive
- Cloud storage (Google Drive, Dropbox)
- USB flash drive
- Email to yourself

### 3. Access Control

**Who Can Access:**
- Web: Anyone with password
- Desktop: Anyone with physical access + password
- Mobile: Anyone with your phone + password

**Recommendations:**
- Use strong, unique passwords
- Don't share passwords
- Lock your computer when away
- Use phone lock screen
- Log out when done (web version)

---

## 📊 Data Management

### Where is Data Stored?

**Web Browser:**
- Location: Browser's localStorage
- Path: Browser-specific (not accessible as file)
- Scope: Per browser, per device

**Desktop App:**
- Location: Windows user profile
- Path: `C:\Users\YourName\AppData\Roaming\capital-city-contractors-crm\`
- Scope: Per Windows user account

**Mobile:**
- Location: Browser's localStorage
- Scope: Per browser, per device

### Syncing Between Devices

Data does NOT automatically sync. To sync:

1. **Export from Device A:**
   - Settings → Data → Export All Data
   - Save JSON file

2. **Transfer to Device B:**
   - Email, cloud storage, or USB

3. **Import to Device B:**
   - Settings → Data → Import Data
   - Select/paste JSON file

### Data Backup Strategy

**Recommended Schedule:**
- Daily: If actively using
- Weekly: For regular use
- Before major changes: Always
- Before updates: Always

**Backup Method:**
1. Export data
2. Name file: `CRM-Backup-YYYY-MM-DD.json`
3. Store in 2+ locations
4. Test restore occasionally

---

## 🛠️ Troubleshooting

### Web Version Issues

**CRM button not showing:**
- Press Ctrl+Shift+C
- Enter correct password
- Check JavaScript is enabled
- Try different browser

**Data not saving:**
- Check browser storage settings
- Clear cache and reload
- Try incognito mode
- Check storage quota

### Desktop App Issues

**App won't start:**
- Reinstall Node.js
- Delete `node_modules` and run `npm install`
- Run as Administrator
- Check antivirus isn't blocking

**Build fails:**
- Check internet connection
- Run `npm install` again
- Update Node.js to latest LTS
- Check disk space

**Forgot password:**
- Click "Reset Password"
- Data remains intact
- Set new password

### Mobile Issues

**App not working:**
- Clear browser cache
- Reinstall PWA
- Check JavaScript enabled
- Try different browser

**Slow performance:**
- Close other tabs
- Restart phone
- Clear browser data
- Use PWA instead of browser

---

## 📞 Support

### Self-Help Resources
1. Check this guide
2. Review README files
3. Check browser console for errors
4. Try incognito/private mode

### Getting Help
- Document the issue (screenshots help)
- Note what you were doing when it happened
- Check if it happens in different browser
- Contact your developer

---

## 🚀 Next Steps

### After Setup

1. ✅ Change default password
2. ✅ Create first backup
3. ✅ Test all features
4. ✅ Set up mobile access
5. ✅ Create backup schedule
6. ✅ Train team members

### Recommended Workflow

**Daily:**
- Check dashboard for overdue tasks
- Update lead statuses
- Add new contacts/leads
- Complete tasks

**Weekly:**
- Export data backup
- Review reports
- Clean up old data
- Update project statuses

**Monthly:**
- Full data backup
- Review settings
- Check for updates
- Optimize workflows

---

## 📝 Quick Reference

### Keyboard Shortcuts
- `Ctrl+Shift+C` - Show CRM button (web)
- `N` - New lead (in CRM)
- `T` - New task (in CRM)
- `/` - Search (in CRM)

### Important Files
- `index.html` - Main website + CRM access
- `assets/js/crm-dashboard.js` - CRM application
- `desktop-app/` - Desktop application files
- `MOBILE-ACCESS.md` - Mobile setup guide

### Important URLs
- Website: https://glizymcguire.github.io/capitalcitycontractors/
- GitHub: https://github.com/GlizyMcguire/capitalcitycontractors
- Node.js: https://nodejs.org/

---

**You're all set! Choose your preferred access method and start using your CRM!** 🎉

