# Validation Bundle - Task 2.2 [#R4]

- change-id: `convert-to-desktop-app-with-abstraction-layer`
- run: `0005`
- task-id: `2.2`
- ref-id: `R4`
- scope: `GUI`

## Task

接入桌面壳并打通最小可用流程：打开、编辑、预览、保存、另存为、最近文件、拖拽打开。

## SCOPE / HOW_TO_RUN

- SCOPE: `GUI`
- macOS/Linux:
  - `bash auto_test_openspec/convert-to-desktop-app-with-abstraction-layer/run-0005__task-2.2__ref-R4__20260222T131500Z/run.sh`
- Windows:
  - `auto_test_openspec\convert-to-desktop-app-with-abstraction-layer\run-0005__task-2.2__ref-R4__20260222T131500Z\run.bat`

## Inputs / Expected / Outputs

- Inputs:
  - 桌面壳入口：`electron/main.cjs`, `electron/preload.cjs`, `desktop.html`, `src/desktop.tsx`
  - 业务注入：`src/shell/desktop-app-shell.tsx`, `src/App.tsx`
  - 适配器：`src/adapters/desktop-adapter.ts`
- Expected:
  - 桌面应用可运行并完成打开、编辑、预览、保存、另存为、最近文件、拖拽打开闭环
- Outputs:
  - `outputs/desktop-flow-open.png`
  - `outputs/desktop-flow-save.png`
  - `outputs/desktop-flow-save-as.png`
  - `outputs/desktop-flow-recents.png`
  - `outputs/desktop-flow-drag-drop.png`
  - `logs/gui_notes.txt`

## Acceptance Criteria (machine-decidable)

- GUI runbook steps完成并记录证据截图

## Test Entrypoints

- `tests/gui_runbook_desktop_minimal_flow.md`
