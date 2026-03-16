import { getCollection, type CollectionEntry } from 'astro:content';

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
