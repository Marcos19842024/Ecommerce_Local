import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Cliente, ExcelRow, MetricasGlobales, ResumenEtiquetas } from '../../interfaces/debtors.interface';
import readXlsxFile from 'read-excel-file';
import toast from 'react-hot-toast';
import Modal from '../shared/Modal';
import coloresEtiquetas from '../../utils/debtors';

export const DebtorsMain: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [excelData, setExcelData] = useState<ExcelRow[]>([]);
    const [metricas, setMetricas] = useState<MetricasGlobales | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'Clientes' | 'Excel'>('Clientes');
    const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
    const [selectedExcelRows, setSelectedExcelRows] = useState<string[]>([]);
    const [showDetalleCliente, setShowDetalleCliente] = useState(false);
    const [clienteDetallado, setClienteDetallado] = useState<Cliente | null>(null);
    const [showEtiquetarModal, setShowEtiquetarModal] = useState(false);
    const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState('');
    const [filasCliente, setFilasCliente] = useState<ExcelRow[]>([]);
    const [modalDesdeExcel, setModalDesdeExcel] = useState(false);

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

    // Calcular resumen de etiquetas
    const calcularResumenEtiquetas = (): ResumenEtiquetas => {
        const resumen: ResumenEtiquetas = {};
        
        if (activeTab === 'Clientes') {
            // Contar etiquetas de clientes
            clientes.forEach(cliente => {
                const etiqueta = cliente.etiqueta || 'Sin etiqueta';
                resumen[etiqueta] = (resumen[etiqueta] || 0) + 1;
            });
        } else {
            // Contar etiquetas de filas de Excel
            excelData.forEach(fila => {
                const etiqueta = fila.etiqueta || 'Sin etiqueta';
                resumen[etiqueta] = (resumen[etiqueta] || 0) + 1;
            });
        }
        
        return resumen;
    };

    // Función para descargar PDF (placeholder por ahora)
    const handleDescargarPDF = () => {
        toast.success('Funcionalidad de descarga PDF en desarrollo');
        // Aquí se implementará la lógica de generación de PDF
        console.log('Descargando PDF...');
    };

    // Función para obtener todas las filas de Excel de un cliente
    const obtenerFilasCliente = (nombreCliente: string): ExcelRow[] => {
        return excelData.filter(row => 
            row.clienteNombre.toLowerCase().includes(nombreCliente.toLowerCase())
        );
    };

    // Función para cargar TODOS los datos de un cliente
    const cargarDetallesCliente = async (cliente: Cliente) => {
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

    // Obtener el resumen de etiquetas actual
    const resumenEtiquetas = calcularResumenEtiquetas();

    // Manejar doble click en cliente (desde tab Clientes)
    const handleDoubleClickCliente = async (cliente: Cliente) => {
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

    // Manejar selección/deselección de clientes
    const handleSelectCliente = (clienteId: string) => {
        setSelectedClientes(prev => {
            if (prev.includes(clienteId)) {
                return prev.filter(id => id !== clienteId);
            } else {
                return [...prev, clienteId];
            }
        });
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

    // Seleccionar/deseleccionar todos los clientes
    const handleSelectAllClientes = () => {
        if (selectedClientes.length === clientes.length) {
            setSelectedClientes([]);
        } else {
            setSelectedClientes(clientes.map(cliente => cliente.id));
        }
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

    // Eliminar cliente
    const handleDeleteCliente = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) return;
        
        try {
            await apiService.deleteDebtorsCliente(id);
            await loadInitialData();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError('Error al eliminar cliente: ' + errorMessage);
        }
    };

    // Editar cliente
    const handleEditCliente = (cliente: Cliente) => {
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
            const resultado = await apiService.getDebtorsClienteByNombre(nombre);
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
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Sección fija superior */}
            <div className="sticky top-0 bg-gray-50 pt-6 pb-4 z-10">
                <header className="mb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Sistema de Gestión de Crédito</h1>
                            <p className="text-gray-600 mt-2">Administra tus clientes y controla la cartera de crédito</p>
                        </div>
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
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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

                {/* Resumen de Etiquetas */}
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-bold">Resumen de Etiquetas</h2>
                        <span className="text-sm text-gray-500">
                            Total {activeTab === 'Clientes' ? clientes.length : excelData.length} elementos
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {Object.entries(resumenEtiquetas).map(([etiqueta, count]) => (
                            <div 
                                key={etiqueta} 
                                className={`p-3 rounded-lg border ${
                                    etiqueta === 'Sin etiqueta' 
                                        ? 'bg-gray-50 border-gray-200' 
                                        : `${getColorEtiqueta(etiqueta).bg} border-transparent`
                                }`}
                            >
                                <div className={`text-sm font-medium ${
                                    etiqueta === 'Sin etiqueta' 
                                        ? 'text-gray-600' 
                                        : getColorEtiqueta(etiqueta).text
                                }`}>
                                    {etiqueta}
                                </div>
                                <div className={`text-2xl font-bold ${
                                    etiqueta === 'Sin etiqueta' 
                                        ? 'text-gray-800' 
                                        : getColorEtiqueta(etiqueta).text
                                }`}>
                                    {count}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sección de carga de Excel */}
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
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

                        {excelData.length > 0 && (
                            <button
                                onClick={clearExcelData}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                            >
                                Limpiar Datos
                            </button>
                        )}
                    </div>

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

                    {/* Barra de herramientas para selección múltiple */}
                    {(selectedClientes.length > 0 || selectedExcelRows.length > 0) && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
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

                    {/* Totales del Excel - Solo se muestra cuando hay datos */}
                    {excelData.length > 0 && activeTab === 'Excel' && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
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
                </div>
            </div>

            {/* Contenido desplazable */}
            <div className="bg-white rounded-lg shadow mb-6">
                {activeTab === 'Clientes' && (
                    <div>
                        {/* Tabla de clientes */}
                        {clientes.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No se encontraron clientes
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                    <div className="flex-1 max-w-md">
                                        <input
                                            type="text"
                                            placeholder="Buscar cliente por nombre..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            onChange={(e) => handleSearchCliente(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="overflow-hidden border border-gray-200 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedClientes.length === clientes.length && clientes.length > 0}
                                                        onChange={handleSelectAllClientes}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Cliente
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tipo
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Límite Crédito
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Saldo Actual
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
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {clientes.map((cliente) => (
                                                <tr 
                                                    key={cliente.id} 
                                                    className="hover:bg-gray-50 transition duration-150 cursor-pointer"
                                                    onDoubleClick={() => handleDoubleClickCliente(cliente)}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedClientes.includes(cliente.id)}
                                                            onChange={() => handleSelectCliente(cliente.id)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            {cliente.tipoCliente}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        ${cliente.limiteCredito.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        ${cliente.saldoActual.toLocaleString()}
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
                                                                handleDeleteCliente(cliente.id);
                                                            }}
                                                            className="text-red-600 hover:text-red-900 transition duration-150"
                                                        >
                                                            Eliminar
                                                        </button>
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
                    <div>
                        {excelData.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Sin datos de Excel</h3>
                                <p className="mt-1 text-sm text-gray-500">Sube un archivo Excel para ver los datos aquí.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-50">
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
                        )}
                    </div>
                )}
            </div>

            {/* Modal de Detalle de Cliente con TODAS sus filas de Excel - FUNCIONAL EN AMBOS TABS */}
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