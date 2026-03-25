"use client";
import { Box, Btn } from "@/components/UI";

export default function ConectarWhatsappPage() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"15px" }}>
      <Box title="Conectar WhatsApp" color="#00a65a">
        <div style={{ textAlign:"center", padding:"20px 0" }}>
          <p style={{ fontSize:"13px", color:"#666", marginBottom:"20px", lineHeight:1.7 }}>
            Para conectar WhatsApp, abre la app en tu teléfono, ve a <strong>Dispositivos Vinculados</strong> y escanea el código QR.
          </p>
          {/* QR placeholder */}
          <div style={{
            width:"200px", height:"200px", border:"2px solid #ddd", borderRadius:"4px",
            margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center",
            background:"#f9f9f9", flexDirection:"column", gap:"8px",
          }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(8,16px)", gridTemplateRows:"repeat(8,16px)", gap:"2px" }}>
              {Array.from({length:64}).map((_,i) => (
                <div key={i} style={{ background: Math.random()>0.5?"#222":"#fff", borderRadius:"1px" }} />
              ))}
            </div>
          </div>
          <p style={{ fontSize:"12px", color:"#aaa" }}>El código expira en 60 segundos</p>
          <div style={{ marginTop:"15px", display:"flex", gap:"8px", justifyContent:"center" }}>
            <Btn color="green">Actualizar QR</Btn>
            <Btn color="gray">Cancelar</Btn>
          </div>
        </div>
      </Box>

      <Box title="Instrucciones" color="#3c8dbc">
        {[
          { n:1, text:"Abre WhatsApp en tu teléfono" },
          { n:2, text:"Toca el menú (⋮) o Configuración" },
          { n:3, text:'Selecciona "Dispositivos Vinculados"' },
          { n:4, text:'Toca "Vincular un dispositivo"' },
          { n:5, text:"Escanea el código QR de la pantalla" },
          { n:6, text:"¡Listo! Tu WhatsApp quedará conectado" },
        ].map(s => (
          <div key={s.n} style={{ display:"flex", gap:"12px", alignItems:"flex-start", padding:"10px 0", borderBottom:"1px solid #f4f4f4" }}>
            <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"#3c8dbc", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"13px", flexShrink:0 }}>
              {s.n}
            </div>
            <p style={{ margin:0, fontSize:"13px", color:"#555", lineHeight:1.5, paddingTop:"4px" }}>{s.text}</p>
          </div>
        ))}
      </Box>
    </div>
  );
}
