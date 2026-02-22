# GUI MCP Runbook (Task 2.2 / R4)

Use MCP tooling only. Start the desktop app first:

- macOS/Linux: `bash run.sh`
- Windows: `run.bat`

Test fixture:

- `tests/fixtures/desktop-sample.md`

## Flow A: 打开 + 预览

1. 启动桌面应用后，点击 `打开`。
2. 选择 `tests/fixtures/desktop-sample.md`。
3. 切换到 `双栏模式`，确认右侧预览区包含标题 `Desktop Flow` 与表格。
4. 截图保存为 `outputs/desktop-flow-open-preview.png`。

## Flow B: 编辑 + 保存

1. 切回 `WYSIWYG 模式`，在编辑区追加一行文本 `已在桌面保存`。
2. 使用 `Ctrl/Cmd+S` 保存。
3. 状态区显示 `已保存：desktop-sample.md`。
4. 截图保存为 `outputs/desktop-flow-save.png`。

## Flow C: 另存为 + 重新打开

1. 点击 `另存为`，保存为 `desktop-sample-copy.md`。
2. 点击 `打开`，选择 `desktop-sample-copy.md`。
3. 确认内容包含 `已在桌面保存`。
4. 截图保存为 `outputs/desktop-flow-save-as.png`。

## Flow D: 最近文件入口

1. 点击 `最近文件`。
2. 选择 `desktop-sample-copy.md`。
3. 确认内容仍包含 `已在桌面保存`。
4. 截图保存为 `outputs/desktop-flow-recents.png`。

## Flow E: 拖拽打开

1. 将 `desktop-sample.md` 拖入应用窗口。
2. 确认内容切换为原始样例文本（不包含 `已在桌面保存`）。
3. 截图保存为 `outputs/desktop-flow-drag-drop.png`。

## Flow F: 再次打开校验

1. 点击 `打开`，重新选择 `desktop-sample-copy.md`。
2. 确认内容包含 `已在桌面保存`。
3. 截图保存为 `outputs/desktop-flow-reopen.png`。

## Evidence Notes

- 保存 MCP 控制台/异常记录到 `logs/gui_notes.txt`。
