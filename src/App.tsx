import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MarkdownInput from './components/MarkdownInput'
import MarkdownPreview from './components/MarkdownPreview'
import WysiwygEditor from './components/WysiwygEditor'
import {
  isMarkdownFileName,
  type OpenFilePickerApi,
  openMarkdownViaPicker,
  readMarkdownFile,
  type SaveFilePickerApi,
  saveMarkdownAsViaPicker,
  saveMarkdownViaHandle,
  type MarkdownFileHandle
} from './utils/markdownFileIO'

type EditorMode = 'dual-pane' | 'wysiwyg'

function App() {
  const [editorMode, setEditorMode] = useState<EditorMode>('dual-pane')
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
  const [activeFileHandle, setActiveFileHandle] = useState<MarkdownFileHandle | null>(null)
  const [activeFileName, setActiveFileName] = useState<string>('untitled.md')
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [statusText, setStatusText] = useState<string>('未保存（新文档）')
  const openFileInputRef = useRef<HTMLInputElement>(null)

  const updateMarkdown = useCallback((nextMarkdown: string) => {
    setMarkdown((currentMarkdown) => {
      if (currentMarkdown !== nextMarkdown) {
        setIsDirty(true)
        setStatusText('未保存更改')
      }
      return nextMarkdown
    })
  }, [])

  const markSaved = useCallback((fileName: string, handle: MarkdownFileHandle | null) => {
    setActiveFileName(fileName)
    setActiveFileHandle(handle)
    setIsDirty(false)
    setStatusText(`已保存：${fileName}`)
  }, [])

  const downloadMarkdown = useCallback((targetName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = targetName
    anchor.click()
    URL.revokeObjectURL(url)
  }, [])

  const handleOpen = useCallback(async () => {
    if (isDirty && !window.confirm('当前文档有未保存更改，继续打开将丢失改动。是否继续？')) {
      return
    }

    try {
      const { handle, file, content } = await openMarkdownViaPicker(window as unknown as { showOpenFilePicker?: OpenFilePickerApi['showOpenFilePicker'] })
      setMarkdown(content)
      markSaved(file.name, handle)
    } catch (error) {
      if ((error as Error).message === 'OPEN_PICKER_UNSUPPORTED') {
        openFileInputRef.current?.click()
        return
      }

      if ((error as DOMException).name === 'AbortError') {
        return
      }

      setStatusText('打开失败：请选择 .md/.markdown 文件')
    }
  }, [isDirty, markSaved])

  const handleSaveAs = useCallback(async () => {
    try {
      const handle = await saveMarkdownAsViaPicker(
        window as unknown as { showSaveFilePicker?: SaveFilePickerApi['showSaveFilePicker'] },
        markdown,
        activeFileName
      )
      const savedFile = await handle.getFile()
      markSaved(savedFile.name, handle)
    } catch (error) {
      if ((error as Error).message === 'SAVE_PICKER_UNSUPPORTED') {
        downloadMarkdown(activeFileName, markdown)
        markSaved(activeFileName, null)
        return
      }

      if ((error as DOMException).name === 'AbortError') {
        return
      }

      setStatusText('另存为失败')
    }
  }, [activeFileName, downloadMarkdown, markSaved, markdown])

  const handleSave = useCallback(async () => {
    try {
      if (activeFileHandle) {
        await saveMarkdownViaHandle(activeFileHandle, markdown)
        markSaved(activeFileName, activeFileHandle)
        return
      }

      await handleSaveAs()
    } catch {
      setStatusText('保存失败')
    }
  }, [activeFileHandle, activeFileName, handleSaveAs, markSaved, markdown])

  const handleOpenFallbackChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0]
      event.target.value = ''

      if (!selectedFile) {
        return
      }

      if (!isMarkdownFileName(selectedFile.name)) {
        setStatusText('打开失败：仅支持 .md/.markdown')
        return
      }

      const content = await readMarkdownFile(selectedFile)
      setMarkdown(content)
      markSaved(selectedFile.name, null)
    },
    [markSaved]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 's') {
        event.preventDefault()
        void handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleSave])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) {
        return
      }

      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty])

  const saveButtonLabel = useMemo(() => (isDirty ? '保存*' : '保存'), [isDirty])

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Markdown Preview</h1>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="文件与编辑模式操作">
            <button
              type="button"
              onClick={() => {
                void handleOpen()
              }}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
            >
              打开
            </button>
            <button
              type="button"
              onClick={() => {
                void handleSave()
              }}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              {saveButtonLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                void handleSaveAs()
              }}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-sky-100 text-sky-800 hover:bg-sky-200"
            >
              另存为
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('dual-pane')}
              aria-pressed={editorMode === 'dual-pane'}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                editorMode === 'dual-pane'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              双栏模式
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('wysiwyg')}
              aria-pressed={editorMode === 'wysiwyg'}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                editorMode === 'wysiwyg'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              WYSIWYG 模式
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-3 sm:px-6 lg:px-8 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span aria-label="当前文件">文件：{activeFileName}</span>
          <span className="text-gray-400">|</span>
          <span aria-label="保存状态">状态：{statusText}</span>
          <span className="text-gray-400">|</span>
          <span>快捷键：Ctrl/Cmd+S</span>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {editorMode === 'dual-pane' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MarkdownInput markdown={markdown} setMarkdown={updateMarkdown} />
            <MarkdownPreview markdown={markdown} />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 px-1">
              当前为 WYSIWYG 模式，单栏编辑区可直接编辑渲染结果并同步回 Markdown。
            </p>
            <WysiwygEditor markdown={markdown} setMarkdown={updateMarkdown} />
          </div>
        )}
      </main>
      <input
        ref={openFileInputRef}
        type="file"
        accept=".md,.markdown,text/markdown"
        className="hidden"
        onChange={(event) => {
          void handleOpenFallbackChange(event)
        }}
      />
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
