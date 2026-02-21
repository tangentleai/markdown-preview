export interface FindMatchOptions {
  caseSensitive: boolean
  wholeWord: boolean
  regex: boolean
  wordBoundaryBreaks?: ReadonlySet<number>
}

export interface TextMatchRange {
  start: number
  end: number
}

const buildRegexErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return `正则表达式无效：${error.message}`
  }
  return '正则表达式无效'
}

const LATIN_WORD_PATTERN = /^[A-Za-z]+$/

const isLatinLetter = (value: string | undefined): boolean =>
  Boolean(value && value.length > 0 && /[A-Za-z]/.test(value))

const isLatinWord = (value: string): boolean => LATIN_WORD_PATTERN.test(value)

const hasLatinWordBoundary = (
  source: string,
  start: number,
  end: number,
  wordBoundaryBreaks?: ReadonlySet<number>
): boolean => {
  const before = start > 0 ? source[start - 1] : undefined
  const after = end < source.length ? source[end] : undefined
  const hasBoundaryBefore = start <= 0 || Boolean(wordBoundaryBreaks?.has(start))
  const hasBoundaryAfter = end >= source.length || Boolean(wordBoundaryBreaks?.has(end))
  const beforeOk = hasBoundaryBefore || !isLatinLetter(before)
  const afterOk = hasBoundaryAfter || !isLatinLetter(after)
  return beforeOk && afterOk
}

const withWholeWordFilter = (
  source: string,
  query: string,
  matches: TextMatchRange[],
  wholeWord: boolean,
  wordBoundaryBreaks?: ReadonlySet<number>
): TextMatchRange[] => {
  if (!wholeWord || !isLatinWord(query)) {
    return matches
  }

  return matches.filter((match) => hasLatinWordBoundary(source, match.start, match.end, wordBoundaryBreaks))
}

const isAllowedRegexFlag = (value: string): boolean => value === 'i' || value === 'm'

const parseRegexSourceAndFlags = (query: string): { source: string; flags: string } => {
  if (!query.startsWith('/')) {
    return { source: query, flags: '' }
  }

  for (let index = query.length - 1; index > 0; index -= 1) {
    if (query[index] !== '/') {
      continue
    }

    let escapeCount = 0
    for (let cursor = index - 1; cursor >= 0 && query[cursor] === '\\'; cursor -= 1) {
      escapeCount += 1
    }

    if (escapeCount % 2 === 1) {
      continue
    }

    const trailingFlags = query.slice(index + 1)
    if (!trailingFlags.split('').every(isAllowedRegexFlag)) {
      continue
    }

    return {
      source: query.slice(1, index),
      flags: trailingFlags
    }
  }

  return { source: query, flags: '' }
}

const resolveRegexFlags = (inputFlags: string, caseSensitive: boolean): string => {
  const filteredFlags = Array.from(new Set(inputFlags.split('').filter((flag) => flag === 'm' || flag === 'i')))
  const withoutI = filteredFlags.filter((flag) => flag !== 'i')
  if (caseSensitive) {
    return withoutI.join('')
  }
  return ['i', ...withoutI].join('')
}

const buildFindRegex = (query: string, caseSensitive: boolean, global: boolean): RegExp => {
  const parsed = parseRegexSourceAndFlags(query)
  const resolvedFlags = resolveRegexFlags(parsed.flags, caseSensitive)
  const flags = global ? `${resolvedFlags}g` : resolvedFlags
  return new RegExp(parsed.source, flags)
}

const findPlainMatches = (source: string, query: string, caseSensitive: boolean): TextMatchRange[] => {
  const normalizedSource = caseSensitive ? source : source.toLocaleLowerCase()
  const normalizedQuery = caseSensitive ? query : query.toLocaleLowerCase()
  const matches: TextMatchRange[] = []
  let cursor = 0

  while (cursor <= normalizedSource.length - normalizedQuery.length) {
    const foundIndex = normalizedSource.indexOf(normalizedQuery, cursor)
    if (foundIndex < 0) {
      break
    }

    matches.push({ start: foundIndex, end: foundIndex + normalizedQuery.length })
    cursor = foundIndex + normalizedQuery.length
  }

  return matches
}

const findRegexMatches = (source: string, query: string, caseSensitive: boolean): TextMatchRange[] => {
  const regex = buildFindRegex(query, caseSensitive, true)
  const matches: TextMatchRange[] = []

  let result = regex.exec(source)
  while (result) {
    const matchedText = result[0] ?? ''
    const start = result.index
    const end = start + matchedText.length

    if (end > start) {
      matches.push({ start, end })
    }

    if (matchedText.length === 0) {
      regex.lastIndex += 1
    }

    result = regex.exec(source)
  }

  return matches
}

export const getRegexQueryError = (query: string, caseSensitive: boolean): string | null => {
  if (!query) {
    return null
  }

  try {
    buildFindRegex(query, caseSensitive, false)
    return null
  } catch (error) {
    return buildRegexErrorMessage(error)
  }
}

export const replaceRegexMatch = (
  matchedText: string,
  query: string,
  replacement: string,
  caseSensitive: boolean
): string => {
  const regex = buildFindRegex(query, caseSensitive, false)
  return matchedText.replace(regex, replacement)
}

export const resolveFindOptions = (options: FindMatchOptions): FindMatchOptions => ({
  caseSensitive: options.caseSensitive,
  regex: options.regex,
  wholeWord: options.regex ? false : options.wholeWord
})

export const findTextMatches = (source: string, query: string, options: FindMatchOptions): TextMatchRange[] => {
  if (!query) {
    return []
  }

  const resolvedOptions = resolveFindOptions(options)
  let matches: TextMatchRange[] = []

  try {
    matches = resolvedOptions.regex
      ? findRegexMatches(source, query, resolvedOptions.caseSensitive)
      : findPlainMatches(source, query, resolvedOptions.caseSensitive)
  } catch {
    return []
  }

  return withWholeWordFilter(source, query, matches, resolvedOptions.wholeWord, options.wordBoundaryBreaks)
}
