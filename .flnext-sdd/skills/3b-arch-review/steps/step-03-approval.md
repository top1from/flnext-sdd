# Step 3: 评审确认 (Hard Gate)

## Goal

生成评审报告，确认评审结果。

## Hard Gate

**评审通过才能进入开发，不通过必须返回架构设计修改**

## Mandatory Execution Rules

1. 生成评审报告
2. AskUserQuestion 确认评审结果
3. 根据结果决定下一步
4. 更新 STATE.md

## Instructions

### 3.1 生成评审报告

生成 docs/sdd/{FEATURE_NAME}/review-report.md:

内容包含:
- 评审日期
- 评审检查项结果汇总
- 需要改进的点
- 最终评审结论

### 3.2 用户确认 (AskUserQuestion)

```
问题: 架构评审结果确认

选项:
- [PASS] ✅ 评审通过，进入后端开发 (/flnext-sdd-backend)
- [REWORK] ❌ 需要修改架构，返回架构设计 (/flnext-sdd-architecture)
- [HOLD] ⏸️ 暂缓评审，保存进度
```

### 3.3 确认后操作

**IF 用户选择 [PASS]:**

更新 STATE.md:
```yaml
current_phase: 3b
phase_status: completed
next_action: /flnext-sdd-backend
progress:
  completed_phases: 4
  percent: 44
phase_history:
  - phase: 3b
    name: arch-review
    status: completed
    output: docs/sdd/{FEATURE_NAME}/review-report.md
    result: PASS
```

提示:
```
✅ 架构评审通过！

➡️ 下一步: 运行 /flnext-sdd-backend 开始后端开发
```

**IF 用户选择 [REWORK]:**

返回架构设计阶段，修改架构文档后重新评审。

---

**阶段完成**: 进入 /flnext-sdd-backend (如果通过)