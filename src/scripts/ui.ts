/* Client-side behaviour shared by the whole site. */

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const requestFrame = (callback: () => void) => {
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(callback);
  else callback();
};

/* --------------------------------------------------------------------------
   Dialog scroll lock
   -------------------------------------------------------------------------- */

const syncScrollLock = () => {
  document.body.classList.toggle('dialog-open', Boolean(document.querySelector('dialog[open]')));
};

const setExpanded = (selector: string, value: boolean) => {
  document.querySelectorAll<HTMLElement>(selector).forEach((button) => {
    button.setAttribute('aria-expanded', String(value));
  });
};

/* --------------------------------------------------------------------------
   Mobile menu
   -------------------------------------------------------------------------- */

const menu = document.querySelector<HTMLDialogElement>('#mobile-menu');
const menuOpeners = document.querySelectorAll<HTMLElement>('[data-menu-open]');
const menuClosers = document.querySelectorAll<HTMLElement>('[data-menu-close]');

if (menu) {
  menuOpeners.forEach((button) => {
    button.addEventListener('click', () => {
      if (!menu.open) menu.showModal();
      setExpanded('[data-menu-open]', true);
      syncScrollLock();
      requestFrame(() => menu.querySelector<HTMLElement>('[data-menu-close]')?.focus());
    });
  });

  menuClosers.forEach((button) => button.addEventListener('click', () => menu.close()));

  menu.querySelectorAll<HTMLElement>('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', () => menu.close());
  });

  menu.addEventListener('click', (event) => {
    if (event.target === menu) menu.close();
  });

  menu.addEventListener('close', () => {
    setExpanded('[data-menu-open]', false);
    syncScrollLock();
  });
}

/* --------------------------------------------------------------------------
   Search
   -------------------------------------------------------------------------- */

interface SearchItem {
  title: string;
  description: string;
  url: string;
  type: string;
  module?: string;
  categories: string[];
  tags: string[];
  date?: string;
  status: string;
}

const searchDialog = document.querySelector<HTMLDialogElement>('#search-dialog');
const searchInput = document.querySelector<HTMLInputElement>('#search-input');
const searchResults = document.querySelector<HTMLElement>('#search-results');
const searchCount = document.querySelector<HTMLElement>('[data-search-count]');
const searchOpeners = document.querySelectorAll<HTMLElement>('[data-search-open]');
const searchClosers = document.querySelectorAll<HTMLElement>('[data-search-close]');

let searchItems: SearchItem[] | null = null;
let searchLoading = false;
let searchError = false;
let activeResult = -1;

const shortcut = document.querySelector<HTMLElement>('[data-search-shortcut]');
if (shortcut) shortcut.textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K';

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const appendHighlighted = (container: HTMLElement, text: string, terms: string[]) => {
  if (terms.length === 0) {
    container.textContent = text;
    return;
  }

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  const parts = text.split(pattern);

  parts.forEach((part, index) => {
    if (!part) return;
    if (index % 2 === 1) {
      const mark = document.createElement('mark');
      mark.textContent = part;
      container.appendChild(mark);
    } else {
      container.appendChild(document.createTextNode(part));
    }
  });
};

const getSearchScore = (item: SearchItem, terms: string[]) => {
  const title = normalize(item.title);
  const tags = normalize([...item.categories, ...item.tags].join(' '));
  const description = normalize(item.description);
  const haystack = `${title} ${tags} ${description} ${normalize(item.type)} ${normalize(item.module ?? '')}`;

  if (!terms.every((term) => haystack.includes(term))) return -1;

  let score = 0;
  terms.forEach((term) => {
    if (title.includes(term)) score += 6;
    if (title.startsWith(term)) score += 4;
    if (tags.includes(term)) score += 3;
    if (description.includes(term)) score += 1;
  });
  return score;
};

