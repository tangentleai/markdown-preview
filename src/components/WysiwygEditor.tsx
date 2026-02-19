import React, { useEffect, useRef } from 'react'
import { markdownToEditableHtml } from '../utils/markdownDocumentModel'
import {
  BlockInputRuleUndoStack,
  canTriggerBlockInputRule,
  isImeComposingEvent,
  type BlockInputRuleMatch,
  type BlockInputRuleTransaction
} from '../utils/wysiwygBlockInputRules'
import { matchInlineStyleRule, type InlineStyleRuleMatch } from '../utils/wysiwygInlineStyleRules'

interface WysiwygEditorProps {
  markdown: string
  setMarkdown: (value: string) => void
  jumpToHeadingIndex?: number
  jumpRequestNonce?: number
}

const escapeMarkdownAltText = (value: string): string => value.replaceAll('\\', '\\\\').replaceAll(']', '\\]')

const toMarkdownImageReference = (fileName: string): string => encodeURI(fileName).replaceAll('#', '%23')

const toImageAltText = (fileName: string): string => {
  const normalized = fileName.trim()
  const extensionIndex = normalized.lastIndexOf('.')
  if (extensionIndex <= 0) {
    return normalized || 'image'
  }

  return normalized.slice(0, extensionIndex)
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
    case 'IMG': {
      const alt = element.getAttribute('alt') ?? ''
      const src = element.getAttribute('data-markdown-src') ?? element.getAttribute('src') ?? ''
      if (!src) {
        return ''
      }

      return `![${escapeMarkdownAltText(alt)}](${src})`
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

const getClosestBlockElement = (node: Node | null, root: HTMLElement): HTMLElement | null => {
  if (!node) {
    return null
  }

  const startElement = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement
  if (!startElement) {
    return null
  }

  const block = startElement.closest('p, h1, h2, h3, h4, h5, h6, li, blockquote, pre') as HTMLElement | null
  if (!block || !root.contains(block)) {
    return null
  }

  return block
}

const setCaretToStart = (target: HTMLElement): void => {
  const selection = window.getSelection()
  if (!selection) {
    return
  }

  const range = document.createRange()

  if (target.firstChild && target.firstChild.nodeType === Node.TEXT_NODE) {
    range.setStart(target.firstChild, 0)
  } else {
    range.setStart(target, 0)
  }

  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}

const setCaretAfterNode = (node: Node): void => {
  const selection = window.getSelection()
  if (!selection) {
    return
  }

  const range = document.createRange()
  range.setStartAfter(node)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}

const isSelectionInsideEditor = (selection: Selection, editor: HTMLElement): boolean => {
  const anchorNode = selection.anchorNode
  if (!anchorNode) {
    return false
  }

  return editor.contains(anchorNode)
}

const insertNodeAtSelectionOrAppend = (editor: HTMLElement, node: Node): void => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0 || !isSelectionInsideEditor(selection, editor)) {
    editor.append(node)
    setCaretAfterNode(node)
    return
  }

  const range = selection.getRangeAt(0)
  range.deleteContents()
  range.insertNode(node)
  setCaretAfterNode(node)
}

const getCaretTextOffsetInBlock = (range: Range, block: HTMLElement): number => {
  const preCaretRange = range.cloneRange()
  preCaretRange.selectNodeContents(block)
  preCaretRange.setEnd(range.startContainer, range.startOffset)
  return preCaretRange.toString().length
}

const isBlockTextEmpty = (block: HTMLElement): boolean =>
  (block.textContent ?? '').replace(/\u00A0/g, ' ').trim().length === 0

const replaceBlockWithParagraph = (block: HTMLElement): HTMLElement => {
  const paragraph = document.createElement('p')
  const blockText = (block.textContent ?? '').replace(/\u00A0/g, ' ')

  if (blockText.length > 0) {
    paragraph.append(document.createTextNode(blockText))
  } else {
    paragraph.append(document.createElement('br'))
  }

  block.replaceWith(paragraph)
  return paragraph
}

const exitEmptyListItem = (listItem: HTMLElement): HTMLElement => {
  const list = listItem.parentElement
  if (!list || (list.tagName !== 'UL' && list.tagName !== 'OL') || !list.parentElement) {
    return replaceBlockWithParagraph(listItem)
  }

  const paragraph = document.createElement('p')
  paragraph.append(document.createElement('br'))

  const siblings = Array.from(list.children)
  const listItemIndex = siblings.indexOf(listItem)
  const trailingItems = listItemIndex >= 0 ? siblings.slice(listItemIndex + 1) : []

  if (trailingItems.length > 0) {
    const tailList = document.createElement(list.tagName.toLowerCase())
    trailingItems.forEach((item) => tailList.append(item))
    list.after(tailList)
  }

  listItem.remove()
  list.after(paragraph)

  if (list.children.length === 0) {
    list.remove()
  }

  return paragraph
}

