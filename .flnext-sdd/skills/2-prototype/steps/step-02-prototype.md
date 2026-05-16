# Step 2: 设计低保真原型

## Goal

设计页面结构和布局，生成 HTML 原型文件。

## Mandatory Execution Rules

1. 基于 In Scope 功能设计页面
2. 设计导航结构
3. 生成 prototype.html 文件
4. 更新 STATE.md

## Instructions

### 2.1 设计页面结构

根据功能列表确定需要的页面:

| 页面编号 | 页面名称 | 包含功能 |
|----------|----------|----------|
| P-001 | [页面名] | [功能列表] |

询问用户确认:
"根据功能需求，我设计以下页面结构：[列出页面]。是否正确？"

### 2.2 设计导航结构

设计页面间的导航关系:

```
首页 → 功能A页面 → 功能A详情
     → 功能B页面
     → 设置页面
```

### 2.3 设计页面布局

对每个页面设计低保真布局:

**布局元素**:
- 头部区域
- 导航区域
- 内容区域
- 操作区域
- 底部区域

询问用户对关键页面的布局确认。

### 2.4 生成 HTML 原型

使用模板 `{skill-root}/templates/prototype-html-template.html`:

生成 `docs/sdd/{FEATURE_NAME}/prototype.html`

HTML 原型特点:
- 简洁的线框图风格
- 可点击的导航链接
- 基本的交互演示

### 2.5 生成原型文档

使用模板 `{skill-root}/templates/prototype-template.md`:

生成 `docs/sdd/{FEATURE_NAME}/prototype.md`

文档内容:
- 页面结构说明
- 导航结构图
- 每个页面的布局描述
- 交互流程说明

## Menu Options

完成本步骤后:

[C] 继续 - 进入浏览器预览步骤 (step-03-preview)
[B] 返回 - 回到初始化步骤 (step-01-init)
[Q] 退出并保存当前进度

---

**下一步**: ./step-03-preview.md