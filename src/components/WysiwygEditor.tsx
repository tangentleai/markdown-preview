import React, { useEffect, useRef } from 'react'
import { markdownToEditableHtml } from '../utils/markdownDocumentModel'

interface WysiwygEditorProps {
  markdown: string
  setMarkdown: (value: string) => void
}

const nodeToMarkdown = (node: ChildNode): string => {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? '').replace(/\u00A0/g, ' ')
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return ''
  }

  const element = node as HTMLElement
  const textFromChildren = () => Array.from(element.childNodes).map(nodeToMarkdown).join('')

  switch (element.tagName) {
    case 'BR':
      return '\n'
    case 'STRONG':
    case 'B':
      return `**${textFromChildren()}**`
    case 'EM':
    case 'I':
      return `*${textFromChildren()}*`
    case 'CODE':
      return `\`${textFromChildren()}\``
    case 'A': {
      const href = element.getAttribute('href') ?? '#'
      return `[${textFromChildren()}](${href})`
    }
    default:
      return textFromChildren()
  }
}

const blockToMarkdown = (element: Element): string => {
  const tagName = element.tagName

  if (tagName.match(/^H[1-6]$/)) {
    const level = Number.parseInt(tagName.slice(1), 10)
    return `${'#'.repeat(level)} ${Array.from(element.childNodes).map(nodeToMarkdown).join('').trim()}`
  }

  if (tagName === 'UL') {
    return Array.from(element.children)
      .map((child) => `- ${Array.from(child.childNodes).map(nodeToMarkdown).join('').trim()}`)
      .join('\n')
  }

  if (tagName === 'OL') {
    return Array.from(element.children)
      .map(
        (child, index) =>
          `${index + 1}. ${Array.from(child.childNodes).map(nodeToMarkdown).join('').trim()}`
      )
      .join('\n')
  }

  if (tagName === 'PRE') {
    const code = element.textContent ?? ''
    return `\`\`\`\n${code.trimEnd()}\n\`\`\``
  }

  return Array.from(element.childNodes)
    .map(nodeToMarkdown)
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const htmlToMarkdown = (root: HTMLElement): string => {
  const blocks = Array.from(root.children)
    .map((element) => blockToMarkdown(element).trim())
    .filter(Boolean)

  if (blocks.length === 0) {
    return ''
  }

  return `${blocks.join('\n\n')}\n`
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ markdown, setMarkdown }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const lastSyncedMarkdownRef = useRef<string>('')

  useEffect(() => {
    if (!editorRef.current) {
      return
    }

    if (lastSyncedMarkdownRef.current === markdown) {
      return
    }

    editorRef.current.innerHTML = markdownToEditableHtml(markdown)
    lastSyncedMarkdownRef.current = markdown
  }, [markdown])

  const handleInput = () => {
    if (!editorRef.current) {
      return
    }

    const nextMarkdown = htmlToMarkdown(editorRef.current)
    lastSyncedMarkdownRef.current = nextMarkdown

    if (nextMarkdown !== markdown) {
      setMarkdown(nextMarkdown)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">WYSIWYG 编辑</h2>
      <p className="text-sm text-gray-600 mb-3">内核选型: 原生 contentEditable（MVP 最小可编辑集成）</p>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="markdown-preview min-h-[600px] max-h-[600px] overflow-auto rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="WYSIWYG 编辑区"
        role="textbox"
      />
    </div>
  )
}

export default WysiwygEditor
