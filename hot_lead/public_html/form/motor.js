/* form/motor.js — motor compartido de los 5 formularios (2026-10-12).
   Cada form/<nombre>/index.html trae sólo su marco (GTM, encabezado, Política de Privacidad, pie) y un
   <section id="cs-form" data-form="<lead_type>">: las preguntas, las pantallas, las barras y el envío viven acá.
   Diseño aprobado por Cristian en el prototipo "Formularios CS Real Estate" (claude.ai/artifact/HmcWRCirghefmgTNpuTwMe).

   MEDICIÓN (no tocar sin avisar; ver CLAUDE.md, "Formularios propios"):
   - generate_lead (lead_type + form_name) se empuja UNA vez, sólo después del {ok:true} del servidor.
   - hot_lead (lead_type + form_name) se empuja justo después de generate_lead, y SÓLO si el servidor responde
     {ok:true, hot:true} (la consulta salió Caliente: 5 o 6 puntos, ver enviar-lead.php). Sin datos personales.
   - El WhatsApp de la pantalla final usa boton_id 'whatsapp-gracias': probado, no dispara click_whatsapp (GA4) ni
     Contact (Meta), así una consulta no se cuenta dos veces.
   - El "atrás" del celular agrega pasos al historial con la MISMA dirección: con un # en la dirección, Meta contaría
     un PageView por pregunta (probado).
   - Los nombres de campo y los valores de las preguntas que ya existían NO cambian (los usan el mail, el registro de
     consultas y la medición). Lo que antes era texto libre y ahora son chips viaja como texto en el mismo campo.
   - Nunca la palabra "tasación" en nada que vea la persona (los nombres internos tasacion/motivo_tasacion/ya_tasada sí). */
