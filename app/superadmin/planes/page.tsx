"use client";
import { useState } from "react";

type Plan = { id:string; nombre:string; precio:number; maxPrestamos:number|null; maxUsuarios:number; descripcion:string; activo:boolean; modulos:string[] };

const MODULOS_DISPONIBLES = ["panel","clientes","prestamos","pagos","reportes","agenda","documentos","garantias","whatsapp","finanzas","contabilidad","empleados"];

const PLANES_INIT: Plan[] = [
  { id:"principiante", nombre:"Principiante", precio:900,  maxPrestamos:100,  maxUsuarios:1,  descripcion:"Para iniciar.",        activo:true, modulos:["panel","clientes","prestamos","pagos","reportes","agenda"] },
  { id:"basico",       nombre:"Básico",       precio:1500, maxPrestamos:500,  maxUsuarios:2,  descripcion:"Pequeñas financieras.", activo:true, modulos:["panel","clientes","prestamos","pagos","reportes","agenda","documentos","garantias","whatsapp"] },
  { id:"intermedio",   nombre:"Intermedio",   precio:2000, maxPrestamos:1000, maxUsuarios:4,  descripcion:"El más popular.",       activo:true, modulos:["panel","clientes","prestamos","pagos","reportes","agenda","documentos","garantias","whatsapp","finanzas","contabilidad"] },
  { id:"avanzado",     nombre:"Avanzado",     precio:3000, maxPrestamos:3000, maxUsuarios:8,  descripcion:"Negocios en crecimiento.",activo:true, modulos:["panel","clientes","prestamos","pagos","reportes","agenda","documentos","garantias","whatsapp","finanzas","contabilidad","empleados"] },
  { id:"empresarial",  nombre:"Empresarial",  precio:5500, maxPrestamos:null, maxUsuarios:16, descripcion:"Máximo rendimiento.",   activo:true, modulos:MODULOS_DISPONIBLES },
];

const EMPTY: Omit<Plan,"id"> = {
  nombre:"", precio:0, maxPrestamos:100, maxUsuarios:2,
  descripcion:"", activo:true, modulos:["panel","clientes","prestamos","pagos","agenda"],
};

