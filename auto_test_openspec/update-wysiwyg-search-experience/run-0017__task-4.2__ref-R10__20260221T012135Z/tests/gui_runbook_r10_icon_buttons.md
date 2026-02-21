# GUI MCP Runbook - R10 Icon Buttons

## Scope
- Change: `update-wysiwyg-search-experience`
- Task: `4.2`
- Ref: `R10`
- Goal: verify iconfont button rendering, accessible names, disabled state, and hover/active feedback.

## Preconditions
1. Start server:
   - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0017__task-4.2__ref-R10__20260221T012135Z/run.sh`
   - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0017__task-4.2__ref-R10__20260221T012135Z\run.bat`
2. Open `http://127.0.0.1:33100/`.
3. Open browser devtools for accessibility and computed style checks.

## Steps
1. Focus editor and press `Ctrl+F`/`Cmd+F` to open toolbar.
2. Confirm icon buttons are visible for:
   - `关闭查找替换工具栏`
   - `区分大小写`
   - `查找整个单词`
   - `查找上一个`
   - `查找下一个`
3. Enter find text with no matches (example: `zzz_not_found`).
4. Verify disabled state:
   - `查找上一个`, `查找下一个` disabled.
   - Switch to replace mode and verify `替换当前`, `替换全部` disabled.
5. Enter content and query with matches (example content includes repeated `alpha`; query `alpha`).
6. Verify enabled state:
   - `查找上一个`, `查找下一个` enabled.
   - In replace mode, `替换当前`, `替换全部` enabled.
7. Accessibility check (DevTools Accessibility pane):
   - Each icon button exposes its expected accessible name via `aria-label`.
8. Interaction feedback check:
   - Hover each icon button and verify background color change.
   - Press and hold mouse on each icon button and verify active-state color shift.
9. Regex linkage check:
   - Enable regex mode.
   - Verify `查找整个单词` is disabled.

## Expected Results
- Required buttons render as icons, not plain text labels.
- Accessible names are present and correct.
- Disabled states match no-result and regex linkage rules.
- Hover and active visual feedback are consistently present.
