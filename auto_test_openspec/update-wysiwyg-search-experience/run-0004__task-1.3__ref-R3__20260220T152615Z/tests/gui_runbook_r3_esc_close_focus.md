# GUI MCP Runbook - R3 Esc Close + Focus Restore (Run 0004)

## Scope
Validate that Esc closes find toolbar consistently from all required focus states and editor focus is restored for immediate typing.

## Preconditions
1. Start service via bundle script:
   - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0004__task-1.3__ref-R3__20260220T152615Z/run.sh`
   - Windows: `auto_test_openspec\\update-wysiwyg-search-experience\\run-0004__task-1.3__ref-R3__20260220T152615Z\\run.bat`
2. Open `http://127.0.0.1:33100/`.

## MCP Steps And Assertions
1. Switch to `WYSIWYG` mode.
2. Focus editor (`aria-label="WYSIWYG 编辑区"`) and set content to `Start`.
3. Open find toolbar via `Ctrl+F` (or `Cmd+F`).
4. Focus find input (`aria-label="查找文本"`), press `Escape`.
   - Assert toolbar (`aria-label="查找替换工具栏"`) is hidden (`aria-hidden="true"`).
   - Assert active element is editor.
   - Type `A` in editor and assert visible content includes `StartA`.
5. Reopen toolbar via `Ctrl+F` (or `Cmd+F`).
6. Focus replace input (`aria-label="替换文本"`), press `Escape`.
   - Assert toolbar hidden and active element is editor.
   - Type `B` in editor and assert visible content includes `StartAB`.
7. Reopen toolbar via `Ctrl+F` (or `Cmd+F`), keep focus on editor, press `Escape`.
   - Assert toolbar hidden and active element is editor.
   - Type `C` in editor and assert visible content includes `StartABC`.

## Evidence To Capture (Supervisor)
- Screenshot after Step 4 (Esc from find input closed toolbar + editor focused).
- Screenshot after Step 6 (Esc from replace input closed toolbar + editor focused).
- Screenshot after Step 7 (Esc from editor focus closed toolbar + continued typing visible).
