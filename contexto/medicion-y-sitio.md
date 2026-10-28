# Medición y sitio — CS Real Estate

> **Copia para el repo.** El original vive en la compu de Cris (`NEGOCIO/Marketing/Medicion-y-sitio/contexto-medicion-y-sitio.md`). Versión de esta copia: 2026-10-28. Las rutas que empiezan con `NEGOCIO/`, `Archivo/` o `Programas Claude/` existen solo en su compu. Si en una sesión de la nube se cambia algo acá, avisale a Cris qué archivo cambió para que lo pase al original; si no, la próxima vez que suba la copia se pisa.

**Qué es:** cómo se miden las consultas (sitio → GTM → GA4 → Google Ads y Meta) y qué no se puede romper.
**Cuándo leerlo:** medición, conversiones, GTM, GA4, píxel, `hot_lead`, formularios del sitio, botones nuevos, cualquier cambio al sitio que reciba tráfico de anuncios. Va junto con `contexto/estado-y-pendientes.md`.
**Última actualización:** 2026-10-13. Es la fuente de verdad de cómo se miden las consultas. Si algo de acá cambia, actualizalo en el mismo momento.

## Identificadores
GTM `GTM-5JDWTPXN` · GA4 `G-4LDVRLTWFC` · Google Ads cuenta 921-755-2199 (`AW-18445706531`, `GT-WPT9PPBN`) · Meta: cuenta "IG Real Estate" `act=2105334063528925`, business `1439717201317750`, píxel `1586039593247372`.
El código del sitio vive en `NEGOCIO/Sitio-web/` (hoy `#2 CSREALESTATE.COM.AR/`); su `CLAUDE.md` tiene el detalle completo de cada decisión.

## Piezas y cómo se conectan
Sitio (home + 5 formularios) → `dataLayer` → **GTM** `GTM-5JDWTPXN` → **GA4** `G-4LDVRLTWFC` → **Google Ads**
(importa los eventos de GA4). Además GTM manda eventos al **píxel de Meta** `1586039593247372`.
Los **formularios instantáneos de Meta** viven dentro de Meta y NO pasan por el sitio ni por el píxel.
El seguimiento de cada consulta se anota a mano en el CRM propio de Cris (todavía no vinculado con Claude). No confundirlo con el CRM de Red Suma (admin.redsuma.com.ar), que se usa solo para el ACM.

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
- **Origen de una consulta de Meta (20/10):** el sitio guarda `gclid` y `utm_*` pero **no** `fbclid`. Para saber qué anuncio la trajo, el anuncio lleva `utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}` en "Parámetros de URL" (sin verificar que el mail los muestre). Los formularios instantáneos de Meta no pasan por el sitio: el origen se ve en Meta (Centro de clientes potenciales). En WhatsApp no viene en el mensaje: usar un mensaje ya escrito distinto por campaña.
- **Anomalía de los 219 eventos `Lead` de servidor: aclarada el 20/10** con el Excel de eventos de Meta (22/9 al 20/10): `Lead` 40 del navegador y 233 de servidor. Desde el 2/10 cada `Lead` del navegador trae una copia de servidor (la "Puerta de entrada de la API de conversiones" está conectada: es lo esperado); el exceso es una ráfaga puntual: 12/10 con 183 de servidor contra 2 del navegador y 13/10 con 29 contra 5 (~210 sobrantes; origen no confirmado, coincide con los días en que se conectó la integración). Desde el 14/10 no hay sobrantes. Los 40 del navegador coinciden con los 44 `generate_lead` de GA4, así que `Lead` es confiable para optimizar desde ahora. `hot_lead`: 6 del navegador y 6 de servidor (el total de Meta, 12, cuenta las copias); `Contact`: 19 del navegador y 24 de servidor (9 sobrantes el 12/10). Falta confirmar en Diagnóstico que Meta deduplica las copias.

