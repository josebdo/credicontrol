"use client";
import { useState } from "react";
import { Box, Btn, FormField, ModernInput, ModernSelect, Card, CardContent } from "@/components/UI";
import { PRESTAMOS, type Prestamo } from "@/lib/data";
import Link from "next/link";

export default function PagareGarantiaPage() {
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
      <Box title="Pagaré con Garantía Prendaria">
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
              color="yellow" 
              onClick={handleGenerate} 
              disabled={!selectedId || loading}
              className="w-full text-white"
            >
              {loading ? "Generando..." : "Generar Pagaré"}
            </Btn>
          </div>
        </div>
      </Box>

      {generated && prestamo && (
        <Card className="animate-slide-in">
          <CardContent className="p-8 prose prose-slate max-w-none">
            <div className="text-center mb-8 border-b pb-6">
              <h1 className="text-xl font-black uppercase">Pagaré con Garantía Prendaria</h1>
              <p className="text-sm text-slate-500">Cláusula de Protección de Activos</p>
            </div>
            
            <div className="space-y-4 text-justify text-sm leading-relaxed text-slate-700">
              <p>
                Yo, <strong>{prestamo.cliente}</strong>, por medio del presente documento, reconozco una deuda líquida y exigible 
                en favor de <strong>CREDICONTROL SRL</strong> por el monto de <strong>RD$ {prestamo.monto.toLocaleString()}</strong>.
              </p>
              <p>
                A fin de garantizar el fiel cumplimiento de esta obligación, consiento en otorgar como 
                <strong> GARANTÍA PRENDARIA</strong> el bien descrito en el expediente del préstamo No. <strong>{prestamo.id}</strong>.
              </p>
              <p>
                En caso de mora superior a los 30 días, el deudor autoriza irrevocablemente al acreedor a tomar posesión 
                del bien dado en garantía para su posterior realización o venta administrativa sin necesidad de intervención judicial previa.
              </p>
              <p>
                Hecho en Santo Domingo, República Dominicana, a los {new Date().getDate()} días del mes de {new Date().toLocaleDateString('es-ES', { month: 'long' })} del {new Date().getFullYear()}.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-20 pt-12 border-t text-center">
              <div>
                <div className="border-t border-slate-400 mx-auto w-48 mb-2"></div>
                <p className="text-[10px] font-bold uppercase">{prestamo.cliente}</p>
                <p className="text-[9px] text-slate-400">Deudor / Pignorante</p>
              </div>
              <div>
                <div className="border-t border-slate-400 mx-auto w-48 mb-2"></div>
                <p className="text-[10px] font-bold uppercase">Representante Legal</p>
                <p className="text-[9px] text-slate-400">Acreedor Pignoraticio</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4 no-print">
              <Btn color="yellow" variant="solid" onClick={() => window.print()} className="text-white">
                Imprimir Pagaré
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
