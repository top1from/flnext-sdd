# Step 2: Wave 1-2 执行（数据库迁移 + Entity/DTO）

## Goal

执行 Wave 1（数据库迁移验证）和 Wave 2（Entity/DTO 创建）。

## ⚠️ 数据库连接验证（Wave 1 前置）

### 在执行任何数据库操作之前，必须验证连接

```bash
# 从 ADR-001 读取目标数据库类型和连接信息
# 执行连接测试
```

**数据库类型确认**（从 ADR-001）:
- [ ] 目标数据库类型: {PostgreSQL / MySQL / MongoDB / ...}
- [ ] 数据库版本: {16.x / 8.0 / ...}
- [ ] 连接方式: {直连 / ORM / 连接池}

### 连接验证步骤

**Step A: 读取 ADR 决策记录**
```
读取 docs/sdd/{FEATURE_NAME}/adr/ADR-001-database.md
确认: 数据库类型、版本、连接串格式、ORM 选型
```

**Step B: 执行连接测试**
```bash
# 示例：PostgreSQL
psql -h {host} -p {port} -U {user} -d {database} -c "SELECT 1"

# 或通过 ORM 配置测试
npm run db:check   # Node.js 项目
mvn validate       # Java/Spring 项目
```

**Step C: 连接结果处理**

| 结果 | 处理 |
|------|------|
| **连接成功** | 继续 Wave 1 数据迁移 |
| **连接失败** | **禁止私自降级！** 执行以下流程 |

### 连接失败标准处理流程

```
🚨 数据库连接失败

错误信息: {完整错误日志}
目标数据库: {从 ADR-001 读取}
连接参数: {host:port/database}

可能原因:
1. 数据库服务未启动
2. 网络不通
3. 连接串配置错误
4. 凭据无效

可选方案:
A. 修复连接配置后重试
B. 手动启动数据库服务
C. 确认后切换到备选数据库（需更新 ADR）
D. 暂时使用 Docker 启动一个实例

❌ 禁止操作:
- 私自换成 SQLite
- 私自换成 H2 内存数据库
- 私自跳过数据库直接硬编码数据
- 任何不经确认的技术降级

请选择方案 (A/B/C/D) 或提供其他建议。
```

> **原则 7 强制执行**: 数据库连接失败后，AI 不得自行决定替换方案。必须等待人工确认。

## Wave 1: 数据库迁移（串行）

**仅在连接验证通过后执行:**

1. 读取 `docs/sdd/{FEATURE_NAME}/database.md`
2. 读取 `docs/sdd/{FEATURE_NAME}/adr/ADR-001-database.md` 确认 ORM 选型
3. 创建迁移脚本
4. 执行迁移: `npm run db:migrate` / `mvn flyway:migrate` / `alembic upgrade head`
5. 验证表结构: `npm run db:verify` 或等效命令
6. **确认迁移成功才能进入 Wave 2**

## Wave 2: Entity + DTO（并行）

子代理 B-02: Entity / Domain Models（并行）
子代理 B-03: DTOs (Create/Update)（并行）

每个子代理接收: 任务 XML + 架构文档段落 + ADR 决策记录

---

**下一步**: `./step-03-wave3.md` 或 Wave 2 完成后进入 Wave 3
