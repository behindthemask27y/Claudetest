# Lote 1 de Google Ads — un solo archivo, paso a paso

**Archivo para importar:** `LOTE1-importar-en-Editor.csv` (60 filas). **Qué es:** un solo lote de cambios para sacar el gasto que no
rinde, darle presupuesto real a la campaña 1 y mejorar los anuncios. Después se **deja todo quieto 3 semanas** para poder medir.
Nada se publica hasta que vos apretás *Publicar* en el Editor, y el Editor te muestra cada cambio antes.

**Importante:** el archivo tiene exactamente el formato de tu export (mismas 260 columnas, UTF-16, tabuladores) y lo validé contra él,
pero **no pude probar la importación dentro de tu Editor**. Revisá la lista de cambios antes de publicar.

## Qué cambia (todo en el archivo, salvo el borrador)

| # | Cambio | Dónde |
|---|---|---|
| 1 | **Campaña 1: presupuesto de 1.000 a 3.000 por día** | Archivo |
| 2 | 10 negativas de concordancia de frase en las 4 campañas activas (38 en total: la campaña 11 ya tenía 2) | Archivo |
| 3 | Pausar las 16 palabras amplias de la campaña 1 | Archivo |
| 4 | 5 anuncios de las campañas 1 y 2: títulos nuevos (sin los genéricos) y cada uno a su formulario | Archivo |
| 5 | Borrar el borrador "Campaign #1" de búsqueda | A mano (Paso 3) |

**Lo que NO cambia:** las campañas **11 y 4 siguen activas** (decisión tuya), el **Grupo 1 sigue pausado**, no se elimina ninguna
campaña ni grupo de la cuenta, y no se toca ningún otro presupuesto, puja ni zona.

**Las 10 negativas:** alquiler, alquilar, terreno, terrenos, sin inmobiliaria, en cuotas, abandonadas, empresas que compran,
mercado libre, buscainmuebles. Las revisé contra las palabras activas de cada campaña: no bloquean ninguna.

**Títulos nuevos de cada anuncio** (reemplazan a los 6 genéricos: «Atención personal», «CABA y Zona Norte», «Conocé cómo trabajo»,
«CS Real Estate en Red Suma», «Hablemos por WhatsApp», «Contame qué necesitás»):

| Anuncio | Títulos nuevos |
| --- | --- |
| Campaña 1 · Vender propiedad | «Estrategia antes de publicar» · «Precio basado en ventas reales» · «Te acompaño hasta la firma» · «Agente de Red Suma en CABA» · «Vender casa en Zona Norte» · «Publicación en portales» |
| Campaña 1 · Agente para vender | «Agente inmobiliario en CABA» · «Inmobiliaria para vender depto» · «Soy Cristian, de Red Suma» · «Lo que se vendió cerca tuyo» · «Vendé tu casa o departamento» · «Asesoramiento para vender» |
| Campaña 1 · Propiedad no se vende | «¿Por qué no se vende tu casa?» · «Revisión de tu publicación» · «Cambiá la estrategia de venta» · «Precio, fotos y difusión» · «Si llevás meses publicando» · «Una segunda mirada a tu venta» |
| Campaña 2 · Cuánto vale | «Valor basado en comparables» · «Cuánto vale mi casa en CABA» · «Análisis hecho por un agente» · «Propiedades vendidas cerca» · «Sabé el valor antes de vender» · «No es un simulador online» |
| Campaña 2 · Tasación y valuación | «Valuación inmobiliaria» · «Valor de mercado de tu casa» · «Valuación hecha por un agente» · «Comparables vendidos cerca» · «Valor real de tu propiedad» · «Informe de valor con datos» · «Agente de Red Suma en CABA» |

En el último anuncio también se sacó «tasar» del primer título (ahora «Valuación inmobiliaria») y «tasación» de la primera
descripción, porque no pueden verse en lo que lee el cliente. Las demás descripciones y la línea legal no cambian.
URL de los anuncios: campaña 1 → `https://csrealestate.com.ar/form/vender/` · campaña 2 → `https://csrealestate.com.ar/form/valor-prop/`.

---

## PASO 1 — Descargar lo último de la cuenta
Abrí **Google Ads Editor**, entrá a **CS Real Estate (921-755-2199)** y tocá **Obtener cambios recientes**.
**Por qué:** el export que usé es del 12/10; así trabajás sobre lo que hay hoy en la cuenta.

