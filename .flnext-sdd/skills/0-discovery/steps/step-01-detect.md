# Step 1: 项目类型检测

## 目标

检测当前项目是 Greenfield（新项目）还是 Brownfield（已有代码库），决定是否需要执行完整 Discovery。

## 执行步骤

### 1.1 扫描项目根目录

检查以下信号的存在性：

```bash
# 包管理文件
package.json / pom.xml / go.mod / requirements.txt / Cargo.toml / build.gradle

# 源代码目录
src/ / app/ / lib/ / internal/ / cmd/ / pkg/

# 版本控制
.git/

# 配置文件
docker-compose.yml / Dockerfile / .env.example / Makefile
```

### 1.2 统计代码文件数量

```bash
# 统计代码文件
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \
  -o -name "*.java" -o -name "*.py" -o -name "*.go" -o -name "*.rs" \
  -o -name "*.vue" -o -name "*.svelte" \) \
  ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/dist/*" ! -path "*/build/*" \
  | wc -l
```

### 1.3 判定规则

| 条件 | 判定 | 动作 |
|------|------|------|
| 无包管理文件 且 代码文件 < 10 | Greenfield | 跳过 Discovery → /flnext-sdd-requirement |
| 有包管理文件 或 代码文件 >= 10 | Brownfield | 执行完整 Discovery |
| 有包管理文件 但代码文件 < 10 | 半成熟项目 | 执行 Quick Discovery |

### 1.4 更新状态

更新 STATE.md:
```yaml
project_type: "brownfield"   # 或 "greenfield"
current_phase: 0
phase_status: in_progress
current_step: "step-01-detect"
```

### 1.5 向用户报告

```
🔍 项目类型检测完成

项目类型: Brownfield（已有代码库）
代码文件: N 个
检测到: Node.js (Express) + React + PostgreSQL

推荐: 执行 Deep 扫描 (10-30 分钟)
  → /flnext-sdd-discovery 继续 Discovery
  → 输入 D 修改扫描深度
```

如果是 Greenfield:
```
🌱 项目类型检测完成

项目类型: Greenfield（新项目）
当前目录无成熟代码库

建议: 跳过 Discovery，直接开始需求讨论
  → /flnext-sdd-requirement 开始需求讨论
```
