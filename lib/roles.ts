// ═══════════════════════════════════════════════════════════════════════════════
// ROLES & PERMISSIONS ENGINE — CrediControl SaaS
//
// JERARQUÍA:
//   super_admin  → Dueño de la plataforma (tú). Ve todas las empresas/tenants.
//   administrador → Dueño de la empresa. Gestiona SU negocio y empleados.
//   supervisor   → Empleado senior. Operaciones completas, sin configuración.
//   secretaria   → Empleada de oficina. Clientes, pagos, documentos, agenda.
//   cobrador     → En campo. Solo cobros, agenda y recibos.
//   lectura      → Solo consulta. Sin operaciones.
//
// REGLA: Solo super_admin puede editar permisos/roles. Los demás no.
// ═══════════════════════════════════════════════════════════════════════════════

export type Action = "ver" | "crear" | "editar" | "eliminar" | "imprimir" | "exportar";

export type ModuleKey =
  | "panel" | "clientes" | "prestamos" | "pagos"
  | "reportes" | "garantias" | "documentos" | "finanzas"
  | "agenda" | "whatsapp" | "contabilidad" | "configuracion"
  | "empleados" | "empresas";   // empleados = gestión de staff, empresas = solo super_admin

export type RoleKey =
  | "super_admin"
  | "administrador"
  | "supervisor"
  | "secretaria"
  | "cobrador"
  | "lectura";

export type ModulePermission = Action[] | true | false;
export type RolePermissions  = Partial<Record<ModuleKey, ModulePermission>>;

export interface RoleDef {
  label:       string;
  color:       string;
  description: string;
  canManageEmployees: boolean;  // puede agregar/editar empleados de su empresa
  canEditRoles:       boolean;  // solo super_admin = true
  permissions: RolePermissions;
}

