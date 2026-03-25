"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { CLIENTES, PRESTAMOS } from "@/lib/data";
import { useAuth } from "@/lib/AuthContext";

export default function DeboPagePage() {
  const { empresa } = useAuth();
  const [clienteId, setClienteId] = useState("");
  const [prestamoId, setPrestamoId] = useState("");
  const [testigo1, setTestigo1] = useState("");
  const [testigo2, setTestigo2] = useState("");
  const cliente = CLIENTES.find(c=>c.id===clienteId);
  const prestamo = PRESTAMOS.find(p=>p.id===prestamoId);
  const hoy = new Date().toLocaleDateString("es-DO",{year:"numeric",month:"long",day:"numeric"});

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
      <Box title="📝 Debo y Pagaré">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"14px"}}>
          {[["Cliente",clienteId,setClienteId,CLIENTES.filter(c=>c.activo)],["Préstamo",prestamoId,setPrestamoId,PRESTAMOS.filter(p=>p.cliente_id===clienteId)]].map(([l,v,s,opts]:any,i)=>(
            <div key={i}>
              <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>{l}</label>
              <select value={v} onChange={(e:any)=>s(e.target.value)} style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",background:"#fff"}}>
                <option value="">-- Seleccionar --</option>
                {opts.map((o:any)=><option key={o.id} value={o.id}>{i===0?o.nombre:`${o.id} — RD$ ${o.monto?.toLocaleString()}`}</option>)}
              </select>
            </div>
          ))}
          <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Testigo 1</label><input value={testigo1} onChange={e=>setTestigo1(e.target.value)} placeholder="Nombre del testigo" style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",outline:"none",boxSizing:"border-box" as const}}/></div>
          <div><label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>Testigo 2</label><input value={testigo2} onChange={e=>setTestigo2(e.target.value)} placeholder="Nombre del testigo" style={{width:"100%",padding:"7px 10px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"13px",outline:"none",boxSizing:"border-box" as const}}/></div>
        </div>
        <button onClick={()=>window.print()} style={{padding:"7px 16px",background:"#605ca8",color:"#fff",border:"none",borderRadius:"3px",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>🖨️ Imprimir</button>
      </Box>
      {cliente&&prestamo&&(
        <div style={{background:"#fff",padding:"40px",fontFamily:"'Times New Roman',serif",maxWidth:"700px",margin:"0 auto",boxShadow:"0 2px 8px rgba(0,0,0,0.1)",fontSize:"14px",lineHeight:1.8}}>
          <div style={{textAlign:"center",marginBottom:"24px"}}><h2 style={{fontSize:"18px",fontWeight:700,textTransform:"uppercase",margin:0}}>DEBO Y PAGARÉ</h2><hr style={{margin:"12px 0"}}/></div>
          <p>Yo, <strong>{cliente.nombre.toUpperCase()}</strong>, cédula <strong>{cliente.cedula}</strong>, DEBO Y PAGARÉ incondicionalmente a <strong>{empresa?.nombre?.toUpperCase()||"CREDICONTROL"}</strong>, la cantidad de <strong>RD$ {prestamo.monto.toLocaleString()}</strong>, moneda de curso legal de la República Dominicana, valor recibido a entera satisfacción.</p>
          <p>Esta suma será pagada en <strong>{prestamo.num_cuotas}</strong> cuotas mensuales de <strong>RD$ {prestamo.cuota.toLocaleString()}</strong>, a partir del <strong>{prestamo.fecha_inicio}</strong>, con interés del <strong>{prestamo.tasa}% mensual</strong>.</p>
          <p>Para el cumplimiento de las obligaciones contenidas en el presente documento, las partes fijan como domicilio especial el asiento del tribunal de primera instancia del Distrito Nacional.</p>
          <div style={{marginTop:"48px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"20px",textAlign:"center"}}>
            <div><div style={{borderTop:"1px solid #333",paddingTop:"8px"}}><p style={{margin:0,fontWeight:700,fontSize:"12px"}}>{cliente.nombre.toUpperCase()}</p><p style={{margin:0,fontSize:"11px"}}>El Deudor</p></div></div>
            <div><div style={{borderTop:"1px solid #333",paddingTop:"8px"}}><p style={{margin:0,fontWeight:700,fontSize:"12px"}}>{testigo1||"_________________"}</p><p style={{margin:0,fontSize:"11px"}}>Testigo 1</p></div></div>
            <div><div style={{borderTop:"1px solid #333",paddingTop:"8px"}}><p style={{margin:0,fontWeight:700,fontSize:"12px"}}>{testigo2||"_________________"}</p><p style={{margin:0,fontSize:"11px"}}>Testigo 2</p></div></div>
          </div>
          <p style={{marginTop:"32px",fontSize:"12px",color:"#777",textAlign:"center"}}>{hoy}</p>
        </div>
      )}
    </div>
  );
}
