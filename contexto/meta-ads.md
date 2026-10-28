# Meta Ads — contexto

> **Copia para el repo.** El original vive en la compu de Cris (`NEGOCIO/Marketing/Meta-Ads/contexto-meta-ads.md`). Versión de esta copia: 2026-10-28. Las rutas que empiezan con `NEGOCIO/`, `Archivo/` o `Programas Claude/` existen solo en su compu. Si en una sesión de la nube se cambia algo acá, avisale a Cris qué archivo cambió para que lo pase al original; si no, la próxima vez que suba la copia se pisa.

**Qué es:** el manual para retomar las campañas de Meta (Facebook/Instagram) de Cris sin volver a preguntar lo ya definido.
**Cuándo leerlo:** armar, revisar, publicar o medir campañas de Meta. Va junto con `contexto/estado-y-pendientes.md`, `contexto/medicion-y-sitio.md` y, para textos y flyers, `contexto/voz-y-copy.md` y `NEGOCIO/Marketing/Flyers ADS/`.
**Última actualización:** 2026-10-13. Fusiona el manual del 9/10 (el armado de cada campaña, más abajo, sin tocar) con el informe del 11/10 y las decisiones del 13/10.

**20/10/2026:** Cris quiere pasar de campañas sueltas a un sistema (embudo). Plan base en `2026-10-20 Meta - Sistema de captacion (embudo) - plan.md` (misma carpeta); lo de abajo describe lo publicado hasta ahora.

## Objetivo de Cris
- Leads de **alta calidad**. Los que tenía eran malísimos.
- Canales: WhatsApp, formularios instantáneos y web.
- Campañas separadas por público: propietarios (captación), compradores y remarketing. Nada de una campaña general.
- Presupuesto **total de $10.000 ARS por día** para probar, con presupuesto por campaña (Meta lo reparte entre los conjuntos).
- Zona: CABA cerca de Villa del Parque (incluye Belgrano, Núñez y Colegiales) + Zona Norte (Vicente López, Olivos, Martínez, San Isidro, Tigre, Munro, San Martín y alrededores). **Radios chicos**: "no me mandes a 45 km".

## Cuenta (todo en el Chrome de Cris, con su sesión)
- Cuenta publicitaria **"IG Real Estate"**: act=2105334063528925, business_id=1439717201317750. Ads Manager abre por defecto otra cuenta vacía (1579334669347554): cambiar siempre a la de IG Real Estate.
- **Conector de Meta (MCP, desde el 24/10):** leer con él en vez de abrir el Chrome. Solo herramientas de lectura (`ads_get_ad_accounts`, `ads_get_ad_entities`, `ads_account_get_activity_logs`, `ads_insights_*`); las de crear, editar o activar, nunca sin el OK escrito de Cris. Cada llamada pide un `client_conversation_id` (20 letras y números, el mismo en todo el chat) y `client_model`. Cuenta de trabajo: IG Real Estate. Los presupuestos y cobros del historial vienen en centavos.
- Página de Facebook "CS Real Estate". El WhatsApp de Cris ya está conectado a la página (9-oct-2026).
- **El Instagram `cristian.sted` figuraba como NO público (Cris aclaró el 16/10 que no es privado; la regla se mantiene hasta que él diga otra cosa): no nombrarlo ni linkearlo en textos, anuncios, web ni piezas.** Meta sí pauta en Instagram, y el anuncio del local sigue usando su reel (decidido 13/10).
- Píxel / conjunto de datos "Datos web csrealestate.com.ar": `1586039593247372` (evento Cliente potencial, cargado por Google Tag Manager).
- Formulario instantáneo "Propietarios - Mayor intención oct-2026": ID `1770811840852489`.
- Política de privacidad para formularios: https://csrealestate.com.ar/#privacy-policy
- **"Vivienda" (categoría especial): NO va.** Es obligatoria solo para EE. UU., Canadá y parte de Europa. La campaña vieja "META_1_Leads_Propietarios" estaba marcada como Vivienda, lo que fuerza un público amplio (radio de unos 25 km, todas las edades): probable causa de los leads malos.

