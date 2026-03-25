"use client";
import { Box, Btn, Badge, FormRow, Input, Select } from "@/components/UI";
import { useState, useEffect } from "react";
import { getGastos, addGasto, deleteGasto } from "@/lib/data";
import { useAuth } from "@/lib/AuthContext";

export default function GastosPage() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ fecha: new Date().toISOString().slice(0, 10), monto: "", concepto: "", categoria: "Transporte" });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getGastos();
      setLista(data);
    } catch (error) {
      console.error("Error fetching gastos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!form.monto || !form.concepto) return;
    try {
      await addGasto({
        ...form,
        monto: parseFloat(form.monto),
        usuario: user?.nombre || "Sistema"
      });
      await fetchData();
      setShow(false);
      setForm({ fecha: new Date().toISOString().slice(0, 10), monto: "", concepto: "", categoria: "Transporte" });
    } catch (error) {
      alert("Error al guardar gasto");
    }
  }

  async function handleDelete(id: string) {
    if (confirm("¿Eliminar este gasto?")) {
      try {
        await deleteGasto(id);
        await fetchData();
      } catch (error) {
        alert("Error al eliminar gasto");
      }
    }
  }

  const totalMes = lista.reduce((s, g) => s + (g.monto || 0), 0);

  return (
    <div>
      <div style={{ display:"flex", gap:"8px", marginBottom:"15px" }}>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors" onClick={() => setShow(!show)}>+ Registrar Gasto</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Exportar</button>
      </div>

      {show && (
        <Box title="Nuevo Gasto" color="#dd4b39">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
            <FormRow label="Fecha"><Input type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} /></FormRow>
            <FormRow label="Monto"><Input type="number" placeholder="0.00" value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} /></FormRow>
            <FormRow label="Concepto"><Input placeholder="Descripción del gasto" value={form.concepto} onChange={e => setForm({...form, concepto: e.target.value})} /></FormRow>
            <FormRow label="Categoría"><Select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} options={["Transporte","Oficina","Papelería","Servicios","Otros"]} /></FormRow>
          </div>
          <div style={{ display:"flex", gap:"8px", marginTop:"10px" }}>
            <Btn color="green" onClick={handleSave}>Guardar</Btn>
            <Btn color="gray" onClick={() => setShow(false)}>Cancelar</Btn>
          </div>
        </Box>
      )}

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"15px", marginBottom:"15px" }}>
        {[
          { label:"Gastos de Hoy",     value:"RD$ 0",      color:"#3c8dbc" },
          { label:"Gastos Totales",    value: `RD$ ${totalMes.toLocaleString()}`, color:"#dd4b39" },
          { label:"Mayor Gasto",       value: `RD$ ${Math.max(0, ...lista.map(g => g.monto || 0)).toLocaleString()}`,  color:"#f39c12" },
          { label:"Total Transacciones",value: lista.length, color:"#00a65a" },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", borderRadius:"3px", boxShadow:"0 1px 1px rgba(0,0,0,0.1)", borderLeft:`4px solid ${s.color}`, padding:"12px 15px" }}>
            <p style={{ fontSize:"12px", color:"#999", margin:"0 0 4px" }}>{s.label}</p>
            <p style={{ fontSize:"20px", fontWeight:700, color:"#333", margin:0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <Box title="Registro de Gastos">
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f4f4f4" }}>
                {["#","Fecha","Concepto","Monto","Categoría","Usuario","Acciones"].map(h=>(
                  <th key={h} style={{ padding:"8px 12px",textAlign:"left",fontSize:"12px",fontWeight:700,color:"#777",textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lista.map(g=>(
                <tr key={g.id} style={{ borderBottom:"1px solid #f4f4f4" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="#f9f9f9")}
                  onMouseLeave={e=>(e.currentTarget.style.background="")}>
                  <td style={{ padding:"8px 12px",fontSize:"12px",color:"#aaa" }}>{g.id}</td>
                  <td style={{ padding:"8px 12px",fontSize:"13px" }}>{g.fecha}</td>
                  <td style={{ padding:"8px 12px",fontWeight:600,color:"#444" }}>{g.concepto}</td>
                  <td style={{ padding:"8px 12px",fontWeight:700,color:"#dd4b39" }}>RD$ {(g.monto || 0).toLocaleString()}</td>
                  <td style={{ padding:"8px 12px" }}><Badge color="blue">{g.categoria}</Badge></td>
                  <td style={{ padding:"8px 12px",fontSize:"12px",color:"#777" }}>{g.usuario}</td>
                  <td style={{ padding:"8px 12px" }}>
                    <button 
                      onClick={() => handleDelete(g.id)}
                      style={{ background:"#dd4b39",color:"#fff",border:"none",borderRadius:"3px",padding:"3px 8px",fontSize:"11px",cursor:"pointer" }}
                    >Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ paddingTop:"10px",borderTop:"1px solid #f4f4f4",marginTop:"10px",display:"flex",justifyContent:"space-between" }}>
          <span style={{ fontSize:"12px",color:"#999" }}>Total del período: <strong style={{ color:"#dd4b39" }}>RD$ {totalMes.toLocaleString()}</strong></span>
        </div>
      </Box>
    </div>
  );
}
