import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { pdf } from '@react-pdf/renderer';
import { ChecklistData, ChecklistItem, ChecklistSupervisionProps } from '../../interfaces/checklist.interface';
import { PdfChecklist } from './PdfCheckList';
import toast from 'react-hot-toast';

const AREA_ORDER: Record<string, number> = {
    'ESTACIONAMIENTO': 1, 'TIENDA': 2, 'RECEPCIÓN': 3, 'CONSULTORIO 1': 4, 'CONSULTORIO 2': 5,
    'QUIRÓFANO': 6, 'LABORATORIO': 7, 'RAYOS X': 8, 'HOSPITAL': 9, 'PENSIÓN': 10,
    'ALMACÉN ALIMENTOS': 11, 'ALMACÉN GENERAL': 12, 'ÁREAS COMUNES': 13, 'ESTÉTICA': 14, 'TRANSPORTE': 15
};

const CHECKLIST_TEMPLATE: Omit<ChecklistItem, 'id' | 'cumplimiento' | 'observaciones'>[] = [
    { area: 'ESTACIONAMIENTO', aspecto: 'Limpieza general' },
    { area: 'ESTACIONAMIENTO', aspecto: 'Iluminación funcional' },
    { area: 'ESTACIONAMIENTO', aspecto: 'Señalización visible y en buen estado' },
    { area: 'ESTACIONAMIENTO', aspecto: 'Cajones de estacionamiento libres' },
    { area: 'ESTACIONAMIENTO', aspecto: 'Puertas de acceso funcionales' },
    { area: 'ESTACIONAMIENTO', aspecto: 'Anuncios visibles y en buen estado' },
    { area: 'TIENDA', aspecto: 'Limpieza general' },
    { area: 'TIENDA', aspecto: 'Anaqueles ordenados' },
    { area: 'TIENDA', aspecto: 'Productos en exhibición ordenados' },
    { area: 'TIENDA', aspecto: 'Precios visibles y correctos' },
    { area: 'TIENDA', aspecto: 'Cámaras de seguridad funcional' },
    { area: 'TIENDA', aspecto: 'Cambio en caja' },
    { area: 'TIENDA', aspecto: 'Corte de caja realizado' },
    { area: 'TIENDA', aspecto: 'Sin problemas de red' },
    { area: 'TIENDA', aspecto: 'Computadoras, terminales e impresoras habilitadas' },
    { area: 'TIENDA', aspecto: 'Sala de espera limpia y olorosa' },
    { area: 'TIENDA', aspecto: 'Televisión y cuadros sin polvo' },
    { area: 'TIENDA', aspecto: 'Ventanas limpias' },
    { area: 'TIENDA', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'TIENDA', aspecto: 'Mostrador limpio y ordenado' },
    { area: 'TIENDA', aspecto: 'Ventiladores limpios y funcionales' },
    { area: 'TIENDA', aspecto: 'Luces funcionales' },
    { area: 'RECEPCIÓN', aspecto: 'Puerta de acceso a las demás áreas limpia' },
    { area: 'RECEPCIÓN', aspecto: 'Mueble de recepción limpio y ordenado' },
    { area: 'RECEPCIÓN', aspecto: 'Compañeros con buen porte' },
    { area: 'RECEPCIÓN', aspecto: 'Sala de espera limpia y olorosa' },
    { area: 'RECEPCIÓN', aspecto: 'Televisión y cuadros sin polvo' },
    { area: 'RECEPCIÓN', aspecto: 'Báscula limpia y desinfectada' },
    { area: 'RECEPCIÓN', aspecto: 'Bolsas y articulos personales guardados debidamente' },
    { area: 'RECEPCIÓN', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'RECEPCIÓN', aspecto: 'Cambio en caja' },
    { area: 'RECEPCIÓN', aspecto: 'Corte de caja realizado' },
    { area: 'RECEPCIÓN', aspecto: 'Sin problemas de red' },
    { area: 'RECEPCIÓN', aspecto: 'Computadoras, terminales e impresoras habilitadas' },
    { area: 'RECEPCIÓN', aspecto: 'Celular con carga al 100%' },
    { area: 'RECEPCIÓN', aspecto: 'Ventilador limpio y funcional' },
    { area: 'RECEPCIÓN', aspecto: 'Luces funcionales' },
    { area: 'CONSULTORIO 1', aspecto: 'Consultorio limpio y oloroso' },
    { area: 'CONSULTORIO 1', aspecto: 'Mesa limpia y desinfectada' },
    { area: 'CONSULTORIO 1', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'CONSULTORIO 1', aspecto: 'Escritorio libre' },
    { area: 'CONSULTORIO 1', aspecto: 'Tarja limpia' },
    { area: 'CONSULTORIO 1', aspecto: 'Abastecido de material (jeringas, alcohol, torundas)' },
    { area: 'CONSULTORIO 1', aspecto: 'Cajonera ordenada' },
    { area: 'CONSULTORIO 1', aspecto: 'Puertas limpias' },
    { area: 'CONSULTORIO 1', aspecto: 'Libre de portaobjetos sucios' },
    { area: 'CONSULTORIO 1', aspecto: 'Computadora e impresora habilitada' },
    { area: 'CONSULTORIO 1', aspecto: 'Sin problemas de red' },
    { area: 'CONSULTORIO 1', aspecto: 'Luces funcionales' },
    { area: 'CONSULTORIO 1', aspecto: 'Clima limpio y funcional' },
    { area: 'CONSULTORIO 1', aspecto: 'Cámaras funcionales' },
    { area: 'CONSULTORIO 2', aspecto: 'Consultorio limpio y oloroso' },
    { area: 'CONSULTORIO 2', aspecto: 'Mesa limpia y desinfectada' },
    { area: 'CONSULTORIO 2', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'CONSULTORIO 2', aspecto: 'Escritorio libre' },
    { area: 'CONSULTORIO 2', aspecto: 'Tarja limpia' },
    { area: 'CONSULTORIO 2', aspecto: 'Abastecido de material (jeringas, alcohol, torundas)' },
    { area: 'CONSULTORIO 2', aspecto: 'Cajonera ordenada' },
    { area: 'CONSULTORIO 2', aspecto: 'Puertas limpias' },
    { area: 'CONSULTORIO 2', aspecto: 'Libre de portaobjetos sucios' },
    { area: 'CONSULTORIO 2', aspecto: 'Computadora e impresora habilitada' },
    { area: 'CONSULTORIO 2', aspecto: 'Sin problemas de red' },
    { area: 'CONSULTORIO 2', aspecto: 'Luces funcionales' },
    { area: 'CONSULTORIO 2', aspecto: 'Clima limpio y funcional' },
    { area: 'CONSULTORIO 2', aspecto: 'Cámaras funcionales' },
    { area: 'QUIRÓFANO', aspecto: 'Quirófano limpio y oloroso' },
    { area: 'QUIRÓFANO', aspecto: 'Mesa de cirugía limpia y desinfectada' },
    { area: 'QUIRÓFANO', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'QUIRÓFANO', aspecto: 'Carrito de anestesia limpio y ordenado' },
    { area: 'QUIRÓFANO', aspecto: 'Abastecido de material (jeringas, alcohol, torundas)' },
    { area: 'QUIRÓFANO', aspecto: 'Cajonera ordenada' },
    { area: 'QUIRÓFANO', aspecto: 'Puertas limpias' },
    { area: 'QUIRÓFANO', aspecto: 'Libre de portaobjetos sucios' },
    { area: 'QUIRÓFANO', aspecto: 'Luces funcionales' },
    { area: 'QUIRÓFANO', aspecto: 'Clima limpio y funcional' },
    { area: 'QUIRÓFANO', aspecto: 'Equipo de anestesia limpio y funcional' },
    { area: 'QUIRÓFANO', aspecto: 'Monitor de signos vitales limpio y funcional' },
    { area: 'QUIRÓFANO', aspecto: 'Mesa de instrumental limpia y ordenada' },
    { area: 'QUIRÓFANO', aspecto: 'Material de uso con stock' },
    { area: 'QUIRÓFANO', aspecto: 'Tanques de oxigeno llenos' },
    { area: 'LABORATORIO', aspecto: 'Mesa de trabajo limpia y desinfectada' },
    { area: 'LABORATORIO', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'LABORATORIO', aspecto: 'Estanterias ordenadas' },
    { area: 'LABORATORIO', aspecto: 'Centrífuga limpia y funcional' },
    { area: 'LABORATORIO', aspecto: 'Material de uso con stock' },
    { area: 'LABORATORIO', aspecto: 'Equipos limpios y funcionales' },
    { area: 'LABORATORIO', aspecto: 'Computadora habilitada' },
    { area: 'LABORATORIO', aspecto: 'Sin problemas de red' },
    { area: 'LABORATORIO', aspecto: 'Clima limpio y funcional' },
    { area: 'LABORATORIO', aspecto: 'Luces funcionales' },
    { area: 'LABORATORIO', aspecto: 'Cámaras funcionales' },
    { area: 'RAYOS X', aspecto: 'Área de Rayos X limpia y ordenada' },
    { area: 'RAYOS X', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'RAYOS X', aspecto: 'Mesa de trabajo limpia y desinfectada' },
    { area: 'RAYOS X', aspecto: 'Equipos limpios y funcionales' },
    { area: 'RAYOS X', aspecto: 'Computadora habilitada' },
    { area: 'RAYOS X', aspecto: 'Sin problemas de red' },
    { area: 'RAYOS X', aspecto: 'Luces funcionales' },
    { area: 'RAYOS X', aspecto: 'Clima limpio y funcional' },
    { area: 'RAYOS X', aspecto: 'Equipo de seguridad disponible' },
    { area: 'RAYOS X', aspecto: 'Cámaras funcionales' },
    { area: 'HOSPITAL', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'HOSPITAL', aspecto: 'Área de exploración ordenada y limpia' },
    { area: 'HOSPITAL', aspecto: 'Mesa y estanterias ordenadas' },
    { area: 'HOSPITAL', aspecto: 'Área de hospitalizados limpio y ordenado' },
    { area: 'HOSPITAL', aspecto: 'Jaulas limpias y desinfectadas' },
    { area: 'HOSPITAL', aspecto: 'Tarja limpia y organizada' },
    { area: 'HOSPITAL', aspecto: 'Luces y lamparas funcionales' },
    { area: 'HOSPITAL', aspecto: 'Ventiladores funcionales' },
    { area: 'HOSPITAL', aspecto: 'Mesa de microbiología limpia y ordenada' },
    { area: 'HOSPITAL', aspecto: 'Material de uso con stock' },
    { area: 'HOSPITAL', aspecto: 'impresora funcional' },
    { area: 'HOSPITAL', aspecto: 'refrigerador limpio y funcional' },
    { area: 'HOSPITAL', aspecto: 'Cámaras funcionales' },
    { area: 'PENSIÓN', aspecto: 'Jaulas limpias, desinfectadas y funcionales' },
    { area: 'PENSIÓN', aspecto: 'Accesorios de mascotas ordenados' },
    { area: 'PENSIÓN', aspecto: 'Platos de casa limpios' },
    { area: 'PENSIÓN', aspecto: 'Ventiladores funcionales' },
    { area: 'PENSIÓN', aspecto: 'Luces funcionales' },
    { area: 'PENSIÓN', aspecto: 'Puerta limpia y funcional' },
    { area: 'PENSIÓN', aspecto: 'Jardín podado y limpio' },
    { area: 'PENSIÓN', aspecto: 'Material de uso ordenado y con stock' },
    { area: 'PENSIÓN', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'PENSIÓN', aspecto: 'Pisos limpios' },
    { area: 'PENSIÓN', aspecto: 'Agua potable disponible' },
    { area: 'PENSIÓN', aspecto: 'Cámaras funcionales' },
    { area: 'ALMACÉN ALIMENTOS', aspecto: 'Estanterias ordenadas' },
    { area: 'ALMACÉN ALIMENTOS', aspecto: 'Productos en buen estado' },
    { area: 'ALMACÉN ALIMENTOS', aspecto: 'Pisos limpios' },
    { area: 'ALMACÉN ALIMENTOS', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'ALMACÉN ALIMENTOS', aspecto: 'Puerta limpia y funcional' },
    { area: 'ALMACÉN ALIMENTOS', aspecto: 'Iluminación funcional' },
    { area: 'ALMACÉN ALIMENTOS', aspecto: 'Ventilador limpio y funcional' },
    { area: 'ALMACÉN ALIMENTOS', aspecto: 'Mesa de trabajo limpia y ordenada' },
    { area: 'ALMACÉN ALIMENTOS', aspecto: 'Computadora habilitada' },
    { area: 'ALMACÉN ALIMENTOS', aspecto: 'Sin problemas de red' },
    { area: 'ALMACÉN GENERAL', aspecto: 'Estanterias ordenadas' },
    { area: 'ALMACÉN GENERAL', aspecto: 'Material de uso con stock' },
    { area: 'ALMACÉN GENERAL', aspecto: 'Pisos limpios' },
    { area: 'ALMACÉN GENERAL', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'ALMACÉN GENERAL', aspecto: 'Puerta limpia y funcional' },
    { area: 'ALMACÉN GENERAL', aspecto: 'Iluminación funcional' },
    { area: 'ALMACÉN GENERAL', aspecto: 'Ventilador limpio y funcional' },
    { area: 'ALMACÉN GENERAL', aspecto: 'Mesa de trabajo limpia y ordenada' },
    { area: 'ALMACÉN GENERAL', aspecto: 'Computadora habilitada' },
    { area: 'ALMACÉN GENERAL', aspecto: 'Sin problemas de red' },
    { area: 'ALMACÉN GENERAL', aspecto: 'Impresora funcional' },
    { area: 'ALMACÉN GENERAL', aspecto: 'Refrigerador limpio y funcional' },
    { area: 'ALMACÉN GENERAL', aspecto: 'Cámaras funcionales' },
    { area: 'ÁREAS COMUNES', aspecto: 'Pisos limpios' },
    { area: 'ÁREAS COMUNES', aspecto: 'Iluminación funcional' },
    { area: 'ÁREAS COMUNES', aspecto: 'Botes de basura con bolsa y limpios' },
    { area: 'ÁREAS COMUNES', aspecto: 'Pasillos libres de obstáculos' },
    { area: 'ÁREAS COMUNES', aspecto: 'Refrigerador limpio y funcional' },
    { area: 'ÁREAS COMUNES', aspecto: 'Microondas limpio y funcional' },
    { area: 'ÁREAS COMUNES', aspecto: 'Comedor limpio y ordenado' },
    { area: 'ÁREAS COMUNES', aspecto: 'Ventilador limpio y funcional' },
    { area: 'ÁREAS COMUNES', aspecto: 'Baño de damas limpio y ordenado' },
    { area: 'ÁREAS COMUNES', aspecto: 'Baño de caballeros limpio y ordenado' },
    { area: 'ESTÉTICA', aspecto: 'Patios limpios' },
    { area: 'ESTÉTICA', aspecto: 'Bote de basura con bolsa y limpio' },
    { area: 'ESTÉTICA', aspecto: 'Jaulas limpias y desinfectadas' },
    { area: 'ESTÉTICA', aspecto: 'Barra limpia' },
    { area: 'ESTÉTICA', aspecto: 'Puertas y cristales limpios' },
    { area: 'ESTÉTICA', aspecto: 'Mesa de corte ordenada' },
    { area: 'ESTÉTICA', aspecto: 'Carrito de material limpio y ordenado' },
    { area: 'ESTÉTICA', aspecto: 'Tinas limpias y funcionales' },
    { area: 'ESTÉTICA', aspecto: 'Ventiladores y luces funcionales' },
    { area: 'ESTÉTICA', aspecto: 'Bombas y maquinas de rasurado funcionales' },
    { area: 'ESTÉTICA', aspecto: 'Material de uso con stock' },
    { area: 'ESTÉTICA', aspecto: 'Cámaras funcionales' },
    { area: 'TRANSPORTE', aspecto: 'Limpia y olorosa' },
    { area: 'TRANSPORTE', aspecto: 'Tapete limpio libre de orines' },
    { area: 'TRANSPORTE', aspecto: 'Jaulas limpias y desinfectadas' },
    { area: 'TRANSPORTE', aspecto: 'Limpieza de carroceria' },
    { area: 'TRANSPORTE', aspecto: 'Llantas funcionales' },
    { area: 'TRANSPORTE', aspecto: 'Puertas funcionales' },
    { area: 'TRANSPORTE', aspecto: 'Luces funcionales' },
    { area: 'TRANSPORTE', aspecto: 'Clima y ventanas funcionales' },
    { area: 'TRANSPORTE', aspecto: 'Cámaras funcionales' },
    { area: 'TRANSPORTE', aspecto: 'Espejos limpios y funcionales' },
    { area: 'TRANSPORTE', aspecto: 'Cabina limpia y ordenada' },
    { area: 'TRANSPORTE', aspecto: 'Material a usar listo (perfume, lapiceros, tarjetas de presentacion)' },
    { area: 'TRANSPORTE', aspecto: 'Documentación en regla y vigente' },
    { area: 'TRANSPORTE', aspecto: 'Extintor cargado y en buen estado' },
    { area: 'TRANSPORTE', aspecto: 'Niveles adecuados (aceite, agua, combustible, etc.)' },
];

