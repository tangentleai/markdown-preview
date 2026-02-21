# Task Validation Bundle (RUN #7)

- change-id: `update-wysiwyg-rendering-and-ux`
- run#: `0007`
- task-id: `2.3`
- ref-id: `R7`
- scope: `GUI`

## Task Target

Implement only task `2.3 [#R7]`: enable automatic wrapping for long outline titles in the left heading panel (up to 3 lines), improve multi-line readability (line-height, spacing, click area), and keep heading-level indentation visually clear.

## How To Run

- macOS/Linux (start service only):
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0007__task-2.3__ref-R7__20260221T090742Z/run.sh`
- Windows (start service only):
  - `auto_test_openspec\update-wysiwyg-rendering-and-ux\run-0007__task-2.3__ref-R7__20260221T090742Z\run.bat`

## Test Assets

- GUI MCP runbook: `tests/gui_runbook_outline_wrap_readability.md`
- startup log: `logs/worker_startup.txt`
- GUI evidence output target: `outputs/screenshots/`

## Inputs / Outputs

- Inputs:
  - Long/multi-level heading markdown sample in `tests/gui_runbook_outline_wrap_readability.md`.
- Outputs:
  - Supervisor-captured screenshots under `outputs/screenshots/`.
  - Optional MCP notes under `logs/`.

## Expected Results (MCP Assertions)

- Long outline title button text wraps automatically (not single-line truncation).
- Long title button text is clamped to at most 3 lines (`-webkit-line-clamp: 3`).
- Wrapped title keeps readable line-height and click area (`py-1.5`, `leading-5`).
- Heading indentation remains clear by level (H1/H2/H3 buttons show progressively larger left padding).
- Clicking a nested heading outline item still jumps to the corresponding heading in the WYSIWYG editor.

## Hard Rules

- `run.sh` and `run.bat` are start-server only for GUI scope.
- GUI verification must be executed through MCP runbook `tests/gui_runbook_outline_wrap_readability.md`.
- No executable browser automation scripts are included in this bundle.
