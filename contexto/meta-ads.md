# Meta Ads (Facebook e Instagram) — contexto

Última actualización: 2026-10-13. Reemplaza al `contexto-meta-ads.md` del 9/10 (su detalle operativo está al final).
Estado de tareas y decisiones: `contexto/estado-y-pendientes.md`. Medición: `contexto/medicion-y-sitio.md`.

## Objetivo
Consultas de **propietarios** de calidad (captación). Canales: formularios instantáneos, WhatsApp y web. Campañas separadas
por público (propietarios, compradores, remarketing), nunca una general. Presupuesto total de **10.000 por día** para probar.
Zona: CABA cerca de Villa del Parque (incluye Belgrano, Núñez, Colegiales) + Zona Norte (Vicente López, Olivos, Martínez,
San Isidro, Tigre, Munro, San Martín y alrededores). **Radios chicos**: nada de 45 km.

## Cuenta
- Cuenta publicitaria **"IG Real Estate"**: `act=2105334063528925`, business_id `1439717201317750`. El Administrador abre por
  defecto otra cuenta vacía (1579334669347554): cambiar siempre a "IG Real Estate".
- Página "CS Real Estate". El Instagram `cristian.sted` todavía NO es público: no mencionarlo en nada.
- Píxel / conjunto de datos "Datos web csrealestate.com.ar": `1586039593247372` (cargado por GTM).
- Formulario instantáneo "Propietarios - Mayor intención oct-2026": ID `1770811840852489`.
- Política de privacidad para los formularios: `https://csrealestate.com.ar/#privacy-policy`.
- **"Vivienda" (categoría especial): NO va.** Obliga a público amplio (~25 km, todas las edades) y fue la probable causa
  de las consultas malas de la campaña vieja `META_1_Leads_Propietarios`.

## Estado de las campañas (informe del 12/9 al 11/10, en pesos)
| Campaña | Estado | Gasto | Resultado | Costo por resultado |
|---|---|---|---|---|
| Campaña Likes #1 | Inactiva | 4.675 | 211 interacciones | 22 |
| META_1_Leads_Propietarios | Inactiva (la pausó Cris) | 21.785 | 1 consulta | 21.785 |
| Alquiler - Local Nazca 4501 | Activa, 5.000/día | 13.571 (3 días) | 3 conversaciones de WhatsApp | 4.524 |
| Propietarios - Captación | Activa, 5.000/día | 13.854 (3 días) | 1 consulta (formulario) | 13.854 |
Total 53.886. Atribución: 7 días tras clic o 1 día tras visualización. Solo hay 3 a 4 días de datos de las dos activas:
**todavía no hay conclusiones**. Costo por mil impresiones: Propietarios ~16.400 contra ~7.900 del local (público chico: 21 códigos postales, 25+).
Frecuencia de Propietarios: ~1,6 en 3 días.

## Consultas de formulario instantáneo (2 hasta el 13/10)
Ninguna respondió. Una era "Vender · PH · en los próximos 3 meses · San Martín" con teléfono verificado (entró un domingo de
madrugada). La otra se borró. **Regla:** no borrar consultas; marcar la *etapa* en el Centro de clientes potenciales.
El CSV de Leads Center NO trae las respuestas del formulario: para verlas, descargar desde la biblioteca de formularios.
El formulario no pregunta si es dueño; no se puede puntuar como los del sitio.

## Anomalía del píxel
219 de 245 eventos `Lead` (14/9–11/10) son de **servidor** y casi todos del 12 y 13/10 (~24 por hora). Ni el sitio ni GTM envían
eventos de servidor: fuente sin identificar. Hasta aclararlo, no optimizar ni armar públicos con `Lead`. Revisar en Events
Manager las pestañas *Historial* y *Configuración*. Las campañas actuales usan formularios instantáneos y WhatsApp, así que no las afecta.

## Qué hacer (recomendado el 13/10)
1. **No tocar la estructura 2 semanas** (presupuesto, públicos, anuncios, formulario): hay 4 días de datos.
2. **Responder en minutos** y activar notificaciones de clientes potenciales. Primer mensaje por WhatsApp en los primeros 5
   minutos usando lo que el formulario ya dice; segundo toque al día siguiente; marcar la etapa; anotar en el CRM.
3. **Verificar en el Administrador** (checklist abajo).
4. **Aclarar los 219 eventos de servidor** (ver arriba).
5. A las 2 o 3 semanas, comparar canales por **costo por consulta respondida o calificada**, no por consulta.
6. Si Propietarios sigue sin respuestas: probar (de a una cosa) el conjunto "Propietarios - WhatsApp" que ya estaba planeado,
   sumar la pregunta "¿Sos el dueño?" en un formulario nuevo, o ajustar el texto.
7. Mantener inactivas `META_1_Leads_Propietarios` y `Campaña Likes #1`.
8. Local Nazca sigue hasta que se alquile; entonces sus 5.000 pasan a Compradores.

