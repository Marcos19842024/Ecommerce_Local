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