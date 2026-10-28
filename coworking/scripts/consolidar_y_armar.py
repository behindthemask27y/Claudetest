# -*- coding: utf-8 -*-
"""Paso 1 del estudio: junta los JSON de datos/, calcula medianas por zona, llena supuestos_base y arma el Excel.

Uso (desde cualquier carpeta):  python3 -I coworking/scripts/consolidar_y_armar.py
Escribe:
  datos/resumen_mercado.json   medianas por zona y concepto (verificadas aparte de probables/inciertas)
  datos/supuestos.json         supuestos con fuente, tal como entran al modelo
  modelo_coworking_santo_tome_2987.xlsx   (sin valores calculados: se recalcula con Excel o LibreOffice)

Regla: no inventa precios. Lo que no tiene dato entra en 0 (o en el piso con fuente) y queda marcado "SIN DATO".
"""
import json
import re
import shutil
import statistics as st
import subprocess
import sys
import tempfile
from pathlib import Path

import openpyxl
from openpyxl.styles import Alignment, PatternFill

AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
import modelo_xlsx as MX                      # noqa: E402
from supuestos_base import supuestos          # noqa: E402

DATOS = AQUI.parent / "datos"
SALIDA = AQUI.parent / "modelo_coworking_santo_tome_2987.xlsx"
FECHA_CORTE = "27/10/2026"
IVA = 0.21
ROJO = PatternFill("solid", fgColor="F8D7DA")


def cargar(nombre):
    return json.loads((DATOS / nombre).read_text(encoding="utf-8"))


# ---------------------------------------------------------------- sedes
SEDES = []
for g in ("G1A", "G1B", "G3", "CAD"):
    for s in cargar(f"sedes_{g}.json"):
        s["_grupo"] = g
        SEDES.append(s)

OFICINAS = cargar("alquiler_oficinas.json")
REF = cargar("costos_referencia.json")
CASA = cargar("casa_costo_oportunidad.json")
TC = OFICINAS["resumen"]["tc_referencia_ars_por_usd"]


def zona(s):
    """A cercana (Com. 9-12, 15) · B norte (Com. 13) · C centro y Palermo (Com. 1, 14 y otras) · D fuera de CABA / sin dato."""
    com = s.get("comuna", "") or ""
    if "fuera" in com.lower():
        return "D · Fuera de CABA o sin zona"
    m = re.search(r"(\d+)", com)
    if not m:
        b = (s.get("barrio", "") or "").lower()
        if any(k in b for k in ("belgrano", "núñez", "nuñez", "colegiales")):
            return "B · Norte (Com. 13: Belgrano, Núñez)"
        if any(k in b for k in ("saavedra", "urquiza", "devoto", "agronom", "paternal", "pueyrredón", "villa real", "versalles",
                                "monte castro", "floresta", "luro", "liniers", "vélez", "santa rita", "mitre", "villa del parque")):
            return "A · Cercana (Com. 9, 10, 11, 12, 15)"
        return "D · Fuera de CABA o sin zona"
    n = int(m.group(1))
    if n in (9, 10, 11, 12, 15):
        return "A · Cercana (Com. 9, 10, 11, 12, 15)"
    if n == 13:
        return "B · Norte (Com. 13: Belgrano, Núñez)"
    return "C · Centro y Palermo (Com. 1, 14 y otras)"


def clasificar(p):
    """Concepto comparable de un plan, o None si no es comparable con un plan mensual de persona."""
    if not p.get("precio"):
        return None
    t, n, u = p["tipo"], p["nombre"].lower(), p.get("unidad", "")
    if t == "pase_diario":
        return "Pase diario"
    if t == "sala":
        return "Sala (por hora)"
    if t == "oficina_privada":
        return "Oficina privada"
    if t == "fijo":
        return "Puesto fijo (por mes)" if u in ("puesto/mes", "persona/mes") else None   # Regus 'desde 8 USD/día' no es mensual
    if t == "ilimitado_flex":
        return "Ilimitado flex (por mes)"
    if t in ("dias_mes", "dias_semana"):
        if "global" in n:
            return None
        if "(lunes y viernes)" in n:
            return "2 días fijos por semana (L y V)"
        d = None
        m = re.search(r"(\d+)\s*d[ií]as?/mes", n) or re.search(r"plan\s*(\d+)d\b", n)
        if m:
            d = float(m.group(1))
        else:
            m = re.search(r"(\d+)\s*d[ií]as", n)
            if m and t == "dias_semana":
                d = float(m.group(1)) * 4.33
        if d is None:
            return None
        if d <= 5:
            return "4-5 días por mes"
        if d <= 10:
            return "8-10 días por mes"
        if d <= 13:
            return "12-13 días por mes"
        return "Más de 13 días por mes"
    return None


def ars_con_iva(p):
    v = float(p["precio"])
    if p.get("moneda") == "USD":
        v *= TC
    if p.get("iva") == "excluido":
        v *= 1 + IVA
    return v


