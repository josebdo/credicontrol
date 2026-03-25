"use client";
import { Box } from "@/components/UI";
import { PRESTAMOS } from "@/lib/data";
import Link from "next/link";

export default function CobroMesPage() {
  const activos = PRESTAMOS.filter(p=>p.estado==="Activo"||p.estado==="Mora");
  const semanas = [1,2,3,4];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
      <Box title="📆 Cobros del Mes — Marzo 2026">
        {semanas.map(s=>{
          const ps = activos.filter((_,i)=>Math.ceil((i+1)/Math.ceil(activos.length/4))===s);
          const cuota = ps.reduce((t,p)=>t+p.cuota,0);
          return (
            <div key={s} style={{marginBottom:"16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#f4f4f4",borderRadius:"3px",marginBottom:"8px"}}>
                <strong style={{fontSize:"13px",color:"#555"}}>Semana {s}</strong>
                <span style={{fontSize:"13px",fontWeight:700,color:"#00a65a"}}>Esperado: RD$ {cuota.toLocaleString()}</span>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["Cliente","Préstamo","Cuota","Mora","Ruta"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:"11px",fontWeight:700,color:"#777",textTransform:"uppercase",background:"#f9f9f9"}}>{h}</th>)}</tr></thead>
                <tbody>{ps.map(p=><tr key={p.id} style={{borderBottom:"1px solid #f4f4f4"}}>
                  <td style={{padding:"8px 10px",fontWeight:600}}>{p.cliente}</td>
                  <td style={{padding:"8px 10px",fontSize:"12px",color:"#777"}}>{p.id}</td>
                  <td style={{padding:"8px 10px",fontWeight:700,color:"#00a65a"}}>RD$ {p.cuota.toLocaleString()}</td>
                  <td style={{padding:"8px 10px",color:p.dias_mora>0?"#dd4b39":"#aaa"}}>{p.dias_mora>0?`${p.dias_mora}d`:"—"}</td>
                  <td style={{padding:"8px 10px",fontSize:"12px"}}>{p.ruta}</td>
                </tr>)}</tbody>
              </table>
            </div>
          );
        })}
        <Link href="/dashboard/pagos/nuevo" style={{display:"inline-block",padding:"8px 18px",background:"#00a65a",color:"#fff",borderRadius:"3px",textDecoration:"none",fontSize:"13px",fontWeight:600}}>💳 Registrar Cobro</Link>
      </Box>
    </div>
  );
}
