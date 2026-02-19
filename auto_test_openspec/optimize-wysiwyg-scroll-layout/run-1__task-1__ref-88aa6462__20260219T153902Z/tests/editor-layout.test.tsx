import React from 'react'
import { render, screen } from '@testing-library/react'
import WysiwygEditor from '../../../../src/components/WysiwygEditor'

describe('WysiwygEditor 布局优化', () => {
  test('编辑器不应有固定高度限制', () => {
    render(<WysiwygEditor markdown="" setMarkdown={() => {}} />)
    
    const editor = screen.getByRole('textbox')
    expect(editor).toBeInTheDocument()
    
    // 检查编辑器不应有固定高度和内部滚动
    expect(editor).not.toHaveClass('max-h-[600px]')
    expect(editor).not.toHaveClass('overflow-auto')
    expect(editor).toHaveClass('min-h-[300px]')
  })

  test('编辑器应能自然展开内容', () => {
    render(<WysiwygEditor markdown="" setMarkdown={() => {}} />)
    
    const editor = screen.getByRole('textbox')
    expect(editor).toBeInTheDocument()
    
    // 验证编辑器内容区域可以自然展开
    // 直接检查 className，不依赖 toHaveStyle 匹配器
    const className = editor.getAttribute('class')
    expect(className).not.toContain('max-h-[600px]')
    expect(className).not.toContain('overflow-auto')
    expect(className).toContain('min-h-[300px]')
  })
})
