import type { FileServiceContract, OpenedDocument } from '../core/fileService'

export interface PlatformFileService extends FileServiceContract {
  openDocumentFromFile: (file: File) => Promise<OpenedDocument>
}

export interface PlatformAdapter {
  fileService: PlatformFileService
}
