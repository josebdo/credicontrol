"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, FormField, ModernInput, ModernButton } from "@/components/UI";
import { useAuth } from "@/lib/AuthContext";
import { PLAN_LIMITS } from "@/lib/auth";
import { getPrestamos, updateEmpresa, type Prestamo } from "@/lib/data";
import Link from "next/link";
import { Package, Building2, Settings, Users, Key, Landmark, MessageSquare, Calculator, FileText, Save, ArrowUpRight, Zap } from "lucide-react";

export default function ConfiguracionPage() {
  const { empresa } = useAuth();
  const [saved, setSaved] = useState(false);
  const [prestamosActivos, setPrestamosActivos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formEmp, setFormEmp] = useState({
    nombre: empresa?.nombre || "",
    rnc: empresa?.rnc || "",
    telefono: empresa?.telefono || "",
    email: empresa?.email || "",
    direccion: empresa?.direccion || "",
    ciudad: empresa?.ciudad || "",
    pais: empresa?.pais || "República Dominicana",
    moneda: empresa?.moneda || "RD$",
    logo_url: empresa?.logo_url || ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await getPrestamos();
      setPrestamosActivos(data.filter(p => p.estado !== "saldado" && p.estado !== "cancelado").length);
    } catch (error) {
      console.error("Error fetching prestamos:", error);
    } finally {
      setLoading(false);
    }
  }

  const plan = empresa?.plan || "basico";
  const limits = (PLAN_LIMITS as any)[plan] || PLAN_LIMITS.basico;
  const usedUsers = 3;
  const pctPrestamos = Math.min((prestamosActivos / limits.prestamos) * 100, 100);
  const pctUsers = Math.min((usedUsers / limits.usuarios) * 100, 100);

  async function handleSave() {
    if (!empresa?.id) return;
    try {
      await updateEmpresa(empresa.id, formEmp);
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    } catch (error) {
      alert("Error al actualizar empresa");
    }
  }

  const quickLinks = [
    { icon: Users, label: "Usuarios y Empleados", href: "/dashboard/empleados", color: "bg-primary/10 text-primary" },
    { icon: Key, label: "Roles y Permisos", href: "/dashboard/configuracion/roles", color: "bg-primary/10 text-primary" },
    { icon: Landmark, label: "Cuentas Bancarias", href: "/dashboard/finanzas/bancos", color: "bg-success/10 text-success" },
    { icon: MessageSquare, label: "Plantillas WhatsApp", href: "/dashboard/whatsapp/plantillas", color: "bg-success/10 text-success" },
    { icon: Calculator, label: "Calculadora de Cuota", href: "/dashboard/contabilidad/calculadora", color: "bg-warning/10 text-warning" },
    { icon: FileText, label: "Plantillas de Documentos", href: "/dashboard/documentos", color: "bg-destructive/10 text-destructive" },
  ];

  return (
    <div className="space-y-6">
      {/* Plan Card */}
      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Plan Actual</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Uso de recursos y límites de tu plan</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Préstamos */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Préstamos activos</span>
                <span className={`text-sm font-bold ${pctPrestamos > 80 ? 'text-destructive' : 'text-foreground'}`}>
                  {prestamosActivos}/{limits.prestamos}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${pctPrestamos > 80 ? 'bg-destructive' : 'bg-success'}`}
                  style={{ width: `${pctPrestamos}%` }}
                />
              </div>
            </div>

            {/* Usuarios */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Usuarios del sistema</span>
                <span className={`text-sm font-bold ${pctUsers > 80 ? 'text-destructive' : 'text-foreground'}`}>
                  {usedUsers}/{limits.usuarios}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${pctUsers > 80 ? 'bg-destructive' : 'bg-primary'}`}
                  style={{ width: `${pctUsers}%` }}
                />
              </div>
            </div>
          </div>

          {/* Plan Info */}
          <div className="mt-6 p-4 bg-primary/5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground capitalize">{plan}</p>
                <p className="text-sm text-muted-foreground">RD$ {limits.precio.toLocaleString()}/mes</p>
              </div>
            </div>
            <a 
              href="mailto:ventas@credicontrol.net" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <ArrowUpRight className="h-4 w-4" />
              Mejorar Plan
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Datos de Empresa */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Datos de la Empresa</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Información que aparecerá en documentos y recibos</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre de la empresa">
              <ModernInput 
                value={formEmp.nombre} 
                onChange={e => setFormEmp(p => ({ ...p, nombre: e.target.value }))}
                placeholder="Mi Empresa S.R.L."
              />
            </FormField>
            <FormField label="RNC / Identificación Fiscal">
              <ModernInput 
                value={formEmp.rnc} 
                onChange={e => setFormEmp(p => ({ ...p, rnc: e.target.value }))}
                placeholder="000-00000-0"
              />
            </FormField>
            <FormField label="Teléfono de contacto">
              <ModernInput 
                value={formEmp.telefono} 
                onChange={e => setFormEmp(p => ({ ...p, telefono: e.target.value }))}
                placeholder="(809) 000-0000"
              />
            </FormField>
            <FormField label="Correo electrónico">
              <ModernInput 
                type="email"
                value={formEmp.email} 
                onChange={e => setFormEmp(p => ({ ...p, email: e.target.value }))}
                placeholder="empresa@email.com"
              />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Dirección física">
                <ModernInput 
                  value={formEmp.direccion} 
                  onChange={e => setFormEmp(p => ({ ...p, direccion: e.target.value }))}
                  placeholder="Calle Principal #123"
                />
              </FormField>
            </div>
            <FormField label="Ciudad">
              <ModernInput 
                value={formEmp.ciudad} 
                onChange={e => setFormEmp(p => ({ ...p, ciudad: e.target.value }))}
                placeholder="Santo Domingo"
              />
            </FormField>
            <FormField label="País">
              <ModernInput 
                value={formEmp.pais} 
                onChange={e => setFormEmp(p => ({ ...p, pais: e.target.value }))}
              />
            </FormField>
            <FormField label="Moneda">
              <ModernInput 
                value={formEmp.moneda} 
                onChange={e => setFormEmp(p => ({ ...p, moneda: e.target.value }))}
                placeholder="RD$"
              />
            </FormField>
            <FormField label="URL del Logo">
              <ModernInput 
                value={formEmp.logo_url} 
                onChange={e => setFormEmp(p => ({ ...p, logo_url: e.target.value }))}
                placeholder="https://..."
              />
            </FormField>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-border">
            <ModernButton onClick={handleSave} color={saved ? "green" : "blue"}>
              <Save className="h-4 w-4" />
              {saved ? "Guardado" : "Guardar Cambios"}
            </ModernButton>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>Configuraciones del Sistema</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Accesos rápidos a otras configuraciones</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickLinks.map(item => {
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className={`p-2 rounded-lg ${item.color} transition-transform group-hover:scale-110`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
