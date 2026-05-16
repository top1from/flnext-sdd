# Step 2: Feature 分支 Rebase 到 Develop

## Goal

按照 GitLab Flow 规范，将 feature 分支 rebase 到最新 develop 分支，为提测做最终准备。

## 工作流概述

```
feature/xxx 提交 → develop 拉最新 → feature rebase develop → 解决冲突 → 推送 feature
```

## Mandatory Execution Rules

1. 检查当前分支和未提交更改
2. 拉取 develop 最新代码
3. feature 分支 rebase 到 develop（不是 merge）
4. 处理冲突（如有）
5. 更新 STATE.md

## Instructions

### 2.1 检查当前分支与工作区状态

```bash
git branch --show-current
git status --porcelain
git log --oneline -5
```

### 2.2 提交未完成的更改

**IF 有未提交更改:**
```bash
git add .
git commit -m "feat: 完成功能开发，准备提测"
```

**IF 工作区干净:**
确认最新提交已包含所有功能代码。

### 2.3 拉取 develop 最新版本

```bash
git checkout develop
git pull origin develop
```

确认 develop 拉取成功：
```
检出: develop
远程: origin/develop 已同步到最新
```

### 2.4 Feature 分支 Rebase

```bash
git checkout feature/{name}
git rebase develop
```

**IF rebase 成功 (无冲突):**
```
✅ Rebase 成功，feature/{name} 已基于最新 develop
```

### 2.5 冲突处理

**IF rebase 产生冲突:**

1. 展示冲突文件列表：
```bash
git diff --name-only --diff-filter=U
```

2. 逐个解决冲突后：
```bash
git add <冲突文件>
git rebase --continue
```

3. 重复直到 rebase 完成。

**⚠️ 重要**: 冲突文件修改需人工确认，AI 不得自动选择合并策略。

**IF 需要放弃 rebase:**
```bash
git rebase --abort
```
提示用户手动处理。

### 2.6 确认 Rebase 结果

```bash
git log --oneline -10
git status
```

确认：
- feature 分支 commits 已重放到 develop 最新提交之上
- 无遗留冲突
- 工作区干净

---

**下一步**: ./step-03-push.md
