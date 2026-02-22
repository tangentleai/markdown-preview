# Change: 优化 WYSIWYG 表格编辑体验（悬浮工具栏 + 列宽策略）

## Why
当前 WYSIWYG 表格编辑仍依赖分散操作，尺寸调整、对齐与删除路径不直观；列宽也过度依赖浏览器自动布局，遇到长内容时易出现局部撑爆或空间浪费。需要一次聚焦变更，在不破坏 Markdown 持久化与现有滚动兜底能力的前提下，提升表格可编辑性与可读性。

## What Changes
- 在 WYSIWYG 模式中增加表格悬浮工具栏，提供行列尺寸调整、表格左/中/右对齐、删除表格能力。
- 为尺寸缩小引入“裁剪含内容确认”与撤销/重做原子语义，保证可逆与安全。
- 定义并实现表格对齐注释标记 `<!-- table:align=... -->` 的解析与持久化规则。
- 引入内容驱动的列宽计算与分配策略（min/preferred/max + 增长/收缩分配），并通过 `<colgroup>` 应用到渲染结果。
- 增加列拖拽改宽能力（基于列分隔手柄），支持最小/最大列宽约束，拖拽结果仅在当前会话生效。
- 增强单元格断行与长链接/代码兜底策略，并与既有横向滚动容器与提示机制协同工作。
- 工具栏按钮 icon 素材统一通过 `iconfont-mcp` 工具检索与下载，避免手工拷贝来源不一致。

## Scope
### In Scope
- WYSIWYG 表格工具栏展示、定位、关闭机制与交互行为。
- 表格尺寸调整、对齐标记持久化、删除与焦点恢复。
- 列宽测量、分配、`<colgroup>` 写入、Resize/内容更新重算策略。
- 列拖拽改宽交互（分隔手柄、最小/最大边界、拖拽反馈、会话内状态）。
- 与 `wysiwygTableOverflow` 的协同与样式增强。

### Out of Scope
- 非 WYSIWYG 模式下的表格交互改造。
- Markdown 语法层新增合并单元格等非标准能力。
- 通用表格组件替换或编辑器内核重构。
- 列宽持久化到 Markdown 源（本次明确不做）。

## Confirmed Decisions
- Scope confirmed: include floating toolbar (size/alignment/delete), content-driven auto column widths, and manual column drag resize.
- Backward compatibility: documents without alignment marker default to left alignment; marker is written only after explicit alignment action.
- Alignment marker conflict handling: nearest valid marker before the table wins.
- Shrink confirmation: when non-empty content would be removed, confirmation is required every time.
- Manual column resize persistence: runtime/session only; no markdown persistence format is introduced in this change.
- Manual column resize bounds: min width `48px`, max width `720px`.
- Task verification format: keep `TEST: SCOPE: CLI|GUI|MIXED` + runbook style (no mandatory concrete shell commands in tasks).

## Success Metrics
- Open Question: measurable SLOs/SKPI thresholds (e.g., toolbar show latency P95, auto-size recompute latency P95, large-table interaction smoothness) are not finalized.

## Impact
- Affected specs: `wysiwyg-markdown-editor`
- Affected code:
  - `src/components/WysiwygEditor.tsx`
  - `src/utils/wysiwygTableOverflow.ts`
  - `src/utils/markdownDocumentModel.ts`
  - `src/index.css`
  - 相关单元测试、DOM 集成测试、GUI MCP runbook

## Risks and Mitigations
- 定位抖动或遮挡风险：使用固定定位 + 节流更新 + 视口边界翻转策略。
- 大表重算成本风险：使用采样、缓存与粘性阈值，避免微小尺寸变化频繁重算。
- 缩小裁剪误操作风险：对非空裁剪路径增加一次性确认并保证撤销可恢复。
- 对齐标记兼容风险：解析失败时回退左对齐，不阻断编辑流程。

## Rollout / Rollback
- Rollout: 先落地工具栏行为与持久化，再接入列宽计算与样式增强，最后补齐测试与验收包。
- Rollback: 工具栏与列宽能力保持模块化，可按功能开关或提交粒度独立回退。

## Open Questions
- Open Question: whether double-clicking a column separator should trigger per-column auto-fit by content in this change.
