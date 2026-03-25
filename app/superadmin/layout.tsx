"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import SuperAdminSidebar from "./SuperAdminSidebar";

const NAV_MAP: Record<string, string> = {
  "/superadmin": "Dashboard",
  "/superadmin/empresas": "Empresas",
  "/superadmin/planes": "Planes",
  "/superadmin/facturacion": "Facturación",
  "/superadmin/usuarios": "Usuarios",
};

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isSuperAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isSuperAdmin)) {
      router.replace("/login");
    }
  }, [user, isLoading, isSuperAdmin, router]);

  if (isLoading || !user || !isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  const pageTitle = NAV_MAP[pathname] || "Superadmin";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar desktop */}
      <aside 
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[70px]' : 'w-[260px]'
        }`}
      >
        <SuperAdminSidebar isCollapsed={isCollapsed} />
      </aside>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-[280px] z-50 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SuperAdminSidebar onClose={() => setIsMobileMenuOpen(false)} />
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
                  setIsMobileMenuOpen(!isMobileMenuOpen);
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
              <Link href="/superadmin" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Panel Superadmin
              </Link>
              <span className="text-muted-foreground/30 px-1">/</span>
              <span className="text-primary font-semibold">{pageTitle}</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Badge */}
            <div className="hidden sm:flex">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                PLATFORM ADMIN
              </span>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user.nombre[0]}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-700 leading-tight truncate max-w-[100px]">{user.nombre.split(' ')[0]}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">Superadmin</p>
                </div>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-fade-in scale-in origin-top-right">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-xs font-bold text-slate-800 truncate">{user.nombre}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      Ir al Dashboard
                    </Link>
                    <button onClick={() => logout()} className="w-full flex items-center gap-3 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content area with Breadcrumb/Title */}
        <div className="bg-white border-b border-slate-200 px-4 py-4 sm:px-6 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">{pageTitle}</h1>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            <span>Admin</span>
            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
            <span>{pageTitle}</span>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 px-4 py-3 flex justify-between items-center text-[10px] text-slate-400 font-medium shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span>Superadmin Session Active</span>
          </div>
          <span>v3.0 - PLATFORM CONTROL</span>
        </footer>
      </div>
    </div>
  );
}
