# Step 3: 打版本标签

## Goal

在 main 分支创建不可变版本标签。

## Instructions

### 3.1 创建标签

```bash
git checkout main
git tag -a v{version} -m "Release v{version}

{release summary}"
```

### 3.2 推送标签

```bash
git push origin v{version}
```

### 3.3 确认

```bash
git tag -l "v*"
```

---

**下一步**: ./step-04-notes.md（生成发布说明）
