import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { apiService } from '../../services/api';
import { pdf } from '@react-pdf/renderer';
import { ChecklistData, ChecklistItem, ChecklistPhoto, ChecklistSupervisionProps } from '../../interfaces/checklist.interface';
import { PdfChecklist } from './PdfCheckList';
import toast from 'react-hot-toast';
import Modal from '../shared/Modal';
import { runtimeConfig } from '../../services/config';
import { IoCameraReverseOutline } from 'react-icons/io5';

const AREA_ORDER: Record<string, number> = {
    'ESTACIONAMIENTO': 1, 'TIENDA': 2, 'RECEPCIÓN': 3, 'CONSULTORIO 1': 4, 'CONSULTORIO 2': 5,
    'LABORATORIO': 6, 'RAYOS X': 7, 'QUIRÓFANO': 8, 'HOSPITAL': 9, 'PENSIÓN': 10,
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
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

const getCurrentDate = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
};

const initializeFormData = (): ChecklistData & { photos?: ChecklistPhoto[] } => {
    return {
        fecha: getCurrentDate(),
        horaInicio: getCurrentTime(),
        horaFin: getCurrentTime(),
        responsable: '',
        items: CHECKLIST_TEMPLATE.map((item, index) => ({
            id: `item-${index}`,
            ...item,
            cumplimiento: '',
            observaciones: ''
        })),
        comentariosAdicionales: '',
        photos: []
    };
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

// Función para detectar si es móvil
const isMobileDevice = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const CheckList: React.FC<ChecklistSupervisionProps> = ({ onClose }) => {
    const [formData, setFormData] = useState<ChecklistData & { photos?: ChecklistPhoto[] }>(initializeFormData());
    const [isLoading, setIsLoading] = useState(false);
    const [currentArea, setCurrentArea] = useState<string>('ESTACIONAMIENTO');
    const [availableChecklists, setAvailableChecklists] = useState<any[]>([]);
    const [selectedChecklist, setSelectedChecklist] = useState<string>('');
    const [forceUpdate, setForceUpdate] = useState(0);
    
    // Estados para el manejo de fotos CON REACT-WEBCAM
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState<string>('');
    const [photoDescription, setPhotoDescription] = useState('');
    const [cameraError, setCameraError] = useState<string>('');
    const [isCameraLoading, setIsCameraLoading] = useState(false);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [hasCameraSupport, setHasCameraSupport] = useState(true);

    // Usa useRef para la webcam
    const webcamRef = useRef<Webcam>(null);

    // Configuración de video constraints
    const videoConstraints = {
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
        facingMode: facingMode,
        aspectRatio: { ideal: 16/9, min: 4/3, max: 16/9 },
        // Deshabilitar features que causan zoom
        zoom: false,
        // Priorizar campo de vista amplio
        advanced: [
            { width: 1920, height: 1080 }, // Full HD
            { width: 1280, height: 720 },  // HD
            { width: 640, height: 480 },   // VGA
        ].map(config => ({
            ...config,
            aspectRatio: 16/9,
            frameRate: { min: 20, ideal: 30, max: 60 }
        }))
    };

    // Verificar soporte de cámara al montar
    useEffect(() => {
        const checkCameraSupport = async () => {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    setHasCameraSupport(false);
                    return;
                }

                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setHasCameraSupport(videoDevices.length > 0);
            } catch (error) {
                console.error('Error verificando cámaras:', error);
                setHasCameraSupport(false);
            }
        };

        checkCameraSupport();
    }, []);

    // Función para abrir cámara CON REACT-WEBCAM
    const openCamera = useCallback(async () => {
        if (!hasCameraSupport) {
            toast.error('No hay cámara disponible en este dispositivo');
            return;
        }

        try {
            setIsCameraLoading(true);
            setCameraError('');
            setCurrentPhoto('');
            setPhotoDescription('');

            // Pequeño delay para mejor UX
            await new Promise(resolve => setTimeout(resolve, 100));
            
            setIsCameraOpen(true);
            setIsCameraLoading(false);
            
        } catch (error: any) {
            console.error('Error abriendo cámara:', error);
            setIsCameraLoading(false);
            setCameraError('Error al iniciar la cámara');
            toast.error('No se pudo abrir la cámara');
        }
    }, [hasCameraSupport]);

    // Función para cerrar cámara
    const closeCamera = useCallback(() => {
        setIsCameraOpen(false);
        setCurrentPhoto('');
        setPhotoDescription('');
        setCameraError('');
        setIsCameraLoading(false);
    }, []);

    // Función para tomar foto CON REACT-WEBCAM
    const takePhoto = useCallback(() => {
        if (!webcamRef.current) {
            toast.error('Cámara no disponible');
            return;
        }

        try {
            const imageSrc = webcamRef.current.getScreenshot({
                width: 1920,
                height: 1080,
            });
            
            if (imageSrc) {
                setCurrentPhoto(imageSrc);
                toast.success('✅ Foto capturada');
            } else {
                toast.error('No se pudo capturar la foto');
            }
        } catch (error) {
            console.error('Error tomando foto:', error);
            toast.error('Error al capturar foto');
        }
    }, []);

    // Función para cambiar entre cámaras
    const switchCamera = useCallback(() => {
        setFacingMode(prev => {
            const newMode = prev === 'user' ? 'environment' : 'user';
            console.log('Cambiando a cámara:', newMode);
            return newMode;
        });
        setCurrentPhoto('');
    }, []);

    // Función para guardar foto (se mantiene igual)
    const savePhoto = useCallback(() => {
        if (currentPhoto) {
            const newPhoto: ChecklistPhoto = {
                id: `photo-${Date.now()}`,
                area: currentArea,
                photoUrl: currentPhoto,
                timestamp: getCurrentTime(),
                description: photoDescription
            };

            setFormData(prev => ({
                ...prev,
                photos: [...(prev.photos || []), newPhoto]
            }));

            toast.success('Foto guardada correctamente');
            closeCamera();
        }
    }, [currentPhoto, currentArea, photoDescription, closeCamera]);

    // Efecto para manejar errores de cámara
    useEffect(() => {
        if (isCameraOpen && webcamRef.current) {
            // React-webcam maneja los errores internamente, pero podemos capturar algunos
            console.log('Cámara activada con react-webcam');
        }
    }, [isCameraOpen]);

    // Función para verificar conectividad
    const checkConnectivity = async (): Promise<boolean> => {
        try {
            const isConnected = await apiService.checkConnectivity();
            console.log('🔗 Conectividad:', isConnected ? '✅ CONECTADO' : '❌ DESCONECTADO');
            return isConnected;
        } catch (error) {
            console.error('❌ Error verificando conectividad:', error);
            return false;
        }
    };

    // Función para cargar checklists
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
            }
        } catch (error) {
            console.log('No se encontraron checklists');
            setAvailableChecklists([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Verificar compatibilidad con cámara al cargar el componente
    useEffect(() => {
        const checkCameraSupport = () => {
            const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
            console.log('Soporte de cámara disponible:', hasGetUserMedia);
            
            if (!hasGetUserMedia) {
                console.warn('getUserMedia no es compatible con este navegador');
            }
        };
        
        checkCameraSupport();
    }, []);

    // Efecto para cargar la lista de checklists disponibles
    useEffect(() => {
        const initializeApp = async () => {
            try {
                // Verificar conectividad primero
                const isConnected = await checkConnectivity();
                
                if (!isConnected) {
                    console.warn('⚠️ Sin conectividad al backend, recargando configuración...');
                    await runtimeConfig.reloadConfig();
                }
                
                // Cargar checklists
                await loadChecklists();
            } catch (error) {
                console.error('Error inicializando app:', error);
                toast.error('Error de conexión con el servidor');
            }
        };

        initializeApp();
    }, []);

    // Efecto para cargar el checklist seleccionado
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

    const removePhoto = (photoId: string) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos?.filter(photo => photo.id !== photoId) || []
        }));
        toast.success('Foto eliminada');
    };

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

    // Función para calcular porcentaje de "Bueno"
    const calculateBuenoPercentage = (area?: string): number => {
        const itemsToCheck = area 
            ? formData.items?.filter(item => item.area === area) || []
            : formData.items || [];
        
        if (itemsToCheck.length === 0) return 0;
        
        const buenoItems = itemsToCheck.filter(item => item.cumplimiento === 'bueno').length;
        const totalEvaluated = itemsToCheck.filter(item => item.cumplimiento !== '').length;
        
        if (totalEvaluated === 0) return 0;
        
        return (buenoItems / totalEvaluated) * 100;
    };

    const getAreaStats = (area: string) => {
        const areaItems = itemsByArea[area] || [];
        const total = areaItems.length;
        const bueno = areaItems.filter(item => item.cumplimiento === 'bueno').length;
        const regular = areaItems.filter(item => item.cumplimiento === 'regular').length;
        const malo = areaItems.filter(item => item.cumplimiento === 'malo').length;
        const sinEvaluar = total - (bueno + regular + malo);
        const totalEvaluado = bueno + regular + malo;
        const porcentajeBueno = calculateBuenoPercentage(area);
        
        return { total, bueno, regular, malo, sinEvaluar, totalEvaluado, porcentajeBueno };
    };

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

    // FUNCIÓN CORREGIDA PARA GUARDAR CHECKLIST
    const handleSave = async () => {
        try {
            setIsLoading(true);

            if (!formData.responsable) {
                toast.error('Complete el campo responsable');
                return;
            }

            // Validar que al menos algunos items estén evaluados
            const itemsEvaluados = formData.items?.filter(item => item.cumplimiento !== '').length || 0;
            if (itemsEvaluados === 0) {
                toast.error('Debe evaluar al menos algunos items antes de guardar');
                return;
            }

            const timestamp = new Date().getTime();
            const horaFinActual = getCurrentTime();
            const formDataConHoraActualizada = {
                ...formData,
                horaFin: horaFinActual,
                fecha: formData.fecha || getCurrentDate(),
            };

            const baseFilename = `Checklist_${formDataConHoraActualizada.responsable.replace(/\s+/g, '_')}_${timestamp}`;

            console.log('Generando PDF...');
            // Generar PDF
            const pdfBlob = await pdf(<PdfChecklist data={formDataConHoraActualizada} />).toBlob();
            const pdfFilename = `${baseFilename}.pdf`;
            
            console.log('Descargando PDF...');
            // Descargar PDF localmente
            downloadFile(pdfBlob, pdfFilename);
            toast.success('PDF descargado correctamente');

            console.log('Preparando datos para enviar al servidor...');
            // Preparar FormData para enviar al servidor
            const formDataUpload = new FormData();
            
            // Agregar archivo PDF
            formDataUpload.append('files', pdfBlob, pdfFilename);
            
            // Agregar archivo JSON
            const jsonBlob = new Blob([JSON.stringify(formDataConHoraActualizada, null, 2)], { 
                type: 'application/json' 
            });
            const jsonFilename = `${baseFilename}.json`;
            formDataUpload.append('files', jsonBlob, jsonFilename);

            console.log('Enviando datos al servidor...');
            // Enviar al servidor
            await apiService.saveChecklist(formDataUpload);

            console.log('Checklist guardado exitosamente');
            toast.success('Checklist guardado correctamente en el servidor');
            
            // Cerrar modal si existe
            if (onClose) {
                onClose();
            }
            
        } catch (error) {
            console.error('Error guardando checklist:', error);
            toast.error(`Error al guardar el checklist: ${error instanceof Error ? error.message : 'Error desconocido'}`);
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

    // Render del modal de cámara MEJORADO
    const renderCameraModal = () => (
        <Modal
            className1="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-2"
            className2="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto"
            closeModal={closeCamera}
        >
            <div className="p-2">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                        {currentArea}
                    </h3>
                    <div className="flex gap-2">
                        <IoCameraReverseOutline onClick={switchCamera} size={24}/>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        {facingMode === 'user' ? 'Cámara frontal' : 'Cámara trasera'}
                    </p>
                </div>

                {cameraError ? (
                    <div className="text-center py-12">
                        <div className="text-red-500 text-6xl mb-2">📷❌</div>
                        <p className="text-red-600 mb-6 text-lg">{cameraError}</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={openCamera}
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                ) : !currentPhoto ? (
                    <>
                        {/* Vista de cámara ACTIVA - CONTENEDOR CON RELACIÓN DE ASPECTO FIJA */}
                        <div className="relative bg-black rounded-xl overflow-hidden mb-6 border-4 border-gray-800">
                            <div 
                                className="relative w-full"
                                style={{ paddingBottom: '56.25%' }}
                            >
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    screenshotQuality={isMobileDevice() ? 0.8 : 0.85}
                                    videoConstraints={videoConstraints}
                                    onUserMedia={() => {
                                        console.log('✅ Cámara lista');
                                        setIsCameraLoading(false);
                                    }}
                                    onUserMediaError={(error) => {
                                        console.error('❌ Error cámara:', error);
                                        let errorMsg = 'Error al acceder a la cámara. ';
                                        
                                        if (error === 'NotAllowedError') {
                                            errorMsg += 'Permiso denegado.';
                                        } else if (error === 'NotFoundError') {
                                            errorMsg += 'Cámara no encontrada.';
                                        } else {
                                            errorMsg += 'Intenta con otra cámara.';
                                        }
                                        
                                        setCameraError(errorMsg);
                                        setIsCameraLoading(false);
                                    }}
                                    className="absolute inset-0 w-full h-full"
                                    style={{
                                        objectFit: 'cover',
                                        transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                                        }}
                                    forceScreenshotSourceSize={false}
                                    minScreenshotWidth={1280}
                                    minScreenshotHeight={720}
                                />
                                
                                {/* Overlay de carga */}
                                {isCameraLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                        <div className="text-white text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                                            <p>Iniciando cámara...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Indicador de cámara activa */}
                            <div className="absolute top-4 left-4 flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                                    En vivo
                                </span>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={takePhoto}
                                disabled={isCameraLoading}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-3 text-lg"
                            >
                                <div className="w-6 h-6 bg-white rounded-full"></div>
                                Capturar Foto
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Vista previa de foto */}
                        <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-6 border-4 border-green-500">
                            <img 
                                src={currentPhoto} 
                                alt="Vista previa" 
                                className="w-full h-96 object-contain bg-black"
                            />
                            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                ✅ Vista previa
                            </div>
                        </div>
                        
                        {/* Descripción */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                📝 Descripción (opcional):
                            </label>
                            <input
                                type="text"
                                value={photoDescription}
                                onChange={(e) => setPhotoDescription(e.target.value)}
                                placeholder="Ej: Estado de limpieza, problema encontrado, observación importante..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                maxLength={120}
                            />
                            <div className="text-right text-sm text-gray-500 mt-2">
                                {photoDescription.length}/120 caracteres
                            </div>
                        </div>
                        
                        {/* Botones de guardar/retomar */}
                        <div className="flex gap-3">
                            <button
                                onClick={savePhoto}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3 text-lg"
                            >
                                💾 Guardar Foto
                            </button>
                            <button
                                onClick={() => setCurrentPhoto('')}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                🔄 Retomar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );

    if (isLoading && !isCameraLoading) {
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

    const generalBuenoPercentage = calculateBuenoPercentage();
    const currentAreaStats = getAreaStats(currentArea);
    const areaPhotos = formData.photos?.filter(photo => photo.area === currentArea) || [];

    return (
        <div className="max-w-6xl mx-auto p-2 bg-white rounded-lg shadow-lg">
            {/* Modal de cámara CON REACT-WEBCAM */}
            {isCameraOpen && renderCameraModal()}
            {/* <Modal
                className1="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
                className2="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4"
                closeModal={closeCamera}
                >
                <div className="bg-white p-2 rounded-lg max-w-md w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">
                            {currentArea}
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={switchCamera}
                                className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                                title="Cambiar cámara"
                            >
                                {facingMode === 'user' ? '📱 Cámara Frontal' : '📸 Cámara Trasera'}
                            </button>
                        </div>
                    </div>
                    
                    {cameraError ? (
                        <div className="text-center p-6">
                            <div className="text-red-500 text-4xl mb-4">📷 ❌</div>
                            <p className="text-red-600 mb-4 text-sm">{cameraError}</p>
                            <div className="space-y-2">
                                <button
                                    onClick={openCamera}
                                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors font-medium"
                                >
                                    Reintentar
                                </button>
                                <button
                                    onClick={closeCamera}
                                    className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    ) : !currentPhoto ? (
                        <>
                            <div className="relative bg-black rounded-lg mb-4 overflow-hidden">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={videoConstraints}
                                    onUserMedia={() => {
                                        console.log('Cámara activada correctamente');
                                        setIsCameraLoading(false);
                                    }}
                                    onUserMediaError={(error) => {
                                        console.error('Error en cámara:', error);
                                        setCameraError('Error al acceder a la cámara. Verifica los permisos.');
                                        setIsCameraLoading(false);
                                    }}
                                    className="w-full h-64 object-cover"
                                    screenshotQuality={0.8}
                                    forceScreenshotSourceSize={false}
                                />
                                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                                    <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-xs">
                                        {facingMode === 'user' ? 'Cámara frontal' : 'Cámara trasera'}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={takePhoto}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-3 rounded-md transition-colors flex items-center justify-center gap-2 shadow-lg"
                                    disabled={isCameraLoading}
                                >
                                    <div className="w-3 h-3 bg-white rounded-md"></div>
                                    {isCameraLoading ? 'Cargando cámara...' : 'Capturar Foto'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="relative bg-gray-100 rounded-lg mb-4 overflow-hidden border-2 border-green-500">
                                <img 
                                    src={currentPhoto} 
                                    alt="Vista previa" 
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                                    ✅ Vista previa
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción (opcional):
                                </label>
                                <input
                                    type="text"
                                    value={photoDescription}
                                    onChange={(e) => setPhotoDescription(e.target.value)}
                                    placeholder="Ej: Estado actual, problema encontrado, observación..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    maxLength={100}
                                />
                                <div className="text-right text-xs text-gray-500 mt-1">
                                    {photoDescription.length}/100 caracteres
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={savePhoto}
                                    className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    💾 Guardar Foto
                                </button>
                                <button
                                    onClick={() => setCurrentPhoto('')}
                                    className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    🔄 Retomar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal> */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">Checklist General de Supervisión</h1>
                </div>

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
                                        {file.name.replace(/\.json$/, '')} - {file.modified ? new Date(file.modified).toLocaleDateString('es-ES') : ''}
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
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                            {formData.fecha}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">HORA DE INICIO:</label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                            {formData.horaInicio} hrs.
                        </div>
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

                {/* Barra de progreso general */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Calificación General</span>
                        <span className="text-sm text-gray-600">{Math.round(generalBuenoPercentage)}% Bueno</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                                generalBuenoPercentage >= 80 ? 'bg-green-500' :
                                generalBuenoPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${generalBuenoPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span className={`font-medium ${
                            generalBuenoPercentage >= 80 ? 'text-green-600' :
                            generalBuenoPercentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                            {Math.round(generalBuenoPercentage)}% Bueno
                        </span>
                        <span>100%</span>
                    </div>
                    <div className={`text-center text-sm font-medium mt-1 ${
                        generalBuenoPercentage >= 80 ? 'text-green-600' :
                        generalBuenoPercentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                        {generalBuenoPercentage >= 80 ? 'EXCELENTE' :
                         generalBuenoPercentage >= 60 ? 'ACEPTABLE' : 'REQUIERE MEJORA'}
                    </div>
                </div>

                {/* Áreas a evaluar con botón de cámara */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Área a evaluar:</label>
                        <button
                            onClick={openCamera}
                            disabled={isCameraLoading || !hasCameraSupport}
                            className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg text-sm font-medium transition-all transform hover:scale-105 flex items-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            title={!hasCameraSupport ? 'Cámara no disponible en este dispositivo' : 'Tomar foto del área actual'}
                        >
                            {isCameraLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Iniciando cámara...
                                </>
                            ) : (
                                <>
                                    📸 Tomar Foto
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {areas.map(area => {
                            const areaPercentage = calculateBuenoPercentage(area);
                            return (
                                <button
                                    key={area}
                                    onClick={() => setCurrentArea(area)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                                        currentArea === area 
                                            ? 'bg-blue-500 text-white shadow-md' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {area} 
                                    <span className={`ml-2 text-xs px-1 rounded ${
                                        areaPercentage >= 80 ? 'bg-green-100 text-green-800' :
                                        areaPercentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {Math.round(areaPercentage)}%
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Galería de fotos del área actual */}
                {areaPhotos.length > 0 && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">Fotos de {currentArea}</h3>
                            <span className="text-sm text-gray-600">{areaPhotos.length} foto(s)</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {areaPhotos.map(photo => (
                                <div key={photo.id} className="relative group bg-white rounded-lg border shadow-sm overflow-hidden">
                                    <img 
                                        src={photo.photoUrl} 
                                        alt={`Foto de ${currentArea}`}
                                        className="w-full h-32 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => removePhoto(photo.id)}
                                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-opacity transform scale-0 group-hover:scale-100 duration-200"
                                            title="Eliminar foto"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    <div className="p-2">
                                        {photo.description && (
                                            <div className="text-xs text-gray-600 mb-1 line-clamp-2">
                                                {photo.description}
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-500">
                                            {photo.timestamp}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Título del área actual */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                    {currentArea} - Calificación: {Math.round(currentAreaStats.porcentajeBueno)}% Bueno 
                    <span className={`ml-2 text-sm font-normal ${
                        currentAreaStats.porcentajeBueno >= 80 ? 'text-green-600' :
                        currentAreaStats.porcentajeBueno >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                        ({currentAreaStats.totalEvaluado}/{currentAreaStats.total} evaluados)
                    </span>
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

            {/* Resumen por áreas */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Resumen por Áreas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {areas.map(area => {
                        const stats = getAreaStats(area);
                        const areaPercentage = calculateBuenoPercentage(area);
                        return (
                            <div key={area} className="bg-gray-50 p-4 rounded-lg border">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-gray-800">{area}</h4>
                                    <div className="text-right">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                                            areaPercentage >= 80 ? 'bg-green-100 text-green-800' :
                                            areaPercentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {Math.round(areaPercentage)}% Bueno
                                        </span>
                                        <div className={`text-xs mt-1 ${
                                            areaPercentage >= 80 ? 'text-green-600' :
                                            areaPercentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                            {areaPercentage >= 80 ? 'EXCELENTE' :
                                             areaPercentage >= 60 ? 'ACEPTABLE' : 'REQUIERE MEJORA'}
                                        </div>
                                    </div>
                                </div>
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
                                        <span className="font-medium">Total evaluado:</span>
                                        <span className="font-medium">{stats.totalEvaluado}/{stats.total}</span>
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
                    onClick={handleSave}
                    disabled={isLoading || !formData.responsable}
                    className="bg-cyan-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                    {isLoading ? 'Guardando...' : 'Guardar Checklist'}
                </button>
            </div>
        </div>
    );
};