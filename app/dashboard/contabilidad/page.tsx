"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/UI";
import { Calculator, FileSpreadsheet, Receipt, BarChart3, ArrowRight } from "lucide-react";

const MODULOS = [
  { href:"/dashboard/contabilidad/calculadora", icon: Calculator, title:"Calculadora de Préstamos", desc:"Calcula cuotas, intereses y amortización", color:"bg-primary/10 text-primary" },
  { href:"/dashboard/contabilidad/cuadre-general", icon: FileSpreadsheet, title:"Cuadre General", desc:"Resumen general de operaciones contables", color:"bg-success/10 text-success" },
  { href:"/dashboard/contabilidad/cuadre-pago", icon: Receipt, title:"Cuadre de Pagos", desc:"Conciliación de pagos recibidos", color:"bg-warning/10 text-warning" },
  { href:"/dashboard/contabilidad/cuadre-ruta", icon: BarChart3, title:"Cuadre por Ruta", desc:"Balance de cobros por ruta asignada", color:"bg-primary/10 text-primary" },
  { href:"/dashboard/contabilidad/gastos", icon: Receipt, title:"Control de Gastos", desc:"Registro y categorización de gastos", color:"bg-destructive/10 text-destructive" },
];

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contabilidad</h1>
          <p className="text-muted-foreground mt-1">Módulos de contabilidad y cuadres del negocio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULOS.map(m => {
          const Icon = m.icon;
          return (
            <Link key={m.href} href={m.href} className="group">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${m.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {m.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-muted/50 border-t border-border flex items-center justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <span className="text-sm font-medium">Acceder</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
