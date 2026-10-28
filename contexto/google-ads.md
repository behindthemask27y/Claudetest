# Google Ads — contexto

> **Copia para el repo.** El original vive en la compu de Cris (`NEGOCIO/Marketing/Google-Ads/contexto-google-ads.md`). Versión de esta copia: 2026-10-28. Las rutas que empiezan con `NEGOCIO/`, `Archivo/` o `Programas Claude/` existen solo en su compu. Si en una sesión de la nube se cambia algo acá, avisale a Cris qué archivo cambió para que lo pase al original; si no, la próxima vez que suba la copia se pisa.

**Qué es:** el manual para retomar la cuenta de Google Ads de Cris sin volver a preguntar lo ya definido.
**Cuándo leerlo:** campañas, palabras clave, negativas, conversiones o CSV para el Editor. Va junto con `contexto/estado-y-pendientes.md` (qué falta y qué se decidió) y `contexto/medicion-y-sitio.md` (cómo se mide). Para textos: `contexto/voz-y-copy.md`.
**Cuenta:** CS Real Estate, 921-755-2199 (`AW-18445706531` / `GT-WPT9PPBN`). La armó Cris con ChatGPT (su contexto original quedó en `NEGOCIO/Marketing/Archivo/`: no leer salvo que se pida).
**Presupuesto activo:** 6.500 pesos por día (campañas 1, 2, 4 y 11).
**Última actualización:** 2026-10-13 (fusiona la revisión del 9/10 con el estado del 12 y 13/10).

## Cómo se trabaja
- Los cambios se preparan como **CSV para Google Ads Editor** (UTF-16, tabuladores, mismas 260 columnas que el export) y **los importa Cris**: gasta muchos menos créditos que operar desde el navegador. El navegador solo para lo que no se importa (conversiones, GTM, GA4, vinculaciones).
- Nada de presupuestos, pujas, objetivos, zonas ni medición cambia sin explicarlo y sin el OK de Cris (lo pidió explícitamente). Se arma el borrador y lo publica él.
- Después de una tanda de cambios: **3 semanas sin tocar nada**, para poder medir.
- Textos: "análisis de mercado" o "cuánto vale"; nunca "tasación", "tasar" ni "tasador" en lo que ve el cliente (como palabra clave de búsqueda sí, porque es lo que escribe la gente). CABA, no "Capital". Los anuncios ya llevan la línea legal aprobada (corredor responsable VL REALTOR). Misma regla que Meta.
- Informes que conviene pedirle a Cris (se bajan del navegador, no del Editor): términos de búsqueda con costo y conversiones, rendimiento por campaña y día con cuota de impresiones, historial de cambios y datos por grupo de anuncios.

## Estructura al 12/10/2026 (export del Editor)
Todas las campañas de búsqueda con **Maximizar conversiones sin objetivo de CPA**, solo red de búsqueda, idioma es, ubicación por presencia, dos radios de 6 km: centro Villa del Parque/Devoto (-34.590, -58.484) y Zona Norte (-34.495, -58.483). Sufijo de URL final con `utm_*`. Todos los anuncios (RSA) llevan a la **home** `https://csrealestate.com.ar/` (Cris lo pidió así).

| Campaña | Estado | Presupuesto/día | Notas |
|---|---|---|---|
| #Search_1_vendedores | Activa | 1.000 | Desde 18/9. Grupos: Vender propiedad, Agente para vender, Propiedad no se vende y **Grupo de anuncios 1 (pausado: 90 frase + 8 exacta, con barrios y situaciones, armado por Cris)**. 16 palabras amplias activas. 19 segmentos de público (observación). |
| #Search_2_valor_propiedad | Activa | 3.000 | Desde 22/9. Grupos: Cuanto vale, Tasacion y valuacion. Solo frase y exacta. |
| #Search_4_compradores | Activa | 1.000 | Ubicación por presencia o interés. Pocas negativas (20). |
| #Search_11_whatsapp_general | Activa | 1.500 | Desde 6/10. Objetivo propio `OBJ_WhatsApp_Click`. 17 keywords repetidas con las campañas 1, 2 y 4. |
| #Search_12_portales | Pausada | 500 | Maximizar clics, ~300 palabras de portales (zonaprop, argenprop…). Al 9/10 estaba activa. |
| #Search_3, 5, 6, 7, 8, 9, 10 | Pausadas | 200–800 | Alquiler propietarios, inquilinos, marca, locales, desarrollos, inversión. |
| Performance Max "Campaign #1" | Pausada | 3.000 | Gastó 17.801 con 0 conversiones. |
| "Campaign #1" de Búsqueda | **Borrador del Editor sin publicar** | 0 | Toda Argentina, Display, AI Max. No existe en la cuenta (no está en el informe de rendimiento): se borra del Editor. Al 9/10 figuraba como activa y había que "revisar qué era". |

