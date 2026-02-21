# Change: 优化 WYSIWYG 文档搜索栏可见性与图标提示

## Why
当前文档搜索栏在长文档场景下可能离开可视区域，且退出搜索后状态记忆与按钮语义提示不够一致，影响连续检索效率与可理解性。

## Goals
- 在长文档检索过程中保持搜索栏持续可见，减少往返滚动操作。
- 保证搜索会话关闭后“零污染”重开。
- 统一图标按钮提示体验，兼顾鼠标、键盘与移动端触发方式。

## What Changes
- 将 WYSIWYG 搜索栏改为粘性顶部布局，在页面滚动过程中保持可见。
- 关闭搜索栏时重置输入与模式状态，确保下次进入是干净初始态。
- 将“正则模式”文本按钮替换为 iconfont 图标按钮，并保持可访问名称与现有交互规则。
- 为搜索栏中的 icon 按钮补充统一 hover 提示文案与一致样式反馈。
- Tooltip 除鼠标 hover 外，支持键盘 focus 显示；移动端支持 long-press 触发提示。

## In Scope
- 仅调整 WYSIWYG 编辑器搜索栏区域的布局、状态重置与按钮展示。
- 仅覆盖搜索栏内 icon 按钮的提示行为与样式一致性。
- sticky 顶部基准为编辑器容器顶部，而非页面全局顶部。

## Out of Scope
- 不新增跨文档检索能力。
- 不变更现有匹配算法与替换语义（除按钮展示方式外）。
- 不额外引入 CLI 自动化验证，保持 GUI-only 验证流程。

## Success Metrics
- 退出并重新打开搜索栏后状态污染率为 0（输入值、模式、计数、错误提示与高亮均重置）。
- 长文档滚动场景下，搜索栏持续锚定在编辑器容器顶部可见。
- 图标提示在鼠标 hover、键盘 focus、移动端 long-press 三种触发方式下均可显示。

## Impact
- Affected specs: `wysiwyg-markdown-editor`
- Affected code:
  - `src/components/WysiwygEditor.tsx`
  - `src/index.css`
  - `src/assets/iconfont/*`（若需新增图标资源）

## Rollout / Rollback
- Rollout: 直接替换现有搜索栏交互；保持现有搜索能力与匹配逻辑不变。
- Rollback: 如出现 sticky 或 tooltip 兼容问题，可回退到原搜索栏定位与提示展示方式。

## Risks
- 移动端 long-press 与文本选择手势可能冲突，需要明确触发阈值与阻断策略。
- 不同浏览器对 sticky/tooltip 图层与定位细节存在差异，需要主流浏览器回归。

## Open Questions
- 暂无。
