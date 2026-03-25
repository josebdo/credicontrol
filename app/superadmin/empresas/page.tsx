"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Empresa } from "@/lib/auth";
import { Toast } from "@/components/UI";

const PLAN_PRECIOS: Record<string,number> = { principiante:900, basico:1500, intermedio:2000, avanzado:3000, empresarial:5500 };
const PLAN_MAX: Record<string,string>     = { principiante:"100", basico:"500", intermedio:"1,000", avanzado:"3,000", empresarial:"∞" };
const PLANES = ["principiante","basico","intermedio","avanzado","empresarial"];

const EMPTY_EMP = { nombre:"", email:"", telefono:"", rnc:"", direccion:"", plan:"basico" as string };

export default function SuperAdminEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [buscar, setBuscar]     = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Empresa | null>(null);
  const [form, setForm]         = useState(EMPTY_EMP);
  const [saved, setSaved]       = useState(false);
  const [renovarEmp, setRenovarEmp] = useState<Empresa | null>(null);
  const [renewSaved, setRenewSaved] = useState(false);
  const [toast, setToast]           = useState<{ msg: string, type: "success" | "error" | "info" } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchEmpresas();
  }, []);

  async function fetchEmpresas() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('empresas').select('*').order('creado_en', { ascending: false });
      if (error) throw error;
      
      const mapped = (data || []).map(e => ({
        ...e,
        plan: e.plan_id || 'basico', // Map plan_id to plan for compatibility with UI
        userCount: 0 // Default for now
      }));

      setEmpresas(mapped);
    } catch (err) {
      console.error("Error fetching empresas:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtradas = empresas.filter(e => e.nombre.toLowerCase().includes(buscar.toLowerCase()));

  function openNew() {
    setEditing(null);
    setForm(EMPTY_EMP);
    setShowForm(true);
  }

  function openEdit(e: Empresa) {
    setEditing(e);
    setForm({ nombre:e.nombre, email:e.email??"", telefono:e.telefono??"", rnc:e.rnc??"", direccion:e.direccion??"", plan:e.plan });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.nombre) return;
    try {
      if (editing) {
        const { error } = await supabase.from('empresas').update({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          rnc: form.rnc,
          direccion: form.direccion,
          plan_id: form.plan
        }).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('empresas').insert({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          rnc: form.rnc,
          direccion: form.direccion,
          plan_id: form.plan,
          activa: true
        });
        if (error) throw error;
      }
      setSaved(true);
      setToast({ msg: "Empresa guardada exitosamente", type: "success" });
      fetchEmpresas();
      setTimeout(()=>{ setSaved(false); setShowForm(false); setEditing(null); }, 1000);
    } catch (err) {
      setToast({ msg: "Error al guardar empresa", type: "error" });
    }
  }

  async function toggleActiva(id: string, current: boolean) {
    try {
      const { error } = await supabase.from('empresas').update({ activa: !current }).eq('id', id);
      if (error) throw error;
      setToast({ msg: `Empresa ${!current ? 'activada' : 'suspendida'}`, type: "success" });
      fetchEmpresas();
    } catch (err) {
      setToast({ msg: "Error al cambiar estado", type: "error" });
    }
  }

  async function handleRenovar() {
    if (!renovarEmp) return;
    try {
      const { error } = await supabase.from('empresas').update({ activa: true }).eq('id', renovarEmp.id);
      if (error) throw error;
      setRenewSaved(true);
      setToast({ msg: "Suscripción renovada exitosamente", type: "success" });
      fetchEmpresas();
      setTimeout(()=>{ setRenewSaved(false); setRenovarEmp(null); }, 1000);
    } catch (err) {
      setToast({ msg: "Error al renovar empresa", type: "error" });
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Empresas Registradas</h1>
          <p className="text-slate-500 text-sm mt-1">Gestión administrativa de tenants y facturación</p>
        </div>
        <button 
          onClick={openNew}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Registrar Empresa
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { l:"Total Empresas", v:empresas.length, c:"indigo", icon: "🏢" },
          { l:"Activas", v:empresas.filter(e=>e.activa).length, c:"emerald", icon: "✅" },
          { l:"MRR Proyectado", v:`RD$ ${empresas.filter(e=>e.activa).reduce((s,e)=>s+(PLAN_PRECIOS[e.plan]??0),0).toLocaleString()}`, c:"blue", icon: "💰" },
          { l:"Suspendidas", v:empresas.filter(e=>!e.activa).length, c:"red", icon: "⚠️" },
        ].map(s=>(
          <div key={s.l} className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-${s.c}-500 group hover:shadow-md transition-shadow`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{s.icon}</span>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{s.l}</p>
            </div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight group-hover:scale-105 transition-transform origin-left">{s.v}</p>
          </div>
        ))}
      </div>

      {/* Registration Form (Collapseable) */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-slide-down">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {editing ? `Editar: ${editing.nombre}` : "Nueva Empresa"}
            </h3>
            <button onClick={()=>setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Nombre de Empresa *</label>
                <input 
                  type="text" 
                  value={form.nombre} 
                  onChange={e=>setForm(p=>({...p, nombre: e.target.value}))}
                  placeholder="PM Inversiones"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Email de Contacto</label>
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={e=>setForm(p=>({...p, email: e.target.value}))}
                  placeholder="contacto@empresa.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Teléfono</label>
                <input 
                  type="tel" 
                  value={form.telefono} 
                  onChange={e=>setForm(p=>({...p, telefono: e.target.value}))}
                  placeholder="829-000-0000"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">RNC / Identificación</label>
                <input 
                  type="text" 
                  value={form.rnc} 
                  onChange={e=>setForm(p=>({...p, rnc: e.target.value}))}
                  placeholder="101-00000-0"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Plan de Suscripción *</label>
                <select 
                  value={form.plan} 
                  onChange={e=>setForm(p=>({...p, plan: e.target.value}))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none"
                >
                  {PLANES.map(p=>(
                    <option key={p} value={p}>{p.toUpperCase()} — RD$ {PLAN_PRECIOS[p].toLocaleString()}/mes (hasta {PLAN_MAX[p]} préstamos)</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button 
                onClick={handleSave}
                className={`flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg active:scale-95 ${
                  saved ? "bg-emerald-500 shadow-emerald-200" : "bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700"
                }`}
              >
                {saved ? "✓ Guardado Exitosamente" : editing ? "Actualizar Información" : "Crear Nueva Empresa"}
              </button>
              <button 
                onClick={()=>setShowForm(false)}
                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">Lista de Empresas</h3>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">{filtradas.length} total</span>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar por nombre..." 
              value={buscar} 
              onChange={e=>setBuscar(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all w-full sm:w-64" 
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                {["Empresa","Plan / Límite","Usuarios","MRR","Estado","Acciones"].map(h=>(
                  <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtradas.map(e=>{
                const uc = (e as any).userCount || 0;
                const mrrVal = PLAN_PRECIOS[e.plan] ?? 0;
                return (
                  <tr key={e.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                          {e.nombre[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none mb-1">{e.nombre}</p>
                          <p className="text-[10px] text-slate-400 font-medium font-mono">ID: {e.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider block w-fit">
                          {e.plan}
                        </span>
                        <p className="text-[10px] text-slate-400 pl-1 font-medium">Límite: {PLAN_MAX[e.plan]} préstamos</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-bold font-mono">
                        <div className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200 flex items-center gap-1.5">
                          {uc}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-100">
                        RD$ {mrrVal.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none active:scale-90 ${
                        e.activa 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                          : "bg-red-50 text-red-600 border border-red-100"
                      }`}
                      onClick={()=>toggleActiva(e.id, e.activa)}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${e.activa ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                        {e.activa ? "Activa" : "Suspendida"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={()=>openEdit(e)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" 
                          title="Editar"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        {!e.activa && (
                          <button 
                            onClick={()=>setRenovarEmp(e)}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all" 
                            title="Renovar Membresía"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                            </svg>
                          </button>
                        )}
                        <button 
                          onClick={()=>toggleActiva(e.id, e.activa)}
                          className={`p-2 rounded-lg transition-all ${
                            e.activa ? "text-red-400 hover:text-red-600 hover:bg-red-50" : "text-blue-400 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                          title={e.activa ? "Suspender" : "Activar"}
                        >
                          {e.activa ? (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 3l14 9-14 9V3z"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Renovar Modal */}
      {renovarEmp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-8 text-center border-b border-slate-100">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🔄
              </div>
              <h3 className="text-xl font-bold text-slate-900">Renovar Suscripción</h3>
              <p className="text-slate-500 text-sm mt-1">Estás renovando el acceso para <span className="font-bold text-slate-900">{renovarEmp.nombre}</span></p>
            </div>
            
            <div className="p-8 space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Seleccionar Período</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-medium">
                  <option>1 mes — RD$ {(PLAN_PRECIOS[renovarEmp.plan]??0).toLocaleString()}</option>
                  <option>3 meses — RD$ {((PLAN_PRECIOS[renovarEmp.plan]??0)*3).toLocaleString()}</option>
                  <option>6 meses — RD$ {((PLAN_PRECIOS[renovarEmp.plan]??0)*6).toLocaleString()}</option>
                  <option>12 meses (10% desc.) — RD$ {((PLAN_PRECIOS[renovarEmp.plan]??0)*10.8).toLocaleString()}</option>
                </select>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                <div className="text-sm">
                  <p className="font-bold text-emerald-800 leading-none">Acceso Inmediato</p>
                  <p className="text-[11px] text-emerald-600 mt-1">La empresa se reactivará al procesar la renovación.</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleRenovar}
                  className={`flex-[2] py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 shadow-lg ${
                    renewSaved ? "bg-emerald-500 shadow-emerald-100" : "bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700"
                  }`}
                >
                  {renewSaved ? "✓ Renovado" : "Confirmar Renovación"}
                </button>
                <button 
                  onClick={()=>setRenovarEmp(null)}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancelar
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
