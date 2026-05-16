# Step 1.5: 交叉连接验证（Cross-Phase Wiring Check）

## Goal

在开始功能测试之前，验证前后端代码之间的连接是否真实存在。**存在 ≠ 连接**。

## 对抗性立场

```
假设立场: 前后端之间的每条连接都是断开的，直到 grep 证明存在
不要因为: "API 路由存在" 就假设 "前端在使用它"
不要因为: "组件导入了 hook" 就假设 "hook 被正确调用"
```

## 执行步骤

### 1.5.1 构建 API → 消费者映射

从后端代码中提取所有 API 端点，检查前端代码中是否有调用者。

```bash
# 查找所有 API 路由
grep -r "@GetMapping\|@PostMapping\|@PutMapping\|@DeleteMapping\|app\.get\|app\.post\|router\.get\|router\.post" {backend_dir} 2>/dev/null

# 查找前端 API 调用
grep -r "fetch\|axios\|useQuery\|useSWR\|useFetch" {frontend_dir} 2>/dev/null
```

### 1.5.2 检查结果

| 状态 | 含义 |
|------|------|
| **WIRED** | API 端点存在且前端有调用者，链接完整 |
| **ORPHANED** | API 端点存在但前端无调用者 |
| **MISSING** | 前端调用了不存在的 API 端点 |
| **PARTIAL** | 有调用但某个状态（error/loading）未处理 |

### 1.5.3 交叉连接报告

```markdown
## 交叉连接验证报告

### WIRED（已连接）
| API | 调用位置 | 状态处理 |
|-----|---------|---------|
| GET /api/users | UserList.tsx:42 | loading ✅ error ✅ empty ✅ |

### ORPHANED（孤立端点）
| API | 位置 | 风险 |
|-----|------|------|
| POST /api/admin/reports | AdminController.java | 无人调用，可能是死代码 |

### MISSING（缺失端点）
| 前端调用 | 位置 | 风险 |
|---------|------|------|
| /api/notifications | Header.tsx:15 | 后端未实现此端点 |

### 不合格判定
- [ ] 存在 ORPHANED 端点 → **BLOCKER**: 需确认是死代码还是遗漏
- [ ] 存在 MISSING 端点 → **BLOCKER**: 需实现或移除此调用
- [ ] 所有端点状态 = WIRED → **PASS**
```

### 1.5.4 结果处理

| 结果 | 处理 |
|------|------|
| **全部 WIRED** | 继续编译复检 (step-02) |
| **存在 ORPHANED/MISSING** | 上报问题 → 等待确认 → 修复后才能继续测试 |

---

**通过后**: ./step-02-execute.md（但必须先编译复检）
