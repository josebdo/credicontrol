"use client";
import Link from "next/link";
import { useState } from "react";

const PLANS = [
  {
    id: "principiante", name: "Principiante", price: "RD$ 900",
    color: "#3b82f6", popular: false,
    features: ["Hasta 100 prestamos", "1 usuario", "Clientes y cobros", "Agenda de cobro", "Reportes basicos", "Soporte por email"],
    excluded: ["WhatsApp", "Documentos legales", "Finanzas", "Contabilidad", "Multiples usuarios"],
  },
  {
    id: "basico", name: "Basico", price: "RD$ 1,500",
    color: "#22c55e", popular: false,
    features: ["Hasta 500 prestamos", "2 usuarios", "Todo el Principiante", "Documentos legales", "Garantias", "WhatsApp basico"],
    excluded: ["Finanzas avanzadas", "Contabilidad", "API access"],
  },
  {
    id: "intermedio", name: "Intermedio", price: "RD$ 2,000",
    color: "#f59e0b", popular: true,
    features: ["Hasta 1,000 prestamos", "4 usuarios", "Todo el Basico", "Finanzas completas", "Contabilidad", "Cuadre de caja"],
    excluded: ["API access", "Soporte prioritario"],
  },
  {
    id: "avanzado", name: "Avanzado", price: "RD$ 3,000",
    color: "#8b5cf6", popular: false,
    features: ["Hasta 3,000 prestamos", "8 usuarios", "Todo el Intermedio", "WhatsApp avanzado", "Multiples rutas", "Soporte prioritario"],
    excluded: ["API access"],
  },
  {
    id: "empresarial", name: "Empresarial", price: "RD$ 5,500",
    color: "#ef4444", popular: false,
    features: ["Prestamos ilimitados", "16 usuarios", "Todo lo anterior", "API access", "Onboarding personalizado", "Soporte dedicado 24/7", "Reportes personalizados"],
    excluded: [],
  },
];

