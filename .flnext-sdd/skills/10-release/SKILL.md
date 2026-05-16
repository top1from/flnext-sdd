---
name: "flnext-sdd-release"
description: "[10/10] 发布 — 合并到 main 分支，打版本标签，生成发布说明。Triggers on '发布', 'release', '上线'"
---

# 阶段10: 发布

## Overview

验收通过后，将代码从 develop 合并到 main，打版本标签，生成发布说明。发布后进行回顾（Wonder→Reflect 演化循环），持续改进开发流程。

## Hard Gate

**发布是最终阶段，所有前置阶段必须 CONFIRMED**

## 输出文件

- `docs/sdd/{FEATURE_NAME}/RELEASE-NOTES.md` — 发布说明

## 前置条件

- 验收通过 (Phase 9 result: PASS)
- develop 分支测试全部通过

## Workflow

| 步骤 | 文件 | 目标 |
|------|------|------|
| 1 | step-01-prepare.md | 发布准备检查 |
| 2 | step-02-merge.md | 合并到 main |
| 3 | step-03-tag.md | 打版本标签 |
| 4 | step-04-notes.md | 生成发布说明 |
| 5 | step-05-review.md | **发布后回顾（演化循环）** |
| 6 | step-06-complete.md | 完成确认 |

## 执行流程

### Step 1: 发布准备检查

```bash
# 确认 develop 分支状态
git checkout develop
git pull origin develop
npm run test        # 全量测试
npm run build       # 构建检查
npm run lint        # 代码规范检查
```

### Step 2: 合并到 main

```bash
git checkout main
git pull origin main
git merge develop --no-ff -m "release: {version}

Features:
- {feature list}

SDD Phases Completed:
- 0-Discovery through 9-Accept: All CONFIRMED"
git push origin main
```

### Step 3: 打版本标签

```bash
git tag -a v{version} -m "Release v{version}

{release summary}"
git push origin v{version}
```

### Step 4: 生成发布说明

```markdown
# Release Notes — v{version}

> 发布日期: {DATE}
> 基于分支: develop → main

## 新功能
- {feature list}

## 改进
- {improvements}

## 修复
- {bug fixes}

## SDD 工作流追溯

| 阶段 | 状态 | 确认人 | 日期 |
|------|------|--------|------|
| 0. Discovery | ✅ CONFIRMED | | |
| 1. 需求讨论 | ✅ CONFIRMED | | |
| ... | | | |
| 9. 验收 | ✅ PASS | | |

## 代码变更统计
- 新增文件: N
- 修改文件: N
- 删除文件: N
- 总变更行: +N/-N
```

### Step 5: 发布后回顾（演化循环 — Wonder→Reflect）

**发布不是终点，是下一轮优化的起点。**

#### Wonder（反思）

```
🔍 发布后回顾

Wonder: 这次发布我们学到了什么？

1. 流程效率
   - 总耗时: {从 Discovery 到 Release 的天数}
   - 最耗时的阶段: {阶段 + 原因}
   - 是否有可跳过的步骤？

2. 质量发现
   - 编译门禁发现的问题数: {Phase A: N, Phase B: N}
   - 测试阶段发现的 Bug 数: {N}
   - 验收阶段发现的问题数: {N}
   - 是否有上线后才发现的问题？{有/无}

3. AI 行为审计
   - 是否有私自变更技术选型的情况？{是/否 — 如有，记录}
   - 是否有"联调通过"但实际编译失败的情况？{是/否}
   - 评审核查是否严格（零发现次数）？
```

#### Reflect（改进）

```
📝 改进建议

| # | 问题 | 建议改进 | flnext-sdd 是否需调整 |
|---|------|---------|---------------------|
| 1 | {问题描述} | {改进建议} | 是 / 否 |
| 2 | ... | ... | ... |

如果 flnext-sdd 流程本身需要调整:
→ 记录到 docs/sdd/FLNEXT-FEEDBACK.md
→ 下次使用时会自动加载这些改进
```

#### 演化循环

```
        发布上线
           │
           ▼
    ┌─ Wonder ────┐
    │  学到了什么？  │
    └──────┬───────┘
           │
           ▼
    ┌─ Reflect ───┐
    │  流程怎么改进？ │
    └──────┬───────┘
           │
           ▼
     反馈到下一个项目
```

### Step 6: 完成确认

```
═══════════════════════════════════════════════════════════════
  🚀 FLNEXT-SDD — RELEASE COMPLETE
═══════════════════════════════════════════════════════════════

Version: v{version}
Branch: main
Tag: v{version}

All 11 Phases Completed (0-10):
  0. ✅ Discovery
  1. ✅ 需求讨论
  2. ✅ 原型设计
  3. ✅ 架构设计
  3b.✅ 架构评审
  4. ✅ 后端开发
  5. ✅ 前端开发
  6. ✅ 测试用例
  7. ✅ 功能测试
  8. ✅ 提测
  9. ✅ 验收
  10.✅ 发布

═══════════════════════════════════════════════════════════════
```

## State Tracking

```yaml
phases:
  10-release:
    status: COMPLETE
    version: "{version}"
    tag: "v{version}"
```
