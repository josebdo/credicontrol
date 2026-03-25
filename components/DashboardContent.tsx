"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getPagos, getGastos, getPrestamos, getClientes } from "@/lib/data";
import { AlertasCobro } from "./AlertasCobro";

export default function DashboardContent() {
  const [data, setData] = useState<{
    pagos: any[],
    gastos: any[],
    prestamos: any[],
    clientes: any[]
  }>({ pagos: [], gastos: [], prestamos: [], clientes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [p, g, pr, c] = await Promise.all([
          getPagos(),
          getGastos(),
          getPrestamos(),
          getClientes()
        ]);
        setData({ pagos: p, gastos: g, prestamos: pr, clientes: c });
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { pagos, gastos, prestamos, clientes } = data;

  const interesesTotales = pagos.filter(p => p.activo).reduce((acc, p) => acc + (p.monto_interes || 0), 0);
  const gastosTotales = gastos.reduce((acc, g) => acc + (g.monto || 0), 0);
  const utilidadNeta = interesesTotales - gastosTotales;

  const prestamosActivos = prestamos.filter(p => p.estado === "activo" || p.estado === "mora").length;
  const prestamosAtrasados = prestamos.filter(p => p.estado === "mora").length;

  const hoyStr = new Date().toISOString().split('T')[0];
  const cobrosHoy = pagos.filter(p => p.fecha_pago === hoyStr && p.activo).length;
  const totalClientes = clientes.length;

  // --- Dynamic Chart Data ---
  
  // 1. Bar Data (Intereses últimos meses)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const label = d.toLocaleString('es-DO', { month: 'short' });
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const monto = pagos
      .filter(p => {
        const pd = new Date(p.fecha_pago);
        return pd.getMonth() + 1 === month && pd.getFullYear() === year && p.activo;
      })
      .reduce((sum, p) => sum + (p.monto_interes || 0), 0);
    return { mes: label, monto };
  });

  // 2. Pie Data (Desglose de cobros)
  const totalCapital = pagos.filter(p => p.activo).reduce((sum, p) => sum + (p.monto_capital || 0), 0);
  const totalInteres = pagos.filter(p => p.activo).reduce((sum, p) => sum + (p.monto_interes || 0), 0);
  const totalMora = pagos.filter(p => p.activo).reduce((sum, p) => sum + (p.monto_mora || 0), 0);

  const pieData = [
    { name: "P. Capital", value: totalCapital, color: "#3b82f6" },
    { name: "P. Interes", value: totalInteres, color: "#22c55e" },
    { name: "P. Mora", value: totalMora, color: "#ef4444" },
  ];

  // 3. Cash Flow (Desembolsos vs Cobros)
  const cashFlowData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const label = d.toLocaleString('es-DO', { month: 'short' });
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    
    const desembolsos = prestamos
      .filter(p => {
        const pd = new Date(p.fecha_inicio);
        return pd.getMonth() + 1 === month && pd.getFullYear() === year;
      })
      .reduce((sum, p) => sum + (p.monto || 0), 0);
      
    const cobros = pagos
      .filter(p => {
        const pd = new Date(p.fecha_pago);
        return pd.getMonth() + 1 === month && pd.getFullYear() === year && p.activo;
      })
      .reduce((sum, p) => sum + (p.monto || 0), 0);

    return { mes: label, desembolsos, cobros };
  });

  // 4. Risk Data (Mora por rangos)
  const riskGroups = [
    { name: "Al dia", min: 0, max: 0, color: "#22c55e" },
    { name: "1-30 dias", min: 1, max: 30, color: "#f59e0b" },
    { name: "31-60 dias", min: 31, max: 60, color: "#f97316" },
    { name: "+60 dias", min: 61, max: 9999, color: "#dc2626" },
  ];

  const riskData = riskGroups.map(g => {
    const count = prestamos.filter(p => p.dias_mora >= g.min && p.dias_mora <= g.max).length;
    return { ...g, value: count };
  });

  const totalRisk = riskData.reduce((s, r) => s + r.value, 0) || 1;
  const processedRiskData = riskData.map(r => ({ ...r, percentage: Math.round((r.value / totalRisk) * 100) }));

  const TOP_CARDS = [
    { 
      label: "Deben Pagar Hoy", 
      value: "1", 
      color: "#3b82f6",
      href: "/dashboard/agenda/hoy",
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor" opacity="0.3"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" /></svg>
    },
    { 
      label: "Prestamos Activos", 
      value: prestamosActivos.toString(), 
      color: "#22c55e",
      href: "/dashboard/prestamos",
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor" opacity="0.3"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
    },
    { 
      label: "Prestamos en Mora", 
      value: prestamosAtrasados.toString(), 
      color: "#f59e0b",
      href: "/dashboard/prestamos",
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor" opacity="0.3"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>
    },
    { 
      label: "Utilidad Neta (Mes)", 
      value: `RD$ ${utilidadNeta.toLocaleString()}`, 
      color: utilidadNeta >= 0 ? "#8b5cf6" : "#ef4444",
      href: "/dashboard/reportes",
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor" opacity="0.3"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" /></svg>
    },
  ];

  const MINI_STATS = [
    { 
      label: "Cobros Hoy", 
      value: cobrosHoy.toString(), 
      color: "#06b6d4",
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
    },
    { 
      label: "Gasto Mensual", 
      value: `RD$ ${gastosTotales.toLocaleString()}`, 
      color: "#ef4444",
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    },
    { 
      label: "Total Clientes", 
      value: totalClientes.toString(), 
      color: "#3b82f6",
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    { 
      label: "Eficiencia Cobro", 
      value: "85%", 
      color: "#22c55e",
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TOP_CARDS.map(c => (
          <Link key={c.label} href={c.href} className="block group">
            <div 
              className="relative overflow-hidden rounded-2xl p-5 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1"
              style={{ background: `linear-gradient(135deg, ${c.color} 0%, ${c.color}cc 100%)` }}
            >
              <div className="relative z-10">
                <p className="text-white/80 text-sm font-medium">{c.label}</p>
                <p className={`text-white font-bold mt-1 ${c.value.length > 10 ? 'text-2xl' : 'text-3xl'}`}>
                  {c.value}
                </p>
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white">
                {c.icon}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/10 flex items-center justify-between px-4 text-white/80 text-sm">
                <span>Ver detalles</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {MINI_STATS.map(s => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 card-hover">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: s.color + '15', color: s.color }}
            >
              {s.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium truncate">{s.label}</p>
              <p className="text-xl font-bold text-foreground truncate">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intereses Mensuales */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Intereses Mensuales</h3>
              <p className="text-sm text-muted-foreground">Tendencia de ingresos por intereses</p>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={last6Months} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(v: number) => [`RD$ ${v.toLocaleString()}`, "Intereses"]} 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="monto" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribucion de Ingresos */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Distribucion de Ingresos</h3>
            <p className="text-sm text-muted-foreground">Desglose por tipo de pago</p>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Legend 
                  verticalAlign="bottom" 
                  iconType="circle" 
                  iconSize={8} 
                  wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} 
                />
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="45%" 
                  outerRadius={80} 
                  innerRadius={50}
                  dataKey="value" 
                  startAngle={90} 
                  endAngle={-270}
                  paddingAngle={2}
                >
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip 
                  formatter={(v: number) => [`RD$ ${v.toLocaleString()}`, ""]}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '8px' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flujo de Caja */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Flujo de Caja</h3>
            <p className="text-sm text-muted-foreground">Desembolsos vs Cobros mensuales</p>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDesembolsos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCobros" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '8px' 
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey="desembolsos" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorDesembolsos)" name="Desembolsos" />
                <Area type="monotone" dataKey="cobros" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorCobros)" name="Cobros" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alertas de Cobro */}
        <AlertasCobro prestamos={prestamos} />
      </div>

      {/* Cartera en Riesgo */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Cartera en Riesgo</h3>
          <p className="text-sm text-muted-foreground">Distribucion por dias de mora</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie 
                  data={processedRiskData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={90} 
                  dataKey="value" 
                  paddingAngle={3}
                >
                  {processedRiskData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v} casos`, "Cuentas"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {processedRiskData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: item.color }}>{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
