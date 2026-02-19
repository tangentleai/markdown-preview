import React from 'react'
import { render, screen } from '@testing-library/react'
import MarkdownPreview from '../components/MarkdownPreview'

describe('MarkdownPreview component', () => {
  it('should render the Preview header', () => {
    render(<MarkdownPreview markdown="" />)
    expect(screen.getByText('预览效果')).toBeTruthy()
  })

  it('should render markdown text correctly', () => {
    const testMarkdown = '# Header 1\n## Header 2\n\nParagraph text with **bold** and *italic*.'
    render(<MarkdownPreview markdown={testMarkdown} />)
    
    expect(screen.getByRole('heading', { level: 1, name: 'Header 1' })).toBeTruthy()
    const h2Elements = screen.getAllByRole('heading', { level: 2 })
    expect(h2Elements.some(el => el.textContent === 'Header 2')).toBe(true)
    expect(screen.getByText(/Paragraph text/)).toBeTruthy()
  })

  it('should render code blocks', () => {
    const testMarkdown = '```typescript\nfunction test() {\n  return "test";\n}\n```'
    render(<MarkdownPreview markdown={testMarkdown} />)
    
    const codeElement = screen.getByRole('code')
    expect(codeElement).toBeTruthy()
  })

  it('should render inline and block math formulas via KaTeX', () => {
    const testMarkdown = '行内公式：$E = mc^2$\n\n$$\n\\\\int_{-\\\\infty}^{\\\\infty} e^{-x^2} dx = \\\\sqrt{\\\\pi}\n$$'
    render(<MarkdownPreview markdown={testMarkdown} />)
    const container = screen.getByText(/行内公式/).parentElement as HTMLElement
    // KaTeX renders elements with class 'katex'
    expect(document.querySelector('.katex')).toBeTruthy()
  })

  it('should handle empty markdown', () => {
    render(<MarkdownPreview markdown="" />)
    expect(screen.getByText('预览效果')).toBeTruthy()
  })
})
