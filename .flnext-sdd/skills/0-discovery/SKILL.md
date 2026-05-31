---
name: "flnext-sdd-discovery"
description: "[0/13] Discovery — 项目发现与代码库扫描（老项目强制）。 Triggers on 'Discovery', '发现', '项目探索', '代码扫描'. Scans codebase with 4 parallel agents, produces project-context.md for all subsequent phases."
---

# 阶段0: Discovery（项目发现）

## Overview

当 SDD 工作流应用于已有项目（Brownfield）时，Discovery 是**强制入口**阶段。通过 4-Agent 并行扫描理解代码库，产出持久化上下文，为后续所有阶段提供基础。

**Greenfield 项目可跳过此阶段，直接从需求讨论开始。**

## 设计来源

| 特性 | 来源 | 说明 |
|------|------|------|
| 4-Agent 并行扫描 | GSD (gsd-map-codebase) | Tech/Arch/Quality/Concerns 四维扫描 |
| 4 PATH 路由 | Ouroboros (interview.py) | auto-confirm / code-confirm / human / code+judgment |
| 歧义评分 | Ouroboros (ambiguity.py) | 4 维度加权评分，阈值 0.2 |
| 辩证节奏守卫 | Ouroboros (dialectic rhythm) | 连续 3 次非用户回答后强制 PATH 2 |
| 3 级扫描深度 | BMAD (bmad-document-project) | Quick/Deep/Exhaustive |
| 持久化上下文 | BMAD (project-context.md) | 自动被所有后续阶段加载 |
| Drift 检测 | GSD (drift gate) | 检测代码库偏离映射状态 |

## Hard Gate

**Discovery 完成后必须用户确认才能进入需求讨论阶段**

## 输出文件

- `docs/sdd/project-context.md` — 持久化项目上下文（自动被所有后续阶段加载）
- `docs/sdd/tech-stack.md` — 技术栈映射
- `docs/sdd/architecture-map.md` — 架构映射

## Workflow

| 步骤 | 文件 | 目标 |
|------|------|------|
| 1 | step-01-detect.md | 检测项目类型（Greenfield/Brownfield） |
| 2 | step-02-scan.md | 4-Agent 并行扫描代码库 |
| 3 | step-03-interview.md | 歧义澄清访谈（4 PATH 路由） |
| 4 | step-04-context.md | 生成持久化项目上下文 |
| 5 | step-05-complete.md | 完成确认，Drift 检测基准建立 |

## 执行流程

### Step 1: 项目类型检测

1. 扫描项目根目录，检测以下信号：
   - 是否存在 `package.json` / `pom.xml` / `go.mod` / `requirements.txt` / `Cargo.toml`
   - 是否存在 `src/` / `app/` / `lib/` / `internal/` 目录
   - 是否存在 `.git/` 目录
   - 代码文件数量是否 > 10

2. 判定规则：
   - **Greenfield**: 无上述信号或代码文件 < 10 → 跳过 Discovery，直接进入需求讨论
   - **Brownfield**: 检测到成熟代码库 → 执行完整 Discovery 流程

3. 更新 STATE.md:
   ```yaml
   project_type: "brownfield"   # 或 "greenfield"
   current_phase: 0
   phase_status: in_progress
   ```

### Step 2: 4-Agent 并行扫描

启动 4 个并行 Agent 扫描代码库，每个 Agent 负责一个维度：

| Agent | 扫描维度 | 输出文件 | 关键产出 |
|-------|---------|---------|---------|
| Tech Agent | 技术栈 | tech-stack.md | STACK.md + INTEGRATIONS.md |
| Arch Agent | 架构 | architecture-map.md | ARCHITECTURE.md + STRUCTURE.md |
| Quality Agent | 代码质量 | → project-context.md §Quality | CONVENTIONS.md + TESTING.md |
| Concerns Agent | 风险与关注 | → project-context.md §Concerns | CONCERNS.md |

**扫描深度**（根据 config.yaml 的 discovery.scan_depth）:

| 深度 | 耗时 | 范围 |
|------|------|------|
| Quick | 2-5 min | 顶层结构 + 关键配置 |
| Deep | 10-30 min | 完整目录树 + 核心代码阅读 |
| Exhaustive | 30-120 min | 全量代码扫描 + 深度分析 |

**Tech Agent 扫描内容**:
- 语言和框架版本
- 依赖清单（package.json/pom.xml/go.mod）
- 数据库类型和 ORM
- 中间件和第三方服务集成
- 构建/部署工具链

