import { ReporteTipoCliente } from "../interfaces/deptors.interface";

export const exportarACSV = (reporte: ReporteTipoCliente): string => {
    let csv = `Reporte ${reporte.tipoCliente} - ${reporte.periodo}\n`;
    csv += `Fecha de exportación: ${reporte.fechaExportacion}\n\n`;
  
    // Resumen general
    csv += "RESUMEN GENERAL\n";
    csv += `Total Clientes,${reporte.totalClientes}\n`;
    csv += `Total Adeudo,$${reporte.totales.totalAdeudo.toFixed(2)}\n`;
    csv += `Total Consumos,$${reporte.totales.totalConsumos.toFixed(2)}\n`;
    csv += `Total Abonos,$${reporte.totales.totalAbonos.toFixed(2)}\n\n`;
    
    // Detalle por cliente
    csv += "DETALLE POR CLIENTE\n";
    csv += "Cliente,Saldo Inicial,Consumos Mes,Abonos Mes,Saldo Final,Diferencia,Estado\n";
    
    reporte.clientesDetalle.forEach(cliente => {
        csv += `${cliente.nombre},$${cliente.saldoInicial.toFixed(2)},$${cliente.consumosMes.toFixed(2)},$${cliente.abonosMes.toFixed(2)},$${cliente.saldoFinal.toFixed(2)},$${cliente.diferencia.toFixed(2)},${cliente.estado}\n`;
    });
    
    csv += "\n";
    
    // Consumo por categorías
    csv += "CONSUMO POR CATEGORÍAS\n";
    csv += "Categoría,Total\n";
    Object.entries(reporte.resumenCategorias).forEach(([categoria, total]) => {
        csv += `${categoria},$${total.toFixed(2)}\n`;
    });
    
    return csv;
};

export const descargarCSV = (contenido: string, nombreArchivo: string) => {
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', nombreArchivo);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};