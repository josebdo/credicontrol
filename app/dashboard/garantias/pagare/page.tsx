"use client";
import { useState } from "react";
import { Box, Btn, FormField, ModernInput, ModernSelect, Card, CardContent } from "@/components/UI";
import { PRESTAMOS, type Prestamo } from "@/lib/data";
import Link from "next/link";

export default function PagareNotarialPage() {
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const prestamo = PRESTAMOS.find(p => p.id === selectedId);

  function handleGenerate() {
    if (!selectedId) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 1500);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Box title="Generador de Pagaré Notarial">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <FormField label="Seleccionar Préstamo" required>
            <ModernSelect 
              value={selectedId}
              onChange={e => { setSelectedId(e.target.value); setGenerated(false); }}
              placeholder="Elija un préstamo..."
              options={PRESTAMOS.map(p => ({ value: p.id, label: `${p.id} - ${p.cliente}` }))}
            />
          </FormField>
          <div className="pb-1">
            <Btn 
              color="indigo" 
              onClick={handleGenerate} 
              disabled={!selectedId || loading}
              className="w-full"
            >
              {loading ? "Generando..." : "Generar Documento"}
            </Btn>
          </div>
        </div>
      </Box>

      {generated && prestamo && (
        <Card className="animate-slide-in">
          <CardContent className="p-8 prose prose-slate max-w-none">
            <div className="text-center mb-8 border-b pb-6">
              <h1 className="text-xl font-black uppercase">Pagaré Notarial</h1>
              <p className="text-sm text-slate-500">Documento Legal Autogenerado</p>
            </div>
            
            <div className="space-y-4 text-justify text-sm leading-relaxed">
              <p>
                POR EL PRESENTE DOCUMENTO, yo, <strong>{prestamo.cliente}</strong>, de nacionalidad Dominicana, mayor de edad, 
                titular de la cédula de identidad No. <strong>{prestamo.cedula}</strong>, declaro haber recibido de 
                <strong> CREDICONTROL SRL</strong>, la suma de <strong>RD$ {prestamo.monto.toLocaleString()}</strong>, 
                en calidad de préstamo.
              </p>
              <p>
                Me obligo a pagar dicha suma mediante <strong>{prestamo.num_cuotas}</strong> cuotas mensuales y consecutivas 
                de <strong>RD$ {prestamo.cuota.toLocaleString()}</strong>, con una tasa de interés del 
                <strong> {prestamo.tasa}%</strong> mensual.
              </p>
              <p>
                El incumplimiento de un solo pago hará exigible la totalidad de la deuda pendiente. 
                Para los fines legales, se elige domicilio en la ciudad de Santo Domingo, República Dominicana.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-20 pt-12 border-t text-center">
              <div>
                <div className="border-t border-slate-400 mx-auto w-48 mb-2"></div>
                <p className="text-[10px] font-bold uppercase">{prestamo.cliente}</p>
                <p className="text-[9px] text-slate-400">Deudor</p>
              </div>
              <div>
                <div className="border-t border-slate-400 mx-auto w-48 mb-2"></div>
                <p className="text-[10px] font-bold uppercase">Representante Legal</p>
                <p className="text-[9px] text-slate-400">Acreedor</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4 no-print">
              <Btn color="blue" variant="outline" onClick={() => window.print()}>
                Imprimir PDF
              </Btn>
              <Link href="/dashboard">
                <Btn color="gray" variant="ghost">Cerrar</Btn>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
