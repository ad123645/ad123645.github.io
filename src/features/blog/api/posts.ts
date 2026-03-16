import { getCollection, type CollectionEntry } from 'astro:content';
import { getTopLevelCatalogCode } from '@/data/catalog/clc';

export async function getPublishedPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );
}

export async function getPostTags() {
  const posts = await getPublishedPosts();
  return [...new Set(posts.flatMap((post) => post.data.tags))].sort();
}

export function getPostsByTag(posts: CollectionEntry<'blog'>[], tag: string) {
  return posts.filter((post) => post.data.tags.includes(tag));
}

export function getRelatedPosts(
  posts: CollectionEntry<'blog'>[],
  current: CollectionEntry<'blog'>,
  limit = 3
) {
  const currentCode = current.data.catalogCode;
  const currentTopCode = getTopLevelCatalogCode(currentCode);

  const exactMatches = posts.filter(
    (post) => post.id !== current.id && currentCode && post.data.catalogCode === currentCode
  );

  const topMatches = posts.filter((post) => {
    if (post.id === current.id) return false;
    if (!currentTopCode) return false;
    const postTopCode = getTopLevelCatalogCode(post.data.catalogCode);
    return postTopCode === currentTopCode && post.data.catalogCode !== currentCode;
  });

  return [...exactMatches, ...topMatches].slice(0, limit);
}

export function getPostsGroupedByTopCatalog(posts: CollectionEntry<'blog'>[]) {
  const groups = new Map<string, CollectionEntry<'blog'>[]>();

  for (const post of posts) {
    const topCode = getTopLevelCatalogCode(post.data.catalogCode) ?? '未入架';
    const bucket = groups.get(topCode) ?? [];
    bucket.push(post);
    groups.set(topCode, bucket);
  }

  return groups;
}
