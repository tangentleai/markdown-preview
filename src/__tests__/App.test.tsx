import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from '../App'
import type { PlatformAdapter } from '../adapters/platform-adapter'
import type { CoreFileHandle } from '../core/fileService'

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

const selectTextInElement = (element: HTMLElement, targetText: string): void => {
  const textNode = element.firstChild as Text | null
  if (!textNode) {
    return
  }

  const fullText = textNode.textContent ?? ''
  const start = fullText.indexOf(targetText)
  if (start < 0) {
    return
  }

  const selection = window.getSelection()
  const range = document.createRange()
  range.setStart(textNode, start)
  range.setEnd(textNode, start + targetText.length)
  selection?.removeAllRanges()
  selection?.addRange(range)
}

const selectTextAcrossNodes = (
  startNode: Text,
  startOffset: number,
  endNode: Text,
  endOffset: number
): void => {
  const selection = window.getSelection()
  const range = document.createRange()
  range.setStart(startNode, startOffset)
  range.setEnd(endNode, endOffset)
  selection?.removeAllRanges()
  selection?.addRange(range)
}

describe('App component', () => {
  it('should render the main application', () => {
    renderApp()
    
    expect(screen.getAllByText('Markdown Preview').length).toBeGreaterThanOrEqual(2)
  })

  it('should display the initial markdown content', () => {
    renderApp()
    
    expect(screen.getAllByText('Markdown Preview').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('功能特性').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('使用方法').length).toBeGreaterThanOrEqual(1)
  })

  it('should render both MarkdownInput and MarkdownPreview components', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))
    expect(screen.getByText('Markdown 输入')).toBeTruthy()
    expect(screen.getByText('预览效果')).toBeTruthy()
  })

  it('should switch between dual-pane and WYSIWYG modes while preserving markdown content', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))

    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    const updatedMarkdown = '# 模式切换测试\n\n切换后内容应保持一致。'

    fireEvent.change(textarea, { target: { value: updatedMarkdown } })
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    expect(screen.queryByText('Markdown 输入')).toBeNull()
    expect(screen.getByRole('heading', { level: 1, name: '模式切换测试' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))

    const textareaAfterSwitch = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    expect(textareaAfterSwitch.value).toEqual(updatedMarkdown)
  })

  it('should support basic direct editing in WYSIWYG mode', () => {
    renderApp()

    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<h1>内联编辑标题</h1><p>基础输入内容</p>'
    fireEvent.input(editor)

    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))

    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    expect(textarea.value).toContain('# 内联编辑标题')
    expect(textarea.value).toContain('基础输入内容')
  })

  it('should mark document dirty after edits and save via Ctrl/Cmd+S shortcut', async () => {
    const saveDocumentAs = jest.fn(async () => ({
      handle: { id: 'saved-handle', name: 'saved.md' },
      savedAt: new Date(0).toISOString()
    }))
    const adapter = createTestAdapter({ saveDocumentAs })

    renderApp(adapter)
    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))

    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: '# 保存快捷键测试\n\n内容' } })
    expect(screen.getByLabelText('保存状态').textContent).toContain('未保存更改')

    fireEvent.keyDown(window, { key: 's', ctrlKey: true })

    await waitFor(() => {
      expect(saveDocumentAs).toHaveBeenCalledTimes(1)
      expect(screen.getByLabelText('保存状态').textContent).toContain('已保存：saved.md')
    })
  })

  it.each([
    { trigger: '#', key: ' ', selector: 'h1' },
    { trigger: '##', key: ' ', selector: 'h2' },
    { trigger: '###', key: ' ', selector: 'h3' },
    { trigger: '####', key: ' ', selector: 'h4' },
    { trigger: '#####', key: ' ', selector: 'h5' },
    { trigger: '######', key: ' ', selector: 'h6' },
    { trigger: '-', key: ' ', selector: 'ul li' },
    { trigger: '1.', key: ' ', selector: 'ol li' },
    { trigger: '>', key: ' ', selector: 'blockquote p' },
    { trigger: '```', key: 'Enter', selector: 'pre code' }
  ])('should apply block input rule for %s and keep cursor editable', ({ trigger, key, selector }) => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = `<p>${trigger}</p>`

    const paragraph = editor.querySelector('p') as HTMLElement
    setCaretAtEnd(paragraph)
    fireEvent.keyDown(editor, { key })

    const transformed = editor.querySelector(selector)
    expect(transformed).toBeTruthy()

    const selection = window.getSelection()
    expect(selection?.anchorNode && transformed?.contains(selection.anchorNode)).toBeTruthy()
  })

  it('should not retrigger transform when typing space inside empty H2 after \"## \"', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p>##</p>'

    const paragraph = editor.querySelector('p') as HTMLElement
    setCaretAtEnd(paragraph)
    fireEvent.keyDown(editor, { key: ' ' })

    const h2 = editor.querySelector('h2') as HTMLElement
    expect(h2).toBeTruthy()
    setCaretAtStart(h2)
    fireEvent.keyDown(editor, { key: ' ' })

    expect(editor.querySelector('h2')).toBeTruthy()
    expect(editor.querySelector('ul')).toBeNull()
  })

  it('should allow normal paragraph after H2 heading created by \"## \"', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<h2>二级标题</h2><p>后续普通文本</p>'
    fireEvent.input(editor)

    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))
    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    expect(textarea.value).toContain('## 二级标题')
    expect(textarea.value).toContain('后续普通文本')
  })

  it('should convert pasted markdown into formatted rich content and sync markdown', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p><br></p>'
    const paragraph = editor.querySelector('p') as HTMLElement
    setCaretAtStart(paragraph)

    const md =
      '### 粘贴标题\n\n段落 **加粗** *斜体*\n- 项目1\n1. 项目A\n[链接](https://example.com)\n![图像](https://example.com/img.png)'
    fireEvent.paste(editor, {
      clipboardData: {
        getData: (type: string) => (type === 'text/plain' ? md : '')
      } as unknown as DataTransfer
    })

    expect(editor.querySelector('h3')?.textContent).toContain('粘贴标题')
    expect(editor.querySelector('strong')?.textContent).toBe('加粗')
    expect(editor.querySelector('em')?.textContent).toBe('斜体')
    expect(editor.querySelector('ul li')).toBeTruthy()
    expect(editor.querySelector('ol li')).toBeTruthy()
    const anchor = editor.querySelector('a') as HTMLAnchorElement
    expect(anchor?.getAttribute('href')).toBe('https://example.com')
    const img = editor.querySelector('img') as HTMLImageElement
    expect(img?.getAttribute('src')).toBe('https://example.com/img.png')

    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))
    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    expect(textarea.value).toContain('### 粘贴标题')
    expect(textarea.value).toContain('**加粗**')
    expect(textarea.value).toContain('*斜体*')
    expect(textarea.value).toContain('- 项目1')
    expect(textarea.value).toContain('1. 项目A')
    expect(textarea.value).toContain('[链接](https://example.com)')
    expect(textarea.value).toContain('![图像](https://example.com/img.png)')
  })

  it('should not trigger block transform when Chinese IME composition is active', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p>#</p>'

    const paragraph = editor.querySelector('p') as HTMLElement
    setCaretAtEnd(paragraph)

    fireEvent.compositionStart(editor)
    fireEvent.keyDown(editor, { key: ' ', keyCode: 229 })

    expect(editor.querySelector('h1')).toBeNull()
    expect(editor.querySelector('p')?.textContent).toBe('#')

    fireEvent.compositionEnd(editor)
  })

  it('should undo one block transform back to pre-transform text state', () => {
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
  })

  it('should redo structural block transform after undo with shortcut', () => {
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

  it.each([
    {
      triggerText: '**bold*',
      key: '*',
      selector: 'strong',
      expectedText: 'bold'
    },
    {
      triggerText: '*italic',
      key: '*',
      selector: 'em',
      expectedText: 'italic'
    },
    {
      triggerText: '`code',
      key: '`',
      selector: 'code',
      expectedText: 'code'
    },
    {
      triggerText: '[OpenAI](https://openai.com',
      key: ')',
      selector: 'a',
      expectedText: 'OpenAI'
    }
  ])('should apply inline style rule for $selector when closing marker is typed', ({ triggerText, key, selector, expectedText }) => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = `<p>${triggerText}</p>`

    const paragraph = editor.querySelector('p') as HTMLElement
    setCaretAtEnd(paragraph)
    fireEvent.keyDown(editor, { key })

    const styledNode = editor.querySelector(selector)
    expect(styledNode?.textContent).toBe(expectedText)

    const selection = window.getSelection()
    expect(selection?.anchorNode && editor.contains(selection.anchorNode)).toBeTruthy()
  })

  it('should exit empty list item when pressing Enter', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<ul><li><br></li></ul>'

    const listItem = editor.querySelector('li') as HTMLElement
    setCaretAtStart(listItem)
    fireEvent.keyDown(editor, { key: 'Enter' })

    expect(editor.querySelector('ul')).toBeNull()
    expect(editor.querySelector('p')).toBeTruthy()
  })

  it('should exit empty blockquote when pressing Enter', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<blockquote><p><br></p></blockquote>'

    const quoteParagraph = editor.querySelector('blockquote p') as HTMLElement
    setCaretAtStart(quoteParagraph)
    fireEvent.keyDown(editor, { key: 'Enter' })

    expect(editor.querySelector('blockquote')).toBeNull()
    expect(editor.querySelector('p')).toBeTruthy()
  })

  it('should convert heading to paragraph when pressing Backspace at start', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<h2>标题文本</h2>'

    const heading = editor.querySelector('h2') as HTMLElement
    setCaretAtStart(heading)
    fireEvent.keyDown(editor, { key: 'Backspace' })

    expect(editor.querySelector('h2')).toBeNull()
    expect(editor.querySelector('p')?.textContent).toBe('标题文本')
  })

  it('should include heading backspace transaction in undo and redo history', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<h2>标题文本</h2>'

    const heading = editor.querySelector('h2') as HTMLElement
    setCaretAtStart(heading)
    fireEvent.keyDown(editor, { key: 'Backspace' })
    expect(editor.querySelector('h2')).toBeNull()
    expect(editor.querySelector('p')?.textContent).toBe('标题文本')

    fireEvent.keyDown(editor, { key: 'z', ctrlKey: true })
    expect(editor.querySelector('h2')?.textContent).toContain('标题文本')

    fireEvent.keyDown(editor, { key: 'z', ctrlKey: true, shiftKey: true })
    expect(editor.querySelector('p')?.textContent).toBe('标题文本')
  })

  it('should support plain text find/replace current and replace-all in WYSIWYG mode', () => {
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
    expect(editor.textContent).toContain('ALPHA beta alpha beta')

    fireEvent.click(screen.getByRole('button', { name: '全部替换' }))
    expect(editor.textContent).toContain('ALPHA beta ALPHA beta')

    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))
    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    expect(textarea.value).toContain('ALPHA beta ALPHA beta')
  })

  it('should support bidirectional find navigation with wrap-around in WYSIWYG mode', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p>alpha beta alpha beta</p>'
    fireEvent.input(editor)

    fireEvent.keyDown(editor, { key: 'f', ctrlKey: true })
    fireEvent.change(screen.getByLabelText('查找文本'), { target: { value: 'alpha' } })

    const counter = screen.getByLabelText('查找结果计数')
    const findPreviousButton = screen.getByRole('button', { name: '查找上一个' })
    const findNextButton = screen.getByRole('button', { name: '查找下一个' })

    expect(counter.textContent).toContain('0/2')

    fireEvent.click(findNextButton)
    expect(counter.textContent).toContain('1/2')

    fireEvent.click(findNextButton)
    expect(counter.textContent).toContain('2/2')

    fireEvent.click(findNextButton)
    expect(counter.textContent).toContain('1/2')

    fireEvent.click(findPreviousButton)
    expect(counter.textContent).toContain('2/2')

    fireEvent.click(findPreviousButton)
    expect(counter.textContent).toContain('1/2')
  })

  it.each([
    { key: 'b', tag: 'strong', text: 'bold' },
    { key: 'i', tag: 'em', text: 'italic' },
    { key: 'e', tag: 'code', text: 'code' }
  ])('should apply inline shortcut %s for selected text', ({ key, tag, text }) => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p>bold italic code</p>'

    const paragraph = editor.querySelector('p') as HTMLElement
    selectTextInElement(paragraph, text)
    fireEvent.keyDown(editor, { key, ctrlKey: true })

    expect(editor.querySelector(tag)?.textContent).toBe(text)
  })

  it('should insert dropped local image as markdown reference and render inline in WYSIWYG editor', () => {
    const originalCreateObjectURL = URL.createObjectURL
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: jest.fn(() => 'blob:mock-local-image')
    })
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    const imageFile = new File(['binary-image-data'], 'local image.png', { type: 'image/png' })

    fireEvent.dragOver(editor, {
      dataTransfer: { files: [imageFile] }
    })
    fireEvent.drop(editor, {
      dataTransfer: { files: [imageFile] }
    })

    const insertedImage = editor.querySelector('img[data-markdown-src]') as HTMLImageElement
    expect(insertedImage).toBeTruthy()
    expect(insertedImage.getAttribute('src')).toBe('blob:mock-local-image')
    expect(insertedImage.getAttribute('data-markdown-src')).toBe('local%20image.png')

    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))
    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    expect(textarea.value).toContain('![local image](local%20image.png)')

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: originalCreateObjectURL
    })
  })

  it('should render inline math when closing $ is typed', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p>$E = mc^2</p>'

    const paragraph = editor.querySelector('p') as HTMLElement
    setCaretAtEnd(paragraph)
    fireEvent.keyDown(editor, { key: '$' })

    const mathInline = editor.querySelector('.math-inline')
    const katexEl = editor.querySelector('.katex')
    expect(mathInline).toBeTruthy()
    expect(katexEl).toBeTruthy()
  })

  it.skip('should render block math when pasting $$...$$ into WYSIWYG editor', async () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p><br></p>'
    const paragraph = editor.querySelector('p') as HTMLElement
    setCaretAtStart(paragraph)

    const md = '$$\n\\\\int_{-\\\\infty}^{\\\\infty} e^{-x^2} dx = \\\\sqrt{\\\\pi}\n$$'
    fireEvent.paste(editor, {
      clipboardData: {
        getData: (type: string) => (type === 'text/plain' ? md : '')
      } as unknown as DataTransfer
    })

    await waitFor(() => {
      const katexDisplay = editor.querySelector('.katex-display, .katex')
      expect(katexDisplay).toBeTruthy()
    })
  })

  // removed button-based toggle; keyboard toggle test exists below

  it('should close find toolbar with Esc from find input, replace input, and editor focus while restoring editor typing', async () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p>Start</p>'
    fireEvent.input(editor)

    const overlay = editor.parentElement?.querySelector('[aria-label="查找替换工具栏"]') as HTMLElement
    expect(overlay.getAttribute('aria-hidden')).toBe('true')

    const typeCharacterAtCaret = (char: string) => {
      const selection = window.getSelection()
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null
      expect(range).toBeTruthy()
      if (!range) {
        return
      }

      const container = range.startContainer
      if (container.nodeType === Node.TEXT_NODE) {
        const textNode = container as Text
        const source = textNode.textContent ?? ''
        const offset = range.startOffset
        textNode.textContent = `${source.slice(0, offset)}${char}${source.slice(offset)}`

        const nextRange = document.createRange()
        nextRange.setStart(textNode, offset + 1)
        nextRange.collapse(true)
        selection?.removeAllRanges()
        selection?.addRange(nextRange)
      } else {
        const textNode = document.createTextNode(char)
        range.insertNode(textNode)

        const nextRange = document.createRange()
        nextRange.setStartAfter(textNode)
        nextRange.collapse(true)
        selection?.removeAllRanges()
        selection?.addRange(nextRange)
      }

      fireEvent.input(editor)
    }

    fireEvent.keyDown(editor, { key: 'f', ctrlKey: true })
    const findInput = screen.getByLabelText('查找文本') as HTMLInputElement
    findInput.focus()
    fireEvent.keyDown(findInput, { key: 'Escape' })
    await waitFor(() => {
      expect(overlay.getAttribute('aria-hidden')).toBe('true')
      expect(document.activeElement).toBe(editor)
    })
    typeCharacterAtCaret('A')
    expect(editor.textContent).toContain('StartA')

    fireEvent.keyDown(editor, { key: 'f', ctrlKey: true })
    expect(overlay.getAttribute('aria-hidden')).toBe('false')
    fireEvent.click(screen.getByRole('button', { name: '切换到替换模式' }))
    const replaceInput = screen.getByLabelText('替换文本') as HTMLInputElement
    replaceInput.focus()
    fireEvent.keyDown(replaceInput, { key: 'Escape' })
    await waitFor(() => {
      expect(overlay.getAttribute('aria-hidden')).toBe('true')
      expect(document.activeElement).toBe(editor)
    })
    typeCharacterAtCaret('B')
    expect(editor.textContent).toContain('StartAB')

    fireEvent.keyDown(editor, { key: 'f', ctrlKey: true })
    expect(overlay.getAttribute('aria-hidden')).toBe('false')
    editor.focus()
    fireEvent.keyDown(editor, { key: 'Escape' })
    await waitFor(() => {
      expect(overlay.getAttribute('aria-hidden')).toBe('true')
      expect(document.activeElement).toBe(editor)
    })
    typeCharacterAtCaret('C')
    expect(editor.textContent).toContain('StartABC')
  })

  it.each([
    { label: 'Ctrl+F', modifiers: { ctrlKey: true } },
    { label: 'Cmd+F', modifiers: { metaKey: true } }
  ])('should seed normalized selected text and index matches via $label', ({ modifiers }) => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p>Alpha</p><p>beta</p><p>Alpha beta marker</p>'

    const firstNode = editor.querySelector('p')?.firstChild as Text
    const secondNode = editor.querySelectorAll('p')[1]?.firstChild as Text
    selectTextAcrossNodes(firstNode, 0, secondNode, secondNode.textContent?.length ?? 0)

    fireEvent.keyDown(editor, { key: 'f', ...modifiers })

    const findInput = screen.getByLabelText('查找文本') as HTMLInputElement
    expect(findInput.value).toBe('Alpha beta')
    expect(screen.getByLabelText('查找结果计数').textContent).toContain('1/1')
  })

  it('should navigate to next match by Enter and wrap from last to first', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p>alpha beta alpha gamma</p>'

    fireEvent.keyDown(editor, { key: 'f', ctrlKey: true })
    const findInput = screen.getByLabelText('查找文本') as HTMLInputElement
    fireEvent.change(findInput, { target: { value: 'alpha' } })

    const counter = screen.getByLabelText('查找结果计数')
    expect(counter.textContent).toContain('0')

    findInput.focus()
    fireEvent.keyDown(findInput, { key: 'Enter' })
    expect(document.activeElement).toBe(findInput)
    expect(counter.textContent).toContain('1/2')

    fireEvent.keyDown(findInput, { key: 'Enter' })
    expect(document.activeElement).toBe(findInput)
    expect(counter.textContent).toContain('2/2')

    fireEvent.keyDown(findInput, { key: 'Enter' })
    expect(counter.textContent).toContain('1/2')
  })

  it('should reset find/replace inputs, states, counters, errors, highlights, and mode after close or Esc', async () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p>alpha beta alpha</p>'

    fireEvent.keyDown(editor, { key: 'f', ctrlKey: true })
    const findInput = screen.getByLabelText('查找文本') as HTMLInputElement
    const caseSensitiveButton = screen.getByRole('button', { name: '区分大小写' })
    const wholeWordButton = screen.getByRole('button', { name: '查找整个单词' })
    const regexButton = screen.getByRole('button', { name: '正则模式' })
    const findNextButton = screen.getByRole('button', { name: '查找下一个' })
    const counter = screen.getByLabelText('查找结果计数')
    expect(screen.queryByText('正则模式')).toBeNull()
    expect(regexButton.querySelector('img')).toBeTruthy()

    fireEvent.change(findInput, { target: { value: 'alpha' } })
    fireEvent.click(screen.getByRole('button', { name: '切换到替换模式' }))
    const replaceInput = screen.getByLabelText('替换文本') as HTMLInputElement
    fireEvent.change(replaceInput, { target: { value: 'ALPHA' } })
    fireEvent.click(caseSensitiveButton)
    fireEvent.click(wholeWordButton)
    fireEvent.click(findNextButton)

    await waitFor(() => {
      expect(counter.textContent).toContain('1/2')
      expect(editor.querySelectorAll('span[data-find-highlight="true"]').length).toBeGreaterThan(0)
    })

    fireEvent.click(regexButton)
    fireEvent.change(findInput, { target: { value: '(' } })
    await waitFor(() => {
      expect(screen.getByLabelText('查找错误提示')).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('button', { name: '关闭查找替换工具栏' }))

    fireEvent.keyDown(editor, { key: 'f', ctrlKey: true })
    const reopenedFindInput = screen.getByLabelText('查找文本') as HTMLInputElement
    expect(reopenedFindInput.value).toBe('')
    expect(screen.queryByLabelText('替换文本')).toBeNull()
    expect(caseSensitiveButton.getAttribute('aria-pressed')).toBe('false')
    expect(wholeWordButton.getAttribute('aria-pressed')).toBe('false')
    expect(regexButton.getAttribute('aria-pressed')).toBe('false')
    expect(screen.queryByLabelText('查找错误提示')).toBeNull()
    expect(counter.textContent).toContain('0/N')
    expect(editor.querySelectorAll('span[data-find-highlight="true"]').length).toBe(0)

    fireEvent.change(reopenedFindInput, { target: { value: 'alpha' } })
    fireEvent.click(screen.getByRole('button', { name: '切换到替换模式' }))
    fireEvent.change(screen.getByLabelText('替换文本'), { target: { value: 'Z' } })
    fireEvent.click(caseSensitiveButton)
    fireEvent.keyDown(reopenedFindInput, { key: 'Escape' })

    fireEvent.keyDown(editor, { key: 'f', ctrlKey: true })
    expect((screen.getByLabelText('查找文本') as HTMLInputElement).value).toBe('')
    expect(screen.queryByLabelText('替换文本')).toBeNull()
    expect(caseSensitiveButton.getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByLabelText('查找结果计数').textContent).toContain('0/N')
    expect(editor.querySelectorAll('span[data-find-highlight="true"]').length).toBe(0)
  })

  it('should show consistent icon tooltips on hover, focus, and long-press', async () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    fireEvent.keyDown(editor, { key: 'f', ctrlKey: true })

    const caseSensitiveButton = screen.getByRole('button', { name: '区分大小写' })
    fireEvent.mouseEnter(caseSensitiveButton)
    const hoverTooltip = screen.getByRole('tooltip')
    expect(hoverTooltip.textContent).toBe('区分大小写')
    expect(hoverTooltip.className).toContain('wysiwyg-find-icon-tooltip')

    fireEvent.mouseLeave(caseSensitiveButton)
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).toBeNull()
    })

    const regexButton = screen.getByRole('button', { name: '正则模式' })
    fireEvent.focus(regexButton)
    const focusTooltip = screen.getByRole('tooltip')
    expect(focusTooltip.textContent).toBe('正则模式')
    expect(focusTooltip.className).toContain('wysiwyg-find-icon-tooltip')

    fireEvent.blur(regexButton)
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).toBeNull()
    })

    const closeButton = screen.getByRole('button', { name: '关闭查找替换工具栏' })
    fireEvent.touchStart(closeButton)
    await waitFor(
      () => {
        const longPressTooltip = screen.getByRole('tooltip')
        expect(longPressTooltip.textContent).toBe('关闭查找替换工具栏')
        expect(longPressTooltip.className).toContain('wysiwyg-find-icon-tooltip')
      },
      { timeout: 1000 }
    )

    fireEvent.touchEnd(closeButton)
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).toBeNull()
    })
  })

  it('should render mermaid diagram in WYSIWYG and round-trip to markdown', async () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    const md = '```mermaid\ngraph TD\nA --> B\n```'
    fireEvent.paste(editor, {
      clipboardData: {
        getData: (type: string) => (type === 'text/plain' ? md : '')
      } as unknown as DataTransfer
    })
    expect(editor.querySelector('.mermaid')).toBeTruthy()
    const mermaidDiv = editor.querySelector('.mermaid') as HTMLElement
    fireEvent.click(mermaidDiv)
    const overlay = document.querySelector('[data-diagram-editor="true"]') as HTMLElement
    expect(overlay).toBeTruthy()
    const overlayTextarea = screen.getByLabelText('图表源码编辑区') as HTMLTextAreaElement
    expect(overlayTextarea.value).toContain('```mermaid')
    overlayTextarea.value = '```mermaid\ngraph TD\nA --> C\n```'
    fireEvent.input(overlayTextarea)
    fireEvent.click(editor)

    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))
    const textareaDual = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    await waitFor(() => {
      expect(textareaDual.value).toContain('```mermaid')
      expect(textareaDual.value).toContain('graph TD')
    })
  })

  it('should render plantuml diagram as image in WYSIWYG and round-trip', async () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    const md = '```plantuml\n@startuml\nA -> B: hello\n@enduml\n```'
    fireEvent.paste(editor, {
      clipboardData: {
        getData: (type: string) => (type === 'text/plain' ? md : '')
      } as unknown as DataTransfer
    })
    const img = editor.querySelector('.plantuml-container img') as HTMLImageElement
    expect(img).toBeTruthy()
    expect(img.src).toContain('plantuml')
    expect(img.getAttribute('data-plantuml-code')).toContain('@startuml')
    const plantDiv = editor.querySelector('.plantuml-container') as HTMLElement
    fireEvent.click(plantDiv)
    const overlay2 = document.querySelector('[data-diagram-editor="true"]') as HTMLElement
    expect(overlay2).toBeTruthy()
    const overlayTextarea2 = screen.getByLabelText('图表源码编辑区') as HTMLTextAreaElement
    expect(overlayTextarea2.value).toContain('```plantuml')
    overlayTextarea2.value = '```plantuml\n@startuml\nX -> Y: hi\n@enduml\n```'
    fireEvent.input(overlayTextarea2)
    fireEvent.click(editor)

    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))
    const textareaDual2 = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    await waitFor(() => {
      expect(textareaDual2.value).toContain('```plantuml')
      expect(textareaDual2.value).toContain('@startuml')
      expect(textareaDual2.value).toContain('@enduml')
    })
  })
  it('should generate outline from H1-H6 in real time and jump to selected heading', () => {
    renderApp()
    const longSecondaryHeading = '二级标题用于验证左侧大纲在超长文本下能够自动换行并保持三行以内可读显示'

    fireEvent.click(screen.getByRole('button', { name: '双栏模式' }))
    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    fireEvent.change(textarea, {
      target: {
        value: `# 一级标题\n\n正文段落\n\n## ${longSecondaryHeading}\n\n### 三级标题\n\n普通内容`
      }
    })

    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    expect(screen.getByRole('button', { name: '一级标题' })).toBeTruthy()
    const longHeadingButton = screen.getByRole('button', { name: longSecondaryHeading })
    expect(longHeadingButton).toBeTruthy()
    expect(screen.getByRole('button', { name: '三级标题' })).toBeTruthy()
    expect(longHeadingButton.style.paddingLeft).toBe('26px')
    expect(screen.getByRole('button', { name: '三级标题' }).style.paddingLeft).toBe('40px')
    expect(longHeadingButton.querySelector('span')?.getAttribute('style')).toContain('-webkit-line-clamp: 3')

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    const h3 = editor.querySelector('h3') as HTMLElement
    const scrollSpy = jest.fn()
    Object.defineProperty(h3, 'scrollIntoView', {
      configurable: true,
      writable: true,
      value: scrollSpy
    })

    fireEvent.click(screen.getByRole('button', { name: '三级标题' }))

    expect(scrollSpy).toHaveBeenCalledTimes(1)
    const selection = window.getSelection()
    expect(selection?.anchorNode && h3.contains(selection.anchorNode)).toBeTruthy()

    editor.innerHTML = '<h1>更新后标题</h1><p>正文</p>'
    fireEvent.input(editor)

    expect(screen.getByRole('button', { name: '更新后标题' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: '二级标题' })).toBeNull()
  })

  it('should resize outline width with live layout sync and keep width non-persistent', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const layout = screen.getByLabelText('大纲与编辑区联动布局') as HTMLDivElement
    const resizeHandle = screen.getByRole('separator', { name: '拖拽调整大纲宽度' })

    expect(layout.style.getPropertyValue('--outline-width')).toBe('260px')

    fireEvent.pointerDown(resizeHandle, { pointerId: 1, button: 0, clientX: 260 })
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 120 })
    expect(layout.style.getPropertyValue('--outline-width')).toBe('220px')

    fireEvent.pointerMove(window, { pointerId: 1, clientX: 420 })
    expect(layout.style.getPropertyValue('--outline-width')).toBe('420px')

    fireEvent.pointerMove(window, { pointerId: 1, clientX: 340 })
    expect(layout.style.getPropertyValue('--outline-width')).toBe('340px')

    fireEvent.pointerUp(window, { pointerId: 1, clientX: 340 })
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 260 })
    expect(layout.style.getPropertyValue('--outline-width')).toBe('340px')

    expect(setItemSpy).not.toHaveBeenCalled()
    setItemSpy.mockRestore()
  })
})
