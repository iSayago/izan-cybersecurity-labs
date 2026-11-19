import type { MarkdownHeading } from 'astro';

export interface ReportSection {
  label: string;
  hint: string;
}

/**
 * Estructura mínima de un informe de práctica. La introducción se escribe en el
 * frontmatter (`description`) y las demás secciones viven en el cuerpo MDX.
 */
export const reportSections: ReportSection[] = [
  {
    label: 'Objetivo',
    hint: 'Qué pregunta intenta responder la práctica y qué resultado se esperaba obtener.',
  },
  {
    label: 'Contexto y entorno',
    hint: 'Sistema, red, datos y límites del laboratorio. Indica qué es real y qué es sintético.',
  },
  {
    label: 'Herramientas',
    hint: 'Solo las herramientas utilizadas, con su función concreta en el procedimiento.',
  },
  {
    label: 'Procedimiento',
    hint: 'Pasos reproducibles, decisiones tomadas y comandos o consultas relevantes.',
  },
  {
    label: 'Evidencias',
    hint: 'Capturas, logs o diagramas que sostienen el análisis, con contexto y pie de figura.',
  },
  {
    label: 'Análisis de resultados',
    hint: 'Qué muestran las evidencias, qué no permiten concluir y qué limitaciones existen.',
  },
  {
    label: 'Conclusiones',
    hint: 'Aprendizajes, errores y siguiente paso. Sin afirmaciones que la evidencia no sostenga.',
  },
  {
    label: 'Referencias',
    hint: 'Documentación, estándares o fuentes externas consultadas.',
  },
];

export function normalizeHeading(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function getReportCoverage(headings: MarkdownHeading[]) {
  const secondLevel = headings.filter((heading) => heading.depth === 2).map((heading) => normalizeHeading(heading.text));

  const completed = reportSections.filter((section) => {
    const target = normalizeHeading(section.label);
    return secondLevel.some((heading) => heading.includes(target));
  });

  const missing = reportSections.filter((section) => !completed.includes(section));

  return {
    completed,
    missing,
    total: reportSections.length,
    percentage: Math.round((completed.length / reportSections.length) * 100),
  };
}
