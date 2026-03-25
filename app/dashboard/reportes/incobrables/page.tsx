"use client";
import { useState, useEffect } from "react";
import { Box } from "@/components/UI";
import { getPrestamos } from "@/lib/data";

export default function IncobrablesPage() {
  const [prestamos, setPrestamos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getPrestamos();
        setPrestamos(data);
      } catch (error) {
        console.error("Error fetching data for report:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const incobrables = prestamos.filter(p => (p.dias_mora || 0) >= 91 && p.estado !== "saldado");
  const grave = prestamos.filter(p => (p.dias_mora || 0) >= 31 && (p.dias_mora || 0) < 91 && p.estado !== "saldado");
  const total = incobrables.reduce((s, p) => s + (p.saldo_capital || 0), 0);
  const totalGrave = grave.reduce((s, p) => s + (p.saldo_capital || 0), 0);

  if (loading) return <div className="p-8 text-center">Cargando reporte...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
        {[
          { l: "Incobrables (E)", v: incobrables.length, c: "#dd4b39", desc: "91+ días mora" },
          { l: "Mora Grave (D)",  v: grave.length,        c: "#f39c12", desc: "31-90 días mora" },
          { l: "Pérdida Total",   v: `RD$ ${total.toLocaleString()}`, c: "#dd4b39", desc: "Incobrables" },
        ].map(s => (
          <div key={s.l} style={{ background: "#fff", borderRadius: "3px", boxShadow: "0 1px 1px rgba(0,0,0,0.1)", borderLeft: `4px solid ${s.c}`, padding: "12px 15px" }}>
            <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 3px" }}>{s.l} — {s.desc}</p>
            <p style={{ fontSize: "24px", fontWeight: 700, color: s.c, margin: 0 }}>{s.v}</p>
          </div>
        ))}
      </div>

      {incobrables.length > 0 && (
        <Box title="💀 Nivel E — Incobrables (91+ días)" color="#dd4b39">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#fdf2f2" }}>
              {["ID", "Cliente", "Cédula", "Monto", "Saldo", "Días Mora", "Mora Acum.", "Cobrador", "Acción"].map(h => (
                <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#dd4b39", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {incobrables.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
                  <td style={{ padding: "9px 12px", color: "#aaa", fontSize: "12px" }}>{p.codigo || p.id.slice(0,8)}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 600 }}>{p.clientes?.nombre}</td>
                  <td style={{ padding: "9px 12px", fontSize: "12px", color: "#777" }}>{p.clientes?.cedula}</td>
                  <td style={{ padding: "9px 12px" }}>RD$ {(p.monto || 0).toLocaleString()}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 700, color: "#dd4b39" }}>RD$ {(p.saldo_capital || 0).toLocaleString()}</td>
                  <td style={{ padding: "9px 12px", color: "#dd4b39", fontWeight: 700 }}>{p.dias_mora}d</td>
                  <td style={{ padding: "9px 12px", color: "#dd4b39" }}>RD$ {(p.mora_acumulada || 0).toLocaleString()}</td>
                  <td style={{ padding: "9px 12px", fontSize: "12px" }}>{p.cobrador_id || "—"}</td>
                  <td style={{ padding: "9px 12px" }}>
                    <button style={{ padding: "4px 8px", background: "#dd4b39", color: "#fff", border: "none", borderRadius: "3px", fontSize: "11px", cursor: "pointer" }}>Ver Expediente</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: "#fdf2f2", fontWeight: 700 }}>
                <td colSpan={4} style={{ padding: "9px 12px" }}>TOTAL PÉRDIDA ESTIMADA</td>
                <td colSpan={5} style={{ padding: "9px 12px", color: "#dd4b39", fontSize: "16px" }}>RD$ {total.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </Box>
      )}

      {grave.length > 0 && (
        <Box title="🔴 Nivel D — Mora Grave (31-90 días)" color="#f39c12">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#fef9ec" }}>
              {["ID", "Cliente", "Saldo", "Días Mora", "Mora Acum.", "Cobrador"].map(h => (
                <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#f39c12", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {grave.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
                  <td style={{ padding: "9px 12px", color: "#aaa", fontSize: "12px" }}>{p.codigo || p.id.slice(0,8)}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 600 }}>{p.clientes?.nombre}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 700, color: "#dd4b39" }}>RD$ {(p.saldo_capital || 0).toLocaleString()}</td>
                  <td style={{ padding: "9px 12px", color: "#f39c12", fontWeight: 700 }}>{p.dias_mora}d</td>
                  <td style={{ padding: "9px 12px", color: "#f39c12" }}>RD$ {(p.mora_acumulada || 0).toLocaleString()}</td>
                  <td style={{ padding: "9px 12px", fontSize: "12px" }}>{p.cobrador_id || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}

      {incobrables.length === 0 && grave.length === 0 && (
        <Box title="Sin incobrables">
          <div style={{ textAlign: "center", padding: "40px", color: "#aaa" }}>
            <div style={{ fontSize: "48px" }}>✅</div>
            <p style={{ fontSize: "15px", color: "#555", marginTop: "12px" }}>¡Excelente! No tienes préstamos incobrables ni en mora grave.</p>
          </div>
        </Box>
      )}
    </div>
  );
}
