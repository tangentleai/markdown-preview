import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
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

  it.each([
    { trigger: '#', key: ' ', selector: 'h1' },
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
})
