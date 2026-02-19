# GUI MCP Runbook - Task 3.2 / R9

## Preconditions

1. Start service with this bundle:
   - macOS/Linux: `bash run.sh`
   - Windows: `run.bat`
2. Confirm URL is reachable: `http://127.0.0.1:33100/`
3. Prepare a local image file for drag-drop (example: `local image.png`).

## MCP Steps (playwright-mcp only)

1. Navigate to `http://127.0.0.1:33100/`.
2. Click `WYSIWYG 模式`.
3. Locate editor area (`aria-label="WYSIWYG 编辑区"`).
4. Drag and drop local image file into editor area.
5. Assert inline render:
   - an `<img>` appears in the editor
   - image is visible (not collapsed)
6. Assert markdown reference sync:
   - click `双栏模式`
   - in textarea, confirm markdown contains `![<alt>](<relative-path>)`
   - for filename `local image.png`, expect encoded relative path `local%20image.png`
7. Confirm MVP scope:
   - no automatic asset-copy path rewriting is triggered
   - markdown keeps dropped file relative reference

## Evidence Capture Guidance (Supervisor)

1. Capture screenshots for:
   - WYSIWYG image shown after drop
   - dual-pane markdown showing generated image reference
2. Store screenshots under `outputs/screenshots/` and record index in logs.
3. Record MCP assertions and outcomes in Supervisor bookkeeping.
