# Validation Bundle - Task 1.2 [#R2]

- change-id: `add-typora-wysiwyg-editor`
- run: `0003`
- task-id: `1.2`
- ref-id: `R2`
- scope: `CLI`

## Task

建立 Markdown 导入到文档模型的解析流程，支持段落、标题、列表、引用、代码块、链接、图片、表格基础导入。

## What this bundle validates

- The markdown import parser generates the expected document-model node structure (snapshot-based check).
- The parser-to-editable-html bridge preserves previously completed heading/list/code/paragraph behavior.
- Quote/table/link/image parsing is covered with runnable assertions.

## Inputs

- No external input file is required.
- Test fixtures are embedded in `src/__tests__/markdownDocumentModel.test.ts`.

## Outputs

- `outputs/test-output.txt`: console output of CLI test execution.
- `logs/run.log`: run metadata and command transcript.
- `logs/worker_startup.txt`: mandatory startup ritual record.

## How to run

- macOS/Linux:

```bash
bash auto_test_openspec/add-typora-wysiwyg-editor/run-0003__task-1.2__ref-R2__20260219T020933Z/run.sh
```

- Windows:

```bat
auto_test_openspec\add-typora-wysiwyg-editor\run-0003__task-1.2__ref-R2__20260219T020933Z\run.bat
```

## Acceptance criteria (machine-decidable)

- `run.sh` / `run.bat` exits with code `0`.
- Test output must include passing results from `markdownDocumentModel` test suite.
- Snapshot assertion validates node structure equivalence for required import types.

## Test asset entrypoint

- CLI test script: `tests/test_cli_markdown_import.sh` (Linux/macOS) or `tests/test_cli_markdown_import.bat` (Windows).
