import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from '../App'

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

describe('App component', () => {
  it('should render the main application', () => {
    render(<App />)
    
    expect(screen.getAllByText('Markdown Preview')).toHaveLength(2)
  })

  it('should display the initial markdown content', () => {
    render(<App />)
    
    expect(screen.getAllByText('Markdown Preview')).toHaveLength(2)
    expect(screen.getByText('功能特性')).toBeTruthy()
    expect(screen.getByText('使用方法')).toBeTruthy()
  })

  it('should render both MarkdownInput and MarkdownPreview components', () => {
    render(<App />)
    
    expect(screen.getByText('Markdown 输入')).toBeTruthy()
    expect(screen.getByText('预览效果')).toBeTruthy()
  })

  it('should switch between dual-pane and WYSIWYG modes while preserving markdown content', () => {
    render(<App />)

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
    render(<App />)

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
    const write = jest.fn<Promise<void>, [Blob | string]>().mockResolvedValue()
    const close = jest.fn<Promise<void>, []>().mockResolvedValue()
    const handle = {
      name: 'saved.md',
      createWritable: jest.fn().mockResolvedValue({ write, close }),
      getFile: jest.fn().mockResolvedValue({ name: 'saved.md' })
    }
    const showSaveFilePicker = jest.fn().mockResolvedValue(handle)
    Object.defineProperty(window, 'showSaveFilePicker', {
      configurable: true,
      writable: true,
      value: showSaveFilePicker
    })

    render(<App />)

    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: '# 保存快捷键测试\n\n内容' } })
    expect(screen.getByLabelText('保存状态').textContent).toContain('未保存更改')

    fireEvent.keyDown(window, { key: 's', ctrlKey: true })

    await waitFor(() => {
      expect(showSaveFilePicker).toHaveBeenCalledTimes(1)
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
    render(<App />)
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
    render(<App />)
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
    render(<App />)
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
    render(<App />)
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
    render(<App />)
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
    render(<App />)
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
    render(<App />)
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
    render(<App />)
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
    render(<App />)
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
    render(<App />)
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
    render(<App />)
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
    render(<App />)
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
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    editor.innerHTML = '<p>alpha beta alpha beta</p>'
    fireEvent.input(editor)

    fireEvent.change(screen.getByLabelText('查找文本'), { target: { value: 'alpha' } })
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

  it.each([
    { key: 'b', tag: 'strong', text: 'bold' },
    { key: 'i', tag: 'em', text: 'italic' },
    { key: 'e', tag: 'code', text: 'code' }
  ])('should apply inline shortcut %s for selected text', ({ key, tag, text }) => {
    render(<App />)
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
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    const editor = screen.getByRole('textbox', { name: 'WYSIWYG 编辑区' }) as HTMLDivElement
    const imageFile = new File(['binary-image-data'], 'local image.png', { type: 'image/png' })

    fireEvent.dragOver(editor, {
      dataTransfer: { files: [imageFile] }
    })
    fireEvent.drop(editor, {
      dataTransfer: { files: [imageFile] }
    })

    const insertedImage = editor.querySelector('img') as HTMLImageElement
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

  it('should generate outline from H1-H6 in real time and jump to selected heading', () => {
    render(<App />)

    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    fireEvent.change(textarea, {
      target: {
        value: '# 一级标题\n\n正文段落\n\n## 二级标题\n\n### 三级标题\n\n普通内容'
      }
    })

    fireEvent.click(screen.getByRole('button', { name: 'WYSIWYG 模式' }))

    expect(screen.getByRole('button', { name: '一级标题' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '二级标题' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '三级标题' })).toBeTruthy()

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
})
