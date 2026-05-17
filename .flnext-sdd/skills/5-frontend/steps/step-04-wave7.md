# Step 4: Wave 7 执行 — 表单验证 + 错误处理

## Goal

完成表单输入验证、API 错误处理和全局异常边界。

## Instructions

### 4.1 并行子代理

| 子代理 | 任务 | 覆盖 |
|--------|------|------|
| F-06 | 表单验证 | 所有表单的输入校验 |
| F-07 | 错误处理 | API 错误 + 全局错误边界 |

### 4.2 表单验证

每个表单输入框必须有:
- 必填校验（required）
- 格式校验（email/phone/URL）
- 长度校验（min/max）
- 实时错误提示
- 提交前校验汇总

### 4.3 错误处理

- **API 错误**: 每个 API 调用有 .catch() 或 try-catch
- **网络错误**: 网络断开时有提示，不崩溃
- **服务器错误**: 500 等有友好提示页面
- **全局边界**: ErrorBoundary 包裹根组件
- **重试按钮**: 错误页面提供"重试"操作

### 4.4 提交

```bash
git add src/
git commit -m "feat(F-06,F-07): add form validation + error handling"
```

---

**下一步**: ./step-05-gate-b.md（Phase B 编译门禁）
