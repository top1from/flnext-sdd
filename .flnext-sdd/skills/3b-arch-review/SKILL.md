---
name: "flnext-sdd-arch-review"
description: "[3b/13] 架构评审 — 对架构设计进行评审——必须发现问题，零发现=拒绝。Triggers on '评审', 'review', '架构评审'"
---

# 阶段3b: 对抗性架构评审 (Adversarial Review)

## Overview

对架构设计进行**对抗性评审**——假设存在问题，必须找到至少一个可操作的建议。评审通过才能进入开发阶段。

## 参考文档

- 对抗性评审: `references/adversarial-review.md`
- 步骤协议: `references/step-protocol.md`

## Hard Gate

**评审 PASS 才能进入后端开发。零发现 = REWORK（重新审查）。**

## 输出文件

- `docs/sdd/{FEATURE_NAME}/review-report.md` - 对抗性评审报告

## 前置条件

1. 架构设计完成 (Phase 3 CONFIRMED)
2. docs/sdd/{FEATURE_NAME}/architecture.md 存在
3. docs/sdd/{FEATURE_NAME}/database.md 存在
4. **docs/sdd/{FEATURE_NAME}/adr/ 目录存在至少 2 个 ADR**

## Workflow

| 步骤 | 文件 | 目标 |
|------|------|------|
| 1 | step-01-review.md | 执行对抗性评审（至少 1 发现） |
| 2 | step-02-feedback.md | 分类反馈评审结果 |
| 3 | step-03-approval.md | 评审结论 |

## 评审维度

### 必须覆盖的检查项（至少报告一个发现）

| # | 检查维度 | 对抗性问题 |
|---|---------|-----------|
| 1 | **架构合理性** | 分层是否清晰？依赖方向是否正确？是否存在循环依赖？ |
| 2 | **技术选型** | ADR 的"如果选错的后果"是否具体？是否有遗漏的技术决策？ |
| 3 | **数据库设计** | 表结构是否有冗余？索引是否合理？是否有 N+1 查询风险？ |
| 4 | **API 设计** | 端点是否 RESTful？是否有遗漏的端点？错误处理是否一致？ |
| 5 | **安全性** | 认证/授权是否覆盖所有端点？敏感数据是否加密？ |
| 6 | **可扩展性** | 当前设计能否支撑预期负载？瓶颈在哪里？ |
| 7 | **命名一致性** | 前后端命名是否一致？是否符合命名规范（参见 `references/naming-conventions.md`）？ |
| 8 | **缺失检查** | 有没有应该设计但遗漏的部分？ |

## 发现分级

| 级别 | 含义 | 示例 |
|------|------|------|
| **BLOCKER** | 阻塞性缺陷，必须修复才能继续 | 缺少认证机制、循环依赖、数据库选型错误 |
| **WARNING** | 重要问题，强烈建议修复 | 缺少索引、API 版本策略不明确、缺少限流 |
| **SUGGESTION** | 改进建议，可以后续处理 | 命名可以更一致、文档可以更详细 |

## 评审结果判定

| 结果 | 条件 | 后续动作 |
|------|------|----------|
| PASS | 无 BLOCKER，WARNING ≤ 3，至少 1 个 SUGGESTION | 进入后端开发 |
| REWORK | 存在 BLOCKER，或零发现 | 返回架构设计修改 / 重新审查 |
| HOLD | 等待外部决策 | 暂停，等待条件满足 |
| CONSULT | 多角色投票不一致（2 票 PASS vs 1 票 REWORK） | 触发 `/flnext-sdd-consultation` 会诊模式 |

> **零发现规则**: 如果评审没有发现任何 BLOCKER、WARNING 或 SUGGESTION，判定为 REWORK。评审者必须重新审查。

> **会诊升级**: 当 3 角色投票出现僵局（无法达成 2/3 多数），或技术决策涉及跨领域权衡时，自动升级为 `/flnext-sdd-consultation` 会诊模式（详见 `references/step-protocol.md` 和 consultation-mode SKILL）。

## Level 3: 多角色交叉验证（Consensus Check）

> 灵感来源: Ouroboros 的 3-stage evaluation pipeline

**成本**: $$$（多模型/多角色审查）  
**时机**: 架构评审时自动触发

### 审查角色

| 角色 | 职责 | 关注点 |
|------|------|--------|
| 架构师 (Atlas) | 技术合理性审查 | 分层清晰度、依赖方向、技术选型 |
| QA (Hawk) | 边界和异常覆盖审查 | 测试性、错误处理、边界条件 |
| 反对者 (Shadow) | 挑战所有假设 | 潜在风险、遗漏场景、反模式 |

### 投票规则

- 需 2/3 多数通过
- 一票否决 = REWORK
- 每个角色必须输出至少 1 条发现

### 触发条件（按优先级）

1. Seed/Spec 修改
2. 数据库 schema 变更
3. API 契约变更
4. 需求重新解读（Delta 变更）
5. 安全相关变更
6. 重大架构决策

### 多角色审查流程

```
架构设计 (Phase 3 CONFIRMED)
    │
    ▼
┌─────────────────────────────────────┐
│  Level 3: 多角色交叉验证            │
│                                     │
│  架构师 ──┐                         │
│           ├──▶ 投票 ──▶ 2/3 通过？ │
│  QA ──────┤        │        │      │
│           │        ▼        ▼      │
│  反对者 ──┘     PASS      REWORK   │
└─────────────────────────────────────┘
    │
    ▼
进入后端开发 (Phase 4)
```

### 评审报告模板

```markdown
# 架构评审报告 — {FEATURE_NAME}

> 评审日期: {DATE}
> 评审模式: Level 3 多角色交叉验证

## 角色评审

### 架构师 (Atlas) 评审
- 发现 1: ...
- 发现 2: ...
- 结论: PASS / REWORK

### QA (Hawk) 评审
- 发现 1: ...
- 发现 2: ...
- 结论: PASS / REWORK

### 反对者 (Shadow) 评审
- 发现 1: ...
- 发现 2: ...
- 结论: PASS / REWORK

## 投票结果

| 角色 | 结论 |
|------|------|
| 架构师 | PASS |
| QA | PASS |
| 反对者 | REWORK |

**最终结果**: REWORK（一票否决）

## 待修复项

- [ ] {反对者发现的问题}
```

## State Tracking

```yaml
phases:
  3b-arch-review:
    status: IN_PROGRESS
    result: ""    # PASS / REWORK / HOLD
    review_mode: "L3"  # L1 / L2 / L3
    findings:
      blockers: 0
      warnings: 0
      suggestions: 0
    votes:
      architect: ""  # PASS / REWORK
      qa: ""
      contrarian: ""
```
