# Validation Bundle - update-wysiwyg-search-experience R5 (Run 0007)

- change-id: `update-wysiwyg-search-experience`
- run#: `0007`
- task-id: `2.2`
- ref-id: `R5`
- scope: `GUI`

## Task
Implement minimal-scroll hit navigation and dual-layer highlighting for find matches.

Required behavior:
- Switching match only scrolls when the target match is not visible.
- All matches render a light highlight.
- The current match renders a stronger highlight.
- After each switch, exactly one current match is strongly highlighted.

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0007__task-2.2__ref-R5__20260220T160342Z/run.sh`
- Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0007__task-2.2__ref-R5__20260220T160342Z\run.bat`

GUI scope rule: `run.sh` and `run.bat` are start-server-only.
Execute GUI verification only via MCP runbook:
- `tests/gui_runbook_r5_minimal_scroll_dual_highlight.md`

## Inputs / Outputs
- inputs: none
- expected: assertion points in `tests/gui_runbook_r5_minimal_scroll_dual_highlight.md`
- outputs: supervisor-captured screenshots/logs under this run folder

## Acceptance Assertions
- In long content with multiple hits, `查找上一个/查找下一个` does not trigger scrolling when the target hit is already visible.
- In long content, switching to a currently off-screen hit triggers scroll to bring it into view.
- All hits use light highlight style; current hit uses strong highlight style.
- Strong highlight appears on exactly one hit index at any time and updates correctly on every navigation step.
