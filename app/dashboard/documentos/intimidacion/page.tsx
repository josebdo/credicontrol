"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { CLIENTES, PRESTAMOS } from "@/lib/data";
import { useAuth } from "@/lib/AuthContext";

export default function IntimidacionPage() {
  const { empresa } = useAuth();
  const [clienteId, setClienteId] = useState("");
  const [prestamoId, setPrestamoId] = useState("");
  const cliente = CLIENTES.find(c=>c.id===clienteId);
  const prestamo = PRESTAMOS.find(p=>p.id===prestamoId);
  const hoy = new Date().toLocaleDateString("es-DO",{year:"numeric",month:"long",day:"numeric"});

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
      <Box title="⚠️ Carta de Intimación" color="#dd4b39">
        <p style={{fontSize:"13px",color:"#777",marginBottom:"14px"}}>Notificación formal de mora. Se envía cuando el cliente tiene más de 30 días sin pagar.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"14px"}}>
          <div>
            <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Cliente en mora</label>
            <select value={clienteId} onChange={e=>setClienteId(e.target.value)} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
              <option value="">-- Seleccionar --</option>
              {CLIENTES.filter(c=>c.activo).map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Préstamo</label>
            <select value={prestamoId} onChange={e=>setPrestamoId(e.target.value)} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
              <option value="">-- Seleccionar --</option>
              {PRESTAMOS.filter(p=>p.cliente_id===clienteId&&p.dias_mora>0).map(p=><option key={p.id} value={p.id}>{p.id} — {p.dias_mora}d mora</option>)}
            </select>
          </div>
        </div>
        <button onClick={()=>window.print()} style={{padding:"7px 16px",background:"#dd4b39",color:"#fff",border:"none",borderRadius:"3px",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>🖨️ Imprimir Intimación</button>
      </Box>
      {cliente&&prestamo&&(
        <div style={{background:"#fff",padding:"40px",fontFamily:"'Times New Roman',serif",maxWidth:"700px",margin:"0 auto",boxShadow:"0 2px 8px rgba(0,0,0,0.1)",fontSize:"14px",lineHeight:1.8}}>
          <div style={{textAlign:"center",marginBottom:"24px"}}>
            <h2 style={{fontSize:"16px",fontWeight:700,textTransform:"uppercase",margin:0}}>CARTA DE INTIMACIÓN</h2>
            <p style={{fontSize:"13px",margin:"4px 0 0",color:"#555"}}>{empresa?.nombre||"CrediControl"}</p>
            <hr style={{margin:"12px 0"}}/>
          </div>
          <p style={{textAlign:"right"}}>{hoy}</p>
          <p><strong>{cliente.nombre.toUpperCase()}</strong><br/>{cliente.direccion||""}<br/>{cliente.ciudad||"Santo Domingo"}</p>
          <p><strong>Estimado/a Sr./Sra. {cliente.nombre}:</strong></p>
          <p>Por medio de la presente, le notificamos que a la fecha usted presenta un atraso de <strong>{prestamo.dias_mora} días</strong> en el pago de su préstamo No. <strong>{prestamo.id}</strong>, con un saldo pendiente de <strong>RD$ {prestamo.saldo.toLocaleString()}</strong> y mora acumulada de <strong>RD$ {prestamo.mora_acum.toLocaleString()}</strong>.</p>
          <p>Le instamos a <strong>regularizar su situación en un plazo máximo de 5 días hábiles</strong> a partir de la recepción de esta comunicación, comunicándose a nuestras oficinas o realizando su pago de inmediato.</p>
          <p>En caso de no recibir respuesta en el plazo indicado, nos veremos en la obligación de proceder por las vías legales que correspondan, incluyendo la ejecución de garantías prendarias e hipotecarias si las hubiere.</p>
          <p>Sin más a que hacer referencia,<br/><br/><strong>{empresa?.nombre?.toUpperCase()||"CREDICONTROL"}</strong><br/>Departamento de Cobranza<br/>Tel: 829-271-5881</p>
        </div>
      )}
    </div>
  );
}
