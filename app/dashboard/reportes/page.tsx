"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/UI";
import { CreditCard, FileText, BarChart3, AlertTriangle, TrendingUp, DollarSign, CheckCircle, MapPin, LineChart, FileCheck, Calculator, Wallet, ArrowRight } from "lucide-react";

const REPORTES = [
  { href:"/dashboard/reportes/pagos-prestamos", icon: CreditCard, title:"Pagos por Préstamos", desc:"Historial de pagos agrupados por préstamo", color:"bg-primary/10 text-primary" },
  { href:"/dashboard/reportes/historial", icon: FileText, title:"Historial de Préstamos", desc:"Todos los préstamos activos, cerrados y en mora", color:"bg-primary/10 text-primary" },
  { href:"/dashboard/reportes/estado-cuenta", icon: BarChart3, title:"Estado de Cuenta", desc:"Estado detallado por cliente", color:"bg-success/10 text-success" },
  { href:"/dashboard/reportes/incobrables", icon: AlertTriangle, title:"Incobrables", desc:"Préstamos con mora mayor a 90 días", color:"bg-destructive/10 text-destructive" },
  { href:"/dashboard/reportes/ingresos-egresos", icon: TrendingUp, title:"Ingresos y Egresos", desc:"Balance general de entradas y salidas", color:"bg-success/10 text-success" },
  { href:"/dashboard/reportes/ingresos-capital", icon: DollarSign, title:"Ingresos y Capital", desc:"Desglose de capital e intereses cobrados", color:"bg-warning/10 text-warning" },
  { href:"/dashboard/reportes/realizados", icon: CheckCircle, title:"Préstamos Realizados", desc:"Préstamos otorgados en un período", color:"bg-success/10 text-success" },
  { href:"/dashboard/reportes/rutas", icon: MapPin, title:"Préstamos por Rutas", desc:"Cartera organizada por ruta de cobro", color:"bg-primary/10 text-primary" },
  { href:"/dashboard/reportes/variaciones", icon: LineChart, title:"Variaciones de Capital", desc:"Evolución del capital en el tiempo", color:"bg-warning/10 text-warning" },
  { href:"/dashboard/reportes/compromiso", icon: FileCheck, title:"Verificar Compromiso", desc:"Verificación de compromisos de pago", color:"bg-primary/10 text-primary" },
  { href:"/dashboard/reportes/cuadre-diario", icon: Calculator, title:"Cuadre Diario", desc:"Cuadre por denominaciones del día", color:"bg-success/10 text-success" },
  { href:"/dashboard/reportes/flujo-caja", icon: Wallet, title:"Flujo de Caja", desc:"Movimientos de caja del período", color:"bg-success/10 text-success" },
];

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Centro de Reportes</h1>
          <p className="text-muted-foreground mt-1">Genera y visualiza reportes detallados de tu negocio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTES.map(r => {
          const Icon = r.icon;
          return (
            <Link key={r.href} href={r.href} className="group">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${r.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {r.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {r.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-muted/50 border-t border-border flex items-center justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <span className="text-sm font-medium">Ver reporte</span>
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
