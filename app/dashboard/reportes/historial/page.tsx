"use client";
import { useState, useEffect } from "react";
import { Box, Badge, Btn } from "@/components/UI";
import { getPrestamos } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function HistorialPage() {
  const [prestamos, setPrestamos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getPrestamos();
        setPrestamos(data);
      } catch (error) {
        console.error("Error fetching prestamos for report:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Simple aggregation for charts (last 6 months - mock-ish based on real data for now)
  const chartData = [
    { mes:"Oct",  otorgados:8,  saldados:3, activos:42 },
    { mes:"Nov",  otorgados:12, saldados:5, activos:49 },
    { mes:"Dic",  otorgados:6,  saldados:4, activos:51 },
    { mes:"Ene",  otorgados:10, saldados:6, activos:55 },
    { mes:"Feb",  otorgados:7,  saldados:4, activos:58 },
    { mes:"Mar",  otorgados:prestamos.filter(p => !p.cerrado).length, saldados:prestamos.filter(p => p.cerrado).length, activos:prestamos.filter(p => !p.cerrado).length },
  ];

  if (loading) return <div className="p-8 text-center">Cargando reporte...</div>;

  return (
    <div>
      <div style={{ display:"flex", gap:"8px", marginBottom:"15px" }}>
        <Btn color="blue" onClick={() => window.print()}>Exportar PDF</Btn>
        <Btn color="green">Exportar Excel</Btn>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"15px", marginBottom:"15px" }}>
        <Box title="Préstamos por Mes">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ left:-10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f4" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize:11, fill:"#aaa" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:"#aaa" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize:"12px", border:"1px solid #ddd" }} />
              <Bar dataKey="otorgados" fill="#3c8dbc" name="Otorgados" maxBarSize={30} />
              <Bar dataKey="saldados"  fill="#00a65a" name="Saldados"  maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Box title="Evolución de Cartera">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ left:-10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f4" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize:11, fill:"#aaa" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:"#aaa" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize:"12px", border:"1px solid #ddd" }} />
              <Line type="monotone" dataKey="activos" stroke="#f39c12" strokeWidth={2} dot={{ r:3 }} name="Activos" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </div>

      <Box title="Historial de Préstamos">
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f4f4f4" }}>
                {["ID","Cliente","Monto","Fecha","Saldo Pendiente","Cuotas","Estado"].map(h=>(
                  <th key={h} style={{ padding:"8px 12px",textAlign:"left",fontSize:"12px",fontWeight:700,color:"#777",textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prestamos.map(r=>(
                <tr key={r.id} style={{ borderBottom:"1px solid #f4f4f4" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="#f9f9f9")}
                  onMouseLeave={e=>(e.currentTarget.style.background="")}>
                  <td style={{ padding:"8px 12px",fontSize:"12px",color:"#aaa" }}>{r.codigo || r.id.slice(0,8)}</td>
                  <td style={{ padding:"8px 12px",fontWeight:600,color:"#333" }}>{r.clientes?.nombre || "—"}</td>
                  <td style={{ padding:"8px 12px",fontSize:"13px" }}>RD$ {(r.monto || 0).toLocaleString()}</td>
                  <td style={{ padding:"8px 12px",fontSize:"12px",color:"#777" }}>{r.fecha_inicio}</td>
                  <td style={{ padding:"8px 12px",fontWeight:700,color:(r.saldo_capital || 0) === 0 ?"#00a65a":"#dd4b39" }}>RD$ {(r.saldo_capital || 0).toLocaleString()}</td>
                  <td style={{ padding:"8px 12px",fontSize:"12px" }}>{(r.cuotas_pagadas || 0)}/{(r.cuotas || 0)}</td>
                  <td style={{ padding:"8px 12px" }}><Badge color={r.estado==="activo"?"green":r.estado==="mora"?"red":"blue"}>{r.estado}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Box>
    </div>
  );
}
