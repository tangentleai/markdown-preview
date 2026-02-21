# GUI MCP Runbook - R10 Deterministic State-Driven Icon Styles

## Scope
- Change: `update-wysiwyg-search-experience`
- Task: `4.2`
- Ref: `R10`
- Goal: verify all target icon buttons expose deterministic hover/active computed-style deltas through React-driven state styles.

## Preconditions
1. Start server:
   - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0021__task-4.2__ref-R10__20260221T015610Z/run.sh`
   - Windows: `auto_test_openspec\update-wysiwyg-search-experience\run-0021__task-4.2__ref-R10__20260221T015610Z\run.bat`
2. Open `http://127.0.0.1:33100/`.
3. Open DevTools (Accessibility + Computed).

## Steps
1. Open find toolbar with `Ctrl+F` / `Cmd+F`.
2. Prepare enabled action context:
   - Put repeated `alpha` in content, query `alpha`.
   - Switch to replace mode to show `替换当前` and `替换全部`.
3. Verify accessible names for target icon buttons:
   - `关闭查找替换工具栏`
   - `区分大小写`
   - `查找整个单词`
   - `查找上一个`
   - `查找下一个`
   - `替换当前`
   - `替换全部`
4. For each enabled target button, verify computed-style deltas:
   - Record default `background-color`, `border-color`, `color`.
   - Hover and record again.
   - Hold mouse down (active) and record again.
   - Confirm hover differs from default in at least one property.
   - Confirm active differs from default in at least one property.
5. Disabled/linkage checks:
   - Query `zzz_not_found` => prev/next/replace-current/replace-all disabled.
   - Enable regex => whole-word disabled.

## Expected Results
- All target icon buttons show measurable hover and active computed-style differences when enabled.
- aria-label values are correct.
- Disabled behavior and regex linkage remain correct.
