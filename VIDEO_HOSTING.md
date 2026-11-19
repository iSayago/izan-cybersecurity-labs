# Alojamiento de los vídeos

Los vídeos están preparados en local, dentro de:

```text
media-work/videos/
```

No se han subido a ninguna plataforma ni se han enlazado desde la web. El material proviene
de una grabación de laboratorio del programa CSA; antes de publicarlo hay que confirmar que
su distribución está permitida.

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

## Recomendación de publicación

1. Revisar los permisos de distribución del material del curso.
2. Subir los editados a YouTube (no listado) o Vimeo.
3. Subir los resúmenes verticales a YouTube Shorts o Vimeo, o publicarlos directamente en
   LinkedIn como vídeo nativo.
4. Copiar las URLs públicas en el frontmatter de la práctica correspondiente:

```yaml
originalVideo:
  url: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
  title: "Grabación editada · Laboratorio 1"
summaryVideo:
  url: "https://vimeo.com/XXXXXXXXX"
  title: "Resumen vertical · Laboratorio 1"
```

5. Ejecutar `npm run build` y revisar el reproductor antes de desplegar.
6. No subir los MP4 pesados al repositorio. `media-work/` está ignorado por Git.

## Nota de autenticidad

El vídeo editado es una transformación de la grabación original: cortes, recorte al área de
la máquina, tarjetas de título y rótulos. No se han añadido resultados, voces ni escenas que
no existan en la fuente. El audio se ha dejado fuera porque la pista original no contiene
narración inteligible.
