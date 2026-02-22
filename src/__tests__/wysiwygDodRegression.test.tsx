import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import App from '../App'
import type { PlatformAdapter } from '../adapters/platform-adapter'
import type { CoreFileHandle } from '../core/fileService'
import { parseMarkdownToDocumentModel, serializeDocumentModelToMarkdown } from '../utils/markdownDocumentModel'
import { readMarkdownFile, saveMarkdownViaHandle, type MarkdownFileHandle, type MarkdownWritable } from '../utils/markdownFileIO'

const createTestAdapter = (
  overrides: Partial<PlatformAdapter['fileService']> = {}
): PlatformAdapter => {
  const defaultHandle: CoreFileHandle = { id: 'test-handle', name: 'untitled.md' }
  return {
    fileService: {
      openDocument: jest.fn(async () => ({
        handle: defaultHandle,
        content: '',
        openedAt: new Date(0).toISOString()
      })),
      openDocumentFromFile: jest.fn(async (file: File) => ({
        handle: { id: 'test-file', name: file.name },
        content: '',
        openedAt: new Date(0).toISOString()
      })),
      openRecentDocument: jest.fn(async (handle: CoreFileHandle) => ({
        handle,
        content: '',
        openedAt: new Date(0).toISOString()
      })),
      saveDocument: jest.fn(async (handle: CoreFileHandle) => ({
        handle,
        savedAt: new Date(0).toISOString()
      })),
      saveDocumentAs: jest.fn(async (suggestedName: string) => ({
        handle: { id: 'test-save-as', name: suggestedName },
        savedAt: new Date(0).toISOString()
      })),
      listRecentDocuments: jest.fn(async () => []),
      ...overrides
    }
  }
}

const renderApp = (adapter: PlatformAdapter = createTestAdapter()) => render(<App adapter={adapter} />)

const setCaretAtEnd = (element: HTMLElement): void => {
  const textNode = element.firstChild ?? element.appendChild(document.createTextNode(element.textContent ?? ''))
  const offset = textNode.textContent?.length ?? 0
  const selection = window.getSelection()
  const range = document.createRange()
  range.setStart(textNode, offset)
  range.collapse(true)
  selection?.removeAllRanges()
  selection?.addRange(range)
}

const setCaretAtStart = (element: HTMLElement): void => {
  const textNode = element.firstChild ?? element.appendChild(document.createTextNode(element.textContent ?? ''))
  const selection = window.getSelection()
  const range = document.createRange()
  range.setStart(textNode, 0)
  range.collapse(true)
  selection?.removeAllRanges()
  selection?.addRange(range)
}

