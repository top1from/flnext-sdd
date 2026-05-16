---
stepsCompleted: []
workflowType: 'database'
created: {{date}}
---

# 数据库设计文档 - {{project_name}}

## 1. 数据库概述

### 1.1 数据库类型
{{database_type}}

### 1.2 需求来源
参见: [架构文档](./architecture.md)

---

## 2. 数据实体分析

| 实体编号 | 实体名称 | 属性 | 说明 |
|----------|----------|------|------|
{{entity_list}}

---

## 3. 表结构设计

{{table_structures}}

---

## 4. 索引设计

| 表名 | 索引名 | 字段 | 类型 | 说明 |
|------|--------|------|------|------|
{{index_design}}

---

## 5. 关系设计

```
{{relationship_diagram}}
```

---

## 6. SQL脚本

{{sql_scripts}}

---

> 此文档由 FLTeam-SDD 自动生成
> 阶段: 架构设计
> 状态: {{status}}