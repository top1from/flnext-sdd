---
name: "flnext-sdd-accept"
description: "[9/13] 验收 — 基于 develop 创建 beta 分支部署测试环境，产品经理和 QA 确认功能符合需求。验收通过后自动回传AI结束时间到钉钉表格。Triggers on '验收', 'accept', 'acceptance'"
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
| 2 | step-02-deploy.md | 部署测试环境 |
| 3 | step-03-test.md | 功能演示与走查 |
| 4 | step-04-report.md | 生成验收报告 |
| 5 | step-05-complete.md | 完成确认 |

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

### Step 2: 部署测试环境

详见 [step-02-deploy.md](steps/step-02-deploy.md)。

### Step 3: 功能演示走查

详见 [step-03-test.md](steps/step-03-test.md)。

### Step 4: 生成验收报告

详见 [step-04-report.md](steps/step-04-report.md)。

### Step 5: 完成确认

详见 [step-05-complete.md](steps/step-05-complete.md)。使用严格确认词确认验收结果。

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
