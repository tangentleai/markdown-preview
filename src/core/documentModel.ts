export type InlineNode =
  | { type: 'text'; value: string }
  | { type: 'code'; value: string }
  | { type: 'strong'; children: InlineNode[] }
  | { type: 'em'; children: InlineNode[] }
  | { type: 'link'; href: string; children: InlineNode[] }
  | { type: 'image'; alt: string; src: string }
  | { type: 'mathInline'; tex: string }

export type BlockNode =
  | { type: 'paragraph'; children: InlineNode[] }
  | { type: 'heading'; level: number; children: InlineNode[] }
  | { type: 'horizontalRule' }
  | { type: 'list'; ordered: boolean; items: InlineNode[][] }
  | { type: 'quote'; blocks: BlockNode[] }
  | { type: 'codeBlock'; language: string; code: string }
  | { type: 'mathBlock'; tex: string }
  | { type: 'table'; header: InlineNode[][]; rows: InlineNode[][][] }

export interface MarkdownDocument {
  blocks: BlockNode[]
}

export interface DocumentModelContract {
  parseMarkdown: (markdown: string) => MarkdownDocument
  serializeMarkdown: (document: MarkdownDocument) => string
}
