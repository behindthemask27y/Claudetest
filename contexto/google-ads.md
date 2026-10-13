# Google Ads — contexto

Cuenta **CS Real Estate** (921-755-2199; etiquetas `AW-18445706531` / `GT-WPT9PPBN`). Armada con ChatGPT.
Última actualización: 2026-10-13. Estado de tareas y decisiones: `contexto/estado-y-pendientes.md`.
Cómo se mide: `contexto/medicion-y-sitio.md`.

## Cómo se trabaja
- Los cambios se preparan como **CSV para Google Ads Editor** (UTF-16, tabuladores, mismas 260 columnas que el export)
  y los **importa Cris**. El navegador solo para lo que no se importa (conversiones, GTM, GA4, vinculaciones).
- Nada de presupuestos, pujas, objetivos, zonas ni medición cambia sin explicarlo y sin el OK de Cris.
- Después de un lote de cambios: **3 semanas sin tocar nada**.
- Textos: "análisis de mercado" o "cuánto vale", nunca "tasación" en lo que ve el cliente (como palabra clave de búsqueda sí);
  decir CABA y no "Capital". Los anuncios ya llevan la línea legal aprobada (corredor responsable VL REALTOR).
- Informes que conviene pedirle a Cris (se bajan del navegador, no del Editor): términos de búsqueda con costo y conversiones,
  rendimiento por campaña y día con cuota de impresiones, historial de cambios, y datos por grupo de anuncios.

## Estructura al 12/10/2026 (export del Editor)
Todas las campañas de búsqueda con **Maximizar conversiones sin objetivo de CPA**, solo red de búsqueda, idioma es,
ubicación por presencia, dos radios de 6 km: centro Villa del Parque/Devoto (-34.590, -58.484) y Zona Norte (-34.495, -58.483).
Sufijo de URL final con `utm_*`. Todos los anuncios (RSA) llevan a la **home** `https://csrealestate.com.ar/`.

| Campaña | Estado | Presupuesto/día | Notas |
|---|---|---|---|
| #Search_1_vendedores | Activa | 1.000 | Desde 18/9. Grupos: Vender propiedad, Agente para vender, Propiedad no se vende y **Grupo de anuncios 1 (pausado: 90 frase + 8 exacta, con barrios y situaciones, armado por Cris)**. 16 palabras amplias activas. 19 segmentos de público (observación). |
| #Search_2_valor_propiedad | Activa | 3.000 | Desde 22/9. Grupos: Cuanto vale, Tasacion y valuacion. Solo frase y exacta. |
| #Search_4_compradores | Activa | 1.000 | Ubicación por presencia o interés. Pocas negativas (20). |
| #Search_11_whatsapp_general | Activa | 1.500 | Desde 6/10. Objetivo propio `OBJ_WhatsApp_Click`. 17 keywords repetidas con las campañas 1, 2 y 4. |
| #Search_12_portales | Pausada | 500 | Maximizar clics, ~300 palabras de portales. |
| #Search_3, 5, 6, 7, 8, 9, 10 | Pausadas | 200–800 | Alquiler, inquilinos, marca, locales, desarrollos, inversión. |
| Performance Max "Campaign #1" | Pausada | 3.000 | Gastó 17.801 con 0 conversiones. |
| "Campaign #1" de Búsqueda | **Borrador del Editor sin publicar** | 0 | Toda Argentina, Display, AI Max. No existe en la cuenta (no está en el informe de rendimiento). Borrarlo del Editor. |

Sitelinks y llamadas a nivel de cuenta: home, los formularios, "Ver matrícula", teléfono.

## Resultados (11/9 al 12/10, en pesos)
Gasto total 208.920; 17 conversiones (`generate_lead`); ninguna terminó en cliente.
Campaña 1: 78.911, 5 conv. (15.782 c/u) · Campaña 2: 74.631, 11 conv. (6.785) · Campaña 4: 5.395, 1 conv. ·
Campaña 11: 21.464, **0 conv.** · PMax: 17.801, 0 · Campaña 3: 10.718, 0.
Del 1 al 12/10: 131.581 gastados, 132 clics, 10 conversiones (~13.200 cada una). GA4/Ads dan 12 conversiones y el
registro del sitio 13 consultas reales en ese período: coherente.

## Diagnóstico
1. **Volumen:** las 4 campañas activas suman ~116 impresiones por día (3.709 en 32 días). "Limitada por volumen de
   búsquedas" es real, no un error: dos radios de 6 km y palabras de nicho.
