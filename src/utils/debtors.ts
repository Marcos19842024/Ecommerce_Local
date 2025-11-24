export const coloresEtiquetas: { [key: string]: { bg: string; text: string } } = {
    'Cliente Recepción': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'Cliente Administración': { bg: 'bg-green-100', text: 'text-green-800' },
    'Colaborador': { bg: 'bg-purple-100', text: 'text-purple-800' },
    'Revisar': { bg: 'bg-yellow-300', text: 'text-yellow-800' },
};

export const columnPatterns = {
    fechaAlbaran: ['fecha', 'albaran', 'fecha_albaran', 'fecha albarán', 'date', 'fecha de albarán'],
    clienteNombre: ['cliente', 'nombre', 'cliente_nombre', 'cliente nombre', 'empresa', 'client', 'name'],
    totalImporte: ['total', 'importe', 'total_importe', 'monto', 'valor', 'precio', 'amount', 'total amount'],
    cobradoLinea: ['cobrado', 'pagado', 'cobrado_linea', 'cobrado lineas', 'abonado', 'paid', 'collected'],
    deuda: ['deuda', 'saldo', 'pendiente', 'adeudo', 'restante', 'debt', 'balance', 'pending'],
    paciente: ['paciente', 'pacientes', 'cliente_final', 'beneficiario', 'patient', 'beneficiary']
};

export const totalPatterns = [
    'total', 'totales', 'suma', 'sumatoria', 'gran total', 'general total',
    'subtotal', 'resumen', 'conclusión', 'final'
];