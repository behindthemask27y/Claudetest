<?php
/**
 * Endpoint compartido para los formularios propios del sitio (reemplazan a
 * los Google Forms externos — ver CLAUDE.md, sección de formularios).
 *
 * Los 5 formularios (vender, tasacion, alquilar_propiedad, comprar,
 * buscar_alquiler) llaman a este mismo endpoint, cada uno con su propio
 * lead_type — ver $TIPOS_VALIDOS y el switch más abajo.
 *
 * Guarda cada lead como una línea JSON en leads.jsonl y además intenta
 * avisar por email — el archivo es la fuente de verdad (si el email falla
 * o cae en spam, el lead no se pierde).
 *
 * UBICACIÓN DE LEADS.JSONL: fuera de public_html (ver LEADS_DIR más abajo)
 * — antes vivía en leads/leads.jsonl, DENTRO de public_html, protegido
 * sólo por leads/.htaccess. GOOGLE_ADS_SITE_AUDIT.md encontró que ese
 * archivo se podía leer igual por HTTP en producción (Hostinger no
 * estaba aplicando el .htaccess a ese archivo puntual, aunque sí al
 * listado del directorio) — es decir que nombre/teléfono/email de cada
 * consulta quedaban expuestos. La carpeta `leads/` y su `.htaccess`
 * quedan igual (por si alguna vez algo vuelve a escribir ahí sin
 * querer), pero YA NO es donde se guardan los leads nuevos.
 */

declare(strict_types=1);

date_default_timezone_set('America/Argentina/Buenos_Aires');
header('Content-Type: application/json; charset=utf-8');

/* Un nivel arriba de la carpeta que contiene este archivo. Como
 * enviar-lead.php vive en la raíz de lo que se sube a Hostinger (que se
 * descomprime dentro de public_html), __DIR__ acá ES public_html — así
 * que dirname(__DIR__) es su carpeta padre, que en la estructura
 * estándar de Hostinger (y de cPanel en general) NO es pública: no hay
 * ninguna URL que la sirva, sin importar .htaccess. Si la cuenta de
 * Hostinger de Cristian tuviera una estructura distinta (por ejemplo,
 * un dominio addon con public_html anidado más profundo), esta única
 * línea es la que habría que ajustar — ver la verificación post-deploy
 * en el informe de esta tarea. */
define('LEADS_DIR', dirname(__DIR__) . '/leads_privados');

function responder(int $codigo, array $cuerpo): void {
  http_response_code($codigo);
  echo json_encode($cuerpo);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  responder(405, ['ok' => false, 'error' => 'metodo_no_permitido']);
}

header('X-Content-Type-Options: nosniff');

$crudo = file_get_contents('php://input');
// un formulario completo pesa unos pocos KB; algo de más de 64 KB no es una consulta
if (strlen($crudo ?: '') > 65536) {
  responder(413, ['ok' => false, 'error' => 'demasiado_grande']);
}
$datos = json_decode($crudo ?: '', true);
if (!is_array($datos)) {
  responder(400, ['ok' => false, 'error' => 'json_invalido']);
}

// ---------- anti-spam ----------
// honeypot: campo invisible para una persona; un bot que completa "todo" lo llena
if (!empty(trim((string)($datos['sitio_web'] ?? '')))) {
  responder(400, ['ok' => false, 'error' => 'rechazado']);
}
// nadie llena 14 preguntas en menos de 2.5s desde que cargó la página.
// "_ts" es la hora que marcaba el RELOJ DEL CELULAR/COMPU al cargar la página (Date.now() del
// formulario), y acá se compara con la del servidor: si el reloj de la persona está adelantado
// (pasa: relojes mal configurados) la diferencia da NEGATIVA, y antes eso se rechazaba como "bot"
// — una consulta real perdida sin que nadie se enterara. Por eso sólo se rechaza si la diferencia
// es positiva y chica (0 a 2,5 s); una negativa se acepta (un bot no gana nada falseándola: el
// honeypot de arriba y el Referer ya lo filtran).
$ts = (float)($datos['_ts'] ?? 0);
$transcurrido = microtime(true) * 1000 - $ts;
if ($ts <= 0 || ($transcurrido >= 0 && $transcurrido < 2500)) {
  responder(400, ['ok' => false, 'error' => 'rechazado']);
}
// si viene Referer, tiene que ser del propio sitio (no lo exigimos si falta:
// algunos navegadores/config de privacidad lo omiten en pedidos legítimos)
$referer = $_SERVER['HTTP_REFERER'] ?? '';
if ($referer !== '' && stripos($referer, $_SERVER['HTTP_HOST']) === false) {
  responder(400, ['ok' => false, 'error' => 'rechazado']);
}

