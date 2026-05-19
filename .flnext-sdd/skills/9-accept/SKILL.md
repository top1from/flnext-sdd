---
name: "flnext-sdd-accept"
description: "[9/10] 验收 — 基于 develop 创建 beta 分支部署测试环境，产品经理和 QA 确认功能符合需求。验收通过后自动回传AI结束时间到钉钉表格。Triggers on '验收', 'accept', 'acceptance'"
---

# 阶段9: 验收 (Accept)

## Overview

基于 develop 创建 beta/{version} 分支部署测试环境，产品经理和 QA 对功能进行验收确认，验证是否符合需求边界文档的定义。验收通过后自动回传AI结束时间到钉钉AI表格"AI 产研需求管理"。

## 钉钉AI表格集成

验收完成时自动回传：
- **AI结束时间**: 写入钉钉表格的"AI结束时间"字段
- 依赖 STATE.md `dingtalk` 段中的 base_id、table_id、record_id 和 field_mapping

## Hard Gate

**验收通过才能进入发布阶段**

## 输出文件

- `docs/sdd/{FEATURE_NAME}/acceptance-report.md` — 验收报告

## 前置条件

- 提测完成 (Phase 8 CONFIRMED)
- MR 已合并到 develop 分支
- 测试报告显示所有关键用例通过

## Workflow

| 步骤 | 文件 | 目标 |
|------|------|------|
| 0 | step-00-branch.md | 创建 beta 分支 (测试环境) |
| 1 | step-01-verify.md | 对照需求边界验证功能 |
| 2 | step-02-demo.md | 功能演示与走查 |
| 3 | step-03-report.md | 生成验收报告 |
| 4 | step-04-complete.md | 完成确认 |

## 分支管理

```
develop ──────────────────────→ main (阶段10)
    │
    └── beta/{version}  ←── 阶段9验收环境
            │
            └── 验收通过 → cherry-pick 修复同步回 develop
```

## 执行流程

### Step 0: 创建 Beta 分支

基于 develop 创建 `beta/{version}` 分支部署测试环境。详见 [step-00-branch.md](steps/step-00-branch.md)。

### Step 1: 对照需求验证

1. 读取 `docs/sdd/{FEATURE_NAME}/requirement-scope.md`
2. 逐项检查 In Scope 功能是否实现
3. 检查验收标准是否满足
4. 生成验证清单

### Step 2: 功能演示走查

1. 在测试环境（beta 分支部署）上按用户旅程走查核心流程
2. 检查 P1 优先级功能是否完整
3. 检查边界情况和异常处理
4. 记录发现的问题

### Step 3: 生成验收报告

```markdown
# 验收报告 — {PROJECT_NAME}

> 阶段: 9 — 验收
> 状态: AWAITING_CONFIRMATION
> 日期: {DATE}
> 测试环境分支: beta/{version}

## 需求覆盖度

| 需求编号 | 需求描述 | 状态 | 备注 |
|---------|---------|------|------|
| FR-001 | | ✅/❌/⚠️ | |

## 验收标准

| # | 标准 | 结果 |
|---|------|------|
| | | ✅/❌ |

## 验收结论

- 结果: PASS / CONDITIONAL_PASS / FAIL
- 条件: {如有条件通过，列出条件}
```

### Step 4: 完成确认

使用严格确认词确认验收结果。

**验收结果判定**:
- PASS → 进入发布阶段 (/flnext-sdd-release)
- CONDITIONAL_PASS → 记录条件，在 beta 分支修复后重新验收
- FAIL → 返回开发阶段，在 feature 分支修复后重新走提测流程

## State Tracking

```yaml
phases:
  9-accept:
    status: AWAITING_CONFIRMATION
    result: "PASS"
    beta_branch: "beta/{version}"
```
