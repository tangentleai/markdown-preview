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
} from './core/markdownFileService'

type EditorMode = 'dual-pane' | 'wysiwyg'

interface OutlineHeading {
  id: string
  level: number
  text: string
  index: number
}

const OUTLINE_WIDTH_MIN = 220
const OUTLINE_WIDTH_MAX = 420
const OUTLINE_WIDTH_DEFAULT = 260

const clampOutlineWidth = (width: number): number =>
  Math.min(OUTLINE_WIDTH_MAX, Math.max(OUTLINE_WIDTH_MIN, Math.round(width)))

const normalizeOutlineHeadingText = (value: string): string =>
  value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .trim()

const toOutlineHeadings = (sourceMarkdown: string): OutlineHeading[] => {
  const slugCountByText = new Map<string, number>()
  let headingIndex = 0
  let inCodeBlock = false

  return sourceMarkdown
    .split('\n')
    .flatMap((line) => {
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock
        return []
      }
      
      if (inCodeBlock) {
        return []
      }
      
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
      if (!headingMatch) {
        return []
      }

      const level = headingMatch[1].length
      const text = normalizeOutlineHeadingText(headingMatch[2]) || '(空标题)'
      const currentCount = slugCountByText.get(text) ?? 0
      slugCountByText.set(text, currentCount + 1)
      const id = currentCount === 0 ? text : `${text}-${currentCount + 1}`
      const nextIndex = headingIndex
      headingIndex += 1

      return [{ id, level, text, index: nextIndex }]
    })
}

