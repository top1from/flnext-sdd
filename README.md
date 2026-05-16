# FLNext-SDD v3.2.0

基于 Claude Code 的 **12 阶段规格驱动开发工作流**。

## 快速开始

```bash
# 在你的项目目录下
npx flnext-sdd@latest
```

安装后在 Claude Code 中输入命令开始开发：

| 命令 | 说明 |
|------|------|
| `/flnext-sdd-discovery` | [0/10] 老项目扫描代码库 |
| `/flnext-sdd-requirement` | [1/10] 需求讨论 |
| `/flnext-sdd-prototype` | [2/10] HTML 原型设计 |
| `/flnext-sdd-architecture` | [3/10] 架构设计 + ADR 决策记录 |
| `/flnext-sdd-arch-review` | [3b/10] 对抗性架构评审 |
| `/flnext-sdd-backend` | [4/10] 后端开发 (7-Wave + Phase A 编译) |
| `/flnext-sdd-frontend` | [5/10] 前端开发 (Phase B 编译) |
| `/flnext-sdd-testcase` | [6/10] 测试用例 |
| `/flnext-sdd-testing` | [7/10] 功能测试 (编译复检) |
| `/flnext-sdd-submit` | [8/10] 提测 (rebase + AI自检 + GitLab MR) |
| `/flnext-sdd-accept` | [9/10] 验收 (Beta分支) |
| `/flnext-sdd-release` | [10/10] 发布 (merge main + tag + 回顾) |
| `/flnext-sdd-status` | 查看进度 |
| `/flnext-sdd-quick` | 快速通道（紧急修复） |

## 核心特性

- **12 阶段全覆盖** — 从 Discovery 到 Release
- **双编译门禁** — Phase A (后端) + Phase B (前端)
- **AI 代码自检** — 提测前 8 大类约 40 项强制自检
- **对抗性评审** — 零发现 = 拒绝
- **7-Wave 开发编排** — 子代理并行开发
- **严格的确认词协议** — 只接受 确认/confirm/yes/Y
- **功能隔离** — 每个需求独立子目录
- **Delta 规格变更** — 需求变更不重写全文档
- **老项目自动扫描** — Discovery 阶段 4-Agent 并行
- **禁止 AI 私自变技术** — 数据库连不上不能偷换 SQLite

## 更多

完整文档: [FLNext-SDD 操作手册](./FLNext-SDD-操作手册.md)
