import { pdf } from "@react-pdf/renderer";
import { useState, useEffect } from "react";
import { ContractData, EmployeeContractProps, PersonalFormData } from "../../../interfaces/orgchartinteractive.interface";
import { url } from "../../../server/url";
import { PdfEmployeeContract } from "../PdfDocuments/PdfEmployeeContract";
import { formatDateLong } from "../../../helpers";
import toast from "react-hot-toast";

const EmployeementContract = ({ file, onClose }: EmployeeContractProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [contractData, setContractData] = useState<ContractData>({
        trabajador: '',
        estadoOrigen: '',
        curp: '',
        rfc: '',
        duracionContrato: '',
        salarioDiario: '',
        salarioSemanal: '',
        fechaContrato: ''
    });

    // Estados para controlar los checkboxes
    const [isIndefinido, setIsIndefinido] = useState<boolean>(false);
    const [isTemporal, setIsTemporal] = useState<boolean>(true);
    const [fechaInput, setFechaInput] = useState<string>(new Date().toISOString().split('T')[0]);

    // Función para procesar el JSON
    const parseJsonData = (jsonData: PersonalFormData): ContractData => {
        
        // Construir nombre completo
        const nombreCompleto = `${jsonData.nombres} ${jsonData.apellidoPaterno} ${jsonData.apellidoMaterno}`.trim();
        
        // Extraer los datos específicos
        const extractedData = {
            trabajador: nombreCompleto || '',
            estadoOrigen: jsonData.datosPersonales?.estadoNacimiento || '',
            curp: jsonData.datosPersonales?.curp || '',
            rfc: jsonData.datosPersonales?.rfc || '',
            duracionContrato: '30',
            salarioDiario: '$0.00',
            salarioSemanal: '',
            fechaContrato: jsonData.datosPersonales?.fechaIngreso ? 
                formatDateLong(jsonData.datosPersonales.fechaIngreso) : 
                formatDateLong(new Date().toISOString().split('T')[0])
        };
        
        return extractedData;
    };

    // Leer el contenido del JSON desde la URL
    useEffect(() => {
        const readJsonFromUrl = async () => {
            if (!file || !file.url) {
                setIsLoading(false);
                toast.error('No hay archivo JSON para procesar');
                onClose();
                return;
            }
            
            setIsLoading(true);
            try {
                // Descargar el JSON desde la URL
                const response = await fetch(file.url);
                if (!response.ok) {
                    throw new Error(`Error al descargar el JSON: ${response.status}`);
                }

                const jsonData: PersonalFormData = await response.json();

                const extractedData = parseJsonData(jsonData);
                
                setContractData(prev => ({
                    ...prev,
                    ...extractedData
                }));
                
            } catch (error) {
                onClose();
                toast.error('Error al leer el archivo JSON');
            } finally {
                setIsLoading(false);
            }
        };

        readJsonFromUrl();
    }, [file, name, onClose]);

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
    const handleTipoContratoChange = (tipo: 'indefinido' | 'temporal') => {
        if (tipo === 'indefinido') {
            setIsIndefinido(true);
            setIsTemporal(false);
            setContractData(prev => ({ ...prev, duracionContrato: '' }));
        } else {
            setIsIndefinido(false);
            setIsTemporal(true);
            if (!contractData.duracionContrato || contractData.duracionContrato === '') {
                setContractData(prev => ({ ...prev, duracionContrato: '30' }));
            }
        }
    };

    // Generar PDF
    const handleGeneratePdf = async () => {
        try {
            if (!isIndefinido && !isTemporal) {
                toast.error("Por favor, seleccione un tipo de contrato");
                return;
            }

            if (isTemporal && (!contractData.duracionContrato || contractData.duracionContrato.trim() === '')) {
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

            const blob = await pdf(<PdfEmployeeContract data={contractData} />).toBlob();
            const formDataUpload = new FormData();
            formDataUpload.append('file', blob, "Contrato laboral.pdf");
            
            const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(contractData.trabajador)}`, {
                method: 'POST',
                body: formDataUpload,
            });

            if (!response.ok) throw new Error("Error al guardar en el servidor");

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
                    <p className="mt-4 text-gray-600">Leyendo JSON y extrayendo datos...</p>
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
                                onChange={() => handleTipoContratoChange('indefinido')}
                                className="rounded text-cyan-600 focus:ring-cyan-500"
                            />
                            Indefinido
                        </label>
                        <label className="flex items-center gap-1 text-cyan-600 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={isTemporal} 
                                onChange={() => handleTipoContratoChange('temporal')}
                                className="rounded text-cyan-600 focus:ring-cyan-500"
                            />
                            Temporal
                        </label>
                        
                        {isTemporal && (
                            <div>
                                <label className="block text-sm font-medium font-semibold mb-1">
                                    Duración del Contrato (días):
                                </label>
                                <input
                                    type="text"
                                    value={contractData.duracionContrato}
                                    onChange={(e) => handleInputChange('duracionContrato', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    required={isTemporal}
                                />
                            </div>
                        )}
                    </div>

                    <div>
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
            </form>

            <div className="flex justify-center mt-8 gap-4">
                <button
                    type="button"
                    onClick={handleGeneratePdf}
                    className="bg-cyan-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-md"
                    disabled={isLoading}
                >
                    {isLoading ? 'Procesando...' : 'Generar PDF'}
                </button>
            </div>
        </div>
    );
};

export default EmployeementContract;