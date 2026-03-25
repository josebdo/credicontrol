"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@/components/UI";
import { PRESTAMOS, updatePrestamo, type Prestamo } from "@/lib/data";
import { CLIENTES } from "@/lib/data";

export default function EditarPrestamoPage() {
  const [buscar, setBuscar] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const filtrados = PRESTAMOS.filter(p => p.cliente.toLowerCase().includes(buscar.toLowerCase()) || p.id.includes(buscar));
  const prestamo = PRESTAMOS.find(p => p.id === selectedId);
  const [form, setForm] = useState<Partial<Prestamo>>({});

  function loadPrestamo(p: Prestamo) {
    setSelectedId(p.id);
    setBuscar(`${p.cliente} — ${p.id}`);
    setForm({ tasa:p.tasa, cuota:p.cuota, num_cuotas:p.num_cuotas, cobrador:p.cobrador, ruta:p.ruta, notas:p.notas||"", garantia:p.garantia||"" });
  }

  function handleSave() {
    if (!selectedId) return;
    updatePrestamo(selectedId, form);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push("/dashboard/prestamos");
    }, 800);
  }

  const inp = (k: keyof typeof form, ph: string, type = "text") => (
    <input type={type} placeholder={ph} value={(form[k] as string|number)||""} onChange={e=>setForm(p=>({...p,[k]:type==="number"?parseFloat(e.target.value)||0:e.target.value}))}
      style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",outline:"none",boxSizing:"border-box" as const}}/>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
      <Box title="✏️ Editar Préstamo">
        <div style={{marginBottom:"12px"}}>
          <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"4px"}}>Buscar préstamo</label>
          <input value={buscar} onChange={e=>{setBuscar(e.target.value);setSelectedId("");}} placeholder="Nombre del cliente o ID..."
            style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",outline:"none",boxSizing:"border-box" as const}}/>
          {buscar&&!selectedId&&(
            <div style={{border:"1px solid #eee",borderRadius:"3px",marginTop:"4px",maxHeight:"180px",overflowY:"auto",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}}>
              {filtrados.map(p=>(
                <div key={p.id} onClick={()=>loadPrestamo(p)} style={{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid #f4f4f4"}}
                  onMouseEnter={e=>(e.currentTarget.style.background="#f0f7ff")}
                  onMouseLeave={e=>(e.currentTarget.style.background="")}>
                  <strong style={{fontSize:"13px"}}>{p.id} — {p.cliente}</strong>
                  <p style={{fontSize:"12px",color:"#aaa",margin:0}}>RD$ {p.monto.toLocaleString()} · {p.estado}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {prestamo&&(
          <>
            <div style={{padding:"10px 14px",background:"#f0f7ff",borderRadius:"3px",marginBottom:"14px"}}>
              <strong style={{fontSize:"13px"}}>{prestamo.id} — {prestamo.cliente}</strong>
              <p style={{fontSize:"12px",color:"#777",margin:"3px 0 0"}}>Cédula: {prestamo.cedula} · Monto: RD$ {prestamo.monto.toLocaleString()} · Inicio: {prestamo.fecha_inicio}</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Tasa de interés (%)</label>{inp("tasa",String(prestamo.tasa),"number")}</div>
              <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Cuota mensual (RD$)</label>{inp("cuota",String(prestamo.cuota),"number")}</div>
              <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Número de cuotas</label>{inp("num_cuotas",String(prestamo.num_cuotas),"number")}</div>
              <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Cobrador</label>{inp("cobrador",prestamo.cobrador)}</div>
              <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Ruta</label>{inp("ruta",prestamo.ruta)}</div>
              <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Garantía</label>{inp("garantia","Descripción de garantía")}</div>
              <div style={{gridColumn:"1/-1"}}><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Notas</label><textarea value={form.notas||""} onChange={e=>setForm(p=>({...p,notas:e.target.value}))} rows={3} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",outline:"none",resize:"vertical",boxSizing:"border-box" as const}}/></div>
            </div>
            <button onClick={handleSave} style={{marginTop:"14px",padding:"8px 20px",background:saved?"#00a65a":"#f39c12",color:"#fff",border:"none",borderRadius:"3px",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>{saved?"✓ Guardado":"Guardar Cambios"}</button>
          </>
        )}
      </Box>
    </div>
  );
}
