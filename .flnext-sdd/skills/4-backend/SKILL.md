---
name: "flnext-sdd-backend"
description: "[4/10] 后端开发 — 基于架构评审通过的设计实现后端代码。使用 7-Wave 编排 Wave 1-4，执行 Phase A 编译门禁。Triggers on '后端开发', 'backend', 'API实现'"
---

# 阶段4: 后端开发

## Overview

基于已评审通过的架构设计，使用 7-Wave 编排实现后端代码。Wave 1-4 覆盖从数据库迁移到后端测试的完整流程。完成后执行 Phase A 编译门禁。

## 设计来源

| 特性 | 来源 | 说明 |
|------|------|------|
| Skill+Steps 骨架 | GLM | 分步骤执行 + 模板输出 |
| 7-Wave 编排 | Kimi | 分 Wave 并行执行开发任务 |
| 子代理并行 | Kimi | 每个任务独立子代理 |
| Phase A 编译门禁 | DeepSeek | 后端编译通过才能继续 |
| 严格确认词 | Kimi | 只接受 "确认"/"confirm"/"yes" |
| 4 状态页面覆盖 | DeepSeek | loading/empty/error/normal |

## Hard Gate

**Phase A 编译门禁 — 后端编译通过才能进入前端开发**

## 输出文件

- `docs/sdd/{FEATURE_NAME}/api-design.md` — API 实现详情（补充）
- `docs/sdd/{FEATURE_NAME}/IMPLEMENTATION.md` — 实现计划与进度
- 后端代码文件

## 前置条件

- 架构评审通过 (Phase 3b result: PASS)
- docs/sdd/{FEATURE_NAME}/architecture.md 存在
- docs/sdd/{FEATURE_NAME}/database.md 存在
- 读取 `docs/sdd/project-context.md`（Brownfield 项目）

## Workflow

| 步骤 | 文件 | 目标 |
|------|------|------|
| 1 | step-01-init.md | 初始化 + 创建特性分支 + 生成实现计划 |
| 2 | step-02-wave1-2.md | Wave 1-2: 数据库迁移 + Entity/DTO |
| 3 | step-03-wave3.md | Wave 3: Repository + Service + Controller + Auth |
| 4 | step-04-wave4.md | Wave 4: 后端测试 + API Client 类型 |
| 5 | step-05-gate-a.md | Phase A 编译门禁 |
| 6 | step-06-complete.md | 完成确认 |

## 7-Wave 编排（后端部分）

```
Wave 1 (串行):
  B-01: 数据库迁移

Wave 2 (并行):
  B-02: Entity / Domain Models
  B-03: DTOs (Create/Update)

Wave 3 (并行):
  B-04: Repository Layer
  B-05: Service Layer
  B-06: Controller / API Endpoints
  B-07: Auth (如需)

Wave 4 (并行):
  B-08: 后端集成测试
  F-01: API Client Types (前端前置)
```

## 执行流程

### Step 1: 初始化

1. 读取 STATE.md，检查前置条件（评审 PASS）
2. 读取架构文档和数据库文档
3. 读取 project-context.md（Brownfield）
4. 创建特性分支: `feature/{feature-name}`
5. 生成 IMPLEMENTATION.md（含任务分解和依赖关系）

### Step 2: Wave 1-2 执行

**Wave 1** (串行):
- 执行数据库迁移脚本
- 验证表结构创建正确

**Wave 2** (并行):
- 创建 Entity / Domain Models（子代理 B-02）
- 创建 DTOs（子代理 B-03）

每个子代理接收:
- 任务 XML（从 IMPLEMENTATION.md）
- 相关设计文档段落
- 原型线框图上下文

### Step 3: Wave 3 执行

并行启动 4 个子代理:
- B-04: Repository Layer
- B-05: Service Layer
- B-06: Controller / API Endpoints
- B-07: Authentication / Authorization

两阶段审查:
1. **规范合规**: 代码是否匹配 API-DESIGN.md 和 DB-SCHEMA.md？
2. **代码质量**: 类型安全、错误处理、边界情况、日志

原子提交: `feat(B-04): add {entity} repository layer`

### Step 4: Wave 4 执行

- B-08: 后端集成测试（子代理）
- F-01: API Client Types（前端前置，子代理）

### Step 5: Phase A 编译门禁

**这是关键检查点 — 编译失败必须人工介入**

```bash
# 后端编译检查
cd {backend_dir}
npm run build          # 或 mvn compile / go build / pip check
```

**门禁结果处理**:

| 结果 | 处理 |
|------|------|
| 编译通过 | 更新 STATE.md compilation_gates.backend: passed → 继续前端 |
| 编译失败 | 更新 STATE.md compilation_gates.backend: failed + 错误日志 → 停止，等待人工介入 |

**⚠️ 禁止 AI 自动修复循环**: 编译失败后 AI 不得自动尝试修复，必须:
1. 展示完整错误日志
2. 分析可能原因
3. 提供修复建议
4. 等待人工确认后再执行修复

### Step 6: 完成确认

展示后端开发总结:
```
🔧 后端开发完成

📦 完成模块: N 个
🔗 API 端点: N 个
🗄️ 数据库表: N 张
📝 Commits: N 个
🚪 Phase A 编译: ✅ 通过

⚠️  THIS IS A GATED PHASE ⚠️
确认后端开发成果才能进入前端开发。

To CONFIRM:
  → Reply: "确认" / "confirm" / "yes"
```

## State Tracking

```yaml
phases:
  4-backend:
    status: IN_PROGRESS
    compilation_gate: "pending"

wave_progress:
  current_wave: 3
  wave_status:
    wave-1: "completed"
    wave-2: "completed"
    wave-3: "in_progress"

compilation_gates:
  backend:
    status: "pending"
```

## Mandatory Execution Rules

1. **必须检查评审通过状态**
2. **必须实现所有架构定义的 API**
3. **必须编写单元测试**
4. **Phase A 编译失败必须停止等待人工**
5. **禁止 AI 自动修复编译错误循环**
6. **完成确认使用严格确认词**
