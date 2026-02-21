# Validation Bundle - update-wysiwyg-search-experience R10 (Run 0018)

- change-id: `update-wysiwyg-search-experience`
- run#: `0018`
- task-id: `4.2`
- ref-id: `R10`
- scope: `GUI`

## Task
Implement task `4.2 [#R10]` fix-only update for icon button interaction feedback:
- Keep iconized toolbar actions unchanged in scope.
- Add explicit class-based hover/active/pressed styles for icon buttons so computed-style deltas are observable.
- Preserve accessibility names and disabled-state behavior.

## How To Run
- Start GUI server (start-server-only):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0018__task-4.2__ref-R10__20260221T012714Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0018__task-4.2__ref-R10__20260221T012714Z\run.bat`
- Execute MCP GUI verification using:
  - `auto_test_openspec/update-wysiwyg-search-experience/run-0018__task-4.2__ref-R10__20260221T012714Z/tests/gui_runbook_r10_icon_buttons_hover_active.md`

## Inputs / Outputs
- inputs: none (runbook seeds deterministic editor content in page)
- expected: icon render/a11y/disabled semantics and computed-style hover/active deltas
- outputs:
  - screenshots under `outputs/screenshots/`
  - startup logs under `logs/`

## Acceptance Assertions
- Required toolbar actions use icon buttons: `查找上一个` `查找下一个` `替换当前` `替换全部` `关闭查找替换工具栏` `区分大小写` `查找整个单词`.
- Buttons expose correct names via `aria-label`.
- Disabled logic remains correct for no-match and regex linkage paths.
- Hover and active states produce observable computed-style deltas (background/border/color).

## GUI Hard Rule
- This bundle contains MCP runbook only (no browser automation scripts).
