# 这很调和 · Astro + GitHub Pages Starter

一个为「这很调和」准备的可长期维护博客骨架，包含：

- Astro + TypeScript
- GitHub Pages 部署工作流
- 内容集合（blog / pages / games）
- 统一视觉基础样式
- 双入口首页
- 基础博客列表与详情页
- About / Games / Archive / Tags
- 一个可移动的 RPG 首页原型（WASD 移动，E 交互，含大厅 / 图书馆 / 游戏室）

## 1. 解压后先做什么

在终端进入项目目录后，执行：

```bash
npm install
npm run dev
```

然后打开终端里显示的本地地址。

## 2. 在 GitHub Pages 发布前要改的两个地方

打开 `astro.config.mjs`，你有两种选择：

### 方案 A：用 GitHub Pages 默认域名

```bash
SITE_URL=https://ad123645.github.io
REPO_NAME=ad123645.github.io
```

最简单的做法是直接在 GitHub Actions 里配置仓库变量，或者先把它们写死到 `astro.config.mjs` 里。

例如：

```js
const siteUrl = 'https://ad123645.github.io';
const repoName = 'ad123645.github.io';
```

### 方案 B：未来换自定义域名

把 `siteUrl` 改成你的正式域名，例如：

```js
const siteUrl = 'https://example.com';
```

此时不需要 `base`，保留当前配置即可自动跳过。


## 2.1 这份包已经替你填好的配置

你的 GitHub 用户名和仓库名已经写进 `astro.config.mjs`：

```js
const siteUrl = 'https://ad123645.github.io';
const repoName = 'ad123645.github.io';
```

因为这是 **用户站点仓库**，仓库名就是 `ad123645.github.io`，所以 Astro 不需要额外设置 `base`。

## 3. 推到 GitHub 后要做的事

1. 新建 GitHub 仓库
2. 推送代码
3. 打开仓库的 **Settings → Pages**
4. 把 **Source** 设为 **GitHub Actions**

## 4. 内容文件放哪里

- 博客文章：`src/content/blog/`
- 单页内容：`src/content/pages/`
- 游戏说明：`src/content/games/`

## 5. 为什么这个骨架里有 React

RPG 首页用了一个 React 岛组件来承载 Canvas 交互。

## 6. 你接下来最适合做的事

- 先把 `astro.config.mjs` 的站点地址改掉
- 跑 `npm install && npm run dev`
- 先确认博客、about、games、rpg 四块都正常显示
- 然后再继续精修 RPG 美术风格、场景布局、组件细节

## 7. 目录结构

```text
.
├─ public/
├─ src/
│  ├─ content/
│  ├─ data/
│  ├─ types/
│  ├─ utils/
│  ├─ styles/
│  ├─ layouts/
│  ├─ components/
│  ├─ features/
│  └─ pages/
├─ .github/workflows/deploy.yml
├─ astro.config.mjs
├─ package.json
└─ tsconfig.json
```
