# Step 3: 浏览器预览原型

## Goal

在浏览器中直接打开 HTML 原型，让用户直观感受和操作原型。

## 核心规则

**直接打开 HTML 文件在浏览器中预览，不要使用截图模式。**
- ✅ 使用 `preview_url` 打开 `file:///` 路径
- ✅ 或使用 Playwright 的 `browser_navigate` 打开后保持浏览器窗口可见
- ❌ 不要使用 `browser_take_screenshot` 截图代替实际预览
- ❌ 不要用 `browser_snapshot` 文本描述代替视觉预览

## Instructions

### 3.1 打开原型文件

**方式一：直接浏览器预览（推荐）**

使用 IDE 内置浏览器打开 HTML 文件：

```
文件路径: docs/sdd/{FEATURE_NAME}/prototype.html
```

直接用 `preview_url` 或系统浏览器打开该文件，让用户看到真实的页面渲染效果。

**方式二：Playwright 浏览器打开**

如果需要在 Playwright 中交互操作：

```bash
# 使用 Playwright 打开 HTML 文件
npx playwright open docs/sdd/{FEATURE_NAME}/prototype.html
```

或使用 MCP 的 `browser_navigate` 工具指向 `file:///` + prototype.html 的绝对路径。

### 3.2 展示原型

打开后告知用户：

```
📱 原型已在浏览器中打开

页面: {页面清单}
核心流程可演示:
  1. {流程1}
  2. {流程2}
  3. {流程3}

请在浏览器中查看原型效果。
```

### 3.3 用户反馈收集

询问用户：
"原型效果是否符合您的预期？"
- 页面结构是否正确？
- 导航是否合理？
- 布局是否满意？
- 是否需要调整？

**IF 用户不满意：**
- 记录需要修改的点
- 返回 step-02-prototype 修改原型 HTML
- 修改后重新在浏览器中打开预览

**IF 用户满意：**
- 确认原型设计
- 继续进入 PRD 生成步骤

### 3.4 预览要求

- **必须让用户看到真实的 HTML 渲染效果**，不是截图、不是文本描述
- 用户可以直接在浏览器中点击、滚动、查看布局
- 如果原型有多个页面，确保导航可点击

---

**下一步**: ./step-04-prd.md（用户满意后）
