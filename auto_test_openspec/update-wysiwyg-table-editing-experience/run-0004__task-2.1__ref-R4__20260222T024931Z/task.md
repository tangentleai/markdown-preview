# Task Validation - R4 列宽测量与分配算法

- change-id: update-wysiwyg-table-editing-experience
- run: run-0004__task-2.1__ref-R4__20260222T024931Z
- task-id: 2.1
- ref-id: R4
- scope: CLI

## How to Run

- macOS/Linux: `bash run.sh`
- Windows: `run.bat`

## Test Inputs

- 本任务为纯函数单测，不需要外部输入文件。

## Test Outputs

- `logs/run.log`: 运行摘要与退出码。
- `outputs/cli-table-column-widths.log`: Jest 输出日志。

## Expected Results (Machine-Decidable)

- `run.sh` / `run.bat` 退出码为 `0`。
- `outputs/cli-table-column-widths.log` 中包含 `PASS`，且不包含 `FAIL`。

## Notes

- 断言覆盖长词、长链接、数字列与预算边界收敛行为。
