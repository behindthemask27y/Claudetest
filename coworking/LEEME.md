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

## `scripts/`
- `modelo_xlsx.py` + `supuestos_base.py`: modelo a 36 meses, 3 escenarios, inversión, equilibrio y sensibilidad, todo con fórmulas. **Probado con valores de prueba: 0 errores** (recalculado con el Excel de la PC por COM, comando en línea; no usar `-ExecutionPolicy Bypass`). Falta el script que junte los JSON, calcule medianas por zona y llene `supuestos_base.supuestos(p)`.
- `recalcular_excel.ps1`: mismo recálculo como script (no se pudo ejecutar como archivo; usar el comando en línea). Solo sirve en la PC.
- python-pptx 1.0.2 instalado el 27/10 (OK de Cris). Excel y PowerPoint están en la PC (sirven para recalcular y exportar a PDF).
