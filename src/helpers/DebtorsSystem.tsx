import { ClienteDetalle, ReporteTipoCliente, TipoCliente, TotalesTipo } from "../interfaces/deptors.interface";
import { DebtorsCredit } from "./DebtorsCredit";

export class DebtorsSystem {
    private clientes: Map<TipoCliente, Map<string, DebtorsCredit>> = new Map();

    constructor() {
        // Inicializar mapas para cada tipo de cliente
        Object.values(TipoCliente).forEach(tipo => {
            this.clientes.set(tipo, new Map());
        });
    }

    // 👥 GESTIÓN DE CLIENTES
    agregarCliente(nombre: string, tipoCliente: TipoCliente, limiteCredito: number = 5000): string {
        const clientesTipo = this.clientes.get(tipoCliente);
        if (!clientesTipo) {
            return `❌ Tipo de cliente inválido`;
        }

        if (clientesTipo.has(nombre)) {
            return `⚠️ Cliente "${nombre}" ya existe en ${tipoCliente}`;
        }

        clientesTipo.set(nombre, new DebtorsCredit(nombre, tipoCliente, limiteCredito));
        return `✅ Cliente "${nombre}" agregado a ${tipoCliente}`;
    }

    obtenerCliente(nombre: string): { cliente: DebtorsCredit, tipo: TipoCliente } | null {
        for (const [tipoCliente, clientes] of this.clientes.entries()) {
            const cliente = clientes.get(nombre);
            if (cliente) {
                return { cliente, tipo: tipoCliente };
            }
        }
        return null;
    }

    obtenerClientesPorTipo(tipoCliente: TipoCliente): Map<string, DebtorsCredit> {
        return this.clientes.get(tipoCliente) || new Map();
    }

    // 📊 REPORTES POR TIPO DE CLIENTE
    generarReportesPorTipo(año: number, mes: number): Map<TipoCliente, ReporteTipoCliente> {
        const reportes = new Map<TipoCliente, ReporteTipoCliente>();

        for (const [tipoCliente, clientes] of this.clientes.entries()) {
            if (clientes.size > 0) {
                const reporte = this.generarReporteTipoCliente(tipoCliente, clientes, año, mes);
                reportes.set(tipoCliente, reporte);
            }
        }

        return reportes;
    }

    private generarReporteTipoCliente(
        tipoCliente: TipoCliente, 
        clientes: Map<string, DebtorsCredit>, 
        año: number, 
        mes: number
    ): ReporteTipoCliente {
        const clientesDetalle: ClienteDetalle[] = [];
        const resumenCategorias: Record<string, number> = {};
        let totalAdeudo = 0;
        let totalConsumos = 0;
        let totalAbonos = 0;

        for (const [nombre, cliente] of clientes.entries()) {
            const estado = cliente.calcularEstadoMensual(año, mes);
            const dashboard = cliente.generarDashboard(año, mes);

            // Datos del cliente
            const detalle: ClienteDetalle = {
                nombre,
                saldoInicial: estado.saldoInicioMes,
                consumosMes: estado.totalConsumosMes,
                abonosMes: estado.totalAbonosMes,
                saldoFinal: estado.saldoFinMes,
                diferencia: estado.diferencia,
                estado: estado.estado,
                alertas: dashboard.alertas,
                consumosPorCategoria: dashboard.analisisCategorias,
                consumosPorMascota: dashboard.analisisMascotas
            };

            clientesDetalle.push(detalle);

            // Acumular totales
            totalAdeudo += estado.saldoFinMes;
            totalConsumos += estado.totalConsumosMes;
            totalAbonos += estado.totalAbonosMes;

            // Acumular categorías
            Object.entries(dashboard.analisisCategorias).forEach(([categoria, monto]) => {
                resumenCategorias[categoria] = (resumenCategorias[categoria] || 0) + monto;
            });
        }

        const totales: TotalesTipo = {
            totalAdeudo,
            totalConsumos,
            totalAbonos
        };

        return {
            tipoCliente: tipoCliente.toString(),
            periodo: `${mes.toString().padStart(2, '0')}/${año}`,
            fechaExportacion: new Date().toLocaleString('es-MX'),
            totalClientes: clientes.size,
            clientesDetalle,
            resumenCategorias,
            totales
        };
    }

    // 📈 MÉTRICAS GLOBALES
    obtenerMetricasGlobales(año: number, mes: number) {
        const reportes = this.generarReportesPorTipo(año, mes);
        const metricas = {
            totalClientes: 0,
            totalAdeudo: 0,
            totalConsumos: 0,
            totalAbonos: 0,
            porTipo: {} as Record<string, any>
        };

        for (const [tipoCliente, reporte] of reportes.entries()) {
            metricas.porTipo[tipoCliente] = {
                totalClientes: reporte.totalClientes,
                totalAdeudo: reporte.totales.totalAdeudo,
                totalConsumos: reporte.totales.totalConsumos,
                totalAbonos: reporte.totales.totalAbonos
            };

            metricas.totalClientes += reporte.totalClientes;
            metricas.totalAdeudo += reporte.totales.totalAdeudo;
            metricas.totalConsumos += reporte.totales.totalConsumos;
            metricas.totalAbonos += reporte.totales.totalAbonos;
        }

        return metricas;
    }
}