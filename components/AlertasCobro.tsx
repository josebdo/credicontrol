import Link from "next/link";

interface AlertasCobroProps {
  prestamos: any[];
}

export function AlertasCobro({ prestamos = [] }: AlertasCobroProps) {
  const urgentes = (prestamos || [])
    .filter(p => p.estado === "mora" || p.dias_mora > 0)
    .sort((a, b) => b.dias_mora - a.dias_mora)
    .slice(0, 5);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
          <h3 className="font-semibold text-foreground">Alertas de Cobro</h3>
        </div>
        <Link 
          href="/dashboard/prestamos" 
          className="text-xs text-primary font-medium hover:underline"
        >
          Ver todos
        </Link>
      </div>
      <div className="p-4 space-y-3">
        {urgentes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">No hay alertas pendientes</p>
          </div>
        ) : (
          urgentes.map(p => (
            <div 
              key={p.id} 
              className={`flex items-center justify-between p-3 rounded-lg border-l-4 transition-colors hover:bg-muted/50 ${
                p.dias_mora > 30 
                  ? 'bg-destructive/5 border-l-destructive' 
                  : 'bg-warning/5 border-l-warning'
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm text-foreground truncate">{p.cliente}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{p.id}</span>
                  <span className="text-xs text-muted-foreground">-</span>
                  <span className={`text-xs font-medium ${
                    p.dias_mora > 30 ? 'text-destructive' : 'text-warning'
                  }`}>
                    {p.dias_mora} dias de atraso
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className={`text-sm font-bold ${
                  p.dias_mora > 30 ? 'text-destructive' : 'text-warning'
                }`}>
                  RD$ {p.cuota.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground">Pendiente</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
