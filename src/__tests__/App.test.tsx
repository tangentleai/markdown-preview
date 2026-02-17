import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App component', () => {
  it('should render the main application', () => {
    render(<App />)
    
    expect(screen.getAllByText('Markdown Preview')).toHaveLength(2)
  })

  it('should display the initial markdown content', () => {
    render(<App />)
    
    expect(screen.getAllByText('Markdown Preview')).toHaveLength(2)
    expect(screen.getByText('功能特性')).toBeInTheDocument()
    expect(screen.getByText('使用方法')).toBeInTheDocument()
  })

  it('should render both MarkdownInput and MarkdownPreview components', () => {
    render(<App />)
    
    expect(screen.getByText('Markdown 输入')).toBeInTheDocument()
    expect(screen.getByText('预览效果')).toBeInTheDocument()
  })
})