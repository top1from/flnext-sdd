# FLNext-SDD 门控规则说明 v3.0

## 门控机制概述

FLNext-SDD 采用多层级门控机制，结合 GLM 的确认门控、Kimi 的严格确认词和 DeepSeek 的双编译门禁。

## 门控类型

### 1. 确认门控（每个阶段）

每个阶段完成时需要用户使用严格确认词确认:

```
✅ 有效确认词: "确认" / "confirm" / "yes" / "Y"
❌ 无效确认词: "ok" / "looks good" / "sure" / "嗯" / "好的"

修改请求: "N" / "no" / "需要修改"
保存进度: "S" / "save" / "保存进度"
```

### 2. 条件门控（阶段前置条件）

| 阶段 | 条件门控 |
|------|----------|
| Discovery | 检测到已有代码库 (Brownfield) |
| 需求讨论 | Discovery 完成 (Brownfield) / 无前置 (Greenfield) |
| 原型设计 | 需求讨论 CONFIRMED |
| 架构设计 | 原型设计 CONFIRMED |
| 架构评审 | 架构设计 CONFIRMED |
| 后端开发 | 评审 PASS |
| 前端开发 | Phase A 编译通过 |
| 测试用例 | Phase B 编译通过 |
| 功能测试 | 测试用例 CONFIRMED |
| 提测 | 测试 PASS + feature rebase develop 成功 |
| 验收 | 提测 CONFIRMED |
| 发布 | 验收 PASS |

### 3. 结果门控

| 阶段 | 结果判定 | 通过条件 |
|------|----------|----------|
| 架构评审 | PASS/REWORK/HOLD | PASS 才能开发 |
| 功能测试 | PASS/REWORK/HOLD | PASS 才能提测 |
| 提测 | PASS/REJECT | feature rebase develop + GitLab MR 合并到 develop |
| 验收 | PASS/CONDITIONAL_PASS/FAIL | PASS 才能发布 |

### 4. 双编译门禁（DeepSeek）

| 门禁 | 阶段 | 检查内容 | 失败处理 |
|------|------|---------|---------|
| Phase A | 后端开发完成后 | 后端代码编译 | 停止，等待人工介入 |
| Phase B | 前端开发完成后 | 前端代码编译 | 停止，等待人工介入 |

**关键规则**: 编译失败后 AI 不得自动修复循环，必须:
1. 展示完整错误日志
2. 分析可能原因
3. 提供修复建议
4. 等待人工确认后再执行

### 5. Drift 门控（Discovery）

后续阶段开始时检测代码库偏离:

| 偏离程度 | 处理 |
|---------|------|
| < 10% 文件变更 | 继续执行，记录变更 |
| 10-20% 文件变更 | 提示用户，确认后继续 |
| > 20% 文件变更 | 触发 Drift 警告，建议重新 Discovery |

## 4 状态机转换规则

```
PENDING → IN_PROGRESS → AWAITING_CONFIRMATION → CONFIRMED
```

| 转换 | 触发条件 |
|------|---------|
| PENDING → IN_PROGRESS | 用户启动该阶段 |
| IN_PROGRESS → AWAITING_CONFIRMATION | 阶段工作完成 |
| AWAITING_CONFIRMATION → CONFIRMED | 用户使用严格确认词 |
| AWAITING_CONFIRMATION → IN_PROGRESS | 用户要求修改（回退） |

**注意**: CONFIRMED 状态不可回退（除非整体回滚）

---

> FLNext-SDD v3.0.0
