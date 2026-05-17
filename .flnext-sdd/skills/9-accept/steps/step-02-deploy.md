# Step 2: 创建 Beta 分支并部署

## Goal

基于 develop 创建 beta 分支，部署到验收测试环境。

## Instructions

### 2.1 创建 Beta 分支

```bash
git checkout develop && git pull origin develop
git checkout -b beta/{version}
git push -u origin beta/{version}
```

> 版本号示例: v1.0 / sprint-22 / release-2026-05

### 2.2 部署到验收环境

根据项目 CI/CD 配置:
- 自动部署: beta 分支推送触发 CI pipeline
- 手动部署: 登录部署平台选择 beta 分支

### 2.3 确认部署状态

```
验收环境:
  分支: beta/{version}
  URL: https://beta.your-app.com
  部署状态: ✅ 成功 / ❌ 失败
```

**IF 部署失败**: 检查 CI/CD 日志 → 修复 → 重新部署

---

**下一步**: ./step-03-test.md（执行验收测试）
