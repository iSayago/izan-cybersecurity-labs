import { getCollection, type CollectionEntry } from 'astro:content';
import { getModule, modules, type CourseModule } from '../data/modules';

export type LabEntry = CollectionEntry<'labs'>;
export type PostEntry = CollectionEntry<'blog'>;
export type ResearchEntry = CollectionEntry<'research'>;
export type ContentStatus = LabEntry['data']['status'];

export const statusMeta: Record<
  ContentStatus,
  { label: string; tone: 'published' | 'demo' | 'pending' | 'draft'; description: string }
> = {
  published: {
    label: 'Publicado',
    tone: 'published',
    description: 'Informe revisado y publicado como parte del archivo.',
  },
  demo: {
    label: 'Demostración',
    tone: 'demo',
    description: 'Contenido de ejemplo para mostrar el formato. No describe una práctica realizada.',
  },
  pending: {
    label: 'Pendiente',
    tone: 'pending',
    description: 'Espacio reservado. La documentación todavía no está publicada.',
  },
  draft: {
    label: 'Borrador',
    tone: 'draft',
    description: 'No se publica en el sitio.',
  },
};

const timestamp = (date?: Date) => (date ? date.getTime() : 0);

export function byDateDesc<T extends { data: { date?: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => timestamp(b.data.date) - timestamp(a.data.date));
}

export function byPractice<T extends { data: { practice: number; date?: Date } }>(entries: T[]): T[] {
  return [...entries].sort(
    (a, b) => a.data.practice - b.data.practice || timestamp(b.data.date) - timestamp(a.data.date),
  );
}

/** Drafts never reach the public site. */
export async function getLabs(): Promise<LabEntry[]> {
  const entries = await getCollection('labs', ({ data }) => data.status !== 'draft');
  return byDateDesc(entries);
}

export async function getPosts(): Promise<PostEntry[]> {
  const entries = await getCollection('blog', ({ data }) => data.status !== 'draft');
  return byDateDesc(entries);
}

export async function getResearch(): Promise<ResearchEntry[]> {
  const entries = (await getCollection('research')).filter(({ data }) => data.status !== 'draft');
  return byDateDesc(entries);
}

export function moduleOf(entry: LabEntry): CourseModule {
  const module = getModule(entry.data.module);
  if (!module) {
    throw new Error(
      `El módulo "${entry.data.module}" no existe en src/data/modules.ts (entrada: ${entry.id}).`,
    );
  }
  return module;
}

export function labPath(entry: LabEntry): string {
  return `/labs/${entry.id}/`;
}

export function postPath(entry: PostEntry): string {
  return `/blog/${entry.id}/`;
}

export function researchPath(entry: ResearchEntry): string {
  return `/ai-security/${entry.id}/`;
}

export function labModuleGroups(labs: LabEntry[]): Array<{ module: CourseModule; labs: LabEntry[] }> {
  return modules.map((module) => ({
    module,
    labs: byPractice(labs.filter((entry) => entry.data.module === module.id)),
  }));
}

export function adjacentLabs(entry: LabEntry, labs: LabEntry[]): { previous?: LabEntry; next?: LabEntry } {
  const siblings = byPractice(labs.filter((item) => item.data.module === entry.data.module));
  const index = siblings.findIndex((item) => item.id === entry.id);
  return {
    previous: index > 0 ? siblings[index - 1] : undefined,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined,
  };
}

export function getLatestItems(
  labs: LabEntry[],
  posts: PostEntry[],
  research: ResearchEntry[],
  limit = 4,
) {
  const items = [
    ...labs
      .filter((entry) => entry.data.status !== 'pending')
      .map((entry) => ({
        kind: 'lab' as const,
        title: entry.data.title,
        description: entry.data.description,
        url: labPath(entry),
        date: entry.data.date,
        status: entry.data.status,
        label: `Módulo ${entry.data.module}`,
        category: entry.data.categories[0] ?? 'SOC Lab',
        cover: entry.data.cover,
        entry,
      })),
    ...posts.map((entry) => ({
      kind: 'blog' as const,
      title: entry.data.title,
      description: entry.data.description,
      url: postPath(entry),
      date: entry.data.date,
      status: entry.data.status,
      label: 'Writeup',
      category: entry.data.category,
      cover: entry.data.cover,
      entry,
    })),
    ...research.map((entry) => ({
      kind: 'research' as const,
      title: entry.data.title,
      description: entry.data.description,
      url: researchPath(entry),
      date: entry.data.date,
      status: entry.data.status,
      label: 'AI Security',
      category: entry.data.categories[0] ?? 'Investigación',
      cover: entry.data.cover,
      entry,
    })),
  ];

  return items
    .sort((a, b) => timestamp(b.date) - timestamp(a.date))
    .slice(0, limit);
}

export function countByStatus(labs: LabEntry[]) {
  return {
    published: labs.filter((entry) => entry.data.status === 'published').length,
    demo: labs.filter((entry) => entry.data.status === 'demo').length,
    pending: labs.filter((entry) => entry.data.status === 'pending').length,
    total: labs.length,
  };
}

export function formatDate(date?: Date): string {
  if (!date) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
    .format(date)
    .replace('.', '');
}

export function formatLongDate(date?: Date): string {
  if (!date) return 'Fecha pendiente';
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatMonthYear(date?: Date): string {
  if (!date) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
    .format(date)
    .replace('.', '');
}

export function isoDate(date?: Date): string | undefined {
  return date?.toISOString();
}

export function readingTime(body?: string): number {
  if (!body) return 1;
  const words = body
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_`>|[\]()]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
