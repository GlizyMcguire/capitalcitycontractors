# Creating a Desktop Application for CRM Dashboard

## 📋 Overview

This guide will help you convert the CRM Dashboard into a standalone desktop application (.exe for Windows, .app for Mac, .AppImage for Linux).

---

## 🎯 Quick Start (Easiest Method)

### Option 1: Use Electron Forge (Recommended)

**What is Electron?**
Electron allows you to package web applications as native desktop apps. Apps like VS Code, Slack, and Discord use Electron.

### Step-by-Step Instructions

#### 1. Install Node.js
Download and install from: https://nodejs.org/
- Choose the LTS (Long Term Support) version
- Run the installer
- Verify installation: Open Command Prompt and type `node --version`

#### 2. Install Electron Forge
Open Command Prompt in your project folder and run:
```bash
npm install --global @electron-forge/cli
```

#### 3. Create Electron App Structure
In your `capitalcitycontractors` folder, create a new file called `package.json`:

```json
{
  "name": "ccc-crm-dashboard",
  "version": "2.0.0",
  "description": "Capital City Contractors CRM Dashboard",
  "main": "electron-main.js",
  "scripts": {
    "start": "electron .",
    "package": "electron-forge package",
    "make": "electron-forge make"
  },
  "author": "Capital City Contractors",
  "license": "MIT",
  "devDependencies": {
    "@electron-forge/cli": "^7.2.0",
    "@electron-forge/maker-squirrel": "^7.2.0",
    "@electron-forge/maker-zip": "^7.2.0",
    "electron": "^28.0.0"
  }
}
```

#### 4. Create Electron Main File
Create a file called `electron-main.js`:

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        icon: path.join(__dirname, 'assets/images/logo.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        title: 'Capital City Contractors - CRM Dashboard',
        backgroundColor: '#1e40af'
    });

    // Load the standalone HTML file
    win.loadFile('crm-standalone.html');

    // Open DevTools in development (comment out for production)
    // win.webContents.openDevTools();

    // Remove menu bar
    win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
```

#### 5. Install Dependencies
In Command Prompt, run:
```bash
npm install
```

#### 6. Test the App
Run the app locally to test:
```bash
npm start
```

The CRM Dashboard should open in a desktop window!

#### 7. Build the Executable

**For Windows .exe:**
```bash
npm run make -- --platform=win32
```

**For Mac .app:**
```bash
npm run make -- --platform=darwin
```

**For Linux .AppImage:**
```bash
npm run make -- --platform=linux
```

The built application will be in the `out` folder.

---

## 🚀 Option 2: Use Electron Builder (Alternative)

### Setup

1. Install Electron Builder:
```bash
npm install --save-dev electron-builder
```

2. Update `package.json`:
```json
{
  "name": "ccc-crm-dashboard",
  "version": "2.0.0",
  "description": "Capital City Contractors CRM Dashboard",
  "main": "electron-main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  },
  "build": {
    "appId": "com.capitalcitycontractors.crm",
    "productName": "CCC CRM Dashboard",
    "win": {
      "target": "nsis",
      "icon": "assets/images/logo.png"
    },
    "mac": {
      "target": "dmg",
      "icon": "assets/images/logo.png"
    },
    "linux": {
      "target": "AppImage",
      "icon": "assets/images/logo.png"
    }
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.1"
  }
}
```

3. Build:
```bash
npm run build
```

---

## 🎨 Option 3: Simple Wrapper (No Installation Required)

### For Windows Users

Create a file called `CRM-Dashboard.bat`:
```batch
@echo off
start chrome --app=file:///%CD%/crm-standalone.html --window-size=1400,900
```

Double-click this file to open the CRM in a Chrome app window!

### For Mac Users

Create a file called `CRM-Dashboard.command`:
```bash
#!/bin/bash
open -a "Google Chrome" --args --app="file://$(pwd)/crm-standalone.html" --window-size=1400,900
```

Make it executable:
```bash
chmod +x CRM-Dashboard.command
```

---

## 📦 Option 4: Use ToDesktop (Easiest, Paid Service)

**ToDesktop** (https://www.todesktop.com/) converts web apps to desktop apps with zero code.

### Steps:
1. Sign up at todesktop.com
2. Upload your `crm-standalone.html` file
3. Configure app settings (name, icon, etc.)
4. Click "Build"
5. Download your .exe, .app, or .AppImage

**Pros:**
- No coding required
- Automatic updates
- Code signing included
- Professional installer

**Cons:**
- Paid service ($29-99/month)

---

## 🔧 Advanced: Custom Electron Configuration

### Add Auto-Updates

Install electron-updater:
```bash
npm install electron-updater
```

Update `electron-main.js`:
```javascript
const { autoUpdater } = require('electron-updater');

