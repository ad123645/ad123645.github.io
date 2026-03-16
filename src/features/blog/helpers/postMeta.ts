import type { CollectionEntry } from 'astro:content';

export function postPath(post: CollectionEntry<'blog'>) {
  return `/blog/${post.id}`;
}
