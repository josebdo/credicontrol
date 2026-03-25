import { createClient } from "./supabase/client";
const supabase = createClient();
import { generarReferencia } from "./referencia";

// ── TYPES ─────────────────────────────────────────────────────────────────────

export type Cliente = {
  id: string;
  nombre: string;
  cedula: string;
  telefono: string;
  telefono_2?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  ocupacion?: string;
  activo: boolean;
  fecha_registro: string;
  notas?: string;
  empresa_id?: string;
};

export type Prestamo = {
  id: string;
  cliente_id: string;
  cliente?: string; // Para compatibilidad con UI
  cedula?: string;  // Para compatibilidad con UI
  monto: number;
  tasa_interes: number;
  cuota_calculada: number;
  num_cuotas: number;
  pagadas?: number; // Calculado o de vista
  fecha_inicio: string;
  fecha_vencimiento: string;
  saldo_capital: number;
  dias_mora: number;
  mora_acumulada: number;
  estado: "activo" | "mora" | "saldado" | "cancelado";
  cobrador_id?: string;
  ruta?: string;
  garantia_id?: string;
  notas?: string;
  // Aliases para compatibilidad con UI vieja
  cuota?: number; 
  saldo?: number;
  fecha_vence?: string;
};

export type Pago = {
  id: string;
  referencia: string;
  fecha_pago: string;
  prestamo_id: string;
  cliente?: string;
  cedula?: string;
  cuota_num?: number;
  total_cuotas?: number;
  monto: number;
  monto_capital: number;
  monto_interes: number;
  monto_mora: number;
  forma_pago: string;
  cobrado_por?: string;
  activo: boolean;
};

export type Cuenta = {
  id: string;
  banco: string;
  tipo: string;
  numero: string;
  titular: string;
  saldo: number;
  activa: boolean;
};

export type Plantilla = {
  id: string;
  nombre: string;
  contenido: string;
  tipo: string;
  activa: boolean;
};

// ... otros tipos (Garantia, Gasto, etc.) siguen el mismo patrón de la base de datos

// ── CLIENTES ──────────────────────────────────────────────────────────────────

export async function getClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nombre');
  if (error) throw error;
  return data as Cliente[];
}

export async function addCliente(cliente: Omit<Cliente, "id" | "fecha_registro">) {
  const { data, error } = await supabase
    .from('clientes')
    .insert([cliente])
    .select()
    .single();
  if (error) throw error;
  return data as Cliente;
}

export async function updateCliente(id: string, updates: Partial<Cliente>) {
  const { data, error } = await supabase
    .from('clientes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Cliente;
}

// ── PRESTAMOS ─────────────────────────────────────────────────────────────────

export async function getPrestamos() {
  const { data, error } = await supabase
    .from('prestamos')
    .select('*, clientes(nombre, cedula)')
    .order('creado_en', { ascending: false });
  
  if (error) throw error;

  // Mapeo para compatibilidad con UI
  return data.map(p => ({
    ...p,
    cliente: p.clientes?.nombre,
    cedula: p.clientes?.cedula,
    cuota: p.cuota_calculada,
    saldo: p.saldo_capital,
    fecha_vence: p.fecha_vencimiento
  })) as (Prestamo & { cliente: string; cedula: string })[];
}

export async function addPrestamo(prestamo: any) {
  const { data, error } = await supabase
    .from('prestamos')
    .insert([prestamo])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePrestamo(id: string, updates: any) {
  const { data, error } = await supabase
    .from('prestamos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePrestamo(id: string) {
  const { error } = await supabase
    .from('prestamos')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ── PAGOS ─────────────────────────────────────────────────────────────────────

export async function getPagos() {
  const { data, error } = await supabase
    .from('pagos')
    .select('*, clientes(nombre, cedula)')
    .order('fecha_pago', { ascending: false });
  
  if (error) throw error;
  return data.map(pg => ({
    ...pg,
    cliente: pg.clientes?.nombre,
    cedula: pg.clientes?.cedula,
  }));
}

export async function addPago(pago: any) {
  const { data, error } = await supabase
    .from('pagos')
    .insert([{ ...pago, referencia: generarReferencia("PAG") }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── OTROS ───────────────────────────────────────────────────────────────────

export async function getGarantias() {
  const { data, error } = await supabase.from('garantias').select('*, clientes(nombre)');
  if (error) throw error;
  return data.map(g => ({ ...g, cliente: g.clientes?.nombre }));
}

export async function getGastos() {
  const { data, error } = await supabase.from('gastos').select('*').order('fecha', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addGasto(gasto: any) {
  const { data, error } = await supabase.from('gastos').insert([gasto]).select().single();
  if (error) throw error;
  return data;
}

export async function deleteGasto(id: string) {
  const { error } = await supabase.from('gastos').delete().eq('id', id);
  if (error) throw error;
}

export async function getCuentas() {
  const { data, error } = await supabase.from('cuentas_bancarias').select('*');
  if (error) throw error;
  return data;
}

export async function addCuenta(cuenta: any) {
  const { data, error } = await supabase.from('cuentas_bancarias').insert([cuenta]).select().single();
  if (error) throw error;
  return data;
}

export async function getPlantillas() {
  const { data, error } = await supabase.from('whatsapp_plantillas').select('*');
  if (error) throw error;
  return data;
}

export async function addPlantilla(plantilla: any) {
  const { data, error } = await supabase.from('whatsapp_plantillas').insert([plantilla]).select().single();
  if (error) throw error;
  return data;
}

export async function updatePlantilla(id: string, updates: any) {
  const { data, error } = await supabase.from('whatsapp_plantillas').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function updateEmpresa(id: string, updates: any) {
  const { data, error } = await supabase.from('empresas').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// ── USUARIOS ──────────────────────────────────────────────────────────────────

export async function getUsuarios() {
  const { data, error } = await supabase.from('usuarios').select('*').order('nombre');
  if (error) throw error;
  return data;
}

export async function addUsuario(usuario: any) {
  const { data, error } = await supabase.from('usuarios').insert([usuario]).select().single();
  if (error) throw error;
  return data;
}

export async function updateUsuario(id: string, updates: any) {
  const { data, error } = await supabase.from('usuarios').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