**Checklist en el Administrador de anuncios:** objetivo Clientes potenciales y ubicación de la conversión correcta; mejoras
automáticas apagadas en los 5 anuncios; sin categoría especial; edad mínima 25; ubicaciones por código postal; formulario
"Mayor intención" con verificación por SMS y entrega flexible desactivada; ningún anuncio en "Borrador"; "Revisar y publicar" sin pendientes.

## Reglas de trabajo
- Todo se arma en pausa o borrador. **OK de Cris antes de cada "Publicar"** y antes de activar o pausar (gastan plata). El clic
  final de "Publicar" lo hace Cris (el sistema se lo bloquea al asistente). Nunca contraseñas ni datos de tarjeta.
- Textos: decir **CABA**; **no nombrar barrios ni zonas** en los textos (lo define la ubicación); nada genérico; cada texto sale de
  algo que Cris hace distinto; no inventar datos ni testimonios; Cris **no** hace video recorrido de todas las propiedades: no
  prometerlo; no usar "tasación" ni "gratis"; decir "análisis de mercado"; en alquileres, sin precio en el texto.

## Campaña Propietarios - Captación (publicada el 9/10)
Clientes potenciales, 5.000/día, sin categoría especial. Conjunto "Propietarios - Formulario" con 21 códigos postales:
CABA C1416, C1417, C1419, C1426, C1427, C1428, C1429, C1430, C1431; Zona Norte B1602, B1603, B1605, B1607, B1636, B1638,
B1640, B1642, B1643, B1648, B1650, B1653 (B1604 y B1641 no existen en Meta). Mejoras automáticas apagadas (contenido 0/5, esenciales 0/3).
Formulario "Mayor intención" + verificación por SMS. Saludo: "Antes de vender, mirá los números de tu zona". Preguntas: ¿Qué
querés hacer? (Vender / Vender y comprar otra / Por ahora, conocer el valor) · ¿Qué tipo de propiedad es? · ¿Cuándo pensás vender?
(Próximos 3 meses / 3 a 6 meses / Más adelante) · ¿En qué barrio o localidad está? Final: botón a WhatsApp.
Anuncios (flyer feed 1080x1350, descripción "Red Suma · CABA y Zona Norte", botón "Más información"): Precio (04A v2, "Vender bien no es
vender barato"), Meses publicada (01A), Herencia (06A), Mudanza (05A), Vos (10A v2, "Un precio que venda, aunque no guste").
Pendiente: conjunto "Propietarios - WhatsApp" (duplicar y pasar la conversión a WhatsApp con mensaje ya escrito).

## Alquiler - Local Nazca 4501 (publicada el 9/10)
Clientes potenciales, 5.000/día, sin fecha de fin (pausar cuando se alquile). Conjunto "Local Nazca - WhatsApp": dirección 4501 Nazca + 4 km
(-34.5877, -58.5008), edad mínima 25. Anuncio "Video recorrido IG" (reel del 8/10). Mensaje precargado: "Hola, vi el video del local de Nazca 4501.
Quiero más información."

## Próximas etapas acordadas
Compradores (WhatsApp y formulario "Qué buscás"; textos "Lo que el aviso no dice", "Sábados perdidos", "Antes de ofertar") · carrusel de
obras en pozo (solo con datos que Cris tenga) · campaña web con el píxel · remarketing (armado pero pausado, solo con el píxel limpio) ·
videos hablando a cámara · versiones story 1080x1920 de los flyers. Flyers: carpeta `Flyers ADS/` (fondos en `Hoja de fotos de fondo.jpg`).

## Trucos técnicos del Administrador de anuncios (sesiones con Claude in Chrome)
- Capturas con cuadro de 1568 px sobre una página de 1920 px CSS (factor 0,8167): ubicar botones buscándolos por texto con JS y `scrollIntoView`.
- Si las capturas fallan por tiempo, usar `find` o JS; `read_page` y `get_page_text` sirven poco.
- Subir imágenes sin la ventana de Windows: parchear `HTMLInputElement.prototype.click` para agregar el input con `aria-label="claude-file-input"` y usar `file_upload` (máx. 10 MB).
- Videos de más de 10 MB: usar la publicación de Instagram existente ("Usar publicaciones ya existentes").
- Zonas por código postal: *Agregar lugares de forma masiva → Códigos postales*, Argentina, formato C#### (CABA) y B#### (Provincia).
- Edad mínima: el control no pasa de 25. Duplicar anuncio: "…" → "Duplicar rápidamente" (desmarcar la música).
- Al terminar un anuncio: Contenido multimedia → Texto → Generación de imágenes (no elegir IA) → Mejoras → OK.
- El "Publicar" del editor publica solo el anuncio abierto; revisar después que ninguno quede en "Borrador".
- Resultados del día: el rango por defecto NO incluye hoy; elegir "Hoy" o agregar `&date=AAAA-MM-DD_AAAA-MM-DD%2Ctoday` a la URL.
- Mensaje precargado de WhatsApp: a veces no guarda al primer intento; borrar, escribir, salir del campo con Tab y guardar.
