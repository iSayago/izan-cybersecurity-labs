import { getCollection, type CollectionEntry } from 'astro:content';
import { getModule, modules, type CourseModule } from '../data/modules';

export type LabEntry = CollectionEntry<'labs'>;
export type ContentStatus = LabEntry['data']['status'];

export const statusMeta: Record<
  ContentStatus,
  { label: string; tone: 'published' | 'draft'; description: string }
> = {
  published: {
    label: 'Publicado',
    tone: 'published',
    description: 'Informe revisado y publicado como parte del archivo.',
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

export function getLatestLabs(labs: LabEntry[], limit = 4): LabEntry[] {
  return byDateDesc(labs).slice(0, limit);
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

export function countByStatus(labs: LabEntry[]) {
  return {
    published: labs.filter((entry) => entry.data.status === 'published').length,
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
