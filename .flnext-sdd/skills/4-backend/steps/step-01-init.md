# Step 1: 后端开发初始化

## Goal

创建 feature 分支，生成实现计划。必须先验证数据库可连接。

## Mandatory Execution Rules

1. 检查前置条件（评审 PASS）
2. 读取架构文档和 ADR 决策记录
3. 读取 project-context.md（Brownfield）
4. 创建 feature 分支
5. 生成 IMPLEMENTATION.md

## Instructions

### 1.1 检查前置条件

读取 STATE.md，确认:
- [ ] Phase 3b-arch-review result: PASS
- [ ] docs/sdd/{FEATURE_NAME}/architecture.md 存在
- [ ] docs/sdd/{FEATURE_NAME}/database.md 存在
- [ ] docs/sdd/{FEATURE_NAME}/adr/ 目录存在

### 1.2 创建 Feature 分支

```bash
# 从 develop 创建功能分支
git checkout develop && git pull origin develop
git checkout -b feature/{developer}-{name}
```

> 命名格式: feature/{developer}-{name}，如 feature/qinhaijun-short-url

### 1.3 生成实现计划

基于架构文档生成 IMPLEMENTATION.md:
- 任务分解（按 7-Wave 编排）
- 依赖关系图
- 预计文件清单

---

**下一步**: ./step-02-wave1-2.md（先验证数据库连接）
