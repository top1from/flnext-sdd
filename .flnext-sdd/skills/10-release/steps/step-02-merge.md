# Step 2: 合并到 main

## Goal

将 develop 合并到 main 分支，保留完整提交历史。

## Instructions

### 2.1 合并

```bash
git checkout main
git pull origin main
git merge develop --no-ff -m "release: v{version}

Features:
- {feature list from SUBMISSION.md}

SDD Phases Completed:
- 0-Discovery through 9-Accept: All CONFIRMED"
```

### 2.2 确认合并结果

```bash
git log --oneline -5
# 应显示 develop 的所有提交已合并
```

### 2.3 推送

```bash
git push origin main
```

---

**下一步**: ./step-03-tag.md（打版本标签）
