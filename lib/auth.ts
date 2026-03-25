// ═══════════════════════════════════════════════════════════════════════════════
// AUTH TYPES — usuarios del sistema
// ═══════════════════════════════════════════════════════════════════════════════
import { RoleKey } from "./roles";

export interface Empresa {
  id: string;
  nombre: string;
  plan: "principiante" | "basico" | "intermedio" | "avanzado" | "empresarial";
  activa: boolean;
  dueno?: string;   // user id del administrador
  rnc?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  moneda?: string;
  logo_url?: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  role: RoleKey;
  empresa_id: string | null;   // null solo para super_admin
  activo: boolean;
  telefono?: string;
  cedula?: string;
}

// ── Plan limits ───────────────────────────────────────────────────────────────
export const PLAN_LIMITS: Record<string, { prestamos: number; usuarios: number; label: string; precio: number }> = {
  principiante: { prestamos: 100, usuarios: 1, label: "Principiante", precio: 900 },
  basico: { prestamos: 500, usuarios: 2, label: "Básico", precio: 1500 },
  intermedio: { prestamos: 1000, usuarios: 4, label: "Intermedio", precio: 2000 },
  avanzado: { prestamos: 3000, usuarios: 8, label: "Avanzado", precio: 3000 },
  empresarial: { prestamos: 99999, usuarios: 16, label: "Empresarial", precio: 5500 },
};
