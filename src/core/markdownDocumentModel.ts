import katex from 'katex'
import { encode as encodePlantUml } from 'plantuml-encoder'

export type InlineNode =
  | { type: 'text'; value: string }
  | { type: 'code'; value: string }
  | { type: 'strong'; children: InlineNode[] }
  | { type: 'em'; children: InlineNode[] }
  | { type: 'link'; href: string; children: InlineNode[] }
  | { type: 'image'; alt: string; src: string }
  | { type: 'mathInline'; tex: string }

export type BlockNode =
  | { type: 'paragraph'; children: InlineNode[] }
  | { type: 'heading'; level: number; children: InlineNode[] }
  | { type: 'horizontalRule' }
  | { type: 'list'; ordered: boolean; items: InlineNode[][] }
  | { type: 'quote'; blocks: BlockNode[] }
  | { type: 'codeBlock'; language: string; code: string }
  | { type: 'mathBlock'; tex: string }
  | {
      type: 'table'
      header: InlineNode[][]
      rows: InlineNode[][][]
      align?: 'left' | 'center' | 'right'
      alignExplicit?: boolean
    }

export interface DocumentModel {
  blocks: BlockNode[]
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

const renderMathWithFallback = (tex: string, displayMode = false): string => {
  try {
    return katex.renderToString(tex, { throwOnError: true, displayMode })
  } catch {
    return escapeHtml(tex)
  }
}

const parseInline = (value: string): InlineNode[] => {
  const nodes: InlineNode[] = []
  const pattern = /(!\[[^\]]*\]\([^\)]+\)|\[[^\]]+\]\([^\)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|(?<!\$)\$[^$\n]+\$(?!\$)|\\\((?:\\.|[^\\\n])+\\\))/g
  let lastIndex = 0

  for (const match of value.matchAll(pattern)) {
    const token = match[0]
    const index = match.index ?? 0

    if (index > lastIndex) {
      nodes.push({ type: 'text', value: value.slice(lastIndex, index) })
    }

    if (token.startsWith('![')) {
      const imageMatch = token.match(/^!\[([^\]]*)\]\(([^\)]+)\)$/)
      if (imageMatch) {
        nodes.push({ type: 'image', alt: imageMatch[1], src: imageMatch[2] })
      }
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^\)]+)\)$/)
      if (linkMatch) {
        nodes.push({ type: 'link', href: linkMatch[2], children: [{ type: 'text', value: linkMatch[1] }] })
      }
    } else if (token.startsWith('`')) {
      nodes.push({ type: 'code', value: token.slice(1, -1) })
    } else if (token.startsWith('**')) {
      nodes.push({ type: 'strong', children: parseInline(token.slice(2, -2)) })
    } else if (token.startsWith('*')) {
      nodes.push({ type: 'em', children: parseInline(token.slice(1, -1)) })
    } else if (token.startsWith('$') && token.endsWith('$')) {
      nodes.push({ type: 'mathInline', tex: token.slice(1, -1) })
    } else if (token.startsWith('\\(') && token.endsWith('\\)')) {
      nodes.push({ type: 'mathInline', tex: token.slice(2, -2) })
    }

    lastIndex = index + token.length
  }

  if (lastIndex < value.length) {
    nodes.push({ type: 'text', value: value.slice(lastIndex) })
  }

  if (nodes.length === 0) {
    return [{ type: 'text', value }]
  }

  return nodes
}

const isTableDelimiter = (line: string): boolean => {
  const cells = line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())

  if (cells.length === 0) {
    return false
  }

  return cells.every((cell) => /^:?-{1,}:?$/.test(cell))
}

const splitTableRow = (line: string): string[] =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())

