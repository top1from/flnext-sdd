# Step 2: 收集反馈意见

## Goal

向用户展示评审结果，讨论需要改进的点。

## Mandatory Execution Rules

1. 展示评审汇总
2. 讨论CONCERN/FAIL项
3. 确认改进方案
4. 更新 STATE.md

## Instructions

### 2.1 展示评审汇总

显示评审结果表格:

| 检查项 | 结果 | 意见 |
|--------|------|------|
| 架构合理性 | PASS/CONCERN/FAIL | [意见] |
| 技术选型 | PASS/CONCERN/FAIL | [意见] |
| 扩展性 | PASS/CONCERN/FAIL | [意见] |
| 性能 | PASS/CONCERN/FAIL | [意见] |
| 安全 | PASS/CONCERN/FAIL | [意见] |
| 数据库设计 | PASS/CONCERN/FAIL | [意见] |

### 2.2 讨论CONCERN/FAIL项

对每项CONCERN/FAIL询问用户:
"对于[检查项]，评审意见是[意见]。您认为需要修改吗？"

**IF 用户认为需要修改:**
- 记录修改建议
- 标记为需要返工

**IF 用户接受现状:**
- 记录接受原因
- 保持评审结果

### 2.3 确认改进方案

汇总所有需要改进的点，确认改进方案。

---

**下一步**: ./step-03-approval.md