describe('DoD CLI regression suite', () => {
  it('round-trip baseline: open-edit-save-reopen should preserve structural equivalence', async () => {
    const openedMarkdown = `# 基线标题\n\n原始段落\n\n- 项目一\n- 项目二\n\n> 引用内容`
    const openedModel = parseMarkdownToDocumentModel(openedMarkdown)

    const editedModel = parseMarkdownToDocumentModel(
      `${serializeDocumentModelToMarkdown(openedModel).trimEnd()}\n\n## 回归新增\n\n补充段落与 [链接](https://example.com)`
    )
    const editedMarkdown = serializeDocumentModelToMarkdown(editedModel)

    let savedMarkdown = ''
    const writable: MarkdownWritable = {
      write: jest.fn(async (content: Blob | string) => {
        if (typeof content === 'string') {
          savedMarkdown = content
          return
        }
        savedMarkdown = editedMarkdown
      }),
      close: jest.fn(async () => undefined)
    }
    const handle: MarkdownFileHandle = {
      name: 'roundtrip.md',
      createWritable: jest.fn(async () => writable),
      getFile: jest.fn(async () => ({ name: 'roundtrip.md' } as File))
    }

    await saveMarkdownViaHandle(handle, editedMarkdown)

    const reopenedFile = {
      name: 'roundtrip.md',
      arrayBuffer: jest.fn(async () => Uint8Array.from(Buffer.from(savedMarkdown, 'utf-8')).buffer),
      text: jest.fn(async () => savedMarkdown)
    } as unknown as File
    const reopenedMarkdown = await readMarkdownFile(reopenedFile)
    const reopenedModel = parseMarkdownToDocumentModel(reopenedMarkdown)

    expect(reopenedModel).toEqual(editedModel)
    expect(reopenedMarkdown).toContain('## 回归新增')
  })

  it('should preserve markdown after dual-pane <-> WYSIWYG mode switch', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))
    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    const markdown = '# 模式回归\n\n切换后保持一致。'

    fireEvent.change(textarea, { target: { value: markdown } })
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))
    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))

    expect((screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement).value).toBe(markdown)
  })

  it('should sync direct WYSIWYG edit back into markdown textarea', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<h1>编辑标题</h1><p>编辑正文</p>'
    fireEvent.input(editor)

    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))
    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    expect(textarea.value).toContain('# 编辑标题')
    expect(textarea.value).toContain('编辑正文')
  })

  it('should apply heading block input transform in WYSIWYG editor', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p>#</p>'
    const paragraph = editor.querySelector('p') as HTMLElement

    setCaretAtEnd(paragraph)
    fireEvent.keyDown(editor, { key: ' ' })

    expect(editor.querySelector('h1')).toBeTruthy()
  })

  it('should block structure transform during IME composition', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p>#</p>'
    const paragraph = editor.querySelector('p') as HTMLElement

    setCaretAtEnd(paragraph)
    fireEvent.compositionStart(editor)
    fireEvent.keyDown(editor, { key: ' ', keyCode: 229 })
    fireEvent.compositionEnd(editor)

    expect(editor.querySelector('h1')).toBeNull()
    expect(editor.querySelector('p')?.textContent).toBe('#')
  })

  it('should keep structural undo/redo behavior for block transform', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p>#</p>'
    const paragraph = editor.querySelector('p') as HTMLElement

    setCaretAtEnd(paragraph)
    fireEvent.keyDown(editor, { key: ' ' })
    expect(editor.querySelector('h1')).toBeTruthy()

    fireEvent.keyDown(editor, { key: 'z', ctrlKey: true })
    expect(editor.querySelector('p')?.textContent).toBe('#')

    fireEvent.keyDown(editor, { key: 'z', ctrlKey: true, shiftKey: true })
    expect(editor.querySelector('h1')).toBeTruthy()
  })

  it('should apply inline style trigger and keep formatted node', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p>**bold*</p>'
    const paragraph = editor.querySelector('p') as HTMLElement

    setCaretAtEnd(paragraph)
    fireEvent.keyDown(editor, { key: '*' })

    expect(editor.querySelector('strong')?.textContent).toBe('bold')
  })

  it('should exit empty list and heading structures with Enter/Backspace rules', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<ul><li><br></li></ul>'
    const listItem = editor.querySelector('li') as HTMLElement

    setCaretAtStart(listItem)
    fireEvent.keyDown(editor, { key: 'Enter' })
    expect(editor.querySelector('ul')).toBeNull()
    expect(editor.querySelector('p')).toBeTruthy()

    editor.innerHTML = '<h2>标题文本</h2>'
    const heading = editor.querySelector('h2') as HTMLElement
    setCaretAtStart(heading)
    fireEvent.keyDown(editor, { key: 'Backspace' })

    expect(editor.querySelector('h2')).toBeNull()
    expect(editor.querySelector('p')?.textContent).toBe('标题文本')
  })

  it('should run find/replace current+all and sync markdown value', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p>alpha beta alpha beta</p>'
    fireEvent.input(editor)

    fireEvent.keyDown(editor, { key: 'f', ctrlKey: true })
    fireEvent.change(screen.getByLabelText('查找文本'), { target: { value: 'alpha' } })
    fireEvent.click(screen.getByRole('button', { name: '切换到替换模式' }))
    fireEvent.change(screen.getByLabelText('替换文本'), { target: { value: 'ALPHA' } })

    fireEvent.click(screen.getByRole('button', { name: '查找下一个' }))
    fireEvent.click(screen.getByRole('button', { name: '替换当前' }))
    fireEvent.click(screen.getByRole('button', { name: '全部替换' }))

    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))
    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    expect(textarea.value).toContain('ALPHA beta ALPHA beta')
  })

  it('should insert dropped local image and keep markdown reference encoding', () => {
    const originalCreateObjectURL = URL.createObjectURL
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: jest.fn(() => 'blob:mock-regression-image')
    })

    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    const imageFile = new File(['binary'], 'local image.png', { type: 'image/png' })

    fireEvent.drop(editor, { dataTransfer: { files: [imageFile] } })

    const image = editor.querySelector('img[data-markdown-src]') as HTMLImageElement
    expect(image).toBeTruthy()
    expect(image.getAttribute('data-markdown-src')).toBe('local%20image.png')

    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))
    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    expect(textarea.value).toContain('![local image](local%20image.png)')

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: originalCreateObjectURL
    })
  })
})
