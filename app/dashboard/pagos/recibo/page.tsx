"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { PAGOS } from "@/lib/data";
import TicketImpresion from "@/components/TicketImpresion";
import { useAuth } from "@/lib/AuthContext";

export default function ReciboPagoPage() {
  const { empresa } = useAuth();
  const [buscar, setBuscar] = useState("");
  const [ticket, setTicket] = useState<typeof PAGOS[0] | null>(null);

  const filtrados = PAGOS.filter(p =>
    !buscar ||
    p.ref.toLowerCase().includes(buscar.toLowerCase()) ||
    p.cliente.toLowerCase().includes(buscar.toLowerCase()) ||
    p.cedula.replace(/-/g, "").includes(buscar.replace(/-/g, ""))
  );

  return (
    <>
      <Box title="🧾 Reimprimir Recibo de Pago">
        <p style={{ fontSize: "13px", color: "#777", marginBottom: "14px" }}>Busca un pago por número de referencia, nombre del cliente o cédula para reimprimir su recibo.</p>
        <input value={buscar} onChange={e => setBuscar(e.target.value)} placeholder="Buscar por referencia, cliente o cédula..."
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", outline: "none", marginBottom: "14px", boxSizing: "border-box" as const }} />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#f4f4f4" }}>
              {["Referencia", "Fecha", "Cliente", "Préstamo", "Monto", "Forma", "Acción"].map(h => (
                <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#777", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtrados.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f4f4f4" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f9f9f9")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: "11px", color: "#605ca8", fontWeight: 600 }}>{p.ref}</td>
                  <td style={{ padding: "9px 12px", fontSize: "12px", color: "#777" }}>{p.fecha}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 600, fontSize: "13px" }}>{p.cliente}</td>
                  <td style={{ padding: "9px 12px", fontSize: "12px", color: "#555" }}>{p.prestamo_id}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 700, color: "#00a65a" }}>RD$ {p.monto.toLocaleString()}</td>
                  <td style={{ padding: "9px 12px", fontSize: "12px" }}>{p.forma}</td>
                  <td style={{ padding: "9px 12px" }}>
                    <button onClick={() => setTicket(p)} style={{ padding: "4px 10px", background: "#f39c12", color: "#fff", border: "none", borderRadius: "3px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}>🖨️ Imprimir</button>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && <tr><td colSpan={7} style={{ padding: "30px", textAlign: "center", color: "#ccc" }}>Sin resultados</td></tr>}
            </tbody>
          </table>
        </div>
      </Box>
      {ticket && (
        <TicketImpresion onClose={() => setTicket(null)} datos={{
          tipo: "pago",
          empresa: {
            nombre: empresa?.nombre ?? "CrediControl",
            dueno: empresa?.dueno ?? "",
            telefono: empresa?.telefono ?? "",
            direccion: empresa?.direccion ?? ""
          },
          prestamo_id: ticket.prestamo_id, fecha: ticket.fecha,
          cliente: ticket.cliente, cedula: ticket.cedula, cuota_num: `${ticket.cuota_num}/${ticket.total_cuotas}`,
          pago_total: `RD$ ${ticket.monto.toLocaleString()}`, pago_capital: `RD$ ${ticket.capital.toLocaleString()}`,
          pago_interes: `RD$ ${ticket.interes.toLocaleString()}`, pago_mora: `RD$ ${ticket.mora.toLocaleString()}`,
          efectividad: ticket.fecha, pendiente_mora: "RD$ 0.00", cuotas_pendientes: ticket.total_cuotas - ticket.cuota_num, saldo_total: "—",
        }} />
      )}
    </>
  );
}
