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

检查 `docs/sdd/` 目录下每个阶段产物文件是否存在。

### Step 3: 展示进度概览

```
🎯 FLNext-SDD 工作流进度 — {PROJECT_NAME}
   项目类型: {greenfield/brownfield}

  0. Discovery       [████████] ✅ CONFIRMED   — project-context.md, tech-stack.md
  1. 需求讨论        [████████] ✅ CONFIRMED   — requirement-scope.md
  2. 原型设计+PRD    [████████] ✅ CONFIRMED   — prototype.md, prototype.html, prd.md
  3. 架构设计        [████████] ✅ CONFIRMED   — architecture.md, database.md
  3b.架构评审        [████████] ✅ PASS        — review-report.md
  4. 后端开发        [████░░░░] 🔧 IN_PROGRESS (Phase A 编译: ✅ 通过)
  5. 前端开发        [░░░░░░░░] ⏳ PENDING
  6. 测试用例        [░░░░░░░░] ⏳ PENDING
  7. 功能测试        [░░░░░░░░] ⏳ PENDING
  8. 提测            [░░░░░░░░] ⏳ PENDING
  9. 验收            [░░░░░░░░] ⏳ PENDING
  10. 发布           [░░░░░░░░] ⏳ PENDING

当前阶段: 4 — 后端开发
7-Wave 进度: Wave 3/7 (Repository+Service+Controller 并行)
编译门禁: Phase A ✅ 通过 | Phase B ⏳ 待检查
下一步: /flnext-sdd-backend 继续后端开发
```

### Step 4: 展示 7-Wave 详情

如当前处于开发阶段(4或5)，展示 Wave 进度:

```
🌊 7-Wave 开发编排:

  Wave 1: 数据库迁移       ✅ Completed
  Wave 2: Entity+DTO       ✅ Completed
  Wave 3: Repo+Service+Ctrl 🔄 In Progress
  Wave 4: 后端测试+API Client ⏳ Pending
  ──── Phase A 后端编译门禁 ────
  Wave 5: 共享组件         ⏳ Pending
  Wave 6: 页面+状态+路由   ⏳ Pending
  Wave 7: 验证+错误处理    ⏳ Pending
  ──── Phase B 前端编译门禁 ────
```

### Step 5: 展示快速操作

```
📋 快速操作:
  → 继续当前阶段: /flnext-sdd-backend
  → 查看项目上下文: 打开 docs/sdd/project-context.md
  → 查看配置: 打开 .flnext-sdd/config.yaml
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
| PASS | ✅ | 评审通过 |
| REWORK | 🔄 | 需要返工 |
| HOLD | ⏸️ | 暂停 |
