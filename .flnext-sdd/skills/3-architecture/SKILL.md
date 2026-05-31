---
name: "flnext-sdd-architecture"
description: "[3/13] 架构设计 — 设计技术架构和数据库。Triggers on '架构', 'architecture', '技术设计', '数据库设计'"
---

# 阶段3: 架构设计

## Overview

基于 PRD 和原型设计，设计技术架构和数据库结构。使用 Clean Architecture 模式，确保前后端命名一致。

## Hard Gate

**架构设计确认后才能进入架构评审**

## 输出文件

- `docs/sdd/{FEATURE_NAME}/architecture.md` - 技术架构文档
- `docs/sdd/{FEATURE_NAME}/database.md` - 数据库设计文档
- `docs/sdd/{FEATURE_NAME}/adr/ADR-001-database.md` - **架构决策记录（必输出）**
- `docs/sdd/{FEATURE_NAME}/adr/ADR-002-api-style.md` - API 风格决策（必输出）
- `docs/sdd/{FEATURE_NAME}/adr/ADR-003-auth.md` - 认证方案决策（必输出）
- `docs/sdd/{FEATURE_NAME}/adr/ADR-004-cache.md` - 缓存策略决策（如适用）
- `docs/sdd/{FEATURE_NAME}/adr/ADR-005-messaging.md` - 消息队列决策（如适用）

> **ADR 是强制输出**: 至少需要 ADR-001（数据库）和 ADR-002（API 风格）。每个 ADR 必须记录"如果选错的后果"，防止后续 Agent 私自降级。

## 前置条件

1. 原型设计完成 (Phase 2 CONFIRMED)
2. docs/sdd/{FEATURE_NAME}/prd.md 存在
3. 读取 `docs/sdd/project-context.md`（如存在）

## Workflow

| 步骤 | 文件 | 目标 |
|------|------|------|
| 1 | step-01-init.md | 初始化，读取 PRD 和原型 |
| 2 | step-02-tech-stack.md | 确认技术栈选型 + 生成 ADR 决策记录 |
| 3 | step-03-architecture.md | 设计技术架构 |
| 4 | step-04-database.md | 设计数据库结构 |
| 5 | step-05-complete.md | 完成确认 |

## 执行流程

### Step 1: 初始化

1. 读取 PRD 和原型文档
2. 读取 project-context.md（Brownfield，复用现有技术栈）
3. 确认架构设计范围

### Step 2: 确认技术栈 + ADR 决策记录

1. Brownfield: 基于 project-context.md 确认，不轻易更换
2. Greenfield: 基于 config.yaml 确认，或与用户讨论选型
3. **必须生成 ADR 决策记录**:
   - ADR-001: 数据库选型（类型、版本、连接方式、为什么不用其他的）
   - ADR-002: API 风格（REST / GraphQL / gRPC）
   - ADR-003: 认证方案（JWT / Session / OAuth2）
   - 每个 ADR 必须包含"如果选错了会怎样"的具体后果
   - 使用 `templates/adr-template.md` 模板
4. **防降级声明**: 在每个 ADR 中明确禁止 Agent 私自替换技术选型

### Step 3: 设计技术架构

1. 采用 Clean Architecture 分层
2. 定义模块划分和依赖关系
3. 设计 API 端点
4. 确保前后端命名大小写一致

### Step 4: 设计数据库

1. 设计表结构
2. 定义索引和约束
3. 设计迁移脚本

### Step 5: 完成确认

使用严格确认词确认架构和数据库设计。

## State Tracking

```yaml
phases:
  3-architecture:
    status: IN_PROGRESS
```

## 参考规范

- 命名规范: `references/naming-conventions.md`（文件命名、ID 命名、分支命名、优先级规范）
- 3 级评估管道: `references/evaluation-pipeline.md`（Mechanical → Semantic → Consensus）

## Mandatory Execution Rules

1. **必须遵循 Clean Architecture**
2. **前后端命名大小写必须一致**（参见 `references/naming-conventions.md`）
3. **Brownfield 不轻易更换技术栈**
4. **必须输出 ADR 决策记录**（至少 3 个：数据库/API/认证）
5. **每个 ADR 必须包含"如果选错的后果"**
6. **完成确认使用严格确认词**
