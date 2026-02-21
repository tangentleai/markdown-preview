# GUI MCP Runbook - R10 All Icon Buttons Hover/Active

## Scope
- Change: `update-wysiwyg-search-experience`
- Task: `4.2`
- Ref: `R10`
- Goal: verify all target icon buttons (including close) expose computed-style deltas on both hover and active.

## Preconditions
1. Start server:
   - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0020__task-4.2__ref-R10__20260221T013434Z/run.sh`
   - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0020__task-4.2__ref-R10__20260221T013434Z\run.bat`
2. Open `http://127.0.0.1:33100/`.
3. Open DevTools (Accessibility + Computed).

## Steps
1. Open toolbar with `Ctrl+F` / `Cmd+F`.
2. Ensure matching context so action buttons are enabled:
   - Prepare content with repeated `alpha`.
   - Query `alpha`.
   - Switch to replace mode so `替换当前` and `替换全部` are visible and enabled.
3. Verify accessibility names for all target icon buttons:
   - `关闭查找替换工具栏`
   - `区分大小写`
   - `查找整个单词`
   - `查找上一个`
   - `查找下一个`
   - `替换当前`
   - `替换全部`
4. For each enabled target icon button, do computed-style checks:
   - Record default `background-color`, `border-color`, `color`.
   - Hover and record again.
   - Hold pointer down (active) and record again.
   - Assert hoverChanged=true (at least one property changed).
   - Assert activeChanged=true (at least one property changed).
5. Disabled behavior sanity checks:
   - Query `zzz_not_found` => `查找上一个`/`查找下一个` and replace buttons disabled.
   - Enable `正则模式` => `查找整个单词` disabled.

## Expected Results
- All seven target icon buttons have measurable hover and active computed-style deltas when enabled.
- aria-label values are intact.
- Disabled and regex linkage rules remain correct.
