# GUI MCP Runbook - Task 1.0 / R0

## Preconditions

1. Start service with run script in this bundle:
   - macOS/Linux: `bash run.sh`
   - Windows: `run.bat`
2. Confirm page is reachable at `http://127.0.0.1:33100/`.

## MCP Steps (playwright-mcp only)

1. Navigate to `http://127.0.0.1:33100/`.
2. Locate editor mode toggle buttons:
   - `双栏模式`
   - `WYSIWYG 模式`
3. In `双栏模式`:
   - locate markdown textarea by placeholder `在这里输入 Markdown 文本...`
   - replace content with:

```markdown
# 模式切换验收

- 保留原始 Markdown
- 往返切换后内容一致
```

4. Click `WYSIWYG 模式`.
5. Assert:
   - textarea section (`Markdown 输入`) is not visible
   - rendered heading `模式切换验收` is visible
   - rendered list item `保留原始 Markdown` is visible
6. Click `双栏模式`.
7. Assert markdown textarea value is exactly:

```markdown
# 模式切换验收

- 保留原始 Markdown
- 往返切换后内容一致
```

8. Click `WYSIWYG 模式` again.
9. Assert rendered heading/list remain consistent with step 5.

## Evidence Capture Guidance (Supervisor)

1. Capture screenshots at minimum:
   - dual-pane with edited textarea
   - first WYSIWYG view
   - switched back dual-pane with unchanged textarea
2. Save screenshots under `outputs/screenshots/` and index them in `logs/`.
3. Record exact MCP commands and assertion outcomes in Supervisor evidence chain.