const setActiveResult = (index: number) => {
  if (!searchResults) return;
  const results = Array.from(searchResults.querySelectorAll<HTMLAnchorElement>('.search-result'));
  if (results.length === 0) return;

  activeResult = Math.max(0, Math.min(index, results.length - 1));
  results.forEach((result, resultIndex) => {
    const isActive = resultIndex === activeResult;
    result.classList.toggle('is-active', isActive);
    result.setAttribute('aria-selected', isActive ? 'true' : 'false');
    if (isActive) {
      searchInput?.setAttribute('aria-activedescendant', result.id);
      result.scrollIntoView({ block: 'nearest' });
    }
  });
};

const renderSearchResults = () => {
  if (!searchResults || !searchInput) return;

  const query = searchInput.value.trim();
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  searchResults.replaceChildren();

  if (searchLoading) {
    searchResults.innerHTML = '<p class="search-empty">Cargando archivo…</p>';
    if (searchCount) searchCount.textContent = 'Cargando';
    return;
  }

  if (searchError || !searchItems) {
    searchResults.innerHTML =
      '<p class="search-empty">No se pudo cargar el índice. Recarga la página e inténtalo de nuevo.</p>';
    if (searchCount) searchCount.textContent = 'Error';
    return;
  }

  const ranked = searchItems
    .map((item) => ({ item, score: getSearchScore(item, terms) }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((entry) => entry.item);

  if (ranked.length === 0) {
    searchResults.innerHTML =
      '<p class="search-empty">Sin resultados. Prueba con un módulo, una herramienta o una etiqueta.</p>';
    if (searchCount) searchCount.textContent = '0 resultados';
    activeResult = -1;
    return;
  }

  ranked.forEach((item, index) => {
    const link = document.createElement('a');
    link.className = 'search-result';
    link.href = item.url;
    link.id = `search-result-${index}`;
    link.setAttribute('role', 'option');
    link.setAttribute('aria-selected', 'false');
    link.tabIndex = -1;

    const type = document.createElement('span');
    type.className = 'search-result-type';
    type.textContent = item.type === 'lab' ? `Lab · ${item.module ?? 'SOC'}` : item.type;
    link.appendChild(type);

    const status = document.createElement('span');
    status.className = 'micro-label';
    status.textContent = item.status === 'published' ? 'PUBLICADO' : 'EN REVISIÓN';
    link.appendChild(status);

    const title = document.createElement('span');
    title.className = 'search-result-title';
    appendHighlighted(title, item.title, terms);
    link.appendChild(title);

    const description = document.createElement('span');
    description.className = 'search-result-desc';
    appendHighlighted(description, item.description, terms);
    link.appendChild(description);

    link.addEventListener('mouseenter', () => setActiveResult(index));
    searchResults.appendChild(link);
  });

  activeResult = -1;
  if (searchCount) {
    searchCount.textContent = `${ranked.length} ${ranked.length === 1 ? 'resultado' : 'resultados'}`;
  }
};

const loadSearchIndex = async () => {
  if (searchItems || searchLoading || !searchDialog) return;
  searchLoading = true;
  renderSearchResults();

  try {
    const response = await fetch(searchDialog.dataset.indexUrl ?? '/search-index.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    searchItems = (await response.json()) as SearchItem[];
    searchError = false;
  } catch {
    searchError = true;
  } finally {
    searchLoading = false;
    renderSearchResults();
  }
};

const openSearch = () => {
  if (!searchDialog) return;
  if (!searchDialog.open) searchDialog.showModal();
  setExpanded('[data-search-open]', true);
  syncScrollLock();
  loadSearchIndex();
  requestFrame(() => searchInput?.focus());
};

const closeSearch = () => {
  if (searchDialog?.open) searchDialog.close();
  syncScrollLock();
};

searchOpeners.forEach((button) => button.addEventListener('click', openSearch));
searchClosers.forEach((button) => button.addEventListener('click', closeSearch));

if (searchDialog) {
  searchDialog.addEventListener('click', (event) => {
    if (event.target === searchDialog) closeSearch();
  });
  searchDialog.addEventListener('close', () => {
    setExpanded('[data-search-open]', false);
    syncScrollLock();
    setActiveResult(-1);
  });
}

searchInput?.addEventListener('input', () => {
  activeResult = -1;
  renderSearchResults();
});

searchInput?.addEventListener('keydown', (event) => {
  if (!searchResults) return;
  const resultCount = searchResults.querySelectorAll('.search-result').length;

  if (event.key === 'ArrowDown' && resultCount > 0) {
    event.preventDefault();
    setActiveResult(activeResult + 1);
  } else if (event.key === 'ArrowUp' && resultCount > 0) {
    event.preventDefault();
    setActiveResult(activeResult <= 0 ? resultCount - 1 : activeResult - 1);
  } else if (event.key === 'Enter' && activeResult >= 0) {
    event.preventDefault();
    searchResults.querySelector<HTMLAnchorElement>(`#search-result-${activeResult}`)?.click();
  }
});

/* Keyboard shortcuts: Ctrl/Cmd+K and "/" */
document.addEventListener('keydown', (event) => {
  const target = event.target as HTMLElement | null;
  const isTyping =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target?.isContentEditable;

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (searchDialog?.open) closeSearch();
    else openSearch();
    return;
  }

  if (event.key === '/' && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    openSearch();
  }
});

/* --------------------------------------------------------------------------
   Reading progress
   -------------------------------------------------------------------------- */

const progressBar = document.querySelector<HTMLElement>('[data-reading-progress]');
if (progressBar) {
  let progressFrame = 0;
  const updateProgress = () => {
    progressFrame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progressBar.style.transform = `scaleX(${value})`;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
    },
    { passive: true },
  );
  updateProgress();
}

/* --------------------------------------------------------------------------
   Table of contents scrollspy
   -------------------------------------------------------------------------- */

const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.toc-link'));
if (tocLinks.length > 0) {
  const headings = tocLinks
    .map((link) => {
      const id = decodeURIComponent(link.hash.replace(/^#/, ''));
      return document.getElementById(id);
    })
    .filter((heading): heading is HTMLElement => Boolean(heading));

  let tocFrame = 0;
  const updateToc = () => {
    tocFrame = 0;
    let current = headings[0];
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top <= 130) current = heading;
    }
    tocLinks.forEach((link) => {
      const active = current ? link.hash === `#${current.id}` : false;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!tocFrame) tocFrame = requestAnimationFrame(updateToc);
    },
    { passive: true },
  );
  window.addEventListener('resize', updateToc, { passive: true });
  updateToc();
}

/* --------------------------------------------------------------------------
   Inline enhancements for long-form content
   -------------------------------------------------------------------------- */

const codeLanguageLabel = (pre: HTMLPreElement) => {
  const language = pre.dataset.language;
  if (!language) return 'Código';
  const aliases: Record<string, string> = {
    plaintext: 'Texto',
    text: 'Texto',
    js: 'JavaScript',
    ts: 'TypeScript',
    bash: 'Shell',
    powershell: 'PowerShell',
    ps1: 'PowerShell',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    spl: 'SPL',
    kql: 'KQL',
    sql: 'SQL',
  };
  return aliases[language] ?? language.toUpperCase();
};

document.querySelectorAll<HTMLPreElement>('.prose pre').forEach((pre) => {
  if (pre.closest('.code-shell')) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'code-shell';
  pre.parentNode?.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);

  const bar = document.createElement('div');
  bar.className = 'code-bar';

  const label = document.createElement('span');
  label.textContent = codeLanguageLabel(pre);
  bar.appendChild(label);

  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'copy-button';
  copy.textContent = 'Copiar';
  copy.setAttribute('aria-label', 'Copiar bloque de código');
  copy.addEventListener('click', async () => {
    const text = pre.querySelector('code')?.textContent ?? pre.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      copy.textContent = 'Copiado';
      copy.classList.add('is-copied');
      window.setTimeout(() => {
        copy.textContent = 'Copiar';
        copy.classList.remove('is-copied');
      }, 1600);
    } catch {
      copy.textContent = 'Error';
      window.setTimeout(() => (copy.textContent = 'Copiar'), 1600);
    }
  });
  bar.appendChild(copy);
  wrapper.appendChild(bar);
});

