# hot_lead — paso a paso

**Qué hace:** cuando una consulta sale **CALIENTE** en el mail (5 o 6 puntos, la regla que ya tenés), el sitio avisa
un evento nuevo llamado `hot_lead`. Llega a GA4 y de ahí a Google Ads como conversión **secundaria**, y también al
píxel de Meta. `generate_lead` sigue igual y sigue siendo la principal. No viaja ningún dato personal ni el puntaje.

**Qué NO hace:** no cambia tus campañas, presupuestos ni objetivos. Solo mide.

Son 5 pasos. Los pasos 1 a 4 se hacen hoy (unos 30 minutos). El paso 5 es mañana.

---

## Paso 1 — Subir 7 archivos al sitio

Están en la carpeta `public_html/` de este paquete. Subilos a las mismas rutas del hosting (pisan a los actuales):

| Archivo | Qué cambia |
|---|---|
| `enviar-lead.php` | Devuelve también `hot: true/false` y se actualizó el comentario que decía "NO se manda a Google ni Meta". |
| `form/motor.js` | Dispara `hot_lead` justo después de `generate_lead`, solo si el servidor dijo `hot: true`. |
| `form/vender/index.html` | Solo cambia `?v=eb6afe4d` por `?v=36269df0` (para que los navegadores bajen el `motor.js` nuevo). |
| `form/valor-prop/index.html` | Igual. |
| `form/comprar/index.html` | Igual. |
| `form/alquilar-mi-propiedad/index.html` | Igual. |
| `form/buscar-alquiler/index.html` | Igual. |

Todos los cambios exactos están en `cambios.diff`.

**Ojo con el deploy:** tu CLAUDE.md cuenta que los archivos dentro de carpetas ya fallaron una vez al subirse. Subilos
como te funcionó el 8/10 (zip con las carpetas explícitas) y **verificá en vivo**:
- Abrí `https://csrealestate.com.ar/form/motor.js?v=36269df0` y buscá la palabra `hot_lead`. Tiene que aparecer.
- Abrí el código fuente de `https://csrealestate.com.ar/form/vender/` y buscá `motor.js?v=36269df0`.

Si el PHP y el JS no se suben juntos, no pasa nada grave. Sin el PHP nuevo, `motor.js` simplemente no dispara
`hot_lead`. Pero subí los dos antes de probar.

## Paso 2 — GTM (contenedor `GTM-5JDWTPXN`, versión actual 6)

1. **Activador nuevo:** *Activadores → Nuevo → Evento personalizado*.
   - Nombre: `Custom Event - hot_lead`
   - Nombre del evento: `hot_lead`
   - Se activa en: Todos los eventos personalizados.
2. **Etiqueta de GA4:** abrí la etiqueta `GA4 - generate_lead` → menú ⋮ → **Duplicar**.
   - Nombre: `GA4 - hot_lead`
   - Nombre del evento: `hot_lead` (los parámetros `lead_type`, `form_name` y `page_location` se quedan).
   - Activación: sacá `Custom Event - generate_lead` y poné `Custom Event - hot_lead`.
3. **Etiqueta de Meta:** *Etiquetas → Nueva → HTML personalizado*.
   - Nombre: `Meta Pixel - hot_lead`
   - HTML:
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
   - Activación: `Custom Event - hot_lead`.

## Paso 3 — Probar (con *Vista previa* de GTM activada)

Hacé dos consultas de prueba **sin entrar desde un anuncio** y avisá que son pruebas (te va a llegar el mail con la etiqueta):

| Prueba | Formulario | Respuestas | Tiene que pasar |
|---|---|---|---|
| **CALIENTE** | `/form/vender/` | Para cuándo: *Lo antes posible* · Dueño: *Soy el único dueño* · Papeles: *Escritura* · Cómo seguir: *Quiero coordinar una reunión* | Mail **CALIENTE 6 de 6**. En la Vista previa se disparan **`GA4 - generate_lead` y `GA4 - hot_lead`** y también `Meta Pixel - Lead` y `Meta Pixel - hot_lead`. |
| **TIBIA** | `/form/valor-prop/` | Cuándo: *No pienso vender* · Dueño: *Soy el único dueño* · Para qué: *Para vender* | Mail **TIBIA 4 de 6** (como tu ejemplo). Se dispara `generate_lead` pero **NO** `hot_lead`. |

Si las dos salen como dice la tabla, está bien. Después marcá esas dos filas como prueba en tu registro.

## Paso 4 — Publicar en GTM

*Enviar → Publicar* con el nombre de versión: `Tracking 1.5 - hot_lead`.

## Paso 5 — Mañana: GA4 y Google Ads

1. **GA4:** *Administrar → Eventos*. Cuando aparezca `hot_lead` (puede tardar hasta un día), activá **Marcar como evento clave**.
2. **Google Ads:** *Objetivos → Conversiones → Nueva acción de conversión → Importar → Propiedades de Google Analytics 4 → Web* → elegí `hot_lead` → Importar.
   - Dejala como **Secundaria** (no principal) y recuento **Una**, igual que tus otras importaciones de GA4.

**Meta Ads: no hace falta tocar nada.** El evento `hot_lead` queda guardado en el píxel por si más adelante querés armar un público de calientes.

---

## Cómo volver atrás
- Sitio: volvé a subir los 7 archivos originales (están en tu zip).
- GTM: *Versiones → versión 6 → Publicar*.

## Una advertencia sobre la regla
En el formulario de tasación, una consulta ya sale CALIENTE con plazo *"Entre 3 y 12 meses"* (dueño 2 + "para vender" 2 + plazo 1 = 5).
Es un caso límite y está bien para empezar: `hot_lead` va como conversión **secundaria**, que no influye en las pujas.
Cuando haya consultas reales con puntaje, mirá cuántas "calientes" contestaron y, si hace falta, ajustá la tabla de puntos
en `enviar-lead.php`. El evento se adapta solo porque usa la misma etiqueta que el mail.
