# Estudio coworking Santo Tomé 2987 — para presentar a un inversor (sigue en la nube desde el 28/10/2026)

> **Estudio en la nube.** Versión de esta copia: 2026-10-28. Desde que se subió, el estudio sigue **acá, en el repo**, y esta copia manda sobre la de la PC (que quedó pausada al 28/10/2026 en `NEGOCIO/Analisis/10-27 Coworking Santo Tome 2987 - Estudio para inversor/`).
> **Reglas de Cris:** seguir solo, **sin subagentes ni trabajo en paralelo** (el 28/10 11 subagentes se comieron el 66 % de una sesión y el estudio gastó más del 30 % de sus créditos). Antes de cada paso, decirle cuánto va a costar y recomendar el barato; tablas cortas; nada de búsquedas de más. Español rioplatense, ventas en USD.
> **Qué hay y qué no:** los mails y teléfonos de terceros están tapados como `[email]` y `[tel]` (no volver a buscarlos ni guardarlos). No están en el repo: `plantilla_base.py` y el sistema de diseño del estilo A, ni el Excel y el PowerPoint de la PC (`recalcular_excel.ps1` solo sirve allá). Para el paso 2 (informe y presentación en estilo A), pedirle a Cris la plantilla antes de empezar; para recalcular el Excel, ver si hay LibreOffice o decir que no se pudo comprobar.
> **Al terminar un tramo:** avisale a Cris qué archivos de `coworking/` cambiaron para que los pase a la PC; no dejes nada importante solo acá. Sin datos personales de clientes ni de consultas.

**Qué es:** evaluar abrir un coworking con membresías mensuales en la casa propia de Cris en Santo Tomé 2987 (Villa del Parque, Comuna 11, verificado con USIG: -34.605219, -58.487856). Casa de 450 m²: subsuelo, planta baja + patio con pileta (se podría techar y rellenar), planta alta. Inversión desconocida: la estima el estudio. Prompt original: `F:\DESCARGAS\Prompt_investigacion_coworkings_CABA_Santo_Tome_2987.txt`.
**Decisiones de Cris:** estilo **A · Claro Editorial**; alcance "completo", pero el 28/10 se frenó por costo (11 subagentes en paralelo se comieron el 66 % de la sesión y el estudio gastó más del 30 % de sus créditos). **Seguir solo, sin subagentes**, en 2 pasos: 1) consolidar + Excel con precios reales y decir si da o no da (~10-15 % de sesión); 2) solo si da, informe PDF + presentación PPTX/PDF (~15-20 %). Antes de generar: una página y una diapositiva de muestra en estilo A para su OK (las tablas y el 16:9 son nuevos en ese estilo).
**Siguiente (Cris, 28/10/2026):** seguirlo en la nube, en el repo de GitHub (`coworking/`). Desde que se sube la copia manda la de la nube; lo que se avance allá se trae a esta carpeta. Detalle de cómo se arma la copia: `Marketing/Repo-GitHub/LEEME.md`.
**Fecha de corte:** 27/10/2026. TC: USD 1 = ARS 1.560 (oficial BNA venta ≈ MEP, dolarapi.com).

## Qué hay en `datos/` (estado leído de los archivos el 28/10/2026)
- `00_instrucciones_comunes.md`: criterio de inclusión y formato JSON de las fichas.
- **Censo de sedes** (fichas `sedes_*.json`, con su registro de búsquedas `busquedas_*.json`): 98 fichas. Las «probable» e «incierto» no están confirmadas.
  - `sedes_G1A` (Villa del Parque, Devoto, Agronomía, Paternal, V. Santa Rita, V. Gral. Mitre, Floresta + borde GBA): 21 fichas (1 verificada, 10 probables, 9 inciertas, 1 cerrada). En Villa del Parque no hay coworking con membresía. Único competidor directo: **Ambrela** (Lope de Vega 3131, Devoto, 3,6 km): fijo $118.000, 3 días/sem $103.000, 2 días/sem $89.000 (sin fecha).
  - `sedes_G1B` (Monte Castro, V. Pueyrredón, V. Real, Versalles, Vélez, V. Luro, Liniers): 11 fichas (7 probables, 3 inciertas, 1 cerrada).
  - `sedes_G3` (Belgrano, Núñez, Saavedra, Colegiales, V. Urquiza): 22 fichas (16 probables, 6 inciertas).
  - `sedes_CAD` (cadenas, ej. HUERTA 4 días/mes $135.000 + IVA, 8 días $219.000 + IVA): 44 sedes (31 verificadas, 7 probables, 4 próximas aperturas, 1 incierta, 1 cerrada). Revisar qué cadenas grandes faltan (WeWork, IWG, Urban Station, AreaTres, HIT).