/* Wrap wide tables so they can scroll without breaking the page. */
document.querySelectorAll<HTMLTableElement>('.prose table').forEach((table) => {
  if (table.parentElement?.classList.contains('table-wrap')) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'table-wrap';
  table.parentNode?.insertBefore(wrapper, table);
  wrapper.appendChild(table);
});

/* Add a discreet permalink to each section heading. */
document.querySelectorAll<HTMLElement>('.prose h2[id], .prose h3[id]').forEach((heading) => {
  if (heading.querySelector('.heading-anchor')) return;
  const link = document.createElement('a');
  link.className = 'heading-anchor';
  link.href = `#${heading.id}`;
  link.textContent = '#';
  link.setAttribute('aria-label', `Enlace a ${heading.textContent ?? 'esta sección'}`);
  heading.appendChild(link);
});

/* --------------------------------------------------------------------------
   Video facades
   -------------------------------------------------------------------------- */

document.querySelectorAll<HTMLAnchorElement>('[data-video-facade]').forEach((button) => {
  button.addEventListener('click', (event) => {
    const embedUrl = button.dataset.embedUrl;
    if (!embedUrl) return;
    event.preventDefault();

    const frame = document.createElement('iframe');
    frame.src = embedUrl;
    frame.title = button.dataset.videoTitle ?? 'Vídeo de la práctica';
    frame.loading = 'eager';
    frame.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    button.replaceWith(frame);
  });
});

