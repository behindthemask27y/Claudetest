# Estado y pendientes de Marketing — 16/10/2026

> **Copia para el repo.** El original vive en la compu de Cris (`NEGOCIO/Marketing/Estado-y-pendientes.md`). Versión de esta copia: 2026-10-16 (editada en una sesión de la nube). Si en una sesión de la nube se cambia algo acá, avisale a Cris qué archivo cambió para que lo pase al original; si no, la próxima vez que suba la copia se pisa.


**Qué es:** dónde estamos con Google Ads, Meta y la medición del sitio: qué se decidió, qué se hizo y qué falta.
**Cuándo leerlo:** al retomar cualquier pedido de Marketing (campañas, flyers y copys para anuncios, medición, sitio). No hace falta para ACM, WhatsApp u otros temas. Se actualiza al cerrar cada tarea (fecha + qué).
**Palabras que se usan en el chat:** "Lote 1" = la primera tanda de cambios de Google Ads (carpeta `lote1_google_ads/`); `hot_lead` = el aviso que se dispara con las consultas CALIENTE (5 o 6 puntos de 6).
Documento resumen para Cris (Claude Docs, con el mapa y las tablas): https://claude.ai/code/artifact/888979c8-507c-4560-bd18-bef674b41826

## Dónde estamos, en 6 líneas
1. En un mes (11/9–13/10) se gastaron ~263.000 pesos (Google 208.920 + Meta 53.886) y entraron ~19 consultas de formulario atribuidas a anuncios, **0 clientes**.
2. Google: poco volumen (~116 impresiones/día), medición mezclada (`generate_lead` cuenta los 5 formularios) y consultas de baja intención. Lote 1 de cambios **preparado, sin importar ni publicar**.
3. Meta: campañas nuevas (9/10) con 3 a 4 días de datos; 2 consultas de formulario, ninguna respondió. Hay 219 eventos `Lead` de servidor sin origen identificado.
4. Medición: `generate_lead` verificado de punta a punta (GA4 12 vs registro 13 en octubre). Nuevo evento `hot_lead` para consultas CALIENTE, ya en el sitio y en GTM.
5. La temperatura (caliente/tibia/fría) existe desde el 12/10: todavía no hay consultas reales con puntaje.
6. Regla de oro: **no se cambia nada sin OK de Cris, y después de un lote se esperan 3 semanas.**

## Novedades del 16/10 (lo de Cris es "según Cris"; lo de Google es lo que muestra el export del Editor)
- **Meta Propietarios trajo el primer cliente** (según Cris): una propiedad en San Justo; la semana que viene firma la autorización y la exclusiva. Google: ningún cliente todavía. Es un solo caso: todavía no es una conclusión.
- **Lote 1 quedó a medias** (export del Editor del 16/10). Figuran hechos: borrador de Búsqueda borrado, las 10 negativas en Vendedores y Valor propiedad, anuncios de esas dos campañas yendo a sus formularios y las palabras amplias de Vendedores pausadas. **No** figuran: pausar la campaña 11 y la 4, ni reactivar el Grupo de anuncios 1 (sigue pausado y su anuncio va a la home). Ojo: es lo que tiene el Editor; si algo se importó y no se publicó, la cuenta real puede ser distinta. Fecha de lo aplicado: Cris no la recuerda.
- **Presupuestos más altos de lo anotado:** el export muestra #Search_1_vendedores y #Search_4_compradores en 3.000 por día (figuraban en 1.000). Tope diario de las 4 activas = 10.500, no 6.500. Falta saber si los subió Cris o si fue una recomendación automática de Google.
- **Decisión de Cris (16/10): presupuesto fijo y no tocarlo más.** Google a 3.000 por día en total. Borrador en `lote2_google_ads/` (Vendedores 2.000, Valor propiedad 1.000, pausar Compradores y WhatsApp): **sin importar ni publicar**. Falta su OK sobre pausar Compradores (antes había dicho que no se pausaba). Al publicarlo: 3 semanas sin tocar Google.
- **Meta:** Cris también quiere un tope fijo; falta el número por día.
- **Local Nazca (según Cris):** radio de Meta de 4 a 6 km (fecha sin confirmar); unas 5 consultas en una semana, ~5.000 por conversión; piden el precio y desaparecen; los destacados del portal no trajeron nada. En Google, la campaña para quienes buscan local es `#Search_8_locales_busqueda` (pausada, palabras generales, sin página propia del local), no la 7. Por ahora no se reactiva.
- **Sitio:** las propiedades no tienen link propio cada una (según Cris). Para compartir y para anuncios por ahora sirven los links de portales o de Red Suma; una página por propiedad en el sitio quedaría como tarea aparte (el código del sitio no está en este repo).

