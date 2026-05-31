# Delta 合并指南

> 将 delta 规格合并入主 spec 的分步流程（合并自 SDD-Forge v2.0）。

## 合并前验证

1. 列出 `deltas/` 下所有未归档文件
2. 解析并校验 YAML front-matter（operation、target_id、rationale）
3. 构建冲突矩阵（同 target_id 多 delta、REMOVED+MODIFIED 等）
4. 验证 target_id 在主 spec 中存在

有冲突则生成 `merge-conflict-report.md` 并暂停等待人工。

## 合并顺序

按文件名日期 chronological；同日按：**RENAMED → ADDED → MODIFIED → REMOVED**。

## 合并后验证

- testcases.md 中 FR-ID 与 spec 一致
- 无重复 ID
- 必需章节完整
- 生成 merge-report.md（含合并前后 hash、冲突处理、人工签核）

## 归档

成功合并后 delta 文件移入 `deltas/archive/YYYY-MM-DD-{merge-name}/`。
