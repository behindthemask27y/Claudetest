Trabajamos en la web csrealestate.com.ar, en la carpeta `G:\Workshop Claude\#2 CSREALESTATE.COM.AR`. Vamos a rehacer los 5 formularios (`form/vender/`, `form/tasacion/`, `form/alquilar-mi-propiedad/`, `form/comprar/`, `form/buscar-alquiler/`) para que sean más fáciles, más entretenidos de completar y me den mejores datos.

**El diseño ya está aprobado en este prototipo:** https://claude.ai/artifact/HmcWRCirghefmgTNpuTwMe. Abrilo con la herramienta Artifact (`action: "read"`) y copiá su comportamiento, sus textos y sus medidas. Si no podés abrirlo, avisame. Abajo está todo lo necesario igual.

Antes de tocar nada, leé el `CLAUDE.md` de la carpeta (sobre todo "Formularios propios", "Protocolo reforzado: avisar ANTES de tocar tracking o una landing de Ads", "No tocar sin autorización" y "Reglas para nuevos botones") y el `MANUAL-DE-DISENO.md`. Los 5 formularios son las landings de las campañas de Google Ads #Search_1 a #Search_5.

Forma de trabajo:
1. Primero mostrame un plan corto y qué se puede romper.
2. Armá el motor compartido y hacé **un solo formulario de prueba (el de "cuánto vale mi propiedad")**.
3. Probalo entero y mostrámelo. Recién con mi OK, hacé los otros 4.

Respuestas cortas, sin jerga técnica.

## Palabra prohibida: "tasación"

No soy corredor matriculado. En nada que vea el cliente puede aparecer "tasación", "tasar" ni "tasador": títulos, preguntas, botones, mensajes de error, el título de la pestaña, la descripción para Google ni la pantalla final. Se dice "cuánto vale" o "valor de tu propiedad".

Los nombres internos (`lead_type: 'tasacion'`, `motivo_tasacion`, `ya_tasada`) se quedan como están porque los usa la medición. La dirección `/form/tasacion/` también se queda por ahora, porque es la URL final de #Search_2 en Google Ads. Si querés proponer pasarla a `/form/cuanto-vale/` con redirección, explicámelo aparte. En el asunto del mail usá "Cuánto vale".

## Cómo tienen que funcionar (igual que el prototipo)

- **Una pregunta por pantalla.** En las preguntas de una sola opción, al tocar una opción se marca y pasa sola a la siguiente (unos 260 ms), sin botón "Continuar". Si la persona vuelve atrás, ve su respuesta marcada y puede seguir con "Continuar".
- **El botón "atrás" del celular** (el gesto de Android o la flecha del navegador) vuelve a la pregunta anterior, no saca a la persona del formulario. Cada pantalla es un paso del historial.
- **Si cierra y vuelve** dentro de las 24 horas, sigue donde estaba. Guardalo solo en su navegador y borralo al enviar.
- **Tarjetas grandes para tocar**, con una marca a la derecha (círculo para una opción, cuadrado para varias) que se rellena en bronce con un pequeño "pop".
  - Llevan **ícono de línea** solo los tipos de propiedad (depto, casa, PH, local, otro, flipping), vivir/invertir/mi negocio y tradicional/temporario. Son los mismos íconos del prototipo, de la misma familia que WhatsApp y Email de la home.
  - Barrios, ambientes y características van como **chips**.
- **Barra de progreso** que arranca con un 8 % ya cargado y avanza con cada respuesta. Debajo, un texto:
  - en la primera pantalla: "Son preguntas de tocar. Lleva alrededor de un minuto."
  - desde el 60 %: "Ya casi está"
  - en los datos de contacto: "Último paso"
- **Frases mías** después de algunas respuestas: aparecen arriba de la pregunta siguiente, con mi foto chiquita (sacá un recorte de la cara de `foto.webp` a 112 px, `cris-avatar.webp`). Son solo las de la tabla de abajo.
- **Barras deslizables** con el número grande en bronce mientras se mueve. Los pasos son chicos abajo y más grandes arriba. Escalas:
  - Dólares: de USD 30.000 a 150.000 de a 5.000; hasta 400.000 de a 10.000; hasta 1.000.000 de a 25.000; último punto "Más de USD 1.000.000". Arranca en USD 150.000.
  - Pesos por mes: de $ 300.000 a 1.500.000 de a 50.000; hasta 4.000.000 de a 100.000; último punto "Más de $ 4.000.000". Arranca en $ 800.000. Dejá estos números en un solo lugar del código, porque con la inflación los voy a tener que actualizar.
  - Metros: de 20 a 150 m² de a 5; hasta 400 de a 10; último punto "Más de 400 m²". Arranca en 60. Con un chip "No sé los metros" que desactiva la barra.
