import {
  markdownToEditableHtml,
  parseMarkdownToDocumentModel
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
      '<h1>标题</h1><ul><li>项目一</li><li>项目二</li></ul><pre><code>code</code></pre><p>普通段落</p>'
    )
  })

  it('should render quote table image and link from imported model', () => {
    const markdown = `> 引用 [链接](https://example.com)\n\n| A | B |\n| --- | --- |\n| ![图](a.png) | [文档](https://docs.example.com) |`

    expect(markdownToEditableHtml(markdown)).toEqual(
      '<blockquote><p>引用 <a href="https://example.com">链接</a></p></blockquote><table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td><img src="a.png" alt="图" /></td><td><a href="https://docs.example.com">文档</a></td></tr></tbody></table>'
    )
  })
})
