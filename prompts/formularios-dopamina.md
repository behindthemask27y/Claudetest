Trabajamos en la web csrealestate.com.ar, en la carpeta `G:\Workshop Claude\#2 CSREALESTATE.COM.AR`. Vamos a rehacer los 5 formularios (`form/vender/`, `form/tasacion/`, `form/alquilar-mi-propiedad/`, `form/comprar/`, `form/buscar-alquiler/`) para que sean más fáciles, más entretenidos de completar y me den mejores datos.

**El diseño ya está aprobado en este prototipo:** https://claude.ai/artifact/HmcWRCirghefmgTNpuTwMe. Abrilo con la herramienta Artifact (`action: "read"`) y copiá su comportamiento, sus textos y sus medidas. Si no podés abrirlo, avisame. Abajo está todo lo necesario igual.

Antes de tocar nada, leé el `CLAUDE.md` de la carpeta (sobre todo "Formularios propios", "Protocolo reforzado: avisar ANTES de tocar tracking o una landing de Ads", "No tocar sin autorización" y "Reglas para nuevos botones") y el `MANUAL-DE-DISENO.md`. Los 5 formularios son las landings de las campañas de Google Ads #Search_1 a #Search_5.

Forma de trabajo:
1. Primero mostrame un plan corto y qué se puede romper.
2. Armá el motor compartido y hacé **un solo formulario de prueba (tasación)**.
3. Probalo entero y mostrámelo. Recién con mi OK, hacé los otros 4.

Respuestas cortas, sin jerga técnica.

## Cómo tienen que funcionar (igual que el prototipo)

- **Una pregunta por pantalla.** En las preguntas de una sola opción, al tocar una opción se marca y pasa sola a la siguiente (unos 260 ms), sin botón "Continuar". Si la persona vuelve atrás, ve su respuesta marcada y puede seguir con "Continuar".
- **Tarjetas grandes para tocar**, con una marca a la derecha (círculo para una opción, cuadrado para varias) que se rellena en bronce con un pequeño "pop".
  - Llevan **ícono de línea** solo los tipos de propiedad (depto, casa, PH, local, otro, flipping), vivir/invertir y tradicional/temporario. Son los mismos íconos del prototipo, de la misma familia que WhatsApp y Email de la home.
  - Barrios, ambientes y características van como **chips** (botones redondeados).
- **Barra de progreso** que arranca con un 8 % ya cargado y avanza con cada respuesta. Debajo, un texto:
  - en la primera pantalla: "Son preguntas de tocar. Lleva alrededor de un minuto."
  - desde el 60 %: "Ya casi está"
  - en los datos de contacto: "Último paso"
- **Frases mías** después de algunas respuestas: aparecen arriba de la pregunta siguiente, con mi foto chiquita (sacá un recorte de la cara de `foto.webp` a 112 px, `cris-avatar.webp`). Son las de la tabla de abajo, ni una más.
- **Barras deslizables** con el número grande en bronce mientras se mueve. Los pasos son chicos abajo y más grandes arriba. Escalas:
  - Dólares: de USD 30.000 a 150.000 de a 5.000; hasta 400.000 de a 10.000; hasta 1.000.000 de a 25.000; último punto "Más de USD 1.000.000". Arranca en USD 150.000.
  - Pesos por mes: de $ 300.000 a 1.500.000 de a 50.000; hasta 4.000.000 de a 100.000; último punto "Más de $ 4.000.000". Arranca en $ 800.000. Dejá estos números en un solo lugar del código, porque con la inflación los voy a tener que actualizar.
  - Metros: de 20 a 150 m² de a 5; hasta 400 de a 10; último punto "Más de 400 m²". Arranca en 60. Con un chip "No sé los metros" que desactiva la barra.
- **"Saltar"** solo en las preguntas opcionales.
- **Antes de los datos de contacto**, una frase propia de cada formulario (ver tabla) y el título "¿A dónde te escribo?".
  - Campos: Nombre, WhatsApp (con "+54 9" fijo adelante y teclado numérico) y Email.
  - Los errores se explican en una línea.
