export enum TipoCliente {
  RECEPCION = "Recepción",
  ADMINISTRACION = "Administración",
  COLABORADOR = "Colaborador"
}

export interface Movimiento {
  fecha: Date;
  tipo: 'CONSUMO' | 'ABONO';
  concepto: string;
  categoria: string;
  mascota?: string;
  monto: number;
}

export interface EstadoMensual {
  cliente: string;
  tipoCliente: TipoCliente;
  mes: string;
  saldoInicioMes: number;
  totalConsumosMes: number;
  totalAbonosMes: number;
  saldoFinMes: number;
  diferencia: number;
  estado: 'MEJORÓ' | 'EMPEORÓ';
  movimientos: Movimiento[];
}

export interface DashboardCliente {
  resumenFinanciero: EstadoMensual;
  analisisCategorias: Record<string, number>;
  analisisMascotas: Record<string, number>;
  alertas: string[];
  progresoMeta?: ProgresoMeta;
  recomendaciones: string[];
}

export interface ProgresoMeta {
  meta: number;
  abonado: number;
  progreso: number;
  cumplio: boolean;
}

export interface ReporteTipoCliente {
  tipoCliente: string;
  periodo: string;
  fechaExportacion: string;
  totalClientes: number;
  clientesDetalle: ClienteDetalle[];
  resumenCategorias: Record<string, number>;
  totales: TotalesTipo;
}

export interface ClienteDetalle {
  nombre: string;
  saldoInicial: number;
  consumosMes: number;
  abonosMes: number;
  saldoFinal: number;
  diferencia: number;
  estado: string;
  alertas: string[];
  consumosPorCategoria: Record<string, number>;
  consumosPorMascota: Record<string, number>;
}

export interface TotalesTipo {
  totalAdeudo: number;
  totalConsumos: number;
  totalAbonos: number;
}