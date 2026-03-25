"use client";
import { useState, useEffect } from "react";
import { Box, Btn, Badge, SearchInput, Modal } from "@/components/UI";
import ProtectedRoute from "@/components/ProtectedRoute";
import ActionGuard from "@/components/ActionGuard";
import Link from "next/link";
import { getClientes, getPrestamos, updateCliente, addCliente, type Cliente, type Prestamo } from "@/lib/data";
import { CLASIFICACIONES, calcularNivel } from "@/lib/clasificacion";
import { openWhatsApp, formatReminderMessage } from "@/lib/whatsapp";
import { useAuth } from "@/lib/AuthContext";

const EMPTY: Omit<Cliente, "id" | "fecha_registro"> = { nombre: "", cedula: "", telefono: "", telefono_2: "", email: "", direccion: "", ciudad: "", ocupacion: "", activo: true };

export default function ClientesPage() {
  return <ProtectedRoute module="clientes"><Content /></ProtectedRoute>;
}

function Content() {
  const { empresa } = useAuth();
  const [lista, setLista] = useState<Cliente[]>([]);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Cliente, "id" | "fecha_registro">>(EMPTY);
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState<Cliente | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [c, p] = await Promise.all([getClientes(), getPrestamos()]);
      setLista(c);
      setPrestamos(p);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = lista.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.cedula.replace(/-/g, "").includes(search.replace(/-/g, ""))
  );

  function openNew() { setEditing(null); setForm(EMPTY); setShowForm(true); }
  function openEdit(c: Cliente) { setEditing(c); setForm({ ...c }); setShowForm(true); }
  
  async function handleDeactivate(c: Cliente) {
    try {
      await updateCliente(c.id, { activo: false });
      await fetchData();
      setConfirm(null);
    } catch (error) {
      alert("Error al desactivar cliente");
    }
  }

  async function handleSave() {
    if (!form.nombre || !form.cedula || !form.telefono) return;
    try {
      if (editing) { await updateCliente(editing.id, form); }
      else { await addCliente(form); }
      await fetchData();
      setSaved(true);
      setTimeout(() => { setSaved(false); setShowForm(false); setEditing(null); }, 900);
    } catch (error) {
      alert("Error al guardar cliente");
    }
  }

  function nivelCliente(c: Cliente) {
    const p = prestamos.filter(p => p.cliente_id === c.id && p.estado !== "saldado");
    const maxMora = p.reduce((m, x) => Math.max(m, x.dias_mora), 0);
    return calcularNivel(maxMora, p.length, p.filter(x => x.dias_mora > 0).length);
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <ActionGuard module="clientes" action="crear">
            <Btn color="green" onClick={openNew}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nuevo Cliente
            </Btn>
          </ActionGuard>
          <Link href="/dashboard/buscar-cliente">
            <Btn color="purple" variant="outline">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Buscar en Plataforma
            </Btn>
          </Link>
        </div>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre o cedula..."
          className="w-full sm:w-72"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Clientes", value: lista.length, color: "#3b82f6" },
          { label: "Activos", value: lista.filter(c => c.activo).length, color: "#22c55e" },
          { label: "Inactivos", value: lista.filter(c => !c.activo).length, color: "#ef4444" },
          { label: "Nuevos (Mes)", value: 3, color: "#8b5cf6" },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? "Editar Cliente" : "Nuevo Cliente"}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "nombre", label: "Nombre completo", required: true },
            { key: "cedula", label: "Cedula", required: true, placeholder: "001-0000000-0" },
            { key: "telefono", label: "Telefono", required: true },
            { key: "telefono_2", label: "Telefono 2" },
            { key: "email", label: "Email", type: "email" },
            { key: "ocupacion", label: "Ocupacion" },
            { key: "direccion", label: "Direccion", colSpan: true },
            { key: "ciudad", label: "Ciudad" },
          ].map(field => (
            <div key={field.key} className={field.colSpan ? "md:col-span-2" : ""}>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </label>
              <input
                type={field.type || "text"}
                placeholder={field.placeholder || field.label}
                value={(form as any)[field.key] || ""}
                onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <Btn color={saved ? "green" : "blue"} onClick={handleSave} className="flex-1">
            {saved ? "Guardado!" : editing ? "Actualizar" : "Guardar"}
          </Btn>
          <Btn color="gray" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>
            Cancelar
          </Btn>
        </div>
      </Modal>

      {/* Table */}
      <Box title={`Clientes (${filtered.length})`} noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                {["Cliente", "Cedula", "Telefono", "Ciudad", "Nivel", "Estado", "Acciones"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(c => {
                const nv = nivelCliente(c);
                const def = CLASIFICACIONES[nv];
                return (
                  <tr key={c.id} className="bg-card hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ backgroundColor: def.color + '20', color: def.color }}
                        >
                          {c.nombre[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{c.nombre}</p>
                          <p className="text-xs text-muted-foreground">ID: {c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{c.cedula}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground">{c.telefono}</p>
                      {c.telefono_2 && <p className="text-xs text-muted-foreground">{c.telefono_2}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.ciudad || "-"}</td>
                    <td className="px-4 py-3">
                      <span 
                        className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full"
                        style={{ backgroundColor: def.bgColor, color: def.color }}
                      >
                        {def.emoji} {nv}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={c.activo ? "green" : "red"} size="sm">
                        {c.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => openEdit(c)} 
                          className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                          title="Ver/Editar"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <Link 
                          href={`/dashboard/clientes/${c.id}/documentos`}
                          className="p-2 rounded-lg text-purple-500 hover:bg-purple-500/10 transition-colors"
                          title="Documentos"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                        </Link>
                        {c.activo && (
                          <button
                            onClick={() => {
                              const p = prestamos.find(x => x.cliente_id === c.id && x.estado !== "saldado");
                              const monto = p ? `RD$ ${p.cuota?.toLocaleString()}` : "su cuota";
                              const fecha = p ? "proximamente" : "su vencimiento";
                              const msg = formatReminderMessage(c.nombre.split(" ")[0], monto, fecha, empresa?.nombre || "CrediControl");
                              openWhatsApp(c.telefono, msg);
                            }}
                            className="p-2 rounded-lg text-green-500 hover:bg-green-500/10 transition-colors"
                            title="WhatsApp"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                          </button>
                        )}
                        {c.activo ? (
                          <ActionGuard module="clientes" action="eliminar">
                            <button 
                              onClick={() => setConfirm(c)} 
                              className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                              title="Desactivar"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                              </svg>
                            </button>
                          </ActionGuard>
                        ) : (
                          <button 
                            onClick={async () => { await updateCliente(c.id, { activo: true }); await fetchData(); }}
                            className="p-2 rounded-lg text-success hover:bg-success/10 transition-colors"
                            title="Activar"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Box>

      {/* Confirm Modal */}
      <Modal
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        title="Desactivar Cliente"
        size="sm"
      >
        <p className="text-muted-foreground mb-6">
          Desactivar a <strong className="text-foreground">{confirm?.nombre}</strong>? El cliente no sera eliminado, solo quedara inactivo.
        </p>
        <div className="flex gap-3">
          <Btn color="red" onClick={() => confirm && handleDeactivate(confirm)} className="flex-1">
            Si, desactivar
          </Btn>
          <Btn color="gray" variant="outline" onClick={() => setConfirm(null)}>
            Cancelar
          </Btn>
        </div>
      </Modal>
    </div>
  );
}
