"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { PRESTAMOS } from "@/lib/data";
import { useAuth } from "@/lib/AuthContext";

export default function PlanPagosPage() {
  const { empresa } = useAuth();
  const [buscar, setBuscar] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const activos = PRESTAMOS.filter(p => p.estado !== "Saldado");
  const filtrados = buscar ? activos.filter(p => p.cliente.toLowerCase().includes(buscar.toLowerCase()) || p.id.includes(buscar)) : activos;
  const prestamo = PRESTAMOS.find(p => p.id === selectedId);

  // Generate amortization table
  const amortizacion = prestamo ? Array.from({ length: prestamo.num_cuotas }, (_, i) => {
    const r = prestamo.tasa / 100;
    const n = prestamo.num_cuotas;
    const C = (prestamo.monto * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const saldoAnterior = prestamo.monto * Math.pow(1 + r, i) - C * ((Math.pow(1 + r, i) - 1) / r);
    const interes = saldoAnterior * r;
    const capital = C - interes;
    const saldo = Math.max(0, saldoAnterior - capital);
    const pagada = i < prestamo.pagadas;
    return { num: i + 1, capital: Math.round(capital), interes: Math.round(interes), cuota: Math.round(C), saldo: Math.round(saldo), pagada };
  }) : [];

  function print() { window.print(); }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <Box title="📋 Plan de Pagos">
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "4px" }}>Seleccionar préstamo</label>
          <input value={buscar} onChange={e => { setBuscar(e.target.value); setSelectedId(""); }} placeholder="Nombre del cliente o ID del préstamo..."
            style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", outline: "none", boxSizing: "border-box" as const }} />
          {buscar && !selectedId && (
            <div style={{ border: "1px solid #eee", borderRadius: "3px", marginTop: "4px", maxHeight: "160px", overflowY: "auto", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              {filtrados.map(p => (
                <div key={p.id} onClick={() => { setSelectedId(p.id); setBuscar(`${p.cliente} — ${p.id}`); }}
                  style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f4f4f4" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f0f7ff")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}>
                  <strong style={{ fontSize: "13px" }}>{p.id} — {p.cliente}</strong>
                  <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>Saldo: RD$ {p.saldo.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Box>

      {prestamo && (
        <div style={{ background: "#fff", borderRadius: "3px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: "3px solid #3c8dbc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>Plan de Pagos — {prestamo.id}</h3>
              <p style={{ fontSize: "12px", color: "#aaa", margin: "3px 0 0" }}>{prestamo.cliente} · {prestamo.num_cuotas} cuotas · {prestamo.tasa}% mensual</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ textAlign: "center", padding: "6px 14px", background: "#dff0d8", borderRadius: "3px" }}>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#3c763d", margin: 0 }}>{prestamo.pagadas}</p>
                <p style={{ fontSize: "10px", color: "#3c763d", margin: 0 }}>Pagadas</p>
              </div>
              <div style={{ textAlign: "center", padding: "6px 14px", background: "#fcf8e3", borderRadius: "3px" }}>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#8a6d3b", margin: 0 }}>{prestamo.num_cuotas - prestamo.pagadas}</p>
                <p style={{ fontSize: "10px", color: "#8a6d3b", margin: 0 }}>Pendientes</p>
              </div>
              <button onClick={print} style={{ padding: "6px 14px", background: "#605ca8", color: "#fff", border: "none", borderRadius: "3px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>🖨️ Imprimir</button>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f4f4f4" }}>
                  {["#", "Capital", "Interés", "Cuota", "Saldo", "Estado"].map(h => (
                    <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#777", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {amortizacion.map(row => (
                  <tr key={row.num} style={{ borderBottom: "1px solid #f4f4f4", background: row.pagada ? "#f8fff8" : row.num === prestamo.pagadas + 1 ? "#fff8e1" : "#fff" }}>
                    <td style={{ padding: "9px 14px", fontWeight: 700, color: "#333" }}>{row.num}</td>
                    <td style={{ padding: "9px 14px", color: "#3c8dbc" }}>RD$ {row.capital.toLocaleString()}</td>
                    <td style={{ padding: "9px 14px", color: "#f39c12" }}>RD$ {row.interes.toLocaleString()}</td>
                    <td style={{ padding: "9px 14px", fontWeight: 700 }}>RD$ {row.cuota.toLocaleString()}</td>
                    <td style={{ padding: "9px 14px", color: "#dd4b39" }}>RD$ {row.saldo.toLocaleString()}</td>
                    <td style={{ padding: "9px 14px" }}>
                      {row.pagada
                        ? <span style={{ fontSize: "11px", background: "#dff0d8", color: "#3c763d", padding: "2px 8px", borderRadius: "10px", fontWeight: 700 }}>✓ Pagada</span>
                        : row.num === prestamo.pagadas + 1
                          ? <span style={{ fontSize: "11px", background: "#fcf8e3", color: "#8a6d3b", padding: "2px 8px", borderRadius: "10px", fontWeight: 700 }}>👉 Próxima</span>
                          : <span style={{ fontSize: "11px", background: "#f4f4f4", color: "#aaa", padding: "2px 8px", borderRadius: "10px" }}>Pendiente</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "#f4f4f4", fontWeight: 700 }}>
                  <td style={{ padding: "9px 14px" }}>Total</td>
                  <td style={{ padding: "9px 14px", color: "#3c8dbc" }}>RD$ {amortizacion.reduce((s, r) => s + r.capital, 0).toLocaleString()}</td>
                  <td style={{ padding: "9px 14px", color: "#f39c12" }}>RD$ {amortizacion.reduce((s, r) => s + r.interes, 0).toLocaleString()}</td>
                  <td style={{ padding: "9px 14px" }}>RD$ {(amortizacion[0]?.cuota ?? 0) * prestamo.num_cuotas}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
