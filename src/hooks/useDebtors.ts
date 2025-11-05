// hooks/useDebtors.ts
import { useState, useCallback, useEffect } from 'react';
import { TipoCliente } from '../interfaces/deptors.interface';
import { DebtorsSystem } from '../helpers/DebtorsSystem';
import { CategoriaType } from '../utils/debtors';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

export const useDebtors = () => {
    const [sistema] = useState(() => new DebtorsSystem());
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [conectado, setConectado] = useState<boolean>(true);

    // Verificar conectividad y cargar datos
    useEffect(() => {
        const inicializarSistema = async () => {
            try {
                setCargando(true);
                
                // Verificar conectividad usando tu apiService
                const estaConectado = await apiService.checkConnectivity();
                setConectado(estaConectado);
                
                if (estaConectado) {
                    try {
                        // Cargar clientes desde backend usando los nuevos métodos
                        const clientesBackend = await apiService.getDebtorsClientes();
                        
                        // Cargar clientes al sistema local
                        for (const clienteBackend of clientesBackend) {
                            const clienteExistente = sistema.obtenerCliente(clienteBackend.nombre);
                            if (!clienteExistente) {
                                // Agregar cliente al sistema
                                sistema.agregarCliente(
                                    clienteBackend.nombre, 
                                    clienteBackend.tipoCliente, 
                                    clienteBackend.limiteCredito
                                );
                            }
                        }
                        setError(null);
                    } catch (err) {
                        toast.error(`No se pudieron cargar clientes del backend, continuando en modo local: ${err}`);
                        setConectado(false);
                    }
                } else {
                    setError('⚠️ Modo sin conexión. Los datos no se guardarán en el servidor.');
                }
            } catch (err) {
                toast.error(`Error inicializando sistema: ${err}`);
                setError('❌ Error al inicializar el sistema');
                setConectado(false);
            } finally {
                setCargando(false);
            }
        };

        inicializarSistema();
    }, [sistema]);

    const agregarCliente = useCallback(async (
        nombre: string, 
        tipoCliente: TipoCliente, 
        limiteCredito: number = 5000
    ) => {
        try {
            if (conectado) {
                // Agregar al backend usando los nuevos métodos
                await apiService.createDebtorsCliente({
                    nombre,
                    tipoCliente,
                    limiteCredito
                });
            }
            
            // Luego agregar localmente
            return sistema.agregarCliente(nombre, tipoCliente, limiteCredito);
        } catch (err) {
            const mensajeError = `❌ Error al agregar cliente: ${err}`;
            setError(mensajeError);
            return mensajeError;
        }
    }, [sistema, conectado]);

    const obtenerCliente = useCallback((nombre: string) => {
        return sistema.obtenerCliente(nombre);
    }, [sistema]);

    const generarReportes = useCallback((año: number, mes: number) => {
        return sistema.generarReportesPorTipo(año, mes);
    }, [sistema]);

    const obtenerMetricas = useCallback((año: number, mes: number) => {
        return sistema.obtenerMetricasGlobales(año, mes);
    }, [sistema]);

    const registrarMovimiento = useCallback(async (
        nombreCliente: string,
        tipo: 'CONSUMO' | 'ABONO',
        monto: number,
        concepto?: string,
        categoria?: CategoriaType,
        mascota?: string
    ) => {
        try {
            const cliente = sistema.obtenerCliente(nombreCliente);
            if (!cliente) {
                return '❌ Cliente no encontrado';
            }

            let resultado: string;

            if (tipo === 'CONSUMO') {
                if (!concepto || !categoria) {
                    return '❌ Concepto y categoría son requeridos para consumos';
                }
                resultado = await cliente.cliente.registrarConsumo(monto, concepto, categoria, mascota);
            } else {
                resultado = await cliente.cliente.registrarAbono(monto);
            }

            return resultado;
        } catch (err) {
            return `❌ Error registrando movimiento: ${err}`;
        }
    }, [sistema]);

    const sincronizarDatos = useCallback(async () => {
        try {
            setCargando(true);
            const estaConectado = await apiService.checkConnectivity();
            setConectado(estaConectado);
            
            if (estaConectado) {
                // Recargar clientes desde backend
                await apiService.getDebtorsClientes();
                
                // Por simplicidad, recargamos la página para obtener datos frescos
                window.location.reload();
            } else {
                setError('⚠️ No hay conexión con el servidor');
            }
        } catch (err) {
            setError(`❌ Error sincronizando datos: ${err}`);
        } finally {
            setCargando(false);
        }
    }, []);

    return {
        agregarCliente,
        obtenerCliente,
        generarReportes,
        obtenerMetricas,
        registrarMovimiento,
        sincronizarDatos,
        obtenerClientesPorTipo: sistema.obtenerClientesPorTipo.bind(sistema),
        cargando,
        error,
        conectado
    };
};