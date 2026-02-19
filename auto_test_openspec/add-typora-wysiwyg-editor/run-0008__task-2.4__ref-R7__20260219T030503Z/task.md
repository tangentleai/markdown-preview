# Validation Bundle - Task 2.4 [#R7]

- change-id: `add-typora-wysiwyg-editor`
- run: `0008`
- task-id: `2.4`
- ref-id: `R7`
- scope: `MIXED`

## Task

增加 IME 组合输入保护与撤销/重做稳定性，确保中文输入法组合阶段不会误触发结构化规则，且结构转换进入同一套可逆事务历史（Undo/Redo）。

## How to run

- start server only (GUI/MIXED hard rule):
  - macOS/Linux: `bash auto_test_openspec/add-typora-wysiwyg-editor/run-0008__task-2.4__ref-R7__20260219T030503Z/run.sh`
  - Windows: `auto_test_openspec\add-typora-wysiwyg-editor\run-0008__task-2.4__ref-R7__20260219T030503Z\run.bat`
- CLI checks (separate command; not in run.sh/run.bat):
  - macOS/Linux: `bash auto_test_openspec/add-typora-wysiwyg-editor/run-0008__task-2.4__ref-R7__20260219T030503Z/tests/test_cli_transaction_boundaries.sh`
  - Windows: `auto_test_openspec\add-typora-wysiwyg-editor\run-0008__task-2.4__ref-R7__20260219T030503Z\tests\test_cli_transaction_boundaries.bat`

## Inputs / Outputs

- Inputs: none (Jest test fixtures in repo + GUI MCP actions)
- Outputs:
  - `logs/worker_startup.txt` startup ritual record
  - CLI test output: `outputs/cli-transaction-boundary.txt`
  - GUI evidence (Supervisor): `outputs/screenshots/`

## Acceptance Criteria (machine-decidable anchors)

- start script constraints:
  - `run.sh` / `run.bat` only start dev server and print `http://127.0.0.1:33100/`
- CLI transaction-boundary checks must pass:
  - IME composition (isComposing/session/keyCode=229) is treated as composing and blocks structural triggers
  - structural history supports undo and redo stacks
  - editor-level redo (`Ctrl/Cmd+Shift+Z`) re-applies structural transform after undo
  - heading-backspace structural conversion is included in undo/redo history
- GUI MCP checks must pass via runbook:
  - Chinese IME composition typing does not trigger `#`/list/etc structural conversion unexpectedly
  - shortcut undo/redo covers structural transforms and returns to expected visual states
  - existing block/inline behavior remains available after above operations

## GUI MCP runbook entrypoint

- `tests/gui_runbook_ime_undo_redo.md`
