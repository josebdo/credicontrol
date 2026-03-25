"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { PRESTAMOS, PAGOS } from "@/lib/data";

export default function CuadreRutaPage() {
  const [ruta, setRuta] = useState("Todas");
  const rutas = ["Todas",...Array.from(new Set(PRESTAMOS.map(p=>p.ruta)))];
  const prestamos = ruta==="Todas" ? PRESTAMOS : PRESTAMOS.filter(p=>p.ruta===ruta);
  const activos  = prestamos.filter(p=>p.estado==="Activo");
  const mora     = prestamos.filter(p=>p.estado==="Mora");
  const cartera  = prestamos.filter(p=>p.estado!=="Saldado").reduce((s,p)=>s+p.saldo,0);
  const cuotasEsp= prestamos.filter(p=>p.estado!=="Saldado").reduce((s,p)=>s+p.cuota,0);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
      <Box title="📍 Cuadre por Ruta de Cobro" headerRight={
        <div style={{display:"flex",gap:"8px"}}>
          <select value={ruta} onChange={e=>setRuta(e.target.value)} style={{padding:"5px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
            {rutas.map(r=><option key={r}>{r}</option>)}
          </select>
          <button onClick={()=>window.print()} style={{padding:"5px 12px",background:"#605ca8",color:"#fff",border:"none",borderRadius:"3px",fontSize:"12px",cursor:"pointer"}}>🖨️ Imprimir</button>
        </div>
      }>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"16px"}}>
          {[{l:"Préstamos activos",v:activos.length,c:"#00a65a"},{l:"En mora",v:mora.length,c:"#dd4b39"},{l:"Cartera total",v:`RD$ ${(cartera/1000).toFixed(0)}K`,c:"#3c8dbc"},{l:"Cuotas esperadas",v:`RD$ ${cuotasEsp.toLocaleString()}`,c:"#f39c12"}].map(s=>(
            <div key={s.l} style={{background:"#f9f9f9",borderRadius:"3px",borderLeft:`4px solid ${s.c}`,padding:"10px 14px"}}>
              <p style={{fontSize:"11px",color:"#aaa",margin:"0 0 3px"}}>{s.l}</p>
              <p style={{fontSize:"18px",fontWeight:700,color:s.c,margin:0}}>{s.v}</p>
            </div>
          ))}
        </div>
        {rutas.filter(r=>r!=="Todas").map(r=>{
          const ps = PRESTAMOS.filter(p=>p.ruta===r&&p.estado!=="Saldado");
          if(ruta!=="Todas"&&r!==ruta) return null;
          return (
            <div key={r} style={{marginBottom:"16px"}}>
              <h4 style={{fontSize:"13px",fontWeight:700,color:"#555",margin:"0 0 8px",padding:"6px 10px",background:"#f4f4f4",borderRadius:"3px"}}>📍 Ruta {r} — {ps.length} préstamos</h4>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#f9f9f9"}}>{["ID","Cliente","Saldo","Cuota","Días Mora","Cobrador","Estado"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:"11px",fontWeight:700,color:"#777",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
                <tbody>{ps.map(p=>(
                  <tr key={p.id} style={{borderBottom:"1px solid #f4f4f4",background:p.dias_mora>0?"#fffbf0":""}}>
                    <td style={{padding:"8px 10px",fontSize:"12px",color:"#aaa"}}>{p.id}</td>
                    <td style={{padding:"8px 10px",fontWeight:600}}>{p.cliente}</td>
                    <td style={{padding:"8px 10px",fontWeight:700,color:"#dd4b39"}}>RD$ {p.saldo.toLocaleString()}</td>
                    <td style={{padding:"8px 10px",color:"#00a65a"}}>RD$ {p.cuota.toLocaleString()}</td>
                    <td style={{padding:"8px 10px",color:p.dias_mora>0?"#dd4b39":"#aaa",fontWeight:p.dias_mora>0?700:400}}>{p.dias_mora>0?`${p.dias_mora}d`:"—"}</td>
                    <td style={{padding:"8px 10px",fontSize:"12px"}}>{p.cobrador}</td>
                    <td style={{padding:"8px 10px"}}><span style={{fontSize:"11px",fontWeight:700,padding:"2px 8px",borderRadius:"10px",background:p.estado==="Activo"?"#dff0d8":"#f2dede",color:p.estado==="Activo"?"#3c763d":"#a94442"}}>{p.estado}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          );
        })}
      </Box>
    </div>
  );
}