Sitelinks y llamadas a nivel de cuenta: home, los formularios, "Ver matrícula", teléfono. Al 9/10 el formulario de Google en versión "Más volumen" figuraba en Vendedores y en la "Campaign #1" (no verificado después).

**Formularios del sitio:** `/form/vender/`, `/form/valor-prop/` (antes `/form/tasacion/`; la vieja redirige sola), `/form/comprar/`, `/form/alquilar-mi-propiedad/`, `/form/buscar-alquiler/`.

## Conversiones
- **Principal:** `GA4 CS (web) generate_lead` (categoría Envío de formularios para clientes potenciales). Cuenta los 5 formularios por igual.
- **Secundarias:** `click_whatsapp`, `click_form`, `ver_propiedades`, `ver_desarrollos`, `ver_mimetodo` y **`hot_lead`** (categoría Contacto, sin valor, recuento "una", 90 días, basada en datos).
- Ruta: GTM → GA4 → Google Ads. La etiqueta directa de Google Ads en GTM sigue pausada. Detalle técnico y reglas: `contexto/medicion-y-sitio.md`.

## Resultados
- **11/9 al 12/10 (pesos):** gasto total 208.920; 17 conversiones (`generate_lead`); ninguna terminó en cliente. Campaña 1: 78.911, 5 conv. (15.782 c/u) · Campaña 2: 74.631, 11 conv. (6.785) · Campaña 4: 5.395, 1 conv. · Campaña 11: 21.464, **0 conv.** · PMax: 17.801, 0 · Campaña 3: 10.718, 0. Del 1 al 12/10: 131.581 gastados, 132 clics, 10 conversiones (~13.200 cada una). GA4/Ads dan 12 y el registro del sitio 13 consultas reales: coherente.
- Referencia del 9/10 (30 días): 85.821 gastados, 86 clics, 9 conversiones (5 de Valor propiedad); 15 formularios sin ninguna oportunidad real.

## Diagnóstico (por qué los leads son malos)
1. **Volumen:** las 4 campañas activas suman ~116 impresiones por día (3.709 en 32 días). "Limitada por volumen de búsquedas" es real, no un error: dos radios de 6 km y palabras de nicho.
2. **Gasto oculto:** el 51 % del gasto de octubre (66.488 de 131.581) cayó en "Otros términos de búsqueda" que Google no muestra.
3. **Intención:** de los 6 términos visibles que convirtieron en octubre, ninguno fue de "agente para vender": "zonaprop" (2), "tasador de casas", "cotizador de viviendas", "tasar mi casa online gratis", "casas en venta moreno". Quien busca "tasación online gratis", "simulador" o "precio metro cuadrado por barrio" quiere un número gratis, no un agente; de ahí salen la mayoría de las conversiones de Valor propiedad, que además es la campaña con más presupuesto. Casi la mitad del gasto visible (31.574 de 65.094) fue a portales, terrenos, alquileres, zonas lejanas y otros modelos.
4. **Portales:** el término más caro fue "zonaprop" ($10.939, 14 clics). Ya es negativa en Vendedores; la campaña Portales le apuntaba a propósito (hoy pausada).
5. **Fuera de zona o de intención:** Mar del Plata, Moreno, Lugano, Avellaneda, alquileres, "casa en cuotas", "compramos tu casa".
6. **Medición mezclada:** `generate_lead` cuenta los 5 formularios y Google puede aprender a traer cualquier formulario.
7. **Concordancia amplia** en Vendedores (16 palabras) con Maximizar conversiones: abre a búsquedas parecidas.
8. **Todo va a la home:** quien busca "cuánto vale mi casa" cae en una página general y completa el formulario que encuentre.
9. **Campaña 11:** su objetivo es un clic de WhatsApp que los formularios nuevos no cuentan a propósito → 0 conversiones.
10. Los costos de las 4 campañas activas no permiten concluir cuál es "mejor" (5 y 11 conversiones, ninguna con cliente).

