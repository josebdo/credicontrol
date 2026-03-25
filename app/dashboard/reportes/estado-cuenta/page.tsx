"use client";
import { useState, useEffect } from "react";
import { Box } from "@/components/UI";
import { getPrestamos, getPagos } from "@/lib/data";
import { CLASIFICACIONES, calcularNivel } from "@/lib/clasificacion";

export default function EstadoCuentaPage() {
  const [buscar, setBuscar] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [allPrestamos, setAllPrestamos] = useState<any[]>([]);
  const [allPagos, setAllPagos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [pr, pa] = await Promise.all([getPrestamos(), getPagos()]);
        setAllPrestamos(pr);
        setAllPagos(pa);
      } catch (error) {
        console.error("Error fetching data for report:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtrados = allPrestamos.filter(p => 
    (p.clientes?.nombre || "").toLowerCase().includes(buscar.toLowerCase()) || 
    (p.codigo || "").toLowerCase().includes(buscar.toLowerCase()) ||
    p.id.includes(buscar)
  );

  const prestamo = allPrestamos.find(p => p.id === selectedId);
  const pagosDelPrestamo = prestamo ? allPagos.filter(p => p.prestamo_id === prestamo.id && p.activo) : [];
  
  const diasMora = prestamo?.dias_mora || 0;
  const nivel = prestamo ? calcularNivel(diasMora, 1, diasMora > 0 ? 1 : 0) : "A+";
  const def = CLASIFICACIONES[nivel as keyof typeof CLASIFICACIONES] || CLASIFICACIONES["A+"];

  if (loading) return <div className="p-8 text-center">Cargando reporte...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <Box title="📊 Estado de Cuenta del Cliente">
        <input value={buscar} onChange={e => { setBuscar(e.target.value); setSelectedId(""); }} placeholder="Buscar por nombre o ID del préstamo..."
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", outline: "none", marginBottom: "12px", boxSizing: "border-box" as const }} />
        {buscar && !selectedId && (
          <div style={{ border: "1px solid #eee", borderRadius: "3px", maxHeight: "200px", overflowY: "auto" }}>
            {filtrados.map(p => (
              <div key={p.id} onClick={() => { setSelectedId(p.id); setBuscar(`${p.clientes?.nombre} — ${p.codigo || p.id.slice(0,8)}`); }}
                style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f4f4f4" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f0f7ff")}
                onMouseLeave={e => (e.currentTarget.style.background = "")}>
                <strong>{p.codigo || p.id.slice(0,8)} — {p.clientes?.nombre}</strong>
                <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>Saldo: RD$ {(p.saldo_capital || 0).toLocaleString()} · {p.estado}</p>
              </div>
            ))}
          </div>
        )}
      </Box>

      {prestamo && (
        <div style={{ background: "#fff", borderRadius: "3px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `3px solid ${def.color}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, margin: 0 }}>{prestamo.clientes?.nombre}</h3>
              <p style={{ fontSize: "12px", color: "#aaa", margin: "3px 0 0" }}>Cédula: {prestamo.clientes?.cedula} · Préstamo: {prestamo.codigo || prestamo.id.slice(0,8)}</p>
            </div>
            <div style={{ textAlign: "center", padding: "10px 18px", background: def.bgColor, borderRadius: "6px" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, color: def.color }}>{nivel}</div>
              <div style={{ fontSize: "11px", color: def.color, fontWeight: 700 }}>{def.label}</div>
            </div>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "12px", marginBottom: "20px" }}>
              {[
                { l: "Monto", v: `RD$ ${(prestamo.monto || 0).toLocaleString()}` },
                { l: "Cuota", v: `RD$ ${(prestamo.valor_cuota || 0).toLocaleString()}` },
                { l: "Saldo", v: `RD$ ${(prestamo.saldo_capital || 0).toLocaleString()}`, c: "#dd4b39" },
                { l: "Días mora", v: (prestamo.dias_mora || 0) > 0 ? `${prestamo.dias_mora}d` : "Al día", c: (prestamo.dias_mora || 0) > 0 ? "#dd4b39" : "#00a65a" },
                { l: "Mora acum.", v: (prestamo.mora_acumulada || 0) > 0 ? `RD$ ${(prestamo.mora_acumulada || 0).toLocaleString()}` : "Sin mora", c: (prestamo.mora_acumulada || 0) > 0 ? "#dd4b39" : "#00a65a" },
              ].map(r => (
                <div key={r.l} style={{ textAlign: "center", padding: "10px", background: "#f9f9f9", borderRadius: "3px" }}>
                  <p style={{ fontSize: "16px", fontWeight: 700, color: (r as any).c ?? "#333", margin: 0 }}>{r.v}</p>
                  <p style={{ fontSize: "10px", color: "#aaa", margin: 0 }}>{r.l}</p>
                </div>
              ))}
            </div>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#555", margin: "0 0 12px" }}>Historial de Pagos ({pagosDelPrestamo.length})</h4>
            {pagosDelPrestamo.length === 0
              ? <p style={{ color: "#aaa", fontSize: "13px", textAlign: "center", padding: "20px" }}>Sin pagos registrados</p>
              : <table style={{ width: "100%", borderCollapse:"collapse" }}>
                  <thead><tr style={{ background: "#f4f4f4" }}>
                    {["Referencia", "Fecha", "Cuota", "Capital", "Interés", "Mora", "Total", "Forma"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#777", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {pagosDelPrestamo.map(p => (
                      <tr key={p.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
                        <td style={{ padding: "8px 12px", fontFamily: "monospace", fontSize: "11px", color: "#605ca8" }}>{p.referencia || p.id.slice(0,8)}</td>
                        <td style={{ padding: "8px 12px", fontSize: "12px", color: "#777" }}>{p.fecha_pago}</td>
                        <td style={{ padding: "8px 12px", fontSize: "12px" }}>{p.cuota_numero}/{prestamo.cuotas}</td>
                        <td style={{ padding: "8px 12px", fontSize: "12px", color: "#3c8dbc" }}>RD$ {(p.capital || 0).toLocaleString()}</td>
                        <td style={{ padding: "8px 12px", fontSize: "12px", color: "#f39c12" }}>RD$ {(p.interes || 0).toLocaleString()}</td>
                        <td style={{ padding: "8px 12px", fontSize: "12px", color: (p.mora || 0) > 0 ? "#dd4b39" : "#aaa" }}>{(p.mora || 0) > 0 ? `RD$ ${p.mora}` : "—"}</td>
                        <td style={{ padding: "8px 12px", fontWeight: 700, color: "#00a65a" }}>RD$ {(p.monto || 0).toLocaleString()}</td>
                        <td style={{ padding: "8px 12px", fontSize: "12px" }}>{p.metodo_pago}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
            <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
              <button onClick={() => window.print()} style={{ padding: "7px 16px", background: "#605ca8", color: "#fff", border: "none", borderRadius: "3px", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}>🖨️ Imprimir Estado</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
