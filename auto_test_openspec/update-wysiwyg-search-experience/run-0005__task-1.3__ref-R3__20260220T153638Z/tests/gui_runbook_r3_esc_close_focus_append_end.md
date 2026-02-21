# GUI MCP Runbook - R3 Esc Close Caret-at-End Fix (Run 0005)

## Scope
Verify Esc closes find toolbar from required focus states and restores editor caret to end so immediate typing appends.

## Preconditions
1. Start service via bundle script:
   - macOS/Linux: `bash auto_test_openspec/update-wysiwyg-search-experience/run-0005__task-1.3__ref-R3__20260220T153638Z/run.sh`
   - Windows: `auto_test_openspec\\update-wysiwyg-search-experience\\run-0005__task-1.3__ref-R3__20260220T153638Z\\run.bat`
2. Open `http://127.0.0.1:33100/`.

## MCP Steps And Assertions
1. Switch to `WYSIWYG` mode.
2. Focus editor (`aria-label="WYSIWYG 编辑区"`) and set single paragraph content to `Start`.
3. Open toolbar via `Ctrl+F` (or `Cmd+F`), focus `查找文本`, press `Escape`.
   - Assert toolbar (`aria-label="查找替换工具栏"`) is hidden (`aria-hidden="true"`).
   - Assert active element is editor.
   - Type `A` in editor and assert text is `StartA`.
4. Reopen toolbar, focus `替换文本`, press `Escape`.
   - Assert toolbar hidden and active element is editor.
   - Type `B` in editor and assert text is `StartAB`.
5. Reopen toolbar, focus editor, press `Escape`.
   - Assert toolbar hidden and active element is editor.
   - Type `C` in editor and assert text is `StartABC`.

## Evidence To Capture (Supervisor)
- Screenshot after Step 3 showing hidden toolbar and `StartA`.
- Screenshot after Step 4 showing hidden toolbar and `StartAB`.
- Screenshot after Step 5 showing hidden toolbar and `StartABC`.
