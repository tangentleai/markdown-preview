# Validation Bundle - update-wysiwyg-search-experience R2

- change-id: `update-wysiwyg-search-experience`
- run#: `0002`
- task-id: `1.2`
- ref-id: `R2`
- scope: `GUI`

## Task
Implement Enter-driven next-match navigation from the find input in WYSIWYG mode:
- Pressing `Enter` in find input performs `find next`.
- Repeated `Enter` continues advancing match index.
- When last match is reached, next `Enter` wraps to first match.
- Counter display remains consistent with active match index.

## How To Run
- macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0002__task-1.2__ref-R2__20260220T150536Z/run.sh`
- Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0002__task-1.2__ref-R2__20260220T150536Z\run.bat`

GUI scope rule: `run.sh` / `run.bat` are start-server-only.
Execute MCP-only GUI verification via:
- `tests/gui_runbook_r2_enter_next_wrap.md`

## Inputs / Outputs
- inputs: none
- expected: GUI assertions defined in the runbook
- outputs: supervisor-captured screenshots/log pointers under this run folder

## Acceptance Assertions
- In toolbar find input (`aria-label="查找文本"`), pressing `Enter` triggers same behavior as clicking `查找下一个`.
- For content containing two+ matches, consecutive Enter presses update counter from `1/N` to `2/N` ...
- After reaching `N/N`, pressing Enter again wraps to `1/N`.
- Counter (`aria-label="查找结果计数"`) always matches active hit index after each Enter.
