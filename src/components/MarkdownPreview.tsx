import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import mermaid from 'mermaid'
import { encode as encodePlantUml } from 'plantuml-encoder'
import 'highlight.js/styles/github.css'
import 'katex/dist/katex.min.css'

interface MarkdownPreviewProps {
  markdown: string
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown }) => {
  // 初始化 Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose'
    })
    
    // 渲染 Mermaid 图表
    const renderMermaid = () => {
      const elements = document.querySelectorAll('.mermaid')
      if (elements.length > 0) {
        mermaid.run()
      }
    }
    
    renderMermaid()
  }, [markdown])

  // 自定义渲染代码块
  const renderCode = ({ node, inline, className, children, ...props }: any) => {
    if (!inline) {
      // 处理 Mermaid 代码块
      if (className?.includes('language-mermaid')) {
        return (
          <div className="mermaid">
            {children}
          </div>
        )
      }
      
      // 处理 PlantUML 代码块
      if (className?.includes('language-plantuml')) {
        // 提取纯文本内容并编码
        const rawCode = typeof children === 'string' 
          ? children 
          : Array.isArray(children) 
            ? children.map(child => typeof child === 'string' ? child : '').join('') 
            : ''
        
        // 移除代码块中的换行符和多余空格，然后进行编码
        const plantUmlCode = rawCode
          .trim()
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .replace(/\n+/g, '\n')
        
        // 使用 PlantUML 官方编码算法（deflate + 自定义64编码）
        const encodedCode = encodePlantUml(plantUmlCode)
        const plantUmlUrl = `https://www.plantuml.com/plantuml/svg/${encodedCode}`
        
        return (
          <div className="plantuml-container">
            <img
              src={plantUmlUrl}
              alt="PlantUML Diagram"
              className="max-w-full h-auto"
              onError={(e) => {
                console.error('PlantUML 图表加载失败:', e)
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.classList.remove('hidden')
              }}
            />
            <div className="hidden text-red-500 text-sm mt-2">
              图表加载失败，请检查网络连接或 PlantUML 代码语法
            </div>
          </div>
        )
      }
    }
    
    // 渲染其他代码块
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        预览效果
      </h2>
      <div className="markdown-preview overflow-auto max-h-[600px]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[[rehypeKatex, { strict: 'warn', throwOnError: false }], rehypeHighlight]}
          components={{
            code: renderCode
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default MarkdownPreview
