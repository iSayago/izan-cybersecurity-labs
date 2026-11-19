export type DocumentationState = 'published';

export interface CourseModule {
  /** Two-digit module number, used in filenames and routing. */
  id: string;
  slug: string;
  title: string;
  /** Short label for compact navigation. */
  label: string;
  description: string;
  areas: string[];
  documentation: DocumentationState;
}

/**
 * Laboratorios documentados del programa SOC Analyst (CSA) de EC-Council.
 *
 * Los títulos se mantienen exactamente como aparecen en el material del curso.
 * Solo se incluyen los módulos con prácticas publicadas: 02 y 03.
 */
export const modules: CourseModule[] = [
  {
    id: '02',
    slug: 'module-02',
    title: 'Understanding Cyber Threats, IoCs, and Attack Methodology.',
    label: 'Módulo 02',
    description:
      'Fundamentos para entender el panorama de amenazas, reconocer indicadores de compromiso y seguir la metodología de un ataque a través de su telemetría.',
    areas: [
      'Threat landscape',
      'Indicators of Compromise (IoCs)',
      'Attack methodology',
      'Threat intelligence',
    ],
    documentation: 'published',
  },
  {
    id: '03',
    slug: 'module-03',
    title: 'Log Management.',
    label: 'Módulo 03',
    description:
      'Ciclo de vida del dato de registro: fuentes, recogida, normalización, retención y revisión de logs para sostener una investigación.',
    areas: ['Log sources', 'Collection', 'Normalization', 'Retention', 'Log review'],
    documentation: 'published',
  },
];

export const moduleMap = new Map(modules.map((module) => [module.id, module]));

export function getModule(id: string): CourseModule | undefined {
  return moduleMap.get(id);
}

export const documentationLabels: Record<DocumentationState, string> = {
  published: 'Publicado',
};