## Decisiones tomadas (no volver a preguntar)
- **Evento `hot_lead`** (no valores por consulta 100/30/5 por ahora): se dispara cuando el mail dice CALIENTE (5 o 6 puntos), en los 5 formularios, una vez por consulta, después de `generate_lead`.
- En Google Ads `hot_lead` es **secundaria** (categoría Contacto, sin valor, recuento "una", 90 días, basada en datos). `generate_lead` sigue siendo la única principal. No se ponen las dos como principales (contaría doble).
- Ruta de medición: GTM → GA4 → Google Ads. La etiqueta directa de Google Ads en GTM sigue pausada.
- Terrenos: no por ahora (las negativas "terreno" y "terrenos" quedan). Concordancia amplia: no por ahora. Presupuesto: no subirlo hasta conocer el costo por consulta caliente.
- Los cambios de Google Ads se hacen con CSV para el Editor que importa Cris; se publican recién cuando él aprueba.
- Textos: sin "tasación" en lo que ve el cliente (como palabra clave de búsqueda sí); sin Instagram; CABA y no "Capital"; sin matrícula a nombre de Cris (corredor responsable: VL REALTOR).
- Meta: sin categoría "Vivienda"; el clic final de "Publicar" lo hace Cris.
- Instagram (decidido 13/10): no se nombra ni se linkea el perfil `@cristian.sted` (no es público) en textos, anuncios, web ni piezas; Meta sí pauta en Instagram y el anuncio del local sigue con su reel.
- Tiempo quieto después de un cambio grande: 3 semanas en Google, 2 en Meta (decidido 13/10).
- Datos personales: nunca nombres, teléfonos ni emails de consultas del sitio o de anuncios en archivos, commits ni chat (los casos de ACM, búsquedas y Dueño vende son otra cosa: ahí son parte del trabajo).
- Cris prefiere instrucciones **paso a paso, definiendo cada paso** (dónde hacer clic, qué debería ver). Se abruma con muchas plataformas.

## Hecho
- 8/10: corregido el deploy de los formularios (atribución y opciones únicas).
- 9/10: Meta: publicadas Propietarios - Captación y Alquiler - Local Nazca; pausada META_1_Leads_Propietarios.
- 12/10: formularios nuevos con rompehielos y temperatura en el mail.
- 13/10: paquete `hot_lead/` (carpeta del repo) armado y validado (sintaxis y lógica del puntaje); **subido al sitio por Cris** (`motor.js?v=36269df0` en vivo).
- 13/10 (según Cris): etiquetas y activador de `hot_lead` en GTM probados en Tag Assistant; evento clave `hot_lead` creado en GA4 ("crear con código", una vez por evento, sin valor); importado en Google Ads como secundaria (Contacto).
- 13/10: documento resumen en Claude Docs; contextos de Marketing fusionados con los anteriores; primera tanda de cambios de Google en su carpeta.

## Esperando confirmación
- Que la versión de GTM con `hot_lead` esté **publicada** (Cris dijo que iba a publicar). Que la consulta TIBIA de prueba **no** haya disparado `hot_lead`.
- 14/10: que `hot_lead` aparezca en GA4 (*Eventos clave*) y que Google Ads lo reconozca (puede tardar hasta un día).

## Pendiente — de Cris
1. **Lote 1 de Google Ads**: seguir `lote1_google_ads/LEEME-lote1-google-ads.md` (importar A y B, borrar el borrador, cambiar URL de los anuncios, revisar y publicar). Después, 3 semanas sin tocar.
2. Contestar cada consulta en minutos y anotarla en el CRM propio de Cris (todavía no vinculado con Claude) con origen, temperatura y etapa. En Meta, no borrar: marcar la etapa.
3. Meta: buscar el origen de los 219 eventos de servidor (Events Manager → *Historial* y *Configuración*) y revisar el checklist de `contexto/meta-ads.md`.
4. Pasarle a Claude: costo y conversiones del Grupo 1 antes de pausarlo, y (más adelante) las consultas con puntaje.
5. Anotar en el `CLAUDE.md` **del sitio** lo de `hot_lead` (ver `contexto/medicion-y-sitio.md`, sección de historia).

## Pendiente — de Claude
- Cuando Cris publique el Lote 1: anotar la fecha acá y recordar la revisión a las 3 semanas.
- Con las primeras consultas puntuadas: validar la regla (¿las calientes contestan?) y, si hace falta, ajustar `$PUNTOS`.
- A las 3 semanas del lote: costo por `hot_lead` por campaña → decidir entre optimizar por valor o `hot_lead` principal.
- Revisión de Meta a las 2 o 3 semanas por costo por consulta respondida.
- Meta Propietarios sin respuestas → proponer (de a una cosa) conjunto WhatsApp, pregunta de dueño o ajuste de texto.
- Si Cris trae clientes reales: armar la importación de conversiones con `gclid`.

## Números base para comparar (antes del Lote 1)
Google 11/9–12/10: 208.920 gastados, 17 conversiones, ~12.300 por conversión; del 1 al 12/10 ~13.200. Meta 12/9–11/10: 53.886 gastados; Propietarios 13.854 por consulta (n=1), Local Nazca 4.524 por conversación (n=3).
Consultas del sitio 22/9–12/10: 27 reales (valor 16, vender 5, comprar 4, buscar alquiler 2) + 4 de prueba.

## Qué subirle a Claude en la próxima sesión
Export del Editor, términos de búsqueda con costo y conversiones, rendimiento por campaña, historial de cambios, informe de Meta por campaña y
conjunto, y las consultas **sin nombre, teléfono ni email** (puntaje, temperatura, origen, si contestó). **Nunca** subir `leads.jsonl` ni CSV de leads con datos personales.

## Archivos del repo
`contexto/` (estos documentos), `hot_lead/` (paquete del evento), `lote1_google_ads/` (CSV y guía), `crm/CRM_Inmobiliario.xlsx` (planilla de ejemplo; el CRM real de Cris todavía no está vinculado con Claude),
`prompts/` (prompts de otras sesiones para la home y los formularios; el estado de las etapas 1 a 3 de la home no está confirmado),
`Workshop Claude.zip` (material anterior: carpeta para propietarios, estrategia de WhatsApp, "Dueño vende", sistema de diseño, contextos viejos).
El original de todo esto vive en la compu de Cris (Workshop, carpeta `NEGOCIO/`): ver el aviso de arriba.
