export type BlockInputRuleName =
  | 'heading-1'
  | 'unordered-list'
  | 'ordered-list'
  | 'blockquote'
  | 'code-block'

export interface BlockInputRuleMatch {
  rule: BlockInputRuleName
  triggerText: '#' | '-' | '1.' | '>' | '```'
  triggerKey: ' ' | 'Enter'
  targetTag: 'H1' | 'UL' | 'OL' | 'BLOCKQUOTE' | 'PRE'
}

export interface BlockInputRuleTransaction {
  rule: BlockInputRuleName
  triggerText: BlockInputRuleMatch['triggerText']
  triggerKey: BlockInputRuleMatch['triggerKey']
  beforeMarkdown: string
  afterMarkdown: string
  beforeCursorOffset: number
  afterCursorOffset: number
  createdAt: string
}

export const matchBlockInputRule = (
  lineText: string,
  triggerKey: ' ' | 'Enter'
): BlockInputRuleMatch | null => {
  if (lineText === '#') {
    return {
      rule: 'heading-1',
      triggerText: '#',
      triggerKey,
      targetTag: 'H1'
    }
  }

  if (lineText === '-') {
    return {
      rule: 'unordered-list',
      triggerText: '-',
      triggerKey,
      targetTag: 'UL'
    }
  }

  if (lineText === '1.') {
    return {
      rule: 'ordered-list',
      triggerText: '1.',
      triggerKey,
      targetTag: 'OL'
    }
  }

  if (lineText === '>') {
    return {
      rule: 'blockquote',
      triggerText: '>',
      triggerKey,
      targetTag: 'BLOCKQUOTE'
    }
  }

  if (lineText === '```') {
    return {
      rule: 'code-block',
      triggerText: '```',
      triggerKey,
      targetTag: 'PRE'
    }
  }

  return null
}

export const canTriggerBlockInputRule = (lineText: string, key: string): BlockInputRuleMatch | null => {
  if (key === ' ') {
    if (lineText === '```') {
      return null
    }

    return matchBlockInputRule(lineText, ' ')
  }

  if (key === 'Enter' && lineText === '```') {
    return matchBlockInputRule(lineText, 'Enter')
  }

  return null
}

export class BlockInputRuleUndoStack {
  private readonly stack: BlockInputRuleTransaction[] = []

  push(transaction: BlockInputRuleTransaction): void {
    this.stack.push(transaction)
  }

  pop(): BlockInputRuleTransaction | null {
    return this.stack.pop() ?? null
  }

  size(): number {
    return this.stack.length
  }
}
