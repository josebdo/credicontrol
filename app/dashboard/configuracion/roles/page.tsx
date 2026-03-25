"use client";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Box } from "@/components/UI";
import { ROLE_DEFINITIONS, RoleKey, ModuleKey, Action, ROLE_DEFINITIONS as RD } from "@/lib/roles";
import { useAuth } from "@/lib/AuthContext";
import { USERS } from "@/lib/auth";

const MODULE_LABELS: Record<ModuleKey,string> = {
  panel:"Panel", clientes:"Clientes", prestamos:"Préstamos", pagos:"Pagos",
  reportes:"Reportes", garantias:"Garantías", documentos:"Documentos",
  finanzas:"Finanzas", agenda:"Agenda", whatsapp:"WhatsApp",
  contabilidad:"Contabilidad", configuracion:"Configuración",
  empleados:"Empleados", empresas:"Empresas",
};

const ALL_ACTIONS: Action[] = ["ver","crear","editar","eliminar","imprimir","exportar"];
const ACTION_LABELS: Record<Action,string> = {
  ver:"Ver", crear:"Crear", editar:"Editar", eliminar:"Eliminar", imprimir:"Imprimir", exportar:"Exportar",
};

export default function RolesPage() {
  return <ProtectedRoute module="configuracion"><RolesContent /></ProtectedRoute>;
}

function RolesContent() {
  const { canEditRoles, isSuperAdmin } = useAuth();
  const [activeRole, setActive] = useState<RoleKey>("administrador");
  const roles = Object.keys(ROLE_DEFINITIONS) as RoleKey[];
  const roleDef = ROLE_DEFINITIONS[activeRole];
  const modules = Object.keys(MODULE_LABELS) as ModuleKey[];

  function getP(role: RoleKey, mod: ModuleKey) { return ROLE_DEFINITIONS[role]?.permissions[mod] ?? false; }
  function hasA(role: RoleKey, mod: ModuleKey, action: Action): boolean {
    const p = getP(role, mod);
    if (p === true) return true;
    if (Array.isArray(p)) return p.includes(action);
    return false;
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"15px" }}>

      {/* Read-only notice for non-super-admins */}
      {!canEditRoles && (
        <div style={{ background:"#fcf8e3", border:"1px solid #faebcc", borderRadius:"3px", padding:"10px 15px", display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{ fontSize:"18px" }}>🔒</span>
          <div>
            <strong style={{ fontSize:"13px", color:"#8a6d3b" }}>Vista de solo lectura</strong>
            <p style={{ fontSize:"12px", color:"#8a6d3b", margin:0 }}>
              Los permisos son configurados por el Super Admin de CrediControl. Aquí puedes consultar qué puede hacer cada rol.
            </p>
          </div>
        </div>
      )}
      {canEditRoles && (
        <div style={{ background:"#d9edf7", border:"1px solid #bce8f1", borderRadius:"3px", padding:"10px 15px", display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{ fontSize:"18px" }}>🛡️</span>
          <div>
            <strong style={{ fontSize:"13px", color:"#31708f" }}>Modo Super Admin — Gestión de Permisos</strong>
            <p style={{ fontSize:"12px", color:"#31708f", margin:0 }}>
              Eres el único con acceso para modificar roles y permisos. Los cambios afectan a todos los tenants.
            </p>
          </div>
        </div>
      )}

      {/* Role selector */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px" }}>
        {roles.map(role => {
          const def = ROLE_DEFINITIONS[role];
          const count = USERS.filter(u=>u.role===role).length;
          return (
            <div key={role} onClick={() => setActive(role)} style={{
              background:"#fff", borderRadius:"3px",
              boxShadow: activeRole===role ? `0 0 0 2px ${def.color}` : "0 1px 1px rgba(0,0,0,0.1)",
              borderLeft:`4px solid ${def.color}`, padding:"12px", cursor:"pointer",
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px" }}>
                <span style={{ fontSize:"12px", fontWeight:700, color:def.color }}>{def.label}</span>
                <span style={{ fontSize:"10px", background:"#f4f4f4", borderRadius:"10px", padding:"1px 7px", color:"#777" }}>{count} usuario{count!==1?"s":""}</span>
              </div>
              <p style={{ fontSize:"11px", color:"#999", margin:0, lineHeight:1.5 }}>{def.description.split(".")[0]}.</p>
              <div style={{ display:"flex", gap:"4px", marginTop:"6px" }}>
                {def.canManageEmployees && <span style={{ fontSize:"9px", background:"#dff0d8", color:"#3c763d", padding:"1px 5px", borderRadius:"2px", fontWeight:600 }}>GESTIÓN EMPLEADOS</span>}
                {def.canEditRoles       && <span style={{ fontSize:"9px", background:"#f2dede", color:"#a94442", padding:"1px 5px", borderRadius:"2px", fontWeight:600 }}>EDITA PERMISOS</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Permission matrix */}
      <Box title={`Matriz de Permisos — ${roleDef.label}`} color={roleDef.color}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
            <thead>
              <tr style={{ background:"#f4f4f4" }}>
                <th style={{ padding:"9px 12px", textAlign:"left", color:"#777", fontWeight:700, fontSize:"12px", width:"160px" }}>Módulo</th>
                <th style={{ padding:"9px 8px", textAlign:"center", color:"#666", fontWeight:700, fontSize:"11px" }}>Acceso</th>
                {ALL_ACTIONS.map(a=>(
                  <th key={a} style={{ padding:"9px 6px", textAlign:"center", color:"#777", fontWeight:700, fontSize:"11px", textTransform:"uppercase" }}>
                    {ACTION_LABELS[a]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((mod, i) => {
                const perm  = getP(activeRole, mod);
                const hasAny = perm !== false;
                return (
                  <tr key={mod} style={{ borderBottom:"1px solid #f4f4f4", background: i%2===0?"#fff":"#fafafa" }}>
                    <td style={{ padding:"8px 12px", fontWeight: hasAny?600:400, color: hasAny?"#333":"#ccc" }}>
                      {MODULE_LABELS[mod]}
                    </td>
                    <td style={{ padding:"8px 6px", textAlign:"center" }}>
                      {hasAny
                        ? <span style={{ color:"#00a65a", fontSize:"16px" }}>✓</span>
                        : <span style={{ color:"#f0f0f0", fontSize:"14px" }}>✗</span>}
                    </td>
                    {ALL_ACTIONS.map(action => (
                      <td key={action} style={{ padding:"8px 6px", textAlign:"center" }}>
                        {hasA(activeRole, mod, action)
                          ? <span style={{ color:"#00a65a", fontSize:"15px" }}>●</span>
                          : <span style={{ color:"#ebebeb", fontSize:"13px" }}>○</span>}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize:"11px", color:"#bbb", margin:"12px 0 0" }}>
          {canEditRoles
            ? "💡 Para modificar, edita lib/roles.ts o implementa la UI de edición de permisos."
            : "🔒 Solo el Super Admin de CrediControl puede modificar estos permisos."}
        </p>
      </Box>
    </div>
  );
}
