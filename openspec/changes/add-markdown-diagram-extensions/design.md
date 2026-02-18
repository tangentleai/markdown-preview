## Context
Markdown Preview 是一个基于 React + TypeScript + Vite 的轻量级 Markdown 预览工具。当前使用 ReactMarkdown 作为解析引擎，配合 remark-gfm（GFM 支持）、remark-math（数学公式）和 rehype-highlight（代码高亮）插件。

## Goals / Non-Goals

### Goals
- 添加 Mermaid 图表支持，覆盖常用图表类型
- 保持与现有架构的一致性和代码质量
- 确保图表渲染性能良好
- 提供良好的用户体验

### Non-Goals
- 不添加过多复杂的图表库，保持轻量级
- 不提供图表编辑功能，仅支持渲染
- 不支持实时协作编辑图表

## Decisions

### Decision 1: 同时支持 Mermaid 和 PlantUML
- **原因**：
  - Mermaid：最流行的 Markdown 图表库，语法简单，社区活跃
  - PlantUML：功能强大的 UML 图表库，支持专业的 UML 图表类型
- **优势**：
  - 覆盖不同用户需求（简单图表 vs 专业 UML 图表）
  - Mermaid 适合快速绘制流程图、时序图等
  - PlantUML 适合绘制专业的 UML 类图、用例图等
- **挑战**：
  - PlantUML 需要额外的渲染服务（如 PlantUML 服务器或本地渲染）
  - 语法较复杂，学习曲线较陡

### Decision 2: 渲染方案选择
- **Mermaid**：客户端渲染（使用 mermaid 库）
  - 优势：简单，无需额外服务
  - 渲染格式：SVG
- **PlantUML**：服务器端渲染（使用 PlantUML 服务器）
  - 优势：功能强大，支持所有 PlantUML 语法
  - 方案：使用 public PlantUML 服务器（如 http://www.plantuml.com/plantuml）或本地服务器
  - 渲染格式：SVG/PNG

### Decision 3: 插件集成方案
- **Mermaid**：使用 remark-mermaid 插件
  - 与 ReactMarkdown 生态完美集成
  - 支持自动识别 mermaid 代码块
- **PlantUML**：使用 remark-plantuml 插件
  - 支持自动识别 plantuml 代码块
  - 需要配置 PlantUML 服务器地址

## Risks / Trade-offs

### 风险 1：依赖增加
- 添加 mermaid 和 remark-plantuml 会增加包大小
- **缓解方案**：考虑使用动态导入优化首屏加载

### 风险 2：性能影响
- 复杂图表可能会影响页面加载速度
- PlantUML 需要网络请求，可能导致延迟
- **缓解方案**：
  - 实现图表懒加载，只在可见时渲染
  - 添加加载状态和错误处理

### 风险 3：兼容性问题
- 不同浏览器对 SVG 和某些 CSS 特性的支持可能不同
- PlantUML 服务器的可用性问题
- **缓解方案**：
  - 测试主流浏览器，提供降级方案
  - 添加备用 PlantUML 服务器配置
  - 实现离线时的降级显示

### 风险 4：PlantUML 服务器依赖
- 依赖外部 PlantUML 服务器（如 plantuml.com）
- 可能存在稳定性或隐私问题
- **缓解方案**：
  - 允许用户配置自定义 PlantUML 服务器地址
  - 提供本地渲染选项（如使用 Docker）

## Architecture Design

### 组件结构
```
MarkdownPreview (主组件)
├── ReactMarkdown (解析引擎)
├── remark-gfm (GFM 支持)
├── remark-math (数学公式)
├── rehype-highlight (代码高亮)
├── remark-mermaid (图表渲染)
│   └── MermaidRenderer (图表组件)
└── remark-plantuml (图表渲染)
    └── PlantUmlRenderer (图表组件)
```

### 数据流程
1. 用户输入 Markdown 文本
2. ReactMarkdown 解析文本
3. remark 插件处理特定语法：
   - remark-mermaid 识别并处理 mermaid 代码块
   - remark-plantuml 识别并处理 plantuml 代码块
4. 渲染到 DOM，对应的图表组件负责实际渲染
5. Mermaid 组件在客户端直接渲染 SVG
6. PlantUML 组件通过 HTTP 请求到 PlantUML 服务器获取 SVG/PNG 图表

## Implementation Steps

### 1. 依赖安装
```bash
npm install mermaid
npm install --save-dev @types/mermaid
npm install remark-mermaid
npm install remark-plantuml
```

### 2. 修改 MarkdownPreview.tsx
```typescript
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import remarkMermaid from 'remark-mermaid'
import remarkPlantUml from 'remark-plantuml'
import 'highlight.js/styles/github.css'
import 'katex/dist/katex.min.css'

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        预览效果
      </h2>
      <div className="markdown-preview overflow-auto max-h-[600px]">
        <ReactMarkdown
          remarkPlugins={[
            remarkGfm, 
            remarkMath, 
            remarkMermaid,
            [remarkPlantUml, { baseUrl: 'http://www.plantuml.com/plantuml' }]
          ]}
          rehypePlugins={[rehypeHighlight]}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  )
}
```

### 3. 添加图表示例到 App.tsx
在初始 markdown 状态中添加 Mermaid 和 PlantUML 的图表示例，以便用户可以立即看到效果。

## Open Questions
- 是否需要提供图表主题配置？（当前版本不实现）
- 是否需要支持图表导出功能？（当前版本不实现）
- 是否需要支持本地 PlantUML 渲染？（当前版本使用公共服务器）