def estadisticas(filtro):
    """Medianas por zona y concepto. Unidad = plan único por (marca, nombre, precio, moneda): una cadena con 3 sedes cuenta una vez."""
    vistos, grupos = set(), {}
    for s in SEDES:
        if not filtro(s):
            continue
        for p in s.get("planes", []):
            c = clasificar(p)
            if not c or p.get("estado_precio") == "historico":
                continue
            k = (zona(s), c, s["marca"], p["nombre"], p["precio"], p.get("moneda"))
            if k in vistos:
                continue
            vistos.add(k)
            g = grupos.setdefault((zona(s), c), {"v": [], "marcas": set(), "estados": set(), "monedas": set(), "iva": set()})
            g["v"].append(ars_con_iva(p))
            g["marcas"].add(s["marca"])
            g["estados"].add(p.get("estado_precio", ""))
            g["monedas"].add(p.get("moneda", ""))
            g["iva"].add(p.get("iva", ""))
    filas = []
    for (z, c), g in sorted(grupos.items()):
        filas.append({"zona": z, "concepto": c, "planes_unicos": len(g["v"]), "marcas": sorted(g["marcas"]),
                      "minimo_ars_con_iva": round(min(g["v"])), "mediana_ars_con_iva": round(st.median(g["v"])),
                      "maximo_ars_con_iva": round(max(g["v"])), "estado_precio": sorted(g["estados"]),
                      "moneda_publicada": sorted(g["monedas"]), "iva_publicado": sorted(g["iva"])})
    return filas


def verificada(s):          # existe, está operativa y ofrece membresía individual
    return s["estado"] == "verificado" and s["categoria"] == "principal"


def no_verificada(s):       # probable o incierta, sin contar las excluidas (cerradas, GBA, próximas aperturas)
    return s["estado"] in ("probable", "incierto") and s["categoria"] != "excluida"


STATS_VERIF = estadisticas(verificada)
STATS_NOVERIF = estadisticas(no_verificada)

CENSO = {}
for s in SEDES:
    k = (zona(s), s["estado"], s["categoria"])
    CENSO[k] = CENSO.get(k, 0) + 1


# ---------------------------------------------------------------- parámetros del modelo (cada número con su origen)
def sede(id_tmp):
    return next(s for s in SEDES if s["id_tmp"] == id_tmp)


def plan(id_tmp, nombre):
    return next(p for p in sede(id_tmp)["planes"] if p["nombre"] == nombre)


def chk(i, prefijo, *numeros):
    """Verifica que costos_referencia[i] sea el ítem esperado y que cada número transcripto aparezca en él."""
    it = REF[i]
    assert it["item"].startswith(prefijo), (i, it["item"][:60])
    txt = json.dumps(it, ensure_ascii=False)
    for n in numeros:
        assert str(n) in txt, (i, n)


ar = lambda x: f"{x:,.0f}".replace(",", ".")      # noqa: E731  (número con punto de miles)

# --- precios: lista de la zona cercana, anclada en Ambrela (único competidor directo, Devoto, 3,6 km)
amb2 = plan("G1A-01", "Start Point 2 Días")["precio"]       # 89.000
amb3 = plan("G1A-01", "Start Point 3 Días")["precio"]       # 103.000
amb_fijo = plan("G1A-01", "Fix point")["precio"]            # 118.000
amb_sala = plan("G1A-01", "Sala de reunión")["precio"]      # 13.000
hu = {n: plan("CAD-14", n)["precio"] for n in ("PLAN 4D", "PLAN 8D", "PLAN 12D", "PLAN FLEX")}
r_4d = hu["PLAN 4D"] / hu["PLAN 8D"]            # 0,616: cuánto cuesta el plan de 4 días respecto del de 8 en HUERTA
r_flex = hu["PLAN FLEX"] / hu["PLAN 12D"]       # 1,08: el ilimitado respecto del de 12 días en HUERTA
p1 = round(amb2 * r_4d, -2)
p4 = round(amb3 * r_flex, -2)
t15 = OFICINAS["resumen"]["tramos"]["15-30"]
ofi_alq = t15["alquiler_ARS"]["mediana"]
ofi_exp = t15["expensas_ARS"]["mediana"]

FUENTE_AMB = "Ambrela (Devoto, 3,6 km; único competidor directo), datos/sedes_G1A.json G1A-01: precio publicado sin fecha ni IVA aclarado y sin moneda explícita (se asume ARS por magnitud, sin confirmar); se toma como precio final."

# --- costos: de costos_referencia.json (el índice se verifica con chk)
chk(53, "Café en grano", "63540")
chk(6, "Empleados de Comercio CCT 130/75 - Administrativo A", 1316632)
chk(54, "Cargas sociales", "24,4%", "37,4%")
chk(56, "Limpieza de oficina", "32000", "79000", "50.000")
chk(57, "Servicio de limpieza por hora", "5000", "9000")
chk(67, "Internet fibra Movistar", "22018")
chk(34, "Starlink Argentina plan Residencial", "65000", "45000")
chk(35, "Starlink Argentina planes Priority", "158000")
chk(76, "Electricidad Edenor Tarifa 1", "18268,19")
chk(31, "Gas Metrogas", "24016.83")
chk(62, "Seguro integral", "50000", "300000")
chk(19, "Software de gestión coworking: Spacebring", 177)
chk(20, "Software de gestión coworking: OfficeRnD", "129", "99")
chk(0, "Costo de construcción CABA por m2", 1584840.25)
chk(36, "Techado de patio", "48000", "100000")
chk(44, "Relleno / anulación de pileta")
chk(80, "Reforma de baño", "5000000", "9000000")
chk(38, "Electricista: tablero", "333000", "602000", "169000", "260000")
chk(37, "Instalación eléctrica: agregar una boca", "52000", "104000")
chk(27, "Aire acondicionado split inverter frío/calor 4300", "1414550", "1531827", "2016845")
chk(23, "Silla de oficina ergonómica", "70000")
chk(24, "Silla de oficina ergonómica gama media-alta", "340000")
chk(25, "Escritorio de oficina melamina", "200000", "151.499", "259.919")
chk(50, "Locker metálico", "449999")
chk(51, "Sillón de 3 cuerpos", "381986", "785700")
chk(48, "Smart TV 4K", "573490", "634999")
chk(75, "Mesa de reuniones / cabina acústica")
chk(29, "Heladera No Frost", "2839999")
chk(28, "Microondas", "317253")
chk(52, "Cafetera espresso de oficina", "189999", "150999", "1999999")
chk(46, "Access point WiFi pyme", "237078", "349999")
chk(45, "Router WiFi 6", "71940", "295849")
chk(47, "UPS interactiva", "117499", "155353", "374434")
chk(39, "Cámaras de seguridad", "596000", "1060000")
chk(73, "Control de acceso y horario", "206251")
chk(59, "CPAU honorarios", "0,14 M")
chk(78, "Tasa de habilitación comercial", "150000", "300000", "800000")
chk(79, "Gestor de habilitación", "50000", "120000", "80000", "200000", "150000", "600000", "200000", "700000")
chk(61, "Matafuego ABC", "80000")
chk(17, "Mercado Pago: cobro por QR con saldo", "0.6")
chk(18, "Mercado Pago: cobro por QR con tarjeta", "6,29")
chk(15, "Ingresos Brutos CABA 2026", "3,00%")
chk(16, "Ingresos Brutos CABA: locación", "5%")

