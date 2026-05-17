# Step 3: Wave 3 执行 — Repository + Service + Controller + Auth

## Goal

并行启动 4 个子代理，实现业务逻辑核心层。

## Mandatory Execution Rules

1. 子代理并行执行，每个独立上下文
2. 每个子代理实现完成后提交原子 commit
3. 两阶段审查：规格合规 → 代码质量

## Instructions

### 3.1 并行启动子代理

| 子代理 | 任务 | 文件范围 |
|--------|------|---------|
| B-04 | Repository Layer | {entity}Repository |
| B-05 | Service Layer | {entity}Service |
| B-06 | Controller / API | {entity}Controller |
| B-07 | Auth | AuthGuard / JWT Filter |

### 3.2 每个子代理接收

- 任务 XML（从 IMPLEMENTATION.md 提取）
- ADR 决策记录（数据库/API/认证）
- 原型线框图上下文

### 3.3 两阶段审查

**阶段1: 规格合规**
- 代码是否匹配 architecture.md 的 API 设计？
- 代码是否匹配 database.md 的表结构？
- Response DTO 是否与前端约定的接口一致？

**阶段2: 代码质量**
- 类型安全
- 错误处理（每个 Controller 方法有对应的异常处理）
- 边界情况（null/empty/invalid input）
- 日志（关键操作有 info，异常有 error）

### 3.4 原子提交

```bash
git add {entity}Repository.ts {entity}Service.ts {entity}Controller.ts
git commit -m "feat(B-04~B-07): add {entity} repository/service/controller/auth"
```

---

**下一步**: ./step-04-wave4.md
