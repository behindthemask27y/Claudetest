# Instrucciones comunes para el censo de coworkings (CABA) — fecha de corte 27/10/2026

Proyecto: evaluar abrir un coworking con membresías mensuales en **Santo Tomé 2987, Villa del Parque, Comuna 11, CABA** (USIG: -34.605219, -58.487856). Inmueble propio, casa de 450 m² (subsuelo, PB + patio, planta alta).

## Qué entra al censo principal ("principal")
Espacios físicos en CABA donde una persona (freelancer / profesional) paga una **membresía mensual individual** para usar un puesto (días por semana, días por mes, horas por mes, ilimitado, flexible o fijo), aunque además tengan pases diarios u oficinas privadas. Incluye cadenas (cada sede por separado), independientes, de barrio y los que no usan la palabra "coworking".
- Si no podés comprobar que ofrece membresía mensual individual → `"categoria": "candidata_pendiente"`.
- Solo oficinas privadas a empresas, salas por hora, domicilio virtual, eventos → `"secundaria"`.
- Cafés para trabajar, hoteles, bibliotecas → `"sustituto"`.
- Cerrados, próxima apertura, fuera de CABA (GBA) → `"excluida"` con motivo.

## Reglas
- **No inventar nada**: tarifas, Instagram, m², fotos, ocupación. Si no hay dato: `"no disponible públicamente"`, `"sin verificar"` o `"requiere cotización"`.
- No mandar mensajes, formularios, mails ni WhatsApp a nadie. No iniciar sesión en ningún sitio. Solo leer.
- Diferenciar: hecho verificado / afirmación comercial del operador / histórico / estimación.
- Un precio sin fecha o viejo no es vigente: marcá `estado_precio`. Si hay dos precios que se contradicen, guardá los dos y explicá cuál es más confiable en `contradicciones`.
- No atribuir a una sede los servicios o precios de toda la cadena si no hay evidencia de que aplican ahí (anotarlo como "nivel cadena").
- Que "hay cafetera" no es "café incluido"; que "hay sala" no es "sala incluida".
- Falta de posteos recientes ≠ cerrado. Usá Google Maps / reseñas recientes / web / redes para el estado operativo, con fecha.
- Fecha de consulta de todo: 2026-10-27.

## Geocodificar (fuente oficial de la Ciudad)
PowerShell:
```
$u='https://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=' + [uri]::EscapeDataString('Av. Cabildo 2040, caba') + '&geocodificar=true&srid=4326'; Invoke-RestMethod $u | ConvertTo-Json -Depth 6
Invoke-RestMethod ('https://ws.usig.buenosaires.gob.ar/datos_utiles?calle=' + [uri]::EscapeDataString('cabildo') + '&altura=2040') | ConvertTo-Json
```
El primero da coordenadas (x = lng, y = lat); el segundo, barrio y comuna. Si la dirección no normaliza, dejá lat/lng en null y explicalo.

## Fotos
No descargues. Anotá entre 3 y 5 URLs **directas de imagen** (.jpg/.png/.webp, el `src`) de la web oficial de **esa sede** (fachada, puestos, oficina privada, sala, áreas comunes/cafetería). No uses fotos genéricas de la cadena como si fueran de la sede (si solo hay genéricas, marcá `"observaciones": "foto genérica de la cadena"`).

