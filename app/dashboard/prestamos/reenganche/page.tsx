"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { PRESTAMOS, CLIENTES, addPrestamo } from "@/lib/data";
import { generarReferencia } from "@/lib/referencia";
import TicketImpresion from "@/components/TicketImpresion";
import { useAuth } from "@/lib/AuthContext";

export default function ReenganchePage() {
  const { empresa } = useAuth();
  const [buscar, setBuscar] = useState("");
  const [selected, setSelected] = useState<typeof PRESTAMOS[0] | null>(null);
  const [monto, setMonto] = useState("");
  const [cuotas, setCuotas] = useState("12");
  const [tasa, setTasa] = useState("5");
  const [saved, setSaved] = useState(false);
  const [ticket, setTicket] = useState(false);

  const prestamosActivos = PRESTAMOS.filter(p =>
    (p.estado === "Activo" || p.estado === "Mora") &&
    (p.cliente.toLowerCase().includes(buscar.toLowerCase()) || p.id.includes(buscar))
  );

  const m = parseFloat(monto) || 0;
  const r = parseFloat(tasa) / 100;
  const n = parseInt(cuotas) || 12;
  const cuota = m > 0 && r > 0 ? (m * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const totalPagar = cuota * n;
  const nuevoSaldo = selected ? selected.saldo + m : 0;

  function handleSave() {
    if (!selected || !m) return;
    addPrestamo({
      cliente_id: selected.cliente_id, cliente: selected.cliente, cedula: selected.cedula,
      monto: m, tasa: parseFloat(tasa), cuota: Math.round(cuota), num_cuotas: n, pagadas: 0,
      fecha_inicio: new Date().toLocaleDateString("es-DO"),
      fecha_vence: new Date(Date.now() + n * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("es-DO"),
      saldo: m, dias_mora: 0, mora_acum: 0, estado: "Activo",
      cobrador: selected.cobrador, ruta: selected.ruta,
      notas: `Reenganche de ${selected.id}`
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); setTicket(true); }, 300);
  }

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", alignItems: "start" }}>
        <Box title="Reenganche de Préstamo">
          <p style={{ fontSize: "13px", color: "#777", marginBottom: "14px", lineHeight: 1.6 }}>
            El reenganche permite crear un nuevo préstamo vinculado a un cliente que ya tiene uno activo, sumando o refinanciando el saldo pendiente.
          </p>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "4px" }}>Buscar préstamo activo</label>
            <input value={buscar} onChange={e => setBuscar(e.target.value)} placeholder="Nombre del cliente o ID del préstamo"
              style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", outline: "none", boxSizing: "border-box" as const }} />
          </div>
          {buscar && (
            <div style={{ border: "1px solid #eee", borderRadius: "3px", marginBottom: "12px", maxHeight: "180px", overflowY: "auto" }}>
              {prestamosActivos.length === 0 && <p style={{ padding: "12px", fontSize: "13px", color: "#aaa", textAlign: "center" }}>Sin resultados</p>}
              {prestamosActivos.map(p => (
                <div key={p.id} onClick={() => setSelected(p)}
                  style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f4f4f4", background: selected?.id === p.id ? "#ecf5fb" : "#fff" }}>
                  <strong style={{ fontSize: "13px", color: "#333" }}>{p.id} — {p.cliente}</strong>
                  <p style={{ fontSize: "12px", color: p.dias_mora > 0 ? "#dd4b39" : "#aaa", margin: 0 }}>
                    Saldo: RD$ {p.saldo.toLocaleString()} · {p.dias_mora > 0 ? `${p.dias_mora}d mora` : "Al día"}
                  </p>
                </div>
              ))}
            </div>
          )}
          {selected && (
            <>
              <div style={{ padding: "10px", background: "#f0f7ff", borderRadius: "3px", marginBottom: "12px", border: "1px solid #3c8dbc33" }}>
                <strong style={{ fontSize: "13px" }}>{selected.cliente}</strong>
                <p style={{ fontSize: "12px", color: "#555", margin: "3px 0 0" }}>Préstamo {selected.id} · Saldo pendiente: <strong style={{ color: "#dd4b39" }}>RD$ {selected.saldo.toLocaleString()}</strong></p>
              </div>
              {[
                { l: "Nuevo monto adicional (RD$)", k: "monto", v: monto, s: setMonto },
                { l: "Tasa de interés (%)", k: "tasa", v: tasa, s: setTasa },
                { l: "Número de cuotas", k: "cuotas", v: cuotas, s: setCuotas },
              ].map(({ l, k, v, s }) => (
                <div key={k} style={{ marginBottom: "10px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "3px" }}>{l}</label>
                  <input type="number" value={v} onChange={e => s(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", outline: "none", boxSizing: "border-box" as const }} />
                </div>
              ))}
              <button onClick={handleSave} style={{ padding: "8px 18px", background: saved ? "#00a65a" : "#3c8dbc", color: "#fff", border: "none", borderRadius: "3px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                {saved ? "✓ Reenganche Creado" : "Crear Reenganche"}
              </button>
            </>
          )}
        </Box>

        {selected && (
          <Box title="Resumen del Reenganche" color="#f39c12">
            {[
              { l: "Cliente", v: selected.cliente },
              { l: "Préstamo original", v: selected.id },
              { l: "Saldo actual", v: `RD$ ${selected.saldo.toLocaleString()}`, color: "#dd4b39" },
              { l: "Nuevo monto", v: `RD$ ${m.toLocaleString()}`, color: "#3c8dbc" },
              { l: "Total refinanciado", v: `RD$ ${nuevoSaldo.toLocaleString()}`, color: "#f39c12" },
              { l: "Nueva cuota", v: `RD$ ${Math.round(cuota).toLocaleString()}`, color: "#00a65a" },
              { l: "Total a pagar", v: `RD$ ${Math.round(totalPagar).toLocaleString()}` },
            ].map(r => (
              <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f4f4f4" }}>
                <span style={{ fontSize: "13px", color: "#666" }}>{r.l}</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: (r as any).color ?? "#333" }}>{r.v || "—"}</span>
              </div>
            ))}
          </Box>
        )}
      </div>
      {ticket && selected && (
        <TicketImpresion
          onClose={() => setTicket(false)}
          datos={{
            tipo: "prestamo",
            empresa: {
              nombre: empresa?.nombre ?? "CrediControl",
              dueno: empresa?.dueno ?? "",
              telefono: empresa?.telefono ?? "",
              direccion: empresa?.direccion ?? ""
            },
            prestamo_id: "Reenganche", fecha: new Date().toLocaleDateString("es-DO"),
            cliente: selected.cliente, monto: `RD$ ${m.toLocaleString()}`,
            tasa: `${tasa}% mensual`, num_cuotas: n, cuota: `RD$ ${Math.round(cuota).toLocaleString()}`,
            total_pagar: `RD$ ${Math.round(totalPagar).toLocaleString()}`,
            fecha_inicio: new Date().toLocaleDateString("es-DO"),
            fecha_fin: new Date(Date.now() + n * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("es-DO"),
          }}
        />
      )}
    </>
  );
}
