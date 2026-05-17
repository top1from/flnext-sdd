# Step 4: Wave 4 执行 — 后端测试 + API Client 类型

## Goal

完成后端集成测试和前端 API Client 类型生成。

## Mandatory Execution Rules

1. 子代理并行执行
2. 后端测试必须实际运行（不能跳过）
3. API Client 类型必须与后端 Controller 返回类型一致

## Instructions

### 4.1 并行启动子代理

| 子代理 | 任务 | 说明 |
|--------|------|------|
| B-08 | 后端集成测试 | 测试所有 API 端点的 CRUD 操作 |
| F-01 | API Client Types | 为前端生成 TypeScript 接口类型 |

### 4.2 后端测试要求

```bash
npm test  # 或 npm run test:backend
```

检查:
- [ ] 所有 API 端点至少 1 个测试
- [ ] POST/PUT 接口测试了输入校验
- [ ] DELETE 接口测试了不存在资源的处理
- [ ] 测试覆盖率 > 70%

### 4.3 API Client Types

生成前端可用的类型定义文件:
- `src/types/api.ts` 或 `src/api/types.ts`
- 包含所有 Response DTO 的 TypeScript 接口
- 包含 Request Body 类型

### 4.4 提交

```bash
git add src/test/ src/types/api.ts
git commit -m "feat(B-08,F-01): add backend tests + API client types"
```

---

**下一步**: ./step-05-gate-a.md (Phase A 编译门禁)
