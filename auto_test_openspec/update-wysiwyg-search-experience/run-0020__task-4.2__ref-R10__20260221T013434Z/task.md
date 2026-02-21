# Validation Bundle - update-wysiwyg-search-experience R10 (Run 0020)

- change-id: `update-wysiwyg-search-experience`
- run#: `0020`
- task-id: `4.2`
- ref-id: `R10`
- scope: `GUI`

## Task
Implement task `4.2 [#R10]` retry focused only on icon-button interaction consistency:
- Ensure every target icon button (including close) shows measurable computed-style changes on both hover and active.
- Preserve aria labels, disabled behavior, and regex linkage disabling whole-word.

## How To Run
- Start GUI server (start-server-only):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0020__task-4.2__ref-R10__20260221T013434Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0020__task-4.2__ref-R10__20260221T013434Z\run.bat`
- Execute MCP GUI verification using:
  - `auto_test_openspec/update-wysiwyg-search-experience/run-0020__task-4.2__ref-R10__20260221T013434Z/tests/gui_runbook_r10_all_icon_buttons_hover_active.md`

## Inputs / Outputs
- inputs: none (runbook seeds deterministic content in page)
- expected: all target icon buttons have hoverChanged=true and activeChanged=true in computed-style checks
- outputs:
  - screenshots under `outputs/screenshots/`
  - startup logs under `logs/`

## Acceptance Assertions
- Target buttons: `查找上一个` `查找下一个` `替换当前` `替换全部` `关闭查找替换工具栏` `区分大小写` `查找整个单词`.
- Each enabled target button has computed-style delta on hover and on active.
- aria-label, disabled logic, and regex linkage behavior remain unchanged.

## GUI Hard Rule
- This bundle contains MCP runbook only (no browser automation scripts).
