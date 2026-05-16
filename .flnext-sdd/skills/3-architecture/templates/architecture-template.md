---
stepsCompleted: []
workflowType: 'architecture'
created: {{date}}
---

# 技术架构文档 - {{project_name}}

## 1. 架构概述

### 1.1 设计目标
{{design_goals}}

### 1.2 需求来源
参见: [PRD文档](./prd.md)

---

## 2. 技术栈

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
{{tech_stack}}

---

## 3. 系统架构图

```
{{architecture_diagram}}
```

---

## 4. 模块划分

| 模块编号 | 模块名称 | 包含功能 | 依赖模块 |
|----------|----------|----------|----------|
{{module_list}}

---

## 5. API设计

| API编号 | 端点 | 方法 | 功能 | 请求 | 响应 |
|---------|------|------|------|------|------|
{{api_list}}

---

## 6. 安全设计

{{security_design}}

---

## 7. 性能设计

{{performance_design}}

---

> 此文档由 FLTeam-SDD 自动生成
> 阶段: 架构设计
> 状态: {{status}}