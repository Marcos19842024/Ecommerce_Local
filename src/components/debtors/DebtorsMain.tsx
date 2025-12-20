import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { coloresEtiquetas, columnPatterns, totalPatterns } from '../../utils/debtors';
import { ExcelRow } from '../../interfaces/debtors.interface';
import readXlsxFile from 'read-excel-file';
import toast from 'react-hot-toast';
import Modal from '../shared/Modal';

export const DebtorsMain: React.FC = () => {
    const [excelData, setExcelData] = useState<ExcelRow[]>([]);
    const [filteredExcelData, setFilteredExcelData] = useState<ExcelRow[]>([]); // <-- Nuevo estado para datos filtrados
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedExcelRows, setSelectedExcelRows] = useState<string[]>([]);
    const [showEtiquetarModal, setShowEtiquetarModal] = useState(false);
    const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState('');
    const [showDetalleCliente, setShowDetalleCliente] = useState(false);
    const [clienteDetallado, setClienteDetallado] = useState<any>(null);
    const [filasCliente, setFilasCliente] = useState<ExcelRow[]>([]);
    const [filtroEtiquetaActivo, setFiltroEtiquetaActivo] = useState<string | null>(null); // <-- Nuevo estado para filtro

    /**
     * Función para manejar la subida de archivos Excel
     */
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

            setExcelData(processedData);
            setFilteredExcelData(processedData); // <-- Inicializar datos filtrados
            setFiltroEtiquetaActivo(null); // <-- Resetear filtro al cargar nuevo archivo

            if (processedData.length === 0) {
                toast.error('No se encontraron datos válidos en el archivo Excel');
            } else {
                toast.success(`Excel cargado - ${processedData.length} registros procesados`);
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

    /**
     * Función para filtrar por etiqueta
     */
    const handleFiltrarPorEtiqueta = (etiqueta: string) => {
        if (filtroEtiquetaActivo === etiqueta) {
            // Si ya está activo este filtro, quitarlo
            setFilteredExcelData(excelData);
            setFiltroEtiquetaActivo(null);
        } else {
            // Aplicar filtro
            const filtrados = excelData.filter(row => 
                row.etiqueta === etiqueta || (etiqueta === 'Sin etiqueta' && (!row.etiqueta || row.etiqueta.trim() === ''))
            );
            setFilteredExcelData(filtrados);
            setFiltroEtiquetaActivo(etiqueta);
        }
    };

    /**
     * Función para limpiar filtro
     */
    const handleLimpiarFiltro = () => {
        setFilteredExcelData(excelData);
        setFiltroEtiquetaActivo(null);
    };

    /**
     * Función unificada para procesar Excel y comparativa
     */
    const handleProcesarExcelYComparativa = async () => {
        try {
            if (excelData.length === 0) {
                toast.error('No hay datos de Excel para procesar');
                return;
            }

            setLoading(true);
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
            
            // Usar fecha actual como período
            const fechaActual = new Date().toISOString().split('T')[0];
            const tipoPeriodo = 'dia'; // Por defecto día
            
            const resultado = await apiService.procesarExcelComparativa(datosParaEnviar, fechaActual, tipoPeriodo);
            
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
                
            } else {
                toast.error(`❌ ${resultado.error}`);
            }
            
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            toast.error('Error al procesar Excel: ' + errorMessage);
        } finally {
            setLoading(false);
            setIsUploading(false);
        }
    };

    /**
     * Calcular resumen de etiquetas con total de deuda
     */
    const calcularResumenEtiquetas = (): { resumen: Record<string, number>, deudaPorEtiqueta: Record<string, number> } => {
        const resumen: Record<string, number> = {};
        const deudaPorEtiqueta: Record<string, number> = {};
        
        excelData.forEach(fila => {
            const etiqueta = fila.etiqueta || 'Sin etiqueta';
            resumen[etiqueta] = (resumen[etiqueta] || 0) + 1;
            deudaPorEtiqueta[etiqueta] = (deudaPorEtiqueta[etiqueta] || 0) + fila.deuda;
        });
        
        return { resumen, deudaPorEtiqueta };
    };

    /**
     * Función para obtener el color de una etiqueta
     */
    const getColorEtiqueta = (etiqueta: string) => {
        return coloresEtiquetas[etiqueta] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    };

    /**
     * Función para formatear fechas (Excel serial o ISO)
     */
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

    /**
     * Función para obtener todas las filas de Excel de un cliente
     */
    const obtenerFilasCliente = (nombreCliente: string): ExcelRow[] => {
        return excelData.filter(row => 
            row.clienteNombre?.toLowerCase().includes(nombreCliente.toLowerCase())
        );
    };

    /**
     * Manejar doble click en fila de Excel
     */
    const handleDoubleClickExcel = async (row: ExcelRow) => {
        const filasDelMismoCliente = obtenerFilasCliente(row.clienteNombre);
        
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
        
        setShowDetalleCliente(true);
    };

    /**
     * Etiquetar cliente desde el modal de detalles
     */
    const handleEtiquetarClienteDesdeModal = async () => {
        if (!clienteDetallado || !etiquetaSeleccionada) {
            toast.error('Selecciona una etiqueta');
            return;
        }

        try {
            const clienteNombre = clienteDetallado.nombre.toLowerCase();
            const nuevasFilas = excelData.map(row => {
                if (row.clienteNombre?.toLowerCase() === clienteNombre) {
                    return {
                        ...row,
                        etiqueta: etiquetaSeleccionada
                    };
                }
                return row;
            });
            
            setExcelData(nuevasFilas);
            // Actualizar también los datos filtrados si corresponde
            if (filtroEtiquetaActivo) {
                const filtrados = nuevasFilas.filter(row => 
                    row.etiqueta === filtroEtiquetaActivo || (filtroEtiquetaActivo === 'Sin etiqueta' && (!row.etiqueta || row.etiqueta.trim() === ''))
                );
                setFilteredExcelData(filtrados);
            } else {
                setFilteredExcelData(nuevasFilas);
            }
            
            // También actualizar filasCliente para el modal
            const filasActualizadas = filasCliente.map(fila => ({
                ...fila,
                etiqueta: etiquetaSeleccionada
            }));
            setFilasCliente(filasActualizadas);
            
            toast.success(`${filasCliente.length} registro(s) etiquetado(s) como ${etiquetaSeleccionada}`);
            
            setEtiquetaSeleccionada('');
            
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            toast.error('Error al etiquetar: ' + errorMessage);
        }
    };

    /**
     * Etiquetar elementos seleccionados
     */
    const handleEtiquetarElementos = async () => {
        if (!etiquetaSeleccionada) {
            toast.error('Selecciona una etiqueta');
            return;
        }

        try {
            if (selectedExcelRows.length > 0) {
                const nuevasFilas = excelData.map(row =>
                    selectedExcelRows.includes(row.id) 
                        ? { ...row, etiqueta: etiquetaSeleccionada } 
                        : row
                );
                setExcelData(nuevasFilas);
                
                // Actualizar datos filtrados
                if (filtroEtiquetaActivo) {
                    const filtrados = nuevasFilas.filter(row => 
                        row.etiqueta === filtroEtiquetaActivo || (filtroEtiquetaActivo === 'Sin etiqueta' && (!row.etiqueta || row.etiqueta.trim() === ''))
                    );
                    setFilteredExcelData(filtrados);
                } else {
                    setFilteredExcelData(nuevasFilas);
                }
                
                toast.success(`${selectedExcelRows.length} registro(s) de Excel etiquetado(s) como ${etiquetaSeleccionada}`);
                setSelectedExcelRows([]);
            } else {
                toast.error('Selecciona al menos un registro de Excel');
                return;
            }

            setShowEtiquetarModal(false);
            setEtiquetaSeleccionada('');
            
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            toast.error('Error al etiquetar: ' + errorMessage);
        }
    };

    /**
     * Manejar selección/deselección de filas de Excel
     */
    const handleSelectExcelRow = (rowId: string) => {
        setSelectedExcelRows(prev => {
            if (prev.includes(rowId)) {
                return prev.filter(id => id !== rowId);
            } else {
                return [...prev, rowId];
            }
        });
    };

    /**
     * Seleccionar/deseleccionar todas las filas de Excel
     */
    const handleSelectAllExcelRows = () => {
        if (selectedExcelRows.length === filteredExcelData.length) {
            setSelectedExcelRows([]);
        } else {
            setSelectedExcelRows(filteredExcelData.map(row => row.id));
        }
    };

    /**
     * Función para detectar si una fila es de totales
     */
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

    /**
     * Función para detectar automáticamente las columnas
     */
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

    /**
     * Calcular totales del Excel
     */
    const calculateExcelTotals = () => {
        const totalImporte = excelData.reduce((sum, row) => sum + row.totalImporte, 0);
        const totalCobrado = excelData.reduce((sum, row) => sum + row.cobradoLinea, 0);
        const totalDeuda = excelData.reduce((sum, row) => sum + row.deuda, 0);
        
        return { totalImporte, totalCobrado, totalDeuda };
    };

    /**
     * Limpiar datos de Excel
     */
    const clearExcelData = () => {
        setExcelData([]);
        setFilteredExcelData([]);
        setFiltroEtiquetaActivo(null);
    };

    /**
     * Obtener elementos seleccionados actualmente
     */
    const getElementosSeleccionados = () => {
        return {
            count: selectedExcelRows.length,
            type: 'registros de Excel'
        };
    };

    /**
     * Formatear fecha para display
     */
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
                <div className="border-b border-gray-200 mb-2">
                    <div className="flex items-center space-x-4 py-2">
                        <h1 className="text-xl font-bold text-gray-800">Gestión de Excel</h1>
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
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Procesando archivo...
                            </div>
                        )}
                    </div>
                </div>
            
                {/* Totales del Excel - Solo se muestra cuando hay datos */}
                {excelData.length > 0 && (
                    <div className="bg-green-50 p-1 mb-1 rounded-md shadow">
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

                {/* Resumen de Etiquetas */}
                {excelData.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-1 mb-1">
                        <div className="flex justify-between items-center mb-1">
                            <h2 className="text-xl font-bold">Resumen de Etiquetas</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-2">
                            {Object.entries(resumenEtiquetas).map(([etiqueta, count]) => {
                                const isActive = filtroEtiquetaActivo === etiqueta;
                                return (
                                    <div 
                                        key={etiqueta} 
                                        onClick={() => handleFiltrarPorEtiqueta(etiqueta)}
                                        className={`p-2 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                                            isActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                                        } ${
                                            etiqueta === 'Sin etiqueta' 
                                                ? 'bg-gray-50 border-gray-200 text-xs font-bold flex justify-between items-center hover:bg-gray-100' 
                                                : `${getColorEtiqueta(etiqueta).bg} border-transparent text-xs font-bold hover:opacity-90`
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

                                                {isActive && (
                                                    <div className="text-xs text-blue-600 font-medium mt-1">
                                                        ✓ Filtrado
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Barra de herramientas para selección múltiple */}
                {selectedExcelRows.length > 0 && (
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
                                    onClick={() => setSelectedExcelRows([])}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Contenido desplazable - TABLA DE EXCEL */}
            <div className="bg-white p-1 mb-1 rounded-md shadow">
                {filteredExcelData.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            {excelData.length === 0 ? 'Sin datos de Excel' : 'No hay registros con este filtro'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {excelData.length === 0 
                                ? 'Sube un archivo Excel para ver los datos aquí.' 
                                : 'No se encontraron registros con la etiqueta seleccionada.'}
                        </p>
                        {filtroEtiquetaActivo && (
                            <button
                                onClick={handleLimpiarFiltro}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                Limpiar filtro y ver todos
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Botones de acciones - STICKY */}
                        <div className="sticky top-10 z-20 bg-white p-1 mb-1 rounded-md shadow">
                            <div className="flex flex-row space-x-2">
                                <button
                                    onClick={handleProcesarExcelYComparativa}
                                    disabled={isUploading || excelData.length === 0}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    {isUploading ? 'Procesando...' : `Procesar Excel (${excelData.length})`}
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
                                                checked={selectedExcelRows.length === filteredExcelData.length && filteredExcelData.length > 0}
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
                                    {filteredExcelData.map((row) => (
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
                                                {formatDateForDisplay(row.fechaAlbaran) || '-'}
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
            
            {/* Modal de Detalle de Cliente */}
            {showDetalleCliente && clienteDetallado && (
                <Modal
                    className1="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
                    className2="relative bg-white rounded-lg shadow-lg max-w-7xl w-full p-6 max-h-[90vh] overflow-y-auto"
                    closeModal={() => {
                        setShowDetalleCliente(false);
                    }}
                >
                    <div className="bg-white rounded-lg p-6 w-full">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Registros del Cliente: {clienteDetallado.nombre}
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    Vista de registros en Excel
                                </p>
                            </div>
                            
                            {/* Sección de etiquetado en el modal */}
                            <div className="flex items-center space-x-3">
                                <select
                                    value={etiquetaSeleccionada}
                                    onChange={(e) => setEtiquetaSeleccionada(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Etiquetar registros...</option>
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
                                                            {formatDateForDisplay(fila.fechaAlbaran) || '-'}
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
        </div>
    );
};

export default DebtorsMain;