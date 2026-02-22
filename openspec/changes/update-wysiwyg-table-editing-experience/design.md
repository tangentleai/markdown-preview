# WYSIWYG 表格工具栏与列宽优化设计

## Context
本次变更聚焦 WYSIWYG 表格的高频编辑动作与可读性问题，需求来源于 `docs/wysiwyg-table-toolbar.md` 与 `docs/wysiwyg-table-column-widths.md`。目标是在保持现有编辑流程与滚动兜底机制稳定的前提下，提高操作可发现性、持久化一致性和大表格可读性。

## Goals / Non-Goals
- Goals:
  - 提供表格悬浮工具栏，覆盖尺寸调整、对齐和删除三类核心操作。
  - 以 Markdown 注释标记实现表格对齐的可持久化与可回读。
  - 建立内容驱动列宽模型，提升列宽分配质量并降低无效横向滚动。
  - 提供列拖拽改宽能力，支持最小/最大宽度约束并与自适应列宽协同。
  - 与现有 `syncOverflowTableScrollviews` 保持协作，不破坏既有滚动提示行为。
- Non-Goals:
  - 不引入单元格合并、插入/删除单行列等新交互。
  - 不改造非 WYSIWYG 模式或替换 Markdown 解析主链路。
  - 不改变已存在的全局布局与主题体系。

## Assumptions and Confirmed Inputs
- Assumption: without explicit alignment marker, table alignment is treated as left.
- Confirmed: alignment marker is written only after explicit user alignment action.
- Confirmed: nearest valid `<!-- table:align=... -->` marker before a table wins when multiple markers exist.
- Confirmed: shrink confirmation appears every time when non-empty cells would be removed.
- Confirmed: manual column resize width bounds are `48px` to `720px`.
- Confirmed: manual column resize is runtime/session-only and not persisted to markdown.

## Decisions

### 1) 表格悬浮工具栏交互模型
- 触发: 表格选区激活时显示，非表格选区/Esc/外部点击时关闭。
- 定位: 以表格外框顶部为锚点，优先左对齐；溢出时执行翻转或横向修正；滚动与 resize 采用 16-32ms 节流更新。
- 层级: 工具栏 `z-index` 高于表格内容、低于全局弹层，避免遮挡冲突。

### 1.1) Toolbar icon asset sourcing
- Toolbar icon assets MUST be searched and downloaded via `iconfont-mcp`.
- Suggested process: use icon search first, confirm style consistency (line/fill), then download selected SVG assets into project icon directory.
- Icon source and selected names SHOULD be recorded in task implementation notes or validation bundle logs for traceability.

### 2) 尺寸调整规则
- 网格预览支持 hover 与键盘导航（方向键/Enter/Esc）。
- 扩容: 从表尾追加空行/空列，保持合法 Markdown 表结构。
- 缩容: 从表尾裁剪；若裁剪区域含非空内容，执行一次性确认后再提交。
- 事务语义: 一次尺寸变更作为单个撤销/重做原子操作。

### 3) 对齐与删除持久化
- 对齐状态通过表格前置注释 `<!-- table:align=left|center|right -->` 持久化。
- 解析阶段仅将标记绑定到其后第一个表格块，编辑视图隐藏标记文本。
- 删除表格时同时删除关联对齐标记；删除后焦点恢复到前一可编辑块末尾，无前置块时创建空段落。

### 4) 列宽模型与分配策略
- 每列计算 `min-content / preferred / max-content` 三个宽度。
- 初始化 `w_i = clamp(preferred_i, min_i, max_i)`。
- 若总宽低于预算，按增长潜力权重分配余量；若总宽超预算，按可压缩空间比例回收。
- 收缩到 `min` 仍超预算时，依赖增强断词与既有横向滚动容器兜底。

### 5) 渲染接入与性能策略
- 在 `src/utils/wysiwygTableOverflow.ts` 扩展 `autoSizeTables(root, options)`，负责测量、分配与 `<colgroup>` 更新。
- 在 WYSIWYG 首次渲染、markdown 更新、容器尺寸变化后调用 `autoSizeTables`，并与 `syncOverflowTableScrollviews` 按顺序协作。
- `measureText` 使用缓存（fontKey + text），每列抽样上限控制在默认 40，配合粘性阈值减少抖动。

### 6) 列拖拽改宽交互
- 在表头列分隔位置渲染可命中的拖拽手柄，拖拽时实时更新目标列宽并重建 `<colgroup>`。
- 拖拽只影响当前会话中的渲染态宽度，不写入 markdown 注释或其他持久化存储。
- 宽度约束为 `min=48px`、`max=720px`，超限时钳制并维持拖拽连续反馈。
- 与自适应算法协同原则:
  - 手动拖拽后，当前表格进入“手动宽度优先”状态。
  - 触发全量重算时，未被手动修改的列继续按 auto-size 计算；已手动修改列保持用户宽度（仍受 min/max 约束）。
  - 在文档重载或模式重建后，因不持久化，回到 auto-size 默认行为。

## Risks / Trade-offs
- 测量精度与平台字体差异: 通过整数像素与重算阈值降低视觉抖动。
- 极大表格重算耗时: 通过抽样、缓存与节流控制主线程开销。
- 标记格式被手改破坏: 解析失败时回退左对齐，不阻断编辑。
- 手动拖拽与自动分配冲突: 通过“手动列优先、其余列自适应”的策略减少反复跳宽。

## Testing and Validation
- CLI: 纯函数单测覆盖列宽计算与分配边界；序列化单测覆盖对齐标记与尺寸变更合法性。
- DOM 集成: 校验 `<colgroup>` 生成、列宽预算一致性与重算条件。
- GUI MCP: 验证工具栏显示/关闭、网格键盘交互、删除焦点恢复、对齐状态回读、宽表兜底体验。

## Open Questions
- Open Question: 列宽抽样上限是否按列固定 40，还是按表规模动态调整。
- Open Question: 缩小裁剪确认是否支持“本次会话不再提示”延后迭代。
- Open Question: 是否在本次支持双击列分隔线触发“按内容自动适配该列”。

## Appendix: Original Draft
原始草案在保留本文件结构基础上已合并进上述章节，本次未移除既有意图，仅补充访谈确认决策与列拖拽设计细节。
