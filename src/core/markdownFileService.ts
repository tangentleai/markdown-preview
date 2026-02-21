export interface MarkdownWritable {
  write: (data: Blob | string) => Promise<void>
  close: () => Promise<void>
}

export interface MarkdownFileHandle {
  name: string
  getFile: () => Promise<File>
  createWritable: () => Promise<MarkdownWritable>
}

export interface OpenFilePickerApi {
  showOpenFilePicker?: (options: {
    multiple: boolean
    excludeAcceptAllOption: boolean
    types: Array<{
      description: string
      accept: Record<string, string[]>
    }>
  }) => Promise<MarkdownFileHandle[]>
}

export interface SaveFilePickerApi {
  showSaveFilePicker?: (options: {
    suggestedName: string
    excludeAcceptAllOption: boolean
    types: Array<{
      description: string
      accept: Record<string, string[]>
    }>
  }) => Promise<MarkdownFileHandle>
}

export const MARKDOWN_FILE_ACCEPT = {
  'text/markdown': ['.md', '.markdown']
}

const decodeUtf8WithBuffer = (buffer: ArrayBuffer): string => {
  const maybeBuffer = (globalThis as { Buffer?: { from: (input: ArrayBuffer) => { toString: (encoding: string) => string } } }).Buffer
  if (!maybeBuffer) {
    throw new Error('TEXT_DECODER_UNAVAILABLE')
  }

  return maybeBuffer.from(buffer).toString('utf-8')
}

export const isMarkdownFileName = (fileName: string): boolean => /\.(md|markdown)$/i.test(fileName.trim())

export const decodeUtf8Markdown = (buffer: ArrayBuffer): string => {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder('utf-8').decode(buffer)
  }

  return decodeUtf8WithBuffer(buffer)
}

export const normalizeMarkdownFileName = (fileName: string): string => {
  const trimmed = fileName.trim() || 'untitled'
  return isMarkdownFileName(trimmed) ? trimmed : `${trimmed}.md`
}

export const readMarkdownFile = async (file: File): Promise<string> => {
  const maybeArrayBuffer = (file as { arrayBuffer?: () => Promise<ArrayBuffer> }).arrayBuffer
  if (typeof maybeArrayBuffer === 'function') {
    const contentBuffer = await maybeArrayBuffer.call(file)
    return decodeUtf8Markdown(contentBuffer)
  }

  const maybeText = (file as { text?: () => Promise<string> }).text
  if (typeof maybeText === 'function') {
    return maybeText.call(file)
  }

  throw new Error('FILE_READ_UNSUPPORTED')
}

export const openMarkdownViaPicker = async (api: OpenFilePickerApi): Promise<{
  handle: MarkdownFileHandle
  file: File
  content: string
}> => {
  if (!api.showOpenFilePicker) {
    throw new Error('OPEN_PICKER_UNSUPPORTED')
  }

  const [handle] = await api.showOpenFilePicker({
    multiple: false,
    excludeAcceptAllOption: true,
    types: [
      {
        description: 'Markdown Files',
        accept: MARKDOWN_FILE_ACCEPT
      }
    ]
  })

  if (!handle) {
    throw new Error('OPEN_PICKER_EMPTY')
  }

  const file = await handle.getFile()
  if (!isMarkdownFileName(file.name)) {
    throw new Error('UNSUPPORTED_FILE_TYPE')
  }

  const content = await readMarkdownFile(file)
  return { handle, file, content }
}

const writeMarkdownToHandle = async (handle: MarkdownFileHandle, markdown: string): Promise<void> => {
  const writable = await handle.createWritable()
  await writable.write(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }))
  await writable.close()
}

export const saveMarkdownViaHandle = async (
  handle: MarkdownFileHandle,
  markdown: string
): Promise<MarkdownFileHandle> => {
  await writeMarkdownToHandle(handle, markdown)
  return handle
}

export const saveMarkdownAsViaPicker = async (
  api: SaveFilePickerApi,
  markdown: string,
  suggestedName: string
): Promise<MarkdownFileHandle> => {
  if (!api.showSaveFilePicker) {
    throw new Error('SAVE_PICKER_UNSUPPORTED')
  }

  const handle = await api.showSaveFilePicker({
    suggestedName: normalizeMarkdownFileName(suggestedName),
    excludeAcceptAllOption: true,
    types: [
      {
        description: 'Markdown Files',
        accept: MARKDOWN_FILE_ACCEPT
      }
    ]
  })

  await writeMarkdownToHandle(handle, markdown)
  return handle
}
