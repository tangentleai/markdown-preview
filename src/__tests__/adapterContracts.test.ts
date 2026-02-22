import type { MarkdownDocument } from '../core/documentModel'
import { createCoreBoundaryDefinition, type CoreBoundaryContracts } from '../core/contracts'
import { replaceAndRender } from '../core/runtime'
import { createDesktopAdapter } from '../adapters/desktop-adapter'
import { createWebAdapter } from '../adapters/web-adapter'
import type { PlatformAdapter } from '../adapters/platform-adapter'
import type { MarkdownFileHandle, MarkdownWritable } from '../core/markdownFileService'

const buildMockMarkdownFile = (name: string, content: string): File => {
  const contentBuffer = Uint8Array.from(Buffer.from(content, 'utf-8')).buffer
  return {
    name,
    arrayBuffer: jest.fn().mockResolvedValue(contentBuffer),
    text: jest.fn().mockResolvedValue(content)
  } as unknown as File
}

const createDocument = (text: string): MarkdownDocument => ({
  blocks: [{ type: 'paragraph', children: [{ type: 'text', value: text }] }]
})

const buildCoreContracts = (fileService: PlatformAdapter['fileService']): CoreBoundaryContracts => ({
  documentModel: {
    parseMarkdown: jest.fn((markdown: string) => createDocument(markdown)),
    serializeMarkdown: jest.fn((document: MarkdownDocument) => {
      const block = document.blocks[0]
      if (block.type !== 'paragraph') {
        return ''
      }
      return block.children.map((child) => (child.type === 'text' ? child.value : '')).join('')
    })
  },
  renderPipeline: {
    render: jest.fn(async () => ({
      format: 'html' as const,
      html: '<p>hello desktop core</p>'
    }))
  },
  findReplace: {
    validateQuery: jest.fn(() => null),
    findMatches: jest.fn(() => []),
    replaceCurrent: jest.fn(() => ({ text: '', replacements: 0 })),
    replaceAll: jest.fn(() => ({ text: 'hello desktop core', replacements: 1 }))
  },
  fileService
})