// ---------- helpers de saneo ----------
function texto($valor, int $maxLargo = 500): string {
  $s = trim(strip_tags((string)$valor));
  $s = preg_replace('/[\r\n]+/', ' ', $s) ?? $s; // por si se usa en headers de email
  return mb_substr($s, 0, $maxLargo);
}
function lista($valor, int $maxItems = 20): array {
  if (!is_array($valor)) return [];
  $out = [];
  foreach (array_slice($valor, 0, $maxItems) as $v) {
    if (is_string($v) && trim($v) !== '') $out[] = texto($v, 200);
  }
  return $out;
}

// ---------- tipos de lead conocidos y sus campos propios ----------
// (los 5 formularios comparten nombre/telefono/email, obligatorios siempre)
$TIPOS_VALIDOS = ['vender', 'tasacion', 'alquilar_propiedad', 'comprar', 'buscar_alquiler'];

$tipo = texto($datos['lead_type'] ?? '', 40);
if (!in_array($tipo, $TIPOS_VALIDOS, true)) {
  responder(400, ['ok' => false, 'error' => 'tipo_invalido']);
}

// ---------- contacto (obligatorio en todos los formularios) ----------
$nombre = texto($datos['nombre'] ?? '', 100);
$telefono = texto($datos['telefono'] ?? '', 30);
$email = texto($datos['email'] ?? '', 150);

$errores = [];
if (mb_strlen($nombre) < 2) $errores[] = 'nombre';
$telefonoLimpio = preg_replace('/[\s\-()]/', '', $telefono) ?? '';
if (!preg_match('/^\+?\d{8,15}$/', $telefonoLimpio)) $errores[] = 'telefono';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errores[] = 'email';

// ---------- campos propios de "vender" ----------
$lead = [
  'lead_type' => $tipo,
  'fecha' => date('c'),
  'nombre' => $nombre,
  'telefono' => $telefono,
  'email' => $email,
];

if ($tipo === 'vender') {
  $lead['tipo_propiedad'] = texto($datos['tipo_propiedad'] ?? '', 60);
  $lead['localidad'] = texto($datos['localidad'] ?? '', 150);
  $lead['estado_general'] = texto($datos['estado_general'] ?? '', 60);
  $lead['situacion_actual'] = texto($datos['situacion_actual'] ?? '', 60);
  $lead['motivo'] = texto($datos['motivo'] ?? '', 1000);
  $lead['plazo'] = texto($datos['plazo'] ?? '', 60);
  $lead['valor_en_mente'] = texto($datos['valor_en_mente'] ?? '', 80);
  $lead['como_llego_valor'] = texto($datos['como_llego_valor'] ?? '', 80);
  $lead['publicada_actualmente'] = texto($datos['publicada_actualmente'] ?? '', 60);
  $lead['documentacion'] = lista($datos['documentacion'] ?? []);
  $lead['como_continuar'] = texto($datos['como_continuar'] ?? '', 120);
  // nuevos (2026-10-12, formularios de una pregunta por pantalla): NO se exigen, así no se pierde una consulta
  // que llegue desde la versión vieja del formulario durante el cambio
  $lead['direccion'] = texto($datos['direccion'] ?? '', 150);
  $lead['ambientes'] = texto($datos['ambientes'] ?? '', 40);
  $lead['superficie'] = texto($datos['superficie'] ?? '', 40);
  $lead['titularidad'] = texto($datos['titularidad'] ?? '', 80);
  $lead['valor_estimado'] = texto($datos['valor_estimado'] ?? '', 60);
  $lead['compra_despues'] = texto($datos['compra_despues'] ?? '', 20);

  foreach (['tipo_propiedad', 'localidad', 'estado_general', 'situacion_actual', 'publicada_actualmente', 'como_continuar'] as $campo) {
    if ($lead[$campo] === '') $errores[] = $campo;
  }
  if (count($lead['documentacion']) < 1) $errores[] = 'documentacion';
}

