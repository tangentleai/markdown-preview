# Validation Bundle - Task 2.1 [#R3]

- change-id: `convert-to-desktop-app-with-abstraction-layer`
- run: `0004`
- task-id: `2.1`
- ref-id: `R3`
- scope: `CLI`

## Task

实现 Web/Desktop 双平台 adapter，确保统一接口、业务层无平台分支；并验证类型检查、adapter 契约测试与 core 复用测试可通过。

## SCOPE / HOW_TO_RUN

- SCOPE: `CLI`
- macOS/Linux:
  - `bash auto_test_openspec/convert-to-desktop-app-with-abstraction-layer/run-0004__task-2.1__ref-R3__20260222T110319Z/run.sh`
- Windows:
  - `auto_test_openspec\convert-to-desktop-app-with-abstraction-layer\run-0004__task-2.1__ref-R3__20260222T110319Z\run.bat`

## Inputs / Expected / Outputs

- Inputs:
  - 源码与类型：`src/adapters/**/*`, `src/App.tsx`, `src/shell/web-app-shell.tsx`
  - 测试文件：`src/__tests__/adapterContracts.test.ts`, `src/__tests__/coreBoundaryContracts.test.ts`, `src/__tests__/coreSharedLogicMigration.test.ts`
- Expected:
  - Adapter 相关 TypeScript 类型检查无错误
  - Adapter 契约测试通过
  - Core 复用测试通过
- Outputs:
  - `outputs/typecheck.log`
  - `outputs/adapter-contract-tests.log`
  - `outputs/core-contract-tests.log`
  - `outputs/test-output.txt`
  - `logs/run.log`
  - `logs/cli-run.log`
  - `logs/worker_startup.txt`

## Acceptance Criteria (machine-decidable)

- `run.sh` / `run.bat` 退出码为 `0`
- `npx tsc --noEmit -p tests/tsconfig.adapters.json` 退出码为 `0`
- `npm run test -- --runInBand src/__tests__/adapterContracts.test.ts` 退出码为 `0`
- `npm run test -- --runInBand src/__tests__/coreBoundaryContracts.test.ts src/__tests__/coreSharedLogicMigration.test.ts` 退出码为 `0`

## Test Entrypoints

- `tests/test_cli_platform_adapters.sh`
- `tests/test_cli_platform_adapters.bat`