/* --------------------------------------------------------------------------
   Gallery lightbox
   -------------------------------------------------------------------------- */

document.querySelectorAll<HTMLElement>('.gallery').forEach((gallery) => {
  const items = Array.from(gallery.querySelectorAll<HTMLElement>('[data-gallery-item]'));
  const dialog = gallery.querySelector<HTMLDialogElement>('.lightbox');
  if (!dialog || items.length === 0) return;

  const image = dialog.querySelector<HTMLImageElement>('[data-lightbox-image]');
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]');
  const counter = dialog.querySelector<HTMLElement>('[data-lightbox-counter]');
  let current = 0;

  const show = (index: number) => {
    current = (index + items.length) % items.length;
    const item = items[current];
    const src = item.dataset.src ?? '';
    if (image) {
      image.src = src;
      image.alt = item.dataset.alt ?? '';
    }
    if (caption) caption.textContent = item.dataset.caption ?? '';
    if (counter) counter.textContent = `${current + 1} / ${items.length}`;
  };

  items.forEach((item, index) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      show(index);
      dialog.showModal();
      syncScrollLock();
      dialog.querySelector<HTMLElement>('[data-lightbox-close]')?.focus();
    });
  });

  dialog.querySelectorAll<HTMLElement>('[data-lightbox-close]').forEach((button) => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.querySelector<HTMLElement>('[data-lightbox-prev]')?.addEventListener('click', () => show(current - 1));
  dialog.querySelector<HTMLElement>('[data-lightbox-next]')?.addEventListener('click', () => show(current + 1));

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(current - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + 1);
    }
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', syncScrollLock);
});

/* --------------------------------------------------------------------------
   Lab filters
   -------------------------------------------------------------------------- */

