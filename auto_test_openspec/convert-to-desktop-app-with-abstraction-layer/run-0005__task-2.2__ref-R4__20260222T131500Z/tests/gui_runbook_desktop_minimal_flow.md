# GUI MCP Runbook (Task 2.2 / R4)

Use MCP tooling only. Start the desktop app first:

- macOS/Linux: `bash run.sh`
- Windows: `run.bat`

Test fixture:

- `tests/fixtures/desktop-sample.md`

## Flow A: Open file + Preview

1. 启动桌面应用后，点击 `打开`。
2. 选择 `tests/fixtures/desktop-sample.md`。
3. 确认编辑区显示标题 `Desktop Flow`，预览区存在表格与列表。
4. 截图保存为 `outputs/desktop-flow-open.png`。

## Flow B: Edit + Save

1. 在编辑区追加一行文本 `已在桌面保存`。
2. 使用 `Ctrl/Cmd+S` 保存。
3. 状态区显示 `已保存：desktop-sample.md`。
4. 截图保存为 `outputs/desktop-flow-save.png`。

## Flow C: Save As + Reopen

1. 点击 `另存为`，保存为 `desktop-sample-copy.md`。
2. 点击 `打开`，选择 `desktop-sample-copy.md`。
3. 确认内容包含 `已在桌面保存`。
4. 截图保存为 `outputs/desktop-flow-save-as.png`。

## Flow D: Recent Files

1. 点击 `最近文件`。
2. 选择 `desktop-sample-copy.md`。
3. 确认内容包含 `已在桌面保存`。
4. 截图保存为 `outputs/desktop-flow-recents.png`。

## Flow E: Drag & Drop Open

1. 将 `desktop-sample.md` 拖入应用窗口。
2. 确认内容切换为原始样例文本。
3. 截图保存为 `outputs/desktop-flow-drag-drop.png`。

## Evidence Notes

- 保存 MCP 控制台/异常记录到 `logs/gui_notes.txt`。
