/**
 * Prefixes root-relative URLs found in Markdown/MDX with Astro's `base`.
 *
 * This keeps images, attachments and internal links working when the site is
 * published under a project path such as https://user.github.io/repository/.
 * External URLs, hashes, mailto links and URLs that already include the base
 * are left untouched.
 */
export default function rehypeBasePath({ base = '/' } = {}) {
  const normalized = base === '/' ? '' : `/${String(base).replace(/^\/+|\/+$/g, '')}`;

  const prefix = (value) => {
    if (typeof value !== 'string' || !normalized) return value;
    if (!value.startsWith('/') || value.startsWith('//')) return value;
    if (value === normalized || value.startsWith(`${normalized}/`)) return value;
    return value === '/' ? `${normalized}/` : `${normalized}${value}`;
  };

  const walk = (node) => {
    if (!node || typeof node !== 'object') return;

    if (node.type === 'element' && node.properties) {
      for (const key of ['href', 'src', 'poster']) {
        if (typeof node.properties[key] === 'string') {
          node.properties[key] = prefix(node.properties[key]);
        }
      }

      if (typeof node.properties.srcSet === 'string') {
        node.properties.srcSet = node.properties.srcSet
          .split(',')
          .map((candidate) => {
            const [url, ...descriptor] = candidate.trim().split(/\s+/);
            return [prefix(url), ...descriptor].join(' ');
          })
          .join(', ');
      }
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) walk(child);
    }
  };

  return (tree) => walk(tree);
}
