# 管理台分类索引同步

这份博客工程已经加入管理台专用的分类索引构建脚本。

## 用法

在博客根目录运行：

```bash
npm run sync:admin-catalog
```

脚本会把当前 `src/data/catalog/generated/` 下的中图分类树整理成：

- `.zhehen-admin/catalog-index.json`

管理台 `zhehen-tiaohe-admin v0.4.0` 会优先读取这份 JSON。
如果没有这份文件，管理台会退回为直接扫描 `generated/*.ts`。

## 为什么这样做

几万个类号不适合在管理台里直接解析并平铺成按钮列表。
预生成索引可以让管理台：

- 更快载入分类树
- 更稳定地做层级浏览
- 支持类号 / 类名搜索直达
- 给文章编辑器提供完整路径与状态信息

## 更新时机

每次你扩充或修正中图分类树之后，重新跑一次：

```bash
npm run sync:admin-catalog
```

就可以把最新分类同步给管理台。
