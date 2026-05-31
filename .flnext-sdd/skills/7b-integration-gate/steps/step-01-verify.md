# Step 1: 双门控验证 + 全栈联调

## 目标

验证 Phase A（后端）和 Phase B（前端）编译门禁同时通过，并完成全栈联调。

## 验证清单

### 1.1 门控状态检查

- [ ] `phases.4-backend.compilation_gate` = `PASSED`
- [ ] `phases.5-frontend.compilation_gate` = `PASSED`
- [ ] 两份门控报告均存在

### 1.2 全栈干净构建

```bash
# 后端干净构建
mvn clean compile test  # 或对应构建命令

# 前端干净构建
npm run build  # 或对应构建命令
```

### 1.3 端到端联调

- [ ] 前端能成功调用后端 API（真实 HTTP，非 mock）
- [ ] 数据库迁移在干净数据库可运行
- [ ] 无 CORS 错误
- [ ] JSON 序列化 key casing 一致

### 1.4 关键用户流程验证

选择 3-5 个核心用户流程，端到端验证：

- [ ] 流程1: {描述} → ✅/❌
- [ ] 流程2: {描述} → ✅/❌
- [ ] 流程3: {描述} → ✅/❌

## 失败处理

如果任何检查失败：

1. 记录失败项和具体错误
2. 路由回对应 Phase：
   - 后端问题 → Phase 4 (Backend)
   - 前端问题 → Phase 5 (Frontend)
   - 联调问题 → Phase 7 (Testing)
3. 修复后重新执行本阶段

## 输出

```
✅ Step 1 Complete: 双门控验证通过，全栈联调完成
```

**下一步**: [step-02-complete.md](step-02-complete.md)
