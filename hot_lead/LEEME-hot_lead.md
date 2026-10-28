# 2026-10-13 Sitio — aviso de consulta caliente (hot_lead) — guía paso a paso

> **Copia para el repo.** El original vive en la compu de Cris (`NEGOCIO/Marketing/Medicion-y-sitio/2026-10-13 Sitio - aviso de consulta caliente (hot_lead)/LEEME.md`). Versión de esta copia: 2026-10-28. Las rutas que empiezan con `NEGOCIO/`, `Archivo/` o `Programas Claude/` existen solo en su compu. Si en una sesión de la nube se cambia algo acá, avisale a Cris qué archivo cambió para que lo pase al original; si no, la próxima vez que suba la copia se pisa.

> **Estado (13/10/2026):** los 7 archivos ya están en el sitio en vivo (`motor.js?v=36269df0`). Según Cris: etiquetas y activador de GTM probados, evento clave creado en GA4 e importado en Google Ads como secundaria. Falta confirmar: que la versión de GTM esté publicada y que `hot_lead` aparezca en GA4 y Ads (ver `../../Marketing - Donde estamos y que falta.md`).
> **`hot_lead` = el aviso que manda el sitio a GTM, GA4, Google Ads y Meta cuando una consulta sale CALIENTE (5 o 6 puntos de 6).** Tibia y fría no lo disparan.
> En esta carpeta: este LEEME y `cambios.diff` (diferencias de código, antes y después; así se llama en el repo). Los 7 archivos publicados están solo en la compu de Cris.

## Qué es y cuándo se dispara
`hot_lead` es un evento nuevo que se dispara **solo cuando el mail de la consulta dice CALIENTE**, o sea, cuando el
formulario suma **5 o 6 puntos de 6**. Con TIBIA (3 o 4) o FRÍA (0 a 2) no se dispara.

Sigue exactamente cómo ya está armado tu sistema: el formulario avisa a GTM, GTM lo manda a GA4, y GA4 lo
comparte con Google Ads. Además se envía al píxel de Meta. **No cambia `generate_lead` ni `Lead`**: esos siguen
disparándose una sola vez por consulta, igual que hoy. No viaja ningún dato personal ni el puntaje.

## Los 5 pasos de un vistazo

| # | Paso | Dónde | Cuándo | Cómo sabés que salió bien |
|---|---|---|---|---|
| 1 | Subir 7 archivos | Tu hosting (Hostinger) | Hoy, 10 min | Aparece `hot_lead` dentro de `motor.js` en vivo |
| 2 | Crear 3 piezas | GTM | Hoy, 10 min | Quedan guardadas en el espacio de trabajo |
| 3 | Probar con 2 consultas | GTM (Vista previa) + tu sitio | Hoy, 10 min | La CALIENTE dispara `hot_lead` y la TIBIA no |
| 4 | Publicar | GTM | Hoy, 2 min | Aparece la versión "Tracking 1.5 - hot_lead" |
| 5 | Marcar y conectar | GA4 y Google Ads | **Mañana**, 5 min | `hot_lead` figura en GA4 y en Google Ads como secundaria |

**Orden:** primero el 1 (no rompe nada porque GTM todavía no escucha `hot_lead`), después 2, 3, 4 y mañana el 5.

---

## PASO 1 — Subir 7 archivos al sitio
**Qué es:** el sitio tiene que avisar cuándo una consulta sale CALIENTE.
**Dónde:** el administrador de archivos de tu hosting, carpeta `public_html`.
**Qué hacés:**
1. Subí `hot_lead-subir.zip` a `public_html` como lo hiciste el 8/10 con `formularios-solamente.zip`.
2. Extraelo ahí mismo (reemplaza los archivos que ya existen) y borrá el zip.

Los 7 archivos que cambian: `enviar-lead.php`, `form/motor.js` y los 5 `form/*/index.html` (en estos solo cambia
`?v=eb6afe4d` por `?v=36269df0`).
**Cómo sabés que salió bien** (tu CLAUDE.md avisa que los archivos de carpetas ya fallaron una vez al subirse):
- Abrí `https://csrealestate.com.ar/form/motor.js?v=36269df0` y buscá la palabra `hot_lead`. Tiene que aparecer.
- Abrí `https://csrealestate.com.ar/form/vender/`, ver código fuente, y buscá `motor.js?v=36269df0`.