(function () {
  'use strict';

  var raiz = document.getElementById('cs-form');
  if (!raiz) return;

  var MENOS_MOVIMIENTO = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var AVATAR = '../../cris-avatar.webp';
  var WHATSAPP = '5491166951945';
  var ENDPOINT = '../../enviar-lead.php';
  var VIGENCIA_GUARDADO = 24 * 60 * 60 * 1000; // si cierra y vuelve dentro de las 24 h, sigue donde estaba
  var TS = Date.now();                          // _ts del anti-robots: la hora de carga de la página

  /* ---------- atribución de Google Ads / UTMs (igual que antes: misma clave, 90 días, el último clic gana;
     nunca va al dataLayer, sólo viaja con la consulta) ---------- */
  var leerAtribucion = (function () {
    var CAMPOS = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    var CLAVE = 'csre_atribucion';
    var DIAS_VALIDEZ = 90;
    try {
      var params = new URLSearchParams(location.search);
      var encontrados = {}, hayAlguno = false;
      CAMPOS.forEach(function (c) { var v = params.get(c); if (v) { encontrados[c] = v; hayAlguno = true; } });
      if (hayAlguno) { encontrados.capturado_en = Date.now(); localStorage.setItem(CLAVE, JSON.stringify(encontrados)); }
    } catch (e) { /* sin localStorage: sin atribución, el resto sigue igual */ }
    return function () {
      try {
        var g = JSON.parse(localStorage.getItem(CLAVE) || 'null');
        if (!g || (Date.now() - (g.capturado_en || 0)) / 86400000 > DIAS_VALIDEZ) return {};
        var limpio = {};
        CAMPOS.forEach(function (c) { if (g[c]) limpio[c] = g[c]; });
        return limpio;
      } catch (e) { return {}; }
    };
  })();

  /* ---------- íconos de línea (misma familia que los de la home: 24×24, sin relleno, trazo 1.7) ---------- */
  var I = {
    depto: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h1.5M13.5 7H15M9 11h1.5M13.5 11H15M9 15h1.5M13.5 15H15M11 21v-3h2v3"/>',
    casa: '<path d="M4 11.5 12 5l8 6.5"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>',
    ph: '<path d="M3 20h18"/><path d="M5 20V9.5L10 5.5l5 4V20"/><path d="M15 13h4.5v7"/><path d="M8.5 20v-4.5h3V20"/>',
    local: '<path d="M4.5 9.5 6 4.5h12l1.5 5"/><path d="M4.5 9.5a2.4 2.4 0 0 0 4.8 0 2.4 2.4 0 0 0 4.8 0 2.4 2.4 0 0 0 4.8 0"/><path d="M5.5 11.5V20h13v-8.5"/><path d="M10 20v-5h4v5"/>',
    otro: '<circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
    flip: '<path d="M19.5 10.5A7.5 7.5 0 0 0 6 7.2L4.5 8.8"/><path d="M4.5 4.5v4.3h4.3"/><path d="M4.5 13.5A7.5 7.5 0 0 0 18 16.8l1.5-1.6"/><path d="M19.5 19.5v-4.3h-4.3"/>',
    vivir: '<path d="M5 11V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/><path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z"/><path d="M5.5 18v2M18.5 18v2"/>',
    invertir: '<path d="M4 19.5h16"/><path d="M5 15.5l4-4 3 3 6.5-6.5"/><path d="M14.5 8h4v4"/>',
    llave: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16.5 6.5l2.2 2.2M14.2 8.8l2 2"/>',
    valija: '<rect x="4" y="7.5" width="16" height="12.5" rx="2"/><path d="M9 7.5V5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M4 12.5h16"/>'
  };
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.2 4L19 7"/></svg>';
  function icono(n) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[n] + '</svg>';
  }

  /* ---------- BARRAS DESLIZABLES: los números van SÓLO acá (con la inflación se actualizan cada tanto) ----------
     Cada tramo es [desde, hasta, de a cuánto]; al final siempre hay un punto "Más de …". */
  function miles(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function escala(tramos) {
    var v = [];
    tramos.forEach(function (t) { for (var x = t[0]; x <= t[1]; x += t[2]) v.push(x); });
    v.push('mas');
    return v;
  }
  var ESCALAS = {
    usd: { valores: escala([[30000, 150000, 5000], [160000, 400000, 10000], [425000, 1000000, 25000]]), inicial: 150000,
      fmt: function (x) { return x === 'mas' ? 'Más de USD 1.000.000' : 'USD ' + miles(x); }, corto: ['USD 30.000', '+ USD 1.000.000'] },
    ars: { valores: escala([[300000, 1500000, 50000], [1600000, 4000000, 100000]]), inicial: 800000,
      fmt: function (x) { return x === 'mas' ? 'Más de $ 4.000.000' : '$ ' + miles(x); }, corto: ['$ 300.000', '+ $ 4.000.000'] },
    m2: { valores: escala([[20, 150, 5], [160, 400, 10]]), inicial: 60,
      fmt: function (x) { return x === 'mas' ? 'Más de 400 m²' : miles(x) + ' m²'; }, corto: ['20 m²', '+ 400 m²'] },
    diez: { valores: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], inicial: 5, fmt: function (x) { return String(x); }, corto: ['1', '10'] }
  };
  function idxInicial(e) { return ESCALAS[e].valores.indexOf(ESCALAS[e].inicial); }

  /* ---------- listas ---------- */
  var ZONAS_CABA = ['Villa Urquiza', 'Villa Devoto', 'Villa del Parque', 'Saavedra', 'Núñez', 'Belgrano', 'Coghlan', 'Villa Pueyrredón'];
  var ZONAS_NORTE = ['Vicente López', 'Olivos', 'Florida', 'Martínez', 'San Isidro'];
  var TODOS_BARRIOS = ['Agronomía', 'Almagro', 'Balvanera', 'Barracas', 'Belgrano', 'Boedo', 'Caballito', 'Chacarita', 'Coghlan', 'Colegiales', 'Constitución', 'Flores', 'Floresta', 'La Boca', 'La Paternal', 'Liniers', 'Mataderos', 'Monte Castro', 'Monserrat', 'Nueva Pompeya', 'Núñez', 'Palermo', 'Parque Avellaneda', 'Parque Chacabuco', 'Parque Chas', 'Parque Patricios', 'Puerto Madero', 'Recoleta', 'Retiro', 'Saavedra', 'San Cristóbal', 'San Nicolás', 'San Telmo', 'Vélez Sarsfield', 'Versalles', 'Villa Crespo', 'Villa del Parque', 'Villa Devoto', 'Villa General Mitre', 'Villa Lugano', 'Villa Luro', 'Villa Ortúzar', 'Villa Pueyrredón', 'Villa Real', 'Villa Riachuelo', 'Villa Santa Rita', 'Villa Soldati', 'Villa Urquiza',
    'Vicente López', 'Olivos', 'La Lucila', 'Florida', 'Florida Oeste', 'Munro', 'Carapachay', 'Villa Martelli', 'Villa Adelina', 'Martínez', 'San Isidro', 'Acassuso', 'Beccar', 'Boulogne', 'San Fernando', 'Victoria', 'Tigre', 'Nordelta', 'Don Torcuato', 'General Pacheco', 'Benavídez', 'Pilar', 'Escobar', 'San Martín'];
  var TIPOS = [{ v: 'Departamento', i: 'depto' }, { v: 'Casa', i: 'casa' }, { v: 'PH', i: 'ph' }, { v: 'Local comercial', i: 'local' }, { v: 'Otro', i: 'otro' }];
  var TITULAR = ['Soy el único dueño', 'Somos varios dueños', 'Es una sucesión', 'Consulto por un familiar o conocido'];
  var AMBIENTES = ['Monoambiente', '2', '3', '4', '5 o más'];
  var EXCLUSIVAS = ['Nada en especial'];
  var PAISES = [['+54 9', 'Argentina'], ['+598', 'Uruguay'], ['+56', 'Chile'], ['+595', 'Paraguay'], ['+55', 'Brasil'], ['+591', 'Bolivia'], ['+51', 'Perú'], ['+57', 'Colombia'], ['+58', 'Venezuela'], ['+52', 'México'], ['+34', 'España'], ['+39', 'Italia'], ['+1', 'Estados Unidos'], ['otro', 'Otro país']];

  /* lo que se puede destacar depende del tipo de propiedad: a un local no se le pregunta por balcón */
  var LOCAL_DEST = ['Vidriera a la calle', 'En esquina', 'Baño', 'Depósito o sótano', 'Entrepiso o planta alta', 'Salida de humos', 'Apto gastronomía'];
  var DEST = {
    valor: { 'Departamento': ['Balcón', 'Cochera', 'Patio o terraza', 'Amenities', 'A estrenar', 'Apto crédito'], 'Casa': ['Jardín', 'Pileta', 'Cochera', 'Parrilla o quincho', 'A estrenar', 'Apto crédito'], 'PH': ['Patio', 'Terraza propia', 'Parrilla', 'Cochera', 'Sin expensas', 'Apto crédito'], 'Local comercial': LOCAL_DEST },
    alquilar: { 'Departamento': ['Amoblado', 'Balcón', 'Cochera', 'Patio o terraza', 'Amenities', 'Acepta mascotas'], 'Casa': ['Amoblado', 'Jardín', 'Pileta', 'Cochera', 'Parrilla o quincho', 'Acepta mascotas'], 'PH': ['Amoblado', 'Patio', 'Terraza propia', 'Parrilla', 'Cochera', 'Acepta mascotas'], 'Local comercial': LOCAL_DEST }
  };
  function destacadosPara(tabla) { return function (r) { return DEST[tabla][r.tipo_propiedad] || DEST[tabla]['Departamento']; }; }
  function tipos(r) { var t = r.tipo_propiedad; return Array.isArray(t) ? t : (t ? [t] : []); }
  function soloLocal(r) { var t = tipos(r); return t.length > 0 && t.every(function (x) { return x === 'Local comercial'; }); }
  function conLocal(r) { return tipos(r).indexOf('Local comercial') > -1; }

  /* rompehielos (en los 5, antes del contacto): no suma puntos */
  var ROMPEHIELOS = { id: 'rompehielos', tipo: 'deslizador', escala: 'diez', opcional: true,
    titulo: 'Del 1 al 10, ¿cuánto necesitás unas vacaciones?', ayuda: 'Una última, y no suma ni resta.',
    extremos: ['Estoy bien así', 'Ya debería estar haciendo la valija'],
    notasRango: [[1, 3, 'Qué envidia. Me caés bien.'], [4, 7, 'Un fin de semana largo no te vendría mal.'], [8, 10, 'Te entiendo. Mientras armás la valija, yo me ocupo de esto.']] };

  /* ---------- cómo viaja cada respuesta al servidor ---------- */
  function lista(r, id) { return (r[id] || []).slice(); }
  function zonaSel(r, id) { var z = r[id]; return z && z.sel ? z.sel.slice() : []; }
  function zonaCalle(r, id) { var z = r[id]; return z && z.calle ? z.calle.trim() : ''; }
  function ubicacionTexto(r, id) { var s = zonaSel(r, id).join(', '), c = zonaCalle(r, id); return s + (s && c ? ' · ' : '') + c; }
  function ambientesDe(r) { return !soloLocal(r) && r.tamano && r.tamano.amb ? r.tamano.amb : ''; }
  function ambientesTexto(a) { return a ? (a === 'Monoambiente' ? 'Monoambiente' : a + ' ambientes') : ''; }
  function superficieDe(r) { var t = r.tamano; if (!t) return ''; return t.nose ? 'sin dato' : ESCALAS.m2.fmt(ESCALAS.m2.valores[t.m2]); }
  function deslizadorTexto(r, id, esc, alt) { var d = r[id]; if (!d) return ''; if (d.alt) return alt || ''; return ESCALAS[esc].fmt(ESCALAS[esc].valores[d.idx]); }
  function descripcionArmada(r) {
    var sup = superficieDe(r);
    var partes = [ambientesTexto(ambientesDe(r)), sup === 'sin dato' ? '' : sup, lista(r, 'destacados').join(', ')].filter(Boolean);
    return partes.join(' · ') || (r.tipo_propiedad || '');
  }

  /* ---------- los 5 formularios (claves = lead_type, igual que antes) ---------- */
  var FORMS = {
    vender: {
      corto: 'Vender', intro: 'Cuanto más me cuentes de tu propiedad, más concreto puedo ser en nuestra primera charla.',
      pantallas: [
        { id: 'tipo_propiedad', tipo: 'unica', titulo: '¿Qué tipo de propiedad querés vender?', opciones: TIPOS },
        { id: 'localidad', tipo: 'zona', calle: true, titulo: '¿Dónde está?', ayuda: 'Tocá el barrio o buscalo. La calle es opcional.' },
        { id: 'tamano', tipo: 'tamano', titulo: '¿Qué tamaño tiene?' },
        { id: 'estado_general', tipo: 'unica', dos: true, titulo: '¿En qué estado está?', opciones: ['Excelente', 'Muy buen estado', 'Buen estado', 'Requiere mejoras', 'A refaccionar', 'No sabría decirte'] },
        { id: 'situacion_actual', tipo: 'unica', titulo: 'Hoy la propiedad está…', opciones: ['Vacía', 'Habitada', 'Otra situación'] },
        { id: 'titularidad', tipo: 'unica', titulo: '¿Sos el dueño?', opciones: TITULAR,
          notas: { 'Es una sucesión': 'Gracias por aclararlo. Con una sucesión conviene arrancar con los papeles antes de publicar.' } },
        { id: 'plazo', tipo: 'unica', opcional: true, titulo: '¿Para cuándo te gustaría venderla?', opciones: ['Lo antes posible', 'Dentro de 1 a 3 meses', 'Dentro de 3 a 6 meses', 'Durante los próximos 6 a 12 meses', 'No tengo urgencia', 'Todavía estoy evaluando'],
          notas: { 'Lo antes posible': 'Perfecto. Si hay apuro, lo primero es definir bien el precio.', 'Dentro de 1 a 3 meses': 'Buen plazo: alcanza para preparar bien la salida.' } },
        { id: 'motivo', tipo: 'unica', opcional: true, titulo: '¿Por qué estás pensando en vender?', opciones: ['Me mudo a otra propiedad', 'Necesito el dinero', 'Separación', 'Es una inversión', 'Otro motivo'] },
        { id: 'valor_en_mente', tipo: 'unica', opcional: true, titulo: '¿Tenés un valor de venta en mente?', opciones: ['Sí', 'Tengo una idea aproximada', 'No', 'Quiero que me ayudes a definirlo'],
          notas: { 'Quiero que me ayudes a definirlo': 'Lo armamos juntos, con propiedades comparables de la zona.' } },
        { id: 'valor_estimado', tipo: 'deslizador', escala: 'usd', titulo: '¿Cuánto, más o menos?', ayuda: 'Mové la barra hasta tu número.',
          si: function (r) { return r.valor_en_mente === 'Sí' || r.valor_en_mente === 'Tengo una idea aproximada'; },
          extra: { id: 'como_llego_valor', titulo: '¿De dónde sale ese número?', opciones: ['Comparé propiedades similares', 'Me lo indicó otra inmobiliaria', 'Es el monto que necesito', 'Otro'] } },
        { id: 'publicada_actualmente', tipo: 'unica', titulo: '¿Está publicada a la venta?', opciones: ['Sí', 'No', 'Estuvo publicada anteriormente'],
          notas: { 'Estuvo publicada anteriormente': 'Bien saberlo. Vamos a revisar qué pasó para no repetirlo.' } },
        { id: 'documentacion', tipo: 'multiple', titulo: '¿Qué papeles tenés a mano?', ayuda: 'Podés marcar varios.', opciones: ['Escritura', 'Plano', 'Reglamento de copropiedad', 'Últimas expensas', 'ABL / ARBA', 'No estoy seguro/a', 'Prefiero revisarlo con vos'] },
        { id: 'compra_despues', tipo: 'unica', titulo: 'Después de vender, ¿vas a comprar otra?', opciones: ['Sí', 'Tal vez', 'No'],
          notas: { 'Sí': 'Bien. Podemos coordinar las dos operaciones para que no quedes en el medio.' } },
        { id: 'como_continuar', tipo: 'unica', titulo: '¿Cómo te gustaría seguir?', opciones: ['Quiero coordinar una reunión', 'Quiero coordinar una visita a la propiedad', 'Quiero conocer primero cómo trabajás', 'Quiero recibir orientación sobre el valor de mi propiedad', 'Por ahora solamente estoy averiguando'] },
        ROMPEHIELOS,
        { id: 'contacto', tipo: 'contacto', marco: 'Listo. Con esto ya puedo preparar nuestra primera charla.' }
      ],
      datos: function (r, ve) {
        var conValor = ve('valor_estimado');
        return { tipo_propiedad: r.tipo_propiedad || '', localidad: zonaSel(r, 'localidad').join(', '), direccion: zonaCalle(r, 'localidad'),
          ambientes: ambientesDe(r), superficie: superficieDe(r), estado_general: r.estado_general || '', situacion_actual: r.situacion_actual || '',
          titularidad: r.titularidad || '', plazo: r.plazo || '', motivo: r.motivo || '', valor_en_mente: r.valor_en_mente || '',
          valor_estimado: conValor ? deslizadorTexto(r, 'valor_estimado', 'usd') : '', como_llego_valor: conValor ? (r.como_llego_valor || '') : '',
          publicada_actualmente: r.publicada_actualmente || '', documentacion: lista(r, 'documentacion'), compra_despues: r.compra_despues || '',
          como_continuar: r.como_continuar || '' };
      }
    },

    tasacion: {
      corto: 'Cuánto vale', intro: 'Cuantos más datos me des, más cerca voy a estar del valor real de tu propiedad.',
      pantallas: [
        { id: 'tipo_propiedad', tipo: 'unica', titulo: '¿Qué tipo de propiedad es?', opciones: TIPOS },
        { id: 'ubicacion', tipo: 'zona', calle: true, titulo: '¿Dónde está?', ayuda: 'Tocá el barrio o buscalo. La calle es opcional.' },
        { id: 'tamano', tipo: 'tamano', titulo: '¿Qué tamaño tiene?' },
        { id: 'destacados', tipo: 'multiple', chips: true, opcional: true, titulo: '¿Tiene alguno de estos?', ayuda: 'Suman valor. Marcá los que tenga.', opciones: destacadosPara('valor') },
        { id: 'motivo_tasacion', tipo: 'unica', titulo: '¿Para qué querés saber el valor?', opciones: ['Para vender', 'Para alquilar', 'Por una sucesión o división', 'Para tener una referencia', 'Otro motivo'],
          notas: { 'Para vender': 'Bien. Con el valor claro, después es más fácil decidir cuándo salir.' } },
        { id: 'plazo_venta', tipo: 'unica', titulo: '¿Cuándo pensás vender?', opciones: ['En los próximos 3 meses', 'Entre 3 y 12 meses', 'Más adelante', 'No pienso vender'] },
        { id: 'titularidad', tipo: 'unica', titulo: '¿Sos el dueño?', opciones: TITULAR },
        { id: 'ya_tasada', tipo: 'unica', titulo: '¿Ya te dieron un valor de tu propiedad?', opciones: ['No', 'Sí, de una inmobiliaria/agente', 'Sí, más de una', 'Hice mi propia estimación comparando publicaciones'],
          notas: { 'Sí, más de una': 'Si te dieron números distintos, te ayudo a entender por qué.' } },
        ROMPEHIELOS,
        { id: 'contacto', tipo: 'contacto', marco: 'Listo. Con esto ya puedo analizar tu propiedad.' }
      ],
      datos: function (r) {
        return { tipo_propiedad: r.tipo_propiedad || '', ubicacion: ubicacionTexto(r, 'ubicacion'), ambientes: ambientesDe(r), superficie: superficieDe(r),
          destacados: lista(r, 'destacados'), descripcion_breve: descripcionArmada(r), motivo_tasacion: r.motivo_tasacion || '',
          plazo_venta: r.plazo_venta || '', titularidad: r.titularidad || '', ya_tasada: r.ya_tasada || '' };
      }
    },

    alquilar_propiedad: {
      corto: 'Alquilar mi propiedad', intro: 'Cuanto más me cuentes, mejor te puedo orientar sobre cuánto pedir y cómo mostrarla.',
      pantallas: [
        { id: 'tipo_propiedad', tipo: 'unica', titulo: '¿Qué tipo de propiedad querés alquilar?', opciones: TIPOS },
        { id: 'ubicacion', tipo: 'zona', calle: true, titulo: '¿Dónde está?', ayuda: 'Tocá el barrio o buscalo. La calle es opcional.' },
        { id: 'tamano', tipo: 'tamano', titulo: '¿Qué tamaño tiene?' },
        { id: 'destacados', tipo: 'multiple', chips: true, opcional: true, titulo: '¿Tiene alguno de estos?', ayuda: 'Marcá los que tenga.', opciones: destacadosPara('alquilar') },
        { id: 'situacion_actual', tipo: 'unica', titulo: '¿Cuál es la situación actual?', opciones: ['Vacía y disponible', 'Habitada', 'Próximamente va a quedar disponible', 'Otra situación'],
          notas: { 'Vacía y disponible': 'Ideal: así se puede mostrar sin coordinar con nadie.' } },
        { id: 'disponibilidad', tipo: 'unica', opcional: true, titulo: '¿Cuándo estaría disponible para alquilar?', opciones: ['Ahora', 'Dentro de los próximos 30 días', 'Dentro de los 3 meses', 'Todavía estoy evaluando'] },
        { id: 'valor_alquiler', tipo: 'deslizador', escala: 'ars', titulo: '¿Cuánto esperás cobrar por mes?', ayuda: 'Sin expensas. Es solo una referencia.', alt: 'Quiero que me ayudes a definirlo', notaAlt: 'Lo definimos con alquileres parecidos de la zona.' },
        { id: 'que_es_importante', tipo: 'multiple', titulo: '¿Qué es lo más importante para vos?', ayuda: 'Podés marcar varias.', opciones: ['Encontrar buen inquilino', 'Alquilarla lo antes posible', 'Conseguir un buen valor', 'Tener asesoramiento con documentación y contrato', 'Alguien que gestione todo el proceso', 'Otro'] },
        { id: 'como_continuar', tipo: 'unica', titulo: '¿Cómo te gustaría seguir?', opciones: ['Quiero coordinar una reunión', 'Quiero que vengas a ver la propiedad', 'Quiero saber cuánto podría cobrar', 'Por ahora solamente estoy averiguando'] },
        ROMPEHIELOS,
        { id: 'contacto', tipo: 'contacto', marco: 'Listo. Con esto ya puedo pensar cómo alquilarla.' }
      ],
      datos: function (r) {
        return { tipo_propiedad: r.tipo_propiedad || '', ubicacion: ubicacionTexto(r, 'ubicacion'), ambientes: ambientesDe(r), superficie: superficieDe(r),
          destacados: lista(r, 'destacados'), descripcion_breve: descripcionArmada(r), situacion_actual: r.situacion_actual || '',
          disponibilidad: r.disponibilidad || '', valor_alquiler: deslizadorTexto(r, 'valor_alquiler', 'ars', 'Quiero que me ayudes a definirlo'),
          que_es_importante: lista(r, 'que_es_importante'), como_continuar: r.como_continuar || '' };
      }
    },

    comprar: {
      corto: 'Comprar', intro: 'Cuanto más me cuentes de lo que buscás, menos tiempo vas a perder viendo propiedades que no van.',
      pantallas: [
        { id: 'tipo_propiedad', tipo: 'multiple', titulo: '¿Qué tipo de propiedad buscás?', ayuda: 'Podés marcar varias.', opciones: [TIPOS[0], TIPOS[1], TIPOS[2], TIPOS[3], { v: 'Flipping', i: 'flip', d: 'Para reciclar y vender' }, TIPOS[4]] },
        { id: 'destino_compra', tipo: 'unica',
          titulo: function (r) { return soloLocal(r) ? '¿Es para tu negocio o para invertir?' : '¿Es para vivir o para invertir?'; },
          opciones: function (r) { return soloLocal(r) ? [{ v: 'Para mi negocio', i: 'local' }, { v: 'Para invertir', i: 'invertir' }] : [{ v: 'Para vivir', i: 'vivir' }, { v: 'Para invertir', i: 'invertir' }]; },
          notas: { 'Para invertir': 'Mirá también los desarrollos en pozo: se pagan en cuotas en dólares.' } },
        { id: 'zona', tipo: 'zona', multiple: true, titulo: '¿En qué zonas buscás?', ayuda: 'Podés marcar varias o buscar otra.' },
        { id: 'ambientes', tipo: 'multiple', chips: true, opcional: true, titulo: '¿Cuántos ambientes necesitás?', ayuda: 'Podés marcar varios.', opciones: AMBIENTES,
          si: function (r) { return !soloLocal(r); } },
        { id: 'presupuesto', tipo: 'deslizador', escala: 'usd', titulo: '¿Cuál es tu presupuesto?', ayuda: 'Mové la barra hasta tu tope.', alt: 'Prefiero hablarlo' },
        { id: 'forma_compra', tipo: 'unica', titulo: '¿Cómo pensás pagarla?', opciones: ['Fondos propios', 'Necesito vender otra propiedad primero', 'Con crédito hipotecario', 'Combinación de las anteriores', 'Todavía lo estoy definiendo'],
          notas: { 'Necesito vender otra propiedad primero': 'Te puedo ayudar con las dos: vender la tuya y encontrar la próxima.' } },
        { id: 'credito_preaprobado', tipo: 'unica', titulo: '¿Tenés el crédito preaprobado?', opciones: ['Sí, ya está preaprobado', 'Lo estoy gestionando', 'Todavía no lo empecé'],
          si: function (r) { return r.forma_compra === 'Con crédito hipotecario' || r.forma_compra === 'Combinación de las anteriores'; },
          notas: { 'Todavía no lo empecé': 'Conviene arrancarlo pronto: saber cuánto te prestan ordena toda la búsqueda.' } },
        { id: 'plazo_compra', tipo: 'unica', titulo: '¿Para cuándo te gustaría comprar?', opciones: ['Lo antes posible', 'Dentro de 3 meses', 'Dentro de 6 meses', 'Dentro de 12 meses', 'Solo estoy mirando'] },
        { id: 'visitando', tipo: 'unica', titulo: '¿Ya estuviste visitando propiedades?', opciones: ['Sí, ya visité varias', 'Visité alguna', 'Todavía no, recién empiezo'] },
        { id: 'caracteristicas_indispensables', tipo: 'multiple', chips: true, opcional: true, titulo: '¿Qué no puede faltar?',
          opciones: function (r) {
            if (soloLocal(r)) return LOCAL_DEST;
            var o = ['Balcón', 'Cochera', 'Patio o terraza', 'Amenities', 'Apto crédito', 'Luminoso', 'A estrenar'];
            if (tipos(r).indexOf('Casa') > -1) o = o.concat(['Jardín', 'Pileta']);
            if (conLocal(r)) o = o.concat(['Vidriera a la calle']);
            return o;
          },
          texto: { id: 'algo_mas', placeholder: '¿Algo más que debería saber? (opcional)' } },
        ROMPEHIELOS,
        { id: 'contacto', tipo: 'contacto', marco: 'Listo. Con esto ya puedo empezar a buscar.' }
      ],
      datos: function (r, ve) {
        return { tipo_propiedad: lista(r, 'tipo_propiedad').join(', '), destino_compra: r.destino_compra || '', zona: zonaSel(r, 'zona').join(', '),
          ambientes: ve('ambientes') ? lista(r, 'ambientes').join(', ') : '', presupuesto: deslizadorTexto(r, 'presupuesto', 'usd', 'Prefiero hablarlo'),
          forma_compra: r.forma_compra || '', credito_preaprobado: ve('credito_preaprobado') ? (r.credito_preaprobado || '') : '',
          plazo_compra: r.plazo_compra || '', visitando: r.visitando || '', caracteristicas_indispensables: lista(r, 'caracteristicas_indispensables').join(', '),
          algo_mas: (r.algo_mas || '').trim() };
      }
    },

    buscar_alquiler: {
      corto: 'Buscar alquiler', intro: 'Cuanto más me cuentes, menos tiempo vas a perder visitando lo que no te sirve.',
      pantallas: [
        { id: 'modalidad', tipo: 'unica', titulo: '¿Qué tipo de alquiler buscás?', opciones: [{ v: 'Tradicional', i: 'llave', d: 'Contrato por años' }, { v: 'Temporario', i: 'valija', d: 'Por días o meses' }] },
        { id: 'tipo_propiedad', tipo: 'multiple', titulo: '¿Qué tipo de propiedad?', ayuda: 'Podés marcar varias.', opciones: TIPOS },
        { id: 'zona', tipo: 'zona', multiple: true, titulo: '¿En qué zonas buscás?', ayuda: 'Podés marcar varias o buscar otra.' },
        { id: 'que_necesita', tipo: 'multiple', chips: true, titulo: '¿Qué necesitás sí o sí?', ayuda: 'Marcá todo lo que no puede faltar.',
          opciones: function (r) {
            if (soloLocal(r)) return ['Vidriera a la calle', 'En esquina', 'Baño', 'Depósito o sótano', 'Apto gastronomía', 'Nada en especial'];
            var o = ['1 ambiente', '2 ambientes', '3 ambientes o más', 'Balcón', 'Cochera', 'Amoblado', 'Patio o terraza', 'Lavadero'];
            if (conLocal(r)) o.push('Vidriera a la calle');
            o.push('Nada en especial');
            return o;
          },
          texto: { id: 'que_necesita_otro', placeholder: 'Otra cosa (opcional)' } },
        { id: 'presupuesto_mensual', tipo: 'deslizador', escala: 'ars', titulo: '¿Hasta cuánto podés pagar por mes?', ayuda: 'Alquiler, sin expensas.', alt: 'Prefiero hablarlo' },
        { id: 'para_cuando', tipo: 'unica', titulo: '¿Para cuándo necesitás mudarte?', opciones: ['Ya, este mes', 'En 1 a 2 meses', 'En 3 meses o más', 'Todavía no tengo fecha'] },
        { id: 'como_respalda', tipo: 'multiple', titulo: '¿Cómo respaldarías el alquiler?', ayuda: 'Podés marcar varias.', opciones: ['Garantía propietaria', 'Seguro de caución', 'Recibos de sueldo / ingresos demostrables', 'Monotributo / Autónomo', 'Otro', 'Todavía necesito asesoramiento sobre esto'],
          notas: { 'Todavía necesito asesoramiento sobre esto': 'Tranqui, te explico qué opciones hay y cuál te conviene.' } },
        { id: 'mascotas', tipo: 'unica', titulo: '¿Tenés mascotas?', opciones: ['No', 'Sí, perro', 'Sí, gato', 'Sí, otra'],
          si: function (r) { return !soloLocal(r); } },
        ROMPEHIELOS,
        { id: 'contacto', tipo: 'contacto', marco: 'Listo. Con esto ya puedo empezar a buscar.' }
      ],
      datos: function (r) {
        var chips = lista(r, 'que_necesita').join(', '), otra = (r.que_necesita_otro || '').trim();
        return { modalidad: r.modalidad || '', tipo_propiedad: lista(r, 'tipo_propiedad'), zona: zonaSel(r, 'zona').join(', '),
          que_necesita: chips + (chips && otra ? ' · Otra cosa: ' : '') + otra,
          presupuesto_mensual: deslizadorTexto(r, 'presupuesto_mensual', 'ars', 'Prefiero hablarlo'), para_cuando: r.para_cuando || '',
          como_respalda: lista(r, 'como_respalda'),
          mascotas: soloLocal(r) ? 'No aplica (local)' : (r.mascotas || '') };   // el servidor exige el campo
      }
    }
  };

  var LEAD = raiz.getAttribute('data-form');
  var FORM = FORMS[LEAD];
  if (!FORM) return;
  var CLAVE_GUARDADO = 'csre_form_' + LEAD;

  /* ---------- estado ---------- */
  var st = { r: {}, actual: FORM.pantallas[0].id, notas: {}, vistas: {}, enviado: false, enviando: false,
    contacto: { nombre: '', pais: '+54 9', tel: '', email: '' } };
  // frases de Cris: una por pantalla (id de la pantalla → texto). Quedan guardadas: al volver atrás se ven igual, pero
  // ya sin escribirse (sólo se escriben la primera vez: vistas guarda el texto ya mostrado de cada pantalla)
  st.notas[FORM.pantallas[0].id] = FORM.intro;
  var nivel = 0; // cuántos pasos agregó este formulario al historial (para el "atrás")

  function visibles() { return FORM.pantallas.filter(function (p) { return !p.si || p.si(st.r); }); }
  function esVisible(id) { return visibles().some(function (p) { return p.id === id; }); }
  function actual() {
    var v = visibles();
    for (var i = 0; i < v.length; i++) if (v[i].id === st.actual) return v[i];
    // si la pantalla quedó oculta (cambió una respuesta anterior), la visible más cercana hacia atrás
    var todas = FORM.pantallas, k = todas.map(function (p) { return p.id; }).indexOf(st.actual);
    for (var j = k; j >= 0; j--) if (v.indexOf(todas[j]) > -1) return todas[j];
    return v[0];
  }
  function posicion() { var v = visibles(); return { i: v.indexOf(actual()), n: v.length }; }

  function guardar() {
    if (st.enviado) return;
    try { localStorage.setItem(CLAVE_GUARDADO, JSON.stringify({ t: Date.now(), r: st.r, actual: st.actual, contacto: st.contacto })); } catch (e) {}
  }
  function borrarGuardado() { try { localStorage.removeItem(CLAVE_GUARDADO); } catch (e) {} }
  function recuperar() {
    try {
      var g = JSON.parse(localStorage.getItem(CLAVE_GUARDADO) || 'null');
      if (!g || !g.t || Date.now() - g.t > VIGENCIA_GUARDADO) { borrarGuardado(); return; }
      st.r = g.r || {};
      st.actual = g.actual || st.actual;
      if (g.contacto) st.contacto = { nombre: g.contacto.nombre || '', pais: g.contacto.pais || '+54 9', tel: g.contacto.tel || '', email: g.contacto.email || '' };
      if (st.actual !== FORM.pantallas[0].id) st.notas = {};
    } catch (e) {}
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function vibrar() { try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) {} }

  /* ---------- texto de una respuesta (para el resumen de la pantalla final) ---------- */
  function mostrarDeslizador(p, val) {
    if (!val) return '';
    if (val.alt) return p.alt;
    return ESCALAS[p.escala].fmt(ESCALAS[p.escala].valores[val.idx]) + (p.escala === 'diez' ? ' de 10' : '');
  }
  function opcionesDe(p) { return typeof p.opciones === 'function' ? p.opciones(st.r) : p.opciones; }
  function tituloDe(p) { return typeof p.titulo === 'function' ? p.titulo(st.r) : p.titulo; }
  function valorDe(o) { return typeof o === 'string' ? o : o.v; }
  function mostrar(p) {
    var v = st.r[p.id];
    if (p.tipo === 'zona') return v && v.sel && v.sel.length ? v.sel.join(', ') : '';
    if (p.tipo === 'tamano') {
      if (!v) return '';
      var m2 = v.nose ? '' : ESCALAS.m2.fmt(ESCALAS.m2.valores[v.m2]);
      if (soloLocal(st.r)) return m2;
      return [ambientesTexto(v.amb), m2].filter(Boolean).join(' · ');
    }
    if (p.tipo === 'deslizador') return mostrarDeslizador(p, v);
    if (Array.isArray(v)) return v.join(', ');
    return v || '';
  }

  /* ---------- armado de la pantalla ---------- */
  raiz.innerHTML =
    '<div class="fx-progreso" aria-hidden="true"><div class="fx-progreso__barra" id="fx-barra"></div></div>' +
    '<p class="fx-progreso__texto" id="fx-progreso-texto"></p>' +
    '<div class="fx-tarjeta"><div class="fx-pantalla" id="fx-pantalla"></div></div>';
  var $pantalla = document.getElementById('fx-pantalla');
  var $barra = document.getElementById('fx-barra');
  var $progresoTexto = document.getElementById('fx-progreso-texto');

  function opcionHtml(o, multi, elegido) {
    var v = valorDe(o);
    return '<button type="button" class="fx-opcion' + (multi ? ' fx-opcion--multi' : '') + '" data-accion="' + (multi ? 'multi' : 'unica') + '" data-v="' + esc(v) + '" aria-pressed="' + (elegido ? 'true' : 'false') + '">' +
      (o.i ? '<span class="fx-opcion__icono">' + icono(o.i) + '</span>' : '') +
      '<span class="fx-opcion__texto">' + esc(v) + (o.d ? '<small>' + esc(o.d) + '</small>' : '') + '</span>' +
      '<span class="fx-opcion__marca" aria-hidden="true">' + CHECK + '</span></button>';
  }
  function chipHtml(v, accion, elegido, extraClase) {
    return '<button type="button" class="fx-chip' + (extraClase ? ' ' + extraClase : '') + '" data-accion="' + accion + '" data-v="' + esc(v) + '" aria-pressed="' + (elegido ? 'true' : 'false') + '">' + esc(v) + '</button>';
  }
  function deslizadorHtml(escId, idx, deshabilitado, etiqueta, extremos) {
    var e = ESCALAS[escId], max = e.valores.length - 1;
    var ext = extremos ? [e.corto[0] + ' · ' + extremos[0], e.corto[1] + ' · ' + extremos[1]] : e.corto;
    return '<output class="fx-cifra" id="fx-cifra" aria-live="polite">' + esc(e.fmt(e.valores[idx])) + '</output>' +
      '<input class="fx-rango" type="range" id="fx-rango" min="0" max="' + max + '" step="1" value="' + idx + '" aria-label="' + esc(etiqueta) + '" aria-valuetext="' + esc(e.fmt(e.valores[idx])) + '" style="--pct:' + (idx / max * 100) + '%"' + (deshabilitado ? ' disabled' : '') + '>' +
      '<div class="fx-extremos" aria-hidden="true"><span>' + esc(ext[0]) + '</span><span>' + esc(ext[1]) + '</span></div>';
  }

  function ayudaTel(pais) {
    if (pais === '+54 9') return { ayuda: 'Código de área y número, sin 0 ni 15. Ej.: 11 6695 1945 o 351 555 1234', ph: '11 6695 1945', prefijo: '+54 9' };
    if (pais === 'otro') return { ayuda: 'Escribí el número completo, con el código de tu país.', ph: '+34 600 123 456', prefijo: '+' };
    return { ayuda: 'Tu número, sin el código de país.', ph: 'Número', prefijo: pais };
  }
  /* Argentina: se aceptan también 0, 15 o +54 9 escritos de más; tienen que quedar 10 dígitos (área + número). */
  function digitosArgentina(d) {
    if (d.length === 13 && d.indexOf('549') === 0) d = d.slice(3);
    else if (d.length === 12 && d.indexOf('54') === 0) d = d.slice(2);
    d = d.replace(/^0/, '');
    if (d.length === 12) for (var i = 2; i <= 4; i++) if (d.substr(i, 2) === '15') { var s = d.slice(0, i) + d.slice(i + 2); if (s.length === 10) return s; }
    return d;
  }
  /* El servidor recibe el WhatsApp en formato internacional, ej. +5491123456789 */
  function telefonoInternacional() {
    var k = st.contacto, d = k.tel.replace(/\D/g, '');
    if (!d) return '';
    if (k.pais === 'otro') return '+' + d;
    if (k.pais === '+54 9') return '+549' + digitosArgentina(d);
    return k.pais.replace(/\s/g, '') + d.replace(/^0+/, '');
  }
  function telefonoValido() {
    var k = st.contacto, d = k.tel.replace(/\D/g, '');
    if (k.pais === '+54 9') return digitosArgentina(d).length === 10;
    if (k.pais === 'otro') return d.length >= 8 && d.length <= 15;
    return d.length >= 6 && d.length <= 13;
  }

  function htmlContacto(p) {
    var at = ayudaTel(st.contacto.pais), k = st.contacto;
    return '<p class="fx-marco">' + esc(p.marco) + '</p><h2 class="fx-pregunta" tabindex="-1">¿A dónde te escribo?</h2>' +
      '<label class="fx-etiqueta" for="fx-nombre">Nombre</label><input class="fx-campo" id="fx-nombre" data-contacto="nombre" autocomplete="name" placeholder="Nombre y apellido" value="' + esc(k.nombre) + '">' +
      '<label class="fx-etiqueta" for="fx-tel">WhatsApp</label><div class="fx-tel">' +
        '<span class="fx-tel__pais"><span id="fx-prefijo">' + esc(at.prefijo) + '</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10l5 5 5-5"/></svg>' +
        '<select id="fx-pais" data-contacto="pais" aria-label="País del WhatsApp">' + PAISES.map(function (x) { return '<option value="' + esc(x[0]) + '"' + (x[0] === k.pais ? ' selected' : '') + '>' + esc(x[1]) + (x[0] === 'otro' ? '' : ' (' + x[0] + ')') + '</option>'; }).join('') + '</select></span>' +
        '<input class="fx-campo" id="fx-tel" data-contacto="tel" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="' + esc(at.ph) + '" value="' + esc(k.tel) + '" aria-describedby="fx-tel-ayuda"></div>' +
      '<p class="fx-ayuda-campo" id="fx-tel-ayuda">' + esc(at.ayuda) + '</p>' +
      '<label class="fx-etiqueta" for="fx-email">Email</label><input class="fx-campo" id="fx-email" data-contacto="email" type="email" autocomplete="email" placeholder="tu@email.com" value="' + esc(k.email) + '">' +
      '<p class="fx-error" id="fx-error" role="alert"></p>' +
      '<p class="fx-privacidad">Al enviar este formulario aceptás que usemos estos datos para responder tu consulta. Ver <a href="#privacy-policy">Política de Privacidad</a>.</p>' +
      '<div class="fx-pie"><button type="button" class="fx-enlace fx-enlace--atras" data-accion="atras">← Atrás</button><span class="fx-pie__der"><button type="button" class="fx-boton" data-accion="enviar" id="fx-enviar">Enviar</button></span></div>';
  }

  function htmlPantalla(p, pos) {
    if (p.tipo === 'contacto') return htmlContacto(p);
    var r = st.r, h = '';
    var titulo = tituloDe(p), ops = p.opciones ? opcionesDe(p) : [];
    if (p.tipo === 'tamano' && soloLocal(r)) titulo = '¿Qué superficie tiene?';
    h += '<h2 class="fx-pregunta" tabindex="-1">' + esc(titulo) + '</h2>';
    var ayuda = p.ayuda || (p.opcional ? 'Es opcional, pero me ayuda a asesorarte mejor.' : '');
    if (ayuda) h += '<p class="fx-ayuda">' + esc(ayuda) + '</p>';
    var der = '';

    if (p.tipo === 'unica') {
      h += '<div class="fx-opciones' + (p.dos ? ' fx-opciones--dos' : '') + '" role="group" aria-label="' + esc(titulo) + '">' +
        ops.map(function (o) { return opcionHtml(o, false, r[p.id] === valorDe(o)); }).join('') + '</div>';
      // "Continuar" siempre en bronce y "Saltar" siempre como texto (MANUAL-DE-DISENO.md, sección 9; 12-oct-2026)
      der = (p.opcional ? '<button type="button" class="fx-enlace" data-accion="saltar">Saltar</button>' : '') +
        (r[p.id] ? '<button type="button" class="fx-boton" data-accion="continuar">Continuar</button>' : '');
    }

    if (p.tipo === 'multiple') {
      // si cambió el tipo de propiedad, se descartan las marcas que ya no corresponden (ej. "Balcón" en un local)
      var validos = ops.map(valorDe);
      var sel = (r[p.id] || []).filter(function (x) { return validos.indexOf(x) > -1; });
      if (r[p.id]) r[p.id] = sel;
      if (p.chips) h += '<div class="fx-chips" role="group" aria-label="' + esc(titulo) + '">' + ops.map(function (o) { return chipHtml(o, 'multi', sel.indexOf(o) > -1); }).join('') + '</div>';
      else h += '<div class="fx-opciones" role="group" aria-label="' + esc(titulo) + '">' + ops.map(function (o) { return opcionHtml(o, true, sel.indexOf(valorDe(o)) > -1); }).join('') + '</div>';
      if (p.texto) h += '<input class="fx-campo" id="fx-t-' + p.texto.id + '" data-texto="' + p.texto.id + '" placeholder="' + esc(p.texto.placeholder) + '" aria-label="' + esc(p.texto.placeholder) + '" value="' + esc(r[p.texto.id] || '') + '">';
      // opcional: "Saltar" como texto + "Continuar" (se habilita al marcar algo o escribir); antes el mismo botón bronce decía "Saltar"
      der = (p.opcional ? '<button type="button" class="fx-enlace" data-accion="saltar">Saltar</button>' : '') +
        '<button type="button" class="fx-boton" data-accion="continuar" id="fx-continuar"' + (listo(p) ? '' : ' disabled') + '>Continuar</button>';
    }

    if (p.tipo === 'zona') {
      var z = r[p.id] || { sel: [], calle: '' };
      var extras = z.sel.filter(function (x) { return ZONAS_CABA.indexOf(x) < 0 && ZONAS_NORTE.indexOf(x) < 0; });
      var grupo = function (nombre, lst) { return '<p class="fx-sub">' + nombre + '</p><div class="fx-chips" role="group" aria-label="' + nombre + '">' + lst.map(function (x) { return chipHtml(x, 'zona', z.sel.indexOf(x) > -1); }).join('') + '</div>'; };
      h += grupo('CABA', ZONAS_CABA) + grupo('Zona Norte', ZONAS_NORTE);
      // lo elegido que no está entre los botones (ej. Palermo) queda como etiqueta DENTRO del recuadro de búsqueda, con su × para sacarla
      var etiquetas = extras.map(function (x) { return '<span class="fx-etq">' + esc(x) + '<button type="button" class="fx-etq__x" data-accion="zonaquitar" data-v="' + esc(x) + '" aria-label="Quitar ' + esc(x) + '">×</button></span>'; }).join('');
      h += '<div class="fx-buscar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>' + etiquetas +
        '<input class="fx-buscar__campo" id="fx-buscar" role="combobox" aria-expanded="false" aria-controls="fx-sug" aria-autocomplete="list" autocomplete="off" autocapitalize="words" enterkeyhint="done" placeholder="' + (extras.length ? 'Agregar otro' : 'Buscá otro barrio o localidad') + '" aria-label="Buscá otro barrio o localidad">' +
        '<ul class="fx-sug" id="fx-sug" role="listbox" aria-label="Barrios y localidades" hidden></ul></div>';
      if (p.calle) h += '<input class="fx-campo" id="fx-calle" data-zona="calle" autocomplete="street-address" placeholder="Calle y altura aproximada" aria-label="Calle y altura aproximada (opcional)" value="' + esc(z.calle || '') + '">';
      der = '<button type="button" class="fx-boton" data-accion="continuar" id="fx-continuar"' + (listo(p) ? '' : ' disabled') + '>Continuar</button>';
    }

    if (p.tipo === 'tamano') {
      var t = r.tamano || { amb: '', m2: idxInicial('m2'), nose: false };
      if (!soloLocal(r)) h += '<p class="fx-sub">Ambientes</p><div class="fx-chips" role="group" aria-label="Ambientes">' + AMBIENTES.map(function (x) { return chipHtml(x, 'amb', t.amb === x); }).join('') + '</div>';
      h += '<p class="fx-sub">Superficie aproximada</p>' + deslizadorHtml('m2', t.m2, t.nose, 'Superficie aproximada') +
        '<div class="fx-chips">' + chipHtml('No sé los metros', 'nose', t.nose, 'fx-chip--suave') + '</div>';
      der = '<button type="button" class="fx-boton" data-accion="continuar" id="fx-continuar"' + (listo(p) ? '' : ' disabled') + '>Continuar</button>';
    }

    if (p.tipo === 'deslizador') {
      var d = r[p.id];
      var idx = d && !d.alt ? d.idx : idxInicial(p.escala);
      h += deslizadorHtml(p.escala, idx, false, titulo, p.extremos);
      if (p.extra) h += '<p class="fx-sub">' + esc(p.extra.titulo) + '</p><div class="fx-chips" role="group" aria-label="' + esc(p.extra.titulo) + '">' + p.extra.opciones.map(function (x) { return chipHtml(x, 'extra', r[p.extra.id] === x); }).join('') + '</div>';
      der = (p.opcional ? '<button type="button" class="fx-enlace" data-accion="saltar">Saltar</button>' : '') +
        (p.alt ? '<button type="button" class="fx-boton fx-boton--suave" data-accion="alt">' + esc(p.alt) + '</button>' : '') +
        '<button type="button" class="fx-boton" data-accion="continuar">Continuar</button>';
    }

    h += '<div class="fx-pie">' + (pos.i > 0 ? '<button type="button" class="fx-enlace fx-enlace--atras" data-accion="atras">← Atrás</button>' : '<span></span>') + '<span class="fx-pie__der">' + der + '</span></div>';
    return h;
  }

  function listo(p) {
    var r = st.r;
    if (p.tipo === 'multiple') {
      // también en las opcionales: sin nada marcado ni escrito, "Continuar" queda apagado (para eso está "Saltar")
      return (r[p.id] || []).length > 0 || !!(p.texto && (r[p.texto.id] || '').trim().length > 0);
    }
    if (p.tipo === 'zona') { var z = r[p.id]; return !!z && z.sel.length > 0; }
    if (p.tipo === 'tamano') return soloLocal(r) || !!(r.tamano && r.tamano.amb);
    return true;
  }
  function refrescarContinuar(p) {
    var b = document.getElementById('fx-continuar');
    if (!b) return;
    b.disabled = !listo(p);
  }

  function htmlExito() {
    var nombre = st.contacto.nombre.trim().split(/\s+/)[0] || '';
    var resumen = visibles().slice(0, 3).map(mostrar).filter(Boolean).slice(0, 3);
    var msj = 'Hola Cris, soy ' + (nombre || '') + '. Recién completé el formulario de ' + FORM.corto.toLowerCase() + '.';
    return '<div class="fx-exito">' +
      '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29"/><path d="M20 33l8 8 16-17"/></svg>' +
      '<h2 class="fx-pregunta" tabindex="-1">¡Gracias' + (nombre ? ', ' + esc(nombre) : '') + '!</h2>' +
      '<p>Ya tengo todo. Te escribo por WhatsApp lo antes posible.</p>' +
      (resumen.length ? '<div class="fx-resumen">' + resumen.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' : '') +
      '<a class="fx-boton fx-boton--ancho" data-evento="whatsapp-gracias" href="https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msj) + '" target="_blank" rel="noopener">Escribirme ahora por WhatsApp</a>' +
      '</div>';
  }

  /* la frase de Cris aparece de corrido (letra a letra, ~2 s como mucho); lo que falta escribir ya ocupa su lugar */
  var timerNota = null, timerAvance = null, bloqueoHasta = 0;
  function escribirNota(texto) {
    var hecho = $pantalla.querySelector('.fx-nota__hecho'), resto = $pantalla.querySelector('.fx-nota__resto');
    if (!hecho || !resto) return;
    var n = 0, demora = Math.max(14, Math.min(30, Math.round(1800 / texto.length)));
    (function paso() {
      n++;
      hecho.textContent = texto.slice(0, n); resto.textContent = texto.slice(n);
      if (n < texto.length) timerNota = setTimeout(paso, demora);
    })();
  }

  function render(animar) {
    var p = actual(), pos = posicion();
    var pct, texto = '';
    if (st.enviado) { pct = 100; }
    else {
      pct = 8 + 92 * pos.i / pos.n;
      if (pos.i === 0) texto = 'Son preguntas de tocar. Lleva alrededor de un minuto.';
      else if (p.tipo === 'contacto') texto = 'Último paso';
      else if (pos.i / pos.n >= 0.6) texto = 'Ya casi está';
    }
    $barra.style.width = pct + '%';
    $progresoTexto.textContent = texto;

    var h = '', escribirla = false;
    clearTimeout(timerNota); clearTimeout(timerAvance); timerAvance = null;
    bloqueoHasta = Date.now() + 300;
    if (st.enviado) h = htmlExito();
    else {
      var nt = st.notas[p.id];
      if (nt) {
        escribirla = !MENOS_MOVIMIENTO && st.vistas[p.id] !== nt;
        st.vistas[p.id] = nt;
        h += '<div class="fx-nota"><img src="' + AVATAR + '" alt="" width="30" height="30"><p><b>Cris</b>' +
          '<span class="fx-nota__hecho">' + (escribirla ? '' : esc(nt)) + '</span><span class="fx-nota__resto">' + (escribirla ? esc(nt) : '') + '</span></p></div>';
      }
      h += htmlPantalla(p, pos);
    }
    $pantalla.innerHTML = h;
    $pantalla.setAttribute('data-pantalla', st.enviado ? 'gracias' : p.id);
    if (escribirla) escribirNota(st.notas[p.id]);
    if (animar && !MENOS_MOVIMIENTO) { $pantalla.classList.remove('fx-entra'); void $pantalla.offsetWidth; $pantalla.classList.add('fx-entra'); }
    // al cargar no se enfoca nada (así no aparece el recuadro de foco); sí al pasar de pantalla (teclado / lector de pantalla)
    var t = $pantalla.querySelector('.fx-pregunta');
    if (animar && t) t.focus({ preventScroll: true });
  }

  /* ---------- navegación + "atrás" del celular ---------- */
  function irA(id, empujar) {
    st.actual = id;
    if (empujar) { nivel++; try { history.pushState({ csf: id, n: nivel }, '', location.href); } catch (e) {} }
    else { try { history.replaceState({ csf: id, n: nivel }, '', location.href); } catch (e) {} }
    render(true);
    guardar();
    var arriba = raiz.getBoundingClientRect().top + window.scrollY - 12;
    if (window.scrollY > arriba) window.scrollTo({ top: arriba, behavior: 'instant' });
  }
  // nota: texto = frase nueva para la pantalla que sigue; null = sin frase; undefined = dejar la que ya tenía
  function avanzar(nota) {
    var v = visibles(), i = v.indexOf(actual());
    if (i < v.length - 1) {
      var sig = v[i + 1].id;
      if (nota) st.notas[sig] = nota; else if (nota === null) delete st.notas[sig];
      irA(sig, true);
    }
  }
  function retroceder() {
    var v = visibles(), k = v.indexOf(actual());
    if (k <= 0) return;
    if (nivel > 0) { history.back(); return; }   // el popstate hace el resto, así el "atrás" de la pantalla y el del celular son lo mismo
    irA(v[k - 1].id, false);
  }
  window.addEventListener('popstate', function (ev) {
    if (st.enviado) { location.href = '../../'; return; }   // ya envió: el "atrás" lo lleva al inicio, no de vuelta al formulario
    var s = ev.state;
    if (!s || !s.csf) return;
    nivel = s.n || 0;
    st.actual = s.csf;
    render(true); guardar();
  });

  function notaDe(p) {
    if (p.notasRango) {
      var d = st.r[p.id];
      if (!d || d.alt) return null;
      var n = ESCALAS[p.escala].valores[d.idx];
      for (var k = 0; k < p.notasRango.length; k++) if (n >= p.notasRango[k][0] && n <= p.notasRango[k][1]) return p.notasRango[k][2];
      return null;
    }
    if (!p.notas) return null;
    var v = st.r[p.id];
    if (Array.isArray(v)) { for (var i = 0; i < v.length; i++) if (p.notas[v[i]]) return p.notas[v[i]]; return null; }
    return p.notas[v] || null;
  }

  $pantalla.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-accion]');
    if (!b || b.disabled) return;
    var p = actual(), acc = b.getAttribute('data-accion'), v = b.getAttribute('data-v');

    if (acc === 'unica') {
      if (Date.now() < bloqueoHasta) return;   // un segundo toque tardío de la pantalla anterior no marca nada en la nueva
      var ya = st.r[p.id] === v;
      st.r[p.id] = v;
      $pantalla.querySelectorAll('[data-accion="unica"]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      vibrar(); guardar();
      clearTimeout(timerAvance);   // si toca otra opción antes de que pase, gana la última y avanza una sola vez
      timerAvance = setTimeout(function () { timerAvance = null; avanzar(ya ? undefined : notaDe(p)); }, MENOS_MOVIMIENTO ? 60 : 260);
      return;
    }
    if (acc === 'multi') {
      var lst = (st.r[p.id] || []).slice(), at = lst.indexOf(v);
      if (at > -1) lst.splice(at, 1);
      else if (EXCLUSIVAS.indexOf(v) > -1) lst = [v];                 // "Nada en especial" desmarca las demás
      else { lst = lst.filter(function (x) { return EXCLUSIVAS.indexOf(x) < 0; }); lst.push(v); }
      st.r[p.id] = lst;
      $pantalla.querySelectorAll('[data-accion="multi"]').forEach(function (x) { x.setAttribute('aria-pressed', lst.indexOf(x.getAttribute('data-v')) > -1 ? 'true' : 'false'); });
      vibrar(); refrescarContinuar(p); guardar();
      return;
    }
    if (acc === 'zonaquitar') {
      var zq = st.r[p.id] || { sel: [], calle: '' }, jq = zq.sel.indexOf(v);
      if (jq > -1) zq.sel.splice(jq, 1);
      st.r[p.id] = zq; vibrar(); render(false); guardar();
      return;
    }
    if (acc === 'zona') {
      var z = st.r[p.id] || { sel: [], calle: '' };
      if (p.multiple) { var j = z.sel.indexOf(v); if (j > -1) z.sel.splice(j, 1); else z.sel.push(v); }
      else z.sel = z.sel[0] === v ? [] : [v];
      st.r[p.id] = z;
      $pantalla.querySelectorAll('[data-accion="zona"]').forEach(function (x) { x.setAttribute('aria-pressed', z.sel.indexOf(x.getAttribute('data-v')) > -1 ? 'true' : 'false'); });
      vibrar(); refrescarContinuar(p); guardar();
      return;
    }
    if (acc === 'amb' || acc === 'nose') {
      var t = st.r.tamano || { amb: '', m2: idxInicial('m2'), nose: false };
      if (acc === 'amb') t.amb = v; else t.nose = !t.nose;
      st.r.tamano = t;
      $pantalla.querySelectorAll('[data-accion="amb"]').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-v') === t.amb ? 'true' : 'false'); });
      var bn = $pantalla.querySelector('[data-accion="nose"]'); if (bn) bn.setAttribute('aria-pressed', t.nose ? 'true' : 'false');
      var rg = document.getElementById('fx-rango'); if (rg) rg.disabled = t.nose;
      vibrar(); refrescarContinuar(p); guardar();
      return;
    }
    if (acc === 'extra') {
      st.r[p.extra.id] = st.r[p.extra.id] === v ? '' : v;
      $pantalla.querySelectorAll('[data-accion="extra"]').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-v') === st.r[p.extra.id] ? 'true' : 'false'); });
      vibrar(); guardar();
      return;
    }
    if (acc === 'alt') { st.r[p.id] = { alt: true }; vibrar(); avanzar(p.notaAlt || null); return; }
    if (acc === 'continuar') {
      if (p.tipo === 'deslizador') st.r[p.id] = { idx: +document.getElementById('fx-rango').value };
      if (p.tipo === 'tamano' && !st.r.tamano) {
        if (!soloLocal(st.r)) return;
        st.r.tamano = { amb: '', m2: +document.getElementById('fx-rango').value, nose: false };
      }
      avanzar(notaDe(p));
      return;
    }
    // saltar = esta pantalla queda sin respuesta (también el texto opcional que tenga, ej. "¿Algo más…?")
    if (acc === 'saltar') { delete st.r[p.id]; if (p.texto) delete st.r[p.texto.id]; avanzar(null); return; }
    if (acc === 'atras') { retroceder(); return; }
    if (acc === 'enviar') { enviar(); }
  });

  $pantalla.addEventListener('input', function (ev) {
    var el = ev.target, p = actual();
    if (el.id === 'fx-buscar') { abrirSug(el); return; }
    if (el.id === 'fx-rango') {
      var escId = p.tipo === 'tamano' ? 'm2' : p.escala;
      var e = ESCALAS[escId], i = +el.value, txt = e.fmt(e.valores[i]);
      el.style.setProperty('--pct', (i / (e.valores.length - 1) * 100) + '%');
      el.setAttribute('aria-valuetext', txt);
      var c = document.getElementById('fx-cifra'); c.textContent = txt;
      if (!MENOS_MOVIMIENTO) { c.classList.remove('fx-late'); void c.offsetWidth; c.classList.add('fx-late'); }
      if (p.tipo === 'tamano') { var t = st.r.tamano || { amb: '', m2: idxInicial('m2'), nose: false }; t.m2 = i; st.r.tamano = t; }
      else st.r[p.id] = { idx: i };
      guardar();
      return;
    }
    if (el.hasAttribute('data-zona')) {
      var z = st.r[p.id] || { sel: [], calle: '' };
      z[el.getAttribute('data-zona')] = el.value; st.r[p.id] = z;
      refrescarContinuar(p); guardar(); return;
    }
    if (el.hasAttribute('data-texto')) { st.r[el.getAttribute('data-texto')] = el.value; refrescarContinuar(p); guardar(); return; }
    if (el.hasAttribute('data-contacto')) cambioContacto(el);
  });

  function cambioContacto(el) {
    var campo = el.getAttribute('data-contacto');
    st.contacto[campo] = el.value;
    if (campo === 'pais') {
      var at = ayudaTel(el.value);
      document.getElementById('fx-prefijo').textContent = at.prefijo;
      document.getElementById('fx-tel-ayuda').textContent = at.ayuda;
      document.getElementById('fx-tel').placeholder = at.ph;
    }
    el.removeAttribute('aria-invalid');
    guardar();
  }

  /* buscador de barrios: lo que se elige (o se escribe) aparece como chip marcado.
     Las sugerencias son una lista propia, chica, justo debajo del campo (la lista nativa del navegador se abría
     en cualquier lado y ocupaba toda la pantalla en el celular). Si abajo no hay lugar (teclado), se abre arriba. */
  var sugItems = [], sugSel = -1;
  function sinTildes(s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function cerrarSug() {
    var u = document.getElementById('fx-sug'), i = document.getElementById('fx-buscar');
    if (u) { u.hidden = true; u.innerHTML = ''; }
    if (i) { i.setAttribute('aria-expanded', 'false'); i.removeAttribute('aria-activedescendant'); }
    sugItems = []; sugSel = -1;
  }
  function marcarSug(n) {
    var lis = $pantalla.querySelectorAll('.fx-sug li'), i = document.getElementById('fx-buscar');
    sugSel = n;
    lis.forEach(function (li, k) { li.setAttribute('aria-selected', k === n ? 'true' : 'false'); });
    if (i) { if (n > -1 && lis[n]) { i.setAttribute('aria-activedescendant', lis[n].id); var ul = lis[n].parentNode, tope = lis[n].offsetTop, fin = tope + lis[n].offsetHeight; if (tope < ul.scrollTop) ul.scrollTop = tope - 4; else if (fin > ul.scrollTop + ul.clientHeight) ul.scrollTop = fin - ul.clientHeight + 4; } else i.removeAttribute('aria-activedescendant'); }
  }
  function abrirSug(input) {
    var u = document.getElementById('fx-sug');
    if (!u) return;
    var texto = input.value.trim(), q = sinTildes(texto);
    if (!q) { cerrarSug(); return; }
    var z = st.r[actual().id] || { sel: [] };
    var cand = TODOS_BARRIOS.filter(function (b) { return z.sel.indexOf(b) < 0 && sinTildes(b).indexOf(q) > -1; });
    cand.sort(function (a, b) { return (sinTildes(a).indexOf(q) === 0 ? 0 : 1) - (sinTildes(b).indexOf(q) === 0 ? 0 : 1); });
    sugItems = cand.slice(0, 30);
    var h = sugItems.map(function (b, k) { return '<li role="option" id="fx-sug-' + k + '" aria-selected="false" data-v="' + esc(b) + '">' + esc(b) + '</li>'; }).join('');
    var exacto = TODOS_BARRIOS.some(function (b) { return sinTildes(b) === q; });
    if (!exacto) {
      sugItems.push(texto);
      h += '<li role="option" class="fx-sug__nuevo" id="fx-sug-' + (sugItems.length - 1) + '" aria-selected="false" data-v="' + esc(texto) + '">Agregar «' + esc(texto) + '»</li>';
    }
    if (!sugItems.length) { cerrarSug(); return; }
    u.innerHTML = h; u.hidden = false; sugSel = -1;
    input.setAttribute('aria-expanded', 'true'); input.removeAttribute('aria-activedescendant');
    // lugar disponible dentro de lo que se ve (con el teclado abierto en el celular es poco): abajo si entra, si no arriba
    var rc = input.getBoundingClientRect(), vv = window.visualViewport;
    var alto = vv ? vv.height : window.innerHeight, desde = vv ? vv.offsetTop : 0;
    var abajo = desde + alto - rc.bottom - 12, arriba = rc.top - desde - 12;
    u.style.maxHeight = ''; u.classList.remove('fx-sug--arriba');
    var need = Math.min(168, u.scrollHeight + 2);
    var arribaMejor = abajo < need && arriba > abajo;
    u.classList.toggle('fx-sug--arriba', arribaMejor);
    u.style.maxHeight = Math.max(84, Math.min(168, arribaMejor ? arriba : abajo)) + 'px';
  }
  function elegirSug(valor) {
    var i = document.getElementById('fx-buscar');
    if (!i) return;
    i.value = valor; cerrarSug(); agregarZona(i);
  }

  function agregarZona(input) {
    var p = actual(), texto = input.value.trim();
    if (!texto) return;
    var conocido = TODOS_BARRIOS.filter(function (b) { return b.toLowerCase() === texto.toLowerCase(); })[0];
    var v = conocido || texto.charAt(0).toUpperCase() + texto.slice(1);
    var z = st.r[p.id] || { sel: [], calle: '' };
    if (p.multiple) { if (z.sel.indexOf(v) < 0) z.sel.push(v); } else z.sel = [v];
    st.r[p.id] = z;
    vibrar(); render(false); guardar();
  }

  $pantalla.addEventListener('change', function (ev) {
    var el = ev.target;
    if (el.id === 'fx-buscar') agregarZona(el);
    else if (el.id === 'fx-pais') cambioContacto(el);
  });

  $pantalla.addEventListener('mousedown', function (ev) { if (ev.target.closest('.fx-sug')) ev.preventDefault(); });
  $pantalla.addEventListener('click', function (ev) {
    var li = ev.target.closest('.fx-sug li');
    if (li) { elegirSug(li.getAttribute('data-v')); return; }
    var caja = ev.target.closest('.fx-buscar');
    if (caja && !ev.target.closest('button')) { var inp = document.getElementById('fx-buscar'); if (inp) inp.focus(); }
  });
  $pantalla.addEventListener('focusout', function (ev) { if (ev.target.id === 'fx-buscar') setTimeout(cerrarSug, 120); });

  $pantalla.addEventListener('keydown', function (ev) {
    if (ev.target.id === 'fx-buscar' && ev.key === 'Backspace' && !ev.target.value) {
      var qs = $pantalla.querySelectorAll('.fx-etq__x');
      if (qs.length) { ev.preventDefault(); qs[qs.length - 1].click(); return; }
    }
    if (ev.target.id === 'fx-buscar' && sugItems.length) {
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); marcarSug((sugSel + (ev.key === 'ArrowDown' ? 1 : -1) + sugItems.length) % sugItems.length); return; }
      if (ev.key === 'Escape') { ev.preventDefault(); cerrarSug(); return; }
      if (ev.key === 'Enter' && sugSel > -1) { ev.preventDefault(); elegirSug(sugItems[sugSel]); return; }
    }
    if (ev.key !== 'Enter' || ev.target.tagName !== 'INPUT') return;
    ev.preventDefault();
    if (ev.target.id === 'fx-buscar') { cerrarSug(); agregarZona(ev.target); return; }
    var b = $pantalla.querySelector('[data-accion="continuar"], [data-accion="enviar"]');
    if (b && !b.disabled) b.click();
  });

  /* WhatsApp de la pantalla final: boton_id propio (no es click_whatsapp ni Contact; ver arriba) */
  raiz.addEventListener('click', function (ev) {
    var a = ev.target.closest('[data-evento="whatsapp-gracias"]');
    if (!a) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'click_boton', boton_id: 'whatsapp-gracias', boton_texto: 'Escribirme ahora por WhatsApp', destino: a.href });
  });

  /* ---------- envío ---------- */
  function construirPayload() {
    var r = st.r;
    var payload = { lead_type: LEAD, form_name: LEAD, nombre: st.contacto.nombre.trim(), telefono: telefonoInternacional(), email: st.contacto.email.trim() };
    var datos = FORM.datos(r, esVisible);
    for (var k in datos) payload[k] = datos[k];
    var rh = r.rompehielos;
    payload.rompehielos = rh && !rh.alt ? String(ESCALAS.diez.valores[rh.idx]) : '';
    var trampa = document.getElementById('campo-trampa');
    payload.sitio_web = trampa ? trampa.value.trim() : '';
    payload._ts = String(TS);
    var atribucion = leerAtribucion();
    for (var c in atribucion) payload[c] = atribucion[c];
    return payload;
  }

  function enviar() {
    if (st.enviando) return;
    var k = st.contacto, err = [];
    var campos = { nombre: document.getElementById('fx-nombre'), tel: document.getElementById('fx-tel'), email: document.getElementById('fx-email') };
    if (k.nombre.trim().length < 2) err.push(['nombre', 'Escribí tu nombre.']);
    if (!telefonoValido()) err.push(['tel', k.pais === '+54 9' ? 'Revisá el WhatsApp: código de área y número, sin 0 ni 15.' : 'Revisá el número de WhatsApp.']);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(k.email.trim())) err.push(['email', 'Revisá el email.']);
    Object.keys(campos).forEach(function (c) { campos[c].removeAttribute('aria-invalid'); });
    var $error = document.getElementById('fx-error');
    if (err.length) {
      err.forEach(function (e) { campos[e[0]].setAttribute('aria-invalid', 'true'); });
      $error.textContent = err.map(function (e) { return e[1]; }).join(' ');
      campos[err[0][0]].focus();
      return;
    }
    $error.textContent = '';
    st.enviando = true;
    var boton = document.getElementById('fx-enviar');
    boton.disabled = true; boton.textContent = 'Enviando…';

    fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(construirPayload()) })
      .then(function (res) {
        return res.json().catch(function () { return null; }).then(function (d) { return { status: res.status, datos: d }; });
      })
      .then(function (res) {
        if (!(res.status === 200 && res.datos && res.datos.ok)) throw new Error('respuesta invalida');
        st.enviado = true; st.enviando = false; st.notas = {};
        borrarGuardado();
        vibrar();
        render(true);
        try { history.replaceState({ csf: 'gracias', n: nivel }, '', location.href); } catch (e) {}
        // generate_lead: SÓLO acá, después de la confirmación del servidor, una vez por consulta (igual que antes)
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'generate_lead', lead_type: LEAD, form_name: LEAD });
        // hot_lead: sólo si el servidor dijo que la consulta salió Caliente (misma regla del mail). Una vez por consulta.
        if (res.datos.hot === true) {
          window.dataLayer.push({ event: 'hot_lead', lead_type: LEAD, form_name: LEAD });
        }
      })
      .catch(function () {
        st.enviando = false;
        var b = document.getElementById('fx-enviar');
        if (b) { b.disabled = false; b.textContent = 'Enviar'; }
        var e = document.getElementById('fx-error');
        if (e) e.textContent = 'No pudimos enviar tu consulta. Revisá tu conexión e intentá de nuevo.';
      });
  }

  /* ---------- arranque ---------- */
  recuperar();
  try { history.replaceState({ csf: actual().id, n: 0 }, '', location.href); } catch (e) {}
  render(false);
})();