usd = lambda ars: round(ars / TC, 1)            # noqa: E731

costo_hora_limp = lambda tarifa: tarifa * 4 * 21     # noqa: E731  (4 h por día × 21 días hábiles)
sal = 1316632
cargas = (0.374, 0.309, 0.244)                       # 37,4 % con SAC y vacaciones · punto medio · 24,4 % sin provisiones

P = {
    "tc": [TC] * 3,
    "tc_fuente": "dolarapi.com, dólar oficial BNA venta, 27/10/2026 (datos/alquiler_oficinas.json).",
    "ri_fuente": "Monotributo no alcanza: tope de 200 m² para locaciones/servicios (LEEME); se asume Responsable Inscripto. A confirmar con contador.",
    # capacidad
    "puestos_flex": [30, 36, 42], "puestos_fijos": [4, 6, 8], "oficinas_priv": [2, 2, 3],
    "cap_fuente": ("SUPUESTO sin plano ni dato en el repo: 7,5 a 11 m² totales por puesto (incluye baños, cocina, salas, circulación y escalera). "
                   "El coeficiente de ocupación del Código (Art. 3.4.7.2) no se pudo verificar (entorno_y_normativa.md, 2.3)."),
    # precios (ARS con IVA)
    "precio_p1": p1, "precio_p1_fuente": f"DERIVADO, no publicado: Ambrela no vende plan de 4 días. Precio del plan 2 días/sem ({ar(amb2)}) × proporción 4D/8D de HUERTA ({ar(hu['PLAN 4D'])}/{ar(hu['PLAN 8D'])}).",
    "precio_p2": amb2, "precio_p2_fuente": FUENTE_AMB + " Plan 'Start Point 2 Días' (≈ 8-9 días por mes).",
    "precio_p3": amb3, "precio_p3_fuente": FUENTE_AMB + " Plan 'Start Point 3 Días' (≈ 13 días por mes).",
    "precio_p4": p4, "precio_p4_fuente": f"DERIVADO, no publicado: Ambrela no vende ilimitado flex. Precio 3 días/sem ({ar(amb3)}) × proporción FLEX/12D de HUERTA ({ar(hu['PLAN FLEX'])}/{ar(hu['PLAN 12D'])}); queda bajo el puesto fijo de Ambrela ({ar(amb_fijo)}).",
    "mix_p1": 0.10, "mix_p2": 0.35, "mix_p3": 0.30, "mix_p4": 0.25,
    "mix_fuente": "SUPUESTO sin dato: en la zona solo Ambrela publica planes (2 y 3 días por semana y puesto fijo). Medir en la preventa.",
    "precio_fijo": amb_fijo, "precio_fijo_fuente": FUENTE_AMB + " Plan 'Fix point'.",
    "precio_oficina": ofi_alq,
    "precio_oficina_fuente": (f"INDIRECTO: ninguna ficha publica precio de oficina privada de coworking (todas 'a consultar'). Se usa la mediana del alquiler de oficinas de 15 a 30 m² "
                               f"({t15['alquiler_ARS']['n']} avisos, ARS {ar(ofi_alq)}; expensas mediana {ar(ofi_exp)} no incluidas), datos/alquiler_oficinas.json. Muestra chica."),
    "precio_pase": round(p1 / 4, -2),
    "precio_pase_fuente": "DERIVADO: precio por día del plan de 4 días (sin recargo). Ninguna ficha de la zona publica pase diario (Regus Retiro: USD 49 a 55).",
    "precio_sala_h": amb_sala, "precio_sala_fuente": FUENTE_AMB + " 'Sala de reunión', por hora.",
    # demanda
    "altas_f1": [2, 3, 5], "altas_f2": [2, 3, 4], "altas_f3": [1, 2, 3],
    "altas_fuente": "SUPUESTO sin dato de demanda: ningún archivo del repo mide cuántos profesionales de la zona usarían un coworking (entorno_y_normativa.md, 4). Medir con preventa y lista de espera.",
    "churn_fuente": "SUPUESTO sin dato local.",
    # costos variables
    "costo_puesto_dia_usd": [round(63540 / 100 * 3 / TC, 2), round(63540 / 100 * 2 / TC, 2), round(63540 / 100 * 1 / TC, 2)],
    "costo_puesto_dia_fuente": "Solo café: kg tostado ARS 63.540 (costos_referencia #53) × 10 g por taza × 3 / 2 / 1 tazas por día (el gramaje y las tazas son SUPUESTOS). Té, azúcar, agua y papel: SIN DATO.",
    "comision_pct": [0.0629, 0.0345, 0.006],
    "comision_fuente": "Mercado Pago: tarjeta de crédito con acreditación inmediata hasta 6,29 %; QR con saldo o débito 0,6 % (costos_referencia #17-18, fuente secundaria, + IVA). Base = mitad y mitad (SUPUESTO).",
    "iibb_pct": [0.05, 0.03, 0.03],
    "iibb_fuente": "3 % servicios inmobiliarios y de alquiler (costos_referencia #15); 5 % si encuadra como locación de inmuebles comerciales (#16). El encuadre del coworking NO está confirmado.",
    # costos fijos
    "costo_fte_usd": [usd(sal * (1 + c)) for c in cargas],
    "costo_fte_fuente": "Comercio CCT 130/75 Administrativo A, ARS 1.316.632 con suma fija (costos_referencia #6) × cargas 37,4 % / 30,9 % / 24,4 % (#54, calculadora de un marketplace, no norma). Verificar el acuerdo.",
    "limpieza_usd": [usd(50000 * 21), usd(costo_hora_limp(7000)), usd(costo_hora_limp(5000))],
    "limpieza_fuente": "Conservador: jornada mediana ARS 50.000 × 21 días (costos_referencia #56). Base y favorable: ARS 7.000 / 5.000 por hora (rango 5.000 a 9.000, #57, sin verificar) × 4 h por día (SUPUESTO) × 21 días.",
    "internet_usd": [usd(22018 + 158000), usd(22018 + 65000), usd(22018 + 45000)],
    "internet_fuente": "Fibra Movistar combo ARS 22.018 + respaldo Starlink: Priority 500 GB ARS 158.000 / Residencial Estándar 65.000 / Lite 45.000 (costos_referencia #67, #34-35). Son planes residenciales o de combo: la fibra empresarial simétrica requiere cotización (#66).",
    "servicios_usd": [usd(18268.19 + 24016.83)] * 3,
    "servicios_fuente": "SIN DATO de consumo. Solo los cargos fijos mensuales: Edenor T1 ARS 18.268 + Metrogas P1-P2 ARS 24.017 (costos_referencia #76, #31); agua AySA no disponible (#83). Falta la factura real de la casa.",
    "seguros_usd": [usd(300000), usd(175000), usd(50000)],
    "seguros_fuente": "Comparador comercial, no cotización: oficina y servicios profesionales ARS 50.000 a 300.000 por mes (costos_referencia #62, mayo 2026, valores inconsistentes). Base = punto medio. Un coworking con terceros necesita RC.",
    "software_usd": [177, 129, 99],
    "software_fuente": "Spacebring Business USD 177; OfficeRnD Essentials USD 129 mensual / 99 anual (costos_referencia #19-20).",
    "admin_usd": [0, 0, 0],
    "admin_fuente": "SIN DATO: ningún archivo tiene honorarios de contador para un Responsable Inscripto. Cargado en 0.",
    "marketing_fuente": "SUPUESTO de diseño. Referencia: CPC mediano Meta Ads en Argentina USD 0,63 (julio 2026, costos_referencia #63) → USD 400 a 500 por mes ≈ 640 a 800 clics.",
    # inversión
    "usd_m2_obra": [usd(1584840.25 * 0.40), usd(1584840.25 * 0.30), usd(1584840.25 * 0.20)],
    "usd_m2_obra_fuente": "ANCLADO en el costo de construir nuevo en CABA, ARS 1.584.840 por m² (julio 2026, costos_referencia #0). El 40 % / 30 % / 20 % para una refacción de casa usada es SUPUESTO mío: validar con presupuesto de arquitecto.",
    "usd_m2_patio": [usd(100000), usd(74000), usd(48000)],
    "usd_m2_patio_fuente": "Techado con policarbonato, material y mano de obra, ARS 48.000 a 100.000 por m² (costos_referencia #36). Sin estructura nueva, piso ni instalaciones. Techar puede estar prohibido (entorno_y_normativa.md, 1.3).",
    "pileta_usd": [0, 0, 0],
    "pileta_fuente": "SIN DATO: costos_referencia #44 'no disponible'. Cargado en 0.",
    "bano_acc_usd": [usd(9000000), usd(7000000), usd(5000000)],
    "bano_fuente": "PROXY: reforma de baño 'media', ARS 5.000.000 a 9.000.000 (costos_referencia #80). No hay precio de baño accesible; el rango es de otro tipo de obra.",
    "electrica_datos_usd": [usd(602000 + 260000 + 100 * 104000), usd((467500 + 214500) + 100 * 78000), usd(333000 + 169000 + 100 * 52000)],
    "electrica_fuente": "Solo mano de obra: tablero ARS 333.000 a 602.000 + puesta a tierra 169.000 a 260.000 + 100 bocas a 52.000 a 104.000 (costos_referencia #37-38). Las 100 bocas son SUPUESTO (2 por puesto + áreas comunes). Materiales y cableado: SIN DATO.",
    "clima_usd": [usd(2016845), usd(1531827), usd(1414550)],
    "clima_fuente": "Split inverter frío/calor de 4.300 a 5.590 frigorías, solo el equipo: ARS 1.414.550 / 1.531.827 / 2.016.845 (costos_referencia #27). Instalación: SIN DATO.",
    "mueble_puesto_usd": [usd(340000 + 259919), usd(70000 + 200000), usd(70000 + 151499)],
    "mueble_comun_usd": [usd(4 * 449999 + 4 * 785700 + 2 * 634999), usd(3 * 449999 + 3 * 663480 + 2 * 573490), usd(2 * 449999 + 2 * 381986 + 1 * 573490)],
    "mueble_fuente": ("Puesto: silla (70.000 económica / 340.000 media-alta) + escritorio (151.499 a 259.919) (costos_referencia #23-25). "
                      "Común: lockers de 12 puertas, sillones de 3 cuerpos y Smart TV (#50, #51, #48); las cantidades son SUPUESTO. Mesa de reuniones y sillas de sala: SIN DATO (#75)."),
    "cabina_usd": [0, 0, 0],
    "cabina_fuente": "SIN DATO: costos_referencia #75, no hay precio argentino de cabina acústica. Cargado en 0.",
    "cafe_equipo_usd": [usd(2839999 + 2 * 317253 + 1999999), usd(2839999 + 317253 + 189999), usd(2839999 + 317253 + 150999)],
    "cafe_fuente": "Heladera no frost ARS 2.839.999 + microondas 317.253 + espresso hogareña (150.999 a 1.999.999) (costos_referencia #29, #28, #52). Espresso comercial y vajilla: SIN DATO.",
    "it_seguridad_usd": [usd(5 * 349999 + 295849 + 2 * 374434 + 1060000 + 2 * 206251),
                         usd(4 * 237078 + 154800 + 2 * 155353 + 828000 + 2 * 206251),
                         usd(3 * 237078 + 71940 + 2 * 117499 + 596000 + 206251)],
    "it_fuente": "Access points UniFi, router, UPS, kit de 8 cámaras con NVR instalado y terminales de control de acceso (costos_referencia #46, #45, #47, #39, #73); las cantidades son SUPUESTO. Switch PoE y cableado: SIN DATO.",
    "honorarios_pct": 0.14,
    "honorarios_fuente": "CPAU: honorario sugerido 14 % del monto de obra para obras de hasta unos ARS 320 millones (costos_referencia #59). Sugerido, no obligatorio.",
    "habilitacion_usd": [usd(800000 + 0.25 * 800000 + 120000 + 200000 + 600000 + 700000 + 6 * 80000),
                         usd(550000 + 0.20 * 550000 + 85000 + 140000 + 375000 + 450000 + 6 * 80000),
                         usd(150000 + 0.15 * 150000 + 50000 + 80000 + 150000 + 200000 + 6 * 80000)],
    "habilitacion_fuente": "Tasa de habilitación (blog) + gestor 15-25 % + certificados + seguro RC anual + planos y firma profesional + 6 matafuegos de ARS 80.000 (costos_referencia #78, #79, #61). Rangos de un blog, no fuente oficial. Regularización de planos y plan de evacuación: SIN DATO.",
    # costo de oportunidad
    "alquiler_casa_usd": [0, 0, 0],
    "alquiler_casa_fuente": "SIN DATO: datos/casa_costo_oportunidad.json está pendiente (0 avisos). Cargado en 0; el Resumen muestra cuánto resultado operativo queda para pagar ese alquiler.",
}
assert not CASA["casas_alquiler"] and not CASA["casas_venta"], "casa_costo_oportunidad.json ya tiene datos: usarlos en alquiler_casa_usd"

