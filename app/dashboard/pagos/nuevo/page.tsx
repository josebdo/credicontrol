"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, FormField, ModernSelect, ModernInput, ModernButton, Badge, StatCard } from "@/components/UI";
import { getPrestamos, addPago, updatePrestamo, type Prestamo } from "@/lib/data";
import { generarReferencia } from "@/lib/referencia";
import TicketImpresion from "@/components/TicketImpresion";
import { useAuth } from "@/lib/AuthContext";
import { Search, CreditCard, Receipt, Printer, Save, User, DollarSign, Calendar, Banknote, AlertTriangle, CheckCircle2, PartyPopper } from "lucide-react";

export default function NuevoPago() {
  const { empresa, user } = useAuth();
  const searchParams = useSearchParams();
  const [lista, setLista] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [buscar, setBuscar] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [forma, setForma] = useState("Efectivo");
  const [refAuto] = useState(() => generarReferencia("PAG"));
  const [saved, setSaved] = useState(false);
  const [ticket, setTicket] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getPrestamos();
      setLista(data);
      
      const pId = searchParams.get("prestamoId");
      if (pId) {
        const p = data.find(item => item.id === pId);
        if (p) {
          setSelectedId(p.id);
          setBuscar(`${p.cliente} — ${p.id}`);
          setMonto(p.cuota?.toString() || "");
        }
      }
    } catch (error) {
      console.error("Error fetching prestamos:", error);
    } finally {
      setLoading(false);
    }
  }

  const prestamosActivos = lista.filter(p => p.estado === "activo" || p.estado === "mora");
  const filtrados = buscar && !selectedId
    ? prestamosActivos.filter(p => (p.cliente || "").toLowerCase().includes(buscar.toLowerCase()) || p.id.includes(buscar))
    : prestamosActivos;

  const prestamo = lista.find(p => p.id === selectedId) || null;

  const montoNum = parseFloat(monto) || 0;
  const interest = prestamo ? ((prestamo.saldo || 0) * (prestamo.tasa_interes || 0) / 100) : 0;
  const capital = Math.max(0, montoNum - interest - (prestamo?.mora_acumulada || 0));
  const cuotaNum = prestamo ? (prestamo.pagadas || 0) + 1 : 0;
  const saldoNuevo = prestamo ? Math.max(0, (prestamo.saldo || 0) - capital) : 0;
  const esSaldado = saldoNuevo === 0;

  async function handleSave() {
    if (!prestamo || !montoNum) return;
    try {
      await addPago({
        fecha: fecha.split("-").reverse().join("/"),
        prestamo_id: prestamo.id, 
        monto: montoNum,
        forma_pago: forma.toLowerCase() as any,
        referencia: refAuto,
      });
      await updatePrestamo(prestamo.id, {
        pagadas: (prestamo.pagadas || 0) + 1,
        saldo_capital: saldoNuevo,
        estado: esSaldado ? "saldado" : "activo",
        mora_acumulada: 0,
        dias_mora: 0,
      });
      setSaved(true);
      setTimeout(() => { setSaved(false); setTicket(true); fetchData(); }, 300);
    } catch (error) {
      alert("Error al registrar pago");
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario de Pago */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Registrar Pago</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Ingrese los datos del pago</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Buscador de préstamo */}
            <FormField label="Buscar Préstamo" required icon={<Search className="h-4 w-4" />}>
              <div className="relative">
                <ModernInput 
                  value={buscar} 
                  onChange={e => { setBuscar(e.target.value); setSelectedId(""); }} 
                  placeholder="Nombre del cliente o ID del préstamo..."
                />
                {buscar && !selectedId && (
                  <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg shadow-elevated max-h-60 overflow-y-auto">
                    {filtrados.length === 0 && (
                      <p className="p-4 text-center text-sm text-muted-foreground">Sin resultados</p>
                    )}
                    {filtrados.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => { setSelectedId(p.id); setBuscar(`${p.cliente} — ${p.id}`); }}
                        className="px-4 py-3 cursor-pointer border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{p.id} — {p.cliente}</span>
                          {p.dias_mora > 0 && (
                            <Badge color="red" size="sm">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {p.dias_mora}d mora
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Saldo: RD$ {(p.saldo || 0).toLocaleString()} · Cuota: RD$ {(p.cuota || 0).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormField>

            {/* Monto */}
            <FormField label="Monto Recibido" required icon={<DollarSign className="h-4 w-4" />}>
              <ModernInput 
                type="number" 
                value={monto} 
                onChange={e => setMonto(e.target.value)} 
                placeholder="0.00"
              />
              {prestamo && (
                <p className="text-xs text-primary mt-1">
                  Cuota sugerida: RD$ {(prestamo.cuota || 0).toLocaleString()}
                </p>
              )}
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Fecha de Pago" icon={<Calendar className="h-4 w-4" />}>
                <ModernInput 
                  type="date" 
                  value={fecha} 
                  onChange={e => setFecha(e.target.value)}
                />
              </FormField>

              <FormField label="Forma de Pago" icon={<Banknote className="h-4 w-4" />}>
                <ModernSelect 
                  value={forma} 
                  onChange={e => setForma(e.target.value)}
                  options={[
                    { value: "Efectivo", label: "Efectivo" },
                    { value: "Transferencia", label: "Transferencia" },
                    { value: "Cheque", label: "Cheque" },
                    { value: "Tarjeta", label: "Tarjeta" },
                  ]}
                />
              </FormField>
            </div>

            <FormField label="Referencia" icon={<Receipt className="h-4 w-4" />}>
              <ModernInput 
                disabled 
                value={refAuto} 
                className="bg-muted font-mono text-primary"
              />
            </FormField>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
              <ModernButton 
                onClick={handleSave} 
                disabled={!prestamo || !montoNum}
                color={saved ? "green" : "blue"}
              >
                <Save className="h-4 w-4" />
                {saved ? "Registrado" : "Registrar Pago"}
              </ModernButton>
              {prestamo && montoNum > 0 && (
                <ModernButton onClick={() => setTicket(true)} color="yellow">
                  <Printer className="h-4 w-4" />
                  Imprimir Recibo
                </ModernButton>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Panel derecho */}
        {prestamo ? (
          <div className="space-y-6">
            {/* Resumen del Préstamo */}
            <Card className="border-t-4 border-t-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Resumen del Préstamo</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { l: "Cliente", v: prestamo.cliente || "", bold: true },
                  { l: "Préstamo", v: prestamo.id },
                  { l: "Monto original", v: `RD$ ${prestamo.monto.toLocaleString()}` },
                  { l: "Saldo actual", v: `RD$ ${(prestamo.saldo || 0).toLocaleString()}`, color: "destructive" },
                  { l: "Cuota mensual", v: `RD$ ${(prestamo.cuota || 0).toLocaleString()}` },
                  { l: "Cuotas pagadas", v: `${prestamo.pagadas || 0} de ${prestamo.num_cuotas}` },
                  { l: "Mora acumulada", v: (prestamo.mora_acumulada || 0) > 0 ? `RD$ {(prestamo.mora_acumulada || 0).toLocaleString()}` : "Sin mora", color: (prestamo.mora_acumulada || 0) > 0 ? "destructive" : "success" },
                ].map(r => (
                  <div key={r.l} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted-foreground">{r.l}</span>
                    <span className={`text-sm font-semibold ${
                      r.color === 'destructive' ? 'text-destructive' :
                      r.color === 'success' ? 'text-success' : 'text-foreground'
                    }`}>{r.v}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Desglose del Pago */}
            {montoNum > 0 && (
              <Card className="border-t-4 border-t-success">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <CardTitle className="text-base">Desglose del Pago</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { l: "Capital", v: `RD$ ${Math.round(capital).toLocaleString()}`, color: "primary" },
                    { l: "Interés", v: `RD$ ${Math.round(interest).toLocaleString()}`, color: "warning" },
                    { l: "Mora", v: `RD$ ${(prestamo.mora_acumulada || 0).toLocaleString()}`, color: (prestamo.mora_acumulada || 0) > 0 ? "destructive" : "muted" },
                    { l: "Total recibido", v: `RD$ ${montoNum.toLocaleString()}`, color: "success" },
                    { l: "Saldo nuevo", v: `RD$ ${saldoNuevo.toLocaleString()}`, color: saldoNuevo === 0 ? "success" : "destructive" },
                  ].map(r => (
                    <div key={r.l} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                      <span className="text-sm text-muted-foreground">{r.l}</span>
                      <span className={`text-sm font-semibold ${
                        r.color === 'destructive' ? 'text-destructive' :
                        r.color === 'success' ? 'text-success' :
                        r.color === 'primary' ? 'text-primary' :
                        r.color === 'warning' ? 'text-warning' : 'text-muted-foreground'
                      }`}>{r.v}</span>
                    </div>
                  ))}
                  
                  {esSaldado && (
                    <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/20 text-center">
                      <PartyPopper className="h-8 w-8 text-success mx-auto mb-2" />
                      <p className="font-bold text-success">PRESTAMO SALDADO COMPLETAMENTE</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="flex items-center justify-center min-h-[400px]">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Seleccione un Préstamo</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Busca y selecciona un préstamo activo para registrar el pago correspondiente
              </p>
            </div>
          </Card>
        )}
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
          cliente: (prestamo.cliente || "").toUpperCase(), cedula: prestamo.cedula || "",
          cuota_num: `${cuotaNum} / ${prestamo.num_cuotas}`,
          pago_total: `RD$ ${montoNum.toLocaleString()}`,
          pago_capital: `RD$ ${Math.round(capital).toLocaleString()}`,
          pago_interes: `RD$ ${Math.round(interest).toLocaleString()}`,
          pago_mora: (prestamo.mora_acumulada || 0) > 0 ? `RD$ {(prestamo.mora_acumulada || 0).toLocaleString()}` : "RD$ 0.00",
          efectividad: fecha.split("-").reverse().join("/"),
          pendiente_mora: "RD$ 0.00",
          cuotas_pendientes: prestamo.num_cuotas - ((prestamo.pagadas || 0) + 1),
          saldo_total: `RD$ ${saldoNuevo.toLocaleString()}`,
        }} />
      )}
    </>
  );
}
