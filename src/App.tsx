import React, { useState } from 'react'
import MarkdownInput from './components/MarkdownInput'
import MarkdownPreview from './components/MarkdownPreview'

function App() {
  const [markdown, setMarkdown] = useState<string>(`# Markdown Preview

这是一个简单的 Markdown 预览工具。

## 功能特性

- 实时预览 Markdown 文本
- 支持 GitHub Flavored Markdown (GFM)
- 代码高亮
- 数学公式渲染
- 响应式设计
- 图表渲染（Mermaid 和 PlantUML）

## 使用方法

在左侧输入框中输入 Markdown 文本，右侧会实时显示预览结果。

## 示例代码

\`\`\`typescript
function greet(name: string) {
  return "Hello, " + name + "!";
}

console.log(greet("World"));
\`\`\`

## 数学公式

行内公式：$E = mc^2$

块级公式：

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## 表格

| 功能 | 描述 | 状态 |
| --- | --- | --- |
| 基础语法 | 支持标题、列表、链接等 | ✅ |
| GFM | 支持表格、任务列表 | ✅ |
| 代码高亮 | 支持多种编程语言 | ✅ |
| 数学公式 | 支持 LaTeX 公式 | ✅ |
| 图表渲染 | 支持 Mermaid 和 PlantUML 图表 | ✅ |

## Mermaid 图表示例

\`\`\`mermaid
graph TD
    A[开始] --> B{条件判断}
    B -->|是| C[执行操作1]
    B -->|否| D[执行操作2]
    C --> E[结束]
    D --> E
\`\`\`

## PlantUML 图表示例

\`\`\`plantuml
@startuml
Bob -> Alice : 问候
Alice -> Bob : 回复
@enduml
\`\`\`
`)

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