const FEATURES = [
  { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Gestion de Prestamos", desc: "Control total de tu cartera. Prestamos, cuotas, intereses y mora calculados automaticamente." },
  { icon: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z", title: "Tickets Termicos", desc: "Recibos de pago, prestamos y carta de saldo listos para impresoras POS de 58mm y 80mm." },
  { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Clasificacion Crediticia", desc: "Sistema A+ / B / C / D / E. Sabe automaticamente quien paga bien y quien es riesgo." },
  { icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", title: "Historial Cross-Empresa", desc: "Consulta si un cliente tiene deudas en otras empresas de la plataforma antes de aprobar." },
  { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", title: "WhatsApp Automatico", desc: "Recordatorios de pago, comprobantes y alertas de mora directamente al celular del cliente." },
  { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "Documentos Legales", desc: "Pagares, cartas de saldo, intimidaciones y contratos generados con un click." },
  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Multi-empresa Seguro", desc: "Cada empresa ve unicamente sus datos. Aislamiento total entre tenants." },
  { icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z", title: "Acceso Movil", desc: "Web responsive. Tus cobradores en la calle pueden registrar pagos desde el celular." },
];

const FAQS = [
  { q: "Puedo cancelar en cualquier momento?", a: "Si. No hay contratos de permanencia. Cancela cuando quieras desde tu panel." },
  { q: "Los datos de mis clientes estan seguros?", a: "Absolutamente. Cada empresa tiene su propio espacio aislado. Ninguna empresa puede ver los datos de otra." },
  { q: "Funciona con impresora termica POS?", a: "Si. Los tickets estan optimizados para impresoras de 58mm y 80mm como Epson TM, Bixolon y modelos economicos." },
  { q: "Cuantos usuarios puedo agregar?", a: "Depende del plan. Desde 1 usuario en Principiante hasta 16 en Empresarial, con roles diferenciados (cobrador, secretaria, supervisor)." },
  { q: "Hay periodo de prueba?", a: "Si, 14 dias gratis en cualquier plan. Sin tarjeta de credito requerida." },
];

export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>("intermedio");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <span className="text-xl font-bold text-foreground">CrediControl</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Funciones</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Planes</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden sm:block">
              Iniciar Sesion
            </Link>
            <Link href="/register" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              Empezar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 sm:py-32">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)' }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-lg">DR</span>
            <span className="text-sm text-white/80 font-medium">Hecho para prestamistas dominicanos</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            El sistema de prestamos
            <span className="block text-primary">mas completo de RD</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Gestiona tu cartera, controla la mora, imprime tickets y cobra con WhatsApp. Todo en un solo sistema desde RD$ 900/mes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-white text-slate-900 rounded-xl text-lg font-bold hover:bg-white/90 transition-colors shadow-lg shadow-white/20">
              Empezar Gratis 14 dias
            </Link>
            <a href="#pricing" className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl text-lg font-semibold hover:bg-white/20 transition-colors">
              Ver planes
            </a>
          </div>
          
          <p className="text-white/50 text-sm mt-6">Sin tarjeta de credito - Cancela cuando quieras</p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900 py-8 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { n: "+500", l: "Empresas activas" },
            { n: "RD$2M+", l: "Cartera gestionada" },
            { n: "99.9%", l: "Uptime garantizado" },
            { n: "24/7", l: "Soporte disponible" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-primary">{s.n}</div>
              <div className="text-sm text-white/50 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Todo lo que necesitas para
              <span className="text-primary"> gestionar prestamos</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Disenado especificamente para prestamistas informales y financieras pequenas en Republica Dominicana.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border border-border card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Planes <span className="text-primary">transparentes</span>
            </h2>
            <p className="text-muted-foreground text-lg">Sin costos ocultos. Todos los precios en pesos dominicanos. IVA incluido.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PLANS.map(plan => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative bg-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    isSelected ? 'ring-2 scale-105 shadow-xl z-10' : plan.popular ? 'ring-2 scale-[1.02]' : 'border border-border hover:border-primary/50'
                  }`}
                  style={{ 
                    ringColor: isSelected || plan.popular ? plan.color : undefined,
                    boxShadow: isSelected ? `0 20px 40px ${plan.color}20` : undefined
                  }}
                >
                  {plan.popular && (
                    <div className="text-center text-xs font-bold text-white py-1.5" style={{ backgroundColor: plan.color }}>
                      MAS POPULAR
                    </div>
                  )}
                  <div className="p-5">
                    <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: plan.color }}>{plan.name}</div>
                    <div className="text-2xl font-bold text-foreground">{plan.price}</div>
                    <div className="text-xs text-muted-foreground">/ mes</div>
                  </div>
                  <div className="px-5 pb-5 space-y-2">
                    {plan.features.slice(0, 5).map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: plan.color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="p-5 pt-0">
                    <Link 
                      href={`/register?plan=${plan.id}`}
                      className={`block text-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        isSelected || plan.popular 
                          ? 'text-white' 
                          : 'border-2 bg-transparent hover:bg-current/5'
                      }`}
                      style={{ 
                        backgroundColor: isSelected || plan.popular ? plan.color : 'transparent',
                        borderColor: plan.color,
                        color: isSelected || plan.popular ? 'white' : plan.color
                      }}
                    >
                      Empezar gratis
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            14 dias de prueba gratuita en cualquier plan - Sin tarjeta de credito
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-28 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Preguntas Frecuentes</h2>
            <p className="text-muted-foreground">Todo lo que necesitas saber sobre CrediControl</p>
          </div>
          
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div 
                key={i} 
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <svg 
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${faqOpen === i ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-5 text-muted-foreground animate-slide-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-primary to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Listo para modernizar tu negocio?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Unete a mas de 500 empresas que ya gestionan sus prestamos con CrediControl.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-white text-primary rounded-xl text-lg font-bold hover:bg-white/90 transition-colors">
              Comenzar prueba gratis
            </Link>
            <a href="mailto:soporte@credicontrol.net" className="px-8 py-4 bg-white/10 text-white border border-white/30 rounded-xl text-lg font-semibold hover:bg-white/20 transition-colors">
              Contactar ventas
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">C</div>
              <span className="text-lg font-bold">CrediControl</span>
            </div>
            <div className="flex gap-8 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">Terminos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="mailto:soporte@credicontrol.net" className="hover:text-white transition-colors">Soporte</a>
            </div>
            <p className="text-sm text-white/40">2026 CrediControl. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