export default function PlanesPage() {
  const [planes, setPlanes]   = useState<Plan[]>(PLANES_INIT);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]  = useState<Plan | null>(null);
  const [form, setForm]        = useState<Omit<Plan,"id">>(EMPTY);
  const [saved, setSaved]      = useState(false);

  function openNew() { setEditing(null); setForm(EMPTY); setShowForm(true); }
  function openEdit(p: Plan) { setEditing(p); setForm({...p}); setShowForm(true); }

  function toggleModulo(m: string) {
    setForm(prev => ({
      ...prev,
      modulos: prev.modulos.includes(m) ? prev.modulos.filter(x=>x!==m) : [...prev.modulos, m],
    }));
  }

  function handleSave() {
    if (!form.nombre || form.precio <= 0) return;
    if (editing) {
      setPlanes(prev => prev.map(p => p.id===editing.id ? {...p,...form} : p));
    } else {
      setPlanes(prev => [...prev, { ...form, id: form.nombre.toLowerCase().replace(/\s+/g,"-") }]);
    }
    setSaved(true);
    setTimeout(()=>{ setSaved(false); setShowForm(false); setEditing(null); }, 1000);
  }

  function togglePlanActivo(id: string) {
    setPlanes(prev => prev.map(p => p.id===id ? {...p, activo:!p.activo} : p));
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestión de Planes</h1>
          <p className="text-slate-500 text-sm mt-1">Configura los precios, límites y módulos de la plataforma</p>
        </div>
        <button 
          onClick={openNew}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nuevo Plan
        </button>
      </div>

      {/* Form Container (Slide down) */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-slide-down">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {editing ? `Editar Plan: ${editing.nombre}` : "Configurar Nuevo Plan"}
            </h3>
            <button onClick={()=>setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Nombre del Plan *</label>
                <input 
                  type="text" 
                  value={form.nombre} 
                  onChange={e=>setForm(p=>({...p, nombre: e.target.value}))}
                  placeholder="Ej: Premium Gold"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Precio (RD$ / mes) *</label>
                <input 
                  type="number" 
                  value={form.precio} 
                  onChange={e=>setForm(p=>({...p, precio: Number(e.target.value)}))}
                  placeholder="2500"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Máx. Usuarios</label>
                <input 
                  type="number" 
                  value={form.maxUsuarios} 
                  onChange={e=>setForm(p=>({...p, maxUsuarios: Number(e.target.value)}))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Límite de Préstamos</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={form.maxPrestamos === null ? 0 : form.maxPrestamos} 
                    onChange={e=>setForm(p=>({...p, maxPrestamos: e.target.value === "0" ? null : Number(e.target.value)}))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">0 = ∞</span>
                </div>
              </div>
              <div className="space-y-1.5 lg:col-span-3">
                <label className="text-xs font-bold text-slate-500 uppercase">Descripción Corta</label>
                <input 
                  type="text" 
                  value={form.descripcion} 
                  onChange={e=>setForm(p=>({...p, descripcion: e.target.value}))}
                  placeholder="Ideal para medianas empresas..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
                />
              </div>
            </div>

            {/* Modules Selector */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Módulos Incluidos en el Plan</label>
                <span className="text-[10px] font-bold text-indigo-500 uppercase">{form.modulos.length} Seleccionados</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {MODULOS_DISPONIBLES.map(m => {
                  const checked = form.modulos.includes(m);
                  return (
                    <button 
                      key={m} 
                      onClick={()=>toggleModulo(m)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all active:scale-95 ${
                        checked 
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm" 
                          : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${checked ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-200"}`}>
                        {checked && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-tight">{m}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <button 
                onClick={handleSave}
                className={`flex-1 py-3.5 rounded-2xl text-sm font-bold text-white transition-all shadow-lg active:scale-95 ${
                  saved ? "bg-emerald-500 shadow-emerald-200" : "bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700"
                }`}
              >
                {saved ? "✓ Cambios Guardados" : editing ? "Actualizar Plan" : "Publicar Nuevo Plan"}
              </button>
              <button 
                onClick={()=>setShowForm(false)}
                className="px-8 py-3.5 bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plans Display Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {planes.map(p => (
          <div 
            key={p.id} 
            className={`relative bg-white rounded-3xl overflow-hidden border transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1 ${
              p.activo ? "border-slate-200 shadow-sm" : "border-slate-100 opacity-60 grayscale-[0.5]"
            }`}
          >
            {/* Plan Header */}
            <div className={`p-6 pb-4 border-b border-slate-50 transition-colors ${p.activo ? "bg-indigo-600" : "bg-slate-400"}`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{p.id}</span>
                <div className="flex gap-1.5">
                  <button onClick={()=>openEdit(p)} className="p-2 transition-all hover:bg-white/20 rounded-xl text-white">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={()=>togglePlanActivo(p.id)} className="p-2 transition-all hover:bg-white/20 rounded-xl text-white">
                    {p.activo ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10"/></svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <h3 className="text-2xl font-black text-white leading-none">{p.nombre}</h3>
              <p className="text-white/80 text-xs mt-2 font-medium">{p.descripcion}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white tracking-tighter">RD$ {p.precio.toLocaleString()}</span>
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">/ mes</span>
              </div>
            </div>

            {/* Plan Features */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <p className="text-lg font-black text-slate-800 leading-none">{p.maxPrestamos ?? "∞"}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Préstamos</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <p className="text-lg font-black text-slate-800 leading-none">{p.maxUsuarios}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Usuarios</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full" />
                  Módulos Incluidos ({p.modulos.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.modulos.map(m=>(
                    <span 
                      key={m} 
                      className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-tight border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Toggle Overlay for Inactive Plans */}
            {!p.activo && (
              <div className="absolute inset-0 bg-white/10 pointer-events-none" />
            )}
          </div>
        ))}
        
        {/* Empty State / Add New Card */}
        <button 
          onClick={openNew}
          className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all group min-h-[400px]"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <p className="font-bold text-sm tracking-tight">Crear Nuevo Plan</p>
          <p className="text-[10px] mt-1 font-medium italic opacity-60">Personaliza límites y módulos</p>
        </button>
      </div>
    </div>
  );
}
