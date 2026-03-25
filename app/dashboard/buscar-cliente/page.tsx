"use client";
import { useState } from "react";
import { Box } from "@/components/UI";
import { CLASIFICACIONES, NivelCredito } from "@/lib/clasificacion";
import { useAuth } from "@/lib/AuthContext";

// ─── Datos demo cross-empresa ─────────────────────────────────────────────────
type HistEntry = { empresa_id:string; empresa:string; total:number; activos:number; saldados:number; diasMora:number; deuda:number; nivel:NivelCredito };
type ClienteGlobal = { cedula:string; nombre:string; telefono:string; historial:HistEntry[] };

const HISTORIAL_GLOBAL: ClienteGlobal[] = [
  {
    cedula:"0011234567 8", nombre:"Rosa M. Peña", telefono:"829-555-0101",
    historial:[
      { empresa_id:"emp-001", empresa:"CrediControl", total:2, activos:1, saldados:1, diasMora:0,  deuda:9600,  nivel:"A+" },
    ],
  },
  {
    cedula:"0012345678 9", nombre:"Juan C. Soto", telefono:"829-555-0102",
    historial:[
      { empresa_id:"emp-001", empresa:"CrediControl",     total:1, activos:1, saldados:0, diasMora:12, deuda:12600, nivel:"C" },
      { empresa_id:"emp-002", empresa:"Capital Express RD",total:2, activos:1, saldados:1, diasMora:0,  deuda:8000,  nivel:"B" },
    ],
  },
  {
    cedula:"0019999999 9", nombre:"Pedro Mal Pagador", telefono:"829-000-0000",
    historial:[
      { empresa_id:"emp-001", empresa:"CrediControl",     total:1, activos:1, saldados:0, diasMora:45,  deuda:25000, nivel:"D" },
      { empresa_id:"emp-002", empresa:"Capital Express RD",total:1, activos:1, saldados:0, diasMora:92,  deuda:15000, nivel:"E" },
      { empresa_id:"emp-003", empresa:"Inversiones Norte", total:1, activos:0, saldados:0, diasMora:120, deuda:10000, nivel:"E" },
    ],
  },
  {
    cedula:"0014567890 1", nombre:"Carmen L. Vega", telefono:"829-555-0105",
    historial:[
      { empresa_id:"emp-001", empresa:"CrediControl", total:2, activos:2, saldados:0, diasMora:0, deuda:19000, nivel:"A+" },
    ],
  },
  {
    cedula:"0015678901 2", nombre:"María A. Cruz", telefono:"829-555-0103",
    historial:[
      { empresa_id:"emp-001", empresa:"CrediControl",     total:3, activos:2, saldados:1, diasMora:0, deuda:28000, nivel:"A+" },
      { empresa_id:"emp-003", empresa:"Inversiones Norte", total:1, activos:0, saldados:1, diasMora:0, deuda:0,     nivel:"A+" },
    ],
  },
];

const NIVEL_ORDEN: Record<NivelCredito,number> = { "A+":5, "B":4, "C":3, "D":2, "E":1 };

// Normalizar cédula: quita guiones y espacios para comparar
function normCedula(s: string) { return s.replace(/[-\s]/g,""); }

function nivelGlobal(historial: HistEntry[]): NivelCredito {
  return historial.reduce<NivelCredito>((worst, h) =>
    NIVEL_ORDEN[h.nivel] < NIVEL_ORDEN[worst] ? h.nivel : worst,
  "A+");
}

