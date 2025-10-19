import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { EvaluationData, StaffRecruitmentProps } from '../../../interfaces/orgchartinteractive.interface';
import { pdf } from '@react-pdf/renderer';
import PdfPerformanceEvaluation from '../PdfDocuments/PdfPerformanceEvaluation';
import { apiService } from '../../../services/api';

type EvaluationSection = | 'actitudTrabajo' | 'cooperacion' | 'calidadTrabajo' | 'relaciones' | 'asistencia';
interface RadioGroupProps {
    section: EvaluationSection;
    field: string;
    value: number;
    label: string;
}

const PerformanceEvaluation: React.FC<StaffRecruitmentProps> = ({ employee, onClose }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [evaluationData, setEvaluationData] = useState<EvaluationData>({
        ciudad: 'Campeche, Campeche.',
        fecha: {
            dia: '',
            mes: '',
            año: ''
        },
        nombreTrabajador: employee.name,
        area: employee.area,
        puesto: employee.puesto,
        actitudTrabajo: {
            interesErrores: 3,
            aprendizaje: 3,
            seguimientoReglas: 3,
            sentidoUrgencia: 0
        },
        cooperacion: {
            cooperacionSolicitada: 4,
            cooperacionNoSolicitada: 2,
            sugerencias: 0,
            integracion: 1
        },
        calidadTrabajo: {
            calidadForma: 4,
            calidadTiempo: 4,
            adaptacion: 4,
            dominio: 3
        },
        relaciones: {
            conCompaneros: 3,
            conSuperiores: 4,
            conSubordinados: 0,
            conClientes: 2
        },
        asistencia: {
            asistencia: 1,
            puntualidad: 4,
            rotarTurno: 4,
            guardias: 4
        },
        decisionContrato: 'prorroga',
        nombreEvaluador: ''
    });

    // Cargar datos existentes usando apiService
    useEffect(() => {
        const loadExistingData = async () => {
            try {
                setIsLoading(true);
                
                // ✅ Usar apiService para obtener archivos del empleado
                const serverFiles = await apiService.getEmployeeFiles(employee.name);
                
                const evaluationJsonFile = serverFiles.find((file: any) => file.name === 'Evaluacion de desempeno.json');
                
                if (evaluationJsonFile) {
                    // ✅ Usar fetchDirect para cargar el JSON específico
                    const jsonResponse = await apiService.fetchDirect(
                        `/orgchart/employees/${encodeURIComponent(employee.name)}/${encodeURIComponent('Evaluacion de desempeno.json')}`
                    );
                    
                    const existingData = await jsonResponse.json();
                    setEvaluationData(existingData);
                }
            } catch (error) {
                console.error('Error loading existing evaluation data:', error);
                // No mostrar error si no existe el archivo (es normal en primer uso)
                if (!(error instanceof Error && error.message.includes('404'))) {
                    toast.error('Error al cargar los datos existentes de evaluación');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadExistingData();
    }, [employee.name]);

    const handleInputChange = (
        section: EvaluationSection,
        field: string,
        value: number
    ) => {
        setEvaluationData(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as any),
                [field]: value
            }
        }));
    };

    const handleGeneralChange = (field: string, value: string) => {
        setEvaluationData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFechaChange = (field: string, value: string) => {
        setEvaluationData(prev => ({
            ...prev,
            fecha: {
                ...prev.fecha,
                [field]: value
            }
        }));
    };

    // Validar formulario antes de guardar
    const validateForm = (): boolean => {
        const { fecha, nombreEvaluador, decisionContrato } = evaluationData;
        
        if (!fecha.dia || !fecha.mes || !fecha.año) {
            toast.error('Complete la fecha correctamente');
            return false;
        }
        
        if (!nombreEvaluador.trim()) {
            toast.error('El nombre del evaluador es requerido');
            return false;
        }
        
        if (!decisionContrato) {
            toast.error('Seleccione una decisión de contrato');
            return false;
        }
        
        // Validar que los campos de fecha sean numéricos
        if (!/^\d+$/.test(fecha.dia) || !/^\d+$/.test(fecha.mes) || !/^\d+$/.test(fecha.año)) {
            toast.error('Los campos de fecha deben ser numéricos');
            return false;
        }
        
        return true;
    };

    const handleSave = async () => {
        try {
            if (!validateForm()) return;
            
            setIsSaving(true);
            
            if (!employee) {
                throw new Error("Datos no proporcionados");
            }
            
            // Generar el PDF
            const blob = await pdf(<PdfPerformanceEvaluation data={evaluationData} />).toBlob();
            
            if (!blob) {
                throw new Error("No se pudo generar el blob del documento");
            }

            if (blob.size === 0) {
                throw new Error("El blob está vacío");
            }

            const formDatasend = new FormData();
            formDatasend.append('file', blob, "Evaluacion de desempeno.pdf");
            formDatasend.append('jsonData', JSON.stringify(evaluationData));
            
            // ✅ Usar apiService para subir el archivo
            await apiService.uploadEmployeeFile(employee.name, formDatasend);

            toast.success("Evaluacion de desempeño.pdf creado correctamente");
            onClose();

        } catch (error) {
            console.error('Error saving evaluation:', error);
            toast.error(`No se pudo generar el documento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const escala = [
        { value: 0, label: 'NA - No aplica' },
        { value: 1, label: 'S - Suficiente' },
        { value: 2, label: 'R - Regular' },
        { value: 3, label: 'B - Bueno' },
        { value: 4, label: 'E - Excelente' }
    ];

    const RadioGroup: React.FC<RadioGroupProps> = ({ 
        section, 
        field, 
        value, 
        label 
    }) => (
        <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex flex-wrap gap-4">
                {escala.map((item) => (
                    <label key={item.value} className="flex items-center space-x-1">
                        <input
                            type="radio"
                            name={`${section}-${field}`}
                            value={item.value}
                            checked={value === item.value}
                            onChange={(e) => handleInputChange(section, field, parseInt(e.target.value))}
                            className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{item.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando datos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800">Evaluación de Desempeño</h1>
            
            {/* Información General */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                    <input
                        type="text"
                        value={evaluationData.ciudad}
                        onChange={(e) => handleGeneralChange('ciudad', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Día</label>
                        <input
                            type="text"
                            value={evaluationData.fecha.dia}
                            onChange={(e) => handleFechaChange('dia', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="DD"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                        <input
                            type="text"
                            value={evaluationData.fecha.mes}
                            onChange={(e) => handleFechaChange('mes', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="MM"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                        <input
                            type="text"
                            value={evaluationData.fecha.año}
                            onChange={(e) => handleFechaChange('año', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="AAAA"
                        />
                    </div>
                </div>
            
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Trabajador</label>
                    <input
                        type="text"
                        value={evaluationData.nombreTrabajador}
                        onChange={(e) => handleGeneralChange('nombreTrabajador', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Área</label>
                    <input
                        type="text"
                        value={evaluationData.area}
                        onChange={(e) => handleGeneralChange('area', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Puesto</label>
                    <input
                        type="text"
                        value={evaluationData.puesto}
                        onChange={(e) => handleGeneralChange('puesto', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Secciones de Evaluación */}
            <div className="space-y-6">
                {/* Actitud hacia el trabajo */}
                <div className="p-4 border rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">1. ACTITUD HACIA EL TRABAJO</h3>
                    <RadioGroup section="actitudTrabajo" field="interesErrores" value={evaluationData.actitudTrabajo.interesErrores} label="Interés por no cometer errores" />
                    <RadioGroup section="actitudTrabajo" field="aprendizaje" value={evaluationData.actitudTrabajo.aprendizaje} label="Aprendizaje eficiente de sus funciones" />
                    <RadioGroup section="actitudTrabajo" field="seguimientoReglas" value={evaluationData.actitudTrabajo.seguimientoReglas} label="Seguimiento de reglas y procedimientos" />
                    <RadioGroup section="actitudTrabajo" field="sentidoUrgencia" value={evaluationData.actitudTrabajo.sentidoUrgencia} label="Sentido de urgencia" />
                </div>

                {/* Cooperación/Integración */}
                <div className="p-4 border rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">2. COOPERACIÓN/INTEGRACIÓN</h3>
                    <RadioGroup section="cooperacion" field="cooperacionSolicitada" value={evaluationData.cooperacion.cooperacionSolicitada} label="Cooperación cuando se lo solicitan" />
                    <RadioGroup section="cooperacion" field="cooperacionNoSolicitada" value={evaluationData.cooperacion.cooperacionNoSolicitada} label="Cooperación cuando NO se lo solicitan" />
                    <RadioGroup section="cooperacion" field="sugerencias" value={evaluationData.cooperacion.sugerencias} label="Sugerencias para la mejora continua" />
                    <RadioGroup section="cooperacion" field="integracion" value={evaluationData.cooperacion.integracion} label="Integración con sus compañeros" />
                </div>

                {/* Calidad en el trabajo */}
                <div className="p-4 border rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">3. CALIDAD EN EL TRABAJO</h3>
                    <RadioGroup section="calidadTrabajo" field="calidadForma" value={evaluationData.calidadTrabajo.calidadForma} label="Calidad de resultados (en forma)" />
                    <RadioGroup section="calidadTrabajo" field="calidadTiempo" value={evaluationData.calidadTrabajo.calidadTiempo} label="Calidad de resultados (en tiempo)" />
                    <RadioGroup section="calidadTrabajo" field="adaptacion" value={evaluationData.calidadTrabajo.adaptacion} label="Adaptación ante los cambios" />
                    <RadioGroup section="calidadTrabajo" field="dominio" value={evaluationData.calidadTrabajo.dominio} label="Dominio de funciones" />
                </div>

                {/* Relaciones */}
                <div className="p-4 border rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">4. RELACIONES</h3>
                    <RadioGroup section="relaciones" field="conCompaneros" value={evaluationData.relaciones.conCompaneros} label="Relaciones con sus compañeros" />
                    <RadioGroup section="relaciones" field="conSuperiores" value={evaluationData.relaciones.conSuperiores} label="Relaciones con sus superiores" />
                    <RadioGroup section="relaciones" field="conSubordinados" value={evaluationData.relaciones.conSubordinados} label="Relaciones con sus subordinados" />
                    <RadioGroup section="relaciones" field="conClientes" value={evaluationData.relaciones.conClientes} label="Relaciones con clientes/proveedores" />
                </div>

                {/* Asistencia y puntualidad */}
                <div className="p-4 border rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">5. ASISTENCIA Y PUNTUALIDAD</h3>
                    <RadioGroup section="asistencia" field="asistencia" value={evaluationData.asistencia.asistencia} label="Asistencia laboral" />
                    <RadioGroup section="asistencia" field="puntualidad" value={evaluationData.asistencia.puntualidad} label="Puntualidad de llegada" />
                    <RadioGroup section="asistencia" field="rotarTurno" value={evaluationData.asistencia.rotarTurno} label="Disponibilidad para rotar turno" />
                    <RadioGroup section="asistencia" field="guardias" value={evaluationData.asistencia.guardias} label="Disponibilidad para guardias" />
                </div>
            </div>

            {/* Decisión del contrato */}
            <div className="mt-6 p-4 border rounded-lg bg-white">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">DECISIÓN DEL CONTRATO</h3>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="decisionContrato"
                            value="prorroga"
                            checked={evaluationData.decisionContrato === 'prorroga'}
                            onChange={(e) => handleGeneralChange('decisionContrato', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2">Se prorroga por un mes</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="decisionContrato"
                            value="indefinido"
                            checked={evaluationData.decisionContrato === 'indefinido'}
                            onChange={(e) => handleGeneralChange('decisionContrato', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2">Se otorga por tiempo indefinido</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="decisionContrato"
                            value="termina"
                            checked={evaluationData.decisionContrato === 'termina'}
                            onChange={(e) => handleGeneralChange('decisionContrato', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2">Se termina</span>
                    </label>
                </div>
                
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre y Firma del evaluador *</label>
                    <input
                        type="text"
                        value={evaluationData.nombreEvaluador}
                        onChange={(e) => handleGeneralChange('nombreEvaluador', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nombre completo del evaluador"
                        required
                    />
                </div>
            </div>
            
            <div className="flex justify-center mt-8 gap-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-cyan-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-md transition-colors"
                >
                    {isSaving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Guardando...
                        </>
                    ) : (
                        evaluationData.nombreEvaluador ? 'Actualizar Evaluación' : 'Guardar Evaluación'
                    )}
                </button>
            </div>
        </div>
    );
};

export default PerformanceEvaluation;