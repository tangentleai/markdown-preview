import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import MarkdownInput from '../components/MarkdownInput'

describe('MarkdownInput component', () => {
  it('should render the Markdown Input header', () => {
    render(<MarkdownInput markdown="" setMarkdown={() => {}} />)
    expect(screen.getByText('Markdown 输入')).toBeInTheDocument()
  })

  it('should display the correct placeholder text', () => {
    render(<MarkdownInput markdown="" setMarkdown={() => {}} />)
    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...')
    expect(textarea).toBeInTheDocument()
  })

  it('should render with the initial markdown value', () => {
    const initialMarkdown = '# Test Header'
    render(<MarkdownInput markdown={initialMarkdown} setMarkdown={() => {}} />)
    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...') as HTMLTextAreaElement
    expect(textarea.value).toEqual(initialMarkdown)
  })

  it('should update the markdown value when text is entered', () => {
    const mockSetMarkdown = jest.fn()
    render(<MarkdownInput markdown="" setMarkdown={mockSetMarkdown} />)
    const textarea = screen.getByPlaceholderText('在这里输入 Markdown 文本...')
    
    fireEvent.change(textarea, { target: { value: '# New Header' } })
    
    expect(mockSetMarkdown).toHaveBeenCalledTimes(1)
    expect(mockSetMarkdown).toHaveBeenCalledWith('# New Header')
  })
})