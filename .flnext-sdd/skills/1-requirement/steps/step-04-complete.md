# Step 4: 完成确认 (Hard Gate)

## Goal

生成需求边界文档，获取用户确认，完成需求讨论阶段。

## Hard Gate

**本步骤是阶段门控点，必须用户明确确认才能进入下一阶段**

## Mandatory Execution Rules

1. 使用模板生成 requirement-scope.md
2. 显示完整文档内容供用户审阅
3. 使用 AskUserQuestion 获取用户确认
4. 根据用户选择执行相应操作
5. 更新 STATE.md

## Instructions

### 4.1 生成文档

使用模板 `{skill-root}/templates/requirement-scope-template.md` 生成文档:

写入到 `{project-root}/docs/sdd/{FEATURE_NAME}/requirement-scope.md`

文档内容包含:
- 需求背景
- In Scope 功能列表（含优先级）
- Out of Scope 功能列表（含原因）
- 核心场景
- 验收标准

### 4.2 显示文档

向用户展示生成的完整文档:
```
📄 需求边界文档已生成：

[显示文档完整内容]

请仔细审阅文档内容，确认需求范围是否准确。
```

### 4.3 用户确认 (AskUserQuestion)

使用 AskUserQuestion 工具:

```
问题: 需求边界文档是否准确？确认后进入原型设计阶段。

选项:
- [Y] ✅ 确认完成，进入原型设计阶段 (/flnext-sdd-prototype)
- [N] ❌ 需要修改，返回需求讨论
- [S] 💾 保存当前进度，稍后继续
```

### 4.4 确认后操作

**IF 用户选择 [Y]:**

1. 回传AI开始时间到钉钉（见 4.5）
2. 更新 STATE.md:
```yaml
current_phase: 1
phase_status: completed
current_step: ""
steps_completed: ["step-01-init", "step-02-scope", "step-03-priority", "step-04-complete"]
next_action: /flnext-sdd-prototype
progress:
  completed_phases: 1
  percent: 11
phase_history:
  - phase: 1
    name: requirement
    status: completed
    completed_at: [当前日期]
    output: docs/sdd/{FEATURE_NAME}/requirement-scope.md
    confirmed_by: 用户确认
```

3. 提示用户:
```
✅ 需求讨论阶段已完成！

📄 输出文件: docs/sdd/{FEATURE_NAME}/requirement-scope.md

➡️ 下一步: 运行 /flnext-sdd-prototype 开始原型设计阶段
```

### 4.5 回传AI开始时间到钉钉

IF STATE.md `dingtalk.record_id` 不为空:

1. 读取 STATE.md 中的 `dingtalk.base_id`、`dingtalk.table_id`、`dingtalk.record_id`、`dingtalk.field_mapping.ai_start`
2. 获取当前时间（ISO 格式 YYYY-MM-DDTHH:mm:ss）
3. 执行回传:
```bash
dws aitable record update --base-id <BASE_ID> --table-id <TABLE_ID> \
  --records '[{"recordId":"<RECORD_ID>","cells":{"<AI_START_FIELD_ID>":"<CURRENT_TIME>"}}]' \
  --format json
```
4. 确认回传成功，更新 STATE.md `dingtalk.ai_start_time`
5. 向用户确认: "已将AI开始时间回传到钉钉表格"

IF 回传失败:
- 提示用户回传失败，但不阻塞后续流程
- 建议用户手动更新钉钉表格

ELSE (dingtalk.record_id 为空):
- 跳过钉钉回传（手动输入模式）

**IF 用户选择 [N]:**

1. 保持 STATE.md 不更新 phase_status
2. 询问需要修改的内容
3. 返回相应步骤重新讨论

**IF 用户选择 [S]:**

1. 更新 STATE.md:
```yaml
current_step: "step-04-complete"
phase_status: in_progress
```
2. 显示进度摘要
3. 提示用户稍后可以继续

## Menu Options

本步骤由 AskUserQuestion 控制，无额外菜单选项。

---

**阶段完成**: 进入 /flnext-sdd-prototype