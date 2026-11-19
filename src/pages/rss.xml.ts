import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getLabs, labPath } from '../lib/content';
import { site } from '../data/site';
import { withBase } from '../lib/url';

export async function GET(context: APIContext) {
  const labs = await getLabs();

  const items = labs
    .map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date ?? new Date(),
      link: withBase(labPath(entry)),
      categories: ['SOC Lab', ...entry.data.categories],
    }))
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: `${site.name} — Cybersecurity Labs`,
    description: site.description,
    site: new URL(withBase('/'), context.site ?? 'http://localhost:4321').toString(),
    items,
    customData: '<language>es</language>',
  });
}
