export interface ResearchLine {
  title: string;
  focus: 'Defensivo' | 'Ofensivo' | 'Mixto';
  description: string;
  topics: string[];
}

/**
 * Líneas de investigación previstas. No son proyectos publicados ni resultados:
 * son temas de estudio que se documentarán cuando exista trabajo verificable.
 */
export const researchLines: ResearchLine[] = [
  {
    title: 'Seguridad de aplicaciones basadas en LLM',
    focus: 'Defensivo',
    description:
      'Análisis de superficies de ataque en aplicaciones que integran modelos de lenguaje: entrada no confiable, herramientas, contexto y límites de confianza.',
    topics: ['Prompt injection', 'Tool use', 'Data boundaries', 'OWASP LLM Top 10'],
  },
  {
    title: 'Detección de uso malicioso de IA',
    focus: 'Defensivo',
    description:
      'Estudio de telemetría y señales que permitan detectar automatización abusiva, suplantación asistida por IA y actividad anómala en el SOC.',
    topics: ['Detection engineering', 'Behavioral signals', 'SOC telemetry'],
  },
  {
    title: 'Seguridad de agentes autónomos',
    focus: 'Mixto',
    description:
      'Riesgos asociados a agentes con capacidad de actuar sobre sistemas: permisos, aislamiento, trazabilidad y respuesta ante fallos.',
    topics: ['Agent permissions', 'Sandboxing', 'Auditability', 'Incident response'],
  },
  {
    title: 'Adversarial ML',
    focus: 'Ofensivo',
    description:
      'Estudio controlado de límites de robustez en modelos y pipelines, con orientación a mitigación y no a la publicación de capacidades dañinas.',
    topics: ['Model robustness', 'Data poisoning', 'Evaluation'],
  },
];

export const researchPrinciples = [
  {
    index: '01',
    title: 'Defensa primero',
    body: 'Cada investigación ofensiva debe terminar en una mitigación, una detección o una decisión de riesgo comprensible.',
  },
  {
    index: '02',
    title: 'Evidencia verificable',
    body: 'Escenarios reproducibles, versiones concretas y resultados que otra persona pueda revisar. Sin demos atribuidas a trabajo no realizado.',
  },
  {
    index: '03',
    title: 'Alcance explícito',
    body: 'Los límites del laboratorio, los datos utilizados y las conclusiones que no se pueden extraer se documentan junto a los hallazgos.',
  },
];
