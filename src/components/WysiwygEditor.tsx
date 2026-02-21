import React, { useEffect, useRef, useState } from 'react'
import { markdownToEditableHtml } from '../utils/markdownDocumentModel'
import {
  BlockInputRuleUndoStack,
  canTriggerBlockInputRule,
  isImeComposingEvent,
  type BlockInputRuleMatch,
  type BlockInputRuleTransaction
} from '../utils/wysiwygBlockInputRules'
import { matchInlineStyleRule, type InlineStyleRuleMatch } from '../utils/wysiwygInlineStyleRules'
import {
  findTextMatches,
  getRegexQueryError,
  replaceRegexMatch,
  resolveFindOptions,
  type FindMatchOptions,
  type TextMatchRange
} from '../utils/findMatchEngine'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import mermaid from 'mermaid'
import { encode as encodePlantUml } from 'plantuml-encoder'
import 'monaco-editor/min/vs/editor/editor.main.css'
import findPreviousIcon from '../assets/iconfont/find-previous.svg'
import findNextIcon from '../assets/iconfont/find-next.svg'
import replaceCurrentIcon from '../assets/iconfont/replace-current.svg'
import replaceAllIcon from '../assets/iconfont/replace-all.svg'
import closeSearchIcon from '../assets/iconfont/close-search.svg'
import caseSensitiveIcon from '../assets/iconfont/case-sensitive.svg'
import wholeWordIcon from '../assets/iconfont/whole-word.svg'
import regexModeIcon from '../assets/iconfont/regex-mode.svg'

interface WysiwygEditorProps {
  markdown: string
  setMarkdown: (value: string) => void
  jumpToHeadingIndex?: number
  jumpRequestNonce?: number
}

type IconButtonInteractionState = 'default' | 'hover' | 'active'

const ICON_BUTTON_TOOLTIPS: Record<string, string> = {
  close: '关闭查找替换工具栏',
  'case-sensitive': '区分大小写',
  'whole-word': '查找整个单词',
  'regex-mode': '正则模式',
  'find-previous': '查找上一个',
  'find-next': '查找下一个',
  'replace-current': '替换当前',
  'replace-all': '替换全部'
}

const TOOLTIP_LONG_PRESS_DELAY_MS = 450

type MonacoApi = typeof import('monaco-editor')

let monacoEnvironmentReady = false
let monacoLoadPromise: Promise<MonacoApi> | null = null

const ensureMonacoEnvironment = () => {
  if (monacoEnvironmentReady || typeof window === 'undefined') {
    return
  }
  monacoEnvironmentReady = true
  ;(window as Window & { MonacoEnvironment?: { getWorker: (workerId: string, label: string) => Worker } }).MonacoEnvironment =
    {
      getWorker: (_workerId: string, label: string) => {
        if (label === 'json') {
          return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url), {
            type: 'module'
          })
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
          return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker', import.meta.url), {
            type: 'module'
          })
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
          return new Worker(new URL('monaco-editor/esm/vs/language/html/html.worker', import.meta.url), {
            type: 'module'
          })
        }
        if (label === 'typescript' || label === 'javascript') {
          return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url), {
            type: 'module'
          })
        }
        return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url), {
          type: 'module'
        })
      }
    }
}

const loadMonaco = () => {
  ensureMonacoEnvironment()
  if (!monacoLoadPromise) {
    monacoLoadPromise = Promise.all([
      import('monaco-editor/esm/vs/editor/editor.api'),
      import('monaco-editor/esm/vs/basic-languages/_.contribution'),
      import('monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'),
      import('monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution'),
      import('monaco-editor/esm/vs/basic-languages/python/python.contribution'),
      import('monaco-editor/esm/vs/basic-languages/java/java.contribution'),
      import('monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution'),
      import('monaco-editor/esm/vs/basic-languages/csharp/csharp.contribution'),
      import('monaco-editor/esm/vs/basic-languages/go/go.contribution'),
      import('monaco-editor/esm/vs/basic-languages/rust/rust.contribution'),
      import('monaco-editor/esm/vs/basic-languages/ruby/ruby.contribution'),
      import('monaco-editor/esm/vs/basic-languages/php/php.contribution'),
      import('monaco-editor/esm/vs/basic-languages/swift/swift.contribution'),
      import('monaco-editor/esm/vs/basic-languages/kotlin/kotlin.contribution'),
      import('monaco-editor/esm/vs/basic-languages/scala/scala.contribution'),
      import('monaco-editor/esm/vs/basic-languages/sql/sql.contribution'),
      import('monaco-editor/esm/vs/basic-languages/html/html.contribution'),
      import('monaco-editor/esm/vs/basic-languages/css/css.contribution'),
      import('monaco-editor/esm/vs/basic-languages/scss/scss.contribution'),
      import('monaco-editor/esm/vs/basic-languages/less/less.contribution'),
      import('monaco-editor/esm/vs/basic-languages/xml/xml.contribution'),
      import('monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution'),
      import('monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution'),
      import('monaco-editor/esm/vs/basic-languages/shell/shell.contribution'),
      import('monaco-editor/esm/vs/basic-languages/powershell/powershell.contribution'),
      import('monaco-editor/esm/vs/basic-languages/dockerfile/dockerfile.contribution')
    ]).then(([monaco]) => monaco)
  }
  return monacoLoadPromise
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

const renderInlineMathWithFallback = (tex: string): string => {
  try {
    return katex.renderToString(tex, { throwOnError: true })
  } catch {
    return tex
  }
}

const renderBlockMathWithFallback = (tex: string): string => {
  try {
    return katex.renderToString(tex, { displayMode: true, throwOnError: true })
  } catch {
    return tex
  }
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
    case 'SPAN': {
      const className = element.getAttribute('class') ?? ''
      if (className.includes('math-inline')) {
        const tex = element.getAttribute('data-tex') ?? ''
        return tex ? `$${tex}$` : textFromChildren()
      }
      return textFromChildren()
    }
    default:
      return textFromChildren()
  }
}

const blockToMarkdown = (element: Element): string => {
  const tagName = element.tagName
  const attr = (name: string) => (element as HTMLElement).getAttribute(name) ?? ''
  if (attr('data-diagram-editor') === 'true' || attr('data-math-editor') === 'true') {
    return ''
  }

  if (tagName.match(/^H[1-6]$/)) {
    const level = Number.parseInt(tagName.slice(1), 10)
    return `${'#'.repeat(level)} ${Array.from(element.childNodes).map(nodeToMarkdown).join('').trim()}`
  }

  if (tagName === 'HR') {
    return '---'
  }

  if (tagName === 'DIV' && (element.getAttribute('class') ?? '').includes('math-block')) {
    const tex = element.getAttribute('data-tex') ?? ''
    return `$$\n${tex}\n$$`
  }

  if (tagName === 'DIV') {
    const cls = (element.getAttribute('class') ?? '').toLowerCase()
    if (cls.includes('mermaid')) {
      const raw = element.getAttribute('data-raw') ?? element.textContent ?? ''
      return `\`\`\`mermaid\n${raw.trim()}\n\`\`\``
    }
    if (cls.includes('plantuml-container')) {
      const img = element.querySelector('img')
      const code = img?.getAttribute('data-plantuml-code') ?? ''
      if (code) {
        return `\`\`\`plantuml\n${code}\n\`\`\``
      }
    }
    if (element.getAttribute('data-code-block') === 'true') {
      const language = element.getAttribute('data-language') ?? ''
      const stored = element.getAttribute('data-code') ?? ''
      const codeElement = element.querySelector('pre code')
      const code = stored || codeElement?.textContent || ''
      const normalized = code.replace(/\u00A0/g, ' ')
      const trimmed = normalized.replace(/\s+$/, '')
      return `\`\`\`${language}\n${trimmed}\n\`\`\``
    }
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

  const block = startElement.closest(
    'p, h1, h2, h3, h4, h5, h6, li, blockquote, pre, hr, div[data-code-block="true"]'
  ) as HTMLElement | null
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

const setCaretToEditorEnd = (editor: HTMLElement): void => {
  const selection = window.getSelection()
  if (!selection) {
    return
  }

  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT)
  let current = walker.nextNode()
  let lastTextNode: Text | null = null

  while (current) {
    lastTextNode = current as Text
    current = walker.nextNode()
  }

  const range = document.createRange()
  if (lastTextNode) {
    const endOffset = lastTextNode.textContent?.length ?? 0
    range.setStart(lastTextNode, endOffset)
  } else {
    range.selectNodeContents(editor)
    range.collapse(false)
  }

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

const normalizeSelectionToFindQuery = (value: string): string =>
  value
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const getNormalizedSelectionInEditor = (editor: HTMLElement): string => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return ''
  }

  const range = selection.getRangeAt(0)
  if (!editor.contains(range.commonAncestorContainer)) {
    return ''
  }

  return normalizeSelectionToFindQuery(selection.toString())
}