const exitEmptyBlockquote = (blockInQuote: HTMLElement): HTMLElement => {
  const quote = blockInQuote.closest('blockquote')
  if (!quote || !quote.parentElement) {
    return replaceBlockWithParagraph(blockInQuote)
  }

  const paragraph = document.createElement('p')
  paragraph.append(document.createElement('br'))
  blockInQuote.remove()
  quote.after(paragraph)

  if (quote.textContent?.trim().length === 0 || quote.children.length === 0) {
    quote.remove()
  }

  return paragraph
}

const createInlineElement = (match: InlineStyleRuleMatch): HTMLElement => {
  switch (match.rule) {
    case 'strong': {
      const strong = document.createElement('strong')
      strong.textContent = match.content
      return strong
    }
    case 'em': {
      const em = document.createElement('em')
      em.textContent = match.content
      return em
    }
    case 'code': {
      const code = document.createElement('code')
      code.textContent = match.content
      return code
    }
    case 'link': {
      const anchor = document.createElement('a')
      anchor.textContent = match.content
      anchor.setAttribute('href', match.href ?? '#')
      return anchor
    }
    default: {
      const fallback = document.createElement('span')
      fallback.textContent = match.content
      return fallback
    }
  }
}

const replaceBlockByRule = (block: HTMLElement, ruleMatch: BlockInputRuleMatch): HTMLElement => {
  switch (ruleMatch.rule) {
    case 'heading-1': {
      const heading = document.createElement('h1')
      heading.append(document.createElement('br'))
      block.replaceWith(heading)
      return heading
    }
    case 'unordered-list': {
      const ul = document.createElement('ul')
      const li = document.createElement('li')
      li.append(document.createElement('br'))
      ul.append(li)
      block.replaceWith(ul)
      return li
    }
    case 'ordered-list': {
      const ol = document.createElement('ol')
      const li = document.createElement('li')
      li.append(document.createElement('br'))
      ol.append(li)
      block.replaceWith(ol)
      return li
    }
    case 'blockquote': {
      const quote = document.createElement('blockquote')
      const paragraph = document.createElement('p')
      paragraph.append(document.createElement('br'))
      quote.append(paragraph)
      block.replaceWith(quote)
      return paragraph
    }
    case 'code-block': {
      const pre = document.createElement('pre')
      const code = document.createElement('code')
      code.append(document.createElement('br'))
      pre.append(code)
      block.replaceWith(pre)
      return code
    }
    default:
      return block
  }
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  markdown,
  setMarkdown,
  jumpToHeadingIndex,
  jumpRequestNonce
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const lastSyncedMarkdownRef = useRef<string>('')
  const structuralHistoryRef = useRef(new BlockInputRuleUndoStack())
  const isImeComposingRef = useRef(false)

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

  useEffect(() => {
    if (!editorRef.current || jumpToHeadingIndex === undefined) {
      return
    }

    const headings = Array.from(editorRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6')) as HTMLElement[]
    const targetHeading = headings[jumpToHeadingIndex]

    if (!targetHeading) {
      return
    }

    targetHeading.scrollIntoView({ block: 'center', behavior: 'smooth' })
    setCaretToStart(targetHeading)
    editorRef.current.focus()
  }, [jumpToHeadingIndex, jumpRequestNonce])

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

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer) {
      return
    }

    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!editorRef.current || !event.dataTransfer) {
      return
    }

    const droppedFiles = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith('image/'))
    if (droppedFiles.length === 0) {
      return
    }

    event.preventDefault()
    const editor = editorRef.current
    const firstBlock = editor.firstElementChild as HTMLElement | null
    const shouldReplaceEmptyParagraph =
      editor.children.length === 1 && firstBlock?.tagName === 'P' && (firstBlock.textContent ?? '').trim().length === 0

    if (shouldReplaceEmptyParagraph && firstBlock) {
      firstBlock.remove()
    }

    let insertedImage: HTMLImageElement | null = null

    droppedFiles.forEach((file) => {
      const markdownSrc = toMarkdownImageReference(file.name)
      const image = document.createElement('img')
      image.setAttribute('src', URL.createObjectURL(file))
      image.setAttribute('alt', toImageAltText(file.name))
      image.setAttribute('data-markdown-src', markdownSrc)

      const paragraph = document.createElement('p')
      paragraph.append(image)
      insertNodeAtSelectionOrAppend(editor, paragraph)
      insertedImage = image
    })

    if (insertedImage) {
      const nextMarkdown = htmlToMarkdown(editor)
      lastSyncedMarkdownRef.current = nextMarkdown
      if (nextMarkdown !== markdown) {
        setMarkdown(nextMarkdown)
      }
    }
  }

  const applyTransactionSnapshot = (
    transaction: BlockInputRuleTransaction,
    direction: 'undo' | 'redo'
  ) => {
    if (!editorRef.current) {
      return
    }

    const snapshotMarkdown = direction === 'undo' ? transaction.beforeMarkdown : transaction.afterMarkdown
    const snapshotHtml = direction === 'undo' ? transaction.beforeHtml : transaction.afterHtml
    editorRef.current.innerHTML = snapshotHtml ?? markdownToEditableHtml(snapshotMarkdown)
    const restoreTarget =
      (editorRef.current.firstElementChild as HTMLElement | null) ??
      editorRef.current.appendChild(document.createElement('p'))
    if (direction === 'undo' && !restoreTarget.firstChild && transaction.triggerText) {
      restoreTarget.append(document.createTextNode(transaction.triggerText))
    }
    setCaretToStart(restoreTarget)

    lastSyncedMarkdownRef.current = snapshotMarkdown
    setMarkdown(snapshotMarkdown)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!editorRef.current) {
      return
    }

    const imeComposingNow = isImeComposingEvent(event.nativeEvent, isImeComposingRef.current)

    if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 'z') {
      const transaction = structuralHistoryRef.current.undo()

      if (!transaction) {
        return
      }

      event.preventDefault()
      applyTransactionSnapshot(transaction, 'undo')
      return
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      ((event.shiftKey && event.key.toLowerCase() === 'z') || (!event.shiftKey && event.key.toLowerCase() === 'y'))
    ) {
      const transaction = structuralHistoryRef.current.redo()

      if (!transaction) {
        return
      }

      event.preventDefault()
      applyTransactionSnapshot(transaction, 'redo')
      return
    }

    if (!imeComposingNow && (event.key === 'Enter' || event.key === 'Backspace')) {
      const selection = window.getSelection()
      if (selection && selection.isCollapsed && selection.rangeCount > 0) {
        const block = getClosestBlockElement(selection.anchorNode, editorRef.current)
        if (block) {
          const range = selection.getRangeAt(0)
          const caretOffset = getCaretTextOffsetInBlock(range, block)
          const isCaretAtStart = caretOffset === 0

          if (event.key === 'Backspace' && block.tagName.match(/^H[1-6]$/) && isCaretAtStart) {
            const beforeMarkdown = htmlToMarkdown(editorRef.current)
            const beforeHtml = editorRef.current.innerHTML
            event.preventDefault()
            const paragraph = replaceBlockWithParagraph(block)
            setCaretToStart(paragraph)

            const nextMarkdown = htmlToMarkdown(editorRef.current)
            const afterHtml = editorRef.current.innerHTML
            structuralHistoryRef.current.push({
              rule: 'heading-to-paragraph',
              triggerText: '',
              triggerKey: 'Backspace',
              beforeMarkdown,
              afterMarkdown: nextMarkdown,
              beforeHtml,
              afterHtml,
              beforeCursorOffset: 0,
              afterCursorOffset: 0,
              createdAt: new Date().toISOString()
            })
            lastSyncedMarkdownRef.current = nextMarkdown
            if (nextMarkdown !== markdown) {
              setMarkdown(nextMarkdown)
            }
            return
          }

          if (event.key === 'Enter' && isBlockTextEmpty(block)) {
            if (block.tagName === 'LI') {
              const beforeMarkdown = htmlToMarkdown(editorRef.current)
              const beforeHtml = editorRef.current.innerHTML
              event.preventDefault()
              const paragraph = exitEmptyListItem(block)
              setCaretToStart(paragraph)

              const nextMarkdown = htmlToMarkdown(editorRef.current)
              const afterHtml = editorRef.current.innerHTML
              structuralHistoryRef.current.push({
                rule: 'exit-empty-list-item',
                triggerText: '',
                triggerKey: 'Enter',
                beforeMarkdown,
                afterMarkdown: nextMarkdown,
                beforeHtml,
                afterHtml,
                beforeCursorOffset: 0,
                afterCursorOffset: 0,
                createdAt: new Date().toISOString()
              })
              lastSyncedMarkdownRef.current = nextMarkdown
              if (nextMarkdown !== markdown) {
                setMarkdown(nextMarkdown)
              }
              return
            }

            if (block.closest('blockquote')) {
              const beforeMarkdown = htmlToMarkdown(editorRef.current)
              const beforeHtml = editorRef.current.innerHTML
              event.preventDefault()
              const paragraph = exitEmptyBlockquote(block)
              setCaretToStart(paragraph)

              const nextMarkdown = htmlToMarkdown(editorRef.current)
              const afterHtml = editorRef.current.innerHTML
              structuralHistoryRef.current.push({
                rule: 'exit-empty-blockquote',
                triggerText: '',
                triggerKey: 'Enter',
                beforeMarkdown,
                afterMarkdown: nextMarkdown,
                beforeHtml,
                afterHtml,
                beforeCursorOffset: 0,
                afterCursorOffset: 0,
                createdAt: new Date().toISOString()
              })
              lastSyncedMarkdownRef.current = nextMarkdown
              if (nextMarkdown !== markdown) {
                setMarkdown(nextMarkdown)
              }
              return
            }
          }
        }
      }
    }

    if (!imeComposingNow && ['*', '`', ')'].includes(event.key)) {
      const selection = window.getSelection()
      if (selection && selection.isCollapsed && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const anchorNode = range.startContainer

        if (anchorNode.nodeType === Node.TEXT_NODE) {
          const textNode = anchorNode as Text
          const originalText = textNode.textContent ?? ''
          const offset = range.startOffset
          const candidateText = `${originalText.slice(0, offset)}${event.key}`
          const inlineMatch = matchInlineStyleRule(candidateText)
          const block = getClosestBlockElement(anchorNode, editorRef.current)

          if (inlineMatch && block && inlineMatch.end === candidateText.length) {
            event.preventDefault()

            const beforeText = candidateText.slice(0, inlineMatch.start)
            const afterText = originalText.slice(offset)
            const fragment = document.createDocumentFragment()

            if (beforeText) {
              fragment.append(document.createTextNode(beforeText))
            }

            const styledElement = createInlineElement(inlineMatch)
            fragment.append(styledElement)

            if (afterText) {
              fragment.append(document.createTextNode(afterText))
            }

            textNode.replaceWith(fragment)
            setCaretAfterNode(styledElement)

            const nextMarkdown = htmlToMarkdown(editorRef.current)
            lastSyncedMarkdownRef.current = nextMarkdown
            if (nextMarkdown !== markdown) {
              setMarkdown(nextMarkdown)
            }
            return
          }
        }
      }
    }

    if (imeComposingNow || (![' ', 'Enter'].includes(event.key) && event.key !== 'Spacebar')) {
      return
    }

    const key = event.key === 'Spacebar' ? ' ' : event.key
    const selection = window.getSelection()
    if (!selection || !selection.isCollapsed) {
      return
    }

    const block = getClosestBlockElement(selection.anchorNode, editorRef.current)
    if (!block) {
      return
    }

    const rawLineText = (block.textContent ?? '').replace(/\u00A0/g, ' ')
    const lineText = rawLineText.trim()
    const range = selection.getRangeAt(0)
    const isCaretAtEnd = range.endOffset === (selection.anchorNode?.textContent?.length ?? range.endOffset)

    if (!isCaretAtEnd || rawLineText !== lineText) {
      return
    }

    const match = canTriggerBlockInputRule(lineText, key)
    if (!match) {
      return
    }

    event.preventDefault()

    const beforeMarkdown = htmlToMarkdown(editorRef.current)
    const beforeHtml = editorRef.current.innerHTML
    const transformedEditableTarget = replaceBlockByRule(block, match)
    setCaretToStart(transformedEditableTarget)
    const afterMarkdown = htmlToMarkdown(editorRef.current)
    const afterHtml = editorRef.current.innerHTML

    const transaction: BlockInputRuleTransaction = {
      rule: match.rule,
      triggerText: match.triggerText,
      triggerKey: match.triggerKey,
      beforeMarkdown,
      afterMarkdown,
      beforeHtml,
      afterHtml,
      beforeCursorOffset: rawLineText.length,
      afterCursorOffset: 0,
      createdAt: new Date().toISOString()
    }

    structuralHistoryRef.current.push(transaction)
    lastSyncedMarkdownRef.current = afterMarkdown
    setMarkdown(afterMarkdown)
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
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onCompositionStart={() => {
          isImeComposingRef.current = true
        }}
        onCompositionEnd={() => {
          isImeComposingRef.current = false
        }}
        className="markdown-preview min-h-[600px] max-h-[600px] overflow-auto rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="WYSIWYG 编辑区"
        role="textbox"
      />
    </div>
  )
}

export default WysiwygEditor
