import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import readXlsxFile from 'read-excel-file';
import toast from 'react-hot-toast';
import Modal from '../shared/Modal';
import coloresEtiquetas from '../../utils/debtors';
import { ClienteComparativa, ExcelRow, MetricasGlobales, ResumenEtiquetas } from '../../interfaces/debtors.interface';


export const DebtorsMain: React.FC = () => {
    const [clientes, setClientes] = useState<ClienteComparativa[]>([]);
    const [excelData, setExcelData] = useState<ExcelRow[]>([]);
    const [metricas, setMetricas] = useState<MetricasGlobales | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<ClienteComparativa | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'Clientes' | 'Excel'>('Clientes');
    const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
    const [selectedExcelRows, setSelectedExcelRows] = useState<string[]>([]);
    const [showDetalleCliente, setShowDetalleCliente] = useState(false);
    const [clienteDetallado, setClienteDetallado] = useState<ClienteComparativa | null>(null);
    const [showEtiquetarModal, setShowEtiquetarModal] = useState(false);
    const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState('');
    const [filasCliente, setFilasCliente] = useState<ExcelRow[]>([]);
    const [modalDesdeExcel, setModalDesdeExcel] = useState(false);
    
    // Nuevos estados para comparativas
    const [showFiltros, setShowFiltros] = useState(false);
    const [filtroTendencia, setFiltroTendencia] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroEtiqueta, setFiltroEtiqueta] = useState('');

    // Estados para el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        tipoCliente: 'regular',
        limiteCredito: 0,
        saldoActual: 0,
        estado: 'activo'
    });

    // Cargar datos iniciales
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [clientesData, metricasData] = await Promise.all([
                apiService.getDebtorsClientes(),
                apiService.getDebtorsMetricasGlobales(new Date().getFullYear(), new Date().getMonth() + 1)
            ]);
            
            setClientes(clientesData);
            setMetricas(metricasData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError('Error al cargar los datos: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Función para subir clientes al backend
    const handleSubirClientes = async () => {
        try {
            setIsUploading(true);
            
            // Filtrar solo los clientes que tienen datos válidos
            const clientesParaSubir = clientes.filter(cliente => 
                cliente.nombre && cliente.nombre.trim() !== ''
            );

            if (clientesParaSubir.length === 0) {
                toast.error('No hay clientes válidos para subir');
                return;
            }

            // Subir cada cliente individualmente
            const resultados = [];
            for (const cliente of clientesParaSubir) {
                try {
                    let resultado;
                    if (cliente.id && cliente.id.startsWith('temp-')) {
                        // Es un cliente nuevo (sin ID real)
                        resultado = await apiService.createDebtorsCliente({
                            nombre: cliente.nombre,
                            tipoCliente: cliente.tipoCliente || 'regular',
                            limiteCredito: cliente.limiteCredito || 0,
                            saldoActual: cliente.saldoActual || 0,
                            estado: cliente.estado || 'activo',
                            etiqueta: cliente.etiqueta || ''
                        });
                    } else {
                        // Es un cliente existente
                        resultado = await apiService.updateDebtorsCliente(cliente.id, {
                            nombre: cliente.nombre,
                            tipoCliente: cliente.tipoCliente,
                            limiteCredito: cliente.limiteCredito,
                            saldoActual: cliente.saldoActual,
                            estado: cliente.estado,
                            etiqueta: cliente.etiqueta || ''
                        });
                    }
                    resultados.push(resultado);
                } catch (error) {
                    console.error(`Error subiendo cliente ${cliente.nombre}:`, error);
                    const mensajeError = error instanceof Error ? error.message : String(error);
                    resultados.push({ error: `Error con ${cliente.nombre}: ${mensajeError}` });
                }
            }

            toast.success(`Se subieron ${resultados.filter(r => !r.error).length} de ${clientesParaSubir.length} clientes correctamente`);
            
            // Recargar los datos desde el backend
            await loadInitialData();
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            toast.error(`Error al subir clientes: ${errorMessage}`);
        } finally {
            setIsUploading(false);
        }
    };

    // Función para subir datos de Excel procesados al backend
    const handleSubirExcelProcesado = async () => {
        try {
            setIsUploading(true);
            
            if (excelData.length === 0) {
                toast.error('No hay datos de Excel para subir');
                return;
            }

            // Procesar el Excel (esto ya lo tienes implementado)
            const periodo = obtenerPeriodoActual();
            const resultado = await apiService.procesarExcelComparativa(excelData, periodo);
            
            toast.success(resultado.message || 'Datos de Excel procesados correctamente');
            
            // Recargar los clientes para ver las comparativas actualizadas
            await loadInitialData();
            
            // Cambiar al tab Clientes para ver los resultados
            setActiveTab('Clientes');
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            toast.error('Error al procesar y subir datos de Excel: ' + errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    // Función para sincronizar etiquetas con el backend
    const handleSincronizarEtiquetas = async () => {
        try {
            setIsUploading(true);
            
            // Obtener clientes que tienen etiquetas
            const clientesConEtiquetas = clientes.filter(cliente => 
                cliente.etiqueta && cliente.etiqueta.trim() !== ''
            );

            if (clientesConEtiquetas.length === 0) {
                toast.error('No hay clientes con etiquetas para sincronizar');
                return;
            }

            // Actualizar cada cliente con su etiqueta
            const actualizaciones = [];
            for (const cliente of clientesConEtiquetas) {
                try {
                    const resultado = await apiService.updateDebtorsCliente(cliente.id, {
                        etiqueta: cliente.etiqueta
                        // Mantener los demás datos igual
                    });
                    actualizaciones.push(resultado);
                } catch (error) {
                    console.error(`Error sincronizando etiqueta de ${cliente.nombre}:`, error);
                }
            }

            toast.success(`Etiquetas de ${actualizaciones.length} clientes sincronizadas correctamente`);
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            toast.error('Error al sincronizar etiquetas: ' + errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    // Calcular resumen de etiquetas con total de deuda
    const calcularResumenEtiquetas = (): { resumen: ResumenEtiquetas, deudaPorEtiqueta: { [etiqueta: string]: number } } => {
        const resumen: ResumenEtiquetas = {};
        const deudaPorEtiqueta: { [etiqueta: string]: number } = {};
        
        if (activeTab === 'Clientes') {
            // Contar etiquetas de clientes y calcular deuda
            clientes.forEach(cliente => {
                const etiqueta = cliente.etiqueta || 'Sin etiqueta';
                resumen[etiqueta] = (resumen[etiqueta] || 0) + 1;
                deudaPorEtiqueta[etiqueta] = (deudaPorEtiqueta[etiqueta] || 0) + cliente.saldoActual;
            });
        } else {
            // Contar etiquetas de filas de Excel y calcular deuda
            excelData.forEach(fila => {
                const etiqueta = fila.etiqueta || 'Sin etiqueta';
                resumen[etiqueta] = (resumen[etiqueta] || 0) + 1;
                deudaPorEtiqueta[etiqueta] = (deudaPorEtiqueta[etiqueta] || 0) + fila.deuda;
            });
        }
        
        return { resumen, deudaPorEtiqueta };
    };

    // Función para obtener el período actual
    const obtenerPeriodoActual = (): string => {
        const ahora = new Date();
        const anio = ahora.getFullYear();
        const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
        return `${anio}-${mes}`;
    };

    // Función para procesar comparativa
    const handleProcesarComparativa = async () => {
        try {
            const periodo = obtenerPeriodoActual();
            const resultado = await apiService.procesarExcelComparativa(excelData, periodo);
            
            toast.success(resultado.message);
            
            // Recargar los clientes para ver las comparativas actualizadas
            await loadInitialData();
            
            // Cambiar al tab Clientes para ver los resultados
            setActiveTab('Clientes');
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            toast.error('Error al procesar comparativa: ' + errorMessage);
        }
    };

    // Función para descargar PDF
    const handleDescargarPDF = () => {
        toast.success('Funcionalidad de descarga PDF en desarrollo');
        console.log('Descargando PDF...');
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
            // Obtener todas las filas de Excel de este cliente
            const filasDelCliente = obtenerFilasCliente(cliente.nombre);
            setFilasCliente(filasDelCliente);
            setModalDesdeExcel(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError('Error al cargar detalles del cliente: ' + errorMessage);
            setFilasCliente([]);
        }
    };

    // Función para obtener el color de una etiqueta
    const getColorEtiqueta = (etiqueta: string) => {
        return coloresEtiquetas[etiqueta] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    };

    // Obtener el resumen de etiquetas actual con deuda
    const { resumen: resumenEtiquetas, deudaPorEtiqueta } = calcularResumenEtiquetas();

    // Calcular variaciones totales para el resumen
    const variacionTotal = clientes.reduce((sum, c) => sum + (c.variacion || 0), 0);
    const deudaAnteriorTotal = clientes.reduce((sum, c) => sum + (c.deudaAnterior || 0), 0);
    const porcentajeVariacion = deudaAnteriorTotal > 0 ? (variacionTotal / deudaAnteriorTotal) * 100 : 0;

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
        setClienteDetallado(cliente);
        await cargarDetallesCliente(cliente);
        setShowDetalleCliente(true);
    };

    // Manejar ver detalle del cliente (nueva función)
    const handleVerDetalleCliente = async (cliente: ClienteComparativa) => {
        setClienteDetallado(cliente);
        await cargarDetallesCliente(cliente);
        setShowDetalleCliente(true);
    };

    // Manejar doble click en fila de Excel (desde tab Excel)
    const handleDoubleClickExcel = (row: ExcelRow) => {
        // Buscar todas las filas del mismo cliente
        const filasDelMismoCliente = obtenerFilasCliente(row.clienteNombre);
        setFilasCliente(filasDelMismoCliente);
        
        // Crear un cliente temporal para el modal
        setClienteDetallado({
            id: `temp-${row.clienteNombre}`,
            nombre: row.clienteNombre,
            tipoCliente: 'No especificado',
            limiteCredito: 0,
            saldoActual: 0,
            estado: 'activo'
        });
        
        setModalDesdeExcel(true);
        setShowDetalleCliente(true);
    };

    // Etiquetar cliente desde el modal de detalles
    const handleEtiquetarClienteDesdeModal = async () => {
        if (!clienteDetallado || !etiquetaSeleccionada) {
            toast.error('Selecciona una etiqueta');
            return;
        }

        try {
            if (modalDesdeExcel) {
                // Si el modal se abrió desde Excel, etiquetar todas las filas del cliente
                const filasIds = filasCliente.map(fila => fila.id);
                setExcelData(prev => prev.map(row => 
                    filasIds.includes(row.id) 
                        ? { ...row, etiqueta: etiquetaSeleccionada }
                        : row
                ));
                toast.success(`${filasCliente.length} registro(s) etiquetado(s) como ${etiquetaSeleccionada}`);
            } else {
                // Si el modal se abrió desde Clientes, etiquetar el cliente
                setClientes(prev => prev.map(cliente => 
                    cliente.id === clienteDetallado.id 
                        ? { ...cliente, etiqueta: etiquetaSeleccionada }
                        : cliente
                ));
                setClienteDetallado(prev => prev ? { ...prev, etiqueta: etiquetaSeleccionada } : null);
                toast.success(`Cliente etiquetado como ${etiquetaSeleccionada}`);
            }
            
            setEtiquetaSeleccionada('');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError('Error al etiquetar: ' + errorMessage);
        }
    };

    // Calcular totales de las filas del cliente
    const calcularTotalesFilasCliente = () => {
        const totalImporte = filasCliente.reduce((sum, row) => sum + row.totalImporte, 0);
        const totalCobrado = filasCliente.reduce((sum, row) => sum + row.cobradoLinea, 0);
        const totalDeuda = filasCliente.reduce((sum, row) => sum + row.deuda, 0);
        
        return { totalImporte, totalCobrado, totalDeuda };
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

    // Etiquetar elementos seleccionados
    const handleEtiquetarElementos = async () => {
        if (!etiquetaSeleccionada) {
            toast.error('Selecciona una etiqueta');
            return;
        }

        if (activeTab === 'Clientes' && selectedClientes.length > 0) {
            setClientes(prev => prev.map(cliente => 
                selectedClientes.includes(cliente.id) 
                    ? { ...cliente, etiqueta: etiquetaSeleccionada }
                    : cliente
            ));
            toast.success(`${selectedClientes.length} cliente(s) etiquetado(s) como ${etiquetaSeleccionada}`);
            setSelectedClientes([]);
        } else if (activeTab === 'Excel' && selectedExcelRows.length > 0) {
            setExcelData(prev => prev.map(row => 
                selectedExcelRows.includes(row.id) 
                    ? { ...row, etiqueta: etiquetaSeleccionada }
                    : row
            ));
            toast.success(`${selectedExcelRows.length} registro(s) de Excel etiquetado(s) como ${etiquetaSeleccionada}`);
            setSelectedExcelRows([]);
        } else {
            toast.error('Selecciona al menos un elemento');
            return;
        }

        setShowEtiquetarModal(false);
        setEtiquetaSeleccionada('');
    };

    // Función para detectar si una fila es de totales
    const isTotalRow = (row: any[]): boolean => {
        const totalPatterns = [
            'total', 'totales', 'suma', 'sumatoria', 'gran total', 'general total',
            'subtotal', 'resumen', 'conclusión', 'final'
        ];

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

    const formatDate = (dateString: string): string => {
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

    // Manejar carga de archivo Excel
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.match(/\.(xlsx|xls)$/)) {
            setError('Por favor, sube un archivo Excel válido (.xlsx o .xls)');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const rows = await readXlsxFile(file);
            
            if (rows.length === 0) {
                setError('El archivo Excel está vacío');
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
                    paciente: ''
                };

                Object.entries(autoMapping).forEach(([targetCol, sourceCol]) => {
                    const sourceIndex = headers.indexOf(sourceCol);
                    if (sourceIndex !== -1 && row[sourceIndex] !== undefined) {
                        const value = row[sourceIndex];
                        
                        if (targetCol === 'totalImporte' || targetCol === 'cobradoLinea' || targetCol === 'deuda') {
                            rowData[targetCol] = typeof value === 'number' ? value : 
                            typeof value === 'string' ? parseFloat(value.toString().replace(',', '.')) || 0 : 0;
                        } else if (targetCol === 'fechaAlbaran') {
                            rowData[targetCol] = formatDate(value?.toString() || '');
                        } else {
                            rowData[targetCol] = value?.toString() || '';
                        }
                    }
                });

                if (rowData.clienteNombre || rowData.totalImporte > 0) {
                    processedData.push(rowData);
                }
            }

            setExcelData(processedData);
        
            if (processedData.length === 0) {
                setError('No se encontraron datos válidos en el archivo Excel');
            } else {
                setError(null);
                setActiveTab('Excel');
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            toast.error(`Error al procesar el archivo Excel: ${errorMessage}`);
            setError('Error al procesar el archivo Excel: ' + errorMessage);
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    };

    // Función para detectar automáticamente las columnas
    const autoDetectColumns = (headers: string[]): {[key: string]: string} => {
        const mapping: {[key: string]: string} = {};
        const columnPatterns = {
            fechaAlbaran: ['fecha', 'albaran', 'fecha_albaran', 'fecha albarán', 'date', 'fecha de albarán'],
            clienteNombre: ['cliente', 'nombre', 'cliente_nombre', 'cliente nombre', 'empresa', 'client', 'name'],
            totalImporte: ['total', 'importe', 'total_importe', 'monto', 'valor', 'precio', 'amount', 'total amount'],
            cobradoLinea: ['cobrado', 'pagado', 'cobrado_linea', 'cobrado lineas', 'abonado', 'paid', 'collected'],
            deuda: ['deuda', 'saldo', 'pendiente', 'adeudo', 'restante', 'debt', 'balance', 'pending'],
            paciente: ['paciente', 'pacientes', 'cliente_final', 'beneficiario', 'patient', 'beneficiary']
        };

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

    // Manejar cambios en el formulario
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'limiteCredito' || name === 'saldoActual' ? parseFloat(value) || 0 : value
        }));
    };

    // Crear nuevo cliente
    const handleCreateCliente = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiService.createDebtorsCliente(formData);
            await loadInitialData();
            setShowForm(false);
            setFormData({
                nombre: '',
                tipoCliente: 'regular',
                limiteCredito: 0,
                saldoActual: 0,
                estado: 'activo'
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError('Error al crear cliente: ' + errorMessage);
        }
    };

    // Actualizar cliente
    const handleUpdateCliente = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCliente) return;
        
        try {
            await apiService.updateDebtorsCliente(selectedCliente.id, formData);
            await loadInitialData();
            setShowForm(false);
            setSelectedCliente(null);
            setFormData({
                nombre: '',
                tipoCliente: 'regular',
                limiteCredito: 0,
                saldoActual: 0,
                estado: 'activo'
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError('Error al actualizar cliente: ' + errorMessage);
        }
    };

    // Editar cliente
    const handleEditCliente = (cliente: ClienteComparativa) => {
        setSelectedCliente(cliente);
        setFormData({
            nombre: cliente.nombre,
            tipoCliente: cliente.tipoCliente,
            limiteCredito: cliente.limiteCredito,
            saldoActual: cliente.saldoActual,
            estado: cliente.estado
        });
        setShowForm(true);
    };

    // Buscar cliente por nombre
    const handleSearchCliente = async (nombre: string) => {
        if (!nombre.trim()) {
            await loadInitialData();
            return;
        }

        try {
            const resultado = await apiService.searchDebtorsCliente(nombre);
            setClientes(Array.isArray(resultado) ? resultado : [resultado]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError('Error al buscar cliente: ' + errorMessage);
        }
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

    // Función para descargar comparativa
    const handleDescargarComparativa = () => {
        toast.success('Funcionalidad de exportación en desarrollo');
        console.log('Exportando comparativa...');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-lg text-gray-600">Cargando...</div>
            </div>
        );
    }

    const excelTotals = calculateExcelTotals();
    const elementosSeleccionados = getElementosSeleccionados();
    const totalesFilas = calcularTotalesFilasCliente();

    return (
        <div className="min-h-screen bg-white p-2 rounded-md">
            {/* Sección completamente fija superior */}
            <div className='bg-white sticky top-0 z-50 mb-2'>
                {/* Header principal */}
                <header className="bg-white p-1 mb-1 rounded-md shadow">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{`Cargar Datos desde ${activeTab}`}</h2>
                        {activeTab === 'Clientes' ? (
                            <button
                                onClick={() => {
                                    setSelectedCliente(null);
                                    setFormData({
                                        nombre: '',
                                        tipoCliente: 'regular',
                                        limiteCredito: 0,
                                        saldoActual: 0,
                                        estado: 'activo'
                                    });
                                    setShowForm(true);
                                }}
                                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-200 flex items-center hover:scale-105"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Nuevo Cliente
                            </button>
                        ) : (
                            <div className="flex items-center space-x-4">
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
                        )}
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
                </header>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-1">
                        {error}
                        <button 
                            onClick={() => setError(null)}
                            className="float-right font-bold"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Métricas Globales */}
                {metricas && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-1 mb-1 rounded-md shadow">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500">Total Clientes</h3>
                            <p className="text-2xl font-bold text-gray-800">{metricas.totalClientes}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500">Clientes Activos</h3>
                            <p className="text-2xl font-bold text-green-600">{metricas.clientesActivos}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500">Clientes Morosos</h3>
                            <p className="text-2xl font-bold text-red-600">{metricas.clientesMorosos}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-sm font-medium text-gray-500">Cartera Total</h3>
                            <p className="text-2xl font-bold text-blue-600">${metricas.carteraTotal.toLocaleString()}</p>
                        </div>
                    </div>
                )}

                {/* Resumen de Etiquetas / Resumen Comparativo*/}
                {activeTab === 'Clientes' ? (
                    <div className="bg-white rounded-lg shadow p-1 mb-1">
                        <h2 className="text-xl font-bold mb-1">Resumen Comparativo</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
                            <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
                                <h3 className="text-xs font-bold text-blue-600">Deuda Actual</h3>
                                <p className="text-xs text-blue-700">
                                    ${clientes.reduce((sum, c) => sum + c.saldoActual, 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg flex justify-between items-center">
                                <h3 className="text-xs font-bold text-green-600">Deuda Anterior</h3>
                                <p className="text-xs text-green-700">
                                    ${clientes.reduce((sum, c) => sum + (c.deudaAnterior || 0), 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg flex justify-between items-center">
                                <h3 className="text-xs font-bold text-purple-600">Variación</h3>
                                <p className={`text-xs ${variacionTotal >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {variacionTotal >= 0 ? '+' : ''}${variacionTotal.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg flex justify-between items-center">
                                <h3 className="text-xs font-bold text-orange-600">% Cambio</h3>
                                <p className={`text-xs ${porcentajeVariacion >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {porcentajeVariacion >= 0 ? '+' : ''}{porcentajeVariacion.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-1 mb-1">
                        <div className="flex justify-between items-center mb-1">
                            <h2 className="text-xl font-bold">Resumen de Etiquetas</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
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

                {/* Sección de pestañas y herramientas */}
                <div className="bg-white rounded-lg shadow p-1 mb-1">
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

                    {/* Barra de herramientas para selección múltiple */}
                    {(selectedClientes.length > 0 || selectedExcelRows.length > 0) && (
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
                                            if (activeTab === 'Clientes') {
                                                setSelectedClientes([]);
                                            } else {
                                                setSelectedExcelRows([]);
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
            </div>

            {/* Contenido desplazable - TABLAS */}
            <div className="bg-white p-1 mb-1 rounded-md shadow">
                {activeTab === 'Clientes' && (
                    <div>
                        {/* Barra de búsqueda y filtros - STICKY */}
                        <div className="sticky top-0 z-40 bg-white py-2 mb-2 border-b">
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
                                    <button
                                        onClick={() => setShowFiltros(!showFiltros)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                                    >
                                        Filtros
                                    </button>
                                    <button
                                        onClick={handleDescargarComparativa}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                                    >
                                        Exportar Comparativa
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
                                        <button
                                            onClick={limpiarFiltros}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                        >
                                            Limpiar Filtros
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tabla de Clientes con Comparativa */}
                        {clientes.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No se encontraron clientes
                            </div>
                        ) : (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                {/* Encabezado de tabla STICKY */}
                                <div className="sticky top-12 z-30 bg-gray-50">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Cliente
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tipo
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Deuda Actual
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Deuda Anterior
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Variación
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tendencia
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Etiqueta
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                                
                                {/* Cuerpo de la tabla con scroll */}
                                <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {clientesFiltrados.map((cliente) => (
                                                <tr 
                                                    key={cliente.id} 
                                                    className="hover:bg-gray-50 transition duration-150 cursor-pointer"
                                                    onDoubleClick={() => handleDoubleClickCliente(cliente)}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            {cliente.tipoCliente}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        ${cliente.saldoActual.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        ${(cliente.deudaAnterior || 0).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <span className={`text-sm font-medium ${
                                                                cliente.variacion && cliente.variacion > 0 ? 'text-red-600' : 
                                                                cliente.variacion && cliente.variacion < 0 ? 'text-green-600' : 'text-gray-600'
                                                            }`}>
                                                                {cliente.variacion && cliente.variacion > 0 ? '+' : ''}${cliente.variacion?.toLocaleString()}
                                                            </span>
                                                            {cliente.porcentajeVariacion !== undefined && (
                                                                <span className={`ml-2 text-xs ${
                                                                    cliente.porcentajeVariacion > 0 ? 'text-red-500' : 
                                                                    cliente.porcentajeVariacion < 0 ? 'text-green-500' : 'text-gray-500'
                                                                }`}>
                                                                    ({cliente.porcentajeVariacion > 0 ? '+' : ''}{cliente.porcentajeVariacion.toFixed(1)}%)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            {cliente.variacion && cliente.variacion > 0 ? (
                                                                <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                                </svg>
                                                            ) : cliente.variacion && cliente.variacion < 0 ? (
                                                                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                                                                </svg>
                                                            )}
                                                            <span className="text-sm text-gray-600">
                                                                {cliente.variacion && cliente.variacion > 0 ? 'Aumentando' : 
                                                                cliente.variacion && cliente.variacion < 0 ? 'Disminuyendo' : 'Estable'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            cliente.estado === 'activo' ? 'bg-green-100 text-green-800' :
                                                            cliente.estado === 'moroso' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {cliente.estado}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {cliente.etiqueta && (
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getColorEtiqueta(cliente.etiqueta).bg} ${getColorEtiqueta(cliente.etiqueta).text}`}>
                                                                {cliente.etiqueta}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditCliente(cliente);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-900 transition duration-150"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleVerDetalleCliente(cliente);
                                                            }}
                                                            className="text-green-600 hover:text-green-900 transition duration-150"
                                                        >
                                                            Detalle
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
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
                                            disabled={isUploading || clientes.length === 0}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Subiendo...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    Subir Clientes ({clientes.length})
                                                </>
                                            )}
                                        </button>

                                        {/* Botón para subir Excel procesado */}
                                        <button
                                            onClick={handleSubirExcelProcesado}
                                            disabled={isUploading}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Procesar y Subir Excel
                                        </button>

                                        {/* Botón para sincronizar etiquetas */}
                                        <button
                                            onClick={handleSincronizarEtiquetas}
                                            disabled={isUploading || !clientes.some(cliente => cliente.etiqueta)}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Sincronizar Etiquetas
                                        </button>

                                        <button
                                            onClick={handleProcesarComparativa}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                                        >
                                            Procesar Comparativa
                                        </button>
                                        <button
                                            onClick={clearExcelData}
                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                        >
                                            Limpiar Datos
                                        </button>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-lg ">
                                    {/* Encabezado de tabla STICKY */}
                                    <div className="sticky top-10 z-20 bg-gray-50 overflow-hidden">
                                        <table className="min-w-full bg-white">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedExcelRows.length === excelData.length && excelData.length > 0}
                                                            onChange={handleSelectAllExcelRows}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </th>
                                                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Fecha Albarán
                                                    </th>
                                                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Cliente
                                                    </th>
                                                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Total Importe
                                                    </th>
                                                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Cobrado
                                                    </th>
                                                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Deuda
                                                    </th>
                                                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Paciente
                                                    </th>
                                                    <th className="px-4 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Etiqueta
                                                    </th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>

                                    {/* Cuerpo de la tabla con scroll */}
                                    <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
                                        <table className="min-w-full bg-white">
                                            <tbody className="divide-y divide-gray-200">
                                                {excelData.map((row) => (
                                                    <tr 
                                                        key={row.id} 
                                                        className="hover:bg-gray-50 transition duration-150 cursor-pointer"
                                                        onDoubleClick={() => handleDoubleClickExcel(row)}
                                                    >
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedExcelRows.includes(row.id)}
                                                                onChange={() => handleSelectExcelRow(row.id)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            {row.fechaAlbaran || '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                            {row.clienteNombre || 'Sin nombre'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            ${row.totalImporte.toLocaleString()}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-green-600 font-medium">
                                                            ${row.cobradoLinea.toLocaleString()}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-red-600 font-medium">
                                                            ${row.deuda.toLocaleString()}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            {row.paciente || '-'}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            {row.etiqueta && (
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getColorEtiqueta(row.etiqueta).bg} ${getColorEtiqueta(row.etiqueta).text}`}>
                                                                    {row.etiqueta}
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            
            {/* Modal de Detalle de Cliente */}
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
                                    {filasCliente.length} registro(s) encontrado(s) en Excel
                                    {modalDesdeExcel && ' • Desde tab Excel'}
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
                        
                        {/* Información general del cliente - Solo mostrar si no es desde Excel */}
                        {!modalDesdeExcel && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Tipo de Cliente</h3>
                                    <p className="text-lg font-semibold text-gray-800">{clienteDetallado.tipoCliente}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Límite de Crédito</h3>
                                    <p className="text-lg font-semibold text-blue-600">${clienteDetallado.limiteCredito.toLocaleString()}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Saldo Actual</h3>
                                    <p className={`text-lg font-semibold ${
                                        clienteDetallado.saldoActual > 0 ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                        ${clienteDetallado.saldoActual.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Estado / Etiqueta</h3>
                                    <div className="flex flex-col space-y-1">
                                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                            clienteDetallado.estado === 'activo' ? 'bg-green-100 text-green-800' :
                                            clienteDetallado.estado === 'moroso' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {clienteDetallado.estado}
                                        </span>
                                        {clienteDetallado.etiqueta && (
                                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getColorEtiqueta(clienteDetallado.etiqueta).bg} ${getColorEtiqueta(clienteDetallado.etiqueta).text}`}>
                                                {clienteDetallado.etiqueta}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={async () => {
                                        try {
                                            await apiService.updateDebtorsCliente(clienteDetallado.id, {
                                                etiqueta: clienteDetallado.etiqueta,
                                                saldoActual: clienteDetallado.saldoActual,
                                                estado: clienteDetallado.estado
                                            });
                                            toast.success('Cliente actualizado en el backend');
                                        } catch (err) {
                                            console.error('Error al actualizar cliente:', err);
                                            const message = err instanceof Error
                                                ? err.message
                                                : typeof err === 'string'
                                                    ? err
                                                    : JSON.stringify(err);
                                            toast.error('Error al actualizar cliente: ' + message);
                                        }
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        )}

                        {/* Resumen de las filas del cliente */}
                        {filasCliente.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-blue-600">Total Importe</h3>
                                    <p className="text-2xl font-bold text-blue-700">${totalesFilas.totalImporte.toLocaleString()}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-green-600">Total Cobrado</h3>
                                    <p className="text-2xl font-bold text-green-700">${totalesFilas.totalCobrado.toLocaleString()}</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-red-600">Total Deuda</h3>
                                    <p className="text-2xl font-bold text-red-700">${totalesFilas.totalDeuda.toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        {/* Lista de TODAS las filas de Excel del cliente */}
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
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fecha Albarán
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total Importe
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Cobrado
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Deuda
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Paciente
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Etiqueta
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filasCliente.map((fila) => (
                                                <tr key={fila.id} className="hover:bg-gray-50 transition duration-150">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {fila.fechaAlbaran || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        ${fila.totalImporte.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                                        ${fila.cobradoLinea.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                                                        ${fila.deuda.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {fila.paciente || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {fila.etiqueta && (
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getColorEtiqueta(fila.etiqueta).bg} ${getColorEtiqueta(fila.etiqueta).text}`}>
                                                                {fila.etiqueta}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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
                            
                            {/* Vista previa del color de la etiqueta */}
                            {etiquetaSeleccionada && (
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                                    <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getColorEtiqueta(etiquetaSeleccionada).bg} ${getColorEtiqueta(etiquetaSeleccionada).text}`}>
                                        {etiquetaSeleccionada}
                                    </span>
                                </div>
                            )}
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

            {/* Formulario de cliente (modal) */}
            {showForm && (
                <Modal
                    className1="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
                    className2="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6"
                    closeModal={() => setShowForm(false)}
                >
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
                        </h2>
                        <form onSubmit={selectedCliente ? handleUpdateCliente : handleCreateCliente}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo de Cliente *</label>
                                    <select
                                        name="tipoCliente"
                                        value={formData.tipoCliente}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="regular">Regular</option>
                                        <option value="preferencial">Preferencial</option>
                                        <option value="corporativo">Corporativo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Límite de Crédito *</label>
                                    <input
                                        type="number"
                                        name="limiteCredito"
                                        value={formData.limiteCredito}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Saldo Actual</label>
                                    <input
                                        type="number"
                                        name="saldoActual"
                                        value={formData.saldoActual}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                                    <select
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                        <option value="moroso">Moroso</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-yellow-500 transition duration-200"
                                >
                                    {selectedCliente ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default DebtorsMain;