# Step 0: 创建测试环境分支 (beta/xxx)

## Goal

基于最新 develop 分支创建 beta/{版本号} 分支，用于测试验收环境部署。

## 工作流概述

```
develop → beta/{version} → 推送到远程 → 部署到测试/验收环境
```

## 触发时机

- 提测完成（阶段 8 CONFIRMED）
- 验收阶段开始时自动执行
- 后续修复可基于此 beta 分支进行

## Mandatory Execution Rules

1. 确认 develop 分支已包含提测代码
2. 基于 develop 创建 beta 分支
3. 推送到远程
4. 记录分支创建信息

## Instructions

### 0.1 确认 develop 状态

```bash
git checkout develop
git pull origin develop
git log --oneline -5
```

确认 develop 已包含本次提测的所有提交。

### 0.2 确定版本号

**格式**: `beta/{project}-{date}` 或 `beta/{version}`

**示例**:
- `beta/short-url-v1.0`
- `beta/2026-05-10`
- `beta/sprint-22`

询问用户确认版本号：
```
当前 develop 最新提交: {commit hash}
建议 beta 分支名: beta/{project}-{version}
是否使用此分支名？(确认/N/自定义)
```

### 0.3 创建并推送 Beta 分支

```bash
git checkout -b beta/{version} develop
git push -u origin beta/{version}
```

确认：
```
✅ Beta 分支创建成功
分支: beta/{version}
基于: develop @ {commit hash}
远程: origin/beta/{version}
```

### 0.4 Beta 分支用途说明

```
Beta 分支用途:
  ├── 部署到测试/验收环境
  ├── QA 在此环境执行验收测试
  ├── 发现问题在此分支修复
  │   └── 修复后同步回 develop（cherry-pick 或新 MR）
  └── 验收通过后，develop 合并到 main 发布
```

### 0.5 更新 STATE.md

```yaml
phases:
  9-accept:
    status: IN_PROGRESS
    beta_branch: "beta/{version}"
    beta_base: "develop@{commit}"
    created_at: [当前日期]
```

---

**下一步**: ./step-01-verify.md（对照需求边界验证功能）
