const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  login: (password) => ipcRenderer.invoke('login', password),
  loadCRM: () => ipcRenderer.invoke('load-crm'),
  changePassword: (oldPassword, newPassword) => ipcRenderer.invoke('change-password', oldPassword, newPassword),
  resetPassword: () => ipcRenderer.invoke('reset-password'),
  exportData: (data) => ipcRenderer.invoke('export-data', data),
  importData: () => ipcRenderer.invoke('import-data')
});

