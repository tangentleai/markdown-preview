import fs from 'fs'
import path from 'path'

const readCss = (): string => {
  const cssPath = path.resolve(__dirname, '../index.css')
  return fs.readFileSync(cssPath, 'utf8')
}

describe('table cell wrap styles', () => {
  it('keeps overflow-wrap and word-break rules for table cells', () => {
    const css = readCss()
    const cellRule =
      /\.markdown-preview\s+th,[\s\S]*?\.markdown-preview\s+td\s*\{[\s\S]*?\}/.exec(css)?.[0] ?? ''

    expect(cellRule).toContain('overflow-wrap: anywhere;')
    expect(cellRule).toContain('word-break: break-word;')
  })
})
