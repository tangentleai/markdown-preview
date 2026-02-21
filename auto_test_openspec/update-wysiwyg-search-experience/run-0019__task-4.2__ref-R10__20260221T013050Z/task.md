# Validation Bundle - update-wysiwyg-search-experience R10 (Run 0019)

- change-id: `update-wysiwyg-search-experience`
- run#: `0019`
- task-id: `4.2`
- ref-id: `R10`
- scope: `GUI`

## Task
Implement task `4.2 [#R10]` fix-only retry for icon button interaction states:
- Keep icon buttons and aria labels unchanged.
- Keep disabled logic and regex linkage behavior unchanged.
- Ensure enabled icon buttons expose observable computed-style deltas on `:hover` and `:active` for `background-color` / `border-color` / `color`.

## How To Run
- Start GUI server (start-server-only):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0019__task-4.2__ref-R10__20260221T013050Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0019__task-4.2__ref-R10__20260221T013050Z\run.bat`
- Execute MCP GUI verification using:
  - `auto_test_openspec/update-wysiwyg-search-experience/run-0019__task-4.2__ref-R10__20260221T013050Z/tests/gui_runbook_r10_icon_buttons_computed_delta.md`

## Inputs / Outputs
- inputs: none (runbook seeds deterministic content in page)
- expected: icon render + accessible labels + disabled logic + measurable computed-style deltas
- outputs:
  - screenshots under `outputs/screenshots/`
  - startup logs under `logs/`

## Acceptance Assertions
- Required icon buttons: `查找上一个` `查找下一个` `替换当前` `替换全部` `关闭查找替换工具栏` `区分大小写` `查找整个单词`.
- Accessibility names remain correct via `aria-label`.
- Disabled logic remains correct for no-match and regex linkage.
- On enabled icon buttons, at least one computed property changes on hover and active.

## GUI Hard Rule
- This bundle contains MCP runbook only (no browser automation scripts).
