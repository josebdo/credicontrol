export function openWhatsApp(telefono: string, mensaje: string) {
    // Limpiar el teléfono de caracteres no numéricos
    const telLimpio = telefono.replace(/\D/g, "");
    if (!telLimpio) return;

    const url = `https://wa.me/${telLimpio}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}

export function formatReminderMessage(nombre: string, monto: string, fecha: string, empresa: string) {
    return `Hola ${nombre}, le recordamos que su cuota de ${monto} en ${empresa} vence el día ${fecha}. Quedamos atentos a su pago. ¡Feliz día!`;
}
