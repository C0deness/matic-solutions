# Catálogo de escenarios — Centro de mando Matic

Referencia operativa: cada fila es un **escenario** enlazado a un `playbookId` en código (`web/src/command-center/scenarios.ts`).  
**PH** = puerta humana (tú / cliente según política).

| # | ID | Disparador típico | Depto inicial | Playbook | PH obligatorias |
|---|-----|-------------------|---------------|----------|-----------------|
| 1 | `ing.impl.nueva` | Cliente pide nueva automatización / IA en un proceso desde el chat | ING | `ing-discovery-to-arch-v1` | Alcance cerrado, precio |
| 2 | `ing.impl.ampliar` | Ampliar funcionalidad de una implementación ya activa | ING | `ing-change-request-v1` | Impacto en contrato |
| 3 | `sup.incidente.critico` | Caída, error bloqueante, datos incorrectos en prod | SUP → ING | `sup-p1-triage-v1` | Comunicación externa si afecta a terceros |
| 4 | `sup.howto` | “Cómo hago X” en el portal o herramienta entregada | SUP | `sup-l1-howto-v1` | — |
| 5 | `sup.metricas_estado` | Pedido de estado de KPIs / entregables del mes | SUP → OPS | `sup-status-pack-v1` | — |
| 6 | `mkt.contenido.calendario` | Lote semanal de contenidos para redes | MKT | `mkt-weekly-batch-v1` | Publicación en cuenta cliente |
| 7 | `mkt.contenido.campaña` | Campaña puntual (lanzamiento, feria, promo) | MKT | `mkt-campaign-v1` | Copy final + presupuesto ads |
| 8 | `mkt.analisis.resultados` | Análisis de métricas de redes / ads | MKT → OPS | `mkt-analytics-review-v1` | — |
| 9 | `mkt.creative.refresh` | Renovación de creatividades / anuncios | MKT | `mkt-creative-refresh-v1` | Gasto y creativos en plataforma |
| 10 | `vta.lead.inbound` | Nuevo lead entra (web, formulario, referido) | VTA | `vta-inbound-qualify-v1` | Propuesta económica |
| 11 | `vta.seguimiento` | Seguimiento tras propuesta o reunión | VTA | `vta-followup-v1` | Descuentos / plazos firmes |
| 12 | `vta.discovery.prep` | Preparar discovery con empresa objetivo | VTA | `vta-discovery-brief-v1` | — |
| 13 | `vta.objecion` | Objeción de precio o prioridad | VTA → CEO | `vta-objection-v1` | Precio final |
| 14 | `sup.onboarding` | Inicio de relación: accesos, calendario, contactos | SUP | `sup-onboarding-v1` | Credenciales producción |
| 15 | `sup.escalado.tecnico` | Triage L1 → necesita ingeniería | SUP → ING | `sup-escalate-engineering-v1` | Acceso a sistemas cliente |
| 16 | `ops.entrega.hito` | Cierre de fase / hito de roadmap | OPS | `ops-milestone-close-v1` | Aceptación formal cliente |
| 17 | `ops.calidad` | QA interno antes de enseñar al cliente | OPS | `ops-quality-gate-v1` | — |
| 18 | `ing.auditoria.proceso` | Mapear proceso actual y oportunidades IA | ING | `ing-process-audit-v1` | — |
| 19 | `ing.integracion` | Diseño de integración (API, ERP, correo, n8n) | ING | `ing-integration-design-v1` | Credenciales / compliance |
| 20 | `ceo.priorizacion` | Varios frentes; decidir orden y dueños | CEO | `ceo-prioritize-v1` | Compromisos de fecha |
| 21 | `ceo.conflicto_alcance` | Desacuerdo sobre qué está incluido | CEO | `ceo-scope-mediation-v1` | Firma de change order |
| 22 | `cli.formacion` | Petición de formación / taller de uso | SUP + ING | `del-training-v1` | Fechas y asistencia |
| 23 | `cli.renovacion` | Fin de periodo / renovación | VTA + CEO | `vta-renewal-v1` | Términos económicos |
| 24 | `sys.cron.semanal_mkt` | Cron: generar borrador de informe semanal redes | MKT | `mkt-weekly-report-auto-v1` | Envío al cliente |
| 25 | `sys.ingest.metricas` | Ingesta automática de métricas (API Meta/LinkedIn…) | OPS + MKT | `mkt-metrics-ingest-v1` | Tokens OAuth |
| 26 | `gen.triaje` | Mensaje ambiguo o sin coincidencia clara | CEO | `ceo-intake-triage-v1` | Clasificación final |
| 27 | `ing.poc.rapido` | POC rápido o prueba de concepto acotada | ING | `ing-poc-sprint-v1` | Límites de tiempo y datos |
| 28 | `ops.reporte.valor` | Informe “dónde generamos valor” para comité cliente | OPS | `ops-value-report-v1` | Cifras contractuales |

## Notas

- Los **playbookId** son versionables; el motor de orquestación (backend) ejecuta los pasos definidos en YAML/JSON.
- La app **web** reutiliza este catálogo **solo en consola operador** (`VITE_OPERATOR_CONSOLE=true` → `/operator/centro-de-mando`). El cliente del portal **no** ve escenarios ni playbooks; el chat solo acusa recibo.
- Actualizar este documento y `scenarios.ts` a la par.
