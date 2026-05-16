# Step 4: 数据库表设计

## Goal

设计数据库表结构，包括实体、关系、索引。

## Mandatory Execution Rules

1. 分析数据实体
2. 设计表结构
3. 设计索引和关系
4. 生成数据库文档
5. 更新 STATE.md

## Instructions

### 4.1 分析数据实体

根据功能需求识别数据实体:
- 核心业务实体
- 关联实体
- 配置实体

列出实体及其属性。

### 4.2 设计表结构

对每个实体设计表:

```sql
CREATE TABLE [表名] (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    [字段列表]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

设计要点:
- 主键设计
- 字段类型选择
- 默认值设置
- 时间戳字段

### 4.3 设计索引

为查询需求设计索引:
- 主键索引
- 外键索引
- 业务查询索引

### 4.4 设计关系

设计表间关系:
- 一对一关系
- 一对多关系
- 多对多关系 (中间表)

### 4.5 生成数据库文档

使用模板生成 docs/sdd/{FEATURE_NAME}/database.md。

---

**下一步**: ./step-05-complete.md