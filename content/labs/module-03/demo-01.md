---
title: "DEMO — Normalización de eventos de autenticación"
description: "Ejemplo incompleto de informe para mostrar la cobertura documental y las secciones pendientes. Los datos y el procedimiento son sintéticos."
module: "03"
practice: 1
date: 2026-11-08
categories:
  - Log Management
tags:
  - Windows Event Logs
  - Normalization
  - Data model
tools: []
status: demo
featured: false
---

Este informe se deja incompleto de forma deliberada. Sirve para comprobar que la
web muestra las secciones que faltan en lugar de rellenarlas con texto genérico.

## Objetivo

Describir cómo se normalizarían eventos de autenticación de Windows y qué campos
mínimos debería conservar el modelo de datos para permitir una investigación.

## Contexto y entorno del laboratorio

El escenario es una instalación de ejemplo con un único colector y eventos
generados manualmente. No se ha conectado a un dominio real ni se han utilizado
credenciales reales.

```json
{
  "timestamp": "2026-11-08T09:14:02Z",
  "host": "WIN-CLIENT-01",
  "event_code": 4625,
  "account": "analyst.demo",
  "source_ip": "198.51.100.24",
  "logon_type": 3,
  "status": "0xC000006D",
  "demo": true
}
```

## Procedimiento realizado

1. Identificar los campos comunes entre eventos 4624 y 4625.
2. Definir un esquema mínimo: tiempo, host, cuenta, origen, resultado y tipo de logon.
3. Documentar las transformaciones aplicadas y las que se descartan.
4. Validar que el esquema permite responder preguntas de triage sin volver al log bruto.

| Campo normalizado | Origen | Motivo |
| --- | --- | --- |
| `timestamp` | `TimeCreated` | Orden y correlación temporal |
| `account` | `TargetUserName` | Identidad observada |
| `source_ip` | `IpAddress` | Contexto de red |
| `result` | `Status` / `EventCode` | Resultado de la autenticación |

El resto de apartados se completará cuando exista una práctica real que documentar.
