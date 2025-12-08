import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/api';
import { coloresEtiquetas, columnPatterns, totalPatterns } from '../../utils/debtors';
import { ClienteComparativa, ExcelRow, MetricasGlobales } from '../../interfaces/debtors.interface';
import readXlsxFile from 'read-excel-file';
import toast from 'react-hot-toast';
import Modal from '../shared/Modal';

export const DebtorsMain: React.FC = () => {
    const [clientes, setClientes] = useState<ClienteComparativa[]>([]);
    const [excelData, setExcelData] = useState<ExcelRow[]>([]);
    const [metricas, setMetricas] = useState<MetricasGlobales | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'Clientes' | 'Excel'>('Clientes');
    const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
    const [selectedExcelRows, setSelectedExcelRows] = useState<string[]>([]);
    const [showDetalleCliente, setShowDetalleCliente] = useState(false);
    const [clienteDetallado, setClienteDetallado] = useState<any>(null);
    const [showEtiquetarModal, setShowEtiquetarModal] = useState(false);
    const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState('');
    const [filasCliente, setFilasCliente] = useState<ExcelRow[]>([]);
    const [modalDesdeExcel, setModalDesdeExcel] = useState(false);
    const [showFiltros, setShowFiltros] = useState(false);
    const [filtroTendencia, setFiltroTendencia] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroEtiqueta, setFiltroEtiqueta] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [clienteToDelete, setClienteToDelete] = useState<ClienteComparativa | null>(null);
    const [tipoPeriodo, setTipoPeriodo] = useState<'dia' | 'semana' | 'mes'>('mes');
    const [comparativaPorPeriodo, setComparativaPorPeriodo] = useState<any[]>([]);
    const [resumenComparativa, setResumenComparativa] = useState<any>(null);
    const [filtroEstadoComparativa, setFiltroEstadoComparativa] = useState('');
    const [filtroTieneAnteriores, setFiltroTieneAnteriores] = useState('');

    /**
     * Obtener todos los días de una semana específica
     */
    const obtenerDiasDeSemana = (semanaISO: string): string[] => {
        // Formato: 2025-W49
        const [year, week] = semanaISO.split('-W').map(Number);
        const dates: string[] = [];
        
        // Encontrar el primer día (lunes) de la semana ISO
        const firstDay = new Date(year, 0, 1 + (week - 1) * 7);
        while (firstDay.getDay() !== 1) {
            firstDay.setDate(firstDay.getDate() - 1);
        }
        
        // Agregar los 7 días de la semana
        for (let i = 0; i < 7; i++) {
            const date = new Date(firstDay);
            date.setDate(firstDay.getDate() + i);
            dates.push(date.toISOString().split('T')[0]); // Formato YYYY-MM-DD
        }
        
        return dates;
    };

    /**
     * Obtener todos los días de un mes específico
     */
    const obtenerDiasDeMes = (mes: string): string[] => {
        // Formato: 2025-12
        const [year, month] = mes.split('-').map(Number);
        const dates: string[] = [];
        
        const lastDay = new Date(year, month, 0).getDate(); // Último día del mes
        
        for (let day = 1; day <= lastDay; day++) {
            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            dates.push(dateStr);
        }
        
        return dates;
    };

    /**
     * Agrupar datos diarios por cliente
     */
    const agruparDatosPorCliente = (datosDiarios: any[]): any[] => {
        const mapaClientes = new Map();
        
        datosDiarios.forEach((dia: any) => {
            if (Array.isArray(dia.datos) && dia.datos.length > 0) {
                dia.datos.forEach((registro: any) => {
                    const clienteId = registro?.clienteId || registro?.clienteNombre;
                    if (!clienteId) return;
                    
                    if (!mapaClientes.has(clienteId)) {
                        mapaClientes.set(clienteId, {
                            clienteId,
                            clienteNombre: registro?.clienteNombre || 'Cliente',
                            deudaTotal: 0,
                            registros: [],
                            fechas: new Set()
                        });
                    }
                    
                    const cliente = mapaClientes.get(clienteId);
                    const deuda = registro?.deudaTotal || registro?.deuda || 0;
                    
                    cliente.deudaTotal += deuda;
                    cliente.registros.push({
                        ...registro,
                        fecha: dia.periodo
                    });
                    cliente.fechas.add(dia.periodo);
                });
            }
        });
        
        // Convertir a array
        return Array.from(mapaClientes.values()).map(cliente => ({
            ...cliente,
            fechas: Array.from(cliente.fechas),
            totalDias: cliente.fechas.size
        }));
    };

    // Función helper para mapear clientes
    const mapearCliente = useCallback((cliente: any): ClienteComparativa => {
        return {
            id: cliente._id || cliente.id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            nombre: cliente.nombre || '',
            tipoCliente: cliente.tipoCliente || 'regular',
            limiteCredito: cliente.limiteCredito || 0,
            saldoActual: cliente.saldoActual || 0,
            estado: cliente.estado || 'activo',
            etiqueta: cliente.etiqueta || '',
            variacion: cliente.variacion || 0,
            deudaAnterior: cliente.deudaAnterior || 0,
            porcentajeVariacion: cliente.porcentajeVariacion || 0
        };
    }, []);

    // Cargar datos iniciales
    useEffect(() => {
        loadInitialData();
    }, []);

    // Cargar comparativa cuando cambia el tipo de período
    useEffect(() => {
        const loadComparativa = async () => {
            if (!loading) {
                await cargarComparativaExcel(tipoPeriodo);
            }
        };
        
        loadComparativa();
    }, [tipoPeriodo]);

    // Limpiar selecciones cuando cambian los filtros
    useEffect(() => {
        setSelectedClientes([]);
    }, [filtroTendencia, filtroEstado, filtroEtiqueta]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            
            // Cargar comparativa primero
            await cargarComparativaExcel(tipoPeriodo);
            
            // También puedes cargar la lista completa de clientes si la necesitas
            const clientesData = await apiService.getDebtorsClientes();
            const clientesMapeados = clientesData.map(mapearCliente);
            
            // No sobreescribir los clientes de la comparativa
            setClientes(clientesMapeados);
            
            // Cargar métricas si las necesitas
            const metricasData = await apiService.getDebtorsMetricas();
            setMetricas(metricasData);
            
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            toast.error('Error al cargar los datos: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Limpiar selecciones cuando cambian los filtros
    useEffect(() => {
        setSelectedClientes([]);
    }, [filtroTendencia, filtroEstado, filtroEtiqueta]);

    // Función para cargar comparativa por período
    const cargarComparativaPorPeriodo = async (tipo: 'dia' | 'semana' | 'mes') => {
        try {
            if (loading) return;
            
            console.log(`🔄 Cargando comparativa para tipo: ${tipo}`);
            setLoading(true);
            
            // Obtener períodos
            const fechaActual = new Date();
            const fechaAnterior = new Date();
            
            switch (tipo) {
                case 'dia':
                    fechaAnterior.setDate(fechaAnterior.getDate() - 1);
                    break;
                case 'semana':
                    fechaAnterior.setDate(fechaAnterior.getDate() - 7);
                    break;
                case 'mes':
                    fechaAnterior.setMonth(fechaAnterior.getMonth() - 1);
                    break;
            }
            
            const periodoActual = obtenerPeriodo(tipo, fechaActual);
            const periodoAnterior = obtenerPeriodo(tipo, fechaAnterior);
            
            console.log(`📅 Comparando: ${periodoActual} vs ${periodoAnterior}`);
            
            setTipoPeriodo(tipo);
            
            let datosActual: any[] = [];
            let datosAnterior: any[] = [];
            
            // Estrategia diferente según el tipo
            if (tipo === 'dia') {
                // Para días, usar el endpoint normal
                const [respuestaActual, respuestaAnterior] = await Promise.all([
                    apiService.getDeudasPorPeriodo(periodoActual, tipo),
                    apiService.getDeudasPorPeriodo(periodoAnterior, tipo)
                ]);
                
                datosActual = Array.isArray(respuestaActual?.datos) ? respuestaActual.datos : [];
                datosAnterior = Array.isArray(respuestaAnterior?.datos) ? respuestaAnterior.datos : [];
                
            } else {
                // Para semanas o meses, obtener todos los días y agrupar
                console.log(`📊 Obteniendo datos diarios para ${tipo === 'semana' ? 'semana' : 'mes'}...`);
                
                // Obtener todos los días del período actual
                const diasPeriodoActual = tipo === 'semana' 
                    ? obtenerDiasDeSemana(periodoActual)
                    : obtenerDiasDeMes(periodoActual);
                
                // Obtener todos los días del período anterior
                const diasPeriodoAnterior = tipo === 'semana'
                    ? obtenerDiasDeSemana(periodoAnterior)
                    : obtenerDiasDeMes(periodoAnterior);
                
                console.log(`📅 Días a obtener: Actual=${diasPeriodoActual.length}, Anterior=${diasPeriodoAnterior.length}`);
                
                // Obtener datos para todos los días del período actual
                const promesasActual = diasPeriodoActual.map(dia => 
                    apiService.getDeudasPorPeriodo(dia, 'dia')
                        .then(respuesta => ({
                            periodo: dia,
                            datos: Array.isArray(respuesta?.datos) ? respuesta.datos : [],
                            success: respuesta?.success || false
                        }))
                        .catch(error => {
                            console.warn(`Error obteniendo datos para ${dia}:`, error);
                            return { periodo: dia, datos: [], success: false };
                        })
                );
                
                // Obtener datos para todos los días del período anterior
                const promesasAnterior = diasPeriodoAnterior.map(dia => 
                    apiService.getDeudasPorPeriodo(dia, 'dia')
                        .then(respuesta => ({
                            periodo: dia,
                            datos: Array.isArray(respuesta?.datos) ? respuesta.datos : [],
                            success: respuesta?.success || false
                        }))
                        .catch(error => {
                            console.warn(`Error obteniendo datos para ${dia}:`, error);
                            return { periodo: dia, datos: [], success: false };
                        })
                );
                
                // Ejecutar todas las promesas
                const [resultadosActual, resultadosAnterior] = await Promise.all([
                    Promise.all(promesasActual),
                    Promise.all(promesasAnterior)
                ]);
                
                console.log(`✅ Datos diarios obtenidos: Actual=${resultadosActual.length}, Anterior=${resultadosAnterior.length}`);
                
                // Agrupar datos por cliente
                datosActual = agruparDatosPorCliente(resultadosActual);
                datosAnterior = agruparDatosPorCliente(resultadosAnterior);
                
                console.log(`📊 Datos agrupados: Actual=${datosActual.length} clientes, Anterior=${datosAnterior.length} clientes`);
            }
            
            console.log('📊 Datos finales:', {
                actual: { count: datosActual.length, sample: datosActual.slice(0, 2) },
                anterior: { count: datosAnterior.length, sample: datosAnterior.slice(0, 2) }
            });
            
            // Calcular resumen comparativo
            const calcularTotalDeuda = (datos: any[]): number => {
                return datos.reduce((sum: number, item: any) => {
                    const deuda = item?.deudaTotal || item?.deuda || item?.saldo || item?.total || 0;
                    return sum + deuda;
                }, 0);
            };
            
            const totalDeudaActual = calcularTotalDeuda(datosActual);
            const totalDeudaAnterior = calcularTotalDeuda(datosAnterior);
            const totalVariacion = totalDeudaActual - totalDeudaAnterior;
            const totalPorcentajeVariacion = totalDeudaAnterior > 0 
                ? (totalVariacion / totalDeudaAnterior) * 100 
                : (totalVariacion > 0 ? 100 : 0);
            
            const resumen = {
                periodoActual,
                periodoAnterior,
                totalDeudaActual,
                totalDeudaAnterior,
                totalVariacion,
                totalPorcentajeVariacion,
                totalClientesActual: datosActual.length,
                totalClientesAnterior: datosAnterior.length,
                totalRegistrosActual: datosActual.reduce((sum, item) => sum + (item?.registros?.length || 0), 0),
                totalRegistrosAnterior: datosAnterior.reduce((sum, item) => sum + (item?.registros?.length || 0), 0),
                usandoAgrupacion: tipo !== 'dia'
            };
            
            console.log('📈 Resumen comparativo:', resumen);
            
            // Crear comparativa detallada por cliente
            let comparativaDetallada: any[] = [];
            
            if (datosActual.length > 0) {
                // Crear mapa para búsqueda rápida de datos anteriores
                const mapaAnterior = new Map();
                datosAnterior.forEach((item: any) => {
                    const clave = item?.clienteId || item?.clienteNombre;
                    if (clave) {
                        mapaAnterior.set(clave, item);
                    }
                });
                
                comparativaDetallada = datosActual.map((actual: any) => {
                    const claveActual = actual?.clienteId || actual?.clienteNombre;
                    const clienteNombre = actual?.clienteNombre || 'Cliente';
                    const anterior = mapaAnterior.get(claveActual);
                    
                    const deudaActual = actual?.deudaTotal || actual?.deuda || actual?.saldo || actual?.total || 0;
                    const deudaAnterior = anterior 
                        ? (anterior?.deudaTotal || anterior?.deuda || anterior?.saldo || anterior?.total || 0)
                        : 0;
                    
                    const variacion = deudaActual - deudaAnterior;
                    const porcentajeVariacion = deudaAnterior > 0 
                        ? (variacion / deudaAnterior) * 100 
                        : (variacion > 0 ? 100 : 0);
                    
                    return {
                        clienteId: claveActual,
                        clienteNombre,
                        deudaActual,
                        deudaAnterior,
                        variacion,
                        porcentajeVariacion,
                        tieneDatosAnteriores: !!anterior,
                        totalDias: actual?.totalDias || 1,
                        totalRegistros: actual?.registros?.length || 0
                    };
                });
                
                console.log(`📋 Comparativa creada: ${comparativaDetallada.length} clientes`);
            }
            
            setComparativaPorPeriodo(comparativaDetallada);
            setResumenComparativa(resumen);
            
            // Actualizar clientes con datos de comparativa
            if (comparativaDetallada.length > 0 && clientes.length > 0) {
                console.log('👥 Actualizando clientes con datos de comparativa...');
                
                const clientesActualizados = clientes.map(cliente => {
                    // Buscar datos de comparativa para este cliente
                    const datosComparativa = comparativaDetallada.find((c: any) => {
                        if (!c.clienteNombre || !cliente.nombre) return false;
                        
                        const nombreCliente = cliente.nombre.toLowerCase();
                        const nombreComparativa = c.clienteNombre.toLowerCase();
                        
                        // Coincidencia exacta
                        if (nombreCliente === nombreComparativa) return true;
                        
                        // Coincidencia parcial (contiene)
                        if (nombreCliente.includes(nombreComparativa) || 
                            nombreComparativa.includes(nombreCliente)) {
                            return true;
                        }
                        
                        return false;
                    });
                    
                    if (datosComparativa) {
                        return {
                            ...cliente,
                            saldoActual: datosComparativa.deudaActual,
                            deudaAnterior: datosComparativa.deudaAnterior,
                            variacion: datosComparativa.variacion,
                            porcentajeVariacion: datosComparativa.porcentajeVariacion,
                            tieneComparativa: true
                        };
                    }
                    
                    return {
                        ...cliente,
                        tieneComparativa: false
                    };
                });
                
                setClientes(clientesActualizados);
                
                const clientesConComparativa = clientesActualizados.filter(c => c.tieneComparativa).length;
                console.log(`✅ ${clientesConComparativa} de ${clientesActualizados.length} clientes actualizados`);
                
            } else {
                console.warn('⚠️ No se pudieron actualizar clientes');
            }
            
            // Mostrar notificación informativa
            if (resumen.usandoAgrupacion) {
                toast.success(`📊 Comparativa ${tipo} calculada a partir de datos diarios`);
            } else if (datosActual.length > 0 && datosAnterior.length > 0) {
                toast.success(`✅ Comparativa diaria cargada`);
            } else if (datosActual.length > 0) {
                toast.error(`📈 Datos actuales cargados (sin datos anteriores)`);
            } else {
                toast.error('⚠️ No hay datos disponibles');
            }
            
        } catch (error: unknown) {
            console.error('❌ Error en cargarComparativaPorPeriodo:', error);
            toast.error('Error al cargar comparativa');
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener el período en formato YYYY-MM-DD
    const obtenerPeriodo = (tipo: 'dia' | 'semana' | 'mes', fechaEspecifica?: Date): string => {
        const fecha = fechaEspecifica || new Date();
        
        // Siempre devolver fecha en formato YYYY-MM-DD para buscar Excel
        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const day = fecha.getDate().toString().padStart(2, '0');
        
        return `(${tipo}) ${year}-${month}-${day}`;
    };
    
    // Función para manejar la subida de archivos Excel
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.match(/\.(xlsx|xls)$/)) {
            toast.error('Por favor, sube un archivo Excel válido (.xlsx o .xls)');
            return;
        }

        setIsUploading(true);

        try {
            const rows = await readXlsxFile(file);

            if (rows.length === 0) {
                toast.error('El archivo Excel está vacío');
                return;
            }

            const headers = rows[0] as string[];
            const autoMapping = autoDetectColumns(headers);
            const processedData: ExcelRow[] = [];

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
            
                if (isTotalRow(row)) {
                    continue;
                }

                const rowData: ExcelRow = {
                    id: `excel-${i}-${Date.now()}`,
                    fechaAlbaran: '',
                    clienteNombre: '',
                    totalImporte: 0,
                    cobradoLinea: 0,
                    deuda: 0,
                    paciente: '',
                    etiqueta: ''
                };

                Object.entries(autoMapping).forEach(([targetCol, sourceCol]) => {
                    const sourceIndex = headers.indexOf(sourceCol);
                    if (sourceIndex !== -1 && row[sourceIndex] !== undefined) {
                        const value = row[sourceIndex];
                
                        if (targetCol === 'totalImporte' || targetCol === 'cobradoLinea' || targetCol === 'deuda') {
                            rowData[targetCol] = typeof value === 'number' ? value : 
                            typeof value === 'string' ? parseFloat(value.toString().replace(',', '.')) || 0 : 0;
                        } else if (targetCol === 'fechaAlbaran') {
                            rowData[targetCol] = formatDateExcel(value?.toString() || '');
                        } else {
                            rowData[targetCol] = value?.toString() || '';
                        }
                    }
                });

                if (rowData.clienteNombre || rowData.totalImporte > 0) {
                    processedData.push(rowData);
                }
            }

            // Sincronizar etiquetas del cliente al Excel
            const excelDataConEtiquetas = sincronizarEtiquetasAlExcel(processedData);
            setExcelData(excelDataConEtiquetas);

            if (processedData.length === 0) {
                toast.error('No se encontraron datos válidos en el archivo Excel');
            } else {
                setActiveTab('Excel');
                toast.success(`Excel cargado - ${excelDataConEtiquetas.length} registros procesados`);
            }

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            toast.error(`Error al procesar el archivo Excel: ${errorMessage}`);
        } finally {
            setIsUploading(false);
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    // Función para subir solo clientes nuevos
    const handleSubirClientes = async () => {
        try {
            setIsUploading(true);
            
            const nombresClientesExistentes = new Set(clientes.map(cliente => 
                cliente.nombre.toLowerCase().trim()
            ));
            
            const clientesNuevos = excelData
                .filter(row => {
                    const nombreCliente = row.clienteNombre?.toLowerCase().trim();
                    return nombreCliente && 
                        nombreCliente !== '' && 
                        !nombresClientesExistentes.has(nombreCliente);
                })
                .map(row => ({
                    id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    nombre: row.clienteNombre || '',
                    tipoCliente: 'regular',
                    limiteCredito: 0,
                    saldoActual: row.deuda || 0,
                    estado: row.deuda > 0 ? 'moroso' : 'activo',
                    etiqueta: row.etiqueta || ''
                }));

            if (clientesNuevos.length === 0) {
                toast.error('No hay clientes nuevos para subir (todos los clientes del Excel ya existen)');
                return;
            }

            const resultados = [];
            for (const cliente of clientesNuevos) {
                try {
                    const resultado = await apiService.createDebtorsCliente({
                        nombre: cliente.nombre,
                        tipoCliente: cliente.tipoCliente,
                        limiteCredito: cliente.limiteCredito,
                        saldoActual: cliente.saldoActual,
                        estado: cliente.estado,
                        etiqueta: cliente.etiqueta
                    });
                    resultados.push(resultado);
                } catch (error: unknown) {
                    toast.error(`Error subiendo cliente ${cliente.nombre}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }

            toast.success(`Se subieron ${resultados.filter(r => !r.error).length} de ${clientesNuevos.length} clientes nuevos correctamente`);
            await loadInitialData();
            
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(`Error al subir clientes: ${errorMessage}`);
        } finally {
            setIsUploading(false);
        }
    };

    const loadInitialDataWithRetry = async (retries = 3, delay = 1000) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await loadInitialData();
                return;
            } catch (error: unknown) {
                if (attempt === retries) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            }
        }
    };

    // Función principal para cargar comparativa de Excel
    const cargarComparativaExcel = async (tipo: 'dia' | 'semana' | 'mes') => {
        try {
            if (loading) return;
            
            setLoading(true);
            
            // Obtener fechas según el tipo
            const fechaActual = new Date();
            const fechaAnterior = new Date();
            
            switch (tipo) {
                case 'dia':
                    fechaAnterior.setDate(fechaAnterior.getDate() - 1);
                    break;
                case 'semana':
                    fechaAnterior.setDate(fechaAnterior.getDate() - 7);
                    break;
                case 'mes':
                    fechaAnterior.setMonth(fechaAnterior.getMonth() - 1);
                    break;
            }
            
            const fechaActualStr = fechaActual.toISOString().split('T')[0];
            const fechaAnteriorStr = fechaAnterior.toISOString().split('T')[0];
            
            console.log(`📅 Comparando: ${fechaActualStr} vs ${fechaAnteriorStr}`);
            
            // Usar el nuevo endpoint
            const comparativa = await apiService.getComparativaExcel(fechaActualStr, fechaAnteriorStr);
            
            if (comparativa.success) {
                // Transformar datos para la tabla
                const clientesComparativa = comparativa.comparativa.map((item: any) => ({
                    id: item.clienteId || `comp-${item.clienteNombre}`,
                    nombre: item.clienteNombre,
                    tipoCliente: 'cliente',
                    limiteCredito: 0,
                    saldoActual: item.deudaActual,
                    estado: item.estado === 'liquidado' ? 'liquidado' : 
                        item.deudaActual > 0 ? 'activo' : 'inactivo',
                    etiqueta: '',
                    variacion: item.variacion,
                    deudaAnterior: item.deudaAnterior,
                    porcentajeVariacion: item.porcentajeVariacion,
                    estadoComparativa: item.estado,
                    tieneRegistrosAnteriores: item.tieneRegistrosAnteriores
                }));
                
                setClientes(clientesComparativa);
                setResumenComparativa(comparativa.resumen);
                
                toast.success(`Comparativa: ${fechaActualStr} vs ${fechaAnteriorStr}`);
            } else {
                toast.error('Error al cargar comparativa');
            }
            
        } catch (error) {
            console.error('Error cargando comparativa:', error);
            toast.error('Error al cargar comparativa');
        } finally {
            setLoading(false);
        }
    };

    // Función unificada para procesar Excel y comparativa
    const handleProcesarExcelYComparativa = async () => {
        try {
            if (excelData.length === 0) {
                toast.error('No hay datos de Excel para procesar');
                return;
            }

            setIsUploading(true);

            const datosParaEnviar = excelData.map(row => {
                const parseNumber = (value: any): number => {
                    if (typeof value === 'number') return value;
                    if (typeof value === 'string') {
                        const cleaned = value.toString().replace(/[^\d.,-]/g, '');
                        const parsed = parseFloat(cleaned.replace(',', '.'));
                        return isNaN(parsed) ? 0 : parsed;
                    }
                    return 0;
                };

                return {
                    fechaAlbaran: row.fechaAlbaran || '',
                    clienteNombre: row.clienteNombre?.toString() || '',
                    totalImporte: parseNumber(row.totalImporte),
                    cobradoLinea: parseNumber(row.cobradoLinea),
                    deuda: parseNumber(row.deuda),
                    paciente: row.paciente?.toString() || '',
                    etiqueta: row.etiqueta?.toString() || ''
                };
            });
            
            const periodo = obtenerPeriodo(tipoPeriodo);
            
            const resultado = await apiService.procesarExcelComparativa(datosParaEnviar, periodo, tipoPeriodo);
            
            if (resultado.success) {
                let mensajeExito = `✅ ${resultado.message}`;
                
                if (resultado.estadisticas) {
                    mensajeExito += `\n📊 ${resultado.estadisticas.registrosExcelGuardados} registros procesados`;
                    
                    if (resultado.estadisticas.clientesNuevos) {
                        mensajeExito += `\n👥 ${resultado.estadisticas.clientesNuevos} clientes nuevos agregados`;
                    }
                    
                    if (resultado.estadisticas.clientesActualizados) {
                        mensajeExito += `\n🔄 ${resultado.estadisticas.clientesActualizados} clientes actualizados`;
                    }
                }
                
                toast.success(mensajeExito);
                
                await loadInitialDataWithRetry();
                await cargarComparativaPorPeriodo(tipoPeriodo);
                
                setActiveTab('Clientes');
                
            } else {
                toast.error(`❌ ${resultado.error}`);
            }
            
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            toast.error('Error al procesar Excel: ' + errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    // Búsqueda de clientes
    const handleSearchCliente = async (nombre: string) => {
        if (!nombre.trim()) {
            await loadInitialData();
            return;
        }

        try {
            const resultado = await apiService.searchDebtorsClientes(nombre);
            
            if (resultado && resultado.length > 0) {
                const clientesMapeados = resultado.map(mapearCliente);
                setClientes(clientesMapeados);
            } else {
                const clientesFiltrados = clientes.filter(cliente => 
                    cliente.nombre.toLowerCase().includes(nombre.toLowerCase())
                );

                if (clientesFiltrados.length === 0) {
                    setClientes(clientes);
                } else {
                    setClientes(clientesFiltrados);
                }
            }
        } catch (err: unknown) {
            const clientesFiltrados = clientes.filter(cliente => 
                cliente.nombre.toLowerCase().includes(nombre.toLowerCase())
            );
            
            if (clientesFiltrados.length === 0) {
                setClientes(clientes);
            } else {
                setClientes(clientesFiltrados);
            }
        }
    };

    // Función para eliminar cliente
    const handleDeleteCliente = async (cliente: ClienteComparativa) => {
        try {
            if (cliente.id.startsWith('temp-')) {
                setClientes(prev => prev.filter(c => c.id !== cliente.id));
                toast.success('Cliente eliminado localmente');
                return;
            }

            const idParaEliminar = cliente.id;
            
            if (!idParaEliminar || idParaEliminar.startsWith('temp-')) {
                setClientes(prev => prev.filter(c => c.id !== cliente.id));
                toast.success('Cliente eliminado localmente');
                return;
            }
            
            await apiService.deleteDebtorsCliente(idParaEliminar);
            
            setClientes(prev => prev.filter(c => c.id !== cliente.id));
            
            toast.success(`Cliente "${cliente.nombre}" eliminado correctamente`);
            
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            
            if (errorMessage.includes('404') || errorMessage.includes('not found') || errorMessage.includes('no encontrado')) {
                setClientes(prev => prev.filter(c => c.id !== cliente.id));
                toast.success('Cliente eliminado localmente (no encontrado en servidor)');
            } else {
                toast.error(`Error al eliminar cliente: ${errorMessage}`);
            }
        } finally {
            setShowDeleteModal(false);
            setClienteToDelete(null);
        }
    };

    // Función para abrir el modal de confirmación
    const handleConfirmDelete = (cliente: ClienteComparativa) => {
        setClienteToDelete(cliente);
        setShowDeleteModal(true);
    };

    // Función para descargar comparativa
    const handleDescargarComparativa = async () => {
        try {
            const loadingToast = toast.loading('Generando comparativa...');
            
            const comparativaData = {
                clientes: clientes,
                periodo: obtenerPeriodo(tipoPeriodo),
                metricas: metricas,
                fechaGeneracion: new Date().toISOString(),
                totalClientes: clientes.length,
                totalDeuda: clientes.reduce((sum, c) => sum + c.saldoActual, 0),
                clientesConDeuda: clientes.filter(c => c.saldoActual > 0).length,
                resumenComparativa: resumenComparativa,
                comparativaPorPeriodo: comparativaPorPeriodo
            };
            
            const dataStr = JSON.stringify(comparativaData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `comparativa-deudores-${obtenerPeriodo(tipoPeriodo)}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast.dismiss(loadingToast);
            toast.success('Comparativa exportada correctamente');
        } catch (error: unknown) {
            toast.error('Error al exportar comparativa: ' + error);
        }
    };

    // Calcular resumen de etiquetas con total de deuda
    const calcularResumenEtiquetas = (): { resumen: Record<string, number>, deudaPorEtiqueta: Record<string, number> } => {
        const resumen: Record<string, number> = {};
        const deudaPorEtiqueta: Record<string, number> = {};
        
        if (activeTab === 'Clientes') {
            clientes.forEach(cliente => {
                const etiqueta = cliente.etiqueta || 'Sin etiqueta';
                resumen[etiqueta] = (resumen[etiqueta] || 0) + 1;
                deudaPorEtiqueta[etiqueta] = (deudaPorEtiqueta[etiqueta] || 0) + cliente.saldoActual;
            });
        } else {
            excelData.forEach(fila => {
                const etiqueta = fila.etiqueta || 'Sin etiqueta';
                resumen[etiqueta] = (resumen[etiqueta] || 0) + 1;
                deudaPorEtiqueta[etiqueta] = (deudaPorEtiqueta[etiqueta] || 0) + fila.deuda;
            });
        }
        
        return { resumen, deudaPorEtiqueta };
    };

    // Calcular clientes nuevos
    const calcularClientesNuevos = () => {
        if (excelData.length === 0) return 0;
        
        const nombresClientesExistentes = new Set(clientes.map(cliente => 
            cliente.nombre.toLowerCase().trim()
        ));
        
        const nombresExcel = new Set(
            excelData
                .map(row => row.clienteNombre?.toLowerCase().trim())
                .filter(nombre => nombre && nombre !== '')
        );
        
        let clientesNuevos = 0;
        nombresExcel.forEach(nombre => {
            if (!nombresClientesExistentes.has(nombre)) {
                clientesNuevos++;
            }
        });
        
        return clientesNuevos;
    };

    // Función para descargar PDF
    const handleDescargarPDF = () => {
        toast.success('Funcionalidad de descarga PDF en desarrollo');
    };

    // Función para obtener todas las filas de Excel de un cliente
    const obtenerFilasCliente = (nombreCliente: string): ExcelRow[] => {
        return excelData.filter(row => 
            row.clienteNombre.toLowerCase().includes(nombreCliente.toLowerCase())
        );
    };

    // Función para cargar TODOS los datos de un cliente
    const cargarDetallesCliente = async (cliente: ClienteComparativa) => {
        try {
            // Obtener el historial completo del cliente
            const historial = await apiService.getHistorialCliente(
                cliente.id, 
                '2025-01-01', // Fecha inicial
                new Date().toISOString().split('T')[0] // Fecha actual
            ).catch(() => []); // Si falla, usar array vacío
            
            // También obtener las filas del Excel actual
            const filasDelCliente = obtenerFilasCliente(cliente.nombre);
            
            // Si hay filas en Excel, sincronizar etiquetas
            if (filasDelCliente.length > 0) {
                const filasActualizadas = sincronizarEtiquetasIndividuales(filasDelCliente, cliente);
                if (filasActualizadas.length > 0) {
                    // Actualizar las filas en el estado global de Excel
                    setExcelData(prev => 
                        prev.map(row => {
                            const filaActualizada = filasActualizadas.find(f => f.id === row.id);
                            return filaActualizada || row;
                        })
                    );
                }
            }
            
            // Calcular totales de las filas del cliente
            const totalesFilasCliente = {
                totalImporte: filasDelCliente.reduce((sum, row) => sum + row.totalImporte, 0),
                totalCobrado: filasDelCliente.reduce((sum, row) => sum + row.cobradoLinea, 0),
                totalDeuda: filasDelCliente.reduce((sum, row) => sum + row.deuda, 0)
            };
            
            // Calcular deudas por fecha
            const deudasPorFecha = historial.reduce((acc: any, deuda: any) => {
                const fechaStr = new Date(deuda.fecha).toISOString().split('T')[0];
                if (!acc[fechaStr]) {
                    acc[fechaStr] = {
                        fecha: fechaStr,
                        deudaDia: 0,
                        registros: []
                    };
                }
                
                acc[fechaStr].deudaDia += deuda.monto;
                acc[fechaStr].registros.push({
                    monto: deuda.monto,
                    descripcion: deuda.descripcion || 'Sin descripción',
                    tipo: deuda.tipo || 'deuda'
                });
                
                return acc;
            }, {});
            
            // Convertir a array y ordenar por fecha
            const deudasPorFechaArray = Object.values(deudasPorFecha)
                .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
            
            // Calcular acumulado
            let acumulado = 0;
            const deudasConAcumulado = deudasPorFechaArray.map((item: any) => {
                acumulado += item.deudaDia;
                return {
                    ...item,
                    acumulado
                };
            });
            
            setFilasCliente(filasDelCliente);
            
            // Configurar el cliente detallado con etiqueta sincronizada
            setClienteDetallado({
                ...cliente,
                historial: deudasConAcumulado,
                totalDeuda: acumulado,
                filasExcel: filasDelCliente,
                totalesFilas: totalesFilasCliente,
                etiqueta: cliente.etiqueta || obtenerEtiquetaDesdeExcel(filasDelCliente)
            });
            
            setModalDesdeExcel(false);
            setShowDetalleCliente(true);
            
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            toast.error('No se pudieron cargar detalles completos: ' + errorMessage);
            
            // Fallback: usar solo las filas del Excel
            const filasDelCliente = obtenerFilasCliente(cliente.nombre);
            
            // Calcular totales de las filas del cliente
            const totalesFilasCliente = {
                totalImporte: filasDelCliente.reduce((sum, row) => sum + row.totalImporte, 0),
                totalCobrado: filasDelCliente.reduce((sum, row) => sum + row.cobradoLinea, 0),
                totalDeuda: filasDelCliente.reduce((sum, row) => sum + row.deuda, 0)
            };
            
            setFilasCliente(filasDelCliente);
            
            setClienteDetallado({
                ...cliente,
                historial: [],
                totalDeuda: cliente.saldoActual,
                filasExcel: filasDelCliente,
                totalesFilas: totalesFilasCliente,
                etiqueta: cliente.etiqueta || obtenerEtiquetaDesdeExcel(filasDelCliente)
            });
            
            setModalDesdeExcel(false);
            setShowDetalleCliente(true);
        }
    };

    // Sincronizar etiquetas de filas individuales
    const sincronizarEtiquetasIndividuales = (filas: ExcelRow[], cliente: ClienteComparativa): ExcelRow[] => {
        return filas.map(fila => {
            // Si el cliente tiene etiqueta y la fila no, aplicar la etiqueta del cliente
            if (cliente.etiqueta && (!fila.etiqueta || fila.etiqueta === '')) {
                return {
                    ...fila,
                    etiqueta: cliente.etiqueta
                };
            }
            return fila;
        });
    };

    // Función para sincronizar etiquetas de clientes al Excel
    const sincronizarEtiquetasAlExcel = (excelDataParam: ExcelRow[] = excelData): ExcelRow[] => {
        const mapaClientes = new Map(
            clientes.map(cliente => [cliente.nombre.toLowerCase().trim(), cliente])
        );

        let etiquetasSincronizadas = 0;

        const excelDataActualizado = excelDataParam.map(row => {
            const nombreCliente = row.clienteNombre?.toLowerCase().trim();
            if (!nombreCliente || nombreCliente === '') return row;

            const clienteExistente = mapaClientes.get(nombreCliente);
            
            if (clienteExistente && clienteExistente.etiqueta) {
                // Solo actualizar si la fila no tiene etiqueta o si es diferente
                if (!row.etiqueta || row.etiqueta !== clienteExistente.etiqueta) {
                    etiquetasSincronizadas++;
                    return {
                        ...row,
                        etiqueta: clienteExistente.etiqueta
                    };
                }
            }
            
            return row;
        });

        if (etiquetasSincronizadas > 0) {
            toast.success(`${etiquetasSincronizadas} etiqueta(s) sincronizada(s) desde clientes existentes`);
            
            // Actualizar el estado global si estamos procesando el Excel actual
            if (excelDataParam === excelData) {
                setExcelData(excelDataActualizado);
            }
        }

        return excelDataActualizado;
    };

    // Nueva función para sincronizar todas las etiquetas
    const handleSincronizarTodasEtiquetas = async () => {
        try {
            setIsUploading(true);
            
            // Sincronizar etiquetas del Excel con clientes
            const excelActualizado = sincronizarEtiquetasAlExcel();
            
            if (excelActualizado !== excelData) {
                setExcelData(excelActualizado);
            }
            
            // También sincronizar clientes que no tengan etiqueta pero sus filas en Excel sí
            const clientesActualizados = clientes.map(cliente => {
                const filasDelCliente = excelActualizado.filter(row => 
                    row.clienteNombre?.toLowerCase().trim() === cliente.nombre.toLowerCase().trim()
                );
                
                const etiquetasEnFilas = filasDelCliente
                    .map(f => f.etiqueta)
                    .filter((etiqueta): etiqueta is string => Boolean(etiqueta && etiqueta.trim() !== ''));
                
                // Si el cliente no tiene etiqueta pero sus filas en Excel sí, usar la más común
                if (!cliente.etiqueta && etiquetasEnFilas.length > 0) {
                    // Encontrar la etiqueta más común
                    const conteoEtiquetas: Record<string, number> = {};
                    etiquetasEnFilas.forEach(etiqueta => {
                        // `etiqueta` es ahora garantizado como string por el type guard anterior
                        conteoEtiquetas[etiqueta] = (conteoEtiquetas[etiqueta] || 0) + 1;
                    });
                    
                    const etiquetaMasComun = Object.entries(conteoEtiquetas)
                        .sort((a, b) => b[1] - a[1])[0][0];
                    
                    return {
                        ...cliente,
                        etiqueta: etiquetaMasComun
                    };
                }
                
                return cliente;
            });
            
            // Actualizar clientes si hubo cambios
            const clientesConCambios = clientesActualizados.filter((cliente, index) => 
                cliente.etiqueta !== clientes[index].etiqueta
            );
            
            if (clientesConCambios.length > 0) {
                setClientes(clientesActualizados);
                
                // Actualizar en el backend
                for (const cliente of clientesConCambios) {
                    try {
                        await apiService.updateDebtorsCliente(cliente.id, {
                            etiqueta: cliente.etiqueta
                        });
                    } catch (error: unknown) {
                        toast.error(`Error actualizando cliente ${cliente.nombre}: ${error instanceof Error ? error.message : String(error)}`);
                    }
                }
                
                toast.success(`${clientesConCambios.length} cliente(s) actualizado(s) con etiquetas desde Excel`);
            }
            
            toast.success('Etiquetas sincronizadas correctamente entre clientes y Excel');
            
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error('Error al sincronizar etiquetas: ' + errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    // Función para obtener etiqueta desde Excel si el cliente no tiene
    const obtenerEtiquetaDesdeExcel = (filas: ExcelRow[]): string => {
        if (filas.length === 0) return '';
        
        // Buscar la primera etiqueta no vacía en las filas
        const filaConEtiqueta = filas.find(fila => fila.etiqueta && fila.etiqueta.trim() !== '');
        return filaConEtiqueta?.etiqueta ?? '';
    };

    // Función para obtener el color de una etiqueta
    const getColorEtiqueta = (etiqueta: string) => {
        return coloresEtiquetas[etiqueta] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    };

    // Función para formatear fechas (Excel serial o ISO)
    const formatDateExcel = (dateString: string): string => {
        if (!dateString || dateString.trim() === '') return '-';
        
        try {
            if (!isNaN(Number(dateString))) {
                const excelDate = parseInt(dateString);
                const date = new Date((excelDate - 25569) * 86400 * 1000);
                if (isNaN(date.getTime())) {
                    return dateString;
                }
                const day = date.getDate().toString().padStart(2, '0');
                const month = date.toLocaleString('es-ES', { month: 'short' }).toLowerCase();
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            } else {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) {
                    return dateString;
                }
                const day = date.getDate().toString().padStart(2, '0');
                const month = date.toLocaleString('es-ES', { month: 'short' }).toLowerCase();
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
        } catch (error) {
            return dateString;
        }
    };

    // Función para formatear fechas para display
    const formatDateForDisplay = (dateString: string): string => {
        if (!dateString || dateString.trim() === '') return '-';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString('es-ES', { month: 'short' }).toLowerCase();
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch {
            return dateString;
        }
    };

    // Filtrar clientes
    const clientesFiltrados = clientes.filter(cliente => {
        if (filtroTendencia && cliente.variacion !== undefined) {
            if (filtroTendencia === 'aumento' && cliente.variacion <= 0) return false;
            if (filtroTendencia === 'disminucion' && cliente.variacion >= 0) return false;
            if (filtroTendencia === 'estable' && cliente.variacion !== 0) return false;
        }
        if (filtroEstado && cliente.estado !== filtroEstado) return false;
        if (filtroEtiqueta) {
            if (filtroEtiqueta === 'Sin etiqueta' && cliente.etiqueta) return false;
            if (filtroEtiqueta !== 'Sin etiqueta' && cliente.etiqueta !== filtroEtiqueta) return false;
        }
        return true;
    });

    // Limpiar filtros
    const limpiarFiltros = () => {
        setFiltroTendencia('');
        setFiltroEstado('');
        setFiltroEtiqueta('');
    };

    // Manejar doble click en cliente (desde tab Clientes)
    const handleDoubleClickCliente = async (cliente: ClienteComparativa) => {
        await cargarDetallesCliente(cliente);
    };

    // Manejar doble click en fila de Excel (desde tab Excel)
    const handleDoubleClickExcel = async (row: ExcelRow) => {
        const filasDelMismoCliente = obtenerFilasCliente(row.clienteNombre);
        
        // Buscar si el cliente ya existe
        const clienteExistente = clientes.find(c => 
            c.nombre.toLowerCase() === row.clienteNombre.toLowerCase()
        );
        
        if (clienteExistente) {
            await cargarDetallesCliente(clienteExistente);
        } else {
            // Para clientes que solo existen en Excel
            const totalesFilasCliente = {
                totalImporte: filasDelMismoCliente.reduce((sum, f) => sum + f.totalImporte, 0),
                totalCobrado: filasDelMismoCliente.reduce((sum, f) => sum + f.cobradoLinea, 0),
                totalDeuda: filasDelMismoCliente.reduce((sum, f) => sum + f.deuda, 0)
            };
            
            // Obtener etiqueta común de las filas
            const etiquetasEnFilas = filasDelMismoCliente
                .map(f => f.etiqueta)
                .filter(etiqueta => etiqueta && etiqueta.trim() !== '');
            const etiquetaComun = etiquetasEnFilas.length > 0 ? etiquetasEnFilas[0] : '';
            
            setFilasCliente(filasDelMismoCliente);
            
            setClienteDetallado({
                id: `temp-${row.clienteNombre}`,
                nombre: row.clienteNombre,
                tipoCliente: 'No especificado',
                limiteCredito: 0,
                saldoActual: totalesFilasCliente.totalDeuda,
                estado: totalesFilasCliente.totalDeuda > 0 ? 'moroso' : 'activo',
                etiqueta: etiquetaComun,
                historial: [],
                totalDeuda: totalesFilasCliente.totalDeuda,
                filasExcel: filasDelMismoCliente,
                totalesFilas: totalesFilasCliente
            });
            
            setModalDesdeExcel(true);
            setShowDetalleCliente(true);
        }
    };

    // Etiquetar cliente desde el modal de detalles
    const handleEtiquetarClienteDesdeModal = async () => {
        if (!clienteDetallado || !etiquetaSeleccionada) {
            toast.error('Selecciona una etiqueta');
            return;
        }

        try {
            if (modalDesdeExcel) {
                // Para filas de Excel: etiquetar todas las filas del cliente
                const clienteNombre = clienteDetallado.nombre.toLowerCase();
                const nuevasFilas = excelData.map(row => {
                    if (row.clienteNombre.toLowerCase() === clienteNombre) {
                        return {
                            ...row,
                            etiqueta: etiquetaSeleccionada
                        };
                    }
                    return row;
                });
                
                setExcelData(nuevasFilas);
                
                // También actualizar filasCliente para el modal
                const filasActualizadas = filasCliente.map(fila => ({
                    ...fila,
                    etiqueta: etiquetaSeleccionada
                }));
                setFilasCliente(filasActualizadas);
                
                toast.success(`${filasCliente.length} registro(s) etiquetado(s) como ${etiquetaSeleccionada}`);
            } else {
                // Para cliente existente: actualizar en la lista y backend
                const clienteActualizado = {
                    ...clienteDetallado,
                    etiqueta: etiquetaSeleccionada
                };
                
                // Actualizar cliente en la lista principal
                setClientes(prev => prev.map(cliente => 
                    cliente.id === clienteDetallado.id 
                        ? { ...cliente, etiqueta: etiquetaSeleccionada } 
                        : cliente
                ));
                
                // Actualizar cliente detallado
                setClienteDetallado(clienteActualizado);
                
                // Sincronizar etiquetas en las filas de Excel
                const clienteNombre = clienteDetallado.nombre.toLowerCase();
                const nuevasFilas = excelData.map(row => {
                    if (row.clienteNombre.toLowerCase() === clienteNombre) {
                        return {
                            ...row,
                            etiqueta: etiquetaSeleccionada
                        };
                    }
                    return row;
                });
                
                setExcelData(nuevasFilas);
                
                // Actualizar en el backend
                await apiService.updateDebtorsCliente(clienteDetallado.id, {
                    etiqueta: etiquetaSeleccionada
                }).catch(err => {
                    toast.error('Error al actualizar en backend: ' + (err instanceof Error ? err.message : String(err)));
                    // Continuar aunque falle el backend
                });
                
                toast.success(`Cliente etiquetado como ${etiquetaSeleccionada}`);
            }
            
            setEtiquetaSeleccionada('');
            
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            toast.error('Error al etiquetar: ' + errorMessage);
        }
    };

    // Etiquetar elementos seleccionados
    const handleEtiquetarElementos = async () => {
        if (!etiquetaSeleccionada) {
            toast.error('Selecciona una etiqueta');
            return;
        }

        try {
            switch (activeTab) {
                case 'Clientes':
                    if (selectedClientes.length > 0) {
                        const clientesAEtiquetar = selectedClientes.filter(id => 
                            clientes.some(cliente => cliente.id === id)
                        );
                        
                        setClientes(prev => prev.map(cliente =>
                            clientesAEtiquetar.includes(cliente.id) 
                                ? { ...cliente, etiqueta: etiquetaSeleccionada } 
                                : cliente
                        ));
                        
                        toast.success(`${clientesAEtiquetar.length} cliente(s) etiquetado(s) como ${etiquetaSeleccionada}`);
                        setSelectedClientes([]);
                    } else {
                        toast.error('Selecciona al menos un cliente');
                        return;
                    }
                    break;

                case 'Excel':
                    if (selectedExcelRows.length > 0) {
                        setExcelData(prev => prev.map(row =>
                            selectedExcelRows.includes(row.id) 
                                ? { ...row, etiqueta: etiquetaSeleccionada } 
                                : row
                        ));
                        toast.success(`${selectedExcelRows.length} registro(s) de Excel etiquetado(s) como ${etiquetaSeleccionada}`);
                        setSelectedExcelRows([]);
                    } else {
                        toast.error('Selecciona al menos un registro de Excel');
                        return;
                    }
                    break;

                default:
                    toast.error('Selecciona al menos un elemento');
                    return;
            }

            setShowEtiquetarModal(false);
            setEtiquetaSeleccionada('');
            
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            toast.error('Error al etiquetar: ' + errorMessage);
        }
    };

    // Manejar selección/deselección de filas de Excel
    const handleSelectExcelRow = (rowId: string) => {
        setSelectedExcelRows(prev => {
            if (prev.includes(rowId)) {
                return prev.filter(id => id !== rowId);
            } else {
                return [...prev, rowId];
            }
        });
    };

    // Seleccionar/deseleccionar todas las filas de Excel
    const handleSelectAllExcelRows = () => {
        if (selectedExcelRows.length === excelData.length) {
            setSelectedExcelRows([]);
        } else {
            setSelectedExcelRows(excelData.map(row => row.id));
        }
    };

    // Función para detectar si una fila es de totales
    const isTotalRow = (row: any[]): boolean => {
        for (let i = 0; i < row.length; i++) {
            const cellValue = row[i]?.toString().toLowerCase();
            if (totalPatterns.some(pattern => cellValue?.includes(pattern))) {
                return true;
            }
        }

        const hasVeryHighValues = row.some(cell => {
            const numValue = parseFloat(cell);
            return !isNaN(numValue) && numValue > 1000000;
        });

        const textCells = row.filter(cell => typeof cell === 'string' && cell.trim() !== '');
        const numericCells = row.filter(cell => {
            const numValue = parseFloat(cell);
            return !isNaN(numValue) && numValue > 0;
        });

        if (textCells.length === 0 && numericCells.length > 0) {
            return true;
        }

        return hasVeryHighValues;
    };

    // Función para detectar automáticamente las columnas
    const autoDetectColumns = (headers: string[]): {[key: string]: string} => {
        const mapping: {[key: string]: string} = {};

        headers.forEach(header => {
            const headerLower = header.toLowerCase().trim();
      
            Object.entries(columnPatterns).forEach(([targetCol, patterns]) => {
                if (patterns.some(pattern => headerLower.includes(pattern.toLowerCase()))) {
                    if (!mapping[targetCol] || headerLower === patterns[0].toLowerCase()) {
                        mapping[targetCol] = header;
                    }
                }
            });
        });

        return mapping;
    };

    // Calcular totales del Excel
    const calculateExcelTotals = () => {
        const totalImporte = excelData.reduce((sum, row) => sum + row.totalImporte, 0);
        const totalCobrado = excelData.reduce((sum, row) => sum + row.cobradoLinea, 0);
        const totalDeuda = excelData.reduce((sum, row) => sum + row.deuda, 0);
        
        return { totalImporte, totalCobrado, totalDeuda };
    };

    // Limpiar datos de Excel
    const clearExcelData = () => {
        setExcelData([]);
        setActiveTab('Clientes');
    };

    // Obtener elementos seleccionados actualmente
    const getElementosSeleccionados = () => {
        if (activeTab === 'Clientes') {
            return {
                count: selectedClientes.length,
                type: 'clientes'
            };
        } else {
            return {
                count: selectedExcelRows.length,
                type: 'registros de Excel'
            };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-lg text-gray-600">Cargando...</div>
            </div>
        );
    }

    // Obtener el resumen de etiquetas actual con deuda
    const { resumen: resumenEtiquetas, deudaPorEtiqueta } = calcularResumenEtiquetas();
    const excelTotals = calculateExcelTotals();
    const elementosSeleccionados = getElementosSeleccionados();

    return (
        <div className="min-h-screen bg-white p-2 rounded-md">
            {/* Sección completamente fija superior */}
            <div className='bg-white sticky top-0 z-50 mb-2'>
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab('Clientes')}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                                activeTab === 'Clientes'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`
                            }
                        >
                            Gestión de Clientes ({clientes.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('Excel')}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                                activeTab === 'Excel'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`
                            }
                        >
                            Datos de Excel ({excelData.length})
                        </button>
                        {activeTab === 'Excel' &&
                            <div className="flex items-center ml-4 space-x-4">
                                <label
                                    className="cursor-pointer text-white flex items-center px-3 py-2 rounded-md gap-2 transition-all hover:scale-105 bg-cyan-600 hover:bg-yellow-500"
                                    htmlFor='inputfile'>Seleccionar archivo Excel
                                </label>
                                <input
                                    id="inputfile"
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                    hidden
                                />
                            
                                {isUploading && (
                                    <div className="flex items-center text-cyan-600">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando archivo...
                                    </div>
                                )}
                            </div>
                        }
                    </nav>
                </div>
            
                {/* Totales del Excel - Solo se muestra cuando hay datos */}
                {excelData.length > 0 && activeTab === 'Excel' && (
                    <div className="bg-green-50 p-1 mt-1 mb-1 rounded-md shadow">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-green-800">
                                Resumen del Excel ({excelData.length} registros)
                            </h3>
                            <div className="text-sm text-green-700 space-x-4">
                                <span>Total Importe: <span className="font-bold">${excelTotals.totalImporte.toLocaleString()}</span></span>
                                <span>Total Cobrado: <span className="font-bold text-green-600">${excelTotals.totalCobrado.toLocaleString()}</span></span>
                                <span>Total Deuda: <span className="font-bold text-red-600">${excelTotals.totalDeuda.toLocaleString()}</span></span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Métricas Globales */}
                {metricas && activeTab === 'Clientes' && (
                    <div className="bg-white rounded-lg shadow p-1 mb-1">
                        <h2 className="text-xl font-bold mb-1">Métricas Globales</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                            <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                                <h3 className="text-sm font-bold text-gray-600">Total Clientes</h3>
                                <p className="text-sm text-gray-800">{metricas.totalClientes}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg flex justify-between items-center">
                                <h3 className="text-sm font-bold text-green-600">Clientes Activos</h3>
                                <p className="text-sm text-green-600">{metricas.clientesActivos}</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg flex justify-between items-center">
                                <h3 className="text-sm font-bold text-red-600">Clientes Morosos</h3>
                                <p className="text-sm text-red-600">{metricas.clientesMorosos}</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
                                <h3 className="text-sm font-bold text-blue-600">Cartera Total</h3>
                                <p className="text-sm text-blue-600">${metricas.carteraTotal.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Resumen Comparativo - Siempre visible en pestaña Clientes */}
                {activeTab === 'Clientes' && (
                    <div className="bg-white rounded-lg shadow p-1 mb-1">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h2 className="text-xl font-bold">Resumen Comparativo por Fecha</h2>
                                <p className="text-sm text-gray-600">
                                    {resumenComparativa ? (
                                        <>
                                            📅 {resumenComparativa.periodoActual} vs {resumenComparativa.periodoAnterior} • 
                                            {tipoPeriodo === 'dia' ? ' Comparando día vs día anterior' : 
                                            tipoPeriodo === 'semana' ? ' Comparando semana vs semana anterior' : 
                                            ' Comparando mes vs mes anterior'}
                                        </>
                                    ) : 'Cargando comparativa...'}
                                </p>
                            </div>
                            
                            {/* Selector de Tipo de Período */}
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-700">Período:</span>
                                <select
                                    value={tipoPeriodo}
                                    onChange={(e) => {
                                        setTipoPeriodo(e.target.value as 'dia' | 'semana' | 'mes');
                                    }}
                                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="dia">Por Día</option>
                                    <option value="semana">Por Semana</option>
                                    <option value="mes">Por Mes</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-1">
                            <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h3 className="text-xs font-bold text-blue-600">
                                        {tipoPeriodo === 'dia' ? 'Hoy' : tipoPeriodo === 'semana' ? 'Esta Semana' : 'Este Mes'}
                                    </h3>
                                    <p className="text-xs text-blue-700 mt-1">
                                        Clientes: {resumenComparativa?.totalClientesActual || 0}
                                    </p>
                                </div>
                                <p className="text-xs text-blue-700 font-bold">
                                    ${resumenComparativa?.totalDeudaActual?.toLocaleString() || '0'}
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h3 className="text-xs font-bold text-green-600">
                                        {tipoPeriodo === 'dia' ? 'Ayer' : tipoPeriodo === 'semana' ? 'Semana Pasada' : 'Mes Pasado'}
                                    </h3>
                                    <p className="text-xs text-green-700 mt-1">
                                        Clientes: {resumenComparativa?.totalClientesAnterior || 0}
                                    </p>
                                </div>
                                <p className="text-xs text-green-700 font-bold">
                                    ${resumenComparativa?.totalDeudaAnterior?.toLocaleString() || '0'}
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg flex justify-between items-center">
                                <h3 className="text-xs font-bold text-purple-600">Variación</h3>
                                <p className={`text-xs font-bold ${(resumenComparativa?.totalVariacion || 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {(resumenComparativa?.totalVariacion || 0) >= 0 ? '+' : ''}${(resumenComparativa?.totalVariacion || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg flex justify-between items-center">
                                <h3 className="text-xs font-bold text-orange-600">% Cambio</h3>
                                <p className={`text-xs font-bold ${(resumenComparativa?.totalPorcentajeVariacion || 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {(resumenComparativa?.totalPorcentajeVariacion || 0) >= 0 ? '+' : ''}{(resumenComparativa?.totalPorcentajeVariacion || 0).toFixed(1)}%
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                                <h3 className="text-xs font-bold text-gray-600">Registros Actual</h3>
                                <p className="text-xs text-gray-700 font-bold">
                                    {resumenComparativa?.totalRegistrosActual || 0}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                                <h3 className="text-xs font-bold text-gray-600">Registros Anterior</h3>
                                <p className="text-xs text-gray-700 font-bold">
                                    {resumenComparativa?.totalRegistrosAnterior || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Resumen de Etiquetas - Solo en pestaña Excel */}
                {activeTab === 'Excel' && (
                    <div className="bg-white rounded-lg shadow p-1 mb-1">
                        <div className="flex justify-between items-center mb-1">
                            <h2 className="text-xl font-bold">Resumen de Etiquetas</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-2">
                            {Object.entries(resumenEtiquetas).map(([etiqueta, count]) => (
                                <div 
                                    key={etiqueta} 
                                    className={`p-2 rounded-lg border ${
                                        etiqueta === 'Sin etiqueta' ? 'bg-gray-50 border-gray-200 text-xs font-bold flex justify-between items-center' 
                                        : `${getColorEtiqueta(etiqueta).bg} border-transparent text-xs font-bold`
                                    }`}
                                >
                                    <div
                                        className={` ${
                                            etiqueta === 'Sin etiqueta' ? 'text-gray-600' : getColorEtiqueta(etiqueta).text
                                        }`}
                                    >
                                        {`${etiqueta} (${count})`}
                                        <div
                                            className={` ${
                                                etiqueta === 'Sin etiqueta' ? 'text-gray-600 font-medium' : `${getColorEtiqueta(etiqueta).text} font-medium`
                                            }`}
                                        >
                                            {`Total Deuda: $${deudaPorEtiqueta[etiqueta]?.toLocaleString() || '0'}`}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Barra de herramientas para selección múltiple */}
                {(selectedClientes.length > 0 || selectedExcelRows.length > 0) && activeTab === 'Excel' && (
                    <div className="bg-blue-50 p-1 mb-1 rounded-md shadow">
                        <div className="flex justify-between items-center">
                            <span className="text-blue-700 font-medium">
                                {elementosSeleccionados.count} {elementosSeleccionados.type} seleccionado(s)
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setShowEtiquetarModal(true)}
                                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-yellow-500 transition duration-200"
                                >
                                    Etiquetar Seleccionados
                                </button>
                                <button
                                    onClick={() => {
                                        if (activeTab === 'Excel') {
                                            setSelectedExcelRows([]);
                                        } else {
                                            setSelectedClientes([]);
                                        }
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Contenido desplazable - TABLAS */}
            <div className="bg-white p-1 mb-1 rounded-md shadow">
                {activeTab === 'Clientes' && (
                    <div>
                        {/* Tabla de Clientes con Comparativa */}
                        {clientes.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No se encontraron clientes
                            </div>
                        ) : (
                            <>
                                {/* Barra de búsqueda y filtros - STICKY */}
                                <div className="sticky top-10 z-20 bg-white p-1 mb-1 rounded-md shadow">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1 max-w-md">
                                            <input
                                                type="text"
                                                placeholder="Buscar cliente por nombre..."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                onChange={(e) => handleSearchCliente(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex space-x-2">
                                            {showFiltros &&
                                                <button
                                                    onClick={limpiarFiltros}
                                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                                >
                                                    Limpiar Filtros
                                                </button>
                                            }
                                            <button
                                                onClick={() => setShowFiltros(!showFiltros)}
                                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                                            >
                                                {showFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                                            </button>
                                            <button
                                                onClick={handleDescargarComparativa}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                                            >
                                                Exportar Comparativa
                                            </button>
                                            <button
                                                onClick={handleDescargarPDF}
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 flex items-center hover:scale-105"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Descargar PDF
                                            </button>
                                        </div>
                                    </div>

                                    {/* Filtros */}
                                    {showFiltros && (
                                        <div className="bg-gray-50 p-4 rounded-lg mt-2">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <select
                                                    value={filtroTendencia}
                                                    onChange={(e) => setFiltroTendencia(e.target.value)}
                                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Todas las tendencias</option>
                                                    <option value="aumento">En aumento</option>
                                                    <option value="disminucion">En disminución</option>
                                                    <option value="estable">Estables</option>
                                                </select>
                                                <select
                                                    value={filtroEstado}
                                                    onChange={(e) => setFiltroEstado(e.target.value)}
                                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Todos los estados</option>
                                                    <option value="activo">Activos</option>
                                                    <option value="moroso">Morosos</option>
                                                    <option value="inactivo">Inactivos</option>
                                                </select>
                                                <select
                                                    value={filtroEtiqueta}
                                                    onChange={(e) => setFiltroEtiqueta(e.target.value)}
                                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Todas las etiquetas</option>
                                                    {Object.keys(coloresEtiquetas).map(etiqueta => (
                                                        <option key={etiqueta} value={etiqueta}>{etiqueta}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={filtroEstadoComparativa}
                                                    onChange={(e) => setFiltroEstadoComparativa(e.target.value)}
                                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Todos los estados</option>
                                                    <option value="nuevo">Clientes Nuevos</option>
                                                    <option value="liquidado">Clientes Liquidados</option>
                                                    <option value="aumento">Deuda Aumentó</option>
                                                    <option value="disminucion">Deuda Disminuyó</option>
                                                    <option value="estable">Deuda Estable</option>
                                                </select>

                                                <select
                                                    value={filtroTieneAnteriores}
                                                    onChange={(e) => setFiltroTieneAnteriores(e.target.value)}
                                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Todos los clientes</option>
                                                    <option value="conAnteriores">Con datos anteriores</option>
                                                    <option value="sinAnteriores">Sin datos anteriores</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
                                    <table className="min-w-full">
                                    {/* Encabezado STICKY */}
                                        <thead className="sticky top-0 z-10 bg-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                    Etiqueta
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                                    Cliente
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                    Deuda {tipoPeriodo === 'dia' ? 'Hoy' : tipoPeriodo === 'semana' ? 'Esta Semana' : 'Este Mes'}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                    Deuda {tipoPeriodo === 'dia' ? 'Ayer' : tipoPeriodo === 'semana' ? 'Semana Pasada' : 'Mes Pasado'}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                    Variación
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                    Tendencia
                                                </th>
                                            </tr>
                                        </thead>
                                    
                                        {/* Cuerpo de la tabla */}
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {clientesFiltrados.map((cliente) => (
                                                <tr 
                                                    key={cliente.id} 
                                                    className="hover:bg-gray-50 transition duration-150 cursor-pointer"
                                                    onDoubleClick={() => handleDoubleClickCliente(cliente)}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap w-1/6">
                                                        {cliente.etiqueta && (
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getColorEtiqueta(cliente.etiqueta).bg} ${getColorEtiqueta(cliente.etiqueta).text}`}>
                                                                {cliente.etiqueta}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap w-1/4">
                                                        <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/6">
                                                        ${cliente.saldoActual.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-1/6">
                                                        ${(cliente.deudaAnterior || 0).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap w-1/6">
                                                        <div className="flex items-center">
                                                            <span
                                                                className={`text-sm font-medium ${
                                                                    (cliente.variacion || 0) > 0 ? 'text-red-600' : 
                                                                    (cliente.variacion || 0) < 0 ? 'text-green-600' : 'text-gray-600'
                                                                }`}>
                                                                {(cliente.variacion || 0) > 0 ? '+' : ''}${(cliente.variacion || 0).toLocaleString()}
                                                            </span>
                                                            {(cliente.porcentajeVariacion || 0) !== 0 && (
                                                                <span
                                                                    className={`ml-2 text-xs ${
                                                                        (cliente.porcentajeVariacion || 0) > 0 ? 'text-red-500' : 
                                                                        (cliente.porcentajeVariacion || 0) < 0 ? 'text-green-500' : 'text-gray-500'
                                                                    }`}>
                                                                    ({(cliente.porcentajeVariacion || 0) > 0 ? '+' : ''}{(cliente.porcentajeVariacion || 0).toFixed(1)}%)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap w-1/6">
                                                        <div className="flex items-center">
                                                            {(cliente.variacion || 0) > 0 ? (
                                                                <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                                </svg>
                                                            ) : (cliente.variacion || 0) < 0 ? (
                                                                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                                                                </svg>
                                                            )}
                                                            <span className="text-sm text-gray-600">
                                                                {(cliente.variacion || 0) > 0 ? 'Aumentando' : 
                                                                (cliente.variacion || 0) < 0 ? 'Disminuyendo' : 'Estable'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap w-1/8">
                                                        {cliente.estadoComparativa === 'nuevo' && (
                                                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                                                </svg>
                                                                Nuevo
                                                            </span>
                                                        )}
                                                        {cliente.estadoComparativa === 'liquidado' && (
                                                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                Liquidado
                                                            </span>
                                                        )}
                                                        {cliente.estadoComparativa === 'aumento' && (
                                                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                Aumentó
                                                            </span>
                                                        )}
                                                        {cliente.estadoComparativa === 'disminucion' && (
                                                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                Disminuyó
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'Excel' && (
                    <div className='gap-2'>
                        {excelData.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Sin datos de Excel</h3>
                                <p className="mt-1 text-sm text-gray-500">Sube un archivo Excel para ver los datos aquí.</p>
                            </div>
                        ) : (
                            <>
                                {/* Botones de acciones - STICKY */}
                                <div className="sticky top-10 z-20 bg-white p-1 mb-1 rounded-md shadow">
                                    <div className="flex flex-row space-x-2">
                                        <button
                                            onClick={handleSubirClientes}
                                            disabled={isUploading || calcularClientesNuevos() === 0}
                                            className=" text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    Subiendo...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    {`Subir ${calcularClientesNuevos()} Clientes nuevos`}
                                                </>
                                            )}
                                        </button>

                                        {/* Botón procesar Excel y comparativa */}
                                        <button
                                            onClick={handleProcesarExcelYComparativa}
                                            disabled={isUploading || excelData.length === 0}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            {isUploading ? 'Procesando...' : `Procesar Excel y Comparativa (${excelData.length})`}
                                        </button>

                                        {/* Botón para sincronizar etiquetas */}
                                        <button
                                            onClick={handleSincronizarTodasEtiquetas}
                                            disabled={isUploading || !clientes.some(cliente => cliente.etiqueta)}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Sincronizar Etiquetas
                                        </button>
                                        
                                        <button
                                            onClick={clearExcelData}
                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                        >
                                            Limpiar Datos
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
                                    <table className="min-w-full">
                                    {/* Encabezado STICKY */}
                                        <thead className="sticky top-0 z-10 bg-gray-200">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedExcelRows.length === excelData.length && excelData.length > 0}
                                                        onChange={handleSelectAllExcelRows}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                    Etiqueta
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                    Fecha Albarán
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                                    Cliente
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                    Paciente
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                    Total Importe
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                    Cobrado
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                    Deuda
                                                </th>
                                            </tr>
                                        </thead>
                                    
                                        {/* Cuerpo de la tabla */}
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {excelData.map((row) => (
                                                <tr 
                                                    key={row.id} 
                                                    className="hover:bg-gray-50 transition duration-150 cursor-pointer"
                                                    onDoubleClick={() => handleDoubleClickExcel(row)}
                                                >
                                                    <td className="px-4 py-3 whitespace-nowrap w-12">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedExcelRows.includes(row.id)}
                                                            onChange={() => handleSelectExcelRow(row.id)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap w-1/6">
                                                        {row.etiqueta && (
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getColorEtiqueta(row.etiqueta).bg} ${getColorEtiqueta(row.etiqueta).text}`}>
                                                                {row.etiqueta}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 w-1/6">
                                                        {row.fechaAlbaran || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 w-1/4">
                                                        {row.clienteNombre || 'Sin nombre'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 w-1/6">
                                                        {row.paciente || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 w-1/6">
                                                        ${row.totalImporte.toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-green-600 font-medium w-1/6">
                                                        ${row.cobradoLinea.toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-red-600 font-medium w-1/6">
                                                        ${row.deuda.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            
            {/* Modal de Detalle de Cliente - MEJORADO */}
            {showDetalleCliente && clienteDetallado && (
                <Modal
                    className1="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
                    className2="relative bg-white rounded-lg shadow-lg max-w-7xl w-full p-6 max-h-[90vh] overflow-y-auto"
                    closeModal={() => {
                        setShowDetalleCliente(false);
                        setModalDesdeExcel(false);
                    }}
                >
                    <div className="bg-white rounded-lg p-6 w-full">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {modalDesdeExcel ? 'Registros del Cliente: ' : 'Detalles del Cliente: '} {clienteDetallado.nombre}
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    {modalDesdeExcel ? 'Desde tab Excel' : 'Vista completa del cliente'}
                                </p>
                            </div>
                            
                            {/* Sección de etiquetado en el modal */}
                            <div className="flex items-center space-x-3">
                                <select
                                    value={etiquetaSeleccionada}
                                    onChange={(e) => setEtiquetaSeleccionada(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">
                                        {modalDesdeExcel ? 'Etiquetar registros...' : 'Etiquetar cliente...'}
                                    </option>
                                    {Object.keys(coloresEtiquetas).map(etiqueta => (
                                        <option key={etiqueta} value={etiqueta}>
                                            {etiqueta}
                                        </option>
                                    ))}
                                </select>
                                
                                <button
                                    onClick={handleEtiquetarClienteDesdeModal}
                                    disabled={!etiquetaSeleccionada}
                                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-yellow-500 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>
                        
                        {/* Información general del cliente */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Tipo de Cliente</h3>
                                <p className="text-lg font-semibold text-gray-800">{clienteDetallado.tipoCliente}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Total Deuda Actual</h3>
                                <p className={`text-lg font-semibold ${
                                    clienteDetallado.totalDeuda > 0 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                    ${clienteDetallado.totalDeuda.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                    clienteDetallado.estado === 'activo' ? 'bg-green-100 text-green-800' :
                                    clienteDetallado.estado === 'moroso' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {clienteDetallado.estado}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Etiqueta</h3>
                                {clienteDetallado.etiqueta ? (
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getColorEtiqueta(clienteDetallado.etiqueta).bg} ${getColorEtiqueta(clienteDetallado.etiqueta).text}`}>
                                        {clienteDetallado.etiqueta}
                                    </span>
                                ) : (
                                    <span className="text-gray-500">Sin etiqueta</span>
                                )}
                            </div>
                        </div>

                        {/* Resumen de las filas del cliente */}
                        {clienteDetallado.totalesFilas && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-blue-600">Total Importe</h3>
                                    <p className="text-2xl font-bold text-blue-700">${clienteDetallado.totalesFilas.totalImporte.toLocaleString()}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-green-600">Total Cobrado</h3>
                                    <p className="text-2xl font-bold text-green-700">${clienteDetallado.totalesFilas.totalCobrado.toLocaleString()}</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-red-600">Total Deuda</h3>
                                    <p className="text-2xl font-bold text-red-700">${clienteDetallado.totalesFilas.totalDeuda.toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        {/* Botones de acción */}
                        {!modalDesdeExcel && (
                            <div className="flex space-x-2 mb-6">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleConfirmDelete(clienteDetallado);
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                >
                                    Eliminar Cliente
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            await apiService.updateDebtorsCliente(clienteDetallado.id, {
                                                etiqueta: clienteDetallado.etiqueta,
                                                saldoActual: clienteDetallado.saldoActual,
                                                estado: clienteDetallado.estado
                                            });
                                            toast.success('Cliente actualizado en el backend');
                                        } catch (err: unknown) {
                                            const message = err instanceof Error
                                                ? err.message
                                                : String(err);
                                            toast.error('Error al actualizar cliente: ' + message);
                                        }
                                    }}
                                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-yellow-500 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        )}

                        {/* Historial de Deudas por Fecha */}
                        {clienteDetallado.historial && clienteDetallado.historial.length > 0 && (
                            <div className="mt-6 mb-8">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                    Historial de Deudas por Fecha ({clienteDetallado.historial.length} días)
                                </h3>
                                
                                <div className="overflow-hidden border border-gray-200 rounded-lg">
                                    <div className="overflow-y-auto max-h-96">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50 sticky top-0">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Fecha
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Deuda del Día
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Deuda Acumulada
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Registros
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {clienteDetallado.historial.map((deudaFecha: any) => (
                                                    <tr key={deudaFecha.fecha} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {formatDateForDisplay(deudaFecha.fecha)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-red-600 font-medium">
                                                            ${deudaFecha.deudaDia?.toLocaleString() || '0'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                                                            ${deudaFecha.acumulado?.toLocaleString() || '0'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-600">
                                                                {deudaFecha.registros?.length || 0} registro(s)
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Registros en Excel del cliente */}
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                Registros en Excel ({filasCliente.length})
                            </h3>
                            
                            {filasCliente.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="mt-2">No se encontraron registros de Excel para este cliente.</p>
                                </div>
                            ) : (
                                <div className="overflow-hidden border border-gray-200 rounded-lg">
                                    <div className="overflow-y-auto max-h-96">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50 sticky top-0">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                        Etiqueta
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                        Fecha Albarán
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                        Paciente
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                        Total Importe
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                        Cobrado
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                        Deuda
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filasCliente.map((fila) => (
                                                    <tr key={fila.id} className="hover:bg-gray-50 transition duration-150">
                                                        <td className="px-6 py-4 whitespace-nowrap w-1/6">
                                                            {fila.etiqueta && (
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getColorEtiqueta(fila.etiqueta).bg} ${getColorEtiqueta(fila.etiqueta).text}`}>
                                                                    {fila.etiqueta}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-1/6">
                                                            {fila.fechaAlbaran || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 w-1/6">
                                                            {fila.paciente || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-1/6">
                                                            ${fila.totalImporte.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium w-1/6">
                                                            ${fila.cobradoLinea.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium w-1/6">
                                                            ${fila.deuda.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>
            )}

            {/* Modal para Etiquetar Elementos */}
            {showEtiquetarModal && (
                <Modal
                    className1="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
                    className2="relative bg-white rounded-lg shadow-lg max-w-md w-full p-2"
                    closeModal={() => setShowEtiquetarModal(false)}
                >
                    <div className="bg-white rounded-lg p-2">
                        <h2 className="text-xl font-bold mb-2 text-center">Etiquetar {elementosSeleccionados.type}</h2>
                        <p className="text-gray-600 mb-2">
                            Etiquetar {elementosSeleccionados.count} {elementosSeleccionados.type} seleccionado(s)
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Seleccionar Etiqueta
                                </label>
                                <select
                                    value={etiquetaSeleccionada}
                                    onChange={(e) => setEtiquetaSeleccionada(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Selecciona una etiqueta</option>
                                    {Object.keys(coloresEtiquetas).map(etiqueta => (
                                        <option key={etiqueta} value={etiqueta}>
                                            {etiqueta}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-center space-x-2 mt-4">
                            <button
                                onClick={handleEtiquetarElementos}
                                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-yellow-500 transition duration-200"
                            >
                                Aplicar Etiqueta
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Modal de Confirmación para Eliminar */}
            {showDeleteModal && clienteToDelete && (
                <Modal
                    className1="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
                    className2="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6"
                    closeModal={() => {
                        setShowDeleteModal(false);
                        setClienteToDelete(null);
                    }}
                >
                    <div className="bg-white rounded-lg p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        
                        <div className="mt-4 text-center">
                            <h3 className="text-lg font-medium text-gray-900">
                                ¿Eliminar cliente?
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    ¿Estás seguro de que quieres eliminar al cliente{" "}
                                    <span className="font-semibold text-gray-900">"{clienteToDelete.nombre}"</span>?
                                    Esta acción no se puede deshacer.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center space-x-4">
                            <button
                                onClick={() => handleDeleteCliente(clienteToDelete)}
                                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-yellow-500 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default DebtorsMain;