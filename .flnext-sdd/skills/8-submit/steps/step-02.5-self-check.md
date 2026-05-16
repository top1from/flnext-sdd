# Step 2.5: AI 代码强制自检

## Goal

在推送代码和创建 MR 之前，AI 必须对自己的代码执行自检清单，发现潜在问题。检查结果附在 MR 描述中。

## 强制规则

```
❌ 有不通过项 → 必须修复后才能继续提测
⚠️ 有需关注项 → 标注在报告中，人工判断是否修复
✅ 全部通过 → 继续推送 + 创建 MR
```

## 执行步骤

### 2.5.1 读取自检清单

读取 `references/ai-self-check.md`，获取完整的检查项列表。

### 2.5.2 获取变更范围

```bash
# 获取 feature 分支相对 develop 的所有变更文件
git diff --name-only develop...feature/{name}

# 获取变更统计
git diff --stat develop...feature/{name}
```

### 2.5.3 逐文件逐条检查

对每个变更文件，逐条执行自检清单中的检查项。

**检查方式**：
- 阅读变更代码（`git diff develop...feature/{name}`）
- 识别触发检查项的代码模式
- 判定 ✅ / ⚠️ / ❌
- ❌ 必须给出具体文件路径和行号

**示例检查过程**：

```
检查 1.1 循环/递归:
  → OrderService.ts L42: for (let i=0; i<orders.length; i++) — 单层循环 ✅
  → ProductRepo.ts L28: orders.forEach(o => db.query(...)) — 循环内查询 ⚠️ (也是 N+1)

检查 2.2 N+1 查询:
  → ProductRepo.ts L28: forEach 内逐条 select → ❌
    位置: src/repository/ProductRepo.ts:28
    建议: 改用 WHERE id IN (...) 批量查询
```

### 2.5.4 生成自检报告

按 `references/ai-self-check.md` 中定义的格式输出报告。

### 2.5.5 判定结果

| 结果 | 条件 | 动作 |
|------|------|------|
| **PASS** | 无 ❌，⚠️ ≤ 5 | 继续推送 + 创建 MR |
| **WARN** | 无 ❌，⚠️ > 5 | 展示警告项，用户确认后继续 |
| **BLOCK** | 有 ❌ | 展示不通过项，必须修复后重新检查 |

**BLOCK 时的处理**：

```
🚨 AI 自检未通过 — {N} 项必须修复

❌ 不通过:
1. [数据库] N+1 查询 — src/repository/ProductRepo.ts:28
2. [安全] 未校验用户输入 — src/controller/UserController.ts:15

修复后重新执行 /flnext-sdd-submit 继续提测。

是否现在修复？ (确认 / N)
```

---

**下一步**：
- PASS / WARN → `./step-03-push.md`（推送 + 创建 MR，附自检报告）
- BLOCK → 修复代码后重新执行
