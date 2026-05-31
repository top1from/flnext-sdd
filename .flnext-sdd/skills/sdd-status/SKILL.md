---
name: "flnext-sdd-status"
description: "[状态] 查看 SDD 工作流当前阶段、产物状态和进度概览。Triggers on '状态', 'status', '进度', '当前阶段'"
---

# SDD 状态查看

查看当前规格驱动开发的进度和所有产物状态。

## 执行流程

### Step 1: 读取状态文件

读取 `STATE.md` 和 `docs/sdd/` 目录下的配置。

### Step 2: 检查产物文件

检查 `docs/sdd/{feature_name}/` 及项目级 `docs/sdd/` 下各阶段产物是否存在。

### Step 3: 展示进度概览

```
🎯 FLNext-SDD 工作流进度 — {PROJECT_NAME} (v4.0)
   项目类型: {greenfield/brownfield}
   当前功能: {feature_name}

  0. Discovery       [████████] ✅ CONFIRMED   — project-context.md, tech-stack.md
  1. 需求讨论        [████████] ✅ CONFIRMED   — requirement-scope.md
  2. 原型设计+PRD    [████████] ✅ CONFIRMED   — prototype.md, prototype.html, prd.md
  3. 架构设计        [████████] ✅ CONFIRMED   — architecture.md, database.md
  3b.架构评审        [████████] ✅ PASS        — review-report.md
  4. 后端开发        [████░░░░] 🔧 IN_PROGRESS (Phase A 编译: ✅ 通过)
  5. 前端开发        [░░░░░░░░] ⏳ PENDING
  6. 测试用例        [░░░░░░░░] ⏳ PENDING
  7. 功能测试        [░░░░░░░░] ⏳ PENDING
  7b.集成门控        [░░░░░░░░] ⏳ PENDING
  8. 提测            [░░░░░░░░] ⏳ PENDING
  9. 验收            [░░░░░░░░] ⏳ PENDING
  10. 发布           [░░░░░░░░] ⏳ PENDING

进度: {completed_phases}/13 ({percent}%)
宪法合规: {constitution_compliance.status} (违规: {violations})
当前阶段: {current_phase} — {phase_name}
7-Wave 进度: Wave {N}/7
编译门禁: Phase A {status} | Phase B {status}
下一步: {next_action}
```

### Step 4: 展示 7-Wave 详情

如当前处于开发阶段(4或5)，展示 Wave 进度（同 v3.0 格式）。

### Step 5: 展示快速操作

```
📋 快速操作:
  → 继续当前阶段: {next_action}
  → 查看项目上下文: docs/sdd/project-context.md
  → 查看配置: .flnext-sdd/config.yaml
  → 宪法审计: npx flnext-sdd --audit
  → 重新扫描项目: /flnext-sdd-discovery
```

## 状态映射

| 状态 | 图标 | 含义 |
|------|------|------|
| PENDING | ⏳ | 未开始 |
| IN_PROGRESS | 🔧 | 进行中 |
| AWAITING_CONFIRMATION | ⏸️ | 等待确认 |
| CONFIRMED | ✅ | 已确认 |
| COMPLETE | 🎉 | 已完成 |
| PASS | ✅ | 评审/测试通过 |
| REWORK | 🔄 | 需要返工 |
| HOLD | ⏸️ | 暂停 |