- **"Saltar"** solo en las preguntas opcionales.
- **Barrios:**
  - Chips en dos grupos con un título chico.
    - **CABA:** Villa Urquiza, Villa Devoto, Villa del Parque, Saavedra, Núñez, Belgrano, Coghlan, Villa Pueyrredón.
    - **Zona Norte:** Vicente López, Olivos, Florida, Martínez, San Isidro.
  - Debajo, un buscador "Buscá otro barrio o localidad" con sugerencias mientras se escribe: los 48 barrios de CABA y las localidades de Zona Norte (la lista está en el prototipo). Lo que elige o escribe aparece como un chip marcado.
  - En vender, cuánto vale y alquilar mi propiedad se elige uno solo. En comprar y buscar alquiler, varios.
  - Debajo de los barrios, el campo "Calle y altura aproximada", que es opcional.
- **Todo se adapta al tipo de propiedad:**
  - Si es **Local comercial**, el tamaño pregunta solo la superficie (sin ambientes).
  - Las características son de local: Vidriera a la calle, En esquina, Baño, Depósito o sótano, Entrepiso o planta alta, Salida de humos, Apto gastronomía.
  - En comprar, si solo busca locales: "¿Es para tu negocio o para invertir?" (Para mi negocio / Para invertir) y no se pregunta por ambientes.
  - En buscar alquiler, si solo busca locales, no se pregunta por mascotas.
  - Casa y PH tienen sus propias características (tabla más abajo).
- **WhatsApp con país:**
  - Adelante del número va un selector que muestra "+54 9" y abre la lista: Argentina (+54 9), Uruguay, Chile, Paraguay, Brasil, Bolivia, Perú, Colombia, Venezuela, México, España, Italia, Estados Unidos y "Otro país" (escribe el número completo con +).
  - Debajo, una ayuda que cambia según el país. Para Argentina: "Código de área y número, sin 0 ni 15. Ej.: 11 6695 1945 o 351 555 1234", para la gente del interior.
  - El servidor recibe el número completo en formato internacional (por ejemplo +5491123456789).
- **Antes de los datos de contacto**, una frase propia de cada formulario (ver más abajo) y el título "¿A dónde te escribo?". Campos: Nombre, WhatsApp y Email. Los errores se explican en una línea.
- **Pantalla final:**
  - un check dorado que se dibuja
  - "¡Gracias, [nombre]!" y "Ya tengo todo. Te escribo por WhatsApp lo antes posible."
  - un resumen con 2 o 3 datos de la consulta
  - un botón "Escribirme ahora por WhatsApp" que abre `https://wa.me/5491166951945` con el texto "Hola Cris, soy [nombre]. Recién completé el formulario de [formulario]."
- **Detalles:**
  - Una vibración cortita al tocar en Android (si el teléfono la permite).
  - Sin animaciones con "reducir movimiento" activado.
  - Al cargar la página no se le pone foco a ningún título. Eso arregla el recuadro dorado que hoy aparece en "Sobre la propiedad".
- **Estilo:** los componentes nuevos van en `estilo.css`, definidos una sola vez para los 5, con los tokens que ya existen. El título de cada pregunta usa el nivel 3 del manual (`--titulo-tarjeta`, Chillax). El título del formulario sigue en 19 px. Anotá los componentes nuevos en el `MANUAL-DE-DISENO.md`.

## Las preguntas

Regla de oro: **los nombres de campo y los valores de las preguntas que ya existen no cambian** (los usan el mail, el historial de consultas y la medición). Lo marcado **NUEVO** se agrega. Lo que hoy es texto libre y pasa a chips se sigue mandando como texto en el mismo campo.

**Antes del contacto, en los 5:** pantalla opcional para romper el hielo, campo **NUEVO** `rompehielos`.
- Título "¿Mate o café?" y debajo "Una última, y no suma ni resta."
- Opciones: Mate / Café / Los dos / Té, la verdad.
- No suma puntos. En el mail aparece como "Para romper el hielo: Mate".

**Características según el tipo** (campo **NUEVO** `destacados`, opcional):

