"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { NAV_ITEMS } from "@/lib/nav";
import { useAuth } from "@/lib/AuthContext";

function getBreadcrumb(pathname: string) {
  for (const item of NAV_ITEMS) {
    if (item.href === pathname) return [item.label];
    if (item.children) {
      const child = item.children.find(c => pathname === c.href || pathname.startsWith(c.href + "/"));
      if (child) return [item.label, child.label];
    }
  }
  return ["Panel"];
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const impersonate = searchParams.get("impersonate") === "true";
  const { user, isLoading, logout, roleLabel, roleColor, isSuperAdmin } = useAuth();
  const [mobile, setMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const crumbs = getBreadcrumb(pathname);
  const pageTitle = crumbs[crumbs.length - 1];

  useEffect(() => {
    const handleClose = () => {
      setShowUserMenu(false);
      setShowNotifications(false);
    };
    if (showUserMenu || showNotifications) {
      window.addEventListener("click", handleClose);
    }
    return () => window.removeEventListener("click", handleClose);
  }, [showUserMenu, showNotifications]);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
    if (!isLoading && user && isSuperAdmin && !impersonate) router.replace("/superadmin");
  }, [user, isLoading, router, isSuperAdmin, impersonate]);

  if (isLoading || !user) return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">Cargando...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar desktop */}
      <aside 
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[70px]' : 'w-[260px]'
        }`}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in md:hidden"
          onClick={() => setMobile(false)}
        />
      )}
      
      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-[280px] z-50 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          mobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setMobile(false)} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 shrink-0 z-10">
          <div className="flex items-center gap-2">
            {/* Menu Toggle */}
            <button 
              onClick={() => {
                if (window.innerWidth >= 768) {
                  setIsCollapsed(!isCollapsed);
                } else {
                  setMobile(!mobile);
                }
              }}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            {/* Breadcrumb */}
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Inicio
              </Link>
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="text-muted-foreground/50">/</span>
                  <span className={i === crumbs.length - 1 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                    {c}
                  </span>
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center gap-1">
              <Link 
                href="/dashboard/prestamos/nuevo"
                className="flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-lg text-sm font-medium hover:bg-success/20 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Nuevo Prestamo
              </Link>
              <Link 
                href="/dashboard/pagos/nuevo"
                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Registrar Pago
              </Link>
            </div>

            {/* Role Badge */}
            <div className="hidden sm:flex items-center">
              <span 
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ 
                  backgroundColor: roleColor + '15', 
                  color: roleColor,
                }}
              >
                {roleLabel}
              </span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title="Notificaciones"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-elevated overflow-hidden z-50 animate-slide-in">
                  <div className="p-4 border-b border-border bg-muted/30">
                    <h3 className="font-bold text-sm">Notificaciones</h3>
                  </div>
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 opacity-20">🔔</div>
                    <p className="text-sm font-medium text-foreground">No tienes notificaciones</p>
                    <p className="text-xs text-muted-foreground mt-1 text-balance">Te avisaremos cuando haya actualizaciones importantes.</p>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                }}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: roleColor }}
                >
                  {user.nombre[0]}
                </div>
                <span className="hidden sm:block text-sm font-medium text-foreground max-w-[100px] truncate">
                  {user.nombre.split(" ")[0]}
                </span>
                <svg 
                  className={`hidden sm:block w-4 h-4 text-muted-foreground transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-elevated overflow-hidden animate-slide-in z-50">
                  <div className="p-4 border-b border-border">
                    <p className="font-semibold text-foreground">{user.nombre}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link 
                      href="/dashboard/configuracion"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      Mi Perfil
                    </Link>
                    <Link 
                      href="/dashboard/configuracion"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                      </svg>
                      Configuracion
                    </Link>
                    <a 
                      href="mailto:soporte@credicontrol.net"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      Soporte
                    </a>
                  </div>
                  <div className="p-2 border-t border-border">
                    <button
                      onClick={() => logout()}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Cerrar Sesion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Header */}
        <div className="bg-card border-b border-border px-4 py-3 sm:px-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">{pageTitle}</h1>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border px-4 py-3 flex justify-between items-center text-xs text-muted-foreground shrink-0">
          <span>2026 <span className="text-primary font-semibold">CrediControl</span></span>
          <span>SaaS Platform v3.0</span>
        </footer>
      </div>
    </div>
  );
}
