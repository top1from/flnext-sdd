# 3 级渐进式评估管道

> 灵感来源: Ouroboros 的 3-stage evaluation pipeline
> 版本: 1.0.0

## 核心概念

评估不应只有"编译通过"一个维度。采用 3 级渐进式评估：

```
阶段 4/5: Phase A/B 编译门禁（已有）
    +
Level 1: Mechanical   → 机械检查（编译、Lint、静态分析）
Level 2: Semantic     → 语义检查（API 匹配、需求覆盖、边界）
Level 3: Consensus    → 交叉验证（多角度审查）
```

## Level 1: Mechanical Check（机械检查）

**成本**: $0（无需 LLM）
**时机**: Phase 4/5 编译门禁时自动执行

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

## Level 2: Semantic Check（语义检查）

**成本**: $$（单次 LLM 调用）
**时机**: Level 1 全部通过后，在阶段 7 测试阶段执行

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

## Level 3: Consensus Check（交叉验证）

**成本**: $$$（多模型/多角色审查）
**时机**: Level 2 不确定性 > 0.3，或架构评审触发

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

## 评估通过 → 提测流程图

```
Level 1 (Mechanical) ──失败──▶ 停止，人工介入
    │
    通过
    ▼
Level 2 (Semantic)  ──< 0.5──▶ REWORK
    │
    ├── 0.5-0.8 ──▶ 人工确认
    │
    ├── >= 0.8, uncertainty <= 0.3 ──▶ PASS → 提测
    │
    └── >= 0.8, uncertainty > 0.3 ──▶ Level 3
                                          │
                                    ──不通过──▶ REWORK
                                          │
                                          通过
                                          ▼
                                        提测
```

## 与 flnext-sdd 当前门控的整合

| flnext-sdd 现有 | 对应 Level | 状态 |
|---------------|-----------|------|
| Phase A 编译门禁 | Level 1 (后端) | ✅ 已有 |
| Phase B 编译门禁 | Level 1 (前端) | ✅ 已有 |
| 测试用例执行 | Level 2 (部分) | ⚠️ 需升级为评分制 |
| 架构评审 | Level 3 (部分) | ⚠️ 需加入多角色审查 |
