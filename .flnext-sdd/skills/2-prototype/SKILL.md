---
name: "flnext-sdd-prototype"
description: "[2/13] 原型设计 — 创建 HTML 原型和 PRD 文档。Triggers on '原型', 'prototype', 'PRD', '界面设计'"
---

# 阶段2: 原型设计

## Overview

基于需求边界文档，创建可交互的 HTML 原型和产品需求文档（PRD）。使用 Playwright 浏览器预览确认。

## Hard Gate

**原型必须通过浏览器预览确认才能进入架构设计**

## 输出文件

- `docs/sdd/{FEATURE_NAME}/prototype.md` - 原型设计描述
- `docs/sdd/{FEATURE_NAME}/prototype.html` - HTML 原型文件
- `docs/sdd/{FEATURE_NAME}/prd.md` - 产品需求文档

## 前置条件

1. 需求讨论完成 (Phase 1 CONFIRMED)
2. docs/sdd/{FEATURE_NAME}/requirement-scope.md 存在
3. 读取 `docs/sdd/project-context.md`（如存在）

## Workflow

| 步骤 | 文件 | 目标 |
|------|------|------|
| 1 | step-01-init.md | 初始化，读取需求文档 |
| 2 | step-02-prototype.md | 创建 HTML 原型 |
| 3 | step-03-preview.md | Playwright 浏览器预览 |
| 4 | step-04-prd.md | 生成 PRD 文档 |
| 5 | step-05-complete.md | 完成确认 |

## 执行流程

### Step 1: 初始化

1. 读取 requirement-scope.md
2. 读取 project-context.md（Brownfield，了解现有 UI 风格）
3. 确认原型范围和页面清单

### Step 2: 创建 HTML 原型

1. 使用原型模板生成 HTML 文件
2. 包含所有 P1 页面
3. 使用 Playwright 打开预览

### Step 3: 浏览器预览确认

1. 在浏览器中直接打开 prototype.html（不要截图）
2. 用户可在浏览器中直接查看和操作原型
3. 用户可提出修改意见
4. 修改后重新在浏览器中预览

### Step 4: 生成 PRD

1. 基于原型和需求文档生成 PRD
2. 包含页面清单、用户旅程、交互规范
3. 4 状态覆盖规范（loading/empty/error/normal）

### Step 5: 完成确认

使用严格确认词确认原型和 PRD。

## State Tracking

```yaml
phases:
  2-prototype:
    status: IN_PROGRESS
```

## Mandatory Execution Rules

1. **必须创建可预览的 HTML 原型**
2. **必须使用 Playwright 预览**
3. **PRD 必须包含 4 状态覆盖规范**
4. **完成确认使用严格确认词**
5. **Brownfield 必须考虑现有 UI 风格一致性**
