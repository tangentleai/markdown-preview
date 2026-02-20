## 1. 快捷键与查找入口
- [x] 1.1 支持 Ctrl+F / Cmd+F 打开查找栏，并在有选区时用纯文本归一化结果填充查找词 [#R1]
  - ACCEPT: 在编辑区无选区触发快捷键可打开查找栏；有选区触发时查找词自动填充归一化文本并立即建立命中索引。
  - TEST: SCOPE: GUI
    - 生成 GUI MCP runbook，覆盖 Ctrl+F 与 Cmd+F、无选区/有选区两类入口行为。
  - BUNDLE (RUN #1): R1 implementation + GUI MCP runbook | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-search-experience/run-0001__task-1.1__ref-R1__20260220T145600Z | HOW_TO_RUN: run.sh/run.bat
  - EVIDENCE (RUN #1): Supervisor executed bundle server and MCP GUI assertions for Ctrl+F/Cmd+F + selection-normalized prefill/indexing | VALIDATED: bash auto_test_openspec/update-wysiwyg-search-experience/run-0001__task-1.1__ref-R1__20260220T145600Z/run.sh (started server on http://127.0.0.1:33100/, background start exit=0); MCP verification result={value:"Alpha beta",counter:"匹配：1/1",editable:true,toolbarHidden:"false",toolbarCount:1} | RESULT: PASS | GUI_EVIDENCE: auto_test_openspec/update-wysiwyg-search-experience/run-0001__task-1.1__ref-R1__20260220T145600Z/outputs/screenshots/01-ctrl-f-toolbar.png, auto_test_openspec/update-wysiwyg-search-experience/run-0001__task-1.1__ref-R1__20260220T145600Z/outputs/screenshots/02-cmd-f-toolbar.png, auto_test_openspec/update-wysiwyg-search-experience/run-0001__task-1.1__ref-R1__20260220T145600Z/outputs/screenshots/03-selection-normalized-and-indexed.png

- [x] 1.2 查找输入框按 Enter 执行“查找下一个”并支持循环回绕 [#R2]
  - ACCEPT: 查找栏聚焦时连续按 Enter，命中序号按下一个推进并在尾部回绕到首个命中。
  - TEST: SCOPE: GUI
    - 生成 GUI MCP runbook，验证连续 Enter 导航与命中计数显示一致。
  - BUNDLE (RUN #2): R2 implementation + GUI MCP runbook | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-search-experience/run-0002__task-1.2__ref-R2__20260220T150536Z | HOW_TO_RUN: run.sh/run.bat
  - BUNDLE (RUN #3): R2 focus-stability fix + GUI MCP runbook | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-search-experience/run-0003__task-1.2__ref-R2__20260220T151504Z | HOW_TO_RUN: run.sh/run.bat
  - EVIDENCE (RUN #3): Supervisor executed retry bundle and validated Enter-driven next navigation with wrap-around from find input focus | VALIDATED: bash auto_test_openspec/update-wysiwyg-search-experience/run-0003__task-1.2__ref-R2__20260220T151504Z/run.sh (started server on http://127.0.0.1:33100/, background start exit=0); MCP verification result={c0:"匹配：0/2",c1:"匹配：1/2",c2:"匹配：2/2",c3:"匹配：1/2",c4:"匹配：2/2",f0:true,f1:true,f2:true,f3:true} | RESULT: PASS | GUI_EVIDENCE: auto_test_openspec/update-wysiwyg-search-experience/run-0003__task-1.2__ref-R2__20260220T151504Z/outputs/screenshots/01-query-entered.png, auto_test_openspec/update-wysiwyg-search-experience/run-0003__task-1.2__ref-R2__20260220T151504Z/outputs/screenshots/02-enter-first.png, auto_test_openspec/update-wysiwyg-search-experience/run-0003__task-1.2__ref-R2__20260220T151504Z/outputs/screenshots/03-enter-second.png, auto_test_openspec/update-wysiwyg-search-experience/run-0003__task-1.2__ref-R2__20260220T151504Z/outputs/screenshots/04-enter-wrap.png

- [x] 1.3 支持 Esc 统一关闭查找栏并恢复编辑焦点 [#R3]
  - ACCEPT: 查找输入框、替换输入框、编辑区焦点三种状态下按 Esc 均关闭查找栏，且编辑区可立即继续输入。
  - TEST: SCOPE: GUI
    - 生成 GUI MCP runbook，验证 Esc 关闭后键入文本不丢失且光标行为正常。
  - BUNDLE (RUN #4): R3 esc close + focus restore GUI runbook | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-search-experience/run-0004__task-1.3__ref-R3__20260220T152615Z | HOW_TO_RUN: run.sh/run.bat
  - BUNDLE (RUN #5): R3 esc close caret-at-end fix + GUI runbook | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-search-experience/run-0005__task-1.3__ref-R3__20260220T153638Z | HOW_TO_RUN: run.sh/run.bat
  - EVIDENCE (RUN #5): Supervisor executed retry bundle and verified Esc closes toolbar from find/replace/editor focus with immediate append typing after focus restore | VALIDATED: bash auto_test_openspec/update-wysiwyg-search-experience/run-0005__task-1.3__ref-R3__20260220T153638Z/run.sh (started server on http://127.0.0.1:33100/, background start exit=0); MCP verification result={h1:"true",h2:"true",h3:"true",f1:true,f2:true,f3:true,t1:"StartA",t2:"StartAB",t3:"StartABC",hasStartA:true,hasStartAB:true,hasStartABC:true} | RESULT: PASS | GUI_EVIDENCE: auto_test_openspec/update-wysiwyg-search-experience/run-0005__task-1.3__ref-R3__20260220T153638Z/outputs/screenshots/01-esc-find-input-starta.png, auto_test_openspec/update-wysiwyg-search-experience/run-0005__task-1.3__ref-R3__20260220T153638Z/outputs/screenshots/02-esc-replace-input-startab.png, auto_test_openspec/update-wysiwyg-search-experience/run-0005__task-1.3__ref-R3__20260220T153638Z/outputs/screenshots/03-esc-editor-focus-startabc.png

## 2. 命中导航、滚动与高亮
- [x] 2.1 新增“查找上一个”按钮并与“查找下一个”形成双向导航 [#R4]
  - ACCEPT: 查找上一个/下一个均支持循环回绕，命中索引方向正确且不会跳过命中项。
  - TEST: SCOPE: GUI
    - 生成 GUI MCP runbook，验证上/下按钮往返导航一致性。
  - BUNDLE (RUN #6): R4 previous/next bidirectional wrap-around navigation + GUI MCP runbook | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-search-experience/run-0006__task-2.1__ref-R4__20260220T154509Z | HOW_TO_RUN: run.sh/run.bat
  - EVIDENCE (RUN #6): Supervisor executed bundle and verified previous/next bidirectional navigation with wrap-around and correct index direction | VALIDATED: bash auto_test_openspec/update-wysiwyg-search-experience/run-0006__task-2.1__ref-R4__20260220T154509Z/run.sh (started server on http://127.0.0.1:33100/, background start exit=0); MCP verification result={c0:"匹配：0/2",c1:"匹配：1/2",c2:"匹配：2/2",c3:"匹配：1/2",c4:"匹配：2/2",c5:"匹配：1/2"} | RESULT: PASS | GUI_EVIDENCE: auto_test_openspec/update-wysiwyg-search-experience/run-0006__task-2.1__ref-R4__20260220T154509Z/outputs/screenshots/00-counter-initial-0of2.png, auto_test_openspec/update-wysiwyg-search-experience/run-0006__task-2.1__ref-R4__20260220T154509Z/outputs/screenshots/01-next-reaches-2of2.png, auto_test_openspec/update-wysiwyg-search-experience/run-0006__task-2.1__ref-R4__20260220T154509Z/outputs/screenshots/02-next-wraps-to-1of2.png, auto_test_openspec/update-wysiwyg-search-experience/run-0006__task-2.1__ref-R4__20260220T154509Z/outputs/screenshots/03-prev-wraps-to-2of2.png, auto_test_openspec/update-wysiwyg-search-experience/run-0006__task-2.1__ref-R4__20260220T154509Z/outputs/screenshots/04-prev-back-to-1of2.png

- [x] 2.2 切换命中时采用最小滚动策略并实现双层高亮 [#R5]
  - ACCEPT: 仅当当前命中不可见时触发滚动；全部命中淡高亮，当前命中强高亮，切换后高亮状态唯一且正确。
  - TEST: SCOPE: GUI
    - 生成 GUI MCP runbook，使用长文档验证滚动触发条件与高亮状态切换。
  - BUNDLE (RUN #7): R5 minimal-scroll navigation + dual-layer match highlighting + GUI MCP runbook | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-search-experience/run-0007__task-2.2__ref-R5__20260220T160342Z | HOW_TO_RUN: run.sh/run.bat
  - BUNDLE (RUN #7): R5 container-viewport minimal-scroll check + unique active-highlight state + GUI MCP runbook | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-search-experience/run-0007__task-2.2__ref-R5__20260220T161832Z | HOW_TO_RUN: run.sh/run.bat
  - BUNDLE (RUN #8): R5 deterministic editor-scrollTop verification + minimal-scroll behavior + dual-layer unique active highlight GUI runbook | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-search-experience/run-0008__task-2.2__ref-R5__20260220T162641Z | HOW_TO_RUN: run.sh/run.bat
  - BUNDLE (RUN #9): R5 natural-layout viewport visibility minimal-scroll + dual-layer unique active highlight GUI runbook | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-search-experience/run-0009__task-2.2__ref-R5__20260220T163508Z | HOW_TO_RUN: run.sh/run.bat
  - EVIDENCE (RUN #9): Supervisor executed retry bundle and verified minimal-scroll under natural expansion layout using page-level viewport metric with correct dual-layer highlight state | VALIDATED: bash auto_test_openspec/update-wysiwyg-search-experience/run-0009__task-2.2__ref-R5__20260220T163508Z/run.sh (started server on http://127.0.0.1:33100/, background start exit=0); MCP verification result={yStart:0,c0:"匹配：0/4",r1:{c:"匹配：1/4",y:0},r2:{c:"匹配：2/4",y:0},r3:{c:"匹配：3/4",y:4460.5},h:{allCount:4,activeCount:1,activeState:"active",nonActiveAll:true}} | RESULT: PASS | GUI_EVIDENCE: auto_test_openspec/update-wysiwyg-search-experience/run-0009__task-2.2__ref-R5__20260220T163508Z/outputs/screenshots/00-counter-initial-0of4.png, auto_test_openspec/update-wysiwyg-search-experience/run-0009__task-2.2__ref-R5__20260220T163508Z/outputs/screenshots/01-visible-hit-no-page-scroll.png, auto_test_openspec/update-wysiwyg-search-experience/run-0009__task-2.2__ref-R5__20260220T163508Z/outputs/screenshots/02-offscreen-hit-page-scroll.png, auto_test_openspec/update-wysiwyg-search-experience/run-0009__task-2.2__ref-R5__20260220T163508Z/outputs/screenshots/03-dual-layer-highlight-unique-active.png

- [ ] 2.3 无匹配时统一展示 0/N 并禁用不可执行操作 [#R6]
  - ACCEPT: 无匹配时显示 `0/N`，查找上一个、查找下一个、替换当前、替换全部按钮均禁用。
  - TEST: SCOPE: GUI
    - 生成 GUI MCP runbook，验证无匹配提示与禁用态一致性。

## 3. 匹配策略与替换行为
- [ ] 3.1 增加区分大小写、整词匹配、正则模式选项并实现联动规则 [#R7]
  - ACCEPT: 支持区分大小写按钮（默认关闭，关闭时始终不区分大小写，开启后强制区分）；支持整词匹配仅对拉丁单词生效；正则模式开启时自动禁用整词匹配。
  - TEST: SCOPE: MIXED
    - CLI: 增加匹配引擎测试（大小写按钮开关、整词拉丁边界、正则 `i/m`、正则与整词互斥）。
    - GUI: 生成 MCP runbook，验证选项切换后的命中数量和命中位置。

- [ ] 3.2 支持正则查找/替换并处理非法表达式 [#R8]
  - ACCEPT: 正则模式支持 JS RegExp（`i/m`，全局由查找流程控制）；非法表达式时给出明确错误提示且不破坏当前编辑状态。
  - TEST: SCOPE: MIXED
    - CLI: 增加合法/非法正则用例，验证匹配与替换输出。
    - GUI: 生成 MCP runbook，验证错误提示、恢复行为与后续正常查找。

## 4. 查找栏 UI 与图标化
- [ ] 4.1 替换功能默认折叠，支持查找/替换模式切换且关闭后重置 [#R9]
  - ACCEPT: 默认仅展示查找区；切换到替换模式后显示替换输入框与替换按钮；关闭查找栏后再次打开重置为默认查找模式。
  - TEST: SCOPE: GUI
    - 生成 GUI MCP runbook，验证模式切换、替换动作、关闭重开重置行为。

- [ ] 4.2 使用 iconfont MCP 替换关键按钮并对齐现有 UI 风格 [#R10]
  - ACCEPT: 查找上一个、查找下一个、替换当前、替换全部、关闭、区分大小写、查找整个单词均使用统一图标；图标按钮具备可访问名称、禁用态、hover/active 一致反馈。
  - TEST: SCOPE: GUI
    - 生成 GUI MCP runbook，验证图标渲染、交互态与可访问性名称。