const isFencedCodeStart = (line: string): boolean => /^```/.test(line.trim())
const isBlockMathDelimiter = (line: string): boolean => /^\$\$\s*$/.test(line.trim())
const isBracketBlockMathStart = (line: string): boolean => /^\\\[\s*$/.test(line.trim())
const isBracketBlockMathEnd = (line: string): boolean => /^\\\]\s*$/.test(line.trim())

const isHeading = (line: string): boolean => /^(#{1,6})\s+/.test(line.trim())
const isHorizontalRule = (line: string): boolean => /^(?:-{3,}|(?:-\s+){2,}-)\s*$/.test(line.trim())
const TABLE_ALIGN_MARKER_RE = /^<!--\s*table:align=(left|center|right)\s*-->$/

const isQuote = (line: string): boolean => /^>\s?/.test(line.trim())

const isList = (line: string): boolean => /^([-*+])\s+/.test(line.trim()) || /^\d+\.\s+/.test(line.trim())

const parseTableAlignMarker = (line: string): 'left' | 'center' | 'right' | null => {
  const match = line.trim().match(TABLE_ALIGN_MARKER_RE)
  return (match?.[1] as 'left' | 'center' | 'right' | undefined) ?? null
}

const parseMarkdownLines = (lines: string[]): BlockNode[] => {
  const blocks: BlockNode[] = []
  let index = 0
  let pendingTableAlign: 'left' | 'center' | 'right' | null = null

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    const tableAlignMarker = parseTableAlignMarker(trimmed)
    if (tableAlignMarker) {
      pendingTableAlign = tableAlignMarker
      index += 1
      continue
    }

    if (isFencedCodeStart(trimmed)) {
      const start = trimmed
      const language = start.replace(/^```/, '').trim()
      const codeLines: string[] = []
      index += 1

      while (index < lines.length && !/^```/.test(lines[index].trim())) {
        codeLines.push(lines[index])
        index += 1
      }

      if (index < lines.length) {
        index += 1
      }

      blocks.push({
        type: 'codeBlock',
        language,
        code: codeLines.join('\n').replace(/\n+$/, '')
      })
      continue
    }

    if (isBlockMathDelimiter(trimmed)) {
      const mathLines: string[] = []
      index += 1
      while (index < lines.length && !isBlockMathDelimiter(lines[index].trim())) {
        mathLines.push(lines[index])
        index += 1
      }
      if (index < lines.length) {
        index += 1
      }
      blocks.push({
        type: 'mathBlock',
        tex: mathLines.join('\n').replace(/\n+$/, '')
      })
      continue
    }

    if (isBracketBlockMathStart(trimmed)) {
      const mathLines: string[] = []
      index += 1
      while (index < lines.length && !isBracketBlockMathEnd(lines[index].trim())) {
        mathLines.push(lines[index])
        index += 1
      }
      if (index < lines.length) {
        index += 1
      }
      blocks.push({
        type: 'mathBlock',
        tex: mathLines.join('\n').replace(/\n+$/, '')
      })
      continue
    }

    const inlineBracketMathMatch = trimmed.match(/^\\\[(.*)\\\]$/)
    if (inlineBracketMathMatch) {
      blocks.push({
        type: 'mathBlock',
        tex: inlineBracketMathMatch[1].trim()
      })
      index += 1
      continue
    }

    if (isHeading(trimmed)) {
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
      if (headingMatch) {
        blocks.push({
          type: 'heading',
          level: headingMatch[1].length,
          children: parseInline(headingMatch[2])
        })
      }
      index += 1
      continue
    }

    if (isHorizontalRule(trimmed)) {
      blocks.push({ type: 'horizontalRule' })
      index += 1
      continue
    }

    const hasTable =
      index + 1 < lines.length &&
      trimmed.includes('|') &&
      lines[index + 1].trim().includes('|') &&
      isTableDelimiter(lines[index + 1])

    if (hasTable) {
      const header = splitTableRow(lines[index]).map(parseInline)
      index += 2
      const rows: InlineNode[][][] = []

      while (index < lines.length && lines[index].trim().includes('|') && lines[index].trim() !== '') {
        rows.push(splitTableRow(lines[index]).map(parseInline))
        index += 1
      }

      blocks.push({
        type: 'table',
        header,
        rows,
        ...(pendingTableAlign
          ? {
              align: pendingTableAlign,
              alignExplicit: true
            }
          : {})
      })
      pendingTableAlign = null
      continue
    }

    if (isQuote(trimmed)) {
      const quoteLines: string[] = []

      while (index < lines.length && isQuote(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''))
        index += 1
      }

      blocks.push({ type: 'quote', blocks: parseMarkdownLines(quoteLines) })
      continue
    }

    if (isList(trimmed)) {
      const ordered = /^\d+\.\s+/.test(trimmed)
      const items: InlineNode[][] = []

      while (index < lines.length) {
        const current = lines[index].trim()
        const unorderedMatch = current.match(/^[-*+]\s+(.+)$/)
        const orderedMatch = current.match(/^\d+\.\s+(.+)$/)

        if (!current || (ordered && !orderedMatch) || (!ordered && !unorderedMatch)) {
          break
        }

        items.push(parseInline((orderedMatch?.[1] ?? unorderedMatch?.[1] ?? '').trim()))
        index += 1
      }

      blocks.push({ type: 'list', ordered, items })
      continue
    }

    const paragraphLines: string[] = []

    while (index < lines.length) {
      const current = lines[index]
      const currentTrimmed = current.trim()

      if (!currentTrimmed) {
        break
      }

      if (isHeading(currentTrimmed) || isFencedCodeStart(currentTrimmed) || isQuote(currentTrimmed) || isList(currentTrimmed)) {
        break
      }

      const isTableStart =
        index + 1 < lines.length &&
        currentTrimmed.includes('|') &&
        lines[index + 1].trim().includes('|') &&
        isTableDelimiter(lines[index + 1])
      if (isTableStart) {
        break
      }

      paragraphLines.push(currentTrimmed)
      index += 1
    }

    blocks.push({ type: 'paragraph', children: parseInline(paragraphLines.join('\n')) })
  }

  return blocks
}

export const parseMarkdownToDocumentModel = (markdown: string): DocumentModel => ({
  blocks: parseMarkdownLines(markdown.split('\n'))
})

const escapeMarkdownText = (value: string): string =>
  value
    .replaceAll('\\', '\\\\')
    .replaceAll('*', '\\*')
    .replaceAll('`', '\\`')
    .replaceAll('[', '\\[')
    .replaceAll(']', '\\]')

const inlineNodeToMarkdown = (node: InlineNode): string => {
  switch (node.type) {
    case 'text':
      return escapeMarkdownText(node.value)
    case 'code':
      return `\`${node.value.replaceAll('`', '\\`')}\``
    case 'strong':
      return `**${node.children.map(inlineNodeToMarkdown).join('')}**`
    case 'em':
      return `*${node.children.map(inlineNodeToMarkdown).join('')}*`
    case 'link':
      return `[${node.children.map(inlineNodeToMarkdown).join('')}](${node.href})`
    case 'image':
      return `![${escapeMarkdownText(node.alt)}](${node.src})`
    case 'mathInline':
      return `\\(${node.tex}\\)`
    default:
      return ''
  }
}

