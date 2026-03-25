"use client";
import { useState, useEffect } from "react";
import { Box, Badge, Btn, Table } from "@/components/UI";
import Link from "next/link";
import { getGarantias } from "@/lib/data";

export default function GarantiasPage() {
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getGarantias();
      setLista(data);
    } catch (error) {
      console.error("Error fetching garantias:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display:"flex", gap:"8px", marginBottom:"15px" }}>
        <Link href="/dashboard/garantias/nueva"><Btn color="green">+ Registrar Garantía</Btn></Link>
        <Link href="/dashboard/garantias/pagare"><Btn color="blue">Pagaré Notarial Auto</Btn></Link>
        <Link href="/dashboard/garantias/bienes"><Btn color="yellow">Bienes Registrados</Btn></Link>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"15px", marginBottom:"15px" }}>
        {[
          { label:"Garantías Activas",    value: lista.filter(g => g.estado === "activa").length, color:"#00a65a" },
          { label:"Vehículos",            value: lista.filter(g => g.tipo === "Vehículo").length, color:"#3c8dbc" },
          { label:"Inmuebles",            value: lista.filter(g => ["Vivienda", "Solar"].includes(g.tipo)).length, color:"#f39c12" },
          { label:"Valor Total Aprox.",   value: `RD$ ${(lista.reduce((s, g) => s + (g.valor_estimado || 0), 0) / 1000000).toFixed(1)}M`,  color:"#605ca8" },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", borderRadius:"3px", boxShadow:"0 1px 1px rgba(0,0,0,0.1)", borderLeft:`4px solid ${s.color}`, padding:"12px 15px" }}>
            <p style={{ fontSize:"12px", color:"#999", margin:"0 0 4px" }}>{s.label}</p>
            <p style={{ fontSize:"20px", fontWeight:700, color:"#333", margin:0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <Box title="🛡️ Garantías Registradas">
        <Table
          heads={["ID","Cliente","Tipo","Descripción","Valor Aprox.","Préstamo","Estado","Acciones"]}
          rows={lista.map(g => [
            <span key={g.id} style={{ color:"#aaa", fontSize:"12px" }}>{g.id}</span>,
            <strong key={g.id + "_c"} style={{ color:"#333" }}>{g.cliente}</strong>,
            <Badge key={g.id + "_t"} color={g.tipo==="Vehículo"?"blue":g.tipo==="Vivienda"?"green":g.tipo==="Solar"?"yellow":"blue"}>{g.tipo}</Badge>,
            g.descripcion,
            <span key={g.id + "_v"} style={{ fontWeight:700, color:"#3c8dbc" }}>RD$ {(g.valor_estimado || 0).toLocaleString()}</span>,
            <span key={g.id + "_p"} style={{ color:"#777", fontSize:"12px" }}>{g.prestamo_id}</span>,
            <Badge key={g.id + "_s"} color={g.estado==="activa"?"green":"blue"}>{g.estado}</Badge>,
            <div key={g.id + "_a"} style={{ display:"flex", gap:"4px" }}>
              <button style={{ background:"#3c8dbc",color:"#fff",border:"none",borderRadius:"3px",padding:"3px 8px",fontSize:"11px",cursor:"pointer" }}>Ver</button>
              <button style={{ background:"#f39c12",color:"#fff",border:"none",borderRadius:"3px",padding:"3px 8px",fontSize:"11px",cursor:"pointer" }}>Pagaré</button>
            </div>,
          ])}
        />
      </Box>
    </div>
  );
}
