"use client";
import { Box } from "@/components/UI";
import { PAGOS, GASTOS } from "@/lib/data";

export default function FlujoCajaPage() {
  // Group by day
  const allDates = [...new Set([...PAGOS.map(p=>p.fecha), ...GASTOS.map(g=>g.fecha)])].sort((a,b)=>b.localeCompare(a));
  let saldoAcum = 0;
  const rows = allDates.map(fecha => {
    const ing = PAGOS.filter(p=>p.activo&&p.fecha===fecha).reduce((s,p)=>s+p.monto,0);
    const egr = GASTOS.filter(g=>g.fecha===fecha).reduce((s,g)=>s+g.monto,0);
    saldoAcum += ing - egr;
    return { fecha, ingresos: ing, egresos: egr, neto: ing-egr, acumulado: saldoAcum };
  });
  const totalIng = rows.reduce((s,r)=>s+r.ingresos,0);
  const totalEgr = rows.reduce((s,r)=>s+r.egresos,0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"15px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px" }}>
        {[
          { l:"Total Ingresos", v:`RD$ ${totalIng.toLocaleString()}`,  c:"#00a65a" },
          { l:"Total Egresos",  v:`RD$ ${totalEgr.toLocaleString()}`,  c:"#dd4b39" },
          { l:"Flujo Neto",     v:`RD$ ${(totalIng-totalEgr).toLocaleString()}`, c:(totalIng-totalEgr)>=0?"#00a65a":"#dd4b39" },
        ].map(s=>(
          <div key={s.l} style={{ background:"#fff", borderRadius:"3px", boxShadow:"0 1px 1px rgba(0,0,0,0.1)", borderLeft:`4px solid ${s.c}`, padding:"14px 18px" }}>
            <p style={{ fontSize:"12px", color:"#aaa", margin:"0 0 3px" }}>{s.l}</p>
            <p style={{ fontSize:"24px", fontWeight:700, color:s.c, margin:0 }}>{s.v}</p>
          </div>
        ))}
      </div>
      <Box title="📈 Flujo de Caja" headerRight={<button onClick={()=>window.print()} style={{ padding:"5px 12px", background:"#605ca8", color:"#fff", border:"none", borderRadius:"3px", fontSize:"12px", cursor:"pointer" }}>🖨️ Imprimir</button>}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f4f4f4" }}>
            {["Fecha","Ingresos","Egresos","Neto del Día","Saldo Acumulado"].map(h=>(
              <th key={h} style={{ padding:"9px 14px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#777", textTransform:"uppercase" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.fecha} style={{ borderBottom:"1px solid #f4f4f4" }}>
                <td style={{ padding:"9px 14px", fontWeight:600, color:"#555" }}>{r.fecha}</td>
                <td style={{ padding:"9px 14px", color:"#00a65a", fontWeight:600 }}>RD$ {r.ingresos.toLocaleString()}</td>
                <td style={{ padding:"9px 14px", color:"#dd4b39", fontWeight:600 }}>RD$ {r.egresos.toLocaleString()}</td>
                <td style={{ padding:"9px 14px", fontWeight:700, color:r.neto>=0?"#00a65a":"#dd4b39" }}>{r.neto>=0?"+":""}RD$ {r.neto.toLocaleString()}</td>
                <td style={{ padding:"9px 14px", fontWeight:700, fontSize:"14px", color:r.acumulado>=0?"#00a65a":"#dd4b39" }}>RD$ {r.acumulado.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  );
}
