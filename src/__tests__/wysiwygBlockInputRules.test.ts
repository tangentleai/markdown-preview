import {
  BlockInputRuleUndoStack,
  canTriggerBlockInputRule,
  type BlockInputRuleTransaction
} from '../utils/wysiwygBlockInputRules'

describe('wysiwyg block input rules transaction log', () => {
  it.each([
    { marker: '#', key: ' ', rule: 'heading-1', tag: 'H1' },
    { marker: '-', key: ' ', rule: 'unordered-list', tag: 'UL' },
    { marker: '1.', key: ' ', rule: 'ordered-list', tag: 'OL' },
    { marker: '>', key: ' ', rule: 'blockquote', tag: 'BLOCKQUOTE' },
    { marker: '```', key: 'Enter', rule: 'code-block', tag: 'PRE' }
  ])('should generate transaction metadata for marker %s', ({ marker, key, rule, tag }) => {
    const match = canTriggerBlockInputRule(marker, key)

    expect(match).toEqual(
      expect.objectContaining({
        rule,
        triggerText: marker,
        targetTag: tag
      })
    )
  })

  it('should support one-step undo by restoring pre-transform markdown from transaction stack', () => {
    const stack = new BlockInputRuleUndoStack()
    const transaction: BlockInputRuleTransaction = {
      rule: 'heading-1',
      triggerText: '#',
      triggerKey: ' ',
      beforeMarkdown: '#\n',
      afterMarkdown: '',
      beforeCursorOffset: 1,
      afterCursorOffset: 0,
      createdAt: '2026-02-19T00:00:00Z'
    }

    stack.push(transaction)
    expect(stack.size()).toBe(1)

    const undone = stack.pop()
    expect(undone?.beforeMarkdown).toBe('#\n')
    expect(stack.size()).toBe(0)
  })
})
