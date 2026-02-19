import {
  decodeUtf8Markdown,
  isMarkdownFileName,
  MARKDOWN_FILE_ACCEPT,
  normalizeMarkdownFileName,
  openMarkdownViaPicker,
  saveMarkdownAsViaPicker,
  saveMarkdownViaHandle,
  type MarkdownFileHandle,
  type MarkdownWritable,
  readMarkdownFile
} from '../utils/markdownFileIO'

const buildMockMarkdownFile = (name: string, content: string): File => {
  const contentBuffer = Uint8Array.from(Buffer.from(content, 'utf-8')).buffer
  return {
    name,
    arrayBuffer: jest.fn().mockResolvedValue(contentBuffer),
    text: jest.fn().mockResolvedValue(content)
  } as unknown as File
}

describe('markdownFileIO', () => {
  it('should detect markdown file names and normalize target name', () => {
    expect(isMarkdownFileName('notes.md')).toBe(true)
    expect(isMarkdownFileName('guide.markdown')).toBe(true)
    expect(isMarkdownFileName('README.TXT')).toBe(false)

    expect(normalizeMarkdownFileName('project-notes')).toBe('project-notes.md')
    expect(normalizeMarkdownFileName('draft.markdown')).toBe('draft.markdown')
  })

  it('should decode UTF-8 markdown buffers', async () => {
    const utf8Buffer = Uint8Array.from(Buffer.from('你好, Markdown', 'utf-8')).buffer
    expect(decodeUtf8Markdown(utf8Buffer)).toBe('你好, Markdown')
  })

  it('should read markdown file content using UTF-8 decoding', async () => {
    const file = buildMockMarkdownFile('sample.md', '# 标题\n\n正文')
    await expect(readMarkdownFile(file)).resolves.toBe('# 标题\n\n正文')
  })

  it('should open markdown via picker and enforce extension validation', async () => {
    const file = buildMockMarkdownFile('picked.md', '# Opened')
    const handle: MarkdownFileHandle = {
      name: file.name,
      getFile: jest.fn().mockResolvedValue(file),
      createWritable: jest.fn()
    }

    const showOpenFilePicker = jest.fn().mockResolvedValue([handle])
    const opened = await openMarkdownViaPicker({ showOpenFilePicker })

    expect(showOpenFilePicker).toHaveBeenCalledWith({
      multiple: false,
      excludeAcceptAllOption: true,
      types: [{ description: 'Markdown Files', accept: MARKDOWN_FILE_ACCEPT }]
    })
    expect(opened.file.name).toBe('picked.md')
    expect(opened.content).toBe('# Opened')

    const invalidFileHandle: MarkdownFileHandle = {
      name: 'invalid.txt',
      getFile: jest.fn().mockResolvedValue(buildMockMarkdownFile('invalid.txt', 'bad')),
      createWritable: jest.fn()
    }
    await expect(
      openMarkdownViaPicker({ showOpenFilePicker: jest.fn().mockResolvedValue([invalidFileHandle]) })
    ).rejects.toThrow('UNSUPPORTED_FILE_TYPE')
  })

  it('should save markdown via existing handle and Save As picker', async () => {
    const write = jest.fn<Promise<void>, [Blob | string]>().mockResolvedValue()
    const close = jest.fn<Promise<void>, []>().mockResolvedValue()
    const writable: MarkdownWritable = { write, close }

    const existingHandle: MarkdownFileHandle = {
      name: 'current.md',
      getFile: jest.fn().mockResolvedValue(buildMockMarkdownFile('current.md', '')),
      createWritable: jest.fn().mockResolvedValue(writable)
    }

    await expect(saveMarkdownViaHandle(existingHandle, '# Saved')).resolves.toBe(existingHandle)
    expect(write).toHaveBeenCalledTimes(1)
    expect(close).toHaveBeenCalledTimes(1)

    const saveAsHandle: MarkdownFileHandle = {
      name: 'renamed.md',
      getFile: jest.fn().mockResolvedValue(buildMockMarkdownFile('renamed.md', '')),
      createWritable: jest.fn().mockResolvedValue(writable)
    }
    const showSaveFilePicker = jest.fn().mockResolvedValue(saveAsHandle)

    await expect(saveMarkdownAsViaPicker({ showSaveFilePicker }, '# Save As', 'renamed')).resolves.toBe(saveAsHandle)
    expect(showSaveFilePicker).toHaveBeenCalledWith({
      suggestedName: 'renamed.md',
      excludeAcceptAllOption: true,
      types: [{ description: 'Markdown Files', accept: MARKDOWN_FILE_ACCEPT }]
    })
  })
})
