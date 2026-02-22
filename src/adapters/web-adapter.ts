import type {
  CoreFileHandle,
  OpenedDocument,
  RecentDocument,
  SaveResult
} from '../core/fileService'
import {
  normalizeMarkdownFileName,
  openMarkdownViaPicker,
  readMarkdownFile,
  saveMarkdownAsViaPicker,
  saveMarkdownViaHandle,
  type MarkdownFileHandle,
  type OpenFilePickerApi,
  type SaveFilePickerApi
} from '../core/markdownFileService'
import type { PlatformAdapter } from './platform-adapter'

export interface WebAdapterDependencies {
  openFilePicker: OpenFilePickerApi
  saveFilePicker: SaveFilePickerApi
  fallbackOpenFile?: () => Promise<File | null>
  downloadFile?: (fileName: string, content: string) => void
  now?: () => Date
  recentLimit?: number
}

const defaultDownloadFile = (fileName: string, content: string): void => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export const createWebAdapter = (dependencies: WebAdapterDependencies): PlatformAdapter => {
  const now = dependencies.now ?? (() => new Date())
  const recentLimit = dependencies.recentLimit ?? 10
  const downloadFile = dependencies.downloadFile ?? defaultDownloadFile
  const handleMap = new Map<string, MarkdownFileHandle | null>()
  let recentDocuments: RecentDocument[] = []
  let counter = 0

  const createHandleId = (): string => `web-${now().getTime()}-${counter++}`

  const recordRecent = (handle: CoreFileHandle, timestamp: string): void => {
    recentDocuments = [
      { handle, accessedAt: timestamp },
      ...recentDocuments.filter((item) => item.handle.id !== handle.id)
    ].slice(0, recentLimit)
  }

  const registerHandle = (handle: CoreFileHandle, platformHandle: MarkdownFileHandle | null): void => {
    handleMap.set(handle.id, platformHandle)
  }

  const openDocument = async (): Promise<OpenedDocument> => {
    const openedAt = now().toISOString()
    try {
      const { handle, file, content } = await openMarkdownViaPicker(dependencies.openFilePicker)
      const coreHandle = { id: createHandleId(), name: file.name }
      registerHandle(coreHandle, handle)
      recordRecent(coreHandle, openedAt)
      return { handle: coreHandle, content, openedAt }
    } catch (error) {
      if ((error as Error).message === 'OPEN_PICKER_UNSUPPORTED' && dependencies.fallbackOpenFile) {
        const fallbackFile = await dependencies.fallbackOpenFile()
        if (!fallbackFile) {
          throw new DOMException('User aborted open', 'AbortError')
        }
        const content = await readMarkdownFile(fallbackFile)
        const coreHandle = { id: createHandleId(), name: fallbackFile.name }
        registerHandle(coreHandle, null)
        recordRecent(coreHandle, openedAt)
        return { handle: coreHandle, content, openedAt }
      }
      throw error
    }
  }

  const openDocumentFromFile = async (file: File): Promise<OpenedDocument> => {
    const openedAt = now().toISOString()
    const content = await readMarkdownFile(file)
    const coreHandle = { id: createHandleId(), name: file.name }
    registerHandle(coreHandle, null)
    recordRecent(coreHandle, openedAt)
    return { handle: coreHandle, content, openedAt }
  }

  const saveDocument = async (handle: CoreFileHandle, content: string): Promise<SaveResult> => {
    const savedAt = now().toISOString()
    const mappedHandle = handleMap.get(handle.id)
    if (mappedHandle === undefined) {
      throw new Error('HANDLE_UNTRACKED')
    }
    if (mappedHandle) {
      await saveMarkdownViaHandle(mappedHandle, content)
    } else {
      downloadFile(handle.name, content)
    }
    recordRecent(handle, savedAt)
    return { handle, savedAt }
  }

  const saveDocumentAs = async (suggestedName: string, content: string): Promise<SaveResult> => {
    const savedAt = now().toISOString()
    try {
      const savedHandle = await saveMarkdownAsViaPicker(dependencies.saveFilePicker, content, suggestedName)
      const coreHandle = { id: createHandleId(), name: savedHandle.name }
      registerHandle(coreHandle, savedHandle)
      recordRecent(coreHandle, savedAt)
      return { handle: coreHandle, savedAt }
    } catch (error) {
      if ((error as Error).message === 'SAVE_PICKER_UNSUPPORTED') {
        const normalizedName = normalizeMarkdownFileName(suggestedName)
        const coreHandle = { id: createHandleId(), name: normalizedName }
        registerHandle(coreHandle, null)
        downloadFile(normalizedName, content)
        recordRecent(coreHandle, savedAt)
        return { handle: coreHandle, savedAt }
      }
      throw error
    }
  }

  const openRecentDocument = async (handle: CoreFileHandle): Promise<OpenedDocument> => {
    const mappedHandle = handleMap.get(handle.id)
    if (mappedHandle === undefined) {
      throw new Error('HANDLE_UNTRACKED')
    }
    if (!mappedHandle) {
      throw new Error('HANDLE_UNAVAILABLE')
    }
    const file = await mappedHandle.getFile()
    const content = await readMarkdownFile(file)
    const openedAt = now().toISOString()
    recordRecent(handle, openedAt)
    return { handle, content, openedAt }
  }

  const listRecentDocuments = async (): Promise<RecentDocument[]> => recentDocuments

  return {
    fileService: {
      openDocument,
      openDocumentFromFile,
      openRecentDocument,
      saveDocument,
      saveDocumentAs,
      listRecentDocuments
    }
  }
}
