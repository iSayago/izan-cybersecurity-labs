---
title: "Plantilla de writeup técnico para reutilizar"
description: "Esqueleto de writeup con metadatos, apartados y ejemplos de bloques de código. Pensado para copiar, sustituir y publicar cuando la práctica sea real."
date: 2026-11-05
category: Plantillas
tags:
  - Plantillas
  - Markdown
  - Documentación
status: demo
featured: false
readingLevel: intro
---

> **Plantilla de demostración.** El contenido de esta página es un esqueleto. No
> describe una máquina, un incidente ni un resultado real.

## Uso de la plantilla

Copia el bloque de metadatos, cambia `status` a `demo` mientras trabajas y a
`published` cuando el informe esté revisado. Si todavía no hay contenido, usa
`pending` y deja el cuerpo vacío: la web mostrará la cobertura pendiente.

```yaml
---
title: "Título concreto de la práctica"
description: "Qué se investiga y qué se puede encontrar en el informe."
module: "05"
practice: 1
date: 2026-01-01
categories:
  - Threat Hunting
tags:
  - Sysmon
  - MITRE ATT&CK
tools:
  - Herramienta realmente utilizada
status: pending
featured: false
---
```

## Esqueleto del cuerpo

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

## Evidencia en bloque de código

Los logs y consultas se citan mejor como texto. Un bloque pequeño, con la consulta
completa y el resultado relevante, suele ser más útil que una captura borrosa.

```text
EventCode=4625  Account=analyst.demo  SourceIp=198.51.100.24  Count=12
```

## Antes de publicar

- Sustituye todos los valores de ejemplo.
- Elimina esta nota de plantilla.
- Revisa que no haya rutas absolutas fuera de la base del sitio.
- Comprueba que el estado es `published`.
- Añade vídeos solo si representan la práctica real.
