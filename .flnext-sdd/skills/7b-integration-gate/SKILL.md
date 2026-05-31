---
name: "flnext-sdd-integration-gate"
description: "[7b/13] 集成门控 — 验证 Phase A/B 双编译门禁同时通过并完成全栈联调（下一步 /flnext-sdd-submit）。Triggers on '集成门控', 'integration gate', '联调门控'"
---

# 阶段 7b: 集成门控 (Integration Gate)

## Overview

集成门控是 FLNext-SDD v4.0 的强制检查点。在后端和前端分别通过各自的编译门禁、功能测试通过后，本阶段验证两者**同时**处于 PASSED 状态，并完成全栈联调验证。

> 一个绿的后端和一个红的前端意味着项目**不可提测**。本阶段确保这个简单但致命的问题不会被忽略。

## 输出文件

- `docs/sdd/{FEATURE_NAME}/integration-gate-report.md` — 集成门控验证报告

## Hard Gate

- Phase 7 (Testing) 必须为 CONFIRMED，且 result = PASS
- Phase A 编译门禁状态为 PASSED
- Phase B 编译门禁状态为 PASSED

## Agent

**Primary:** Hawk (Tester)
**Supporting:** Iron (Backend), Pixel (Frontend)

## Workflow

| Step | File | 目标 |
|------|------|------|
| 1 | step-01-verify.md | 双门控验证 + 全栈联调 |
| 2 | step-02-complete.md | 完成确认（Hard Gate） |

## 验证清单

- [ ] Phase A 门禁报告存在且状态为 PASSED
- [ ] Phase B 门禁报告存在且状态为 PASSED
- [ ] 全栈干净构建通过
- [ ] 端到端测试通过（关键用户流程）
- [ ] 数据库迁移在干净环境可运行
- [ ] 前端可正确调用后端 API（无 CORS/序列化问题）

## 失败处理

如果任何一项失败：
1. 记录失败的门控和具体错误
2. 路由回对应 Phase（后端失败 → Phase 4，前端失败 → Phase 5，联调问题 → Phase 7）
3. 修复后重新触发本阶段

## 纯后端项目处理

如果 STATE.md 中 `project_backend_only: true`：

1. Phase B 门禁自动标记为 SKIPPED
2. 只验证 Phase A 门禁
3. 跳过前端相关联调验证
4. 更新状态并提示用户

```yaml
# 自动跳过逻辑
if (project_backend_only && phase5_status === 'SKIPPED') {
  await updateState({
    phaseB_gate: 'SKIPPED',
    compilation_gates: { frontend: { status: 'SKIPPED' } }
  });
  console.log('✅ 纯后端项目，Phase B 门禁自动跳过');
  console.log('仅验证 Phase A 门禁...');
  // 继续验证 Phase A 门禁
}
```

## State Tracking

```yaml
phases:
  7b-integration-gate:
    status: IN_PROGRESS
    result: ""    # PASS / REWORK
```
