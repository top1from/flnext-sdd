# Step 1: 初始化提测

## Goal

确认集成门控与测试均已通过，准备提测流程。

## Mandatory Execution Rules

1. 检查 Phase 7b 集成门控状态
2. 检查 Phase 7 功能测试通过状态
3. 确认代码提交状态
4. 确认 Git 分支状态
5. 更新 STATE.md

## Instructions

### 1.1 检查前置条件

**Phase 7b 集成门控（必须）:**
- `phases.7b-integration-gate.status` = CONFIRMED
- `phases.7b-integration-gate.result` = PASS
- Phase A、Phase B 编译门禁均为 PASSED

**IF 集成门控未完成:**
```
⚠️ 集成门控尚未通过

提测前必须完成双编译门禁 + 全栈联调验证。
运行 /flnext-sdd-integration-gate 完成集成门控。
```

**Phase 7 功能测试:**
- `phases.7-testing.result` = PASS
- 通过率达标

**IF 测试未通过:**
```
⚠️ 功能测试尚未通过

请确保所有测试用例通过后再提测。
运行 /flnext-sdd-testing 查看测试结果。
```

### 1.2 确认代码状态

检查:
- 是否有未提交的代码更改
- 当前分支是否正确

询问用户确认代码状态。

---

**下一步**: [step-02-branch.md](step-02-branch.md)
