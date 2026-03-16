import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    catalogCode: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/pages',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
  }),
});

const games = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/games',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['idea', 'prototype', 'published']).default('prototype'),
    publishedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  blog,
  pages,
  games,
};
