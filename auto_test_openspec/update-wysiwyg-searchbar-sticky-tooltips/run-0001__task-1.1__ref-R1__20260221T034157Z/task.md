# Validation Bundle - update-wysiwyg-searchbar-sticky-tooltips R1

- change-id: `update-wysiwyg-searchbar-sticky-tooltips`
- run#: `0001`
- task-id: `1.1`
- ref-id: `R1`
- scope: `GUI`

## Task
将 WYSIWYG 查找栏改为相对编辑器容器顶部的 sticky 布局：
- 页面长文档滚动时，查找栏在编辑器容器顶部保持可见。
- 不引入编辑区固定高度。
- 不引入编辑区内部滚动容器。

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0001__task-1.1__ref-R1__20260221T034157Z/run.sh`
- Windows: `auto_test_openspec\update-wysiwyg-searchbar-sticky-tooltips\run-0001__task-1.1__ref-R1__20260221T034157Z\run.bat`

GUI scope hard rule: `run.sh` / `run.bat` are start-server-only.

MCP-only runbook:
- `tests/gui_runbook_r1_searchbar_sticky.md`

## Inputs / Outputs
- inputs: none
- expected: GUI assertions defined in MCP runbook
- outputs: supervisor should save GUI screenshots to `outputs/screenshots/`

## Acceptance Assertions
- 查找栏显示时为 sticky，锚点相对编辑器容器顶部（非 viewport fixed 覆盖层）。
- 长文档滚动后查找栏仍可见。
- 编辑区仍然自然随页面展开滚动。
- 无固定高度约束（例如 `height`/`max-height` 强制编辑区滚动）。
- 无内部滚动容器方案（例如通过 `overflow-y: auto` 让编辑器独立滚动）。
