# Step 1: 验收环境验证准备

## Goal

确认提测完成，准备验收环境。

## Instructions

### 1.1 检查前置条件

- [ ] Phase 8-submit CONFIRMED
- [ ] MR 已合并到 develop
- [ ] docs/sdd/{FEATURE_NAME}/SUBMISSION.md 存在

### 1.2 读取验收依据

加载以下文档作为验收标准:
- docs/sdd/{FEATURE_NAME}/requirement-scope.md — 需求边界
- docs/sdd/{FEATURE_NAME}/prd.md — 验收标准
- docs/sdd/{FEATURE_NAME}/test-report.md — 测试结果

### 1.3 确认验收范围

列出需要验收的功能点:
```
验收清单:
  FR-001: [功能描述] — 验收人: {产品经理}
  FR-002: [功能描述] — 验收人: {QA}
  ...
```

---

**下一步**: ./step-02-deploy.md（部署到验收环境）
