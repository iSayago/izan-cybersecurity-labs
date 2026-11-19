# IZAN | Cybersecurity Labs

Portfolio técnico de ciberseguridad construido como archivo de laboratorio: SOC Operations,
Blue Team, análisis de eventos, triage, DFIR y una línea futura de AI Security.

La web está pensada para que un evaluador técnico pueda **entrar, explorar un módulo, abrir
un informe, revisar el procedimiento, mirar las evidencias y comprobar qué está publicado y
qué sigue pendiente**. No es una landing de servicios ni una plantilla de marketing.

- **Demo local:** `http://localhost:4321/`
- **Repositorio:** https://github.com/iSayago/izan-cybersecurity-labs
- **Web publicada:** https://isayago.github.io/izan-cybersecurity-labs/
- **Stack:** Astro 7, TypeScript, Tailwind CSS 4, Markdown/MDX, GitHub Actions y GitHub Pages.
- **Contenido:** colecciones locales en `content/`, sin backend, sin base de datos y sin
  servicios de pago obligatorios.

> **Laboratorios 1 y 2.** Este árbol incluye 10 informes de los Laboratorios 1 y 2
> (6 + 4 ejercicios), sus evidencias y sus metadatos. Los informes están integrados y se
> publican con `status: published`; los MP4 editados y los resúmenes verticales están en
> `media-work/videos/`, fuera de Git, a la espera de alojamiento externo. Ver
> `TOOLS_USED.md` y `VIDEO_HOSTING.md`.

