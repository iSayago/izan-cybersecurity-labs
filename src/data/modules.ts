export type DocumentationState = 'pending-title' | 'in-preparation' | 'not-started';

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
  note?: string;
}

/**
 * Módulos del programa SOC Analyst (CSA) de EC-Council.
 *
 * Los títulos se mantienen exactamente como aparecen en el material del curso.
 * El módulo 01 aparece sin título inventado: está pendiente de confirmar.
 * No añadas aquí resultados, herramientas o prácticas que no existan.
 */
export const modules: CourseModule[] = [
  {
    id: '01',
    slug: 'module-01',
    title: 'Título pendiente de confirmar',
    label: 'Módulo 01',
    description:
      'El título oficial de este módulo está pendiente de confirmación. Se muestra así para no inventar contenido ni alterar el orden del programa.',
    areas: [],
    documentation: 'pending-title',
    note: 'No se publicará una descripción técnica hasta confirmar el título original.',
  },
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
    documentation: 'in-preparation',
  },
  {
    id: '03',
    slug: 'module-03',
    title: 'Log Management.',
    label: 'Módulo 03',
    description:
      'Ciclo de vida del dato de registro: fuentes, recogida, normalización, retención y revisión de logs para sostener una investigación.',
    areas: ['Log sources', 'Collection', 'Normalization', 'Retention', 'Log review'],
    documentation: 'in-preparation',
  },
  {
    id: '04',
    slug: 'module-04',
    title: 'Incident Detection and Triage.',
    label: 'Módulo 04',
    description:
      'Detección y clasificación inicial de incidentes: priorización de alertas, validación de evidencia y criterios de escalado.',
    areas: [
      'Alert detection',
      'Incident triage',
      'Prioritization',
      'Escalation',
      'Incident classification',
    ],
    documentation: 'in-preparation',
  },
  {
    id: '05',
    slug: 'module-05',
    title: 'Proactive Threat Detection.',
    label: 'Módulo 05',
    description:
      'Detección proactiva mediante hipótesis de amenaza, telemetría relevante y revisión continua más allá de las alertas automáticas.',
    areas: ['Threat hunting', 'Hypothesis-driven detection', 'Telemetry', 'Proactive monitoring'],
    documentation: 'not-started',
  },
  {
    id: '06',
    slug: 'module-06',
    title: 'Incident Response.',
    label: 'Módulo 06',
    description:
      'Ciclo de respuesta ante incidentes: contención, erradicación, recuperación y aprendizaje posterior al incidente.',
    areas: [
      'Response lifecycle',
      'Containment',
      'Eradication',
      'Recovery',
      'Lessons learned',
    ],
    documentation: 'not-started',
  },
  {
    id: '07',
    slug: 'module-07',
    title: 'Forensic Investigation and Malware Analysis.',
    label: 'Módulo 07',
    description:
      'Investigación forense y análisis de malware: preservación de evidencia, reconstrucción de actividad y análisis estático y dinámico.',
    areas: [
      'Forensic acquisition',
      'Evidence handling',
      'Timeline analysis',
      'Static analysis',
      'Dynamic analysis',
    ],
    documentation: 'not-started',
  },
  {
    id: '08',
    slug: 'module-08',
    title: 'SOC for Cloud Environments.',
    label: 'Módulo 08',
    description:
      'Monitorización y respuesta en entornos cloud: telemetría, identidad, detección y particularidades operativas del SOC en la nube.',
    areas: [
      'Cloud telemetry',
      'Identity and access',
      'Cloud detection',
      'Shared responsibility',
      'Cloud response',
    ],
    documentation: 'not-started',
  },
];

export const moduleMap = new Map(modules.map((module) => [module.id, module]));

export function getModule(id: string): CourseModule | undefined {
  return moduleMap.get(id);
}

export const documentationLabels: Record<DocumentationState, string> = {
  'pending-title': 'Título pendiente',
  'in-preparation': 'Documentación en preparación',
  'not-started': 'Pendiente de incorporar',
};