const blockNodeToMarkdown = (node: BlockNode): string => {
  switch (node.type) {
    case 'paragraph':
      return node.children.map(inlineNodeToMarkdown).join('')
    case 'heading':
      return `${'#'.repeat(node.level)} ${node.children.map(inlineNodeToMarkdown).join('')}`
    case 'horizontalRule':
      return '---'
    case 'list': {
      const marker = node.ordered ? (index: number) => `${index + 1}. ` : () => '- '
      return node.items
        .map((item, index) => `${marker(index)}${item.map(inlineNodeToMarkdown).join('')}`)
        .join('\n')
    }
    case 'quote': {
      const content = node.blocks.map(blockNodeToMarkdown).join('\n\n')
      return content
        .split('\n')
        .map((line) => (line ? `> ${line}` : '>'))
        .join('\n')
    }
    case 'codeBlock': {
      const language = node.language.trim()
      const header = language ? `\`\`\`${language}` : '```'
      return `${header}\n${node.code}\n\`\`\``
    }
    case 'mathBlock':
      return `\\[\n${node.tex}\n\\]`
    case 'table': {
      const toRow = (row: InlineNode[][]): string => `| ${row.map((cell) => cell.map(inlineNodeToMarkdown).join('')).join(' | ')} |`
      const delimiter = `| ${node.header.map(() => '---').join(' | ')} |`
      const rows = node.rows.map(toRow)
      const tableMarkdown = [toRow(node.header), delimiter, ...rows].join('\n')
      if (node.alignExplicit && node.align) {
        return `<!-- table:align=${node.align} -->\n${tableMarkdown}`
      }
      return tableMarkdown
    }
    default:
      return ''
  }
}

