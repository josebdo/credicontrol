"use client";
import { useState } from "react";
import { Box, Btn } from "@/components/UI";
import { GASTOS, addGasto, type Gasto } from "@/lib/data";
import { generarReferencia } from "@/lib/referencia";

export default function GastosPage() {
    const [lista, setLista] = useState(GASTOS);
    const [showForm, setShowForm] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({ concepto: "", monto: "", categoria: "Operativo", fecha: new Date().toISOString().slice(0, 10), notas: "" });

    function handleSave() {
        if (!form.concepto || !form.monto) return;
        const nuevo = addGasto({
            concepto: form.concepto,
            monto: parseFloat(form.monto),
            categoria: form.categoria,
            fecha: form.fecha.split("-").reverse().join("/"),
            notas: form.notas
        });
        setLista([nuevo, ...lista]);
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            setShowForm(false);
            setForm({ concepto: "", monto: "", categoria: "Operativo", fecha: new Date().toISOString().slice(0, 10), notas: "" });
        }, 800);
    }

    const total = lista.reduce((acc, g) => acc + g.monto, 0);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={() => setShowForm(!showForm)} style={{ padding: "8px 16px", background: "#dd4b39", color: "#fff", border: "none", borderRadius: "3px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                    {showForm ? "✕ Cancelar" : "+ Registrar Gasto"}
                </button>
                <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "12px", color: "#777" }}>Total Gastos (Mes)</span>
                    <h2 style={{ margin: 0, color: "#dd4b39" }}>RD$ {total.toLocaleString()}</h2>
                </div>
            </div>

            {showForm && (
                <Box title="💸 Registrar Nuevo Gasto" color="#dd4b39">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                            <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "3px" }}>Concepto / Detalle *</label>
                            <input value={form.concepto} onChange={e => setForm({ ...form, concepto: e.target.value })} placeholder="Ej: Pago de internet"
                                style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
                        </div>
                        <div>
                            <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "3px" }}>Monto (RD$) *</label>
                            <input type="number" value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} placeholder="0.00"
                                style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
                        </div>
                        <div>
                            <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "3px" }}>Categoría</label>
                            <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}
                                style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", background: "#fff" }}>
                                {["Operativo", "Administrativo", "Fijo", "Nómina", "Mantenimiento", "Impuestos", "Otros"].map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "3px" }}>Fecha</label>
                            <input type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })}
                                style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px" }} />
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "3px" }}>Notas adicionales</label>
                            <textarea value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })}
                                style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", height: "60px", resize: "none" }} />
                        </div>
                    </div>
                    <button onClick={handleSave} style={{ marginTop: "12px", padding: "8px 20px", background: saved ? "#00a65a" : "#dd4b39", color: "#fff", border: "none", borderRadius: "3px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                        {saved ? "✓ Registrado" : "Guardar Gasto"}
                    </button>
                </Box>
            )}

            <Box title="Historial de Gastos">
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f4f4f4" }}>
                                {["Fecha", "Referencia", "Concepto", "Categoría", "Monto"].map(h => (
                                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", color: "#777", textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {lista.map(g => (
                                <tr key={g.id} style={{ borderBottom: "1px solid #f4f4f4" }}>
                                    <td style={{ padding: "12px", fontSize: "13px" }}>{g.fecha}</td>
                                    <td style={{ padding: "12px", fontSize: "12px", fontFamily: "monospace", color: "#666" }}>{g.ref}</td>
                                    <td style={{ padding: "12px", fontSize: "13px", fontWeight: 600 }}>{g.concepto}</td>
                                    <td style={{ padding: "12px" }}>
                                        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: "#eee", color: "#555" }}>{g.categoria}</span>
                                    </td>
                                    <td style={{ padding: "12px", fontSize: "13px", fontWeight: 700, color: "#dd4b39", textAlign: "right" }}>RD$ {g.monto.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Box>
        </div>
    );
}
