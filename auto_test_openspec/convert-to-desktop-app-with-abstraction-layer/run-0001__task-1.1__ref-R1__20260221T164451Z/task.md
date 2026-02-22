# Validation Bundle - Task 1.1 [#R1]

- change-id: `convert-to-desktop-app-with-abstraction-layer`
- run: `0001`
- task-id: `1.1`
- ref-id: `R1`
- scope: `CLI`

## Task

梳理现有业务能力并定义 core 层边界与接口，形成平台无关能力清单，并覆盖文档模型、渲染管线、查找替换、文件服务契约。

## SCOPE / HOW_TO_RUN

- SCOPE: `CLI`
- macOS/Linux:
  - `bash auto_test_openspec/convert-to-desktop-app-with-abstraction-layer/run-0001__task-1.1__ref-R1__20260221T164451Z/run.sh`
- Windows:
  - `auto_test_openspec\convert-to-desktop-app-with-abstraction-layer\run-0001__task-1.1__ref-R1__20260221T164451Z\run.bat`

## Inputs / Expected / Outputs

- Inputs:
  - source contracts: `src/core/**/*.ts`
  - contract test: `src/__tests__/coreBoundaryContracts.test.ts`
- Expected:
  - `src/core/**/*.ts` 不直接引用 DOM/Node/Electron API
  - 核心边界契约可由 mock 实现替换，测试通过
- Outputs:
  - `outputs/core-platform-api-violations.txt`: 静态扫描结果
  - `outputs/core-typecheck.log`: 核心边界相关 TypeScript 检查输出
  - `outputs/core-contract-tests.log`: 核心契约单测输出
  - `outputs/test-output.txt`: `run.sh`/`run.bat` 汇总输出
  - `logs/worker_startup.txt`: 启动仪式记录
  - `logs/run.log`: 本次 bundle 执行命令记录

## Acceptance Criteria (machine-decidable)

- `run.sh` / `run.bat` 退出码为 `0`
- 静态扫描命令若发现禁用 API 关键字，脚本必须非零退出
- `npx tsc --noEmit ... src/core/index.ts src/__tests__/coreBoundaryContracts.test.ts` 返回 `0`
- `npm run test -- --runInBand src/__tests__/coreBoundaryContracts.test.ts` 返回 `0`

## Test Entrypoints

- `tests/test_cli_core_boundary.sh`
- `tests/test_cli_core_boundary.bat`
