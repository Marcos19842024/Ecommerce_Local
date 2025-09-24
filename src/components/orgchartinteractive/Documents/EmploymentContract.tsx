import { pdf } from "@react-pdf/renderer";
import { useState, useEffect } from "react";
import { ContractData, StaffRecruitmentProps } from "../../../interfaces/orgchartinteractive.interface";
import toast from "react-hot-toast";
import { url } from "../../../server/url";
import { PdfEmployeeContract } from "../PdfDocuments/PdfEmployeeContract";

const EmployeementContract = ({employee, onClose}: StaffRecruitmentProps) => {

    const [contractData, setContractData] = useState<ContractData>({
        trabajador: employee.name,
        estadoOrigen: '', //estos datos deben venir del alta de personal, debe requerir el alta primero para poder generar el contrato
        curp: '',
        rfc: '',
        duracionContrato: '',
        salarioDiario: '',
        salarioSemanal: '',
        fechaContrato: ''
    });

    // Estados para controlar los checkboxes
    const [isIndefinido, setIsIndefinido] = useState<boolean>(false);
    const [isTemporal, setIsTemporal] = useState<boolean>(true); // Temporal por defecto ya que hay duración
    // Estado para manejar la fecha en formato input date (YYYY-MM-DD)
    const [fechaInput, setFechaInput] = useState<string>('2025-09-24'); // Fecha por defecto en formato input

    // Función para extraer el valor numérico del salario diario
    const extractNumericValue = (salaryString: string): number => {
        // Remover símbolos de moneda, comas y espacios
        const numericString = salaryString.replace(/[^\d.]/g, '');
        return parseFloat(numericString) || 0;
    };

    // Función para formatear el salario como moneda
    const formatCurrency = (amount: number): string => {
        return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    };

    // Efecto para calcular el salario semanal cuando cambia el salario diario
    useEffect(() => {
        const dailySalary = extractNumericValue(contractData.salarioDiario);
        const weeklySalary = dailySalary * 7;
        
        setContractData(prev => ({
            ...prev,
            salarioSemanal: formatCurrency(weeklySalary)
        }));
    }, [contractData.salarioDiario]);

    // Función para formatear la fecha en el formato deseado
    const formatFecha = (fecha: string): string => {
        if (!fecha) return '';
        
        try {
            const date = new Date(fecha);
            if (isNaN(date.getTime())) return '';
            
            const dia = date.getDate();
            const meses = [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ];
            const mes = meses[date.getMonth()];
            const año = date.getFullYear();
            
            return `${dia} de ${mes} de ${año}`;
        } catch (error) {
            console.error('Error formateando fecha:', error);
            return '';
        }
    };

    // Efecto para sincronizar la fecha cuando cambia el input
    useEffect(() => {
        if (fechaInput) {
            const fechaFormateada = formatFecha(fechaInput);
            setContractData(prev => ({
                ...prev,
                fechaContrato: fechaFormateada
            }));
        }
    }, [fechaInput]);

    const handleInputChange = (field: keyof ContractData, value: string) => {
        setContractData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Manejar cambio de fecha desde el input date
    const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFechaInput(e.target.value);
    };

    // Función para manejar la selección de tipo de contrato
    const handleTipoContratoChange = (tipo: 'indefinido' | 'temporal') => {
        if (tipo === 'indefinido') {
            setIsIndefinido(true);
            setIsTemporal(false);
            // Limpiar duración si se selecciona indefinido
            setContractData(prev => ({ ...prev, duracionContrato: '' }));
        } else {
            setIsIndefinido(false);
            setIsTemporal(true);
            // Establecer una duración por defecto si está vacía
            if (!contractData.duracionContrato) {
                setContractData(prev => ({ ...prev, duracionContrato: '30' }));
            }
        }
    };

    const handleGeneratePdf = async () => {
        try {
            // Validación antes de generar el PDF
            if (!isIndefinido && !isTemporal) {
                toast.error("Por favor, seleccione un tipo de contrato");
                return;
            }

            if (isTemporal && (!contractData.duracionContrato || contractData.duracionContrato.trim() === '')) {
                toast.error("Para contrato temporal, ingrese la duración en días");
                return;
            }

            // Validar que el salario diario sea válido
            const dailySalary = extractNumericValue(contractData.salarioDiario);
            if (dailySalary <= 0) {
                toast.error("Por favor, ingrese un salario diario válido");
                return;
            }

            // Validar que la fecha sea válida
            if (!contractData.fechaContrato || contractData.fechaContrato.trim() === '') {
                toast.error("Por favor, ingrese una fecha válida");
                return;
            }

            const blob = await pdf(<PdfEmployeeContract data={contractData} />).toBlob();
            const formDataUpload = new FormData();
            formDataUpload.append('file', blob, "Contrato laboral.pdf");
            
            const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(employee.name)}`, {
                method: 'POST',
                body: formDataUpload,
            });

            if (!response.ok) throw new Error("Error al guardar en el servidor");

            toast.success("Contrato laboral.pdf creado correctamente");
            onClose(); // Cerrar el modal después de generar
        } catch (error) {
            toast.error("Error al generar el Contrato laboral.pdf");
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center">Contrato laboral</h1>
      
            <form className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold m-4">Información Personal</h2>
                <div className="bg-gray-100 p-2 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="font-semibold">Nombre del Trabajador:</span>
                        <span
                            className="block text-sm font-medium text-gray-700 mb-1">{contractData.trabajador}
                        </span>
                    </div>
                    <div>
                        <span className="font-semibold">Estado de Origen:</span>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-1">{contractData.estadoOrigen}
                        </label>
                    </div>
                    <div>
                        <span className="font-semibold">CURP:</span>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-1">{contractData.curp}
                        </label>
                    </div>
                    <div>
                        <span className="font-semibold">RFC:</span>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-1">{contractData.rfc}
                        </label>
                    </div>
                </div>

                <h2 className="text-xl font-bold m-4">Información del contrato</h2>
                <div className="bg-gray-100 p-2 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="m-1 gap-2 flex flex-col">
                        <label
                            className="block text-sm font-medium font-semibold mb-1">Tipo de contrato:
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
                        
                        {/* Mostrar campo de duración solo si es temporal */}
                        {isTemporal && (
                            <div>
                                <label
                                    className="block text-sm font-medium font-semibold mb-1"
                                    htmlFor="duracionContrato">Duración del Contrato (días):
                                </label>
                                <input
                                    type="text"
                                    id="duracionContrato"
                                    value={contractData.duracionContrato}
                                    onChange={(e) => handleInputChange('duracionContrato', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700"
                                    required={isTemporal}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            className="block text-sm font-medium font-semibold mb-1"
                            htmlFor="salarioDiario">Salario diario:
                        </label>
                        <input
                            type="text"
                            id="salarioDiario"
                            value={contractData.salarioDiario}
                            onChange={(e) => handleInputChange('salarioDiario', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700"
                            required
                            placeholder="$0.00"
                        />
                    
                        <p className="text-xs text-gray-500 mt-1">
                            Salario semanal: {contractData.salarioSemanal} Calculado automáticamente (salario diario × 7)
                        </p>

                        <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="fechaContrato">Fecha del contrato:
                        </label>
                        <input
                            type="date"
                            id="fechaContratoInput"
                            value={fechaInput}
                            onChange={handleFechaChange}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                            <strong>Fecha formateada:</strong> {contractData.fechaContrato}
                        </p>
                    </div>
                </div>
            </form>

            <div className="flex justify-center mt-8">
                <button
                    type="button"
                    onClick={handleGeneratePdf}
                    className="bg-cyan-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-md"
                >
                    Generar Pdf
                </button>
            </div>
        </div>
    )
}

export default EmployeementContract