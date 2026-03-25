"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { useAuth } from "@/lib/AuthContext";
import { ModuleKey } from "@/lib/roles";

const NAV_TO_MODULE: Record<string, ModuleKey> = {
  panel: "panel", buscar: "clientes", cliente: "clientes", prestamo: "prestamos", pagos: "pagos",
  reportes: "reportes", garantias: "garantias", documentos: "documentos",
  finanzas: "finanzas", agenda: "agenda", whatsapp: "whatsapp",
  contabilidad: "contabilidad", configuracion: "configuracion",
  empleados: "empleados", empresas: "empresas",
};

const ICONS: Record<string, React.ReactNode> = {
  panel: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  cliente: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  prestamo: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>,
  pagos: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  reportes: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  garantias: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  documentos: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  finanzas: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  contabilidad: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>,
  configuracion: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  whatsapp: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  agenda: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  empleados: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  salir: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

export default function Sidebar({ onClose, isCollapsed }: { onClose?: () => void; isCollapsed?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, empresa, logout, hasModule, roleLabel, roleColor } = useAuth();

  const getActiveParent = () => {
    if (isCollapsed) return null;
    for (const item of NAV_ITEMS) {
      if (item.children?.some(c => pathname === c.href || pathname.startsWith(c.href + "/"))) {
        return item.id;
      }
    }
    return null;
  };

  const [openId, setOpenId] = useState<string | null>(getActiveParent);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isCollapsed) {
      setOpenId(null);
    } else {
      setOpenId(getActiveParent());
    }
  }, [pathname, isCollapsed]);

  function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/dashboard/clientes?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    if (onClose) onClose();
  }

  function toggle(id: string) {
    if (isCollapsed) return;
    setOpenId(prev => prev === id ? null : id);
  }

  function isActive(item: typeof NAV_ITEMS[0]) {
    if (item.href && pathname === item.href) return true;
    if (item.children) return item.children.some(c => pathname === c.href || pathname.startsWith(c.href + "/"));
    return false;
  }

  function handleLogout() { 
    logout(); 
    router.push("/login"); 
  }

  const visibleItems = NAV_ITEMS.filter(item => {
    const modKey = NAV_TO_MODULE[item.id];
    return modKey ? hasModule(modKey) : true;
  });

  const brandName = empresa?.nombre ?? (user?.role === "super_admin" ? "CREDICONTROL" : "CrediControl");

  return (
    <div className="flex flex-col h-full bg-sidebar overflow-y-auto overflow-x-hidden no-scrollbar">
      {/* Brand */}
      <div className={`flex items-center justify-between min-h-[64px] border-b border-white/5 ${isCollapsed ? 'px-0 justify-center' : 'px-5'}`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            C
          </div>
          {!isCollapsed && (
            <span className="text-sidebar-foreground font-bold text-lg tracking-tight">
              {brandName}
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
            className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 ${onClose ? 'w-12 h-12 text-lg' : 'w-16 h-16 mx-auto mb-3 text-xl'}`}
            style={{ backgroundColor: roleColor + '66' }}
          >
            {user?.nombre?.[0] ?? "?"}
          </div>
          <div className={onClose ? 'flex-1 min-w-0' : 'text-center'}>
            <p className="text-sidebar-foreground font-semibold text-sm truncate">
              {user?.nombre ?? "-"}
            </p>
            <div className={`flex items-center gap-2 mt-1.5 ${onClose ? '' : 'justify-center'}`}>
              <span 
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: roleColor + '22', 
                  color: roleColor,
                  border: `1px solid ${roleColor}44`
                }}
              >
                {roleLabel}
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] text-sidebar-foreground/50">Online</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {!isCollapsed && (
        <div className="px-4 py-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cliente..."
              className="w-full bg-sidebar-muted text-sidebar-foreground placeholder:text-sidebar-foreground/40 text-sm rounded-lg py-2.5 pl-10 pr-4 border border-transparent focus:border-primary/50 focus:outline-none transition-colors"
            />
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-foreground/40"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </form>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        {visibleItems.map(item => {
          const active = isActive(item);
          const isOpen = openId === item.id;
          const hasChildren = !!item.children?.length;
          const icon = ICONS[item.id] ?? ICONS.panel;

          return (
            <div key={item.id} className="mb-1">
              {hasChildren ? (
                <button 
                  onClick={() => toggle(item.id)} 
                  title={isCollapsed ? item.label : ""}
                  className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'
                  } ${active 
                    ? 'bg-sidebar-accent/10 text-sidebar-accent' 
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-muted'
                  }`}
                >
                  <span className={active ? 'text-sidebar-accent' : ''}>{icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      >
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </>
                  )}
                </button>
              ) : (
                <Link 
                  href={item.href!} 
                  onClick={onClose} 
                  title={isCollapsed ? item.label : ""}
                  className={`flex items-center gap-3 rounded-lg transition-all duration-200 ${
                    isCollapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'
                  } ${active 
                    ? 'bg-sidebar-accent/10 text-sidebar-accent' 
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-muted'
                  }`}
                >
                  <span className={active ? 'text-sidebar-accent' : ''}>{icon}</span>
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              )}

              {/* Submenu */}
              {hasChildren && isOpen && !isCollapsed && (
                <div className="mt-1 ml-4 pl-4 border-l border-sidebar-muted space-y-1 animate-slide-in">
                  {item.children!.map(child => {
                    const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
                    return (
                      <Link 
                        key={child.href} 
                        href={child.href} 
                        onClick={onClose}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          childActive 
                            ? 'bg-sidebar-accent/10 text-sidebar-accent font-medium' 
                            : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-muted'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${childActive ? 'bg-sidebar-accent' : 'bg-sidebar-foreground/30'}`} />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
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
            {ICONS.salir}
            {!isCollapsed && <span className="text-sm font-medium">Cerrar Sesion</span>}
          </button>
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="px-5 py-3 border-t border-white/5">
          <p className="text-[11px] text-sidebar-foreground/40 text-center">
            credicontrol.net v3.0
          </p>
        </div>
      )}
    </div>
  );
}
