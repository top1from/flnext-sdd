# Step 5: 完成确认 (Hard Gate)

## Goal

确认原型设计和PRD完成，获取用户确认进入架构设计阶段。

## Hard Gate

**本步骤是阶段门控点，必须用户明确确认才能进入下一阶段**

## Mandatory Execution Rules

1. 显示所有输出文件列表
2. 使用 AskUserQuestion 获取用户确认
3. 根据用户选择执行相应操作
4. 更新 STATE.md

## Instructions

### 5.1 输出文件确认

显示本阶段输出文件:

```
📄 原型设计阶段输出文件：

1. docs/sdd/{FEATURE_NAME}/prototype.md - 原型设计描述文档
2. docs/sdd/{FEATURE_NAME}/prototype.html - HTML原型文件
3. docs/sdd/{FEATURE_NAME}/prd.md - 产品需求文档

请确认以上文件是否都符合预期。
```

### 5.2 用户确认 (AskUserQuestion)

使用 AskUserQuestion 工具:

```
问题: 原型设计阶段是否完成？确认后进入架构设计阶段。

选项:
- [Y] ✅ 确认完成，进入架构设计阶段 (/flnext-sdd-architecture)
- [N] ❌ 需要修改原型或PRD
- [S] 💾 保存当前进度，稍后继续
```

### 5.3 确认后操作

**IF 用户选择 [Y]:**

1. 更新 STATE.md:
```yaml
current_phase: 2
phase_status: completed
current_step: ""
steps_completed: ["step-01-init", "step-02-prototype", "step-03-preview", "step-04-prd", "step-05-complete"]
next_action: /flnext-sdd-architecture
progress:
  completed_phases: 2
  percent: 22
phase_history:
  - phase: 1
    name: requirement
    status: completed
    output: docs/sdd/{FEATURE_NAME}/requirement-scope.md
  - phase: 2
    name: prototype
    status: completed
    completed_at: [当前日期]
    output: docs/sdd/{FEATURE_NAME}/prototype.md, docs/sdd/{FEATURE_NAME}/prototype.html, docs/sdd/{FEATURE_NAME}/prd.md
    confirmed_by: 用户确认
```

2. 提示用户:
```
✅ 原型设计阶段已完成！

📄 输出文件:
- docs/sdd/{FEATURE_NAME}/prototype.md
- docs/sdd/{FEATURE_NAME}/prototype.html
- docs/sdd/{FEATURE_NAME}/prd.md

➡️ 下一步: 运行 /flnext-sdd-architecture 开始架构设计阶段
```

**IF 用户选择 [N]:**

询问需要修改的内容:
- 修改原型设计？→ 返回 step-02-prototype
- 修改PRD文档？→ 返回 step-04-prd

**IF 用户选择 [S]:**

更新 STATE.md 保存进度，显示摘要。

## Menu Options

本步骤由 AskUserQuestion 控制，无额外菜单选项。

---

**阶段完成**: 进入 /flnext-sdd-architecture