## PASO 2 — Importar el archivo
1. Menú **Cuenta → Importar → Desde archivo…** (en inglés: *Account → Import → From file…*).
2. Elegí `LOTE1-importar-en-Editor.csv` → **Procesar** → **Finalizar y revisar cambios**.
3. Revisá que diga: **1 campaña editada**, **38 palabras clave negativas nuevas**, **16 palabras clave editadas** y **5 anuncios editados**. Tocá **Conservar**.
4. Si el Editor muestra los 5 anuncios como *nuevos* y deja los viejos, pausá los 5 viejos antes de publicar (si no, correrían los dos).

Si los botones se llaman un poco distinto en tu versión, buscá los equivalentes (procesar, revisar, conservar).

## PASO 3 — Borrar el borrador "Campaign #1" (a mano)
1. En el árbol de campañas vas a ver **dos** llamadas "Campaign #1":
   - **La pausada de Rendimiento máximo (PMax), presupuesto 3.000:** *no se toca.*
   - **La de Búsqueda, presupuesto 0.00, marcada como nueva y sin publicar:** esa es el borrador.
2. Seleccioná el borrador → tecla **Supr** (o botón derecho → *Eliminar*) → confirmá.
**Cómo sabés que es el borrador:** no figura en tu informe de rendimiento de la cuenta, que sí lista la PMax y las otras campañas con ceros.
Borrarlo no toca la cuenta y no deja ninguna marca de "quitada". **Este lote no elimina ninguna campaña ni grupo de la cuenta.**

## PASO 4 — Revisar y publicar
1. Mirá el panel de cambios del Editor. Tiene que haber **solo** lo de la tabla de arriba (más el borrado del borrador).
2. Tocá **Publicar** y confirmá.

## PASO 5 — Chequear al día siguiente (en Google Ads, en el navegador)
- **Campaña 1:** presupuesto **3.000**. Campañas 11 y 4: siguen **habilitadas**.
- Campaña 1 → Grupos de anuncios: **Grupo de anuncios 1** sigue **pausado**.
- Campañas 1, 2, 4 y 11 → Palabras clave → **Negativas**: las 10 nuevas (8 en la 11).
- Anuncios de las campañas 1 y 2: títulos nuevos y URL final nueva. Pueden figurar "en revisión" unas horas.
- La columna **Eficacia del anuncio** puede tardar un día en actualizarse. Anotá cómo quedó cada anuncio y pasámelo.

## PASO 6 — No tocar nada durante 3 semanas
No cambies presupuestos, pujas, palabras ni anuncios. Cada cambio reinicia el aprendizaje y no podés medir nada.
**Qué sí hacés:** contestar rápido las consultas y anotarlas en el CRM con su temperatura.
**A las 3 semanas:** en la tabla de campañas, columnas *Todas las conversiones*, segmentado por *Acción de conversión*, mirá cuántos
`hot_lead` y cuánto costó cada uno por campaña. Ahí decidimos qué sigue.

---

## Si algo no te cierra, a mano
- **El presupuesto no cambió:** campaña 1 → Configuración → Presupuesto → 3.000.
- **La URL de los anuncios no cambió:** campaña 1 → pestaña Anuncios → seleccionar todos (Ctrl+A) → panel derecho, *URL final* →
  `https://csrealestate.com.ar/form/vender/`. Igual en la campaña 2 con `https://csrealestate.com.ar/form/valor-prop/`.
- **No querés pausar las amplias:** filtrá por concordancia amplia en la campaña 1 y cambialas a *Habilitada*.

## Cómo volver atrás
Antes de publicar: *Deshacer* o descartar desde el panel de cambios. Después de publicar, a mano: presupuesto de la campaña 1 de vuelta
a 1.000, quitar las negativas nuevas, reactivar las 16 palabras amplias y volver las URL a `https://csrealestate.com.ar/`.

## Notas sobre las campañas 11 y 4 (siguen activas)
La **11** repite palabras de las campañas 1, 2 y 4 y optimiza a un clic de WhatsApp que los formularios nuevos no cuentan a propósito: en el
mes tuvo 0 conversiones con 21.464 gastados. La **4** tiene muy pocas búsquedas. Se mantienen como pediste; a las 3 semanas se miran con datos.
