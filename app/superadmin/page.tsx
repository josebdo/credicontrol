"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

const MRR_DATA = [
  { mes:"Oct", mrr:42000 },{ mes:"Nov", mrr:49500 },{ mes:"Dic", mrr:54000 },
  { mes:"Ene", mrr:61500 },{ mes:"Feb", mrr:67000 },{ mes:"Mar", mrr:72500 },
];

const PLAN_PRECIOS: Record<string,number> = { principiante:900, basico:1500, intermedio:2000, avanzado:3000, empresarial:5500 };

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({ total: 0, activas: 0, mrr: 0, usuarios: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadStats() {
      try {
        const { data: emps, error: errEmps } = await supabase.from('empresas').select('activa, plan_id');
        const { count: usersCount, error: errUsers } = await supabase.from('usuarios').select('*', { count: 'exact', head: true });
        
        if (errEmps || errUsers) throw errEmps || errUsers;

        // MRR Calculation (simplified for now, ideally use a view)
        const totalMRR = emps?.reduce((sum, e) => sum + (e.activa ? (PLAN_PRECIOS[e.plan_id] || 0) : 0), 0) || 0;

        setStats({
          total: emps?.length || 0,
          activas: emps?.filter(e => e.activa).length || 0,
          mrr: totalMRR,
          usuarios: (usersCount || 0) - 1 // Restando al superadmin
        });
      } catch (err) {
        console.error("Error loading SuperAdmin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Cargando métricas de plataforma...</div>;

  const { total: totalEmpresas, activas, mrr, usuarios: totalUsuarios } = stats;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard de la Plataforma</h1>
          <p className="text-slate-500 text-sm mt-1">Resumen general del rendimiento de CrediControl</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Sistemas Online
          </div>
          <span className="text-slate-400 text-xs font-medium">Actualizado: hace un momento</span>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Empresas Activas", value: activas, sub: `${totalEmpresas} registradas`, color: "indigo", icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18M3 7v1a3 3 0 006 0V7m0 1v1a3 3 0 006 0V7m0 1v1a3 3 0 006 0V7M4 21V7m16 14V7M9 21V12m6 9V12"/>
            </svg>
          )},
          { label: "MRR Estimado", value: `RD$ ${mrr.toLocaleString()}`, sub: "Ingresos mensuales", color: "emerald", icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          )},
          { label: "Usuarios Totales", value: totalUsuarios.toLocaleString(), sub: "Todos los clientes", color: "blue", icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/>
            </svg>
          )},
          { label: "Plataforma Uptime", value: "99.98%", sub: "Últimos 30 días", color: "amber", icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          )},
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl bg-${item.color}-50 text-${item.color}-600 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
                12%
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{item.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{item.value}</h3>
              <p className="text-slate-400 text-xs mt-1 font-medium">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MRR Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Evolución de Ingresos (MRR)</h3>
              <p className="text-slate-400 text-xs font-medium">Crecimiento de facturación mensual</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Últimos 6 meses</option>
              <option>Último año</option>
            </select>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MRR_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="mes" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                  tickFormatter={(v) => `RD$ ${v/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  formatter={(v: any) => [`RD$ ${v.toLocaleString()}`, 'Ingresos']}
                />
                <Area 
                  type="monotone" 
                  dataKey="mrr" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorMrr)" 
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution (Placeholder for future) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Información Rápida</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">💎</div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Plan Más Popular</p>
                  <p className="text-[10px] text-slate-500">Basado en nuevas suscripciones</p>
                </div>
              </div>
              <span className="text-sm font-bold text-indigo-600">Profesional</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">🏢</div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Nuevas Empresas</p>
                  <p className="text-[10px] text-slate-500">Últimos 7 días</p>
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-600">+12</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">⚠️</div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Soporte Pendiente</p>
                  <p className="text-[10px] text-slate-500">Tickets abiertos</p>
                </div>
              </div>
              <span className="text-sm font-bold text-red-600">3</span>
            </div>
          </div>
          
          <div className="mt-8">
            <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
              Descargar Informe Mensual
            </button>
          </div>
        </div>
      </div>

      {/* Empresas List Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Empresas Registradas</h3>
            <p className="text-slate-400 text-xs font-medium mt-0.5">Gestión de tenants activos en la plataforma</p>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/superadmin/empresas" 
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
            >
              Gestionar Todas
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                {["Empresa","Plan","Usuarios","MRR","Estado","Acciones"].map(h=>(
                  <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-sm">
                  Utiliza el buscador o ve a la sección de <Link href="/superadmin/empresas" className="text-indigo-600 font-bold">Empresas</Link> para ver el listado completo y gestionar tenants.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
