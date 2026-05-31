# Step 4: 提测完成确认

## Goal

确认提测流程全部完成，代码已通过 MR 合并到 develop 分支。

## Hard Gate

**提测完成后进入验收阶段 (/flnext-sdd-accept)**

## Mandatory Execution Rules

1. 显示提测完成状态
2. 确认 MR 状态
3. 更新 STATE.md
4. 提示后续步骤

## Instructions

### 4.1 显示完成状态

显示：
```
🎉 项目提测完成！

Feature 分支: feature/{name}
MR 链接: https://gitlab.com/.../merge_requests/{id}
合并到: develop 分支
合并时间: [时间]

---

📊 SDD 项目完整流程：

| 阶段 | 状态 | 输出文件 |
|------|------|----------|
| 0. Discovery | ✅ 完成 | project-context.md, tech-stack.md |
| 1. 需求讨论 | ✅ 完成 | requirement-scope.md |
| 2. 原型设计 | ✅ 完成 | prototype.md, prototype.html, prd.md |
| 3. 架构设计 | ✅ 完成 | architecture.md, database.md |
| 3b. 架构评审 | ✅ 完成 | review-report.md |
| 4. 后端开发 | ✅ 完成 (Phase A) | api-design.md + 后端代码 |
| 5. 前端开发 | ✅ 完成 (Phase B) | ui-spec.md + 前端代码 |
| 6. 测试用例 | ✅ 完成 | testcase.md |
| 7. 功能测试 | ✅ 完成 | test-report.md |
| 7b. 集成门控 | ✅ 完成 | integration-gate-report.md |
| 8. 提测 | ✅ 完成 | SUBMISSION.md + MR |

---

📁 所有文档输出目录: docs/sdd/
```

### 4.2 更新 STATE.md

```yaml
phases:
  8-submit:
    status: CONFIRMED
    branch: "feature/{name}"
    mr_url: "https://gitlab.com/.../merge_requests/{id}"
    completed_at: [当前日期]
    output: "MR 合并到 develop"
    self_check:
      passed: {N}
      warnings: {N}
      failed: 0

current_phase: 8
next_phase: 9
next_action: /flnext-sdd-accept
progress:
  completed_phases: 10
  percent: 77
```

### 4.3 下一步提示

```
✅ 提测阶段完成！

Git 操作总结:
  1. feature/{name} rebase develop ✅
  2. AI 代码自检: ✅ {N} / ⚠️ {N} / ❌ {N}
  3. 推送 feature/{name} 到远程 ✅
  4. GitLab MR 创建 ✅
  5. MR 合并到 develop ✅

后续操作:
  → /flnext-sdd-accept  进入验收阶段
  → 验收阶段将基于 develop 创建 beta/xxx 分支用于测试环境部署

感谢使用 FLNext-SDD！
```

---

**下一步**: /flnext-sdd-accept（阶段 9: 验收）
