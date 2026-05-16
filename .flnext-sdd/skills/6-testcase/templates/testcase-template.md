---
stepsCompleted: []
workflowType: 'testcase'
created: {{date}}
---

# 测试用例文档 - {{project_name}}

## 1. 测试范围

### 1.1 功能需求覆盖

| 需求编号 | 功能名称 | 测试用例编号 |
|----------|----------|--------------|
{{requirement_coverage}}

---

## 2. 功能测试用例

{{functional_testcases}}

---

## 3. 边界测试用例

{{edge_testcases}}

---

## 4. 用例统计

| 类型 | 数量 |
|------|------|
| 功能测试 | {{functional_count}} |
| 边界测试 | {{edge_count}} |
| **总计** | **{{total_count}}** |

---

> 此文档由 FLTeam-SDD 自动生成
> 阶段: 测试用例编写
> 状态: {{status}}