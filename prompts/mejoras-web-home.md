Trabajamos en la web csrealestate.com.ar, en la carpeta `G:\Workshop Claude\#2 CSREALESTATE.COM.AR`. Antes de tocar nada, leé el `CLAUDE.md` de esa carpeta (sobre todo "Reglas para modificar botones", "Protocolo reforzado: avisar ANTES de tocar tracking o una landing de Ads" y "No tocar sin autorización") y el `MANUAL-DE-DISENO.md`. El estilo no se redefine: mismos colores, letras (Chillax/Inter), vidrio y medidas de `estilo.css`.

## Regla número 1: no se rompe nada de Google ni de Meta

Todo mi esquema de publicidad depende de la medición. Ningún cambio puede tocar ni alterar:
- GTM `GTM-5JDWTPXN`, GA4 `G-4LDVRLTWFC`, Google Ads `AW-18445706531` / `GT-WPT9PPBN`, ni el dataset de Meta `1586039593247372`.
- Los eventos `generate_lead`, `click_boton`, `click_whatsapp`, `click_form` y los de Meta (`PageView`, `Contact`, `Lead`, etc.).
- Los `boton_id`, `boton_texto`, `lead_type` y `form_name`.
- Las direcciones de las páginas que reciben anuncios.

No se suma una segunda copia de GTM, GA4 ni del Pixel. Si un cambio puede alterar algo de esto, o no estás seguro, **frená, explicame el riesgo y esperá mi OK**. Después de cada cambio, probá en GTM Preview, GA4 DebugView y Meta Test Events que se disparan exactamente los mismos eventos que antes, ni uno más ni uno menos. No digas que funciona si no lo probaste.

