# Step 5: Phase A 编译门禁

## Goal

执行后端编译门禁。编译失败必须停止，等待人工介入。**AI 不得自动修复循环**。

## 门禁规则

```
Phase A 编译门禁 = 后端代码编译通过 + 测试通过
编译失败 → 停止，展示错误 → 人工决定下一步
```

## 执行步骤

### 5.1 编译检查

```bash
# 根据项目类型执行对应编译命令
cd {backend_dir}

# Node.js / TypeScript
npm run build
# 或: npx tsc --noEmit

# Java / Spring Boot
mvn compile -q

# Go
go build ./...

# Python
python -m py_compile $(find . -name "*.py")
```

### 5.2 编译结果处理

| 结果 | 处理 |
|------|------|
| **✅ 编译通过** | 更新 STATE.md → 继续前端开发 |
| **❌ 编译失败** | 更新 STATE.md → 停止 → 等待人工介入 |

### 5.3 编译失败标准流程

```
🚨 Phase A 编译失败

编译命令: {命令}
退出码: {code}
错误数量: {N}

=== 完整错误日志 ===
{完整编译错误输出}

=== 错误分析 ===
1. {错误文件:行号} — {错误描述}
   原因: {分析}
   建议修复: {具体建议}

2. ...

=== 禁止事项 ===
❌ AI 不得自动尝试修复编译错误
❌ AI 不得静默重试编译
❌ AI 不得降低编译标准
❌ AI 不得绕过编译直接进入前端阶段

请确认后我将执行修复:
  → "确认" = 按建议修复
  → "N" = 需要调整建议
  → "S" = 保存进度，稍后处理
```

### 5.4 编译通过

```yaml
compilation_gates:
  backend:
    status: "passed"
    timestamp: "{时间}"
    build_command: "{命令}"
    exit_code: 0
```

---

**下一步**: 编译通过 → 阶段完成确认 (step-06)
**编译失败**: 停止，等待人工介入