## Reglas de trabajo
- Todo se arma en pausa o en borrador. **Pedir el OK de Cris antes de cada "Publicar"** y antes de activar o pausar campañas (gastan plata). Nunca poner contraseñas ni datos de tarjeta.
- Al entrar ya había **4 borradores de Cris sin publicar** ("Revisar y publicar (4)"). No tocarlos ni publicarlos. Al 9-oct-2026 quedan 3: un conjunto y los anuncios viejos "Ad_Alquilar_1" y "Ad_Tasacion_1", con errores. Se le sugirió a Cris descartarlos él mismo.
- Publicar desde el botón "Publicar" del editor de la campaña (publica solo esa), no desde "Revisar y publicar".
- La campaña vieja **META_1_Leads_Propietarios** (con Vivienda) está **pausada por Cris**: mantenerla inactiva. (El 9/10 seguía activa y se recomendó pausarla para no pasarse de los $10.000 por día.)
- El clic final de "Publicar" lo hace Cris (el sistema se lo bloquea al asistente). Nada se cambia en la cuenta sin su OK escrito.
- **Formularios instantáneos (20/10, propuesto):** un formulario ya usado no se edita ni se renombra: se duplica y se edita la copia (ícono de las dos hojitas en la lista de "Destino" del anuncio). Archivar es el "borrar" de Meta (ícono de la carpeta; pestaña "Archivados", se puede restaurar). Primero se pone el nuevo en los anuncios, después se archiva el viejo; nunca uno que tenga anuncios activos. Nombre interno con fecha primero, como el resto del Workshop: `2026-10-20 Propietarios - Mayor intención v2`, `2026-10-20 Local Nazca 4501 - Mayor intención`. El nombre interno no lo ve la persona; lo que ve es el título de la pantalla inicial.
- Después de un cambio grande (presupuesto, públicos, anuncios, formulario): **2 semanas sin tocar la estructura** para poder medir (decidido 13/10; en Google son 3 semanas).

## Textos (ver también la memoria "copy-ads-no-generico")
- Decir **CABA**, nunca "Capital". **No nombrar barrios ni zonas** en los textos: eso lo define la ubicación.
- Nada genérico tipo "¿Pensás vender tu propiedad en…?". Cada texto sale de algo que Cris hace distinto. No inventar datos ni testimonios.
- Cris ofrece fotos, video y plano, pero lo que lleva cada propiedad se acuerda con el cliente (Cris, 13-oct-2026): decir "según lo que acordemos"; no prometer el video recorrido como incluido en todas.
- No usar "tasación" ni "gratis" (atrae curiosos). Decir "análisis de mercado".
- En alquileres, Cris prefiere **no poner el precio** en el texto, para que le pregunten.

## Resultados (informe del 12/9 al 11/10, en pesos)
| Campaña | Estado | Gasto | Resultado | Costo por resultado |
|---|---|---|---|---|
| Campaña Likes #1 | Inactiva | 4.675 | 211 interacciones | 22 |
| META_1_Leads_Propietarios | Inactiva (la pausó Cris) | 21.785 | 1 consulta | 21.785 |
| Alquiler - Local Nazca 4501 | Activa, 5.000/día | 13.571 (3 días) | 3 conversaciones de WhatsApp | 4.524 |
| Propietarios - Captación | Activa, 5.000/día | 13.854 (3 días) | 1 consulta (formulario) | 13.854 |

Total 53.886. Atribución: 7 días tras clic o 1 día tras visualización. Solo hay 3 a 4 días de datos de las dos activas: **todavía no hay conclusiones**. Costo por mil impresiones: Propietarios ~16.400 contra ~7.900 del local (público chico: 21 códigos postales, 25+). Frecuencia de Propietarios ~1,6 en 3 días.