## PASO 2 — GTM: crear 3 piezas
Entrá a tagmanager.google.com → contenedor **CS | Real Estate 21/09 GTM** (`GTM-5JDWTPXN`) → **Espacio de trabajo**.

**2A. El activador (el "cuándo")**
1. Menú izquierdo → **Activadores** → botón **Nuevo**.
2. Arriba a la izquierda poné el nombre: `Custom Event - hot_lead`.
3. **Configuración del activador** → elegí **Evento personalizado**.
4. **Nombre del evento:** `hot_lead` (todo en minúscula, con guion bajo).
5. **Este activador se activa en:** *Todos los eventos personalizados*.
6. **Guardar.**

**2B. La etiqueta de GA4 (la que cuenta en Google)**
1. Menú izquierdo → **Etiquetas** → abrí **GA4 - generate_lead**.
2. Arriba a la derecha, los tres puntitos **⋮** → **Duplicar**. Se abre la copia.
3. Cambiá el nombre a `GA4 - hot_lead`.
4. En **Configuración de la etiqueta**, en **Nombre del evento**, reemplazá `generate_lead` por `hot_lead`.
   Dejá los parámetros como están (`lead_type`, `form_name`, `page_location`).
5. En **Activación**, sacá el activador viejo con la X y elegí `Custom Event - hot_lead`.
6. **Guardar.**

Si no ves "Duplicar": **Nueva → Google Analytics: evento de GA4**, ID de medición `G-4LDVRLTWFC`, nombre del evento
`hot_lead`, parámetros `lead_type` = `{{DLV - lead_type}}` y `form_name` = `{{DLV - form_name}}`, activador
`Custom Event - hot_lead`.

**2C. La etiqueta de Meta (opcional, para tener el dato en el píxel)**
1. **Etiquetas → Nueva**, nombre `Meta Pixel - hot_lead`.
2. **Configuración de la etiqueta → HTML personalizado**, y pegá:
   ```html
   <script>
     if (typeof fbq === 'function') {
       fbq('trackCustom', 'hot_lead', {
         lead_type: '{{DLV - lead_type}}',
         form_name: '{{DLV - form_name}}'
       });
     }
   </script>
   ```
3. **Activación:** `Custom Event - hot_lead`.
4. **Guardar.**

**Cómo sabés que salió bien:** en la lista de Etiquetas aparecen `GA4 - hot_lead` y `Meta Pixel - hot_lead`, y en
Activadores aparece `Custom Event - hot_lead`. Todavía no están publicadas.

### Cómo debe quedar cada pieza (para comparar)
Las dos piezas originales (`generate_lead` y `Meta Pixel - Lead`) **no se tocan**. Solo se agregan las 3 nuevas.

| Pieza | Tipo | Configuración |
|---|---|---|
| Activador `Custom Event - generate_lead` (original) | Evento personalizado | Nombre del evento: `generate_lead` · Se activa en: *Todos los eventos personalizados* |
| Activador `Custom Event - hot_lead` (nuevo) | Evento personalizado | Nombre del evento: `hot_lead` · Se activa en: *Todos los eventos personalizados* |
| Etiqueta `GA4 - generate_lead` (original) | Evento de GA4 | Nombre del evento: `generate_lead` · Parámetros: `lead_type` = `{{DLV - lead_type}}`, `form_name` = `{{DLV - form_name}}`, `page_location` = `{{Page URL}}` · Activación: **`Custom Event - generate_lead`** |
| Etiqueta `GA4 - hot_lead` (nueva) | Evento de GA4 | Nombre del evento: `hot_lead` · mismos parámetros · Activación: **`Custom Event - hot_lead`** |
| Etiqueta `Meta Pixel - Lead` (original) | HTML personalizado | `fbq('track','Lead', …)` · Activación: **`Custom Event - generate_lead`** |
| Etiqueta `Meta Pixel - hot_lead` (nueva) | HTML personalizado | `fbq('trackCustom','hot_lead', …)` · Activación: **`Custom Event - hot_lead`** |

