"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PLAN_LIMITS } from "@/lib/auth";

const PLANES = Object.entries(PLAN_LIMITS).map(([k, v]) => ({ key: k, ...v }));

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState("basico");
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmar: "", empresa: "", telefono: "", cedula: "" });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbPlanes, setDbPlanes] = useState<any[]>([]);

  useEffect(() => {
    async function loadPlanes() {
      const supabase = createClient();
      const { data } = await supabase.from('planes').select('*');
      if (data) setDbPlanes(data);
    }
    loadPlanes();
  }, []);

  async function handleRegister() {
    if (!form.nombre || !form.email || !form.password || !form.empresa) { 
      setError("Completa todos los campos obligatorios."); 
      return; 
    }
    if (form.password !== form.confirmar) { 
      setError("Las contrasenas no coinciden."); 
      return; 
    }
    
    setLoading(true);
    setError("");
    const supabase = createClient();

    try {
      // 1. Sign Up in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            nombre: form.nombre,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No se pudo crear el usuario");

      // 2. Onboarding via RPC (Bypasses RLS for initial creation)
      const { data: empId, error: rpcError } = await supabase.rpc('onboard_new_company', {
        p_user_id:      authData.user.id,
        p_company_name: form.empresa,
        p_user_name:    form.nombre,
        p_email:        form.email,
        p_telefono:     form.telefono,
        p_cedula:       form.cedula
      });

      if (rpcError) throw rpcError;

      setSaved(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  }

  const steps = [
    { num: 1, label: "Plan" },
    { num: 2, label: "Tu cuenta" },
    { num: 3, label: "Empresa" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)' }} />
        <div className="relative z-10 flex flex-col justify-center px-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
              C
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">CrediControl</span>
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            Comienza tu prueba
            <span className="block text-primary">gratis de 14 dias</span>
          </h1>
          <p className="text-slate-400 text-base max-w-sm mb-8">
            Sin tarjeta de credito requerida. Cancela cuando quieras.
          </p>
          
          <div className="space-y-4">
            {[
              { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text: "Acceso completo a todas las funciones" },
              { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", text: "Datos seguros y encriptados" },
              { icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "Soporte 24/7 incluido" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={item.icon} />
                  </svg>
                </div>
                <span className="text-slate-300 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <span className="text-foreground font-bold text-xl">CrediControl</span>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Crear tu cuenta</h2>
            <p className="text-muted-foreground text-sm">14 dias de prueba gratis</p>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step > s.num 
                      ? 'bg-success text-white' 
                      : step === s.num 
                        ? 'bg-primary text-white' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {step > s.num ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : s.num}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step === s.num ? 'text-primary' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${step > s.num ? 'bg-success' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Plan */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-sm font-medium text-foreground mb-4">Selecciona tu plan:</p>
              <div className="space-y-3">
                {PLANES.map(p => (
                  <div 
                    key={p.key} 
                    onClick={() => setPlan(p.key)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      plan === p.key 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold capitalize ${plan === p.key ? 'text-primary' : 'text-foreground'}`}>
                            {p.key}
                          </span>
                          {p.key === "profesional" && (
                            <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                              POPULAR
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {p.prestamos === 99999 ? "Ilimitados" : p.prestamos} prestamos - {p.usuarios} usuario(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-foreground">RD$ {p.precio.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">/mes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setStep(2)} 
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Continuar
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          )}

          {/* Step 2: Account */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Nombre completo *</label>
                  <input 
                    type="text"
                    value={form.nombre}
                    onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                    placeholder="Juan Perez"
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                  <input 
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="correo@empresa.com"
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Telefono</label>
                  <input 
                    type="tel"
                    value={form.telefono}
                    onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
                    placeholder="809-000-0000"
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Cedula</label>
                  <input 
                    type="text"
                    value={form.cedula}
                    onChange={e => setForm(p => ({ ...p, cedula: e.target.value }))}
                    placeholder="001-0000000-0"
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Contrasena *</label>
                  <input 
                    type="password"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Min. 6 caracteres"
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Confirmar *</label>
                  <input 
                    type="password"
                    value={form.confirmar}
                    onChange={e => setForm(p => ({ ...p, confirmar: e.target.value }))}
                    placeholder="Repite la contrasena"
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(1)} 
                  className="flex-1 py-3 bg-muted text-foreground rounded-xl font-medium text-sm hover:bg-muted/80 transition-colors"
                >
                  Atras
                </button>
                <button 
                  onClick={() => setStep(3)} 
                  className="flex-[2] py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  Continuar
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Company */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nombre de tu empresa *</label>
                <input 
                  type="text"
                  value={form.empresa}
                  onChange={e => setForm(p => ({ ...p, empresa: e.target.value }))}
                  placeholder="Mi Empresa S.R.L."
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Plan seleccionado</span>
                  <span className="text-lg font-bold text-primary capitalize">{plan}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  RD$ {PLAN_LIMITS[plan].precio.toLocaleString()}/mes - 14 dias gratis, luego se cobra mensualmente.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(2)} 
                  className="flex-1 py-3 bg-muted text-foreground rounded-xl font-medium text-sm hover:bg-muted/80 transition-colors"
                >
                  Atras
                </button>
                <button 
                  onClick={handleRegister} 
                  disabled={saved}
                  className={`flex-[2] py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    saved 
                      ? 'bg-success text-white' 
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {saved ? (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Cuenta creada! Redirigiendo...
                    </>
                  ) : (
                    <>
                      Crear Cuenta Gratis
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Iniciar sesion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
