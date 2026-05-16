---
stepsCompleted: []
workflowType: 'test-report'
created: {{date}}
---

# 测试报告 - {{project_name}}

## 1. 测试概述

### 1.1 测试范围
{{test_scope}}

### 1.2 测试时间
{{test_time}}

---

## 2. 测试结果统计

| 类型 | 总数 | 通过 | 失败 | 阻塞 | 通过率 |
|------|------|------|------|------|--------|
{{result_statistics}}

**总体通过率**: {{pass_rate}}

---

## 3. 失败用例详情

{{failed_cases}}

---

## 4. 测试结论

{{conclusion}}

---

## 5. 建议

{{recommendations}}

---

> 此文档由 FLTeam-SDD 自动生成
> 阶段: 功能测试
> 状态: {{status}}