**Error típico al duplicar:** modificar la etiqueta *original* en vez de la copia. Revisá en GTM, en *Espacio de trabajo →
Cambios del espacio de trabajo*: tienen que figurar **3 elementos agregados** (el activador y las 2 etiquetas nuevas) y
**ninguno modificado**. Si `GA4 - generate_lead` figura como modificada, revertila a como está en la tabla de arriba.
Nada de esto afecta tu sitio hasta que apretás *Publicar* (Paso 4): la versión activa sigue siendo la 6.

## PASO 3 — Probar (antes de publicar)
**Qué es:** comprobar que `hot_lead` se dispara solo con las CALIENTES.
1. En GTM, arriba a la derecha, botón **Vista previa**. Escribí `https://csrealestate.com.ar/form/vender/` y **Conectar**.
   Se abre tu sitio con un panel de depuración (Tag Assistant).
2. Completá la consulta **CALIENTE** (abajo) en esa ventana y enviala.
3. En el panel de Tag Assistant, columna izquierda, vas a ver **dos eventos seguidos**: primero `generate_lead` y
   justo después `hot_lead`. **Cada evento muestra sus propias etiquetas** (hacele clic y mirá *Tags Fired*):
   - evento `generate_lead` → `GA4 - generate_lead` y `Meta Pixel - Lead`
   - evento `hot_lead` → `GA4 - hot_lead` y `Meta Pixel - hot_lead`

   Es normal que no aparezcan las 4 juntas en el mismo evento.
4. Repetí con la consulta **TIBIA** en `https://csrealestate.com.ar/form/valor-prop/`. Acá solo aparece el evento
   `generate_lead` (con sus 2 etiquetas). El evento `hot_lead` **no** aparece.

| Prueba | Formulario | Respuestas | Mail que te llega |
|---|---|---|---|
| **CALIENTE** | `/form/vender/` | ¿Para cuándo?: *Lo antes posible* · ¿Sos el dueño?: *Soy el único dueño* · Papeles: *Escritura* · ¿Cómo seguir?: *Quiero coordinar una reunión* | **CALIENTE · 6 de 6** |
| **TIBIA** | `/form/valor-prop/` | ¿Cuándo pensás vender?: *No pienso vender* · ¿Sos el dueño?: *Soy el único dueño* · ¿Para qué?: *Para vender* | **TIBIA · 4 de 6** |

Las pruebas te llegan por mail y quedan en el registro: marcalas como prueba (también en el CRM). Hacelas sin entrar
desde un anuncio, así no cuentan como conversión de una campaña.

## PASO 4 — Publicar en GTM
Arriba a la derecha → **Enviar** → en *Nombre de la versión* escribí `Tracking 1.5 - hot_lead` → **Publicar**.
**Cómo sabés que salió bien:** en *Versiones* aparece la 7 como "Activa".

## PASO 5 — Mañana: GA4 y Google Ads
1. **GA4:** *Administrar → Eventos*. Cuando aparezca `hot_lead` (puede tardar hasta un día), activá **Marcar como evento clave**.
2. **Google Ads:** *Objetivos → Conversiones → Nueva acción de conversión → Importar → Propiedades de Google Analytics 4 → Web*,
   elegí `hot_lead` → **Importar**.
3. Dejala como **Secundaria** (no principal) y con recuento **Una**, igual que tus otras importaciones de GA4.

**Meta Ads:** no hace falta tocar nada.

---

## Cómo volver atrás
- **Sitio:** volvé a subir los 7 archivos originales (están en tu zip actual).
- **GTM:** *Versiones → versión 6 → Publicar*.

## Una advertencia sobre la regla
En el formulario de valor, una consulta ya sale CALIENTE con plazo *"Entre 3 y 12 meses"* (dueño 2 + "para vender" 2 + plazo 1 = 5).
Está bien para empezar, porque `hot_lead` va como conversión **secundaria** y no influye en las pujas. Cuando haya
consultas reales con puntaje, mirá cuántas calientes contestaron y, si hace falta, ajustá la tabla de puntos en
`enviar-lead.php`: el evento usa la misma etiqueta que el mail, así que se adapta solo.
