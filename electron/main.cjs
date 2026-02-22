const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs/promises')

const recentLimit = 10
const handleMap = new Map()
let recentDocuments = []
let counter = 0

const createHandleId = () => `desktop-${Date.now()}-${counter++}`

const recordRecent = (handle, timestamp) => {
  recentDocuments = [
    { handle, accessedAt: timestamp },
    ...recentDocuments.filter((item) => item.handle.id !== handle.id)
  ].slice(0, recentLimit)
}

const createAbortError = () => {
  const error = new Error('AbortError')
  error.name = 'AbortError'
  return error
}

const openDocumentFromPath = async (filePath) => {
  const content = await fs.readFile(filePath, 'utf-8')
  const openedAt = new Date().toISOString()
  const handle = { id: createHandleId(), name: path.basename(filePath) }
  handleMap.set(handle.id, filePath)
  recordRecent(handle, openedAt)
  return { handle, content, openedAt }
}

const openDocumentFromBuffer = async (name, content) => {
  const openedAt = new Date().toISOString()
  const handle = { id: createHandleId(), name: name || 'untitled.md' }
  handleMap.set(handle.id, null)
  recordRecent(handle, openedAt)
  return { handle, content, openedAt }
}

const registerIpc = () => {
  ipcMain.handle('desktop-open-document', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }]
    })
    if (result.canceled || result.filePaths.length === 0) {
      throw createAbortError()
    }
    return openDocumentFromPath(result.filePaths[0])
  })

  ipcMain.handle('desktop-open-document-from-path', async (_event, filePath) => {
    if (!filePath) {
      throw new Error('PATH_EMPTY')
    }
    return openDocumentFromPath(filePath)
  })

  ipcMain.handle('desktop-open-document-from-buffer', async (_event, payload) => {
    if (!payload || typeof payload.content !== 'string') {
      throw new Error('BUFFER_EMPTY')
    }
    return openDocumentFromBuffer(payload.name, payload.content)
  })

  ipcMain.handle('desktop-open-recent-document', async (_event, handle) => {
    const filePath = handleMap.get(handle.id)
    if (filePath === undefined) {
      throw new Error('HANDLE_UNTRACKED')
    }
    if (!filePath) {
      throw new Error('HANDLE_UNAVAILABLE')
    }
    const content = await fs.readFile(filePath, 'utf-8')
    const openedAt = new Date().toISOString()
    recordRecent(handle, openedAt)
    return { handle, content, openedAt }
  })

  ipcMain.handle('desktop-save-document', async (_event, handle, content) => {
    const filePath = handleMap.get(handle.id)
    if (filePath === undefined) {
      throw new Error('HANDLE_UNTRACKED')
    }
    if (!filePath) {
      throw new Error('HANDLE_UNAVAILABLE')
    }
    await fs.writeFile(filePath, content ?? '', 'utf-8')
    const savedAt = new Date().toISOString()
    recordRecent(handle, savedAt)
    return { handle, savedAt }
  })

  ipcMain.handle('desktop-save-document-as', async (_event, suggestedName, content) => {
    const result = await dialog.showSaveDialog({
      defaultPath: suggestedName || 'untitled.md',
      filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }]
    })
    if (result.canceled || !result.filePath) {
      throw createAbortError()
    }
    await fs.writeFile(result.filePath, content ?? '', 'utf-8')
    const savedAt = new Date().toISOString()
    const handle = { id: createHandleId(), name: path.basename(result.filePath) }
    handleMap.set(handle.id, result.filePath)
    recordRecent(handle, savedAt)
    return { handle, savedAt }
  })

  ipcMain.handle('desktop-list-recents', async () => recentDocuments)
}

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs')
    }
  })

  const devUrl = process.env.VITE_DEV_SERVER_URL
  if (devUrl) {
    await win.loadURL(devUrl)
  } else {
    await win.loadFile(path.join(__dirname, '..', 'dist', 'desktop.html'))
  }
}

app.whenReady().then(() => {
  registerIpc()
  void createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
