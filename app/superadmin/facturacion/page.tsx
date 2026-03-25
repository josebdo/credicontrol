"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Toast } from "@/components/UI";

const PLAN_PRECIOS: Record<string,number> = { principiante:900, basico:1500, intermedio:2000, avanzado:3000, empresarial:5500 };

type Pago = {
  id: string; ref: string; empresa: string; empresa_id: string;
  plan: string; monto: number; fecha: string; estado: "pagado"|"pendiente"|"vencido"; metodo: string;
};

const PAGOS_DEMO: Pago[] = [
  { id:"f-001", ref:"REF-2026-0301", empresa:"CrediControl",     empresa_id:"emp-001", plan:"avanzado",   monto:3000, fecha:"01/03/2026", estado:"pagado",    metodo:"Transferencia" },
  { id:"f-002", ref:"REF-2026-0302", empresa:"Capital Express RD",empresa_id:"emp-002", plan:"intermedio", monto:2000, fecha:"01/03/2026", estado:"pagado",    metodo:"Tarjeta"       },
  { id:"f-003", ref:"REF-2026-0303", empresa:"Inversiones Norte", empresa_id:"emp-003", plan:"basico",     monto:1500, fecha:"01/03/2026", estado:"pendiente", metodo:"—"             },
  { id:"f-004", ref:"REF-2026-0201", empresa:"CrediControl",     empresa_id:"emp-001", plan:"avanzado",   monto:3000, fecha:"01/02/2026", estado:"pagado",    metodo:"Transferencia" },
  { id:"f-005", ref:"REF-2026-0202", empresa:"Capital Express RD",empresa_id:"emp-002", plan:"intermedio", monto:2000, fecha:"01/02/2026", estado:"pagado",    metodo:"Tarjeta"       },
  { id:"f-006", ref:"REF-2026-0203", empresa:"Inversiones Norte", empresa_id:"emp-003", plan:"basico",     monto:1500, fecha:"01/02/2026", estado:"vencido",   metodo:"—"             },
];

