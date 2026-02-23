import type { FileServiceContract, OpenedDocument } from '../core/fileService'

export interface PlatformFileService extends FileServiceContract {
  openDocumentFromFile: (file: File) => Promise<OpenedDocument>
}

export interface MenuEventHandlers {
  onOpen?: () => void
  onSave?: () => void
  onSaveAs?: () => void
  onFind?: () => void
  onModeWysiwyg?: () => void
  onModeDualPane?: () => void
}

export interface PlatformAdapter {
  fileService: PlatformFileService
  setupMenuHandlers?: (handlers: MenuEventHandlers) => () => void
  isDesktop?: boolean
}