ITEMS = supuestos(P)
SUP = {"fecha_corte": FECHA_CORTE, "items": ITEMS}


# ---------------------------------------------------------------- Excel
def hoja_mercado(wb, titulo, nota, stats):
    ws = wb.create_sheet(titulo)
    ws["A1"] = nota[0]
    ws["A1"].font = MX.F_T
    ws["A2"] = nota[1]
    ws["A2"].font = MX.F_S
    MX._hdr(ws, 4, ["Zona", "Concepto", "Planes únicos", "Marcas", "Mínimo", "Mediana", "Máximo", "Vigencia del precio", "Moneda publicada", "IVA publicado"],
            [34, 32, 10, 34, 14, 14, 14, 30, 14, 20])
    r = 5
    for f in stats:
        vals = [f["zona"], f["concepto"], f["planes_unicos"], ", ".join(f["marcas"]), f["minimo_ars_con_iva"], f["mediana_ars_con_iva"],
                f["maximo_ars_con_iva"], ", ".join(f["estado_precio"]), ", ".join(f["moneda_publicada"]), ", ".join(f["iva_publicado"])]
        for j, v in enumerate(vals, 1):
            c = ws.cell(row=r, column=j, value=v)
            c.font = MX.F_TX
            if 5 <= j <= 7:
                c.number_format = '#,##0'
        r += 1
    if not stats:
        ws.cell(row=r, column=1, value="Sin planes con precio en este grupo.").font = MX.F_S
    ws.freeze_panes = "C5"
    return ws


