import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import mermaid from 'mermaid'
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
        // 编码 PlantUML 代码
        const plantUmlCode = encodeURIComponent(children)
        const plantUmlUrl = `http://www.plantuml.com/plantuml/svg/~1${plantUmlCode}`
        
        return (
          <div className="plantuml-container">
            <img
              src={plantUmlUrl}
              alt="PlantUML Diagram"
              className="max-w-full h-auto"
            />
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
          rehypePlugins={[rehypeHighlight]}
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
