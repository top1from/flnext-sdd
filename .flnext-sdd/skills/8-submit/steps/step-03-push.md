# Step 3: 推送 Feature 分支并创建 Merge Request

## Goal

将 rebase 后的 feature 分支推送到远程，并在 GitLab 上创建 Merge Request 合并到 develop。

## 工作流概述

```
推送 feature 分支 → GitLab 创建 MR → source: feature/xxx → target: develop → 提交 MR
```

## Mandatory Execution Rules

1. 推送 feature 分支到远程
2. 引导用户在 GitLab 创建 MR
3. 确认 MR 创建成功
4. 更新 STATE.md

## Instructions

### 3.1 推送 Feature 分支

**首次推送:**
```bash
git push -u origin feature/{name}
```

**已存在远程分支:**
```bash
git push origin feature/{name}
```

**IF rebase 后需要强制推送:**
```bash
git push --force-with-lease origin feature/{name}
```

> ⚠️ 使用 `--force-with-lease` 而非 `--force`，防止覆盖他人推送。

确认推送结果：
```
推送结果: ✅ 成功
远程分支: origin/feature/{name}
推送提交: {commit range}
```

### 3.2 GitLab Merge Request 创建

引导用户按以下步骤操作：

**方式一：GitLab Web UI（推荐）**

```
1. 登录 GitLab，进入项目仓库
2. 点击左侧菜单 "Merge Requests"
3. 点击 "New merge request" 按钮
4. Source branch: feature/{name}
5. Target branch: develop
6. 填写 MR 信息：
   - Title: [类型]{功能简述}
   - Description: 自动填入 SDD 工作流追溯信息
7. 勾选 "Delete source branch when merge request is accepted"（可选）
8. 点击 "Create merge request"
```

**MR 描述模板（含 AI 自检报告）：**

```markdown
## 功能概述

{从 requirement-scope.md 提取的功能描述}

## SDD 工作流追溯

| 阶段 | 状态 | 确认日期 |
|------|------|---------|
| 0. Discovery | ✅ CONFIRMED | |
| 1. 需求讨论 | ✅ CONFIRMED | |
| 2. 原型设计 | ✅ CONFIRMED | |
| 3. 架构设计 | ✅ CONFIRMED | |
| 3b. 架构评审 | ✅ PASS | |
| 4. 后端开发 | ✅ CONFIRMED (Phase A) | |
| 5. 前端开发 | ✅ CONFIRMED (Phase B) | |
| 6. 测试用例 | ✅ CONFIRMED | |
| 7. 功能测试 | ✅ PASS | |
| 8. 提测 | 🟡 IN_PROGRESS | |

## 变更文件

{git diff --stat develop...feature/{name}}

## 🤖 AI 自检报告

{从 step-02.5 的自检结果中复制完整报告}
```

**方式二：GitLab CLI（如已安装 glab）**

```bash
glab mr create \
  --source-branch feature/{name} \
  --target-branch develop \
  --title "[类型]{功能简述}" \
  --description "SDD 工作流追溯见 description"
```

### 3.3 确认 MR 状态

```
MR 状态确认:
  URL: https://gitlab.com/.../merge_requests/{id}
  Source: feature/{name}
  Target: develop
  状态: Open
```

### 3.4 合并后确认

MR 合并完成后确认：

```bash
git checkout develop
git pull origin develop
git log --oneline -5
```

确认 develop 已包含 feature 分支的更改。

---

**下一步**: ./step-04-complete.md
