# Task Validation Bundle (RUN #11)

- change-id: `update-wysiwyg-rendering-and-ux`
- run#: `0011`
- task-id: `3.3`
- ref-id: `R10`
- scope: `MIXED`

## Task Target

Implement only task `3.3 [#R10]`: keep responsive behavior consistent across desktop/mobile with mobile outline drawer, remove blue editing highlight frame, and replace it with a light shadow focus style while preserving focus recognizability.

## How To Run

- macOS/Linux (start service only):
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0011__task-3.3__ref-R10__20260221T095748Z/run.sh`
- Windows (start service only):
  - `auto_test_openspec\update-wysiwyg-rendering-and-ux\run-0011__task-3.3__ref-R10__20260221T095748Z\run.bat`
- CLI validation (separate):
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0011__task-3.3__ref-R10__20260221T095748Z/tests/test_cli_r10_responsive_focus.sh`

## Test Assets

- CLI script: `tests/test_cli_r10_responsive_focus.sh`
- GUI MCP runbook: `tests/gui_runbook_r10_responsive_focus.md`
- startup log: `logs/worker_startup.txt`
- CLI output log target: `outputs/cli-r10-regression.log`
- GUI evidence output target: `outputs/screenshots/`

## Inputs / Outputs

- Inputs:
  - Source files under `src/` are the verification input for CLI assertions.
  - App runtime UI under `http://127.0.0.1:33100/` is the verification input for GUI assertions.
- Outputs:
  - CLI writes assertion transcript to `outputs/cli-r10-regression.log`.
  - Supervisor captures GUI screenshots to `outputs/screenshots/`.

## Expected Results (Machine-Decidable + MCP Assertions)

- CLI:
  - `src/App.tsx` contains responsive breakpoint layout class `lg:grid-cols-[var(--outline-width)_10px_minmax(0,1fr)]`.
  - `src/App.tsx` contains mobile drawer entry button (`aria-label="打开移动端大纲抽屉"` with `lg:hidden`).
  - `src/App.tsx` contains mobile drawer container (`aria-label="移动端标题大纲抽屉"`).
  - `src/components/WysiwygEditor.tsx` contains new light-shadow focus class.
  - `src/components/WysiwygEditor.tsx` does not contain `focus:ring-blue-500`.
- GUI:
  - Desktop breakpoint keeps outline + editor linked layout behavior and centered editor container.
  - Mobile breakpoint uses drawer-style outline entry and close interactions.
  - Editor focus no longer shows blue ring; focus remains visually identifiable via light shadow.

## Hard Rules

- `run.sh` and `run.bat` are start-server only for MIXED scope.
- GUI verification must be executed through MCP runbook `tests/gui_runbook_r10_responsive_focus.md`.
- No executable browser automation scripts are included in this bundle.
