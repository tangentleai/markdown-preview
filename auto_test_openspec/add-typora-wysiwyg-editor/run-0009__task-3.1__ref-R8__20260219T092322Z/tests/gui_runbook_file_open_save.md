# GUI MCP Runbook - Task 3.1 / R8

## Preconditions

1. Start service with this bundle:
   - macOS/Linux: `bash run.sh`
   - Windows: `run.bat`
2. Confirm URL is reachable: `http://127.0.0.1:33100/`

## MCP Steps (playwright-mcp only)

1. Navigate to `http://127.0.0.1:33100/`.
2. Confirm header actions contain `打开`, `保存` or `保存*`, and `另存为`.
3. Dirty-state check:
   - edit markdown content in dual-pane textarea
   - assert status line (`aria-label="保存状态"`) changes to `状态：未保存更改`
4. Shortcut save flow check:
   - trigger `Ctrl/Cmd+S`
   - if browser supports file-system picker, validate save picker appears; if not supported, validate fallback download branch executes without error
   - after save flow resolves, assert status line updates to `状态：已保存：<filename>`
5. Save As button flow check:
   - click `另存为`
   - validate save-as flow is triggered (picker or fallback)
   - assert status line remains in saved state with target filename
6. Open flow check:
   - click `打开`
   - if picker unsupported, validate hidden file input fallback is used and only `.md/.markdown` is accepted
   - if markdown file selected/opened, assert file label (`aria-label="当前文件"`) and status line update to saved state
7. Switch to `WYSIWYG 模式` then back to `双栏模式`; verify file label and saved/unsaved status remain consistent.

## Evidence Capture Guidance (Supervisor)

1. Capture screenshots for:
   - unsaved status after edit
   - save shortcut result with saved status text
   - save-as result status
   - open flow result with updated filename and status
2. Store screenshots under `outputs/screenshots/` and record index in logs.
3. Record MCP assertions and outcomes in Supervisor bookkeeping.
