const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Initialize secure storage
const store = new Store({
  encryptionKey: 'ccc-crm-secure-key-2025' // Change this to a secure key
});

let mainWindow;

// Authentication state
let isAuthenticated = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    show: false,
    backgroundColor: '#ffffff',
    title: 'Capital City Contractors CRM'
  });

  // Check if user is authenticated
  const savedPassword = store.get('userPassword');
  
  if (!savedPassword) {
    // First time setup - show login page
    mainWindow.loadFile('renderer/login.html');
  } else {
    // Show login page for authentication
    mainWindow.loadFile('renderer/login.html');
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Handle login
ipcMain.handle('login', async (event, password) => {
  const savedPassword = store.get('userPassword');
  
  if (!savedPassword) {
    // First time setup - save password
    store.set('userPassword', password);
    isAuthenticated = true;
    return { success: true, message: 'Password set successfully!' };
  } else {
    // Verify password
    if (password === savedPassword) {
      isAuthenticated = true;
      return { success: true, message: 'Login successful!' };
    } else {
      return { success: false, message: 'Incorrect password!' };
    }
  }
});

// Load CRM after successful login
ipcMain.handle('load-crm', async () => {
  if (isAuthenticated) {
    mainWindow.loadFile('renderer/crm.html');
    return { success: true };
  }
  return { success: false };
});

// Handle password change
ipcMain.handle('change-password', async (event, oldPassword, newPassword) => {
  const savedPassword = store.get('userPassword');
  
  if (oldPassword === savedPassword) {
    store.set('userPassword', newPassword);
    return { success: true, message: 'Password changed successfully!' };
  }
  return { success: false, message: 'Incorrect old password!' };
});

// Handle password reset (requires confirmation)
ipcMain.handle('reset-password', async () => {
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'warning',
    buttons: ['Cancel', 'Reset'],
    defaultId: 0,
    title: 'Reset Password',
    message: 'Are you sure you want to reset your password?',
    detail: 'This will clear your saved password and you will need to set a new one.'
  });

  if (result.response === 1) {
    store.delete('userPassword');
    return { success: true, message: 'Password reset. Please set a new password.' };
  }
  return { success: false };
});

// Handle data export
ipcMain.handle('export-data', async (event, data) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export CRM Data',
    defaultPath: `CRM-Backup-${new Date().toISOString().split('T')[0]}.json`,
    filters: [
      { name: 'JSON Files', extensions: ['json'] }
    ]
  });

  if (!result.canceled && result.filePath) {
    const fs = require('fs');
    fs.writeFileSync(result.filePath, data);
    return { success: true, path: result.filePath };
  }
  return { success: false };
});

// Handle data import
ipcMain.handle('import-data', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Import CRM Data',
    filters: [
      { name: 'JSON Files', extensions: ['json'] }
    ],
    properties: ['openFile']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const fs = require('fs');
    const data = fs.readFileSync(result.filePaths[0], 'utf8');
    return { success: true, data };
  }
  return { success: false };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

