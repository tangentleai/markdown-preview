import { findTextMatches, getRegexQueryError, replaceRegexMatch, resolveFindOptions } from './findMatchEngine'

describe('findMatchEngine', () => {
  it('uses case-insensitive matching when case toggle is off', () => {
    const matches = findTextMatches('Alpha alpha ALPHA', 'alpha', {
      caseSensitive: false,
      wholeWord: false,
      regex: false
    })

    expect(matches).toHaveLength(3)
  })

  it('uses case-sensitive matching when case toggle is on', () => {
    const matches = findTextMatches('Alpha alpha ALPHA', 'alpha', {
      caseSensitive: true,
      wholeWord: false,
      regex: false
    })

    expect(matches).toHaveLength(1)
    expect(matches[0]).toEqual({ start: 6, end: 11 })
  })

  it('applies whole-word boundary only to Latin words', () => {
    const latinMatches = findTextMatches('cat category scat cat', 'cat', {
      caseSensitive: false,
      wholeWord: true,
      regex: false
    })
    const nonLatinMatches = findTextMatches('你好世界 你好', '你好', {
      caseSensitive: false,
      wholeWord: true,
      regex: false
    })

    expect(latinMatches).toEqual([
      { start: 0, end: 3 },
      { start: 18, end: 21 }
    ])
    expect(nonLatinMatches).toEqual([
      { start: 0, end: 2 },
      { start: 5, end: 7 }
    ])
  })

  it('treats configured boundary breaks as non-Latin delimiters for whole-word matching', () => {
    const source = 'ALPHAcat category scat cat'
    const withoutBreaks = findTextMatches(source, 'cat', {
      caseSensitive: false,
      wholeWord: true,
      regex: false
    })
    const withBreaks = findTextMatches(source, 'cat', {
      caseSensitive: false,
      wholeWord: true,
      regex: false,
      wordBoundaryBreaks: new Set([5])
    })

    expect(withoutBreaks).toEqual([{ start: 23, end: 26 }])
    expect(withBreaks).toEqual([
      { start: 5, end: 8 },
      { start: 23, end: 26 }
    ])
  })

  it('supports regex m/i while case toggle still controls i behavior', () => {
    const source = 'alpha\nALPHA\nBeta'

    const insensitiveMatches = findTextMatches(source, '/^alpha$/m', {
      caseSensitive: false,
      wholeWord: false,
      regex: true
    })
    const sensitiveMatches = findTextMatches(source, '/^alpha$/im', {
      caseSensitive: true,
      wholeWord: false,
      regex: true
    })

    expect(insensitiveMatches).toHaveLength(2)
    expect(sensitiveMatches).toHaveLength(1)
    expect(sensitiveMatches[0]).toEqual({ start: 0, end: 5 })
  })

  it('supports both raw regex source and slash-wrapped regex source', () => {
    const source = 'alpha-42 beta-7'
    const rawMatches = findTextMatches(source, '([a-z]+)-(\\d+)', {
      caseSensitive: false,
      wholeWord: false,
      regex: true
    })
    const wrappedMatches = findTextMatches(source, '/([a-z]+)-(\\d+)/', {
      caseSensitive: false,
      wholeWord: false,
      regex: true
    })

    expect(rawMatches).toEqual(wrappedMatches)
    expect(rawMatches).toHaveLength(2)
  })

  it('forces whole-word off when regex mode is enabled', () => {
    const resolvedOptions = resolveFindOptions({
      caseSensitive: false,
      wholeWord: true,
      regex: true
    })

    expect(resolvedOptions.wholeWord).toBe(false)
  })

  it('returns explicit error message for invalid regex query', () => {
    const errorMessage = getRegexQueryError('/[a-/', false)
    const matches = findTextMatches('alpha beta', '/[a-/', {
      caseSensitive: false,
      wholeWord: false,
      regex: true
    })

    expect(errorMessage).toContain('正则表达式无效')
    expect(matches).toEqual([])
  })

  it('supports JavaScript regex replacement with capture groups', () => {
    const replaced = replaceRegexMatch('alpha-42', '/([a-z]+)-(\\d+)/i', '$2:$1', false)
    expect(replaced).toBe('42:alpha')
  })
})
