const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    generatePDF: (filePath, cpi) => ipcRenderer.invoke('generate-pdf', filePath, cpi),
    onPDFReady: (callback) => ipcRenderer.on('pdf-ready', (_, path) => callback(path)),
    onPDFError: (callback) => ipcRenderer.on('pdf-error', (_, error) => callback(error)),
});