if ($tipo === 'tasacion') {
  $lead['tipo_propiedad'] = texto($datos['tipo_propiedad'] ?? '', 60);
  $lead['ubicacion'] = texto($datos['ubicacion'] ?? '', 150);
  $lead['descripcion_breve'] = texto($datos['descripcion_breve'] ?? '', 1000);
  $lead['motivo_tasacion'] = texto($datos['motivo_tasacion'] ?? '', 1000);
  $lead['ya_tasada'] = texto($datos['ya_tasada'] ?? '', 80);
  // nuevos (no se exigen)
  $lead['ambientes'] = texto($datos['ambientes'] ?? '', 40);
  $lead['superficie'] = texto($datos['superficie'] ?? '', 40);
  $lead['destacados'] = lista($datos['destacados'] ?? []);
  $lead['plazo_venta'] = texto($datos['plazo_venta'] ?? '', 60);
  $lead['titularidad'] = texto($datos['titularidad'] ?? '', 80);

  foreach (['tipo_propiedad', 'ubicacion', 'descripcion_breve', 'motivo_tasacion', 'ya_tasada'] as $campo) {
    if ($lead[$campo] === '') $errores[] = $campo;
  }
}

if ($tipo === 'alquilar_propiedad') {
  $lead['tipo_propiedad'] = texto($datos['tipo_propiedad'] ?? '', 60);
  $lead['ubicacion'] = texto($datos['ubicacion'] ?? '', 150);
  $lead['descripcion_breve'] = texto($datos['descripcion_breve'] ?? '', 1000);
  $lead['situacion_actual'] = texto($datos['situacion_actual'] ?? '', 80);
  $lead['disponibilidad'] = texto($datos['disponibilidad'] ?? '', 80);
  $lead['que_es_importante'] = lista($datos['que_es_importante'] ?? []);
  // nuevos (no se exigen)
  $lead['ambientes'] = texto($datos['ambientes'] ?? '', 40);
  $lead['superficie'] = texto($datos['superficie'] ?? '', 40);
  $lead['destacados'] = lista($datos['destacados'] ?? []);
  $lead['valor_alquiler'] = texto($datos['valor_alquiler'] ?? '', 60);
  $lead['como_continuar'] = texto($datos['como_continuar'] ?? '', 120);

  foreach (['tipo_propiedad', 'ubicacion', 'descripcion_breve', 'situacion_actual'] as $campo) {
    if ($lead[$campo] === '') $errores[] = $campo;
  }
  if (count($lead['que_es_importante']) < 1) $errores[] = 'que_es_importante';
}

if ($tipo === 'comprar') {
  $lead['tipo_propiedad'] = texto($datos['tipo_propiedad'] ?? '', 60);
  $lead['destino_compra'] = texto($datos['destino_compra'] ?? '', 60);
  $lead['zona'] = texto($datos['zona'] ?? '', 150);
  $lead['ambientes'] = texto($datos['ambientes'] ?? '', 60);
  $lead['presupuesto'] = texto($datos['presupuesto'] ?? '', 80);
  $lead['forma_compra'] = texto($datos['forma_compra'] ?? '', 80);
  $lead['credito_preaprobado'] = texto($datos['credito_preaprobado'] ?? '', 80);
  $lead['plazo_compra'] = texto($datos['plazo_compra'] ?? '', 60);
  $lead['visitando'] = texto($datos['visitando'] ?? '', 80);
  $lead['caracteristicas_indispensables'] = texto($datos['caracteristicas_indispensables'] ?? '', 1000);
  $lead['algo_mas'] = texto($datos['algo_mas'] ?? '', 1000);

  // OJO: destino_compra y plazo_compra son obligatorios en el formulario
  // (el frontend los exige), pero acá a propósito NO se validan: durante
  // un deploy, alguien con la versión vieja del formulario todavía abierta
  // (o en caché) manda el POST sin esos campos — si el servidor los exigiera,
  // esa consulta real se rechazaría y se perdería un lead. Un lead sin esas
  // respuestas es mejor que ningún lead.
  foreach (['tipo_propiedad', 'zona', 'forma_compra'] as $campo) {
    if ($lead[$campo] === '') $errores[] = $campo;
  }
}

