# CS Real Estate — marketing digital (Google Ads, Meta, medición)

> **Copia para el repo.** El original vive en la compu de Cris (Workshop, carpetas `NEGOCIO/Marketing/` y `NEGOCIO/Comunicacion/`; plantilla en `NEGOCIO/Marketing/Repo-GitHub/CLAUDE-repo.md`). Versión de esta copia: 2026-10-28. Si en una sesión de la nube se cambia algo acá, avisale a Cris qué archivo cambió para que lo pase al original; si no, la próxima vez que suba la copia se pisa.

**Al empezar cualquier sesión, leé `contexto/estado-y-pendientes.md`.** Ahí está dónde estamos, qué se decidió y qué falta.
No le vuelvas a preguntar a Cris lo que ya figura ahí. Última actualización de este índice: 2026-10-28.

## Quién y qué
Cris (Cristian Stedtfeld) es agente inmobiliario en Red Suma (corredor responsable: VL REALTOR S.R.L.), CABA y Zona Norte.
Sitio: https://csrealestate.com.ar. **Objetivo:** consultas de propietarios (captación) de calidad; meta de 2 a 3 por día.
Resultados, presupuestos de hoy y tiempos quietos: `contexto/estado-y-pendientes.md` (no se repiten acá para que no se desactualicen).

## Cómo trabajar con Cris
- Español rioplatense (vos), sin jerga. No es técnico y se abruma con muchas plataformas: cuando tiene que tocar una (Editor de Google Ads, GTM, GA4, Meta), **instrucciones paso a paso, definiendo cada
  paso** (dónde hacer clic, qué debería ver, cómo sabe que salió bien). Una cosa por vez. Respuestas cortas. Tus preguntas van juntas en un solo mensaje.
- Si no podés comprobar algo en vivo (cuentas, GTM, Ads), decilo y dejá el paso de prueba para él. Nunca digas que algo funciona si no se probó.
- Los cambios en cuentas y en el sitio **no se aplican sin su OK**. Se preparan como borrador (CSV para el Editor, archivos para subir) y
  los aplica él. Después de un lote de cambios: 3 semanas sin tocar en Google y 2 en Meta.
- Antes de recomendar un cambio en cuentas, comprobarlo con sus datos (export, informes o conector); los archivos del Editor tienen que llegar listos, sin pasos de arreglo; no eliminar campañas (Cris, 24/10/2026).
- Recomendá con criterio y decisión: su regla de OK es para aplicar, no para que no aconsejes.
- Nunca datos personales de consultas en archivos, commits ni chat (nombres, teléfonos, emails). No subir `leads.jsonl` ni CSV de leads.

## Reglas que no se rompen
- `generate_lead` (Google) y `Lead` (Meta): una sola vez por consulta, igual que hoy. No tocar `click_boton`, `click_whatsapp`, `click_form`,
  `PageView`, `Contact`, ni `boton_id`, `lead_type`, `form_name`, `gclid`/`utm_*`.
- No sumar una segunda copia de GTM, GA4 ni del píxel. La etiqueta directa de Google Ads en GTM sigue pausada (ruta: GTM → GA4 → Google Ads).
- Sin la palabra "tasación", "tasar" ni "tasador" en lo que ve el cliente (sí como palabra clave de búsqueda). Se dice "cuánto vale" o
  "análisis de mercado". CABA, no "Capital". El Instagram de Cris (`@cristian.sted`) es público, pero por ahora no se nombra ni se linkea en textos, anuncios, web ni piezas (Cris, 21/10/2026; Meta sí pauta en Instagram y el anuncio del local usa su reel). Sin matrícula a nombre de Cris. No inventar datos, números ni reseñas. Reglas de texto completas: `contexto/voz-y-copy.md`.
- En Meta: sin categoría "Vivienda"; el clic final de "Publicar" lo hace Cris.

## Identificadores
GTM `GTM-5JDWTPXN` · GA4 `G-4LDVRLTWFC` · Google Ads cuenta 921-755-2199 (`AW-18445706531`, `GT-WPT9PPBN`) ·
Meta: cuenta "IG Real Estate" `act=2105334063528925`, business `1439717201317750`, píxel `1586039593247372`.

## Mapa de contextos
| Archivo | Para qué |
|---|---|
| `contexto/estado-y-pendientes.md` | Estado, decisiones tomadas, pendientes y revisiones. **Leer primero.** |
| `contexto/google-ads.md` | Estructura de la cuenta, resultados, diagnóstico, lotes y qué no se hace. |
| `contexto/meta-ads.md` | Campañas, resultados, anomalía del píxel, qué hacer y detalle operativo. |
| `contexto/medicion-y-sitio.md` | Sitio, formularios, temperatura, GTM, GA4, conversiones, `hot_lead` y deploy. |
| `contexto/voz-y-copy.md` | Reglas de texto de Cris: voz, palabras, mensajes y anuncios. Leer antes de escribir cualquier copy. |
| `contexto/historial-de-cambios.md` | Una fila por cambio hecho (fecha, plataforma, qué, campañas). |
| `hot_lead/` | Paquete del evento `hot_lead` (archivos del sitio, guía, diff). |
| `lote1_google_ads/` | Guía paso a paso y CSV para importar en el Editor (primera tanda, 13/10). |
| `crm/CRM_Inmobiliario.xlsx` | Planilla de ejemplo. El CRM real de Cris todavía no está vinculado con Claude (no confundir con el CRM de Red Suma, admin.redsuma.com.ar, que se usa solo para el ACM). |
| `prompts/` | Prompts de otras sesiones para la home y los formularios del sitio. |

## Al cerrar una tarea
Actualizá `contexto/estado-y-pendientes.md` (qué se hizo, fecha, qué sigue) y el contexto de la plataforma que cambió. Sumá una fila en `contexto/historial-de-cambios.md` y avisale a Cris qué archivos de `contexto/` cambiaron para que los pase al original de su compu.
El documento resumen para Cris está en Claude Docs (enlace en `estado-y-pendientes.md`).
