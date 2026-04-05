# Automatización máxima — Matic Solutions

Objetivo: repetir el mismo **pipeline** con mínima fricción humana; el humano valida bordes (dinero, legal, acceso a sistemas).

## 1. Entrada única de trabajo (ticket / lead)

Campos mínimos (formulario Notion, Google Form, Tally o Typeform):

| Campo | Uso |
|-------|-----|
| Nombre empresa + contacto | CRM |
| Tipo: Lead / Cliente / Soporte / Proyecto | Enrutado CEO |
| Objetivo en una frase | CEO → departamento |
| Presupuesto aproximado (rango) | VTA + ING |
| Urgencia / fecha | OPS |
| Enlace a docs existentes | ING / MKT |

**Automatizable:** al enviar el formulario, n8n/Make crea fila en Airtable/Notion + envía email interno + (opcional) prompt a API con el JSON del formulario para generar **primer borrador** de respuesta (VTA o SUP).

## 2. Pipelines concretos (copiar a tu automatizador)

### A) Lead → primera respuesta comercial

1. Trigger: nuevo row “Lead”.
2. Acción IA: rol **VTA** — email de respuesta + 3 preguntas discovery.
3. Humano: enviar o editar.
4. Si responden: marcar “Calificado” → CEO asigna ING para **mini-diagnóstico** (1 página).

### B) Contenido redes (semana)

1. Trigger: lunes 08:00 o “Aprobar calendario”.
2. IA rol **MKT**: 5 ideas + 2 hooks por red + CTA.
3. OPS: checklist “fecha / formato / marca”.
4. Humano: aprobar publicación o programar en Buffer/Meta.

### C) Soporte cliente

1. Trigger: email a `soporte@` o etiqueta “Soporte”.
2. IA rol **SUP**: respuesta + clasificación (técnico/comercial/general).
3. Si técnico: crear subtarea “ING” con handoff.
4. SLA: recordatorio automático a las 24 h si “Pendiente”.

### D) Proyecto de automatización (tu producto)

1. **ING**: arquitectura + lista de integraciones + riesgos.
2. **OPS**: hitos y DoD por hito.
3. **VTA** (si hace falta): propuesta alineada al alcance técnico.
4. **SUP**: plan de onboarding post-entrega.

## 3. Qué automatizar primero (orden recomendado)

1. **Formulario → fila + notificación** (sin IA).
2. **Plantilla de handoff** + carpeta por cliente en Drive/Notion.
3. **Un solo prompt** “clasificador CEO” que devuelva JSON: `{departamento, siguiente_paso, preguntas_faltantes}`.
4. **Respuestas tipo** para VTA y SUP (mayor volumen, menor riesgo).
5. **ING** solo después de tener alcances repetibles (evita estimaciones fantasía).

## 4. Límites (no automatizar sin humano)

- Firma de contratos y precio cerrado.
- Acceso a producción del cliente (credenciales).
- Comunicación de incumplimiento o descuentos fuertes.
- Cualquier afirmación legal/regulatoria.

## 5. Stack sugerido (mínimo)

- **Notion o Airtable**: CRM ligero + estado del pipeline.
- **n8n** (self-host o cloud) o **Make**: triggers y webhooks.
- **Cursor + AGENTS.md**: taller de documentos, código y prompts.
- **Opcional:** API OpenAI/Anthropic con prompt system = rol MKT/VTA/etc. guardado como texto versionado en `agencia/prompts/` (cuando quieras, lo añadimos).
