# Step 5: 验收完成确认

## Goal

验收通过，等待用户确认后进入发布阶段。

## Hard Gate

**验收 PASS 才能进入发布阶段 (Phase 10)**

## Instructions

### 5.1 展示验收总结

```
✅ 功能验收完成

验收版本: beta/{version}
验收结果: PASS

通过: {N}/{N} FR
已知问题: {N} 个（非阻塞）

📄 验收报告: docs/sdd/{FEATURE_NAME}/acceptance-report.md

⚠️ THIS IS A GATED PHASE ⚠️
确认验收结果才能进入发布阶段。

To CONFIRM:
  → Reply: "确认" / "confirm" / "yes"
```

### 5.2 清理 Beta 分支（验收后）

```bash
git checkout develop
git push origin --delete beta/{version}
git branch -d beta/{version}
```

### 5.3 更新 STATE.md

```yaml
phases:
  9-accept:
    status: CONFIRMED
    result: PASS
    beta_branch: "beta/{version}"
    report: "docs/sdd/{FEATURE_NAME}/acceptance-report.md"
```

---

**确认后**: 进入阶段 10 发布 (/flnext-sdd-release)