export default function BuscarClientePage() {
  const { isSuperAdmin, can } = useAuth();
  const [query, setQuery]       = useState("");
  const [resultado, setResultado] = useState<ClienteGlobal | null>(null);
  const [buscado, setBuscado]   = useState(false);

  // Accessible to anyone who can create prestamos
  function buscar() {
    const q = query.trim();
    if (!q) return;
    const qNorm = normCedula(q).toLowerCase();
    const found = HISTORIAL_GLOBAL.find(c =>
      normCedula(c.cedula).includes(qNorm) ||
      c.nombre.toLowerCase().includes(q.toLowerCase()) ||
      c.telefono.replace(/[-\s]/g,"").includes(q.replace(/[-\s]/g,""))
    );
    setResultado(found ?? null);
    setBuscado(true);
  }

  const ng    = resultado ? nivelGlobal(resultado.historial) : null;
  const ngDef = ng ? CLASIFICACIONES[ng] : null;

  // Filter historial: non-super-admins only see other companies (not their own duplicate data)
  const historialVisible = resultado
    ? (isSuperAdmin ? resultado.historial : resultado.historial)
    : [];

  return (
    <div style={{ maxWidth:"820px" }}>
      {/* Search box */}
      <Box title="🔍 Búsqueda de Cliente — Historial en la Plataforma" color="#3c8dbc">
        <p style={{ fontSize:"13px", color:"#777", marginBottom:"14px", lineHeight:1.6 }}>
          Busca por <strong>cédula</strong> (con o sin guiones), <strong>nombre</strong> o <strong>teléfono</strong>.
          Verás el historial crediticio del cliente en todas las empresas de la plataforma antes de aprobar un préstamo.
        </p>
        <div style={{ display:"flex", gap:"8px" }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && buscar()}
            placeholder="Ej: 001-1234567-8  ó  0011234567  ó  Rosa Peña  ó  829-555-0101"
            style={{ flex:1, padding:"9px 12px", border:"1px solid #d2d6de", borderRadius:"3px", fontSize:"13px", outline:"none" }}
            autoFocus
          />
          <button onClick={buscar}
            style={{ padding:"9px 22px", background:"#3c8dbc", color:"#fff", border:"none", borderRadius:"3px", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
            Buscar
          </button>
        </div>
        <div style={{ display:"flex", gap:"12px", marginTop:"8px" }}>
          {["001-9999999-9","0011234567","Juan C. Soto","829-000-0000"].map(hint => (
            <button key={hint} onClick={() => { setQuery(hint); }}
              style={{ fontSize:"11px", color:"#3c8dbc", background:"#ecf5fb", border:"1px solid #cde4f4", borderRadius:"10px", padding:"2px 9px", cursor:"pointer" }}>
              {hint}
            </button>
          ))}
        </div>
      </Box>

      {/* No result */}
      {buscado && !resultado && (
        <div style={{ background:"#fff", borderRadius:"3px", boxShadow:"0 1px 1px rgba(0,0,0,0.1)", padding:"40px", textAlign:"center", marginTop:"15px" }}>
          <div style={{ fontSize:"44px", marginBottom:"12px" }}>🔍</div>
          <p style={{ fontSize:"15px", color:"#555", fontWeight:600 }}>Sin resultados</p>
          <p style={{ fontSize:"13px", color:"#aaa" }}>No se encontró ningún cliente con esos datos en la plataforma. El cliente no tiene historial previo.</p>
        </div>
      )}

      {/* Result */}
      {resultado && ngDef && ng && (
        <div style={{ marginTop:"15px", display:"flex", flexDirection:"column", gap:"12px" }}>

          {/* Header cliente */}
          <div style={{ background:"#fff", borderRadius:"3px", boxShadow:"0 1px 3px rgba(0,0,0,0.12)", padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
              <div style={{ width:"52px", height:"52px", borderRadius:"50%", background:ngDef.bgColor, border:`3px solid ${ngDef.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px" }}>
                {ngDef.emoji}
              </div>
              <div>
                <h2 style={{ fontSize:"18px", fontWeight:700, color:"#333", margin:0 }}>{resultado.nombre}</h2>
                <p style={{ fontSize:"12px", color:"#777", margin:"3px 0 0" }}>
                  Cédula: <strong>{resultado.cedula}</strong> &nbsp;·&nbsp; Tel: {resultado.telefono}
                </p>
                <p style={{ fontSize:"11px", color:"#aaa", margin:"2px 0 0" }}>
                  Historial en <strong>{historialVisible.length}</strong> empresa(s) de la plataforma
                </p>
              </div>
            </div>
            {/* Nivel global */}
            <div style={{ textAlign:"center", padding:"10px 18px", background:ngDef.bgColor, borderRadius:"6px", border:`1px solid ${ngDef.color}44` }}>
              <div style={{ fontSize:"34px", fontWeight:900, color:ngDef.color, lineHeight:1 }}>{ng}</div>
              <div style={{ fontSize:"11px", fontWeight:700, color:ngDef.color, marginTop:"3px" }}>{ngDef.label}</div>
              <div style={{ fontSize:"10px", color:"#aaa", marginTop:"2px" }}>Nivel Global</div>
            </div>
          </div>

          {/* Alerta de acción */}
          <div style={{ background:ngDef.bgColor, border:`1px solid ${ngDef.color}44`, borderLeft:`4px solid ${ngDef.color}`, borderRadius:"3px", padding:"12px 16px" }}>
            <strong style={{ fontSize:"13px", color:ngDef.color }}>{ngDef.emoji} {ngDef.perfil}</strong>
            <p style={{ fontSize:"12px", color:ngDef.color, margin:"5px 0 0", opacity:0.85 }}>
              <strong>Acción recomendada:</strong> {ngDef.accionSistema}
            </p>
            {ngDef.restricciones.length > 0 && (
              <div style={{ marginTop:"6px" }}>
                {ngDef.restricciones.map((r,i) => (
                  <div key={i} style={{ fontSize:"12px", color:ngDef.color, opacity:0.8, marginTop:"2px" }}>⚠️ {r}</div>
                ))}
              </div>
            )}
            {ngDef.beneficios.length > 0 && (
              <div style={{ marginTop:"6px" }}>
                {ngDef.beneficios.map((b,i) => (
                  <div key={i} style={{ fontSize:"12px", color:ngDef.color, opacity:0.8, marginTop:"2px" }}>✓ {b}</div>
                ))}
              </div>
            )}
          </div>

          {/* Historial por empresa */}
          <Box title={`Historial en ${historialVisible.length} empresa(s) registradas`} color="#605ca8">
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {historialVisible.map((h, i) => {
                const def = CLASIFICACIONES[h.nivel];
                const stats = [
                  { l:"Préstamos", v: String(h.total),   color:"#555"    },
                  { l:"Activos",   v: String(h.activos),  color:"#3c8dbc" },
                  { l:"Días mora", v: h.diasMora > 0 ? `${h.diasMora}d` : "Al día",
                    color: h.diasMora > 30 ? "#dd4b39" : h.diasMora > 0 ? "#f39c12" : "#00a65a" },
                  { l:"Deuda",     v: h.deuda > 0 ? `RD$ ${h.deuda.toLocaleString()}` : "RD$ 0",
                    color: h.deuda > 0 ? "#dd4b39" : "#00a65a" },
                ];
                return (
                  <div key={i} style={{ border:`1px solid ${def.color}33`, borderRadius:"4px", overflow:"hidden" }}>
                    <div style={{ background:def.bgColor, padding:"8px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${def.color}22` }}>
                      <div>
                        <strong style={{ fontSize:"13px", color:"#333" }}>{h.empresa}</strong>
                        {isSuperAdmin && <span style={{ fontSize:"10px", color:"#aaa", marginLeft:"8px" }}>({h.empresa_id})</span>}
                      </div>
                      <span style={{ fontSize:"15px", fontWeight:900, color:def.color, background:"#fff", padding:"2px 10px", borderRadius:"4px", border:`1px solid ${def.color}44` }}>
                        {def.emoji} {h.nivel}
                      </span>
                    </div>
                    <div style={{ padding:"10px 14px", background:"#fff", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px" }}>
                      {stats.map(s => (
                        <div key={s.l} style={{ textAlign:"center" }}>
                          <p style={{ fontSize:"18px", fontWeight:700, color:s.color, margin:0 }}>{s.v}</p>
                          <p style={{ fontSize:"11px", color:"#aaa", margin:0 }}>{s.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totales */}
            <div style={{ marginTop:"12px", padding:"12px 14px", background:"#f8f5ff", borderRadius:"3px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <strong style={{ fontSize:"13px", color:"#444" }}>Deuda total en la plataforma</strong>
                <p style={{ fontSize:"11px", color:"#aaa", margin:0 }}>Suma de todas las empresas</p>
              </div>
              <span style={{ fontSize:"22px", fontWeight:700, color:"#dd4b39" }}>
                RD$ {historialVisible.reduce((s,h) => s + h.deuda, 0).toLocaleString()}
              </span>
            </div>
          </Box>
        </div>
      )}
    </div>
  );
}
