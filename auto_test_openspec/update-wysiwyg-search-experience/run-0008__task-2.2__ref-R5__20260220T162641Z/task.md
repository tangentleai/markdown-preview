# Validation Bundle - update-wysiwyg-search-experience R5 (Run 0008)

- change-id: `update-wysiwyg-search-experience`
- run#: `0008`
- task-id: `2.2`
- ref-id: `R5`
- scope: `GUI`

## Task
Stabilize minimal-scroll verification for find navigation while preserving dual-layer highlighting.

Required behavior:
- When navigating between visible hits, no scroll is triggered.
- When navigating to an offscreen hit, scroll is triggered.
- All hits keep light highlight and current hit keeps strong highlight.
- Active highlight remains unique after each navigation.

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0008__task-2.2__ref-R5__20260220T162641Z/run.sh`
- Windows: `auto_test_openspec\\update-wysiwyg-search-experience\\run-0008__task-2.2__ref-R5__20260220T162641Z\\run.bat`

GUI scope rule: `run.sh` and `run.bat` are start-server-only.
Execute GUI verification only via MCP runbook:
- `tests/gui_runbook_r5_minimal_scroll_stable_metric.md`

## Inputs / Outputs
- inputs: none
- expected: assertion points in `tests/gui_runbook_r5_minimal_scroll_stable_metric.md`
- outputs: supervisor-captured screenshots/logs under this run folder

## Acceptance Assertions
- Metric for scroll assertions is editor container `scrollTop` (not `window.scrollY`).
- Counter path for 4 hits is `0/4 -> 1/4 -> 2/4 -> 3/4`.
- `s2 === s1` when navigating to another visible hit.
- `s3 > s2` when navigating to an offscreen hit.
- Total highlighted hits stay at 4 and active-highlight count is always exactly 1.
