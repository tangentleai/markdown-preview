export type InlineNode =
  | { type: 'text'; value: string }
  | { type: 'code'; value: string }
  | { type: 'strong'; children: InlineNode[] }
  | { type: 'em'; children: InlineNode[] }
  | { type: 'link'; href: string; children: InlineNode[] }
  | { type: 'image'; alt: string; src: string }

export type BlockNode =
  | { type: 'paragraph'; children: InlineNode[] }
  | { type: 'heading'; level: number; children: InlineNode[] }
  | { type: 'list'; ordered: boolean; items: InlineNode[][] }
  | { type: 'quote'; blocks: BlockNode[] }
  | { type: 'codeBlock'; language: string; code: string }
  | { type: 'table'; header: InlineNode[][]; rows: InlineNode[][][] }

export interface DocumentModel {
  blocks: BlockNode[]
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

const parseInline = (value: string): InlineNode[] => {
  const nodes: InlineNode[] = []
  const pattern = /(!\[[^\]]*\]\([^\)]+\)|\[[^\]]+\]\([^\)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g
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

  return cells.every((cell) => /^:?-{3,}:?$/.test(cell))
}

const splitTableRow = (line: string): string[] =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())

const isFencedCodeStart = (line: string): boolean => /^```/.test(line.trim())

const isHeading = (line: string): boolean => /^(#{1,6})\s+/.test(line.trim())

const isQuote = (line: string): boolean => /^>\s?/.test(line.trim())

const isList = (line: string): boolean => /^([-*+])\s+/.test(line.trim()) || /^\d+\.\s+/.test(line.trim())

const parseMarkdownLines = (lines: string[]): BlockNode[] => {
  const blocks: BlockNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed) {
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

      blocks.push({ type: 'table', header, rows })
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
    case 'list': {
      const items = node.items.map((item) => `<li>${item.map(inlineNodeToHtml).join('')}</li>`).join('')
      return node.ordered ? `<ol>${items}</ol>` : `<ul>${items}</ul>`
    }
    case 'quote':
      return `<blockquote>${node.blocks.map(blockNodeToHtml).join('')}</blockquote>`
    case 'codeBlock':
      return `<pre><code>${escapeHtml(node.code)}</code></pre>`
    case 'table': {
      const headerRow = `<tr>${node.header.map((cell) => `<th>${cell.map(inlineNodeToHtml).join('')}</th>`).join('')}</tr>`
      const bodyRows = node.rows
        .map((row) => `<tr>${row.map((cell) => `<td>${cell.map(inlineNodeToHtml).join('')}</td>`).join('')}</tr>`)
        .join('')
      return `<table><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`
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
