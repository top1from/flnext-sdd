---
sdd_version: 3.0
project_name: ""
project_type: "greenfield"              # greenfield / brownfield
current_phase: 0                        # 0=未开始, 0=Discovery, 1-10=各阶段
phase_status: pending                   # pending / in_progress / awaiting_confirmation / confirmed / complete
next_action: /flnext-sdd-discovery             # 下一步推荐命令
phase_name: ""

# 4 状态机 (源自 Kimi)
# PENDING → IN_PROGRESS → AWAITING_CONFIRMATION → CONFIRMED
#                                                           ↓
#                                                       COMPLETE (最终阶段)

progress:
  total_phases: 11                      # 0-Discovery + 1~10
  completed_phases: 0
  percent: 0

# 阶段状态表
phases:
  0-discovery:
    status: PENDING
    confirmed_by: ""
    confirmed_date: ""
  1-requirement:
    status: PENDING
    confirmed_by: ""
    confirmed_date: ""
  2-prototype:
    status: PENDING
    confirmed_by: ""
    confirmed_date: ""
  3-architecture:
    status: PENDING
    confirmed_by: ""
    confirmed_date: ""
  3b-arch-review:
    status: PENDING
    result: ""                           # PASS / REWORK / HOLD
    confirmed_by: ""
    confirmed_date: ""
  4-backend:
    status: PENDING
    compilation_gate: ""                 # pending / passed / failed
    confirmed_by: ""
    confirmed_date: ""
  5-frontend:
    status: PENDING
    compilation_gate: ""                 # pending / passed / failed
    confirmed_by: ""
    confirmed_date: ""
  6-testcase:
    status: PENDING
    confirmed_by: ""
    confirmed_date: ""
  7-testing:
    status: PENDING
    result: ""                           # PASS / REWORK / HOLD
    confirmed_by: ""
    confirmed_date: ""
  8-submit:
    status: PENDING
    branch: ""
    commit: ""
    confirmed_by: ""
    confirmed_date: ""
  9-accept:
    status: PENDING
    confirmed_by: ""
    confirmed_date: ""
  10-release:
    status: PENDING
    version: ""
    tag: ""
    confirmed_by: ""
    confirmed_date: ""

phase_history: []

current_step: ""
steps_completed: []

# 7-Wave 开发编排状态 (源自 Kimi)
wave_progress:
  current_wave: 0
  wave_status: {}                       # wave-1: completed, wave-2: in_progress ...

# 双编译门禁状态 (源自 DeepSeek)
compilation_gates:
  backend:
    status: pending                     # pending / passed / failed
    checked_at: ""
    error_log: ""
  frontend:
    status: pending
    checked_at: ""
    error_log: ""

# 钉钉AI表格集成
dingtalk:
  base_id: ""                              # AI 产研需求管理 baseId
  table_id: ""                             # 需求表 tableId
  record_id: ""                            # 当前需求记录 recordId
  requirement_id: ""                       # 需求编号（从表格读取）
  requirement_name: ""                     # 需求名称（从表格读取）
  ai_start_time: ""                        # AI开始时间
  ai_end_time: ""                          # AI结束时间
  field_mapping:                           # 字段映射（首次查询后缓存）
    status: ""                             # 状态字段 fieldId
    handler: ""                            # 处理人字段 fieldId
    ai_start: ""                           # AI开始时间 fieldId
    ai_end: ""                             # AI结束时间 fieldId
    req_id: ""                             # 需求编号 fieldId
    req_name: ""                           # 需求名称 fieldId

metadata:
  created_at: ""
  updated_at: ""
  output_folder: "docs/sdd"
  discovery_context: ""                 # project-context.md 路径 (brownfield)
---
