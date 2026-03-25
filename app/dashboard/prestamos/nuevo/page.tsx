"use client";
import { Card, CardHeader, CardTitle, CardContent, FormField, ModernSelect, ModernInput, ModernButton, Badge } from "@/components/UI";
import { useState } from "react";
import TicketImpresion from "@/components/TicketImpresion";
import { useAuth } from "@/lib/AuthContext";
import { Calculator, Printer, Save, User, DollarSign, Percent, Calendar, CreditCard, FileText, TrendingUp } from "lucide-react";

export default function NuevoPrestamo() {
  const { empresa } = useAuth();
  const [monto, setMonto] = useState("");
  const [interes, setInteres] = useState("5");
  const [cuotas, setCuotas] = useState("12");
  const [cliente, setCliente] = useState("Rosa M. Peña");
  const [ticket, setTicket] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const m = parseFloat(monto.replace(/,/g, "")) || 0;
  const r = parseFloat(interes) / 100;
  const n = parseInt(cuotas) || 12;
  const cuotaCalc = m > 0 ? ((m * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)).toFixed(2) : "0.00";
  const totalPagar = m > 0 ? (parseFloat(cuotaCalc) * n).toFixed(2) : "0.00";
  const totalInteres = m > 0 ? (parseFloat(totalPagar) - m).toFixed(2) : "0.00";

  const fechaInicio = new Date();
  const fechaFin = new Date(fechaInicio);
  fechaFin.setMonth(fechaFin.getMonth() + n);
  const fmtFecha = (d: Date) => d.toLocaleDateString("es-DO");

  function handleGuardar() {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
    if (m > 0) setTimeout(() => setTicket(true), 300);
  }

  const clientes = ["Rosa M. Peña", "Juan C. Soto", "María A. Cruz", "Pedro R. Díaz", "Carmen L. Vega"];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Datos del Préstamo</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">Complete la información del nuevo préstamo</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormField label="Cliente" required icon={<User className="h-4 w-4" />}>
                    <ModernSelect 
                      value={cliente} 
                      onChange={e => setCliente(e.target.value)}
                      options={clientes.map(c => ({ value: c, label: c }))}
                    />
                  </FormField>
                </div>

                <FormField label="Monto del Préstamo" required icon={<DollarSign className="h-4 w-4" />}>
                  <ModernInput 
                    placeholder="RD$ 0.00" 
                    value={monto} 
                    onChange={e => setMonto(e.target.value)}
                  />
                </FormField>

                <FormField label="Tipo de Interés">
                  <ModernSelect options={[
                    { value: "mensual", label: "Mensual" },
                    { value: "quincenal", label: "Quincenal" },
                    { value: "semanal", label: "Semanal" },
                    { value: "diario", label: "Diario" },
                  ]} />
                </FormField>

                <FormField label="Tasa de Interés (%)" required icon={<Percent className="h-4 w-4" />}>
                  <ModernInput 
                    type="number" 
                    value={interes} 
                    onChange={e => setInteres(e.target.value)}
                  />
                </FormField>

                <FormField label="Número de Cuotas" required>
                  <ModernInput 
                    type="number" 
                    value={cuotas} 
                    onChange={e => setCuotas(e.target.value)}
                  />
                </FormField>

                <FormField label="Frecuencia de Pago" icon={<Calendar className="h-4 w-4" />}>
                  <ModernSelect options={[
                    { value: "mensual", label: "Mensual" },
                    { value: "quincenal", label: "Quincenal" },
                    { value: "semanal", label: "Semanal" },
                    { value: "diario", label: "Diario" },
                  ]} />
                </FormField>

                <FormField label="Fecha de Inicio">
                  <ModernInput type="date" defaultValue="2026-03-18" />
                </FormField>

                <FormField label="Modo de Interés">
                  <ModernSelect options={[
                    { value: "saldo", label: "Interés sobre saldo" },
                    { value: "fijo", label: "Interés fijo" },
                    { value: "capital", label: "Interés sobre capital" },
                  ]} />
                </FormField>

                <FormField label="Garantía">
                  <ModernSelect options={[
                    { value: "sin", label: "Sin garantía" },
                    { value: "vehiculo", label: "Vehículo" },
                    { value: "vivienda", label: "Vivienda" },
                    { value: "solar", label: "Solar" },
                    { value: "pagare", label: "Pagaré notarial" },
                  ]} />
                </FormField>

                <FormField label="Cobrador">
                  <ModernSelect options={[
                    { value: "", label: "Sin asignar" },
                    { value: "carlos", label: "Carlos Pérez" },
                    { value: "maria", label: "María Rodríguez" },
                  ]} />
                </FormField>

                <FormField label="Ruta">
                  <ModernSelect options={[
                    { value: "", label: "Sin ruta" },
                    { value: "norte", label: "Ruta Norte" },
                    { value: "sur", label: "Ruta Sur" },
                    { value: "este", label: "Ruta Este" },
                    { value: "oeste", label: "Ruta Oeste" },
                  ]} />
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Observaciones" icon={<FileText className="h-4 w-4" />}>
                    <textarea 
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      rows={3}
                      placeholder="Notas adicionales sobre el préstamo..."
                    />
                  </FormField>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-6 mt-6 border-t border-border">
                <ModernButton onClick={handleGuardar} color={guardado ? "green" : "blue"}>
                  <Save className="h-4 w-4" />
                  {guardado ? "Guardado" : "Guardar Préstamo"}
                </ModernButton>
                {m > 0 && (
                  <ModernButton onClick={() => setTicket(true)} color="yellow">
                    <Printer className="h-4 w-4" />
                    Imprimir Ticket
                  </ModernButton>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar con calculadora */}
        <div className="space-y-6">
          {/* Calculadora de Cuota */}
          <Card className="border-t-4 border-t-success">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-success" />
                <CardTitle className="text-base">Calculadora de Cuota</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { l: "Monto del préstamo", v: `RD$ ${m.toLocaleString()}` },
                { l: "Interés mensual", v: `${interes}%` },
                { l: "Número de cuotas", v: cuotas },
                { l: "Cuota estimada", v: `RD$ ${cuotaCalc}`, highlight: "success" },
                { l: "Total a pagar", v: `RD$ ${parseFloat(totalPagar).toLocaleString()}`, highlight: "primary" },
                { l: "Total en intereses", v: `RD$ ${parseFloat(totalInteres).toLocaleString()}`, highlight: "warning" },
              ].map(row => (
                <div key={row.l} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{row.l}</span>
                  <span className={`text-sm font-semibold ${
                    row.highlight === 'success' ? 'text-success' :
                    row.highlight === 'primary' ? 'text-primary' :
                    row.highlight === 'warning' ? 'text-warning' : 'text-foreground'
                  }`}>{row.v}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Plan de Amortización */}
          <Card className="border-t-4 border-t-primary">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Plan de Amortización</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto -mx-4 px-4">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-medium text-muted-foreground">#</th>
                      <th className="px-2 py-2 text-right text-xs font-medium text-muted-foreground">Capital</th>
                      <th className="px-2 py-2 text-right text-xs font-medium text-muted-foreground">Interés</th>
                      <th className="px-2 py-2 text-right text-xs font-medium text-muted-foreground">Cuota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: Math.min(n, 24) }).map((_, i) => {
                      const saldo = m - (m / n) * i;
                      const intMes = saldo * r;
                      const cap = parseFloat(cuotaCalc) - intMes;
                      return (
                        <tr key={i} className="border-b border-border/50 last:border-0">
                          <td className="px-2 py-2 text-muted-foreground">{i + 1}</td>
                          <td className="px-2 py-2 text-right">RD$ {Math.max(0, cap).toFixed(0)}</td>
                          <td className="px-2 py-2 text-right text-warning">RD$ {Math.max(0, intMes).toFixed(0)}</td>
                          <td className="px-2 py-2 text-right font-medium">RD$ {cuotaCalc}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {ticket && m > 0 && (
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
            prestamo_id: "P-0051",
            fecha: fmtFecha(fechaInicio),
            cliente,
            monto: `RD$ ${m.toLocaleString()}`,
            tasa: `${interes}% mensual`,
            num_cuotas: n,
            cuota: `RD$ ${parseFloat(cuotaCalc).toLocaleString()}`,
            total_interes: `RD$ ${parseFloat(totalInteres).toLocaleString()}`,
            total_pagar: `RD$ ${parseFloat(totalPagar).toLocaleString()}`,
            fecha_inicio: fmtFecha(fechaInicio),
            fecha_fin: fmtFecha(fechaFin),
          }}
        />
      )}
    </>
  );
}