2. **Ocultos:** el 51 % del gasto de octubre (66.488 de 131.581) cayó en "Otros términos de búsqueda" que Google no muestra.
3. **Intención:** de los 6 términos visibles que convirtieron en octubre, ninguno fue de "agente para vender": "zonaprop" (2),
   "tasador de casas", "cotizador de viviendas", "tasar mi casa online gratis", "casas en venta moreno".
   Casi la mitad del gasto visible (31.574 de 65.094) fue a portales, terrenos, alquileres, zonas lejanas y otros modelos.
4. **Medición mezclada:** `generate_lead` cuenta los 5 formularios; Google puede aprender a traer cualquier formulario.
   Todos los anuncios van a la home y la persona elige el formulario.
5. **Campaña 11:** su objetivo es un clic de WhatsApp que los formularios nuevos no cuentan a propósito → 0 conversiones.
6. Los costos de las 4 campañas activas no permiten concluir cuál es "mejor" (5 y 11 conversiones, ninguna con cliente).

## Lote 1 (preparado el 13/10, pendiente de importar y publicar)
Carpeta `lote1_google_ads/` del repo: `LEEME-lote1-google-ads.md` (paso a paso), `A-lote1-sin-dudas.csv`, `B-lote1-decisiones.csv` y `C-lote1-textos-anuncios.csv` (títulos nuevos + URL de cada anuncio).
1. Pausar campaña 11. 2. Borrar el borrador "Campaign #1" de Búsqueda (a mano). 3. Agregar 10 negativas de frase a las campañas 1 y 2:
alquiler, alquilar, terreno, terrenos, sin inmobiliaria, en cuotas, abandonadas, empresas que compran, mercado libre, buscainmuebles
(validadas: no bloquean ninguna de las 50 palabras activas tras el lote). 4. Anuncios: títulos nuevos y URL final de su formulario (campaña 1 → `/form/vender/`,
campaña 2 → `/form/valor-prop/`), en el archivo C. 5. Pausar las 16 palabras amplias de la campaña 1. **El Grupo 1 NO se reactiva** (decisión de Cris el 13/10: "no sirve para nada"; queda pausado).
6. Pausar la campaña 4 (si Cris confirma que el foco son propietarios).
Cris pidió avanzar con el lote.

## Eficacia del anuncio (ad strength)
Cris quiere "Excelente" en todos los RSA. Es una calificación de los textos (variedad, palabras clave en los títulos), **no** una métrica de resultados, y el Lote 1 no la modifica. En el export figura "Pending" (no evaluado). Los mismos títulos genéricos ("Atención personal", "CABA y Zona Norte", "Conocé cómo trabajo", "CS Real Estate en Red Suma", "Hablemos por WhatsApp", "Contame qué necesitás") se repiten en casi todos los anuncios. **Hecho el 13/10:** archivo `C-lote1-textos-anuncios.csv` (5 anuncios activos de las campañas 1 y 2): se reemplazaron los 6 títulos genéricos por títulos específicos de cada grupo, y se sacó "tasar" y "tasación" de los textos visibles del anuncio de valuación (violaban la regla). Pendiente: que Cris lo importe y pase el nivel de eficacia que muestre Google Ads; si algún anuncio no llega a "Excelente", ajustar. Excelente no es garantía de más consultas.

## Qué NO se hace por ahora (decidido)
- **No se reactiva el Grupo 1** de la campaña 1 (Cris, 13/10). Queda pausado.
- **No se eliminan campañas ni grupos de la cuenta: se pausan.** Eliminar es permanente (queda como "quitada" y no se puede reactivar). Única excepción: el borrador del Editor que nunca se publicó.
- No subir presupuesto hasta conocer el costo por consulta caliente.
- No concordancia amplia (muy pocas conversiones para que funcione).
- No Target CPA.
- `hot_lead` no es conversión principal: estimo 6 a 10 calientes por mes, pocas para optimizar solo con ellas.
- No asignar valor por consulta (caliente 100, tibia 30, fría 5) a `generate_lead` por ahora; se reevalúa en 4 a 6 semanas.
- "zonaprop": ya está pausado/negativo en la campaña 1; sus 2 conversiones se revisan contra la calidad real antes de decidir.

## Cómo enseñarle a Google a buscar consultas calientes (hoja de ruta)
1. Ahora: lo estructural (palabras, negativas, anuncio→formulario) + `hot_lead` como medición secundaria.
2. A las 3 semanas del lote: costo por `hot_lead` por campaña (columna *Todas las conversiones* segmentada por acción).
3. En 4 a 6 semanas: decidir entre optimizar por valor (asignar valor según temperatura) o `hot_lead` principal (solo con suficientes calientes).
4. Con clientes reales: importar a Google los leads que fueron cliente usando el `gclid` guardado en cada consulta.
