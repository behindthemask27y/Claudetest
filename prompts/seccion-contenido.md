Trabajamos en la web csrealestate.com.ar, en la carpeta `G:\Workshop Claude\#2 CSREALESTATE.COM.AR`. Antes de tocar nada, leé el `CLAUDE.md` de esa carpeta (sobre todo el motor de carrusel `crearCarrusel`, "Reglas para nuevos botones", "Protocolo reforzado: avisar ANTES de tocar tracking o una landing de Ads") y el `MANUAL-DE-DISENO.md`. El estilo no se redefine: se reutiliza lo que ya existe.

Quiero sumar una sección **"Contenido"**: videos cortos míos (yo hablando a cámara, explicando temas inmobiliarios, recorridos de propiedades), los mismos que subo a redes.

La home recibe tráfico de Google Ads: mostrame cada cambio antes de aplicarlo y esperá mi OK. Respuestas cortas, sin jerga técnica.

## Antes de programar, preguntame

1. **Dónde están alojados los videos.** Mi idea es subir cada reel también a **YouTube Shorts** y mostrarlo en la web desde ahí: no carga el servidor, suma presencia en YouTube y Google los encuentra. Alternativas: subir el archivo a Hostinger (control total del diseño, pero pesa en el servidor), o solo enlazar a Instagram (lo más simple, pero se llevan al visitante fuera de la web). Explicame en pocas líneas y que yo elija.
2. Los primeros videos: pedime los links y, de cada uno, el tema y una frase de resumen.

## Cómo tiene que ser

**Datos en un solo archivo** (`contenido.json` en la raíz). Cada video lleva:
- título
- tema: Vender · Comprar · Alquilar · Invertir
- link o ID del video
- fecha
- duración
- resumen de 2 o 3 líneas
- formulario relacionado

Para sumar un video después, alcanza con que te diga "sumá este video: <link>, tema X". Anotá en el `CLAUDE.md` cómo se hace.

**En la home**, una sección "Contenido" debajo de "Desarrollos destacados" y arriba del botón de VL REALTOR. Proponé la ubicación y mostrámela antes.
- Un slider con el mismo motor y los mismos bordes difuminados que los de Propiedades y Desarrollos, con tarjetas verticales (9:16):
  - foto de portada del video y un botón de play
  - el tema como cartelito, igual que "VENTA" y "ALQUILER"
  - título y duración
- Al tocar la tarjeta del medio, el video se abre en una ventana con el estilo de las ventanas que ya existen.
- Debajo del video va un botón al formulario relacionado (por ejemplo "¿Querés saber cuánto vale la tuya?" → `/form/tasacion/`).
- Al final, "Ver todo el contenido →", con el mismo aire que "Ver todos los desarrollos".

**Página `/contenido/`**: grilla de 3 por hilera en la compu, 2 desde 760 px y 1 en el celular, como `/propiedades/`.
- Filtro por tema con los mismos botones que Todas / Alquiler / Venta.
- Cada video con su resumen visible y "← Volver al inicio" arriba y abajo, como las demás páginas.

**Rendimiento** (regla del manual):
- El reproductor de YouTube **no se carga hasta que alguien toca play**. Antes solo se ve la foto de portada, pedida del tamaño justo.
- Nada salta al cargar.
- Sin vidrio en tarjetas que se mueven.
- Medí cuadros por segundo al deslizar: si baja de 55, no entra.

**Registro de clics:** proponeme los `boton_id` nuevos antes de crearlos, siguiendo "Reglas para nuevos botones". Por ejemplo `video` al tocar play, con el título en `boton_texto`, y uno para el botón que lleva al formulario. No toques los que ya existen.

**Google:**
- `/contenido/` **sí** se indexa (es contenido propio, a diferencia de las otras páginas internas). Sumala al `sitemap.xml`.
- Agregale datos estructurados `VideoObject` por video (nombre, resumen, portada, fecha, duración, link) y validalos con la Prueba de resultados enriquecidos.

## Al terminar

- Probá en celular (390 px) y en compu.
- Probá que el registro de clics funcione (GTM Preview). No digas que funciona si no lo probaste.
- Actualizá `MANUAL-DE-DISENO.md` y `CLAUDE.md`. Sumá `contenido.json` y `contenido/index.html` a la lista de `armar-zip.ps1`.
- Armá el zip. Cuando lo suba, verificá en vivo que llegaron todos los archivos.
