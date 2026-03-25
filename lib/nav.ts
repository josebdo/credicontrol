export type SubItem = { label: string; href: string };
export type NavItem = { id: string; label: string; icon: string; href?: string; children?: SubItem[] };

export const NAV_ITEMS: NavItem[] = [
  { id: "panel", label: "Panel", icon: "🏠", href: "/dashboard" },
  { id: "buscar", label: "Buscar Cliente", icon: "🔍", href: "/dashboard/buscar-cliente" },
  { id: "cliente", label: "Clientes", icon: "👤", href: "/dashboard/clientes" },
  {
    id: "prestamo", label: "Préstamos", icon: "💰",
    children: [
      { label: "Nuevo préstamo", href: "/dashboard/prestamos/nuevo" },
      { label: "Reenganche", href: "/dashboard/prestamos/reenganche" },
      { label: "Ver préstamos", href: "/dashboard/prestamos" },
      { label: "Editar préstamo", href: "/dashboard/prestamos/editar" },
      { label: "Eliminar préstamo", href: "/dashboard/prestamos/eliminar" },
    ],
  },
  {
    id: "pagos", label: "Pagos", icon: "💳",
    children: [
      { label: "Registrar pago", href: "/dashboard/pagos/nuevo" },
      { label: "Pago extraordinario", href: "/dashboard/pagos/extraordinario" },
      { label: "Recibo", href: "/dashboard/pagos/recibo" },
      { label: "Plan de pagos", href: "/dashboard/pagos/plan" },
      { label: "Eliminar pago", href: "/dashboard/pagos/eliminar" },
      { label: "Historial de pagos", href: "/dashboard/pagos/historial" },
    ],
  },
  {
    id: "reportes", label: "Reportes", icon: "📊",
    children: [
      { label: "Pagos por préstamos", href: "/dashboard/reportes/pagos-prestamos" },
      { label: "Historial préstamos", href: "/dashboard/reportes/historial" },
      { label: "Estado de cuenta", href: "/dashboard/reportes/estado-cuenta" },
      { label: "Incobrables", href: "/dashboard/reportes/incobrables" },
      { label: "Ingresos y egresos", href: "/dashboard/reportes/ingresos-egresos" },
      { label: "Cuadre diario", href: "/dashboard/reportes/cuadre-diario" },
      { label: "Flujo de caja", href: "/dashboard/reportes/flujo-caja" },
    ],
  },
  {
    id: "garantias", label: "Garantías", icon: "🛡️",
    children: [
      { label: "Registrar garantía", href: "/dashboard/garantias/nueva" },
      { label: "Ver garantías", href: "/dashboard/garantias" },
      { label: "Pagaré notarial", href: "/dashboard/garantias/pagare" },
      { label: "Bienes", href: "/dashboard/garantias/bienes" },
    ],
  },
  {
    id: "documentos", label: "Documentos", icon: "📁",
    children: [
      { label: "Pagaré notarial", href: "/dashboard/documentos/pagare-notarial" },
      { label: "Pagaré con garantía", href: "/dashboard/documentos/pagare-garantia" },
      { label: "Debo y Pagaré", href: "/dashboard/documentos/debo-pagare" },
      { label: "Carta de saldo", href: "/dashboard/documentos/carta-saldo" },
      { label: "Intimidación", href: "/dashboard/documentos/intimidacion" },
      { label: "Entrega voluntaria", href: "/dashboard/documentos/entrega-voluntaria" },
    ],
  },
  {
    id: "finanzas", label: "Finanzas", icon: "💵",
    children: [
      { label: "Gastos", href: "/dashboard/finanzas/gastos" },
      { label: "Cuentas bancarias", href: "/dashboard/finanzas/bancos" },
      { label: "Efectivo", href: "/dashboard/finanzas/efectivo" },
      { label: "Flujo de caja", href: "/dashboard/finanzas/flujo-caja" },
      { label: "Cuadre de caja", href: "/dashboard/finanzas/cuadre-caja" },
      { label: "Cierre de caja", href: "/dashboard/finanzas/cierre-caja" },
    ],
  },
  {
    id: "agenda", label: "Agenda de Cobro", icon: "📅",
    children: [
      { label: "Cobros del día", href: "/dashboard/agenda/hoy" },
      { label: "Cobros de la semana", href: "/dashboard/agenda/semana" },
      { label: "Cobros del mes", href: "/dashboard/agenda/mes" },
      { label: "Ruta de cobros", href: "/dashboard/agenda/ruta" },
    ],
  },
  {
    id: "whatsapp", label: "WhatsApp", icon: "💬",
    children: [
      { label: "Conectar WhatsApp", href: "/dashboard/whatsapp/conectar" },
      { label: "Mensajes", href: "/dashboard/whatsapp/mensajes" },
      { label: "Plantillas", href: "/dashboard/whatsapp/plantillas" },
      { label: "Historial", href: "/dashboard/whatsapp/historial" },
    ],
  },
  {
    id: "contabilidad", label: "Contabilidad", icon: "🧮",
    children: [
      { label: "Gastos", href: "/dashboard/contabilidad/gastos" },
      { label: "Cuadre general", href: "/dashboard/contabilidad/cuadre-general" },
      { label: "Cuadre pago", href: "/dashboard/contabilidad/cuadre-pago" },
      { label: "Cuadre ruta", href: "/dashboard/contabilidad/cuadre-ruta" },
      { label: "Calculadora de cuota", href: "/dashboard/contabilidad/calculadora" },
    ],
  },
  { id: "empleados", label: "Empleados", icon: "👥", href: "/dashboard/empleados" },
  {
    id: "configuracion", label: "Configuración", icon: "⚙️",
    children: [
      { label: "General", href: "/dashboard/configuracion" },
      { label: "Roles y Permisos", href: "/dashboard/configuracion/roles" },
    ],
  },
];
