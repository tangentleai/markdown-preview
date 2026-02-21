# GUI MCP Runbook - R10 Icon Buttons Hover/Active Delta

## Scope
- Change: `update-wysiwyg-search-experience`
- Task: `4.2`
- Ref: `R10`
- Goal: verify icon rendering, accessibility labels, disabled logic, and observable computed-style hover/active deltas.

## Preconditions
1. Start server:
   - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0018__task-4.2__ref-R10__20260221T012714Z/run.sh`
   - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0018__task-4.2__ref-R10__20260221T012714Z\run.bat`
2. Open `http://127.0.0.1:33100/`.
3. Open DevTools for Accessibility and Elements/Computed panels.

## Steps
1. Focus editor and press `Ctrl+F`/`Cmd+F` to open find toolbar.
2. Verify icon buttons exist with these names:
   - `关闭查找替换工具栏`
   - `区分大小写`
   - `查找整个单词`
   - `查找上一个`
   - `查找下一个`
3. Enter a no-match query (example: `zzz_not_found`) and confirm:
   - `查找上一个` and `查找下一个` are disabled.
   - Switch to replace mode and confirm `替换当前` and `替换全部` are disabled.
4. Enter matching content/query (example content has repeated `alpha`, query `alpha`) and confirm:
   - `查找上一个` and `查找下一个` are enabled.
   - In replace mode, `替换当前` and `替换全部` are enabled.
5. Accessibility check:
   - In Accessibility pane, each icon button exposes expected name from `aria-label`.
6. Computed-style delta check (enabled icon button, example `查找下一个`):
   - Record default computed values for `background-color`, `border-color`, `color`.
   - Hover the button and record values again.
   - Press and hold the button (`:active`) and record values again.
   - Assert at least one property differs between default vs hover, and default vs active.
7. Pressed-state check:
   - Toggle `区分大小写` and `查找整个单词` (when regex off), confirm pressed visual style persists.
8. Regex linkage check:
   - Enable `正则模式` and confirm `查找整个单词` becomes disabled.

## Expected Results
- Required toolbar actions render as icon buttons.
- Accessibility names match required labels.
- Disabled/enabled behaviors match search and regex linkage rules.
- Hover and active interaction states are visually and computationally observable.
