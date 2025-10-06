# 🚀 Quick Start - Build Your Desktop App in 5 Minutes

## What You're Building

A secure, password-protected desktop application (.exe) that runs your CRM offline on Windows.

---

## ⚡ Super Quick Steps

### 1. Install Node.js (One-Time Setup)

**Download:** https://nodejs.org/

- Click the big green "LTS" button
- Run the installer
- Click "Next" through everything
- **Restart your computer** after installation

**How to verify it worked:**
1. Press `Windows + R`
2. Type `cmd` and press Enter
3. Type `node --version` and press Enter
4. You should see something like `v18.17.0`

---

### 2. Open Command Prompt in the Right Folder

**Method A - Easy Way:**
1. Open File Explorer
2. Navigate to: `C:\Users\YourName\Documents\GitHub\capitalcitycontractors\desktop-app`
3. Click in the address bar at the top
4. Type `cmd` and press Enter
5. Command Prompt opens in the right folder!

**Method B - Manual Way:**
1. Press `Windows + R`
2. Type `cmd` and press Enter
3. Type this command (adjust path to match your setup):
```bash
cd C:\Users\YourName\Documents\GitHub\capitalcitycontractors\desktop-app
```
4. Press Enter

---

### 3. Install Dependencies (One-Time)

In the Command Prompt, type:

```bash
npm install
```

Press Enter and wait 2-3 minutes. You'll see lots of text scrolling. This is normal!

**What this does:** Downloads Electron and build tools (about 200 MB)

---

### 4. Test the App (Optional but Recommended)

```bash
npm start
```

This opens the app so you can test it. You should see:
- Login screen
- Enter a password (anything you want)
- CRM loads

Close the app window when done testing.

---

### 5. Build the .exe

```bash
npm run build-win
```

Press Enter and wait 3-5 minutes. You'll see:
- "Building..." messages
- Progress bars
- "Done!" when finished

**What this creates:**
- `dist/Capital City Contractors CRM Setup 3.0.0.exe` (installer)
- About 150-200 MB file

---

### 6. Install and Run

1. Open File Explorer
2. Go to: `desktop-app/dist/`
3. Double-click: `Capital City Contractors CRM Setup 3.0.0.exe`
4. Click "Yes" if Windows asks for permission
5. Follow the installation wizard (click Next → Next → Install)
6. App installs to: `C:\Program Files\Capital City Contractors CRM\`
7. Desktop shortcut is created automatically
8. Click "Finish" to launch the app

---

## 🎉 You're Done!

The app is now installed on your computer. You can:

- Launch it from the desktop shortcut
- Find it in Start Menu
- Pin it to taskbar

**First Launch:**
1. Enter a password (you choose this - remember it!)
2. CRM loads automatically
3. All your data is stored securely on your computer

**Every Other Launch:**
1. Enter your password
2. CRM loads

---

## 🔧 Troubleshooting

### "npm is not recognized"
- Node.js not installed or not in PATH
- Restart computer after installing Node.js
- Reinstall Node.js and check "Add to PATH" option

### "Cannot find module"
- Run `npm install` again
- Make sure you're in the `desktop-app` folder
- Check internet connection

### Build fails with errors
- Run `npm install` again
- Update Node.js to latest LTS version
- Run Command Prompt as Administrator
- Check antivirus isn't blocking

### App won't start after installation
- Check Windows Defender didn't block it
- Right-click .exe → Properties → Unblock
- Run as Administrator
- Reinstall the app

### Forgot password
- Click "Reset Password" on login screen
- Your data stays safe
- Set a new password

---

## 📋 Command Reference

All commands must be run in the `desktop-app` folder:

```bash
# Install dependencies (first time only)
npm install

# Test the app
npm start

# Build Windows .exe
npm run build-win

# Build for Mac (if on Mac)
npm run build-mac

# Build for Linux (if on Linux)
npm run build-linux
```

---

## 🎯 What's Next?

After building the app:

1. ✅ Install it on your computer
2. ✅ Set a secure password
3. ✅ Test all CRM features
4. ✅ Export a data backup
5. ✅ Share the installer with team members (optional)

---

## 💡 Pro Tips

### Sharing with Team
- Copy the .exe installer to USB drive
- Share via email or cloud storage
- Each person sets their own password
- Data is NOT shared between installations

### Updates
- When you update the CRM code
- Run `npm run build-win` again
- New installer is created
- Uninstall old version first, then install new

### Custom Icon
- Add `icon.ico` to `assets/` folder
- Rebuild the app
- New icon appears

### Change App Name
- Edit `package.json`
- Change `"productName"` field
- Rebuild the app

---

## 📞 Need Help?

1. Check the full README.md in this folder
2. Check SETUP-GUIDE.md in parent folder
3. Google the error message
4. Contact your developer

---

**Total Time:** 5-10 minutes (plus download time)

**Difficulty:** Easy (just copy/paste commands)

**Result:** Professional desktop application! 🎉

