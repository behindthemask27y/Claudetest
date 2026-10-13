# Medición y sitio — CS Real Estate

Última actualización: 2026-10-13. Es la fuente de verdad de cómo se miden las consultas. Si algo de acá cambia,
actualizalo en el mismo momento.

## Piezas y cómo se conectan
Sitio (home + 5 formularios) → `dataLayer` → **GTM** `GTM-5JDWTPXN` → **GA4** `G-4LDVRLTWFC` → **Google Ads**
(importa los eventos de GA4). Además GTM manda eventos al **píxel de Meta** `1586039593247372`.
Los **formularios instantáneos de Meta** viven dentro de Meta y NO pasan por el sitio ni por el píxel.
El seguimiento de cada consulta se anota a mano en `crm/CRM_Inmobiliario.xlsx`.

La etiqueta directa de Google Ads en GTM (`AW-18445706531`) está **pausada a propósito**: la ruta es
GTM → GA4 → Google Ads. No reactivarla sin OK.

## El sitio
- HTML estático + PHP en Hostinger. Carpeta pública `public_html`; las consultas se guardan **fuera** de la
  carpeta pública (`leads_privados/leads.jsonl`) y los intentos de verlas dan 403/404.
- 5 formularios: `/form/vender/` (lead_type `vender`), `/form/valor-prop/` (`tasacion`), `/form/comprar/` (`comprar`),
  `/form/alquilar-mi-propiedad/` (`alquilar_propiedad`), `/form/buscar-alquiler/` (`buscar_alquiler`).
  Los nombres internos con "tasacion" NO se cambian (los usan la medición y Google Ads).
- `form/motor.js` arma los formularios (una pregunta por pantalla) y manda cada consulta a `enviar-lead.php`.
  El `?v=` de `motor.js` en los 5 `index.html` es el **sha256 (8 caracteres) del archivo**. Hoy: `36269df0`.
- `enviar-lead.php` valida, guarda la consulta, **calcula la temperatura**, manda un mail y responde
  `{ok:true, hot:true|false}`.
- Cada consulta guarda `gclid`, `gbraid`, `wbraid` y los `utm_*` (se capturan en la home o en el formulario y se
  guardan 90 días en `localStorage`). Las campañas de Google pasan `utm_source=google&utm_medium=cpc&utm_campaign=<nombre>&utm_term={keyword}&utm_content={creative}` como sufijo de URL final.

## Temperatura de la consulta (la calcula el servidor)
Tres ejes de 0 a 2 puntos: ¿Cuándo? ¿Puede? ¿Quiere avanzar? **5 o 6 = Caliente · 3 o 4 = Tibia · 0 a 2 = Fría.**
La pregunta de vacaciones (rompehielos) no suma. Tablas completas en `enviar-lead.php` (variable `$PUNTOS`).
Caso límite conocido: en el formulario de valor, una consulta sale CALIENTE con plazo "entre 3 y 12 meses"
(dueño 2 + "para vender" 2 + plazo 1 = 5). Se ajusta con consultas reales (hay que mirar cuáles avanzaron).
El asunto del mail lleva 🔥 Caliente / 🌡️ Tibia / ❄️ Fría y el cuerpo explica cómo salió el puntaje.

## GTM (versión publicada: 6; `Tracking 1.5 - hot_lead` es la que agrega hot_lead — confirmar que está publicada)
| Evento del sitio | Activador | Etiquetas |
|---|---|---|
| `generate_lead` | `Custom Event - generate_lead` | `GA4 - generate_lead` (parámetros `lead_type`, `form_name`, `page_location`) y `Meta Pixel - Lead` |
| `hot_lead` | `Custom Event - hot_lead` | `GA4 - hot_lead` y `Meta Pixel - hot_lead` (`fbq('trackCustom','hot_lead')`) |
| `click_boton` con `boton_id` | un activador por botón (WhatsApp, ver propiedades, ver desarrollos, mi método, formularios) | etiquetas `GA4 - …` (`click_whatsapp`, `click_form`, `ver_*`) y `Meta Pixel - …` (`Contact`, `click_form`, `ver_*`) |
Todas las etiquetas de GA4 usan el ID de medición `G-4LDVRLTWFC`. El botón de WhatsApp de la pantalla final de
los formularios (`boton_id: whatsapp-gracias`) **no** dispara `click_whatsapp` ni `Contact`, a propósito.

## Conversiones en Google Ads (importadas de GA4)
- **Principal:** `GA4 CS (web) generate_lead` (categoría: Envío de formularios para clientes potenciales). Cuenta los 5 formularios por igual.
- **Secundarias:** `click_whatsapp`, `click_form`, `ver_propiedades`, `ver_desarrollos`, `ver_mimetodo` y **`hot_lead`**
  (categoría Contacto; acción secundaria; sin valor; recuento "una"; ventana 90 días; atribución basada en datos).
- Retiradas: `vendedor_form`, `rent_form`, `value_form`, `contact_whatsapp` y "Contacto (Carga de la página wa.me)".

## Meta
- Píxel `1586039593247372`: `PageView`, `Lead` (en `generate_lead`), `Contact` (4 botones de WhatsApp), `click_form`, `ver_*`, `hot_lead`.
- **Anomalía abierta (13/10):** de 245 `Lead` (14/9–11/10), 219 llegaron como **eventos de servidor**, la mayoría entre
  el 12 y el 13/10, unos 24 por hora. El sitio y GTM no mandan eventos de servidor, así que la fuente no está
  identificada (¿prueba del Explorador de la API Graph? ¿integración?). Hasta aclararlo, no optimizar ni armar
  públicos con `Lead`. Dónde mirar: Events Manager → conjunto de datos → *Historial* y *Configuración*.

## Historia que explica los datos
- 22/9: se publican los formularios, pero quedó una versión vieja (sin atribución y con error en las opciones únicas).
- 8/10 ~17:32: se corrige el deploy. Las consultas anteriores casi no tienen origen (`gclid`) y sus respuestas de
  opción única, como el plazo, no son confiables.
- 12/10: formularios nuevos con rompehielos y temperatura en el mail.
- 13/10: se arma `hot_lead` (carpeta `hot_lead/` del repo).

## Cómo se despliega y se prueba
- Deploy: subir un zip con las carpetas explícitas y rutas con `/` (el 8/10 fallaron los archivos dentro de carpetas
  con otro método). Después **verificar en vivo**: abrir `https://csrealestate.com.ar/form/motor.js?v=<hash>` y buscar un texto nuevo.
- Prueba de `hot_lead`: GTM *Vista previa*, formulario `/form/vender/` con plazo "Lo antes posible", dueño único,
  escritura y "coordinar una reunión" = CALIENTE 6/6 (dispara `hot_lead`). `/form/valor-prop/` con "No pienso vender" +
  dueño + "para vender" = TIBIA 4/6 (no dispara). Hacerlas sin entrar desde un anuncio y marcarlas como prueba.

## Reglas de medición (no se rompen)
- `generate_lead` y `Lead`: una sola vez por consulta enviada, igual que siempre.
- No sumar una segunda copia de GTM, GA4 ni del píxel. No cambiar `boton_id`, `lead_type`, `form_name` ni la atribución.
- Un cambio que pueda alterar algo de esto se explica y espera el OK de Cris.
- No decir que la medición funciona si no se probó.
