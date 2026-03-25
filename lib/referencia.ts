// ─── Generador de Números de Referencia Automáticos ──────────────────────────
// Formato: CC-YYYYMMDD-XXXXXX (CC = CrediControl, 6 dígitos aleatorios)

export function generarReferencia(prefijo: "PAG"|"PRE"|"TRX"|"FAC" = "TRX"): string {
  const fecha = new Date();
  const y  = fecha.getFullYear();
  const m  = String(fecha.getMonth()+1).padStart(2,"0");
  const d  = String(fecha.getDate()).padStart(2,"0");
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `${prefijo}-${y}${m}${d}-${rand}`;
}

// Ejemplos:
// PAG-20260306-847291  → Pago de cuota
// PRE-20260306-123456  → Préstamo nuevo
// TRX-20260306-999001  → Transacción financiera
// FAC-20260306-550001  → Factura de suscripción
