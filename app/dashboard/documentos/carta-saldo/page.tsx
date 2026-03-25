"use client";
import { Box, FormRow, Select, Btn } from "@/components/UI";
import { useState } from "react";
import TicketImpresion from "@/components/TicketImpresion";
import { useAuth } from "@/lib/AuthContext";

export default function CartaSaldoPage() {
  const { empresa } = useAuth();
  const [ticket, setTicket] = useState(false);
  const fecha = new Date().toLocaleDateString("es-DO", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", alignItems: "start" }}>
        <Box title="Generar Carta de Saldo">
          <FormRow label="Préstamo *">
            <Select options={["Seleccionar préstamo...", "P-0050 · Rosa M. Peña", "P-0048 · María A. Cruz", "P-0044 · Ana P. Reyes"]} />
          </FormRow>
          <FormRow label="Lugar">
            <Select options={["Santo Domingo", "Santiago", "San Pedro de Macorís", "La Vega"]} />
          </FormRow>
          <div style={{ display: "flex", gap: "8px", marginTop: "15px" }}>
            <Btn color="blue">Vista Previa</Btn>
            <button onClick={() => setTicket(true)} style={{ padding: "6px 14px", background: "#f39c12", color: "#fff", border: "none", borderRadius: "3px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              🖨️ Imprimir Ticket
            </button>
          </div>
        </Box>

        <Box title="Documento Formal" color="#00a65a">
          <div style={{ border: "1px solid #ddd", padding: "20px", fontFamily: "serif", fontSize: "12px", lineHeight: 1.8, color: "#333", background: "#fafafa" }}>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "15px", margin: "0 0 3px" }}>{empresa?.nombre ?? "CrediControl"}</h2>
              <p style={{ fontSize: "11px", color: "#666", margin: 0 }}>credicontrol.net</p>
              <hr style={{ margin: "8px 0", borderColor: "#ccc" }} />
              <h3 style={{ fontSize: "14px", fontWeight: "bold", margin: 0, letterSpacing: "2px" }}>CARTA DE SALDO</h3>
            </div>
            <p>Santo Domingo, a {fecha}.</p>
            <p>Yo, <strong>{empresa?.dueno || "Acreedor"}</strong>, por medio de la presente <strong>DECLARO Y CERTIFICO</strong> que:</p>
            <p>La señora <strong>ROSA M. PEÑA</strong>, portadora de la Cédula No. 001-1234567-8, ha saldado en su totalidad la deuda contraída mediante préstamo de fecha 05/01/2026, por un monto de <strong>RD$ 25,000.00</strong>.</p>
            <p>En consecuencia, el referido préstamo queda totalmente <strong>CANCELADO</strong> a partir de la fecha indicada.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "35px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ borderTop: "1px solid #333", paddingTop: "4px" }}>
                  <p style={{ margin: 0, fontSize: "11px" }}>{empresa?.dueno || "Acreedor"} — Acreedor</p>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ borderTop: "1px solid #333", paddingTop: "4px" }}>
                  <p style={{ margin: 0, fontSize: "11px" }}>ROSA M. PEÑA — Deudora</p>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </div>

      {ticket && (
        <TicketImpresion
          onClose={() => setTicket(false)}
          datos={{
            tipo: "saldo",
            empresa: {
              nombre: empresa?.nombre ?? "CrediControl",
              dueno: empresa?.dueno ?? "",
              telefono: empresa?.telefono ?? "",
              direccion: empresa?.direccion ?? ""
            },
            prestamo_id: "P-0050",
            fecha: new Date().toLocaleDateString("es-DO"),
            cliente: "ROSA M. PEÑA",
            cedula: "001-1234567-8",
            saldo_anterior: "RD$ 9,600.00",
            monto_pagado: "RD$ 9,600.00",
            saldo_nuevo: "RD$ 0.00",
            es_cancelacion: true,
          }}
        />
      )}
    </>
  );
}
