/**
 * Identidad y datos del sitio.
 *
 * Edita este archivo para publicar tus enlaces reales. Mientras un enlace esté
 * vacío, la interfaz lo omite (no se renderizan botones muertos ni perfiles
 * inventados). Los valores también se pueden inyectar en el build mediante
 * variables de entorno PUBLIC_*.
 */

const env = import.meta.env;

const github = (env.PUBLIC_GITHUB_URL ?? 'https://github.com/iSayago').trim();
const linkedin = (env.PUBLIC_LINKEDIN_URL ?? '').trim();
const email = (env.PUBLIC_CONTACT_EMAIL ?? '').trim();

export const site = {
  name: 'IZAN',
  wordmark: 'CYBERSECURITY LABS',
  title: 'IZAN | Cybersecurity Labs',
  shortDescription:
    'Portfolio técnico de ciberseguridad: SOC Operations, Blue Team y documentación de laboratorios.',
  description:
    'Portfolio personal de ciberseguridad. Documentación de laboratorios, investigaciones técnicas y prácticas centradas en monitorización, detección de amenazas, análisis de eventos y respuesta ante incidentes.',
  locale: 'es-ES',
  lang: 'es',
  author: 'Izan',
  role: 'SOC Operations · Blue Team · Cybersecurity',
  startYear: 2026,
  contactNote:
    'Este portfolio no usa formularios ni backend. La comunicación se realiza a través de los canales profesionales configurados.',
  course: {
    program: 'SOC Analyst (CSA)',
    issuer: 'EC-Council',
    status: 'Formación en curso',
    labsCompleted: 3,
    note: 'Tres prácticas realizadas. La publicación de cada informe se gestiona por separado del progreso del curso.',
  },
  nav: [
    { label: 'SOC Labs', href: '/labs/' },
    { label: 'Writeups', href: '/blog/' },
    { label: 'AI Security', href: '/ai-security/' },
    { label: 'About', href: '/about/' },
  ],
  social: {
    github,
    linkedin,
    email,
  },
} as const;

export const socialLinks = [
  github && {
    label: 'GitHub',
    href: github,
    handle: github.replace(/^https?:\/\/(www\.)?github\.com\/?/, '').replace(/\/$/, ''),
    icon: 'github' as const,
  },
  linkedin && {
    label: 'LinkedIn',
    href: linkedin,
    handle: linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\/?/, '').replace(/\/$/, ''),
    icon: 'linkedin' as const,
  },
  email && {
    label: 'Email',
    href: `mailto:${email}`,
    handle: email,
    icon: 'mail' as const,
  },
].filter(Boolean) as Array<{
  label: string;
  href: string;
  handle: string;
  icon: 'github' | 'linkedin' | 'mail';
}>;

export const hasContactChannels = socialLinks.length > 0;
