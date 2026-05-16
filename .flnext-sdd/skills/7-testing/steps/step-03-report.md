# Step 3: 生成测试报告

## Goal

汇总测试结果，生成测试报告。

## Mandatory Execution Rules

1. 统计测试结果
2. 分析失败原因
3. 生成报告文档
4. 更新 STATE.md

## Instructions

### 3.1 统计结果

计算:
- 通过数量
- 失败数量
- 阻塞数量
- 通过率

### 3.2 分析失败

对每个失败用例分析:
- 失败原因
- 严重程度
- 是否需要修复

### 3.3 生成报告

使用模板生成 docs/sdd/{FEATURE_NAME}/test-report.md:
- 测试概述
- 结果统计
- 失败详情
- 结论建议

---

**下一步**: ./step-04-complete.md