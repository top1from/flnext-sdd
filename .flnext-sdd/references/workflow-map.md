# FLNext-SDD 工作流总览

## 完整工作流程（12 阶段，对齐公司 11 步开发流程）

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    FLNext-SDD 12 阶段工作流 v3.0                          │
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  阶段0: Discovery (/flnext-sdd-discovery) [Brownfield 强制]            │  │
│   │  输出: project-context.md, tech-stack.md, architecture-map.md   │  │
│   │  Agent: 4-Agent 并行扫描 (Tech/Arch/Quality/Concerns)           │  │
│   │  特色: 歧义评分 + 4 PATH 路由 + 辩证节奏守卫                     │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼ [确认门控] (Greenfield 可跳过)                                  │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  阶段1: 需求讨论 (/flnext-sdd-requirement)                              │  │
│   │  输出: requirement-scope.md                                      │  │
│   │  Agent: 产品经理                                                  │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼ [确认门控]                                                      │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  阶段2: 原型设计 (/flnext-sdd-prototype)                                │  │
│   │  输出: prototype.md, prototype.html, prd.md                      │  │
│   │  Agent: UX 设计师                                                 │  │
│   │  特色: Playwright 浏览器预览                                      │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼ [浏览器预览确认]                                                │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  阶段3: 架构设计 (/flnext-sdd-architecture)                             │  │
│   │  输出: architecture.md, database.md                              │  │
│   │  Agent: 系统架构师                                                │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼ [确认门控]                                                      │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  阶段3b: 架构评审 (/flnext-sdd-arch-review)                             │  │
│   │  输出: review-report.md                                          │  │
│   │  Agent: 架构师 + QA                                              │  │
│   │  条件: 评审通过才能开发                                            │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼ [评审通过门控]                                                   │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  阶段4: 后端开发 (/flnext-sdd-backend) — Wave 1~4                      │  │
│   │  输出: api-design.md + 后端代码                                   │  │
│   │  Agent: 后端开发 (子代理并行)                                      │  │
│   │  门禁: Phase A 后端编译确认                                        │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼ [Phase A 编译门禁]                                              │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  阶段5: 前端开发 (/flnext-sdd-frontend) — Wave 5~7                     │  │
│   │  输出: ui-spec.md + 前端代码                                      │  │
│   │  Agent: 前端开发 (子代理并行)                                      │  │
│   │  门禁: Phase B 前端编译确认                                        │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼ [Phase B 编译门禁]                                              │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  阶段6: 测试用例 (/flnext-sdd-testcase)                                 │  │
│   │  输出: testcase.md + 可追溯矩阵                                   │  │
│   │  Agent: 测试工程师                                                │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼ [确认门控]                                                      │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  阶段7: 功能测试 (/flnext-sdd-testing)                                  │  │
│   │  输出: test-report.md                                            │  │
│   │  Agent: 测试工程师 + QA                                           │  │
│   │  条件: 测试通过才能提测                                            │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼ [测试通过门控]                                                   │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  阶段8: 提测 (/flnext-sdd-submit)                                       │  │
│   │  输出: 推送到 develop 分支 + SUBMISSION.md                       │  │
│   │  Agent: QA                                                       │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼ [提测确认门控]                                                   │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  阶段9: 验收 (/flnext-sdd-accept) [新增]                                │  │
│   │  输出: acceptance-report.md                                      │  │
│   │  Agent: 产品经理 + QA                                            │  │
│   │  条件: 验收通过才能发布                                            │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼ [验收通过门控]                                                   │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │  阶段10: 发布 (/flnext-sdd-release) [新增]                              │  │
│   │  输出: 合并到 main + 版本标签 + RELEASE-NOTES.md                 │  │
│   │  Agent: 系统架构师                                                │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│         │                                                                │
│         ▼ [完成]                                                          │
│   ✅ 项目完成                                                             │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## 公司 11 步开发流程对照

