import type { APIRoute } from 'astro';
import { withBase } from '../lib/url';

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('http://localhost:4321');
  const sitemap = new URL(withBase('/sitemap-index.xml'), base).toString();

  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /labs/*/demo-',
    'Disallow: /labs/*/plantilla-',
    'Disallow: /blog/demo-',
    '',
    `Sitemap: ${sitemap}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
