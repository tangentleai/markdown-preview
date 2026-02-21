# Validation Bundle - update-wysiwyg-search-experience R5 (Run 0009)

- change-id: `update-wysiwyg-search-experience`
- run#: `0009`
- task-id: `2.2`
- ref-id: `R5`
- scope: `GUI`

## Task
Fix R5 under natural expansion layout (no fixed-height editor body and no internal scrolling container).

Required behavior:
- Find navigation applies minimal scroll based on viewport visibility.
- Switching to a visible target does not scroll page.
- Switching to an offscreen target scrolls page.
- All matches keep light highlight; current match keeps strong highlight; active state is unique.

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0009__task-2.2__ref-R5__20260220T163508Z/run.sh`
- Windows: `auto_test_openspec\\update-wysiwyg-search-experience\\run-0009__task-2.2__ref-R5__20260220T163508Z\\run.bat`

GUI scope rule: `run.sh` and `run.bat` are start-server-only.
Execute GUI verification only via MCP runbook:
- `tests/gui_runbook_r5_natural_layout_viewport_scroll.md`

## Inputs / Outputs
- inputs: none
- expected: assertion points in `tests/gui_runbook_r5_natural_layout_viewport_scroll.md`
- outputs: supervisor-captured screenshots/logs under this run folder

## Acceptance Assertions
- Editor body remains naturally expanding (no fixed max-height and no overflow-y internal scrolling).
- Scroll evidence uses viewport/page metric (`window.scrollY`) only.
- Counter follows `0/4 -> 1/4 -> 2/4 -> 3/4`.
- `y2` equals `y1` for visible-hit navigation; `y3` is greater than `y2` for offscreen-hit navigation.
- Highlight count is 4 and active-highlight count is exactly 1.
