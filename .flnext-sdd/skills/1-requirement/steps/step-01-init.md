# Step 1: 初始化需求讨论（含版本自检+钉钉AI表格集成）

## Goal

版本自检 → 从钉钉AI表格获取待排期需求 → 初始化需求讨论。

## Mandatory Execution Rules

1. ⚠️ 必须首先执行版本自检（Step 0）
2. 必须先尝试从钉钉AI表格获取需求，失败后才降级为手动输入
3. 所有 dws 命令必须加 `--format json`
4. fieldId 必须从 table get 返回中提取，禁止硬编码或猜测
5. 每个步骤完成后更新 STATE.md

## Instructions

### 0. 版本自检（强制）⚡

每次 `/flnext-sdd-requirement` 启动时必须首先执行：

```bash
# 1. 读取本地版本
# 从 STATE.md 中读取 sdd_version 字段

# 2. 查询 npm 最新版本
npm view flnext-sdd version 2>/dev/null || echo "0.0.0"

# 3. 比对版本
# IF 本地版本 < npm 最新版本:
#   → 执行更新
```

**版本比对逻辑**：

```
本地版本: {从 STATE.md 读取 sdd_version}
最新版本: {从 npm view 获取}

IF 本地版本 < 最新版本:
  🔄 检测到 flnext-sdd 有新版本可用: v{本地} → v{最新}
    → 自动执行: npx flnext-sdd@latest --update
    → 更新完成后，需刷新当前 skill 文件
```

**更新命令**：
```bash
npx flnext-sdd@latest --update
```

> ⚠️ 更新后 skill 文件已刷新，需重新读取当前 step 文件后再继续。

### 1.1 钉钉需求获取

#### Step A: 查找 AI 产研需求管理表格

```bash
dws aitable base search --query "AI 产研需求管理" --format json
```

从返回中提取 `baseId`，更新到 STATE.md `dingtalk.base_id`。

#### Step B: 获取表格结构

```bash
dws aitable base get --base-id <BASE_ID> --format json
```

从返回的 `tables` 中找到需求管理表，提取 `tableId`，更新到 STATE.md `dingtalk.table_id`。

#### Step C: 获取字段映射

```bash
dws aitable table get --base-id <BASE_ID> --table-id <TABLE_ID> --format json
```

从返回的 `fields` 中识别并缓存以下 fieldId 到 STATE.md `dingtalk.field_mapping`：

| 字段用途 | 识别方式 |
|---------|---------|
| req_id | 字段名包含"编号"或"需求编号" |
| req_name | 字段名包含"名称"或"需求名称" |
| status | 字段名包含"状态"，type 为 singleSelect |
| handler | 字段名包含"处理人"，type 为 user |
| ai_start | 字段名包含"AI开始时间" |
| ai_end | 字段名包含"AI结束时间" |

#### Step D: 查询待排期需求

```bash
dws aitable record query --base-id <BASE_ID> --table-id <TABLE_ID> \
  --filters '{"operator":"and","operands":[{"operator":"eq","operands":["<STATUS_FIELD_ID>","待排期"]}]}' \
  --field-ids "<REQ_ID_FIELD>,<REQ_NAME_FIELD>,<HANDLER_FIELD>,<STATUS_FIELD>,<DESC_FIELD>" \
  --limit 100 --format json
```

> 注意：先不过滤处理人（user 类型字段 filter 支持有限），拿到待排期列表后再由 Claude 根据当前用户信息筛选"我本人"的记录。
> `--field-ids` 必须指定，否则 autoNumber 类型字段（需求编号）不会返回。

#### Step E: 展示需求列表

展示格式：
```
📋 您的待排期需求列表：

| # | 需求编号 | 需求名称 | 描述摘要 |
|---|---------|---------|---------|
| 1 | REQ-001 | xxx     | xxx     |
| 2 | REQ-002 | xxx     | xxx     |

请选择要开始的需求编号（输入序号或需求编号），或输入 M 手动输入需求。
```

使用 AskUserQuestion 让用户选择需求。

#### Step F: 记录选中需求

用户选择后：
1. 提取选中记录的 `recordId` → 更新 STATE.md `dingtalk.record_id`
2. 提取需求编号字段值 → 更新 STATE.md `dingtalk.requirement_id`
3. 提取需求名称字段值 → 更新 STATE.md `dingtalk.requirement_name`
4. 记录当前时间（ISO 格式 YYYY-MM-DDTHH:mm:ss）→ 更新 STATE.md `dingtalk.ai_start_time`
5. 如果 STATE.md 的 `feature_name` 为空，用需求名称填充

### 1.2 降级：手动输入模式

IF 钉钉查询失败或用户选择手动输入：

1. 询问项目/功能名称
2. 更新 STATE.md project_name 和 feature_name
3. 询问业务背景（原有流程）

### 1.3 业务背景确认

IF 从钉钉获取了需求信息：
1. 复述从表格中获取的需求描述
2. 确认: "根据钉钉需求管理中的记录，本需求是：[需求名称]，主要目标：[描述]。这个理解是否准确？"
3. 追问细节:
   - "能否补充更多业务背景？"
   - "主要的目标用户是谁？"
   - "用户在什么场景下会使用这个功能？"

IF 手动输入模式（原有流程）：
1. 询问: "请描述一下这个功能或项目的业务背景是什么？解决了什么问题？"
2. 追问方向与原流程一致

### 1.4 记录关键信息

在对话中记录以下信息:
- 业务背景描述
- 目标用户群体
- 主要使用场景
- 问题痛点

### 1.5 更新 STATE.md

```yaml
current_phase: 1
phase_status: in_progress
current_step: "step-01-init"
steps_completed: ["step-01-init"]
dingtalk:
  base_id: "<FROM_DINGTALK>"
  table_id: "<FROM_DINGTALK>"
  record_id: "<FROM_DINGTALK>"
  requirement_id: "<FROM_DINGTALK>"
  requirement_name: "<FROM_DINGTALK>"
  ai_start_time: "<CURRENT_TIME>"
  field_mapping: "<CACHED>"
```

## Menu Options

完成本步骤后:

[C] 继续 - 进入范围确定步骤 (step-02-scope)
[Q] 退出并保存当前进度

---

**下一步**: ./step-02-scope.md
