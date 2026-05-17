# FLNext-SDD v3.1.0 操作手册

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

---

## 一、框架概述

### 什么是 FLNext-SDD？

FLNext-SDD 是一套在 Claude Code 中运行的 **规格驱动开发工作流**。它把软件开发拆成 12 个严格有序的阶段，每个阶段：
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
|------|-----------|---------|
| 阶段数 | 12（最完整） | 5-9 |
| 编译验证 | 前后端独立编译门禁 | 大多数没有 |
| 老项目支持 | 有 Discovery 阶段自动扫描 | 多数不支持 |
| 验收/发布 | 有独立阶段 + Beta 分支 | 多数没有 |
| AI 行为约束 | 10 条宪法规原则 | 多数没有 |
| AI 代码自检 | 提测前 8 大类约 40 项强制自检 | 多数没有 |

---

## 二、核心设计机制

### 2.1 10 条宪法规原则

| # | 原则 | 含义 |
|---|------|------|
| 1 | **规范先行** | 代码实现必须在规范文档完成后才能开始 |
| 2 | **门控确认** | 每个阶段必须人工确认才能进入下一阶段 |
| 3 | **后端优先** | 先写后端 API，再写前端界面 |
| 4 | **双编译门禁** | 后端编译通过 + 前端编译通过，两道坎 |
| 5 | **测试驱动** | 测试用例先于功能测试编写 |
| 6 | **提测规范** | 通过 rebase + GitLab MR 合并到 develop |
| 7 | **禁止私自变技术** | 数据库连不上不能偷偷换 SQLite，必须报告等确认 |
| 8 | **对抗性评审** | 评审必须发现问题，零发现 = 拒绝 |
| 9 | **测试真实性** | 声称"通过"前必须先编译通过，测试期间不能改业务代码 |
| 10 | **Discovery 优先** | 老项目必须先扫描代码库，理解现状 |

### 2.2 4 状态机

每个阶段都遵循同一个状态机：

```
PENDING  ──用户启动──▶  IN_PROGRESS  ──工作完成──▶  AWAITING_CONFIRMATION  ──用户确认──▶  CONFIRMED
                                                                                         │
                                                                              用户要求修改 │
                                                                                         ▼
                                                                                  IN_PROGRESS（返工）
```

- **CONFIRMED 不可回退**（除非整体回滚）
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
  Wave 4  后端测试 + API Client 类型    （并行，验证+给前端接口）
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

**8 大检查类别**：

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

**判定规则**：
- ✅ = 通过
- ⚠️ = 需关注（标注在 MR 中，人工判断）
- ❌ = 不通过（必须修复，给出文件路径+行号+建议）

**结果**：自检报告自动附在 GitLab MR 描述中，供审查者参考。

### 2.8 禁止事项（AI 不能做的）

| AI 不能做的事 | 为什么 |
|-------------|--------|
| 跳过阶段直接写代码 | 违反规范先行 |
| 数据库连不上就换 SQLite | 违反禁止私变技术 |
| 编译失败后自动修 | 违反双编译门禁 |
| 测试阶段改业务代码 | 违反测试真实性 |
| "联调通过"但没编译 | 违反测试真实性 |
| 说 ok 就算确认 | 违反严格确认词 |

---

## 三、流程机制

### 3.1 标准流程（12 阶段）

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
阶段 8:  提测            — rebase develop → GitLab MR
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

**保护分支规则（GitLab 配置）**：

| 分支 | 允许推送 | 允许合并 |
|------|---------|---------|
| `main` | ❌ | Merge Request |
| `develop` | ❌  | Merge Request |
| `feature/*` | ✅ | 开发者自行 |
| `hotfix/*` | ✅ | MR to develop + main |
| `beta/*` | ✅ | 验收后删除 |

---

## 四、从 0 到 1 开发新项目

### 第一步：安装框架

```bash
# 创建新项目目录
mkdir my-project
cd my-project

# Windows 用户
powershell -File "D:/WORK2024/AI2026/flnext-sdd/.flnext-sdd/install.ps1" -ProjectName "my-project"

# Linux/macOS 用户
bash D:/WORK2024/AI2026/flnext-sdd/.flnext-sdd/install.sh --name "my-project"
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

AI 会像产品经理一样和你对话：

```
AI: 你想做什么功能？可以先大致描述一下。

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

