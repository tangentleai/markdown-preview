## 1. 架构重构与抽象层
- [x] 1.1 梳理现有业务能力并定义 core 层边界与接口 [#R1]
  - ACCEPT: 形成平台无关能力清单，并定义 `core` 对外接口（至少包含文档模型、渲染管线、查找替换、文件服务契约）
  - TEST: SCOPE: CLI
    - 运行静态检查验证 core 不直接依赖 DOM/Node/Electron API
    - 运行单元测试验证 core 接口契约可被 mock 实现替换
  - EVIDENCE (RUN #1): supervisor executed validation bundle | VALIDATED: bash auto_test_openspec/convert-to-desktop-app-with-abstraction-layer/run-0001__task-1.1__ref-R1__20260221T164451Z/run.sh (exit 0) | RESULT: PASS | ARTIFACT: auto_test_openspec/convert-to-desktop-app-with-abstraction-layer/run-0001__task-1.1__ref-R1__20260221T164451Z/

- [ ] 1.2 抽离并迁移共享逻辑到 core 层 [#R2]
  - ACCEPT: 现有前端版核心逻辑通过 core 层调用，原功能行为不回退
  - TEST: SCOPE: MIXED
    - CLI: 运行 `npm run test`，验证核心测试全部通过
    - GUI: 启动 Web 版本，执行 MCP runbook 验证编辑、预览、查找替换关键路径

## 2. 平台适配层与桌面壳
- [ ] 2.1 实现 Web/Desktop 双平台 adapter [#R3]
  - ACCEPT: `web` 与 `desktop` adapter 均实现统一接口，业务层无平台分支
  - TEST: SCOPE: CLI
    - 运行类型检查与 adapter 契约测试
    - 验证 adapter 替换时 core 测试可复用且通过

- [ ] 2.2 接入桌面壳并打通最小可用流程（打开、编辑、预览、保存） [#R4]
  - ACCEPT: 桌面应用可本地运行并完成文档打开、编辑、预览、保存、另存为、最近文件、拖拽打开闭环
  - TEST: SCOPE: GUI
    - 运行桌面应用启动脚本
    - 按 MCP runbook 完成文件打开、编辑保存、另存为、最近文件入口回放、拖拽打开校验
    - 重新打开文件并校验内容一致

## 3. 构建与一致性保障
- [ ] 3.1 建立 Web/Desktop 双端构建与验证脚本 [#R5]
  - ACCEPT: 提供统一命令同时支持 Web 构建与桌面打包，失败时返回非零退出码
  - TEST: SCOPE: CLI
    - 运行 Web 构建命令并验证产物存在
    - 运行桌面打包命令并验证安装包或可执行产物生成

- [ ] 3.2 增加双端一致性回归测试 [#R6]
  - ACCEPT: 同一 Markdown 输入在 Web/Desktop 的渲染结果与关键编辑行为保持一致，且不缺失现有 Web 编辑能力
  - TEST: SCOPE: MIXED
    - CLI: 运行一致性测试脚本，比对核心输出快照或规则断言
    - GUI: 按 MCP runbook 在双端执行关键操作并记录截图证据点

- [ ] 3.3 增加首次渲染时间采集与门禁 [#R7]
  - ACCEPT: 在 Web 与 Desktop 运行中可采集首次渲染时间，并在测试中输出可审计结果
  - TEST: SCOPE: CLI
    - 运行性能采集脚本并输出首屏渲染耗时日志
    - 若阈值未确定，按基线对比策略输出“未退化”判定结果
