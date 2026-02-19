# Validation Bundle - Task 2.1 [#R4]

- change-id: `add-typora-wysiwyg-editor`
- run: `0005`
- task-id: `2.1`
- ref-id: `R4`
- scope: `MIXED`

## Task

实现块级输入规则（`#`、`-`、`1.`、`>`、代码块），要求行首触发自动结构化，并支持一次撤销回到触发前状态。

## Scope Split

- GUI: 通过 MCP runbook 验证行首触发结构转换、光标保持可输入、一次撤销可回退。
- CLI: 通过 jest 测试验证事务日志与撤销栈行为，并回归已完成功能不受影响。

## How to run

- start server only (GUI/MIXED hard rule):
  - macOS/Linux: `bash auto_test_openspec/add-typora-wysiwyg-editor/run-0005__task-2.1__ref-R4__20260219T022608Z/run.sh`
  - Windows: `auto_test_openspec\add-typora-wysiwyg-editor\run-0005__task-2.1__ref-R4__20260219T022608Z\run.bat`
- CLI checks (run separately):
  - macOS/Linux: `bash auto_test_openspec/add-typora-wysiwyg-editor/run-0005__task-2.1__ref-R4__20260219T022608Z/tests/test_cli_block_input_rules.sh`
  - Windows: `auto_test_openspec\add-typora-wysiwyg-editor\run-0005__task-2.1__ref-R4__20260219T022608Z\tests\test_cli_block_input_rules.bat`

## Inputs / Outputs

- Inputs: none (tests use in-repo fixtures)
- Outputs:
  - CLI console output from jest suites
  - `logs/worker_startup.txt` startup ritual trace
  - GUI evidence to be captured by Supervisor under `outputs/screenshots/` during MCP execution

## Acceptance Criteria (machine-decidable anchors)

- CLI checks exit code is `0` and include passing suites:
  - `src/__tests__/wysiwygBlockInputRules.test.ts` (transaction log + undo stack)
  - `src/__tests__/App.test.tsx` (cursor and transform behavior)
  - `src/__tests__/markdownDocumentModel.test.ts` (previous completed behavior remains unchanged)
- GUI MCP assertions (via runbook):
  - line-start markers trigger expected block transforms
  - cursor remains in transformed editable block and can continue typing
  - single undo (`Ctrl/Cmd+Z`) restores pre-transform marker state in one step
- `run.sh` / `run.bat` are start-server-only and print `http://127.0.0.1:33100/`

## GUI MCP runbook entrypoint

- `tests/gui_runbook_block_input_rules.md`
