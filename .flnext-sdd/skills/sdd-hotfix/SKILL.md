---
name: "flnext-sdd-hotfix"
description: "[紧急] 紧急修复 — P0 生产事故、零日漏洞、数据恢复的快速修复通道，含紧急豁免+事后审计。Triggers on 'hotfix', '紧急修复', 'P0'"
---

# FLNext-SDD Hotfix (Emergency Path)

## Overview

紧急修复通道适用于完整 13 阶段 SDD 流程会造成不可接受延迟的关键生产问题。这是**特权路径**，在 documented Emergency Override 下暂时覆盖部分宪法条款。

**适用场景**（非 convenience shortcut）:
- P0 生产事故：服务宕机、数据损坏、核心功能全量不可用
- 零日漏洞：CVSS ≥ 9.0 且正在被主动利用
- 数据恢复：意外删除、Schema 损坏需紧急回滚

## Hard Gate

- Scout 完成 5 分钟内紧急分诊
- 人类有权人员创建并确认 Emergency Override 记录
- 项目至少完成过一次 Phase 0 (Discovery)
- STATE.md 存在

## Emergency Override 格式

```yaml
emergency_override:
  id: "EMERGENCY-{YYYYMMDD}-{NNN}"
  declared_by: "{human name}"
  declared_at: "{ISO-8601}"
  severity: "P0-CRITICAL"
  reason: "{description}"
  articles_overridden:
    - "Discovery First — 紧急快速扫描"
    - "Spec First — 最简问题描述文档"
    - "Gate Confirmation — 完成时单点确认"
  articles_preserved:
    - "禁止私自变更技术选型 — 完全强制执行"
    - "双编译门禁 — 完全强制执行"
    - "证据胜于断言 / AI 自检 — 完全强制执行"
  approval: "PENDING"  # 须 确认/confirm/yes/Y
```

## Workflow

| Step | 内容 | 负责 |
|------|------|------|
| 1 | 紧急分诊（≤5 分钟）→ `docs/sdd/hotfixes/HF-{date}-triage.md` | Scout |
| 2 | Emergency Override 人类确认 | Human |
| 3 | 最小化修复实现（禁止 scope creep） | Iron / Pixel |
| 4 | 双编译门禁 + 缩写自检（5 类，零 FAIL） | Hawk |
| 5 | 快速合并 develop + main + tag | Hawk |
| 6 | 24 小时内 Post-Mortem / Deviance Report | Scout |

## 紧急状态下仍强制执行

- 禁止私自切换数据库/框架/缓存
- 双编译门禁必须通过
- AI 自检不可跳过（至少 5 类：功能正确性、API 契约、安全、错误处理、跨阶段一致性）

## 事后义务

- 部署 1 小时内：《Deviance Report》
- 部署 24 小时内：《Post-Mortem Report》
- 下一迭代：通过完整 SDD 或 Quick Mode 提交根治方案

## 完成条件

1. Emergency Override 已 CONFIRMED
2. 编译门禁 + 自检零 FAIL
3. 已合并 develop 和 main 并打 tag
4. Post-Mortem 已排期（24 小时内）
