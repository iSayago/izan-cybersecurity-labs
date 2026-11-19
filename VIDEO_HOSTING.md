# Alojamiento de los vídeos

Los vídeos están publicados en el repositorio público:

```text
https://github.com/iSayago/izan-cybersecurity-media
```

y servidos por GitHub Pages en:

```text
https://isayago.github.io/izan-cybersecurity-media/
```

Los archivos están en `media/` y las prácticas apuntan a URLs directas con
`Content-Type: video/mp4` y soporte de rangos.

La copia de trabajo local está en `media-work/videos/`. El repositorio del portfolio no
contiene los MP4; `media-publish/` está ignorado por Git.

## Archivos preparados

| Laboratorio | Práctica | Vídeo editado | Resumen 9:16 |
| --- | --- | --- | --- |
| Lab 1 | 01 · SQL Injection | `lab1-p01-sql-injection-edited.mp4` | `lab1-p01-sql-injection-summary.mp4` |
| Lab 1 | 02 · XSS | `lab1-p02-xss-edited.mp4` | `lab1-p02-xss-summary.mp4` |
| Lab 1 | 03 · Nmap | `lab1-p03-nmap-edited.mp4` | `lab1-p03-nmap-summary.mp4` |
| Lab 1 | 04 · DoS UDP | `lab1-p04-dos-edited.mp4` | `lab1-p04-dos-summary.mp4` |
| Lab 1 | 05 · Hydra FTP | `lab1-p05-hydra-edited.mp4` | `lab1-p05-hydra-summary.mp4` |
| Lab 1 | 06 · Wireshark | `lab1-p06-wireshark-edited.mp4` | `lab1-p06-wireshark-summary.mp4` |
| Lab 2 | 01 · Windows Logs | `lab2-p01-windows-logs-edited.mp4` | `lab2-p01-windows-logs-summary.mp4` |
| Lab 2 | 02 · IIS Logs | `lab2-p02-iis-logs-edited.mp4` | `lab2-p02-iis-logs-summary.mp4` |
| Lab 2 | 03 · Snort | `lab2-p03-snort-edited.mp4` | `lab2-p03-snort-summary.mp4` |
| Lab 2 | 04 · Splunk | `lab2-p04-splunk-edited.mp4` | `lab2-p04-splunk-summary.mp4` |

Características:

- Editados: **1280×720**, H.264, sin audio (la fuente no tenía narración utilizable).
- Resúmenes: **1080×1920 (9:16)**, 16,5 s, H.264, sin audio.
- Las capturas de los vídeos están recortadas al área de la máquina; no incluyen el panel
  de instrucciones del curso.
- El clip de Hydra no contiene la contraseña; la evidencia de la credencial válida está
  redactada.
- Los textos de los resúmenes describen resultados observados, no resultados inventados.

## Actualización de URLs

La base pública es:

```text
https://isayago.github.io/izan-cybersecurity-media/media/
```

Cada práctica ya incluye `originalVideo` y `summaryVideo` en su frontmatter. Si se reemplaza
un MP4, mantén el mismo nombre o actualiza la URL correspondiente:

```yaml
originalVideo:
  url: "https://isayago.github.io/izan-cybersecurity-media/media/lab1-p01-sql-injection-edited.mp4"
  title: "Grabación editada · SQL Injection en LuxuryTreats"
summaryVideo:
  url: "https://isayago.github.io/izan-cybersecurity-media/media/lab1-p01-sql-injection-summary.mp4"
  title: "Resumen vertical 9:16 · SQL Injection en LuxuryTreats"
```

Después de cambiar un vídeo, ejecuta `npm run build` y revisa el reproductor antes de
desplegar. No subas los MP4 al repositorio del portfolio.

## Nota de autenticidad

El vídeo editado es una transformación de la grabación original: cortes, recorte al área de
la máquina, tarjetas de título y rótulos. No se han añadido resultados, voces ni escenas que
no existan en la fuente. El audio se ha dejado fuera porque la pista original no contiene
narración inteligible.
