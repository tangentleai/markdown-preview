# Validation Bundle - update-wysiwyg-search-experience R2 (Run 0003)

- change-id: `update-wysiwyg-search-experience`
- run#: `0003`
- task-id: `1.2`
- ref-id: `R2`
- scope: `GUI`

## Task
Fix Enter-based next-match navigation stability in WYSIWYG find input:
- Enter in find input triggers `find next`.
- Consecutive Enter presses advance index sequentially.
- After last match, Enter wraps to first match.
- Counter remains aligned with active index on every step.

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0003__task-1.2__ref-R2__20260220T151504Z/run.sh`
- Windows: `auto_test_openspec\\update-wysiwyg-search-experience\\run-0003__task-1.2__ref-R2__20260220T151504Z\\run.bat`

GUI scope rule: `run.sh` and `run.bat` are start-server-only.
Execute GUI verification via MCP runbook:
- `tests/gui_runbook_r2_enter_next_wrap_fix.md`

## Inputs / Outputs
- inputs: none
- expected: GUI assertion points in runbook
- outputs: supervisor-captured screenshots/log pointers under this run folder

## Acceptance Assertions
- With content `alpha beta alpha gamma` and query `alpha`, counter path under consecutive Enter from find input is:
  - `匹配：0` (or `0/2` unresolved state)
  - `匹配：1/2`
  - `匹配：2/2`
  - `匹配：1/2` (wrap)
- Enter navigation does not collapse match set from `2` to `1` unexpectedly.
