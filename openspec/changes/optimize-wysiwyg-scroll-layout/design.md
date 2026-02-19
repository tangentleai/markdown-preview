# 优化 WYSIWYG 编辑模式下的编辑区内容滑动显示体验 - 设计文档

## 设计思路

### 1. 布局重构方案

**当前问题**：
- 编辑器设置了 `min-h-[600px] max-h-[600px] overflow-auto`
- 导致内容在固定高度内滚动，与页面滚动冲突

**优化方案**：
- 移除固定高度限制，使用 `min-h-auto` 让内容自然展开
- 移除内部滚动，让浏览器原生滚动接管
- 调整编辑器容器布局，确保与页面其他部分协调

### 2. 实现细节

#### 编辑器组件修改

```tsx
// 在 WysiwygEditor.tsx 中修改
<div
  ref={editorRef}
  contentEditable
  suppressContentEditableWarning
  // 移除以下限制
  // className="markdown-preview min-h-[600px] max-h-[600px] overflow-auto rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
  // 优化后的样式
  className="markdown-preview min-h-[300px] rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
  aria-label="WYSIWYG 编辑区"
  role="textbox"
/>
```

#### 页面布局优化

```tsx
// 在 App.tsx 中优化布局
<main className="max-w-7xl mx-auto pt-2 pb-6 sm:px-6 lg:px-8">
  {editorMode === 'dual-pane' ? (
    // 双栏模式布局
  ) : (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* 标题大纲面板 */}
        <aside className="rounded-lg border border-gray-200 bg-white p-3" aria-label="标题大纲">
          {/* ... */}
        </aside>
        {/* WYSIWYG 编辑器 */}
        <WysiwygEditor
          markdown={markdown}
          setMarkdown={updateMarkdown}
          jumpToHeadingIndex={jumpToHeadingIndex}
          jumpRequestNonce={jumpRequestNonce}
        />
      </div>
    </div>
  )}
</main>
```

### 3. 滚动体验优化

**预期效果**：
- 页面滚动与编辑器内容位置同步
- 光标/选择区域在滚动时保持可见
- 避免滚动过程中的内容跳动

**技术方案**：
- 利用浏览器原生滚动行为
- 确保编辑器内容与页面布局自然融合
- 测试不同场景下的滚动体验

### 4. 响应式适配

**目标**：
- 在桌面端提供最佳编辑体验
- 在移动端确保内容可读性和可编辑性

**实现方案**：
- 使用响应式网格布局
- 根据屏幕尺寸调整编辑器容器
- 优化触摸设备上的交互

## 测试策略

### 功能测试

1. 编辑功能测试
2. 滚动体验测试
3. 响应式适配测试
4. 性能测试

### 测试场景

1. 小篇幅文档编辑
2. 大篇幅文档编辑
3. 包含多种内容类型的文档（文字、代码、图表）
4. 不同设备和屏幕尺寸

## 风险评估

### 潜在风险

1. **内容渲染性能**：大篇幅内容可能影响页面滚动性能
2. **布局稳定性**：某些内容类型可能导致布局问题
3. **浏览器兼容性**：不同浏览器的滚动行为可能有差异

### 应对策略

1. 优化内容渲染，使用虚拟滚动技术（如有需要）
2. 对特殊内容类型进行专门处理
3. 测试主要浏览器的兼容性

## 交付成果

1. 重构后的 WysiwygEditor 组件
2. 优化后的页面布局
3. 测试报告和性能分析
4. 文档更新
