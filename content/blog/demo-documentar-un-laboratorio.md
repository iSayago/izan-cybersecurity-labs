---
title: "Cómo documento un laboratorio: estructura mínima de un informe SOC"
description: "Una nota de método sobre cómo convertir una práctica en un informe revisable: objetivo, contexto, procedimiento, evidencia y límites."
date: 2026-11-16
category: Método
tags:
  - Documentación
  - SOC
  - Writeups
status: demo
featured: true
readingLevel: intro
---

> **Nota de demostración.** Este texto describe un método de trabajo y se publica
> como ejemplo de formato. No presenta resultados de una práctica ni experiencia
> profesional que no exista.

Un informe de laboratorio no es un diario de clics. Es un artefacto que otra persona
debería poder leer, cuestionar y reproducir sin depender de que quien lo escribió esté
delante para explicarlo.

## El problema de documentar tarde

Cuando se escribe al final, se recuerdan las conclusiones pero no las decisiones. Se
pierden las consultas que no funcionaron, el orden de los eventos y las dudas que
aparecieron durante el análisis. El resultado suele ser un texto que afirma cosas
correctas pero no demuestra cómo llegó a ellas.

Documentar mientras se trabaja cambia la naturaleza del informe: obliga a registrar
la hipótesis inicial y a distinguir entre lo observado y lo interpretado.

## La estructura que utilizo

| Apartado | Pregunta que responde |
| --- | --- |
| Objetivo | ¿Qué intentaba comprobar? |
| Contexto y entorno | ¿Dónde ocurre y qué límites tiene? |
| Herramientas | ¿Con qué se ha trabajado realmente? |
| Procedimiento | ¿Qué pasos se siguieron y por qué? |
| Evidencias | ¿Qué sostiene la afirmación? |
| Análisis | ¿Qué significan los datos y qué no permiten concluir? |
| Conclusiones | ¿Qué cambia después de esta práctica? |
| Referencias | ¿Qué fuentes externas se consultaron? |

La introducción va en la descripción del artículo. El resto vive en el cuerpo, con
encabezados de segundo nivel, para que la página pueda generar el índice y detectar
qué secciones faltan.

## Evidencia con contexto

Una captura sin pie de figura es decoración. Una captura útil indica qué se está
mirando, cuándo se obtuvo, qué herramienta la generó y qué parte de la imagen importa.
Si la imagen contiene datos sensibles, se recorta o se sustituye por un diagrama.

Los logs extensos suelen funcionar mejor como bloque de código que como imagen: se
pueden copiar, buscar y citar. Las capturas se reservan para interfaces, estados y
resultados visuales que no se pueden transmitir con texto.

## Un checklist antes de publicar

- ¿El objetivo está escrito antes de los resultados?
- ¿Se distingue lo real de lo sintético?
- ¿Las herramientas listadas se usaron de verdad?
- ¿Cada conclusión tiene una evidencia asociada?
- ¿Se explican las limitaciones?
- ¿Hay credenciales, nombres reales o datos personales?
- ¿Las rutas de las imágenes funcionan bajo la base de GitHub Pages?
- ¿El estado del contenido es `published`, no `demo` ni `pending`?

## Lo que no debe hacer un informe

No debe convertir una coincidencia en una atribución. No debe usar “se puede observar”
para introducir una suposición. No debe ocultar que una sección está incompleta.

El objetivo del archivo no es parecer productivo. Es permitir que alguien revise el
trabajo y decida si la evidencia sostiene lo que se afirma.
