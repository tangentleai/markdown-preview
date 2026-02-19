# GUI MCP Runbook - Task 3.3 / R10

## Preconditions

1. Start service with this bundle:
   - macOS/Linux: `bash run.sh`
   - Windows: `run.bat`
2. Confirm URL is reachable: `http://127.0.0.1:33100/`

## MCP Steps (playwright-mcp only)

1. Navigate to `http://127.0.0.1:33100/`.
2. In dual-pane textarea, replace content with a multi-level heading sample, for example:
   - `# 一级标题`
   - `## 二级标题`
   - `### 三级标题`
3. Click `WYSIWYG 模式`.
4. Assert outline panel exists (`aria-label="标题大纲"`) and contains heading entries for H1-H3.
5. Click outline item `三级标题`.
6. Assert jump behavior:
   - editor scroll target is the matching `<h3>` block
   - caret/selection is placed inside selected heading block
7. In WYSIWYG editor, edit content so headings change (for example, keep only `# 更新后标题`).
8. Assert outline refreshes in real time:
   - new heading item appears (`更新后标题`)
   - removed heading item no longer exists (for example `二级标题`)

## Evidence Capture Guidance (Supervisor)

1. Capture screenshots for:
   - outline panel showing multi-level headings
   - after clicking outline item, editor positioned at target heading
   - after editing, outline refreshed to latest headings
2. Store screenshots under `outputs/screenshots/`.
3. Record MCP assertions and outcomes in Supervisor bookkeeping.
