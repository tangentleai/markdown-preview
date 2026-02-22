import type {
  CoreFileHandle,
  OpenedDocument,
  RecentDocument,
  SaveResult
} from '../core/fileService'
import type { PlatformAdapter } from './platform-adapter'

export interface DesktopBridge {
  openDocument: () => Promise<OpenedDocument>
  openDocumentFromFile: (file: File) => Promise<OpenedDocument>
  openRecentDocument: (handle: CoreFileHandle) => Promise<OpenedDocument>
  saveDocument: (handle: CoreFileHandle, content: string) => Promise<SaveResult>
  saveDocumentAs: (suggestedName: string, content: string) => Promise<SaveResult>
  listRecentDocuments: () => Promise<RecentDocument[]>
}

export const createDesktopAdapter = (bridge: DesktopBridge): PlatformAdapter => ({
  fileService: {
    openDocument: bridge.openDocument,
    openDocumentFromFile: bridge.openDocumentFromFile,
    openRecentDocument: bridge.openRecentDocument,
    saveDocument: bridge.saveDocument,
    saveDocumentAs: bridge.saveDocumentAs,
    listRecentDocuments: bridge.listRecentDocuments
  }
})
