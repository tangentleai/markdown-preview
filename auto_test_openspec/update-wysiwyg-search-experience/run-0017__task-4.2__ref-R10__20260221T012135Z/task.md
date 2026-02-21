# Validation Bundle - update-wysiwyg-search-experience R10 (Run 0017)

- change-id: `update-wysiwyg-search-experience`
- run#: `0017`
- task-id: `4.2`
- ref-id: `R10`
- scope: `GUI`

## Task
Implement task `4.2 [#R10]` iconfont button upgrade only:
- Replace key search toolbar actions with iconfont icons.
- Covered actions: `查找上一个`, `查找下一个`, `替换当前`, `替换全部`, `关闭查找替换工具栏`, `区分大小写`, `查找整个单词`.
- Keep accessible button names, disabled state behavior, and consistent hover/active feedback.

## How To Run
- Start GUI server (start-server-only):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0017__task-4.2__ref-R10__20260221T012135Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0017__task-4.2__ref-R10__20260221T012135Z\run.bat`
- Execute MCP GUI verification using:
  - `auto_test_openspec/update-wysiwyg-search-experience/run-0017__task-4.2__ref-R10__20260221T012135Z/tests/gui_runbook_r10_icon_buttons.md`

## Inputs / Outputs
- inputs: none (runbook seeds deterministic editor content in page)
- expected: icon rendering and interaction assertions documented in runbook
- outputs:
  - screenshots under `outputs/screenshots/`
  - startup logs under `logs/`

## Acceptance Assertions
- Listed search toolbar actions render icon buttons from iconfont assets.
- Buttons expose correct accessibility names via `aria-label`.
- `查找上一个`/`查找下一个`/`替换当前`/`替换全部` remain disabled when no matches.
- Icon buttons keep visible hover and active feedback.
- `查找整个单词` button is disabled while regex mode is enabled.

## GUI Hard Rule
- This bundle contains MCP runbook only (no browser automation scripts).
