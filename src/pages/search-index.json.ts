import type { APIRoute } from 'astro';
import { getLabs, labPath } from '../lib/content';
import { withBase } from '../lib/url';

export const GET: APIRoute = async () => {
  const labs = await getLabs();

  const items = labs
    .map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      url: withBase(labPath(entry)),
      type: 'lab',
      module: entry.data.module,
      categories: entry.data.categories,
      tags: entry.data.tags,
      date: entry.data.date?.toISOString(),
      status: entry.data.status,
    }))
    .sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : 0;
      const bTime = b.date ? new Date(b.date).getTime() : 0;
      return bTime - aTime;
    });

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
