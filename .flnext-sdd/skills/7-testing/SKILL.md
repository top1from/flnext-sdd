---
name: "flnext-sdd-testing"
description: "[7/10] 功能测试 — 按测试用例执行功能测试。Triggers on '功能测试', 'testing', '执行测试'"
---

# 阶段7: 功能测试

## Overview

按照测试用例逐项执行功能测试，记录每个用例的执行结果。测试通过才能提测。

## Hard Gate

**测试 PASS 才能进入提测阶段**

## 输出文件

- `docs/sdd/{FEATURE_NAME}/test-report.md` - 测试报告

## 前置条件

1. 测试用例完成 (Phase 6 CONFIRMED)
2. docs/sdd/{FEATURE_NAME}/testcase.md 存在
3. **Phase A 和 Phase B 编译均已通过**
4. **项目可正常编译和启动**

## Workflow

| 步骤 | 文件 | 目标 |
|------|------|------|
| 1 | step-01-init.md | 初始化，读取测试用例 |
| 1.5 | step-01.5-verify-wiring.md | **交叉连接验证（新增）** |
| 2 | step-02-execute.md | **编译复检 + 执行测试用例** |
| 3 | step-03-report.md | 生成测试报告 |
| 4 | step-04-complete.md | 完成确认 |

## 核心规则

### 编译复检
**测试阶段第一步必须是重新编译**。测试期间修改的代码可能引入新的编译错误。
编译未通过 → 测试结果无效。

### 实现代码只读
**测试阶段不允许修改业务代码**。测试角色是验证者，不是修改者。
发现的实现 Bug → **ESCALATE**（上报），不得自行修复。

## 测试结果判定

| 结果 | 含义 | 后续动作 |
|------|------|---------|
| PASS | 全部通过 | 进入提测 |
| REWORK | 存在失败 | 返回开发阶段修复 |
| HOLD | 暂停 | 等待外部条件 |

## State Tracking

```yaml
phases:
  7-testing:
    status: IN_PROGRESS
    result: ""    # PASS / REWORK / HOLD
```