## Eventos registrados (revisado el 20/10 contra el export de GTM v6 y el código del sitio; sin probar en vivo)
El sitio manda un solo aviso de clic al `dataLayer`: `click_boton`, con `boton_id`, `boton_texto` y `destino`. GTM lo traduce según el `boton_id`:
| `boton_id` | GA4 | Meta |
|---|---|---|
| `whatsapp`, `whatsapp-icono`, `consulta-propiedad`, `consulta-desarrollo` | `click_whatsapp` (4 etiquetas) | `Contact` (4) |
| `ver-propiedades` | `ver_propiedades` | `ver_propiedades` |
| `ver-desarrollos` | `ver_desarrollos` | `ver_desarrollos` |
| `metodo` | `ver_mimetodo` | `ver_mimetodo` |
| contiene `tasacion`, `vender`, `comprar`, `alquilar-mi-propiedad` o `buscar-alquiler` | `click_form` (5) | `click_form` (5) |
| `email`, `email-icono`, `matricula`, `privacidad`, `whatsapp-gracias` | nada | nada |
- Aparte: `generate_lead` (GA4) / `Lead` (Meta) al enviar un formulario; `hot_lead` (GA4 y Meta) si sale CALIENTE (viene en la versión 1.5, que el export v6 no trae); `PageView` de Meta en todas las páginas (etiqueta Base). GA4 **no** manda `page_view` (decisión de Cris, 12/10; confirmado el 20/10: el informe de páginas muestra 0 vistas, pero sí hay `session_start` y `first_visit`): para visitas se usan usuarios y sesiones. Meta suma el evento automático "Mi método" (clic con el texto del botón, lo nombra Meta, no el sitio) junto a `ver_mimetodo`. El `CLAUDE.md` del sitio todavía dice `click_ver_propiedades` para Meta: está viejo, el export v6 dice `ver_propiedades`.
- **Links nuevos (18-19/10):** `propiedades/?p=<tipo>-<barrio>-<codigo>` abre el detalle directo y **no** manda `ver-propiedades` (no hubo clic; tocar una tarjeta sí lo manda). Su botón de WhatsApp manda `consulta-propiedad`. "Copiar link" y cerrar no mandan nada. Al abrir el detalle, la dirección pasa a `?p=…` y los `utm_*` desaparecen de la barra (GA4 ya los leyó al cargar); la página no guarda `gclid` ni `utm_*` (no tiene formulario). `desarrollos/ficha/?o=<obra>`: sus botones mandan `consulta-desarrollo`; tocar la tarjeta en la home manda `ver-desarrollos` y navega. Ninguna pieza nueva suma un `boton_id`.

## Historia que explica los datos
- 22/9: se publican los formularios, pero quedó una versión vieja (sin atribución y con error en las opciones únicas).
- 8/10 ~17:32: se corrige el deploy. Las consultas anteriores casi no tienen origen (`gclid`) y sus respuestas de
  opción única, como el plazo, no son confiables.
- 12/10: formularios nuevos con rompehielos y temperatura en el mail.
- 13/10: se arma `hot_lead` (carpeta `NEGOCIO/Marketing/Medicion-y-sitio/2026-10-13 Sitio - aviso de consulta caliente (hot_lead)/`; los 7 archivos ya están en el sitio en vivo).

## Cómo se despliega y se prueba
- Deploy: subir un zip con las carpetas explícitas y rutas con `/` (el 8/10 fallaron los archivos dentro de carpetas
  con otro método). Después **verificar en vivo**: abrir `https://csrealestate.com.ar/form/motor.js?v=<hash>` y buscar un texto nuevo.
- Prueba de `hot_lead`: GTM *Vista previa*, formulario `/form/vender/` con plazo "Lo antes posible", dueño único,
  escritura y "coordinar una reunión" = CALIENTE 6/6 (dispara `hot_lead`). `/form/valor-prop/` con "No pienso vender" +
  dueño + "para vender" = TIBIA 4/6 (no dispara). Hacerlas sin entrar desde un anuncio y marcarlas como prueba.

## Reglas de medición (no se rompen)
- `generate_lead` y `Lead`: una sola vez por consulta enviada, igual que siempre.
- No tocar `click_boton`, `click_whatsapp`, `click_form`, `PageView`, `Contact`, ni `boton_id`, `lead_type`, `form_name`, `gclid` / `utm_*`.
- No sumar una segunda copia de GTM, GA4 ni del píxel. La etiqueta directa de Google Ads en GTM sigue pausada (ruta GTM → GA4 → Google Ads).
- `hot_lead` se dispara solo con consultas CALIENTE (5 o 6 puntos de 6); tibia y fría no.
- Nada en las cuentas (Google Ads, Meta, GTM, hosting) se cambia sin el OK escrito de Cris.
- Un cambio que pueda alterar algo de esto se explica y espera el OK de Cris.
- No decir que la medición funciona si no se probó.
