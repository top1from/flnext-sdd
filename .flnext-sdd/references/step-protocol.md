# 步骤执行协议 (Step Protocol)

> FLNext-SDD v4.0 — 所有阶段 step 文件必须遵守。Agent 每完成一个 step 前读取本文件。

## 1. 步骤完成标记

每个 step 完成后必须输出：

```
✅ Step N Complete — {步骤简述}
```

失败时：

```
❌ Step N Failed — {原因}
```

未输出完成标记 = 未执行，不得进入下一步。

## 2. 认知锚定（每 5 步）

维护 `STATE.md` 中 `steps_completed` 计数。每新增 5 个 step 完成标记后，输出：

```
[认知锚定] 当前核心约束：规范先行 / 门控确认(确认|confirm|yes|Y) /
后端优先 / 禁止私自变更技术 / 对抗性评审 / 双编译门禁 /
集成门控 / 证据胜于断言 / Delta 变更 / Discovery 优先
```

## 3. 熔断机制

每次违反宪法时：

1. 读取 `STATE.md` → `constitution_compliance.violations`
2. 计数 +1 并写回 STATE.md
3. 输出：`[宪法违规] 第 N 次，累计 X/3`
4. 若 X ≥ 3 → 暂停工作，输出《合规审查报告》，等待用户 `确认` 后方可继续；通过后 violations 清零

## 4. 决策血缘

做出技术选型、架构分层、接口设计、数据模型变更、依赖增删时，写入 `STATE.md` → `decision_lineage`：

```yaml
- id: DEC-{YYYYMMDD}-{NNN}
  basis: "Requirement FR-xxx / ADR-xxx"
  decision: "{简述}"
  alternatives_rejected: ["{方案B}: {拒绝原因}"]
  risks: ["{已知风险}"]
```

## 5. 门控验证报告 (GVR)

阶段结束请求确认前，产出 GVR 摘要（可嵌入 step complete 或单独文件）：

```markdown
# GVR-{phase}-{date}

## 范围
- 本阶段覆盖的 Spec / 需求编号

## 编译门禁（如适用）
- 命令 + 关键输出片段

## 对抗性评审（如适用）
- 至少 1 条 BLOCKER/WARNING/SUGGESTION

## 决策血缘
- DEC-xxx 列表

## 确认请求
请输入 [确认/confirm/yes/Y] 通过
```

## 6. 跨阶段一致性

提测前自检必须包含 `references/ai-self-check.md` 第 9 类（跨阶段一致性 10 项）。

---

> 详见 `constitution.md` 原则 11–14 | `config.yaml` cognitive_anchor / circuit_breaker
