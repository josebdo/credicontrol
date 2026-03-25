"use client";
import { useState, useEffect } from "react";
import { Box } from "@/components/UI";
import { getPlantillas, addPlantilla, updatePlantilla, type Plantilla } from "@/lib/data";

const EMPTY: Omit<Plantilla,"id"> = { nombre:"", contenido:"", tipo:"Recordatorio", activa:true };
export default function PlantillasPage() {
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Plantilla,"id">>(EMPTY);
  const [editing, setEditing] = useState<any|null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getPlantillas();
      setLista(data);
    } catch (error) {
      console.error("Error fetching plantillas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(){
    if(!form.nombre||!form.contenido) return;
    try {
      if(editing){ 
        await updatePlantilla(editing.id, form); 
      } else { 
        await addPlantilla(form); 
      }
      await fetchData();
      setSaved(true);
      setTimeout(()=>{ setSaved(false); setShowForm(false); setEditing(null); setForm(EMPTY); },800);
    } catch (error) {
      alert("Error al guardar plantilla");
    }
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
      <Box title="📋 Plantillas de WhatsApp" headerRight={<button onClick={()=>{setShowForm(true);setEditing(null);setForm(EMPTY);}} style={{padding:"5px 12px",background:"#25D366",color:"#fff",border:"none",borderRadius:"3px",fontSize:"12px",cursor:"pointer",fontWeight:600}}>+ Nueva Plantilla</button>}>
        {showForm&&(
          <div style={{padding:"14px",background:"#f0faf4",borderRadius:"3px",marginBottom:"14px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"10px"}}>
              <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Nombre</label><input value={form.nombre} onChange={e=>setForm((p: any)=>({...p,nombre:e.target.value}))} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",outline:"none",boxSizing:"border-box" as const}}/></div>
              <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Tipo</label>
                <select value={form.tipo} onChange={e=>setForm((p: any)=>({...p,tipo:e.target.value}))} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
                  {["Recordatorio","Confirmación","Cobranza","Legal"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginBottom:"10px"}}>
              <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Mensaje <span style={{color:"#aaa",fontWeight:400}}>(variables: {"{nombre}"} {"{cuota}"} {"{dias}"} {"{fecha}"} {"{monto}"} {"{ref}"})</span></label>
              <textarea value={form.contenido} onChange={e=>setForm((p: any)=>({...p,contenido:e.target.value}))} rows={4} style={{width:"100%",padding:"8px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",outline:"none",resize:"vertical",boxSizing:"border-box" as const}}/>
            </div>
            <button onClick={handleSave} style={{padding:"7px 16px",background:saved?"#00a65a":"#25D366",color:"#fff",border:"none",borderRadius:"3px",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>{saved?"✓ Guardado":editing?"Actualizar":"Guardar Plantilla"}</button>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px"}}>
          {lista.map(p=>(
            <div key={p.id} style={{padding:"14px",border:"1px solid #eee",borderRadius:"6px",opacity:p.activa?1:0.6}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                <div><strong style={{fontSize:"13px"}}>{p.nombre}</strong><span style={{fontSize:"11px",background:"#f0ebff",color:"#6f42c1",padding:"1px 7px",borderRadius:"10px",marginLeft:"8px"}}>{p.tipo}</span></div>
                <span style={{fontSize:"11px",fontWeight:700,padding:"2px 7px",borderRadius:"10px",background:p.activa?"#dff0d8":"#f2dede",color:p.activa?"#3c763d":"#a94442"}}>{p.activa?"Activa":"Inactiva"}</span>
              </div>
              <p style={{fontSize:"12px",color:"#666",margin:"0 0 10px",lineHeight:1.6}}>{p.contenido}</p>
              <div style={{display:"flex",gap:"6px"}}>
                <button onClick={()=>{setEditing(p);setForm({...p});setShowForm(true);}} style={{padding:"4px 10px",background:"#f39c12",color:"#fff",border:"none",borderRadius:"3px",fontSize:"11px",cursor:"pointer"}}>Editar</button>
                <button onClick={async ()=>{
                  try {
                    await updatePlantilla(p.id,{activa:!p.activa});
                    await fetchData();
                  } catch (error) {
                    alert("Error al cambiar estado");
                  }
                }} style={{padding:"4px 10px",background:p.activa?"#dd4b39":"#00a65a",color:"#fff",border:"none",borderRadius:"3px",fontSize:"11px",cursor:"pointer"}}>{p.activa?"Desactivar":"Activar"}</button>
              </div>
            </div>
          ))}
        </div>
      </Box>
    </div>
  );
}
