export type BlockInputRuleName =
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'heading-5'
  | 'heading-6'
  | 'unordered-list'
  | 'ordered-list'
  | 'blockquote'
  | 'code-block'
  | 'heading-to-paragraph'
  | 'exit-empty-list-item'
  | 'exit-empty-blockquote'

export interface BlockInputRuleMatch {
  rule: BlockInputRuleName
  triggerText: '#' | '##' | '###' | '####' | '#####' | '######' | '-' | '1.' | '>' | '```'
  triggerKey: ' ' | 'Enter'
  targetTag: 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'UL' | 'OL' | 'BLOCKQUOTE' | 'PRE'
}

export interface BlockInputRuleTransaction {
  rule: BlockInputRuleName
  triggerText: string
  triggerKey: string
  beforeMarkdown: string
  afterMarkdown: string
  beforeHtml?: string
  afterHtml?: string
  beforeCursorOffset: number
  afterCursorOffset: number
  createdAt: string
}

export interface ImeKeyboardEventLike {
  isComposing?: boolean
  keyCode?: number
  which?: number
}

export const isImeComposingEvent = (
  event: ImeKeyboardEventLike,
  compositionSessionActive: boolean
): boolean => compositionSessionActive || Boolean(event.isComposing) || event.keyCode === 229 || event.which === 229

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

  if (lineText === '##') {
    return {
      rule: 'heading-2',
      triggerText: '##',
      triggerKey,
      targetTag: 'H2'
    }
  }

  if (lineText === '###') {
    return {
      rule: 'heading-3',
      triggerText: '###',
      triggerKey,
      targetTag: 'H3'
    }
  }

  if (lineText === '####') {
    return {
      rule: 'heading-4',
      triggerText: '####',
      triggerKey,
      targetTag: 'H4'
    }
  }

  if (lineText === '#####') {
    return {
      rule: 'heading-5',
      triggerText: '#####',
      triggerKey,
      targetTag: 'H5'
    }
  }

  if (lineText === '######') {
    return {
      rule: 'heading-6',
      triggerText: '######',
      triggerKey,
      targetTag: 'H6'
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
  private readonly undoStack: BlockInputRuleTransaction[] = []
  private readonly redoStack: BlockInputRuleTransaction[] = []

  push(transaction: BlockInputRuleTransaction): void {
    this.undoStack.push(transaction)
    this.redoStack.length = 0
  }

  pop(): BlockInputRuleTransaction | null {
    return this.undo()
  }

  undo(): BlockInputRuleTransaction | null {
    const transaction = this.undoStack.pop() ?? null
    if (transaction) {
      this.redoStack.push(transaction)
    }
    return transaction
  }

  redo(): BlockInputRuleTransaction | null {
    const transaction = this.redoStack.pop() ?? null
    if (transaction) {
      this.undoStack.push(transaction)
    }
    return transaction
  }

  size(): number {
    return this.undoStack.length
  }

  redoSize(): number {
    return this.redoStack.length
  }
}
