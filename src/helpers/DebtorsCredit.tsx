import toast from "react-hot-toast";
import { DashboardCliente, EstadoMensual, Movimiento, ProgresoMeta, TipoCliente } from "../interfaces/deptors.interface";
import { apiService } from "../services/api";
import { CATEGORIAS, CategoriaType } from "../utils/debtors";

export class DebtorsCredit {
    private movimientos: Movimiento[] = [];
    private mascotas: Map<string, string> = new Map();
    private saldoInicial: number = 0;
    private metaPagoMensual?: number;
    private clienteId?: string;

    constructor(
        public cliente: string,
        public tipoCliente: TipoCliente,
        public limiteCredito: number = 5000
    ) {}

    // 🔧 MÉTODOS BÁSICOS
    async agregarMascota(nombre: string, especie: string): Promise<string> {
        if (this.mascotas.has(nombre)) {
            return `⚠️ Mascota '${nombre}' ya existe`;
        }

        try {
            if (this.clienteId) {
                await apiService.addDebtorsMascota(this.clienteId, { nombre, especie });
            }
            
            this.mascotas.set(nombre, especie);
            return `✅ Mascota '${nombre}' (${especie}) agregada`;
        } catch (error) {
            toast.error(`Error al agregar mascota en backend, continuando localmente: ${error}`);
            this.mascotas.set(nombre, especie);
            return `✅ Mascota '${nombre}' (${especie}) agregada (solo local)`;
        }
    }

    async registrarConsumo(
        monto: number, 
        concepto: string, 
        categoria: CategoriaType, 
        mascota?: string, 
        fecha: Date = new Date()
    ): Promise<string> {
        // Validar categoría
        if (!CATEGORIAS[categoria]) {
            const categoriasValidas = Object.keys(CATEGORIAS).join(', ');
            return `❌ Categoría inválida. Use: ${categoriasValidas}`;
        }

        // Validar límite de crédito
        const saldoActual = this.obtenerSaldoActual();
        if (saldoActual + monto > this.limiteCredito) {
            const excedente = (saldoActual + monto) - this.limiteCredito;
            return `🚫 LÍMITE EXCEDIDO: Falta abonar $${excedente.toFixed(2)}`;
        }

        try {
            // Registrar en backend si hay clienteId
            if (this.clienteId) {
                await apiService.addDebtorsMovimiento(this.clienteId, {
                    fecha: fecha.toISOString(),
                    tipo: 'CONSUMO',
                    concepto,
                    categoria,
                    mascota,
                    monto
                });
            }

            const movimiento: Movimiento = {
                fecha,
                tipo: 'CONSUMO',
                concepto,
                categoria,
                mascota,
                monto
            };

            this.movimientos.push(movimiento);
            return `✅ Consumo registrado: $${monto.toFixed(2)} - ${concepto}`;
        } catch (error) {
            toast.error(`Error al registrar consumo en backend, continuando localmente: ${error}`);
            
            // Registrar localmente aunque falle el backend
            const movimiento: Movimiento = {
                fecha,
                tipo: 'CONSUMO',
                concepto,
                categoria,
                mascota,
                monto
            };

            this.movimientos.push(movimiento);
            return `✅ Consumo registrado localmente: $${monto.toFixed(2)} - ${concepto}`;
        }
    }

    async registrarAbono(monto: number, fecha: Date = new Date()): Promise<string> {
        try {
            // Registrar en backend si hay clienteId
            if (this.clienteId) {
                await apiService.addDebtorsMovimiento(this.clienteId, {
                    fecha: fecha.toISOString(),
                    tipo: 'ABONO',
                    concepto: 'Pago a cuenta',
                    categoria: 'PAGO',
                    monto: monto
                });
            }

            const movimiento: Movimiento = {
                fecha,
                tipo: 'ABONO',
                concepto: 'Pago a cuenta',
                categoria: 'PAGO',
                monto: -monto
            };

            this.movimientos.push(movimiento);
            return `✅ Abono registrado: $${monto.toFixed(2)}`;
        } catch (error) {
            toast.error(`Error al registrar abono en backend, continuando localmente: ${error}`);
            
            // Registrar localmente aunque falle el backend
            const movimiento: Movimiento = {
                fecha,
                tipo: 'ABONO',
                concepto: 'Pago a cuenta',
                categoria: 'PAGO',
                monto: -monto
            };

            this.movimientos.push(movimiento);
            return `✅ Abono registrado localmente: $${monto.toFixed(2)}`;
        }
    }

    // 📊 CÁLCULOS Y ESTADOS
    obtenerSaldoHasta(fecha: Date): number {
        let saldo = this.saldoInicial;
        this.movimientos.forEach(mov => {
            if (mov.fecha <= fecha) {
                saldo += mov.monto;
            }
        });
        return saldo;
    }

    obtenerSaldoActual(): number {
        return this.obtenerSaldoHasta(new Date());
    }

    calcularEstadoMensual(año: number, mes: number): EstadoMensual {
        const inicioMes = new Date(año, mes - 1, 1);
        //const finMes = new Date(año, mes, 0);
        
        const saldoInicioMes = this.obtenerSaldoHasta(new Date(inicioMes.getTime() - 1));
        
        const movimientosMes = this.movimientos.filter(mov => {
            const movDate = new Date(mov.fecha);
            return movDate.getFullYear() === año && movDate.getMonth() + 1 === mes;
        });

        const totalConsumos = movimientosMes
        .filter(mov => mov.tipo === 'CONSUMO')
        .reduce((sum, mov) => sum + mov.monto, 0);

        const totalAbonos = movimientosMes
        .filter(mov => mov.tipo === 'ABONO')
        .reduce((sum, mov) => sum + Math.abs(mov.monto), 0);

        const saldoFinMes = saldoInicioMes + totalConsumos - totalAbonos;
        const diferencia = totalAbonos - totalConsumos;

        return {
            cliente: this.cliente,
            tipoCliente: this.tipoCliente,
            mes: `${mes.toString().padStart(2, '0')}/${año}`,
            saldoInicioMes,
            totalConsumosMes: totalConsumos,
            totalAbonosMes: totalAbonos,
            saldoFinMes,
            diferencia,
            estado: diferencia > 0 ? 'MEJORÓ' : 'EMPEORÓ',
            movimientos: movimientosMes.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
        };
    }

