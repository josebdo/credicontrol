"use client";
import { Box, Btn, Badge, Table } from "@/components/UI";
import Link from "next/link";
import { Building2, Car, HardDrive, Smartphone } from "lucide-react";

const BIENES_MOCK = [
  { id: "BN-001", cliente: "Ana Martínez", tipo: "Inmueble", desc: "Apartamento 3B Torre Naco", valor: "RD$ 4,500,000", estado: "Registrado" },
  { id: "BN-002", cliente: "Carlos Ruiz", tipo: "Vehículo", desc: "Toyota Corolla 2022 Blanca", valor: "RD$ 1,200,000", estado: "Registrado" },
  { id: "BN-003", cliente: "Elena Gómez", tipo: "Electrónico", desc: "iPhone 15 Pro Max 256GB Platinum", valor: "RD$ 75,000", estado: "En Proceso" },
];

export default function Page() {
  const clr = "yellow";
  const bg: Record<string,string> = { blue:"#3c8dbc",green:"#00a65a",red:"#dd4b39",yellow:"#f39c12",cyan:"#00c0ef",gray:"#aaa",purple:"#605ca8" };

  return (
    <div className="space-y-6 animate-fade-in">
      <Box title="Inventario de Bienes Registrados" color={bg[clr]}>
        <div className="overflow-x-auto bg-white rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase text-[10px]">ID</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase text-[10px]">Cliente</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase text-[10px]">Tipo</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase text-[10px]">Descripción</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase text-[10px]">Valor Est.</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase text-[10px]">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {BIENES_MOCK.map(b => (
                <tr key={b.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-4 py-4 font-mono text-[11px] text-slate-400">{b.id}</td>
                  <td className="px-4 py-4 font-bold text-slate-700">{b.cliente}</td>
                  <td className="px-4 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      {b.tipo === "Inmueble" && <Building2 className="w-3 h-3" />}
                      {b.tipo === "Vehículo" && <Car className="w-3 h-3" />}
                      {b.tipo === "Electrónico" && <Smartphone className="w-3 h-3" />}
                      {b.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500 text-xs italic">{b.desc}</td>
                  <td className="px-4 py-4 font-black text-amber-600 font-mono text-xs">{b.valor}</td>
                  <td className="px-4 py-4">
                    <Badge color={b.estado === "Registrado" ? "green" : "yellow"} size="sm">{b.estado}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Box>
      <div className="flex justify-end pr-2">
        <Link href="/dashboard">
          <Btn color="gray" variant="ghost">← Volver al Panel</Btn>
        </Link>
      </div>
    </div>
  );
}
