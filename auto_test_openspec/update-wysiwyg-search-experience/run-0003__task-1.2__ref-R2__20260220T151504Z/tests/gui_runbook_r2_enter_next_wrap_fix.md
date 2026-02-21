# GUI MCP Runbook - R2 Enter Next + Wrap (Run 0003)

## Scope
Verify the R2 fix where consecutive Enter in find input continues navigation without collapsing match count.

## Preconditions
1. Start service via bundle script:
   - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0003__task-1.2__ref-R2__20260220T151504Z/run.sh`
   - Windows: `auto_test_openspec\\update-wysiwyg-search-experience\\run-0003__task-1.2__ref-R2__20260220T151504Z\\run.bat`
2. Open `http://127.0.0.1:33100/`.

## MCP Steps And Assertions
1. Switch to `WYSIWYG` mode.
2. Focus editor (`aria-label="WYSIWYG 编辑区"`) and set one paragraph content:
   - `alpha beta alpha gamma`
3. Trigger `Ctrl+F` (or `Cmd+F`) to open find toolbar.
4. Enter `alpha` into find input (`aria-label="查找文本"`).
   - Assert counter (`aria-label="查找结果计数"`) is unresolved initial state (`匹配：0` or `匹配：0/2`).
5. Keep focus on the find input and press Enter once.
   - Assert counter is `匹配：1/2`.
6. Without clicking editor, press Enter again.
   - Assert counter is `匹配：2/2`.
7. Press Enter a third time.
   - Assert counter wraps to `匹配：1/2`.
8. Optional confirmation: press Enter once more.
   - Assert counter is `匹配：2/2`.

## Evidence To Capture (Supervisor)
- Screenshot after Step 4 (query entered, initial counter state).
- Screenshot after Step 5 (`1/2`).
- Screenshot after Step 6 (`2/2`).
- Screenshot after Step 7 (wrap `1/2`).
