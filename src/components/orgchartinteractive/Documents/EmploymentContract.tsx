import { pdf } from "@react-pdf/renderer";
import { useState } from "react";
import { ContractData, StaffRecruitmentProps } from "../../../interfaces/orgchartinteractive.interface";
import toast from "react-hot-toast";
import { url } from "../../../server/url";
import { PdfEmployeeContract } from "../PdfDocuments/PdfEmployeeContract";

const EmployeementContract = ({employee, onClose}: StaffRecruitmentProps) => {

    const [contractData, setContractData] = useState<ContractData>({
        trabajador: employee.name,
        estadoOrigen: 'Campeche',
        curp: 'CAPR780601HCCMCF06',
        rfc: 'CAPR7806016N5',
        duracionContrato: '30',
        salarioDiario: '$280.00',
        salarioSemanal: '$1,960.00',
        fechaContrato: '18 de agosto del año 2025'
    });

    const handleInputChange = (field: keyof ContractData, value: string) => {
        setContractData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleGeneratePdf = async () => {
        try {
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="trabajador">Nombre del Trabajador:
                        </label>
                        <input
                            type="text"
                            id="trabajador"
                            value={contractData.trabajador}
                            onChange={(e) => handleInputChange('trabajador', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="estadoOrigen">Estado de Origen:
                        </label>
                        <input
                            type="text"
                            id="estadoOrigen"
                            value={contractData.estadoOrigen}
                            onChange={(e) => handleInputChange('estadoOrigen', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="curp">CURP:
                        </label>
                        <input
                            type="text"
                            id="curp"
                            value={contractData.curp}
                            onChange={(e) => handleInputChange('curp', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="rfc">RFC:
                        </label>
                        <input
                            type="text"
                            id="rfc"
                            value={contractData.rfc}
                            onChange={(e) => handleInputChange('rfc', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="duracionContrato">Duración del Contrato (días):
                        </label>
                        <input
                            type="text"
                            id="duracionContrato"
                            value={contractData.duracionContrato}
                            onChange={(e) => handleInputChange('duracionContrato', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="salarioDiario">Salario diario:
                        </label>
                        <input
                            type="text"
                            id="salarioDiario"
                            value={contractData.salarioDiario}
                            onChange={(e) => handleInputChange('salarioDiario', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="salarioSemanal">Salario semanal:
                        </label>
                        <input
                            type="text"
                            id="salarioSemanal"
                            value={contractData.salarioSemanal}
                            onChange={(e) => handleInputChange('salarioSemanal', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="fechaContrato">Fecha del contrato:
                        </label>
                        <input
                            type="date"
                            id="fechaContrato"
                            value={contractData.fechaContrato}
                            onChange={(e) => handleInputChange('fechaContrato', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
            </form>

            <div className="flex justify-center mt-8">
                <button
                    type="button"
                    onClick={handleGeneratePdf}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
                >
                    Generar Pdf
                </button>
            </div>
        </div>
    )
}

export default EmployeementContract