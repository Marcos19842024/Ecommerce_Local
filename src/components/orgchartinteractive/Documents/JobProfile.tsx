import { useState } from 'react';
import { JobProfileData, StaffRecruitmentProps } from '../../../interfaces/orgchartinteractive.interface';
import { PdfJobProfile } from '../PdfDocuments/PdfJobProfile';
import { url } from '../../../server/url';
import toast from 'react-hot-toast';
import { pdf } from '@react-pdf/renderer';

export const initialJobProfileData: JobProfileData = {
    generalInfo: {
        position: 'Coordinador Administrativo',
        numberOfPositions: '1',
        location: 'Campeche, Camp.',
        department: 'Administración',
        reportsTo: 'Director General',
        objective: 'Garantizar que todas las actividades administrativas se desarrollen de manera eficiente y sin interrupciones. Su visión estratégica y capacidad de ejecución apoyan a que los recursos de la empresa se utilicen de manera óptima, asegurando la salud animal y el Servicio al Cliente, enfocado en el cumplimiento del presupuesto, logro de los objetivos y con los más altos estándares de calidad.',
        schedule: 'Lunes a Sábado de 12:00 a 20:00 horas'
    },
    requirements: {
        education: 'Lic. en Administración o carrera afín.',
        degree: 'Pasante o Titulado',
        experience: 'Experiencia laboral al menos 3 años en puestos similares o en gestión administrativa, capacidad de organización y comunicación.'
    },
    responsibilities: [
        { id: 1, description: 'Planificar, coordinar y realizar seguimiento a la gestión de los recursos humanos y financieros del área para alcanzar los objetivos e identificar oportunidades de mejora en procesos y actividades del área.' },
        { id: 2, description: 'Mantener el buen ambiente de trabajo y la comunicación abierta y cordial entre todo el personal.' },
        { id: 3, description: 'Asegurar el cumplimiento de los procedimientos y políticas establecidas por la empresa.' },
        { id: 4, description: 'Planificar y realizar seguimiento a la gestión de los recursos humanos y financieros del área para alcanzar los objetivos.' },
        { id: 5, description: 'Colaborar con otros departamentos para asegurar un flujo eficiente de la información.' }
    ],
    specificFunctions: [
        { id: 1, description: 'Recorrido de supervisión de operaciones diarias en la recepción, servicio médico, pensión, estética, consultorios, tienda, comedor y áreas comunes.' },
        { id: 2, description: 'Revisar y evaluar que las áreas de trabajo estén limpias y ordenadas en todo momento.' },
        { id: 3, description: 'Implementar tácticas específicas para limitar el gasto, ampliar los recursos existentes y administrar correctamente.' },
        { id: 4, description: 'Fomentar el trabajo en equipo, incluyendo la celebración de reuniones regulares, la promoción del intercambio de ideas y la creación de una cultura de colaboración en el lugar de trabajo.' },
        { id: 5, description: 'Gestión administrativa orientada a remitir la información al área correspondiente para efectuar los cobros pertinentes y llevar a cabo el control de inventarios.' },
        { id: 6, description: 'Dar seguimiento a las inconformidades de los clientes y/o malas actitudes del personal' },
        { id: 7, description: 'Validar los pedidos de compras conforme al inventario y la rotación de productos.' },
        { id: 8, description: 'Crear una comunicación clara, abierta y respetuosa entre el personal y los clientes.' },
        { id: 9, description: 'Coordinar y realizar los inventarios para cierres de mes / año.' },
        { id: 10, description: 'Resolver problemas para asegurar que los equipos trabajen de forma cohesionada y en línea con los objetivos organizativos.' },
        { id: 11, description: 'Brindar apoyo administrativo para asegurar operaciones suaves y eficientes en la oficina, incluyendo tareas como archivar, programar y saludar a los visitantes.' },
        { id: 12, description: 'Coordinar y realizar el servicio de transporte.' }
    ],
    skills: [
        { id: 1, skill: 'Analítico para la resolución de problemas y conflictos', level: 'expert' },
        { id: 2, skill: 'Conocimiento y habilidad en manejo de personal.', level: 'competent' },
        { id: 3, skill: 'Normas de inocuidad, sanitización y seguridad laboral.', level: 'basic' },
        { id: 4, skill: 'Reglamento interno de Bienestar Animal (RIBA)', level: 'competent' },
        { id: 5, skill: 'Manejo de Excel y PP', level: 'basic' }
    ],
    competencies: [
        { id: 1, competency: 'Optimización en los procesos de trabajo', level: 'expert' },
        { id: 2, competency: 'Trabajo en equipo', level: 'expert' },
        { id: 3, competency: 'Toma de decisiones', level: 'competent' },
        { id: 4, competency: 'Solución de problemas y manejo de conflictos', level: 'expert' },
        { id: 5, competency: 'Trabajo bajo presión', level: 'competent' },
        { id: 6, competency: 'Coordinación de labores con las otras áreas', level: 'competent' },
        { id: 7, competency: 'Comunicación efectiva', level: 'competent' },
        { id: 8, competency: 'Liderazgo', level: 'competent' },
        { id: 9, competency: 'Interacción y empatía con el cliente', level: 'expert' }
    ]
};

