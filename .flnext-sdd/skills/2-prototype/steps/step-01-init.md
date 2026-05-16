# Step 1: 初始化原型设计

## Goal

读取已确认的需求文档，为原型设计做准备。

## Mandatory Execution Rules

1. 检查前置条件是否满足
2. 读取 requirement-scope.md
3. 提取 In Scope 功能列表作为原型设计依据
4. 更新 STATE.md

## Instructions

### 1.1 检查前置条件

读取 STATE.md，检查:
- `phase_history` 是否包含 phase: 1 (requirement)
- `docs/sdd/{FEATURE_NAME}/requirement-scope.md` 是否存在

**IF 前置条件不满足:**
```
⚠️ 前置条件检查失败

需求讨论阶段尚未完成。请先运行 /flnext-sdd-requirement 完成需求讨论。
```

### 1.2 读取需求文档

读取 `docs/sdd/{FEATURE_NAME}/requirement-scope.md`，提取:
- In Scope 功能列表
- 核心场景描述
- 验收标准

### 1.3 确认设计依据

向用户确认原型设计依据:
"我将基于以下需求进行原型设计：[列出功能]。这些是否是原型需要展示的功能？"

### 1.4 确定原型类型

询问用户:
"您希望的原型类型是？"
- **低保真原型**: 线框图风格，展示页面结构和布局
- **中保真原型**: 包含基本样式和部分交互

默认选择低保真原型。

## Menu Options

完成本步骤后:

[C] 继续 - 进入原型设计步骤 (step-02-prototype)
[Q] 退出并保存当前进度

---

**下一步**: ./step-02-prototype.md