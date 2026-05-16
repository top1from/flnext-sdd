# Step 5: 完成确认 (Hard Gate)

## Goal

确认架构设计完成，进入架构评审阶段。

## Hard Gate

**本阶段完成后必须进入架构评审，评审通过才能开发**

## Mandatory Execution Rules

1. 显示输出文件列表
2. AskUserQuestion 确认
3. 更新 STATE.md
4. 提示进入评审阶段

## Instructions

### 5.1 输出文件确认

显示本阶段输出:
- docs/sdd/{FEATURE_NAME}/architecture.md
- docs/sdd/{FEATURE_NAME}/database.md

### 5.2 用户确认 (AskUserQuestion)

```
问题: 架构设计阶段是否完成？确认后进入架构评审。

选项:
- [Y] ✅ 确认完成，进入架构评审 (/flnext-sdd-arch-review)
- [N] ❌ 需要修改架构设计
- [S] 💾 保存当前进度
```

### 5.3 确认后操作

**IF 用户选择 [Y]:**

更新 STATE.md:
```yaml
current_phase: 3
phase_status: completed
next_action: /flnext-sdd-arch-review
progress:
  completed_phases: 3
  percent: 33
phase_history:
  - phase: 3
    name: architecture
    status: completed
    output: docs/sdd/{FEATURE_NAME}/architecture.md, docs/sdd/{FEATURE_NAME}/database.md
```

提示:
```
✅ 架构设计阶段已完成！

➡️ 下一步: 运行 /flnext-sdd-arch-review 进行架构评审
```

---

**阶段完成**: 进入 /flnext-sdd-arch-review