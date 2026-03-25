"use client";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent, StatCard } from "@/components/UI";
import { Wallet, Building2, Receipt, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Banknote, PiggyBank, RefreshCw, FileSpreadsheet, Lock, BarChart3 } from "lucide-react";

const MODULOS = [
  { href:"/dashboard/finanzas/gastos", icon: Receipt, title:"Gastos", desc:"Registra todos los gastos del negocio", color:"bg-destructive/10 text-destructive" },
  { href:"/dashboard/finanzas/bancos", icon: Building2, title:"Cuentas Bancarias", desc:"Gestiona tus cuentas bancarias", color:"bg-primary/10 text-primary" },
  { href:"/dashboard/finanzas/caja-chica", icon: PiggyBank, title:"Caja Chica", desc:"Control de caja chica del negocio", color:"bg-warning/10 text-warning" },
  { href:"/dashboard/finanzas/efectivo", icon: Banknote, title:"Efectivo", desc:"Control de efectivo disponible", color:"bg-success/10 text-success" },
  { href:"/dashboard/finanzas/transacciones", icon: RefreshCw, title:"Transacciones", desc:"Historial de todas las transacciones", color:"bg-primary/10 text-primary" },
  { href:"/dashboard/finanzas/cuadre-caja", icon: FileSpreadsheet, title:"Cuadre de Caja", desc:"Cuadre diario por denominaciones", color:"bg-cyan-500/10 text-cyan-600" },
  { href:"/dashboard/finanzas/cierre-caja", icon: Lock, title:"Cierre de Caja", desc:"Cierre diario de caja", color:"bg-destructive/10 text-destructive" },
  { href:"/dashboard/finanzas/flujo-caja", icon: BarChart3, title:"Flujo de Caja", desc:"Proyección y análisis de flujo", color:"bg-success/10 text-success" },
];

const flujoDatos = [
  { dia:"1", entradas:12500, salidas:4200 },
  { dia:"3", entradas:8300, salidas:1800 },
  { dia:"5", entradas:15000, salidas:6000 },
  { dia:"7", entradas:9200, salidas:3500 },
  { dia:"10", entradas:11000, salidas:4800 },
  { dia:"12", entradas:7500, salidas:2200 },
  { dia:"15", entradas:13200, salidas:5100 },
];

export default function FinanzasPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Efectivo en Caja"
          value="RD$ 85,400"
          icon={<Wallet className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
          color="success"
        />
        <StatCard
          title="En Bancos"
          value="RD$ 240,000"
          icon={<Building2 className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
          color="primary"
        />
        <StatCard
          title="Gastos del Mes"
          value="RD$ 12,300"
          icon={<ArrowDownRight className="h-5 w-5" />}
          trend={{ value: 5, isPositive: false }}
          color="destructive"
        />
        <StatCard
          title="Ingresos del Mes"
          value="RD$ 67,800"
          icon={<ArrowUpRight className="h-5 w-5" />}
          trend={{ value: 15, isPositive: true }}
          color="warning"
        />
      </div>

      {/* Flujo de Caja Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <CardTitle>Flujo de Caja</CardTitle>
                <p className="text-sm text-muted-foreground">Entradas y salidas del mes actual</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-muted-foreground">Entradas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-muted-foreground">Salidas</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={flujoDatos} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="dia" 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(value) => `Día ${value}`}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  fontSize: "13px", 
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }} 
                formatter={(v: number) => [`RD$ ${v.toLocaleString()}`, ""]}
                labelFormatter={(label) => `Día ${label}`}
              />
              <Bar dataKey="entradas" fill="hsl(var(--success))" name="Entradas" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="salidas" fill="hsl(var(--destructive))" name="Salidas" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Módulos Grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Módulos de Finanzas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODULOS.map(m => {
            const Icon = m.icon;
            return (
              <Link key={m.href} href={m.href} className="group">
                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border-l-4 border-l-transparent hover:border-l-primary">
                  <CardContent className="p-5">
                    <div className={`w-12 h-12 rounded-xl ${m.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {m.desc}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
