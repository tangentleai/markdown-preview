export type InlineStyleRuleName = 'strong' | 'em' | 'code' | 'link'

export interface InlineStyleRuleMatch {
  rule: InlineStyleRuleName
  start: number
  end: number
  content: string
  href?: string
}

const matchLinkRule = (text: string): InlineStyleRuleMatch | null => {
  const match = text.match(/\[([^\]\n]+)\]\(([^\s()]+)\)$/)
  if (!match || match.index === undefined) {
    return null
  }

  return {
    rule: 'link',
    start: match.index,
    end: match.index + match[0].length,
    content: match[1],
    href: match[2]
  }
}

const matchStrongRule = (text: string): InlineStyleRuleMatch | null => {
  const match = text.match(/\*\*([^*\n]+)\*\*$/)
  if (!match || match.index === undefined) {
    return null
  }

  return {
    rule: 'strong',
    start: match.index,
    end: match.index + match[0].length,
    content: match[1]
  }
}

const matchCodeRule = (text: string): InlineStyleRuleMatch | null => {
  const match = text.match(/`([^`\n]+)`$/)
  if (!match || match.index === undefined) {
    return null
  }

  return {
    rule: 'code',
    start: match.index,
    end: match.index + match[0].length,
    content: match[1]
  }
}

const matchEmRule = (text: string): InlineStyleRuleMatch | null => {
  const match = text.match(/\*([^*\n]+)\*$/)
  if (!match || match.index === undefined) {
    return null
  }

  const start = match.index
  const beforeMarker = start > 0 ? text[start - 1] : ''
  if (beforeMarker === '*') {
    return null
  }

  return {
    rule: 'em',
    start,
    end: start + match[0].length,
    content: match[1]
  }
}

export const matchInlineStyleRule = (textBeforeCaret: string): InlineStyleRuleMatch | null => {
  if (!textBeforeCaret) {
    return null
  }

  return (
    matchLinkRule(textBeforeCaret) ??
    matchStrongRule(textBeforeCaret) ??
    matchCodeRule(textBeforeCaret) ??
    matchEmRule(textBeforeCaret)
  )
}
