import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { pdf } from '@react-pdf/renderer';
import { ChecklistData, ChecklistItem, ChecklistSupervisionProps } from '../../interfaces/readbill.interface';
import { PdfChecklist } from './PdfCheckList';
import toast from 'react-hot-toast';

// Datos del checklist
const CHECKLIST_TEMPLATE: Omit<ChecklistItem, 'id' | 'cumplimiento' | 'observaciones'>[] = [
    // RECEPCIÓN
    { area: 'RECEPCIÓN', aspecto: 'Frente limpio' },
    { area: 'RECEPCIÓN', aspecto: 'Puertas de entrada limpias' },
    { area: 'RECEPCIÓN', aspecto: 'Puerta de consultorio limpia' },
    { area: 'RECEPCIÓN', aspecto: 'Puerta de acceso a las demás áreas limpia' },
    { area: 'RECEPCIÓN', aspecto: 'Anaqueles ordenados' },
    { area: 'RECEPCIÓN', aspecto: 'Mueble de recepción libre (encima)' },
    { area: 'RECEPCIÓN', aspecto: 'Compañeros con buen porte' },
    { area: 'RECEPCIÓN', aspecto: 'Sala de espera limpia y olorosa' },
    { area: 'RECEPCIÓN', aspecto: 'Televisión y cuadros sin polvo' },
    { area: 'RECEPCIÓN', aspecto: 'Ventana de sala de espera limpia' },
    { area: 'RECEPCIÓN', aspecto: 'Báscula limpia y desinfectada' },
    { area: 'RECEPCIÓN', aspecto: 'Mueble de recepción ordenado' },
    { area: 'RECEPCIÓN', aspecto: 'Bolsas y articulos personales guardados debidamente' },
    { area: 'RECEPCIÓN', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'RECEPCIÓN', aspecto: 'Cambio en caja' },
    { area: 'RECEPCIÓN', aspecto: 'Corte de caja realizado' },
    { area: 'RECEPCIÓN', aspecto: 'Sin problemas de red' },
    { area: 'RECEPCIÓN', aspecto: 'Computadoras, terminales e impresoras habilitadas' },
    { area: 'RECEPCIÓN', aspecto: 'Celular con carga al 100%' },
    { area: 'RECEPCIÓN', aspecto: 'Baño del cuartito limpio' },

    // CONSULTORIO
    { area: 'CONSULTORIO', aspecto: 'Consultorio limpio y oloroso' },
    { area: 'CONSULTORIO', aspecto: 'Mesa limpia y desinfectada' },
    { area: 'CONSULTORIO', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'CONSULTORIO', aspecto: 'Escritorio libre' },
    { area: 'CONSULTORIO', aspecto: 'Libros acomodados' },
    { area: 'CONSULTORIO', aspecto: 'Tarja limpia' },
    { area: 'CONSULTORIO', aspecto: 'Abastecido de material (jeringas, alcohol, torundas)' },
    { area: 'CONSULTORIO', aspecto: 'Cajonera ordenada' },
    { area: 'CONSULTORIO', aspecto: 'Ventana y puerta limpias' },
    { area: 'CONSULTORIO', aspecto: 'Libre de portaobjetos sucios' },
    { area: 'CONSULTORIO', aspecto: 'Cajonera escritorio ordenada' },
    { area: 'CONSULTORIO', aspecto: 'Computadora e impresora habilitada' },
    { area: 'CONSULTORIO', aspecto: 'Sin problemas de red' },

    // HOSPITAL
    { area: 'HOSPITAL', aspecto: 'Limpieza de escaleras' },
    { area: 'HOSPITAL', aspecto: 'Patio limpio y ordenado' },
    { area: 'HOSPITAL', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'HOSPITAL', aspecto: 'Puertas y ventanas limpias' },
    { area: 'HOSPITAL', aspecto: 'Área de exploración ordenada y limpia' },
    { area: 'HOSPITAL', aspecto: 'Mesa y estanterias ordenadas' },
    { area: 'HOSPITAL', aspecto: 'Área de hospitalizados limpio y ordenado' },
    { area: 'HOSPITAL', aspecto: 'Baño limpio y ordenado' },
    { area: 'HOSPITAL', aspecto: 'Jaulas limpias y desinfectadas' },
    { area: 'HOSPITAL', aspecto: 'Balcon limpio' },
    { area: 'HOSPITAL', aspecto: 'Tarja limpia y organizada' },
    { area: 'HOSPITAL', aspecto: 'Area de Rx limpia' },
    { area: 'HOSPITAL', aspecto: 'Quirofano limpio y organizado' },
    { area: 'HOSPITAL', aspecto: 'Computadora, radio, equipo de Rx y laboratorio con total funcionalidad' },
    { area: 'HOSPITAL', aspecto: 'Luces y lamparas funcionales' },
    { area: 'HOSPITAL', aspecto: 'Climas y ventiladores funcionales' },

    // ESTÉTICA
    { area: 'ESTÉTICA', aspecto: 'Patios limpios' },
    { area: 'ESTÉTICA', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'ESTÉTICA', aspecto: 'Jaulas limpias y desinfectadas' },
    { area: 'ESTÉTICA', aspecto: 'Barra limpia' },
    { area: 'ESTÉTICA', aspecto: 'Puertas y cristales limpios' },
    { area: 'ESTÉTICA', aspecto: 'Mesa de corte ordenada' },
    { area: 'ESTÉTICA', aspecto: 'Carrito de material limpio y ordenado' },
    { area: 'ESTÉTICA', aspecto: 'Radio limpio y funcional' },
    { area: 'ESTÉTICA', aspecto: 'Tinas limpias y funcionales' },
    { area: 'ESTÉTICA', aspecto: 'Baño limpio y ordenado' },
    { area: 'ESTÉTICA', aspecto: 'Ventiladores y luces funcionales' },
    { area: 'ESTÉTICA', aspecto: 'Bombas y maquinas de rasurado funcionales' },
    { area: 'ESTÉTICA', aspecto: 'Material de uso con stock' },

    // PENSÍÓN
    { area: 'PENSIÓN', aspecto: 'Jaulas limpias y desinfectadas' },
    { area: 'PENSIÓN', aspecto: 'Patios de recreo limpios' },
    { area: 'PENSIÓN', aspecto: 'Accesorios de mascotas ordenados' },
    { area: 'PENSIÓN', aspecto: 'Platos de casa limpios' },
    { area: 'PENSIÓN', aspecto: 'Ventiladores funcionales' },
    { area: 'PENSIÓN', aspecto: 'Luces funcionales' },
    { area: 'PENSIÓN', aspecto: 'Puerta limpia y funcional' },
    { area: 'PENSIÓN', aspecto: 'Jardín podado y organizado' },

    // TRANSPORTE
    { area: 'TRANSPORTE', aspecto: 'Limpia y olorosa' },
    { area: 'TRANSPORTE', aspecto: 'Tapete limpio libre de orines' },
    { area: 'TRANSPORTE', aspecto: 'Jaulas limpias y desinfectadas' },
    { area: 'TRANSPORTE', aspecto: 'Limpieza de carroceria' },
    { area: 'TRANSPORTE', aspecto: 'Llantas funcionales' },
    { area: 'TRANSPORTE', aspecto: 'Puertas funcionales' },
    { area: 'TRANSPORTE', aspecto: 'Luces funcionales' },
    { area: 'TRANSPORTE', aspecto: 'Clima y ventanas funcionales' },
    { area: 'TRANSPORTE', aspecto: 'Material a usar listo (perfume, lapiceros, tarjetas de presentacion)' },
    { area: 'TRANSPORTE', aspecto: 'Cochera limpia' },
    { area: 'TRANSPORTE', aspecto: 'Portón funcional' },

    // OFICINA
    { area: 'OFICINA', aspecto: 'Puertas y ventanas limpias' },
    { area: 'OFICINA', aspecto: 'Escritorios libres y organizados' },
    { area: 'OFICINA', aspecto: 'Equipos de computo e impresoras funcionales' },
    { area: 'OFICINA', aspecto: 'Ventiladores limpios y funcionales' },
    { area: 'OFICINA', aspecto: 'Baño limpio y ordenado' },
    { area: 'OFICINA', aspecto: 'Refrigeradores limpios' },
    { area: 'OFICINA', aspecto: 'Comedor recogido y limpio' },

    // BODEGA
    { area: 'BODEGA', aspecto: 'Escritorio libre y organizado' },
    { area: 'BODEGA', aspecto: 'Estanterias organizadas' },
    { area: 'BODEGA', aspecto: 'Stock de recursos' },
    { area: 'BODEGA', aspecto: 'Medicamentos y material ordenados' },
];

