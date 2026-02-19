import { matchInlineStyleRule } from '../utils/wysiwygInlineStyleRules'

describe('wysiwyg inline style rules', () => {
  it.each([
    {
      input: '**bold**',
      expected: { rule: 'strong', content: 'bold' }
    },
    {
      input: '*italic*',
      expected: { rule: 'em', content: 'italic' }
    },
    {
      input: '`code`',
      expected: { rule: 'code', content: 'code' }
    },
    {
      input: '[OpenAI](https://openai.com)',
      expected: { rule: 'link', content: 'OpenAI', href: 'https://openai.com' }
    }
  ])('should match inline closing trigger for $input', ({ input, expected }) => {
    expect(matchInlineStyleRule(input)).toEqual(expect.objectContaining(expected))
  })

  it('should not match unmatched markers or incomplete links', () => {
    expect(matchInlineStyleRule('**bold*')).toBeNull()
    expect(matchInlineStyleRule('*italic')).toBeNull()
    expect(matchInlineStyleRule('`code')).toBeNull()
    expect(matchInlineStyleRule('[text](https://example.com')).toBeNull()
  })
})
