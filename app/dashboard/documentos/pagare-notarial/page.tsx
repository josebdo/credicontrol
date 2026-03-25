"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { CLIENTES, PRESTAMOS } from "@/lib/data";
import { useAuth } from "@/lib/AuthContext";

export default function PagareNotarialPage() {
  const { empresa } = useAuth();
  const [clienteId, setClienteId] = useState("");
  const [prestamoId, setPrestamoId] = useState("");
  const cliente = CLIENTES.find(c=>c.id===clienteId);
  const prestamo = PRESTAMOS.find(p=>p.id===prestamoId);
  const hoy = new Date().toLocaleDateString("es-DO",{year:"numeric",month:"long",day:"numeric"});

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
      <Box title="📄 Pagaré Notarial">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"14px"}}>
          <div>
            <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Cliente</label>
            <select value={clienteId} onChange={e=>setClienteId(e.target.value)} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
              <option value="">-- Seleccionar --</option>
              {CLIENTES.filter(c=>c.activo).map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Préstamo</label>
            <select value={prestamoId} onChange={e=>setPrestamoId(e.target.value)} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
              <option value="">-- Seleccionar --</option>
              {PRESTAMOS.filter(p=>p.cliente_id===clienteId).map(p=><option key={p.id} value={p.id}>{p.id} — RD$ {p.monto.toLocaleString()}</option>)}
            </select>
          </div>
        </div>
        <button onClick={()=>window.print()} style={{padding:"7px 16px",background:"#605ca8",color:"#fff",border:"none",borderRadius:"3px",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>🖨️ Imprimir Pagaré</button>
      </Box>

      {cliente&&prestamo&&(
        <div id="documento" style={{background:"#fff",padding:"40px",fontFamily:"'Times New Roman',serif",maxWidth:"700px",margin:"0 auto",boxShadow:"0 2px 8px rgba(0,0,0,0.1)",fontSize:"14px",lineHeight:1.8}}>
          <div style={{textAlign:"center",marginBottom:"24px"}}>
            <h2 style={{fontSize:"18px",fontWeight:700,textTransform:"uppercase",margin:"0 0 4px"}}>PAGARÉ</h2>
            <p style={{fontSize:"13px",color:"#555",margin:0}}>Documento Privado de Obligación</p>
            <hr style={{margin:"12px 0"}}/>
          </div>
          <p>Yo, <strong>{cliente.nombre.toUpperCase()}</strong>, dominicano(a), mayor de edad, titular de la Cédula de Identidad y Electoral No. <strong>{cliente.cedula}</strong>, con domicilio en <strong>{cliente.direccion||"______________________"}</strong>, en lo adelante "EL DEUDOR";</p>
          <p>POR MEDIO DEL PRESENTE INSTRUMENTO, declaro que debo y me comprometo a pagar, a la orden de <strong>{empresa?.nombre?.toUpperCase()||"CREDICONTROL"}</strong>, la suma de <strong>RD$ {prestamo.monto.toLocaleString()}</strong> ({prestamo.monto} pesos dominicanos), correspondiente a un préstamo recibido a entera satisfacción.</p>
          <p>Dicha suma será cancelada mediante <strong>{prestamo.num_cuotas} cuotas</strong> mensuales de <strong>RD$ {prestamo.cuota.toLocaleString()}</strong> cada una, a partir del <strong>{prestamo.fecha_inicio}</strong>, con una tasa de interés del <strong>{prestamo.tasa}% mensual</strong>.</p>
          <p>El incumplimiento de cualquier cuota faculta al acreedor a declarar vencida la totalidad de la deuda y proceder por las vías legales correspondientes.</p>
          <div style={{marginTop:"48px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"40px",textAlign:"center"}}>
            <div><div style={{borderTop:"1px solid #333",paddingTop:"8px"}}><p style={{margin:0,fontWeight:700}}>{cliente.nombre.toUpperCase()}</p><p style={{margin:0,fontSize:"12px"}}>El Deudor · C.I. {cliente.cedula}</p></div></div>
            <div><div style={{borderTop:"1px solid #333",paddingTop:"8px"}}><p style={{margin:0,fontWeight:700}}>{empresa?.nombre?.toUpperCase()||"CREDICONTROL"}</p><p style={{margin:0,fontSize:"12px"}}>El Acreedor</p></div></div>
          </div>
          <p style={{marginTop:"32px",fontSize:"12px",color:"#777",textAlign:"center"}}>{hoy}</p>
        </div>
      )}
    </div>
  );
}