- **Pantalla final:**
  - un check dorado que se dibuja
  - "¡Gracias, [nombre]!" y "Ya tengo todo. Te escribo por WhatsApp en el día." (**confirmame esa frase**)
  - un resumen con 2 o 3 datos de la consulta
  - un botón "Escribirme ahora por WhatsApp" que abre `https://wa.me/5491166951945` con el texto "Hola Cris, soy [nombre]. Recién completé el formulario de [formulario]."
- **Detalles:**
  - Una vibración cortita al tocar en Android (si el teléfono la permite).
  - Sin animaciones con "reducir movimiento" activado.
  - Al cargar la página no se le pone foco a ningún título. Eso arregla el recuadro dorado que hoy aparece en "Sobre la propiedad".
- **Estilo:** los componentes nuevos van en `estilo.css`, definidos una sola vez para los 5, con los tokens que ya existen. El título de cada pregunta usa el nivel 3 del manual (`--titulo-tarjeta`, Chillax). El título del formulario sigue en 19 px. Anotá los componentes nuevos en el `MANUAL-DE-DISENO.md`.

## Las preguntas

Regla de oro: **los nombres de campo y los valores de las preguntas que ya existen no cambian** (los usan el mail, el historial de consultas y la medición). Lo marcado **NUEVO** se agrega. Lo que hoy es texto libre y pasa a chips se sigue mandando como texto en el mismo campo.

**Tasación** (`tasacion`)
1. `tipo_propiedad`: Departamento / Casa / PH / Local comercial / Otro.
2. `ubicacion`: chips de barrios + "Otro barrio o localidad" + "Calle y altura (opcional)". Se manda "Belgrano · Av. Cabildo 2000".
3. Tamaño: **NUEVO** `ambientes` (Monoambiente / 2 / 3 / 4 / 5 o más) + **NUEVO** `superficie` (barra de m², o "sin dato").
4. **NUEVO** `destacados` (opcional, varios): Balcón / Cochera / Patio o terraza / Amenities / A estrenar / Apto crédito.
   - `descripcion_breve` el servidor lo exige: armalo solo, por ejemplo "3 ambientes · 75 m² · Balcón, Cochera".
5. `motivo_tasacion`: Para vender / Para alquilar / Por una sucesión o división / Para tener una referencia / Otro motivo.
6. **NUEVO** `plazo_venta`: En los próximos 3 meses / Entre 3 y 12 meses / Más adelante / No pienso vender.
7. **NUEVO** `titularidad`: Soy el único dueño / Somos varios dueños / Es una sucesión / Consulto por un familiar o conocido.
8. `ya_tasada`: valores actuales.
9. Contacto.

**Vender** (`vender`)
1. `tipo_propiedad`.
2. `localidad`: chips + texto. Más **NUEVO** `direccion` (calle y altura, opcional).
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
14. Contacto.

**Alquilar mi propiedad** (`alquilar_propiedad`)
1. `tipo_propiedad`.
2. `ubicacion`: igual que tasación.
3. **NUEVO** `ambientes` + `superficie`.
4. **NUEVO** `destacados` (opcional): Amoblado / Balcón / Cochera / Patio o terraza / Amenities / Acepta mascotas.
   - `descripcion_breve` armado igual que en tasación.
5. `situacion_actual`.
6. `disponibilidad` (opcional).
7. **NUEVO** `valor_alquiler`: barra en pesos, o el botón "Quiero que me ayudes a definirlo".
8. `que_es_importante` (varias).
9. Contacto.

**Comprar** (`comprar`)
1. `tipo_propiedad` (varias, con ícono; Flipping con la aclaración "Para reciclar y vender").
2. `destino_compra`: Para vivir / Para invertir.
3. `zona`: chips de barrios (varios) + "Otra zona".
4. `ambientes` (opcional, varios chips).
5. `presupuesto`: barra en dólares, o "Prefiero hablarlo".
6. `forma_compra`.
7. `credito_preaprobado`: **solo** si eligió crédito o combinación.
8. `plazo_compra`.
9. `visitando`.
10. `caracteristicas_indispensables` (opcional, chips): Balcón / Cochera / Patio o terraza / Amenities / Apto crédito / Luminoso / A estrenar. Más `algo_mas` como texto opcional.
11. Contacto.

