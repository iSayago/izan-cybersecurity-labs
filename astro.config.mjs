import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import rehypeBasePath from './src/lib/rehype-base-path.mjs';

/**
 * GitHub Pages compatibility.
 *
 * - `GITHUB_REPOSITORY` is provided automatically by GitHub Actions.
 * - A repository named `<owner>.github.io` is served from the domain root.
 * - Any other repository is served from `/<repository>/`.
 *
 * Override both values with the `SITE_URL` and `BASE_PATH` repository
 * variables (Settings → Secrets and variables → Actions → Variables) when
 * using a custom domain.
 */
const normalizeBase = (value) => {
  if (!value || value === '/') return '/';
  return `/${String(value).replace(/^\/+|\/+$/g, '')}/`;
};

const repository = process.env.GITHUB_REPOSITORY ?? '';
const [owner = '', repo = ''] = repository.split('/');
const runningInActions = process.env.GITHUB_ACTIONS === 'true';
const isUserSite =
  Boolean(owner && repo) && repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;

const autoBase = runningInActions
  ? isUserSite
    ? '/'
    : repo
      ? `/${repo}/`
      : '/'
  : '/';

const base = normalizeBase(process.env.BASE_PATH || autoBase);
const site =
  process.env.SITE_URL ||
  (runningInActions && owner ? `https://${owner}.github.io` : 'http://localhost:4321');

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [
    mdx(),
    sitemap({
      // Demo and template content is intentionally excluded from search engines and the sitemap.
      filter: (page) => !page.includes('/demo-') && !page.includes('/plantilla-'),
    }),
  ],
  markdown: {
    processor: unified({
      rehypePlugins: [[rehypeBasePath, { base }]],
      syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
      shikiConfig: {
        theme: 'vesper',
        wrap: true,
      },
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