const clearFindHighlights = (editor: HTMLElement): void => {
  const highlights = Array.from(editor.querySelectorAll('span[data-find-highlight="true"]')) as HTMLSpanElement[]
  highlights.forEach((highlight) => {
    const parent = highlight.parentNode
    if (!parent) {
      return
    }

    while (highlight.firstChild) {
      parent.insertBefore(highlight.firstChild, highlight)
    }

    parent.removeChild(highlight)
    parent.normalize()
  })
}

const applyFindHighlights = (
  editor: HTMLElement,
  matches: Array<{ start: number; end: number }>,
  activeIndex: number
): void => {
  clearFindHighlights(editor)

  if (matches.length === 0) {
    return
  }

  const segments: Array<{ node: Text; start: number; end: number }> = []
  const walker = createEditorTextWalker(editor)
  let traversed = 0

  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const text = node.textContent ?? ''
    const length = text.length
    if (length === 0) {
      continue
    }
    segments.push({ node, start: traversed, end: traversed + length })
    traversed += length
  }

  let matchPointer = 0

  segments.forEach((segment) => {
    while (matchPointer < matches.length && matches[matchPointer].end <= segment.start) {
      matchPointer += 1
    }

    let overlapPointer = matchPointer
    while (overlapPointer < matches.length && matches[overlapPointer].start < segment.end) {
      overlapPointer += 1
    }

    if (overlapPointer === matchPointer) {
      return
    }

    const originalText = segment.node.textContent ?? ''
    const fragment = document.createDocumentFragment()
    let localCursor = segment.start

    for (let index = matchPointer; index < overlapPointer; index += 1) {
      const overlapStart = Math.max(matches[index].start, segment.start)
      const overlapEnd = Math.min(matches[index].end, segment.end)

      if (overlapStart > localCursor) {
        const plainText = originalText.slice(localCursor - segment.start, overlapStart - segment.start)
        if (plainText) {
          fragment.append(document.createTextNode(plainText))
        }
      }

      if (overlapEnd > overlapStart) {
        const matchText = originalText.slice(overlapStart - segment.start, overlapEnd - segment.start)
        if (matchText) {
          const highlight = document.createElement('span')
          highlight.dataset.findHighlight = 'true'
          highlight.dataset.findMatchIndex = String(index)
          const isActiveMatch = index === activeIndex
          highlight.className = isActiveMatch ? 'wysiwyg-find-hit wysiwyg-find-hit-active' : 'wysiwyg-find-hit'
          highlight.dataset.findHighlightState = isActiveMatch ? 'active' : 'all'
          highlight.textContent = matchText
          fragment.append(highlight)
        }
      }

      localCursor = overlapEnd
    }

    if (localCursor < segment.end) {
      const plainTail = originalText.slice(localCursor - segment.start)
      if (plainTail) {
        fragment.append(document.createTextNode(plainTail))
      }
    }

    segment.node.replaceWith(fragment)
  })

  const highlightedNodes = Array.from(editor.querySelectorAll('span[data-find-highlight="true"]')) as HTMLSpanElement[]
  highlightedNodes.forEach((node) => {
    const isActiveMatch = Number(node.dataset.findMatchIndex) === activeIndex
    node.classList.toggle('wysiwyg-find-hit-active', isActiveMatch)
    node.dataset.findHighlightState = isActiveMatch ? 'active' : 'all'
  })
}

const isElementVisibleInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth
  const verticallyVisible = rect.bottom > 0 && rect.top < viewportHeight
  const horizontallyVisible = rect.right > 0 && rect.left < viewportWidth
  return verticallyVisible && horizontallyVisible
}

const scrollFindMatchIntoViewIfNeeded = (editor: HTMLElement, targetIndex: number): void => {
  const target = editor.querySelector(`[data-find-match-index="${targetIndex}"]`) as HTMLElement | null
  if (!target || isElementVisibleInViewport(target)) {
    return
  }

  target.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}

const createEditorTextWalker = (editor: HTMLElement) =>
  document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const parent = (node as Text).parentElement
      if (!parent) {
        return NodeFilter.FILTER_REJECT
      }
      if (parent.closest('[data-code-block="true"]')) {
        return NodeFilter.FILTER_REJECT
      }
      if (parent.closest('[data-diagram-editor="true"]')) {
        return NodeFilter.FILTER_REJECT
      }
      if (parent.closest('[data-math-editor="true"]')) {
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    }
  })

const getTopLevelTextContainer = (editor: HTMLElement, node: Text): HTMLElement | null => {
  let current = node.parentElement
  while (current && current.parentElement && current.parentElement !== editor) {
    current = current.parentElement
  }
  return current
}

const getEditorPlainTextMetadata = (
  editor: HTMLElement
): {
  text: string
  wordBoundaryBreaks: Set<number>
} => {
  const walker = createEditorTextWalker(editor)
  const chunks: string[] = []
  const wordBoundaryBreaks = new Set<number>()
  let traversed = 0
  let previousTopLevelContainer: HTMLElement | null = null

  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const value = (node.textContent ?? '').replace(/\u00A0/g, ' ')
    if (!value) {
      continue
    }

    const currentTopLevelContainer = getTopLevelTextContainer(editor, node)
    if (
      previousTopLevelContainer &&
      currentTopLevelContainer &&
      previousTopLevelContainer !== currentTopLevelContainer
    ) {
      wordBoundaryBreaks.add(traversed)
    }

    chunks.push(value)
    traversed += value.length
    previousTopLevelContainer = currentTopLevelContainer
  }

  return {
    text: chunks.join(''),
    wordBoundaryBreaks
  }
}

const getEditorPlainText = (editor: HTMLElement): string => {
  return getEditorPlainTextMetadata(editor).text
}

const resolveTextPosition = (
  editor: HTMLElement,
  targetOffset: number,
  preferEnd: boolean
): { node: Text; offset: number } | null => {
  const walker = createEditorTextWalker(editor)
  let traversed = 0
  let lastTextNode: Text | null = null

  while (walker.nextNode()) {
    const currentNode = walker.currentNode as Text
    const textLength = currentNode.textContent?.length ?? 0
    lastTextNode = currentNode

    if (targetOffset < traversed + textLength || (preferEnd && targetOffset === traversed + textLength)) {
      return {
        node: currentNode,
        offset: Math.max(0, Math.min(textLength, targetOffset - traversed))
      }
    }

    traversed += textLength
  }

  if (!lastTextNode) {
    return null
  }

  return {
    node: lastTextNode,
    offset: lastTextNode.textContent?.length ?? 0
  }
}

const createRangeFromOffsets = (editor: HTMLElement, start: number, end: number): Range | null => {
  const startPosition = resolveTextPosition(editor, start, false)
  const endPosition = resolveTextPosition(editor, end, true)

  if (!startPosition || !endPosition) {
    return null
  }

  const range = document.createRange()
  range.setStart(startPosition.node, startPosition.offset)
  range.setEnd(endPosition.node, endPosition.offset)
  return range
}

const selectEditorRangeByOffsets = (editor: HTMLElement, start: number, end: number): boolean => {
  const range = createRangeFromOffsets(editor, start, end)
  const selection = window.getSelection()

  if (!range || !selection) {
    return false
  }

  selection.removeAllRanges()
  selection.addRange(range)
  return true
}

const replaceEditorRangeByOffsets = (
  editor: HTMLElement,
  start: number,
  end: number,
  replacement: string
): boolean => {
  const range = createRangeFromOffsets(editor, start, end)
  if (!range) {
    return false
  }

  range.deleteContents()
  const replacementNode = document.createTextNode(replacement)
  range.insertNode(replacementNode)
  setCaretAfterNode(replacementNode)
  return true
}