**Buscar alquiler** (`buscar_alquiler`)
1. `modalidad`: Tradicional ("Contrato por años") / Temporario ("Por días o meses").
2. `tipo_propiedad` (varias).
3. `zona` (varios chips + otra).
4. `que_necesita` (obligatoria; chips + texto opcional): 1 ambiente / 2 ambientes / 3 ambientes o más / Balcón / Cochera / Amoblado / Patio o terraza / Lavadero / Nada en especial ("Nada en especial" desmarca las demás).
5. `presupuesto_mensual`: barra en pesos, o "Prefiero hablarlo".
6. `para_cuando`: Ya, este mes / En 1 a 2 meses / En 3 meses o más / Todavía no tengo fecha.
7. `como_respalda` (varias, valores actuales).
8. `mascotas`: No / Sí, perro / Sí, gato / Sí, otra.
9. Contacto.

**Barrios de los chips:** Belgrano, Núñez, Saavedra, Villa Urquiza, Coghlan, Villa Pueyrredón, Villa Devoto, Villa del Parque, Vicente López, Olivos, Florida, Martínez y San Isidro. **Confirmame la lista antes de usarla.**

**Frases mías** (aparecen arriba de la pregunta siguiente):

| Formulario | Si responde | Frase |
|---|---|---|
| Vender | Es una sucesión | "Gracias por aclararlo. Con una sucesión conviene arrancar con los papeles antes de publicar." |
| Vender | Lo antes posible | "Perfecto. Si hay apuro, lo primero es definir bien el precio." |
| Vender | Dentro de 1 a 3 meses | "Buen plazo: alcanza para preparar bien la salida." |
| Vender | Quiero que me ayudes a definirlo | "Lo armamos juntos, con propiedades comparables de la zona." |
| Vender | Estuvo publicada anteriormente | "Bien saberlo. Vamos a revisar qué pasó para no repetirlo." |
| Vender | Compra después: Sí | "Bien. Podemos coordinar las dos operaciones para que no quedes en el medio." |
| Tasación | Para vender | "Bien. Con el valor claro, después es más fácil decidir cuándo salir." |
| Tasación | Sí, más de una | "Si te dieron números distintos, te ayudo a entender por qué." |
| Alquilar | Vacía y disponible | "Ideal: así se puede mostrar sin coordinar con nadie." |
| Alquilar | Quiero que me ayudes a definirlo | "Lo definimos con alquileres parecidos de la zona." |
| Comprar | Para invertir | "Mirá también los desarrollos en pozo: se pagan en cuotas en dólares." |
| Comprar | Necesito vender otra propiedad primero | "Te puedo ayudar con las dos: vender la tuya y encontrar la próxima." |
| Comprar | Todavía no lo empecé | "Conviene arrancarlo pronto: saber cuánto te prestan ordena toda la búsqueda." |
| Buscar alquiler | Todavía necesito asesoramiento sobre esto | "Tranqui, te explico qué opciones hay y cuál te conviene." |

**Frase antes del contacto:**
- Vender: "Listo. Con esto ya puedo preparar nuestra primera charla."
- Tasación: "Listo. Con esto ya puedo analizar tu propiedad."
- Alquilar: "Listo. Con esto ya puedo pensar cómo alquilarla."
- Comprar y Buscar alquiler: "Listo. Con esto ya puedo empezar a buscar."

## La temperatura (la calcula el servidor, `enviar-lead.php`)

Cada consulta suma de 0 a 2 puntos en tres preguntas. **5 o 6 = Caliente · 3 o 4 = Tibia · 0 a 2 = Fría.**