## Revisión del 13/10 (9–12/10 más lo de hoy; en pesos)
Hecha en el Administrador de anuncios sin capturas de más (cuesta créditos). La próxima vez: que Cris baje el informe (CSV) por campaña, conjunto y anuncio y me lo pase, en vez de abrir el Chrome.
| Campaña | Gasto 9–13/10 | Resultado | Costo por resultado | Impresiones |
|---|---|---|---|---|
| Alquiler - Local Nazca 4501 | ~19.900 | 5 conversaciones de WhatsApp | ~4.000 | ~2.560 |
| Propietarios - Captación | ~21.000 | 1 consulta (formulario) | ~21.000 | ~1.250 |
- Los 5 anuncios de Propietarios (9–12/10): Precio 04 5.213 (359 imp., la única consulta); Mudanza 05 5.833 (304); Herencia 06 4.014 (336); Meses publicada 01 3.633 (123); Vos 10 1.272 (64). Meta reparte desparejo: Vos y Meses casi no reciben.
- Estado: el conjunto y los 5 anuncios de Propietarios dicen "En preparación" (no "Activa") aunque gastan; cada uno con 1 recomendación sin leer. Local Nazca sí figura "Activa".
- Borradores viejos sin publicar (3): conjunto "Alquilar mi propiedad" y anuncios "Ad_Alquilar_1" y "Ad_Tasacion_1", con errores. `META_1_Leads_Propietarios` y `Campaña Likes #1` siguen desactivadas.
- No verificado: mejoras automáticas, edad mínima, SMS del formulario y los 219 eventos de servidor (piden abrir pantallas una por una).
- Todavía con 4 a 5 días de datos: sin conclusiones. Estructura quieta hasta el 23/10.

## Consultas de formulario instantáneo (2 hasta el 13/10)
Ninguna respondió. Una era "Vender · PH · en los próximos 3 meses · San Martín", con teléfono verificado (entró un domingo de madrugada). La otra se borró. **Regla:** no borrar consultas; marcar la *etapa* en el Centro de clientes potenciales. El CSV de Leads Center NO trae las respuestas del formulario: para verlas, descargar desde la biblioteca de formularios. El formulario no pregunta si es dueño, así que no se puede puntuar como los del sitio.

## Anomalía del píxel (abierta al 13/10)
219 de 245 eventos `Lead` (14/9–11/10) son de **servidor** y casi todos del 12 y 13/10 (~24 por hora). Ni el sitio ni GTM envían eventos de servidor: fuente sin identificar. Hasta aclararlo, no optimizar ni armar públicos con `Lead`. Revisar en Events Manager las pestañas *Historial* y *Configuración*. Las campañas actuales usan formularios instantáneos y WhatsApp, así que no las afecta.

## Qué hacer (recomendado el 13/10)
1. **No tocar la estructura 2 semanas** (presupuesto, públicos, anuncios, formulario): hay 4 días de datos.
2. **Responder en minutos** y activar notificaciones de clientes potenciales. Primer mensaje por WhatsApp en los primeros 5 minutos usando lo que el formulario ya dice; segundo toque al día siguiente; marcar la etapa y anotarla en el CRM propio de Cris (todavía no vinculado con Claude).
3. **Verificar en el Administrador** (checklist de abajo).
4. **Aclarar los 219 eventos de servidor** (ver la anomalía).
5. A las 2 o 3 semanas, comparar canales por **costo por consulta respondida o calificada**, no por consulta.
6. Si Propietarios sigue sin respuestas, probar (de a una cosa): el conjunto "Propietarios - WhatsApp" que ya estaba planeado, sumar la pregunta "¿Sos el dueño?" en un formulario nuevo, o ajustar el texto.
7. Mantener inactivas `META_1_Leads_Propietarios` y `Campaña Likes #1`.
8. Local Nazca sigue hasta que se alquile; entonces sus 5.000 pasan a Compradores.

