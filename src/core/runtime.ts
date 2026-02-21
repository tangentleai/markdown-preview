import type { CoreBoundaryDefinition } from './contracts'

export interface ReplaceAndRenderRequest {
  markdown: string
  query: string
  replacement: string
}

export interface ReplaceAndRenderResult {
  markdown: string
  html: string
  replacements: number
}

export const replaceAndRender = async (
  boundary: CoreBoundaryDefinition,
  request: ReplaceAndRenderRequest
): Promise<ReplaceAndRenderResult> => {
  const { documentModel, findReplace, renderPipeline } = boundary.contracts
  const options = {
    caseSensitive: false,
    wholeWord: false,
    regex: false
  }

  const validationError = findReplace.validateQuery(request.query, options)
  if (validationError) {
    throw new Error(validationError)
  }

  const replaced = findReplace.replaceAll(
    {
      source: request.markdown,
      query: request.query,
      replacement: request.replacement,
      options
    }
  )

  const document = documentModel.parseMarkdown(replaced.text)
  const renderResult = await renderPipeline.render({
    markdown: replaced.text,
    document,
    format: 'html'
  })

  if (!renderResult.html) {
    throw new Error('RENDER_PIPELINE_HTML_MISSING')
  }

  return {
    markdown: documentModel.serializeMarkdown(document),
    html: renderResult.html,
    replacements: replaced.replacements
  }
}
