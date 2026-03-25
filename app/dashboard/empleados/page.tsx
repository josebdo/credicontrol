"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, FormField, ModernInput, ModernSelect, ModernButton, Badge, Table } from "@/components/UI";
import { useAuth } from "@/lib/AuthContext";
import { PLAN_LIMITS } from "@/lib/auth";
import { getUsuarios, addUsuario, updateUsuario } from "@/lib/data";
import { ROLE_DEFINITIONS, type RoleKey } from "@/lib/roles";
import ActionGuard from "@/components/ActionGuard";
import { Users, UserPlus, Edit, Power, X, Save, AlertTriangle, Shield } from "lucide-react";

const TENANT_ROLES: RoleKey[] = ["administrador","supervisor","secretaria","cobrador","lectura"];
const EMPTY = { nombre:"", email:"", password:"", role:"cobrador", activo:true };

export default function EmpleadosPage() {
  const { empresa } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any|null>(null);
  const [form, setForm] = useState<any>({...EMPTY, empresa_id:empresa?.id||""});
  const [saved, setSaved] = useState(false);
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getUsuarios();
      setEmpleados(data);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    } finally {
      setLoading(false);
    }
  }

  const plan = empresa?.plan || "basico";
  const limits = (PLAN_LIMITS as any)[plan] || PLAN_LIMITS.basico;
  const canAddMore = empleados.filter(e=>e.activo).length < limits.usuarios;

  function openEdit(u:any){ setEditing(u); setForm({...u}); setShowForm(true); }
  function openNew(){ setEditing(null); setForm({...EMPTY,empresa_id:empresa?.id||""}); setShowForm(true); }

  async function handleSave(){
    if(!form.nombre||!form.email) return;
    try {
      if(editing){ 
        await updateUsuario(editing.id, form); 
      } else { 
        await addUsuario({...form, empresa_id: empresa?.id}); 
      }
      await fetchData();
      setSaved(true);
      setTimeout(()=>{ setSaved(false); setShowForm(false); setEditing(null); },800);
    } catch (error) {
      console.error("Error saving usuario:", error);
      alert("Error al guardar usuario");
    }
  }

  const columns = [
    {
      key: "empleado",
      label: "Empleado",
      render: (e: any) => {
        const rd = ROLE_DEFINITIONS[e.role as RoleKey];
        return (
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: `${rd?.color}22`, color: rd?.color }}
            >
              {(e.nombre || "U")[0]}
            </div>
            <div>
              <p className="font-medium text-foreground">{e.nombre}</p>
              <p className="text-xs text-muted-foreground">{e.email}</p>
            </div>
          </div>
        );
      }
    },
    {
      key: "rol",
      label: "Rol",
      render: (e: any) => {
        const rd = ROLE_DEFINITIONS[e.role as RoleKey];
        return (
          <Badge color={rd?.color === "#dd4b39" ? "red" : "blue"}>
            {rd?.label || e.role}
          </Badge>
        );
      }
    },
    {
      key: "telefono",
      label: "Teléfono",
      render: (e: any) => <span className="text-muted-foreground">{e.telefono || "—"}</span>
    },
    {
      key: "estado",
      label: "Estado",
      render: (e: any) => (
        <Badge color={e.activo ? "green" : "red"}>
          {e.activo ? "Activo" : "Inactivo"}
        </Badge>
      )
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (e: any) => (
        <div className="flex items-center gap-2">
          <ActionGuard module="empleados" action="editar">
            <ModernButton small color="yellow" onClick={() => openEdit(e)}>
              <Edit className="h-3.5 w-3.5" />
            </ModernButton>
          </ActionGuard>
           <ModernButton 
              small
              color={e.activo ? "red" : "green"}
              onClick={async () => {
                try {
                  await updateUsuario(e.id, { activo: !e.activo });
                  await fetchData();
                } catch (error) {
                  alert("Error al cambiar estado");
                }
              }}
            >
              <Power className="h-3.5 w-3.5" />
            </ModernButton>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Plan Warning */}
      {!canAddMore && (
        <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-warning">Límite de usuarios alcanzado</p>
            <p className="text-sm text-muted-foreground mt-1">
              Tu plan <strong className="capitalize">{plan}</strong> permite máximo {limits.usuarios} usuario(s).{" "}
              <a href="mailto:ventas@credicontrol.net" className="text-primary hover:underline">
                Mejorar plan
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Empleados</h1>
            <p className="text-sm text-muted-foreground">
              {empleados.filter(e => e.activo).length} de {limits.usuarios} usuarios activos
            </p>
          </div>
        </div>
        <ActionGuard module="empleados" action="crear">
          <ModernButton onClick={openNew} disabled={!canAddMore}>
            <UserPlus className="h-4 w-4" />
            Nuevo Empleado
          </ModernButton>
        </ActionGuard>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card className={`border-t-4 ${editing ? 'border-t-warning' : 'border-t-success'}`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${editing ? 'bg-warning/10' : 'bg-success/10'}`}>
                {editing ? <Edit className="h-5 w-5 text-warning" /> : <UserPlus className="h-5 w-5 text-success" />}
              </div>
              <CardTitle>{editing ? "Editar Empleado" : "Nuevo Empleado"}</CardTitle>
            </div>
            <button 
              onClick={() => { setShowForm(false); setEditing(null); }}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Nombre completo" required>
                <ModernInput 
                  placeholder="Nombre del empleado" 
                  value={form.nombre} 
                  onChange={e => setForm((p: any) => ({ ...p, nombre: e.target.value }))}
                />
              </FormField>
              <FormField label="Email" required>
                <ModernInput 
                  type="email"
                  placeholder="correo@email.com" 
                  value={form.email} 
                  onChange={e => setForm((p: any) => ({ ...p, email: e.target.value }))}
                />
              </FormField>
              <FormField label={editing ? "Nueva contraseña (vacío = sin cambio)" : "Contraseña"} required={!editing}>
                <ModernInput 
                  type="password"
                  placeholder="••••••••" 
                  value={form.password || ""} 
                  onChange={e => setForm((p: any) => ({ ...p, password: e.target.value }))}
                />
              </FormField>
              <FormField label="Rol">
                <ModernSelect 
                  value={form.role} 
                  onChange={e => setForm((p: any) => ({ ...p, role: e.target.value as RoleKey }))}
                  options={TENANT_ROLES.map(r => ({
                    value: r,
                    label: ROLE_DEFINITIONS[r].label
                  }))}
                />
              </FormField>
              <FormField label="Teléfono">
                <ModernInput 
                  placeholder="(809) 000-0000" 
                  value={form.telefono || ""} 
                  onChange={e => setForm((p: any) => ({ ...p, telefono: e.target.value }))}
                />
              </FormField>
              <FormField label="Cédula">
                <ModernInput 
                  placeholder="001-0000000-0" 
                  value={form.cedula || ""} 
                  onChange={e => setForm((p: any) => ({ ...p, cedula: e.target.value }))}
                />
              </FormField>
            </div>

            {/* Role Info */}
            {form.role && ROLE_DEFINITIONS[form.role as RoleKey] && (
              <div 
                className="mt-4 p-4 rounded-lg border-l-4 bg-muted/50"
                style={{ borderLeftColor: ROLE_DEFINITIONS[form.role as RoleKey]?.color }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4" style={{ color: ROLE_DEFINITIONS[form.role as RoleKey]?.color }} />
                  <span className="font-semibold text-sm" style={{ color: ROLE_DEFINITIONS[form.role as RoleKey]?.color }}>
                    {ROLE_DEFINITIONS[form.role as RoleKey]?.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {ROLE_DEFINITIONS[form.role as RoleKey]?.description}
                </p>
              </div>
            )}

            <div className="flex justify-end mt-6 pt-4 border-t border-border">
              <ModernButton color="gray" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>
                Cancelar
              </ModernButton>
              <ModernButton onClick={handleSave} color={saved ? "green" : "blue"}>
                <Save className="h-4 w-4" />
                {saved ? "Guardado" : "Guardar Cambios"}
              </ModernButton>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Empleados de {empresa?.nombre || "la empresa"}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table 
            heads={["Empleado", "Rol", "Teléfono", "Estado", "Acciones"]}
            rows={empleados.map(e => [
              columns[0].render(e),
              columns[1].render(e),
              columns[2].render(e),
              columns[3].render(e),
              columns[4].render(e),
            ])}
          />
        </CardContent>
      </Card>
    </div>
  );
}
