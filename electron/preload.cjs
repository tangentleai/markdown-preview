const { contextBridge, ipcRenderer } = require('electron')

const openDocumentFromFile = async (file) => {
  if (!file) {
    throw new Error('FILE_EMPTY')
  }
  const filePath = file.path
  if (filePath) {
    return ipcRenderer.invoke('desktop-open-document-from-path', filePath)
  }
  const content = typeof file.text === 'function' ? await file.text() : ''
  return ipcRenderer.invoke('desktop-open-document-from-buffer', { name: file.name, content })
}

contextBridge.exposeInMainWorld('desktopBridge', {
  openDocument: () => ipcRenderer.invoke('desktop-open-document'),
  openDocumentFromFile,
  openRecentDocument: (handle) => ipcRenderer.invoke('desktop-open-recent-document', handle),
  saveDocument: (handle, content) => ipcRenderer.invoke('desktop-save-document', handle, content),
  saveDocumentAs: (suggestedName, content) =>
    ipcRenderer.invoke('desktop-save-document-as', suggestedName, content),
  listRecentDocuments: () => ipcRenderer.invoke('desktop-list-recents')
})
