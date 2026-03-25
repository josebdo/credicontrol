"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { PAGOS, GASTOS } from "@/lib/data";

export default function CuadreDiarioPage() {
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0,10));
  const fechaDisplay = fecha.split("-").reverse().join("/");
  const pagosHoy = PAGOS.filter(p => p.activo && p.fecha === fechaDisplay);
  const gastosHoy = GASTOS.filter(g => g.fecha === fechaDisplay);
  const totalIngresos = pagosHoy.reduce((s, p) => s + p.monto, 0);
  const totalEgresos  = gastosHoy.reduce((s, g) => s + g.monto, 0);
  const efectivo = pagosHoy.filter(p => p.forma === "Efectivo").reduce((s, p) => s + p.monto, 0);
  const transferencia = pagosHoy.filter(p => p.forma === "Transferencia").reduce((s, p) => s + p.monto, 0);
  const saldoFinal = totalIngresos - totalEgresos;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <Box title="📅 Cuadre Diario" headerRight={
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ padding: "5px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px" }} />
          <button onClick={() => window.print()} style={{ padding: "5px 12px", background: "#605ca8", color: "#fff", border: "none", borderRadius: "3px", fontSize: "12px", cursor: "pointer" }}>🖨️ Imprimir</button>
        </div>
      }>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "16px" }}>
          {[
            { l: "Ingresos",     v: `RD$ ${totalIngresos.toLocaleString()}`, c: "#00a65a" },
            { l: "Egresos",      v: `RD$ ${totalEgresos.toLocaleString()}`,  c: "#dd4b39" },
            { l: "Efectivo",     v: `RD$ ${efectivo.toLocaleString()}`,      c: "#3c8dbc" },
            { l: "Saldo Final",  v: `RD$ ${saldoFinal.toLocaleString()}`,    c: saldoFinal >= 0 ? "#00a65a" : "#dd4b39" },
          ].map(s => (
            <div key={s.l} style={{ background: "#f9f9f9", borderRadius: "3px", borderLeft: `4px solid ${s.c}`, padding: "10px 14px" }}>
              <p style={{ fontSize: "11px", color: "#aaa", margin: "0 0 3px" }}>{s.l}</p>
              <p style={{ fontSize: "20px", fontWeight: 700, color: s.c, margin: 0 }}>{s.v}</p>
            </div>
          ))}
        </div>

        <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#555", margin: "16px 0 8px" }}>Cobros del día ({pagosHoy.length})</h4>
        {pagosHoy.length === 0
          ? <p style={{ color: "#aaa", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>Sin cobros para esta fecha</p>
          : <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
              <thead><tr style={{ background: "#f4f4f4" }}>
                {["Referencia", "Cliente", "Préstamo", "Capital", "Interés", "Mora", "Total", "Forma"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#777", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {pagosHoy.map(p => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
                    <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: "11px", color: "#605ca8" }}>{p.ref}</td>
                    <td style={{ padding: "8px 10px", fontWeight: 600 }}>{p.cliente}</td>
                    <td style={{ padding: "8px 10px", fontSize: "12px" }}>{p.prestamo_id}</td>
                    <td style={{ padding: "8px 10px", color: "#3c8dbc" }}>RD$ {p.capital.toLocaleString()}</td>
                    <td style={{ padding: "8px 10px", color: "#f39c12" }}>RD$ {p.interes.toLocaleString()}</td>
                    <td style={{ padding: "8px 10px", color: "#dd4b39" }}>{p.mora > 0 ? `RD$ ${p.mora}` : "—"}</td>
                    <td style={{ padding: "8px 10px", fontWeight: 700, color: "#00a65a" }}>RD$ {p.monto.toLocaleString()}</td>
                    <td style={{ padding: "8px 10px", fontSize: "12px" }}>{p.forma}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "#f4f4f4", fontWeight: 700 }}>
                  <td colSpan={6} style={{ padding: "8px 10px" }}>TOTAL COBRADO</td>
                  <td style={{ padding: "8px 10px", color: "#00a65a", fontSize: "15px" }}>RD$ {totalIngresos.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
        }

        <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#555", margin: "0 0 8px" }}>Gastos del día ({gastosHoy.length})</h4>
        {gastosHoy.length === 0
          ? <p style={{ color: "#aaa", fontSize: "13px" }}>Sin gastos registrados</p>
          : <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#f4f4f4" }}>
                {["Referencia", "Concepto", "Categoría", "Monto"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#777", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {gastosHoy.map(g => (
                  <tr key={g.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
                    <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: "11px", color: "#605ca8" }}>{g.ref}</td>
                    <td style={{ padding: "8px 10px", fontWeight: 600 }}>{g.concepto}</td>
                    <td style={{ padding: "8px 10px", fontSize: "12px" }}>{g.categoria}</td>
                    <td style={{ padding: "8px 10px", fontWeight: 700, color: "#dd4b39" }}>RD$ {g.monto.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        }

        <div style={{ marginTop: "16px", padding: "14px 18px", background: saldoFinal >= 0 ? "#dff0d8" : "#f2dede", borderRadius: "3px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontSize: "14px", color: saldoFinal >= 0 ? "#3c763d" : "#a94442" }}>Saldo Neto del Día</strong>
          <span style={{ fontSize: "22px", fontWeight: 700, color: saldoFinal >= 0 ? "#3c763d" : "#a94442" }}>RD$ {saldoFinal.toLocaleString()}</span>
        </div>
      </Box>
    </div>
  );
}
