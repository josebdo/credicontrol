"use client";
import { useState, useEffect } from "react";
import { Box, Btn, Badge, SearchInput, FilterButton, Modal } from "@/components/UI";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import ActionGuard from "@/components/ActionGuard";
import { getPrestamos, updatePrestamo, deletePrestamo, type Prestamo } from "@/lib/data";

export default function PrestamosPage() {
  return <ProtectedRoute module="prestamos"><Content /></ProtectedRoute>;
}

function Content() {
  const [lista, setLista] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todos");
  const [buscar, setBuscar] = useState("");
  const [detalle, setDetalle] = useState<Prestamo | null>(null);
  const [confirmDeact, setConfirmDeact] = useState<Prestamo | null>(null);
  const [savedDeact, setSavedDeact] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getPrestamos();
      setLista(data);
    } catch (error) {
      console.error("Error fetching prestamos:", error);
    } finally {
      setLoading(false);
    }
  }

  const data = lista.filter(p => {
    const matchF = filter === "Todos" || (p.estado as string).toLowerCase() === filter.toLowerCase();
    const matchB = !buscar || (p.cliente || "").toLowerCase().includes(buscar.toLowerCase()) || p.id.includes(buscar);
    return matchF && matchB;
  });

  async function handleDeactivate(p: Prestamo) {
    if (confirm("¿Está seguro de eliminar este préstamo permanentemente?")) {
      try {
        await deletePrestamo(p.id);
        await fetchData();
        setConfirmDeact(null);
        setDetalle(null);
      } catch (error) {
        alert("Error al eliminar el préstamo");
      }
    }
  }

  const statusColors: Record<string, string> = {
    activo: "green",
    mora: "red", 
    saldado: "blue",
    cancelado: "gray"
  };

  const stats = [
    { label: "Activos", value: lista.filter(p => p.estado === "activo").length, color: "#22c55e" },
    { label: "En Mora", value: lista.filter(p => p.estado === "mora").length, color: "#ef4444" },
    { label: "Saldados", value: lista.filter(p => p.estado === "saldado").length, color: "#3b82f6" },
    { label: "Cartera Total", value: `RD$ ${(lista.filter(p => p.estado !== "saldado").reduce((s, p) => s + (p.saldo || 0), 0) / 1000).toFixed(0)}K`, color: "#8b5cf6" },
  ];

  if (loading) return <div className="p-8 text-center text-muted-foreground">Cargando préstamos...</div>;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <ActionGuard module="prestamos" action="crear">
            <Link href="/dashboard/prestamos/nuevo">
              <Btn color="green">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Nuevo Prestamo
              </Btn>
            </Link>
          </ActionGuard>
          <Link href="/dashboard/prestamos/reenganche">
            <Btn color="purple" variant="outline">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Reenganche
            </Btn>
          </Link>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Excel
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            PDF
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4 border-l-4" style={{ borderLeftColor: stat.color }}>
            <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      {detalle && (
        <div className="bg-card rounded-xl border-2 border-primary/20 p-6 animate-slide-in">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">{detalle.id} - {detalle.cliente}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Cedula: {detalle.cedula} | Ruta: {detalle.ruta}
              </p>
            </div>
            <button 
              onClick={() => setDetalle(null)} 
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {[
              { l: "Monto", v: `RD$ ${detalle.monto.toLocaleString()}` },
              { l: "Cuota", v: `RD$ ${detalle.cuota?.toLocaleString() || 0}` },
              { l: "Progreso", v: `${detalle.pagadas || 0}/${detalle.num_cuotas}` },
              { l: "Saldo", v: `RD$ ${detalle.saldo?.toLocaleString() || 0}` },
              { l: "Mora", v: (detalle.dias_mora || 0) > 0 ? `${detalle.dias_mora}d` : "Al dia" },
              { l: "Vence", v: detalle.fecha_vence || "" },
            ].map(r => (
              <div key={r.l} className="text-center p-3 bg-muted/50 rounded-xl">
                <p className="text-lg font-bold text-foreground">{r.v}</p>
                <p className="text-xs text-muted-foreground">{r.l}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={`/dashboard/pagos/nuevo?prestamoId=${detalle.id}`}>
              <Btn color="green" small>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Registrar Pago
              </Btn>
            </Link>
            <Link href="/dashboard/prestamos/editar">
              <Btn color="yellow" small>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Editar
              </Btn>
            </Link>
            <Link href="/dashboard/documentos/carta-saldo">
              <Btn color="purple" small>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Carta Saldo
              </Btn>
            </Link>
            <Link href="/dashboard/pagos/plan">
              <Btn color="blue" small>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                Plan Pagos
              </Btn>
            </Link>
            {detalle.estado !== "cancelado" && (
              <ActionGuard module="prestamos" action="eliminar">
                <Btn color="red" small onClick={() => setConfirmDeact(detalle)}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6"/>
                  </svg>
                  Eliminar Préstamo
                </Btn>
              </ActionGuard>
            )}
          </div>
        </div>
      )}

      {/* Filters & Table */}
      <Box 
        title="Lista de Prestamos" 
        headerRight={
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              value={buscar}
              onChange={setBuscar}
              placeholder="Buscar..."
              className="w-full sm:w-48"
            />
            <div className="flex gap-1">
              {["Todos", "activo", "mora", "saldado"].map(t => (
                <FilterButton key={t} label={t} active={filter === t} onClick={() => setFilter(t)} />
              ))}
            </div>
          </div>
        }
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                {["ID", "Cliente", "Monto", "Cuota", "Progreso", "Saldo", "Mora", "Vence", "Estado", "Acciones"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map(p => (
                <tr key={p.id} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{p.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{p.cliente}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground font-medium">RD$ {p.monto.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-foreground">RD$ {p.cuota?.toLocaleString() || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full min-w-[60px] overflow-hidden">
                        <div 
                          className="h-full bg-success rounded-full transition-all"
                          style={{ width: `${((p.pagadas || 0) / p.num_cuotas) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{p.pagadas || 0}/{p.num_cuotas}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${(p.saldo || 0) > 0 ? 'text-destructive' : 'text-success'}`}>
                      RD$ {(p.saldo || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {(p.dias_mora || 0) > 0 ? (
                      <span className="text-destructive font-bold text-sm">{p.dias_mora}d</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.fecha_vence || ""}</td>
                  <td className="px-4 py-3">
                    <Badge color={statusColors[p.estado] || "gray"} size="sm">{p.estado}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => {
                          setDetalle(p);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} 
                        className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                        title="Ver detalles"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <Link 
                        href={`/dashboard/pagos/nuevo?prestamoId=${p.id}`}
                        className="p-2 rounded-lg text-success hover:bg-success/10 transition-colors"
                        title="Registrar pago"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Box>

      {/* Confirm Deactivate Modal */}
      <Modal
        isOpen={!!confirmDeact}
        onClose={() => setConfirmDeact(null)}
        title="Desactivar Prestamo"
        size="sm"
      >
        <p className="text-muted-foreground mb-6">
          Desactivar el prestamo <strong className="text-foreground">{confirmDeact?.id}</strong> de {confirmDeact?.cliente}? No se eliminara, quedara inactivo.
        </p>
        <div className="flex gap-3">
          <Btn 
            color={savedDeact ? "green" : "red"} 
            onClick={() => confirmDeact && handleDeactivate(confirmDeact)} 
            className="flex-1"
          >
            {savedDeact ? "Desactivado!" : "Si, desactivar"}
          </Btn>
          <Btn color="gray" variant="outline" onClick={() => setConfirmDeact(null)}>
            Cancelar
          </Btn>
        </div>
      </Modal>
    </div>
  );
}