| Formulario | ¿Cuándo? | ¿Puede? | ¿Quiere avanzar? |
|---|---|---|---|
| Vender | `plazo`: lo antes posible o 1 a 3 meses = 2; 3 a 6 o 6 a 12 meses = 1 | 1 punto si es dueño (único o varios) + 1 si marcó Escritura | `como_continuar`: reunión o visita = 2; orientación de valor o conocer cómo trabajo = 1 |
| Tasación | `plazo_venta`: próximos 3 meses = 2; 3 a 12 meses = 1 | `titularidad`: dueño (único o varios) = 2; sucesión = 1 | `motivo_tasacion`: para vender = 2; para alquilar o sucesión = 1 |
| Alquilar | `disponibilidad`: ahora o 30 días = 2; 3 meses = 1 | `situacion_actual`: vacía y disponible = 2; próximamente = 1 | `que_es_importante`: si marcó "Alguien que gestione todo" o "Asesoramiento con documentación y contrato" = 2; otra cosa = 1 |
| Comprar | `plazo_compra`: lo antes posible o 3 meses = 2; 6 meses = 1 | fondos propios = 2; crédito preaprobado = 2; crédito en trámite = 1; necesita vender primero = 1 | `visitando`: varias = 2; alguna = 1 |
| Buscar alquiler | `para_cuando`: ya, este mes = 2; 1 a 2 meses = 1 | `como_respalda`: garantía propietaria, caución o recibos = 2; otra = 1 | `presupuesto_mensual`: dio número = 2; "Prefiero hablarlo" = 1 |

Lo que no figura, o una pregunta sin responder, vale 0.

**Avisos** que van aparte en el mail:
- "También vende": comprador que necesita vender primero.
- "También compra" o "Tal vez compra": vendedor que después compra.
- "Sucesión".
- "Ya está publicada".
- "Comparando tasaciones".
- "Quiere que gestiones todo".
- "Inversor".

**En el mail:**
- Asunto: "🔥 Caliente · Vender · Juan Pérez" (🌡️ Tibia, ❄️ Fría).
- Arriba del cuerpo, los 3 puntos con la respuesta que los dio y los avisos.
- Guardá también `temperatura` y `puntaje` en el registro de consultas.

**Regla para el servidor:** los campos NUEVOS se suman a la lista de cada formulario y a las etiquetas del mail, pero **el servidor no los exige**. Así no se pierde una consulta que llegue desde una versión vieja del formulario, como ya explica el `CLAUDE.md`.

**Calibración:** dejá los puntos en un solo lugar del código. En uno o dos meses los ajustamos con las consultas que avanzaron de verdad.

## Lo que no se puede romper

- El evento `generate_lead` con su `lead_type` y `form_name`, igual que hoy.
- La atribución (gclid, gbraid, wbraid, utm_*).
- La trampa anti-robots (`sitio_web`) y `_ts`. **Revisá que el tiempo mínimo de `_ts` no rechace a alguien que completa todo tocando rápido.**
- La ventana de Política de Privacidad y la nota de aceptación antes de "Enviar".
- **El teléfono:** si lo mandás con "+549" adelante, fijate que nada en GTM espere el formato viejo.
- **El botón de WhatsApp del final** es un botón comercial nuevo. Proponeme su `boton_id` antes de crearlo.
- **No mandes la temperatura a Google Ads todavía.** Dejame por escrito cómo sería (valor por consulta: Caliente 100, Tibia 30, Fría 5) y lo decidimos aparte.

## Pruebas antes de darlo por terminado

Por cada formulario:
- Recorrido completo con el PHP local (ver "PHP local para probar" en el `CLAUDE.md`).
- Que el mail llegue con la temperatura y las etiquetas legibles, y que la consulta quede guardada.
- `generate_lead` visto en GTM Preview, y Meta Test Events.
- Que los UTM y el gclid lleguen.
- Celular a 390 px y 320 px, y compu.
- Con "reducir movimiento" activado y solo con teclado.

No digas que la medición funciona si no lo probaste. Después:
- Actualizá el `CLAUDE.md` ("Formularios propios": campos nuevos, temperatura y cómo calibrarla) y el `MANUAL-DE-DISENO.md`.
- Sumá `cris-avatar.webp` a la lista de `armar-zip.ps1`.
- Armá el zip. Cuando lo suba, verificá en vivo los 5 formularios.
- Recordame: "Este cambio afecta la documentación de Ads/Tracking. Conviene exportar GTM y actualizar el Master."
