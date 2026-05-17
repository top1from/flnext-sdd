# Step 3: Wave 6 执行 — 页面 + 状态 + 路由

## Goal

并行实现页面组件、状态管理和路由配置。

## Instructions

### 3.1 并行子代理

| 子代理 | 任务 | 说明 |
|--------|------|------|
| F-03 | 页面组件 | 对照原型实现所有页面 |
| F-04 | 状态管理 | Redux/Context 配置 |
| F-05 | 路由配置 | React Router / Next.js pages |

### 3.2 页面组件要求

根据原型文档实现每个页面:
- 页面布局与原型一致
- **4 状态覆盖**: loading / empty / error / normal
- 对接 API Client Types（F-01 产出的类型）
- 页面放在项目约定的 pages/ 或 app/ 目录

### 3.3 状态管理要求

- 全局状态: 用户信息、主题设置
- 页面状态: 列表数据、表单数据
- 加载状态: isLoading / isError / isEmpty

### 3.4 路由配置要求

- 所有页面路由已配置
- 导航链接指向正确
- 404 页面已处理
- 需要认证的页面有路由守卫

### 3.5 提交

```bash
git add src/pages/ src/store/ src/router/
git commit -m "feat(F-03~F-05): add pages + state + routing"
```

---

**下一步**: ./step-04-wave7.md（Wave 7: 验证 + 错误处理）