export const CheckList: React.FC<ChecklistSupervisionProps> = ({ employee, onClose }) => {
    const [formData, setFormData] = useState<ChecklistData>({
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        responsable: employee?.name || '',
        supervisor: '',
        items: CHECKLIST_TEMPLATE.map((item, index) => ({
            id: `item-${index}`,
            ...item,
            cumplimiento: '',
            observaciones: ''
        })),
        comentariosAdicionales: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [currentArea, setCurrentArea] = useState<string>('RECEPCIÓN');

    // Agrupar items por área
    const itemsByArea = formData.items.reduce((acc, item) => {
        if (!acc[item.area]) {
            acc[item.area] = [];
        }
        acc[item.area].push(item);
        return acc;
    }, {} as Record<string, ChecklistItem[]>);

    const areas = Object.keys(itemsByArea);

    // Cargar datos existentes
    useEffect(() => {
        const loadExistingData = async () => {
            if (!employee?.name) return;

            try {
                setIsLoading(true);
                const existingData = await apiService.getEmployeeFile(employee.name, 'Checklist Supervision.json');
                if (existingData) {
                    setFormData(existingData);
                }
            } catch (error) {
                // Si no existe el archivo, se mantienen los datos iniciales
                console.log('No se encontró checklist existente, usando plantilla');
            } finally {
                setIsLoading(false);
            }
        };

        loadExistingData();
    }, [employee?.name]);

    const handleInputChange = (field: keyof ChecklistData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleItemChange = (itemId: string, field: 'cumplimiento' | 'observaciones', value: string) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === itemId ? { ...item, [field]: value } : item
            )
        }));
    };

    const calculateProgress = (area?: string) => {
        const itemsToCheck = area 
        ? formData.items.filter(item => item.area === area)
        : formData.items;
        
        const completed = itemsToCheck.filter(item => item.cumplimiento !== '').length;
        return itemsToCheck.length > 0 ? (completed / itemsToCheck.length) * 100 : 0;
    };

    const getAreaStats = (area: string) => {
        const areaItems = itemsByArea[area];
        const total = areaItems.length;
        const bueno = areaItems.filter(item => item.cumplimiento === 'bueno').length;
        const regular = areaItems.filter(item => item.cumplimiento === 'regular').length;
        const malo = areaItems.filter(item => item.cumplimiento === 'malo').length;
        
        return { total, bueno, regular, malo };
    };

    const handleSave = async () => {
        try {
            if (!employee?.name) {
                toast.error('No se ha especificado un empleado');
                return;
            }

            setIsLoading(true);

            // Validar que todos los campos requeridos estén completos
            if (!formData.responsable || !formData.supervisor) {
                toast.error('Complete los campos de responsable y supervisor');
                return;
            }

            // Generar PDF
            const blob = await pdf(<PdfChecklist data={formData} />).toBlob();
            
            // Crear FormData para enviar ambos archivos
            const formDataUpload = new FormData();
            formDataUpload.append('file', blob, "Checklist Supervision.pdf");
            formDataUpload.append('jsonData', JSON.stringify(formData, null, 2));
            
            // Subir archivos
            await apiService.uploadEmployeeFile(employee.name, formDataUpload);

            toast.success('Checklist de supervisión guardado correctamente');
            onClose?.();
        } catch (error) {
            console.error('Error saving checklist:', error);
            toast.error('Error al guardar el checklist');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="ml-4 text-gray-600">Cargando checklist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">CHECK LIST GENERAL DE SUPERVISIÓN</h1>
                
                {/* Información general */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">FECHA:</label>
                        <input
                            type="date"
                            value={formData.fecha}
                            onChange={(e) => handleInputChange('fecha', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">HORA:</label>
                        <input
                            type="time"
                            value={formData.hora}
                            onChange={(e) => handleInputChange('hora', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">RESPONSABLE:</label>
                        <input
                            type="text"
                            value={formData.responsable}
                            onChange={(e) => handleInputChange('responsable', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nombre del responsable"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SUPERVISOR:</label>
                        <input
                            type="text"
                            value={formData.supervisor}
                            onChange={(e) => handleInputChange('supervisor', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nombre del supervisor"
                        />
                    </div>
                </div>

                {/* Progress Bar General */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progreso General</span>
                        <span className="text-sm text-gray-600">{Math.round(calculateProgress())}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${calculateProgress()}%` }}
                        ></div>
                    </div>
                </div>

                {/* Navegación por áreas */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Área a evaluar:</label>
                    <div className="flex flex-wrap gap-2">
                        {areas.map(area => {
                            const areaItems = itemsByArea[area];
                            const completed = areaItems.filter(item => item.cumplimiento !== '').length;
                            const total = areaItems.length;
                            
                            return (
                                <button
                                    key={area}
                                    onClick={() => setCurrentArea(area)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        currentArea === area 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {area} ({completed}/{total})
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Checklist por área */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                    {currentArea} - Progreso: {Math.round(calculateProgress(currentArea))}%
                </h2>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 border-b text-left font-medium text-gray-700 w-1/2">
                                    ASPECTOS A EVALUAR
                                </th>
                                <th className="py-3 px-4 border-b text-center font-medium text-gray-700">
                                    CUMPLIMIENTO
                                </th>
                                <th className="py-3 px-4 border-b text-left font-medium text-gray-700">
                                    OBSERVACIONES
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemsByArea[currentArea]?.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        {item.aspecto}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-center space-x-4">
                                            {(['malo', 'regular', 'bueno'] as const).map((nivel) => (
                                                <label key={nivel} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`cumplimiento-${item.id}`}
                                                        value={nivel}
                                                        checked={item.cumplimiento === nivel}
                                                        onChange={(e) => handleItemChange(item.id, 'cumplimiento', e.target.value)}
                                                        className="text-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span className={`text-sm font-medium ${
                                                        nivel === 'malo' ? 'text-red-600' :
                                                        nivel === 'regular' ? 'text-yellow-600' :
                                                        'text-green-600'
                                                    }`}>
                                                        {nivel.toUpperCase()}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <input
                                            type="text"
                                            value={item.observaciones}
                                            onChange={(e) => handleItemChange(item.id, 'observaciones', e.target.value)}
                                            placeholder="Observaciones..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Comentarios Adicionales */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentarios Adicionales:
                </label>
                <textarea
                    value={formData.comentariosAdicionales}
                    onChange={(e) => handleInputChange('comentariosAdicionales', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                    placeholder="Ingrese comentarios adicionales aquí..."
                />
            </div>

            {/* Resumen por áreas */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Resumen por Áreas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {areas.map(area => {
                        const stats = getAreaStats(area);
                        return (
                            <div key={area} className="bg-gray-50 p-4 rounded-lg border">
                                <h4 className="font-medium text-gray-800 mb-2">{area}</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-green-600">Bueno:</span>
                                        <span>{stats.bueno}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-yellow-600">Regular:</span>
                                        <span>{stats.regular}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-red-600">Malo:</span>
                                        <span>{stats.malo}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-1 mt-1">
                                        <span className="font-medium">Total:</span>
                                        <span className="font-medium">{stats.bueno + stats.regular + stats.malo}/{stats.total}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-center mt-8 gap-4">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isLoading || !formData.responsable || !formData.supervisor}
                    className="bg-cyan-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-md transition-colors"
                >
                    {isLoading ? 'Guardando...' : 'Guardar Checklist'}
                </button>
            </div>
        </div>
    );
};