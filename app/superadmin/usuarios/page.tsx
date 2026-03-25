"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Empresa } from "@/lib/auth";
import Link from "next/link";

// Super admin staff roles (people who help manage the platform)
const PLATFORM_ROLES = [
  { key:"platform_admin",  label:"Admin Plataforma",  color:"text-indigo-600", bg:"bg-indigo-50", border:"border-indigo-100", desc:"Puede renovar planes, gestionar empresas y cobros." },
  { key:"platform_soporte",label:"Soporte Técnico",   color:"text-blue-600", bg:"bg-blue-50", border:"border-blue-100", desc:"Atiende clientes, ve empresas pero no puede facturar." },
  { key:"platform_cobranza",label:"Cobranza",         color:"text-amber-600", bg:"bg-amber-50", border:"border-amber-100", desc:"Solo gestiona renovaciones y pagos de suscripciones." },
];

type PlatformUser = {
  id: string; nombre: string; email: string; telefono: string;
  platform_role: string; activo: boolean;
};

const PLATFORM_USERS_DEMO: PlatformUser[] = [
  { id:"pu-001", nombre:"Paolo García (Super Admin)", email:"superadmin@credicontrol.net", telefono:"+1 829 924-1372", platform_role:"platform_admin",   activo:true },
  { id:"pu-002", nombre:"Asistente 1",                email:"asist1@credicontrol.net",     telefono:"829-000-0001",    platform_role:"platform_soporte",  activo:true },
  { id:"pu-003", nombre:"Cobrador Plataforma",        email:"cobros@credicontrol.net",     telefono:"829-000-0002",    platform_role:"platform_cobranza", activo:true },
];

const EMPTY = { nombre:"", email:"", telefono:"", password:"", platform_role:"platform_soporte", activo:true };

