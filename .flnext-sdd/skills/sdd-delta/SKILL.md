---
name: "flnext-sdd-delta"
description: "Delta 规格变更管理 — 合并增量需求变更到主规格文档。Triggers on 'delta', '需求变更', '规格变更', '增量变更'"
---

# Delta 规格变更管理

## Overview

当需求发生变更时，使用 Delta（增量）模型记录变更，而不是重写整个规格文档。Delta 系统支持 ADDED、MODIFIED、REMOVED、RENAMED 四种操作。

## 使用场景

- Bug 修复暴露规格歧义或错误
- 重构导致行为变化需反映到规格
- 发现新边界条件需扩展需求
- 需求优先级调整或删除
- 后续任务修改已交付功能

## Workflow

| 步骤 | 目标 |
|------|------|
| 1 | 创建 Delta 变更文件 |
| 2 | 执行 Delta 合并 |
| 3 | 更新主规格文档 |

## 执行流程

### Step 1: 创建 Delta 变更文件

在 `docs/sdd/{FEATURE_NAME}/deltas/` 目录下创建 Delta 文件：

```
delta-{YYYY-MM-DD}-{short-description}.md
```

Delta 文件格式：

```markdown
# Delta: {变更描述}

> 变更类型: {需求变更 / Bug修复 / 架构调整 / 优化}
> 日期: {YYYY-MM-DD}
> 影响阶段: {受影响的阶段列表}
> 状态: {提议 / 已确认}

## ADDED（新增）

### FR-00N: {新增需求}
- 描述: ...
- 优先级: P1
- 验收标准: ...

## MODIFIED（修改）

### FR-003: {修改后的需求}
- 原描述: {原来的内容}
- 修改为: {新的内容}
- 修改原因: {为什么改}

## REMOVED（删除）

### FR-007: {已删除的需求}
- 删除原因: {为什么删除}

## RENAMED（重命名）

### FR-005 → FR-005a: {新名称}
- 重命名原因: ...

## 影响分析

| 阶段 | 影响 | 动作 |
|------|------|------|
| 1. 需求 | - | 更新 requirement-scope.md |
| 2. 原型 | 页面布局调整 | 更新 prototype.md |
| 3. 架构 | 无影响 | - |
| 4. 后端 | API 端点增减 | 重新实现受影响端点 |
| 5. 前端 | 页面组件调整 | 重新实现受影响组件 |
| ... | | |

## 回滚路径

从受影响的最早阶段重新开始，但保留已确认的 Delta 记录。
```

### Step 2: 执行 Delta 合并

使用 CLI 命令合并 Delta：

```bash
npx flnext-sdd --delta-merge --feature {FEATURE_NAME}
```

或在 Claude Code 中使用：

```
/flnext-sdd-delta
```

合并流程：
1. 读取 `deltas/` 下所有未归档文件
2. 解析并校验 YAML front-matter
3. 构建冲突矩阵（同 target_id 多 delta、REMOVED+MODIFIED 等）
4. 验证 target_id 在主 spec 中存在
5. 按时间顺序应用：RENAMED → ADDED → MODIFIED → REMOVED
6. 生成合并报告
7. 归档已合并的 Delta 文件

### Step 3: 更新主规格文档

合并完成后，手动更新以下规格文档：
- `requirement-scope.md` — 需求边界
- `architecture.md` — 技术架构
- `database.md` — 数据库设计
- `api-design.md` — API 设计

## 冲突处理

当检测到冲突时：
1. 生成 `merge-conflict-report.md`
2. 暂停合并流程
3. 等待人工裁决

冲突优先级：已提交代码 > ADR > git log > 人工裁决

## State Tracking

合并完成后更新 STATE.md：

```yaml
phases:
  {当前阶段}:
    delta_merged: true
    last_merge_date: "{YYYY-MM-DD}"
```

## Mandatory Execution Rules

1. **任何需求变更都必须记录 Delta** — 不能直接修改原文档
2. **Delta 文件必须包含影响分析** — 标注哪些阶段受影响
3. **冲突必须人工裁决** — AI 不得自动解决冲突
4. **合并后必须更新主规格文档** — Delta 只是变更记录
5. **归档后保留完整历史** — 不得删除已合并的 Delta

## Menu Options

[C] 创建新的 Delta 变更文件
[M] 执行 Delta 合并
[V] 查看待合并的 Delta 文件
[H] 查看帮助 (/flnext-sdd-help)
