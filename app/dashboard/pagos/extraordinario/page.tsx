"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { PRESTAMOS, addPago, updatePrestamo } from "@/lib/data";
import { generarReferencia } from "@/lib/referencia";
import { useAuth } from "@/lib/AuthContext";
import TicketImpresion from "@/components/TicketImpresion";

export default function PagoExtraordinarioPage() {
  const { empresa, user } = useAuth();
  const [buscar, setBuscar] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [monto, setMonto] = useState("");
  const [concepto, setConcepto] = useState("Abono extraordinario");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [forma, setForma] = useState("Efectivo");
  const [saved, setSaved] = useState(false);
  const [ticket, setTicket] = useState(false);
  const [refAuto] = useState(() => generarReferencia("PAG"));

  const activos = PRESTAMOS.filter(p => p.estado === "Activo" || p.estado === "Mora");
  const filtrados = buscar ? activos.filter(p => p.cliente.toLowerCase().includes(buscar.toLowerCase()) || p.id.includes(buscar)) : activos;
  const prestamo = PRESTAMOS.find(p => p.id === selectedId) || null;
  const montoNum = parseFloat(monto) || 0;
  const saldoNuevo = prestamo ? Math.max(0, prestamo.saldo - montoNum) : 0;

  function handleSave() {
    if (!prestamo || !montoNum) return;
    addPago({ fecha: fecha.split("-").reverse().join("/"), prestamo_id: prestamo.id, cliente: prestamo.cliente, cedula: prestamo.cedula, cuota_num: 0, total_cuotas: prestamo.num_cuotas, monto: montoNum, capital: montoNum, interes: 0, mora: 0, forma, cobrador: user?.nombre || "", activo: true });
    updatePrestamo(prestamo.id, { saldo: saldoNuevo, estado: saldoNuevo === 0 ? "Saldado" : prestamo.estado });
    setSaved(true);
    setTimeout(() => { setSaved(false); setTicket(true); }, 300);
  }

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", alignItems: "start" }}>
        <Box title="💰 Pago Extraordinario / Abono">
          <p style={{ fontSize: "13px", color: "#777", marginBottom: "14px", lineHeight: 1.6 }}>Un pago extraordinario es un abono adicional que se aplica directamente al capital del préstamo, reduciendo el saldo pendiente sin contar como cuota regular.</p>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "4px" }}>Préstamo a abonar *</label>
            <input value={buscar} onChange={e => { setBuscar(e.target.value); setSelectedId(""); }} placeholder="Nombre o ID del préstamo..."
              style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", outline: "none", boxSizing: "border-box" as const }} />
            {buscar && !selectedId && (
              <div style={{ border: "1px solid #eee", borderRadius: "3px", marginTop: "4px", maxHeight: "160px", overflowY: "auto", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                {filtrados.map(p => (
                  <div key={p.id} onClick={() => { setSelectedId(p.id); setBuscar(`${p.cliente} — ${p.id}`); }}
                    style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f4f4f4" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f0f7ff")}
                    onMouseLeave={e => (e.currentTarget.style.background = "")}>
                    <strong style={{ fontSize: "13px" }}>{p.id} — {p.cliente}</strong>
                    <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>Saldo: RD$ {p.saldo.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {[
            { l: "Monto del abono (RD$) *", k: "monto", v: monto, s: setMonto, type: "number", ph: "0.00" },
            { l: "Concepto", k: "concepto", v: concepto, s: setConcepto, type: "text", ph: "Abono extraordinario" },
          ].map(({ l, k, v, s, type, ph }) => (
            <div key={k} style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "3px" }}>{l}</label>
              <input type={type} value={v} onChange={e => s(e.target.value)} placeholder={ph}
                style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", outline: "none", boxSizing: "border-box" as const }} />
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "3px" }}>Fecha</label>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "3px" }}>Forma</label>
              <select value={forma} onChange={e => setForma(e.target.value)} style={{ width: "100%", padding: "7px 10px", border: "1px solid #d2d6de", borderRadius: "3px", fontSize: "13px", background: "#fff" }}>
                {["Efectivo", "Transferencia", "Cheque", "Tarjeta"].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "3px" }}>Referencia (auto)</label>
            <input readOnly value={refAuto} style={{ width: "100%", padding: "7px 10px", border: "1px solid #eee", borderRadius: "3px", fontSize: "12px", background: "#f9f9f9", fontFamily: "monospace", color: "#605ca8", boxSizing: "border-box" as const }} />
          </div>
          <button onClick={handleSave} disabled={!prestamo || !montoNum}
            style={{ padding: "8px 18px", background: saved ? "#00a65a" : (!prestamo || !montoNum) ? "#ccc" : "#f39c12", color: "#fff", border: "none", borderRadius: "3px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            {saved ? "✓ Registrado" : "Registrar Abono"}
          </button>
        </Box>

        <Box title="Resumen" color="#f39c12">
          {prestamo ? (
            <>
              {[
                { l: "Cliente", v: prestamo.cliente },
                { l: "Préstamo", v: prestamo.id },
                { l: "Saldo actual", v: `RD$ ${prestamo.saldo.toLocaleString()}`, color: "#dd4b39" },
                { l: "Abono", v: montoNum > 0 ? `RD$ ${montoNum.toLocaleString()}` : "—", color: "#f39c12" },
                { l: "Saldo nuevo", v: `RD$ ${saldoNuevo.toLocaleString()}`, color: saldoNuevo === 0 ? "#00a65a" : "#dd4b39" },
              ].map(r => (
                <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f4f4f4" }}>
                  <span style={{ fontSize: "13px", color: "#666" }}>{r.l}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: (r as any).color ?? "#333" }}>{r.v}</span>
                </div>
              ))}
              {saldoNuevo === 0 && montoNum > 0 && <div style={{ marginTop: "10px", padding: "8px", background: "#dff0d8", borderRadius: "3px", textAlign: "center", fontWeight: 700, color: "#3c763d" }}>🎉 PRÉSTAMO SALDADO</div>}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "30px", color: "#ccc" }}>
              <div style={{ fontSize: "40px" }}>💡</div>
              <p style={{ fontSize: "13px", color: "#aaa", marginTop: "10px" }}>Selecciona un préstamo para ver el resumen</p>
            </div>
          )}
        </Box>
      </div>
      {ticket && prestamo && (
        <TicketImpresion onClose={() => setTicket(false)} datos={{
          tipo: "pago",
          empresa: {
            nombre: empresa?.nombre ?? "CrediControl",
            dueno: empresa?.dueno ?? "",
            telefono: empresa?.telefono ?? "",
            direccion: empresa?.direccion ?? ""
          },
          prestamo_id: prestamo.id, fecha: fecha.split("-").reverse().join("/"),
          cliente: prestamo.cliente, cedula: prestamo.cedula, cuota_num: "EXTRAORDINARIO",
          pago_total: `RD$ ${montoNum.toLocaleString()}`, pago_capital: `RD$ ${montoNum.toLocaleString()}`,
          pago_interes: "RD$ 0.00", pago_mora: "RD$ 0.00", efectividad: fecha.split("-").reverse().join("/"),
          pendiente_mora: "RD$ 0.00", cuotas_pendientes: prestamo.num_cuotas - prestamo.pagadas, saldo_total: `RD$ ${saldoNuevo.toLocaleString()}`,
        }} />
      )}
    </>
  );
}
