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
  listRecentDocuments: () => ipcRenderer.invoke('desktop-list-recents'),
  onMenuOpen: (callback) => {
    ipcRenderer.on('menu-open', callback)
    return () => ipcRenderer.removeListener('menu-open', callback)
  },
  onMenuSave: (callback) => {
    ipcRenderer.on('menu-save', callback)
    return () => ipcRenderer.removeListener('menu-save', callback)
  },
  onMenuSaveAs: (callback) => {
    ipcRenderer.on('menu-save-as', callback)
    return () => ipcRenderer.removeListener('menu-save-as', callback)
  },
  onMenuFind: (callback) => {
    ipcRenderer.on('menu-find', callback)
    return () => ipcRenderer.removeListener('menu-find', callback)
  },
  onMenuModeWysiwyg: (callback) => {
    ipcRenderer.on('menu-mode-wysiwyg', callback)
    return () => ipcRenderer.removeListener('menu-mode-wysiwyg', callback)
  },
  onMenuModeDualPane: (callback) => {
    ipcRenderer.on('menu-mode-dual-pane', callback)
    return () => ipcRenderer.removeListener('menu-mode-dual-pane', callback)
  }
})
