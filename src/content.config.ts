import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const status = z.enum(['published', 'draft']).default('published');

const video = z.object({
  /** YouTube, Vimeo or a direct .mp4/.webm URL. */
  url: z.string().min(1),
  title: z.string().optional(),
  /** Optional poster image, useful for self-hosted video. */
  poster: z.string().optional(),
});

const labs = defineCollection({
  loader: glob({ base: './content/labs', pattern: '**/*.{md,mdx}' }),
  schema: z
    .object({
      title: z.string().min(3),
      description: z.string().min(20),
      module: z.string().regex(/^\d{2}$/, 'Usa el número de módulo con dos dígitos, p. ej. "02".'),
      practice: z.number().int().positive().default(1),
      date: z.coerce.date().optional(),
      updated: z.coerce.date().optional(),
      categories: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      tools: z.array(z.string()).default([]),
      cover: z.string().optional(),
      coverAlt: z.string().optional(),
      originalVideo: video.optional(),
      summaryVideo: video.optional(),
      repository: z.string().optional(),
      documentation: z.string().optional(),
      status,
      featured: z.boolean().default(false),
    })
    .refine((data) => !data.cover || Boolean(data.coverAlt), {
      message: 'Si defines cover, añade coverAlt para mantener la accesibilidad.',
      path: ['coverAlt'],
    }),
});

export const collections = { labs };
