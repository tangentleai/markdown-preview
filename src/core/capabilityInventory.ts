export interface CoreCapabilityItem {
  id: 'document-model' | 'render-pipeline' | 'find-replace' | 'file-service'
  summary: string
  platformAgnostic: true
  boundaries: readonly string[]
}

export const CORE_CAPABILITY_INVENTORY: readonly CoreCapabilityItem[] = [
  {
    id: 'document-model',
    summary: 'Markdown text and AST-like document model conversion contracts.',
    platformAgnostic: true,
    boundaries: ['pure data structure', 'parse/serialize contract only']
  },
  {
    id: 'render-pipeline',
    summary: 'Markdown/document rendering pipeline contract with diagnostics channel.',
    platformAgnostic: true,
    boundaries: ['input and output schema', 'no browser renderer assumptions']
  },
  {
    id: 'find-replace',
    summary: 'Search and replace query validation, match and replace contract.',
    platformAgnostic: true,
    boundaries: ['string operations only', 'regex behavior delegated to implementation']
  },
  {
    id: 'file-service',
    summary: 'Open/save/recent-files file service contract without platform picker types.',
    platformAgnostic: true,
    boundaries: ['content and handle protocol', 'platform adapter provides concrete IO']
  }
]