def hoja_censo(wb):
    ws = wb.create_sheet("Censo")
    ws["A1"] = "Qué hay en el censo de sedes (98 fichas) y cuánto está confirmado"
    ws["A1"].font = MX.F_T
    ws["A2"] = "Solo las fichas 'verificado' + 'principal' alimentan los precios. Probable e incierto van aparte. Cerradas, GBA y próximas aperturas están excluidas."
    ws["A2"].font = MX.F_S
    MX._hdr(ws, 4, ["Zona", "Estado de la ficha", "Categoría", "Fichas"], [38, 20, 24, 10])
    r = 5
    for (z, e, c), n in sorted(CENSO.items()):
        for j, v in enumerate([z, e, c, n], 1):
            ws.cell(row=r, column=j, value=v).font = MX.F_TX
        r += 1
    ws.cell(row=r, column=1, value="TOTAL").font = MX.F_B
    ws.cell(row=r, column=4, value=sum(CENSO.values())).font = MX.F_B
    ws.freeze_panes = "A5"


FALTANTES = [
    ("Valor de alquiler (y de venta) de la casa de 450 m²", "Es el costo de oportunidad: lo que se deja de cobrar. Sin él no se puede decir si conviene más alquilar la casa.", "alquiler_casa_usd = 0. El Resumen y la hoja Lectura muestran cuánto resultado operativo queda para pagarlo.", "Cris (o avisos de casas de 300 a 600 m² en Villa del Parque, Devoto, Santa Rita y Agronomía)"),
    ("Facturas de luz, gas y agua de la casa (12 meses) o consumo estimado", "Hoy solo hay tarifas, no consumo. Con 40 a 60 personas y aire acondicionado puede ser un costo grande.", "servicios_usd = solo cargos fijos (USD 27 por mes).", "Cris (facturas) o un profesional de instalaciones"),
    ("Honorarios de contador (Responsable Inscripto)", "Es un costo fijo seguro.", "admin_usd = 0.", "Cris / contador"),
    ("Plano de la casa y m² reales por piso", "Define cuántos puestos entran, el techado del patio y la superficie de la unidad de uso (500 m² cambia el trámite).", "Capacidad supuesta: 7,5 a 11 m² por puesto; patio de 60 m² supuesto.", "Cris (planos) / arquitecto"),
    ("Demanda local: cuántos interesados hay en el barrio", "Todo el ritmo de altas es supuesto. No hay un solo dato de usuarios potenciales ni de disposición a pagar.", "Altas por mes supuestas (1 a 5).", "Cris (preventa o lista de espera)"),
    ("Precio de relleno de pileta", "No hay precio en las fuentes.", "pileta_usd = 0.", "Presupuesto de albañilería"),
    ("Precio de cabinas acústicas", "No hay precio argentino.", "cabina_usd = 0.", "Proveedor"),
    ("Precio de baño accesible", "El rango usado es de reforma de baño común.", "Proxy: reforma 'media' de ARS 5 a 9 millones.", "Presupuesto"),
    ("Mesa de reuniones, sillas de sala, espresso comercial, vajilla, switch PoE y cableado", "Equipamiento sin precio.", "No incluidos.", "Proveedores"),
    ("Cotización de internet empresarial simétrica", "Hoy hay precios de planes residenciales.", "Fibra de combo + respaldo Starlink.", "Operadores"),
    ("Certificado urbanístico y de uso conforme; regularización de planos (catastro 2008 no muestra subsuelo ni planta alta)", "El Código dice que el uso está permitido, pero no hay certificado. Puede haber multas y obra de regularización.", "No cuantificado.", "Gestor / arquitecto (entorno_y_normativa.md, 2.6)"),
    ("Si techar el patio se puede; estacionamiento exigible (2 módulos); accesibilidad en una casa de 3 niveles", "Pueden sumar obra o frenar el proyecto.", "No cuantificado; el techado de 60 m² está incluido como si se pudiera.", "Arquitecto / DGIUR"),
    ("Vigencia, fecha, IVA y moneda de los precios de Ambrela", "Es el único comparable verificado de la zona y su ficha dice 'sin fecha', sin IVA aclarado y sin moneda explícita. Todo el precio del modelo cuelga de ahí.", "Se toman como ARS con IVA incluido.", "Mirar la web de Ambrela / consultar"),
    ("Confirmar elburó (Villa Urquiza, ficha probable): Flex desde 115.000 y puesto fijo 257.000 a 300.000", "Si es real, el techo de precios de la zona es más alto que el de Ambrela. Hoy no se puede usar.", "Fuera del modelo; figura en Mercado_no_verificado.", "Mirar la web de elburó / consultar"),
    ("Resto de CABA (grupos G2, G4 a G6), Instagram y fotos", "No se relevaron. Faltan también las cadenas Urban Station y AreaTres, según el LEEME.", "No incluidos; no cambian la zona cercana.", "Siguiente tramo, si Cris lo pide"),
    ("Secciones 5 a 9 de entorno_y_normativa.md (escala de Comuna, estado de las leyes)", "El archivo anuncia secciones que nunca se escribieron.", "—", "Siguiente tramo"),
]


