"use client";
// ─────────────────────────────────────────────────────────────────────────────
// PROTECTED ROUTE — wrapper que protege páginas por módulo y acción opcional
// ─────────────────────────────────────────────────────────────────────────────
import { useAuth } from "@/lib/AuthContext";
import { ModuleKey, Action } from "@/lib/roles";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  module:   ModuleKey;
  action?:  Action;
  children: React.ReactNode;
}

export default function ProtectedRoute({ module, action = "ver", children }: Props) {
  const { user, isLoading, can, hasModule } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  if (isLoading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"300px" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:"32px", height:"32px", border:"3px solid #3c8dbc", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 10px" }}/>
        <p style={{ color:"#aaa", fontSize:"13px" }}>Cargando...</p>
      </div>
    </div>
  );

  if (!user) return null;

  if (!hasModule(module)) return <AccessDenied reason="No tienes acceso a este módulo." />;
  if (!can(module, action)) return <AccessDenied reason={`No tienes permiso para ${action} en este módulo.`} />;

  return <>{children}</>;
}

function AccessDenied({ reason }: { reason: string }) {
  const router = useRouter();
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"350px", textAlign:"center", gap:"12px" }}>
      <div style={{ width:"70px", height:"70px", borderRadius:"50%", background:"#f2dede", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"32px" }}>🔒</div>
      <h2 style={{ fontSize:"20px", fontWeight:700, color:"#a94442", margin:0 }}>Acceso Denegado</h2>
      <p style={{ fontSize:"13px", color:"#888", maxWidth:"360px", lineHeight:1.6 }}>{reason}</p>
      <button onClick={() => router.push("/dashboard")}
        style={{ padding:"7px 18px", background:"#3c8dbc", color:"#fff", border:"none", borderRadius:"3px", fontSize:"13px", cursor:"pointer", fontWeight:600 }}>
        Volver al Panel
      </button>
    </div>
  );
}
