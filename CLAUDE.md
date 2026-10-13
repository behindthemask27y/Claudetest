# CS Real Estate — marketing digital (Google Ads, Meta, medición)

**Al empezar cualquier sesión, leé `contexto/estado-y-pendientes.md`.** Ahí está dónde estamos, qué se decidió y qué falta.
No le vuelvas a preguntar a Cris lo que ya figura ahí. Última actualización de este índice: 2026-10-13.

## Quién y qué
Cris (Cristian Stedtfeld) es agente inmobiliario en Red Suma (corredor responsable: VL REALTOR S.R.L.), CABA y Zona Norte.
Sitio: https://csrealestate.com.ar. **Objetivo:** consultas de propietarios (captación) de calidad; meta inmediata de 1 consulta por día (a futuro 2 a 3)
(hoy ~0,6 por día y 0 clientes). Presupuesto activo: Google 8.500 por día (desde el Lote 1 del 13/10) y Meta 10.000 por día (pesos).
**Lote 1 de Google Ads publicado el 13/10: no tocar las campañas de Google hasta la revisión del 3/11/2026.**

## Cómo trabajar con Cris
- Español rioplatense (vos), sin jerga. No es técnico y se abruma con muchas plataformas: **instrucciones paso a paso, definiendo cada
  paso** (dónde hacer clic, qué debería ver, cómo sabe que salió bien). Una cosa por vez. Respuestas cortas.
- Si no podés comprobar algo en vivo (cuentas, GTM, Ads), decilo y dejá el paso de prueba para él. Nunca digas que algo funciona si no se probó.
- Los cambios en cuentas y en el sitio **no se aplican sin su OK**. Se preparan como borrador (CSV para el Editor, archivos para subir) y
  los aplica él. Después de un lote de cambios en campañas: 3 semanas sin tocar.
- Recomendá con criterio y decisión: su regla de OK es para aplicar, no para que no aconsejes.
- Nunca datos personales de consultas en archivos, commits ni chat (nombres, teléfonos, emails). No subir `leads.jsonl` ni CSV de leads.

## Reglas que no se rompen
- `generate_lead` (Google) y `Lead` (Meta): una sola vez por consulta, igual que hoy. No tocar `click_boton`, `click_whatsapp`, `click_form`,
  `PageView`, `Contact`, ni `boton_id`, `lead_type`, `form_name`, `gclid`/`utm_*`.
- No sumar una segunda copia de GTM, GA4 ni del píxel. La etiqueta directa de Google Ads en GTM sigue pausada (ruta: GTM → GA4 → Google Ads).
- Sin la palabra "tasación", "tasar" ni "tasador" en lo que ve el cliente (sí como palabra clave de búsqueda). Se dice "cuánto vale" o
  "análisis de mercado". CABA, no "Capital". Sin Instagram (no es público). Sin matrícula a nombre de Cris. No inventar datos, números ni reseñas.
- En Meta: sin categoría "Vivienda"; el clic final de "Publicar" lo hace Cris.
- **No se eliminan campañas ni grupos** en Google Ads ni en Meta: se **pausan** (eliminar es permanente y deja la etiqueta "quitada").
  Excepción: borradores del Editor que nunca se publicaron.

## Identificadores
GTM `GTM-5JDWTPXN` · GA4 `G-4LDVRLTWFC` · Google Ads cuenta 921-755-2199 (`AW-18445706531`, `GT-WPT9PPBN`) ·
Meta: cuenta "IG Real Estate" `act=2105334063528925`, business `1439717201317750`, píxel `1586039593247372`.

## Mapa de contextos
| Archivo | Para qué |
|---|---|
| `contexto/estado-y-pendientes.md` | Estado, decisiones tomadas, pendientes y revisiones. **Leer primero.** |
| `contexto/google-ads.md` | Estructura de la cuenta, resultados, diagnóstico, Lote 1 y qué no se hace. |
| `contexto/meta-ads.md` | Campañas, resultados, anomalía del píxel, qué hacer y detalle operativo. |
| `contexto/medicion-y-sitio.md` | Sitio, formularios, temperatura, GTM, GA4, conversiones, `hot_lead` y deploy. |
| `hot_lead/` | Paquete del evento `hot_lead` (archivos del sitio, guía, diff). |
| `lote1_google_ads/` | Guía paso a paso y CSV para importar en el Editor. |
| `crm/CRM_Inmobiliario.xlsx` | CRM donde Cris anota qué pasó con cada consulta. |
| `prompts/` | Prompts de otras sesiones para la home y los formularios del sitio. |

## Al cerrar una tarea
Actualizá `contexto/estado-y-pendientes.md` (qué se hizo, fecha, qué sigue) y el contexto de la plataforma que cambió.
El documento resumen para Cris está en Claude Docs (enlace en `estado-y-pendientes.md`).