def hoja_faltantes(wb):
    ws = wb.create_sheet("Datos_faltantes")
    ws["A1"] = "Datos que faltan (ninguno se buscó en la web: se pregunta primero)"
    ws["A1"].font = MX.F_T
    ws["A2"] = "Lo que no tiene dato entra en 0 o en un piso con fuente, así que el resultado del modelo es una COTA OPTIMISTA: lo real es peor o igual."
    ws["A2"].font = MX.F_S
    MX._hdr(ws, 4, ["N°", "Qué falta", "Por qué importa", "Cómo está cargado hoy", "Quién lo puede dar"], [5, 60, 70, 60, 44])
    for i, f in enumerate(FALTANTES, 1):
        r = 4 + i
        ws.cell(row=r, column=1, value=i).font = MX.F_TX
        for j, v in enumerate(f, 2):
            c = ws.cell(row=r, column=j, value=v)
            c.font = MX.F_TX
            c.alignment = Alignment(wrap_text=True, vertical="top")
    ws.freeze_panes = "A5"


NOMBRES = {"B": "Conservador", "C": "Base", "D": "Favorable"}
ULT = MX.L(3 + MX.NMES)       # última columna del modelo mensual (mes 36)


def hoja_lectura(wb, R, filas):
    """Hoja 'Lectura': ¿da o no da? Todo con fórmulas sobre Equilibrio, Resumen y Supuestos."""
    ws = wb.create_sheet("Lectura", 0)
    ws["A1"] = "¿El negocio da o no da? Lectura con los números a la vista"
    ws["A1"].font = MX.F_T
    ws["A2"] = ("Cota optimista: los costos sin dato (alquiler de la casa, luz, gas y agua, contador, pileta, cabinas) están en 0 o en un piso. "
                "Precios: lista de la zona cercana (Ambrela). USD constantes sin IVA.")
    ws["A2"].font = MX.F_S
    MX._hdr(ws, 4, ["Indicador", "Conservador", "Base", "Favorable", "Cómo se lee"], [66, 16, 16, 16, 90])
    EQ, SC = ("B", "C", "D"), ("D", "E", "F")

    def s(k, c):
        return f"Supuestos!${c}${R[k]}"

    def pv(c):
        return f"((1+{s('iva', c)}*{s('ri', c)})*({s('comision_pct', c)}+{s('idc_pct', c)})+{s('iibb_pct', c)})"

    def k_eq(e, c, occ):
        cap, pn, cvar, otras, fijos = (f"Equilibrio!{e}{n}" for n in (12, 5, 7, 10, 9))
        consumo = f"({cvar}-{pn}*{pv(c)})"
        return f"({fijos}+{occ}*{cap}*{consumo})/({occ}*{cap}*{pn}*(1-{pv(c)})+{otras})"

    indicadores = [
        ("Precio neto promedio por miembro flex (USD por mes, sin IVA)", lambda e, c, col: f"=Equilibrio!{e}5", MX.USD2, "Mezcla de planes con el precio de la zona, menos descuento, sin IVA."),
        ("Miembros flex necesarios para cubrir los costos", lambda e, c, col: f"=Equilibrio!{e}11", '0.0', "En régimen (mes 36)."),
        ("Tope de miembros flex que entran en los puestos", lambda e, c, col: f"=Equilibrio!{e}12", '0.0', "Puestos simultáneos, con el pico de martes a jueves."),
        ("El equilibrio necesita este % del tope", lambda e, c, col: f"=Equilibrio!{e}13", MX.PCT, "Más de 100 %: no alcanza ni con todos los puestos llenos."),
        ("Resultado operativo mensual con todos los puestos llenos (mejor caso)", lambda e, c, col: f"=Equilibrio!{e}12*Equilibrio!{e}8+Equilibrio!{e}10-Equilibrio!{e}9", MX.USD, "Si es negativo, el negocio pierde plata aunque se llene."),
        ("Resultado operativo mensual en el mes 36 (con las altas supuestas)", lambda e, c, col: f"=Resumen!{col}11", MX.USD, "Antes de Ganancias y sin alquilar la casa."),
        ("Inversión inicial (sin capital de trabajo)", lambda e, c, col: f"=Resumen!{col}5", MX.USD, "Obra, equipamiento, honorarios, trámites y contingencias."),
        ("Años para recuperar la inversión con todos los puestos llenos", lambda e, c, col: f"=IF({col}9>0,{col}11/({col}9*12),\"no la recupera\")", '0.0', "Inversión / (mejor caso × 12)."),
        ("Precio necesario para equilibrar con el 80 % del tope (veces el precio del escenario)", lambda e, c, col: f"={k_eq(e, c, 0.8)}", '0.00', "1,00 = los precios de hoy; 2,00 = el doble."),
        ("Plan de 12 días por mes necesario para equilibrar al 80 % (ARS con IVA)", lambda e, c, col: f"={col}13*{s('precio_p3', c)}*{s('precio_mult', c)}", '#,##0', "Comparar con Ambrela 3 días/sem (103.000) y HUERTA 12 días (302.500 con IVA), ver hoja Mercado_verificado."),
        ("Mejor caso si el dueño atiende y no hay personal pago (USD por mes)", lambda e, c, col: f"={col}9+Modelo_{NOMBRES[col]}!{ULT}{filas['f_pers']}*(1+{s('otros_pct', c)})", MX.USD, "Suma el sueldo y las cargas que se ahorran (con el % de imprevistos). El tiempo del dueño no está valorado."),
        ("Años para recuperar la inversión en ese caso", lambda e, c, col: f"=IF({col}15>0,{col}11/({col}15*12),\"no la recupera\")", '0.0', "Inversión / (resultado × 12), con todos los puestos llenos."),
    ]
    r = 5
    for lab, f, fmt, nota in indicadores:
        ws.cell(row=r, column=1, value=lab).font = MX.F_TX
        for j in range(3):
            col = "BCD"[j]
            c = ws.cell(row=r, column=2 + j, value=f(EQ[j], SC[j], col))
            c.number_format, c.font = fmt, MX.F_B
        ws.cell(row=r, column=5, value=nota).font = MX.F_S
        r += 1
    ws.cell(row=r, column=1, value="VEREDICTO (cota optimista)").font = MX.F_B
    for j in range(3):
        col = "BCD"[j]
        c = ws.cell(row=r, column=2 + j, value=f'=IF({col}9<0,"NO DA",IF({col}8>0.8,"AJUSTADO",IF({col}12>5,"SOLO OPERATIVO","DA")))')
        c.font, c.fill = MX.F_B, MX.FILL_KEY
    ws.cell(row=r, column=5, value=("NO DA = aun lleno no cubre los costos · AJUSTADO = necesita más del 80 % del tope · "
                                    "SOLO OPERATIVO = cubre los costos pero la inversión tarda más de 5 años en volver · DA = cubre y recupera en 5 años o menos.")).font = MX.F_S
    ws.cell(row=r + 2, column=1, value=("Aparte, NO verificado y fuera del modelo: elburó (Villa Urquiza, ficha probable) publica Flex 'desde' ARS 115.000 y puesto fijo ARS 257.000 a 300.000, "
                                        "sin fecha ni IVA (datos/sedes_G3.json, G3-01). Si se confirmara, sugiere precios cerca de 30 % más altos que Ambrela en planes flex.")).font = MX.F_S
    ws.freeze_panes = "B5"


