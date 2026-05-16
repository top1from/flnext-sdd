# Step 2: 4-Agent 并行扫描

## 目标

启动 4 个并行 Agent 扫描代码库，从技术栈、架构、代码质量、风险四个维度全面理解项目。

## 扫描深度配置

根据 STATE.md 或 config.yaml 的 `discovery.scan_depth`:

| 深度 | 耗时 | 扫描范围 |
|------|------|---------|
| Quick | 2-5 min | package.json/pom.xml + 目录顶层 + README + 入口文件 |
| Deep | 10-30 min | 完整目录树 + 核心模块代码 + 配置文件 + 测试目录 |
| Exhaustive | 30-120 min | 全量代码阅读 + 依赖关系 + 数据库模型 + API 端点 |

## 4-Agent 并行执行

### Agent 1: Tech Agent（技术栈扫描）

**输出**: `docs/sdd/tech-stack.md`

扫描内容:
1. 语言版本（从 .nvmrc / .python-version / go.mod 获取）
2. 框架及版本（从 package.json dependencies / pom.xml 获取）
3. 数据库类型和版本
4. ORM/数据访问层
5. 中间件（Redis/RabbitMQ/Kafka 等）
6. 第三方服务集成（支付/推送/短信等）
7. 构建/部署工具链（Webpack/Vite/Docker/K8s）
8. CI/CD 配置

输出格式:
```markdown
# 技术栈映射 — {PROJECT_NAME}

## 后端
- 语言: {language} {version}
- 框架: {framework} {version}
- 数据库: {database} {version}
- ORM: {orm} {version}
- 中间件: {list}

## 前端
- 框架: {framework} {version}
- UI 库: {library} {version}
- 构建工具: {tool} {version}

## 基础设施
- 容器化: Docker / K8s
- CI/CD: {platform}
- 监控: {tools}

## 第三方集成
- {service}: {purpose}
```

### Agent 2: Arch Agent（架构扫描）

**输出**: `docs/sdd/architecture-map.md`

扫描内容:
1. 目录结构和模块划分
2. 入口文件（main/index/app）
3. 路由定义
4. API 端点清单
5. 数据流和分层架构
6. 公共组件和工具函数
7. 配置管理模式
8. 认证/授权机制

输出格式:
```markdown
# 架构映射 — {PROJECT_NAME}

## 目录结构
{tree}

## 模块划分
| 模块 | 路径 | 职责 |
|------|------|------|
| | | |

## API 端点
| 方法 | 路径 | 模块 | 说明 |
|------|------|------|------|
| | | | |

## 数据流
{描述请求从入口到响应的完整路径}

## 公共组件
| 组件 | 路径 | 用途 |
|------|------|------|
| | | |
```

### Agent 3: Quality Agent（代码质量扫描）

**输出**: 内容写入 `project-context.md` §代码规范

扫描内容:
1. 代码风格（从 .eslintrc / .prettierrc / checkstyle 获取）
2. 命名规范（变量/函数/文件命名模式）
3. 测试框架和配置
4. 测试覆盖率（如可获取）
5. 错误处理模式（try-catch / 中间件 / 全局处理器）
6. 日志规范
7. 类型系统（TypeScript strict / Python type hints）

### Agent 4: Concerns Agent（风险扫描）

**输出**: 内容写入 `project-context.md` §已知风险

扫描内容:
1. 技术债务标记（grep TODO/FIXME/HACK/XXX）
2. 安全风险（硬编码密钥/SQL 注入风险/XSS 风险）
3. 性能瓶颈（N+1 查询/大循环/未分页查询）
4. 过时依赖（npm audit / pip audit）
5. 数据迁移风险
6. 单点故障

## 并行执行方式

使用 Claude Code 的 Agent 工具并行启动 4 个子代理：

```
Tech Agent:    扫描技术栈 → 生成 tech-stack.md
Arch Agent:    扫描架构   → 生成 architecture-map.md
Quality Agent: 扫描质量   → 输出到 project-context.md §Quality
Concerns Agent:扫描风险   → 输出到 project-context.md §Concerns
```

## 状态更新

更新 STATE.md:
```yaml
current_step: "step-02-scan"
steps_completed: ["step-01-detect"]
wave_progress:
  current_wave: 0
  wave_status:
    tech_agent: "in_progress"
    arch_agent: "in_progress"
    quality_agent: "in_progress"
    concerns_agent: "in_progress"
```
