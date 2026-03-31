// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {

    sendData: (data, type) =>

        ipcRenderer.invoke("db-write", data, type),

    askForData: (data) =>
        ipcRenderer.send("sendme-data", data),
    

});

contextBridge.exposeInMainWorld('db', {
  getAll: () => ipcRenderer.invoke('db:getAll'),
  put: (doc) => ipcRenderer.invoke('db:put', doc),
  remove: (id, rev) => ipcRenderer.invoke('db:remove', id, rev),
  removeShit: (id) => ipcRenderer.invoke('db:removeShit', id),
  allDocs: (query) => ipcRenderer.invoke('db:allDocs', query),
  findByPrefix(prefix) {return ipcRenderer.invoke('db:findByPrefix', prefix);},
});