if ($tipo === 'buscar_alquiler') {
  // "modalidad" (Tradicional / Temporario) es obligatoria en el formulario,
  // pero acá no se valida — mismo motivo que destino_compra/plazo_compra en
  // 'comprar' (no rechazar un lead real enviado desde la versión vieja del
  // formulario durante un deploy).
  $lead['modalidad'] = texto($datos['modalidad'] ?? '', 40);
  $lead['tipo_propiedad'] = lista($datos['tipo_propiedad'] ?? []);
  $lead['zona'] = texto($datos['zona'] ?? '', 150);
  $lead['presupuesto_mensual'] = texto($datos['presupuesto_mensual'] ?? '', 80);
  $lead['que_necesita'] = texto($datos['que_necesita'] ?? '', 1000);
  $lead['para_cuando'] = texto($datos['para_cuando'] ?? '', 150);
  $lead['como_respalda'] = lista($datos['como_respalda'] ?? []);
  $lead['mascotas'] = texto($datos['mascotas'] ?? '', 150);

  foreach (['zona', 'que_necesita', 'para_cuando', 'mascotas'] as $campo) {
    if ($lead[$campo] === '') $errores[] = $campo;
  }
  if (count($lead['tipo_propiedad']) < 1) $errores[] = 'tipo_propiedad';
  if (count($lead['como_respalda']) < 1) $errores[] = 'como_respalda';
}

