import {
  CORE_CAPABILITY_INVENTORY,
  createCoreBoundaryDefinition,
  replaceAndRender,
  type CoreBoundaryContracts,
  type MarkdownDocument
} from '../core'

const createDocument = (text: string): MarkdownDocument => ({
  blocks: [{ type: 'paragraph', children: [{ type: 'text', value: text }] }]
})

describe('core boundary contracts', () => {
  it('defines platform-agnostic capability inventory', () => {
    expect(CORE_CAPABILITY_INVENTORY.map((item) => item.id)).toEqual([
      'document-model',
      'render-pipeline',
      'find-replace',
      'file-service'
    ])
    expect(CORE_CAPABILITY_INVENTORY.every((item) => item.platformAgnostic)).toBe(true)
  })

  it('allows mock implementations to replace the core contracts', async () => {
    const parseMarkdown = jest.fn((markdown: string) => createDocument(markdown))
    const serializeMarkdown = jest.fn((document: MarkdownDocument) => {
      const block = document.blocks[0]
      if (block.type !== 'paragraph') {
        return ''
      }
      return block.children.map((child) => (child.type === 'text' ? child.value : '')).join('')
    })

    const replaceAll = jest.fn(() => ({
      text: 'hello desktop core',
      replacements: 1
    }))
    const render = jest.fn(() => ({
      format: 'html' as const,
      html: '<p>hello desktop core</p>'
    }))

    const contracts: CoreBoundaryContracts = {
      documentModel: {
        parseMarkdown,
        serializeMarkdown
      },
      renderPipeline: {
        render
      },
      findReplace: {
        validateQuery: jest.fn(() => null),
        findMatches: jest.fn(() => []),
        replaceCurrent: jest.fn(() => ({ text: '', replacements: 0 })),
        replaceAll
      },
      fileService: {
        openDocument: jest.fn(),
        saveDocument: jest.fn(),
        saveDocumentAs: jest.fn(),
        listRecentDocuments: jest.fn()
      }
    }

    const boundary = createCoreBoundaryDefinition(contracts)
    const result = await replaceAndRender(boundary, {
      markdown: 'hello web core',
      query: 'web',
      replacement: 'desktop'
    })

    expect(replaceAll).toHaveBeenCalledWith({
      source: 'hello web core',
      query: 'web',
      replacement: 'desktop',
      options: {
        caseSensitive: false,
        wholeWord: false,
        regex: false
      }
    })
    expect(parseMarkdown).toHaveBeenCalledWith('hello desktop core')
    expect(render).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      markdown: 'hello desktop core',
      html: '<p>hello desktop core</p>',
      replacements: 1
    })
  })
})
