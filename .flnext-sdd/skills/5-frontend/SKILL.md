---
name: "flnext-sdd-frontend"
description: "[5/10] 前端开发 — 基于原型设计和后端 API 实现前端界面。使用 7-Wave 编排 Wave 5-7，执行 Phase B 编译门禁。Triggers on '前端开发', 'frontend', 'UI实现'"
---

# 阶段5: 前端开发

## Overview

基于原型设计、PRD 和已开发的后端 API，使用 7-Wave 编排实现前端代码。Wave 5-7 覆盖从组件开发到页面实现的完整流程。完成后执行 Phase B 编译门禁。

## Hard Gate

**Phase B 编译门禁 — 前端编译通过才能进入测试用例阶段**

## 输出文件

- `docs/sdd/{FEATURE_NAME}/ui-spec.md` — UI 实现详情
- 前端代码文件

## 前置条件

- 后端开发 Phase A 编译通过
- 后端 API 可用
- docs/sdd/{FEATURE_NAME}/prototype.md 存在
- docs/sdd/{FEATURE_NAME}/prd.md 存在
- 读取 `docs/sdd/project-context.md`（Brownfield 项目）

## 7-Wave 编排（前端部分）

```
Wave 5 (并行):
  F-02: 共享组件

Wave 6 (并行):
  F-03: 页面组件
  F-04: 状态管理
  F-05: 路由配置

Wave 7 (并行):
  F-06: 表单验证
  F-07: 错误处理 / Loading 状态
```

## Workflow

| 步骤 | 文件 | 目标 |
|------|------|------|
| 1 | step-01-init.md | 初始化 + 读取设计文档 |
| 2 | step-02-wave5.md | Wave 5: 共享组件 |
| 3 | step-03-wave6.md | Wave 6: 页面 + 状态 + 路由 |
| 4 | step-04-wave7.md | Wave 7: 表单验证 + 错误处理 |
| 5 | step-05-gate-b.md | Phase B 编译门禁 |
| 6 | step-06-complete.md | 完成确认 |

## 执行流程

### Step 1: 初始化

1. 检查前置条件（Phase A 通过）
2. 读取 PRD、原型文档、API 设计文档
3. 读取 project-context.md（Brownfield）

### Step 2: Wave 5 执行

**Wave 5** (并行):
- F-02: 共享组件（子代理，基于原型 wireframe）

### Step 3: Wave 6 执行

**Wave 6** (并行):
- F-03: 页面组件（子代理，对照原型设计）
- F-04: 状态管理（子代理）
- F-05: 路由配置（子代理）

**4 状态页面覆盖（DeepSeek）**:

每个页面必须实现以下状态:

| 状态 | 展示 |
|------|------|
| 加载中 | Skeleton / Spinner |
| 数据正常 | 实际内容 |
| 数据为空 | 空状态提示 + 引导操作 |
| 请求错误 | 错误提示 + 重试按钮 |

### Step 4: Wave 7 执行

**Wave 7** (并行):
- F-06: 表单验证
- F-07: 错误处理 / Loading 状态

### Step 5: Phase B 编译门禁

```bash
# 前端编译检查
cd {frontend_dir}
npm run build          # 或 yarn build / pnpm build
```

**门禁结果处理**:

| 结果 | 处理 |
|------|------|
| 编译通过 | 更新 STATE.md compilation_gates.frontend: passed → 继续测试用例 |
| 编译失败 | 更新 STATE.md compilation_gates.frontend: failed + 错误日志 → 停止，等待人工介入 |

**⚠️ 禁止 AI 自动修复循环**: 同 Phase A 规则

### Step 6: 完成确认

展示前端开发总结:
```
🎨 前端开发完成

📄 完成页面: N 个
🔗 对接 API: N 个
🌐 路由: N 条
📝 Commits: N 个
🚪 Phase B 编译: ✅ 通过

⚠️  THIS IS A GATED PHASE ⚠️
确认前端开发成果才能进入测试用例阶段。

To CONFIRM:
  → Reply: "确认" / "confirm" / "yes"
```

## State Tracking

```yaml
phases:
  5-frontend:
    status: IN_PROGRESS
    compilation_gate: "pending"

wave_progress:
  current_wave: 6
  wave_status:
    wave-5: "completed"
    wave-6: "in_progress"

compilation_gates:
  frontend:
    status: "pending"
```

## Mandatory Execution Rules

1. **必须等待 Phase A 编译通过**
2. **必须实现原型定义的所有页面**
3. **每个页面必须覆盖 4 种状态**
4. **Phase B 编译失败必须停止等待人工**
5. **禁止 AI 自动修复编译错误循环**
6. **完成确认使用严格确认词**