[![Deploy to GitHub Pages](https://github.com/iSayago/izan-cybersecurity-labs/actions/workflows/deploy.yml/badge.svg)](https://github.com/iSayago/izan-cybersecurity-labs/actions/workflows/deploy.yml)

---

## 1. Por qué Astro y no Next.js

Se eligió **Astro** por cuatro razones concretas para este proyecto:

1. **Salida estática nativa.** El sitio se compila a HTML, CSS y pequeñas cantidades de JS.
   No necesita servidor, API routes ni un runtime de React para funcionar.
2. **Contenido como archivos.** Las content collections detectan automáticamente cada
   `.md`/`.mdx`, validan el frontmatter con Zod y generan rutas sin tocar componentes.
3. **Menos JavaScript por defecto.** La búsqueda, los filtros, el menú y la galería son
   módulos pequeños y explícitos. No hay hidratación de una aplicación completa.
4. **Compatibilidad directa con GitHub Pages.** El build produce `dist/` y las rutas base
   se resuelven con `import.meta.env.BASE_URL`.

Next.js con `output: 'export'` también habría funcionado, pero para un archivo editorial
estático Astro aporta menos superficie, menos dependencias y un modelo de contenido más
directo.

### Decisiones de diseño

- Tema oscuro permanente, azul grafito y cian de acento usado con moderación.
- Tipografía editorial: **Archivo** para interfaz, **Source Serif 4** para informes y
  **JetBrains Mono** para metadatos, código y estados.
- Retícula de archivo, líneas finas, numeración de secciones y fichas técnicas.
- Portadas generadas con SVG cuando no existe una imagen real. No se simulan capturas.
- Contenido `demo` y `pending` visible pero **etiquetado y `noindex`**.
- Sin cookies, sin analítica, sin formularios y sin fuentes servidas desde terceros.

---

## 2. Requisitos

- **Node.js >= 22.23.4** (Astro 7 lo exige; hay un `.nvmrc` con la versión).
- npm 10+.
- Git.

Comprueba la versión:

```bash
node --version
```

---

## 3. Puesta en marcha

```bash
npm install
npm run dev
```

Abre `http://localhost:4321/`.

Build de producción y comprobación de tipos:

```bash
npm run build
npm run preview
```

`npm run build` ejecuta `astro check` antes de compilar. `npm run build:fast` omite el
type-check y sirve solo para iterar el diseño.

### Scripts

| Script | Uso |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Type-check + build estático en `dist/` |
| `npm run build:fast` | Build sin `astro check` |
| `npm run preview` | Sirve `dist/` localmente |
| `npm run check` | Solo comprobación de tipos |
| `node scripts/generate-assets.mjs` | Regenera OG, iconos PWA y apple-touch-icon |

---

## 4. Estructura del proyecto

```text
.
├─ content/
│  ├─ labs/
│  │  ├─ module-02/
│  │  │  ├─ practice-01..06.mdx            # Laboratorio 1
│  │  │  └─ demo-01.mdx                    # Demo en draft
│  │  ├─ module-03/
│  │  │  ├─ practice-01..04.mdx            # Laboratorio 2
│  │  │  └─ demo-01.md                     # Demo en draft
│  │  └─ module-04/plantilla-pendiente.md   # Hueco de práctica, sin datos
│  ├─ blog/
│  │  ├─ demo-documentar-un-laboratorio.md
│  │  └─ demo-plantilla-writeup.md
│  └─ ai-security/
│     └─ _template.md                       # Borrador; no se publica
├─ src/
│  ├─ components/                           # UI reutilizable
│  ├─ data/
│  │  ├─ site.ts                            # Identidad, enlaces, formación
│  │  ├─ modules.ts                         # Módulos CSA y títulos originales
│  │  └─ ai-security.ts                     # Líneas previstas, no proyectos
│  ├─ layouts/BaseLayout.astro
│  ├─ lib/                                  # Contenido, URLs, informe, tipos
│  ├─ pages/                                # Rutas estáticas y endpoints
│  ├─ scripts/ui.ts                          # Búsqueda, filtros, TOC, galería…
│  └─ styles/                               # Tokens y estilos globales
├─ public/
│  ├─ images/                               # Capturas y diagramas
│  ├─ icons/                                # Iconos PWA
│  ├─ favicon.svg
│  ├─ og-default.png
│  └─ site.webmanifest
├─ scripts/
│  ├─ generate-assets.mjs
│  └─ og-default.svg
├─ astro.config.mjs
├─ package.json
└─ README.md
```

---

## 5. Añadir una práctica

No hay que tocar componentes. Crea un archivo en la carpeta del módulo:

```text
content/labs/module-05/nombre-corto.mdx
```

El nombre del archivo se convierte en la URL:

```text
/labs/module-05/nombre-corto/
```

### Frontmatter

```yaml
---
title: "Detección de actividad sospechosa en un endpoint"
description: "Resumen breve que aparecerá como introducción y en las tarjetas."
module: "05"                 # Dos dígitos; debe existir en src/data/modules.ts
practice: 1                  # Número de práctica dentro del módulo
date: 2026-05-14
updated: 2026-05-15
categories:
  - Threat Hunting
tags:
  - Sysmon
  - MITRE ATT&CK
tools:
  - Sysmon
  - Splunk
cover: "/images/labs/module-05/portada.webp"
coverAlt: "Panel de búsqueda con eventos de proceso filtrados"
originalVideo:
  url: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
  title: "Grabación completa de la práctica"
summaryVideo:
  url: "https://vimeo.com/123456789"
  title: "Resumen vertical 9:16"
repository: "https://github.com/TU-USUARIO/repositorio"
documentation: "https://ejemplo.com/informe.pdf"
status: published            # published | demo | pending | draft
featured: false
---
```

### Cuerpo del informe

Escribe los apartados con encabezados de nivel 2. La página los numera, genera el índice,
detecta los que faltan y calcula la cobertura documental.

```markdown
## Objetivo
## Contexto y entorno del laboratorio
## Herramientas utilizadas
## Procedimiento realizado
## Evidencias y capturas
## Análisis de resultados
## Conclusiones y aprendizajes
## Referencias
```

La introducción va en `description`; no dupliques un `## Introducción` salvo que aporte algo
distinto. Si falta un apartado, la web muestra **"Secciones pendientes de documentar"** con
una descripción de lo que falta. No rellena huecos automáticamente.

### Estados

| Estado | Efecto |
| --- | --- |
| `published` | Se considera trabajo revisado. Indexable. |
| `demo` | Contenido de demostración. Se muestra con aviso, `noindex` y fuera del sitemap/RSS. |
| `pending` | Hueco reservado. Se muestra el estado y la cobertura, sin datos inventados. |
| `draft` | No se compila ni aparece en el sitio. |

> **Regla del proyecto:** completar una práctica del curso no cambia el estado de su
> informe. El progreso del curso y la publicación web son decisiones separadas.

### Imágenes y figuras

Guarda las capturas en `public/images/labs/module-XX/`. En Markdown puedes usar rutas
absolutas: el build las prefija automáticamente con la base de GitHub Pages.

```markdown
![Descripción de la evidencia](/images/labs/module-05/evento-4624.webp)
```

En MDX puedes usar componentes con pie de figura y galería:

```mdx
import Figure from '../../../src/components/Figure.astro';
import EvidenceGallery from '../../../src/components/EvidenceGallery.astro';

<Figure
  src="/images/labs/module-05/topologia.svg"
  alt="Diagrama del laboratorio"
  caption="Topología del entorno aislado."
  index="FIG. 01"
/>

<EvidenceGallery
  images={[
    { src: '/images/labs/module-05/evidencia-01.webp', alt: 'Evento 4624', caption: 'Inicio de sesión.' },
    { src: '/images/labs/module-05/evidencia-02.webp', alt: 'Evento 4625', caption: 'Fallo de autenticación.' },
  ]}
/>
```

Recomendaciones:

- WebP o PNG optimizado, ancho máximo ~1600 px.
- No subir capturas con credenciales, tokens, correos o nombres reales.
- Usar `coverAlt` si hay `cover`.
- Para OG, usa PNG/JPG; algunos clientes no interpretan SVG.
- Las ilustraciones de demostración deben decirlo en el pie de figura.

### Vídeo original y resumen vertical

Cada informe admite dos vídeos:

```yaml
originalVideo:
  url: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
  title: "Grabación original · 16:9"
summaryVideo:
  url: "https://vimeo.com/123456789"
  title: "Resumen vertical · 9:16"
```

- **Original:** práctica completa, preferiblemente en YouTube/Vimeo. El reproductor se
  carga solo al pulsar (sin cookies de terceros hasta entonces).
- **Resumen:** pieza vertical de 15–20 s para LinkedIn, alojada externamente.
- También se admite un `.mp4`/`.webm` directo. No subas vídeos pesados al repositorio.
- Si no hay vídeo, el informe no lo inventa: muestra un estado vacío honesto.

---

## 6. Añadir una nota al blog

```text
content/blog/mi-nota.md
```

```yaml
---
title: "Título de la nota"
description: "Resumen que aparece en el archivo y en los metadatos."
date: 2026-06-01
category: "Detección"
tags:
  - SIEM
  - Logs
status: published
featured: false
readingLevel: intermedio
---
```

El listado de categorías y etiquetas se genera solo. Los filtros y el buscador se actualizan
sin tocar componentes.

---

## 7. AI Security

La sección está preparada, pero **no contiene proyectos ficticios**. Las líneas de
investigación de `src/data/ai-security.ts` son temas previstos, no trabajo realizado.

Para publicar una investigación real:

```text
content/ai-security/nombre-de-la-investigacion.md
```

Usa el frontmatter de `content/ai-security/_template.md`, cambia `status: draft` por
`published` y escribe el contenido. La página `/ai-security/` listará la entrada
automáticamente y se generará su ruta.

---

## 8. Configurar identidad y contacto

Edita `src/data/site.ts` o crea un `.env` basado en `.env.example`:

```dotenv
PUBLIC_GITHUB_URL=https://github.com/TU-USUARIO
PUBLIC_LINKEDIN_URL=https://www.linkedin.com/in/TU-PERFIL
PUBLIC_CONTACT_EMAIL=tu-correo@dominio.com
```

Mientras un enlace esté vacío, **no se renderiza**: no hay botones muertos ni perfiles
inventados. El bloque de contacto muestra un aviso neutro y honesto.

También se pueden ajustar:

- Nombre, rol y descripción en `src/data/site.ts`.
- Programa de formación y número de prácticas realizadas.
- Módulos y estados de documentación en `src/data/modules.ts`.
- Título pendiente del módulo 01: no se ha inventado.

---

## 9. Publicar en GitHub Pages

### Opción A — Repositorio de proyecto

1. Crea un repositorio público, por ejemplo `izan-cybersecurity-labs`.
2. Sube el proyecto a la rama `main`.
3. En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions**.
4. El workflow `.github/workflows/deploy.yml` se ejecutará al hacer push a `main`.
5. La URL será:

```text
https://TU-USUARIO.github.io/izan-cybersecurity-labs/
```

La base se detecta automáticamente: `/izan-cybersecurity-labs/`. Todos los enlaces,
imágenes, CSS, JS, el buscador y el sitemap se generan bajo esa ruta.

**URL publicada de este repositorio:**
https://isayago.github.io/izan-cybersecurity-labs/

Primer push desde local:

```bash
git init -b main
git add .
git commit -m "Initial cybersecurity portfolio"
git remote add origin https://github.com/TU-USUARIO/izan-cybersecurity-labs.git
git push -u origin main
```

Después, activa GitHub Actions como origen de Pages y espera al primer despliegue.

### Opción B — Repositorio de usuario

1. Crea un repositorio llamado exactamente `TU-USUARIO.github.io`.
2. Sube el proyecto a `main` y activa GitHub Actions como origen de Pages.
3. La URL será:

```text
https://TU-USUARIO.github.io/
```

En este caso la base es `/`. El workflow lo detecta comparando el nombre del repositorio
con `<owner>.github.io`.

### Dominio propio

1. Añade `public/CNAME` con el dominio, por ejemplo:

```text
portfolio.tudominio.com
```

2. En **Settings → Secrets and variables → Actions → Variables**, crea:

```text
SITE_URL = https://portfolio.tudominio.com
BASE_PATH = /
```

3. Configura el DNS según la documentación de GitHub Pages.

### Probar la base localmente

Antes de publicar, comprueba una build con la misma forma que GitHub Pages:

```bash
# PowerShell
$env:BASE_PATH="/izan-cybersecurity-labs/"
$env:SITE_URL="https://usuario.github.io"
npm run build
npm run preview
```

Abre `http://localhost:4321/izan-cybersecurity-labs/`.

En macOS/Linux:

```bash
BASE_PATH=/izan-cybersecurity-labs/ SITE_URL=https://usuario.github.io npm run build
npm run preview
```

---

## 10. Contenido de demostración

Estos archivos existen para validar el diseño del sistema documental y están claramente
marcados:

| Archivo | Estado | Qué muestra |
| --- | --- | --- |
| `content/labs/module-02/demo-01.mdx` | `draft` | Informe de ejemplo; no se compila en esta rama |
| `content/labs/module-03/demo-01.md` | `draft` | Cobertura parcial; no se compila en esta rama |
| `content/labs/module-04/plantilla-pendiente.md` | `pending` | Página sin contenido, sin resultados inventados |
| `content/blog/demo-documentar-un-laboratorio.md` | `demo` | Nota de método |
| `content/blog/demo-plantilla-writeup.md` | `demo` | Plantilla editorial |

Los informes `demo` y `pending`:

- llevan aviso visible;
- tienen `<meta name="robots" content="noindex, follow">`;
- están fuera del sitemap y del RSS;
- **no** se cuentan como prácticas publicadas.

Sustitúyelos por tus informes reales y cambia `status` a `published`. Los nombres de las
prácticas reales pueden ser `practice-01.md`, `practice-02.md`, etc.

---

## 11. Comprobaciones antes de publicar

```bash
npm run check
npm run build
npm run preview
```

Revisa manualmente:

- [ ] Todas las prácticas reales tienen `status: published`.
- [ ] No queda ningún `DEMO` atribuido a una actividad no realizada.
- [ ] Las herramientas listadas se usaron realmente.
- [ ] Las capturas no contienen datos personales, credenciales ni tokens.
- [ ] `coverAlt` existe en cada portada.
- [ ] Los enlaces de GitHub/LinkedIn/email están configurados.
- [ ] Las URLs de los vídeos son públicas o accesibles con permiso.
- [ ] El sitio funciona con la base de GitHub Pages.
- [ ] La navegación por teclado y el menú móvil funcionan.
- [ ] El buscador devuelve resultados y los filtros actualizan la URL.
- [ ] La página 404 carga.
- [ ] El build no tiene errores de TypeScript.

---

## 12. Accesibilidad, rendimiento y seguridad

- HTML semántico, un solo `h1` por página, `main`, `nav` y breadcrumbs.
- Skip link, foco visible y diálogos nativos para menú, búsqueda y galería.
- `prefers-reduced-motion` respetado en animaciones y scroll.
- Imágenes con `alt`, `width`/`height` y `loading="lazy"` cuando corresponde.
- Sin cookies de analítica, sin fuentes externas y sin iframes hasta que se pulsa un vídeo.
- JS propio y pequeño para búsqueda, filtros, TOC, copiar código y lightbox.
- SEO: canonical, Open Graph, Twitter Card, JSON-LD, sitemap, RSS y `robots.txt`.
- El contenido `demo`/`pending` es `noindex`.
- No hay formularios ni backend; no se recogen datos.

Limitaciones actuales:

- No hay analítica (decisión deliberada).
- Las redes sociales y el email están vacíos hasta configurarlos.
- AI Security no tiene publicaciones reales todavía.
- No se incluyen vídeos ni capturas de prácticas reales porque el repositorio no debe
  inventarlas.

---

## 13. Licencia

Código bajo licencia MIT (ver `LICENSE`). Los textos, informes, imágenes y vídeos son
contenido editorial de Izan y no se incluyen en la licencia MIT salvo indicación expresa.
