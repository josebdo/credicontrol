"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/UI";
import { Users, FileText, Lock, ClipboardList, Edit3, FileCheck, AlertCircle, CheckSquare, Bluetooth, ArrowRight } from "lucide-react";

const DOCS = [
  { href:"/dashboard/documentos/testigos", icon: Users, title:"Testigos", desc:"Datos de testigos para contratos", color:"bg-primary/10 text-primary" },
  { href:"/dashboard/documentos/pagare-notarial", icon: FileText, title:"Pagaré Notarial", desc:"Pagaré notarial estándar autogenerado", color:"bg-primary/10 text-primary" },
  { href:"/dashboard/documentos/pagare-garantia", icon: Lock, title:"Pagaré con Garantía", desc:"Pagaré con bienes en garantía", color:"bg-warning/10 text-warning" },
  { href:"/dashboard/documentos/entrega-voluntaria", icon: ClipboardList, title:"Entrega Voluntaria", desc:"Documento de entrega voluntaria de bien", color:"bg-destructive/10 text-destructive" },
  { href:"/dashboard/documentos/debo-pagare", icon: Edit3, title:"Debo y Pagaré", desc:"Documento Debo y Pagaré simple", color:"bg-success/10 text-success" },
  { href:"/dashboard/documentos/debo-pagare-garantia", icon: FileCheck, title:"Debo y Pagaré con Garantía", desc:"Debo y Pagaré con bien como garantía", color:"bg-success/10 text-success" },
  { href:"/dashboard/documentos/intimidacion", icon: AlertCircle, title:"Intimidación de Pago", desc:"Carta de intimidación de cobro", color:"bg-destructive/10 text-destructive" },
  { href:"/dashboard/documentos/carta-saldo", icon: CheckSquare, title:"Carta de Saldo", desc:"Carta de saldo / cancelación de deuda", color:"bg-success/10 text-success" },
  { href:"/dashboard/documentos/contrato-bluetooth", icon: Bluetooth, title:"Contrato Bluetooth", desc:"Imprimir contrato vía Bluetooth desde móvil", color:"bg-primary/10 text-primary" },
];

export default function DocumentosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documentos Legales</h1>
          <p className="text-muted-foreground mt-1">Genera documentos legales y contratos para tus préstamos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOCS.map(d => {
          const Icon = d.icon;
          return (
            <Link key={d.href} href={d.href} className="group">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${d.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {d.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {d.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-muted/50 border-t border-border flex items-center justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <span className="text-sm font-medium">Generar documento</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
