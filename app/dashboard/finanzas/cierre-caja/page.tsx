"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { PAGOS, GASTOS } from "@/lib/data";

export default function CierreCajaPage() {
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0,10));
  const [saldoInicial, setSaldoInicial] = useState("0");
  const [cerrado, setCerrado] = useState(false);
  const fechaDisplay = fecha.split("-").reverse().join("/");
  const pagosHoy = PAGOS.filter(p=>p.activo&&p.fecha===fechaDisplay);
  const gastosHoy = GASTOS.filter(g=>g.fecha===fechaDisplay);
  const efectivoHoy = pagosHoy.filter(p=>p.forma==="Efectivo").reduce((s,p)=>s+p.monto,0);
  const transfsHoy  = pagosHoy.filter(p=>p.forma==="Transferencia").reduce((s,p)=>s+p.monto,0);
  const totalIngresos = pagosHoy.reduce((s,p)=>s+p.monto,0);
  const totalGastos   = gastosHoy.reduce((s,g)=>s+g.monto,0);
  const saldoFinal    = parseFloat(saldoInicial||"0") + efectivoHoy - totalGastos;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
      <Box title="🔒 Cierre de Caja" headerRight={
        <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
          <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} style={{padding:"5px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px"}}/>
          <button onClick={()=>window.print()} style={{padding:"5px 12px",background:"#605ca8",color:"#fff",border:"none",borderRadius:"3px",fontSize:"12px",cursor:"pointer"}}>🖨️ Imprimir</button>
        </div>
      }>
        <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"20px"}}>
          <div>
            <div style={{marginBottom:"10px"}}>
              <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Saldo inicial de caja (RD$)</label>
              <input type="number" value={saldoInicial} onChange={e=>setSaldoInicial(e.target.value)} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",outline:"none",boxSizing:"border-box" as const}}/>
            </div>
            {[
              {l:"Saldo inicial",   v:`RD$ ${parseFloat(saldoInicial||"0").toLocaleString()}`, c:"#555"},
              {l:"+ Efectivo rec.", v:`RD$ ${efectivoHoy.toLocaleString()}`,   c:"#00a65a"},
              {l:"+ Transferencias",v:`RD$ ${transfsHoy.toLocaleString()}`,    c:"#3c8dbc"},
              {l:"- Gastos",        v:`RD$ ${totalGastos.toLocaleString()}`,   c:"#dd4b39"},
              {l:"= Saldo final",   v:`RD$ ${saldoFinal.toLocaleString()}`,    c:saldoFinal>=0?"#00a65a":"#dd4b39",bold:true},
            ].map(r=>(
              <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f4f4f4"}}>
                <span style={{fontSize:"13px",color:"#666"}}>{r.l}</span>
                <span style={{fontSize:"13px",fontWeight:(r as any).bold?700:600,color:r.c}}>{r.v}</span>
              </div>
            ))}
            <button onClick={()=>setCerrado(true)} style={{marginTop:"14px",width:"100%",padding:"9px",background:cerrado?"#00a65a":"#dd4b39",color:"#fff",border:"none",borderRadius:"3px",fontSize:"13px",fontWeight:700,cursor:"pointer"}}>{cerrado?"✓ CAJA CERRADA":"Cerrar Caja del Día"}</button>
          </div>
          <div>
            <h4 style={{fontSize:"13px",fontWeight:700,color:"#555",margin:"0 0 8px"}}>Cobros del día ({pagosHoy.length})</h4>
            {pagosHoy.length===0?<p style={{color:"#aaa",fontSize:"13px"}}>Sin cobros hoy</p>:<table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#f4f4f4"}}>{["Cliente","Monto","Forma"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:"11px",fontWeight:700,color:"#777",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
              <tbody>{pagosHoy.map(p=><tr key={p.id} style={{borderBottom:"1px solid #f4f4f4"}}><td style={{padding:"7px 10px",fontWeight:600,fontSize:"13px"}}>{p.cliente}</td><td style={{padding:"7px 10px",color:"#00a65a",fontWeight:700}}>RD$ {p.monto.toLocaleString()}</td><td style={{padding:"7px 10px",fontSize:"12px"}}>{p.forma}</td></tr>)}</tbody>
            </table>}
          </div>
        </div>
      </Box>
    </div>
  );
}
