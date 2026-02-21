# Validation Bundle - update-wysiwyg-searchbar-sticky-tooltips R2 (Run 0002)

- change-id: `update-wysiwyg-searchbar-sticky-tooltips`
- run#: `0002`
- task-id: `1.2`
- ref-id: `R2`
- scope: `GUI`

## Task
Reset WYSIWYG find/replace toolbar state when closing the toolbar (close button and Esc).

Required reset behavior after close and reopen:
- Find query and replace query inputs return to empty.
- Mode toggles return to default: case-sensitive off, whole-word off, regex off.
- Match index/count return to default (`0/N`).
- Regex error message is cleared.
- Existing find highlights are cleared.
- Toolbar mode returns to find mode (replace input hidden).

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0002__task-1.2__ref-R2__20260221T041359Z/run.sh`
- Windows: `auto_test_openspec\update-wysiwyg-searchbar-sticky-tooltips\run-0002__task-1.2__ref-R2__20260221T041359Z\run.bat`

GUI scope hard rule: `run.sh` and `run.bat` are start-server-only.
Run GUI checks only via MCP runbook:
- `tests/gui_runbook_r2_searchbar_reset.md`

## Inputs / Outputs
- inputs: none
- expected: assertion points in `tests/gui_runbook_r2_searchbar_reset.md`
- outputs: supervisor-captured screenshots under `outputs/screenshots/`

## Acceptance Assertions
- Close using toolbar close button, then reopen: all find/replace state is reset to default.
- Close using Esc from toolbar input/editor focus, then reopen: all find/replace state is reset to default.
- No prior query, toggle pressed state, regex error, match counter/index, or highlight persists after reopen.
