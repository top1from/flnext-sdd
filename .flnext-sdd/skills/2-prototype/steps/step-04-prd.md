# Step 4: 生成PRD文档

## Goal

基于需求和原型设计，生成完整的产品需求文档（PRD）。

## Mandatory Execution Rules

1. 整合需求文档和原型设计内容
2. 生成功能需求规格
3. 生成非功能需求规格
4. 用户审阅PRD内容
5. 更新 STATE.md

## Instructions

### 4.1 整合信息来源

读取以下文件:
- `docs/sdd/{FEATURE_NAME}/requirement-scope.md` - 需求边界
- `docs/sdd/{FEATURE_NAME}/prototype.md` - 原型设计描述

整合信息生成PRD。

### 4.2 生成功能需求

对每个 In Scope 功能生成功能需求规格:

**格式**:
```
### FR-001: [功能名称]

- **描述**: [功能详细描述]
- **优先级**: P1/P2/P3
- **用户故事**: As a [角色], I want to [动作], so that [价值]
- **原型参考**: prototype.md 中对应的页面
- **验收标准**:
  - AC-001: [验收条件]
  - AC-002: [验收条件]
```

### 4.3 生成非功能需求

询问用户关于非功能需求:
- 性能要求
- 安全要求
- 兼容性要求
- 可访问性要求

生成非功能需求规格:

**格式**:
```
### NFR-001: 性能要求
- **描述**: [性能指标]
- **验收标准**: [可量化指标]
```

### 4.4 生成PRD文档

使用模板 `{skill-root}/templates/prd-template.md`:

生成 `docs/sdd/{FEATURE_NAME}/prd.md`

### 4.5 用户审阅

向用户展示生成的PRD:

```
📄 PRD文档已生成：

[显示PRD关键内容摘要]

请审阅文档内容，确认功能需求和非功能需求是否准确。
```

询问用户确认:
"PRD文档是否准确反映了产品需求？"

**IF 需要修改:**
- 记录修改点
- 更新PRD内容
- 再次审阅

## Menu Options

完成本步骤后:

[C] 继续 - 进入完成确认步骤 (step-05-complete)
[B] 返回 - 回到原型预览步骤 (step-03-preview)
[Q] 退出并保存当前进度

---

**下一步**: ./step-05-complete.md