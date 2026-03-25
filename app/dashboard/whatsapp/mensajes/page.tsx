"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { CLIENTES, PRESTAMOS, PLANTILLAS, addMensajeWS, MENSAJES_WS, type MensajeWS } from "@/lib/data";

export default function MensajesWAPage() {
  const [mensajes, setMensajes] = useState(MENSAJES_WS);
  const [clienteId, setClienteId] = useState("");
  const [plantillaId, setPlantillaId] = useState("");
  const [msgCustom, setMsgCustom] = useState("");
  const [sent, setSent] = useState(false);

  const cliente = CLIENTES.find(c=>c.id===clienteId);
  const plantilla = PLANTILLAS.find(p=>p.id===plantillaId);
  const prestamo = PRESTAMOS.find(p=>p.cliente_id===clienteId&&p.estado!=="Saldado");

  function getPreview(){
    if(!cliente||!plantilla) return "";
    return plantilla.contenido
      .replace("{nombre}",cliente.nombre)
      .replace("{cuota}",prestamo?`RD$ ${prestamo.cuota.toLocaleString()}`:"—")
      .replace("{monto}",prestamo?`RD$ ${prestamo.saldo.toLocaleString()}`:"—")
      .replace("{fecha}",prestamo?prestamo.fecha_vence:"—")
      .replace("{dias}",prestamo?String(prestamo.dias_mora):"0")
      .replace("{telefono}","829-271-5881")
      .replace("{ref}","PAG-AUTO");
  }

  function handleSend(){
    if(!cliente||(!plantilla&&!msgCustom)) return;
    const n = addMensajeWS({ cliente:cliente.nombre, telefono:cliente.telefono, mensaje:plantilla?getPreview():msgCustom, estado:"Enviado", fecha:new Date().toLocaleString("es-DO"), plantilla:plantilla?.nombre||"Mensaje directo" });
    setMensajes(prev=>[n,...prev]);
    setSent(true);
    setTimeout(()=>{ setSent(false); setClienteId(""); setPlantillaId(""); setMsgCustom(""); },1000);
  }

  const estadoColor: Record<string,{bg:string;c:string}> = {
    Enviado:{bg:"#d9edf7",c:"#31708f"}, Entregado:{bg:"#dff0d8",c:"#3c763d"}, Leído:{bg:"#f0ebff",c:"#6f42c1"}, Error:{bg:"#f2dede",c:"#a94442"}
  };

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"15px",alignItems:"start"}}>
      <Box title="📱 Enviar Mensaje WhatsApp">
        <div style={{marginBottom:"12px"}}>
          <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Cliente destinatario *</label>
          <select value={clienteId} onChange={e=>setClienteId(e.target.value)} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
            <option value="">-- Seleccionar cliente --</option>
            {CLIENTES.filter(c=>c.activo).map(c=><option key={c.id} value={c.id}>{c.nombre} — {c.telefono}</option>)}
          </select>
        </div>
        <div style={{marginBottom:"12px"}}>
          <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Plantilla</label>
          <select value={plantillaId} onChange={e=>setPlantillaId(e.target.value)} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
            <option value="">-- O escribe mensaje manual --</option>
            {PLANTILLAS.filter(p=>p.activa).map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
        {!plantillaId&&(
          <div style={{marginBottom:"12px"}}>
            <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Mensaje personalizado</label>
            <textarea value={msgCustom} onChange={e=>setMsgCustom(e.target.value)} rows={4} style={{width:"100%",padding:"8px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",outline:"none",resize:"vertical",boxSizing:"border-box" as const}} placeholder="Escribe el mensaje aquí..."/>
          </div>
        )}
        {plantillaId&&getPreview()&&(
          <div style={{padding:"10px 14px",background:"#f0f9ec",border:"1px solid #c3e6cb",borderRadius:"6px",marginBottom:"12px"}}>
            <p style={{fontSize:"11px",fontWeight:700,color:"#555",margin:"0 0 4px"}}>Vista previa:</p>
            <p style={{fontSize:"13px",color:"#333",margin:0,lineHeight:1.6}}>{getPreview()}</p>
          </div>
        )}
        <button onClick={handleSend} disabled={!cliente||(!plantilla&&!msgCustom)}
          style={{padding:"8px 18px",background:sent?"#00a65a":(!cliente||(!plantilla&&!msgCustom))?"#ccc":"#25D366",color:"#fff",border:"none",borderRadius:"3px",fontSize:"13px",fontWeight:700,cursor:"pointer"}}>
          {sent?"✓ Enviado":"📤 Enviar WhatsApp"}
        </button>
      </Box>

      <Box title={`Historial de Mensajes (${mensajes.length})`}>
        <div style={{display:"flex",flexDirection:"column",gap:"8px",maxHeight:"500px",overflowY:"auto"}}>
          {mensajes.map(m=>{
            const sc = estadoColor[m.estado]||{bg:"#f4f4f4",c:"#555"};
            return (
              <div key={m.id} style={{padding:"10px 14px",background:"#fafafa",border:"1px solid #eee",borderRadius:"6px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}>
                  <strong style={{fontSize:"13px"}}>{m.cliente}</strong>
                  <span style={{fontSize:"10px",fontWeight:700,padding:"2px 8px",borderRadius:"10px",background:sc.bg,color:sc.c}}>{m.estado}</span>
                </div>
                <p style={{fontSize:"11px",color:"#aaa",margin:"0 0 4px"}}>{m.telefono} · {m.fecha}</p>
                <p style={{fontSize:"12px",color:"#555",margin:0}}>{m.mensaje.substring(0,80)}{m.mensaje.length>80?"...":""}</p>
                <p style={{fontSize:"10px",color:"#bbb",margin:"4px 0 0"}}>Plantilla: {m.plantilla}</p>
              </div>
            );
          })}
        </div>
      </Box>
    </div>
  );
}
