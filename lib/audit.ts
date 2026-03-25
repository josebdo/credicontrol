import { createClient } from "./supabase/client";

type AuditAction = "CREAR" | "EDITAR" | "ELIMINAR" | "LOGIN" | "PAGO" | "GASTO" | "DESCARGA";

export async function logAction(usuario: { id: string, nombre: string }, modulo: string, accion: AuditAction, descripcion: string) {
    const supabase = createClient();
    const { error } = await supabase.from('auditoria').insert([{
        usuario_id: usuario.id,
        modulo,
        accion,
        descripcion,
        fecha: new Date().toISOString()
    }]);
    
    if (error) {
        console.error("Error saving audit log:", error);
    }
    
    console.log(`[AUDIT] ${new Date().toISOString()} - ${usuario.nombre} (${accion}) @ ${modulo}: ${descripcion}`);
}

export async function getLogs() {
    const supabase = createClient();
    const { data, error } = await supabase.from('auditoria').select('*').order('fecha', { ascending: false }).limit(100);
    if (error) throw error;
    return data;
}