**Checklist en el Administrador de anuncios:** objetivo Clientes potenciales y ubicación de la conversión correcta; mejoras automáticas apagadas en los 5 anuncios; sin categoría especial; edad mínima 25; ubicaciones por código postal; formulario "Mayor intención" con verificación por SMS y entrega flexible desactivada; ningún anuncio en "Borrador"; "Revisar y publicar" sin pendientes.

## Estado al 9-oct-2026 (cómo se armó cada campaña)

### 1. Alquiler – Local Nazca 4501 · PUBLICADA (quedó en revisión)
- Clientes potenciales, $5.000 por día, sin fecha de fin (pausarla cuando se alquile).
- Conjunto "Local Nazca - WhatsApp": dirección 4501 Nazca + 4 km, edad mínima 25. Para encontrarla en Meta se busca "Nazca 4501, Villa Pueyrredón, CABA" y se elige la opción "Dirección" (coordenadas -34.5877, -58.5008).
- Anuncio "Video recorrido IG": reel de Instagram del 8-oct (Cris editó el pie). Plantilla de chat "Local Nazca 4501":
  - Bienvenida: "¡Hola! Gracias por tu consulta. Ya te paso la info del local."
  - Mensaje ya escrito: "Hola, vi el video del local de Nazca 4501. Quiero más información."
- **Versión nueva (20/10/2026, borrador sin publicar):** formulario de Meta en vez de WhatsApp, con el precio visible (decisión de Cris; rompe a propósito la regla de "sin precio" de `Voz-y-copy.md`, solo para este local). Presupuesto propuesto: 2.500 por día.
  - Datos: 135 m² cubiertos, alquiler $2.630.000 por mes + expensas aprox. $180.000.
  - Texto principal: "Local de 135 m² cubiertos en Nazca 4501. / Alquiler: $2.630.000 por mes + expensas (aprox. $180.000). / Completá el formulario y te propongo día y hora para recorrerlo. Soy Cristian, de Red Suma."
  - Título (elige Cris): "135 m² cubiertos para tu negocio." (el del flyer) · "Nazca 4501: pasá a verlo." · "Local con el precio a la vista."
  - Formulario nuevo "Local Nazca 4501 - Mayor intención" (no el de Propietarios, que fue el que quedó elegido en el borrador): mayor intención, verificación por SMS, entrega flexible desactivada; nombre y teléfono; preguntas: ¿Para qué negocio lo querés? (respuesta breve) · ¿Cuándo querés ocuparlo? (Lo antes posible / En 1 o 2 meses / Más adelante) · ¿Qué día podés verlo? (Entre semana / Sábado / Cualquiera). Final: "¡Gracias! Ya tengo tus datos." + botón a WhatsApp.
  - Destino: en el conjunto, "Ubicación de la conversión" = formularios instantáneos. La opción mixta con sitio web pide las dos cosas (URL y formulario obligatorios, visto en pantalla el 20/10). Responder con dos opciones de día y hora, no con "¿cuándo querés verlo?".
- **Precio nuevo (20/10, decidido por Cris; falta confirmar el OK del dueño): $2.490.000 por mes + expensas aprox. $180.000** (antes $2.630.000, −5,3 %). Se cambia en: el portal (el sitio toma el precio del portal con una copia que se renueva cada 8 horas), el texto principal del anuncio "Flyer 135 m2" ("Nuevo valor: $2.490.000/mes · Expensas: $180.000 aprox por mes"), la respuesta rápida "¿Cuánto es el alquiler?" de ese anuncio (estaba con `$[PRECIO]` y `$[EXPENSAS]` sin completar) y el cartel. El anuncio "Video recorrido IG" usa el pie del reel, sin precio: no se toca.