| Tipo | Cuánto vale | Alquilar mi propiedad |
|---|---|---|
| Departamento (y Otro) | Balcón, Cochera, Patio o terraza, Amenities, A estrenar, Apto crédito | Amoblado, Balcón, Cochera, Patio o terraza, Amenities, Acepta mascotas |
| Casa | Jardín, Pileta, Cochera, Parrilla o quincho, A estrenar, Apto crédito | Amoblado, Jardín, Pileta, Cochera, Parrilla o quincho, Acepta mascotas |
| PH | Patio, Terraza propia, Parrilla, Cochera, Sin expensas, Apto crédito | Amoblado, Patio, Terraza propia, Parrilla, Cochera, Acepta mascotas |
| Local comercial | las de local de arriba | las de local de arriba |

**Cuánto vale** (`tasacion`)
1. `tipo_propiedad`: Departamento / Casa / PH / Local comercial / Otro.
2. `ubicacion`: barrio + calle y altura aproximada. Se manda "Belgrano · Av. Cabildo 2000".
3. Tamaño: **NUEVO** `ambientes` (Monoambiente / 2 / 3 / 4 / 5 o más; no va en locales) + **NUEVO** `superficie` (barra de m², o "sin dato").
4. `destacados`.
   - `descripcion_breve` el servidor lo exige: armalo solo, por ejemplo "3 ambientes · 75 m² · Balcón, Cochera".
5. `motivo_tasacion` (título "¿Para qué querés saber el valor?"): Para vender / Para alquilar / Por una sucesión o división / Para tener una referencia / Otro motivo.
6. **NUEVO** `plazo_venta` ("¿Cuándo pensás vender?"): En los próximos 3 meses / Entre 3 y 12 meses / Más adelante / No pienso vender.
7. **NUEVO** `titularidad` ("¿Sos el dueño?"): Soy el único dueño / Somos varios dueños / Es una sucesión / Consulto por un familiar o conocido.
8. `ya_tasada`, con título nuevo "¿Ya te dieron un valor de tu propiedad?" y los valores actuales.
9. Rompehielos.
10. Contacto.

**Vender** (`vender`)
1. `tipo_propiedad`.
2. `localidad`: barrio. Más **NUEVO** `direccion` (calle y altura aproximada, opcional).
3. **NUEVO** `ambientes` + `superficie`.
4. `estado_general`, en 2 columnas.
5. `situacion_actual`.
6. **NUEVO** `titularidad`.
7. `plazo` (opcional).
8. `motivo` (opcional): chips "Me mudo a otra propiedad" / "Necesito el dinero" / "Separación" / "Es una inversión" / "Otro motivo".
9. `valor_en_mente` (opcional).
   - Si responde "Sí" o "Tengo una idea aproximada": pantalla con la barra en dólares (**NUEVO** `valor_estimado`, se manda "USD 310.000") y abajo los chips de `como_llego_valor`.
10. `publicada_actualmente`.
11. `documentacion` (varias, obligatoria).
12. **NUEVO** `compra_despues`: Sí / Tal vez / No.
13. `como_continuar`.
14. Rompehielos.
15. Contacto.

**Alquilar mi propiedad** (`alquilar_propiedad`)
1. `tipo_propiedad`.
2. `ubicacion`: igual que cuánto vale.
3. **NUEVO** `ambientes` + `superficie`.
4. `destacados`.
   - `descripcion_breve` armado igual que en cuánto vale.
5. `situacion_actual`.
6. `disponibilidad` (opcional).
7. **NUEVO** `valor_alquiler`: barra en pesos, o el botón "Quiero que me ayudes a definirlo".
8. `que_es_importante` (varias).
9. **NUEVO** `como_continuar`: Quiero coordinar una reunión / Quiero que vengas a ver la propiedad / Quiero saber cuánto podría cobrar / Por ahora solamente estoy averiguando.
10. Rompehielos.
11. Contacto.

**Comprar** (`comprar`)
1. `tipo_propiedad` (varias, con ícono; Flipping con la aclaración "Para reciclar y vender").
2. `destino_compra`: Para vivir / Para invertir. Si solo busca locales: Para mi negocio / Para invertir.
3. `zona`: barrios, varios.
4. `ambientes` (opcional, varios chips; no va si solo busca locales).
5. `presupuesto`: barra en dólares, o "Prefiero hablarlo".
6. `forma_compra`.
7. `credito_preaprobado`: **solo** si eligió crédito o combinación.
8. `plazo_compra`.
9. `visitando`.
10. `caracteristicas_indispensables` (opcional, chips): Balcón / Cochera / Patio o terraza / Amenities / Apto crédito / Luminoso / A estrenar.
    - Si busca casa, se suman Jardín y Pileta.
    - Si busca local junto con otra cosa, se suma Vidriera a la calle.
    - Si solo busca locales, van las de local.
    - Abajo, `algo_mas` como texto opcional.
