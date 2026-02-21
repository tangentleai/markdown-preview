# Validation Bundle - update-wysiwyg-searchbar-sticky-tooltips R1 (Run 0001)

- change-id: `update-wysiwyg-searchbar-sticky-tooltips`
- run#: `0001`
- task-id: `1.1`
- ref-id: `R1`
- scope: `GUI`

## Task
Make the WYSIWYG find toolbar sticky to the editor container top while preserving natural page scrolling.

Required behavior:
- Toolbar remains visible during long document page scrolling.
- Sticky anchor is the editor container context (not a viewport-fixed overlay pattern).
- No fixed editor height constraint is introduced.
- No internal editor scrolling container is introduced.

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0001__task-1.1__ref-R1__20260221T040105Z/run.sh`
- Windows: `auto_test_openspec\update-wysiwyg-searchbar-sticky-tooltips\run-0001__task-1.1__ref-R1__20260221T040105Z\run.bat`

GUI scope hard rule: `run.sh` and `run.bat` are start-server-only.
Run GUI checks only via MCP runbook:
- `tests/gui_runbook_r1_searchbar_sticky.md`

## Inputs / Outputs
- inputs: none
- expected: assertion points in `tests/gui_runbook_r1_searchbar_sticky.md`
- outputs: supervisor-captured screenshots under `outputs/screenshots/`

## Acceptance Assertions
- Find toolbar computed style is `position: sticky` with top offset anchored to editor container layout.
- In long-page scroll state, toolbar remains visible and reachable.
- Editor keeps natural expansion scrolling (`window.scrollY` changes with navigation/scroll).
- Editor and its container do not enforce fixed-height + internal scroll (`max-height`/`overflow-y: auto|scroll`).
