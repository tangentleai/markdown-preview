# Change: 添加 Markdown 图表扩展功能

## Why
当前 Markdown Preview 工具支持基本的 Markdown 语法、GFM 扩展、数学公式和代码高亮，但缺少对图表可视化的支持。用户经常需要在文档中插入流程图、时序图、甘特图等图表来更好地表达复杂概念，而目前需要使用外部工具生成图片再插入，效率较低。

## What Changes
- **添加 Mermaid 图表支持**：支持流程图、时序图、甘特图、类图、饼图等多种图表类型
- **添加 PlantUML 图表支持**：支持 UML 图表的渲染
- **扩展 ReactMarkdown 插件系统**：集成 remark-mermaid 和 remark-plantuml 等插件
- **更新依赖配置**：添加 mermaid、react-syntax-highlighter 等相关依赖
- **优化预览组件**：确保图表渲染与现有功能无缝集成

## Impact
- Affected specs: `markdown-preview`
- Affected code:
  - `src/components/MarkdownPreview.tsx` - 添加图表渲染支持
  - `package.json` - 添加新依赖
  - `src/App.tsx` - 添加图表示例
