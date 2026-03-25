"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { PAGOS, updatePago } from "@/lib/data";

export default function EliminarPagoPage() {
  const [buscar, setBuscar] = useState("");
  const [pagos, setPagos] = useState(PAGOS.filter(p => p.activo));
  const [confirm, setConfirm] = useState<typeof PAGOS[0] | null>(null);
  const [saved, setSaved] = useState(false);

  const filtrados = pagos.filter(p =>
    !buscar ||
    p.ref.toLowerCase().includes(buscar.toLowerCase()) ||
    p.cliente.toLowerCase().includes(buscar.toLowerCase())
  );

  function handleAnular(p: typeof PAGOS[0]) {
    updatePago(p.id, { activo: false });
    setPagos(prev => prev.filter(x => x.id !== p.id));
    setSaved(true);
    setTimeout(() => { setSaved(false); setConfirm(null); }, 800);
  }

  return (
    <>
      <Box title="🚫 Anular / Desactivar Pago" color="#dd4b39">
        <div style={{ padding: "10px 14px", background: "#fff3cd", borderLeft: "4px solid #f39c12", borderRadius: "3px", marginBottom: "14px" }}>
          <strong style={{ fontSize: "13px", color: "#856404" }}>⚠️ Importante:</strong>
          <p style={{ fontSize: "12px", color: "#856404", margin: "4px 0 0" }}>Anular un pago no lo elimina permanentemente. El registro queda marcado como inactivo y el saldo del préstamo se recalcula. Esta acción solo la pueden hacer supervisores y administradores.</p>
        </div>
        <input value={buscar} onChange={e => setBuscar(e.target.value)} placeholder="Buscar por referencia o cliente..."
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", outline: "none", marginBottom: "14px", boxSizing: "border-box" as const }} />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#f4f4f4" }}>
              {["Referencia", "Fecha", "Cliente", "Préstamo", "Cuota", "Monto", "Acción"].map(h => (
                <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#777", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtrados.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
                  <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: "11px", color: "#605ca8", fontWeight: 600 }}>{p.ref}</td>
                  <td style={{ padding: "9px 12px", fontSize: "12px", color: "#777" }}>{p.fecha}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 600, fontSize: "13px" }}>{p.cliente}</td>
                  <td style={{ padding: "9px 12px", fontSize: "12px" }}>{p.prestamo_id}</td>
                  <td style={{ padding: "9px 12px", fontSize: "12px" }}>{p.cuota_num}/{p.total_cuotas}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 700, color: "#00a65a" }}>RD$ {p.monto.toLocaleString()}</td>
                  <td style={{ padding: "9px 12px" }}>
                    <button onClick={() => setConfirm(p)} style={{ padding: "4px 10px", background: "#dd4b39", color: "#fff", border: "none", borderRadius: "3px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}>Anular</button>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && <tr><td colSpan={7} style={{ padding: "30px", textAlign: "center", color: "#ccc" }}>Sin pagos activos</td></tr>}
            </tbody>
          </table>
        </div>
      </Box>

      {confirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: "6px", padding: "24px", width: "380px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 12px" }}>⚠️ Anular Pago</h3>
            <p style={{ fontSize: "13px", color: "#555", margin: "0 0 6px" }}>Referencia: <strong style={{ fontFamily: "monospace", color: "#605ca8" }}>{confirm.ref}</strong></p>
            <p style={{ fontSize: "13px", color: "#555", margin: "0 0 16px" }}>Cliente: <strong>{confirm.cliente}</strong> — Monto: <strong style={{ color: "#00a65a" }}>RD$ {confirm.monto.toLocaleString()}</strong></p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => handleAnular(confirm)} style={{ flex: 1, padding: "8px", background: saved ? "#00a65a" : "#dd4b39", color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>{saved ? "✓ Anulado" : "Confirmar Anulación"}</button>
              <button onClick={() => setConfirm(null)} style={{ padding: "8px 16px", background: "#eee", color: "#555", border: "none", borderRadius: "4px", fontSize: "13px", cursor: "pointer" }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
