import { useState } from 'react'
import MarkdownInput from './components/MarkdownInput'
import MarkdownPreview from './components/MarkdownPreview'

function App() {
  const [markdown, setMarkdown] = useState<string>('# Markdown Preview\n\n这是一个简单的 Markdown 预览工具。\n\n## 功能特性\n\n- 实时预览 Markdown 文本\n- 支持 GitHub Flavored Markdown (GFM)\n- 代码高亮\n- 数学公式渲染\n- 响应式设计\n\n## 使用方法\n\n在左侧输入框中输入 Markdown 文本，右侧会实时显示预览结果。\n\n## 示例代码\n\n```typescript\nfunction greet(name: string) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));\n```\n\n## 数学公式\n\n行内公式：$E = mc^2$\n\n块级公式：\n\n$$\n\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}\n$$\n\n## 表格\n\n| 功能 | 描述 | 状态 |\n| --- | --- | --- |\n| 基础语法 | 支持标题、列表、链接等 | ✅ |\n| GFM | 支持表格、任务列表 | ✅ |\n| 代码高亮 | 支持多种编程语言 | ✅ |\n| 数学公式 | 支持 LaTeX 公式 | ✅ |')

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Markdown Preview</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarkdownInput markdown={markdown} setMarkdown={setMarkdown} />
          <MarkdownPreview markdown={markdown} />
        </div>
      </main>
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            Built with React + TypeScript + Vite
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
