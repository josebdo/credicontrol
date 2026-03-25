"use client";
import { Box } from "@/components/UI";
import { PRESTAMOS } from "@/lib/data";
import Link from "next/link";

export default function CobroSemanaPage() {
  const hoy = new Date();
  const diasSemana = Array.from({length:7},(_,i)=>{
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i - hoy.getDay() + 1);
    return d;
  });
  const cobrosActivos = PRESTAMOS.filter(p=>p.estado==="Activo"||p.estado==="Mora");
  const rutas = Array.from(new Set(cobrosActivos.map(p=>p.ruta)));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}}>
        {[{l:"Cobros semana",v:cobrosActivos.length,c:"#3c8dbc"},{l:"En mora",v:cobrosActivos.filter(p=>p.dias_mora>0).length,c:"#dd4b39"},{l:"Cuota estimada",v:`RD$ ${cobrosActivos.reduce((s,p)=>s+p.cuota,0).toLocaleString()}`,c:"#00a65a"}].map(s=>(
          <div key={s.l} style={{background:"#fff",borderRadius:"3px",boxShadow:"0 1px 1px rgba(0,0,0,0.1)",borderLeft:`4px solid ${s.c}`,padding:"12px 15px"}}>
            <p style={{fontSize:"12px",color:"#aaa",margin:"0 0 3px"}}>{s.l}</p>
            <p style={{fontSize:"22px",fontWeight:700,color:"#333",margin:0}}>{s.v}</p>
          </div>
        ))}
      </div>
      <Box title="📅 Cobros de la Semana">
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"8px",marginBottom:"16px"}}>
          {diasSemana.map((d,i)=>{
            const cobrosDelDia = cobrosActivos.filter((_,j)=>j%7===i);
            return (
              <div key={i} style={{padding:"8px",background:i===hoy.getDay()-1?"#3c8dbc":"#f9f9f9",borderRadius:"3px",border:`1px solid ${i===hoy.getDay()-1?"#2e6da4":"#eee"}`}}>
                <p style={{fontSize:"11px",fontWeight:700,color:i===hoy.getDay()-1?"#fff":"#777",margin:"0 0 4px",textAlign:"center"}}>{["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"][i]}</p>
                <p style={{fontSize:"18px",fontWeight:700,color:i===hoy.getDay()-1?"#fff":"#333",margin:0,textAlign:"center"}}>{d.getDate()}</p>
                <p style={{fontSize:"10px",color:i===hoy.getDay()-1?"rgba(255,255,255,0.8)":"#aaa",margin:"4px 0 0",textAlign:"center"}}>{cobrosDelDia.length} cobros</p>
              </div>
            );
          })}
        </div>
        {rutas.map(ruta=>{
          const prestamosRuta = cobrosActivos.filter(p=>p.ruta===ruta);
          return (
            <div key={ruta} style={{marginBottom:"14px"}}>
              <h4 style={{fontSize:"13px",fontWeight:700,color:"#555",margin:"0 0 8px",padding:"6px 10px",background:"#f4f4f4",borderRadius:"3px"}}>📍 Ruta {ruta} — {prestamosRuta.length} cobros</h4>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#f9f9f9"}}>{["Cliente","Préstamo","Cuota","Mora","Cobrador"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:"11px",fontWeight:700,color:"#777",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
                <tbody>{prestamosRuta.map(p=>(
                  <tr key={p.id} style={{borderBottom:"1px solid #f4f4f4",background:p.dias_mora>0?"#fffbf0":""}}>
                    <td style={{padding:"8px 10px",fontWeight:600}}>{p.cliente}</td>
                    <td style={{padding:"8px 10px",fontSize:"12px",color:"#777"}}>{p.id}</td>
                    <td style={{padding:"8px 10px",fontWeight:700,color:"#00a65a"}}>RD$ {p.cuota.toLocaleString()}</td>
                    <td style={{padding:"8px 10px",color:p.dias_mora>0?"#dd4b39":"#aaa",fontWeight:p.dias_mora>0?700:400}}>{p.dias_mora>0?`${p.dias_mora}d`:"—"}</td>
                    <td style={{padding:"8px 10px",fontSize:"12px"}}>{p.cobrador}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          );
        })}
        <div style={{marginTop:"10px",display:"flex",gap:"8px"}}>
          <Link href="/dashboard/pagos/nuevo" style={{padding:"7px 16px",background:"#00a65a",color:"#fff",borderRadius:"3px",textDecoration:"none",fontSize:"13px",fontWeight:600}}>💳 Registrar Cobro</Link>
          <button onClick={()=>window.print()} style={{padding:"7px 14px",background:"#605ca8",color:"#fff",border:"none",borderRadius:"3px",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>🖨️ Imprimir Ruta</button>
        </div>
      </Box>
    </div>
  );
}
