# Lote 1 de Google Ads — paso a paso

**Qué es:** un solo lote de 6 cambios para sacar el gasto que no rinde, hacer que cada anuncio lleve a su
formulario y sumar volumen. Después se **deja todo quieto 3 semanas** para poder medir. Nada se publica hasta que
vos apretás *Publicar* en el Editor, y el Editor te muestra cada cambio antes.

**Importante:** el Editor muestra los cambios pendientes, pero yo no pude probar la importación dentro de tu
Editor. Los archivos tienen exactamente el formato de tu export (mismas 260 columnas, UTF-16, tabuladores) y los
validé contra él, pero revisá la lista de cambios antes de publicar.

## Los 6 cambios y dónde se hace cada uno

| # | Cambio | Cómo | Archivo |
|---|---|---|---|
| 1 | Pausar la campaña 11 (WhatsApp) | Importar | **A** |
| 2 | Borrar el borrador "Campaign #1" de búsqueda (existe solo en el Editor, no en la cuenta) | A mano (Paso 3) | — |
| 3 | Cargar 10 negativas en la campaña 1 y 10 en la 2 | Importar | **A** |
| 4 | Anuncios de las campañas 1 y 2: **títulos nuevos** (sin los genéricos) y cada uno a su formulario (`/form/vender/` y `/form/valor-prop/`) | Importar | **C** |
| 5 | Pausar las 16 palabras amplias de la campaña 1 (el Grupo 1 **sigue pausado**, como lo dejaste) | Importar | **B** |
| 6 | Pausar la campaña 4 Compradores | Importar | **B** |

- **Archivo A** (`A-lote1-sin-dudas.csv`): pausa la campaña 11 y agrega 20 negativas (21 filas). No bloquean ninguna de
  las 50 palabras que van a quedar activas.
- **Archivo B** (`B-lote1-decisiones.csv`): pausa 16 palabras amplias y pausa la campaña 4 (17 filas). Son decisiones
  tuyas: si no querés alguna, mirá "Si no querés algo" más abajo. **El Grupo 1 no se toca: queda pausado.**

- **Archivo C** (`C-lote1-textos-anuncios.csv`): 5 anuncios editados con títulos nuevos y la URL de su formulario.

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
descripción, porque no pueden verse en lo que lee el cliente. Todos los textos nuevos tienen hasta 30 caracteres en los títulos
y hasta 90 en las descripciones. Las descripciones y la línea legal no cambian (salvo la del anuncio de valuación).

Las 10 negativas (concordancia de frase): alquiler, alquilar, terreno, terrenos, sin inmobiliaria, en cuotas,
abandonadas, empresas que compran, mercado libre, buscainmuebles.

---

## PASO 1 — Descargar lo último de la cuenta
Abrí **Google Ads Editor**, entrá a **CS Real Estate (921-755-2199)** y tocá **Obtener cambios recientes**.
**Por qué:** el export que usé es del 12/10; así te asegurás de trabajar sobre lo que hay hoy en la cuenta.

## PASO 2 — Importar los archivos
1. Menú **Cuenta → Importar → Desde archivo…** (en inglés: *Account → Import → From file…*).
2. Elegí `A-lote1-sin-dudas.csv` → **Procesar** → **Finalizar y revisar cambios**.
3. Revisá: tiene que decir **1 campaña editada** y **20 palabras clave negativas nuevas**. Tocá **Conservar**.
4. Repetí con `B-lote1-decisiones.csv`. Tiene que decir **16 palabras clave editadas y 1 campaña editada**.
5. Repetí con `C-lote1-textos-anuncios.csv`. Tiene que decir **5 anuncios editados**. Si el Editor los muestra como anuncios *nuevos* y deja
   los viejos, pausá los 5 viejos antes de publicar (si no, correrían los dos).

Si los botones se llaman un poco distinto en tu versión, buscá los equivalentes (procesar, revisar, conservar).

## PASO 3 — Borrar el borrador "Campaign #1" (a mano)
1. En el árbol de campañas vas a ver **dos** llamadas "Campaign #1":
   - **La pausada de Rendimiento máximo (PMax), presupuesto 3.000:** *no se toca.*
   - **La de Búsqueda, presupuesto 0.00, marcada como nueva y sin publicar:** esa es el borrador.
