# GUI MCP Runbook - R2 Enter Next + Wrap

## Scope
Validate Enter-key-driven find-next navigation in WYSIWYG find input, including index progression and wrap-around.

## Preconditions
1. Start service via bundle script:
   - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0002__task-1.2__ref-R2__20260220T150536Z/run.sh`
   - Windows: `auto_test_openspec\\update-wysiwyg-search-experience\\run-0002__task-1.2__ref-R2__20260220T150536Z\\run.bat`
2. Open `http://127.0.0.1:33100/`.

## MCP Steps And Assertions
1. Switch to `WYSIWYG` mode.
2. Focus editor (`aria-label="WYSIWYG 编辑区"`) and set deterministic content to one paragraph:
   - `alpha beta alpha gamma`
3. Trigger `Ctrl+F` (or `Cmd+F`) on editor to open toolbar.
4. In find input (`aria-label="查找文本"`), enter `alpha`.
   - Assert counter (`aria-label="查找结果计数"`) shows initial unresolved state (`匹配：0` or `匹配：0/2`).
5. Keep focus in find input and press `Enter` once.
   - Assert counter becomes `匹配：1/2`.
6. Press `Enter` again.
   - Assert counter becomes `匹配：2/2`.
7. Press `Enter` third time.
   - Assert counter wraps and becomes `匹配：1/2`.
8. Optional parity check: click `查找下一个` once.
   - Assert counter becomes `匹配：2/2` (same navigation semantics as Enter).

## Evidence To Capture (Supervisor)
- Screenshot after Step 4 (query entered and initial counter state).
- Screenshot after Step 5 (`1/2`).
- Screenshot after Step 6 (`2/2`).
- Screenshot after Step 7 (wrap to `1/2`).
