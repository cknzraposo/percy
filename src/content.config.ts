import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    week: z.number(),
    date: z.coerce.date(),
    summary: z.string(),
    ck_post: z.string().url().optional(),
  }),
});

export const collections = { journal };
