# Step 2.5: Wave 2 执行（Entity + DTO）

## Goal

并行执行 Wave 2：创建 Entity/Domain Models 和 DTOs。

## 前置条件

- Wave 1 数据库迁移成功完成
- 数据库表结构已验证

## Wave 2: Entity + DTO（并行）

子代理 B-02: Entity / Domain Models（并行）
子代理 B-03: DTOs (Create/Update)（并行）

每个子代理接收: 任务 XML + 架构文档段落 + ADR 决策记录

### B-02: Entity / Domain Models

1. 基于 `database.md` 中的表结构创建实体类
2. 标注 JPA/ORM 注解
3. 定义实体间关联关系
4. 添加字段校验注解

### B-03: DTOs (Create/Update)

1. 基于 `api-design.md` 中的端点定义创建 DTO
2. 区分 CreateDTO 和 UpdateDTO
3. 添加请求校验规则
4. 确保与 Entity 字段映射一致

---

**下一步**: `./step-03-wave3.md`
