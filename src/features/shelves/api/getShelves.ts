import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { getCatalogNodeByCode } from '@/data/catalog/clc';
import { withBase } from '@/utils/paths';

export type ShelfEntry = CollectionEntry<'shelves'>;
export type ShelfItemType = ShelfEntry['data']['featuredItems'][number]['type'];

export interface ResolvedShelfItem {
  type: ShelfItemType;
  id: string;
  label?: string;
  title: string;
  description: string;
  href: string;
  meta: string;
}

export async function getPublishedShelves() {
  const shelves = await getCollection('shelves', ({ data }) => !data.draft);
  return shelves.sort((a, b) => a.data.shelfCode.localeCompare(b.data.shelfCode, 'zh-CN'));
}

export async function resolveShelfItems(shelf: ShelfEntry): Promise<ResolvedShelfItem[]> {
  const items = await Promise.all(shelf.data.featuredItems.map(async (item) => {
    if (item.type === 'post') {
      const entry = await getEntry('blog', item.id);
      if (!entry) return null;
      return {
        type: item.type,
        id: item.id,
        label: item.label,
        title: entry.data.title,
        description: entry.data.description,
        href: withBase(`/blog/${entry.id}`),
        meta: entry.data.catalogCode ? `文章 · ${entry.data.catalogCode}` : '文章',
      };
    }

    if (item.type === 'page') {
      const entry = await getEntry('pages', item.id);
      if (!entry) return null;
      return {
        type: item.type,
        id: item.id,
        label: item.label,
        title: entry.data.title,
        description: entry.data.description || '单页内容',
        href: withBase(`/${entry.id === 'about' ? 'about' : entry.id}`),
        meta: '页面',
      };
    }

    if (item.type === 'game') {
      const entry = await getEntry('games', item.id);
      if (!entry) return null;
      return {
        type: item.type,
        id: item.id,
        label: item.label,
        title: entry.data.title,
        description: entry.data.description,
        href: withBase('/games'),
        meta: '游戏条目',
      };
    }

    const node = getCatalogNodeByCode(item.id);
    if (!node) return null;
    return {
      type: item.type,
      id: item.id,
      label: item.label,
      title: `${node.code} · ${node.name}`,
      description: node.level === 1 ? '一级馆藏分类' : `二级馆藏分类 · ${node.parentCode}`,
      href: withBase(`/catalog/${node.slug}`),
      meta: '馆藏目录',
    };
  }));

  return items.filter(Boolean) as ResolvedShelfItem[];
}

export async function getShelvesContainingPost(postId: string) {
  const shelves = await getPublishedShelves();
  return shelves.filter((shelf) => shelf.data.featuredItems.some((item) => item.type === 'post' && item.id === postId));
}