**Arch Agent 扫描内容**:
- 目录结构和模块划分
- 入口文件和路由定义
- 数据流和分层架构
- API 端点清单
- 公共组件和工具函数

**Quality Agent 扫描内容**:
- 代码风格和命名规范
- 测试框架和覆盖率
- Lint/Format 配置
- 错误处理模式
- 日志规范

**Concerns Agent 扫描内容**:
- 技术债务标记（TODO/FIXME/HACK）
- 安全风险点
- 性能瓶颈
- 依赖过时警告
- 数据迁移风险

### Step 3: 歧义澄清访谈

对扫描结果中的歧义点进行澄清，使用 **4 PATH 路由系统**：

**歧义评分**（4 维度加权）:

| 维度 | 权重 | 评估标准 |
|------|------|---------|
| Goal（目标清晰度） | 35% | 业务目标是否明确 |
| Constraint（约束明确度） | 25% | 技术约束是否清楚 |
| Success（成功标准） | 25% | 验收标准是否可测 |
| Context（上下文充分度） | 15% | 项目背景是否充分 |

**阈值判断**:
- 歧义分数 < 0.2 → 低歧义，可自动处理
- 歧义分数 0.2~0.5 → 中歧义，需要用户确认
- 歧义分数 > 0.5 → 高歧义，触发 `/flnext-sdd-consultation` 会诊模式（多 Agent 结构化分析）

**4 PATH 路由**:

| PATH | 条件 | 行为 |
|------|------|------|
| PATH 1a: Auto-confirm | 歧义 < 0.2，且不涉及架构决策 | AI 自动推断，记录到上下文 |
| PATH 1b: Code-confirm | 歧义 < 0.2，但涉及代码行为 | 读取代码确认后自动处理 |
| PATH 2: Human judgment | 歧义 0.2~0.5 | 向用户提问，等待明确回答 |
| PATH 3: Code+judgment | 歧义 > 0.5 | 先读代码，整理选项后请用户选择 |

**辩证节奏守卫**:
- 跟踪连续非用户回答次数
- 连续 3 次后强制切换到 PATH 2（必须人工判断）
- 防止 AI 过度自动化，忽略关键决策点

### Step 4: 生成持久化项目上下文

将所有扫描结果和澄清结论合并为 `project-context.md`：

```markdown
# Project Context — {PROJECT_NAME}
> 自动生成，所有 SDD 阶段自动加载此文件

## 技术栈
[从 Tech Agent 输出整理]

## 架构概览
[从 Arch Agent 输出整理]

## 代码规范
[从 Quality Agent 输出整理]

## 已知风险
[从 Concerns Agent 输出整理]

## 歧义澄清记录
[从 Step 3 访谈记录整理]

## Drift 基准
[当前代码库的快照摘要，用于后续 Drift 检测]
```

### Step 5: 完成确认

1. 展示 Discovery 结果摘要
2. 使用严格确认词确认
3. 建立 Drift 检测基准
4. 更新 STATE.md

## State Tracking

每个步骤完成后更新 STATE.md:
```yaml
current_phase: 0
phase_status: in_progress
current_step: "step-02-scan"
steps_completed: ["step-01-detect"]
```

## Drift 检测

在后续任何阶段开始时，检测代码库是否偏离 Discovery 基准：

1. 比较当前文件结构与 Discovery 时的快照
2. 检查关键配置文件是否有变更
3. 如检测到显著偏离（> 20% 文件变更），触发 Drift 警告：
   ```
   ⚠️ DRIFT DETECTED
   代码库自 Discovery 以来发生显著变化:
   - 新增文件: N 个
   - 删除文件: N 个
   - 修改文件: N 个
   
   建议重新执行 Discovery 或增量更新 project-context.md
   ```

## Mandatory Execution Rules

1. **Brownfield 必须执行** — 检测到已有代码库时不可跳过
2. **4 Agent 必须并行** — 提升扫描效率
3. **歧义评分必须执行** — 不可跳过访谈步骤
4. **辩证节奏必须遵守** — 防止过度自动化
5. **project-context.md 必须生成** — 后续阶段依赖此文件
6. **必须等待严格确认** — Discovery 结果必须确认

## Menu Options

[C] 开始 Discovery 扫描
[D] 选择扫描深度 (Quick/Deep/Exhaustive)
[R] 重新扫描
[S] 保存当前进度
[H] 查看帮助 (/flnext-sdd-help)
