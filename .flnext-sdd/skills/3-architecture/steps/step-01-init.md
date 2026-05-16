# Step 1: 初始化架构设计

## Goal

读取PRD文档，为架构设计做准备。

## Mandatory Execution Rules

1. 检查前置条件
2. 读取 prd.md
3. 提取功能需求作为设计依据
4. 更新 STATE.md

## Instructions

### 1.1 检查前置条件

读取 STATE.md，检查:
- phase_history 是否包含 phase: 2 (prototype)
- docs/sdd/{FEATURE_NAME}/prd.md 是否存在

**IF 前置条件不满足:**
提示用户先完成原型设计阶段。

### 1.2 读取PRD文档

读取 docs/sdd/{FEATURE_NAME}/prd.md，提取:
- 功能需求列表 (FR-xxx)
- 非功能需求 (NFR-xxx)
- 性能和安全要求

### 1.3 确认设计范围

向用户确认:
"我将基于以下功能需求进行架构设计：[列出FR]。这些是否是需要架构支持的功能？"

---

**下一步**: ./step-02-tech-stack.md