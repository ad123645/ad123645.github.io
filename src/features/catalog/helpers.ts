import type { CollectionEntry } from 'astro:content';
import {
  catalogRoots,
  getCatalogNodeByCode,
  getCatalogPath,
  getDescendantCatalogCodes,
  getTopLevelCatalogCode,
  type CatalogNode,
} from '@/data/catalog/clc';

export function getCatalogCountMap(posts: CollectionEntry<'blog'>[]) {
  const counts = new Map<string, number>();

  for (const post of posts) {
    const code = post.data.catalogCode;
    if (!code) continue;

    for (const node of getCatalogPath(code)) {
      counts.set(node.code, (counts.get(node.code) ?? 0) + 1);
    }
  }

  return counts;
}

export function getPostsByCatalogCode(
  posts: CollectionEntry<'blog'>[],
  code: string,
  options: { includeDescendants?: boolean } = {}
) {
  const includeDescendants = options.includeDescendants ?? true;
  const allowedCodes = includeDescendants
    ? new Set(getDescendantCatalogCodes(code))
    : new Set([code]);

  return posts.filter((post) => {
    const postCode = post.data.catalogCode;
    return postCode ? allowedCodes.has(postCode) : false;
  });
}

export function getCatalogSummary(posts: CollectionEntry<'blog'>[]) {
  const counts = getCatalogCountMap(posts);

  return catalogRoots.map((node) => ({
    ...node,
    count: counts.get(node.code) ?? 0,
    activeChildren: (node.children ?? []).filter((child) => (counts.get(child.code) ?? 0) > 0),
  }));
}

export function getCatalogNodeSummary(node: CatalogNode, posts: CollectionEntry<'blog'>[]) {
  const counts = getCatalogCountMap(posts);
  return {
    ...node,
    count: counts.get(node.code) ?? 0,
    childrenWithCount: (node.children ?? []).map((child) => ({
      ...child,
      count: counts.get(child.code) ?? 0,
    })),
  };
}

export function getPostCatalogPath(post: CollectionEntry<'blog'>) {
  return getCatalogPath(post.data.catalogCode);
}

export function getTopLevelCatalogNodesFromPosts(posts: CollectionEntry<'blog'>[]) {
  const counts = getCatalogCountMap(posts);

  return catalogRoots
    .map((node) => ({
      ...node,
      count: counts.get(node.code) ?? 0,
    }))
    .filter((node) => node.count > 0)
    .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code, 'zh-CN'));
}

export function getSiblingCatalogNodes(code?: string | null) {
  const node = getCatalogNodeByCode(code);
  if (!node?.parentCode) return [];

  const top = catalogRoots.find((item) => item.code === node.parentCode);
  return top?.children ?? [];
}

export function getTopLevelCatalogCodeOfPost(post: CollectionEntry<'blog'>) {
  return getTopLevelCatalogCode(post.data.catalogCode);
}

export function getCatalogWorkbenchSections(posts: CollectionEntry<'blog'>[]) {
  const counts = getCatalogCountMap(posts);

  return catalogRoots
    .map((root) => ({
      ...root,
      count: counts.get(root.code) ?? 0,
      childCount: root.children?.length ?? 0,
      activeChildCount: (root.children ?? []).filter((child) => (counts.get(child.code) ?? 0) > 0).length,
      childrenWithCount: (root.children ?? []).map((child) => ({
        ...child,
        count: counts.get(child.code) ?? 0,
      })),
    }))
    .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code, 'zh-CN'));
}
