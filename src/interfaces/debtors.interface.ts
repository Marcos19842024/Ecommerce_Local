export interface Cliente {
  id: string;
  nombre: string;
  tipoCliente: string;
  limiteCredito: number;
  saldoActual: number;
  estado: string;
  etiqueta?: string;
}

export interface MetricasGlobales {
  totalClientes: number;
  clientesActivos: number;
  clientesMorosos: number;
  carteraTotal: number;
  carteraVencida: number;
}

export interface ExcelRow {
  id: string;
  fechaAlbaran: string;
  clienteNombre: string;
  totalImporte: number;
  cobradoLinea: number;
  deuda: number;
  paciente: string;
  etiqueta?: string;
  [key: string]: any;
}

export interface ResumenEtiquetas {
  [key: string]: number;
}

export interface ClienteComparativa extends Cliente {
  deudaAnterior?: number;
  variacion?: number;
  porcentajeVariacion?: number;
  periodoActual?: string;
}

export interface DeudaPorFecha {
  fecha: string;
  deudaDia: number;
  acumulado: number;
  registros: Array<{
    monto: number;
    descripcion: string;
    tipo: string;
  }>;
}

export interface ClienteDetallado extends ClienteComparativa {
  historial: DeudaPorFecha[];
  totalDeuda: number;
  filasExcel: ExcelRow[];
}

export interface ResumenComparativo {
  periodoActual: string;
  periodoAnterior: string;
  totalDeudaActual: number;
  totalDeudaAnterior: number;
  totalVariacion: number;
  totalPorcentajeVariacion: number;
}

export interface ComparativaCliente {
  clienteId: string;
  clienteNombre: string;
  deudaActual: number;
  deudaAnterior: number;
  variacion: number;
  porcentajeVariacion: number;
  registros: any[];
}