const getCurrentTime = (): string => {
    return new Date().toLocaleTimeString('es-MX', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
};

const initializeFormData = (): ChecklistData => ({
    fecha: new Date().toISOString().split('T')[0],
    horaInicio: getCurrentTime(),
    horaFin: getCurrentTime(),
    responsable: '',
    items: CHECKLIST_TEMPLATE.map((item, index) => ({
        id: `item-${index}`,
        ...item,
        cumplimiento: '',
        observaciones: ''
    })),
    comentariosAdicionales: ''
});

const formatDateShort = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const CheckList: React.FC<ChecklistSupervisionProps> = ({ onClose }) => {
    const [formData, setFormData] = useState<ChecklistData>(initializeFormData());
    const [isLoading, setIsLoading] = useState(false);
    const [currentArea, setCurrentArea] = useState<string>('ESTACIONAMIENTO');
    const [availableChecklists, setAvailableChecklists] = useState<any[]>([]);
    const [selectedChecklist, setSelectedChecklist] = useState<string>('');
    const [forceUpdate, setForceUpdate] = useState(0);

    const itemsByArea = React.useMemo(() => {
        const grouped: Record<string, ChecklistItem[]> = {};
        formData.items?.forEach(item => {
            if (!grouped[item.area]) grouped[item.area] = [];
            grouped[item.area].push(item);
        });
        return grouped;
    }, [formData.items, forceUpdate]);

    const areas = Object.keys(itemsByArea).sort((a, b) => {
        const orderA = AREA_ORDER[a] || 999;
        const orderB = AREA_ORDER[b] || 999;
        return orderA - orderB;
    });

    const calculateProgress = (area?: string): number => {
        const itemsToCheck = area 
            ? formData.items?.filter(item => item.area === area) || []
            : formData.items || [];
        
        if (itemsToCheck.length === 0) return 0;
        
        const completed = itemsToCheck.filter(item => 
            item.cumplimiento !== ''
        ).length;
        
        return (completed / itemsToCheck.length) * 100;
    };

    const getAreaStats = (area: string) => {
        const areaItems = itemsByArea[area] || [];
        const total = areaItems.length;
        const bueno = areaItems.filter(item => item.cumplimiento === 'bueno').length;
        const regular = areaItems.filter(item => item.cumplimiento === 'regular').length;
        const malo = areaItems.filter(item => item.cumplimiento === 'malo').length;
        const sinEvaluar = total - (bueno + regular + malo);
        
        return { total, bueno, regular, malo, sinEvaluar };
    };

    const getAreaCounters = (area: string) => {
        const areaItems = itemsByArea[area] || [];
        const completed = areaItems.filter(item => 
            item.cumplimiento !== ''
        ).length;
        const total = areaItems.length;
        return { completed, total };
    };

    useEffect(() => {
        const loadChecklists = async () => {
            try {
                setIsLoading(true);
                const files = await apiService.getChecklistFiles();
                const jsonFiles = files?.filter((file: any) => file.name.endsWith('.json')) || [];
                setAvailableChecklists(jsonFiles);
                
                if (jsonFiles.length > 0) {
                    jsonFiles.sort((a: any, b: any) => 
                        new Date(b.modified).getTime() - new Date(a.modified).getTime()
                    );
                    
                    const latestChecklist = jsonFiles[0];
                    setSelectedChecklist(latestChecklist.name);
                    
                    try {
                        const checklistData = await apiService.getChecklistFile(latestChecklist.name);
                        if (checklistData && checklistData.items) {
                            setFormData(checklistData);
                        }
                    } catch (error) {
                        console.log('Error cargando checklist');
                    }
                }
            } catch (error) {
                console.log('No se encontraron checklists');
            } finally {
                setIsLoading(false);
            }
        };

        loadChecklists();
    }, []);

    useEffect(() => {
        const loadSelectedChecklist = async () => {
            if (!selectedChecklist) {
                setFormData(initializeFormData());
                return;
            }

            try {
                setIsLoading(true);
                const checklistData = await apiService.getChecklistFile(selectedChecklist);
                
                if (checklistData && checklistData.items) {
                    setFormData(checklistData);
                    toast.success('Checklist cargado correctamente');
                } else {
                    toast.error('Checklist no válido');
                    setSelectedChecklist('');
                }
            } catch (error) {
                toast.error('Error al cargar el checklist');
                setSelectedChecklist('');
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedChecklist) {
            loadSelectedChecklist();
        }
    }, [selectedChecklist]);

    const handleInputChange = (field: keyof ChecklistData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleItemChange = (itemId: string, field: 'cumplimiento' | 'observaciones', value: string) => {
        setFormData(prev => {
            const newItems = prev.items?.map(item => 
                item.id === itemId ? { ...item, [field]: value } : item
            ) || [];
            
            return { ...prev, items: newItems };
        });
        
        setForceUpdate(prev => prev + 1);
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);

            if (!formData.responsable) {
                toast.error('Complete el campo responsable');
                return;
            }

            const formattedDate = formatDateShort(formData.fecha);
            const baseFilename = `Checklist_${formData.responsable.replace(/\s+/g, '_')}_${formattedDate}`;

            const blob = await pdf(<PdfChecklist data={formData} />).toBlob();
        
            const pdfFilename = `${baseFilename}.pdf`;
            downloadFile(blob, pdfFilename);
            toast.success('PDF descargado correctamente');

            const formDataUpload = new FormData();
            formDataUpload.append('files', blob, pdfFilename);
            
            const jsonBlob = new Blob([JSON.stringify(formData, null, 2)], { 
                type: 'application/json' 
            });
            const jsonFilename = `${baseFilename}.json`;
            formDataUpload.append('files', jsonBlob, jsonFilename);
            
            await apiService.saveChecklist(formDataUpload);

            toast.success('Checklist guardado correctamente');
            onClose?.();
        } catch (error) {
            toast.error('Error al guardar el checklist');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewChecklist = () => {
        setSelectedChecklist('');
        setFormData(initializeFormData());
        setCurrentArea('ESTACIONAMIENTO');
        setForceUpdate(prev => prev + 1);
        toast.success('Nuevo checklist creado');
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="ml-4 text-gray-600">
                        {selectedChecklist ? 'Cargando checklist...' : 'Cargando...'}
                    </p>
                </div>
            </div>
        );
    }

    const generalProgress = calculateProgress();
    const currentAreaProgress = calculateProgress(currentArea);
    const currentAreaCounter = getAreaCounters(currentArea);

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Checklist General de Supervisión</h1>
            
                {availableChecklists.length > 0 && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cargar Checklist Existente:
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={selectedChecklist}
                                onChange={(e) => setSelectedChecklist(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar checklist...</option>
                                {availableChecklists.map((file) => (
                                    <option key={file.name} value={file.name}>
                                        {file.name.replace(/\.json$/, '')} ({formatDateShort(new Date(file.modified).toISOString().split('T')[0])})
                                    </option>
                                ))}
                            </select>
                        
                            <button
                                onClick={handleNewChecklist}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                            >
                                Nuevo Checklist
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">HORA DE INICIO:</label>
                        <input
                            type="time"
                            value={formData.horaInicio}
                            onChange={(e) => handleInputChange('horaInicio', e.target.value)}
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
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progreso General</span>
                        <span className="text-sm text-gray-600">{Math.round(generalProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${generalProgress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Área a evaluar:</label>
                    <div className="flex flex-wrap gap-2">
                        {areas.map(area => {
                            const counter = getAreaCounters(area);
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
                                    {area} ({counter.completed}/{counter.total})
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                    {currentArea} - Progreso: {Math.round(currentAreaProgress)}% ({currentAreaCounter.completed}/{currentAreaCounter.total})
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
                            {(itemsByArea[currentArea] || []).map((item) => (
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
                                            value={item.observaciones || ''}
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

            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentarios Adicionales:
                </label>
                <textarea
                    value={formData.comentariosAdicionales || ''}
                    onChange={(e) => handleInputChange('comentariosAdicionales', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                    placeholder="Ingrese comentarios adicionales aquí..."
                />
            </div>

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
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Sin evaluar:</span>
                                        <span>{stats.sinEvaluar}</span>
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

            <div className="flex justify-center mt-8 gap-4">
                <button
                    type="button"
                    onClick={() => {
                        handleInputChange('horaFin', getCurrentTime());
                        handleSave();
                    }}
                    disabled={isLoading || !formData.responsable}
                    className="bg-cyan-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Guardando...' : 'Guardar Checklist'}
                </button>
            </div>
        </div>
    );
};