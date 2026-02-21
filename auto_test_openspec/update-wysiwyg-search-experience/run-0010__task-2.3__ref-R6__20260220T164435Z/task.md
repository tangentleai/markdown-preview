# Validation Bundle - update-wysiwyg-search-experience R6 (Run 0010)

- change-id: `update-wysiwyg-search-experience`
- run#: `0010`
- task-id: `2.3`
- ref-id: `R6`
- scope: `GUI`

## Task
Implement task `2.3 [#R6]` only:
- When there is no match, the counter shows `0/N`.
- Buttons are disabled when there is no match:
  - `查找上一个`
  - `查找下一个`
  - `替换当前`
  - `全部替换`

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0010__task-2.3__ref-R6__20260220T164435Z/run.sh`
- Windows: `auto_test_openspec\\update-wysiwyg-search-experience\\run-0010__task-2.3__ref-R6__20260220T164435Z\\run.bat`

GUI scope rule: `run.sh` and `run.bat` are start-server-only.
Execute GUI verification only via MCP runbook:
- `tests/gui_runbook_r6_zero_over_n_and_disabled_actions.md`

## Inputs / Outputs
- inputs: none
- expected: assertion points in `tests/gui_runbook_r6_zero_over_n_and_disabled_actions.md`
- outputs: supervisor-captured screenshots/logs under this run folder

## Acceptance Assertions
- With no matches for current query, counter text is `匹配：0/N`.
- With no matches, `查找上一个` is disabled.
- With no matches, `查找下一个` is disabled.
- With no matches, `替换当前` is disabled.
- With no matches, `全部替换` is disabled.
