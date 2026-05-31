---
name: "flnext-sdd-testcase"
description: "[6/13] 测试用例 — 基于需求和设计编写测试用例，生成可追溯矩阵。Triggers on '测试用例', 'testcase', 'test case'"
---

# 阶段6: 测试用例

## Overview

基于需求边界和设计文档编写测试用例，生成需求→用例→测试的可追溯矩阵。

## Hard Gate

**测试用例确认后才能执行功能测试**

## 输出文件

- `docs/sdd/{FEATURE_NAME}/testcase.md` - 测试用例文档（含可追溯矩阵）

## 前置条件

1. Phase B 编译门禁通过 (前端编译通过) / 纯后端项目 SKIPPED
2. docs/sdd/{FEATURE_NAME}/requirement-scope.md 存在
3. docs/sdd/{FEATURE_NAME}/prd.md 存在（纯后端项目可选）
4. docs/sdd/{FEATURE_NAME}/architecture.md 存在
5. 读取 `docs/sdd/project-context.md`（如存在）

### 纯后端项目处理

如果 STATE.md 中 `project_backend_only: true` 或 config.yaml 中 `backend_only: true`：

1. 测试用例聚焦后端：API 端点测试、数据库测试、业务逻辑测试
2. 跳过 UI 交互测试用例（无需原型/PRD 依赖）
3. 可追溯矩阵中不包含前端相关条目
4. 其他流程不变

## Workflow

| 步骤 | 文件 | 目标 |
|------|------|------|
| 1 | step-01-init.md | 初始化，读取需求和设计文档 |
| 2 | step-02-functional.md | 编写功能测试用例 |
| 3 | step-03-edge.md | 编写边界和异常用例 |
| 4 | step-04-complete.md | 完成确认，生成可追溯矩阵 |

## 可追溯矩阵

需求 → 测试用例 → 测试结果 的完整追溯:

| 需求编号 | 需求描述 | 用例编号 | 用例描述 | 测试结果 |
|---------|---------|---------|---------|---------|
| FR-001 | | TC-001 | | |

## State Tracking

```yaml
phases:
  6-testcase:
    status: IN_PROGRESS
```