export default function FacturacionPage() {
  const [pagos, setPagos]     = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [busRef, setBusRef]   = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [showRenovar, setShowRenovar]   = useState<Pago | null>(null);
  const [renovado, setRenovado]         = useState(false);
  const [toast, setToast]               = useState<{ msg: string, type: "success" | "error" | "info" } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('empresas')
        .select('*, planes(nombre, precio_mensual)')
        .order('creado_en', { ascending: false });
      
      if (error) throw error;

      const mapped: Pago[] = (data || []).map(e => ({
        id: e.id,
        ref: `REN-${e.id.slice(0,8)}`,
        empresa: e.nombre,
        empresa_id: e.id,
        plan: (e as any).planes?.nombre || 'basico',
        monto: (e as any).planes?.precio_mensual || 1500,
        fecha: new Date(e.creado_en).toLocaleDateString(),
        estado: e.activa ? "pagado" : "vencido",
        metodo: "Automatizado"
      }));

      setPagos(mapped);
    } catch (err) {
      console.error("Error fetching billing data:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtrados = pagos.filter(p => {
    const matchRef    = !busRef || p.ref.toLowerCase().includes(busRef.toLowerCase()) || p.empresa.toLowerCase().includes(busRef.toLowerCase());
    const matchEstado = filtroEstado === "todos" || p.estado === filtroEstado;
    return matchRef && matchEstado;
  });

  const mrr        = pagos.filter(p => p.estado === "pagado").reduce((s,p)=>s+p.monto,0);
  const pendientes = pagos.filter(p => p.estado === "pendiente").length;
  const vencidos   = pagos.filter(p => p.estado === "vencido").length;

  async function handleRenovar() {
    if (!showRenovar) return;
    try {
      const { error } = await supabase
        .from('empresas')
        .update({ activa: true })
        .eq('id', showRenovar.empresa_id);
      
      if (error) throw error;

      setRenovado(true);
      setToast({ msg: "Empresa renovada exitosamente", type: "success" });
      fetchData();
      setTimeout(() => { setRenovado(false); setShowRenovar(null); }, 1200);
    } catch (err) {
      setToast({ msg: "Error al renovar empresa", type: "error" });
    }
  }

  const RenderBadge = ({ estado }: { estado: Pago["estado"] }) => {
    const config = {
      pagado: "bg-emerald-50 text-emerald-700 border-emerald-100",
      pendiente: "bg-amber-50 text-amber-700 border-amber-100",
      vencido: "bg-rose-50 text-rose-700 border-rose-100",
    };
    return (
      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${config[estado]}`}>
        {estado}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Facturación y Pagos</h1>
        <p className="text-slate-500 text-sm mt-1">Control de ingresos, cobros pendientes y renovaciones de empresas</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "MRR (Marzo)", value: `RD$ ${mrr.toLocaleString()}`, icon: "💰", color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Cobros Exitosos", value: pagos.filter(p=>p.estado==="pagado").length, icon: "✅", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pendientes", value: pendientes, icon: "⏳", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Vencidos", value: vencidos, icon: "🚨", color: "text-rose-600", bg: "bg-rose-50" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md group">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
              <p className={`text-xl font-black ${stat.color} leading-none tracking-tight`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            Historial de Transacciones
          </h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative group">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input 
                placeholder="Referencia o empresa..." 
                value={busRef} 
                onChange={e=>setBusRef(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 transition-all"
              />
            </div>
            <select 
              value={filtroEstado} 
              onChange={e=>setFiltroEstado(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="todos">Todos los Estados</option>
              <option value="pagado">💳 Pagados</option>
              <option value="pendiente">⏳ Pendientes</option>
              <option value="vencido">🚨 Vencidos</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 py-4 text-left">Referencia</th>
                <th className="px-6 py-4 text-left">Empresa</th>
                <th className="px-6 py-4 text-left">Plan</th>
                <th className="px-6 py-4 text-left">Monto</th>
                <th className="px-6 py-4 text-left">Fecha</th>
                <th className="px-6 py-4 text-left">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map(p=>(
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-indigo-600">{p.ref}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">{p.empresa}</p>
                    <p className="text-[10px] text-slate-400">ID: {p.empresa_id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-[9px] font-black uppercase tracking-tight border border-indigo-100">
                      {p.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-900 tracking-tight">RD$ {p.monto.toLocaleString()}</span>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{p.metodo}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">{p.fecha}</td>
                  <td className="px-6 py-4">
                    <RenderBadge estado={p.estado} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1.5 transition-opacity">
                      {(p.estado === "pendiente" || p.estado === "vencido") && (
                        <button 
                          onClick={()=>setShowRenovar(p)}
                          className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                          title="Renovar manual"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
                        </button>
                      )}
                      <button 
                        onClick={()=>setShowRenovar(p)}
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtrados.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <svg className="w-12 h-12 mb-4 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
              <p className="text-sm font-bold">Sin movimientos que mostrar</p>
              <p className="text-[10px] uppercase tracking-widest mt-1 opacity-60">Revisa tus filtros de búsqueda</p>
            </div>
          )}
        </div>
      </div>

      {/* Modern Modal */}
      {showRenovar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/20 animate-scale-in">
            <div className="relative p-8 pt-10">
              <button 
                onClick={()=>setShowRenovar(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>

              <div className="mb-8">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  Renovación Manual
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-3 tracking-tight leading-none">Confirmar Pago</h3>
                <p className="text-slate-500 text-sm mt-2">Registra el ingreso de fondos para habilitar la empresa.</p>
              </div>

              <div className="bg-slate-50/80 rounded-3xl p-5 border border-slate-100 mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Empresa</p>
                    <p className="text-lg font-black text-slate-800 leading-none mt-1">{showRenovar.empresa}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan Actual</p>
                    <p className="text-sm font-bold text-indigo-600 mt-1 uppercase leading-none">{showRenovar.plan}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200/60 flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-500 uppercase">Costo Mensual</p>
                  <p className="text-xl font-black text-emerald-600 tracking-tighter">RD$ {showRenovar.monto.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Método de Recibo</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                    <option>🏦 Transferencia Bancaria</option>
                    <option>💵 Pago en Efectivo</option>
                    <option>💳 Tarjeta Interna</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Período de Renovación</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-emerald-700">
                    <option>1 Mes — RD$ {showRenovar.monto.toLocaleString()}</option>
                    <option>3 Meses — RD$ {(showRenovar.monto*3).toLocaleString()}</option>
                    <option>6 Meses — RD$ {(showRenovar.monto*6).toLocaleString()}</option>
                    <option>12 Meses — RD$ {(showRenovar.monto*12).toLocaleString()} (10% Desc.)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleRenovar}
                  className={`flex-1 py-4.5 rounded-2xl text-sm font-bold text-white transition-all shadow-xl active:scale-95 ${
                    renovado ? "bg-emerald-500 shadow-emerald-200" : "bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700"
                  }`}
                >
                  {renovado ? "✓ Pago Procesado" : "Procesar Renovación"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
