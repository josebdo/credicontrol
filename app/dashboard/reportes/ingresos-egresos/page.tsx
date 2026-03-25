"use client";
import { useState, useEffect } from "react";
import { Box } from "@/components/UI";
import { getPagos, getGastos, addGasto } from "@/lib/data";

const CATEGORIAS = ["Operativo", "Administrativo", "Fijo", "Nómina", "Otro"];

export default function IngresosEgresosPage() {
  const [gastos, setGastos] = useState<any[]>([]);
  const [pagos, setPagos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fecha: new Date().toISOString().slice(0,10), concepto: "", monto: "", categoria: "Operativo", notas: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [pg, gs] = await Promise.all([getPagos(), getGastos()]);
      setPagos(pg);
      setGastos(gs);
    } catch (error) {
      console.error("Error fetching data for report:", error);
    } finally {
      setLoading(false);
    }
  }

  const ingresos = pagos.filter(p => p.activo).reduce((s, p) => s + (p.monto || 0), 0);
  const egresos = gastos.reduce((s, g) => s + (g.monto || 0), 0);
  const neto = ingresos - egresos;

  async function handleSave() {
    if (!form.concepto || !form.monto) return;
    try {
      await addGasto({ 
        fecha: form.fecha, 
        concepto: form.concepto, 
        monto: parseFloat(form.monto), 
        categoria: form.categoria, 
        notas: form.notas 
      });
      await fetchData();
      setSaved(true);
      setTimeout(() => { 
        setSaved(false); 
        setShowForm(false); 
        setForm({ fecha: new Date().toISOString().slice(0,10), concepto: "", monto: "", categoria: "Operativo", notas: "" }); 
      }, 800);
    } catch (error) {
      alert("Error al registrar gasto");
    }
  }

  const inp = (k: string, ph: string, type = "text") => (
    <input type={type} placeholder={ph} value={(form as any)[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
      style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", outline: "none", boxSizing: "border-box" as const }} />
  );

  if (loading) return <div className="p-8 text-center">Cargando reporte...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
        {[
          { l: "Ingresos", v: `RD$ ${ingresos.toLocaleString()}`, c: "#00a65a" },
          { l: "Egresos",  v: `RD$ ${egresos.toLocaleString()}`,  c: "#dd4b39" },
          { l: "Neto",     v: `RD$ ${neto.toLocaleString()}`,      c: neto >= 0 ? "#00a65a" : "#dd4b39" },
        ].map(s => (
          <div key={s.l} style={{ background: "#fff", borderRadius: "3px", boxShadow: "0 1px 1px rgba(0,0,0,0.1)", borderLeft: `4px solid ${s.c}`, padding: "14px 18px" }}>
            <p style={{ fontSize: "12px", color: "#aaa", margin: "0 0 3px" }}>{s.l}</p>
            <p style={{ fontSize: "26px", fontWeight: 700, color: s.c, margin: 0 }}>{s.v}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <Box title="💰 Ingresos (Pagos)">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#f4f4f4" }}>
              {["Fecha", "Cliente", "Monto", "Forma"].map(h => <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#777", textTransform: "uppercase" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {pagos.filter(p => p.activo).map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
                  <td style={{ padding: "8px 10px", fontSize: "12px", color: "#777" }}>{p.fecha_pago}</td>
                  <td style={{ padding: "8px 10px", fontSize: "13px", fontWeight: 600 }}>{p.cliente || p.clientes?.nombre}</td>
                  <td style={{ padding: "8px 10px", fontWeight: 700, color: "#00a65a" }}>RD$ {(p.monto || 0).toLocaleString()}</td>
                  <td style={{ padding: "8px 10px", fontSize: "12px" }}>{p.metodo_pago}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        <Box title="💸 Egresos (Gastos)" headerRight={
          <button onClick={() => setShowForm(!showForm)} style={{ padding: "4px 12px", background: "#dd4b39", color: "#fff", border: "none", borderRadius: "3px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>+ Gasto</button>
        }>
          {showForm && (
            <div style={{ padding: "12px", background: "#fdf2f2", borderRadius: "3px", marginBottom: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                <div>{inp("concepto", "Concepto *")}</div>
                <div>{inp("monto", "Monto (RD$) *", "number")}</div>
                <div>
                  <select value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))}
                    style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", background: "#fff" }}>
                    {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><input type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px" }} /></div>
              </div>
              <button onClick={handleSave} style={{ padding: "6px 14px", background: saved ? "#00a65a" : "#dd4b39", color: "#fff", border: "none", borderRadius: "3px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>{saved ? "✓ Guardado" : "Registrar"}</button>
            </div>
          )}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#f4f4f4" }}>
              {["Fecha", "Concepto", "Cat.", "Monto"].map(h => <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#777", textTransform: "uppercase" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {gastos.map(g => (
                <tr key={g.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
                  <td style={{ padding: "8px 10px", fontSize: "12px", color: "#777" }}>{g.fecha}</td>
                  <td style={{ padding: "8px 10px", fontSize: "13px" }}>{g.concepto}</td>
                  <td style={{ padding: "8px 10px", fontSize: "11px" }}><span style={{ background: "#f4f4f4", padding: "1px 6px", borderRadius: "3px" }}>{g.categoria}</span></td>
                  <td style={{ padding: "8px 10px", fontWeight: 700, color: "#dd4b39" }}>RD$ {(g.monto || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </div>
    </div>
  );
}
