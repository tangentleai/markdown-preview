# Task Validation Bundle

- Change ID: `update-wysiwyg-table-editing-experience`
- Task ID: `1.3`
- Ref ID: `R3`
- Run: `0004`
- Timestamp (UTC): `20260222T015537Z`
- Scope: `MIXED`

## Task Objective

修复 WYSIWYG 表格删除与对齐标记撤销联动：

1. 删除表格时，表格节点与 `<!-- table:align=... -->` 标记进入同一撤销事务。
2. Cmd+Z 恢复表格与对齐标记；Cmd+Shift+Z 重新删除。
3. 删除后焦点回到有效可编辑位置。

## Preconditions

1. 仓库根目录完成依赖安装（`npm install`）。
2. 端口 `33100` 可用。

## Inputs

- 种子 Markdown：`inputs/table_align_delete_seed.md`
- 对齐右对齐预期 Markdown：`expected/markdown_after_right_align.md`
- 删除后预期 Markdown：`expected/markdown_after_delete.md`

## How To Run

- 启动应用服务（GUI/MIXED）：
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0004__task-1.3__ref-R3__20260222T015537Z/run.sh`
  - Windows: `auto_test_openspec\update-wysiwyg-table-editing-experience\run-0004__task-1.3__ref-R3__20260222T015537Z\run.bat`
- 运行 CLI 校验脚本：
  - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-table-editing-experience/run-0004__task-1.3__ref-R3__20260222T015537Z/tests/test_cli_table_alignment_r3.sh`

## CLI Validation

- Script: `tests/test_cli_table_alignment_r3.sh`
- Coverage:
  1. 对齐标记解析与编辑器隐藏渲染（`data-table-align` 映射）。
  2. 对齐标记序列化与回读。
  3. 删除表格时对齐标记同步移除（模型层序列化联动）。
- Output log: `outputs/cli-table-alignment.log`

## GUI Validation (MCP only)

- Follow: `tests/gui_runbook_table_align_delete_r3.md`
- `run.sh` / `run.bat` 仅启动本地服务。
- GUI 验证为 MCP 手动步骤（无浏览器自动化脚本）。

## Acceptance Checklist

1. 删除表格与对齐标记进入同一撤销事务。
2. Cmd+Z 恢复表格与对齐标记；Cmd+Shift+Z 重新删除。
3. 删除后焦点返回到前一块或新建空段落。
4. 对齐标记仍可序列化/回读。
