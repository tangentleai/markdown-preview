# Validation Bundle - update-wysiwyg-search-experience R4 (Run 0006)

- change-id: `update-wysiwyg-search-experience`
- run#: `0006`
- task-id: `2.1`
- ref-id: `R4`
- scope: `GUI`

## Task
Add a `查找上一个` action and make previous/next search navigation bidirectional with wrap-around.

Required behavior:
- `查找下一个` advances to the next match and wraps from last to first.
- `查找上一个` moves to the previous match and wraps from first to last.
- Counter direction is consistent with navigation and does not skip matches.

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0006__task-2.1__ref-R4__20260220T154509Z/run.sh`
- Windows: `auto_test_openspec\\update-wysiwyg-search-experience\\run-0006__task-2.1__ref-R4__20260220T154509Z\\run.bat`

GUI scope rule: `run.sh` and `run.bat` are start-server-only.
Execute GUI verification only via MCP runbook:
- `tests/gui_runbook_r4_bidirectional_navigation.md`

## Inputs / Outputs
- inputs: none
- expected: assertion points in `tests/gui_runbook_r4_bidirectional_navigation.md`
- outputs: supervisor-captured screenshots/logs under this run folder

## Acceptance Assertions
- Given text with 2 matches, clicking `查找下一个` yields counter path `0/2 -> 1/2 -> 2/2 -> 1/2`.
- From `1/2`, clicking `查找上一个` wraps to `2/2`.
- From `2/2`, clicking `查找上一个` moves to `1/2`.
- Each click changes by exactly one index step in the intended direction.