11. Rompehielos.
12. Contacto.

**Buscar alquiler** (`buscar_alquiler`)
1. `modalidad`: Tradicional ("Contrato por años") / Temporario ("Por días o meses").
2. `tipo_propiedad` (varias).
3. `zona`: barrios, varios.
4. `que_necesita` (obligatoria; chips + texto opcional): 1 ambiente / 2 ambientes / 3 ambientes o más / Balcón / Cochera / Amoblado / Patio o terraza / Lavadero / Nada en especial.
   - "Nada en especial" desmarca las demás.
   - Si solo busca locales: Vidriera a la calle / En esquina / Baño / Depósito o sótano / Apto gastronomía / Nada en especial.
5. `presupuesto_mensual`: barra en pesos, o "Prefiero hablarlo".
6. `para_cuando`: Ya, este mes / En 1 a 2 meses / En 3 meses o más / Todavía no tengo fecha.
7. `como_respalda` (varias, valores actuales).
8. `mascotas`: No / Sí, perro / Sí, gato / Sí, otra. No va si solo busca locales: en ese caso mandá "No aplica (local)", porque el servidor exige el campo.
9. Rompehielos.
10. Contacto.

**Frases mías** (aparecen arriba de la pregunta siguiente):

| Formulario | Si responde | Frase |
|---|---|---|
| Vender | Es una sucesión | "Gracias por aclararlo. Con una sucesión conviene arrancar con los papeles antes de publicar." |
| Vender | Lo antes posible | "Perfecto. Si hay apuro, lo primero es definir bien el precio." |
| Vender | Dentro de 1 a 3 meses | "Buen plazo: alcanza para preparar bien la salida." |
| Vender | Quiero que me ayudes a definirlo | "Lo armamos juntos, con propiedades comparables de la zona." |
| Vender | Estuvo publicada anteriormente | "Bien saberlo. Vamos a revisar qué pasó para no repetirlo." |
| Vender | Compra después: Sí | "Bien. Podemos coordinar las dos operaciones para que no quedes en el medio." |
| Cuánto vale | Para vender | "Bien. Con el valor claro, después es más fácil decidir cuándo salir." |
| Cuánto vale | Sí, más de una | "Si te dieron números distintos, te ayudo a entender por qué." |
| Alquilar | Vacía y disponible | "Ideal: así se puede mostrar sin coordinar con nadie." |
| Alquilar | Quiero que me ayudes a definirlo | "Lo definimos con alquileres parecidos de la zona." |
| Comprar | Para invertir | "Mirá también los desarrollos en pozo: se pagan en cuotas en dólares." |
| Comprar | Necesito vender otra propiedad primero | "Te puedo ayudar con las dos: vender la tuya y encontrar la próxima." |
| Comprar | Todavía no lo empecé | "Conviene arrancarlo pronto: saber cuánto te prestan ordena toda la búsqueda." |
| Buscar alquiler | Todavía necesito asesoramiento sobre esto | "Tranqui, te explico qué opciones hay y cuál te conviene." |
| Todos | Mate | "Anotado. Si nos juntamos, el mate lo pongo yo." |
| Todos | Café | "Anotado. Si nos juntamos, el café corre por mi cuenta." |
| Todos | Los dos | "Me caés bien. Anotado." |
| Todos | Té, la verdad | "Respeto. Anotado." |

**Frase antes del contacto:**
- Vender: "Listo. Con esto ya puedo preparar nuestra primera charla."
- Cuánto vale: "Listo. Con esto ya puedo analizar tu propiedad."
- Alquilar: "Listo. Con esto ya puedo pensar cómo alquilarla."
- Comprar y Buscar alquiler: "Listo. Con esto ya puedo empezar a buscar."

## La temperatura (la calcula el servidor, `enviar-lead.php`)

Cada consulta suma de 0 a 2 puntos en tres preguntas. **5 o 6 = Caliente · 3 o 4 = Tibia · 0 a 2 = Fría.**

