import type {
  CoreFileHandle,
  OpenedDocument,
  RecentDocument,
  SaveResult
} from '../core/fileService'
import type { PlatformAdapter, MenuEventHandlers } from './platform-adapter'

export interface DesktopBridge {
  openDocument: () => Promise<OpenedDocument>
  openDocumentFromFile: (file: File) => Promise<OpenedDocument>
  openRecentDocument: (handle: CoreFileHandle) => Promise<OpenedDocument>
  saveDocument: (handle: CoreFileHandle, content: string) => Promise<SaveResult>
  saveDocumentAs: (suggestedName: string, content: string) => Promise<SaveResult>
  listRecentDocuments: () => Promise<RecentDocument[]>
  onMenuOpen: (callback: () => void) => () => void
  onMenuSave: (callback: () => void) => () => void
  onMenuSaveAs: (callback: () => void) => () => void
  onMenuFind: (callback: () => void) => () => void
  onMenuModeWysiwyg: (callback: () => void) => () => void
  onMenuModeDualPane: (callback: () => void) => () => void
}

export const createDesktopAdapter = (bridge: DesktopBridge): PlatformAdapter => ({
  isDesktop: true,
  fileService: {
    openDocument: bridge.openDocument,
    openDocumentFromFile: bridge.openDocumentFromFile,
    openRecentDocument: bridge.openRecentDocument,
    saveDocument: bridge.saveDocument,
    saveDocumentAs: bridge.saveDocumentAs,
    listRecentDocuments: bridge.listRecentDocuments
  },
  setupMenuHandlers: (handlers: MenuEventHandlers) => {
    const unregisterFns: (() => void)[] = []

    if (handlers.onOpen) {
      unregisterFns.push(bridge.onMenuOpen(handlers.onOpen))
    }
    if (handlers.onSave) {
      unregisterFns.push(bridge.onMenuSave(handlers.onSave))
    }
    if (handlers.onSaveAs) {
      unregisterFns.push(bridge.onMenuSaveAs(handlers.onSaveAs))
    }
    if (handlers.onFind) {
      unregisterFns.push(bridge.onMenuFind(handlers.onFind))
    }
    if (handlers.onModeWysiwyg) {
      unregisterFns.push(bridge.onMenuModeWysiwyg(handlers.onModeWysiwyg))
    }
    if (handlers.onModeDualPane) {
      unregisterFns.push(bridge.onMenuModeDualPane(handlers.onModeDualPane))
    }

    return () => {
      unregisterFns.forEach(fn => fn())
    }
  }
})