    // 📈 ANALÍTICAS
    private analizarConsumosPorCategoria(año: number, mes: number): Record<string, number> {
        const categorias: Record<string, number> = {};
        
        this.movimientos.forEach(mov => {
            const movDate = new Date(mov.fecha);
            if (movDate.getFullYear() === año && movDate.getMonth() + 1 === mes && mov.tipo === 'CONSUMO') {
                const categoria = mov.categoria;
                categorias[categoria] = (categorias[categoria] || 0) + mov.monto;
            }
        });
        
        return categorias;
    }

    private analizarConsumosPorMascota(año: number, mes: number): Record<string, number> {
        const mascotas: Record<string, number> = {};
        
        this.movimientos.forEach(mov => {
            const movDate = new Date(mov.fecha);
            if (movDate.getFullYear() === año && movDate.getMonth() + 1 === mes && mov.tipo === 'CONSUMO') {
                const mascota = mov.mascota || 'No especificada';
                mascotas[mascota] = (mascotas[mascota] || 0) + mov.monto;
            }
        });
        
        return mascotas;
    }

    // 🚨 ALERTAS
    verificarAlertas(): string[] {
        const alertas: string[] = [];
        const saldoActual = this.obtenerSaldoActual();

        // Alerta por límite de crédito (80%)
        if (saldoActual > this.limiteCredito * 0.8) {
            const porcentaje = (saldoActual / this.limiteCredito) * 100;
            alertas.push(`⚠️ Crédito al ${porcentaje.toFixed(1)}% del límite`);
        }

        // Alerta por saldo alto
        if (saldoActual > 3000) {
            alertas.push(`💰 Saldo elevado: $${saldoActual.toFixed(2)}`);
        }

        return alertas;
    }

    // 🎯 METAS DE PAGO
    establecerMetaPago(meta: number): void {
        this.metaPagoMensual = meta;
    }

    progresoMetaPago(año: number, mes: number): ProgresoMeta | undefined {
        if (!this.metaPagoMensual) return undefined;

        const estado = this.calcularEstadoMensual(año, mes);
        const progreso = (estado.totalAbonosMes / this.metaPagoMensual) * 100;

        return {
            meta: this.metaPagoMensual,
            abonado: estado.totalAbonosMes,
            progreso: Math.min(progreso, 100),
            cumplio: estado.totalAbonosMes >= this.metaPagoMensual
        };
    }

    // 📊 DASHBOARD COMPLETO
    generarDashboard(año: number, mes: number): DashboardCliente {
        const estado = this.calcularEstadoMensual(año, mes);
        const analisisCategorias = this.analizarConsumosPorCategoria(año, mes);
        const analisisMascotas = this.analizarConsumosPorMascota(año, mes);
        const alertas = this.verificarAlertas();
        const progresoMeta = this.progresoMetaPago(año, mes);

        return {
            resumenFinanciero: estado,
            analisisCategorias,
            analisisMascotas,
            alertas,
            progresoMeta,
            recomendaciones: this.generarRecomendaciones(estado)
        };
    }

    private generarRecomendaciones(estado: EstadoMensual): string[] {
        const recomendaciones: string[] = [];

        if (estado.diferencia < 0) {
            const deficit = -estado.diferencia;
            recomendaciones.push(`💡 Recomendación: Abonar $${deficit.toFixed(2)} para equilibrar cuenta`);
        }

        if (estado.saldoFinMes > estado.saldoInicioMes) {
            recomendaciones.push("🎯 Sugerencia: Incrementar abonos mensuales");
        }

        if (estado.totalConsumosMes > estado.totalAbonosMes * 1.5) {
            recomendaciones.push("📈 Consumo muy alto: Considerar revisar gastos");
        }

        return recomendaciones;
    }

    // 📤 EXPORTACIÓN DE DATOS
    obtenerDatosExportacion(año: number, mes: number) {
        const dashboard = this.generarDashboard(año, mes);
        
        return {
            cliente: this.cliente,
            tipoCliente: this.tipoCliente,
            limiteCredito: this.limiteCredito,
            ...dashboard,
            mascotas: Object.fromEntries(this.mascotas),
            movimientos: this.movimientos
        };
    }

    // 🆕 MÉTODO PARA ESTABLECER ID DEL BACKEND
    setClienteId(id: string): void {
        this.clienteId = id;
    }

    // 🆕 MÉTODO PARA CARGAR MOVIMIENTOS DESDE BACKEND
    async cargarMovimientosDesdeBackend(): Promise<void> {
        if (!this.clienteId) return;

        try {
            const movimientosBackend = await apiService.getDebtorsMovimientos(this.clienteId);
            
            // Convertir movimientos del backend al formato local
            this.movimientos = movimientosBackend.map((mov: any) => ({
                fecha: new Date(mov.fecha),
                tipo: mov.tipo,
                concepto: mov.concepto,
                categoria: mov.categoria as CategoriaType,
                mascota: mov.mascota,
                monto: mov.tipo === 'ABONO' ? -mov.monto : mov.monto
            }));
        } catch (error) {
            toast.error(`Error cargando movimientos desde backend: ${error}`);
        }
    }
}