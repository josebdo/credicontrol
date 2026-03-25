"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Empresa } from "./auth";
import { RoleKey, ModuleKey, Action, canDo, canAccessModule, ROLE_DEFINITIONS } from "./roles";
import { createClient } from "@/lib/supabase/client";

interface AuthCtx {
  user:               User | null;
  empresa:            Empresa | null;
  isLoading:          boolean;
  isSuperAdmin:       boolean;
  login:              (email: string, password: string) => Promise<{ ok: boolean; role?: RoleKey; error?: string }>;
  logout:             () => Promise<void>;
  can:                (module: ModuleKey, action: Action) => boolean;
  hasModule:          (module: ModuleKey) => boolean;
  canManageEmployees: boolean;
  canEditRoles:       boolean;
  roleLabel:          string;
  roleColor:          string;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [user, setUser]    = useState<User | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [isLoading, setLoad] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoad(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setEmpresa(null);
        setLoad(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string) {
    try {
      // Fetch user profile from 'usuarios' table
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*, empresas(*)')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      if (userData) {
        setUser({
          id: userData.id,
          nombre: userData.nombre,
          email: userData.email,
          role: userData.rol as RoleKey,
          empresa_id: userData.empresa_id,
          activo: userData.activo,
          telefono: userData.telefono,
          cedula: userData.cedula
        });
        
        if (userData.empresas) {
          setEmpresa(userData.empresas);
        } else {
          setEmpresa(null);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoad(false);
    }
  }

  async function login(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  }

  async function logout() {
    const supabaseLogout = createClient();
    await supabaseLogout.auth.signOut();
  }

  const role    = user?.role as RoleKey | undefined;
  const roleDef = role ? ROLE_DEFINITIONS[role] : null;

  function can(module: ModuleKey, action: Action): boolean {
    if (!role) return false;
    return canDo(role, module, action);
  }
  function hasModule(module: ModuleKey): boolean {
    if (!role) return false;
    return canAccessModule(role, module);
  }

  return (
    <Ctx.Provider value={{
      user, empresa, isLoading, login, logout, can, hasModule,
      isSuperAdmin:       role === "super_admin",
      canManageEmployees: roleDef?.canManageEmployees ?? false,
      canEditRoles:       roleDef?.canEditRoles ?? false,
      roleLabel:          roleDef?.label  ?? "",
      roleColor:          roleDef?.color  ?? "#aaa",
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
