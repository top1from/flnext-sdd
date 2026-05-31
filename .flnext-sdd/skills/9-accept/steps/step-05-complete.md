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

### 5.2 回传AI结束时间到钉钉

IF STATE.md `dingtalk.record_id` 不为空:

1. 读取 STATE.md 中的 `dingtalk.base_id`、`dingtalk.table_id`、`dingtalk.record_id`、`dingtalk.field_mapping.ai_end`
2. 获取当前时间（ISO 格式 YYYY-MM-DDTHH:mm:ss）
3. 执行回传:
```bash
dws aitable record update --base-id <BASE_ID> --table-id <TABLE_ID> \
  --records '[{"recordId":"<RECORD_ID>","cells":{"<AI_END_FIELD_ID>":"<CURRENT_TIME>"}}]' \
  --format json
```
4. 确认回传成功，更新 STATE.md `dingtalk.ai_end_time`
5. 向用户确认: "已将AI结束时间回传到钉钉表格"

IF 回传失败:
- 提示用户回传失败，但不阻塞后续流程
- 建议用户手动更新钉钉表格

ELSE (dingtalk.record_id 为空):
- 跳过钉钉回传（手动输入模式）

### 5.3 清理 Beta 分支（验收后）

```bash
git checkout develop
git push origin --delete beta/{version}
git branch -d beta/{version}
```

### 5.4 更新 STATE.md

```yaml
phases:
  9-accept:
    status: CONFIRMED
    result: PASS
    beta_branch: "beta/{version}"
    report: "docs/sdd/{FEATURE_NAME}/acceptance-report.md"

current_phase: 9
next_action: /flnext-sdd-release
progress:
  completed_phases: 11
  percent: 85
```

---

**确认后**: 进入阶段 10 发布 (/flnext-sdd-release)
