import { getCollection, type CollectionEntry } from 'astro:content';
import { catalogRoots, type CatalogNode } from '@/data/catalog/clc';
import { withBase } from '@/utils/paths';

export type SearchItemType = 'post' | 'catalog' | 'tag' | 'page' | 'game' | 'shelf';

export interface SearchItem {
  type: SearchItemType;
  title: string;
  meta: string;
  group: string;
  href: string;
  keywords: string;
  body?: string;
}

function flattenCatalog(nodes: CatalogNode[]): CatalogNode[] {
  return nodes.flatMap((node) => [node, ...(node.children ? flattenCatalog(node.children) : [])]);
}

function compactText(value?: string) {
  return (value || '').replace(/\s+/g, ' ').trim();
}

function extractPostBody(post: CollectionEntry<'blog'>) {
  return compactText(post.body)
    .replace(/^---[\s\S]*?---/, '')
    .slice(0, 8000);
}

export async function buildSearchIndex() {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );
  const pages = await getCollection('pages');
  const games = await getCollection('games');
  const shelves = await getCollection('shelves', ({ data }) => !data.draft);
  const tags = [...new Set(posts.flatMap((post) => post.data.tags))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
  const catalogNodes = flattenCatalog(catalogRoots);

  const searchItems: SearchItem[] = [
    ...posts.map((post) => ({
      type: 'post' as const,
      title: post.data.title,
      meta: post.data.description,
      group: '文章',
      href: withBase(`/blog/${post.id}`),
      keywords: [post.data.description, ...(post.data.tags ?? []), post.data.catalogCode ?? '', post.data.title].join(' '),
      body: extractPostBody(post),
    })),
    ...catalogNodes.map((node) => ({
      type: 'catalog' as const,
      title: `${node.code} · ${node.name}`,
      meta: node.level === 1 ? '一级馆藏分类' : `二级馆藏分类 · ${node.parentCode}`,
      group: '馆藏',
      href: withBase(`/catalog/${node.slug}`),
      keywords: [node.code, node.name, node.parentCode ?? '', node.level === 1 ? '一级 分类' : '二级 子目录'].join(' '),
    })),
    ...tags.map((tag) => ({
      type: 'tag' as const,
      title: `# ${tag}`,
      meta: '标签页',
      group: '标签',
      href: withBase(`/tags/${encodeURIComponent(tag)}`),
      keywords: tag,
    })),
    ...pages.map((page) => ({
      type: 'page' as const,
      title: page.data.title,
      meta: page.data.description || '单页内容',
      group: '页面',
      href: withBase(`/${page.id === 'about' ? 'about' : page.id}`),
      keywords: [page.data.title, page.data.description || '', compactText(page.body)].join(' '),
    })),
    ...games.map((game) => ({
      type: 'game' as const,
      title: game.data.title,
      meta: game.data.description,
      group: '游戏',
      href: withBase('/games'),
      keywords: [game.data.description, ...(game.data.tags ?? []), compactText(game.body)].join(' '),
    })),
    ...shelves.map((shelf) => ({
      type: 'shelf' as const,
      title: shelf.data.title,
      meta: `${shelf.data.shelfCode} · ${shelf.data.description}`,
      group: '书架',
      href: withBase(`/shelves/${shelf.id}`),
      keywords: [shelf.data.shelfCode, shelf.data.description, shelf.data.tone || '', ...shelf.data.featuredItems.map((item) => `${item.type} ${item.id}`)].join(' '),
      body: compactText(shelf.body),
    })),
  ];

  return {
    posts,
    catalogNodes,
    shelves,
    searchItems,
  };
}