### 2. Propietarios - Captación · PUBLICADA 9-oct-2026 (solo el conjunto Formulario; el clic final de "Publicar" lo hizo Cris porque el sistema bloquea ese clic al asistente)
- Mejoras automáticas de Meta APAGADAS en los 5 anuncios (contenido 0/5, esenciales 0/3), por pedido de Cris. Para apagarlas: "Revisar opciones predeterminadas" → "Editar" → en el diálogo, destildar todos los `input[type=checkbox]` menos el primero ("Todas las optimizaciones") y tocar "Guardar".
- META_1_Leads_Propietarios: la pausó Cris.
- Clientes potenciales, $5.000 por día de campaña, sin categoría especial.
- Conjunto **"Propietarios - Formulario"**: formularios instantáneos, edad mínima 25 (Meta no deja poner más de 25), 21 códigos postales:
  - CABA: C1416, C1417, C1419, C1426, C1427, C1428, C1429, C1430, C1431
  - Zona Norte: B1602, B1603, B1605, B1607, B1636, B1638, B1640, B1642, B1643, B1648, B1650, B1653
  - B1604 (Florida Oeste) y B1641 (Acassuso) no existen en Meta.
- Formulario **"Propietarios - Mayor intención oct-2026"**: mayor intención + verificación del teléfono por SMS + entrega flexible desactivada.
  - Saludo: "Antes de vender, mirá los números de tu zona" / "Contame un poco de tu propiedad. Te escribo por WhatsApp y te muestro qué se vendió cerca y a cuánto, para que decidas con datos."
  - Preguntas: ¿Qué querés hacer? (Vender / Vender y comprar otra / Por ahora, conocer el valor) · ¿Qué tipo de propiedad es? (Depto / Casa / PH / Local u oficina / Terreno) · ¿Cuándo pensás vender? (En los próximos 3 meses / De 3 a 6 meses / Más adelante) · ¿En qué barrio o localidad está? (respuesta breve).
  - **Versión v2 (20/10, propuesta; se duplica el formulario y se edita la copia, nombre `2026-10-20 Propietarios - Mayor intención v2`):** las mismas 4 preguntas más **¿Sos el dueño de la propiedad?** (Sí, soy el dueño / Es de un familiar o la heredé / Otra situación), en este orden: ¿Qué querés hacer? · ¿Sos el dueño? · ¿Cuándo pensás vender? · ¿Qué tipo de propiedad es? · ¿En qué barrio o localidad está? Mismos ajustes (mayor intención, SMS, entrega flexible desactivada). Si hay que acortar, se saca la del barrio. Ajustes decididos el 20/10: sin introducción (Cris: no sirve), sin email (solo nombre y teléfono con SMS), política de privacidad `https://csrealestate.com.ar/#privacy-policy`, final con "¡Gracias! Ya tengo tus datos." + "Te escribo por WhatsApp para mostrarte qué se vendió cerca y a cuánto." + botón a WhatsApp. Lo mismo para el formulario de Nazca, con "Te escribo por WhatsApp para coordinar la visita." Final: botón "Chatear en WhatsApp" (acción adicional), con el mensaje "Hola, dejé mis datos para vender mi propiedad." (Nazca: "…por el local de Nazca 4501."). Aviso de privacidad (título "Cómo usamos tus datos"): "Usamos tu nombre, tu teléfono y tus respuestas solo para contactarte por WhatsApp o teléfono y responder tu consulta. Cristian Stedtfeld, de Red Suma, trata tus datos. No los vendemos ni los compartimos con terceros, salvo lo necesario para darte el servicio. Para que los borremos, escribí a cstedtfeld@redsuma.com.ar." Sale de la política del sitio; esa política habla de los formularios del sitio y no de los de Meta: sumarle una línea es un cambio al sitio y necesita el OK de Cris.
  - Final: "¡Gracias! Ya tengo tus datos." + botón a WhatsApp.
  - El formulario viejo "VENDER_Propiedad_Meta" queda sin usar.
