## 1. 渲染修复与交互实现

- [x] 1.1 修复 `---` 在 WYSIWYG 模式下渲染为水平分割线的问题 [#R1]
  - ACCEPT: 在编辑区输入 `---` 后可稳定渲染为 `<hr>`，且往返编辑不破坏 Markdown 语义。
  - TEST: SCOPE: MIXED
    - CLI: 运行渲染规则测试，断言 AST 与 DOM 中存在预期 `<hr>` 节点。
    - GUI: 在 WYSIWYG 中输入/删除/撤销 `---`，确认分割线显示与回写文本一致。
  - BUNDLE (RUN #1): Implemented R1 hr rendering + mixed validation assets | VALIDATION_BUNDLE: auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0001__task-1.1__ref-R1__20260221T071726Z | HOW_TO_RUN: run.sh/run.bat
  - EVIDENCE (RUN #1): Supervisor executed MIXED validation and confirmed `---` renders to `<hr>` with dual-pane round-trip stability | VALIDATED: bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0001__task-1.1__ref-R1__20260221T071726Z/tests/test_cli_hr_rendering.sh (exit=0); bash auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0001__task-1.1__ref-R1__20260221T071726Z/run.sh (server started at http://127.0.0.1:33100/) + MCP assertions (`hr` exists in WYSIWYG, dual-pane textarea contains standalone `---`, switch-back keeps `hr`) | RESULT: PASS | GUI_EVIDENCE: auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0001__task-1.1__ref-R1__20260221T071726Z/outputs/screenshots/01-wysiwyg-before-input.png, auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0001__task-1.1__ref-R1__20260221T071726Z/outputs/screenshots/02-hr-rendered.png, auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0001__task-1.1__ref-R1__20260221T071726Z/outputs/screenshots/03-markdown-roundtrip.png, auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0001__task-1.1__ref-R1__20260221T071726Z/outputs/screenshots/04-hr-after-roundtrip.png | CLI_EVIDENCE: auto_test_openspec/update-wysiwyg-rendering-and-ux/run-0001__task-1.1__ref-R1__20260221T071726Z/outputs/cli-hr-rendering.log

- [ ] 1.2 修复数学公式渲染并支持标准 LaTeX 语法 [#R2]
  - ACCEPT: 块级与行内公式可渲染，给定用例 `\[\text{MOM}_{i,t} = \frac{P_{i,t-1}}{P_{i,t-1-N}} - 1\]` 显示正确；若当前引擎无法支持，允许切换到更完整引擎。
  - TEST: SCOPE: MIXED
    - CLI: 执行公式渲染测试，覆盖成功路径与错误回退路径。
    - GUI: 在不同屏幕宽度下验证公式清晰度、比例与无失真显示；失败公式回退为原始 LaTeX 文本。

- [ ] 1.3 实现数学公式点击挂载 Monaco 的交互式编辑能力 [#R3]
  - ACCEPT: 点击公式后在公式上方挂载 Monaco，编辑内容实时驱动公式重渲染；同一时刻仅一个 Monaco 实例；dismiss 后状态正确回写。
  - TEST: SCOPE: GUI
    - 依据 Mermaid/PlantUML `mountMonacoEditors` 生命周期验证 mount/sync/dismiss 全链路。

- [ ] 1.4 优化数学公式渲染性能，避免连续编辑卡顿 [#R4]
  - ACCEPT: 连续输入场景下保持可编辑流畅度，采用防抖渲染；主线程长任务 `< 50ms`。
  - TEST: SCOPE: CLI
    - 运行性能基线脚本，采集公式连续更新的渲染耗时并与阈值比较（按既有验证包流程产出证据）。

## 2. 表格与大纲体验优化

- [ ] 2.1 实现表格溢出自动检测并包裹横向滚动容器 [#R5]
  - ACCEPT: 表格宽度超出可视区域时自动进入 scrollview，横向滚动可用且不影响表格内部纵向滚动。
  - TEST: SCOPE: MIXED
    - CLI: 覆盖 overflow 判定与容器包裹逻辑单元测试。
    - GUI: 通过宽表格验证横纵滚动行为互不冲突。

- [ ] 2.2 为可横向滚动表格提供视觉提示 [#R6]
  - ACCEPT: 用户可感知表格存在横向隐藏内容，使用图标提示且在滚动后状态可更新。
  - TEST: SCOPE: GUI
    - 验证提示在初始态、滚动中、滚动到底状态下显示符合预期。

- [ ] 2.3 将左侧标题大纲长标题改为自动换行并优化可读性 [#R7]
  - ACCEPT: 长标题最多显示 3 行并可读；多行标题具备合理行高、间距与点击区域；层级缩进仍清晰可辨。
  - TEST: SCOPE: GUI
    - 在多级长标题文档中验证换行、大纲层级与定位跳转准确性。

## 3. 布局与响应式联动

- [ ] 3.1 调整左侧大纲贴边与右侧编辑区宽度、居中策略 [#R8]
  - ACCEPT: 大纲贴紧左边缘；编辑区默认目标宽度占可视区 68% 并居中渲染。
  - TEST: SCOPE: GUI
    - 在常见桌面分辨率下检查边距、内容宽度与居中效果。

- [ ] 3.2 实现大纲宽度拖拽与编辑区联动更新 [#R9]
  - ACCEPT: 用户拖拽大纲宽度后，编辑区可用宽度与位置实时同步变化，交互平滑；拖拽状态不做本地持久化。
  - TEST: SCOPE: GUI
    - 覆盖拖拽最小值、最大值、快速拖拽和释放后的稳定状态。

- [ ] 3.3 保证响应式一致性并移除编辑态蓝色高亮框 [#R10]
  - ACCEPT: 不同屏幕尺寸下布局行为一致（移动端采用大纲抽屉）；编辑态不再出现蓝色高亮框且改为轻阴影焦点样式。
  - TEST: SCOPE: MIXED
    - CLI: 样式回归测试断言焦点类名与布局断点配置。
    - GUI: 在桌面与移动断点验证布局与焦点视觉表现（按既有验证包流程执行）。
