# Validation Bundle - Task 2.2 [#R4]

- change-id: `convert-to-desktop-app-with-abstraction-layer`
- run: `0006`
- task-id: `2.2`
- ref-id: `R4`
- scope: `GUI`

## Task

接入桌面壳并打通最小可用流程：打开、编辑、预览、保存、另存为、最近文件、拖拽打开，并完成再次打开一致性校验。

## SCOPE / HOW_TO_RUN

- SCOPE: `GUI`
- macOS/Linux:
  - `bash auto_test_openspec/convert-to-desktop-app-with-abstraction-layer/run-0006__task-2.2__ref-R4__20260222T135543Z/run.sh`
- Windows:
  - `auto_test_openspec\convert-to-desktop-app-with-abstraction-layer\run-0006__task-2.2__ref-R4__20260222T135543Z\run.bat`

## Inputs / Expected / Outputs

- Inputs:
  - 桌面壳入口：`electron/main.cjs`, `electron/preload.cjs`, `desktop.html`, `src/desktop.tsx`
  - 业务注入：`src/shell/desktop-app-shell.tsx`, `src/App.tsx`
  - 适配器：`src/adapters/desktop-adapter.ts`
  - GUI 测试样例：`tests/fixtures/desktop-sample.md`
- Expected:
  - 桌面应用可运行并完成打开、编辑、预览、保存、另存为、最近文件、拖拽打开闭环
  - 重新打开时内容保持一致
- Outputs:
  - `outputs/desktop-flow-open-preview.png`
  - `outputs/desktop-flow-save.png`
  - `outputs/desktop-flow-save-as.png`
  - `outputs/desktop-flow-recents.png`
  - `outputs/desktop-flow-drag-drop.png`
  - `outputs/desktop-flow-reopen.png`
  - `logs/gui_notes.txt`

## Acceptance Criteria (machine-decidable)

- MCP GUI runbook 执行完成，并生成上述截图与日志文件。

## Test Entrypoints

- GUI runbook: `tests/gui_runbook_desktop_minimal_flow.md`
EOF~