// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer, ipcMain } = require('electron')

contextBridge.exposeInMainWorld('api', {

    sendUserData: (data) =>
        ipcRenderer.invoke("recieve-data", data),

    askForData: (data) =>
        ipcRenderer.send("sendme-data", data),
    

});

contextBridge.exposeInMainWorld('db', {
  getAll: () => ipcRenderer.invoke('db:getAll'),
  put: (doc) => ipcRenderer.invoke('db:put', doc),
  remove: (id, rev) => ipcRenderer.invoke('db:remove', id, rev),
  allDocs: (query) => ipcRenderer.invoke('db:allDocs', query),
    findByPrefix(prefix) {
    return ipcRenderer.invoke('db:findByPrefix', prefix);
  },
});