- Anuncios. Todos con descripción "Red Suma · CABA y Zona Norte", botón "Más información" y el flyer en versión feed (1080x1350) de `NEGOCIO/Marketing/Flyers ADS/`:

| Anuncio | Estado | Flyer | Título | Texto principal |
|---|---|---|---|---|
| Precio - flyer 04 | hecho | 04A | Preguntá de dónde sale el precio | Si tres inmobiliarias te dieron tres precios distintos, preguntales de dónde sale cada número. Yo te muestro lo que de verdad se vendió cerca de tu propiedad y lo que se pagó. Con eso decidís vos. |
| Meses publicada - flyer 01 | hecho | 01A | Meses publicada se paga al negociar | Cuando un aviso lleva meses en los portales, los compradores empiezan a preguntarse qué problema tiene. Y la negociación arranca con vos a la defensiva. Salir con el precio correcto desde el primer día te ahorra eso. |
| Herencia - flyer 06 | hecho | 06A | Herencia ordenada, venta tranquila | ¿Heredaste con tus hermanos y cada uno quiere una cosa distinta? Antes de publicar ordenamos papeles, tiempos y números, con el respaldo legal de Red Suma. |
| Mudanza - flyer 05 | hecho | 05A | ¿Vendés primero o comprás primero? (elegido por Cris el 20/10; antes "…con las fechas atadas", no le gustó "atadas") | ¿Vendés para comprarte otra? El riesgo está en las fechas: firmar la venta sin tener a dónde ir, o reservar sin haber vendido. Eso se planifica antes de publicar. |
| Vos - flyer 10 | hecho | 10A | Un precio que venda, aunque no guste | Mi trabajo depende de que me recomiendes. Por eso prefiero decirte un precio que no te gusta antes que uno que no vende. Soy Cristian, de Red Suma. |

- **Pendiente:**
  1. El conjunto "Propietarios - WhatsApp": duplicar el conjunto, pasar la ubicación de la conversión a WhatsApp y armar la plantilla de chat con un mensaje ya escrito tipo "Hola, quiero vender mi propiedad. ¿Cómo trabajás?". Se suma más adelante, porque con $5.000 por día dos conjuntos aprenden peor.
  2. 9-oct-2026: se cambiaron los flyers donde aparecía Cris. 04 ahora va con la foto 107 y el título "Vender bien no es vender barato." (el anterior daba a entender que vende barato). 10 va con la foto 80 de fondo. En Meta se subieron como "04A v2 - Vender bien - feed.png" y "10A v2 - Recomiendes foto 80 - feed.png" (copias en `NEGOCIO/Marketing/Flyers ADS/_subir`) y se cambiaron en los anuncios Precio y Vos; el "Publicar" lo hace Cris. Para flyers nuevos (Compradores, etc.) Cris quiere usar fondos de su lista. Para elegir hay una hoja numerada de las 139 fotos en `NEGOCIO/Marketing/Flyers ADS/Hoja de fotos de fondo.jpg`, con el índice de archivos en el .txt del mismo nombre. Después hay que reemplazar las imágenes en los anuncios.
  3. Al publicar, el clic final de "Publicar" lo tiene que hacer Cris (el sistema se lo bloquea al asistente).

## Próximas etapas (acordadas)
- Cuando termine el alquiler del local, sus $5.000 pasan a **Compradores**: usados por WhatsApp y formulario "Qué buscás", y pozo por WhatsApp. Textos ya aprobados en estilo:
  - "Lo que el aviso no dice": "Luminoso" que da a un pozo de aire, "a metros del subte" que son ocho cuadras.
  - "Sábados perdidos".
  - "Antes de ofertar".