| # | 公司流程 | FLNext-SDD 阶段 | 命令 |
|---|---------|-----------------|------|
| 0 | — | Discovery | /flnext-sdd-discovery |
| 1 | Discovery | 需求讨论 | /flnext-sdd-requirement |
| 2 | Requirements | 原型设计+PRD | /flnext-sdd-prototype |
| 3 | Design | 架构设计 | /flnext-sdd-architecture |
| 4 | Architecture | 架构评审 | /flnext-sdd-arch-review |
| 5 | Code (骨架+Phase A) | 后端开发 | /flnext-sdd-backend |
| 6 | Code (Phase B) | 前端开发 | /flnext-sdd-frontend |
| 7 | Test Plan | 测试用例 | /flnext-sdd-testcase |
| 8 | Test | 功能测试 | /flnext-sdd-testing |
| 9 | Integrate+Submit | 提测 | /flnext-sdd-submit |
| 10 | Accept | 验收 | /flnext-sdd-accept |
| 11 | Release | 发布 | /flnext-sdd-release |

## 7-Wave 开发编排（Kimi）

```
Wave 1 (串行):  数据库迁移 (B-01)
Wave 2 (并行):  Entity+DTO (B-02, B-03)
Wave 3 (并行):  Repository+Service+Controller+Auth (B-04~B-07)
Wave 4 (并行):  后端测试+API Client (B-08, F-01)
               ──── Phase A 后端编译门禁 ────
Wave 5 (并行):  共享组件 (F-02)
Wave 6 (并行):  页面+状态+路由 (F-03~F-05)
Wave 7 (并行):  验证+错误处理 (F-06, F-07)
               ──── Phase B 前端编译门禁 ────
```

## 命令速查表

| 命令 | 阶段 | 前置条件 |
|------|------|----------|
| `/flnext-sdd-discovery` | Discovery | 检测到现有代码库 (Brownfield) |
| `/flnext-sdd-requirement` | 需求讨论 | Discovery 完成 (Brownfield) 或无前置 (Greenfield) |
| `/flnext-sdd-prototype` | 原型设计 | 需求讨论 CONFIRMED |
| `/flnext-sdd-architecture` | 架构设计 | 原型设计 CONFIRMED |
| `/flnext-sdd-arch-review` | 架构评审 | 架构设计 CONFIRMED |
| `/flnext-sdd-backend` | 后端开发 | 评审 PASS |
| `/flnext-sdd-frontend` | 前端开发 | 后端 Phase A 编译通过 |
| `/flnext-sdd-testcase` | 测试用例 | Phase B 编译通过 |
| `/flnext-sdd-testing` | 功能测试 | 测试用例 CONFIRMED |
| `/flnext-sdd-submit` | 提测 | 测试 PASS |
| `/flnext-sdd-accept` | 验收 | 提测 CONFIRMED |
| `/flnext-sdd-release` | 发布 | 验收 PASS |
| `/flnext-sdd-status` | 状态查看 | 无 |
| `/flnext-sdd-quick` | 快速通道 | 无 |
| `/flnext-sdd-help` | 帮助 | 无 |

## 文件输出目录

### 项目级文件（docs/sdd/ 根目录）

| 文件 | 阶段 | 描述 |
|------|------|------|
| project-context.md | 0 | 项目上下文 (Brownfield) |
| tech-stack.md | 0 | 技术栈映射 |
| architecture-map.md | 0 | 架构映射 |

### 功能级文件（docs/sdd/{FEATURE_NAME}/ 子目录）

每个功能/需求生成独立子目录，**不同需求互不覆盖**：

| 文件 | 阶段 | 描述 |
|------|------|------|
| requirement-scope.md | 1 | 需求边界文档 |
| prototype.md | 2 | 原型设计描述 |
| prototype.html | 2 | HTML 原型文件 |
| prd.md | 2 | 产品需求文档 |
| architecture.md | 3 | 技术架构文档 |
| database.md | 3 | 数据库设计文档 |
| adr/ | 3 | 架构决策记录目录 |
| review-report.md | 3b | 评审报告 |
| api-design.md | 4 | API 实现详情 |
| ui-spec.md | 5 | UI 实现详情 |
| testcase.md | 6 | 测试用例文档 |
| test-report.md | 7 | 测试报告 |
| SUBMISSION.md | 8 | 提测报告 |
| acceptance-report.md | 9 | 验收报告 |
| RELEASE-NOTES.md | 10 | 发布说明 |
| deltas/ | * | 需求变更记录目录 |

---

> FLNext-SDD v3.2.0
> 合并来源: flnext-glm (骨架) + flnext-kimi (7-Wave + 状态机) + flnext-deepseek (门禁 + status)
> 功能隔离: docs/sdd/{FEATURE_NAME}/ 每需求独立子目录
