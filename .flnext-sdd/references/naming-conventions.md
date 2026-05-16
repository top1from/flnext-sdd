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

| 类型 | 格式 | 示例 | 用途 |
|------|------|------|------|
| 功能分支 | feature/{developer}-{name} | feature/qinhaijun-short-url | 阶段 4-7 开发 |
| Beta 分支 | beta/{version} | beta/v1.0 / beta/sprint-22 | 阶段 9 验收环境 |
| 默认分支 | develop | develop | 集成/开发环境 |
| 主分支 | main/master | main | 生产环境 |

### 分支生命周期

```
阶段 0-3b (文档阶段):      无需 feature 分支
阶段 4 开始 (开始编码):    从 develop 创建 feature/{developer}-{name}
阶段 8 (提测):             feature rebase develop → push → GitLab MR → 合并到 develop
阶段 9 (验收):             从 develop 创建 beta/{version} → 部署测试环境
阶段 10 (发布):            develop → main 合并 → 打 tag
```

## 优先级规范

| 级别 | 含义 | 使用场景 |
|------|------|----------|
| P1 | 核心功能 | 主流程必须实现 |
| P2 | 重要功能 | 提升用户体验 |
| P3 | 增强功能 | 锦上添花 |

---

> FLTeam-SDD v1.0.0