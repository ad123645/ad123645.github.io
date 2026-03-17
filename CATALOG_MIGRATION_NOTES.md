# CATALOG_MIGRATION_NOTES

这次补丁继续把博客里的中图分类树往“全量、可维护、可校验”的方向推进。

## 本轮重点

- 目录树继续保留到最外层叶子结点
- 生成目录保持“一级大类 -> 分段 `.ts` 文件 -> `index.ts` 总装”的结构
- `CatalogNode` 新增 `marker` 与 `isRange` 推断，便于后续在前台区分正常类、交替类、停用类、范围类
- `check-content.mjs` 新增 `catalogCode` 真值校验，文章挂错类号时会直接报错
- 新增 `scripts/verify-catalog.mjs`，可检查重复类号、缺失父节点、父子关系不一致
- 新增 `src/data/catalog/generated/stats.ts` 记录目录规模统计

## 当前目录规模

- 总类号数：45785
- 叶子类目数：37105
- 交替类号：1110
- 停用类号：260
- 范围类号：151

## 说明

运行环境里自带的 `node_modules` 来自原始压缩包，含 Windows 侧依赖痕迹；因此本补丁包仍然建议你在本地解压后重新 `npm install`，再执行：

```bash
npm run verify:catalog
npm run check:content
npm run build
```