describe('adapter contracts', () => {
  it('web adapter implements file contract and tracks recents', async () => {
    const file = buildMockMarkdownFile('opened.md', '# Opened')
    const write = jest.fn<Promise<void>, [Blob | string]>().mockResolvedValue()
    const close = jest.fn<Promise<void>, []>().mockResolvedValue()
    const writable: MarkdownWritable = { write, close }
    const handle: MarkdownFileHandle = {
      name: file.name,
      getFile: jest.fn().mockResolvedValue(file),
      createWritable: jest.fn().mockResolvedValue(writable)
    }
    const saveAsHandle: MarkdownFileHandle = {
      name: 'saved-as.md',
      getFile: jest.fn().mockResolvedValue(file),
      createWritable: jest.fn().mockResolvedValue(writable)
    }
    const showOpenFilePicker = jest.fn().mockResolvedValue([handle])
    const showSaveFilePicker = jest.fn().mockResolvedValue(saveAsHandle)
    const downloadFile = jest.fn()
    const now = () => new Date('2026-02-22T00:00:00.000Z')

    const adapter = createWebAdapter({
      openFilePicker: { showOpenFilePicker },
      saveFilePicker: { showSaveFilePicker },
      downloadFile,
      now
    })

    const opened = await adapter.fileService.openDocument()
    expect(showOpenFilePicker).toHaveBeenCalledTimes(1)
    expect(opened.content).toBe('# Opened')

    const reopened = await adapter.fileService.openRecentDocument(opened.handle)
    expect(reopened.content).toBe('# Opened')

    await adapter.fileService.saveDocument(opened.handle, '# Updated')
    expect(write).toHaveBeenCalledTimes(1)
    expect(close).toHaveBeenCalledTimes(1)

    const savedAs = await adapter.fileService.saveDocumentAs('note', '# Saved')
    expect(showSaveFilePicker).toHaveBeenCalledTimes(1)
    expect(savedAs.handle.name).toBe('saved-as.md')

    const directOpened = await adapter.fileService.openDocumentFromFile(buildMockMarkdownFile('fallback.md', '# Fallback'))
    expect(directOpened.handle.name).toBe('fallback.md')

    const recents = await adapter.fileService.listRecentDocuments()
    expect(recents.map((item) => item.handle.name)).toEqual(
      expect.arrayContaining(['opened.md', 'saved-as.md', 'fallback.md'])
    )
  })

  it('desktop adapter forwards bridge contract', async () => {
    const openDocument = jest.fn().mockResolvedValue({
      handle: { id: 'desktop-1', name: 'desktop.md' },
      content: '# Desktop',
      openedAt: new Date(0).toISOString()
    })
    const openDocumentFromFile = jest.fn().mockResolvedValue({
      handle: { id: 'desktop-2', name: 'dropped.md' },
      content: '# Dropped',
      openedAt: new Date(0).toISOString()
    })
    const saveDocument = jest.fn().mockResolvedValue({
      handle: { id: 'desktop-1', name: 'desktop.md' },
      savedAt: new Date(0).toISOString()
    })
    const saveDocumentAs = jest.fn().mockResolvedValue({
      handle: { id: 'desktop-3', name: 'saved.md' },
      savedAt: new Date(0).toISOString()
    })
    const openRecentDocument = jest.fn().mockResolvedValue({
      handle: { id: 'desktop-1', name: 'desktop.md' },
      content: '# Desktop',
      openedAt: new Date(0).toISOString()
    })
    const listRecentDocuments = jest.fn().mockResolvedValue([])

    const adapter = createDesktopAdapter({
      openDocument,
      openDocumentFromFile,
      openRecentDocument,
      saveDocument,
      saveDocumentAs,
      listRecentDocuments
    })

    await adapter.fileService.openDocument()
    await adapter.fileService.openDocumentFromFile(buildMockMarkdownFile('dropped.md', '# Drop'))
    await adapter.fileService.openRecentDocument({ id: 'desktop-1', name: 'desktop.md' })
    await adapter.fileService.saveDocument({ id: 'desktop-1', name: 'desktop.md' }, '# Updated')
    await adapter.fileService.saveDocumentAs('saved.md', '# Saved')
    await adapter.fileService.listRecentDocuments()

    expect(openDocument).toHaveBeenCalledTimes(1)
    expect(openDocumentFromFile).toHaveBeenCalledTimes(1)
    expect(openRecentDocument).toHaveBeenCalledTimes(1)
    expect(saveDocument).toHaveBeenCalledTimes(1)
    expect(saveDocumentAs).toHaveBeenCalledTimes(1)
    expect(listRecentDocuments).toHaveBeenCalledTimes(1)
  })

  it('core boundary accepts adapter swap without contract changes', async () => {
    const webAdapter = createWebAdapter({
      openFilePicker: {},
      saveFilePicker: {},
      downloadFile: jest.fn()
    })
    const desktopAdapter = createDesktopAdapter({
      openDocument: jest.fn(async () => ({
        handle: { id: 'desktop-1', name: 'desktop.md' },
        content: '# Desktop',
        openedAt: new Date(0).toISOString()
      })),
      openDocumentFromFile: jest.fn(async () => ({
        handle: { id: 'desktop-2', name: 'dropped.md' },
        content: '# Dropped',
        openedAt: new Date(0).toISOString()
      })),
      openRecentDocument: jest.fn(async () => ({
        handle: { id: 'desktop-1', name: 'desktop.md' },
        content: '# Desktop',
        openedAt: new Date(0).toISOString()
      })),
      saveDocument: jest.fn(async (handle) => ({
        handle,
        savedAt: new Date(0).toISOString()
      })),
      saveDocumentAs: jest.fn(async (suggestedName: string) => ({
        handle: { id: 'desktop-3', name: suggestedName },
        savedAt: new Date(0).toISOString()
      })),
      listRecentDocuments: jest.fn(async () => [])
    })

    const webBoundary = createCoreBoundaryDefinition(buildCoreContracts(webAdapter.fileService))
    const desktopBoundary = createCoreBoundaryDefinition(buildCoreContracts(desktopAdapter.fileService))

    const webResult = await replaceAndRender(webBoundary, {
      markdown: 'hello web core',
      query: 'web',
      replacement: 'desktop'
    })
    const desktopResult = await replaceAndRender(desktopBoundary, {
      markdown: 'hello web core',
      query: 'web',
      replacement: 'desktop'
    })

    expect(webResult).toEqual({
      markdown: 'hello desktop core',
      html: '<p>hello desktop core</p>',
      replacements: 1
    })
    expect(desktopResult).toEqual(webResult)
  })
})
