# Validation Bundle - Task 1.3 [#R3]

- change-id: `add-typora-wysiwyg-editor`
- run: `0004`
- task-id: `1.3`
- ref-id: `R3`
- scope: `CLI`

## Task

建立文档模型导出 Markdown 的序列化流程，确保导出结果为 UTF-8 Markdown 且结构语义与编辑状态一致。

## What this bundle validates

- The document model can be serialized into markdown text with heading/list/quote/code/table/link/image semantics.
- UTF-8 content (Chinese text and symbols) remains stable in serialized output.
- Parse -> serialize -> parse keeps the same structure for covered markdown node types.
- Existing markdown import behavior remains unchanged while adding serialization coverage.

## Inputs

- No external input file is required.
- Test fixtures are embedded in `src/__tests__/markdownDocumentModel.test.ts`.

## Outputs

- `outputs/test-output.txt`: console output from CLI validation run.
- `logs/run.log`: run metadata and command transcript.
- `logs/worker_startup.txt`: startup ritual record for this run.

## How to run

- macOS/Linux:

```bash
bash auto_test_openspec/add-typora-wysiwyg-editor/run-0004__task-1.3__ref-R3__20260219T021520Z/run.sh
```

- Windows:

```bat
auto_test_openspec\add-typora-wysiwyg-editor\run-0004__task-1.3__ref-R3__20260219T021520Z\run.bat
```

## Acceptance criteria (machine-decidable)

- `run.sh` / `run.bat` exits with code `0`.
- Output includes passing results for the serialization tests in `markdownDocumentModel` suite.
- UTF-8 serialization assertion and structure round-trip assertion pass.
- Existing parser behavior assertions in the same suite continue to pass.

## Test asset entrypoint

- CLI test script: `tests/test_cli_markdown_serialize.sh` (macOS/Linux) or `tests/test_cli_markdown_serialize.bat` (Windows).
