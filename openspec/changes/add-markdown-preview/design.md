# Design: Markdown Preview 技术架构

## Context
这是一个轻量级的 Markdown 预览工具，旨在提供快速、简单的 Markdown 文本预览功能。用户可以实时查看 Markdown 内容的渲染效果，支持常见的 Markdown 语法和扩展功能。

## Goals / Non-Goals

### Goals
- 提供实时的 Markdown 预览功能
- 支持 GitHub Flavored Markdown (GFM) 语法
- 提供代码高亮功能
- 支持数学公式渲染
- 实现响应式设计，适配不同屏幕尺寸
- 保持应用轻量级和快速响应

### Non-Goals
- 不提供文件编辑和保存功能
- 不提供版本控制功能
- 不提供复杂的文档管理功能
- 不提供多用户协作功能

## Decisions

### 1. 技术栈选择

**Decision**: 使用 React + TypeScript + Vite

**Rationale**:
- React 提供了强大的组件化架构和生态系统
- TypeScript 提供了类型安全保障
- Vite 提供了快速的开发体验和构建速度

**Alternatives considered**:
- Vue.js + TypeScript + Vite
- Svelte + TypeScript + Vite
- 原生 JavaScript + Webpack

### 2. Markdown 解析库选择

**Decision**: 使用 ReactMarkdown + remark 插件

**Rationale**:
- ReactMarkdown 是专门为 React 设计的 Markdown 解析库
- 支持 remark 插件生态系统，可扩展功能
- 提供了安全的默认配置

**Alternatives considered**:
- react-markdown (当前选择)
- marked
- showdown

### 3. 样式框架选择

**Decision**: 使用 Tailwind CSS

**Rationale**:
- 提供了现代化的设计系统
- 支持快速开发和响应式设计
- 具有丰富的组件和工具类

**Alternatives considered**:
- CSS Modules
- styled-components
- Chakra UI

### 4. 代码高亮选择

**Decision**: 使用 rehype-highlight

**Rationale**:
- 基于 highlight.js，支持多种语言的语法高亮
- 与 ReactMarkdown 和 remark 生态系统很好地集成

**Alternatives considered**:
- prismjs
- syntax-highlighter

### 5. 数学公式渲染选择

**Decision**: 使用 remark-math + remark-html-katex

**Rationale**:
- remark-math 是专门为 remark 生态系统设计的数学公式解析插件
- 支持 LaTeX 语法
- 渲染效果美观

**Alternatives considered**:
- remark-math (当前选择)
- react-katex
- mathjax

## Architecture

### 组件结构

```
MarkdownPreviewApp
├── Header (应用头部)
├── MainContent
│   ├── MarkdownInput (文本输入区域)
│   └── MarkdownPreview (预览区域)
└── Footer (应用底部)
```

### 数据流

```
用户输入 → MarkdownInput 组件 → 状态管理 → MarkdownPreview 组件 → 渲染 HTML
```

### 关键依赖

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-markdown": "^8.0.7",
  "remark-gfm": "^3.0.1",
  "remark-math": "^5.1.1",
  "rehype-highlight": "^6.0.0",
  "katex": "^0.16.9"
}
```

## Risks / Trade-offs

### 1. 渲染性能

**Risk**: 大量 Markdown 内容可能导致渲染延迟

**Mitigation**:
- 实现增量渲染
- 考虑使用虚拟滚动处理大量内容

### 2. 安全风险

**Risk**: Markdown 内容可能包含恶意代码

**Mitigation**:
- 使用安全的渲染库
- 对输入内容进行适当的 sanitization
- 考虑使用 DOMPurify 等库

### 3. 浏览器兼容性

**Risk**: 不同浏览器对 Markdown 渲染的支持差异

**Mitigation**:
- 使用成熟的 Markdown 解析库
- 进行充分的跨浏览器测试
- 使用 Babel 进行代码转译

## Open Questions

- 是否需要支持 Markdown 文件的拖拽上传？
- 是否需要添加自动保存功能？
- 是否需要支持 Markdown 内容的分享功能？
