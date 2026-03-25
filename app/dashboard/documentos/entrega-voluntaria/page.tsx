"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { CLIENTES, PRESTAMOS, GARANTIAS } from "@/lib/data";
import { useAuth } from "@/lib/AuthContext";

export default function EntregaVoluntariaPage() {
  const { empresa } = useAuth();
  const [clienteId, setClienteId] = useState("");
  const [garantiaId, setGarantiaId] = useState("");
  const cliente = CLIENTES.find(c=>c.id===clienteId);
  const garantia = GARANTIAS.find(g=>g.id===garantiaId);
  const hoy = new Date().toLocaleDateString("es-DO",{year:"numeric",month:"long",day:"numeric"});

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
      <Box title="🔑 Acta de Entrega Voluntaria" color="#f39c12">
        <p style={{fontSize:"13px",color:"#777",marginBottom:"14px"}}>Documento que certifica la entrega voluntaria de una garantía por parte del deudor.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"14px"}}>
          <div>
            <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Cliente</label>
            <select value={clienteId} onChange={e=>setClienteId(e.target.value)} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
              <option value="">-- Seleccionar --</option>
              {CLIENTES.filter(c=>c.activo).map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Garantía</label>
            <select value={garantiaId} onChange={e=>setGarantiaId(e.target.value)} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
              <option value="">-- Seleccionar --</option>
              {GARANTIAS.filter(g=>g.cliente_id===clienteId&&g.estado==="Activa").map(g=><option key={g.id} value={g.id}>{g.descripcion}</option>)}
            </select>
          </div>
        </div>
        <button onClick={()=>window.print()} style={{padding:"7px 16px",background:"#f39c12",color:"#fff",border:"none",borderRadius:"3px",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>🖨️ Imprimir Acta</button>
      </Box>
      {cliente&&garantia&&(
        <div style={{background:"#fff",padding:"40px",fontFamily:"'Times New Roman',serif",maxWidth:"700px",margin:"0 auto",boxShadow:"0 2px 8px rgba(0,0,0,0.1)",fontSize:"14px",lineHeight:1.8}}>
          <div style={{textAlign:"center",marginBottom:"24px"}}>
            <h2 style={{fontSize:"16px",fontWeight:700,textTransform:"uppercase",margin:0}}>ACTA DE ENTREGA VOLUNTARIA</h2>
            <hr style={{margin:"12px 0"}}/>
          </div>
          <p>En Santo Domingo, República Dominicana, siendo el día {hoy}, comparecen:</p>
          <p><strong>DEUDOR:</strong> {cliente.nombre.toUpperCase()}, cédula {cliente.cedula}.</p>
          <p><strong>ACREEDOR:</strong> {empresa?.nombre?.toUpperCase()||"CREDICONTROL"}.</p>
          <p>El deudor, de manera libre y voluntaria, hace entrega al acreedor del bien descrito a continuación como garantía de la deuda contraída:</p>
          <div style={{padding:"12px 16px",background:"#f9f9f9",border:"1px solid #ddd",borderRadius:"3px",margin:"16px 0"}}>
            <p style={{margin:0}}><strong>Descripción:</strong> {garantia.descripcion}</p>
            <p style={{margin:"4px 0 0"}}><strong>Tipo:</strong> {garantia.tipo}</p>
            {garantia.placa&&<p style={{margin:"4px 0 0"}}><strong>Placa:</strong> {garantia.placa}</p>}
            <p style={{margin:"4px 0 0"}}><strong>Valor estimado:</strong> RD$ {garantia.valor.toLocaleString()}</p>
          </div>
          <p>Esta entrega se realiza en carácter voluntario, sin coacción ni presión de ninguna especie, como forma de saldar parcial o totalmente la deuda pendiente.</p>
          <div style={{marginTop:"48px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"40px",textAlign:"center"}}>
            <div><div style={{borderTop:"1px solid #333",paddingTop:"8px"}}><p style={{margin:0,fontWeight:700}}>{cliente.nombre.toUpperCase()}</p><p style={{margin:0,fontSize:"12px"}}>El Deudor</p></div></div>
            <div><div style={{borderTop:"1px solid #333",paddingTop:"8px"}}><p style={{margin:0,fontWeight:700}}>{empresa?.nombre?.toUpperCase()||"CREDICONTROL"}</p><p style={{margin:0,fontSize:"12px"}}>El Acreedor</p></div></div>
          </div>
        </div>
      )}
    </div>
  );
}
