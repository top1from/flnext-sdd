# FLTeam-SDD 命名规范

## 文件命名规范

### 功能隔离目录结构

每个功能/需求在 `docs/sdd/` 下生成**独立子目录**，不同需求互不覆盖：

```
docs/sdd/
├── project-context.md           ← 项目级（Discovery 产出）
├── tech-stack.md                ← 项目级
├── architecture-map.md          ← 项目级
│
├── short-url/                   ← 功能1: 短链接系统
│   ├── requirement-scope.md
│   ├── prototype.md / .html / prd.md
│   ├── architecture.md / database.md
│   ├── adr/
│   ├── review-report.md
│   ├── api-design.md / ui-spec.md
│   ├── testcase.md / test-report.md
│   ├── SUBMISSION.md
│   ├── acceptance-report.md
│   ├── RELEASE-NOTES.md
│   └── deltas/
│
├── user-auth/                   ← 功能2: 用户认证
│   ├── requirement-scope.md
│   └── ...
│
└── admin-dashboard/             ← 功能3: 管理后台
    └── ...
```

### 文档文件（按功能子目录）

| 类型 | 命名格式 | 示例 |
|------|----------|------|
| 需求边界 | requirement-scope.md | requirement-scope.md |
| 原型文档 | prototype.md | prototype.md |
| 原型HTML | prototype.html | prototype.html |
| PRD | prd.md | prd.md |
| 架构文档 | architecture.md | architecture.md |
| 数据库文档 | database.md | database.md |
| 评审报告 | review-report.md | review-report.md |
| API设计 | api-design.md | api-design.md |
| UI规范 | ui-spec.md | ui-spec.md |
| 测试用例 | testcase.md | testcase.md |
| 测试报告 | test-report.md | test-report.md |

### 技能文件

| 类型 | 命名格式 | 示例 |
|------|----------|------|
| SKILL.md | sdd-{phase}/SKILL.md | sdd-requirement/SKILL.md |
| Step文件 | step-{NN}-{name}.md | step-01-init.md |
| 模板文件 | {type}-template.md | requirement-scope-template.md |

## ID命名规范

### 功能需求

格式: `FR-{NNN}`
示例: FR-001, FR-002

### 非功能需求

格式: `NFR-{NNN}`
示例: NFR-001, NFR-002

### 测试用例

格式: `TC-{NNN}` (功能测试)
格式: `TC-E{NNN}` (边界测试)
示例: TC-001, TC-E001

### API端点

格式: `API-{NNN}`
示例: API-001

### 模块

格式: `M-{NNN}`
示例: M-001

### 页面

格式: `P-{NNN}`
示例: P-001

## 分支命名规范

### 设计原则

FLNext-SDD 从传统 7 种分支 + 9 步手动操作，简化为 **5 种分支 + 自动化工作流**。

```
传统手动策略 (7 种)              FLNext-SDD AI 策略 (5 种)
─────────────────────────        ─────────────────────────
feature/xxxx  ──────────▶        feature/{dev}-{name}
develop      ──────────▶        develop（保护分支）
release/xxxx ── 合并到 ──▶      （被 beta 替代）
beta/xxxx    ──────────▶        beta/{version}
master       ──────────▶        main（统一命名）
rel-xxxx tag ── 合并到 ──▶      v{version} tag
hotfix/xxxx  ──────────▶        hotfix/{dev}-{desc}（/flnext-sdd-quick 触发）
```

### 7 个开源项目对照

| 项目 | 分支策略 | 分支数 |
|------|---------|--------|
| **GSD** | 无分支规范，phase 目录隔离 | 0 |
| **Ouroboros** | 无 git 策略，session+seed+事件溯源 | 0 |
| **BMAD** | 无分支规范，ADR 文档约束 | 0 |
| **SDD-Team** | feature → develop + git worktree | 2 |
| **OpenSpec** | changes/ 目录 + delta 合并 | 0 |
| **Spec-Kit** | `{seq}-{name}` feature + Git 扩展 | 1 |
| **Superpowers** | worktree 隔离，用完即删 | 1 |
| **FLNext-SDD** | feature + develop + beta + main + hotfix | **5** |

> 7 个项目无一超过 3 种。FLNext-SDD 的 5 种已是最精简可落地方案。

### 分支定义

| 类型 | 格式 | 示例 | 说明 |
|------|------|------|------|
| **功能分支** | `feature/{dev}-{name}` | `feature/qinhaijun-short-url` | Phase 4 创建，Phase 8 合并到 develop 后删除 |
| **热修复分支** | `hotfix/{dev}-{desc}` | `hotfix/qinhaijun-url-parse` | `/flnext-sdd-quick` 触发，修复后合并到 develop + main |
| **开发分支** | `develop` | `develop` | 🔒 保护分支，只接受 MR，禁止直接推送 |
| **验收分支** | `beta/{version}` | `beta/v1.0` | Phase 9 从 develop 创建，验收通过后删除 |
| **生产分支** | `main` | `main` | 🔒 保护分支，只接受从 develop 合并，每个合并打 tag |
| **版本标签** | `v{major}.{minor}` | `v1.0` / `v1.1` | Phase 10 在 main 上创建，不可变 |

### 分支生命周期

```
阶段 0-3b (文档阶段):
  无需 feature 分支，文档产出在 docs/sdd/{FEATURE_NAME}/

阶段 4 (开始编码):
  git checkout develop && git pull
  git checkout -b feature/{developer}-{name}

阶段 4-7 (开发+测试):
  在 feature 分支上开发，定期 rebase develop

阶段 8 (提测):
  feature rebase develop
  AI 自检 → push feature → GitLab MR → 合并到 develop
  合并后删除 feature 分支

阶段 9 (验收):
  git checkout -b beta/{version} develop
  部署 beta 到测试/验收环境
  验收通过后删除 beta 分支

阶段 10 (发布):
  git checkout main && git merge develop
  git tag -a v{version}
  发布后回顾 (Wonder→Reflect)
```

### 紧急修复流程 (hotfix)

```
1. 从 main 创建 hotfix 分支:
   git checkout main && git pull
   git checkout -b hotfix/{dev}-{desc}

2. 输入 /flnext-sdd-quick，快速编码+测试

3. 修复后:
   git checkout develop
   git merge hotfix/{dev}-{desc}     # 合入 develop
   git checkout main
   git merge hotfix/{dev}-{desc}     # 合入 main
   git tag -a v{version}.{patch}
   git branch -d hotfix/{dev}-{desc} # 删除 hotfix 分支
```

### 保护分支规则 (GitLab 配置)

| 分支 | 允许推送 | 允许合并 | 合并方式 |
|------|---------|---------|---------|
| `main` | ❌ 无人 | 仅 maintainer | Merge Request |
| `develop` | ❌ 无人 | 仅 maintainer | Merge Request |
| `feature/*` | ✅ 开发者 | 开发者 | — |
| `hotfix/*` | ✅ 开发者 | maintainer | Merge Request |
| `beta/*` | ✅ QA | QA/PM | — |

## 优先级规范

| 级别 | 含义 | 使用场景 |
|------|------|----------|
| P1 | 核心功能 | 主流程必须实现 |
| P2 | 重要功能 | 提升用户体验 |
| P3 | 增强功能 | 锦上添花 |

---

> FLTeam-SDD v1.0.0