## Formato de salida (JSON, UTF-8, en esta carpeta `datos/`)
Archivo `sedes_<GRUPO>.json` = lista de objetos:
```json
{
 "id_tmp": "G1-01",
 "marca": "", "sede": "", "tipo_operador": "cadena internacional | cadena local | independiente | centro de negocios | otro",
 "direccion": "", "barrio": "", "comuna": "", "lat": null, "lng": null, "fuente_ubicacion": "USIG | Google Maps | web",
 "estado": "verificado | probable | incierto | cerrado | proxima_apertura",
 "evidencia_estado": "", "fecha_evidencia_estado": "",
 "categoria": "principal | candidata_pendiente | secundaria | sustituto | excluida", "motivo_categoria": "",
 "web": "", "pagina_sede": "", "instagram": "", "instagram_evidencia": "enlace desde la web / misma dirección / sin verificar", "otros_canales": "",
 "horarios": "", "publico": "", "superficie_capacidad": "solo si es de esa sede, con fuente",
 "propuesta_valor": "",
 "comunidad_evidencia": "eventos, desayunos, talleres, canal interno, directorio... con fecha y fuente; o 'sin evidencia'",
 "servicios": {
   "cafe": "incluido | incluido con cupo | pago | no ofrecido | sin info", "cafe_detalle": "",
   "te_agua_snacks_cocina": "", "internet": "", "respaldo_internet_energia": "", "escritorios_sillas_clima": "",
   "cabinas_llamadas": "", "salas_reunion": "", "horas_sala_incluidas": "", "precio_sala_extra": "",
   "recepcion_correspondencia_domicilio": "", "lockers": "", "impresiones": "", "limpieza_seguridad": "",
   "accesibilidad": "", "acceso_fuera_horario_finde": "", "terraza_patio_descanso": "", "bicis_estacionamiento": "",
   "eventos_comunidad": "", "convenios_beneficios": ""
 },
 "planes": [{
   "nombre": "", "tipo": "dias_semana | dias_mes | horas_mes | ilimitado_flex | fijo | pase_diario | oficina_privada | sala | domicilio | otro",
   "precio": 0, "moneda": "ARS | USD", "unidad": "persona/mes | puesto/mes | oficina/mes | día | hora | sala/hora",
   "acceso": "días/horas incluidos, fijos o elegibles, reserva, cupo, vencimiento de días no usados",
   "condiciones": "personal o no, varias sedes, invitados, exclusivo/compartido, pausa, baja",
   "iva": "incluido | excluido | sin aclarar", "cargos_extra": "matrícula, depósito...", "permanencia": "",
   "promocion": "", "fuente_url": "", "fecha_publicacion": "", "estado_precio": "vigente_comprobado | publicado_sin_vigencia | historico | a_consultar"
 }],
 "fotos": [{"url_imagen": "", "pagina_origen": "", "tipo": "fachada | puestos | privada | sala | comun", "credito": "", "observaciones": ""}],
 "fuentes": [{"url": "", "tipo": "web oficial | Google Maps | directorio | nota | red social", "que_aporta": ""}],
 "contradicciones": "", "confianza": "alta | media | baja", "pendientes": "qué falta y qué habría que preguntar"
}
```
Archivo `busquedas_<GRUPO>.json` = lista por barrio:
```json
{"barrio": "", "consultas": ["..."], "fuentes_exploradas": ["Google", "Google Maps", "Instagram (búsqueda web)", "coworker.com", "..."],
 "candidatos_detectados": 0, "verificadas_principal": 0, "pendientes": 0, "rondas_extra_sin_novedades": 0, "notas": ""}
```

## Método
Por cada barrio, buscá con variantes: "coworking <barrio>", "oficinas compartidas <barrio>", "co working <barrio>", "alquiler de escritorio <barrio>", "puesto flexible / puesto fijo <barrio>", "membresía coworking <barrio>", "oficina por día <barrio>", "centro de negocios <barrio>", "coworking <barrio> instagram". Usá también directorios (coworker.com, coworkingba / similares, Google Maps vía búsqueda) para descubrir y confirmá en la fuente directa. Cerrá cuando dos rondas de búsqueda cruzada no den sedes nuevas. Guardá los archivos a medida que avanzás (no al final) para no perder trabajo.

Al terminar, respondé en **menos de 250 palabras**: cuántas sedes por categoría, las más relevantes para Villa del Parque, problemas de acceso y qué quedó pendiente. No pegues el JSON en la respuesta.
