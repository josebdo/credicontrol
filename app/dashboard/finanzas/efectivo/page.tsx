"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { PAGOS, GASTOS, addGasto } from "@/lib/data";

export default function EfectivoPage() {
  const [gastos, setGastos] = useState(GASTOS);
  const [form, setForm] = useState({ concepto:"", monto:"", categoria:"Operativo", fecha:new Date().toISOString().slice(0,10) });
  const [saved, setSaved] = useState(false);
  const ingresoEfectivo = PAGOS.filter(p=>p.activo&&p.forma==="Efectivo").reduce((s,p)=>s+p.monto,0);
  const egresoEfectivo = gastos.reduce((s,g)=>s+g.monto,0);
  const cajaActual = ingresoEfectivo - egresoEfectivo;
  function handleGasto(){
    if(!form.concepto||!form.monto) return;
    const n=addGasto({...form,monto:parseFloat(form.monto),fecha:form.fecha.split("-").reverse().join("/")});
    setGastos(prev=>[...prev,n]);
    setSaved(true);
    setTimeout(()=>{ setSaved(false); setForm({concepto:"",monto:"",categoria:"Operativo",fecha:new Date().toISOString().slice(0,10)}); },800);
  }
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}}>
        {[{l:"Ingresos Efectivo",v:`RD$ ${ingresoEfectivo.toLocaleString()}`,c:"#00a65a"},{l:"Gastos",v:`RD$ ${egresoEfectivo.toLocaleString()}`,c:"#dd4b39"},{l:"Caja Actual",v:`RD$ ${cajaActual.toLocaleString()}`,c:cajaActual>=0?"#00a65a":"#dd4b39"}].map(s=>(
          <div key={s.l} style={{background:"#fff",borderRadius:"3px",boxShadow:"0 1px 1px rgba(0,0,0,0.1)",borderLeft:`4px solid ${s.c}`,padding:"14px 18px"}}>
            <p style={{fontSize:"12px",color:"#aaa",margin:"0 0 3px"}}>{s.l}</p>
            <p style={{fontSize:"26px",fontWeight:700,color:s.c,margin:0}}>{s.v}</p>
          </div>
        ))}
      </div>
      <Box title="💵 Control de Efectivo">
        <div style={{padding:"12px 14px",background:"#f9f9f9",borderRadius:"3px",marginBottom:"14px"}}>
          <h4 style={{fontSize:"13px",fontWeight:700,color:"#555",margin:"0 0 10px"}}>Registrar Gasto de Caja</h4>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:"8px",alignItems:"end"}}>
            <input placeholder="Concepto" value={form.concepto} onChange={e=>setForm(p=>({...p,concepto:e.target.value}))} style={{padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",outline:"none"}}/>
            <input type="number" placeholder="Monto" value={form.monto} onChange={e=>setForm(p=>({...p,monto:e.target.value}))} style={{padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",outline:"none"}}/>
            <select value={form.categoria} onChange={e=>setForm(p=>({...p,categoria:e.target.value}))} style={{padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
              {["Operativo","Administrativo","Nómina","Fijo","Otro"].map(c=><option key={c}>{c}</option>)}
            </select>
            <button onClick={handleGasto} style={{padding:"7px 14px",background:saved?"#00a65a":"#dd4b39",color:"#fff",border:"none",borderRadius:"3px",fontSize:"13px",fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{saved?"✓":"+ Gasto"}</button>
          </div>
        </div>
        <h4 style={{fontSize:"13px",fontWeight:700,color:"#555",margin:"0 0 8px"}}>Pagos en Efectivo Recibidos</h4>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:"16px"}}>
          <thead><tr style={{background:"#f4f4f4"}}>{["Fecha","Cliente","Préstamo","Monto"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",fontSize:"11px",fontWeight:700,color:"#777",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>{PAGOS.filter(p=>p.activo&&p.forma==="Efectivo").map(p=>(
            <tr key={p.id} style={{borderBottom:"1px solid #f4f4f4"}}>
              <td style={{padding:"8px 10px",fontSize:"12px",color:"#777"}}>{p.fecha}</td>
              <td style={{padding:"8px 10px",fontWeight:600}}>{p.cliente}</td>
              <td style={{padding:"8px 10px",fontSize:"12px"}}>{p.prestamo_id}</td>
              <td style={{padding:"8px 10px",fontWeight:700,color:"#00a65a"}}>RD$ {p.monto.toLocaleString()}</td>
            </tr>
          ))}</tbody>
        </table>
      </Box>
    </div>
  );
}