app.whenReady().then(() => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
});
```

### Add System Tray Icon

```javascript
const { Tray, Menu } = require('electron');

let tray = null;

app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, 'assets/images/logo.png'));
    
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Open CRM', click: createWindow },
        { label: 'Quit', click: () => app.quit() }
    ]);
    
    tray.setContextMenu(contextMenu);
    tray.setToolTip('CCC CRM Dashboard');
});
```

### Add Keyboard Shortcuts

```javascript
const { globalShortcut } = require('electron');

app.whenReady().then(() => {
    // Ctrl+Shift+C to open CRM
    globalShortcut.register('CommandOrControl+Shift+C', () => {
        createWindow();
    });
});
```

---

## 📱 Future: Mobile App Development

### React Native (Recommended)

**For iOS and Android:**

1. Install React Native:
```bash
npx react-native init CCCCRMApp
```

2. Convert your CRM dashboard to React components

3. Build for iOS:
```bash
npx react-native run-ios
```

4. Build for Android:
```bash
npx react-native run-android
```

### Ionic Framework (Alternative)

**For iOS and Android:**

1. Install Ionic:
```bash
npm install -g @ionic/cli
```

2. Create Ionic app:
```bash
ionic start CCCCRMApp blank
```

3. Add your CRM code to the app

4. Build:
```bash
ionic build
ionic capacitor add ios
ionic capacitor add android
```

---

## 🎯 Recommended Approach

**For Now (Phase 2):**
1. Use **Electron Forge** (Option 1) - Free, professional, widely used
2. Build Windows .exe for your desktop
3. Test thoroughly with real lead data

**For Later (Phase 3):**
1. Use **React Native** for mobile apps
2. Add cloud sync with Firebase or AWS
3. Publish to App Store and Google Play

---

## 📋 Checklist

### Before Building Desktop App:
- [ ] Test CRM thoroughly in browser
- [ ] Export and backup all lead data
- [ ] Verify all features work offline
- [ ] Test on different screen sizes
- [ ] Create app icon (256x256 PNG)

### After Building Desktop App:
- [ ] Test .exe on clean Windows machine
- [ ] Verify data persists after closing app
- [ ] Test all CRM features
- [ ] Create desktop shortcut
- [ ] Document any issues

---

## 🆘 Troubleshooting

### "npm not recognized"
- Reinstall Node.js
- Restart Command Prompt
- Add Node.js to PATH environment variable

### "Electron failed to install"
- Run Command Prompt as Administrator
- Clear npm cache: `npm cache clean --force`
- Try again: `npm install`

### "App won't start"
- Check console for errors (F12)
- Verify all files are in correct locations
- Check `electron-main.js` for typos

### "Data not saving"
- localStorage works the same in Electron
- Data is stored in app's user data folder
- Export CSV regularly as backup

---

## 📞 Next Steps

1. **Choose your method** (Electron Forge recommended)
2. **Follow the step-by-step guide** above
3. **Test the desktop app** thoroughly
4. **Create a desktop shortcut** for easy access
5. **Plan for mobile app** (Phase 3)

---

## 🎓 Learning Resources

### Electron
- Official Docs: https://www.electronjs.org/docs
- Tutorial: https://www.electronjs.org/docs/latest/tutorial/quick-start
- Examples: https://github.com/electron/electron-quick-start

### React Native
- Official Docs: https://reactnative.dev/docs/getting-started
- Tutorial: https://reactnative.dev/docs/tutorial

### Ionic
- Official Docs: https://ionicframework.com/docs
- Tutorial: https://ionicframework.com/docs/intro/cli

---

**Need Help?**
- Check the console for error messages
- Search for error messages on Stack Overflow
- Review Electron documentation
- Test in browser first before building desktop app

---

**Last Updated**: January 4, 2025  
**Version**: 2.0  
**Status**: Ready for Desktop App Development

