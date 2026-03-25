"use client";
// ─────────────────────────────────────────────────────────────────────────────
// ACTION GUARD — oculta/deshabilita botones según permiso
// Uso: <ActionGuard module="clientes" action="crear"><Btn>Nuevo</Btn></ActionGuard>
// ─────────────────────────────────────────────────────────────────────────────
import { useAuth } from "@/lib/AuthContext";
import { ModuleKey, Action } from "@/lib/roles";

interface Props {
  module: ModuleKey;
  action: Action;
  children: React.ReactNode;
  hide?: boolean;   // true=ocultar, false=deshabilitar (default: ocultar)
  className?: string;
}

export default function ActionGuard({ module, action, children, hide = true, className }: Props) {
  const { can } = useAuth();
  const allowed = can(module, action);
  if (!allowed && hide) return null;
  if (!allowed) return (
    <span className={className} style={{ opacity: 0.4, cursor: "not-allowed", pointerEvents: "none" }}>
      {children}
    </span>
  );
  return <div className={className}>{children}</div>;
}
