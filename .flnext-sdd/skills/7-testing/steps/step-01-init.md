# Step 1: 初始化功能测试

## Goal

读取测试用例文档，准备测试执行环境。

## Mandatory Execution Rules

1. 检查前置条件
2. 读取 testcase.md
3. 确认测试环境就绪
4. 更新 STATE.md

## Instructions

### 1.1 检查前置条件

检查 phase 6 (testcase) 是否 completed。

### 1.2 读取测试用例

读取 docs/sdd/{FEATURE_NAME}/testcase.md:
- 提取所有测试用例
- 准备测试用例列表

### 1.3 确认测试环境

询问用户:
"测试环境是否已就绪？功能是否可以正常访问？"

---

**下一步**: ./step-02-execute.md