export const serializeDocumentModelToMarkdown = (model: DocumentModel): string => {
  const blocks = model.blocks.map(blockNodeToMarkdown).filter((block) => block.trim().length > 0)

  if (blocks.length === 0) {
    return ''
  }

  return `${blocks.join('\n\n')}\n`
}

const inlineNodeToHtml = (node: InlineNode): string => {
  switch (node.type) {
    case 'text':
      return escapeHtml(node.value)
    case 'code':
      return `<code>${escapeHtml(node.value)}</code>`
    case 'strong':
      return `<strong>${node.children.map(inlineNodeToHtml).join('')}</strong>`
    case 'em':
      return `<em>${node.children.map(inlineNodeToHtml).join('')}</em>`
    case 'link':
      return `<a href="${escapeHtml(node.href)}">${node.children.map(inlineNodeToHtml).join('')}</a>`
    case 'image':
      return `<img src="${escapeHtml(node.src)}" alt="${escapeHtml(node.alt)}" />`
    case 'mathInline': {
      const tex = node.tex
      const rendered = renderMathWithFallback(tex)
      return `<span class="math-inline" data-tex="${escapeHtml(tex)}">${rendered}</span>`
    }
    default:
      return ''
  }
}

const blockNodeToHtml = (node: BlockNode): string => {
  switch (node.type) {
    case 'paragraph':
      return `<p>${node.children.map(inlineNodeToHtml).join('').replaceAll('\n', '<br />')}</p>`
    case 'heading':
      return `<h${node.level}>${node.children.map(inlineNodeToHtml).join('')}</h${node.level}>`
    case 'horizontalRule':
      return '<hr />'
    case 'list': {
      const items = node.items.map((item) => `<li>${item.map(inlineNodeToHtml).join('')}</li>`).join('')
      return node.ordered ? `<ol>${items}</ol>` : `<ul>${items}</ul>`
    }
    case 'quote':
      return `<blockquote>${node.blocks.map(blockNodeToHtml).join('')}</blockquote>`
    case 'codeBlock': {
      const lang = node.language?.toLowerCase() ?? ''
      if (lang === 'mermaid') {
        const raw = node.code.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
        return `<div class="mermaid" data-raw="${escapeHtml(raw)}">${escapeHtml(raw)}</div>`
      }
      if (lang === 'plantuml') {
        const plantUmlCode = node.code.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n+/g, '\n')
        const encoded = encodePlantUml(plantUmlCode)
        const url = `https://www.plantuml.com/plantuml/svg/${encoded}`
        return `<div class="plantuml-container"><img src="${url}" alt="PlantUML Diagram" data-plantuml-code="${escapeHtml(
          plantUmlCode
        )}" class="max-w-full h-auto" /></div>`
      }
      return `<div class="wysiwyg-code-block" data-code-block="true" data-language="${escapeHtml(
        lang
      )}" contenteditable="false"><pre class="wysiwyg-code-fallback"><code>${escapeHtml(node.code)}</code></pre></div>`
    }
    case 'mathBlock': {
      const rendered = renderMathWithFallback(node.tex, true)
      return `<div class="math-block" data-tex="${escapeHtml(node.tex)}">${rendered}</div>`
    }
    case 'table': {
      const headerRow = `<tr>${node.header.map((cell) => `<th>${cell.map(inlineNodeToHtml).join('')}</th>`).join('')}</tr>`
      const bodyRows = node.rows
        .map((row) => `<tr>${row.map((cell) => `<td>${cell.map(inlineNodeToHtml).join('')}</td>`).join('')}</tr>`)
        .join('')
      const alignAttr = node.alignExplicit && node.align ? ` data-table-align="${node.align}" data-table-align-explicit="true"` : ''
      const alignClass = node.alignExplicit && node.align ? ` class="wysiwyg-table-align-${node.align}"` : ''
      return `<table${alignAttr}${alignClass}><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`
    }
    default:
      return ''
  }
}

export const markdownDocumentModelToEditableHtml = (model: DocumentModel): string => {
  if (model.blocks.length === 0) {
    return '<p><br /></p>'
  }

  return model.blocks.map(blockNodeToHtml).join('')
}

export const markdownToEditableHtml = (markdown: string): string =>
  markdownDocumentModelToEditableHtml(parseMarkdownToDocumentModel(markdown))
