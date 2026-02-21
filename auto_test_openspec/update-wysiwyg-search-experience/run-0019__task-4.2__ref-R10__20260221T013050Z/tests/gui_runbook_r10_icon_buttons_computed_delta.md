# GUI MCP Runbook - R10 Icon Buttons Computed-Style Delta

## Scope
- Change: `update-wysiwyg-search-experience`
- Task: `4.2`
- Ref: `R10`
- Goal: verify icon buttons, a11y names, disabled logic, and measurable hover/active computed-style deltas.

## Preconditions
1. Start server:
   - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0019__task-4.2__ref-R10__20260221T013050Z/run.sh`
   - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0019__task-4.2__ref-R10__20260221T013050Z\run.bat`
2. Open `http://127.0.0.1:33100/`.
3. Open DevTools (Elements + Computed + Accessibility).

## Steps
1. Open find toolbar with `Ctrl+F`/`Cmd+F`.
2. Verify required icon buttons exist and have labels:
   - `关闭查找替换工具栏`
   - `区分大小写`
   - `查找整个单词`
   - `查找上一个`
   - `查找下一个`
3. No-match disabled check:
   - Query `zzz_not_found`.
   - Verify `查找上一个` / `查找下一个` disabled.
   - Switch to replace mode, verify `替换当前` / `替换全部` disabled.
4. Match enabled check:
   - Use content containing repeated `alpha`, query `alpha`.
   - Verify `查找上一个` / `查找下一个` enabled.
   - In replace mode, `替换当前` / `替换全部` enabled.
5. Accessibility check:
   - For each icon button, confirm expected accessible name (`aria-label`).
6. Computed-style delta check (enabled icon button, e.g. `查找下一个`):
   - Capture default computed values for `background-color`, `border-color`, `color`.
   - Hover button; capture computed values again.
   - Hold mouse down to trigger `:active`; capture computed values again.
   - Assert at least one property differs for default vs hover.
   - Assert at least one property differs for default vs active.
7. Regex linkage check:
   - Enable `正则模式`.
   - Verify `查找整个单词` disabled.

## Expected Results
- Required controls render as icon buttons with correct accessible names.
- Disabled/enabled behavior matches find/replace and regex linkage rules.
- Hover and active states on enabled icon buttons produce measurable computed-style deltas.
