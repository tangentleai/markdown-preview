# Validation Bundle - update-wysiwyg-search-experience R5 (Run 0007)

- change-id: `update-wysiwyg-search-experience`
- run#: `0007`
- task-id: `2.2`
- ref-id: `R5`
- scope: `GUI`

## Task
Implement minimal-scroll find navigation and dual-layer highlight behavior.

Required behavior:
- Navigate to a match and scroll only when the target match is not visible in the editor viewport.
- Render all matches with a light highlight.
- Render exactly the current match with a strong highlight.
- After each navigation step, highlight state remains uniquely correct for the current index.

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0007__task-2.2__ref-R5__20260220T161832Z/run.sh`
- Windows: `auto_test_openspec\\update-wysiwyg-search-experience\\run-0007__task-2.2__ref-R5__20260220T161832Z\\run.bat`

GUI scope rule: `run.sh` and `run.bat` are start-server-only.
Execute GUI verification only via MCP runbook:
- `tests/gui_runbook_r5_minimal_scroll_dual_highlight.md`

## Inputs / Outputs
- inputs: none
- expected: assertion points in `tests/gui_runbook_r5_minimal_scroll_dual_highlight.md`
- outputs: supervisor-captured screenshots and MCP logs under this run folder

## Acceptance Assertions
- With long editor content, moving from first visible hit to another visible hit does not change editor scroll position.
- Navigating to an off-screen hit changes editor scroll position and reveals the target hit.
- Match highlights always include all hits in light style (`.wysiwyg-find-hit`).
- Exactly one active match index is strongly highlighted (`.wysiwyg-find-hit-active`) after each navigation.
