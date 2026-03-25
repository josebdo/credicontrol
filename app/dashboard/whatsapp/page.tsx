"use client";
import Link from "next/link";
import { Box, Btn } from "@/components/UI";

export default function WhatsappPage() {
  return (
    <div>
      <Box title="💬 Estado de WhatsApp" color="#00a65a">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"15px 0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"15px" }}>
            <div style={{ width:"60px", height:"60px", borderRadius:"50%", background:"#f2dede", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"28px" }}>
              📵
            </div>
            <div>
              <h3 style={{ margin:0, fontSize:"16px", color:"#444" }}>WhatsApp no conectado</h3>
              <p style={{ margin:"4px 0 0", fontSize:"13px", color:"#999" }}>Conecta el WhatsApp de tu negocio para enviar recordatorios automáticos</p>
            </div>
          </div>
          <Link href="/dashboard/whatsapp/conectar"><Btn color="green">Conectar WhatsApp</Btn></Link>
        </div>
      </Box>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"15px" }}>
        {[
          { href:"/dashboard/whatsapp/conectar",  icon:"📱", title:"Conectar WhatsApp",    desc:"Escanea el QR y conecta tu número de negocio", color:"#00a65a" },
          { href:"/dashboard/whatsapp/mensajes",   icon:"📤", title:"Mensajes de Cobro",    desc:"Envía recordatorios de pago manualmente",       color:"#3c8dbc" },
          { href:"/dashboard/whatsapp/plantillas", icon:"📋", title:"Plantillas",           desc:"Crea y edita plantillas de mensajes",            color:"#f39c12" },
          { href:"/dashboard/whatsapp/historial",  icon:"🕐", title:"Historial de Envíos",  desc:"Ve todos los mensajes enviados",                 color:"#605ca8" },
        ].map(m => (
          <Link key={m.href} href={m.href} style={{ textDecoration:"none" }}>
            <div style={{ background:"#fff", borderRadius:"3px", boxShadow:"0 1px 1px rgba(0,0,0,0.1)", borderLeft:`4px solid ${m.color}`, padding:"15px", cursor:"pointer" }}
              onMouseEnter={e=>(e.currentTarget.style.boxShadow="0 3px 8px rgba(0,0,0,0.15)")}
              onMouseLeave={e=>(e.currentTarget.style.boxShadow="0 1px 1px rgba(0,0,0,0.1)")}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <span style={{ fontSize:"24px" }}>{m.icon}</span>
                <div>
                  <h3 style={{ margin:0, fontSize:"14px", fontWeight:700, color:"#444" }}>{m.title}</h3>
                  <p style={{ margin:"2px 0 0", fontSize:"12px", color:"#999" }}>{m.desc}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
