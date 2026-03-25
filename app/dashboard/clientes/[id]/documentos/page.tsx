"use client";
import { useState } from "react";
import { Box, Btn } from "@/components/UI";
import { useAuth } from "@/lib/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { CLIENTES } from "@/lib/data";

export default function DocumentosClientePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const cliente = CLIENTES.find(c => c.id === id);

    if (!cliente) return <div style={{ padding: "20px" }}>Cliente no encontrado</div>;

    const [docs, setDocs] = useState([
        { id: "doc-1", nombre: "Cédula de Identidad", tipo: "Imagen", fecha: "15/01/2026", url: "#" },
        { id: "doc-2", nombre: "Pagaré Notarial Firmado", tipo: "PDF", fecha: "20/01/2026", url: "#" },
    ]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>📂 Documentos: {cliente.nombre}</h2>
                <button onClick={() => router.back()} style={{ padding: "6px 14px", background: "#eee", border: "none", borderRadius: "3px", cursor: "pointer" }}>Volver</button>
            </div>

            <Box title="📤 Subir Nuevo Documento" color="#00a65a">
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "3px" }}>Nombre del Documento</label>
                        <input placeholder="Ej: Contrato de Préstamo" style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "3px" }}>Archivo</label>
                        <input type="file" style={{ width: "100%", padding: "5px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "12px" }} />
                    </div>
                    <button style={{ padding: "8px 20px", background: "#00a65a", color: "#fff", border: "none", borderRadius: "3px", fontWeight: 600, cursor: "pointer" }}>Subir</button>
                </div>
            </Box>

            <Box title="Lista de Archivos">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px" }}>
                    {docs.map(d => (
                        <div key={d.id} style={{ border: "1px solid #eee", borderRadius: "6px", padding: "15px", textAlign: "center", background: "#fdfdfd" }}>
                            <div style={{ fontSize: "40px", marginBottom: "10px" }}>{d.tipo === "PDF" ? "📄" : "🖼️"}</div>
                            <strong style={{ fontSize: "13px", display: "block", marginBottom: "5px", color: "#333" }}>{d.nombre}</strong>
                            <span style={{ fontSize: "11px", color: "#aaa" }}>Subido el {d.fecha}</span>
                            <div style={{ marginTop: "12px", display: "flex", gap: "5px", justifyContent: "center" }}>
                                <button style={{ padding: "4px 8px", background: "#3c8dbc", color: "#fff", border: "none", borderRadius: "3px", fontSize: "11px", cursor: "pointer" }}>Ver</button>
                                <button style={{ padding: "4px 8px", background: "#dd4b39", color: "#fff", border: "none", borderRadius: "3px", fontSize: "11px", cursor: "pointer" }}>Elininar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </Box>
        </div>
    );
}
