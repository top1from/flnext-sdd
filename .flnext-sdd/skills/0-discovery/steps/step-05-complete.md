# Step 5: 完成确认

## 目标

展示 Discovery 结果摘要，等待用户严格确认，建立 Drift 检测基准。

## 执行步骤

### 5.1 展示 Discovery 结果摘要

```
═══════════════════════════════════════════════════════════════
  🔍 PHASE 0: DISCOVERY — COMPLETE
═══════════════════════════════════════════════════════════════

项目类型: Brownfield（已有代码库）

技术栈:
  后端: Node.js + Express + Prisma + PostgreSQL
  前端: React + Ant Design + Vite
  基础设施: Docker + GitHub Actions

架构:
  分层: Controller → Service → Repository → Prisma
  模块数: 8
  API 端点: 23

代码规范:
  风格: ESLint + Prettier
  测试: Jest (覆盖率 45%)
  类型: TypeScript strict mode

已知风险:
  🔴 2 个安全风险（硬编码密钥）
  🟡 5 个技术债务（TODO/FIXME）
  🟢 3 个过时依赖

歧义澄清:
  自动处理: N 个 (PATH 1a/1b)
  人工确认: N 个 (PATH 2/3)
  辩证守卫触发: N 次

产出文件:
  📄 docs/sdd/project-context.md
  📄 docs/sdd/tech-stack.md
  📄 docs/sdd/architecture-map.md

═══════════════════════════════════════════════════════════════
  ⚠️  THIS IS A GATED PHASE ⚠️
  Discovery 结果必须确认才能进入需求讨论。

  To CONFIRM and proceed to Phase 1 (需求讨论):
    → Reply: "确认" / "confirm" / "yes"

  To REQUEST CHANGES:
    → Describe what needs to be updated
═══════════════════════════════════════════════════════════════
```

### 5.2 等待严格确认

**只有以下确认词有效**:
- ✅ "确认" / "confirm" / "yes" / "Y"
- ❌ "ok" / "looks good" / "sure" / "嗯" / "好的" → 提示使用严格确认词

### 5.3 确认后操作

1. 更新 STATE.md:
   ```yaml
   phases:
     0-discovery:
       status: CONFIRMED
       confirmed_by: "{user}"
       confirmed_date: "{date}"
   current_phase: 1
   phase_status: pending
   next_action: /flnext-sdd-requirement
   ```

2. 建立 Drift 基准（记录当前文件结构快照到 project-context.md）

3. 提示下一步:
   ```
   ✅ Phase 0 (Discovery) confirmed.
   Next: Run /flnext-sdd-requirement to begin Phase 1 (需求讨论).
   ```

### 5.4 修改请求处理

如果用户要求修改:
1. 返回对应步骤进行修改
2. 更新相关输出文件
3. 重新展示摘要
4. 再次等待确认

## 状态更新

```yaml
current_step: "step-05-complete"
steps_completed: ["step-01-detect", "step-02-scan", "step-03-interview", "step-04-context"]
phase_status: awaiting_confirmation
```
