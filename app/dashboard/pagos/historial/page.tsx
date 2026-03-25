"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Box } from "@/components/UI";
import TicketImpresion from "@/components/TicketImpresion";
import { useAuth } from "@/lib/AuthContext";
import { getPagos } from "@/lib/data";

export default function HistorialPagosPage() {
  return <ProtectedRoute module="pagos" action="ver"><HistorialContent /></ProtectedRoute>;
}

function HistorialContent() {
  const { empresa } = useAuth();
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buscar, setBuscar] = useState("");
  const [filtroForma, setFiltro] = useState("todas");
  const [ticket, setTicket] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getPagos();
      setLista(data);
    } catch (error) {
      console.error("Error fetching pagos:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtrados = lista.filter(p => {
    const q = buscar.toLowerCase().replace(/[-\s]/g, "");
    const matchQ = !buscar || 
      (p.referencia || "").toLowerCase().includes(buscar.toLowerCase()) ||
      (p.cliente || "").toLowerCase().includes(buscar.toLowerCase()) ||
      (p.cedula || "").replace(/[-\s]/g, "").includes(q);
    const matchF = filtroForma === "todas" || p.forma_pago === filtroForma.toLowerCase();
    return matchQ && matchF;
  });

  const totalMonto = filtrados.reduce((s, p) => s + (p.monto || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
        {[
          { l: "Total Pagos", v: filtrados.length, c: "#3c8dbc" },
          { l: "Monto Total", v: `RD$ ${totalMonto.toLocaleString()}`, c: "#00a65a" },
          { l: "Este mes", v: filtrados.filter(p => p.fecha.endsWith("2026")).length, c: "#f39c12" },
          { l: "Con mora", v: filtrados.filter(p => p.mora > 0).length, c: "#dd4b39" },
        ].map(s => (
          <div key={s.l} style={{ background: "#fff", borderRadius: "3px", boxShadow: "0 1px 1px rgba(0,0,0,0.1)", borderLeft: `4px solid ${s.c}`, padding: "12px 15px" }}>
            <p style={{ fontSize: "12px", color: "#999", margin: "0 0 4px" }}>{s.l}</p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: "#333", margin: 0 }}>{s.v}</p>
          </div>
        ))}
      </div>

      <Box title="Historial de Pagos" headerRight={
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            placeholder="Buscar por referencia, cliente o cédula..."
            value={buscar} onChange={e => setBuscar(e.target.value)}
            style={{ padding: "5px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", width: "280px" }}
          />
          <select value={filtroForma} onChange={e => setFiltro(e.target.value)}
            style={{ padding: "5px 8px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", background: "#fff" }}>
            <option value="todas">Todas las formas</option>
            <option>Efectivo</option>
            <option>Transferencia</option>
            <option>Cheque</option>
            <option>Tarjeta</option>
          </select>
        </div>
      }>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f4f4f4" }}>
                {["Referencia", "Fecha", "Cliente", "Préstamo", "Cuota", "Capital", "Interés", "Mora", "Total", "Forma", "Acciones"].map(h => (
                  <th key={h} style={{ padding: "9px 10px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#777", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f4f4f4" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f9f9f9")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}>
                  <td style={{ padding: "9px 10px", fontFamily: "monospace", fontSize: "11px", color: "#605ca8", fontWeight: 600 }}>{p.referencia}</td>
                  <td style={{ padding: "9px 10px", fontSize: "12px", color: "#777", whiteSpace: "nowrap" }}>{p.fecha_pago}</td>
                  <td style={{ padding: "9px 10px" }}>
                    <div style={{ fontWeight: 600, fontSize: "13px", color: "#333" }}>{p.cliente}</div>
                    <div style={{ fontSize: "11px", color: "#aaa" }}>{p.cedula}</div>
                  </td>
                  <td style={{ padding: "9px 10px", fontSize: "12px", color: "#555" }}>{p.prestamo_id}</td>
                  <td style={{ padding: "9px 10px", fontSize: "12px", color: "#777" }}>{p.cuota_num}</td>
                  <td style={{ padding: "9px 10px", fontSize: "12px", color: "#333" }}>RD$ {(p.capital || 0).toLocaleString()}</td>
                  <td style={{ padding: "9px 10px", fontSize: "12px", color: "#f39c12" }}>RD$ {(p.interes || 0).toLocaleString()}</td>
                  <td style={{ padding: "9px 10px", fontSize: "12px", color: (p.mora || 0) > 0 ? "#dd4b39" : "#aaa" }}>
                    {(p.mora || 0) > 0 ? `RD$ ${p.mora}` : "—"}
                  </td>
                  <td style={{ padding: "9px 10px", fontWeight: 700, fontSize: "13px", color: "#00a65a", whiteSpace: "nowrap" }}>
                    RD$ {(p.monto || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "9px 10px" }}>
                    <span style={{ fontSize: "11px", background: "#f4f4f4", color: "#555", padding: "2px 7px", borderRadius: "3px", textTransform: "capitalize" }}>{p.forma_pago}</span>
                  </td>
                  <td style={{ padding: "9px 10px" }}>
                    <button onClick={() => setTicket(p)}
                      style={{ padding: "4px 8px", background: "#f39c12", color: "#fff", border: "none", borderRadius: "3px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}>
                      🖨️ Recibo
                    </button>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr><td colSpan={11} style={{ padding: "30px", textAlign: "center", color: "#ccc", fontSize: "13px" }}>No se encontraron pagos</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {buscar && (
          <p style={{ fontSize: "12px", color: "#aaa", marginTop: "8px" }}>
            {filtrados.length} resultado(s) para "<strong>{buscar}</strong>"
          </p>
        )}
      </Box>

      {ticket && (
        <TicketImpresion
          onClose={() => setTicket(null)}
          datos={{
            tipo: "pago",
            empresa: {
              nombre: empresa?.nombre ?? "CrediControl",
              dueno: empresa?.dueno ?? "",
              telefono: empresa?.telefono ?? "",
              direccion: empresa?.direccion ?? ""
            },
            prestamo_id: ticket.prestamo_id,
            fecha: ticket.fecha_pago,
            cliente: ticket.cliente,
            cedula: ticket.cedula,
            cuota_num: ticket.cuota_num,
            pago_total: `RD$ ${(ticket.monto || 0).toLocaleString()}`,
            pago_capital: `RD$ ${(ticket.capital || 0).toLocaleString()}`,
            pago_interes: `RD$ ${(ticket.interes || 0).toLocaleString()}`,
            pago_mora: (ticket.mora || 0) > 0 ? `RD$ ${ticket.mora}` : "RD$ 0.00",
            efectividad: ticket.fecha_pago,
          }}
        />
      )}
    </div>
  );
}
