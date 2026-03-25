"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ), href: "/superadmin" },
  { id: "empresas", label: "Empresas", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18M3 7v1a3 3 0 006 0V7m0 1v1a3 3 0 006 0V7m0 1v1a3 3 0 006 0V7M4 21V7m16 14V7M9 21V12m6 9V12"/>
    </svg>
  ), href: "/superadmin/empresas" },
  { id: "planes", label: "Planes", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ), href: "/superadmin/planes" },
  { id: "facturacion", label: "Facturación", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  ), href: "/superadmin/facturacion" },
  { id: "usuarios", label: "Usuarios", icon: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/>
    </svg>
  ), href: "/superadmin/usuarios" },
];

export default function SuperAdminSidebar({ onClose, isCollapsed }: { onClose?: () => void; isCollapsed?: boolean }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex flex-col h-full bg-sidebar overflow-y-auto overflow-x-hidden no-scrollbar">
      {/* Brand */}
      <div className={`flex items-center justify-between min-h-[64px] border-b border-white/5 ${isCollapsed ? 'px-0 justify-center' : 'px-5'}`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            S
          </div>
          {!isCollapsed && (
            <span className="text-sidebar-foreground font-bold text-lg tracking-tight">
              SUPERADMIN
            </span>
          )}
        </div>
        {onClose && !isCollapsed && (
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-muted transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* User Panel */}
      {!isCollapsed && (
        <div className={`px-5 py-4 border-b border-white/5 ${onClose ? 'flex items-center gap-4' : ''}`}>
          <div 
            className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 bg-indigo-500/50 ${onClose ? 'w-12 h-12 text-lg' : 'w-16 h-16 mx-auto mb-3 text-xl'}`}
          >
            {user?.nombre?.[0] ?? "S"}
          </div>
          <div className={onClose ? 'flex-1 min-w-0' : 'text-center'}>
            <p className="text-sidebar-foreground font-semibold text-sm truncate">
              {user?.nombre ?? "Super Admin"}
            </p>
            <div className={`flex items-center gap-2 mt-1.5 ${onClose ? '' : 'justify-center'}`}>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
                PLATFORM ADMIN
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || (item.href !== "/superadmin" && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.id}
              href={item.href} 
              onClick={onClose} 
              title={isCollapsed ? item.label : ""}
              className={`flex items-center gap-3 rounded-lg transition-all duration-200 mb-1 ${
                isCollapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'
              } ${active 
                ? 'bg-indigo-500/10 text-indigo-400 font-semibold' 
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-muted'
              }`}
            >
              <span className={active ? 'text-indigo-400' : ''}>{item.icon}</span>
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}

        {/* Logout */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <button 
            onClick={handleLogout} 
            title={isCollapsed ? "Cerrar Sesion" : ""}
            className={`w-full flex items-center gap-3 rounded-lg text-sidebar-foreground/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 ${
              isCollapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {!isCollapsed && <span className="text-sm font-medium">Cerrar Sesion</span>}
          </button>
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="px-5 py-3 border-t border-white/5">
          <p className="text-[11px] text-sidebar-foreground/40 text-center">
            credicontrol.net v3.0 (SA)
          </p>
        </div>
      )}
    </div>
  );
}
