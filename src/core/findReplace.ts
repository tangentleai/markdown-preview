export interface FindReplaceOptions {
  caseSensitive: boolean
  wholeWord: boolean
  regex: boolean
}

export interface MatchRange {
  start: number
  end: number
}

export interface ReplaceRequest {
  source: string
  query: string
  replacement: string
  options: FindReplaceOptions
}

export interface ReplaceResult {
  text: string
  replacements: number
}

export interface FindReplaceContract {
  validateQuery: (query: string, options: FindReplaceOptions) => string | null
  findMatches: (source: string, query: string, options: FindReplaceOptions) => MatchRange[]
  replaceCurrent: (request: ReplaceRequest, activeMatchIndex: number) => ReplaceResult
  replaceAll: (request: ReplaceRequest) => ReplaceResult
}
