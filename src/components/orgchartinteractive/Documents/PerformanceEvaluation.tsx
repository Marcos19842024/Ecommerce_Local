import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { EvaluationData, StaffRecruitmentProps } from '../../../interfaces/orgchartinteractive.interface';
import { url } from '../../../server/url';
import { pdf } from '@react-pdf/renderer';
import PdfPerformanceEvaluation from '../PdfDocuments/PdfPerformanceEvaluation';

type EvaluationSection = | 'actitudTrabajo' | 'cooperacion' | 'calidadTrabajo' | 'relaciones' | 'asistencia';
interface RadioGroupProps {
    section: EvaluationSection;
    field: string;
    value: number;
    label: string;
}

const PerformanceEvaluation: React.FC<StaffRecruitmentProps> = ({ employee, onClose }) => {
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

    const handleSave = async () => {
        try {
            // Validar que employee esté definido
            if (!employee) {
                throw new Error("Perfil de puesto no proporcionados");
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
            formDatasend.append('file', blob, "Evaluacion de desempeño.pdf");
            
            const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(employee.name)}`, {
                method: 'POST',
                body: formDatasend,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al guardar en el servidor: ${response.status} - ${errorText}`);
            }

            toast.success("Evaluacion de desempeño.pdf creado correctamente");
            
            onClose();

        } catch (error) {
            toast.error(`No se pudo generar el documento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
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

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-6">Evaluación de Desempeño</h1>
            
            {/* Información General */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                    <input
                        type="text"
                        value={evaluationData.ciudad}
                        onChange={(e) => handleGeneralChange('ciudad', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Día</label>
                        <input
                            type="text"
                            value={evaluationData.fecha.dia}
                            onChange={(e) => handleFechaChange('dia', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mes</label>
                        <input
                            type="text"
                            value={evaluationData.fecha.mes}
                            onChange={(e) => handleFechaChange('mes', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Año</label>
                        <input
                            type="text"
                            value={evaluationData.fecha.año}
                            onChange={(e) => handleFechaChange('año', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                </div>
            
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Trabajador</label>
                    <input
                        type="text"
                        value={evaluationData.nombreTrabajador}
                        onChange={(e) => handleGeneralChange('nombreTrabajador', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Área</label>
                    <input
                        type="text"
                        value={evaluationData.area}
                        onChange={(e) => handleGeneralChange('area', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Puesto</label>
                    <input
                        type="text"
                        value={evaluationData.puesto}
                        onChange={(e) => handleGeneralChange('puesto', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
            </div>

            {/* Secciones de Evaluación */}
            <div className="space-y-6">
                {/* Actitud hacia el trabajo */}
                <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">1. ACTITUD HACIA EL TRABAJO</h3>
                    <RadioGroup section="actitudTrabajo" field="interesErrores" value={evaluationData.actitudTrabajo.interesErrores} label="Interés por no cometer errores" />
                    <RadioGroup section="actitudTrabajo" field="aprendizaje" value={evaluationData.actitudTrabajo.aprendizaje} label="Aprendizaje eficiente de sus funciones" />
                    <RadioGroup section="actitudTrabajo" field="seguimientoReglas" value={evaluationData.actitudTrabajo.seguimientoReglas} label="Seguimiento de reglas y procedimientos" />
                    <RadioGroup section="actitudTrabajo" field="sentidoUrgencia" value={evaluationData.actitudTrabajo.sentidoUrgencia} label="Sentido de urgencia" />
                </div>

                {/* Cooperación/Integración */}
                <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">2. COOPERACIÓN/INTEGRACIÓN</h3>
                    <RadioGroup section="cooperacion" field="cooperacionSolicitada" value={evaluationData.cooperacion.cooperacionSolicitada} label="Cooperación cuando se lo solicitan" />
                    <RadioGroup section="cooperacion" field="cooperacionNoSolicitada" value={evaluationData.cooperacion.cooperacionNoSolicitada} label="Cooperación cuando NO se lo solicitan" />
                    <RadioGroup section="cooperacion" field="sugerencias" value={evaluationData.cooperacion.sugerencias} label="Sugerencias para la mejora continua" />
                    <RadioGroup section="cooperacion" field="integracion" value={evaluationData.cooperacion.integracion} label="Integración con sus compañeros" />
                </div>

                {/* Calidad en el trabajo */}
                <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">3. CALIDAD EN EL TRABAJO</h3>
                    <RadioGroup section="calidadTrabajo" field="calidadForma" value={evaluationData.calidadTrabajo.calidadForma} label="Calidad de resultados (en forma)" />
                    <RadioGroup section="calidadTrabajo" field="calidadTiempo" value={evaluationData.calidadTrabajo.calidadTiempo} label="Calidad de resultados (en tiempo)" />
                    <RadioGroup section="calidadTrabajo" field="adaptacion" value={evaluationData.calidadTrabajo.adaptacion} label="Adaptación ante los cambios" />
                    <RadioGroup section="calidadTrabajo" field="dominio" value={evaluationData.calidadTrabajo.dominio} label="Dominio de funciones" />
                </div>

                {/* Relaciones */}
                <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">4. RELACIONES</h3>
                    <RadioGroup section="relaciones" field="conCompaneros" value={evaluationData.relaciones.conCompaneros} label="Relaciones con sus compañeros" />
                    <RadioGroup section="relaciones" field="conSuperiores" value={evaluationData.relaciones.conSuperiores} label="Relaciones con sus superiores" />
                    <RadioGroup section="relaciones" field="conSubordinados" value={evaluationData.relaciones.conSubordinados} label="Relaciones con sus subordinados" />
                    <RadioGroup section="relaciones" field="conClientes" value={evaluationData.relaciones.conClientes} label="Relaciones con clientes/proveedores" />
                </div>

                {/* Asistencia y puntualidad */}
                <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">5. ASISTENCIA Y PUNTUALIDAD</h3>
                    <RadioGroup section="asistencia" field="asistencia" value={evaluationData.asistencia.asistencia} label="Asistencia laboral" />
                    <RadioGroup section="asistencia" field="puntualidad" value={evaluationData.asistencia.puntualidad} label="Puntualidad de llegada" />
                    <RadioGroup section="asistencia" field="rotarTurno" value={evaluationData.asistencia.rotarTurno} label="Disponibilidad para rotar turno" />
                    <RadioGroup section="asistencia" field="guardias" value={evaluationData.asistencia.guardias} label="Disponibilidad para guardias" />
                </div>
            </div>

            {/* Decisión del contrato */}
            <div className="mt-6 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">DECISIÓN DEL CONTRATO</h3>
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
                    <label className="block text-sm font-medium text-gray-700">Nombre y Firma del evaluador</label>
                    <input
                        type="text"
                        value={evaluationData.nombreEvaluador}
                        onChange={(e) => handleGeneralChange('nombreEvaluador', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex justify-end space-x-4">
                <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                    Guardar Evaluación
                </button>
            </div>
        </div>
    );
};

export default PerformanceEvaluation;