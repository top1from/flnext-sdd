---
name: "flnext-sdd-requirement"
description: "[1/10] 需求讨论 — 通过苏格拉底式追问明确需求范围。Triggers on '需求讨论', 'requirement', '开始需求'"
---

# 阶段1: 需求讨论

## Overview

通过苏格拉底式追问，逐步明确需求范围，输出需求边界文档。确保团队对需求的理解一致，避免后期因需求模糊导致的返工。

## Hard Gate

**本阶段完成后必须用户确认才能进入原型设计阶段**

## 输出文件

- `docs/sdd/{FEATURE_NAME}/requirement-scope.md` - 需求边界文档

## 前置条件

1. Brownfield: Discovery 完成 (Phase 0 CONFIRMED)
2. Greenfield: 无前置条件
3. 读取 `docs/sdd/project-context.md`（如存在）

## Workflow

按 `steps/` 目录下的步骤文件顺序执行:

| 步骤 | 文件 | 目标 |
|------|------|------|
| 1 | step-01-init.md | 初始化需求讨论，了解业务背景 |
| 2 | step-02-scope.md | 确定需求边界 |
| 3 | step-03-priority.md | 优先级排序 |
| 4 | step-04-complete.md | 完成确认，输出文档 |

## 执行流程

### Step 1: 初始化

1. 读取 STATE.md，确认项目状态
2. 读取 project-context.md（Brownfield），基于项目上下文调整提问
3. 如果 project_name 为空，询问项目名称并更新
4. 询问业务背景: "这个功能/项目的背景是什么？"
5. 记录关键信息

### Step 2: 确定范围

1. 询问: "这个需求应该包含哪些功能？"
2. 列出用户提出的功能点
3. 询问: "哪些功能本次不实现？为什么？"
4. 建立 In Scope 和 Out of Scope 列表

### Step 3: 优先级排序

1. 对 In Scope 功能进行优先级排序 (P1/P2/P3)
2. 询问: "每个功能的核心场景是什么？"
3. 记录验收标准

### Step 4: 完成确认

1. 使用模板生成 requirement-scope.md
2. 显示文档内容供用户确认
3. 使用严格确认词确认:
   - "确认"/"confirm"/"yes"/"Y" → 确认完成
   - "N"/"no"/"需要修改" → 返回讨论
   - "S"/"save"/"保存进度" → 保存当前进度

## State Tracking

每个步骤完成后更新 STATE.md:
```yaml
current_phase: 1
phase_status: in_progress
current_step: "step-02-scope"
steps_completed: ["step-01-init"]
phases:
  1-requirement:
    status: IN_PROGRESS
```

## Mandatory Execution Rules

1. **必须按顺序执行步骤** - 不能跳过任何步骤
2. **必须记录用户回答** - 每个问题都要记录答案
3. **必须在完成步骤时更新 STATE.md**
4. **必须在 step-04 等待严格确认** - 不接受 "ok"/"looks good"
5. **Brownfield 必须读取 project-context.md**

## Menu Options

[C] 开始需求讨论
[V] 查看已完成的需求文档 (如果存在)
[R] 重新开始需求讨论
[H] 查看帮助 (/flnext-sdd-help)