2. Seleccioná el borrador → tecla **Supr** (o botón derecho → *Eliminar*) → confirmá.
**Cómo sabés que es el borrador:** no figura en tu informe de rendimiento de la cuenta, que sí lista la PMax y las otras
campañas con ceros. Es un borrador del Editor que nunca se publicó, así que borrarlo no toca la cuenta y no deja ninguna marca de "quitada".
**Este lote no elimina ninguna campaña ni grupo de la cuenta:** solo pausa, y pausar se puede deshacer cuando quieras.

## PASO 4 — Solo si hace falta: cambiar a mano a qué página va cada anuncio
El archivo C ya cambia la URL de los 5 anuncios. Hacé esto **solo si el Editor no las actualizó**.
1. En el árbol, tocá la campaña **#Search_1_vendedores** → pestaña **Anuncios** → seleccioná todos (Ctrl+A).
2. En el panel de la derecha, en **URL final**, poné `https://csrealestate.com.ar/form/vender/` y aplicá.
3. Repetí con **#Search_2_valor_propiedad** y `https://csrealestate.com.ar/form/valor-prop/`.

- Los parámetros de seguimiento (`utm_…`) están a nivel de campaña y se mantienen.
- Los anuncios pueden quedar "en revisión" unas horas: es normal.
- Si seleccionás todos los anuncios de la campaña, entra también el del Grupo 1 (pausado): no pasa nada.
- La campaña 4 queda pausada, así que no se toca.

## PASO 5 — Revisar y publicar
1. Mirá el panel de cambios del Editor. Tiene que haber **solo** lo de la tabla de arriba (más el borrado del borrador).
2. Tocá **Publicar** y confirmá.

## PASO 6 — Chequear al día siguiente (en Google Ads, en el navegador)
- Campañas 11 y 4: **Pausadas**. Las campañas 1 y 2: **Habilitadas**.
- Campaña 1 → Grupos de anuncios: **Grupo de anuncios 1** sigue **pausado**.
- Campañas 1 y 2 → Palabras clave → **Negativas**: las 10 nuevas en cada una.
- Anuncios de las campañas 1 y 2: títulos nuevos (ya no figuran «Atención personal», «CABA y Zona Norte», etc.) y URL final nueva.
- La columna **Eficacia del anuncio** puede tardar un día en actualizarse. Anotá cómo quedó cada anuncio y pasámelo.

## PASO 7 — No tocar nada durante 3 semanas
No cambies presupuestos, pujas, palabras ni anuncios. Cada cambio reinicia el aprendizaje y no podés medir nada.
**Qué sí hacés:** contestar rápido las consultas y anotarlas en el CRM con su temperatura.
**A las 3 semanas:** en la tabla de campañas, columnas *Todas las conversiones*, segmentado por *Acción de
conversión*, mirá cuántos `hot_lead` y cuánto costó cada uno por campaña. Ahí decidimos qué sigue.

---

## Si no querés algo
- **No querés pausar Compradores (campaña 4):** después de importar el archivo B, en el Editor seleccioná la campaña 4 y cambiá su
  estado a *Habilitada* antes de publicar. Y a sus anuncios ponele `https://csrealestate.com.ar/form/comprar/`.
- **No querés pausar las amplias:** seleccionalas (filtrá por concordancia amplia en la campaña 1) y cambiá a *Habilitada*.

## Cómo volver atrás (si algo sale mal)
En el Editor, antes de publicar: *Deshacer* los cambios o descartarlos desde el panel. Después de publicar, a mano:
reactivar las campañas 11 y 4, quitar las negativas nuevas, reactivar las 16 palabras amplias y volver las URL a `https://csrealestate.com.ar/`.

## Lo que este lote NO toca
Presupuestos, pujas, estrategias de oferta, zonas, extensiones, el Grupo 1 (queda pausado), la PMax pausada ni las campañas que ya están pausadas (3, 5 a 10 y 12).
