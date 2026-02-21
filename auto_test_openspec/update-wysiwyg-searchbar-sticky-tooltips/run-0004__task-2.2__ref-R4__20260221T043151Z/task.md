# Validation Bundle - update-wysiwyg-searchbar-sticky-tooltips R4 (Run 0004)

- change-id: `update-wysiwyg-searchbar-sticky-tooltips`
- run#: `0004`
- task-id: `2.2`
- ref-id: `R4`
- scope: `GUI`

## Task
Add tooltips for all search-toolbar icon buttons with consistent visual style.

Required behavior:
- All icon buttons in the find/replace toolbar show tooltip text on mouse hover.
- All icon buttons in the find/replace toolbar show tooltip text on keyboard focus.
- Mobile/touch interaction supports long-press tooltip reveal.
- Tooltip UI is visually consistent (same background color, border radius, and font size).

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-searchbar-sticky-tooltips/run-0004__task-2.2__ref-R4__20260221T043151Z/run.sh`
- Windows: `auto_test_openspec\update-wysiwyg-searchbar-sticky-tooltips\run-0004__task-2.2__ref-R4__20260221T043151Z\run.bat`

GUI scope hard rule: `run.sh` and `run.bat` are start-server-only.

Run GUI checks only via MCP runbook:
- `tests/gui_runbook_r4_icon_tooltips.md`

## Inputs / Outputs
- inputs: none
- expected: assertion points in `tests/gui_runbook_r4_icon_tooltips.md`
- outputs:
  - supervisor-captured screenshots under `outputs/screenshots/`
  - optional MCP observation notes under `logs/`

## Acceptance Assertions
- Hovering each icon button shows the matching tooltip text.
- Focusing each icon button via keyboard shows the matching tooltip text.
- Long-press on touch viewport reveals tooltip for the pressed icon button.
- Tooltip element always uses `.wysiwyg-find-icon-tooltip` for shared style tokens.
