# Validation Bundle - update-wysiwyg-search-experience R10 (Run 0021)

- change-id: `update-wysiwyg-search-experience`
- run#: `0021`
- task-id: `4.2`
- ref-id: `R10`
- scope: `GUI`

## Task
Implement task `4.2 [#R10]` with deterministic state-driven icon button styles:
- Use React interaction state to drive inline style deltas for hover and active (not pseudo-class priority).
- Cover all target icon buttons including close.
- Keep aria labels, disabled behavior, and regex linkage rules unchanged.

## How To Run
- Start GUI server (start-server-only):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0021__task-4.2__ref-R10__20260221T015610Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0021__task-4.2__ref-R10__20260221T015610Z\run.bat`
- Execute MCP GUI verification using:
  - `auto_test_openspec/update-wysiwyg-search-experience/run-0021__task-4.2__ref-R10__20260221T015610Z/tests/gui_runbook_r10_deterministic_state_styles.md`

## Inputs / Outputs
- inputs: none (runbook seeds deterministic content in page)
- expected: each enabled target icon button has computed-style delta on hover and active
- outputs:
  - screenshots under `outputs/screenshots/`
  - startup logs under `logs/`

## Acceptance Assertions
- Target buttons: `关闭查找替换工具栏` `区分大小写` `查找整个单词` `查找上一个` `查找下一个` `替换当前` `替换全部`.
- For each enabled target button, computed style changes on hover and active for at least one of: `background-color`, `border-color`, `color`.
- aria-label, disabled logic, and regex linkage remain unchanged.

## GUI Hard Rule
- This bundle contains MCP runbook only (no browser automation scripts).
