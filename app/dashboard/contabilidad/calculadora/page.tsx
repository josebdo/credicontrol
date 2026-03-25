"use client";
import { useState } from "react";
import { Box } from "@/components/UI";

export default function CalculadoraPage() {
  const [monto, setMonto] = useState("25000");
  const [tasa, setTasa] = useState("5");
  const [cuotas, setCuotas] = useState("12");
  const m=parseFloat(monto)||0, r=parseFloat(tasa)/100, n=parseInt(cuotas)||12;
  const cuota = m>0&&r>0 ? (m*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1) : m/n;
  const totalPagar = cuota*n;
  const totalInteres = totalPagar - m;

  const amortizacion = Array.from({length:Math.min(n,36)},(_,i)=>{
    const saldoAnt = m*Math.pow(1+r,i) - cuota*((Math.pow(1+r,i)-1)/r);
    const int = saldoAnt*r;
    const cap = cuota-int;
    return { num:i+1, capital:Math.round(cap), interes:Math.round(int), cuota:Math.round(cuota), saldo:Math.max(0,Math.round(saldoAnt-cap)) };
  });

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"15px",alignItems:"start"}}>
      <Box title="🧮 Calculadora de Cuota">
        {[{l:"Monto del préstamo (RD$)",v:monto,s:setMonto},{l:"Tasa de interés mensual (%)",v:tasa,s:setTasa},{l:"Número de cuotas",v:cuotas,s:setCuotas}].map(({l,v,s})=>(
          <div key={l} style={{marginBottom:"12px"}}>
            <label style={{fontSize:"12px",fontWeight:600,color:"#555",display:"block",marginBottom:"3px"}}>{l}</label>
            <input type="number" value={v} onChange={e=>s(e.target.value)} style={{width:"100%",padding:"8px 12px",border:"1px solid #d2d6de",borderRadius:"3px",fontSize:"14px",outline:"none",fontWeight:600,boxSizing:"border-box" as const}}/>
          </div>
        ))}
        <div style={{marginTop:"16px",display:"flex",flexDirection:"column",gap:"8px"}}>
          {[
            {l:"Cuota mensual",  v:`RD$ ${Math.round(cuota).toLocaleString()}`,     c:"#00a65a",big:true},
            {l:"Total a pagar", v:`RD$ ${Math.round(totalPagar).toLocaleString()}`,  c:"#3c8dbc"},
            {l:"Total interés", v:`RD$ ${Math.round(totalInteres).toLocaleString()}`,c:"#f39c12"},
            {l:"Costo efectivo", v:`${((totalInteres/m)*100).toFixed(1)}%`,          c:"#dd4b39"},
          ].map(r=>(
            <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:"#f9f9f9",borderRadius:"3px"}}>
              <span style={{fontSize:"13px",color:"#666"}}>{r.l}</span>
              <span style={{fontSize:(r as any).big?"18px":"14px",fontWeight:700,color:r.c}}>{r.v}</span>
            </div>
          ))}
        </div>
      </Box>
      <Box title="Tabla de Amortización">
        <div style={{maxHeight:"460px",overflowY:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead style={{position:"sticky" as const,top:0}}><tr style={{background:"#f4f4f4"}}>
              {["#","Capital","Interés","Cuota","Saldo"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",fontSize:"11px",fontWeight:700,color:"#777",textTransform:"uppercase"}}>{h}</th>)}
            </tr></thead>
            <tbody>{amortizacion.map(row=>(
              <tr key={row.num} style={{borderBottom:"1px solid #f4f4f4"}}>
                <td style={{padding:"7px 10px",fontWeight:700,color:"#555"}}>{row.num}</td>
                <td style={{padding:"7px 10px",color:"#3c8dbc"}}>RD$ {row.capital.toLocaleString()}</td>
                <td style={{padding:"7px 10px",color:"#f39c12"}}>RD$ {row.interes.toLocaleString()}</td>
                <td style={{padding:"7px 10px",fontWeight:600}}>RD$ {row.cuota.toLocaleString()}</td>
                <td style={{padding:"7px 10px",color:"#dd4b39"}}>RD$ {row.saldo.toLocaleString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Box>
    </div>
  );
}