def marcar_sin_dato(wb):
    ws = wb["Supuestos"]
    for row in ws.iter_rows(min_row=5):
        f = row[6].value
        if isinstance(f, str) and f.startswith("SIN DATO"):
            for c in row:
                c.fill = ROJO
            row[7].value = "SIN DATO"


def recalcular():
    """Recalcula con LibreOffice (si está instalado) y deja el archivo con valores calculados. Si hay celdas con error, no lo reemplaza."""
    soffice = shutil.which("soffice")
    if not soffice:
        print("LibreOffice no está instalado: el archivo queda sin valores calculados (Excel lo recalcula al abrir). NO COMPROBADO.")
        return
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run([soffice, "--headless", "--calc", "--convert-to", "xlsx", "--outdir", tmp, str(SALIDA)],
                       check=True, capture_output=True, timeout=170)
        out = Path(tmp) / SALIDA.name
        v = openpyxl.load_workbook(out, data_only=True)
        f = openpyxl.load_workbook(out)
        n_formulas, errores = 0, []
        for ws in v:
            for row in ws.iter_rows():
                for c in row:
                    if isinstance(f[ws.title][c.coordinate].value, str) and f[ws.title][c.coordinate].value.startswith("="):
                        n_formulas += 1
                    if isinstance(c.value, str) and (c.value.startswith("#") or c.value.startswith("Err:")):
                        errores.append((ws.title, c.coordinate, c.value))
        print(f"Recalculado con LibreOffice: {n_formulas} fórmulas, {len(errores)} con error.")
        if errores:
            print("Celdas con error (el archivo NO se reemplazó):", errores[:10])
            return
        shutil.copyfile(out, SALIDA)


