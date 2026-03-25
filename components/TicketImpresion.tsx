"use client";
// ═══════════════════════════════════════════════════════════════════════════════
// TICKET DE IMPRESIÓN TÉRMICA — formato 58mm / 80mm
// Compatible con impresoras POS tipo Epson TM, Bixolon, Zebra
// ═══════════════════════════════════════════════════════════════════════════════

export type TipoTicket = "prestamo" | "pago" | "saldo";

interface DatosEmpresa {
  nombre: string;
  dueno: string;
  telefono?: string;
  direccion?: string;
}

interface DatosPrestamo {
  tipo: TipoTicket;
  empresa: DatosEmpresa;
  // Préstamo
  prestamo_id?: string;
  fecha: string;
  cliente: string;
  cedula?: string;
  telefono?: string;
  // Datos financieros
  monto?: string;
  tasa?: string;
  num_cuotas?: number;
  cuota?: string;
  total_pagar?: string;
  total_interes?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  // Pago
  cuota_num?: string;
  pago_total?: string;
  pago_capital?: string;
  pago_interes?: string;
  pago_abono?: string;
  pago_mora?: string;
  efectividad?: string;
  pendiente_mora?: string;
  cuotas_pendientes?: number;
  saldo_total?: string;
  // Saldo
  saldo_anterior?: string;
  monto_pagado?: string;
  saldo_nuevo?: string;
  es_cancelacion?: boolean;
}

function Linea({ grosor = false }: { grosor?: boolean }) {
  return <div style={{ borderTop: grosor ? "2px solid #000" : "1px dashed #000", margin: "4px 0" }} />;
}

function FilaDato({ label, valor, bold }: { label: string; valor: string; bold?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: bold ? 700 : 400, marginBottom: "1px" }}>
      <span style={{ color: "#444" }}>{label}</span>
      <span style={{ color: "#000", textAlign: "right" }}>{valor}</span>
    </div>
  );
}

