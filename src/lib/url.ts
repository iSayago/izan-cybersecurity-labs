const rawBase = import.meta.env.BASE_URL || '/';
export const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

/**
 * Adds Astro's configured base path to an internal URL.
 * External URLs, hashes and protocol-relative URLs are returned untouched.
 */
export function withBase(path = '/'): string {
  if (!path) return base;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;
  if (base !== '/' && path.startsWith(base)) return path;

  const clean = path.replace(/^\/+/, '');
  return `${base}${clean}`;
}

export function absoluteUrl(path = '/'): string {
  const configuredSite = import.meta.env.SITE || 'http://localhost:4321';
  return new URL(withBase(path), configuredSite).toString();
}

export function isCurrentPath(pathname: string, href: string): boolean {
  const target = withBase(href);
  if (target === base || target === `${base}index.html`) return pathname === base;
  return pathname === target || pathname.startsWith(target);
}
