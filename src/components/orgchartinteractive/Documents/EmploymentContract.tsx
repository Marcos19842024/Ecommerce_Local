import { pdf } from "@react-pdf/renderer";
import { useState, useEffect } from "react";
import { ContractData, EmploymentContractProps, PersonalFormData } from "../../../interfaces/orgchartinteractive.interface";
import { formatDateLong } from "../../../helpers";
import toast from "react-hot-toast";
import { PdfEmploymentContract } from "../PdfDocuments/PdfEmploymentContract";
import { apiService } from "../../../services/api";

const EmployeementContract = ({ file, onClose, employee }: EmploymentContractProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [contractData, setContractData] = useState<ContractData>({
        trabajador: '',
        estadoOrigen: '',
        curp: '',
        rfc: '',
        type: '',
        duracionContrato: '',
        puesto: '',
        salarioDiario: '',
        salarioSemanal: '',
        fechaContrato: '',
        actividades: []
    });

    // Estados para controlar los checkboxes
    const [isIndefinido, setIsIndefinido] = useState<boolean>(false);
    const [isDefinido, setIsDefinido] = useState<boolean>(true);
    const [fechaInput, setFechaInput] = useState<string>(new Date().toISOString().split('T')[0]);
    const [nuevaActividad, setNuevaActividad] = useState<string>('');

    // Cargar datos existentes del JSON
    useEffect(() => {
        // En tu frontend (EmploymentContract.tsx), modifica esta parte:
        const loadExistingData = async () => {
            try {
                // ✅ Primero intentar cargar datos del JSON específico del contrato
                const serverFiles = await apiService.getEmployeeFiles(employee.name);
                
                const contractJsonFile = serverFiles.find((file: any) => file.name === 'Contrato laboral.json');
                
                if (contractJsonFile) {
                    // ✅ Usar apiService.fetchDirect para obtener el JSON
                    try {
                        const response = await apiService.fetchDirect(`/orgchart/employees/${employee.name}/Contrato laboral.json`);
                        
                        if (response.ok) {
                            const existingData = await response.json();
                            
                            // ✅ Actualización EXPLÍCITA de todas las propiedades
                            setContractData({
                                trabajador: existingData.trabajador || '',
                                estadoOrigen: existingData.estadoOrigen || '',
                                curp: existingData.curp || '',
                                rfc: existingData.rfc || '',
                                type: existingData.type || 'DETERMINADO',
                                duracionContrato: existingData.duracionContrato || '',
                                puesto: existingData.puesto || '',
                                salarioDiario: existingData.salarioDiario || '',
                                salarioSemanal: existingData.salarioSemanal || '',
                                fechaContrato: existingData.fechaContrato || '',
                                actividades: existingData.actividades || [] // ✅ Esto es lo crucial
                            });
                            
                            // Configurar checkboxes según el tipo de contrato
                            if (existingData.type === 'INDETERMINADO') {
                                setIsIndefinido(true);
                                setIsDefinido(false);
                            } else {
                                setIsIndefinido(false);
                                setIsDefinido(true);
                            }
                            
                            if (existingData.fechaContrato) {
                                // Convertir fecha formateada a formato input
                                const [dia, mes, anio] = existingData.fechaContrato.split('/');
                                if (dia && mes && anio) {
                                    setFechaInput(`${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`);
                                }
                            }
                            
                            setIsLoading(false);
                            return;
                            
                        } else {
                            toast.error('Contract JSON not found, using empty state');
                        }
                        
                    } catch (jsonError) {
                        toast.error('Error loading contract JSON:' + jsonError);
                    }
                }

                // Si no existe JSON del contrato, procesar el JSON de alta de personal
                if (!file || !file.url) {
                    setIsLoading(false);
                    return;
                }
                
                // ✅ Descargar el JSON de alta usando apiService.fetchDirect
                const response = await apiService.fetchDirect(file.url);
                const jsonData: PersonalFormData = await response.json();
                const extractedData = parseJsonData(jsonData);
                
                setContractData(prev => ({
                    ...prev,
                    ...extractedData
                }));
                
            } catch (error) {
                toast.error('Error loading contract data:' + error);
            } finally {
                setIsLoading(false);
            }
        };

        loadExistingData();
    }, [file, employee.name, onClose]);

    // Función para procesar el JSON
    const parseJsonData = (jsonData: PersonalFormData): Partial<ContractData> => {
        // Construir nombre completo
        const nombreCompleto = `${jsonData.nombres} ${jsonData.apellidoPaterno} ${jsonData.apellidoMaterno}`.trim();
        
        // Extraer los datos específicos
        const extractedData = {
            trabajador: nombreCompleto || '',
            estadoOrigen: jsonData.datosPersonales?.estadoNacimiento || '',
            curp: jsonData.datosPersonales?.curp || '',
            rfc: jsonData.datosPersonales?.rfc || '',
            type: 'DETERMINADO',
            duracionContrato: '30',
            salarioDiario: '$0.00',
            puesto: employee.puesto || '',
            salarioSemanal: '',
            fechaContrato: jsonData.datosPersonales?.fechaIngreso ? 
                formatDateLong(jsonData.datosPersonales.fechaIngreso) : 
                formatDateLong(new Date().toISOString().split('T')[0]),
            actividades: [] // ✅ Siempre array vacío para nuevo contrato
        };
        
        return extractedData;
    };

    // Función para extraer valor numérico del salario
    const extractNumericValue = (salaryString: string): number => {
        const numericString = salaryString.replace(/[^\d.]/g, '');
        return parseFloat(numericString) || 0;
    };

    // Función para formatear moneda
    const formatCurrency = (amount: number): string => {
        return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    };

    // Efecto para calcular salario semanal
    useEffect(() => {
        const dailySalary = extractNumericValue(contractData.salarioDiario);
        const weeklySalary = dailySalary * 7;
        
        setContractData(prev => ({
            ...prev,
            salarioSemanal: formatCurrency(weeklySalary)
        }));
    }, [contractData.salarioDiario]);

    // Efecto para sincronizar fecha
    useEffect(() => {
        if (fechaInput) {
            const fechaFormateada = formatDateLong(fechaInput);
            setContractData(prev => ({
                ...prev,
                fechaContrato: fechaFormateada
            }));
        }
    }, [fechaInput]);

    // Manejar cambios en los inputs
    const handleInputChange = (field: keyof ContractData, value: string) => {
        setContractData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Manejar cambio de tipo de contrato
    const handleTipoContratoChange = (tipo: 'indeterminado' | 'determinado') => {
        if (tipo === 'indeterminado') {
            setIsIndefinido(true);
            setIsDefinido(false);
            setContractData(prev => ({ ...prev, duracionContrato: '', type: 'INDETERMINADO' }));
        } else {
            setIsIndefinido(false);
            setIsDefinido(true);
            if (!contractData.duracionContrato || contractData.duracionContrato === '') {
                setContractData(prev => ({ ...prev, duracionContrato: '30', type: 'DETERMINADO' }));
            }
        }
    };

    // Manejar actividades
    const handleAgregarActividad = () => {
        if (nuevaActividad.trim() === '') {
            toast.error('La actividad no puede estar vacía');
            return;
        }

        setContractData(prev => ({
            ...prev,
            actividades: [...prev.actividades, nuevaActividad.trim()]
        }));

        setNuevaActividad('');
    };

    const handleEliminarActividad = (index: number) => {
        setContractData(prev => ({
            ...prev,
            actividades: prev.actividades.filter((_, i) => i !== index)
        }));
    };

    const handleEditarActividad = (index: number, nuevoTexto: string) => {
        const nuevasActividades = [...contractData.actividades];
        nuevasActividades[index] = nuevoTexto;
        
        setContractData(prev => ({
            ...prev,
            actividades: nuevasActividades
        }));
    };

    // Generar PDF
    const handleGeneratePdf = async () => {
        try {
            if (!isIndefinido && !isDefinido) {
                toast.error("Por favor, seleccione un tipo de contrato");
                return;
            }

            if (isDefinido && (!contractData.duracionContrato || contractData.duracionContrato.trim() === '')) {
                toast.error("Para contrato temporal, ingrese la duración en días");
                return;
            }

            const dailySalary = extractNumericValue(contractData.salarioDiario);
            if (dailySalary <= 0) {
                toast.error("Por favor, ingrese un salario diario válido");
                return;
            }

            if (!contractData.fechaContrato || contractData.fechaContrato.trim() === '') {
                toast.error("Por favor, ingrese una fecha válida");
                return;
            }

            // ✅ Generar y subir PDF con JSON usando apiService
            const blob = await pdf(<PdfEmploymentContract data={contractData} />).toBlob();
            const formDataUpload = new FormData();
            formDataUpload.append('file', blob, "Contrato laboral.pdf");
            formDataUpload.append('jsonData', JSON.stringify(contractData));
            
            await apiService.uploadEmployeeFile(contractData.trabajador, formDataUpload);

            toast.success("Contrato laboral.pdf creado correctamente");
            onClose();
        } catch (error) {
            toast.error("Error al generar el Contrato laboral.pdf");
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando datos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center">Contrato laboral</h1>
            <form className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold m-4">Información Personal</h2>
                <div className="bg-gray-100 p-2 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="font-semibold">Nombre del Trabajador:</span>
                        <input
                            type="text"
                            value={contractData.trabajador}
                            onChange={(e) => handleInputChange('trabajador', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Nombre completo"
                        />
                    </div>
                    <div>
                        <span className="font-semibold">Estado de Origen:</span>
                        <input
                            type="text"
                            value={contractData.estadoOrigen}
                            onChange={(e) => handleInputChange('estadoOrigen', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Estado"
                        />
                    </div>
                    <div>
                        <span className="font-semibold">CURP:</span>
                        <input
                            type="text"
                            value={contractData.curp}
                            onChange={(e) => handleInputChange('curp', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="CURP"
                        />
                    </div>
                    <div>
                        <span className="font-semibold">RFC:</span>
                        <input
                            type="text"
                            value={contractData.rfc}
                            onChange={(e) => handleInputChange('rfc', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="RFC"
                        />
                    </div>
                </div>

                <h2 className="text-xl font-bold m-4">Información del contrato</h2>
                <div className="bg-gray-100 p-2 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="m-1 gap-2 flex flex-col">
                        <label className="block text-sm font-medium font-semibold mb-1">
                            Tipo de contrato:
                        </label>
                        <label className="flex items-center gap-1 text-cyan-600 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={isIndefinido} 
                                onChange={() => handleTipoContratoChange('indeterminado')}
                                className="rounded text-cyan-600 focus:ring-cyan-500"
                            />
                            Indefinido
                        </label>
                        <label className="flex items-center gap-1 text-cyan-600 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={isDefinido} 
                                onChange={() => handleTipoContratoChange('determinado')}
                                className="rounded text-cyan-600 focus:ring-cyan-500"
                            />
                            Temporal
                        </label>
                        
                        {isDefinido && (
                            <div>
                                <label className="block text-sm font-medium font-semibold mb-1">
                                    Duración del Contrato (días):
                                </label>
                                <input
                                    type="text"
                                    value={contractData.duracionContrato}
                                    onChange={(e) => handleInputChange('duracionContrato', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    required={isDefinido}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium font-semibold mb-1">
                            Puesto:
                        </label>
                        <input
                            type="text"
                            value={contractData.puesto}
                            onChange={(e) => handleInputChange('puesto', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            required
                            placeholder="Puesto"
                        />

                        <label className="block text-sm font-medium font-semibold mb-1">
                            Salario diario *:
                        </label>
                        <input
                            type="text"
                            value={contractData.salarioDiario}
                            onChange={(e) => handleInputChange('salarioDiario', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            required
                            placeholder="$0.00"
                        />
                    
                        <p className="text-xs text-gray-500 mt-1">
                            Salario semanal: {contractData.salarioSemanal} 
                        </p>

                        <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                            Fecha del contrato:
                        </label>
                        <input
                            type="date"
                            value={fechaInput}
                            onChange={(e) => setFechaInput(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                            <strong>Fecha formateada:</strong> {contractData.fechaContrato}
                        </p>
                    </div>
                </div>

                {/* SECCIÓN DE ACTIVIDADES - FUERA DEL GRID ANTERIOR */}
                <h2 className="text-xl font-bold m-4">Actividades del Trabajador</h2>
                <div className="bg-gray-100 p-4 rounded-md">
                    <div className="mb-4">
                        <label className="block text-sm font-medium font-semibold mb-2">
                            Agregar Nueva Actividad:
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={nuevaActividad}
                                onChange={(e) => setNuevaActividad(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                                placeholder="Escriba una nueva actividad..."
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAgregarActividad();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleAgregarActividad}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium font-semibold mb-2">
                            Lista de Actividades ({contractData.actividades.length}):
                        </label>
                        {contractData.actividades.map((actividad, index) => (
                            <div key={index} className="flex items-start gap-2 bg-white p-3 rounded border">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={actividad}
                                        onChange={(e) => handleEditarActividad(index, e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                        placeholder="Descripción de la actividad..."
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleEliminarActividad(index)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                        
                        {contractData.actividades.length === 0 && (
                            <p className="text-center text-gray-500 py-4">
                                No hay actividades agregadas. Agregue al menos una actividad.
                            </p>
                        )}
                    </div>
                </div>
            </form>

            <div className="flex justify-center mt-8 gap-4">
                <button
                    type="button"
                    onClick={handleGeneratePdf}
                    className="bg-cyan-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-md"
                    disabled={isLoading}
                >
                    {contractData.trabajador ? 'Actualizar PDF' : 'Generar PDF'}
                </button>
            </div>
        </div>
    );
};
export default EmployeementContract;