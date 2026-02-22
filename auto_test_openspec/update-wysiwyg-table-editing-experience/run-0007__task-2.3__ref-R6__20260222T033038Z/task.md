# Task Validation Bundle

- Change ID: `update-wysiwyg-table-editing-experience`
- Task ID: `2.3`
- Ref ID: `R6`
- Run: `0007`
- Timestamp (UTC): `20260222T033038Z`
- Scope: `MIXED`

## Task Objective

Ensure table cells apply `overflow-wrap:anywhere` and a reasonable `word-break` rule so long mixed content (Chinese, URL, code) remains readable without forcing columns to overflow.

## Preconditions

1. Dependencies are installed in repo root (`npm install`).
2. Port `33100` is available.

## Inputs

- Markdown seed sample (paste into dual-pane Markdown input):

```
| 类型 | 内容 | 备注 |
| --- | --- | --- |
| 中文段落 | 这是一个非常非常长的中文内容，用于验证单元格在没有空格的情况下依然能够合理换行并保持可读性 | 混排 EnglishLongWordWithoutSpacesForWrapCheck |
| URL | https://example.com/very/long/path/with/many/segments/andquery?foo=bar&baz=qux&lorem=ipsum | 末尾补充说明文本 |
| 代码 | `const veryLongIdentifierNameWithoutSpaces = true;` | 还应支持 `const anotherSuperLongIdentifierWithoutSpaces = false;` |
```

## How To Run

- Start app server only (required for GUI/MIXED bundles):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0007__task-2.3__ref-R6__20260222T033038Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-table-editing-experience\run-0007__task-2.3__ref-R6__20260222T033038Z\run.bat`
- Run CLI validation script (separate from server start):
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0007__task-2.3__ref-R6__20260222T033038Z/tests/test_cli_table_cell_wrap_r6.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-table-editing-experience\run-0007__task-2.3__ref-R6__20260222T033038Z\tests\test_cli_table_cell_wrap_r6.bat`

## CLI Validation

- Script: `tests/test_cli_table_cell_wrap_r6.sh` / `tests/test_cli_table_cell_wrap_r6.bat`
- Assertions:
  1. Table cell rule includes `overflow-wrap: anywhere;`.
  2. Table cell rule includes `word-break: break-word;`.
- Output log: `outputs/cli-table-cell-wrap.log`

## GUI Validation (MCP only)

- Follow: `tests/gui_runbook_table_cell_wrap_r6.md`
- `run.sh` / `run.bat` MUST only start local service.
- GUI verification MUST be performed via MCP (no browser automation scripts in bundle).

## Expected Results

1. Table cells wrap long URLs and long code identifiers without forcing columns to overflow.
2. Table cells preserve readability in mixed Chinese/English content.
3. Computed styles show `overflow-wrap:anywhere` and `word-break:break-word` for `th`/`td`.