- **Pozo:** Cris tiene obras en la sección "desarrollos" de su web. Hacer un carrusel con las tarjetas de cada obra. Los textos de "quién construye" o "costo total" van solo si él tiene esos datos.
- **Web:** campaña de contactos con el píxel (página "vender" y página de propiedades).
- **Remarketing:** se arma, pero queda pausado.
- **Contenido:** Cris va a grabarse hablando a cámara. Escribirle guiones con los mismos ángulos y después cambiar los videos dentro de las campañas.
- **Pulido pendiente** (Cris quiere pulirlo): textos, versiones story 1080x1920 de los flyers y preguntas del formulario.
- A las 2 semanas: mirar costo por contacto y **cuántos sirven de verdad**, y redistribuir.
- **Google Ads:** Cris ya tiene cuenta y campañas armadas con ChatGPT que traen leads malos. Las va a pasar para pulirlas. Lo que se le explicó (9-oct-2026): Google y Meta no comparten datos entre sí, el puente es la web. Si la gente que llega desde Google entra a csrealestate.com.ar, el píxel de Meta la registra y se le puede volver a mostrar anuncios en Meta (Remarketing, "visitas web", que se puede filtrar por gclid o utm_source=google). También se pueden subir listas de contactos a las dos plataformas y devolverles qué leads fueron buenos (conversiones offline o del CRM), para que cada una aprenda a traer mejores. Para que funcione, Google tiene que llevar a la web y no a formularios de Google.

## Trucos técnicos del Administrador de anuncios (Claude in Chrome)
- **Coordenadas:** las capturas usan un cuadro de 1568 px y la página mide 1920 px CSS (factor 0,8167). Para ubicar un botón: buscarlo por texto con JS, hacer `scrollIntoView` y multiplicar por 0,8167.
- **Capturas que fallan:** a veces dan error de tiempo después de hacer scroll. Usar `find` o JS para leer; `read_page` y `get_page_text` sirven poco en esta página.
- **Subir imágenes sin la ventana de Windows:** antes de tocar "Subir", parchear `HTMLInputElement.prototype.click` para que el input de archivo se agregue al DOM con `aria-label="claude-file-input"` en vez de abrir la ventana. Después buscar ese input y usar `file_upload` (máximo 10 MB por llamada). Así se subieron los 5 flyers juntos a la biblioteca de la cuenta.
- **Videos de más de 10 MB:** no se pueden subir así. Usar la publicación de Instagram ya publicada ("Usar publicaciones ya existentes"); Meta la pasa sola a Facebook.
- **Zonas por código postal:** en Lugares → "Agregar lugares de forma masiva" → Códigos postales, país Argentina, con formato C#### para CABA y B#### para Provincia. Los códigos de 4 números solos no funcionan.
- **Edad mínima:** el control no deja pasar de 25.
- **Duplicar un anuncio:** "…" del anuncio en el árbol → "Duplicar rápidamente". Desmarcar la sugerencia de agregar música y tocar "Duplicar".
- **Al terminar un anuncio:** los pasos son Contenido multimedia → Texto → Generación de imágenes (no elegir imágenes de IA) → Mejoras → OK.
- **Ojo al publicar:** el "Publicar" del editor publica solo el anuncio que está abierto. Después de publicar, revisar en la pestaña Anuncios que ninguno haya quedado en "Borrador". Para publicar varios: tildarlos en la lista y que Cris toque "Publicar" en la barra. Así pasó el 9-oct-2026 con 4 de los 5 anuncios de Propietarios.
- **Ver resultados del día:** el rango de fechas por defecto ("Últimos 30 días") NO incluye hoy. Elegir "Hoy" en el selector de fechas o agregar `&date=AAAA-MM-DD_AAAA-MM-DD%2Ctoday` a la URL. 9-oct-2026: el local registró la primera conversación de WhatsApp a las pocas horas ($583 gastados, 91 impresiones).
- **Mensaje ya escrito de WhatsApp:** a veces no se guarda al primer intento. Volver a "Editar" la plantilla, borrar, escribir, salir del campo con Tab y guardar.
