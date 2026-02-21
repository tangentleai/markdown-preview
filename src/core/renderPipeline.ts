import type { MarkdownDocument } from './documentModel'

export type RenderOutputFormat = 'html' | 'document'

export interface RenderRequest {
  markdown: string
  document: MarkdownDocument
  format: RenderOutputFormat
}

export interface RenderResult {
  format: RenderOutputFormat
  html?: string
  document?: MarkdownDocument
  diagnostics?: string[]
}

export interface RenderPipelineContract {
  render: (request: RenderRequest) => Promise<RenderResult> | RenderResult
}