| Formulario | ¿Cuándo? | ¿Puede? | ¿Quiere avanzar? |
|---|---|---|---|
| Vender | `plazo`: lo antes posible o 1 a 3 meses = 2; 3 a 6 o 6 a 12 meses = 1 | 1 punto si es dueño (único o varios) + 1 si marcó Escritura | `como_continuar`: reunión o visita = 2; orientación de valor o conocer cómo trabajo = 1 |
| Cuánto vale | `plazo_venta`: próximos 3 meses = 2; 3 a 12 meses = 1 | `titularidad`: dueño (único o varios) = 2; sucesión = 1 | `motivo_tasacion`: para vender = 2; para alquilar o sucesión = 1 |
| Alquilar | `disponibilidad`: ahora o 30 días = 2; 3 meses = 1 | `situacion_actual`: vacía y disponible = 2; próximamente = 1 | `como_continuar`: reunión o "que vengas a ver la propiedad" = 2; "cuánto podría cobrar" = 1 |
| Comprar | `plazo_compra`: lo antes posible o 3 meses = 2; 6 meses = 1 | fondos propios = 2; crédito preaprobado = 2; crédito en trámite = 1; necesita vender primero = 1 | `visitando`: varias = 2; alguna = 1 |
| Buscar alquiler | `para_cuando`: ya, este mes = 2; 1 a 2 meses = 1 | `como_respalda`: garantía propietaria, caución o recibos = 2; otra = 1 | `presupuesto_mensual`: dio número = 2; "Prefiero hablarlo" = 1 |

Lo que no figura, o una pregunta sin responder, vale 0.

**Avisos** que van aparte en el mail:
- "También vende": comprador que necesita vender primero.
- "También compra" o "Tal vez compra": vendedor que después compra.
- "Sucesión".
- "Ya está publicada".
- "Comparando valores".
- "Quiere que gestiones todo".
- "Inversor".

**En el mail:**
- Asunto: "🔥 Caliente · Vender · Juan Pérez" (🌡️ Tibia, ❄️ Fría).
- Arriba del cuerpo, los 3 puntos con la respuesta que los dio, los avisos y el rompehielos.
- Guardá también `temperatura` y `puntaje` en el registro de consultas.

**Regla para el servidor:** los campos NUEVOS se suman a la lista de cada formulario y a las etiquetas del mail, pero **el servidor no los exige**. Así no se pierde una consulta que llegue desde una versión vieja del formulario, como ya explica el `CLAUDE.md`.

**Calibración:** dejá los puntos en un solo lugar del código. En uno o dos meses los ajustamos con las consultas que avanzaron de verdad.

## Lo que no se puede romper

- El evento `generate_lead` con su `lead_type` y `form_name`, igual que hoy.
- La atribución (gclid, gbraid, wbraid, utm_*).
- La trampa anti-robots (`sitio_web`) y `_ts`. **Revisá que el tiempo mínimo de `_ts` no rechace a alguien que completa todo tocando rápido.**
- La ventana de Política de Privacidad y la nota de aceptación antes de "Enviar".
- **El teléfono:** ahora va en formato internacional. Fijate que nada en GTM espere el formato viejo.
- **El botón de WhatsApp del final** es un botón comercial nuevo. Proponeme su `boton_id` antes de crearlo.
- **No mandes la temperatura a Google Ads todavía.** Dejame por escrito cómo sería (valor por consulta: Caliente 100, Tibia 30, Fría 5) y lo decidimos aparte.
- **Las direcciones de los 5 formularios no cambian**: son las URL finales de los anuncios.

## Pruebas antes de darlo por terminado

Por cada formulario:
- Recorrido completo con el PHP local (ver "PHP local para probar" en el `CLAUDE.md`).
- Que el mail llegue con la temperatura y las etiquetas legibles, y que la consulta quede guardada.
- `generate_lead` visto en GTM Preview, y Meta Test Events.
- Que los UTM y el gclid lleguen.
- Celular a 390 px y 320 px, y compu.
- Con "reducir movimiento" activado y solo con teclado.
- El botón atrás del celular, y cerrar y volver a abrir a mitad del formulario.
- Un local comercial de punta a punta.
- Un WhatsApp de otro país.

Buscá en los 5 formularios cualquier "tasación" visible y sacala. No digas que la medición funciona si no lo probaste.

Después:
- Actualizá el `CLAUDE.md` ("Formularios propios": campos nuevos, temperatura y cómo calibrarla) y el `MANUAL-DE-DISENO.md`.
- Sumá `cris-avatar.webp` a la lista de `armar-zip.ps1`.
- Armá el zip. Cuando lo suba, verificá en vivo los 5 formularios.
- Recordame: "Este cambio afecta la documentación de Ads/Tracking. Conviene exportar GTM y actualizar el Master."
