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
})