## Primera tanda de cambios (13/10) — preparada, sin importar ni publicar
Carpeta `NEGOCIO/Marketing/Google-Ads/2026-10-13 Google Ads - Vendedores, Valor propiedad, Compradores, WhatsApp/` con el paso a paso (`LEEME.md`) y dos CSV (el 1 se importa primero, el 2 después). En el chat se la llama "Lote 1".
1. Pausar campaña 11. 2. Borrar el borrador "Campaign #1" de Búsqueda (a mano). 3. Agregar 10 negativas de frase a las campañas 1 y 2: alquiler, alquilar, terreno, terrenos, sin inmobiliaria, en cuotas, abandonadas, empresas que compran, mercado libre, buscainmuebles (validadas: no bloquean ninguna de las 148 palabras activas tras el lote). 4. URL final: campaña 1 → `/form/vender/`, campaña 2 → `/form/valor-prop/` (a mano). 5. Reactivar el Grupo 1 y pausar las 16 palabras amplias de la campaña 1. 6. Pausar la campaña 4 (si Cris confirma que el foco son propietarios). Los ítems 5 y 6 eran recomendaciones; Cris pidió avanzar con el lote.

## Lote 3 (24/10) — simplificar, publicado por Cris (según Cris; quieto hasta el 14/11)
A pedido de Cris («muy segmentadas»): #1 a 3.000 por día, grupo nuevo «Inmobiliaria y agente» (20 frases y un aviso), radio 10 km y #11 pausada. El Grupo 1 sigue pausado (sin evidencia: 1 semana y 0 conversiones). Cambia lo de abajo: los radios dejan de ser de 6 km; lo demás sigue igual. Avisos al 24/10: 14 de 25 Excellent, y los 3 de #1 ya lo son. Detalle y pasos en la carpeta `10-24 Google Ads - Simplificar - …/LEEME.md`. El cliente de San Justo entró por un formulario el 13/10 desde «inmobiliaria para comprar» (#11, que no cuenta formularios como principales).

## Qué NO se hace por ahora (decidido 13/10)
- No subir presupuesto hasta conocer el costo por consulta caliente.
- No concordancia amplia (muy pocas conversiones para que funcione). No Target CPA.
- `hot_lead` no es conversión principal: se estiman 6 a 10 calientes por mes, pocas para optimizar solo con ellas.
- No asignar valor por consulta (caliente 100, tibia 30, fría 5) a `generate_lead` por ahora; se reevalúa en 4 a 6 semanas.
- Terrenos: no por ahora (las negativas "terreno" y "terrenos" quedan).
- "zonaprop": ya está pausado/negativo en la campaña 1; sus 2 conversiones se revisan contra la calidad real antes de decidir.

## Cómo enseñarle a Google a buscar consultas calientes (hoja de ruta)
1. Ahora: lo estructural (palabras, negativas, anuncio→formulario) + `hot_lead` como medición secundaria.
2. A las 3 semanas del lote: costo por `hot_lead` por campaña (columna *Todas las conversiones* segmentada por acción).
3. En 4 a 6 semanas: decidir entre optimizar por valor (asignar valor según temperatura) o `hot_lead` principal (solo con suficientes calientes).
4. Con clientes reales: importar a Google los leads que fueron cliente usando el `gclid` guardado en cada consulta.

## Ideas del plan del 9/10 que quedaron sin hacer
- Lista de negativas compartida entre campañas.
- Separar las conversiones por formulario (hoy `generate_lead` junta los 5).
- Pasar el formulario de Google a "Mayor intención".
- Avisarle a Google qué leads fueron buenos (desde el CRM propio de Cris, cuando esté vinculado).
