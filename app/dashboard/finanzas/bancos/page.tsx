"use client";
import { useState, useEffect } from "react";
import { Box } from "@/components/UI";
import { getCuentas, addCuenta, type Cuenta } from "@/lib/data";

const EMPTY: Omit<Cuenta,"id"> = { banco:"", tipo:"Corriente", numero:"", titular:"", saldo:0, activa:true };
export default function BancosPage() {
  const [cuentas, setCuentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Cuenta,"id">>(EMPTY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getCuentas();
      setCuentas(data);
    } catch (error) {
      console.error("Error fetching cuentas:", error);
    } finally {
      setLoading(false);
    }
  }

  const total = cuentas.filter(c=>c.activa).reduce((s,c)=>s+(c.saldo || 0),0);

  async function handleSave(){
    if(!form.banco||!form.numero) return;
    try {
      await addCuenta(form);
      await fetchData();
      setSaved(true);
      setTimeout(()=>{ setSaved(false); setShowForm(false); setForm(EMPTY); },800);
    } catch (error) {
      alert("Error al guardar cuenta");
    }
  }

  const inp=(k:keyof typeof form,ph:string,type="text")=>(
    <input type={type} placeholder={ph} value={form[k] as string|number} onChange={e=>setForm((p: any)=>({...p,[k]:type==="number"?parseFloat(e.target.value)||0:e.target.value}))}
      style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",outline:"none",boxSizing:"border-box" as const}}/>
  );
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px"}}>
        {[{l:"Cuentas activas",v:cuentas.filter(c=>c.activa).length,c:"#3c8dbc"},{l:"Saldo total",v:`RD$ ${total.toLocaleString()}`,c:"#00a65a"},{l:"Cuentas inactivas",v:cuentas.filter(c=>!c.activa).length,c:"#aaa"}].map(s=>(
          <div key={s.l} style={{background:"#fff",borderRadius:"3px",boxShadow:"0 1px 1px rgba(0,0,0,0.1)",borderLeft:`4px solid ${s.c}`,padding:"12px 15px"}}>
            <p style={{fontSize:"12px",color:"#aaa",margin:"0 0 3px"}}>{s.l}</p>
            <p style={{fontSize:"22px",fontWeight:700,color:"#333",margin:0}}>{s.v}</p>
          </div>
        ))}
      </div>
      <Box title="🏦 Cuentas Bancarias" headerRight={<button onClick={()=>setShowForm(!showForm)} style={{padding:"5px 12px",background:"#3c8dbc",color:"#fff",border:"none",borderRadius:"3px",fontSize:"12px",cursor:"pointer",fontWeight:600}}>+ Nueva Cuenta</button>}>
        {showForm&&(
          <div style={{padding:"14px",background:"#f0f7ff",borderRadius:"3px",marginBottom:"14px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
              <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Banco *</label>{inp("banco","Banreservas")}</div>
              <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Tipo</label>
                <select value={form.tipo} onChange={e=>setForm((p: any)=>({...p,tipo:e.target.value}))} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
                  {["Corriente","Ahorro"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Número (últimos 4)</label>{inp("numero","****1234")}</div>
              <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Titular</label>{inp("titular","CREDICONTROL SRL")}</div>
              <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Saldo inicial (RD$)</label>{inp("saldo","0","number")}</div>
            </div>
            <button onClick={handleSave} style={{padding:"7px 16px",background:saved?"#00a65a":"#3c8dbc",color:"#fff",border:"none",borderRadius:"3px",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>{saved?"✓ Guardado":"Guardar"}</button>
          </div>
        )}
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#f4f4f4"}}>{["Banco","Tipo","Número","Titular","Saldo","Estado"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:"11px",fontWeight:700,color:"#777",textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
          <tbody>{cuentas.map(c=>(
            <tr key={c.id} style={{borderBottom:"1px solid #f4f4f4"}}>
              <td style={{padding:"9px 12px",fontWeight:600}}>{c.banco}</td>
              <td style={{padding:"9px 12px",fontSize:"12px"}}>{c.tipo}</td>
              <td style={{padding:"9px 12px",fontFamily:"monospace",fontSize:"12px"}}>{c.numero}</td>
              <td style={{padding:"9px 12px",fontSize:"12px"}}>{c.titular}</td>
              <td style={{padding:"9px 12px",fontWeight:700,color:"#00a65a"}}>RD$ {(c.saldo || 0).toLocaleString()}</td>
              <td style={{padding:"9px 12px"}}><span style={{fontSize:"11px",fontWeight:700,padding:"2px 8px",borderRadius:"10px",background:c.activa?"#dff0d8":"#f2dede",color:c.activa?"#3c763d":"#a94442"}}>{c.activa?"Activa":"Inactiva"}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </Box>
    </div>
  );
}
