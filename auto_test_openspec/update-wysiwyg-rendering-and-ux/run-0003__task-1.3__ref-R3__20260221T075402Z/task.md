# Task Validation Bundle (RUN #3)

- change-id: `update-wysiwyg-rendering-and-ux`
- run#: `0003`
- task-id: `1.3`
- ref-id: `R3`
- scope: `GUI`

## Task Target

Implement only task `1.3 [#R3]`: click a rendered math formula to mount a Monaco editor above it, keep formula preview synchronized while typing, enforce single active formula Monaco instance, and dismiss cleanly on outside click / Escape / mode switch with markdown writeback.

## How To Run

- macOS/Linux (GUI service only):
  - `bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0003__task-1.3__ref-R3__20260221T075402Z/run.sh`
- Windows (GUI service only):
  - `auto_test_openspec\update-wysiwyg-rendering-and-ux\run-0003__task-1.3__ref-R3__20260221T075402Z\run.bat`

## Test Assets

- GUI MCP runbook: `tests/gui_runbook_math_monaco_mount.md`
- startup log: `logs/worker_startup.txt`
- GUI evidence target directory (Supervisor writes): `outputs/screenshots/`

## Inputs / Outputs

- Inputs: markdown typed through MCP runbook into dual-pane textarea.
- Outputs:
  - GUI screenshots and optional console/network artifacts under `outputs/`.
  - Supervisor execution logs under `logs/`.

## Expected Results (MCP Assertions)

- Click a `.math-block` mounts one `[data-math-editor="true"]` node directly above the formula block.
- While editing `数学公式编辑区`, formula DOM (`.math-block[data-tex]`) updates in near real-time (debounce acceptable).
- Clicking a second formula keeps exactly one `[data-math-editor="true"]` in the editor.
- Dismiss paths are correct:
  - outside click removes `[data-math-editor="true"]` and keeps latest formula text in markdown;
  - Escape removes `[data-math-editor="true"]` and keeps latest formula text in markdown;
  - mode switch (`双栏模式`) removes editor and markdown retains latest formula text.

## Hard Rules

- `run.sh` / `run.bat` are start-server only for GUI scope.
- GUI verification must be executed only via MCP runbook `tests/gui_runbook_math_monaco_mount.md`.
- No executable browser automation scripts are included in this bundle.
