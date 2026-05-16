---
name: "flnext-sdd-arch-review"
description: "[3b/10] 架构评审 — 对架构设计进行评审——必须发现问题，零发现=拒绝。Triggers on '评审', 'review', '架构评审'"
---

# 阶段3b: 对抗性架构评审 (Adversarial Review)

## Overview

对架构设计进行**对抗性评审**——假设存在问题，必须找到至少一个可操作的建议。评审通过才能进入开发阶段。

## 对抗性评审原则

```
假设立场: 架构设计存在缺陷，直到证据证明它是合理的
强制要求: 零发现 = 审核不充分 → 拒绝通过，重新审查
核心问题: "缺少了什么？" 而不仅仅是 "有什么问题？"
```

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
| 7 | **命名一致性** | 前后端命名是否一致？是否符合命名规范？ |
| 8 | **缺失检查** | 有没有应该设计但遗漏的部分？ |

## 发现分级

| 级别 | 含义 | 示例 |
|------|------|------|
| **BLOCKER** | 阻塞性缺陷，必须修复才能继续 | 缺少认证机制、循环依赖、数据库选型错误 |
| **WARNING** | 重要问题，强烈建议修复 | 缺少索引、API 版本策略不明确、缺少限流 |
| **SUGGESTION** | 改进建议，可以后续处理 | 命名可以更一致、文档可以更详细 |

## 评审结果判定

| 结果 | 条件 | 后续动作 |
|------|------|---------|
| PASS | 无 BLOCKER，WARNING ≤ 3，至少 1 个 SUGGESTION | 进入后端开发 |
| REWORK | 存在 BLOCKER，或零发现 | 返回架构设计修改 / 重新审查 |
| HOLD | 等待外部决策 | 暂停，等待条件满足 |

> **零发现规则**: 如果评审没有发现任何 BLOCKER、WARNING 或 SUGGESTION，判定为 REWORK。评审者必须重新审查。

## State Tracking

```yaml
phases:
  3b-arch-review:
    status: IN_PROGRESS
    result: ""    # PASS / REWORK / HOLD
    findings:
      blockers: 0
      warnings: 0
      suggestions: 0
```
