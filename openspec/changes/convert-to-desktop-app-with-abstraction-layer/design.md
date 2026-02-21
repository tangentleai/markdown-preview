## Context
当前实现以浏览器环境为默认前提，部分能力直接耦合到 Web API，导致桌面端接入成本高且复用率低。本次设计目标是在不改变核心产品体验的前提下，建立“core + adapter + shell”分层，使前端版与桌面版共享绝大部分业务逻辑。

## Goals / Non-Goals
- Goals:
  - 建立平台无关 core 层，沉淀文档模型、编辑规则、渲染与查找替换能力
  - 提供 Web/Desktop 统一服务接口，隔离文件系统与宿主能力差异
  - 保证双端核心行为一致，可通过自动化测试验证
  - 建立可维护的双端构建流程
  - 支持桌面端文件能力：打开、保存、另存为、最近文件、拖拽打开
  - 桌面端兼容现有 Web 全部编辑能力
- Non-Goals:
  - 不在本次变更中引入云端同步能力
  - 不提供插件系统
  - 不引入移动端适配
  - 不在本次变更中完成 Windows/Linux 正式支持（后续里程碑）

## Decisions
- Decision: 采用三层架构 `core` / `adapters` / `shell`
  - `core`: 纯 TypeScript 业务能力，不依赖 DOM 或 Node 专属 API
  - `adapters`: `web` 与 `desktop` 两套实现，负责平台能力落地
  - `shell`: Web 页面入口与 Desktop 入口，仅负责组合依赖和生命周期
  - Alternatives considered: 保持单体实现并按条件分支扩展；该方案会放大平台判断分支并降低可测试性。

- Decision: 定义平台服务门面（FileService、HostService、ClipboardService）
  - 业务层仅依赖接口，不直接访问 `window`、`fs` 或桌面壳 API
  - Alternatives considered: 让组件直接按平台写分支；该方案会造成 UI 层与平台细节强耦合。

- Decision: 桌面端优先采用 Electron 作为首期落地壳层
  - 复用现有 TypeScript 与 Web 构建资产，降低首期迁移成本
  - Alternatives considered: Tauri；体积更小但需要额外 Rust 生态接入成本。

- Decision: core 层仅作为本项目内部复用模块，不对外承诺独立版本化发布
  - 通过仓内接口契约测试约束演进，不引入额外语义化版本治理成本
  - Alternatives considered: 拆分为外部独立包；当前阶段收益不足且增加发布复杂度

## Data Model
- `DocumentSession`
  - `id` (required): 会话唯一标识
  - `path` (optional): 当前文件绝对路径（未保存文档为空）
  - `content` (required): Markdown 文本内容
  - `isDirty` (required): 未保存修改标识
  - `lastSavedAt` (optional): 最近保存时间戳
- `RecentFile`
  - `path` (required): 最近文件路径
  - `openedAt` (required): 最近打开时间戳

## Interfaces
- `FileService`:
  - `openFile(): Promise<{ path: string; content: string }>`
  - `saveFile(path: string, content: string): Promise<void>`
  - `saveFileAs(content: string): Promise<{ path: string }>`
  - `listRecentFiles(): Promise<Array<{ path: string; openedAt: string }>>`
  - `openFromDragDrop(payload: unknown): Promise<{ path: string; content: string }>`
- `HostService`:
  - `showMessage(level: 'info' | 'warning' | 'error', text: string): void`
  - `setWindowTitle(title: string): void`
- `ClipboardService`:
  - `readText(): Promise<string>`
  - `writeText(value: string): Promise<void>`

## Failure Handling
- 文件不存在、权限不足、保存失败、拖拽内容无效时，统一展示用户可见提示文案。
- 首期不引入自动重试和自动恢复流程，避免与现有行为偏离；失败后由用户再次触发操作。
- `saveFileAs` 取消选择路径时返回可识别的取消结果，不应覆盖现有文件。

## Security
- 当前无新增硬性安全合规要求。
- Assumption: 桌面端沿用 Electron 默认推荐安全实践并在实现阶段最小权限接入本地文件能力。

## Observability
- 记录最小诊断日志：文件操作动作、错误码/错误类型、首次渲染耗时。
- 日志用于本地排障与验收，不引入远程上报链路。

## Compatibility & Platform Plan
- 平台首发：macOS。
- Windows/Linux 作为后续里程碑，要求 adapter 层接口保持可扩展。
- Web 与 Desktop 必须保持现有编辑能力一致，不允许首期能力降级。

## Risks / Trade-offs
- 分层初期会增加目录与接口数量，短期认知成本上升
  - Mitigation: 通过命名约定和示例适配器降低接入门槛
- Electron 包体积较大
  - Mitigation: 首期聚焦功能可用与架构稳定，后续可评估 Tauri 迁移路径
- 双端发布链路增加 CI 时长
  - Mitigation: 拆分并行任务，按变更范围触发对应流水线

## Migration Plan
1. 识别并抽离现有 `src/utils` 中的平台无关能力到 core。
2. 为文件读写与宿主交互定义接口，并提供 Web 实现。
3. 新增 Desktop 入口与 Electron 主/预加载进程，接入 Desktop 实现。
4. 将 App 组合层改为依赖注入方式，按运行环境选择 adapter。
5. 增加 core 单元测试与双端冒烟测试，确保行为一致。
6. 增加 macOS 打包命令并并入统一构建脚本。

## Open Questions
- Open Question: 首次渲染时间阈值最终采用固定阈值还是相对基线阈值？
