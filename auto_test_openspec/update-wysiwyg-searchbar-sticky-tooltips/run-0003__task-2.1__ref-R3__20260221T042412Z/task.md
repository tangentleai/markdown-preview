# Validation Bundle - update-wysiwyg-searchbar-sticky-tooltips R3 (Run 0003)

- change-id: `update-wysiwyg-searchbar-sticky-tooltips`
- run#: `0003`
- task-id: `2.1`
- ref-id: `R3`
- scope: `GUI`

## Task
Replace the find-toolbar regex text button with an iconfont icon button while preserving regex toggle semantics.

Required behavior:
- The toolbar no longer renders visible text `正则模式` as button content.
- The regex control is rendered as an icon button.
- The control keeps accessibility name `正则模式` via `aria-label`.
- Click/pressed-state behavior stays equivalent to the previous regex toggle (`aria-pressed` toggles true/false).

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0003__task-2.1__ref-R3__20260221T042412Z/run.sh`
- Windows: `auto_test_openspec\update-wysiwyg-searchbar-sticky-tooltips\run-0003__task-2.1__ref-R3__20260221T042412Z\run.bat`

GUI scope hard rule: `run.sh` and `run.bat` are start-server-only.
Run GUI checks only via MCP runbook:
- `tests/gui_runbook_r3_regex_icon_button.md`

## Inputs / Outputs
- inputs: none
- expected: assertion points in `tests/gui_runbook_r3_regex_icon_button.md`
- outputs: supervisor-captured screenshots under `outputs/screenshots/`

## Acceptance Assertions
- Regex control is an icon button and does not display visible text content `正则模式`.
- Regex control remains discoverable by accessible name `正则模式`.
- Clicking regex control toggles `aria-pressed` and keeps original regex mode behavior.
