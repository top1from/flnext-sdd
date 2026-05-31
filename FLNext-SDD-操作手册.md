# FLNext-SDD v4.0.0 操作手册

> 基于 Claude Code 的规格驱动开发（Spec-Driven Development）工作流框架
> 适用对象：新人入门、团队培训

---

## 目录

1. [框架概述](#一框架概述)
2. [核心设计机制](#二核心设计机制)
3. [流程机制](#三流程机制)
4. [从 0 到 1 开发新项目](#四从-0-到-1-开发新项目)
5. [老项目接入 SDD](#五老项目接入-sdd)
6. [日常功能迭代](#六日常功能迭代)
7. [紧急 Bug 修复](#七紧急-bug-修复)
8. [命令速查](#八命令速查)
9. [常见问题](#九常见问题)
10. [纯后端项目配置](#211-纯后端项目配置)

---

## 一、框架概述

### 什么是 FLNext-SDD？

FLNext-SDD 是一套在 Claude Code 中运行的 **规格驱动开发工作流**。它把软件开发拆成 13 个严格有序的阶段，每个阶段：
- 有明确的输入文档（上一阶段的产出）
- 有明确的输出文档（给下一阶段使用）
- 必须通过人工确认才能进入下一阶段
- 代码写之前，规格先写好

### 一句话理解

```
需求不确定 → 不设计 → 不编码 → 不提测
```

### 和其他 SDD 框架的区别

| 维度 | FLNext-SDD | 其他框架 |
|------|-----------|----------|
| 阶段数 | 13（最完整） | 5-9 |
| 编译验证 | 前后端独立编译门禁 | 大多数没有 |
| 老项目支持 | 有 Discovery 阶段自动扫描 | 多数不支持 |
| 验收/发布 | 有独立阶段 + Beta 分支 | 多数没有 |
| AI 行为约束 | 14 条宪法规原则 | 多数没有 |
| AI 代码自检 | 提测前 9 大类约 40 项强制自检 | 多数没有 |
| 钉钉需求联动 | 需求/验收阶段自动读写钉钉AI表格 | 多数没有 |
| 3 级评估管道 | 机械检查→语义检查→交叉验证 | 多数没有 |
| Delta 增量变更 | 需求变更不重写文档，增量记录 | 多数没有 |

---

## 二、核心设计机制

### 2.1 14 条宪法规原则

| # | 原则 | 含义 |
|---|------|------|
| 1 | **规范先行** | 代码实现必须在规范文档完成后才能开始 |
| 2 | **门控确认** | 每个阶段必须人工确认才能进入下一阶段 |
| 3 | **后端优先** | 先写后端 API，再写前端界面 |
| 4 | **双编译门禁** | 后端编译通过 + 前端编译通过，两道坎 |
| 5 | **测试驱动** | 测试用例先于功能测试编写 |
| 6 | **提测规范** | 通过 rebase + MR/PR 合并到 develop（兼容 GitLab / GitHub）|
| 7 | **禁止私自变技术** | 数据库连不上不能偷偷换 SQLite，必须报告等确认 |
| 8 | **对抗性评审** | 评审必须发现问题，零发现 = 拒绝 |
| 9 | **测试真实性** | 声称"通过"前必须先编译通过，测试期间不能改业务代码 |
| 10 | **Discovery 优先** | 老项目必须先扫描代码库，理解现状 |
| 11 | **认知锚定** | 每 5 步复述核心约束，防止长会话遗忘 |
| 12 | **决策血缘** | 重大技术决策必须记录决策依据和替代方案 |
| 13 | **熔断机制** | 连续 3 次违规自动暂停，强制合规审查 |
| 14 | **集成门控** | Phase A/B 同时 PASSED + 全栈联调才能提测 |

### 2.2 5 状态机

每个阶段都遵循同一个状态机：

```
PENDING  ──用户启动──▶  IN_PROGRESS  ──工作完成──▶  AWAITING_CONFIRMATION  ──用户确认──▶  CONFIRMED
    │                                                                                    │
    │                                                                     用户要求修改    │
    │                                                                                    ▼
    └────────────────────────── SKIPPED（纯后端自动跳过）                    IN_PROGRESS（返工）
                                                                                        │
                                                                          项目完成       ▼
                                                                                    COMPLETE（最终阶段）
```

- **CONFIRMED 不可回退**（除非整体回滚）
- **SKIPPED**：因项目配置（如 `backend_only`）自动跳过的阶段，不参与门控检查，等同于已通过
- 只接受严格确认词：`确认` / `confirm` / `yes` / `Y`
- `ok`、`好的`、`嗯` 不能通过门控

### 2.3 双编译门禁

整个开发流程有两道强制编译检查：

```
Phase A（后端开发完成后）
  → npm run build / mvn compile
  → 失败 = 停止，等待人工
  → 禁止 AI 自动修复

Phase B（前端开发完成后）
  → npm run build / yarn build
  → 失败 = 停止，等待人工
  → 禁止 AI 自动修复
```

### 2.4 严格确认词

```
✅ 确认 = "确认" / "confirm" / "yes" / "Y"
✅ 修改 = "N" / "no" / "需要修改"
✅ 保存 = "S" / "save" / "保存进度"
❌ 无效 = "ok" / "好的" / "嗯" / "looks good"
```

### 2.5 7-Wave 开发编排

后端和前端开发不是一口气写完，而是分成 7 个 Wave 并行推进：

```
后端开发（阶段 4）:
  Wave 1  数据库迁移           （串行，先跑通数据库）
  Wave 2  Entity + DTO         （并行，数据模型）
  Wave 3  Repository+Service+Controller  （并行，核心逻辑）
  Wave 4  后端测试 + API Client 类型    （B-08, B-09 并行，验证+给前端输出类型定义）
  ──── Phase A 编译门禁 ────

前端开发（阶段 5）:
  Wave 5  共享组件             （并行）
  Wave 6  页面 + 状态 + 路由   （并行）
  Wave 7  验证 + 错误处理      （并行）
  ──── Phase B 编译门禁 ────
```

### 2.6 对抗性评审

架构评审不是形式化地看一看，而是 **必须发现问题**：

- 零发现 = 评审不通过，重新审查
- 每个发现分级：BLOCKER（阻塞）/ WARNING（警告）/ SUGGESTION（建议）
- 评审者被要求问："缺少了什么？" 而不仅仅是"有什么问题？"

### 2.7 AI 代码自检清单

提测前 AI 必须对自己的代码执行自检，防止低级错误进入 MR。

**9 大检查类别**：

| 类别 | 检查项数 | 典型问题 |
|------|---------|---------|
| 性能与复杂度 | 6 | N+1 查询、嵌套循环、100 倍数据崩不崩 |
| 数据库与存储 | 6 | 无索引的 WHERE、循环内 SQL、长事务 |
| 外部 API 与网络 | 5 | 无超时、无重试、无降级 |
| 并发与线程安全 | 5 | 共享状态无锁、竞态条件、死锁 |
| 安全 | 7 | SQL 注入、XSS、明文密码、缺认证 |
| 错误处理与韧性 | 5 | 空 catch、资源泄漏、空指针 |
| 代码质量 | 5 | 命名不一致、过长函数、魔法数字 |
| 前端专项 | 5 | 缺 4 状态、大列表无虚拟滚动、内存泄漏 |
| 跨阶段一致性 ★v4.0 | 10 | 范围蔓延、越界实现、API不一致、私改技术选型、逻辑矛盾 |

**判定规则**：
- ✅ = 通过
- ⚠️ = 需关注（标注在 MR 中，人工判断）
- ❌ = 不通过（必须修复，给出文件路径+行号+建议）

**结果**：自检报告自动附在 MR/PR 描述中，供审查者参考。

### 2.8 3 级渐进式评估管道

测试和评审不只是"编译通过"，而是采用 3 级渐进式评估：

```
Level 1: Mechanical   → 机械检查（编译、Lint、静态分析）
Level 2: Semantic      → 语义检查（API 匹配、需求覆盖、边界）
Level 3: Consensus     → 交叉验证（多角度审查）
```

| Level | 成本 | 时机 | 检查内容 |
|-------|------|------|----------|
| L1 机械检查 | $0 | 测试/编译门禁时 | 编译、类型检查、Lint、测试通过、覆盖率 > 70% |
| L2 语义检查 | $$ | L1 通过后 | AC 合规、需求覆盖、边界处理、命名一致、漂移检测 |
| L3 交叉验证 | $$$ | L2 不确定性 > 0.3 | 架构师 + QA + 反对者三角色投票，需 2/3 多数通过 |

**评估流程**：
```
L1 失败 → 停止，人工介入
L1 通过 → L2 评分
  L2 < 0.5 → REWORK（返回开发）
  L2 0.5-0.8 → 人工确认
  L2 >= 0.8 且不确定性 <= 0.3 → PASS
  L2 >= 0.8 且不确定性 > 0.3 → L3 交叉验证
    L3 通过 → PASS
    L3 不通过 → REWORK
```

### 2.9 Delta 增量变更模型

需求变更时，**不要重写整个文档**，使用 Delta 增量记录：

```
原规格文档（source of truth）
    +
Delta 变更记录（ADDED/MODIFIED/REMOVED/RENAMED）
    =
更新后的规格文档
```

**四种 Delta 操作**：
- **ADDED** — 新增需求或章节
- **MODIFIED** — 修改已有需求（含 before/after）
- **REMOVED** — 删除需求（须含原因）
- **RENAMED** — 重命名 ID（保持可追溯性）

**使用方式**：
```bash
# 在 Claude Code 中使用
/flnext-sdd-delta

# 或使用 CLI 命令（自动检测冲突 + 自动应用 ADDED 操作）
npx flnext-sdd --delta-merge --feature {功能名}
```

> **自动合并**：无冲突的 ADDED 操作会自动应用到主规格文档。MODIFIED 和 REMOVED 操作需人工确认后更新。

**Delta 文件格式**（存放在 `docs/sdd/{功能名}/deltas/`）：
```markdown
# Delta: {变更描述}

> 变更类型: 需求变更
> 日期: 2026-05-31
> 影响阶段: 4-后端, 5-前端

## MODIFIED
### FR-003: 统计数据增加搜索筛选
- 原描述: 仅支持查看访问次数
- 修改为: 支持按日期范围和来源筛选
- 修改原因: 用户反馈需要更细粒度的统计

## ADDED
### FR-004: 搜索框自动补全
- 描述: 输入时自动提示历史搜索词
- 优先级: P2
```

### 2.10 禁止事项（AI 不能做的）

| AI 不能做的事 | 为什么 |
|-------------|--------|
| 跳过阶段直接写代码 | 违反规范先行 |
| 数据库连不上就换 SQLite | 违反禁止私变技术 |
| 编译失败后自动修 | 违反双编译门禁 |
| 测试阶段改业务代码 | 违反测试真实性 |
| "联调通过"但没编译 | 违反测试真实性 |
| 说 ok 就算确认 | 违反严格确认词 |

### 2.11 纯后端项目配置

对于纯后端项目（无前端代码），可以配置自动跳过前端阶段：

**配置方式**：

1. **自动检测**：安装时 CLI 自动检测是否为纯后端项目
2. **手动配置**：在 `config.yaml` 中设置 `backend_only: true`
3. **STATE 标记**：`project_backend_only: true`

**自动跳过的阶段**：

| 阶段 | 处理方式 |
|------|----------|
| 阶段5 前端开发 | 自动跳过，标记 SKIPPED |
| Phase B 编译门禁 | 自动跳过，标记 SKIPPED |
| 阶段6 测试用例 | 聚焦后端：API 端点测试、数据库测试、业务逻辑测试；跳过 UI 交互测试 |
| 阶段7 功能测试 | 编译复检仅后端；测试聚焦 API/数据库/业务逻辑 |
| 阶段7b 集成门控 | 仅验证 Phase A，Phase B 自动跳过 |
| 自检类别 | 自动排除 `frontend` 类别 |

**示例**：
```yaml
# config.yaml
project_type: "brownfield"
backend_only: true  # 纯后端项目

# STATE.md
project_backend_only: true
```

**使用场景**：
- 纯 REST API 项目
- 微服务后端
- CLI 工具
- 数据处理服务

---

## 三、流程机制

### 3.1 标准流程（13 阶段）

```
阶段 0:  Discovery      — 代码库扫描（仅老项目）
阶段 1:  需求讨论        — 确定要做什么
阶段 2:  原型设计        — 界面长什么样
阶段 3:  架构设计        — 怎么实现 + ADR 决策记录
阶段 3b: 架构评审        — 对抗性审查（必须发现问题）
阶段 4:  后端开发        — Wave 1-4 + Phase A 编译
阶段 5:  前端开发        — Wave 5-7 + Phase B 编译
阶段 6:  测试用例        — 列出所有要测的
阶段 7:  功能测试        — 编译复检 + 执行测试
阶段 7b: 集成门控        — Phase A/B 同时 PASSED + 全栈联调
阶段 8:  提测            — rebase develop → MR/PR（兼容 GitLab / GitHub）
阶段 9:  验收            — Beta 分支 + 人工验收
阶段 10: 发布            — merge main + 打版本标签
```

### 3.2 每个阶段的通用步骤

1. **读取前置条件** — 确认上一阶段已 CONFIRMED
2. **执行阶段工作** — 按 steps/ 目录下的步骤文件执行
3. **输出文档** — 生成阶段产出物到 `docs/sdd/`
4. **等待确认** — 展示成果，等待严格确认词
5. **更新状态** — 更新 STATE.md

### 3.3 功能隔离机制

**每个功能/需求在 `docs/sdd/` 下生成独立子目录**，不同需求互不覆盖：

```
docs/sdd/
├── project-context.md      ← 项目级（Discovery 产出，全局共享）
├── tech-stack.md           ← 项目级
├── architecture-map.md     ← 项目级
│
├── short-url/              ← 功能1: 短链接系统（独立）
│   ├── requirement-scope.md
│   ├── prototype.md / .html / prd.md
│   └── ...
│
├── user-auth/              ← 功能2: 用户认证（独立）
│   └── ...
│
└── admin-dashboard/        ← 功能3: 管理后台（独立）
    └── ...
```

**新功能开始时会自动创建 `docs/sdd/{功能名}/` 目录，不会覆盖已有功能的文档。**

### 3.4 Git 分支策略（AI 编程简化版）

**传统 7 种分支 → FLNext-SDD 5 种分支：**

```
传统手动                         FLNext-SDD AI 自动化
────────                         ────────────────────
feature/xxxx     ────────▶       feature/{dev}-{name}
develop          ────────▶       develop (保护分支)
release/xxxx     ── 合并 ──▶     (被 beta 替代)
beta/xxxx        ────────▶       beta/{version}
master           ────────▶       main
rel-xxxx tag     ── 合并 ──▶     v{version} tag
hotfix/xxxx      ────────▶       hotfix/{dev}-{desc}
```

```
main                       ← 🔒 生产环境（保护分支，只接受从 develop 合并）
├── develop                ← 🔒 开发集成（保护分支，只接受 MR）
│   ├── feature/{dev}-{name}  ← 功能开发（Phase 4-7）
│   └── hotfix/{dev}-{desc}   ← 紧急修复（/flnext-sdd-quick）
└── beta/{version}         ← 验收环境（Phase 9，临时分支）
```

**对比 7 个开源项目**：无一超过 3 种分支。FLNext-SDD 的 5 种已是最精简可落地方案。

| 分支类型 | 创建时机 | 删除时机 |
|---------|---------|---------|
| `feature/{dev}-{name}` | Phase 4 开始编码 | Phase 8 MR 合并后 |
| `hotfix/{dev}-{desc}` | `/flnext-sdd-quick` | 合入 develop+main 后 |
| `develop` | 项目初始化 | 永不删除（保护分支） |
| `beta/{version}` | Phase 9 验收 | 验收通过后 |
| `main` | 项目初始化 | 永不删除（保护分支） |

**保护分支规则（Git 平台配置）**：

| 分支 | 允许推送 | 允许合并 | 合并方式 |
|------|---------|---------|---------|
| `main` | ❌ | maintainer | MR/PR |
| `develop` | ❌ | maintainer | MR/PR |
| `feature/*` | ✅ | 开发者 | — |
| `hotfix/*` | ✅ | maintainer | MR/PR |
| `beta/*` | ✅ | QA/PM | — |

---

## 四、从 0 到 1 开发新项目

### 第一步：安装框架

**方式一：npx（推荐）**
```bash
npx flnext-sdd@latest
```

**方式二：从 GitHub 安装**
```bash
git clone https://github.com/top1from/flnext-sdd.git
cd flnext-sdd/.flnext-sdd
# Windows
powershell -File install.ps1 -ProjectName "my-project" -TargetDir "../.."
# Linux/macOS
bash install.sh --name "my-project" --target "../.."
```

安装后目录结构：

```
my-project/
├── .flnext-sdd/         ← 框架文件
├── STATE.md             ← 项目状态
└── .gitignore           ← 已配置
```

### 第二步：启动 Claude Code

```bash
cd my-project
claude
```

### 第三步：执行阶段 1 — 需求讨论

```
在 Claude Code 中输入: /flnext-sdd-requirement
```

**自动联动钉钉AI表格**：AI 会自动查询"AI 产研需求管理"表格中你的待排期需求：

```
AI: 正在从钉钉AI表格获取您的待排期需求...

📋 您的待排期需求列表：

| # | 需求编号    | 需求名称              | 优先级          |
|---|-----------|---------------------|----------------|
| 1 | fl-t-0006 | FLNEXT 店铺地址切换   | P1重要但不紧急   |

请选择要开始的需求编号（输入序号或需求编号），或输入 M 手动输入需求。

你: 1

AI: 已选择需求 fl-t-0006: FLNEXT 店铺地址切换
    需求详情已从钉钉表格获取，开始需求讨论。
```

选择需求后，AI 会像产品经理一样和你对话：

```
AI: 根据钉钉需求管理中的记录，本需求是：FLNEXT 店铺地址切换。
    请补充更多业务背景：这个功能的主要目标用户是谁？

你: 我想做一个短链接系统。

AI: （追问）那主要用户是谁？有哪些核心场景？
   1. 创建短链接
   2. 访问短链接跳转
   3. 查看统计数据
   还有其他吗？

你: 就这三个核心场景。

AI: （继续细化）创建短链接时，需要区分用户吗？
    需要设置有效期吗？统计需要哪些维度的数据？

...（多轮对话后）

AI: 📋 需求边界确认

    In Scope（本次要做）:
    - FR-001: 用户输入原始URL，生成短链接
    - FR-002: 访问短链接时自动跳转到原始URL
    - FR-003: 查看短链接的访问次数统计

    Out of Scope（本次不做）:
    - 用户注册/登录
    - 自定义短链接后缀
    - 批量生成短链接

    优先级:
    P1: FR-001, FR-002
    P2: FR-003

    请确认: "确认" / "需要修改"

你: 确认
```

AI 自动回传 AI开始时间到钉钉表格，产出：`docs/sdd/requirement-scope.md`

### 第四步：阶段 2 — 原型设计

```
在 Claude Code 中输入: /flnext-sdd-prototype
```

AI 会：
1. 根据需求文档生成 HTML 原型页面
2. 在浏览器中展示原型让你预览
3. 根据你的反馈调整
4. 确认后生成 PRD 文档

产出：`docs/sdd/prototype.md` + `docs/sdd/prototype.html` + `docs/sdd/prd.md`

### 第五步：阶段 3 — 架构设计

```
在 Claude Code 中输入: /flnext-sdd-architecture
```

AI 会：
1. 设计 Clean Architecture 分层架构
2. **输出 ADR（架构决策记录）**：
   - ADR-001: 数据库选 Postgres 还是 MySQL？为什么？
   - ADR-002: API 用 REST 还是 GraphQL？
   - ADR-003: 认证用 JWT 还是 Session？
3. 每个 ADR 必须包含"如果选错了会怎样"
4. 设计数据库表结构

产出：`docs/sdd/architecture.md` + `docs/sdd/database.md` + `docs/sdd/adr/` 目录

### 第六步：阶段 3b — 架构评审

```
在 Claude Code 中输入: /flnext-sdd-arch-review
```

**对抗性评审**，AI 必须找到至少一个问题：

```
AI: 对抗性架构评审报告

    BLOCKER: 无

    WARNING (2):
    1. ADR-001 选择了 PostgreSQL，但未说明连接池配置
    2. API 设计中缺少限流策略

    SUGGESTION (1):
    1. 建议为短链接生成增加分布式 ID 方案作为扩展考量

    评审结论: PASS

你: 确认
```

**Level 3 多角色交叉验证**：

架构评审自动触发三角色审查：

```
┌─────────────────────────────────────┐
│  Level 3: 多角色交叉验证            │
│                                     │
│  架构师 (Atlas) — 技术合理性        │
│  QA (Hawk) — 边界和异常覆盖        │
│  反对者 (Shadow) — 挑战所有假设     │
│                                     │
│  投票规则: 2/3 多数通过             │
│  一票否决 = REWORK                  │
└─────────────────────────────────────┘
```

产出：`docs/sdd/review-report.md`

### 第七步：阶段 4 — 后端开发

```
在 Claude Code 中输入: /flnext-sdd-backend
```

AI 会按 7-Wave 编排执行：

```
Wave 1: 检查数据库连接 → 创建迁移脚本 → 建表
Wave 2: 创建 Entity + DTO（子代理并行）
Wave 3: 创建 Repository + Service + Controller（子代理并行）
Wave 4: 后端测试 + API Client 类型

── Phase A 编译门禁 ──
→ npm run build
→ ✅ 编译通过
```

**关键检查点**：如果数据库连不上：
```
AI: 🚨 数据库连接失败

    错误: connection refused
    目标: PostgreSQL 16 @ localhost:5432

    不能私自换成 SQLite。
    请选择: A) 修复连接配置  B) 启动数据库  C) 确认后切换

你: A，连接串改成 localhost:5433
AI: 已修改，重连成功 ✅
```

产出：后端代码 + `docs/sdd/api-design.md`

### 第八步：阶段 5 — 前端开发

```
在 Claude Code 中输入: /flnext-sdd-frontend
```

```
Wave 5: 共享组件
Wave 6: 页面 + 状态 + 路由
Wave 7: 表单验证 + 错误处理

── Phase B 编译门禁 ──
→ npm run build
→ ✅ 编译通过
```

产出：前端代码 + `docs/sdd/ui-spec.md`

### 第九步：阶段 6 — 测试用例

```
在 Claude Code 中输入: /flnext-sdd-testcase
```

产出：`docs/sdd/testcase.md`（包含功能测试用例 + 边界测试用例 + 可追溯矩阵）

### 第十步：阶段 7 — 功能测试

```
在 Claude Code 中输入: /flnext-sdd-testing
```

**这一步有三个强制要求**：

1. **编译复检**：先 `npm run build`，编译不通过就不开始测试
2. **交叉连接验证**：检查后端 API 是否真的被前端调用了
3. **实现代码只读**：测试阶段不能改业务代码，发现 Bug → 上报

**3 级评估管道**：

```
L1 机械检查 → 编译、Lint、测试通过、覆盖率 > 70%
    │
    ▼ 通过
L2 语义检查 → AC 合规、需求覆盖、边界处理
    │
    ├── >= 0.8 且不确定性 <= 0.3 → PASS
    │
    └── >= 0.8 且不确定性 > 0.3 → L3 交叉验证
                                      │
                                ──不通过──▶ REWORK
                                      │
                                      通过
                                      ▼
                                    PASS
```

产出：`docs/sdd/{feature_name}/test-report.md`

### 第十一步：阶段 7b — 集成门控

```
在 Claude Code 中输入: /flnext-sdd-integration-gate
```

**提测前的最后一道硬门控**，验证：

1. Phase A（后端）与 Phase B（前端）编译门禁**同时**为 PASSED
2. 全栈干净构建通过
3. 前端真实调用后端 API（非 mock）
4. 3–5 个核心用户流程端到端通过

任一失败 → 路由回对应开发/测试阶段，**不得**直接提测。

产出：`docs/sdd/{feature_name}/integration-gate-report.md`

### 第十二步：阶段 8 — 提测

```
在 Claude Code 中输入: /flnext-sdd-submit
```

Git 操作顺序（严格按照你的工作习惯）：

```bash
# 1. 确认在 feature 分支
git branch --show-current       # feature/qinhaijun-short-url

# 2. 提交所有更改
git add . && git commit -m "feat: 短链接系统开发完成"

# 3. 拉取 develop 最新
git checkout develop && git pull origin develop

# 4. Rebase feature 到 develop
git checkout feature/qinhaijun-short-url
git rebase develop

# 5. 解决冲突（如有）
git add <冲突文件> && git rebase --continue

# 6. AI 代码自检（强制）
# AI 读取 .flnext-sdd/references/ai-self-check.md
# 对变更代码逐条检查：性能/数据库/安全/并发/错误处理
# ❌ 不通过 → 必须修复后才能继续
# ⚠️ 需关注 → 标注在 MR 描述中

# 7. 推送 feature 分支
git push origin feature/qinhaijun-short-url

# 8. 创建 MR/PR（附自检报告）
# GitLab: Merge Requests → Source: feature/xxx → Target: develop
# GitHub: Pull Requests → base: develop ← compare: feature/xxx
# Description: 包含 SDD 追溯 + AI 自检报告
```

> **AI 自检清单**：提测前 AI 必须对代码进行 9 大类自检（含第 9 类跨阶段一致性）。❌ 项必须修复，⚠️ 项标注在 MR/PR 中供审查者判断。详见 `.flnext-sdd/references/ai-self-check.md`。

产出：`docs/sdd/{feature_name}/SUBMISSION.md` + MR/PR 链接（含自检报告）

### 第十三步：阶段 9 — 验收

```
在 Claude Code 中输入: /flnext-sdd-accept
```

AI 会：
1. 基于 develop 创建 `beta/v1.0` 分支
2. 部署到测试验收环境
3. 对照需求边界逐一验证功能
4. 生成验收报告
5. **自动回传 AI结束时间到钉钉AI表格**

验收通过后，AI 自动将结束时间写入钉钉"AI 产研需求管理"表格的 AI结束时间字段，与阶段 1 的 AI开始时间形成完整的开发时间记录。

产出：`docs/sdd/{feature_name}/acceptance-report.md`

### 第十四步：阶段 10 — 发布

```
在 Claude Code 中输入: /flnext-sdd-release
```

```bash
git checkout main
git merge develop --no-ff -m "release: v1.0"
git tag -a v1.0
git push origin main --tags
```

发布后进行 Wonder→Reflect 回顾：
- 这次学到了什么？
- 哪个阶段最耗时？
- 有没有可以改进的流程？

产出：`docs/sdd/{feature_name}/RELEASE-NOTES.md`

---

## 五、老项目接入 SDD

### 场景

你有一个已经存在的项目，想用 FLNext-SDD 来管理后续开发。

### 第一步：安装框架到项目目录

```bash
cd your-existing-project
npx flnext-sdd@latest
```

安装脚本会自动检测到这是一个 **老项目（Brownfield）**：
- 检测到 `package.json` → 判断为 Node.js 项目
- 检测到 `pom.xml` → 判断为 Java 项目
- 检测到 `go.mod` → 判断为 Go 项目
- 等等

### 第二步：执行 Discovery

```
在 Claude Code 中输入: /flnext-sdd-discovery
```

**这是老项目必须做的第一步**。AI 会启动 4 个 Agent 并行扫描代码库：

```
Tech Agent:    扫技术栈 → 用什么语言、框架、数据库
Arch Agent:    扫架构   → 目录结构、分层、模块依赖
Quality Agent: 扫质量   → 代码规范、测试覆盖率、技术债务
Concerns Agent: 扫风险   → 已知问题、安全隐患、性能瓶颈
```

扫描完成后生成 `docs/sdd/project-context.md`：
```
项目: your-existing-project
技术栈: Node.js 18 + Express + PostgreSQL 14
架构: MVC 三层
数据库: PostgreSQL, 12 张表
测试: Jest, 覆盖率 45%
风险: 无 API 文档, 无 CI/CD, 3 个已知 Bug
```

### 第三步：正常开发

Discovery 完成后，后续和"从 0 到 1"一样，从阶段 1（需求讨论）开始：

```
/flnext-sdd-requirement   → 需求讨论
/flnext-sdd-prototype     → 原型设计
/flnext-sdd-architecture  → 架构设计
...（后续阶段和新项目完全一样）
```

和老项目的区别：
- 架构阶段会基于 project-context.md 复用现有技术栈
- 不会轻易建议换框架/数据库
- 如果偏离超过 20%，会触发 Drift 警告

---

## 六、日常功能迭代

### 场景

项目已经上线，需要加一个新功能。

### 第一步：评估变更范围

```
在 Claude Code 中输入: /flnext-sdd-status
```

先看看当前项目处于什么状态：

```
0. Discovery       ✅ CONFIRMED
1. 需求讨论        ✅ CONFIRMED（上次）
... 
10. 发布           ✅ COMPLETE（v1.0）
```

### 第二步：如果是小变更，走快速通道

修改文件 < 10 个 → 适合快速通道：

```
在 Claude Code 中输入: /flnext-sdd-quick
```

```
AI: 这个修改的范围是什么？

你: 给短链接列表加一个搜索框。

AI: 评估: 预计修改 3 个文件，适合快速通道。
    → 快速设计 → 快速编码 → 快速测试 → 提测
```

快速通道跳过了需求讨论、原型、架构评审，直接进入编码。

### 第三步：如果是大变更，走标准流程

修改文件 > 10 个 → 走完整流程：

```
/flnext-sdd-requirement   → 从钉钉获取待排期需求，讨论新功能的需求
/flnext-sdd-prototype     → 只设计新功能的原型
/flnext-sdd-architecture  → 基于 project-context.md，不换技术栈
/flnext-sdd-arch-review   → 对抗性评审
/flnext-sdd-backend       → 在新 feature 分支上开发
/flnext-sdd-frontend      → 前端开发
...
/flnext-sdd-release       → 发布新版本
```

### 第四步：需求变更时用 Delta 模型

如果开发到一半需求变了，**不要重写整个文档**。使用 Delta 增量记录：

```
在 docs/sdd/deltas/ 目录下创建变更记录：

2026-05-10-add-search.md:
  MODIFIED FR-003: 统计数据增加搜索筛选
  ADDED FR-004: 搜索框自动补全
```

---

## 七、紧急 Bug 修复

### 场景

线上出了 Bug，需要快速修复。

```
在 Claude Code 中输入: /flnext-sdd-quick
```

```
AI: 快速通道 — 请描述要修复的 Bug

你: 短链接跳转时如果目标 URL 没有 http:// 前缀会报错

AI: 分析:
    - 修改文件: 2 个 (redirect.ts + url-utils.ts)
    - 适合快速通道 ✅
    → 快速设计 → 快速编码（仍走 Phase A/B 编译）→ 快速测试 → 提测
```

**快速通道保留的门控**：
- ✅ 双编译门禁仍然强制
- ✅ AI 自检仍然强制
- ✅ rebase + MR/PR 提测流程不变
- ✅ hotfix 合入 develop 后还需挑到 main
- ❌ 跳过需求文档、原型、架构评审

**hotfix 合并流程**：
```bash
# hotfix 在 /flnext-sdd-quick 完成后：
git checkout develop && git merge hotfix/{dev}-{desc}
git checkout main && git merge hotfix/{dev}-{desc}
git tag -a v{version}.{patch}
git branch -d hotfix/{dev}-{desc}
```

---

## 八、命令速查

### 主流程命令

| 命令 | 作用 | 什么时候用 |
|------|------|-----------|
| `/flnext-sdd-discovery` | 扫描老项目代码库 | 老项目接入第一步 |
| `/flnext-sdd-requirement` | 需求讨论（自动获取钉钉待排期需求） | 开始一个新功能 |
| `/flnext-sdd-prototype` | HTML 原型设计 | 需求确认后 |
| `/flnext-sdd-architecture` | 架构设计 + ADR | 原型确认后 |
| `/flnext-sdd-arch-review` | 对抗性架构评审 | 架构设计完成后 |
| `/flnext-sdd-backend` | 后端开发 | 评审 PASS 后 |
| `/flnext-sdd-frontend` | 前端开发 | Phase A 通过后 |
| `/flnext-sdd-testcase` | 测试用例 | Phase B 通过后 |
| `/flnext-sdd-testing` | 功能测试 | 测试用例确认后 |
| `/flnext-sdd-integration-gate` | 集成门控（双编译+全栈联调） | 功能测试 PASS 后 |
| `/flnext-sdd-submit` | 提测 | 集成门控 CONFIRMED 后 |
| `/flnext-sdd-accept` | 验收（自动回传AI结束时间到钉钉） | 提测确认后 |
| `/flnext-sdd-release` | 发布 | 验收 PASS 后 |

### 辅助命令

| 命令 | 作用 |
|------|------|
| `/flnext-sdd-status` | 查看当前进度、7-Wave 状态、下一步操作 |
| `/flnext-sdd-quick` | 快速通道（小需求 / 配置调整，< 10 文件） |
| `/flnext-sdd-hotfix` | 紧急修复（P0 生产事故 / 零日漏洞，走 Emergency Override） |
| `/flnext-sdd-consultation` | 受控会诊（歧义评分 > 0.5 或 3b 投票僵局时自动触发） |
| `/flnext-sdd-delta` | Delta 增量变更管理（需求变更不重写文档） |
| `/flnext-sdd-help` | 帮助文档 |

### CLI 命令

| 命令 | 作用 |
|------|------|
| `npx flnext-sdd` | 安装框架到当前目录 |
| `npx flnext-sdd --update` | 更新框架（保留 STATE.md 和 docs/sdd/） |
| `npx flnext-sdd --status` | 查看项目进度 |
| `npx flnext-sdd --audit` | 宪法合规审计 |
| `npx flnext-sdd --self-check` | 显示 AI 自检清单路径 |
| `npx flnext-sdd --drift-check` | 检测代码漂移 |
| `npx flnext-sdd --delta-merge --feature <name>` | 合并 Delta 规格变更 |
| `npx flnext-sdd --help` | 显示帮助 |

### 确认词

| 意图 | 输入 |
|------|------|
| 确认进入下一阶段 | `确认` / `confirm` / `yes` / `Y` |
| 需要修改 | `N` / `no` / `需要修改` |
| 保存进度稍后处理 | `S` / `save` / `保存进度` |

---

## 九、常见问题

### Q: 可以在中间跳过某个阶段吗？

**不可以。** 每个阶段都有前置条件检查，上一个阶段 CONFIRMED 才能进入下一个。快速通道（`/flnext-sdd-quick`）可以合并部分阶段，但编译门禁和提测流程不能跳过。

### Q: 确认后发现上一阶段有问题怎么办？

**CONFIRMED 状态不可回退。** 需要用 Delta 变更模型记录修改：
1. 在 `docs/sdd/deltas/` 创建变更记录
2. 标注影响的阶段
3. 从最早受影响的阶段重新开始

### Q: 编译失败了，AI 会自动修吗？

**不会。** 编译失败后：
1. AI 展示完整错误日志
2. AI 分析原因并给修复建议
3. **等待你确认后才执行修复**
4. AI 不能自动进入修复循环

### Q: 数据库连不上怎么办？AI 会不会自己换 SQLite？

**不会。** 宪法原则 7 明确禁止私自变更技术选型。数据库连不上时：
1. AI 报告错误和原因
2. AI 提供修复选项（不会包含"换成 SQLite"）
3. 等你选择方案后才执行

### Q: 如何查看当前进度？

```bash
/flnext-sdd-status
```

会显示：

```
🎯 FLNext-SDD 工作流进度 — my-project

0. Discovery       ✅ CONFIRMED
1. 需求讨论        ✅ CONFIRMED
2. 原型设计+PRD    ✅ CONFIRMED
3. 架构设计        ✅ CONFIRMED
3b.架构评审        ✅ PASS
4. 后端开发        🔧 IN_PROGRESS (Phase A 编译: ✅ 通过)
5. 前端开发        ⏳ PENDING
...

🌊 7-Wave 进度: Wave 3/7 进行中
下一步: /flnext-sdd-frontend
```

### Q: 提测时的 AI 自检清单是什么？

**内容**：AI 在推送前必须对照 `references/ai-self-check.md` 对自己的变更代码进行 9 大类约 50 项自检。❌ 项必须修复，⚠️ 项标注在 MR/PR 描述中。

**为什么**：防止 AI 写出有性能问题（N+1、无索引）、安全问题（SQL 注入、缺超时）、并发问题（共享状态无锁）的代码混入 MR。

**结果在哪看**：每个 MR/PR 的描述底部都有 `## 🤖 AI 自检报告`，包含分类汇总和具体问题列表。

### Q: 文档存在哪里？

所有 SDD 产出文档都在：

```
项目根目录/
├── docs/sdd/
│   ├── requirement-scope.md    ← 需求边界
│   ├── prototype.md            ← 原型描述
│   ├── prototype.html           ← HTML 原型
│   ├── prd.md                  ← PRD
│   ├── architecture.md         ← 架构设计
│   ├── database.md             ← 数据库设计
│   ├── adr/                    ← 架构决策记录
│   ├── review-report.md        ← 评审报告
│   ├── api-design.md           ← API 详情
│   ├── ui-spec.md              ← UI 详情
│   ├── testcase.md             ← 测试用例
│   ├── test-report.md          ← 测试报告
│   ├── ai-self-check.md        ← AI 自检清单（提测前强制）
│   ├── acceptance-report.md    ← 验收报告
│   ├── RELEASE-NOTES.md        ← 发布说明
│   └── deltas/                 ← 需求变更记录
└── STATE.md                    ← 项目状态（含钉钉集成信息）
```

### Q: 钉钉AI表格集成是怎么工作的？

**需求阶段（/flnext-sdd-requirement）**：
1. AI 自动搜索钉钉"AI 产研需求管理"表格
2. 查询状态为"待排期"且处理人为你的需求列表
3. 你选择一个需求后，AI 记录需求编号和名称
4. 需求确认后，AI 自动回传 **AI开始时间** 到钉钉表格

**验收阶段（/flnext-sdd-accept）**：
1. 验收通过后，AI 自动回传 **AI结束时间** 到钉钉表格
2. 与 AI开始时间形成完整的开发时间记录

**STATE.md 中的钉钉状态段**：
```yaml
dingtalk:
  base_id: "9bN7R..."            # 钉钉表格 baseId
  table_id: "YVOcBAJ"            # 需求池 tableId
  record_id: "2oMm..."           # 当前需求记录 recordId
  requirement_id: "fl-t-0006"    # 需求编号
  requirement_name: "FLNEXT 店铺地址切换"  # 需求名称
  ai_start_time: "2026-05-19"    # AI开始时间
  ai_end_time: ""                # AI结束时间（验收后填写）
  field_mapping: {...}           # 字段映射缓存
```

### Q: 没有钉钉表格可以用吗？

**可以。** 如果钉钉查询失败（网络问题、表格不存在等），系统会自动降级为手动输入模式，流程与之前完全一样。你可以直接描述需求，不受影响。

---

> **FLNext-SDD v4.0.0**
> GitHub: https://github.com/top1from/flnext-sdd
> npm: npx flnext-sdd@latest
> 13 阶段 | 19 命令 | 12 Agent | 9 类自检 | 5 状态机 | 3 级评估管道 | Delta 增量变更 | 钉钉AI表格联动
