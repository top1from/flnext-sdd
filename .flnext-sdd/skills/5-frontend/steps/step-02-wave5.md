# Step 2: Wave 5 执行 — 共享组件

## Goal

创建项目中共享的 UI 组件（按钮、输入框、卡片、导航栏等）。

## Instructions

### 2.1 组件清单

根据原型文档确定需要的共享组件:

| 组件 | 用途 | 状态覆盖 |
|------|------|---------|
| Button | 通用按钮 | loading / disabled / normal |
| Input | 输入框 | error / normal / disabled |
| Card | 卡片容器 | normal / empty |
| Navbar | 导航栏 | 当前页面高亮 |
| Modal | 弹窗 | open / close |
| Table | 数据表格 | loading / empty / error / normal |
| Toast | 消息提示 | success / error / info |

### 2.2 实现规则

- 每个组件必须有 Props 类型定义
- 必须覆盖至少 2 种状态（如 loading + normal）
- 遵循项目 CSS 方案
- 组件放在 `src/components/common/` 或项目约定位置

### 2.3 提交

```bash
git add src/components/common/
git commit -m "feat(F-02): add shared UI components"
```

---

**下一步**: ./step-03-wave6.md（Wave 6: 页面 + 状态 + 路由）