def main():
    # salidas intermedias
    (DATOS / "resumen_mercado.json").write_text(json.dumps({
        "fecha_corte": FECHA_CORTE, "tc_ars_por_usd": TC,
        "nota": "ARS con IVA. Unidad = plan único por (marca, nombre, precio, moneda). Verificadas = estado verificado + categoría principal.",
        "verificadas": STATS_VERIF, "probables_o_inciertas_aparte": STATS_NOVERIF,
        "censo_por_zona_estado_categoria": [{"zona": z, "estado": e, "categoria": c, "fichas": n} for (z, e, c), n in sorted(CENSO.items())],
    }, ensure_ascii=False, indent=1), encoding="utf-8")
    (DATOS / "supuestos.json").write_text(json.dumps(SUP, ensure_ascii=False, indent=1), encoding="utf-8")

    wb = openpyxl.Workbook()
    wb.remove(wb.active)
    R, filas, fila_inv = MX.armar_modelo(wb, SUP)
    hoja_lectura(wb, R, filas)
    hoja_mercado(wb, "Mercado_verificado",
                 ("Precios del mercado: solo fichas VERIFICADAS (ARS por mes, con IVA)",
                  "USD pasados a pesos con el TC de Supuestos; precios 'IVA excluido' llevados a con IVA. Una cadena con varias sedes cuenta una vez. No se usan precios históricos."),
                 STATS_VERIF)
    hoja_mercado(wb, "Mercado_no_verificado",
                 ("Precios de fichas PROBABLES o INCIERTAS: aparte, no alimentan el modelo",
                  "Misma conversión que la hoja verificada. Sin confirmar que la sede exista, siga abierta o que el precio esté vigente."),
                 STATS_NOVERIF)
    hoja_censo(wb)
    hoja_faltantes(wb)
    marcar_sin_dato(wb)
    orden = ["Lectura", "Resumen", "Supuestos", "Inversion", "Equilibrio", "Sensibilidad", "Modelo_Conservador", "Modelo_Base", "Modelo_Favorable",
             "Mercado_verificado", "Mercado_no_verificado", "Censo", "Datos_faltantes"]
    wb._sheets = [wb[n] for n in orden]
    wb.calculation.fullCalcOnLoad = True
    wb.save(SALIDA)
    print("Excel escrito:", SALIDA)
    print("Zonas con precios verificados:", sorted({f["zona"] for f in STATS_VERIF}))
    recalcular()


if __name__ == "__main__":
    main()
