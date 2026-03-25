"use client";
import { Box, Btn } from "@/components/UI";

const COBROS_HOY = [
  { hora:"08:00", cliente:"Rosa M. Peña",    monto:"RD$ 2,400", direccion:"Calle 5, Santiago",       telefono:"829-555-0101", estado:"Pendiente", ruta:"Norte" },
  { hora:"09:30", cliente:"Carmen L. Vega",  monto:"RD$ 2,100", direccion:"Herrera, SD",             telefono:"829-555-0105", estado:"Pendiente", ruta:"Sur"   },
  { hora:"10:00", cliente:"Luis F. Mora",    monto:"RD$ 1,500", direccion:"San Cristóbal",           telefono:"829-555-0106", estado:"Pagado",    ruta:"Este"  },
  { hora:"11:30", cliente:"Ana P. Reyes",    monto:"RD$ 3,200", direccion:"La Vega",                 telefono:"829-555-0107", estado:"Pendiente", ruta:"Norte" },
  { hora:"14:00", cliente:"Ramón A. Núñez",  monto:"RD$ 2,800", direccion:"La Romana",              telefono:"829-555-0110", estado:"Pendiente", ruta:"Este"  },
  { hora:"15:30", cliente:"María A. Cruz",   monto:"RD$ 3,200", direccion:"Los Jardines, SD",       telefono:"829-555-0103", estado:"Pendiente", ruta:"Sur"   },
];

const totalPendiente = "RD$ 14,200";
const totalCobrado   = "RD$ 1,500";

export default function AgendaHoyPage() {
  return (
    <div>
      <div style={{ display:"flex", gap:"8px", marginBottom:"15px" }}>
        <Btn color="green">Imprimir Ruta</Btn>
        <Btn color="blue">Exportar</Btn>
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"15px", marginBottom:"15px" }}>
        {[
          { label:"Cobros Pendientes", value:COBROS_HOY.filter(c=>c.estado==="Pendiente").length, color:"#f39c12" },
          { label:"Cobros Realizados", value:COBROS_HOY.filter(c=>c.estado==="Pagado").length,    color:"#00a65a" },
          { label:"Total Pendiente",   value:totalPendiente,  color:"#dd4b39" },
          { label:"Total Cobrado Hoy", value:totalCobrado,    color:"#3c8dbc" },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", borderRadius:"3px", boxShadow:"0 1px 1px rgba(0,0,0,0.1)", borderLeft:`4px solid ${s.color}`, padding:"12px 15px" }}>
            <p style={{ fontSize:"12px", color:"#999", margin:"0 0 4px" }}>{s.label}</p>
            <p style={{ fontSize:"20px", fontWeight:700, color:"#333", margin:0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <Box title={`📅 Agenda de Cobro — Hoy ${new Date().toLocaleDateString("es-DO",{weekday:"long",day:"numeric",month:"long"})}`} color="#00a65a">
        <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
          {COBROS_HOY.map((c, i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", gap:"15px",
              padding:"12px 0", borderBottom: i < COBROS_HOY.length-1 ? "1px solid #f4f4f4" : "none",
            }}>
              {/* Time */}
              <div style={{
                width:"60px", height:"50px", background:"#d9edf7", borderRadius:"4px",
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                flexShrink:0,
              }}>
                <span style={{ fontSize:"14px", fontWeight:700, color:"#31708f" }}>{c.hora}</span>
              </div>

              {/* Info */}
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"2px" }}>
                  <strong style={{ fontSize:"14px", color:"#333" }}>{c.cliente}</strong>
                  <span style={{
                    fontSize:"10px", padding:"1px 6px", borderRadius:"10px", fontWeight:700,
                    background: c.ruta==="Norte"?"#d9edf7":c.ruta==="Sur"?"#dff0d8":"#fdf2d0",
                    color: c.ruta==="Norte"?"#31708f":c.ruta==="Sur"?"#3c763d":"#8a6d3b",
                  }}>Ruta {c.ruta}</span>
                </div>
                <p style={{ fontSize:"12px", color:"#999", margin:0 }}>📍 {c.direccion} · 📞 {c.telefono}</p>
              </div>

              {/* Monto */}
              <div style={{ textAlign:"right" }}>
                <p style={{ fontSize:"18px", fontWeight:700, color:"#3c8dbc", margin:0 }}>{c.monto}</p>
              </div>

              {/* Estado + Botones */}
              <div style={{ display:"flex", flexDirection:"column", gap:"4px", alignItems:"flex-end", minWidth:"100px" }}>
                <span style={{
                  padding:"2px 8px", borderRadius:"3px", fontSize:"11px", fontWeight:700,
                  background: c.estado==="Pagado"?"#dff0d8":"#fcf8e3",
                  color: c.estado==="Pagado"?"#3c763d":"#8a6d3b",
                }}>{c.estado}</span>
                {c.estado === "Pendiente" && (
                  <button style={{ background:"#00a65a",color:"#fff",border:"none",borderRadius:"3px",padding:"3px 10px",fontSize:"11px",cursor:"pointer" }}>
                    Cobrar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop:"15px", padding:"12px 15px", background:"#f4f4f4", borderRadius:"3px", display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:"13px", color:"#666", fontWeight:600 }}>Total del día:</span>
          <span style={{ fontSize:"18px", fontWeight:700, color:"#3c8dbc" }}>RD$ 15,200</span>
        </div>
      </Box>
    </div>
  );
}