产出：`docs/sdd/requirement-scope.md`

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

产出：`docs/sdd/test-report.md`

### 第十一步：阶段 8 — 提测

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

# 8. 登录 GitLab 创建 MR（附自检报告）
# Source: feature/qinhaijun-short-url
# Target: develop
# Description: 包含 SDD 追溯 + AI 自检报告
```

> **AI 自检清单**：提测前 AI 必须对代码进行 8 大类（性能、数据库、API、并发、安全、错误处理、代码质量、前端专项）约 40 项自检。❌ 项必须修复，⚠️ 项标注在 MR 中供审查者判断。详见 `.flnext-sdd/references/ai-self-check.md`。

产出：`docs/sdd/SUBMISSION.md` + GitLab MR 链接（含自检报告）

### 第十二步：阶段 9 — 验收

```
在 Claude Code 中输入: /flnext-sdd-accept
```

AI 会：
1. 基于 develop 创建 `beta/v1.0` 分支
2. 部署到测试验收环境
3. 对照需求边界逐一验证功能
4. 生成验收报告

产出：`docs/sdd/acceptance-report.md`

### 第十三步：阶段 10 — 发布

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

产出：`docs/sdd/RELEASE-NOTES.md`

---

## 五、老项目接入 SDD

### 场景

你有一个已经存在的项目，想用 FLNext-SDD 来管理后续开发。

### 第一步：安装框架到项目目录

```bash
cd your-existing-project

# Windows
powershell -File "D:/WORK2024/AI2026/flnext-sdd/.flnext-sdd/install.ps1" -ProjectName "your-project"

# Linux/macOS
bash D:/WORK2024/AI2026/flnext-sdd/.flnext-sdd/install.sh --name "your-project"
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
/flnext-sdd-requirement   → 只讨论新功能的需求
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
- ✅ rebase + GitLab MR 提测流程不变
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
| `/flnext-sdd-requirement` | 需求讨论 | 开始一个新功能 |
| `/flnext-sdd-prototype` | HTML 原型设计 | 需求确认后 |
| `/flnext-sdd-architecture` | 架构设计 + ADR | 原型确认后 |
| `/flnext-sdd-arch-review` | 对抗性架构评审 | 架构设计完成后 |
| `/flnext-sdd-backend` | 后端开发 | 评审 PASS 后 |
| `/flnext-sdd-frontend` | 前端开发 | Phase A 通过后 |
| `/flnext-sdd-testcase` | 测试用例 | Phase B 通过后 |
| `/flnext-sdd-testing` | 功能测试 | 测试用例确认后 |
| `/flnext-sdd-submit` | 提测 | 测试 PASS 后 |
| `/flnext-sdd-accept` | 验收 | 提测确认后 |
| `/flnext-sdd-release` | 发布 | 验收 PASS 后 |

### 辅助命令

| 命令 | 作用 |
|------|------|
| `/flnext-sdd-status` | 查看当前进度、7-Wave 状态、下一步操作 |
| `/flnext-sdd-quick` | 快速通道（紧急修复 / 小需求） |
| `/flnext-sdd-help` | 帮助文档 |

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

**内容**：AI 在推送前必须对照 `references/ai-self-check.md` 对自己的变更代码进行 8 大类约 40 项自检。❌ 项必须修复，⚠️ 项标注在 MR 描述中。

**为什么**：防止 AI 写出有性能问题（N+1、无索引）、安全问题（SQL 注入、缺超时）、并发问题（共享状态无锁）的代码混入 MR。

**结果在哪看**：每个 MR 的描述底部都有 `## 🤖 AI 自检报告`，包含分类汇总和具体问题列表。

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
└── STATE.md                    ← 项目状态
```

---

> **FLNext-SDD v3.2.1**
> 框架位置: `D:/WORK2024/AI2026/flnext-sdd/`
> 更新日期: 2026-05-17
> 更新: 分支策略简化（7→5种）+ 保护分支规则 + hotfix 流程