const replaceAllByMatchRanges = (
  editor: HTMLElement,
  matches: TextMatchRange[],
  getReplacement: (match: TextMatchRange) => string
): number => {
  if (matches.length === 0) {
    return 0
  }

  let replaceCount = 0

  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const target = matches[index]
    const replacement = getReplacement(target)
    const replaced = replaceEditorRangeByOffsets(editor, target.start, target.end, replacement)
    if (replaced) {
      replaceCount += 1
    }
  }

  return replaceCount
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
    case 'math': {
      const wrapper = document.createElement('span')
      wrapper.setAttribute('class', 'math-inline')
      wrapper.setAttribute('data-tex', match.content)
      wrapper.innerHTML = renderInlineMathWithFallback(match.content)
      return wrapper
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
    case 'heading-2': {
      const heading = document.createElement('h2')
      heading.append(document.createElement('br'))
      block.replaceWith(heading)
      return heading
    }
    case 'heading-3': {
      const heading = document.createElement('h3')
      heading.append(document.createElement('br'))
      block.replaceWith(heading)
      return heading
    }
    case 'heading-4': {
      const heading = document.createElement('h4')
      heading.append(document.createElement('br'))
      block.replaceWith(heading)
      return heading
    }
    case 'heading-5': {
      const heading = document.createElement('h5')
      heading.append(document.createElement('br'))
      block.replaceWith(heading)
      return heading
    }
    case 'heading-6': {
      const heading = document.createElement('h6')
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
      const container = document.createElement('div')
      container.setAttribute('data-code-block', 'true')
      container.setAttribute('data-language', ruleMatch.language ?? '')
      container.setAttribute('contenteditable', 'false')
      container.setAttribute('data-focus-on-mount', 'true')
      container.className = 'wysiwyg-code-block'
      const pre = document.createElement('pre')
      pre.className = 'wysiwyg-code-fallback'
      const code = document.createElement('code')
      code.append(document.createElement('br'))
      pre.append(code)
      container.append(pre)
      block.replaceWith(container)
      return container
    }
    case 'horizontal-rule': {
      const hr = document.createElement('hr')
      const paragraph = document.createElement('p')
      paragraph.append(document.createElement('br'))
      block.replaceWith(hr, paragraph)
      return paragraph
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
  const findInputRef = useRef<HTMLInputElement>(null)
  const markdownRef = useRef(markdown)
  const monacoEditorsRef = useRef(
    new Map<
      HTMLElement,
      {
        editor: import('monaco-editor').editor.IStandaloneCodeEditor
        dispose: () => void
        wasEmptyBeforeKeyDown: boolean
      }
    >()
  )
  const monacoMountingRef = useRef(new Set<HTMLElement>())
  const activeMathEditorRef = useRef<{
    target: HTMLElement
    container: HTMLElement
    close: (options?: { syncMarkdown?: boolean }) => void
  } | null>(null)
  const monacoThemeReadyRef = useRef(false)
  const [findQuery, setFindQuery] = useState('')
  const [replaceQuery, setReplaceQuery] = useState('')
  const [isCaseSensitiveFind, setIsCaseSensitiveFind] = useState(false)
  const [isWholeWordFind, setIsWholeWordFind] = useState(false)
  const [isRegexFind, setIsRegexFind] = useState(false)
  const [findRegexError, setFindRegexError] = useState<string | null>(null)
  const [activeFindIndex, setActiveFindIndex] = useState(-1)
  const [findResultCount, setFindResultCount] = useState(0)
  const [showFindToolbar, setShowFindToolbar] = useState(false)
  const [findToolbarMode, setFindToolbarMode] = useState<'find' | 'replace'>('find')
  const [iconButtonStates, setIconButtonStates] = useState<Record<string, IconButtonInteractionState>>({})
  const [visibleTooltipButtonId, setVisibleTooltipButtonId] = useState<string | null>(null)
  const longPressTimerRef = useRef<number | null>(null)

  const getFindOptions = (): FindMatchOptions =>
    resolveFindOptions({
      caseSensitive: isCaseSensitiveFind,
      wholeWord: isWholeWordFind,
      regex: isRegexFind
    })

  const getFindMatches = (editor: HTMLElement, query: string): TextMatchRange[] => {
    const metadata = getEditorPlainTextMetadata(editor)
    return findTextMatches(metadata.text, query, {
      ...getFindOptions(),
      wordBoundaryBreaks: metadata.wordBoundaryBreaks
    })
  }

  const looksLikeMarkdown = (value: string): boolean => {
    if (!value || !/\S/.test(value)) {
      return false
    }
    const lines = value.split('\n')
    if (
      lines.some(
        (l) =>
          /^(#{1,6})\s+/.test(l) ||
          /^>\s?/.test(l) ||
          /^([-*+])\s+/.test(l) ||
          /^\d+\.\s+/.test(l) ||
          /^```/.test(l) ||
          /^\$\$\s*$/.test(l) ||
          /^\\\[\s*$/.test(l) ||
          /^\\\]\s*$/.test(l)
      )
    ) {
      return true
    }
    if (
      /\*\*[^*]+\*\*/.test(value) ||
      /\*[^*]+\*/.test(value) ||
      /`[^`]+`/.test(value) ||
      /\\\((?:\\.|[^\\\n])+\\\)/.test(value)
    ) {
      return true
    }
    if (/\[[^\]]+\]\([^)]+\)/.test(value) || /!\[[^\]]*\]\([^)]+\)/.test(value)) {
      return true
    }
    return false
  }


  useEffect(() => {
    markdownRef.current = markdown
  }, [markdown])

  const getCodeBlockValue = (element: HTMLElement): string => {
    const stored = element.getAttribute('data-code') ?? ''
    if (stored) {
      return stored
    }
    const codeElement = element.querySelector('pre code')
    return codeElement?.textContent ?? ''
  }

  const setCodeBlockValue = (element: HTMLElement, value: string) => {
    element.setAttribute('data-code', value)
    const codeElement = element.querySelector('pre code')
    if (codeElement) {
      codeElement.textContent = value
    }
  }

  const ensureMonacoTheme = (monaco: MonacoApi) => {
    if (monacoThemeReadyRef.current) {
      return
    }
    monaco.editor.defineTheme('wysiwyg-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b' },
        { token: 'string', foreground: '0f766e' },
        { token: 'keyword', foreground: '1d4ed8' },
        { token: 'number', foreground: 'b45309' }
      ],
      colors: {
        'editor.background': '#F8F9FA',
        'editorForeground': '#111827',
        'editorLineNumber.foreground': '#94A3B8',
        'editorLineNumber.activeForeground': '#475569',
        'editor.selectionBackground': '#DCE7F8',
        'editor.inactiveSelectionBackground': '#E7EEF8',
        'editorIndentGuide.background': '#E2E8F0',
        'editorIndentGuide.activeBackground': '#CBD5F5'
      }
    })
    monacoThemeReadyRef.current = true
  }

  const scheduleEditorMount = (work: () => void) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      ;(window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback?.(work)
      return
    }
    globalThis.setTimeout(work, 0)
  }

  const mountMonacoEditors = async () => {
    if (!editorRef.current) {
      return
    }
    const containers = Array.from(
      editorRef.current.querySelectorAll('[data-code-block="true"]')
    ) as HTMLElement[]
    const liveSet = new Set(containers)
    monacoEditorsRef.current.forEach((instance, container) => {
      if (!liveSet.has(container)) {
        instance.dispose()
        monacoEditorsRef.current.delete(container)
        monacoMountingRef.current.delete(container)
      }
    })
    if (containers.length === 0) {
      return
    }
    const monaco = await loadMonaco()
    ensureMonacoTheme(monaco)
    containers.forEach((container) => {
      if (monacoEditorsRef.current.has(container)) {
        const instance = monacoEditorsRef.current.get(container)
        if (instance) {
          const nextValue = getCodeBlockValue(container)
          if (instance.editor.getValue() !== nextValue) {
            instance.editor.setValue(nextValue)
          }
        }
        return
      }
      if (monacoMountingRef.current.has(container)) {
        return
      }
      monacoMountingRef.current.add(container)
      scheduleEditorMount(() => {
        if (!monacoMountingRef.current.has(container)) {
          return
        }
        if (!container.isConnected) {
          monacoMountingRef.current.delete(container)
          return
        }
        container.setAttribute('contenteditable', 'false')
        const existingHost = container.querySelector('.wysiwyg-monaco-host')
        if (existingHost) {
          existingHost.remove()
        }
        const existingHeader = container.querySelector('.wysiwyg-code-header')
        if (existingHeader) {
          existingHeader.remove()
        }
        const fallback = container.querySelector('pre')
        if (fallback) {
          fallback.classList.add('wysiwyg-code-fallback')
        }
        
        const supportedLanguages = [
          'plaintext', 'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp',
          'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'sql',
          'html', 'css', 'scss', 'less', 'xml', 'yaml', 'markdown', 'shell', 'dockerfile'
        ]
        
        const header = document.createElement('div')
        header.className = 'wysiwyg-code-header'
        const languageSelect = document.createElement('select')
        languageSelect.className = 'wysiwyg-code-language-select'
        const currentLanguage = container.getAttribute('data-language') || 'plaintext'
        
        supportedLanguages.forEach((lang) => {
          const option = document.createElement('option')
          option.value = lang
          option.textContent = lang === 'plaintext' ? 'Plain Text' : lang.charAt(0).toUpperCase() + lang.slice(1)
          if (lang === currentLanguage) {
            option.selected = true
          }
          languageSelect.append(option)
        })
        
        header.append(languageSelect)
        container.append(header)
        
        const editorHost = document.createElement('div')
        editorHost.className = 'wysiwyg-monaco-host'
        container.append(editorHost)
        container.classList.add('wysiwyg-code-block-mounted')
        const value = getCodeBlockValue(container)
        const editor = monaco.editor.create(editorHost, {
          value,
          language: currentLanguage,
          theme: 'wysiwyg-light',
          lineNumbers: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          fontSize: 13,
          padding: { top: 12, bottom: 12 },
          tabSize: 2,
          automaticLayout: true,
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
            handleMouseWheel: false
          }
        })
        
        const handleLanguageChange = () => {
          const newLanguage = languageSelect.value
          container.setAttribute('data-language', newLanguage)
          monaco.editor.setModelLanguage(editor.getModel()!, newLanguage)
          if (editorRef.current) {
            const nextMarkdown = htmlToMarkdown(editorRef.current)
            lastSyncedMarkdownRef.current = nextMarkdown
            if (nextMarkdown !== markdownRef.current) {
              setMarkdown(nextMarkdown)
            }
          }
        }
        languageSelect.addEventListener('change', handleLanguageChange)
        
        const resizeObserver = new ResizeObserver(() => {
          editor.layout()
        })
        resizeObserver.observe(editorHost)
        const updateHeight = () => {
          const contentHeight = editor.getContentHeight()
          editorHost.style.height = `${contentHeight}px`
          editor.layout()
        }
        updateHeight()
        const sizeListener = editor.onDidContentSizeChange(updateHeight)
        let syncTimer: number | null = null
        const changeListener = editor.onDidChangeModelContent(() => {
          const nextValue = editor.getValue()
          setCodeBlockValue(container, nextValue)
          if (syncTimer !== null) {
            window.clearTimeout(syncTimer)
          }
          syncTimer = window.setTimeout(() => {
            if (!editorRef.current) {
              return
            }
            const nextMarkdown = htmlToMarkdown(editorRef.current)
            lastSyncedMarkdownRef.current = nextMarkdown
            if (nextMarkdown !== markdownRef.current) {
              setMarkdown(nextMarkdown)
            }
          }, 150)
        })
        
        const handleCodeBlockKeyDown = (event: KeyboardEvent) => {
          const model = editor.getModel()
          if (!model) {
            event.stopPropagation()
            return
          }
          
          const instance = monacoEditorsRef.current.get(container)
          if (event.key === 'Backspace') {
            const content = model.getValue()
            const selection = editor.getSelection()
            const isEmpty = content.trim() === ''
            const isAtStart = selection && selection.startLineNumber === 1 && selection.startColumn === 1
            
            if (isEmpty && isAtStart && instance && instance.wasEmptyBeforeKeyDown) {
              event.preventDefault()
              event.stopPropagation()
              if (editorRef.current) {
                const beforeMarkdown = htmlToMarkdown(editorRef.current)
                const beforeHtml = editorRef.current.innerHTML
                instance.dispose()
                monacoEditorsRef.current.delete(container)
                const paragraph = document.createElement('p')
                paragraph.append(document.createElement('br'))
                container.replaceWith(paragraph)
                setCaretToStart(paragraph)
                const nextMarkdown = htmlToMarkdown(editorRef.current)
                const afterHtml = editorRef.current.innerHTML
                structuralHistoryRef.current.push({
                  rule: 'code-block',
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
                if (nextMarkdown !== markdownRef.current) {
                  setMarkdown(nextMarkdown)
                }
              }
              return
            }
            
            if (instance) {
              instance.wasEmptyBeforeKeyDown = isEmpty
            }
          } else if (instance) {
            instance.wasEmptyBeforeKeyDown = model.getValue().trim() === ''
          }
          event.stopPropagation()
        }
        
        editorHost.addEventListener('keydown', handleCodeBlockKeyDown)
        const stopPropagation = (event: Event) => {
          event.stopPropagation()
        }
        container.addEventListener('keypress', stopPropagation)
        container.addEventListener('keyup', stopPropagation)
        
        const dispose = () => {
          languageSelect.removeEventListener('change', handleLanguageChange)
          editorHost.removeEventListener('keydown', handleCodeBlockKeyDown)
          container.removeEventListener('keypress', stopPropagation)
          container.removeEventListener('keyup', stopPropagation)
          resizeObserver.disconnect()
          sizeListener.dispose()
          changeListener.dispose()
          editor.dispose()
          monacoMountingRef.current.delete(container)
        }
        const initialValue = value.trim() === ''
        monacoEditorsRef.current.set(container, { editor, dispose, wasEmptyBeforeKeyDown: initialValue })
        monacoMountingRef.current.delete(container)
        if (container.getAttribute('data-focus-on-mount') === 'true') {
          container.removeAttribute('data-focus-on-mount')
          editor.focus()
        }
      })
    })
  }

  const insertNodesAfterBlockOrAppend = (editor: HTMLElement, block: HTMLElement | null, nodes: Node[]): void => {
    if (block && block.parentElement) {
      const parent = block.parentElement
      const reference = block.nextSibling
      nodes.forEach((node) => {
        parent.insertBefore(node, reference)
      })
      const last = nodes[nodes.length - 1]
      setCaretAfterNode(last)
      return
    }
    nodes.forEach((node) => {
      editor.append(node)
    })
    const last = nodes[nodes.length - 1]
    setCaretAfterNode(last)
  }

  useEffect(() => {
    if (!editorRef.current) {
      return
    }

    if (lastSyncedMarkdownRef.current !== markdown) {
      dismissMathEditor({ syncMarkdown: false })
      monacoEditorsRef.current.forEach((instance) => {
        instance.dispose()
      })
      monacoEditorsRef.current.clear()
      monacoMountingRef.current.clear()
      editorRef.current.innerHTML = markdownToEditableHtml(markdown)
      lastSyncedMarkdownRef.current = markdown
    }
    void mountMonacoEditors()
  }, [markdown])

  useEffect(() => {
    return () => {
      dismissMathEditor({ syncMarkdown: true })
      monacoEditorsRef.current.forEach((instance) => {
        instance.dispose()
      })
      monacoEditorsRef.current.clear()
    }
  }, [])

  useEffect(() => {
    if (!editorRef.current) {
      return
    }
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    })
    const elements = editorRef.current.querySelectorAll('.mermaid')
    if (elements.length > 0) {
      try {
        mermaid.run({
          nodes: elements as unknown as NodeListOf<Element>
        } as any)
      } catch {
        // ignore
      }
    }
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

    targetHeading.scrollIntoView({ block: 'start', behavior: 'smooth' })
    setCaretToStart(targetHeading)
    editorRef.current.focus()
  }, [jumpToHeadingIndex, jumpRequestNonce])

  useEffect(() => {
    if (!isRegexFind || !findQuery) {
      setFindRegexError(null)
      return
    }

    setFindRegexError(getRegexQueryError(findQuery, isCaseSensitiveFind))
  }, [findQuery, isCaseSensitiveFind, isRegexFind])

  useEffect(() => {
    if (!editorRef.current || !findQuery) {
      setFindResultCount(0)
      setActiveFindIndex(-1)
      return
    }

    if (findRegexError) {
      setFindResultCount(0)
      setActiveFindIndex(-1)
      return
    }

    const matches = getFindMatches(editorRef.current, findQuery)
    setFindResultCount(matches.length)
    setActiveFindIndex((current) => {
      if (matches.length === 0) {
        return -1
      }

      if (current < 0) {
        return -1
      }

      return Math.min(current, matches.length - 1)
    })
  }, [findQuery, findRegexError, isCaseSensitiveFind, isRegexFind, isWholeWordFind, markdown])

  useEffect(() => {
    if (!editorRef.current) {
      return
    }

    if (!showFindToolbar || !findQuery || findRegexError) {
      clearFindHighlights(editorRef.current)
      return
    }

    const matches = getFindMatches(editorRef.current, findQuery)
    applyFindHighlights(editorRef.current, matches, activeFindIndex)

    if (activeFindIndex >= 0 && activeFindIndex < matches.length) {
      scrollFindMatchIntoViewIfNeeded(editorRef.current, activeFindIndex)
    }
  }, [activeFindIndex, findQuery, findRegexError, isCaseSensitiveFind, isRegexFind, isWholeWordFind, markdown, showFindToolbar])

  useEffect(() => {
    if (showFindToolbar) {
      findInputRef.current?.focus()
    }
  }, [showFindToolbar])

  useEffect(() => {
    if (isRegexFind && isWholeWordFind) {
      setIsWholeWordFind(false)
    }
  }, [isRegexFind, isWholeWordFind])

  const handleInput = () => {
    if (!editorRef.current) {
      return
    }

    const nextMarkdown = htmlToMarkdown(editorRef.current)
    lastSyncedMarkdownRef.current = nextMarkdown

    if (nextMarkdown !== markdownRef.current) {
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

  const navigateFindResult = (direction: 'next' | 'previous') => {
    if (!editorRef.current || !findQuery || findRegexError) {
      setFindResultCount(0)
      setActiveFindIndex(-1)
      return
    }

    const matches = getFindMatches(editorRef.current, findQuery)
    setFindResultCount(matches.length)

    if (matches.length === 0) {
      setActiveFindIndex(-1)
      return
    }

    const targetIndex =
      direction === 'next'
        ? activeFindIndex < 0
          ? 0
          : (activeFindIndex + 1) % matches.length
        : activeFindIndex < 0
          ? matches.length - 1
          : (activeFindIndex - 1 + matches.length) % matches.length

    setActiveFindIndex(targetIndex)
  }

  const handleFindNext = () => {
    navigateFindResult('next')
  }

  const handleFindPrevious = () => {
    navigateFindResult('previous')
  }

  const resetFindToolbarState = () => {
    setFindQuery('')
    setReplaceQuery('')
    setIsCaseSensitiveFind(false)
    setIsWholeWordFind(false)
    setIsRegexFind(false)
    setFindRegexError(null)
    setActiveFindIndex(-1)
    setFindResultCount(0)
    setFindToolbarMode('find')
    setIconButtonStates({})
  }

  const closeFindToolbarAndRestoreEditorFocus = () => {
    setShowFindToolbar(false)
    resetFindToolbarState()
    if (editorRef.current) {
      clearFindHighlights(editorRef.current)
    }

    window.requestAnimationFrame(() => {
      const editor = editorRef.current
      if (!editor) {
        return
      }

      editor.focus({ preventScroll: true })
      setCaretToEditorEnd(editor)
    })
  }

  const handleFindInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && showFindToolbar) {
      event.preventDefault()
      event.stopPropagation()
      closeFindToolbarAndRestoreEditorFocus()
      return
    }

    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    handleFindNext()

    window.requestAnimationFrame(() => {
      const input = findInputRef.current
      if (!input) {
        return
      }

      input.focus({ preventScroll: true })
      const caret = input.value.length
      input.setSelectionRange(caret, caret)
    })
  }

  const handleReplaceInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Escape' || !showFindToolbar) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    closeFindToolbarAndRestoreEditorFocus()
  }

  const syncMarkdownFromEditor = () => {
    if (!editorRef.current) {
      return
    }

    const nextMarkdown = htmlToMarkdown(editorRef.current)
    lastSyncedMarkdownRef.current = nextMarkdown
    if (nextMarkdown !== markdownRef.current) {
      setMarkdown(nextMarkdown)
    }
  }

  const applyMathPreview = (target: HTMLElement, tex: string) => {
    target.setAttribute('data-tex', tex)
    target.innerHTML = renderBlockMathWithFallback(tex)
  }

  const dismissMathEditor = (options?: { syncMarkdown?: boolean }) => {
    const active = activeMathEditorRef.current
    if (!active) {
      return
    }
    activeMathEditorRef.current = null
    active.close(options)
  }

  const openMathEditorInline = async (target: HTMLElement) => {
    if (!editorRef.current) {
      return
    }

    const activeMath = activeMathEditorRef.current
    if (activeMath?.target === target) {
      return
    }
    if (activeMath) {
      dismissMathEditor({ syncMarkdown: true })
    }

    const host = editorRef.current
    const existingDiagramEditor = host.querySelector('[data-diagram-editor="true"]') as HTMLElement | null
    if (existingDiagramEditor) {
      existingDiagramEditor.remove()
      syncMarkdownFromEditor()
    }

    const monaco = await loadMonaco()
    ensureMonacoTheme(monaco)

    const container = document.createElement('div')
    container.setAttribute('data-math-editor', 'true')
    container.setAttribute('contenteditable', 'false')
    container.className = 'wysiwyg-code-block wysiwyg-code-block-mounted mb-2'

    const header = document.createElement('div')
    header.className = 'wysiwyg-code-header'
    const label = document.createElement('span')
    label.className = 'wysiwyg-code-language-select'
    label.style.cursor = 'default'
    label.textContent = 'LaTeX'
    const status = document.createElement('span')
    status.className = 'text-xs text-gray-500 ml-auto'
    status.textContent = '同步中'
    header.append(label, status)

    const editorHost = document.createElement('div')
    editorHost.className = 'wysiwyg-monaco-host'

    container.append(header, editorHost)
    target.parentElement?.insertBefore(container, target)

    const editor = monaco.editor.create(editorHost, {
      value: target.getAttribute('data-tex') ?? '',
      language: 'markdown',
      theme: 'wysiwyg-light',
      lineNumbers: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      fontSize: 13,
      padding: { top: 12, bottom: 12 },
      tabSize: 2,
      automaticLayout: true
    })

    editorHost.querySelectorAll('textarea').forEach((textarea) => {
      textarea.setAttribute('aria-label', '数学公式编辑区')
    })

    const resizeObserver = new ResizeObserver(() => {
      editor.layout()
    })
    resizeObserver.observe(editorHost)

    const updateHeight = () => {
      const contentHeight = editor.getContentHeight()
      editorHost.style.height = `${contentHeight}px`
      editor.layout()
    }
    updateHeight()
    const sizeListener = editor.onDidContentSizeChange(updateHeight)

    let syncTimer: number | null = null

    const flushPreviewAndMarkdown = () => {
      const value = editor.getValue()
      applyMathPreview(target, value)
      status.textContent = '已同步'
      status.className = 'text-xs text-emerald-600 ml-auto'
      syncMarkdownFromEditor()
    }

    const changeListener = editor.onDidChangeModelContent(() => {
      if (syncTimer !== null) {
        window.clearTimeout(syncTimer)
      }
      status.textContent = '同步中'
      status.className = 'text-xs text-gray-500 ml-auto'
      syncTimer = window.setTimeout(() => {
        flushPreviewAndMarkdown()
      }, 150)
    })

    const closeEditor = (closeOptions?: { syncMarkdown?: boolean }) => {
      if (syncTimer !== null) {
        window.clearTimeout(syncTimer)
        syncTimer = null
      }
      const shouldSyncMarkdown = closeOptions?.syncMarkdown !== false
      applyMathPreview(target, editor.getValue())
      resizeObserver.disconnect()
      sizeListener.dispose()
      changeListener.dispose()
      editorHost.removeEventListener('keydown', handleMathEditorKeyDown)
      editor.dispose()
      container.remove()
      if (shouldSyncMarkdown) {
        syncMarkdownFromEditor()
      }
      setCaretToStart(target)
      editorRef.current?.focus({ preventScroll: true })
      if (activeMathEditorRef.current?.container === container) {
        activeMathEditorRef.current = null
      }
    }

    const handleMathEditorKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        closeEditor({ syncMarkdown: true })
      }
    }
    editorHost.addEventListener('keydown', handleMathEditorKeyDown)

    activeMathEditorRef.current = {
      target,
      container,
      close: closeEditor
    }
    editor.focus()
  }

  const handleReplaceCurrent = () => {
    if (!editorRef.current || !findQuery || findRegexError) {
      return
    }

    clearFindHighlights(editorRef.current)
    const plainText = getEditorPlainText(editorRef.current)
    const matches = getFindMatches(editorRef.current, findQuery)
    setFindResultCount(matches.length)

    if (matches.length === 0) {
      setActiveFindIndex(-1)
      return
    }

    const targetIndex = activeFindIndex < 0 ? 0 : Math.min(activeFindIndex, matches.length - 1)
    const targetMatch = matches[targetIndex]
    const matchedText = plainText.slice(targetMatch.start, targetMatch.end)
    let replacementText = replaceQuery
    if (isRegexFind) {
      try {
        replacementText = replaceRegexMatch(matchedText, findQuery, replaceQuery, isCaseSensitiveFind)
      } catch (error) {
        setFindRegexError(getRegexQueryError(findQuery, isCaseSensitiveFind) ?? (error instanceof Error ? error.message : '正则表达式无效'))
        return
      }
    }

    const replaced = replaceEditorRangeByOffsets(editorRef.current, targetMatch.start, targetMatch.end, replacementText)

    if (!replaced) {
      return
    }

    syncMarkdownFromEditor()

    const refreshedMatches = getFindMatches(editorRef.current, findQuery)
    setFindResultCount(refreshedMatches.length)

    if (refreshedMatches.length === 0) {
      setActiveFindIndex(-1)
      return
    }

    const nextIndex = Math.min(targetIndex, refreshedMatches.length - 1)
    setActiveFindIndex(nextIndex)
    const nextMatch = refreshedMatches[nextIndex]
    selectEditorRangeByOffsets(editorRef.current, nextMatch.start, nextMatch.end)
  }

  const handleReplaceAll = () => {
    if (!editorRef.current || !findQuery || findRegexError) {
      return
    }

    clearFindHighlights(editorRef.current)
    const plainText = getEditorPlainText(editorRef.current)
    const matches = getFindMatches(editorRef.current, findQuery)
    const replaceCount = replaceAllByMatchRanges(editorRef.current, matches, (match) => {
      if (!isRegexFind) {
        return replaceQuery
      }

      const matchedText = plainText.slice(match.start, match.end)
      return replaceRegexMatch(matchedText, findQuery, replaceQuery, isCaseSensitiveFind)
    })
    if (replaceCount === 0) {
      return
    }

    syncMarkdownFromEditor()
    const refreshedMatches = getFindMatches(editorRef.current, findQuery)
    setFindResultCount(refreshedMatches.length)

    if (refreshedMatches.length === 0) {
      setActiveFindIndex(-1)
      return
    }

    setActiveFindIndex(0)
    const firstMatch = refreshedMatches[0]
    selectEditorRangeByOffsets(editorRef.current, firstMatch.start, firstMatch.end)
  }

  const hasFindMatches = findResultCount > 0
  const disableFindActions = !hasFindMatches || Boolean(findRegexError)
  const isReplaceMode = findToolbarMode === 'replace'
  const iconButtonBaseClass =
    'wysiwyg-find-icon-btn inline-flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-50'
  const clearLongPressTimer = () => {
    if (longPressTimerRef.current === null) {
      return
    }
    window.clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = null
  }
  const showIconTooltip = (buttonId: string) => {
    setVisibleTooltipButtonId(buttonId)
  }
  const hideIconTooltip = (buttonId?: string) => {
    setVisibleTooltipButtonId((current) => {
      if (!buttonId || current === buttonId) {
        return null
      }
      return current
    })
  }
  const updateIconButtonState = (buttonId: string, nextState: IconButtonInteractionState) => {
    setIconButtonStates((current) => {
      if ((current[buttonId] ?? 'default') === nextState) {
        return current
      }
      return {
        ...current,
        [buttonId]: nextState
      }
    })
  }
  const getIconButtonInteractionHandlers = (buttonId: string, disabled: boolean) => ({
    onMouseEnter: () => {
      if (!disabled) {
        updateIconButtonState(buttonId, 'hover')
      }
      showIconTooltip(buttonId)
    },
    onMouseLeave: (event: React.MouseEvent<HTMLButtonElement>) => {
      updateIconButtonState(buttonId, 'default')
      if (document.activeElement !== event.currentTarget) {
        hideIconTooltip(buttonId)
      }
    },
    onMouseDown: () => {
      if (!disabled) {
        updateIconButtonState(buttonId, 'active')
      }
    },
    onMouseUp: () => {
      if (!disabled) {
        updateIconButtonState(buttonId, 'hover')
      }
    },
    onFocus: () => {
      showIconTooltip(buttonId)
    },
    onBlur: () => {
      updateIconButtonState(buttonId, 'default')
      hideIconTooltip(buttonId)
      clearLongPressTimer()
    },
    onTouchStart: () => {
      clearLongPressTimer()
      longPressTimerRef.current = window.setTimeout(() => {
        showIconTooltip(buttonId)
      }, TOOLTIP_LONG_PRESS_DELAY_MS)
    },
    onTouchEnd: () => {
      clearLongPressTimer()
      hideIconTooltip(buttonId)
    },
    onTouchCancel: () => {
      clearLongPressTimer()
      hideIconTooltip(buttonId)
    }
  })
  const renderIconTooltip = (buttonId: string) => {
    if (visibleTooltipButtonId !== buttonId) {
      return null
    }
    const tooltipText = ICON_BUTTON_TOOLTIPS[buttonId]
    if (!tooltipText) {
      return null
    }
    return (
      <span role="tooltip" className="wysiwyg-find-icon-tooltip">
        {tooltipText}
      </span>
    )
  }

  useEffect(() => {
    return () => {
      clearLongPressTimer()
    }
  }, [])

  const getIconButtonStyle = (buttonId: string, options?: { pressed?: boolean; disabled?: boolean }) => {
    const disabled = options?.disabled ?? false
    const pressed = options?.pressed ?? false
    if (disabled) {
      return undefined
    }

    const state = iconButtonStates[buttonId] ?? 'default'
    if (state === 'active') {
      return {
        backgroundColor: 'rgb(147, 197, 253)',
        borderColor: 'rgb(30, 64, 175)',
        color: 'rgb(30, 58, 138)'
      }
    }
    if (state === 'hover') {
      if (pressed) {
        return {
          backgroundColor: 'rgb(191, 219, 254)',
          borderColor: 'rgb(29, 78, 216)',
          color: 'rgb(30, 64, 175)'
        }
      }
      return {
        backgroundColor: 'rgb(239, 246, 255)',
        borderColor: 'rgb(59, 130, 246)',
        color: 'rgb(30, 64, 175)'
      }
    }
    if (pressed) {
      return {
        backgroundColor: 'rgb(219, 234, 254)',
        borderColor: 'rgb(37, 99, 235)',
        color: 'rgb(30, 58, 138)'
      }
    }
    return undefined
  }

  const toggleCaseSensitiveFind = () => {
    setIsCaseSensitiveFind((current) => !current)
  }

  const toggleWholeWordFind = () => {
    if (isRegexFind) {
      return
    }
    setIsWholeWordFind((current) => !current)
  }

  const toggleRegexFind = () => {
    setIsRegexFind((current) => {
      if (!current) {
        setIsWholeWordFind(false)
      }
      return !current
    })
  }

  const applyInlineShortcut = (tagName: 'strong' | 'em' | 'code'): boolean => {
    if (!editorRef.current) {
      return false
    }

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return false
    }

    const range = selection.getRangeAt(0)
    const commonAncestor = range.commonAncestorContainer
    if (!editorRef.current.contains(commonAncestor)) {
      return false
    }

    const wrapper = document.createElement(tagName)
    const extracted = range.extractContents()
    wrapper.append(extracted)
    range.insertNode(wrapper)
    setCaretAfterNode(wrapper)

    syncMarkdownFromEditor()
    return true
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
      if (nextMarkdown !== markdownRef.current) {
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

    monacoEditorsRef.current.forEach((instance) => {
      instance.dispose()
    })
    monacoEditorsRef.current.clear()
    monacoMountingRef.current.clear()
    dismissMathEditor({ syncMarkdown: false })

    const snapshotMarkdown = direction === 'undo' ? transaction.beforeMarkdown : transaction.afterMarkdown
    const snapshotHtml = direction === 'undo' ? transaction.beforeHtml : transaction.afterHtml
    editorRef.current.innerHTML = snapshotHtml ?? markdownToEditableHtml(snapshotMarkdown)
    void mountMonacoEditors()
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
    const normalizedKey = event.key.toLowerCase()

    if (event.key === 'Escape' && showFindToolbar) {
      event.preventDefault()
      closeFindToolbarAndRestoreEditorFocus()
      return
    }

    if (event.key === 'Tab' && !imeComposingNow) {
      const selection = window.getSelection()
      if (selection && selection.isCollapsed && selection.rangeCount > 0) {
        const block = getClosestBlockElement(selection.anchorNode, editorRef.current)
        if (block && block.tagName === 'LI') {
          event.preventDefault()
          const list = block.parentElement
          if (!list || (list.tagName !== 'UL' && list.tagName !== 'OL')) {
            return
          }
          
          const prevListItem = block.previousElementSibling as HTMLElement | null
          if (!prevListItem || prevListItem.tagName !== 'LI') {
            return
          }
          
          let nestedList = prevListItem.querySelector('ul, ol') as HTMLElement | null
          if (!nestedList) {
            nestedList = document.createElement(list.tagName.toLowerCase())
            prevListItem.append(nestedList)
          }
          
          nestedList.append(block)
          setCaretToStart(block)
          
          const nextMarkdown = htmlToMarkdown(editorRef.current)
          lastSyncedMarkdownRef.current = nextMarkdown
          if (nextMarkdown !== markdownRef.current) {
            setMarkdown(nextMarkdown)
          }
          return
        }
      }
    }

    if (event.key === 'Tab' && event.shiftKey && !imeComposingNow) {
      const selection = window.getSelection()
      if (selection && selection.isCollapsed && selection.rangeCount > 0) {
        const block = getClosestBlockElement(selection.anchorNode, editorRef.current)
        if (block && block.tagName === 'LI') {
          event.preventDefault()
          const list = block.parentElement
          if (!list || (list.tagName !== 'UL' && list.tagName !== 'OL')) {
            return
          }
          
          const parentListItem = list.parentElement as HTMLElement | null
          if (!parentListItem || parentListItem.tagName !== 'LI') {
            return
          }
          
          const grandList = parentListItem.parentElement
          if (!grandList) {
            return
          }
          
          if (list.children.length === 1) {
            list.remove()
          }
          
          grandList.insertBefore(block, parentListItem.nextSibling)
          setCaretToStart(block)
          
          const nextMarkdown = htmlToMarkdown(editorRef.current)
          lastSyncedMarkdownRef.current = nextMarkdown
          if (nextMarkdown !== markdownRef.current) {
            setMarkdown(nextMarkdown)
          }
          return
        }
      }
    }

    if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey) {
      if (normalizedKey === 'f') {
        event.preventDefault()
        setShowFindToolbar(true)
        setFindToolbarMode('find')

        const selectedQuery = getNormalizedSelectionInEditor(editorRef.current)
        if (!selectedQuery) {
          return
        }

        setFindQuery(selectedQuery)
        const matches = getFindMatches(editorRef.current, selectedQuery)
        setFindResultCount(matches.length)

        if (matches.length === 0) {
          setActiveFindIndex(-1)
          return
        }

        setActiveFindIndex(0)
        return
      }
      if (normalizedKey === 'b' && applyInlineShortcut('strong')) {
        event.preventDefault()
        return
      }

      if (normalizedKey === 'i' && applyInlineShortcut('em')) {
        event.preventDefault()
        return
      }

      if (normalizedKey === 'e' && applyInlineShortcut('code')) {
        event.preventDefault()
        return
      }
    }

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
            if (nextMarkdown !== markdownRef.current) {
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
              if (nextMarkdown !== markdownRef.current) {
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
              if (nextMarkdown !== markdownRef.current) {
                setMarkdown(nextMarkdown)
              }
              return
            }
          }
        }
      }
    }

    if (!imeComposingNow && ['*', '`', ')', '$'].includes(event.key)) {
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
            if (nextMarkdown !== markdownRef.current) {
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
    if (match.rule !== 'code-block') {
      setCaretToStart(transformedEditableTarget)
    }
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

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    if (!editorRef.current || !event.clipboardData) {
      return
    }
    const text = event.clipboardData.getData('text/plain') ?? ''
    if (!text || !looksLikeMarkdown(text)) {
      return
    }
    event.preventDefault()
    try {
      const html = markdownToEditableHtml(text)
      const template = document.createElement('template')
      template.innerHTML = html
      const nodes = Array.from(template.content.childNodes)
      const selection = window.getSelection()
      const block =
        selection && selection.isCollapsed && selection.rangeCount > 0
          ? getClosestBlockElement(selection.anchorNode, editorRef.current)
          : null
      insertNodesAfterBlockOrAppend(editorRef.current, block, nodes)
      const nextMarkdown = htmlToMarkdown(editorRef.current)
      editorRef.current.innerHTML = markdownToEditableHtml(nextMarkdown)
      lastSyncedMarkdownRef.current = nextMarkdown
      if (nextMarkdown !== markdownRef.current) {
        setMarkdown(nextMarkdown)
      }
    } catch (error) {
      console.warn('Markdown 粘贴解析失败，降级为纯文本插入', error)
      const fallback = document.createTextNode(text)
      insertNodesAfterBlockOrAppend(editorRef.current, null, [fallback])
      const nextMarkdown = htmlToMarkdown(editorRef.current)
      editorRef.current.innerHTML = markdownToEditableHtml(nextMarkdown)
      lastSyncedMarkdownRef.current = nextMarkdown
      if (nextMarkdown !== markdownRef.current) {
        setMarkdown(nextMarkdown)
      }
    }
  }
  const openDiagramEditorInline = async (target: HTMLElement, lang: 'mermaid' | 'plantuml', code: string) => {
    if (!editorRef.current) return
    const host = editorRef.current
    const existing = host.querySelector('[data-diagram-editor="true"]') as HTMLElement | null
    if (existing) {
      existing.remove()
    }
    
    const monaco = await loadMonaco()
    ensureMonacoTheme(monaco)
    
    const container = document.createElement('div')
    container.setAttribute('data-diagram-editor', 'true')
    container.setAttribute('contenteditable', 'false')
    container.className = 'wysiwyg-code-block wysiwyg-code-block-mounted mb-2'
    
    const header = document.createElement('div')
    header.className = 'wysiwyg-code-header'
    const languageLabel = document.createElement('span')
    languageLabel.className = 'wysiwyg-code-language-select'
    languageLabel.textContent = lang === 'mermaid' ? 'Mermaid' : 'PlantUML'
    languageLabel.style.cursor = 'default'
    const status = document.createElement('span')
    status.className = 'text-xs text-gray-500 ml-auto'
    status.setAttribute('data-status', 'idle')
    header.append(languageLabel, status)
    
    const editorHost = document.createElement('div')
    editorHost.className = 'wysiwyg-monaco-host'
    
    container.append(header, editorHost)
    target.parentElement?.insertBefore(container, target)
    
    const editor = monaco.editor.create(editorHost, {
      value: code,
      language: lang === 'mermaid' ? 'markdown' : 'markdown',
      theme: 'wysiwyg-light',
      lineNumbers: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      fontSize: 13,
      padding: { top: 12, bottom: 12 },
      tabSize: 2,
      automaticLayout: true
    })
    
    const resizeObserver = new ResizeObserver(() => {
      editor.layout()
    })
    resizeObserver.observe(editorHost)
    
    const updateHeight = () => {
      const contentHeight = editor.getContentHeight()
      editorHost.style.height = `${contentHeight}px`
      editor.layout()
    }
    updateHeight()
    const sizeListener = editor.onDidContentSizeChange(updateHeight)
    
    let applyTimer: number | null = null
    
    const validate = async (raw: string) => {
      let ok = false
      if (lang === 'mermaid') {
        try {
          await (mermaid as any).parse(raw)
          ok = true
        } catch {
          ok = false
        }
      } else {
        ok = /@startuml/.test(raw) && /@enduml/.test(raw)
      }
      status.textContent = ok ? '语法校验通过' : '语法错误'
      status.className = ok ? 'text-xs text-emerald-600 ml-auto' : 'text-xs text-red-600 ml-auto'
      return ok
    }
    
    const applyPlantUmlPreview = (raw: string) => {
      const img = target.querySelector('img')
      if (!img) {
        return
      }
      img.setAttribute('data-plantuml-code', raw)
      const encoded = encodePlantUml(raw.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n+/g, '\n'))
      img.setAttribute('src', `https://www.plantuml.com/plantuml/svg/${encoded}`)
    }
    
    const applyChanges = (raw: string) => {
      if (lang === 'plantuml') {
        applyPlantUmlPreview(raw)
      } else {
        applyDiagramCode(target, lang, raw)
      }
    }
    
    const closeEditor = () => {
      const raw = editor.getValue()
      applyChanges(raw)
      resizeObserver.disconnect()
      sizeListener.dispose()
      changeListener.dispose()
      editor.dispose()
      container.remove()
      syncMarkdownFromEditor()
    }
    
    const changeListener = editor.onDidChangeModelContent(() => {
      const raw = editor.getValue()
      void validate(raw).then((ok) => {
        if (!ok) {
          return
        }
        if (applyTimer !== null) {
          window.clearTimeout(applyTimer)
        }
        applyTimer = window.setTimeout(() => {
          applyChanges(raw)
        }, 150)
      })
    })
    
    editor.onDidBlurEditorWidget(() => {
      closeEditor()
    })
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        closeEditor()
      }
    }
    editorHost.addEventListener('keydown', handleKeyDown)
    
    editor.focus()
  }
  const applyDiagramCode = (target: HTMLElement, lang: 'mermaid' | 'plantuml', code: string) => {
    if (lang === 'mermaid') {
      target.setAttribute('data-raw', code)
      target.removeAttribute('data-processed')
      target.textContent = code
      try {
        mermaid.run({
          nodes: [target] as unknown as NodeListOf<Element>
        } as any)
      } catch {}
      return
    }
    const img = target.querySelector('img')
    if (img) {
      img.setAttribute('data-plantuml-code', code)
      const encoded = encodePlantUml(code.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n+/g, '\n'))
      img.setAttribute('src', `https://www.plantuml.com/plantuml/svg/${encoded}`)
    }
  }


  const handleEditorClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!editorRef.current) return
    const targetElement = event.target as HTMLElement
    const activeMathEditor = activeMathEditorRef.current
    if (activeMathEditor && activeMathEditor.container.contains(targetElement)) {
      return
    }

    const mathBlock = targetElement.closest('.math-block') as HTMLElement | null
    if (mathBlock) {
      event.stopPropagation()
      void openMathEditorInline(mathBlock)
      return
    }

    const inlineEditor = editorRef.current.querySelector('[data-diagram-editor="true"]') as HTMLElement | null
    if (inlineEditor && inlineEditor.contains(targetElement)) {
      return
    }
    const diagram = targetElement.closest('.mermaid, .plantuml-container') as HTMLElement | null
    if (diagram) {
      dismissMathEditor({ syncMarkdown: true })
      event.stopPropagation()
      const isMermaid = diagram.classList.contains('mermaid')
      if (isMermaid) {
        const raw = diagram.getAttribute('data-raw') ?? diagram.textContent ?? ''
        openDiagramEditorInline(diagram, 'mermaid', raw)
        return
      }
      const img = diagram.querySelector('img')
      const code = img?.getAttribute('data-plantuml-code') ?? ''
      openDiagramEditorInline(diagram, 'plantuml', code)
      return
    }
    if (inlineEditor) {
      const textarea = inlineEditor.querySelector('textarea') as HTMLTextAreaElement | null
      if (textarea) {
        const lang = /```plantuml/.test(textarea.value) ? 'plantuml' : 'mermaid'
        const raw = textarea.value.replace(/```[a-zA-Z]*\s*\n?/g, '').replace(/```\s*$/g, '').trim()
        let target = inlineEditor.nextElementSibling as HTMLElement | null
        while (
          target &&
          !(
            (target as HTMLElement).classList.contains('mermaid') ||
            (target as HTMLElement).classList.contains('plantuml-container')
          )
        ) {
          target = target.nextElementSibling as HTMLElement | null
        }
        if (target && (target.classList.contains('mermaid') || target.classList.contains('plantuml-container'))) {
          applyDiagramCode(target, lang as 'mermaid' | 'plantuml', raw)
        }
      }
      inlineEditor.remove()
      syncMarkdownFromEditor()
    }
    if (activeMathEditorRef.current) {
      dismissMathEditor({ syncMarkdown: true })
    }
  }

  return (
    <div className="relative bg-white rounded-lg shadow-md p-4">
        <div
          aria-label="查找替换工具栏"
          aria-hidden={!showFindToolbar}
          className={`wysiwyg-find-toolbar pointer-events-auto z-20 mb-3 w-full rounded border border-gray-200 bg-white p-3 shadow-lg ${
            showFindToolbar ? 'sticky top-4' : 'hidden'
          }`}
        >
        <div className="flex items-start gap-3">
          <div className="flex-1 flex flex-col gap-2 sm:flex-row">
            <input
              ref={findInputRef}
              type="text"
              value={findQuery}
              onKeyDown={handleFindInputKeyDown}
              onChange={(event) => {
                setFindQuery(event.target.value)
              }}
              className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
              placeholder="查找文本"
              aria-label="查找文本"
            />
            {isReplaceMode ? (
              <input
                type="text"
                value={replaceQuery}
                onKeyDown={handleReplaceInputKeyDown}
                onChange={(event) => {
                  setReplaceQuery(event.target.value)
                }}
                className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                placeholder="替换为"
                aria-label="替换文本"
              />
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded border border-gray-200 bg-gray-50 p-1">
              <button
                type="button"
                onClick={() => {
                  setFindToolbarMode('find')
                }}
                aria-label="切换到查找模式"
                aria-pressed={!isReplaceMode}
                className={`rounded px-2 py-1 text-sm transition-colors ${
                  !isReplaceMode
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                查找
              </button>
              <button
                type="button"
                onClick={() => {
                  setFindToolbarMode('replace')
                }}
                aria-label="切换到替换模式"
                aria-pressed={isReplaceMode}
                className={`rounded px-2 py-1 text-sm transition-colors ${
                  isReplaceMode
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                替换
              </button>
            </div>
            <span className="wysiwyg-find-icon-btn-wrap">
              <button
                type="button"
                onClick={closeFindToolbarAndRestoreEditorFocus}
                {...getIconButtonInteractionHandlers('close', false)}
                aria-label="关闭查找替换工具栏"
                className={iconButtonBaseClass}
                style={getIconButtonStyle('close')}
              >
                <img src={closeSearchIcon} alt="" aria-hidden="true" className="h-4 w-4" />
              </button>
              {renderIconTooltip('close')}
            </span>
          </div>
        </div>
        <div className="wysiwyg-find-toolbar mt-2 flex flex-wrap items-center gap-2">
          <span className="wysiwyg-find-icon-btn-wrap">
            <button
              type="button"
              onClick={toggleCaseSensitiveFind}
              {...getIconButtonInteractionHandlers('case-sensitive', false)}
              aria-label="区分大小写"
              aria-pressed={isCaseSensitiveFind}
              className={`${iconButtonBaseClass} ${
                isCaseSensitiveFind
                  ? 'wysiwyg-find-icon-btn-pressed'
                  : ''
              }`}
              style={getIconButtonStyle('case-sensitive', { pressed: isCaseSensitiveFind })}
            >
              <img src={caseSensitiveIcon} alt="" aria-hidden="true" className="h-4 w-4" />
            </button>
            {renderIconTooltip('case-sensitive')}
          </span>
          <span className="wysiwyg-find-icon-btn-wrap">
            <button
              type="button"
              onClick={toggleWholeWordFind}
              {...getIconButtonInteractionHandlers('whole-word', isRegexFind)}
              aria-label="查找整个单词"
              aria-pressed={isWholeWordFind}
              disabled={isRegexFind}
              className={`${iconButtonBaseClass} ${
                isWholeWordFind
                  ? 'wysiwyg-find-icon-btn-pressed'
                  : ''
              }`}
              style={getIconButtonStyle('whole-word', { pressed: isWholeWordFind, disabled: isRegexFind })}
            >
              <img src={wholeWordIcon} alt="" aria-hidden="true" className="h-4 w-4" />
            </button>
            {renderIconTooltip('whole-word')}
          </span>
          <span className="wysiwyg-find-icon-btn-wrap">
            <button
              type="button"
              onClick={toggleRegexFind}
              {...getIconButtonInteractionHandlers('regex-mode', false)}
              aria-label="正则模式"
              aria-pressed={isRegexFind}
              className={`${iconButtonBaseClass} ${
                isRegexFind
                  ? 'wysiwyg-find-icon-btn-pressed'
                  : ''
              }`}
              style={getIconButtonStyle('regex-mode', { pressed: isRegexFind })}
            >
              <img src={regexModeIcon} alt="" aria-hidden="true" className="h-4 w-4" />
            </button>
            {renderIconTooltip('regex-mode')}
          </span>
          <span className="wysiwyg-find-icon-btn-wrap">
            <button
              type="button"
              onClick={handleFindPrevious}
              {...getIconButtonInteractionHandlers('find-previous', disableFindActions)}
              aria-label="查找上一个"
              disabled={disableFindActions}
              className={iconButtonBaseClass}
              style={getIconButtonStyle('find-previous', { disabled: disableFindActions })}
            >
              <img src={findPreviousIcon} alt="" aria-hidden="true" className="h-4 w-4" />
            </button>
            {renderIconTooltip('find-previous')}
          </span>
          <span className="wysiwyg-find-icon-btn-wrap">
            <button
              type="button"
              onClick={handleFindNext}
              {...getIconButtonInteractionHandlers('find-next', disableFindActions)}
              aria-label="查找下一个"
              disabled={disableFindActions}
              className={iconButtonBaseClass}
              style={getIconButtonStyle('find-next', { disabled: disableFindActions })}
            >
              <img src={findNextIcon} alt="" aria-hidden="true" className="h-4 w-4" />
            </button>
            {renderIconTooltip('find-next')}
          </span>
          {isReplaceMode ? (
            <>
              <span className="wysiwyg-find-icon-btn-wrap">
                <button
                  type="button"
                  onClick={handleReplaceCurrent}
                  {...getIconButtonInteractionHandlers('replace-current', disableFindActions)}
                  aria-label="替换当前"
                  disabled={disableFindActions}
                  className={iconButtonBaseClass}
                  style={getIconButtonStyle('replace-current', { disabled: disableFindActions })}
                >
                  <img src={replaceCurrentIcon} alt="" aria-hidden="true" className="h-4 w-4" />
                </button>
                {renderIconTooltip('replace-current')}
              </span>
              <span className="wysiwyg-find-icon-btn-wrap">
                <button
                  type="button"
                  onClick={handleReplaceAll}
                  {...getIconButtonInteractionHandlers('replace-all', disableFindActions)}
                  aria-label="替换全部"
                  disabled={disableFindActions}
                  className={iconButtonBaseClass}
                  style={getIconButtonStyle('replace-all', { disabled: disableFindActions })}
                >
                  <img src={replaceAllIcon} alt="" aria-hidden="true" className="h-4 w-4" />
                </button>
                {renderIconTooltip('replace-all')}
              </span>
            </>
          ) : null}
          {findRegexError ? (
            <span className="text-xs text-red-600" aria-label="查找错误提示">
              {findRegexError}
            </span>
          ) : null}
          <span className="text-xs text-gray-600" aria-label="查找结果计数">
            匹配：
            {findResultCount === 0 ? '0/N' : `${activeFindIndex + 1}/${findResultCount}`}
          </span>
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onClick={handleEditorClick}
        onPaste={handlePaste}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onCompositionStart={() => {
          isImeComposingRef.current = true
        }}
        onCompositionEnd={() => {
          isImeComposingRef.current = false
        }}
        className="markdown-preview min-h-[300px] rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="WYSIWYG 编辑区"
        role="textbox"
      />
    </div>
  )
}

export default WysiwygEditor
