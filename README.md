# FLNext-SDD v4.0.0

基于 Claude Code 的 **13 阶段规格驱动开发工作流**（含 3b 架构评审、7b 集成门控）。

> **v4.0**：认知锚定、决策血缘、熔断机制、集成门控、受控会诊、紧急修复、跨阶段一致性自检。`sdd-forge` 包已废弃。

## 快速开始

```bash
# 在你的项目目录下
npx flnext-sdd@latest
```

安装后在 Claude Code 中输入命令开始开发：

| 命令 | 说明 |
|------|------|
| `/flnext-sdd-discovery` | [0] 老项目扫描代码库 |
| `/flnext-sdd-requirement` | [1] 需求讨论（钉钉 AI 表格） |
| `/flnext-sdd-prototype` | [2] HTML 原型设计 |
| `/flnext-sdd-architecture` | [3] 架构设计 + ADR |
| `/flnext-sdd-arch-review` | [3b] 对抗性架构评审 |
| `/flnext-sdd-backend` | [4] 后端开发 (7-Wave + Phase A 编译) |
| `/flnext-sdd-frontend` | [5] 前端开发 (Phase B 编译) |
| `/flnext-sdd-testcase` | [6] 测试用例 |
| `/flnext-sdd-testing` | [7] 功能测试 |
| `/flnext-sdd-integration-gate` | [7b] **集成门控**（双编译+全栈联调） |
| `/flnext-sdd-submit` | [8] 提测 (rebase + AI自检 + GitLab MR) |
| `/flnext-sdd-accept` | [9] 验收 (Beta + 钉钉回传) |
| `/flnext-sdd-release` | [10] 发布 |
| `/flnext-sdd-hotfix` | 紧急修复 (P0/零日漏洞) |
| `/flnext-sdd-consultation` | 受控会诊模式 |
| `/flnext-sdd-status` | 查看进度 |
| `/flnext-sdd-quick` | 快速通道 |

## CLI 命令

| 命令 | 说明 |
|------|------|
| `npx flnext-sdd` | 安装 |
| `npx flnext-sdd --update` | 更新（自动迁移 v4 STATE） |
| `npx flnext-sdd --status` | 终端查看进度 |
| `npx flnext-sdd --audit` | 宪法合规审计 |
| `npx flnext-sdd --drift-check` | 代码漂移检测 |

## 核心特性

- **13 阶段全覆盖** — Discovery → Release + 7b 集成门控
- **双编译门禁 + 集成门控** — Phase A/B 独立确认，提测前全栈联调
- **AI 代码自检** — 9 大类（含跨阶段一致性 10 项）
- **14 条宪法规原则** — 含认知锚定、决策血缘、熔断机制
- **钉钉需求联动** — 需求/验收阶段自动读写钉钉 AI 表格
- **7-Wave 开发编排** — 子代理并行开发
- **Delta 规格变更** — 增量变更 + 归档合并

## 更多

完整文档: [FLNext-SDD 操作手册](./FLNext-SDD-操作手册.md)