// Content for the ticket (separated to allow rendering in preview and in print window)
export function TicketContent({ datos }: { datos: DatosPrestamo }) {
  // Use "CrediControl" as fallback if company name is missing
  const nombreEmpresa = datos.empresa.nombre || "CREDICONTROL";

  return (
    <div id="ticket-print" style={{
      width: "280px", fontFamily: "'Courier New', Courier, monospace",
      padding: "10px 8px", background: "#fff", color: "#000", fontSize: "12px",
    }}>
      {/* Header empresa */}
      <div style={{ textAlign: "center", marginBottom: "6px" }}>
        <div style={{ fontSize: "16px", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.1 }}>{nombreEmpresa}</div>
        {datos.empresa.dueno && <div style={{ fontSize: "11px", marginTop: "2px" }}>{datos.empresa.dueno}</div>}
        <div style={{ fontSize: "13px", fontWeight: 700, marginTop: "6px", textTransform: "uppercase", border: "1px solid #000", padding: "2px 0" }}>
          {datos.tipo === "prestamo" ? "Recibo de Préstamo"
            : datos.tipo === "pago" ? "Recibo de Pago"
              : "Carta de Saldo"}
        </div>
        <div style={{ fontSize: "11px", marginTop: "4px" }}>{datos.fecha}</div>
      </div>

      <Linea grosor />

      {/* Datos cliente */}
      <div style={{ marginBottom: "4px" }}>
        <FilaDato label="Cliente" valor={datos.cliente} bold />
        {datos.cedula && <FilaDato label="Cédula" valor={datos.cedula} />}
        {datos.telefono && <FilaDato label="Teléfono" valor={datos.telefono} />}
        {datos.prestamo_id && <FilaDato label="Préstamo" valor={datos.prestamo_id} />}
      </div>

      <Linea />

      {/* Contenido según tipo */}
      {/* ... details remain similar ... */}
      {datos.tipo === "prestamo" && (
        <>
          <div style={{ textAlign: "center", fontSize: "11px", fontWeight: 600, marginBottom: "3px" }}>── DETALLE DEL PRÉSTAMO ──</div>
          {datos.monto && <FilaDato label="Monto" valor={datos.monto} bold />}
          {datos.num_cuotas && <FilaDato label="No. de Cuotas" valor={String(datos.num_cuotas)} />}
          {datos.cuota && <FilaDato label="Cuota" valor={datos.cuota} bold />}
          {datos.total_pagar && <FilaDato label="Total a Pagar" valor={datos.total_pagar} bold />}
          <Linea />
          {/* ... */}
        </>
      )}

      {datos.tipo === "pago" && (
        <>
          <div style={{ textAlign: "center", fontSize: "11px", fontWeight: 600, marginBottom: "3px" }}>── DETALLE DEL PAGO ──</div>
          {datos.cuota_num && <FilaDato label="Cuota No." valor={datos.cuota_num} />}
          {datos.pago_total && <FilaDato label="PAGO TOTAL" valor={datos.pago_total} bold />}
          {datos.pago_capital && <FilaDato label="Pago Capital" valor={datos.pago_capital} />}
          {datos.pago_interes && <FilaDato label="Pago Interés" valor={datos.pago_interes} />}
          {datos.pago_mora && <FilaDato label="Pago Mora" valor={datos.pago_mora} />}
          <Linea />
          <div style={{ textAlign: "center", fontSize: "11px", fontWeight: 600, marginBottom: "3px" }}>── PENDIENTE ──</div>
          {datos.pendiente_mora !== undefined && <FilaDato label="Mora" valor={datos.pendiente_mora ?? "$0"} />}
          {datos.cuotas_pendientes !== undefined && <FilaDato label="Cuota(s)" valor={String(datos.cuotas_pendientes)} />}
          {datos.saldo_total && <FilaDato label="TOTAL" valor={datos.saldo_total} bold />}
        </>
      )}

      {datos.tipo === "saldo" && (
        <>
          <div style={{ textAlign: "center", fontSize: "11px", fontWeight: 600, marginBottom: "3px" }}>── ESTADO DE CUENTA ──</div>
          {datos.saldo_anterior && <FilaDato label="Saldo Anterior" valor={datos.saldo_anterior} />}
          {datos.monto_pagado && <FilaDato label="Monto Pagado" valor={datos.monto_pagado} bold />}
          {datos.saldo_nuevo && <FilaDato label="Saldo Pendiente" valor={datos.saldo_nuevo} bold />}
          {datos.es_cancelacion && (
            <div style={{ textAlign: "center", fontSize: "13px", fontWeight: 700, marginTop: "6px", padding: "4px", border: "2px solid #000" }}>
              ✓ DEUDA CANCELADA
            </div>
          )}
        </>
      )}

      <Linea grosor />

      {/* Footer */}
      <div style={{ textAlign: "center", fontSize: "10px", marginTop: "6px", borderTop: "1px dashed #eee", paddingTop: "6px" }}>
        {datos.empresa.telefono && <div>Tel: {datos.empresa.telefono}</div>}
        {datos.empresa.direccion && <div style={{ marginBottom: "8px" }}>{datos.empresa.direccion}</div>}

        <div style={{ textTransform: "uppercase", fontSize: "9px", letterSpacing: "0.5px", color: "#666" }}>
          Software provisto por
        </div>
        <div style={{ fontWeight: 700, fontSize: "11px", marginTop: "1px" }}>
          credicontrol.net
        </div>
        <div style={{ marginTop: "6px", letterSpacing: "1px", fontSize: "8px" }}>* * * * * * * * * * * * * *</div>
      </div>
    </div>
  );
}

// Modal de impresión
export default function TicketImpresion({ datos, onClose }: { datos: DatosPrestamo; onClose: () => void }) {
  function imprimir() {
    const el = document.getElementById("ticket-print");
    if (!el) return;
    const win = window.open("", "_blank", "width=340,height=600");
    if (!win) return;
    win.document.write(`
      <html><head><title>Ticket</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Courier New',Courier,monospace; font-size:12px; }
        @media print { body { margin:0; } }
      </style></head>
      <body onload="window.print();window.close()">
        ${el.innerHTML}
      </body></html>
    `);
    win.document.close();
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ background: "#f5f5f5", borderRadius: "6px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Controls */}
        <div style={{ background: "#333", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>Vista previa del ticket</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={imprimir} style={{ padding: "5px 14px", background: "#00a65a", color: "#fff", border: "none", borderRadius: "3px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>
              🖨️ Imprimir
            </button>
            <button onClick={onClose} style={{ padding: "5px 10px", background: "#dd4b39", color: "#fff", border: "none", borderRadius: "3px", fontSize: "12px", cursor: "pointer" }}>✕</button>
          </div>
        </div>
        {/* Ticket preview with paper shadow */}
        <div style={{ padding: "20px", display: "flex", justifyContent: "center", background: "#e8e8e8" }}>
          <div style={{ boxShadow: "2px 2px 8px rgba(0,0,0,0.2)", background: "#fff" }}>
            <TicketContent datos={datos} />
          </div>
        </div>
      </div>
    </div>
  );
}
