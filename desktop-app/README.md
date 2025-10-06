# Capital City Contractors CRM - Desktop Application

## Overview

This is a secure, password-protected desktop application for the Capital City Contractors CRM system. It runs as a standalone .exe on Windows (and can be built for Mac/Linux).

## Features

- 🔒 **Password Protection** - Secure login required to access CRM
- 💾 **Local Data Storage** - All data stored securely on your computer
- 📤 **Export/Import** - Native file dialogs for data backup and restore
- 🖥️ **Offline Access** - Works completely offline, no internet required
- 🔐 **Encrypted Storage** - Password and settings stored with encryption

## Building the Desktop App

### Prerequisites

1. **Node.js** (v18 or higher) - Download from https://nodejs.org/
2. **Git** (optional) - For version control

### Step 1: Install Dependencies

Open Command Prompt or PowerShell in the `desktop-app` folder and run:

```bash
npm install
```

This will install:
- Electron (desktop app framework)
- Electron Builder (creates .exe installer)
- Electron Store (secure data storage)

### Step 2: Test the App

Before building, test that everything works:

```bash
npm start
```

This will open the CRM desktop app. You should see:
1. Login screen
2. Enter a password (this will be your CRM password)
3. CRM dashboard loads

### Step 3: Build the .exe

To create a Windows installer (.exe):

```bash
npm run build-win
```

This will create:
- `dist/Capital City Contractors CRM Setup 3.0.0.exe` - Installer
- The installer is about 150-200 MB (includes everything needed)

### Step 4: Install and Run

1. Navigate to the `dist` folder
2. Double-click `Capital City Contractors CRM Setup 3.0.0.exe`
3. Follow the installation wizard
4. The app will be installed to `C:\Program Files\Capital City Contractors CRM\`
5. A desktop shortcut will be created
6. Launch the app from the desktop or Start Menu

## First Time Setup

1. **Launch the app**
2. **Set your password** - Enter a secure password (this will be required every time you open the app)
3. **Start using the CRM** - All your data is stored locally on your computer

## Security Features

### Password Protection
- Password is required every time you open the app
- Password is encrypted and stored securely
- No one can access your CRM without the password

### Password Reset
- If you forget your password, click "Reset Password" on the login screen
- This will clear your saved password
- You can then set a new password
- **Note:** Your CRM data is NOT deleted when you reset the password

### Data Security
- All data is stored in your Windows user profile
- Data location: `C:\Users\YourName\AppData\Roaming\capital-city-contractors-crm\`
- Data is stored in localStorage (same as web version)
- Password is encrypted using electron-store

## Building for Other Platforms

### Mac (.dmg)
```bash
npm run build-mac
```

### Linux (.AppImage)
```bash
npm run build-linux
```

## Customization

### Change App Icon
1. Replace `assets/icon.ico` (Windows)
2. Replace `assets/icon.icns` (Mac)
3. Replace `assets/icon.png` (Linux)
4. Rebuild the app

### Change Encryption Key
1. Open `main.js`
2. Find line: `encryptionKey: 'ccc-crm-secure-key-2025'`
3. Change to a unique, secure key
4. Rebuild the app

## Troubleshooting

### App won't start
- Make sure you have Node.js installed
- Delete `node_modules` folder and run `npm install` again
- Check that all files are present

### Build fails
- Make sure you have internet connection (downloads build tools)
- Run `npm install` again
- Try running as Administrator

### Can't remember password
- Click "Reset Password" on login screen
- Your data will remain intact
- Set a new password

### Data not syncing between web and desktop
- Desktop app and web version use separate storage
- Use Export/Import to transfer data between them
- Export from web → Import to desktop (or vice versa)

## File Structure

```
desktop-app/
├── main.js              # Main Electron process (app logic)
├── preload.js           # Security bridge between main and renderer
├── package.json         # App configuration and dependencies
├── renderer/
│   ├── login.html       # Login screen
│   └── crm.html         # CRM dashboard
└── assets/
    └── icon.png         # App icon
```

## Support

For issues or questions:
- Check this README
- Review the code comments in main.js
- Contact your developer

## Version History

- **v3.0.0** (2025-01-05) - Initial desktop application release
  - Password-protected login
  - Full CRM functionality
  - Export/Import with native dialogs
  - Secure local storage

