---
name: "flnext-sdd-help"
description: "[帮助] FLNext-SDD 使用帮助。Triggers on 'help', '帮助', '使用说明'"
---

# FLNext-SDD 帮助

## 工作流概览

FLNext-SDD 是基于 Claude Code 的规格驱动开发工作流，对齐公司 11 步开发流程。

### 版本信息
- 版本: v4.0.0
- 合并来源: flnext-glm + flnext-kimi + flnext-deepseek + **SDD-Forge v2.0**（已完全合并，sdd-forge 已废弃）

## 命令列表

| 命令 | 阶段 | 说明 |
|------|------|------|
| `/flnext-sdd-discovery` | 0 | 项目发现（Brownfield 强制） |
| `/flnext-sdd-requirement` | 1 | 需求讨论（含钉钉 AI 表格） |
| `/flnext-sdd-prototype` | 2 | 原型设计 + PRD |
| `/flnext-sdd-architecture` | 3 | 架构设计 |
| `/flnext-sdd-arch-review` | 3b | 对抗性架构评审 |
| `/flnext-sdd-backend` | 4 | 后端开发 (Wave 1-4) |
| `/flnext-sdd-frontend` | 5 | 前端开发 (Wave 5-7) |
| `/flnext-sdd-testcase` | 6 | 测试用例 |
| `/flnext-sdd-testing` | 7 | 功能测试 |
| `/flnext-sdd-integration-gate` | 7b | **集成门控**（双编译+全栈联调） |
| `/flnext-sdd-submit` | 8 | 提测 |
| `/flnext-sdd-accept` | 9 | 验收（含钉钉回传） |
| `/flnext-sdd-release` | 10 | 发布 |
| `/flnext-sdd-status` | — | 查看当前进度 |
| `/flnext-sdd-quick` | — | 快速通道 |
| `/flnext-sdd-hotfix` | — | **紧急修复**（P0/零日漏洞） |
| `/flnext-sdd-consultation` | — | **受控会诊模式** |
| `/flnext-sdd-help` | — | 查看帮助 |

## 核心机制

### 4 状态机
```
PENDING → IN_PROGRESS → AWAITING_CONFIRMATION → CONFIRMED
```

### 7-Wave 开发编排
```
Wave 1-4: 后端开发 → Phase A 编译门禁
Wave 5-7: 前端开发 → Phase B 编译门禁
```

### 严格确认词
- ✅ 有效: "确认" / "confirm" / "yes" / "Y"
- ❌ 无效: "ok" / "looks good" / "sure"

### 双编译门禁 + 集成门控
- Phase A: 后端编译确认
- Phase B: 前端编译确认
- Phase 7b: 两者同时 PASSED + 全栈联调后才可提测

### v4.0 治理机制（来自 SDD-Forge）
- **认知锚定**: 每 5 步复述核心约束
- **决策血缘**: 重大技术决策须可追溯
- **熔断机制**: 连续 3 次违规 → 强制合规审查
- **跨阶段一致性**: 自检第 9 类（10 项）

### Discovery（Brownfield）
- 4-Agent 并行扫描
- 4 PATH 歧义路由
- 歧义评分 + 辩证节奏守卫
- 持久化 project-context.md

## 项目类型

| 类型 | 说明 | Discovery |
|------|------|-----------|
| Greenfield | 新项目 | 可跳过 |
| Brownfield | 已有代码库 | 强制执行 |

## 文件结构

```
.flnext-sdd/          ← 框架源文件（安装时复制到 .claude/skills/）
  agents/             ← Agent 角色定义
  skills/             ← 各阶段 Skill+Steps
  references/         ← 参考文档
  templates/          ← 模板文件
  constitution.md     ← 不可变原则
  config.yaml         ← 项目配置

STATE.md              ← 工作流状态（项目根目录）
docs/sdd/             ← 产出文档目录
```