function App() {
  const [editorMode, setEditorMode] = useState<EditorMode>('wysiwyg')
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
  const [jumpToHeadingIndex, setJumpToHeadingIndex] = useState<number | undefined>(undefined)
  const [jumpRequestNonce, setJumpRequestNonce] = useState(0)
  const [outlineWidth, setOutlineWidth] = useState<number>(OUTLINE_WIDTH_DEFAULT)
  const [isOutlineResizing, setIsOutlineResizing] = useState<boolean>(false)
  const [isOutlineDrawerOpen, setIsOutlineDrawerOpen] = useState<boolean>(false)
  const openFileInputRef = useRef<HTMLInputElement>(null)
  const outlineResizeRef = useRef<{ startX: number; startWidth: number } | null>(null)

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

  useEffect(() => {
    if (!isOutlineResizing) {
      return
    }

    const previousCursor = document.body.style.cursor
    const previousUserSelect = document.body.style.userSelect
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    return () => {
      document.body.style.cursor = previousCursor
      document.body.style.userSelect = previousUserSelect
    }
  }, [isOutlineResizing])

  useEffect(() => {
    if (!isOutlineResizing) {
      return
    }

    const handlePointerMove = (event: PointerEvent) => {
      const dragState = outlineResizeRef.current
      if (!dragState) {
        return
      }

      const delta = event.clientX - dragState.startX
      setOutlineWidth(clampOutlineWidth(dragState.startWidth + delta))
    }

    const stopResize = () => {
      outlineResizeRef.current = null
      setIsOutlineResizing(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopResize)
    window.addEventListener('pointercancel', stopResize)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', stopResize)
      window.removeEventListener('pointercancel', stopResize)
    }
  }, [isOutlineResizing])

  const handleOutlineResizePointerDown = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) {
      return
    }

    outlineResizeRef.current = {
      startX: event.clientX,
      startWidth: outlineWidth
    }

    setIsOutlineResizing(true)
    event.preventDefault()
  }, [outlineWidth])

  const saveButtonLabel = useMemo(() => (isDirty ? '保存*' : '保存'), [isDirty])
  const outlineHeadings = useMemo(() => toOutlineHeadings(markdown), [markdown])

  useEffect(() => {
    if (editorMode !== 'wysiwyg' && isOutlineDrawerOpen) {
      setIsOutlineDrawerOpen(false)
    }
  }, [editorMode, isOutlineDrawerOpen])

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
        <div className="max-w-7xl mx-auto px-4 pb-1 sm:px-6 lg:px-8 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span aria-label="当前文件">文件：{activeFileName}</span>
          <span className="text-gray-400">|</span>
          <span aria-label="保存状态">状态：{statusText}</span>
          <span className="text-gray-400">|</span>
          <span>快捷键：Ctrl/Cmd+S（WYSIWYG: Ctrl/Cmd+B、Ctrl/Cmd+I、Ctrl/Cmd+E）</span>
        </div>
      </header>
      <main
        className={
          editorMode === 'wysiwyg'
            ? 'w-full pt-2 pb-6 sm:pr-6 lg:pr-8'
            : 'max-w-7xl mx-auto pt-2 pb-6 sm:px-6 lg:px-8'
        }
      >
        {editorMode === 'dual-pane' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MarkdownInput markdown={markdown} setMarkdown={updateMarkdown} />
            <MarkdownPreview markdown={markdown} />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="lg:hidden px-1">
              <button
                type="button"
                onClick={() => setIsOutlineDrawerOpen(true)}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                aria-label="打开移动端大纲抽屉"
                aria-expanded={isOutlineDrawerOpen}
              >
                大纲
              </button>
            </div>
            {/* <p className="text-sm text-gray-600 px-1">
              当前为 WYSIWYG 模式，单栏编辑区可直接编辑渲染结果并同步回 Markdown。
            </p> */}
            {isOutlineDrawerOpen ? (
              <div className="fixed inset-0 z-40 lg:hidden" aria-label="移动端标题大纲抽屉">
                <button
                  type="button"
                  className="absolute inset-0 bg-gray-900/35"
                  onClick={() => setIsOutlineDrawerOpen(false)}
                  aria-label="关闭移动端大纲抽屉遮罩"
                />
                <aside className="absolute left-0 top-0 h-full w-[82%] max-w-xs border-r border-gray-200 bg-white p-3 shadow-xl overflow-y-auto" aria-label="移动端标题大纲">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">标题大纲</h3>
                    <button
                      type="button"
                      onClick={() => setIsOutlineDrawerOpen(false)}
                      className="rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                      aria-label="关闭移动端大纲抽屉"
                    >
                      关闭
                    </button>
                  </div>
                  {outlineHeadings.length > 0 ? (
                    <ul className="space-y-1.5" aria-label="标题大纲列表">
                      {outlineHeadings.map((heading) => (
                        <li key={heading.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setJumpToHeadingIndex(heading.index)
                              setJumpRequestNonce((current) => current + 1)
                              setIsOutlineDrawerOpen(false)
                            }}
                            className="w-full rounded px-2 py-1.5 text-left text-sm leading-5 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                            style={{ paddingLeft: `${12 + (heading.level - 1) * 14}px` }}
                          >
                            <span
                              className="block"
                              style={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 3,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {heading.text}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">当前文档暂无 H1-H6 标题</p>
                  )}
                </aside>
              </div>
            ) : null}
            <div
              className="grid grid-cols-1 gap-4 lg:grid-cols-[var(--outline-width)_10px_minmax(0,1fr)]"
              aria-label="大纲与编辑区联动布局"
              style={{ '--outline-width': `${outlineWidth}px` } as React.CSSProperties}
            >
              <aside className="hidden lg:block lg:sticky lg:top-4 lg:self-start rounded-lg border border-gray-200 bg-white p-3 max-h-[calc(100vh-120px)] overflow-y-auto" aria-label="标题大纲">
                <h3 className="mb-2 text-sm font-semibold text-gray-800">标题大纲</h3>
                {outlineHeadings.length > 0 ? (
                  <ul className="space-y-1.5" aria-label="标题大纲列表">
                    {outlineHeadings.map((heading) => (
                      <li key={heading.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setJumpToHeadingIndex(heading.index)
                            setJumpRequestNonce((current) => current + 1)
                            setIsOutlineDrawerOpen(false)
                          }}
                          className="w-full rounded px-2 py-1.5 text-left text-sm leading-5 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                          style={{ paddingLeft: `${12 + (heading.level - 1) * 14}px` }}
                        >
                          <span
                            className="block"
                            style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 3,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {heading.text}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">当前文档暂无 H1-H6 标题</p>
                )}
              </aside>
              <div className="hidden lg:flex items-stretch">
                <button
                  type="button"
                  role="separator"
                  aria-label="拖拽调整大纲宽度"
                  aria-orientation="vertical"
                  aria-valuemin={OUTLINE_WIDTH_MIN}
                  aria-valuemax={OUTLINE_WIDTH_MAX}
                  aria-valuenow={outlineWidth}
                  onPointerDown={handleOutlineResizePointerDown}
                  className={`w-full h-full rounded transition-colors ${
                    isOutlineResizing ? 'bg-blue-500/50' : 'bg-gray-200 hover:bg-blue-300/70'
                  }`}
                />
              </div>
              <div className="w-full" aria-label="编辑区右侧列容器">
                <div className="w-full lg:mx-auto lg:w-[68%]" aria-label="编辑区布局容器">
                  <WysiwygEditor
                    markdown={markdown}
                    setMarkdown={updateMarkdown}
                    jumpToHeadingIndex={jumpToHeadingIndex}
                    jumpRequestNonce={jumpRequestNonce}
                  />
                </div>
              </div>
            </div>
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
