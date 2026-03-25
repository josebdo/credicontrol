"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { PAGOS, PRESTAMOS } from "@/lib/data";

export default function CuadrePagoPage() {
  const [cobrador, setCobrador] = useState("Todos");
  const cobradores = ["Todos",...Array.from(new Set(PAGOS.map(p=>p.cobrador).filter(Boolean)))];
  const pagos = cobrador==="Todos" ? PAGOS.filter(p=>p.activo) : PAGOS.filter(p=>p.activo&&p.cobrador===cobrador);
  const totalCobrado = pagos.reduce((s,p)=>s+p.monto,0);
  const totalCapital = pagos.reduce((s,p)=>s+p.capital,0);
  const totalInteres = pagos.reduce((s,p)=>s+p.interes,0);
  const totalMora    = pagos.reduce((s,p)=>s+p.mora,0);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
      <Box title="📊 Cuadre de Pagos por Cobrador" headerRight={
        <select value={cobrador} onChange={e=>setCobrador(e.target.value)} style={{padding:"5px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
          {cobradores.map(c=><option key={c}>{c}</option>)}
        </select>
      }>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"16px"}}>
          {[{l:"Total cobrado",v:`RD$ ${totalCobrado.toLocaleString()}`,c:"#00a65a"},{l:"Capital",v:`RD$ ${totalCapital.toLocaleString()}`,c:"#3c8dbc"},{l:"Interés",v:`RD$ ${totalInteres.toLocaleString()}`,c:"#f39c12"},{l:"Mora",v:`RD$ ${totalMora.toLocaleString()}`,c:"#dd4b39"}].map(s=>(
            <div key={s.l} style={{background:"#f9f9f9",borderRadius:"3px",borderLeft:`4px solid ${s.c}`,padding:"10px 14px"}}>
              <p style={{fontSize:"11px",color:"#aaa",margin:"0 0 3px"}}>{s.l}</p>
              <p style={{fontSize:"18px",fontWeight:700,color:s.c,margin:0}}>{s.v}</p>
            </div>
          ))}
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#f4f4f4"}}>{["Referencia","Fecha","Cliente","Préstamo","Capital","Interés","Mora","Total","Cobrador","Forma"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",fontSize:"11px",fontWeight:700,color:"#777",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
          <tbody>{pagos.map(p=>(
            <tr key={p.id} style={{borderBottom:"1px solid #f4f4f4"}}>
              <td style={{padding:"8px 10px",fontFamily:"monospace",fontSize:"11px",color:"#605ca8"}}>{p.ref}</td>
              <td style={{padding:"8px 10px",fontSize:"12px",color:"#777"}}>{p.fecha}</td>
              <td style={{padding:"8px 10px",fontWeight:600,fontSize:"13px"}}>{p.cliente}</td>
              <td style={{padding:"8px 10px",fontSize:"12px"}}>{p.prestamo_id}</td>
              <td style={{padding:"8px 10px",color:"#3c8dbc"}}>RD$ {p.capital.toLocaleString()}</td>
              <td style={{padding:"8px 10px",color:"#f39c12"}}>RD$ {p.interes.toLocaleString()}</td>
              <td style={{padding:"8px 10px",color:p.mora>0?"#dd4b39":"#aaa"}}>{p.mora>0?`RD$ ${p.mora}`:"—"}</td>
              <td style={{padding:"8px 10px",fontWeight:700,color:"#00a65a"}}>RD$ {p.monto.toLocaleString()}</td>
              <td style={{padding:"8px 10px",fontSize:"12px"}}>{p.cobrador}</td>
              <td style={{padding:"8px 10px",fontSize:"12px"}}>{p.forma}</td>
            </tr>
          ))}</tbody>
        </table>
      </Box>
    </div>
  );
}
