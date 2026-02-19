# Validation Bundle - Task 4.1 [#R12]

- change-id: `add-typora-wysiwyg-editor`
- run: `0013`
- task-id: `4.1`
- ref-id: `R12`
- scope: `CLI`

## Task

构建 round-trip 与交互 DoD 自动化回归集，覆盖“打开-编辑-保存-重开”结构等价基线与核心交互场景，并产出可复核的通过率与失败明细。

## SCOPE / HOW_TO_RUN

- SCOPE: `CLI`
- macOS/Linux:
  - `bash auto_test_openspec/add-typora-wysiwyg-editor/run-0013__task-4.1__ref-R12__20260219T103150Z/run.sh`
- Windows:
  - `auto_test_openspec\add-typora-wysiwyg-editor\run-0013__task-4.1__ref-R12__20260219T103150Z\run.bat`
- Direct regression script:
  - macOS/Linux: `bash auto_test_openspec/add-typora-wysiwyg-editor/run-0013__task-4.1__ref-R12__20260219T103150Z/tests/test_cli_roundtrip_dod_regression.sh`
  - Windows: `auto_test_openspec\add-typora-wysiwyg-editor\run-0013__task-4.1__ref-R12__20260219T103150Z\tests\test_cli_roundtrip_dod_regression.bat`

## Inputs / Expected / Outputs

- Inputs:
  - Jest + React Testing Library test fixtures in `src/__tests__/wysiwygDodRegression.test.tsx`
- Expected:
  - total scenarios: `10`
  - regression pass rate should be `100.00%` in clean baseline
  - if failures occur, report must list failed scenarios and assertion snippets
- Outputs:
  - `outputs/test-output.txt`: full run output from `run.sh`/`run.bat`
  - `outputs/jest-dod-regression.log`: raw Jest stdout/stderr
  - `outputs/jest-dod-regression.json`: raw Jest JSON result
  - `outputs/dod-regression-report.txt`: pass rate + failure detail report
  - `outputs/dod-regression-summary.json`: normalized summary payload
  - `logs/worker_startup.txt`: startup ritual record
  - `logs/run.log`: bundle execution metadata

## Acceptance Criteria (machine-decidable)

- `run.sh` / `run.bat` exits `0`
- `tests/test_cli_roundtrip_dod_regression.*` runs the dedicated DoD suite and writes all report artifacts under `outputs/`
- `outputs/dod-regression-report.txt` includes:
  - total/passed/failed counts
  - pass rate percentage
  - failure details (if any)
- round-trip baseline scenario verifies open-edit-save-reopen structural equivalence by reparsing saved markdown into equivalent document model

## Test Entrypoints

- `tests/test_cli_roundtrip_dod_regression.sh`
- `tests/test_cli_roundtrip_dod_regression.bat`