export default function SuperAdminUsuariosPage() {
  const [platUsers, setPlatUsers] = useState<PlatformUser[]>([]);
  const [tenantAdmins, setTenantAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(EMPTY);
  const [saved, setSaved]         = useState(false);
  const [editing, setEditing]     = useState<PlatformUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      // Fetch platform users (super admins)
      const { data: staff, error: errStaff } = await supabase
        .from('usuarios')
        .select('*')
        .is('empresa_id', null);
      
      if (errStaff) throw errStaff;
      
      const mappedStaff = (staff || []).map(u => ({
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        telefono: u.telefono || "",
        platform_role: u.rol === 'super_admin' ? 'platform_admin' : 'platform_soporte', // Map for UI
        activo: u.activo
      }));
      setPlatUsers(mappedStaff);

      // Fetch tenant admins with company name
      const { data: admins, error: errAdmins } = await supabase
        .from('usuarios')
        .select('*, empresas(nombre)')
        .eq('rol', 'administrador');
      
      if (errAdmins) throw errAdmins;
      setTenantAdmins(admins || []);

    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!form.nombre || !form.email) return;
    try {
      const dbRole = form.platform_role === 'platform_admin' ? 'super_admin' : 'secretaria'; // Mapping back to DB roles
      if (editing) {
        const { error } = await supabase.from('usuarios').update({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          rol: dbRole as any,
          activo: form.activo
        }).eq('id', editing.id);
        if (error) throw error;
      } else {
        // Registration for new staff would normally involve auth.signUp, 
        // for now we'll just update existing if allowed or show error
        alert("Para nuevos usuarios use el registro o RPC.");
        return;
      }
      setSaved(true);
      fetchUsers();
      setTimeout(() => { setSaved(false); setShowForm(false); setEditing(null); setForm(EMPTY); }, 1000);
    } catch (err) {
      alert("Error al guardar usuario");
    }
  }

  async function toggleActivo(id: string, current: boolean) {
    try {
      const { error } = await supabase.from('usuarios').update({ activo: !current }).eq('id', id);
      if (error) throw error;
      fetchUsers();
    } catch (err) {
      alert("Error al cambiar estado");
    }
  }

  function openEdit(u: PlatformUser) {
    setEditing(u);
    setForm({ nombre:u.nombre, email:u.email, telefono:u.telefono, password:"", platform_role:u.platform_role, activo:u.activo });
    setShowForm(true);
  }

  const roleDef = (key: string) => PLATFORM_ROLES.find(r => r.key === key);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Usuarios & Permisos</h1>
          <p className="text-slate-500 text-sm mt-1">Gestión del personal interno y administradores de empresas</p>
        </div>
        <button 
          onClick={()=>{ setShowForm(!showForm); setEditing(null); setForm(EMPTY); }}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Usuario Plataforma
        </button>
      </div>

      {/* Modern Form */}
      {showForm && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-slide-down">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
              {editing ? `Editando Perfil: ${editing.nombre}` : "Nuevo Recluta de Plataforma"}
            </h3>
            <button onClick={()=>setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                <input 
                  type="text" 
                  value={form.nombre}
                  onChange={e => setForm(p=>({...p, nombre: e.target.value}))}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={form.email}
                  onChange={e => setForm(p=>({...p, email: e.target.value}))}
                  placeholder="juan@credicontrol.net"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono Directo</label>
                <input 
                  type="text" 
                  value={form.telefono}
                  onChange={e => setForm(p=>({...p, telefono: e.target.value}))}
                  placeholder="829-000-0000"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rol de Acceso</label>
                <select 
                  value={form.platform_role}
                  onChange={e=>setForm(p=>({...p, platform_role: e.target.value}))}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  {PLATFORM_ROLES.map(r=><option key={r.key} value={r.key}>{r.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña {editing && "(dejar vacío para mantener)"}</label>
                <input 
                  type="password" 
                  value={form.password}
                  onChange={e => setForm(p=>({...p, password: e.target.value}))}
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div className="flex items-center gap-3 pt-6 lg:pt-8 px-2">
                <button 
                  onClick={()=>setForm(p=>({...p, activo: !p.activo}))}
                  className={`w-12 h-6 rounded-full transition-all relative ${form.activo ? "bg-emerald-500 shadow-md shadow-emerald-100" : "bg-slate-300"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.activo ? "left-7" : "left-1"}`} />
                </button>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Usuario Activo</span>
              </div>
            </div>

            {/* Dynamic Role Card */}
            {form.platform_role && roleDef(form.platform_role) && (
              <div className={`mt-8 p-5 rounded-2xl border ${roleDef(form.platform_role)?.bg} ${roleDef(form.platform_role)?.border} animate-scale-in`}>
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-2 h-2 rounded-full ${roleDef(form.platform_role)?.color.replace("text-", "bg-")}`} />
                  <p className={`text-xs font-black uppercase tracking-widest ${roleDef(form.platform_role)?.color}`}>
                    {roleDef(form.platform_role)?.label}
                  </p>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {roleDef(form.platform_role)?.desc}
                </p>
              </div>
            )}

            <div className="mt-10 flex gap-3">
              <button 
                onClick={handleSave}
                className={`flex-1 py-4 rounded-2xl text-sm font-bold text-white transition-all shadow-xl active:scale-95 ${
                  saved ? "bg-emerald-500 shadow-emerald-200" : "bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700"
                }`}
              >
                {saved ? "✓ Cambios Guardados" : editing ? "Actualizar Colaborador" : "Registrar Colaborador"}
              </button>
              <button 
                onClick={()=>{ setShowForm(false); setEditing(null); }}
                className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            Staff de Plataforma
            <span className="text-[10px] font-black text-indigo-500 ml-2 bg-indigo-50 px-2 py-0.5 rounded-full">{platUsers.length}</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4 text-left font-black">Colaborador</th>
                <th className="px-6 py-4 text-left font-black">Contacto</th>
                <th className="px-6 py-4 text-left font-black">Rol Asignado</th>
                <th className="px-6 py-4 text-left font-black">Estado</th>
                <th className="px-6 py-4 text-right font-black">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {platUsers.map(u => {
                const rd = roleDef(u.platform_role);
                return (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${rd?.bg} ${rd?.color}`}>
                          {u.nombre[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{u.nombre}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-600">{u.email}</p>
                      <p className="text-[10px] text-slate-400">{u.telefono}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${rd?.bg} ${rd?.color} ${rd?.border}`}>
                        {rd ? rd.label : u.platform_role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${u.activo ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"}`}>
                        {u.activo ? "Activo" : "Suspendido"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 transition-opacity">
                        <button onClick={()=>openEdit(u)} className="p-2 bg-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={()=>toggleActivo(u.id, u.activo)} className={`p-2 rounded-lg transition-all ${u.activo ? "bg-rose-50 text-rose-400 hover:text-rose-600 hover:bg-rose-100" : "bg-emerald-50 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-100"}`}>
                          {u.activo ? (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10"/></svg>
                          ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
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

      {/* Tenant Admins */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-rose-100 bg-rose-50/20 flex items-center justify-between">
          <h3 className="text-sm font-bold text-rose-900 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
            Administradores de Clientes
            <span className="text-[10px] font-black text-rose-500 ml-2 bg-rose-50 px-2 py-0.5 rounded-full">{tenantAdmins.length}</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4 text-left font-black">Administrador</th>
                <th className="px-6 py-4 text-left font-black">Empresa Vinculada</th>
                <th className="px-6 py-4 text-left font-black">Estado</th>
                <th className="px-6 py-4 text-right font-black">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tenantAdmins.map(u=>(
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">{u.nombre}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[9px] font-black uppercase border border-slate-200">
                        {u.empresas?.nombre || u.empresa_id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-emerald-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Activo
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href="/superadmin/empresas" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline px-3 py-1 bg-indigo-50 rounded-md transition-colors inline-block">
                      Ver Empresa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
