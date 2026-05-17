# Step 1: 前端开发初始化

## Goal

检查前置条件，确认后端 Phase A 已通过，准备前端开发环境。

## Mandatory Execution Rules

1. 确认 Phase A 编译通过
2. 读取 PRD、原型、API 文档
3. 读取 project-context.md（Brownfield）
4. 确认前端项目结构

## Instructions

### 1.1 检查前置条件

读取 STATE.md，确认:
- [ ] Phase 4-backend compilation_gate: passed
- [ ] docs/sdd/{FEATURE_NAME}/prototype.md 存在
- [ ] docs/sdd/{FEATURE_NAME}/prd.md 存在
- [ ] docs/sdd/{FEATURE_NAME}/api-design.md 存在

### 1.2 读取设计文档

加载上下文:
- PRD 文档 — 了解页面功能和交互需求
- 原型文档 — 了解页面布局和导航结构
- API 文档 — 了解可用的 API 端点和返回格式
- project-context.md — 了解现有前端技术栈和 UI 风格

### 1.3 确认技术栈

根据 project-context.md 或架构文档确认:
- 前端框架: React / Vue / Next.js
- CSS 方案: Tailwind / CSS Modules / styled-components
- 状态管理: Redux / Context / Zustand

---

**下一步**: ./step-02-wave5.md（Wave 5: 共享组件）
