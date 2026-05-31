---
name: "flnext-sdd-testing"
description: "[7/13] 功能测试 — 按测试用例执行功能测试。Triggers on '功能测试', 'testing', '执行测试'"
---

# 阶段7: 功能测试

## Overview

按照测试用例逐项执行功能测试，记录每个用例的执行结果。测试通过才能进入集成门控（Phase 7b）。

## Hard Gate

**测试 PASS 才能进入集成门控 (/flnext-sdd-integration-gate)**

## 输出文件

- `docs/sdd/{FEATURE_NAME}/test-report.md` - 测试报告

## 前置条件

1. 测试用例完成 (Phase 6 CONFIRMED)
2. docs/sdd/{FEATURE_NAME}/testcase.md 存在
3. **Phase A 编译已通过；Phase B 已通过或 SKIPPED（纯后端）**
4. **项目可正常编译和启动**

### 纯后端项目处理

如果 STATE.md 中 `project_backend_only: true`：

1. 编译复检仅执行后端编译（`npm run build` / `mvn compile`）
2. 测试执行聚焦：API 端点测试、数据库集成测试、业务逻辑验证
3. 跳过 Level 3 中的前端相关审查维度
4. 测试报告仅包含后端测试结果
5. 其他核心规则（编译复检、只读原则、ESCALATE 上报）完全保持

## Workflow

| 步骤 | 文件 | 目标 |
|------|------|------|
| 1 | step-01-init.md | 初始化，读取测试用例 |
| 1.5 | step-01.5-verify-wiring.md | **交叉连接验证（新增）** |
| 2 | step-02-execute.md | **编译复检 + 执行测试用例** |
| 3 | step-03-report.md | 生成测试报告 |
| 4 | step-04-complete.md | 完成确认 |

## 核心规则

### 编译复检
**测试阶段第一步必须是重新编译**。测试期间修改的代码可能引入新的编译错误。
编译未通过 → 测试结果无效。

### 实现代码只读
**测试阶段不允许修改业务代码**。测试角色是验证者，不是修改者。
发现的实现 Bug → **ESCALATE**（上报），不得自行修复。

## 测试结果判定

| 结果 | 含义 | 后续动作 |
|------|------|----------|
| PASS | 全部通过 | 进入集成门控 (/flnext-sdd-integration-gate) |
| REWORK | 存在失败 | 返回开发阶段修复 |
| HOLD | 暂停 | 等待外部条件 |

## 3 级渐进式评估管道

> 灵感来源: Ouroboros 的 3-stage evaluation pipeline
> 完整规范: `references/evaluation-pipeline.md`

### Level 1: Mechanical Check（机械检查）

**成本**: $0（无需 LLM）  
**时机**: 测试执行前自动执行

```yaml
检查项:
  - 编译通过: npm run build / mvn compile
  - 类型检查: npx tsc --noEmit / mypy
  - Lint 通过: npm run lint / ruff check
  - 测试通过: npm test / pytest
  - 覆盖率达标: > 70%

阈值:
  全部通过 → Level 2
  任一失败 → 停止，人工介入
```

### Level 2: Semantic Check（语义检查）

**成本**: $$（单次 LLM 调用）  
**时机**: Level 1 全部通过后执行

```yaml
检查项:
  - AC 合规: 所有验收标准是否满足？
  - 需求覆盖: 每个 FR 是否有对应的实现？
  - 边界处理: 错误状态、空状态、极端输入是否处理？
  - 命名规范: 前后端命名是否一致？
  - 漂移检测: 实现是否偏离了规格文档？

评分:
  >= 0.8: PASS → 进入提测
  0.5 - 0.8: WARNING → 列出未覆盖项，人工确认
  < 0.5: REWORK → 返回开发

不确定性 > 0.3: 触发 Level 3
```

### Level 3: Consensus Check（交叉验证）

**成本**: $$$（多模型/多角色审查）  
**时机**: Level 2 不确定性 > 0.3 时触发

```yaml
审查角色:
  - 架构师: 技术合理性审查
  - QA: 边界和异常覆盖审查
  - 反对者 (Contrarian): 挑战所有假设

投票规则:
  需 2/3 多数通过
  一票否决 = REWORK

触发条件（6 项，按优先级）:
  1. Seed/Spec 修改
  2. 数据库 schema 变更
  3. API 契约变更
  4. 需求重新解读（Delta 变更）
  5. Level 2 不确定性 > 0.3
  6. 安全相关变更
```

### 评估通过流程图

```
Level 1 (Mechanical) ──失败──▶ 停止，人工介入
    │
    通过
    ▼
Level 2 (Semantic)  ──< 0.5──▶ REWORK
    │
    ├── 0.5-0.8 ──▶ 人工确认
    │
    ├── >= 0.8, uncertainty <= 0.3 ──▶ PASS
    │
    └── >= 0.8, uncertainty > 0.3 ──▶ Level 3
                                          │
                                    ──不通过──▶ REWORK
                                          │
                                          通过
                                          ▼
                                        PASS
```

## State Tracking

```yaml
phases:
  7-testing:
    status: IN_PROGRESS
    result: ""    # PASS / REWORK / HOLD
    evaluation_level: ""  # L1 / L2 / L3
    evaluation_score: 0.0
```
