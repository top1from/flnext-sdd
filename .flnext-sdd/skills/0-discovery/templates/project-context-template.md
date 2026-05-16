# Project Context 模板

# Project Context — {{project_name}}
> 自动生成 | 更新时间: {{date}}
> 所有 SDD 阶段自动加载此文件作为项目基础上下文
> 来源: FLNext-SDD Discovery Phase

---

## 技术栈

### 后端
- 语言: {{backend_language}} {{backend_version}}
- 框架: {{backend_framework}} {{backend_framework_version}}
- 数据库: {{database}} {{database_version}}
- ORM: {{orm}} {{orm_version}}
- 中间件: {{middleware_list}}

### 前端
- 框架: {{frontend_framework}} {{frontend_framework_version}}
- UI 库: {{ui_library}} {{ui_library_version}}
- 构建工具: {{build_tool}} {{build_tool_version}}
- 状态管理: {{state_management}}

### 基础设施
- 容器化: {{containerization}}
- CI/CD: {{cicd_platform}}
- 监控: {{monitoring_tools}}

### 第三方集成
| 服务 | 用途 | 配置位置 |
|------|------|---------|
| | | |

---

## 架构概览

### 目录结构
```
{{directory_tree}}
```

### 模块划分
| 模块 | 路径 | 职责 |
|------|------|------|
| | | |

### API 端点
| 方法 | 路径 | 模块 | 说明 |
|------|------|------|------|
| | | | |

### 数据流
{{data_flow_description}}

### 公共组件
| 组件 | 路径 | 用途 |
|------|------|------|
| | | |

---

## 代码规范

### 代码风格
- Linter: {{linter_config}}
- Formatter: {{formatter_config}}
- 命名规范: {{naming_convention}}

### 测试
- 框架: {{test_framework}}
- 覆盖率: {{coverage}}%
- 测试目录: {{test_directory}}

### 错误处理
- 模式: {{error_handling_pattern}}
- 全局处理器: {{global_error_handler}}

### 日志
- 框架: {{logging_framework}}
- 级别: {{log_levels}}

---

## 已知风险

### 安全风险 🔴
| # | 风险 | 位置 | 严重程度 |
|---|------|------|---------|
| | | | |

### 技术债务 🟡
| # | 标记 | 位置 | 内容 |
|---|------|------|------|
| | | | |

### 过时依赖 🟢
| # | 依赖 | 当前版本 | 最新版本 |
|---|------|---------|---------|
| | | | |

---

## 歧义澄清记录

| # | 歧义点 | 歧义分数 | PATH | 结果 | 标签 |
|---|--------|---------|------|------|------|
| | | | | | |

---

## Drift 基准

> 建立时间: {{date}}
> 用于检测代码库偏离

### 文件结构快照
- 总文件数: {{total_files}}
- 核心目录: {{core_directories}}
- 关键配置: {{key_configs}}

### 依赖快照
- 直接依赖数: {{direct_dependencies}}
- 主要框架版本: {{framework_versions}}

### API 端点快照
- 端点总数: {{total_endpoints}}
- 主要路由: {{main_routes}}

---

## 关键决策

| # | 决策 | 理由 | 影响范围 | 确认人 | 日期 |
|---|------|------|---------|--------|------|
| | | | | | |
