// ═══════════════════════════════════════════════════════════════════════════════
// SISTEMA DE CLASIFICACIÓN CREDITICIA
// Protocolo de Gestión por Niveles
// ═══════════════════════════════════════════════════════════════════════════════

export type NivelCredito = "A+" | "B" | "C" | "D" | "E";

export interface ClasificacionDef {
  nivel:        NivelCredito;
  emoji:        string;
  label:        string;
  perfil:       string;
  color:        string;
  bgColor:      string;
  diasMora:     { min: number; max: number };  // rango de días de mora
  accionSistema: string;
  restricciones: string[];
  beneficios:   string[];
  interesMora:  boolean;
  estadoCredito: "VIP" | "Vigente" | "Mora" | "Crítico" | "Siniestro";
}

export const CLASIFICACIONES: Record<NivelCredito, ClasificacionDef> = {
  "A+": {
    nivel: "A+", emoji: "🟢", label: "Excelente",
    perfil: "El 'Reloj'. Paga antes o el mismo día de vencimiento.",
    color: "#1a7a1a", bgColor: "#d4edda",
    diasMora: { min: -999, max: 0 },
    accionSistema: "Enviar comprobante con mensaje de agradecimiento. A los 3 meses habilitar Aumento de Cupo o Tasa Preferencial.",
    restricciones: [],
    beneficios: ["Tasa preferencial disponible a los 3 meses", "Aumento de cupo automático", "Prioridad en aprobación"],
    interesMora: false,
    estadoCredito: "VIP",
  },
  "B": {
    nivel: "B", emoji: "🟡", label: "Solvente",
    perfil: "El 'Olvidadizo'. Tiene el dinero pero se le pasa la fecha.",
    color: "#856404", bgColor: "#fff3cd",
    diasMora: { min: 1, max: 5 },
    accionSistema: "Recordatorio amistoso WhatsApp/SMS al día 1 y día 3 de atraso.",
    restricciones: ["Nota interna: recordar fecha de pago"],
    beneficios: ["Acceso normal a préstamos", "Sin restricciones activas"],
    interesMora: false,
    estadoCredito: "Vigente",
  },
  "C": {
    nivel: "C", emoji: "🟠", label: "Moroso Leve",
    perfil: "El 'Enredado'. Problemas de flujo de caja temporales.",
    color: "#7d4608", bgColor: "#fde8d8",
    diasMora: { min: 6, max: 30 },
    accionSistema: "Llamada humana de cobranza preventiva. Generación automática de intereses por mora.",
    restricciones: ["Bloqueo para nuevas solicitudes hasta cuota en $0"],
    beneficios: [],
    interesMora: true,
    estadoCredito: "Mora",
  },
  "D": {
    nivel: "D", emoji: "🔴", label: "Moroso Grave",
    perfil: "El 'Evasivo'. Falta de voluntad o capacidad de pago.",
    color: "#721c24", bgColor: "#f8d7da",
    diasMora: { min: 31, max: 90 },
    accionSistema: "Notificación Pre-Judicial formal por correo y físico. Alerta roja en panel del administrador.",
    restricciones: ["Suspensión total de beneficios", "Reporte preventivo a buró de crédito", "Sin nuevos préstamos"],
    beneficios: [],
    interesMora: true,
    estadoCredito: "Crítico",
  },
  "E": {
    nivel: "E", emoji: "💀", label: "Incobrable",
    perfil: "El 'Fugado'. No pagó y cortó comunicación.",
    color: "#1a1a1a", bgColor: "#e2e3e5",
    diasMora: { min: 91, max: 9999 },
    accionSistema: "Traslado a Lista Negra. Exportación de expediente para abogado o agencia de cobro externa.",
    restricciones: ["Bloqueo permanente por cédula", "Capital marcado como Pérdida Total", "Sin comunicación directa"],
    beneficios: [],
    interesMora: true,
    estadoCredito: "Siniestro",
  },
};

// Calcular nivel según días de mora y comportamiento
export function calcularNivel(
  diasMora: number,
  totalPrestamos: number,
  prestamosEnMora: number,
  mesesPagandoAPlusEnRacha?: number,
): NivelCredito {
  if (diasMora >= 91)  return "E";
  if (diasMora >= 31)  return "D";
  if (diasMora >= 6)   return "C";
  if (diasMora >= 1)   return "B";
  return "A+";
}

// Estadísticas del cliente para clasificación
export interface ClienteStats {
  totalPrestamos:     number;
  prestamosActivos:   number;
  prestamosSaldados:  number;
  prestamosEnMora:    number;
  diasMoraActual:     number;
  totalDeuda:         number;
  totalPagado:        number;
  moraAcumulada:      number;
  mesesEnRachaAplus:  number;
  nivel:              NivelCredito;
  empresas:           string[];  // en cuántas empresas tiene historial
}

// Historial global cross-empresa (para búsqueda SaaS)
export interface HistorialCrossEmpresa {
  empresa:        string;
  empresa_id:     string;
  totalPrestamos: number;
  nivel:          NivelCredito;
  diasMoraMax:    number;
  totalDeuda:     number;
  prestamosActivos: number;
}
