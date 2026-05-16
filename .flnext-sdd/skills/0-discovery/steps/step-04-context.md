# Step 4: 生成持久化项目上下文

## 目标

将 4-Agent 扫描结果和歧义澄清结论合并为 `project-context.md`，此文件将被所有后续 SDD 阶段自动加载。

## 设计来源

- **持久化上下文**: 源自 BMAD 的 project-context.md 机制
- **自动加载**: 源自 BMAD 的 persistent_facts 设计，所有工作流通过 `@docs/sdd/project-context.md` 自动引用

## project-context.md 模板

使用 `templates/project-context-template.md` 生成。

### 生成规则

1. 合并 4-Agent 扫描结果
2. 整合歧义澄清记录
3. 生成 Drift 基准快照
4. 标注信息来源（[AUTO-INFERRED] / [CODE-CONFIRMED] / [USER-CONFIRMED]）

### 文件结构

```markdown
# Project Context — {PROJECT_NAME}
> 自动生成 | 更新时间: {DATE}
> 所有 SDD 阶段自动加载此文件作为项目基础上下文

## 技术栈
[从 tech-stack.md 整理，标注来源]

## 架构概览
[从 architecture-map.md 整理，标注来源]

## 代码规范
[从 Quality Agent 输出整理]

## 已知风险
[从 Concerns Agent 输出整理]

## 歧义澄清记录
[从 Step 3 访谈记录整理]

## Drift 基准
[当前代码库的快照摘要]

## 关键决策
[影响后续开发的技术决策记录]
```

## Drift 基准

为后续 Drift 检测建立基准快照：

```markdown
## Drift 基准
> 建立时间: {DATE}
> 用于检测代码库偏离

### 文件结构快照
- 总文件数: N
- 核心目录: src/, config/, test/
- 关键配置: package.json, tsconfig.json, .env.example

### 依赖快照
- 直接依赖数: N
- 主要框架版本: {framework} {version}

### API 端点快照
- 端点总数: N
- 主要路由: /api/v1/...
```

## 自动加载机制

后续所有 SDD 阶段的 SKILL.md 中都包含:

```markdown
## 前置条件

1. 读取 `docs/sdd/project-context.md`（如存在）
2. 基于项目上下文调整工作流行为
```

在 SKILL.md 的 execution_context 中添加:
```
@docs/sdd/project-context.md
```

## 状态更新

更新 STATE.md:
```yaml
current_step: "step-04-context"
steps_completed: ["step-01-detect", "step-02-scan", "step-03-interview"]
metadata:
  discovery_context: "docs/sdd/project-context.md"
```
