"use client";
import { useState, useEffect } from "react";
import { Box } from "@/components/UI";
import { getPagos, getPrestamos } from "@/lib/data";

export default function ReportePagosPrestamosPage() {
  const [mesF, setMesF] = useState("03/2026");
  const [ruta, setRuta] = useState("Todas");
  const [rawPagos, setRawPagos] = useState<any[]>([]);
  const [rawPrestamos, setRawPrestamos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [p, pr] = await Promise.all([getPagos(), getPrestamos()]);
        setRawPagos(p);
        setRawPrestamos(pr);
      } catch (error) {
        console.error("Error fetching data for report:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const pagos = rawPagos.filter(p => p.activo && (!mesF || (p.fecha_pago || "").slice(3, 10).replace(/-/g, '/') === mesF));
  // Note: the schema uses fecha_pago YYYY-MM-DD. The UI expects MM/YYYY or similar.
  // Let's adjust the filtering logic to be more robust.
  const filtrados = rawPagos.filter(p => {
    if (!p.activo) return false;
    const dateStr = p.fecha_pago || ""; // YYYY-MM-DD
    const [y, m, d] = dateStr.split("-");
    const itemMes = `${m}/${y}`;
    if (mesF && itemMes !== mesF) return false;
    
    if (ruta !== "Todas") {
      const pr = rawPrestamos.find(x => x.id === p.prestamo_id);
      if (pr?.ruta !== ruta) return false;
    }
    return true;
  });

  const rutas = ["Todas", ...Array.from(new Set(rawPrestamos.map(p => p.ruta))).filter(Boolean)];
  
  const totalMonto = filtrados.reduce((s, p) => s + (p.monto || 0), 0);
  const totalCap = filtrados.reduce((s, p) => s + (p.capital || 0), 0);
  const totalInt = filtrados.reduce((s, p) => s + (p.interes || 0), 0);
  const totalMora = filtrados.reduce((s, p) => s + (p.mora || 0), 0);

  if (loading) return <div className="p-8 text-center">Cargando reporte...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
        {[
          { l: "Total Cobrado", v: `RD$ ${totalMonto.toLocaleString()}`, c: "#00a65a" },
          { l: "Capital",       v: `RD$ ${totalCap.toLocaleString()}`,   c: "#3c8dbc" },
          { l: "Interés",       v: `RD$ ${totalInt.toLocaleString()}`,   c: "#f39c12" },
          { l: "Mora",          v: `RD$ ${totalMora.toLocaleString()}`,  c: "#dd4b39" },
        ].map(s => (
          <div key={s.l} style={{ background: "#fff", borderRadius: "3px", boxShadow: "0 1px 1px rgba(0,0,0,0.1)", borderLeft: `4px solid ${s.c}`, padding: "12px 15px" }}>
            <p style={{ fontSize: "12px", color: "#aaa", margin: "0 0 3px" }}>{s.l}</p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: "#333", margin: 0 }}>{s.v}</p>
          </div>
        ))}
      </div>
      <Box title="Reporte de Pagos de Préstamos" headerRight={
        <div style={{ display: "flex", gap: "8px" }}>
          <input placeholder="MM/YYYY" value={mesF} onChange={e => setMesF(e.target.value)} style={{ padding: "5px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", width: "120px" }} />
          <select value={ruta} onChange={e => setRuta(e.target.value)} style={{ padding: "5px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", background: "#fff" }}>
            {rutas.map(r => <option key={r}>{r}</option>)}
          </select>
          <button onClick={() => window.print()} style={{ padding: "5px 12px", background: "#605ca8", color: "#fff", border: "none", borderRadius: "3px", fontSize: "12px", cursor: "pointer" }}>🖨️ Imprimir</button>
        </div>
      }>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#f4f4f4" }}>
            {["Referencia", "Fecha", "Cliente", "Préstamo", "Capital", "Interés", "Mora", "Total", "Forma"].map(h => (
              <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#777", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtrados.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
                <td style={{ padding: "9px 12px", fontFamily: "monospace", fontSize: "11px", color: "#605ca8" }}>{p.referencia || p.id.slice(0,8)}</td>
                <td style={{ padding: "9px 12px", fontSize: "12px", color: "#777" }}>{p.fecha_pago}</td>
                <td style={{ padding: "9px 12px", fontWeight: 600, fontSize: "13px" }}>{p.clientes?.nombre || "—"}</td>
                <td style={{ padding: "9px 12px", fontSize: "12px" }}>{p.prestamos?.codigo || p.prestamo_id.slice(0,8)}</td>
                <td style={{ padding: "9px 12px", fontSize: "12px", color: "#3c8dbc" }}>RD$ {(p.capital || 0).toLocaleString()}</td>
                <td style={{ padding: "9px 12px", fontSize: "12px", color: "#f39c12" }}>RD$ {(p.interes || 0).toLocaleString()}</td>
                <td style={{ padding: "9px 12px", fontSize: "12px", color: p.mora > 0 ? "#dd4b39" : "#aaa" }}>{(p.mora || 0) > 0 ? `RD$ ${p.mora}` : "—"}</td>
                <td style={{ padding: "9px 12px", fontWeight: 700, color: "#00a65a" }}>RD$ {(p.monto || 0).toLocaleString()}</td>
                <td style={{ padding: "9px 12px", fontSize: "12px" }}>{p.metodo_pago}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#f8f8f8", fontWeight: 700 }}>
              <td colSpan={4} style={{ padding: "9px 12px", fontSize: "12px" }}>TOTALES ({filtrados.length} pagos)</td>
              <td style={{ padding: "9px 12px", color: "#3c8dbc" }}>RD$ {totalCap.toLocaleString()}</td>
              <td style={{ padding: "9px 12px", color: "#f39c12" }}>RD$ {totalInt.toLocaleString()}</td>
              <td style={{ padding: "9px 12px", color: "#dd4b39" }}>RD$ {totalMora.toLocaleString()}</td>
              <td style={{ padding: "9px 12px", color: "#00a65a" }}>RD$ {totalMonto.toLocaleString()}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </Box>
    </div>
  );
}
