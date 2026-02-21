import {
  findTextMatches as coreFindTextMatches
} from '../core/findMatchEngine'
import { markdownToEditableHtml as coreMarkdownToEditableHtml } from '../core/markdownDocumentModel'
import { normalizeMarkdownFileName as coreNormalizeMarkdownFileName } from '../core/markdownFileService'
import {
  normalizeMarkdownFileName as utilNormalizeMarkdownFileName
} from '../utils/markdownFileIO'
import { markdownToEditableHtml as utilMarkdownToEditableHtmlFromModel } from '../utils/markdownDocumentModel'
import { findTextMatches as utilFindTextMatchesFromEngine } from '../utils/findMatchEngine'

describe('core shared logic migration', () => {
  it('routes markdown rendering through core implementation', () => {
    const markdown = '# Heading\n\nalpha beta'
    expect(utilMarkdownToEditableHtmlFromModel).toBe(coreMarkdownToEditableHtml)
    expect(utilMarkdownToEditableHtmlFromModel(markdown)).toContain('<h1>Heading</h1>')
  })

  it('routes find/replace matching through core implementation', () => {
    const options = { caseSensitive: false, wholeWord: false, regex: false }
    expect(utilFindTextMatchesFromEngine).toBe(coreFindTextMatches)
    expect(utilFindTextMatchesFromEngine('alpha beta alpha', 'alpha', options)).toEqual([
      { start: 0, end: 5 },
      { start: 11, end: 16 }
    ])
  })

  it('routes markdown file naming helpers through core implementation', () => {
    expect(utilNormalizeMarkdownFileName).toBe(coreNormalizeMarkdownFileName)
    expect(utilNormalizeMarkdownFileName('notes')).toBe('notes.md')
  })
})