La home recibe tráfico de Google Ads (#Search_6_marca, #Search_9_desarrollos, #Search_10_inversion). Antes de implementar cada tarea, mostrame qué vas a cambiar y qué se puede romper, y esperá mi OK. Respuestas cortas, sin jerga técnica.

**No toques:** el texto ni el botón de "Mi método", la bio, el botón de la matrícula ni el orden de la home.

Son 3 tareas, en este orden:

## 1. Íconos en lugar de emojis (home, `index.html`)

- Reemplazá los emojis de los 5 botones de "¿Cómo puedo ayudarte?" por íconos de línea que transmitan lo mismo:
  📊 cuánto vale → gráfico de barras · 🏠 vender → casa · 🔑 alquilar mi propiedad → llave · 🔎 comprar → lupa · 📍 buscar alquiler → pin de ubicación.
- Tienen que verse de la misma familia que los íconos de WhatsApp y Email: SVG inline, `viewBox="0 0 24 24"`, sin relleno, trazo `currentColor` del mismo grosor, `aria-hidden="true"`. Proponé la posición (a la izquierda con `.boton__icono` como WhatsApp/Email, o pegado al texto). Probalo a 320 px de ancho: el ícono nunca se pisa con el texto.
- En el botón Email, sacá el "✉" que va delante de la dirección: ya tiene el ícono de sobre a la izquierda.
- **Ojo con la medición:** hoy `boton_texto` sale de `origen.dataset.titulo || origen.textContent`. Como esos 5 botones no tienen `data-titulo`, el valor que se registra hoy incluye el emoji (ej. "📊 Quiero saber cuánto vale mi propiedad"). Si sacás el emoji, ese valor cambia y los informes quedan partidos en dos. Para que nada cambie, agregá a cada botón `data-titulo` con el texto exacto que se registra hoy, emoji incluido. No toques `data-evento`, `href` ni nada del `dataLayer`. Si preferís otra solución, explicámela antes.
- Comprobá que los 5 botones mandan exactamente el mismo `boton_id` y `boton_texto` que antes, y que en Meta llega lo mismo que antes. Mostrame el antes y el después.

## 2. Franja con números de Red Suma (home)

- Sacá los números del CRM de Red Suma (admin.redsuma.com.ar), con mi sesión en el navegador. **Solo lectura**: no marques, edites ni crees nada.
- Buscá: operaciones cerradas de Red Suma y cualquier otro número de la red que dé confianza (por ejemplo propiedades en cartera, agentes, oficinas o años de trayectoria **de Red Suma**). **No pongas** mis años en el rubro (arranqué hace poco), **ni barrios**, **ni la palabra "tasación"**.
- **Nunca inventes ni estimes un número.** Si el CRM no lo muestra, decímelo. Mostrame la lista con cada número, de qué pantalla del CRM salió y la fecha, y esperá mi OK antes de ponerlo en la web. Elegimos 3 o 4.
- Tiene que quedar claro que son números **de Red Suma**, no míos (por ejemplo el título "Red Suma en números", o etiquetas como "operaciones cerradas en Red Suma"). Si redondeás, que sea hacia abajo con "+" (ej. 1.287 → "+1.200").
- Diseño: el mismo de la franja de `/desarrollos/` (`.dv-resumen`: número en bronce, etiqueta chica en mayúsculas y gris, caja con borde fino y divisiones). Hoy ese estilo vive dentro de `desarrollos/index.html`. Pasalo a `estilo.css` como componente compartido, definido una sola vez, sin cambiar cómo se ve Desarrollos. En el celular, 2×2.
- Ubicación: proponela y mostrámela antes. Mi idea es debajo de "Mi método" y arriba de "Propiedades disponibles", para que en el celular los botones sigan siendo lo primero que se ve.
- Los números van escritos en un solo lugar del código, con un comentario de la fuente y la fecha. Anotá en el `CLAUDE.md` cómo actualizarlos (cada 3 meses).
- La franja reserva su lugar desde el principio (nada salta al cargar) y no lleva efecto de vidrio pesado (regla de rendimiento del manual).
- No es un botón: no lleva registro de clics.

## 3. Datos invisibles para Google (SEO)

Antes de empezar, tené en cuenta (y recordámelo si te pido otra cosa):
- **Google castiga el texto oculto y las palabras repetidas.** Los datos invisibles tienen que describir lo que la página ya muestra.
- **Poner "zonaprop" escondido no me hace aparecer cuando buscan Zonaprop, y puede perjudicarme.** Lo que sí sirve es enlazar mis perfiles reales en los portales (Zonaprop, Argenprop, MercadoLibre, Red Suma). Pedime esos links. Si no tengo perfil en alguno, no lo pongas.

Qué hacer:
- **Ficha de datos estructurados (JSON-LD) en el `<head>` de la home**, con lo que ya está en la web:
  - `RealEstateAgent` + `Person`: Cristian Stedtfeld, agente inmobiliario en Red Suma. URL, foto, WhatsApp +54 9 11 6695-1945 y email cstedtfeld@redsuma.com.ar.
  - Oficina: General Justo José de Urquiza 405, Vicente López.
  - Zona que atiendo: preguntame cuál poner.
  - Servicios (`hasOfferCatalog`): cuánto vale tu propiedad (orientación de valor), venta, alquiler para propietarios, compra, búsqueda de alquiler y desarrollos en pozo.
  - Perfiles (`sameAs`): solo los links de portales que te pase.
  - También `WebSite`.
  - **No** pongas ningún Instagram por ahora: el mío todavía no es público. Tampoco en la web ni en ningún otro archivo.
  - **No** pongas matrícula a mi nombre (no soy corredor; el corredor responsable es VL REALTOR, ver `CLAUDE.md`).
  - **No** pongas reseñas ni puntajes que no estén visibles en la página.
- **Título y descripción de la home:** proponé una versión que diga naturalmente lo que hago y dónde (agente inmobiliario; valor de tu propiedad, venta, compra y alquiler de departamentos y casas; zona). Es landing de Ads: mostrámela antes de cambiarla.
- **Palabra prohibida: "tasación".** No soy corredor matriculado, así que en nada visible ni en los datos para Google puede decir "tasación", "tasar" ni "tasador". Hoy la descripción de la home dice "Tasación, venta, alquiler y compra…": cambiala. Usá "cuánto vale tu propiedad" o "valor de tu propiedad".
- **`robots.txt` y `sitemap.xml`:** hoy no existen (dan 404). Crealos. El `robots.txt` no bloquea nada (ni a Google ni a los robots de Google Ads o Meta), apunta al sitemap y no nombra carpetas privadas.
- **El zip:** `armar-zip.ps1` usa una lista fija de archivos (`$archivos`). Sumá `robots.txt` y `sitemap.xml`, si no, no se suben.
- **Propuesta, no implementar:** hoy solo la home aparece en Google; `/propiedades/`, `/desarrollos/` y las fichas tienen "no indexar". Explicame en pocas líneas qué ganaría habilitándolas (aparecer cuando buscan "comprar departamento en [barrio]" o "departamentos en pozo") y qué riesgos tiene (contenido repetido del portal y de sumadesarrollos, páginas que se arman al cargar, fichas con `?o=`). Que yo decida. Los 5 formularios se quedan como están.
- Validá la ficha con la Prueba de resultados enriquecidos de Google y con validator.schema.org. Mostrame que no tiene errores.

## Al terminar

- Probá la home en celular (390 px) y en compu: que se vea igual que antes salvo los cambios pedidos, sin saltos al cargar y con el scroll fluido.
- Probá en GTM Preview, GA4 DebugView y Meta Test Events que se disparan exactamente los mismos eventos que antes. No digas que funciona si no lo probaste.
- Actualizá el `MANUAL-DE-DISENO.md` (regla de íconos y la franja como componente) y el `CLAUDE.md` (ficha para Google, franja y cómo actualizarla).
- Armá el zip con `armar-zip.ps1`. Cuando lo suba a Hostinger, verificá en vivo que llegó cada archivo, incluidos `robots.txt` y `sitemap.xml`.
- Recordame dos cosas que tengo que hacer yo: dar de alta el sitemap en Google Search Console, y crear o completar mi Perfil de Empresa en Google (lo que más pesa en las búsquedas locales).
