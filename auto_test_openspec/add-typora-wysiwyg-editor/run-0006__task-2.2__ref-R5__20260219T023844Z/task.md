# Validation Bundle - Task 2.2 [#R5]

- change-id: `add-typora-wysiwyg-editor`
- run: `0006`
- task-id: `2.2`
- ref-id: `R5`
- scope: `MIXED`

## Task

实现行内样式规则（加粗、斜体、行内代码、链接），要求在闭合触发后立即渲染对应样式，并在样式边界附近保持光标移动稳定。

## Scope Split

- CLI: 通过 jest 校验行内规则匹配（mark/node 变化）和组件层闭合触发后的 DOM 结果。
- GUI: 通过 MCP runbook 校验样式渲染结果与边界附近光标移动行为。

## How to run

- start server only (GUI/MIXED hard rule):
  - macOS/Linux: `bash auto_test_openspec/add-typora-wysiwyg-editor/run-0006__task-2.2__ref-R5__20260219T023844Z/run.sh`
  - Windows: `auto_test_openspec\add-typora-wysiwyg-editor\run-0006__task-2.2__ref-R5__20260219T023844Z\run.bat`
- CLI checks (run separately):
  - macOS/Linux: `bash auto_test_openspec/add-typora-wysiwyg-editor/run-0006__task-2.2__ref-R5__20260219T023844Z/tests/test_cli_inline_style_rules.sh`
  - Windows: `auto_test_openspec\add-typora-wysiwyg-editor\run-0006__task-2.2__ref-R5__20260219T023844Z\tests\test_cli_inline_style_rules.bat`

## Inputs / Outputs

- Inputs: none (tests use in-repo fixtures and component DOM states)
- Outputs:
  - CLI console output from jest suites
  - `logs/worker_startup.txt` startup ritual trace
  - GUI evidence captured by Supervisor under `outputs/screenshots/`

## Acceptance Criteria (machine-decidable anchors)

- CLI checks exit code is `0` and include passing suites:
  - `src/__tests__/wysiwygInlineStyleRules.test.ts` (行内规则匹配)
  - `src/__tests__/App.test.tsx` (闭合触发后渲染与光标保留)
  - `src/__tests__/wysiwygBlockInputRules.test.ts` and `src/__tests__/markdownDocumentModel.test.ts` (已完成行为回归不受影响)
- GUI MCP assertions (via runbook):
  - `**bold**`, `*italic*`, `` `code` ``, `[text](url)` 在闭合字符输入后渲染正确
  - 光标可在样式前后边界移动（Left/Right）且继续输入不异常
  - 切回双栏模式后 markdown 保持同步
- `run.sh` / `run.bat` are start-server-only and print `http://127.0.0.1:33100/`

## GUI MCP runbook entrypoint

- `tests/gui_runbook_inline_style_rules.md`
