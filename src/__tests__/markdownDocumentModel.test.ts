import {
  markdownToEditableHtml,
  parseMarkdownToDocumentModel,
  type DocumentModel,
  serializeDocumentModelToMarkdown
} from '../utils/markdownDocumentModel'

describe('markdown import parser', () => {
  it('should parse required markdown nodes into document model snapshot', () => {
    const markdown = `# 标题

段落包含 [链接](https://example.com) 与 ![图标](./icon.png)。

- 列表项一
- 列表项二

> 引用第一行
> 引用第二行

\`\`\`ts
const value = 1
\`\`\`

| 列1 | 列2 |
| --- | --- |
| 文本 | [文档](https://docs.example.com) |
| 图片 | ![示例](./table.png) |`

    const model = parseMarkdownToDocumentModel(markdown)

    expect(model).toMatchSnapshot()
  })

  it('should keep existing heading list code and paragraph import behavior', () => {
    const markdown = `# 标题\n\n- 项目一\n- 项目二\n\n\`\`\`\ncode\n\`\`\`\n\n普通段落`

    expect(markdownToEditableHtml(markdown)).toEqual(
      '<h1>标题</h1><ul><li>项目一</li><li>项目二</li></ul><div class="wysiwyg-code-block" data-code-block="true" data-language="" contenteditable="false"><pre class="wysiwyg-code-fallback"><code>code</code></pre></div><p>普通段落</p>'
    )
  })

  it('should render quote table image and link from imported model', () => {
    const markdown = `> 引用 [链接](https://example.com)\n\n| A | B |\n| --- | --- |\n| ![图](a.png) | [文档](https://docs.example.com) |`

    expect(markdownToEditableHtml(markdown)).toEqual(
      '<blockquote><p>引用 <a href="https://example.com">链接</a></p></blockquote><table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td><img src="a.png" alt="图" /></td><td><a href="https://docs.example.com">文档</a></td></tr></tbody></table>'
    )
  })

  it('should parse and render markdown horizontal rule as hr node', () => {
    const markdown = '上文\n\n---\n\n下文\n'

    const model = parseMarkdownToDocumentModel(markdown)
    expect(model.blocks[1]).toEqual({ type: 'horizontalRule' })
    expect(markdownToEditableHtml(markdown)).toContain('<hr />')
    expect(serializeDocumentModelToMarkdown(model)).toContain('\n\n---\n\n')
  })

  it('should parse table alignment marker and hide marker text in editable html', () => {
    const markdown = '<!-- table:align=center -->\n| A | B |\n| --- | --- |\n| 1 | 2 |\n'

    const model = parseMarkdownToDocumentModel(markdown)
    const tableBlock = model.blocks.find((block) => block.type === 'table')

    expect(tableBlock).toEqual({
      type: 'table',
      header: [[{ type: 'text', value: 'A' }], [{ type: 'text', value: 'B' }]],
      rows: [[[{ type: 'text', value: '1' }], [{ type: 'text', value: '2' }]],
      ],
      align: 'center',
      alignExplicit: true
    })

    const html = markdownToEditableHtml(markdown)
    expect(html).toContain('data-table-align="center"')
    expect(html).toContain('data-table-align-explicit="true"')
    expect(html).not.toContain('table:align=center')
  })

  it('should serialize explicit table alignment marker and preserve round-trip', () => {
    const markdown = '<!-- table:align=right -->\n| A | B |\n| --- | --- |\n| 1 | 2 |\n'
    const parsed = parseMarkdownToDocumentModel(markdown)
    const serialized = serializeDocumentModelToMarkdown(parsed)

    expect(serialized).toContain('<!-- table:align=right -->')
    expect(serialized).toContain('| A | B |')
    expect(parseMarkdownToDocumentModel(serialized)).toEqual(parsed)
  })

  it('should remove alignment marker together when table block is deleted from model', () => {
    const markdown = '<!-- table:align=left -->\n| A | B |\n| --- | --- |\n| 1 | 2 |\n\n尾部段落\n'
    const parsed = parseMarkdownToDocumentModel(markdown)
    const withoutTable = {
      blocks: parsed.blocks.filter((block) => block.type !== 'table')
    }

    const serialized = serializeDocumentModelToMarkdown(withoutTable)
    expect(serialized).not.toContain('table:align=')
    expect(serialized).toContain('尾部段落')
    expect(serialized).not.toContain('| A | B |')
  })

  it('should render benchmark block LaTeX formula with \\[...\\] delimiters', () => {
    const markdown = '\\[\n\\text{MOM}_{i,t} = \\frac{P_{i,t-1}}{P_{i,t-1-N}} - 1\n\\]'

    const model = parseMarkdownToDocumentModel(markdown)
    expect(model.blocks[0]).toEqual({
      type: 'mathBlock',
      tex: '\\text{MOM}_{i,t} = \\frac{P_{i,t-1}}{P_{i,t-1-N}} - 1'
    })

    const html = markdownToEditableHtml(markdown)
    expect(html).toContain('class="math-block"')
    expect(html).toContain('class="katex"')
  })

  it('should fallback to raw LaTeX text when block formula render fails', () => {
    const markdown = '\\[\n\\frac{1}{\n\\]'

    const html = markdownToEditableHtml(markdown)
    expect(html).toContain('class="math-block"')
    expect(html).toContain('\\frac{1}{')
    expect(html).not.toContain('class="katex"')
  })

  it('should parse and render inline \\(...\\) math syntax', () => {
    const markdown = '收益率定义为 \\(r_t = \\frac{P_t}{P_{t-1}} - 1\\)'

    const html = markdownToEditableHtml(markdown)
    expect(html).toContain('class="math-inline"')
    expect(html).toContain('class="katex"')
  })

  it('should serialize document model to utf-8 markdown with structural semantics', () => {
    const model: DocumentModel = {
      blocks: [
        { type: 'heading', level: 2, children: [{ type: 'text', value: '导出标题' }] },
        {
          type: 'paragraph',
          children: [
            { type: 'text', value: '段落含有 ' },
            { type: 'strong', children: [{ type: 'text', value: '加粗' }] },
            { type: 'text', value: ' 与 ' },
            { type: 'link', href: 'https://example.com', children: [{ type: 'text', value: '链接' }] },
            { type: 'text', value: '。' }
          ]
        },
        {
          type: 'list',
          ordered: false,
          items: [
            [{ type: 'text', value: '列表项A' }],
            [{ type: 'code', value: 'const x = 1' }]
          ]
        },
        {
          type: 'quote',
          blocks: [{ type: 'paragraph', children: [{ type: 'text', value: '引用内容' }] }]
        },
        { type: 'codeBlock', language: 'ts', code: 'const 输出 = "UTF-8"' },
        {
          type: 'table',
          header: [[{ type: 'text', value: '列1' }], [{ type: 'text', value: '列2' }]],
          rows: [
            [
              [{ type: 'text', value: '图片' }],
              [{ type: 'image', alt: '示例图', src: './demo.png' }]
            ]
          ]
        }
      ]
    }

    const markdown = serializeDocumentModelToMarkdown(model)

    expect(markdown).toBe(
      '## 导出标题\n\n段落含有 **加粗** 与 [链接](https://example.com)。\n\n- 列表项A\n- `const x = 1`\n\n> 引用内容\n\n```ts\nconst 输出 = "UTF-8"\n```\n\n| 列1 | 列2 |\n| --- | --- |\n| 图片 | ![示例图](./demo.png) |\n'
    )
    expect(Buffer.from(markdown, 'utf8').toString('utf8')).toBe(markdown)
  })

  it('should preserve document structure after serialize and parse round-trip', () => {
    const markdown = `# 标题

段落包含 [链接](https://example.com) 与 ![图标](./icon.png)。

1. 第一项
2. 第二项

> 引用第一行
> 引用第二行

\`\`\`ts
const value = 1
\`\`\`

| 列1 | 列2 |
| --- | --- |
| 文本 | [文档](https://docs.example.com) |`

    const parsed = parseMarkdownToDocumentModel(markdown)
    const serialized = serializeDocumentModelToMarkdown(parsed)

    expect(parseMarkdownToDocumentModel(serialized)).toEqual(parsed)
  })

  it('should parse table with short delimiter (less than 3 dashes)', () => {
    const markdown = `| 平台/工具 | 类型 | 语言支持 | 成本（区间/方式） |
|:-:|---|:--|---|
| 聚宽 JoinQuant | 云投研/回测平台 | Python（在线） | 基础功能免费 |
| 米筐 Ricequant | 云+本地生态 | Python（为主） | 官方购买入口以询价为主 |`

    const model = parseMarkdownToDocumentModel(markdown)
    const tableBlock = model.blocks.find((block) => block.type === 'table')

    expect(tableBlock).toBeDefined()
    expect(tableBlock).toEqual({
      type: 'table',
      header: [
        [{ type: 'text', value: '平台/工具' }],
        [{ type: 'text', value: '类型' }],
        [{ type: 'text', value: '语言支持' }],
        [{ type: 'text', value: '成本（区间/方式）' }]
      ],
      rows: [
        [
          [{ type: 'text', value: '聚宽 JoinQuant' }],
          [{ type: 'text', value: '云投研/回测平台' }],
          [{ type: 'text', value: 'Python（在线）' }],
          [{ type: 'text', value: '基础功能免费' }]
        ],
        [
          [{ type: 'text', value: '米筐 Ricequant' }],
          [{ type: 'text', value: '云+本地生态' }],
          [{ type: 'text', value: 'Python（为主）' }],
          [{ type: 'text', value: '官方购买入口以询价为主' }]
        ]
      ]
    })

    const html = markdownToEditableHtml(markdown)
    expect(html).toContain('<table>')
    expect(html).toContain('</table>')
  })
})
