# Herramientas y proceso técnico

Registro del entorno utilizado para analizar y documentar los Laboratorios 1 y 2 del programa
**Certified SOC Analyst (CSA)** de EC-Council.

## Sistema

| Elemento | Valor |
| --- | --- |
| Sistema operativo | Windows 11, versión 10.0.26200, AMD64 |
| CPU / aceleración | Procesamiento en CPU; no se utilizó GPU para transcripción ni renderizado |
| Python | 3.12.10 |
| Node.js | 26.13.1 |
| npm | 11.20.0 |
| Espacio libre durante el proceso | > 120 GB |

## Herramientas audiovisuales

| Herramienta | Versión | Función |
| --- | --- | --- |
| FFmpeg | 9.0.2-full_build | Extracción de audio, cortes, escalado, superposición de títulos y exportación MP4 |
| FFprobe | 9.0.2 | Inspección de duración, códecs, resolución y pistas |
| OpenCV | 5.1.0.95 | Extracción de fotogramas y muestreo temporal |
| Pillow | 11.3.0 | Recorte, redacción de credenciales y generación de tarjetas gráficas |
| MoviePy | 2.2.1 | Disponible para composición; el render final se hizo con FFmpeg |
| NumPy | 2.5.5 | Procesamiento numérico auxiliar |
| ImageIO | 2.38.2 | Soporte de lectura/escritura de imágenes |
| SoundFile | 0.14.0 | Inspección de audio |

Entorno Python aislado: `.venv-media/` en la raíz del proyecto. Está ignorado por Git y no
modifica las dependencias del portfolio.

## Transcripción y OCR

| Herramienta | Versión | Función |
| --- | --- | --- |
| faster-whisper | 1.2.1 | Prueba de transcripción local en CPU con modelo `base` |
| PyAV | 15.0.0 | Backend de decodificación para faster-whisper (versión fijada por compatibilidad) |
| Tesseract OCR | 5.4.0.20240606 | OCR del panel de instrucciones para localizar ejercicios, pasos y comandos |

### Resultado del análisis de audio

- **Lab 1:** la pista AAC está en silencio digital (media y pico de −91 dB). No hay voz.
- **Lab 2:** la pista tiene ruido de fondo de nivel muy bajo; al amplificarla, Whisper no
  produjo una transcripción fiable. No se utilizó como fuente de contenido.
- **Decisión:** no se inventó narración ni se atribuyeron explicaciones al instructor. El
  análisis se basa en la imagen, el OCR de las instrucciones y las acciones visibles.

## Documentación y desarrollo

| Herramienta | Versión | Función |
| --- | --- | --- |
| Astro | 7.4.13 | Generación estática del portfolio |
| Tailwind CSS | 4.3.5 | Estilos |
| @astrojs/mdx | 8.1.6 | Páginas de práctica en MDX |
| @astrojs/markdown-remark | 7.3.10 | Procesador Markdown/Unified |
| Sharp | 0.35.5 | Generación de iconos y OG |
| TypeScript | 6.0.3 | Comprobación de tipos |
| Git | 2.56.1 | Control de versiones local |

## Comandos principales

```bash
# Comprobar el entorno
node --version
npm --version
python --version
ffmpeg -version
ffprobe -version

# Crear el entorno aislado
python -m venv .venv-media
.venv-media\Scripts\python.exe -m pip install -r requirements-media.txt

# Analizar duración y códecs
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_type,width,height -of json <video>

# Extraer audio y comprobar nivel
ffmpeg -ss 00:05:00 -t 00:01:30 -i <video> -vn -ac 1 -ar 16000 -c:a pcm_s16le sample.wav
ffmpeg -i sample.wav -af volumedetect -f null -

# Extraer un fotograma
ffmpeg -y -ss 00:09:30 -i <video> -frames:v 1 frame.jpg

# Transcribir una muestra (se conserva el script local)
.venv-media\Scripts\python.exe media-work\transcribe.py sample.wav out.jsonl --model base --vad

# OCR del panel de instrucciones
.venv-media\Scripts\python.exe media-work\ocr_panel.py <video> out.jsonl --interval 20

# Generar evidencias recortadas y redactadas
.venv-media\Scripts\python.exe media-work\build_evidence.py
.venv-media\Scripts\python.exe media-work\fix_evidence.py

# Generar vídeos editados y resúmenes 9:16
.venv-media\Scripts\python.exe media-work\build_videos.py

# Validar el portfolio
npm run build
```

`requirements-media.txt` contiene las dependencias del entorno de análisis. No se añadieron
al `package.json` del portfolio.

## Material consultado

- Grabaciones originales en `C:\Users\Izan\Desktop\Cyber\SOC\SOC_Labs\`:
  - `Lab1.Understanding Cyber Threats, IoCs, and Attack Methodology/`
  - `Lab2.LogManagement/` (cuatro partes)
- Material del curso en `C:\Users\Izan\Desktop\Cyber\SOC\SOC_Tools\EC-COUNCIL\`:
  - `Module 02 Understanding Cyber Threats, IoCs, and Attack Methodology.zip`
  - `Module 03 Log Management.zip`
  - `Additional Reference Material.zip`
  - `Lab Prerequisites.zip`
- Notas locales de teoría en `C:\Users\Izan\Desktop\Cyber\SOC\Teoría\`.
- Interfaz de laboratorio visible en las grabaciones (`labclient.labondemand.com`).
- Página oficial de tareas del curso en `https://eccouncil.learnondemand.net/CourseAssignment/1849872`:
  - Lab 1, *Understanding Cyber Threats, IoCs, and Attack Methodology*: aprobado, finalizado el 28/10/2026.
  - Lab 2, *Log Management*: aprobado, finalizado el 04/11/2026.
  - *Incident Detection and Triage*: guardado/iniciado, fuera del alcance de esta entrega.
- Documentación pública citada en cada informe: OWASP, MITRE ATT&CK, Microsoft Learn,
  Nmap, Hydra, Snort, Splunk y Wireshark.

No se abrió ni se reprodujo `SOC_Tools\CLAVES.txt`. No se usaron credenciales, tokens,
cookies ni claves API. No se accedió al lector de ebooks ni se descargó material protegido;
la plataforma del curso se consultó únicamente para confirmar el estado y la estructura de
los laboratorios. Los informes se redactaron a partir de lo que aparece en las grabaciones.

## Límites conocidos

- Las grabaciones no tienen narración utilizable; el informe no puede citar explicaciones
  del instructor.
- El panel de instrucciones del curso no se incluye en las capturas publicables: las
  evidencias están recortadas al área de la máquina.
- Los vídeos editados y los resúmenes están alojados en el repositorio público
  `iSayago/izan-cybersecurity-media` (GitHub Pages) y enlazados desde las fichas.
- La edición v2 conserva solo ejecuciones correctas; se descartaron comandos fallidos,
  reintentos y esperas. El clip de Hydra recorta el historial de errores y no muestra la
  contraseña.
- Las capturas propias que se consultaron durante la grabación se insertan como evidencia
  de la práctica, con la etiqueta correspondiente.
- El repositorio de medios usa HTTPS y responde con `Content-Type: video/mp4` y
  `Accept-Ranges: bytes`; la web mantiene los MP4 fuera del repositorio del portfolio.
- La pista de audio de Lab 1 es silencio digital; añadir música o voz requeriría una
  producción posterior y no se ha hecho para no presentar como original algo que no lo es.
