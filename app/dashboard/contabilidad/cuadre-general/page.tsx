"use client";
import { Box, Btn } from "@/components/UI";

const DENOMINACIONES = [
  { bill:"RD$ 2,000", qty:0  },
  { bill:"RD$ 1,000", qty:0  },
  { bill:"RD$ 500",   qty:0  },
  { bill:"RD$ 200",   qty:0  },
  { bill:"RD$ 100",   qty:0  },
  { bill:"RD$ 50",    qty:0  },
  { bill:"RD$ 25",    qty:0  },
  { bill:"RD$ 10",    qty:0  },
  { bill:"RD$ 5",     qty:0  },
  { bill:"RD$ 1",     qty:0  },
];

const CUADRE = [
  { concepto:"Saldo inicial del día",          monto:"RD$ 45,000",  tipo:"entrada" },
  { concepto:"Total cobros del día",           monto:"RD$ 22,400",  tipo:"entrada" },
  { concepto:"Total préstamos otorgados",      monto:"RD$ 15,000",  tipo:"salida"  },
  { concepto:"Total gastos del día",           monto:"RD$ 2,500",   tipo:"salida"  },
  { concepto:"Total transacciones bancarias",  monto:"RD$ 0",       tipo:"salida"  },
  { concepto:"Saldo final esperado",           monto:"RD$ 49,900",  tipo:"total"   },
];

export default function CuadreGeneralPage() {
  return (
    <div>
      <div style={{ display:"flex", gap:"8px", marginBottom:"15px" }}>
        <Btn color="blue">Imprimir Cuadre</Btn>
        <Btn color="green">Exportar PDF</Btn>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"15px" }}>
        {/* Cuadre general */}
        <Box title="Cuadre General del Día" color="#3c8dbc">
          <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
            {CUADRE.map((r, i) => (
              <div key={i} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"10px 0", borderBottom: i < CUADRE.length-1 ? "1px solid #f4f4f4" : "2px solid #3c8dbc",
              }}>
                <span style={{ fontSize:"13px", color: r.tipo==="total" ? "#333" : "#666", fontWeight: r.tipo==="total" ? 700 : 400 }}>{r.concepto}</span>
                <span style={{
                  fontSize:"14px", fontWeight:700,
                  color: r.tipo==="entrada" ? "#00a65a" : r.tipo==="salida" ? "#dd4b39" : "#3c8dbc",
                }}>
                  {r.tipo==="salida" ? "−" : "+"} {r.monto}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:"15px", padding:"12px", background:"#d9edf7", borderRadius:"3px" }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontWeight:700, color:"#31708f" }}>Saldo Final Real (conteo):</span>
              <span style={{ fontWeight:700, color:"#31708f", fontSize:"18px" }}>RD$ 49,900</span>
            </div>
          </div>
        </Box>

        {/* Conteo por denominaciones */}
        <Box title="Conteo por Denominaciones" color="#00a65a">
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f4f4f4" }}>
                <th style={{ padding:"8px 10px", textAlign:"left", fontSize:"12px", fontWeight:700, color:"#777" }}>Billete / Moneda</th>
                <th style={{ padding:"8px 10px", textAlign:"center", fontSize:"12px", fontWeight:700, color:"#777" }}>Cantidad</th>
                <th style={{ padding:"8px 10px", textAlign:"right", fontSize:"12px", fontWeight:700, color:"#777" }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {DENOMINACIONES.map((d, i) => {
                const val = parseInt(d.bill.replace(/[^0-9]/g,""));
                return (
                  <tr key={i} style={{ borderBottom:"1px solid #f4f4f4" }}>
                    <td style={{ padding:"6px 10px", fontSize:"13px", fontWeight:600, color:"#444" }}>{d.bill}</td>
                    <td style={{ padding:"6px 10px", textAlign:"center" }}>
                      <input type="number" defaultValue={0} min={0}
                        style={{ width:"70px", padding:"3px 6px", border:"1px solid #d2d6de", borderRadius:"3px", textAlign:"center", fontSize:"13px" }} />
                    </td>
                    <td style={{ padding:"6px 10px", textAlign:"right", fontSize:"13px", color:"#3c8dbc", fontWeight:600 }}>
                      RD$ 0
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ marginTop:"10px", padding:"10px", background:"#dff0d8", borderRadius:"3px", display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontWeight:700, color:"#3c763d" }}>Total Contado:</span>
            <span style={{ fontWeight:700, color:"#3c763d", fontSize:"18px" }}>RD$ 0</span>
          </div>
          <div style={{ marginTop:"8px" }}>
            <Btn color="green">Confirmar Cuadre</Btn>
          </div>
        </Box>
      </div>
    </div>
  );
}
