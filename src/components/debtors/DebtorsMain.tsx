// components/debtors/DebtorsMain.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useDebtors } from '../../hooks/useDebtors';
import { descargarCSV, exportarACSV } from '../../utils/export.debtors';
import { TipoCliente } from '../../interfaces/deptors.interface';
import { CATEGORIAS, CategoriaType } from '../../utils/debtors';

export const DebtorsMain: React.FC = () => {
    const { 
        agregarCliente, 
        obtenerCliente, 
        generarReportes, 
        obtenerMetricas,
        registrarMovimiento,
        sincronizarDatos,
        cargando,
        error,
        conectado
    } = useDebtors();

    const [nuevoCliente, setNuevoCliente] = useState({
        nombre: '',
        tipoCliente: TipoCliente.RECEPCION as TipoCliente,
        limiteCredito: 5000
    });

    const [movimiento, setMovimiento] = useState({
        cliente: '',
        monto: '',
        concepto: '',
        categoria: '' as CategoriaType,
        mascota: '',
        tipo: 'CONSUMO' as 'CONSUMO' | 'ABONO'
    });

    const [reportePeriodo, setReportePeriodo] = useState({
        año: new Date().getFullYear(),
        mes: new Date().getMonth() + 1
    });

    const [clienteConsulta, setClienteConsulta] = useState('');
    const [resultadoConsulta, setResultadoConsulta] = useState<any>(null);
    const [metricasGlobales, setMetricasGlobales] = useState<any>(null);
    const [mensaje, setMensaje] = useState<string>('');

    // Mostrar mensajes temporales
    useEffect(() => {
        if (mensaje) {
            const timer = setTimeout(() => setMensaje(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [mensaje]);

    // 🔧 MANEJO DE CLIENTES
    const handleAgregarCliente = useCallback(async () => {
        if (!nuevoCliente.nombre.trim()) {
            setMensaje('❌ El nombre del cliente es requerido');
            return;
        }

        const resultado = await agregarCliente(
            nuevoCliente.nombre,
            nuevoCliente.tipoCliente,
            nuevoCliente.limiteCredito
        );
        
        setMensaje(resultado);
        if (resultado.startsWith('✅')) {
            setNuevoCliente({ nombre: '', tipoCliente: TipoCliente.RECEPCION, limiteCredito: 5000 });
        }
    }, [nuevoCliente, agregarCliente]);

    const handleConsultarCliente = useCallback(() => {
        const cliente = obtenerCliente(clienteConsulta);
        setResultadoConsulta(cliente);
        if (!cliente) {
            setMensaje('❌ Cliente no encontrado');
        } else {
            setMensaje(`✅ Cliente encontrado: ${cliente.cliente.cliente}`);
        }
    }, [clienteConsulta, obtenerCliente]);

    // 💰 MANEJO DE MOVIMIENTOS
    const handleRegistrarMovimiento = useCallback(async () => {
        if (!movimiento.cliente.trim()) {
            setMensaje('❌ El nombre del cliente es requerido');
            return;
        }

        const monto = parseFloat(movimiento.monto);
        if (isNaN(monto) || monto <= 0) {
            setMensaje('❌ Monto inválido');
            return;
        }

        let resultado: string;

        if (movimiento.tipo === 'CONSUMO') {
            if (!movimiento.concepto.trim() || !movimiento.categoria) {
                setMensaje('❌ Concepto y categoría son requeridos para consumos');
                return;
            }

            resultado = await registrarMovimiento(
                movimiento.cliente,
                'CONSUMO',
                monto,
                movimiento.concepto,
                movimiento.categoria,
                movimiento.mascota || undefined
            );
        } else {
            resultado = await registrarMovimiento(
                movimiento.cliente,
                'ABONO',
                monto
            );
        }

        setMensaje(resultado);
        if (resultado.startsWith('✅')) {
            setMovimiento({
                cliente: '',
                monto: '',
                concepto: '',
                categoria: '' as CategoriaType,
                mascota: '',
                tipo: 'CONSUMO'
            });
        }
    }, [movimiento, registrarMovimiento]);

    // 📊 GENERACIÓN DE REPORTES
    const handleGenerarReportes = useCallback(() => {
        const reportes = generarReportes(reportePeriodo.año, reportePeriodo.mes);
        
        if (reportes.size === 0) {
            setMensaje('❌ No hay datos para generar reportes');
            return;
        }

        reportes.forEach((reporte, tipoCliente) => {
            const csv = exportarACSV(reporte);
            const nombreArchivo = `reporte_${tipoCliente.toLowerCase()}_${reportePeriodo.año}_${reportePeriodo.mes.toString().padStart(2, '0')}.csv`;
            descargarCSV(csv, nombreArchivo);
        });

        setMensaje(`✅ Reportes exportados para ${reportePeriodo.mes}/${reportePeriodo.año}`);
    }, [reportePeriodo, generarReportes]);

    const handleObtenerMetricas = useCallback(() => {
        const metricas = obtenerMetricas(reportePeriodo.año, reportePeriodo.mes);
        setMetricasGlobales(metricas);
        setMensaje('✅ Métricas actualizadas');
    }, [reportePeriodo, obtenerMetricas]);

    if (cargando) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando datos del servidor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                
                {/* HEADER CON ESTADO DE CONEXIÓN */}
                <header className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">🏥 Sistema de Gestión de Crédito</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={`w-3 h-3 rounded-full ${conectado ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <p className="text-gray-600">
                                    {conectado ? 'Conectado al servidor' : 'Modo sin conexión'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={sincronizarDatos}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2 transition-colors"
                        >
                            🔄 Sincronizar
                        </button>
                    </div>
                </header>

                {/* MENSAJES Y ERRORES */}
                {(error || mensaje) && (
                    <div className={`mb-4 p-4 rounded ${
                        error ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'
                    }`}>
                        {error || mensaje}
                    </div>
                )}

                {/* INDICADOR DE MODO SIN CONEXIÓN */}
                {!conectado && (
                    <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded border border-yellow-300">
                        ⚠️ <strong>Modo sin conexión:</strong> Los datos se guardarán localmente y se sincronizarán cuando se restablezca la conexión.
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* 👥 SECCIÓN GESTIÓN DE CLIENTES */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">👥 Gestión de Clientes</h2>
                        
                        {/* Formulario agregar cliente */}
                        <div className="space-y-4 mb-6">
                            <h3 className="font-medium">Agregar Nuevo Cliente</h3>
                            <input
                                type="text"
                                placeholder="Nombre del cliente *"
                                value={nuevoCliente.nombre}
                                onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                            />
                            <select
                                value={nuevoCliente.tipoCliente}
                                onChange={(e) => setNuevoCliente({...nuevoCliente, tipoCliente: e.target.value as TipoCliente})}
                                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                            >
                                {Object.values(TipoCliente).map(tipo => (
                                    <option key={tipo} value={tipo}>{tipo}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Límite de crédito"
                                value={nuevoCliente.limiteCredito}
                                onChange={(e) => setNuevoCliente({...nuevoCliente, limiteCredito: Number(e.target.value)})}
                                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                            />
                            <button
                                onClick={handleAgregarCliente}
                                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
                            >
                                Agregar Cliente
                            </button>
                        </div>

                        {/* Consultar cliente */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Consultar Cliente</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nombre del cliente"
                                    value={clienteConsulta}
                                    onChange={(e) => setClienteConsulta(e.target.value)}
                                    className="flex-1 p-2 border rounded focus:border-blue-500 focus:outline-none"
                                />
                                <button
                                    onClick={handleConsultarCliente}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                >
                                    Consultar
                                </button>
                            </div>
                            
                            {resultadoConsulta && (
                                <div className="mt-4 p-4 bg-gray-100 rounded border">
                                    <h4 className="font-semibold text-lg mb-2">Cliente: {resultadoConsulta.cliente.cliente}</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div><strong>Tipo:</strong> {resultadoConsulta.tipo}</div>
                                        <div><strong>Saldo Actual:</strong> ${resultadoConsulta.cliente.obtenerSaldoActual().toFixed(2)}</div>
                                        <div><strong>Límite:</strong> ${resultadoConsulta.cliente.limiteCredito.toFixed(2)}</div>
                                        <div><strong>Disponible:</strong> ${(resultadoConsulta.cliente.limiteCredito - resultadoConsulta.cliente.obtenerSaldoActual()).toFixed(2)}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 💰 SECCIÓN MOVIMIENTOS */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">💰 Registro de Movimientos</h2>
                        
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Cliente *"
                                value={movimiento.cliente}
                                onChange={(e) => setMovimiento({...movimiento, cliente: e.target.value})}
                                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                            />
                            
                            <div className="flex gap-2">
                                <select
                                    value={movimiento.tipo}
                                    onChange={(e) => setMovimiento({...movimiento, tipo: e.target.value as 'CONSUMO' | 'ABONO'})}
                                    className="flex-1 p-2 border rounded focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="CONSUMO">Consumo</option>
                                    <option value="ABONO">Abono</option>
                                </select>
                                
                                <input
                                    type="number"
                                    placeholder="Monto *"
                                    value={movimiento.monto}
                                    onChange={(e) => setMovimiento({...movimiento, monto: e.target.value})}
                                    className="flex-1 p-2 border rounded focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            {movimiento.tipo === 'CONSUMO' && (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Concepto *"
                                        value={movimiento.concepto}
                                        onChange={(e) => setMovimiento({...movimiento, concepto: e.target.value})}
                                        className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                                    />
                                    
                                    <select
                                        value={movimiento.categoria}
                                        onChange={(e) => setMovimiento({...movimiento, categoria: e.target.value as CategoriaType})}
                                        className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="">Seleccionar categoría *</option>
                                        {Object.entries(CATEGORIAS).map(([categoria, servicios]) => (
                                            <option key={categoria} value={categoria}>
                                                {categoria} - {servicios[0]}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    <input
                                        type="text"
                                        placeholder="Mascota (opcional)"
                                        value={movimiento.mascota}
                                        onChange={(e) => setMovimiento({...movimiento, mascota: e.target.value})}
                                        className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                                    />
                                </>
                            )}

                            <button
                                onClick={handleRegistrarMovimiento}
                                className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition-colors"
                            >
                                Registrar Movimiento
                            </button>
                        </div>
                    </div>

                    {/* 📊 SECCIÓN REPORTES */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">📊 Reportes y Métricas</h2>
                        
                        <div className="space-y-4 mb-6">
                            <h3 className="font-medium">Generar Reportes</h3>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Año"
                                    value={reportePeriodo.año}
                                    onChange={(e) => setReportePeriodo({...reportePeriodo, año: Number(e.target.value)})}
                                    className="flex-1 p-2 border rounded focus:border-blue-500 focus:outline-none"
                                />
                                <input
                                    type="number"
                                    placeholder="Mes"
                                    min="1"
                                    max="12"
                                    value={reportePeriodo.mes}
                                    onChange={(e) => setReportePeriodo({...reportePeriodo, mes: Number(e.target.value)})}
                                    className="flex-1 p-2 border rounded focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={handleGenerarReportes}
                                    className="flex-1 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors"
                                >
                                    Exportar Reportes CSV
                                </button>
                                <button
                                    onClick={handleObtenerMetricas}
                                    className="flex-1 bg-teal-500 text-white py-2 rounded hover:bg-teal-600 transition-colors"
                                >
                                    Obtener Métricas
                                </button>
                            </div>
                        </div>

                        {/* Métricas globales */}
                        {metricasGlobales && (
                            <div className="mt-4 p-4 bg-gray-100 rounded border">
                                <h4 className="font-semibold mb-2">📈 Métricas Globales</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                    <div className="font-semibold">Total Clientes: <span className="text-blue-600">{metricasGlobales.totalClientes}</span></div>
                                    <div className="font-semibold">Total Adeudo: <span className="text-red-600">${metricasGlobales.totalAdeudo.toFixed(2)}</span></div>
                                    <div className="font-semibold">Total Consumos: <span className="text-orange-600">${metricasGlobales.totalConsumos.toFixed(2)}</span></div>
                                    <div className="font-semibold">Total Abonos: <span className="text-green-600">${metricasGlobales.totalAbonos.toFixed(2)}</span></div>
                                </div>
                                
                                <h5 className="font-medium mb-2">Por Tipo de Cliente:</h5>
                                {Object.entries(metricasGlobales.porTipo).map(([tipo, datos]: [string, any]) => (
                                    <div key={tipo} className="mt-2 p-2 bg-white rounded border">
                                        <h6 className="font-medium text-sm">{tipo}</h6>
                                        <div className="text-xs grid grid-cols-3 gap-1 mt-1">
                                            <span>Clientes: {datos.totalClientes}</span>
                                            <span>Adeudo: ${datos.totalAdeudo.toFixed(2)}</span>
                                            <span>Consumos: ${datos.totalConsumos.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ℹ️ INFORMACIÓN DEL SISTEMA */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">ℹ️ Información del Sistema</h2>
                        
                        <div className="space-y-3 text-sm">
                            <div className="p-3 bg-blue-50 rounded border border-blue-200">
                                <h4 className="font-semibold text-blue-800">👥 Tipos de Cliente</h4>
                                <ul className="mt-1 text-blue-700">
                                    {Object.values(TipoCliente).map(tipo => (
                                        <li key={tipo}>• {tipo}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="p-3 bg-green-50 rounded border border-green-200">
                                <h4 className="font-semibold text-green-800">🏷️ Categorías Disponibles</h4>
                                <div className="mt-1 text-green-700 grid grid-cols-2 gap-1">
                                    {Object.keys(CATEGORIAS).map(categoria => (
                                        <div key={categoria}>• {categoria}</div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                                <h4 className="font-semibold text-yellow-800">💡 Funcionalidades</h4>
                                <ul className="mt-1 text-yellow-700">
                                    <li>• Gestión completa de clientes</li>
                                    <li>• Control de límites de crédito</li>
                                    <li>• Registro de consumos y abonos</li>
                                    <li>• Reportes detallados por tipo de cliente</li>
                                    <li>• Exportación a CSV</li>
                                    <li>• Métricas y análisis</li>
                                    <li>• Persistencia en backend</li>
                                    <li>• Modo sin conexión</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebtorsMain;