Trabajamos en la web csrealestate.com.ar, en la carpeta `G:\Workshop Claude\#2 CSREALESTATE.COM.AR`. Vamos a mejorar la home, sumar datos para Google y rehacer los 5 formularios. Está todo definido abajo, en etapas.

Antes de tocar nada, leé el `CLAUDE.md` de esa carpeta y el `MANUAL-DE-DISENO.md`. Del `CLAUDE.md`, sobre todo:
- "Reglas para modificar botones" y "Reglas para nuevos botones"
- "Protocolo reforzado: avisar ANTES de tocar tracking o una landing de Ads"
- "No tocar sin autorización"
- "Formularios propios" y "PHP local para probar"

El estilo no se redefine: mismos colores, letras (Chillax/Inter), vidrio y medidas de `estilo.css`.

Respuestas cortas, sin jerga técnica.

---

# REGLAS QUE NO SE ROMPEN

## 1. Nada de Google ni de Meta se rompe

Todo mi esquema de publicidad depende de la medición. Ningún cambio puede tocar ni alterar:
- **Las cuentas:**
  - GTM `GTM-5JDWTPXN`
  - GA4 `G-4LDVRLTWFC`
  - Google Ads `AW-18445706531` / `GT-WPT9PPBN`
  - el dataset de Meta `1586039593247372`
- **Los eventos:**
  - `generate_lead` (conversión principal de Google Ads) y `Lead` (Meta): **una sola vez por consulta enviada, igual que hoy**.
  - `click_boton`, `click_whatsapp`, `click_form`, `PageView` y `Contact`: ni uno más ni uno menos que hoy.
  - En Meta, los 4 `boton_id` de WhatsApp (`whatsapp`, `whatsapp-icono`, `consulta-propiedad`, `consulta-desarrollo`) siguen mandando `Contact` igual que hoy.
- **Los datos de cada evento:** `boton_id`, `boton_texto`, `lead_type`, `form_name`, y la atribución (gclid, gbraid, wbraid, utm_*).
- **Las direcciones** de las páginas que reciben anuncios: la home y los 5 formularios.

No se suma una segunda copia de GTM, GA4 ni del Pixel.

Si un cambio puede alterar algo de esto, o no estás seguro, **frená, explicame el riesgo y esperá mi OK**. No digas que la medición funciona si no lo probaste.

## 2. Palabra prohibida: "tasación"

No soy corredor matriculado. En nada que vea el cliente ni en los datos para Google puede aparecer "tasación", "tasar" ni "tasador". Eso incluye:
- textos, botones y mensajes de error
- el título de la pestaña
- la descripción que muestra Google
- los números de la franja

Se dice "cuánto vale" o "valor de tu propiedad". Los nombres internos (`lead_type: 'tasacion'`, `motivo_tasacion`, `ya_tasada`) y la dirección `/form/tasacion/` se quedan como están, porque los usan la medición y Google Ads.

## 3. Otras reglas

- **No toques:** el texto ni el botón de "Mi método", la bio, el botón de la matrícula, el orden de la home ni la política de privacidad.
- **Ningún Instagram** en ninguna parte: el mío todavía no es público.
- **Ninguna matrícula a mi nombre.** El corredor responsable es VL REALTOR (ver `CLAUDE.md`).
- **Nunca inventes datos, números ni reseñas.** Si falta algo, preguntame.
- **Antes de cada etapa**, mostrame qué vas a cambiar y qué se puede romper, y esperá mi OK.
- **Al terminar cada etapa**, anotá en el `CLAUDE.md` que quedó hecha. Así, si la conversación se corta, la próxima sesión retoma desde ahí.

---

# ETAPA 0: Antes de empezar

1. **Copia de seguridad:** hacé un zip de toda la carpeta con la fecha (por ejemplo `backup-2026-10-12.zip`), fuera de lo que se sube a Hostinger.
2. **Foto de la medición de hoy:** con GTM Preview, GA4 DebugView y Meta Test Events, anotá qué eventos se disparan hoy, con qué datos:
   - en la home: los 5 botones, WhatsApp, Email, Mi método y la matrícula
   - en cada formulario: al abrirlo y al enviarlo
   - Guardala en un archivo `medicion-antes.md`. Es la referencia para comparar después de cada etapa.

---

# ETAPA 1: Íconos en lugar de emojis (home, `index.html`)

- Reemplazá los emojis de los 5 botones de "¿Cómo puedo ayudarte?" por íconos de línea que transmitan lo mismo:
  📊 cuánto vale → gráfico de barras · 🏠 vender → casa · 🔑 alquilar mi propiedad → llave · 🔎 comprar → lupa · 📍 buscar alquiler → pin de ubicación.
- Tienen que verse de la misma familia que los íconos de WhatsApp y Email: SVG inline, `viewBox="0 0 24 24"`, sin relleno, trazo `currentColor` del mismo grosor, `aria-hidden="true"`. Proponé la posición (a la izquierda con `.boton__icono` como WhatsApp/Email, o pegado al texto). Probalo a 320 px: el ícono nunca se pisa con el texto.
- En el botón Email, sacá el "✉" que va delante de la dirección: ya tiene el ícono de sobre a la izquierda.
- **Ojo con la medición:** hoy `boton_texto` sale de `origen.dataset.titulo || origen.textContent`. Esos 5 botones no tienen `data-titulo`, así que el valor que se registra hoy incluye el emoji (ej. "📊 Quiero saber cuánto vale mi propiedad").
  - Si sacás el emoji, ese valor cambia y los informes quedan partidos en dos.
  - Para que nada cambie, agregá a cada botón `data-titulo` con el texto exacto que se registra hoy, emoji incluido.
  - No toques `data-evento`, `href` ni nada del `dataLayer`.
- **Control:** compará con `medicion-antes.md`. Los 5 botones tienen que mandar exactamente lo mismo a Google y a Meta. Mostrame el antes y el después.

# ETAPA 2: Franja "Red Suma en números" (home)

- Sacá los números del CRM de Red Suma (admin.redsuma.com.ar), con mi sesión en el navegador. **Solo lectura**: no marques, edites ni crees nada.
- Buscá operaciones cerradas de Red Suma y otros números de la red que den confianza (propiedades en cartera, agentes, oficinas o años de trayectoria **de Red Suma**).
  - **No pongas** mis años en el rubro (arranqué hace poco), ni barrios, ni la palabra "tasación".
- **Nunca inventes ni estimes un número.** Si el CRM no lo muestra, decímelo. Mostrame cada número, de qué pantalla salió y la fecha, y esperá mi OK. Elegimos 3 o 4.
- Tiene que quedar claro que son números **de Red Suma**, no míos (título "Red Suma en números", o etiquetas como "operaciones cerradas en Red Suma"). Si redondeás, hacia abajo con "+" (ej. 1.287 → "+1.200").
- **Diseño:** el de la franja de `/desarrollos/` (`.dv-resumen`): número en bronce, etiqueta chica en mayúsculas y gris, caja con borde fino y divisiones.
  - Hoy ese estilo vive dentro de `desarrollos/index.html`: pasalo a `estilo.css` como componente compartido, sin cambiar cómo se ve Desarrollos.
  - En el celular, 2×2.
- **Ubicación:** debajo de "Mi método" y arriba de "Propiedades disponibles", así en el celular los botones siguen siendo lo primero. Mostrámela antes.
- Los números van en un solo lugar del código, con un comentario de la fuente y la fecha. Anotá en el `CLAUDE.md` cómo actualizarlos (cada 3 meses).
- Reserva su lugar desde el principio (nada salta al cargar), sin vidrio pesado y sin registro de clics.

# ETAPA 3: Datos invisibles para Google (SEO)

Tené en cuenta (y recordámelo si te pido otra cosa):
- **Google castiga el texto oculto y las palabras repetidas.** Los datos invisibles describen lo que la página ya muestra.
- **Poner "zonaprop" escondido no me hace aparecer cuando buscan Zonaprop, y puede perjudicarme.** Lo que sirve es enlazar mis perfiles reales en los portales. Pedime esos links. Si no tengo perfil en alguno, no lo pongas.

Qué hacer:
- **Ficha de datos estructurados (JSON-LD) en el `<head>` de la home:**
  - `RealEstateAgent` + `Person`: Cristian Stedtfeld, agente inmobiliario en Red Suma. URL, foto, WhatsApp +54 9 11 6695-1945 y email cstedtfeld@redsuma.com.ar.
  - Oficina: General Justo José de Urquiza 405, Vicente López.
  - Zona que atiendo: preguntame.
  - Servicios (`hasOfferCatalog`): cuánto vale tu propiedad (orientación de valor), venta, alquiler para propietarios, compra, búsqueda de alquiler y desarrollos en pozo.
  - Perfiles (`sameAs`): solo los links de portales que te pase.
  - También `WebSite`.
  - Sin Instagram, sin matrícula a mi nombre y sin reseñas ni puntajes.
- **Título y descripción de la home:** proponé una versión natural que diga qué hago y dónde (agente inmobiliario; valor de tu propiedad, venta, compra y alquiler de departamentos y casas; zona). Hoy la descripción dice "Tasación, venta, alquiler y compra…": hay que cambiarla. Mostrámela antes.
- **`robots.txt` y `sitemap.xml`:** hoy no existen. Crealos.
  - El `robots.txt` no bloquea nada (ni a Google, ni a los robots de Google Ads o Meta), apunta al sitemap y no nombra carpetas privadas.
  - Sumá los dos archivos a la lista `$archivos` de `armar-zip.ps1`.
- **Propuesta escrita, no implementar:** hoy solo la home aparece en Google. Explicame en pocas líneas qué ganaría habilitando `/propiedades/`, `/desarrollos/` y las fichas, y qué riesgos tiene (contenido repetido del portal y de sumadesarrollos, páginas que se arman al cargar, fichas con `?o=`). Que yo decida.
- Validá la ficha con la Prueba de resultados enriquecidos de Google y con validator.schema.org.

# PRIMERA PUBLICACIÓN (etapas 1 a 3)

1. **Probá la home:**
   - en celular (390 y 320 px) y en compu
   - igual que antes salvo lo pedido, sin saltos al cargar y con el scroll fluido
2. **Compará la medición** con `medicion-antes.md` en GTM Preview, GA4 DebugView y Meta Test Events. Tiene que ser idéntica.
3. **Actualizá la documentación:** `MANUAL-DE-DISENO.md` (regla de íconos y franja) y `CLAUDE.md` (ficha para Google, franja).
4. **Armá el zip** con `armar-zip.ps1`. Cuando lo suba, verificá en vivo que llegó cada archivo, incluidos `robots.txt` y `sitemap.xml`, y repetí el control de medición en el sitio publicado.
5. **Recordame:**
   - hacerlo un día de semana temprano
   - dejar una nota con la fecha en los gráficos de Google Ads
   - no tocar presupuestos ni pujas esa semana
   - dar de alta el sitemap en Google Search Console

**No arranques la etapa 4 hasta que te confirme que la home publicada anda bien.**

---

# ETAPA 4: Los 5 formularios nuevos

`form/vender/`, `form/tasacion/`, `form/alquilar-mi-propiedad/`, `form/comprar/` y `form/buscar-alquiler/` son las landings de las campañas #Search_1 a #Search_5.

**El diseño está aprobado en este prototipo:** https://claude.ai/artifact/HmcWRCirghefmgTNpuTwMe. Abrilo con la herramienta Artifact (`action: "read"`) y copiá su comportamiento, sus textos y sus medidas. Si no podés abrirlo, avisame. Abajo está todo igual.

**Orden:**
1. Armá el motor compartido.
2. Hacé **un solo formulario de prueba: "cuánto vale"** (`/form/tasacion/`).
3. Probalo entero y mostrámelo.
4. Con mi OK, hacé los otros 4.

## Cómo funcionan

- **Una pregunta por pantalla.** En las de una sola opción, al tocar se marca y pasa sola a la siguiente (unos 260 ms). Si la persona vuelve atrás, ve su respuesta marcada y puede seguir con "Continuar".
- **Al empezar**, arriba de la primera pregunta aparece una frase mía con mi foto (ver más abajo).
  - La foto es un recorte de la cara de `foto.webp` a 112 px, `cris-avatar.webp`.
- **Tarjetas grandes para tocar**, con una marca a la derecha (círculo para una opción, cuadrado para varias) que se rellena en bronce con un pequeño "pop".
  - Llevan ícono de línea solo los tipos de propiedad (depto, casa, PH, local, otro, flipping), vivir/invertir/mi negocio y tradicional/temporario.
  - Barrios, ambientes y características van como chips.
- **Barra de progreso** que arranca con un 8 % cargado y avanza con cada respuesta. Debajo, un texto:
  - en la primera pantalla: "Son preguntas de tocar. Lleva alrededor de un minuto."
  - desde el 60 %: "Ya casi está"
  - en los datos de contacto: "Último paso"
- **Frases mías** después de ciertas respuestas: aparecen arriba de la pregunta siguiente, con mi foto. Son solo las de la tabla.
- **Preguntas opcionales:** tienen "Saltar". Las que no traen ayuda propia llevan debajo del título "Es opcional, pero me ayuda a asesorarte mejor."
- **Barras deslizables** con el número grande en bronce. Pasos chicos abajo y más grandes arriba. Los números van en un solo lugar del código, porque con la inflación los voy a actualizar:
  - **Dólares:** de USD 30.000 a 150.000 de a 5.000; hasta 400.000 de a 10.000; hasta 1.000.000 de a 25.000; último punto "Más de USD 1.000.000". Arranca en USD 150.000.
  - **Pesos por mes:** de $ 300.000 a 1.500.000 de a 50.000; hasta 4.000.000 de a 100.000; último punto "Más de $ 4.000.000". Arranca en $ 800.000.
  - **Metros:** de 20 a 150 m² de a 5; hasta 400 de a 10; último punto "Más de 400 m²". Arranca en 60, con un chip "No sé los metros" que desactiva la barra.
- **Barrios:**
  - Chips en dos grupos con título chico.
    - **CABA:** Villa Urquiza, Villa Devoto, Villa del Parque, Saavedra, Núñez, Belgrano, Coghlan, Villa Pueyrredón.
    - **Zona Norte:** Vicente López, Olivos, Florida, Martínez, San Isidro.
  - Debajo, un buscador "Buscá otro barrio o localidad" con sugerencias mientras se escribe (los 48 barrios de CABA y las localidades de Zona Norte; la lista está en el prototipo). Lo que elige o escribe aparece como chip marcado.
  - En vender, cuánto vale y alquilar mi propiedad se elige uno solo; en comprar y buscar alquiler, varios.
  - Donde corresponde, debajo va "Calle y altura aproximada" (opcional).
- **Todo se adapta al tipo de propiedad:**
  - **Local comercial:**
    - el tamaño pregunta solo la superficie, sin ambientes
    - características de local: Vidriera a la calle, En esquina, Baño, Depósito o sótano, Entrepiso o planta alta, Salida de humos, Apto gastronomía
  - **Comprar, si solo busca locales:** "¿Es para tu negocio o para invertir?" (Para mi negocio / Para invertir), y no se pregunta por ambientes.
  - **Buscar alquiler, si solo busca locales:** no se pregunta por mascotas.
- **WhatsApp con país:**
  - Adelante del número, un selector que muestra "+54 9" y abre la lista: Argentina (+54 9), Uruguay, Chile, Paraguay, Brasil, Bolivia, Perú, Colombia, Venezuela, México, España, Italia, Estados Unidos y "Otro país" (escribe el número completo con +).
  - Debajo, una ayuda según el país. Para Argentina: "Código de área y número, sin 0 ni 15. Ej.: 11 6695 1945 o 351 555 1234".
  - El servidor recibe el número en formato internacional (ej. +5491123456789).
- **Datos de contacto:**
  - Antes, una frase propia de cada formulario y el título "¿A dónde te escribo?".
  - Campos: Nombre, WhatsApp y Email (el email sigue siendo obligatorio, como hoy). Los errores se explican en una línea.
  - La nota de la Política de Privacidad sigue antes de "Enviar".
- **Pantalla final:**
  - check dorado que se dibuja
  - "¡Gracias, [nombre]!" y "Ya tengo todo. Te escribo por WhatsApp lo antes posible."
  - un resumen con 2 o 3 datos
  - botón "Escribirme ahora por WhatsApp" que abre `https://wa.me/5491166951945` con "Hola Cris, soy [nombre]. Recién completé el formulario de [formulario]."
  - **Cuidado con ese botón:** si dispara `click_whatsapp` (Google) o `Contact` (Meta), una misma consulta se cuenta dos veces. Usá un `boton_id` nuevo (proponemelo; por ejemplo `whatsapp-gracias`) y verificá que **no** dispara ninguno de los dos, ni siquiera por tener un link a wa.me. Si los dispara, avisame antes de seguir.
- **El "atrás" del celular** (el gesto de Android o la flecha del navegador) vuelve a la pregunta anterior, sin cambiar la dirección de la página.
  - **Cuidado:** GA4 y el Pixel de Meta pueden contar cada paso como una visita nueva. Probalo: mientras se responde, no puede aparecer ningún `page_view` ni `PageView` extra.
  - Si aparece y no se puede evitar sin tocar GTM, **no hagas esta parte** y avisame.
- **Si cierra y vuelve** dentro de las 24 horas, sigue donde estaba. Se guarda solo en su navegador y se borra al enviar.
- **Detalles:**
  - Vibración cortita al tocar en Android (si el teléfono la permite).
  - Sin animaciones con "reducir movimiento" activado.
  - Al cargar no se le pone foco a ningún título. Eso arregla el recuadro dorado que hoy aparece en "Sobre la propiedad".
- **Estilo:** componentes nuevos en `estilo.css`, una sola vez para los 5, con los tokens existentes. Título de cada pregunta con el nivel 3 del manual (`--titulo-tarjeta`, Chillax). El título del formulario sigue en 19 px. Anotalo en el `MANUAL-DE-DISENO.md`.

## Las frases

**Al empezar** (arriba de la primera pregunta, con mi foto):

| Formulario | Frase |
|---|---|
| Vender | "Cuanto más me cuentes de tu propiedad, más concreto puedo ser en nuestra primera charla." |
| Cuánto vale | "Cuantos más datos me des, más cerca voy a estar del valor real de tu propiedad." |
| Alquilar mi propiedad | "Cuanto más me cuentes, mejor te puedo orientar sobre cuánto pedir y cómo mostrarla." |
| Comprar | "Cuanto más me cuentes de lo que buscás, menos tiempo vas a perder viendo propiedades que no van." |
| Buscar alquiler | "Cuanto más me cuentes, menos tiempo vas a perder visitando lo que no te sirve." |

**Después de ciertas respuestas** (arriba de la pregunta siguiente):

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

**Antes del contacto:**
- Vender: "Listo. Con esto ya puedo preparar nuestra primera charla."
- Cuánto vale: "Listo. Con esto ya puedo analizar tu propiedad."
- Alquilar: "Listo. Con esto ya puedo pensar cómo alquilarla."
- Comprar y Buscar alquiler: "Listo. Con esto ya puedo empezar a buscar."

## Rompehielos (en los 5, justo antes del contacto)

- Campo **NUEVO** `rompehielos`, opcional (con "Saltar").
- Título "Del 1 al 10, ¿cuánto necesitás unas vacaciones?". Debajo: "Una última, y no suma ni resta."
- Barrita del 1 al 10 con el número grande, arranca en 5. Puntas: "1 · Estoy bien así" (izquierda) y "10 · Ya debería estar haciendo la valija" (derecha, puede ir en dos líneas).
- Frase mía, con mi foto, en la pantalla de contacto:
  - 1 a 3: "Qué envidia. Me caés bien."
  - 4 a 7: "Un fin de semana largo no te vendría mal."
  - 8 a 10: "Te entiendo. Mientras armás la valija, yo me ocupo de esto."
- No suma puntos. En el mail: "Vacaciones: 9 de 10".

## Las preguntas

Regla de oro: **los nombres de campo y los valores de las preguntas que ya existen no cambian** (los usan el mail, el historial de consultas y la medición). Lo marcado **NUEVO** se agrega. Lo que hoy es texto libre y pasa a chips se sigue mandando como texto en el mismo campo.

**Características según el tipo** (campo **NUEVO** `destacados`, opcional):

| Tipo | Cuánto vale | Alquilar mi propiedad |
|---|---|---|
| Departamento (y Otro) | Balcón, Cochera, Patio o terraza, Amenities, A estrenar, Apto crédito | Amoblado, Balcón, Cochera, Patio o terraza, Amenities, Acepta mascotas |
| Casa | Jardín, Pileta, Cochera, Parrilla o quincho, A estrenar, Apto crédito | Amoblado, Jardín, Pileta, Cochera, Parrilla o quincho, Acepta mascotas |
| PH | Patio, Terraza propia, Parrilla, Cochera, Sin expensas, Apto crédito | Amoblado, Patio, Terraza propia, Parrilla, Cochera, Acepta mascotas |
| Local comercial | las de local | las de local |

**Cuánto vale** (`tasacion`)
1. `tipo_propiedad`: Departamento / Casa / PH / Local comercial / Otro.
2. `ubicacion`: barrio + calle y altura aproximada. Se manda "Belgrano · Av. Cabildo 2000".
3. Tamaño: **NUEVO** `ambientes` (Monoambiente / 2 / 3 / 4 / 5 o más; no va en locales) + **NUEVO** `superficie` (barra de m², o "sin dato").
4. `destacados`.
   - `descripcion_breve` el servidor lo exige: armalo solo, por ejemplo "3 ambientes · 75 m² · Balcón, Cochera".
5. `motivo_tasacion` ("¿Para qué querés saber el valor?"): Para vender / Para alquilar / Por una sucesión o división / Para tener una referencia / Otro motivo.
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

**Avisos aparte en el mail:**
- "También vende": comprador que necesita vender primero.
- "También compra" o "Tal vez compra": vendedor que después compra.
- "Sucesión".
- "Ya está publicada".
- "Comparando valores".
- "Quiere que gestiones todo".
- "Inversor".

**En el mail:**
- Asunto: "🔥 Caliente · Vender · Juan Pérez" (🌡️ Tibia, ❄️ Fría). Para el formulario de cuánto vale, el asunto dice "Cuánto vale".
- Arriba del cuerpo: los 3 puntos con la respuesta que los dio, los avisos y la respuesta de las vacaciones.
- Guardá también `temperatura` y `puntaje` en el registro de consultas.

**Reglas para el servidor:**
- Los campos NUEVOS se suman a la lista de cada formulario y a las etiquetas del mail, pero **el servidor no los exige**. Así no se pierde una consulta que llegue desde una versión vieja del formulario durante el cambio.
- Los puntos quedan en un solo lugar del código; en uno o dos meses los ajustamos con las consultas que avanzaron.
- **La temperatura no se manda a Google Ads ni a Meta.** Dejame por escrito cómo sería (valor por consulta: Caliente 100, Tibia 30, Fría 5) y lo decidimos aparte.

## Además, lo que no se puede romper en los formularios

- La trampa anti-robots (`sitio_web`) y `_ts`. **Revisá que el tiempo mínimo de `_ts` no rechace a alguien que completa todo tocando rápido.**
- **El teléfono** ahora va en formato internacional. Fijate que nada en GTM espere el formato viejo (por ejemplo, los datos que Google y Meta usan para cruzar conversiones).

## Pruebas, por cada formulario

- Recorrido completo con el PHP local.
- El mail llega con la temperatura y las etiquetas legibles, y la consulta queda guardada.
- Comparación con `medicion-antes.md` en GTM Preview, GA4 DebugView y Meta Test Events:
  - `generate_lead` y `Lead`: una vez por envío
  - ningún `page_view`, `PageView`, `click_whatsapp` ni `Contact` de más
  - UTM y gclid llegan
- Celular (390 y 320 px) y compu; con "reducir movimiento" activado y solo con teclado.
- El "atrás" del celular, y cerrar y volver a abrir a mitad del formulario.
- Un local comercial de punta a punta, y un WhatsApp de otro país.
- Ninguna "tasación" visible.

# SEGUNDA PUBLICACIÓN (etapa 4)

1. **Actualizá la documentación:**
   - `CLAUDE.md`, sección "Formularios propios": campos nuevos, temperatura y cómo calibrarla.
   - `MANUAL-DE-DISENO.md`.
2. **Sumá `cris-avatar.webp`** a la lista de `armar-zip.ps1`.
3. **Armá el zip.** Cuando lo suba, verificá en vivo los 5 formularios con una consulta de prueba real, y repetí el control de medición en el sitio publicado.
4. **Recordame:**
   - hacerlo un día de semana temprano
   - dejar una nota con la fecha en los gráficos de Google Ads
   - no tocar presupuestos ni pujas por una o dos semanas, mientras Google se acomoda
   - "Este cambio afecta la documentación de Ads/Tracking. Conviene exportar GTM y actualizar el Master."
   - crear o completar mi Perfil de Empresa en Google
