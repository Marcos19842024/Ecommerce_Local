import { useEffect, useState } from "react";
import { StaffRecruitmentProps } from "../../../interfaces/orgchartinteractive.interface"
import toast from "react-hot-toast";
import { pdf } from "@react-pdf/renderer";
import PdfRIT from "../PdfDocuments/PdfRIT";
import { apiService } from "../../../services/api";

export const RIT = (data: StaffRecruitmentProps) => {
    const [isGenerating, setIsGenerating] = useState(true);
    
    const handleGenerateDocument = async () => {
        try {
            // Validar que employee esté definido
            if (!data.employee) {
                throw new Error("Datos del empleado no proporcionados");
            }
            
            // Generar el PDF
            const blob = await pdf(<PdfRIT name={data.employee.name} />).toBlob();

            if (!blob) {
                throw new Error("No se pudo generar el blob del documento");
            }

            if (blob.size === 0) {
                throw new Error("El blob está vacío");
            }

            const formData = new FormData();
            formData.append('file', blob, "RIT.pdf");
            
            // ✅ Usar apiService para subir el archivo
            await apiService.uploadEmployeeFile(data.employee.name, formData);

            toast.success("RIT.pdf creado correctamente");
            data.onClose();

        } catch (error) {
            console.error('Error generating RIT:', error);
            toast.error(`No se pudo generar el documento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    // Ejecutar la generación del documento cuando el componente se monta
    useEffect(() => {
        handleGenerateDocument();
    }, []);

    if (isGenerating) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Generando RIT.pdf...</p>
                </div>
            </div>
        );
    }

    return null;
};