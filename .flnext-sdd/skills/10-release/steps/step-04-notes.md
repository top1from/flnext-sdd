# Step 4: 生成发布说明

## Goal

生成 RELEASE-NOTES.md，记录本次发布的所有变更。

## Instructions

### 4.1 生成内容

```markdown
# Release Notes — v{version}

> 发布日期: {DATE}
> 基于分支: develop → main

## 新功能
- {feature list}

## 改进
- {improvements}

## 修复
- {bug fixes}

## SDD 工作流追溯

| 阶段 | 状态 | 确认人 | 日期 |
|------|------|--------|------|
| 0. Discovery | ✅ CONFIRMED | | |
| 1. 需求讨论 | ✅ CONFIRMED | | |
| 2. 原型设计 | ✅ CONFIRMED | | |
| 3. 架构设计 | ✅ CONFIRMED | | |
| 3b. 架构评审 | ✅ PASS | | |
| 4. 后端开发 | ✅ CONFIRMED (Phase A) | | |
| 5. 前端开发 | ✅ CONFIRMED (Phase B) | | |
| 6. 测试用例 | ✅ CONFIRMED | | |
| 7. 功能测试 | ✅ PASS | | |
| 8. 提测 | ✅ CONFIRMED | | |
| 9. 验收 | ✅ PASS | | |
| 10. 发布 | ✅ COMPLETE | | |

## 代码变更统计
- 新增文件: N
- 修改文件: N
- 删除文件: N
- 总变更行: +N/-N
```

### 4.2 保存

输出到 `docs/sdd/{FEATURE_NAME}/RELEASE-NOTES.md`

---

**下一步**: ./step-05-review.md（发布后回顾）