export const ROLE_DEFINITIONS: Record<RoleKey, RoleDef> = {

  // ── Super Admin (tú, dueño de la plataforma) ─────────────────────────────
  super_admin: {
    label:              "Super Admin",
    color:              "#8e24aa",
    description:        "Dueño de la plataforma CrediControl. Acceso total a todas las empresas y configuración global.",
    canManageEmployees: true,
    canEditRoles:       true,    // ÚNICO que puede editar permisos
    permissions: {
      panel:         true,
      clientes:      true,
      prestamos:     true,
      pagos:         true,
      reportes:      true,
      garantias:     true,
      documentos:    true,
      finanzas:      true,
      agenda:        true,
      whatsapp:      true,
      contabilidad:  true,
      configuracion: true,
      empleados:     true,
      empresas:      true,
    },
  },

  // ── Administrador (dueño de la empresa cliente) ───────────────────────────
  administrador: {
    label:              "Administrador",
    color:              "#dd4b39",
    description:        "Dueño del negocio de préstamos. Acceso completo a su empresa. Puede gestionar empleados pero NO editar permisos.",
    canManageEmployees: true,   // puede agregar/editar empleados
    canEditRoles:       false,  // NO puede cambiar permisos
    permissions: {
      panel:         true,
      clientes:      true,
      prestamos:     true,
      pagos:         true,
      reportes:      true,
      garantias:     true,
      documentos:    true,
      finanzas:      true,
      agenda:        true,
      whatsapp:      true,
      contabilidad:  true,
      configuracion: ["ver", "editar"],   // puede editar su empresa pero NO roles
      empleados:     ["ver", "crear", "editar"],
      empresas:      false,
    },
  },

  // ── Supervisor (empleado senior) ──────────────────────────────────────────
  supervisor: {
    label:              "Supervisor",
    color:              "#f39c12",
    description:        "Empleado senior. Operaciones completas. Sin acceso a finanzas ni configuración.",
    canManageEmployees: false,
    canEditRoles:       false,
    permissions: {
      panel:         true,
      clientes:      ["ver", "crear", "editar", "imprimir", "exportar"],
      prestamos:     ["ver", "crear", "editar", "imprimir", "exportar"],
      pagos:         ["ver", "crear", "editar", "imprimir", "exportar"],
      reportes:      ["ver", "imprimir", "exportar"],
      garantias:     ["ver", "crear", "editar", "imprimir"],
      documentos:    ["ver", "imprimir"],
      finanzas:      ["ver", "exportar"],
      agenda:        true,
      whatsapp:      ["ver", "crear"],
      contabilidad:  ["ver", "imprimir", "exportar"],
      configuracion: false,
      empleados:     false,
      empresas:      false,
    },
  },

  // ── Secretaria (oficina) ──────────────────────────────────────────────────
  secretaria: {
    label:              "Secretaria",
    color:              "#00c0ef",
    description:        "Personal de oficina. Gestiona clientes, registra pagos, genera documentos y agenda.",
    canManageEmployees: false,
    canEditRoles:       false,
    permissions: {
      panel:         ["ver"],
      clientes:      ["ver", "crear", "editar", "imprimir"],
      prestamos:     ["ver", "imprimir"],
      pagos:         ["ver", "crear", "imprimir"],
      reportes:      ["ver", "imprimir", "exportar"],
      garantias:     ["ver", "imprimir"],
      documentos:    ["ver", "crear", "imprimir"],
      finanzas:      false,
      agenda:        ["ver", "editar"],
      whatsapp:      ["ver"],
      contabilidad:  false,
      configuracion: false,
      empleados:     false,
      empresas:      false,
    },
  },

  // ── Cobrador (campo) ──────────────────────────────────────────────────────
  cobrador: {
    label:              "Cobrador",
    color:              "#3c8dbc",
    description:        "Personal de campo. Registra cobros, ve su agenda y emite recibos.",
    canManageEmployees: false,
    canEditRoles:       false,
    permissions: {
      panel:         ["ver"],
      clientes:      ["ver"],
      prestamos:     ["ver"],
      pagos:         ["ver", "crear", "imprimir"],
      reportes:      false,
      garantias:     false,
      documentos:    ["ver", "imprimir"],
      finanzas:      false,
      agenda:        ["ver"],
      whatsapp:      false,
      contabilidad:  false,
      configuracion: false,
      empleados:     false,
      empresas:      false,
    },
  },

  // ── Solo lectura ──────────────────────────────────────────────────────────
  lectura: {
    label:              "Solo Lectura",
    color:              "#605ca8",
    description:        "Puede consultar información pero no realizar ninguna operación.",
    canManageEmployees: false,
    canEditRoles:       false,
    permissions: {
      panel:         ["ver"],
      clientes:      ["ver"],
      prestamos:     ["ver"],
      pagos:         ["ver"],
      reportes:      ["ver", "exportar"],
      garantias:     ["ver"],
      documentos:    ["ver"],
      finanzas:      ["ver"],
      agenda:        ["ver"],
      whatsapp:      false,
      contabilidad:  ["ver"],
      configuracion: false,
      empleados:     false,
      empresas:      false,
    },
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────────

export function canAccessModule(role: RoleKey, module: ModuleKey): boolean {
  const perm = ROLE_DEFINITIONS[role]?.permissions[module];
  if (!perm) return false;
  if (perm === true) return true;
  if (Array.isArray(perm)) return perm.length > 0;
  return false;
}

export function canDo(role: RoleKey, module: ModuleKey, action: Action): boolean {
  const perm = ROLE_DEFINITIONS[role]?.permissions[module];
  if (!perm) return false;
  if (perm === true) return true;
  if (Array.isArray(perm)) return perm.includes(action);
  return false;
}

export function getVisibleModules(role: RoleKey): ModuleKey[] {
  return (Object.keys(ROLE_DEFINITIONS[role]?.permissions ?? {}) as ModuleKey[])
    .filter(mod => canAccessModule(role, mod));
}

// Roles que puede asignar un administrador a sus empleados (no puede crear super_admin)
export const EMPLOYEE_ROLES: RoleKey[] = ["supervisor", "secretaria", "cobrador", "lectura"];

// Roles visibles en la UI de gestión según quién los ve
export function getAssignableRoles(viewerRole: RoleKey): RoleKey[] {
  if (viewerRole === "super_admin")    return ["administrador", "supervisor", "secretaria", "cobrador", "lectura"];
  if (viewerRole === "administrador")  return ["supervisor", "secretaria", "cobrador", "lectura"];
  return [];
}
