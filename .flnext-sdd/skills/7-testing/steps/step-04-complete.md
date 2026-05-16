# Step 4: 完成确认 (Hard Gate)

## Goal

确认测试结果，决定是否可以提测。

## Hard Gate

**测试通过（通过率>=100%或用户确认）才能提测**

## Mandatory Execution Rules

1. 显示测试统计
2. AskUserQuestion 确认测试结果
3. 根据结果决定下一步
4. 更新 STATE.md

## Instructions

### 4.1 显示测试统计

显示:
```
📊 测试结果统计：

| 类型 | 数量 | 通过 | 失败 | 阻塞 |
|------|------|------|------|------|
| 功能测试 | N | N | 0 | 0 |
| 边界测试 | N | N | 0 | 0 |
| **总计** | **N** | **N** | **0** | **0** |

通过率: 100%
```

### 4.2 用户确认 (AskUserQuestion)

```
问题: 功能测试是否完成？测试结果是否可以提测？

选项:
- [PASS] ✅ 测试通过，进入提测 (/flnext-sdd-submit)
- [REWORK] ❌ 有失败用例，返回修复
- [HOLD] ⏸️ 暂缓，保存进度
```

### 4.3 确认后操作

**IF 用户选择 [PASS]:**

更新 STATE.md:
```yaml
current_phase: 7
phase_status: completed
next_action: /flnext-sdd-submit
progress:
  completed_phases: 8
  percent: 88
```

提示:
```
✅ 功能测试通过！

➡️ 下一步: 运行 /flnext-sdd-submit 进行提测
```

**IF 用户选择 [REWORK]:**

提示用户修复失败的用例，然后重新测试。

---

**阶段完成**: 进入 /flnext-sdd-submit (如果通过)