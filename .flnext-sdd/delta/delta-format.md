# Delta 增量变更格式

> FLNext-SDD Delta 系统 — 合并自 SDD-Forge，灵感来自 OpenSpec 差分规格模式。

## 何时使用 Delta

**修改已有、已实现的功能规格**时使用 Delta。全新功能应写完整 spec，不用 Delta。

典型触发场景：
- Bug 修复暴露规格歧义或错误
- 重构导致行为变化需反映到规格
- 发现新边界条件需扩展需求
- 需求优先级调整或删除
- 后续任务修改已交付功能

Delta 与主 spec 并存，在 Release 归档步骤合并回主 spec，保留完整变更历史。

## 目录结构

```
docs/sdd/{feature_name}/
├── requirement-scope.md / architecture.md / ...
└── deltas/
    ├── delta-2026-05-01-add-retry-logic.md
    └── archive/
        └── 2026-05-15-merge-batch/
```

命名：`delta-{YYYY-MM-DD}-{short-description}.md`

## 四种 Delta 操作

1. **ADDED** — 新增需求或章节
2. **MODIFIED** — 修改已有需求（含 before/after）
3. **REMOVED** — 删除需求（须含 rationale 和 evidence）
4. **RENAMED** — 重命名 ID（保持可追溯性）

详见 SDD-Forge 原版 YAML 示例；合并时 config.yaml `delta.enabled: true` 控制启用。

## 合并流程

归档阶段 merge agent 按时间顺序应用 Delta → 一致性检查 → 更新主 spec → 移入 `deltas/archive/` → 记录 CHANGELOG。

冲突时：已提交代码 > ADR > git log > 人工裁决。详见 [merge-guide.md](merge-guide.md)。