const labForm = document.querySelector<HTMLFormElement>('#lab-filter-form');
if (labForm) {
  const search = labForm.querySelector<HTMLInputElement>('#lab-search');
  const moduleSelect = labForm.querySelector<HTMLSelectElement>('#lab-module');
  const categorySelect = labForm.querySelector<HTMLSelectElement>('#lab-category');
  const sortSelect = labForm.querySelector<HTMLSelectElement>('#lab-sort');
  const count = document.querySelector<HTMLElement>('#lab-count');
  const empty = document.querySelector<HTMLElement>('#lab-empty');
  const archive = document.querySelector<HTMLElement>('#lab-archive');
  const params = new URLSearchParams(window.location.search);

  if (search && params.get('q')) search.value = params.get('q') ?? '';
  if (moduleSelect && params.get('module')) moduleSelect.value = params.get('module') ?? 'all';
  if (categorySelect && params.get('category')) categorySelect.value = params.get('category') ?? 'all';
  if (sortSelect && params.get('sort')) sortSelect.value = params.get('sort') ?? 'newest';

  const apply = (updateUrl = true) => {
    if (!archive) return;

    const term = normalize(search?.value ?? '');
    const selectedModule = moduleSelect?.value ?? 'all';
    const selectedCategory = categorySelect?.value ?? 'all';
    const sort = sortSelect?.value ?? 'newest';
    const items = Array.from(archive.querySelectorAll<HTMLElement>('[data-lab-item]'));
    const groups = Array.from(archive.querySelectorAll<HTMLElement>('[data-module-group]'));
    let visible = 0;

    items.forEach((item) => {
      const haystack = normalize(
        [item.dataset.title, item.dataset.categories, item.dataset.tags, item.dataset.module]
          .filter(Boolean)
          .join(' '),
      );
      const matchesTerm = !term || term.split(/\s+/).every((part) => haystack.includes(part));
      const matchesModule = selectedModule === 'all' || item.dataset.module === selectedModule;
      const matchesCategory =
        selectedCategory === 'all' ||
        (item.dataset.categories ?? '')
          .split('|')
          .map((category) => normalize(category))
          .includes(normalize(selectedCategory));
      const show = matchesTerm && matchesModule && matchesCategory;
      item.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });

    groups.forEach((group) => {
      const groupItems = Array.from(group.querySelectorAll<HTMLElement>('[data-lab-item]'));
      const sorted = [...groupItems].sort((a, b) => {
        if (sort === 'practice') {
          return Number(a.dataset.practice ?? 0) - Number(b.dataset.practice ?? 0);
        }
        const aDate = Number(a.dataset.date ?? 0);
        const bDate = Number(b.dataset.date ?? 0);
        return sort === 'oldest' ? aDate - bDate : bDate - aDate;
      });
      if (groupItems.length > 0) {
        const parent = groupItems[0]?.parentElement;
        if (parent?.classList.contains('lab-grid')) {
          const slot = parent.querySelector(':scope > .slot-card');
          sorted.forEach((item) => {
            if (slot) parent.insertBefore(item, slot);
            else parent.appendChild(item);
          });
        }
      }

      const visibleInGroup = groupItems.filter((item) => !item.classList.contains('is-hidden')).length;
      const matchesModuleFilter = selectedModule === 'all' || group.dataset.moduleId === selectedModule;
      const hasNarrowingFilter = Boolean(term) || selectedCategory !== 'all';
      group.classList.toggle('is-hidden', !matchesModuleFilter || (hasNarrowingFilter && visibleInGroup === 0));
    });

    if (count) {
      const sortLabel =
        sort === 'oldest'
          ? 'fecha · antiguas'
          : sort === 'practice'
            ? 'número de práctica'
            : 'fecha · recientes';
      count.textContent = `${visible} de ${items.length} prácticas · ${sortLabel} · por módulo`;
    }
    if (empty) empty.hidden = visible !== 0;

    if (updateUrl) {
      const next = new URLSearchParams();
      if (search?.value.trim()) next.set('q', search.value.trim());
      if (selectedModule !== 'all') next.set('module', selectedModule);
      if (selectedCategory !== 'all') next.set('category', selectedCategory);
      if (sort !== 'newest') next.set('sort', sort);
      const suffix = next.toString() ? `?${next.toString()}` : '';
      window.history.replaceState({}, '', `${window.location.pathname}${suffix}${window.location.hash}`);
    }
  };

  labForm.addEventListener('submit', (event) => {
    event.preventDefault();
    apply();
  });
  labForm.addEventListener('input', () => apply());
  labForm.addEventListener('change', () => apply());
  labForm.addEventListener('reset', () => window.setTimeout(() => apply(), 0));

  apply(false);
}

/* --------------------------------------------------------------------------
   Reveal on scroll
   -------------------------------------------------------------------------- */

const revealItems = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
if (revealItems.length > 0) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    revealItems.forEach((item) => observer.observe(item));
  }
}
