---
name: "flnext-sdd-submit"
description: "[8/13] 提测 — feature 分支 rebase develop 后推送，通过 MR/PR 合并。Triggers on '提测', 'submit', '提交测试'"
---

# 阶段8: 提测 (Submit)

## Overview

将 feature 分支 rebase 到最新 develop，推送到远程，通过 Merge Request / Pull Request 合并到 develop 分支。

**采用 Rebase + MR/PR 流程**（兼容 GitLab / GitHub）:
```
feature/xxx → rebase develop → AI 自检 → push feature → MR/PR（附自检报告）→ 合并到 develop
```

## Hard Gate

**所有前置阶段必须 CONFIRMED 才能提测**

## 输出文件

- `docs/sdd/{FEATURE_NAME}/SUBMISSION.md` — 提测报告

## 前置条件

1. 集成门控完成 (Phase 7b CONFIRMED)
2. 功能测试通过 (Phase 7 result: PASS)
3. 所有代码已在 feature 分支提交
4. 功能分支测试通过

### 纯后端项目说明

如果项目为纯后端（`project_backend_only: true`）：
- Phase 5 (前端) 状态为 SKIPPED
- Phase B 门禁状态为 SKIPPED
- 集成门控仅验证 Phase A
- 其他流程不变

## Workflow

| 步骤 | 文件 | 目标 |
|------|------|------|
| 1 | step-01-init.md | 最终门控检查 |
| 2 | step-02-branch.md | Feature rebase develop |
| 2.5 | step-02.5-self-check.md | **AI 代码自检（强制）** |
| 3 | step-03-push.md | 推送 + GitLab MR |
| 4 | step-04-complete.md | 完成确认 |

## Git 操作流程（严格顺序）

```bash
# Step 2: Rebase 流程
git branch --show-current                    # 确认在 feature/xxx
git add . && git commit -m "..."            # 提交未完成更改
git checkout develop && git pull            # 拉取 develop 最新
git checkout feature/xxx                    # 切回 feature
git rebase develop                          # rebase 到最新 develop
# → 解决冲突（如有）→ git rebase --continue

# Step 2.5: AI 代码自检
# → 读取 references/ai-self-check.md
# → 对 git diff develop...feature/{name} 逐条检查
# → 输出自检报告（附在 MR/PR 描述中）
# → ❌ 不通过项：必须修复后才能继续
# → ⚠️ 需关注项：标注在报告中，人工判断

# Step 3: 推送 + MR/PR
git push origin feature/xxx                 # 推送 feature 分支
# → GitLab: Merge Requests → New MR → Source: feature/xxx → Target: develop
# → GitHub: Pull Requests → New PR → base: develop ← compare: feature/xxx
#   Description: 包含自检报告
# → 创建 MR/PR → 合并
```

## 最终门控检查

```
Final Gate Check:
  Phase 0 (Discovery):    {{status}}
  Phase 1 (Requirement):  {{status}}
  Phase 2 (Prototype):    {{status}}
  Phase 3 (Architecture): {{status}}
  Phase 3b (Review):      {{status}}
  Phase 4 (Backend):      {{status}}  Phase A: {{gate_a}}
  Phase 5 (Frontend):     {{status}}  Phase B: {{gate_b}}
  Phase 6 (TestCases):    {{status}}
  Phase 7 (Testing):      {{status}}  result: {{test_result}}
  Phase 7b (Integration): {{status}}  result: {{integration_result}}
```

## State Tracking

```yaml
phases:
  8-submit:
    status: IN_PROGRESS
    branch: "feature/{name}"
    mr_url: ""
    strategy: "rebase + GitLab MR"
    self_check:
      passed: 0
      warnings: 0
      failed: 0
```
