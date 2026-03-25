"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { CLIENTES, PRESTAMOS, addGarantia, GARANTIAS } from "@/lib/data";

export default function NuevaGarantiaPage() {
  const [form, setForm] = useState({ cliente_id:"", prestamo_id:"", tipo:"Vehículo", descripcion:"", valor:"", marca:"", modelo:"", anio:"", placa:"", estado:"Activa" as "Activa"|"Liberada"|"Ejecutada", fecha:new Date().toISOString().slice(0,10) });
  const [saved, setSaved] = useState(false);
  const [lista, setLista] = useState(GARANTIAS);
  const cliente = CLIENTES.find(c=>c.id===form.cliente_id);
  const prestamosCliente = PRESTAMOS.filter(p=>p.cliente_id===form.cliente_id&&p.estado!=="Saldado");

  function handleSave(){
    if(!form.descripcion||!form.valor||!form.cliente_id) return;
    const c = CLIENTES.find(x=>x.id===form.cliente_id);
    addGarantia({ ...form, cliente:c?.nombre??"", valor:parseFloat(form.valor), anio:parseInt(form.anio)||0, fecha:form.fecha.split("-").reverse().join("/") });
    setLista([...GARANTIAS]);
    setSaved(true);
    setTimeout(()=>{ setSaved(false); setForm({cliente_id:"",prestamo_id:"",tipo:"Vehículo",descripcion:"",valor:"",marca:"",modelo:"",anio:"",placa:"",estado:"Activa",fecha:new Date().toISOString().slice(0,10)}); },800);
  }

  const inp=(k:string,ph:string,type="text")=>(
    <input type={type} placeholder={ph} value={(form as any)[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
      style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",outline:"none",boxSizing:"border-box" as const}}/>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
      <Box title="📎 Registrar Garantía">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
          <div>
            <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Cliente *</label>
            <select value={form.cliente_id} onChange={e=>setForm(p=>({...p,cliente_id:e.target.value,prestamo_id:""}))} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
              <option value="">-- Seleccionar --</option>
              {CLIENTES.filter(c=>c.activo).map(c=><option key={c.id} value={c.id}>{c.nombre} — {c.cedula}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Préstamo asociado</label>
            <select value={form.prestamo_id} onChange={e=>setForm(p=>({...p,prestamo_id:e.target.value}))} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
              <option value="">-- Opcional --</option>
              {prestamosCliente.map(p=><option key={p.id} value={p.id}>{p.id} — RD$ {p.monto.toLocaleString()}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Tipo de garantía *</label>
            <select value={form.tipo} onChange={e=>setForm(p=>({...p,tipo:e.target.value}))} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
              {["Vehículo","Inmueble","Pagaré","Joya","Electrodoméstico","Otro"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Valor estimado (RD$) *</label>{inp("valor","850000","number")}</div>
          <div style={{gridColumn:"1/-1"}}><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Descripción *</label>{inp("descripcion","Ej: Toyota Corolla 2019 rojo")}</div>
          {form.tipo==="Vehículo"&&<>
            <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Marca</label>{inp("marca","Toyota")}</div>
            <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Modelo</label>{inp("modelo","Corolla")}</div>
            <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Año</label>{inp("anio","2019","number")}</div>
            <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Placa</label>{inp("placa","A123456")}</div>
          </>}
          <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Fecha</label><input type="date" value={form.fecha} onChange={e=>setForm(p=>({...p,fecha:e.target.value}))} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px"}}/></div>
        </div>
        <button onClick={handleSave} style={{marginTop:"14px",padding:"8px 20px",background:saved?"#00a65a":"#3c8dbc",color:"#fff",border:"none",borderRadius:"3px",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>{saved?"✓ Registrada":"Registrar Garantía"}</button>
      </Box>

      <Box title={`Garantías Registradas (${lista.length})`}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#f4f4f4"}}>
            {["ID","Cliente","Tipo","Descripción","Valor","Estado","Préstamo"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:"11px",fontWeight:700,color:"#777",textTransform:"uppercase"}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {lista.map(g=>(
              <tr key={g.id} style={{borderBottom:"1px solid #f4f4f4"}}>
                <td style={{padding:"8px 12px",color:"#aaa",fontSize:"12px"}}>{g.id}</td>
                <td style={{padding:"8px 12px",fontWeight:600}}>{g.cliente}</td>
                <td style={{padding:"8px 12px",fontSize:"12px"}}>{g.tipo}</td>
                <td style={{padding:"8px 12px",fontSize:"12px"}}>{g.descripcion}</td>
                <td style={{padding:"8px 12px",fontWeight:600,color:"#00a65a"}}>RD$ {g.valor.toLocaleString()}</td>
                <td style={{padding:"8px 12px"}}><span style={{fontSize:"11px",fontWeight:700,padding:"2px 8px",borderRadius:"10px",background:g.estado==="Activa"?"#dff0d8":g.estado==="Liberada"?"#d9edf7":"#f2dede",color:g.estado==="Activa"?"#3c763d":g.estado==="Liberada"?"#31708f":"#a94442"}}>{g.estado}</span></td>
                <td style={{padding:"8px 12px",fontSize:"12px",color:"#777"}}>{g.prestamo_id||"—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  );
}
