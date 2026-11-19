import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const status = z.enum(['published', 'demo', 'pending', 'draft']).default('published');

const video = z.object({
  /** YouTube, Vimeo or a direct .mp4/.webm URL. */
  url: z.string().min(1),
  title: z.string().optional(),
  /** Optional poster image, useful for self-hosted video. */
  poster: z.string().optional(),
});

const baseFields = {
  title: z.string().min(3),
  description: z.string().min(20),
  date: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  status,
  featured: z.boolean().default(false),
};

const labs = defineCollection({
  loader: glob({ base: './content/labs', pattern: '**/*.{md,mdx}' }),
  schema: z
    .object({
      ...baseFields,
      module: z.string().regex(/^\d{2}$/, 'Usa el número de módulo con dos dígitos, p. ej. "02".'),
      practice: z.number().int().positive().default(1),
      tools: z.array(z.string()).default([]),
      originalVideo: video.optional(),
      summaryVideo: video.optional(),
      repository: z.string().optional(),
      documentation: z.string().optional(),
    })
    .refine((data) => !data.cover || Boolean(data.coverAlt), {
      message: 'Si defines cover, añade coverAlt para mantener la accesibilidad.',
      path: ['coverAlt'],
    }),
});

const blog = defineCollection({
  loader: glob({ base: './content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z
    .object({
      ...baseFields,
      category: z.string(),
      readingLevel: z.enum(['intro', 'intermedio', 'avanzado']).optional(),
    })
    .refine((data) => !data.cover || Boolean(data.coverAlt), {
      message: 'Si defines cover, añade coverAlt para mantener la accesibilidad.',
      path: ['coverAlt'],
    }),
});

const research = defineCollection({
  loader: glob({ base: './content/ai-security', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    ...baseFields,
    type: z.enum(['nota', 'experimento', 'paper']).default('nota'),
  }),
});

export const collections = { labs, blog, research };
