export interface CoreFileHandle {
  id: string
  name: string
}

export interface OpenedDocument {
  handle: CoreFileHandle
  content: string
  openedAt: string
}

export interface SaveResult {
  handle: CoreFileHandle
  savedAt: string
}

export interface RecentDocument {
  handle: CoreFileHandle
  accessedAt: string
}

export interface FileServiceContract {
  openDocument: () => Promise<OpenedDocument>
  saveDocument: (handle: CoreFileHandle, content: string) => Promise<SaveResult>
  saveDocumentAs: (suggestedName: string, content: string) => Promise<SaveResult>
  listRecentDocuments: () => Promise<RecentDocument[]>
}
