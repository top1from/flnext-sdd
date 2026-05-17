# Step 1: 发布准备检查

## Goal

确认所有前置条件满足，准备发布。

## Instructions

### 1.1 最终门控检查

- [ ] Phase 9-accept result: PASS
- [ ] develop 分支测试全部通过
- [ ] 所有文档已产出

### 1.2 构建检查

```bash
git checkout develop && git pull origin develop
npm run test        # 全量测试
npm run build       # 构建检查
npm run lint        # 代码规范检查
```

### 1.3 确认版本号

当前版本: {从 STATE.md 或 package.json 读取}
发布版本: v{version}

---

**下一步**: ./step-02-merge.md（合并到 main）
