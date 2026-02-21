## 1. 表格悬浮工具栏

- [x] 1.1 实现表格聚焦触发的悬浮工具栏显示、定位与关闭机制 [#R1]
  - ACCEPT: 点击或键盘聚焦表格时，工具栏在表格上方稳定显示；视口边缘自动翻转/偏移避免溢出；点击外部、Esc、切换非表格选区时关闭。
  - TEST: SCOPE: GUI
    - 使用 GUI MCP runbook 验证显示时机、锚点定位、滚动跟随与关闭路径。
  - NOTE: 工具栏按钮 icon 素材需通过 `iconfont-mcp` 工具查找并下载，不使用来源不明的手工素材。
  - BUNDLE (RUN #1): Implemented R1 table floating toolbar show/position/close lifecycle with iconfont-sourced toolbar icons and GUI MCP runbook assets | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-table-editing-experience/run-0001__task-1.1__ref-R1__20260221T164052Z | HOW_TO_RUN: run.sh/run.bat
  - EVIDENCE (RUN #1): Supervisor executed GUI validation runbook and verified toolbar show/position/close behavior plus viewport-safe placement and iconfont asset usage | VALIDATED: bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0001__task-1.1__ref-R1__20260221T164052Z/run.sh (server started at http://127.0.0.1:33100/) + MCP assertions (`[data-table-toolbar="true"]` visible on table focus; `position=fixed`; placement flips to `bottom` when table top space is insufficient; toolbar closes on outside click, `Esc`, and non-table selection) | RESULT: PASS | TIME: 2026-02-21T16:46:21Z | GUI_EVIDENCE: auto_test_openspec/update-wysiwyg-table-editing-experience/run-0001__task-1.1__ref-R1__20260221T164052Z/outputs/screenshots/01-toolbar-visible.png, auto_test_openspec/update-wysiwyg-table-editing-experience/run-0001__task-1.1__ref-R1__20260221T164052Z/outputs/screenshots/02-toolbar-flipped-placement.png, auto_test_openspec/update-wysiwyg-table-editing-experience/run-0001__task-1.1__ref-R1__20260221T164052Z/outputs/screenshots/03-toolbar-closed.png

- [x] 1.2 实现行列网格尺寸调整（含上限与裁剪确认） [#R2]
  - ACCEPT: 支持网格预览与确认设置尺寸；遵守 `200x40` 上限；缩小涉及非空裁剪时出现一次性确认；撤销/重做可恢复。
  - TEST: SCOPE: MIXED
    - CLI: 运行尺寸变更与 Markdown 结构合法性测试（表头/分隔线/列数一致）。
    - GUI: 使用 GUI MCP runbook 验证网格交互、键盘操作（方向键/Enter/Esc）与裁剪确认流程。
  - BUNDLE (RUN #2): Implemented R2 table size grid preview+apply workflow with `200x40` caps, one-time shrink confirmation for non-empty trims, and single-transaction undo/redo recovery, plus MIXED validation assets | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-table-editing-experience/run-0002__task-1.2__ref-R2__20260221T165555Z | HOW_TO_RUN: run.sh/run.bat
  - EVIDENCE (RUN #2): Supervisor executed MIXED validation and confirmed size grid preview/apply workflow, `200x40` cap display, non-empty shrink confirmation, and undo/redo atomic recovery | VALIDATED: bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0002__task-1.2__ref-R2__20260221T165555Z/tests/test_cli_table_resize_r2.sh (exit=0; 3 tests passed); bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0002__task-1.2__ref-R2__20260221T165555Z/run.sh (server started at http://127.0.0.1:33100/) + MCP assertions (toolbar/panel visible; preview updated to `3 x 4` by keyboard; dual-pane markdown kept aligned columns; confirm dialog message `缩小将裁剪表格内容，可撤销；是否继续？` appeared on shrink with non-empty trim; cancel kept 4x3 then accept applied 2x2; `Cmd+Z` restored 4x3 and `Cmd+Shift+Z` reapplied 2x2; `Esc` closed panel) | RESULT: PASS | TIME: 2026-02-21T17:05:15Z | GUI_EVIDENCE: auto_test_openspec/update-wysiwyg-table-editing-experience/run-0002__task-1.2__ref-R2__20260221T165555Z/outputs/screenshots/01-size-panel-open.png, auto_test_openspec/update-wysiwyg-table-editing-experience/run-0002__task-1.2__ref-R2__20260221T165555Z/outputs/screenshots/03-markdown-after-apply.png, auto_test_openspec/update-wysiwyg-table-editing-experience/run-0002__task-1.2__ref-R2__20260221T165555Z/outputs/screenshots/04-undo-restored.png | CLI_EVIDENCE: auto_test_openspec/update-wysiwyg-table-editing-experience/run-0002__task-1.2__ref-R2__20260221T165555Z/outputs/cli-table-resize.log

- [ ] 1.3 实现表格对齐与删除能力及持久化联动 [#R3]
  - ACCEPT: 左/中/右对齐互斥，保存为 `<!-- table:align=... -->` 并可回读；删除表格时同步移除标记并正确恢复焦点；撤销可整体恢复。
  - TEST: SCOPE: MIXED
    - CLI: 覆盖对齐标记解析/序列化与删除联动单元测试。
    - GUI: 使用 GUI MCP runbook 验证按钮状态、删除确认、焦点恢复与回退行为。

## 2. 表格列宽计算与渲染

- [ ] 2.1 实现列宽测量模型与分配算法（min/preferred/max） [#R4]
  - ACCEPT: 基于内容计算每列 min/preferred/max 宽度，按容器预算执行增长/收缩分配，结果稳定且可复现。
  - TEST: SCOPE: CLI
    - 运行纯函数单元测试，覆盖长词/长链接/数字列/极端预算边界与收敛行为。

- [ ] 2.2 接入 `<colgroup>` 写入与重算时机，并保持与溢出滚动兜底协同 [#R5]
  - ACCEPT: 在 WYSIWYG 渲染与尺寸变化后自动更新 `<colgroup>`；当压缩至最小仍超宽时继续使用既有横向滚动容器与提示。
  - TEST: SCOPE: MIXED
    - CLI: 运行 DOM 集成测试，断言 `<colgroup>` 结构、列宽总和与预算关系。
    - GUI: 使用 GUI MCP runbook 验证宽表在小屏下断行与横向滚动兜底共存。

- [ ] 2.3 增强单元格断行策略与长内容可读性 [#R6]
  - ACCEPT: 单元格默认支持 `overflow-wrap:anywhere` 与合理 `word-break`；长链接/代码不再轻易撑爆列，内容可读。
  - TEST: SCOPE: MIXED
    - CLI: 运行样式与类名回归测试，断言关键样式规则存在。
    - GUI: 使用 GUI MCP runbook 在中英文、URL、代码混排场景验证可读性与稳定性。

- [ ] 2.4 实现列拖拽改宽与自动列宽协同策略 [#R7]
  - ACCEPT: 列分隔手柄可拖拽改宽，宽度实时更新并受 `48px-720px` 约束；手动改宽仅在当前会话生效，刷新或重载后回到自动列宽策略。
  - TEST: SCOPE: MIXED
    - CLI: 覆盖手动列宽状态机与 min/max 钳制逻辑单元测试。
    - GUI: 使用 GUI MCP runbook 验证拖拽交互、边界钳制、与自动列宽协同行为及重载后非持久化表现。