// ---------- atribución de Google Ads / UTMs (opcional, no bloquea el envío) ----------
// El frontend guarda gclid/gbraid/wbraid/utm_* en localStorage al detectarlos
// en la URL (ver "atribución" al principio de form/motor.js, y el bloque igual de index.html) y
// los manda acá junto con el resto del payload. Ninguno es obligatorio — un
// lead sin campaña de origen sigue guardándose igual, sólo sin estos campos.
// A propósito NO participan de $errores ni de ningún otro chequeo: son
// metadata de origen, no datos que la persona haya completado a mano.
foreach (['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as $campo) {
  $valor = texto($datos[$campo] ?? '', 200);
  if ($valor !== '') $lead[$campo] = $valor;
}

// rompehielos (en los 5): "Del 1 al 10, ¿cuánto necesitás unas vacaciones?". Opcional, no suma puntos.
$rompehielos = texto($datos['rompehielos'] ?? '', 2);
$lead['rompehielos'] = preg_match('/^(10|[1-9])$/', $rompehielos) ? $rompehielos : '';

if ($errores) {
  responder(400, ['ok' => false, 'error' => 'faltan_datos', 'campos' => $errores]);
}

// ---------- TEMPERATURA de la consulta: los puntos viven SÓLO acá ----------
// Cada consulta suma de 0 a 2 puntos en tres preguntas (¿Cuándo? ¿Puede? ¿Quiere avanzar?).
// 5 o 6 = Caliente · 3 o 4 = Tibia · 0 a 2 = Fría. Lo que no figura en estas tablas, o una pregunta sin
// responder, vale 0. '*' = cualquier otra respuesta. Si un eje mira varias preguntas, se suman (tope 2); en una
// pregunta de varias respuestas cuenta la que más puntos da. Ajustar en uno o dos meses mirando qué consultas
// avanzaron de verdad (ver CLAUDE.md, "Temperatura"). A Google Ads y a Meta NO se manda el puntaje ni ningún dato
// personal: sólo una bandera sí/no ("hot") cuando la consulta sale Caliente. El sitio la usa para disparar el
// evento hot_lead (ver form/motor.js). El puntaje completo sigue quedando sólo en el mail y en el registro.
$PUNTOS = [
  'vender' => [
    'cuando' => ['plazo' => ['Lo antes posible' => 2, 'Dentro de 1 a 3 meses' => 2, 'Dentro de 3 a 6 meses' => 1, 'Durante los próximos 6 a 12 meses' => 1]],
    'puede' => ['titularidad' => ['Soy el único dueño' => 1, 'Somos varios dueños' => 1], 'documentacion' => ['Escritura' => 1]],
    'quiere' => ['como_continuar' => ['Quiero coordinar una reunión' => 2, 'Quiero coordinar una visita a la propiedad' => 2, 'Quiero recibir orientación sobre el valor de mi propiedad' => 1, 'Quiero conocer primero cómo trabajás' => 1]],
  ],
  'tasacion' => [
    'cuando' => ['plazo_venta' => ['En los próximos 3 meses' => 2, 'Entre 3 y 12 meses' => 1]],
    'puede' => ['titularidad' => ['Soy el único dueño' => 2, 'Somos varios dueños' => 2, 'Es una sucesión' => 1]],
    'quiere' => ['motivo_tasacion' => ['Para vender' => 2, 'Para alquilar' => 1, 'Por una sucesión o división' => 1]],
  ],
  'alquilar_propiedad' => [
    'cuando' => ['disponibilidad' => ['Ahora' => 2, 'Dentro de los próximos 30 días' => 2, 'Dentro de los 3 meses' => 1]],
    'puede' => ['situacion_actual' => ['Vacía y disponible' => 2, 'Próximamente va a quedar disponible' => 1]],
    'quiere' => ['como_continuar' => ['Quiero coordinar una reunión' => 2, 'Quiero que vengas a ver la propiedad' => 2, 'Quiero saber cuánto podría cobrar' => 1]],
  ],
  'comprar' => [
    'cuando' => ['plazo_compra' => ['Lo antes posible' => 2, 'Dentro de 3 meses' => 2, 'Dentro de 6 meses' => 1]],
    'puede' => ['forma_compra' => ['Fondos propios' => 2, 'Necesito vender otra propiedad primero' => 1], 'credito_preaprobado' => ['Sí, ya está preaprobado' => 2, 'Lo estoy gestionando' => 1]],
    'quiere' => ['visitando' => ['Sí, ya visité varias' => 2, 'Visité alguna' => 1]],
  ],
  'buscar_alquiler' => [
    'cuando' => ['para_cuando' => ['Ya, este mes' => 2, 'En 1 a 2 meses' => 1]],
    'puede' => ['como_respalda' => ['Garantía propietaria' => 2, 'Seguro de caución' => 2, 'Recibos de sueldo / ingresos demostrables' => 2, 'Todavía necesito asesoramiento sobre esto' => 0, '*' => 1]],
    'quiere' => ['presupuesto_mensual' => ['Prefiero hablarlo' => 1, '*' => 2]],   // dio un número = 2
  ],
];
// Avisos aparte en el mail: [pregunta, respuesta, aviso]
$AVISOS = [
  'vender' => [['compra_despues', 'Sí', 'También compra'], ['compra_despues', 'Tal vez', 'Tal vez compra'], ['titularidad', 'Es una sucesión', 'Sucesión'], ['publicada_actualmente', 'Sí', 'Ya está publicada']],
  'tasacion' => [['ya_tasada', 'Sí, más de una', 'Comparando valores'], ['titularidad', 'Es una sucesión', 'Sucesión'], ['motivo_tasacion', 'Por una sucesión o división', 'Sucesión']],
  'alquilar_propiedad' => [['que_es_importante', 'Alguien que gestione todo el proceso', 'Quiere que gestiones todo']],
  'comprar' => [['forma_compra', 'Necesito vender otra propiedad primero', 'También vende'], ['destino_compra', 'Para invertir', 'Inversor']],
  'buscar_alquiler' => [],
];

function temperaturaDe(string $tipo, array $lead, array $PUNTOS, array $AVISOS): array {
  $nombres = ['cuando' => '¿Cuándo?', 'puede' => '¿Puede?', 'quiere' => '¿Quiere avanzar?'];
  $ejes = [];
  $total = 0;
  foreach ($nombres as $clave => $nombre) {
    $puntos = 0;
    $por = [];
    foreach (($PUNTOS[$tipo][$clave] ?? []) as $campo => $tabla) {
      $valor = $lead[$campo] ?? '';
      $items = is_array($valor) ? $valor : ($valor === '' ? [] : [$valor]);
      $mejor = 0;
      foreach ($items as $item) {
        $mejor = max($mejor, array_key_exists($item, $tabla) ? $tabla[$item] : ($tabla['*'] ?? 0));
      }
      $puntos += $mejor;
      if ($items) $por[] = implode(', ', $items);
    }
    $puntos = min(2, $puntos);
    $total += $puntos;
    $ejes[] = ['nombre' => $nombre, 'puntos' => $puntos, 'por' => $por ? implode(' · ', $por) : 'Sin responder'];
  }
  $avisos = [];
  foreach (($AVISOS[$tipo] ?? []) as [$campo, $respuesta, $aviso]) {
    $valor = $lead[$campo] ?? '';
    $hay = is_array($valor) ? in_array($respuesta, $valor, true) : $valor === $respuesta;
    if ($hay && !in_array($aviso, $avisos, true)) $avisos[] = $aviso;
  }
  return ['temperatura' => $total >= 5 ? 'Caliente' : ($total >= 3 ? 'Tibia' : 'Fría'), 'puntaje' => $total, 'ejes' => $ejes, 'avisos' => $avisos];
}

$temp = temperaturaDe($tipo, $lead, $PUNTOS, $AVISOS);
$lead['temperatura'] = $temp['temperatura'];
$lead['puntaje'] = $temp['puntaje'];
$lead['avisos'] = $temp['avisos'];

// ---------- guardar (fuente de verdad) ----------
$carpetaLeads = LEADS_DIR;
if (!is_dir($carpetaLeads)) {
  mkdir($carpetaLeads, 0755, true);
}
$archivo = $carpetaLeads . '/leads.jsonl';
$linea = json_encode($lead, JSON_UNESCAPED_UNICODE) . "\n";

$fp = fopen($archivo, 'a');
if (!$fp) {
  responder(500, ['ok' => false, 'error' => 'no_se_pudo_guardar']);
}
flock($fp, LOCK_EX);
fwrite($fp, $linea);
flock($fp, LOCK_UN);
fclose($fp);

// ---------- avisar por email (best-effort, no condiciona la respuesta) ----------
// El cuerpo del mail usa etiquetas legibles en vez de los nombres crudos
// del payload (antes era "motivo_tasacion: ...", ahora "Motivo: ..."), y
// recorre una lista FIJA de preguntas por lead_type (no las claves que
// haya en $lead) para que las que quedaron sin responder aparezcan igual,
// con valor vacío, en vez de desaparecer del mail — Cristian lo usa como
// guión al llamar al cliente, y una pregunta que no aparece es una
// pregunta que se olvida de hacer en la llamada. Esto sólo cambia cómo se
// arma $cuerpo: $lead (lo que se guarda en leads.jsonl) no se toca.
$NOMBRES_FORMULARIO = [
  'vender' => 'Vender',
  'tasacion' => 'Cuánto vale',
  'alquilar_propiedad' => 'Alquilar mi propiedad',
  'comprar' => 'Comprar',
  'buscar_alquiler' => 'Buscar alquiler',
];

// Preguntas propias de cada lead_type, AGRUPADAS por tema (el título de cada grupo sale en el mail como
// encabezado). Dentro de cada grupo van en el orden del formulario. Todas se listan siempre, aunque la persona
// no las haya respondido (salen con el valor vacío) para que Cristian no se olvide de preguntarlas al llamar.
// Ojo: 'descripcion_breve' (se arma sola con ambientes + m² + destacados) se guarda en leads.jsonl pero NO sale
// en el mail porque repetiría lo de arriba.
$CAMPOS_EMAIL = [
  'vender' => [
    'LA PROPIEDAD' => [
      'tipo_propiedad' => 'Tipo de propiedad',
      'localidad' => 'Barrio / localidad',
      'direccion' => 'Calle y altura',
      'ambientes' => 'Ambientes',
      'superficie' => 'Superficie',
      'estado_general' => 'Estado general',
      'situacion_actual' => 'Situación actual (quién vive / cómo está)',
      'documentacion' => 'Documentación disponible',
    ],
    'SU SITUACIÓN' => [
      'titularidad' => '¿Es el dueño?',
      'plazo' => 'Plazo para vender',
      'motivo' => 'Motivo de la venta',
      'publicada_actualmente' => '¿Está publicada actualmente?',
      'compra_despues' => '¿Compra otra propiedad después?',
    ],
    'VALOR Y PRÓXIMO PASO' => [
      'valor_en_mente' => '¿Tiene un valor en mente?',
      'valor_estimado' => 'Valor que espera',
      'como_llego_valor' => '¿Cómo llegó a ese valor?',
      'como_continuar' => 'Cómo quiere continuar',
    ],
  ],
  'tasacion' => [
    'LA PROPIEDAD' => [
      'tipo_propiedad' => 'Tipo de propiedad',
      'ubicacion' => 'Ubicación',
      'ambientes' => 'Ambientes',
      'superficie' => 'Superficie',
      'destacados' => 'Destacados (cochera, balcón, etc.)',
    ],
    'SU SITUACIÓN' => [
      'motivo_tasacion' => '¿Para qué quiere saber el valor?',
      'plazo_venta' => '¿Cuándo piensa vender?',
      'titularidad' => '¿Es el dueño?',
      'ya_tasada' => '¿Ya le dieron un valor?',
    ],
  ],
  'alquilar_propiedad' => [
    'LA PROPIEDAD' => [
      'tipo_propiedad' => 'Tipo de propiedad',
      'ubicacion' => 'Ubicación',
      'ambientes' => 'Ambientes',
      'superficie' => 'Superficie',
      'destacados' => 'Destacados (cochera, balcón, etc.)',
    ],
    'SU SITUACIÓN Y SUS PLANES' => [
      'situacion_actual' => 'Situación actual (quién vive / cómo está)',
      'disponibilidad' => 'Disponibilidad',
      'valor_alquiler' => 'Valor que espera cobrar',
      'que_es_importante' => 'Qué es lo más importante para el dueño',
      'como_continuar' => 'Cómo quiere continuar',
    ],
  ],
  'comprar' => [
    'LO QUE BUSCA' => [
      'tipo_propiedad' => 'Tipo de propiedad',
      'destino_compra' => '¿Es para vivienda o inversión?',
      'zona' => 'Zona/s de interés',
      'ambientes' => 'Ambientes',
      'caracteristicas_indispensables' => 'Características indispensables',
      'algo_mas' => 'Algo más a saber',
    ],
    'PRESUPUESTO Y FORMA DE PAGO' => [
      'presupuesto' => 'Presupuesto',
      'forma_compra' => 'Forma de compra',
      'credito_preaprobado' => '¿Crédito preaprobado?',
    ],
    'SU MOMENTO' => [
      'plazo_compra' => 'Plazo para comprar',
      'visitando' => '¿Ya visitó propiedades?',
    ],
  ],
  'buscar_alquiler' => [
    'LO QUE BUSCA' => [
      'modalidad' => 'Modalidad (tradicional / temporario)',
      'tipo_propiedad' => 'Tipo de propiedad',
      'zona' => 'Zona/s de interés',
      'presupuesto_mensual' => 'Presupuesto mensual',
      'que_necesita' => 'Qué necesita sí o sí',
    ],
    'SU SITUACIÓN' => [
      'para_cuando' => 'Para cuándo necesita mudarse',
      'como_respalda' => 'Cómo respalda el alquiler (garantía)',
      'mascotas' => 'Mascotas',
    ],
  ],
];

// De dónde vino la persona (datos de la campaña de Ads). Sólo se listan los que llegaron con el lead; las
// etiquetas explican qué es cada uno (entre paréntesis queda el nombre técnico, por si hay que buscarlo en Ads).
$ATRIBUCION_EMAIL = [
  'gclid' => 'Código de clic del anuncio de Google (GCLID)',
  'gbraid' => 'Código de clic de Google para iPhone (GBRAID)',
  'wbraid' => 'Código de clic de Google para iPhone (WBRAID)',
  'utm_source' => 'Dónde estaba el anuncio (utm_source)',
  'utm_medium' => 'Tipo de tráfico (utm_medium)',
  'utm_campaign' => 'Campaña (utm_campaign)',
  'utm_term' => 'Palabra que buscó (utm_term)',
  'utm_content' => 'Código del anuncio (utm_content)',
];
$GLOSA_ATRIBUCION = [
  'utm_medium' => ['cpc' => 'cpc (anuncio pago por clic)'],
];

function valorParaEmail($valor): string {
  return is_array($valor) ? implode(', ', $valor) : (string)$valor;
}

// Un grupo del mail: encabezado + líneas "Etiqueta: valor" (las que no tienen valor salen vacías a propósito).
function seccionEmail(string $titulo, array $lineas): string {
  return "── " . $titulo . " ──\n" . implode("\n", $lineas) . "\n\n";
}

$destino = 'cstedtfeld@redsuma.com.ar';
$nombreFormulario = $NOMBRES_FORMULARIO[$tipo] ?? $tipo;
// Asunto: "🔥 Caliente · Vender · Juan Pérez" (🌡️ Tibia, ❄️ Fría)
$EMOJI_TEMPERATURA = ['Caliente' => '🔥', 'Tibia' => '🌡️', 'Fría' => '❄️'];
$asunto = $EMOJI_TEMPERATURA[$temp['temperatura']] . ' ' . $temp['temperatura'] . ' · ' . $nombreFormulario . ' · ' . $nombre;
// $lead['fecha'] queda en formato ISO 8601 para leads.jsonl (no se toca);
// acá sólo se formatea una copia legible para el mail.
$fechaLegible = date('d/m/Y - H:i', strtotime($lead['fecha'])) . 'hs';

// Orden del mail: 1) cómo viene (temperatura) y qué formulario; 2) contacto; 3) por qué salió ese puntaje;
// 4) las respuestas, por tema; 5) de dónde vino.
$cuerpo = $EMOJI_TEMPERATURA[$temp['temperatura']] . ' ' . mb_strtoupper($temp['temperatura']) . ' · ' . $temp['puntaje'] . " de 6 puntos\n";
$cuerpo .= "Nuevo lead de csrealestate.com.ar · {$nombreFormulario} · {$fechaLegible}\n\n";

$cuerpo .= seccionEmail('CONTACTO', [
  "Nombre: {$nombre}",
  "Teléfono: {$telefono}",
  "Email: {$email}",
]);

$lineasPuntaje = [];
foreach ($temp['ejes'] as $eje) {
  $lineasPuntaje[] = '• ' . $eje['nombre'] . ' ' . $eje['puntos'] . ' de 2 — ' . $eje['por'];
}
if ($temp['avisos']) $lineasPuntaje[] = 'A tener en cuenta: ' . implode(' · ', $temp['avisos']);
$lineasPuntaje[] = 'Vacaciones: ' . ($lead['rompehielos'] !== '' ? $lead['rompehielos'] . ' de 10' : 'no respondió') . ' (pregunta de rompehielos, no suma puntos)';
$cuerpo .= seccionEmail('CÓMO SALIÓ EL PUNTAJE', $lineasPuntaje);

foreach ($CAMPOS_EMAIL[$tipo] as $tituloGrupo => $campos) {
  $lineas = [];
  foreach ($campos as $campo => $etiqueta) {
    $lineas[] = $etiqueta . ': ' . valorParaEmail($lead[$campo] ?? '');
  }
  $cuerpo .= seccionEmail($tituloGrupo, $lineas);
}

$lineasAtribucion = [];
foreach ($ATRIBUCION_EMAIL as $campo => $etiqueta) {
  if (!empty($lead[$campo])) {
    $valor = (string)$lead[$campo];
    $lineasAtribucion[] = $etiqueta . ': ' . ($GLOSA_ATRIBUCION[$campo][$valor] ?? $valor);
  }
}
if (!$lineasAtribucion) $lineasAtribucion[] = 'No vino de un anuncio (entró directo o sin código de campaña).';
$cuerpo .= rtrim(seccionEmail('DE DÓNDE VINO', $lineasAtribucion)) . "\n";

// El asunto lleva tildes y una raya ("Tasación — Luis"): los encabezados de un mail sólo admiten
// ASCII, así que se codifica (RFC 2047); sin esto algunos clientes de correo lo muestran con
// símbolos raros ("TasaciÃ³n â€” Luis").
$asuntoCodificado = '=?UTF-8?B?' . base64_encode($asunto) . '?=';
$headers = "From: CS Real Estate <no-reply@csrealestate.com.ar>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
if (!@mail($destino, $asuntoCodificado, $cuerpo, $headers)) {
  // el lead ya está guardado arriba; esto sólo deja una pista de que el AVISO por mail no salió
  @file_put_contents($carpetaLeads . '/mail-errores.log', date('c') . " mail() devolvio false (lead {$tipo}, {$email})\n", FILE_APPEND | LOCK_EX);
}

// hot = la consulta salió Caliente (5 o 6 puntos): form/motor.js dispara hot_lead sólo si esto es true.
responder(200, ['ok' => true, 'hot' => $temp['temperatura'] === 'Caliente']);
