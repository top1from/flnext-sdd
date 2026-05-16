# Step 3: 歧义澄清访谈

## 目标

对 4-Agent 扫描结果中的歧义点进行澄清，使用 4 PATH 路由系统和歧义评分机制。

## 设计来源

- **4 PATH 路由**: 源自 Ouroboros interview.py 的访谈路由系统
- **歧义评分**: 源自 Ouroboros ambiguity.py 的多维度加权评分
- **辩证节奏守卫**: 源自 Ouroboros 的过度自动化防护

## 歧义评分

对扫描结果中的每个不确定点，计算 4 维度歧义分数：

| 维度 | 权重 | 高歧义信号 | 低歧义信号 |
|------|------|-----------|-----------|
| Goal（目标清晰度） | 35% | 业务目的不明确 | README 有清晰描述 |
| Constraint（约束明确度） | 25% | 技术约束模糊 | 有明确技术选型文档 |
| Success（成功标准） | 25% | 无法判断对错 | 有测试或验收标准 |
| Context（上下文充分度） | 15% | 缺乏项目背景 | 有完善的文档和注释 |

**评分公式**:
```
ambiguity_score = (goal_score * 0.35) + (constraint_score * 0.25) + (success_score * 0.25) + (context_score * 0.15)
```

每个维度评分范围: 0（完全清晰）~ 1（完全不明）

**阈值判断**:

| 分数范围 | 歧义等级 | 默认 PATH |
|---------|---------|----------|
| 0 ~ 0.2 | 低歧义 | PATH 1a 或 1b |
| 0.2 ~ 0.5 | 中歧义 | PATH 2 |
| 0.5 ~ 1.0 | 高歧义 | PATH 3 |

## 4 PATH 路由系统

### PATH 1a: Auto-confirm（自动确认）

**触发条件**: 歧义 < 0.2，且不涉及架构/安全决策

**行为**:
1. AI 基于代码证据自动推断
2. 记录推断依据到 project-context.md
3. 标记为 `[AUTO-INFERRED]` 以便后续审查

**示例**:
```
推断: ORM 使用 Prisma（检测到 prisma/schema.prisma）
依据: 文件存在 + package.json 中 @prisma/client 依赖
标签: [AUTO-INFERRED]
```

### PATH 1b: Code-confirm（代码确认）

**触发条件**: 歧义 < 0.2，但涉及代码行为需要验证

**行为**:
1. 读取相关代码确认
2. 如代码证实推断，自动处理
3. 如代码与推断矛盾，升级到 PATH 2

**示例**:
```
推断: 认证使用 JWT
验证: 读取 src/middleware/auth.ts → 确认使用 JWT + Bearer 方案
结果: 确认，记录到上下文
```

### PATH 2: Human judgment（人工判断）

**触发条件**: 歧义 0.2~0.5

**行为**:
1. 向用户展示歧义点和已知信息
2. 提供选项或开放提问
3. 等待用户明确回答
4. 记录回答到 project-context.md

**示例**:
```
🤔 发现歧义点 — 数据库迁移策略

已知: 项目使用 Prisma ORM，但未找到迁移文件
问题: 数据库变更采用什么策略？

[A] Prisma Migrate（推荐）
[B] 手动 SQL 迁移
[C] 不使用迁移，直接修改 schema

请选择 (A/B/C):
```

### PATH 3: Code+judgment（代码分析+人工判断）

**触发条件**: 歧义 > 0.5

**行为**:
1. 深入阅读相关代码
2. 整理可能的选项和利弊
3. 向用户展示分析结果
4. 请用户做出决策
5. 记录决策和理由到 project-context.md

**示例**:
```
🔍 高歧义点 — API 版本管理策略

代码分析:
- 发现 /api/v1/ 和 /api/v2/ 路由并存
- v1 使用 Express Router, v2 使用 tRPC
- 无版本迁移文档

选项分析:
[A] 统一到 tRPC — 前端类型安全，但 v1 迁移工作量大
[B] 保持双轨 — 兼容性好，但维护成本高
[C] 逐步迁移 — 新功能用 tRPC，旧功能逐步迁移

请选择策略并说明理由:
```

## 辩证节奏守卫

防止 AI 连续自动推断导致关键决策被忽略：

**规则**:
1. 跟踪连续非用户回答次数（PATH 1a + 1b）
2. 连续 3 次后，下一个歧义点**强制使用 PATH 2**
3. 向用户展示: `🔄 辩证节奏守卫: 已连续自动处理 3 个歧义点，此问题需要您确认`
4. 用户回答后重置计数器

## 访谈记录

所有歧义点和澄清结果记录到 `project-context.md` 的 §歧义澄清记录:

```markdown
## 歧义澄清记录

| # | 歧义点 | 歧义分数 | PATH | 结果 | 标签 |
|---|--------|---------|------|------|------|
| 1 | ORM 确认 | 0.1 | 1a | Prisma | [AUTO-INFERRED] |
| 2 | 认证方案 | 0.15 | 1b | JWT Bearer | [CODE-CONFIRMED] |
| 3 | 迁移策略 | 0.35 | 2 | Prisma Migrate | [USER-CONFIRMED] |
```

## 状态更新

更新 STATE.md:
```yaml
current_step: "step-03-interview"
steps_completed: ["step-01-detect", "step-02-scan"]
```
