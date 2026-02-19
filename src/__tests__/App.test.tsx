import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import App from '../App'

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
})