- `costos_referencia.json` — 87 valores con fuente. Clave: monotributo tope 200 m² → Responsable Inscripto; IIBB 3 % (a confirmar el encuadre); CPAU 14 % de honorarios; Comercio Adm. A $1.316.632 + 25-37 % de cargas. Faltan pileta, baño accesible, cabina, espresso.
- `costos_oficina_propia.json` — **parcial**: 16 ítems; faltan servicios (luz, internet, limpieza) y mobiliario.
- `alquiler_oficinas.json` — **parcial**: 34 avisos de oficinas 15 a 80 m² en 8 barrios (+ 11 descartados o fuera de rango); Argenprop y Zonaprop bloquean a ratos.
- `casa_costo_oportunidad.json` — **pendiente**: sin avisos de casas relevados (valor de alquiler y de venta de la casa).
- `entorno_y_normativa.md` — 4 secciones (parcela y zonificación, habilitación, accesibilidad y transporte, entorno comercial). Revisar si zonificación y habilitación quedaron cerradas: son lo más importante.
- No se hicieron: G2 y G4-G6 (resto de CABA), Instagram (Cris puede iniciar sesión él en el navegador integrado; solo mirar) y fotos.

## Paso 1 hecho (28/10/2026, en la nube): competencia + Excel + rentabilidad
Qué dijo Cris el 28/10 y ya está en el modelo: **no alquila la casa**; **personal = una recepción** (limpieza y mantenimiento en líneas aparte); **obra de USD 20.000 a 50.000 todo incluido** (Base 35.000; es su número, no cotización); **cabinas: estimativo** (USD 1.500 a 2.500, sin fuente, le importa poco); equipos probablemente de China (el modelo usa precios de Argentina, conservadores); luz/gas/agua y plano "no importan". **Lo que Cris quiere: comparar con la competencia (qué cobra, qué planes, qué ofrece) para calcular el margen y vender la idea a un inversor. No pedirle más datos ni gastar créditos en búsquedas de más.**

**Competencia** (hoja `Competencia` del Excel, desde el censo, sin búsquedas nuevas). Chicos: **Ambrela** (Devoto, verificado): 2 días/sem ARS 89.000, 3 días/sem 103.000, fijo 118.000. **elburó** (Villa Urquiza, probable): Flex desde 115.000, fijo 257.000 a 300.000. Grande: **HUERTA** (Palermo, 1.450 m²): 4 días 135.000 + IVA, 8 días 219.000, 12 días 250.000, ilimitado 270.000, fijo 320.000. Regus y WeWork en USD. Los precios del modelo salen solo de Ambrela; las cadenas son referencia.

**Rentabilidad** (hoja `Lectura`; inversión inicial 52.000 / 75.000 / 109.000 USD en Favorable / Base / Conservador):

| Base, con el 80 % de los puestos | Precio de Ambrela | +15 % | +30 % (como elburó) |
|---|---|---|---|
| Resultado por mes (USD) | +383 | +907 | +1.432 |
| Margen operativo | 9 % | 20 % | 27 % |

- Base necesita 49 miembros flex (66 % del tope de 74). Con las altas supuestas (sin dato de demanda) llega a unos 35 y pierde unos 600 USD por mes en el mes 36: la prueba es una preventa.
- Conservador no da. Favorable (pocos costos, precios +5 %) da margen de 48 % y recupera en 1,6 años: es la cota alta.
- Es una **cota optimista**: luz/gas/agua en un piso, contador en 0, paneles sin línea.
- El Excel se **recalculó con LibreOffice en la nube: 4.479 fórmulas, 0 errores**. No se abrió en Excel de escritorio: falta comprobarlo allá.
- **Paso 2 (informe y presentación) NO empezado**: esperar el OK de Cris.

## `scripts/`
- `consolidar_y_armar.py` (nuevo, 28/10): junta los JSON de `datos/`, calcula medianas por zona (verificadas aparte de probables/inciertas), llena `supuestos_base.supuestos(p)` con cada número atado a su fuente (y verifica que cada cifra copiada exista en el JSON), arma el Excel y lo recalcula con LibreOffice. Se corre con `python3 -I coworking/scripts/consolidar_y_armar.py`. Escribe `datos/resumen_mercado.json`, `datos/supuestos.json` y el `.xlsx`.
- `modelo_xlsx.py` + `supuestos_base.py`: modelo a 36 meses, 3 escenarios, inversión, equilibrio y sensibilidad, todo con fórmulas (sin cambios).
- `recalcular_excel.ps1`: recálculo con el Excel de la PC por COM (comando en línea; no usar `-ExecutionPolicy Bypass`). Solo sirve en la PC.
- python-pptx 1.0.2 instalado el 27/10 (OK de Cris). Excel y PowerPoint están en la PC (sirven para recalcular y exportar a PDF).
