## 1. 编辑器内核与文档模型
- [x] 1.0 实现编辑模式开关并保留现有双栏模式 [#R0]
  - ACCEPT: 用户可在“双栏模式 / WYSIWYG 模式”间切换，切换后文档内容保持一致
  - TEST: SCOPE: GUI
    - 在同一文档中往返切换两种模式，校验内容、光标位置与渲染一致性
  - BUNDLE (RUN #1): Task 1.0 mode toggle implementation bundle (GUI start-server-only) | VALIDATION_BUNDLE: auto_test_openspec/add-typora-wysiwyg-editor/run-0001__task-1.0__ref-R0__20260219T013847Z | HOW_TO_RUN: run.sh/run.bat
  - EVIDENCE (RUN #1): Supervisor executed GUI MCP runbook and verified mode round-trip consistency | VALIDATED: bash auto_test_openspec/add-typora-wysiwyg-editor/run-0001__task-1.0__ref-R0__20260219T013847Z/run.sh (server started, URL observed, PID check exit=0); MCP playwright assertions for dual->wysiwyg->dual->wysiwyg flow | RESULT: PASS | GUI_EVIDENCE: auto_test_openspec/add-typora-wysiwyg-editor/run-0001__task-1.0__ref-R0__20260219T013847Z/outputs/screenshots/01-dual-pane-edited.png, auto_test_openspec/add-typora-wysiwyg-editor/run-0001__task-1.0__ref-R0__20260219T013847Z/outputs/screenshots/02-wysiwyg-view.png, auto_test_openspec/add-typora-wysiwyg-editor/run-0001__task-1.0__ref-R0__20260219T013847Z/outputs/screenshots/03-dual-pane-roundtrip.png, auto_test_openspec/add-typora-wysiwyg-editor/run-0001__task-1.0__ref-R0__20260219T013847Z/outputs/screenshots/04-wysiwyg-roundtrip.png

- [x] 1.1 完成 WYSIWYG 编辑器内核选型并落地最小可编辑集成 [#R1]
  - ACCEPT: 编辑区在单栏中可直接编辑排版结果，具备稳定光标与基础输入能力
  - TEST: SCOPE: GUI
    - 启动本地服务后，在同一编辑区完成输入、选区、删除操作并保持正常渲染
  - BUNDLE (RUN #2): Task 1.1 native contentEditable kernel MVP bundle (GUI start-server-only) | VALIDATION_BUNDLE: auto_test_openspec/add-typora-wysiwyg-editor/run-0002__task-1.1__ref-R1__20260219T015420Z | HOW_TO_RUN: run.sh/run.bat
  - EVIDENCE (RUN #2): Supervisor executed GUI MCP runbook and confirmed single-pane editable WYSIWYG behavior with mode round-trip sync | VALIDATED: bash auto_test_openspec/add-typora-wysiwyg-editor/run-0002__task-1.1__ref-R1__20260219T015420Z/run.sh (retry log confirms Local URL http://127.0.0.1:33100/); MCP playwright assertions for input/delete/replace in WYSIWYG editor and sync back to dual-pane textarea | RESULT: PASS | GUI_EVIDENCE: auto_test_openspec/add-typora-wysiwyg-editor/run-0002__task-1.1__ref-R1__20260219T015420Z/outputs/screenshots/01-wysiwyg-before-edit.png, auto_test_openspec/add-typora-wysiwyg-editor/run-0002__task-1.1__ref-R1__20260219T015420Z/outputs/screenshots/02-wysiwyg-after-edit.png, auto_test_openspec/add-typora-wysiwyg-editor/run-0002__task-1.1__ref-R1__20260219T015420Z/outputs/screenshots/03-dual-pane-after-switch-back.png

- [x] 1.2 建立 Markdown 导入到文档模型的解析流程 [#R2]
  - ACCEPT: 支持段落、标题、列表、引用、代码块、链接、图片、表格基础导入
  - TEST: SCOPE: CLI
    - 运行解析测试集，校验节点结构与预期快照一致
  - BUNDLE (RUN #3): Task 1.2 markdown import parser bundle (CLI snapshot checks) | VALIDATION_BUNDLE: auto_test_openspec/add-typora-wysiwyg-editor/run-0003__task-1.2__ref-R2__20260219T020933Z | HOW_TO_RUN: run.sh/run.bat
  - EVIDENCE (RUN #3): Supervisor executed CLI validation bundle and verified markdown import parser test suite output | VALIDATED: bash auto_test_openspec/add-typora-wysiwyg-editor/run-0003__task-1.2__ref-R2__20260219T020933Z/run.sh (exit=0) | RESULT: PASS | CLI_EVIDENCE: auto_test_openspec/add-typora-wysiwyg-editor/run-0003__task-1.2__ref-R2__20260219T020933Z/logs/supervisor_run.log, auto_test_openspec/add-typora-wysiwyg-editor/run-0003__task-1.2__ref-R2__20260219T020933Z/outputs/test-output.txt

- [x] 1.3 建立文档模型导出 Markdown 的序列化流程 [#R3]
  - ACCEPT: 导出结果为 UTF-8 Markdown，结构语义与编辑状态一致
  - TEST: SCOPE: CLI
    - 运行序列化测试集，校验输出文本与期望规则一致
  - BUNDLE (RUN #4): Task 1.3 document-model markdown serialization bundle (CLI utf-8 + structural round-trip checks) | VALIDATION_BUNDLE: auto_test_openspec/add-typora-wysiwyg-editor/run-0004__task-1.3__ref-R3__20260219T021520Z | HOW_TO_RUN: run.sh/run.bat
  - EVIDENCE (RUN #4): Supervisor executed CLI serialization bundle and verified utf-8 markdown serialization + round-trip checks | VALIDATED: bash auto_test_openspec/add-typora-wysiwyg-editor/run-0004__task-1.3__ref-R3__20260219T021520Z/run.sh (exit=0) | RESULT: PASS | CLI_EVIDENCE: auto_test_openspec/add-typora-wysiwyg-editor/run-0004__task-1.3__ref-R3__20260219T021520Z/logs/supervisor_run.log, auto_test_openspec/add-typora-wysiwyg-editor/run-0004__task-1.3__ref-R3__20260219T021520Z/outputs/test-output.txt

## 2. 输入规则与可逆编辑
- [x] 2.1 实现块级输入规则（`#`、`-`、`1.`、`>`、代码块） [#R4]
  - ACCEPT: 行首触发后自动结构化，撤销一步可回到触发前状态
  - TEST: SCOPE: MIXED
    - CLI 校验输入规则事务日志；GUI 校验光标位置与结构转换行为
  - EVIDENCE (RUN #5): Supervisor executed mixed validation (CLI + GUI MCP) and verified block input transforms with one-step undo restoration | VALIDATED: bash auto_test_openspec/add-typora-wysiwyg-editor/run-0005__task-2.1__ref-R4__20260219T022608Z/tests/test_cli_block_input_rules.sh (exit=0); bash auto_test_openspec/add-typora-wysiwyg-editor/run-0005__task-2.1__ref-R4__20260219T022608Z/run.sh (server started, URL observed) + MCP playwright assertions for #,-,1.,>,``` transforms and single undo | RESULT: PASS | GUI_EVIDENCE: auto_test_openspec/add-typora-wysiwyg-editor/run-0005__task-2.1__ref-R4__20260219T022608Z/outputs/screenshots/01-before-transform-marker.png, auto_test_openspec/add-typora-wysiwyg-editor/run-0005__task-2.1__ref-R4__20260219T022608Z/outputs/screenshots/02-transformed-block-samples.png, auto_test_openspec/add-typora-wysiwyg-editor/run-0005__task-2.1__ref-R4__20260219T022608Z/outputs/screenshots/03-undo-restored-marker.png, auto_test_openspec/add-typora-wysiwyg-editor/run-0005__task-2.1__ref-R4__20260219T022608Z/outputs/screenshots/04-dual-pane-sync.png | CLI_EVIDENCE: auto_test_openspec/add-typora-wysiwyg-editor/run-0005__task-2.1__ref-R4__20260219T022608Z/logs/supervisor_cli.log
  - BUNDLE (RUN #5): Task 2.1 block-level input rules bundle (MIXED start-server-only + CLI transaction checks) | VALIDATION_BUNDLE: auto_test_openspec/add-typora-wysiwyg-editor/run-0005__task-2.1__ref-R4__20260219T022608Z | HOW_TO_RUN: run.sh/run.bat

- [ ] 2.2 实现行内样式规则（加粗、斜体、行内代码、链接） [#R5]
  - ACCEPT: 闭合触发后渲染正确，编辑光标在样式边界移动不异常
  - TEST: SCOPE: MIXED
    - CLI 校验节点标记变化；GUI 校验样式显示与光标行为

- [ ] 2.3 实现列表/引用/代码块的回车与退格规则 [#R6]
  - ACCEPT: 空列表项回车退出列表，空引用回车退出引用，标题退格回段落
  - TEST: SCOPE: GUI
    - 执行交互回归用例，校验行为与 DoD 一致

- [ ] 2.4 增加 IME 组合输入保护与撤销/重做稳定性 [#R7]
  - ACCEPT: 中文组合输入阶段不误触发结构转换，撤销重做包含结构事务
  - TEST: SCOPE: MIXED
    - CLI 校验事务边界；GUI 校验中文输入与快捷键撤销/重做

## 3. 文件与生产力功能
- [ ] 3.1 实现打开/保存/另存为与未保存状态提示 [#R8]
  - ACCEPT: 支持 `.md/.markdown` 文件显式打开与保存/另存为，`Ctrl/Cmd+S` 可触发保存流程，状态提示准确
  - TEST: SCOPE: MIXED
    - CLI 校验文件读写与编码；GUI 校验菜单/快捷键流程

- [ ] 3.2 实现图片拖拽插入与相对路径资源管理 [#R9]
  - ACCEPT: 拖拽本地图片后生成有效 Markdown 图片引用并在编辑区显示图片（MVP 不做自动复制到 assets）
  - TEST: SCOPE: MIXED
    - CLI 校验资源路径与引用格式；GUI 校验拖拽插入与渲染结果

- [ ] 3.3 实现标题大纲实时生成与定位跳转 [#R10]
  - ACCEPT: 大纲按 H1-H6 实时更新，点击可跳转到对应块
  - TEST: SCOPE: GUI
    - 在多级标题文档中校验大纲刷新与定位准确性

- [ ] 3.4 实现查找/替换与基础编辑快捷键 [#R11]
  - ACCEPT: 普通文本查找、替换当前/全部可用；加粗/斜体/行内代码快捷键生效（正则替换留到 P1）
  - TEST: SCOPE: GUI
    - 执行快捷键与查找替换场景，验证结果符合预期

## 4. 回归与验收基线
- [ ] 4.1 构建 round-trip 与交互 DoD 自动化回归集 [#R12]
  - ACCEPT: 覆盖“打开-编辑-保存-重开”结构等价与核心 10 条 DoD 场景
  - TEST: SCOPE: CLI
    - 运行回归脚本，输出通过率与失败明细供后续验收使用