export const JobProfile = (data: StaffRecruitmentProps) => {
    const [formData, setFormData] = useState<JobProfileData>(initialJobProfileData);

    const handleNestedChange = (
        section: keyof JobProfileData,
        field: string,
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleArrayChange = (
        section: keyof JobProfileData,
        index: number,
        field: string,
        value: string | 'basic' | 'competent' | 'expert'
    ) => {
        setFormData(prev => ({
            ...prev,
            [section]: (prev[section] as any[]).map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const addResponsibility = () => {
        setFormData(prev => ({
            ...prev,
            responsibilities: [
                ...prev.responsibilities,
                { id: Date.now(), description: '' }
            ]
        }));
    };

    const removeResponsibility = (id: number) => {
        setFormData(prev => ({
            ...prev,
            responsibilities: prev.responsibilities.filter(item => item.id !== id)
        }));
    };

    const addFunction = () => {
        setFormData(prev => ({
            ...prev,
            specificFunctions: [
                ...prev.specificFunctions,
                { id: Date.now(), description: '' }
            ]
        }));
    };

    const removeFunction = (id: number) => {
        setFormData(prev => ({
            ...prev,
            specificFunctions: prev.specificFunctions.filter(item => item.id !== id)
        }));
    };

    const addSkill = () => {
        setFormData(prev => ({
            ...prev,
            skills: [
                ...prev.skills,
                { id: Date.now(), skill: '', level: 'basic' }
            ]
        }));
    };

    const removeSkill = (id: number) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(item => item.id !== id)
        }));
    };

    const addCompetency = () => {
        setFormData(prev => ({
            ...prev,
            competencies: [
                ...prev.competencies,
                { id: Date.now(), competency: '', level: 'basic' }
            ]
        }));
    };

    const removeCompetency = (id: number) => {
        setFormData(prev => ({
            ...prev,
            competencies: prev.competencies.filter(item => item.id !== id)
        }));
    };

    const handleSave = async () => {
        try {
            // Validar que employee esté definido
            if (!data.employee) {
                throw new Error("Perfil de puesto no proporcionados");
            }
            
            // Generar el PDF
            const blob = await pdf(<PdfJobProfile data={formData} />).toBlob();
 
            if (!blob) {
                throw new Error("No se pudo generar el blob del documento");
            }

            if (blob.size === 0) {
                throw new Error("El blob está vacío");
            }

            const formDatasend = new FormData();
            formDatasend.append('file', blob, "Perfil de puesto.pdf");
            
            const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(data.employee.name)}`, {
                method: 'POST',
                body: formDatasend,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al guardar en el servidor: ${response.status} - ${errorText}`);
            }

            toast.success("Perfil de puesto.pdf creado correctamente");
            
            data.onClose();

        } catch (error) {
            toast.error(`No se pudo generar el documento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 font-sans">
            <h1 className="text-2xl font-bold mb-8 text-gray-800">Perfil de Puesto</h1>

            {/* Información General */}
            <section className="mb-8 p-6 border border-gray-300 rounded-lg bg-gray-50">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b border-gray-300 pb-2">1. Información General</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="font-medium mb-2 text-gray-700">Puesto:</label>
                        <input
                            type="text"
                            name="position"
                            value={formData.generalInfo.position}
                            onChange={(e) => handleNestedChange('generalInfo', 'position', e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-2 text-gray-700">No. Posiciones:</label>
                        <input
                            type="number"
                            name="numberOfPositions"
                            value={formData.generalInfo.numberOfPositions}
                            onChange={(e) => handleNestedChange('generalInfo', 'numberOfPositions', e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-2 text-gray-700">Ubicación:</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.generalInfo.location}
                            onChange={(e) => handleNestedChange('generalInfo', 'location', e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-2 text-gray-700">Departamento:</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.generalInfo.department}
                            onChange={(e) => handleNestedChange('generalInfo', 'department', e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className="font-medium mb-2 text-gray-700">Reporta a:</label>
                        <input
                            type="text"
                            name="reportsTo"
                            value={formData.generalInfo.reportsTo}
                            onChange={(e) => handleNestedChange('generalInfo', 'reportsTo', e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className="font-medium mb-2 text-gray-700">Objetivo:</label>
                        <textarea
                            name="objective"
                            value={formData.generalInfo.objective}
                            onChange={(e) => handleNestedChange('generalInfo', 'objective', e.target.value)}
                            rows={3}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                        />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className="font-medium mb-2 text-gray-700">Horario:</label>
                        <textarea
                            name="schedule"
                            value={formData.generalInfo.schedule}
                            onChange={(e) => handleNestedChange('generalInfo', 'schedule', e.target.value)}
                            rows={3}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                        />
                    </div>
                </div>
            </section>

            {/* Requisitos del Puesto */}
            <section className="mb-8 p-6 border border-gray-300 rounded-lg bg-gray-50">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b border-gray-300 pb-2">2. Requisitos del Puesto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="font-medium mb-2 text-gray-700">Educación:</label>
                        <input
                            type="text"
                            name="education"
                            value={formData.requirements.education}
                            onChange={(e) => handleNestedChange('requirements', 'education', e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-2 text-gray-700">Grado:</label>
                        <input
                            type="text"
                            name="degree"
                            value={formData.requirements.degree}
                            onChange={(e) => handleNestedChange('requirements', 'degree', e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className="font-medium mb-2 text-gray-700">Experiencia:</label>
                        <textarea
                            name="experience"
                            value={formData.requirements.experience}
                            onChange={(e) => handleNestedChange('requirements', 'experience', e.target.value)}
                            rows={2}
                            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                        />
                    </div>
                </div>
            </section>

            {/* Responsabilidades Clave */}
            <section className="mb-8 p-6 border border-gray-300 rounded-lg bg-gray-50">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b border-gray-300 pb-2">3. Responsabilidades Clave del Puesto</h2>
                {formData.responsibilities.map((responsibility, index) => (
                    <div key={responsibility.id} className="mb-4 p-4 bg-white rounded border border-gray-300">
                        <div className="flex flex-col">
                            <label className="font-medium mb-2 text-gray-700">Responsabilidad {index + 1}:</label>
                            <textarea
                                value={responsibility.description}
                                onChange={(e) => handleArrayChange('responsibilities', index, 'description', e.target.value)}
                                rows={2}
                                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                            />
                            {formData.responsibilities.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeResponsibility(responsibility.id)}
                                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors self-start"
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <button 
                    type="button" 
                    onClick={addResponsibility}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                    + Agregar Responsabilidad
                </button>
            </section>

            {/* Funciones Específicas */}
            <section className="mb-8 p-6 border border-gray-300 rounded-lg bg-gray-50">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b border-gray-300 pb-2">4. Responsabilidades y Funciones Específicas</h2>
                {formData.specificFunctions.map((func, index) => (
                    <div key={func.id} className="mb-4 p-4 bg-white rounded border border-gray-300">
                        <div className="flex flex-col">
                            <label className="font-medium mb-2 text-gray-700">Función {String.fromCharCode(97 + index)}:</label>
                            <textarea
                                value={func.description}
                                onChange={(e) => handleArrayChange('specificFunctions', index, 'description', e.target.value)}
                                rows={2}
                                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                            />
                            {formData.specificFunctions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeFunction(func.id)}
                                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors self-start"
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <button 
                    type="button" 
                    onClick={addFunction}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                    + Agregar Función
                </button>
            </section>

            {/* Conocimientos, Habilidades y Destrezas */}
            <section className="mb-8 p-6 border border-gray-300 rounded-lg bg-gray-50">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b border-gray-300 pb-2">5. Conocimientos, Habilidades y Destrezas</h2>
                {formData.skills.map((skill, index) => (
                    <div key={skill.id} className="mb-6 p-4 bg-white rounded border border-gray-300">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="flex flex-col md:col-span-3">
                                <label className="font-medium mb-2 text-gray-700">Habilidad {index + 1}:</label>
                                <input
                                    type="text"
                                    value={skill.skill}
                                    onChange={(e) => handleArrayChange('skills', index, 'skill', e.target.value)}
                                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ingrese la habilidad o conocimiento"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium mb-2 text-gray-700">Nivel:</label>
                                <select
                                    value={skill.level}
                                    onChange={(e) => handleArrayChange('skills', index, 'level', e.target.value as 'basic' | 'competent' | 'expert')}
                                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="basic">Básico</option>
                                    <option value="competent">Competente</option>
                                    <option value="expert">Experto</option>
                                </select>
                            </div>
                        </div>
                        {formData.skills.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeSkill(skill.id)}
                            className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            Eliminar Habilidad
                        </button>
                        )}
                    </div>
                ))}
                <button 
                    type="button" 
                    onClick={addSkill}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                    + Agregar Habilidad
                </button>
            </section>

            {/* Habilidades y Competencias */}
            <section className="mb-8 p-6 border border-gray-300 rounded-lg bg-gray-50">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b border-gray-300 pb-2">6. Habilidades y Competencias</h2>
                {formData.competencies.map((competency, index) => (
                    <div key={competency.id} className="mb-6 p-4 bg-white rounded border border-gray-300">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="flex flex-col md:col-span-3">
                                <label className="font-medium mb-2 text-gray-700">Competencia {index + 1}:</label>
                                <input
                                    type="text"
                                    value={competency.competency}
                                    onChange={(e) => handleArrayChange('competencies', index, 'competency', e.target.value)}
                                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ingrese la competencia"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium mb-2 text-gray-700">Nivel:</label>
                                <select
                                    value={competency.level}
                                    onChange={(e) => handleArrayChange('competencies', index, 'level', e.target.value as 'basic' | 'competent' | 'expert')}
                                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="basic">Básico</option>
                                    <option value="competent">Competente</option>
                                    <option value="expert">Experto</option>
                                </select>
                            </div>
                        </div>
                        {formData.competencies.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeCompetency(competency.id)}
                            className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            Eliminar Competencia
                        </button>
                        )}
                    </div>
                ))}
                <button 
                    type="button" 
                    onClick={addCompetency}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                    + Agregar Competencia
                </button>
            </section>

            <div className="text-center mt-8">
                <button 
                    type="button" 
                    onClick={handleSave}
                    className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-lg font-medium"
                >
                    Guardar y Generar PDF
                </button>
            </div>
        </div>
    );
};