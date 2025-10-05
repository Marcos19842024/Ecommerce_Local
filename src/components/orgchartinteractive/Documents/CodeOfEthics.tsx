import { useEffect, useState } from "react";
import { StaffRecruitmentProps } from "../../../interfaces/orgchartinteractive.interface"
import toast from "react-hot-toast";
import { url } from "../../../server/url";
import { PdfCodeOfEthics } from "../PdfDocuments/PdfCodeOfEthics";
import { pdf } from "@react-pdf/renderer";

export const CodeOfEthics = (data: StaffRecruitmentProps) => {
    const [isGenerating, setIsGenerating] = useState(true);
    
    const handleGenerateDocument = async () => {

        try {
            // Validar que employee esté definido
            if (!data.employee) {
                throw new Error("Datos del empleado no proporcionados");
            }
            
            // Generar el PDF
            const blob = await pdf(<PdfCodeOfEthics name={data.employee.name} />).toBlob();
 
            if (!blob) {
                throw new Error("No se pudo generar el blob del documento");
            }

            if (blob.size === 0) {
                throw new Error("El blob está vacío");
            }

            const formData = new FormData();
            formData.append('file', blob, "Codigo de etica.pdf");
            
            const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(data.employee.name)}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al guardar en el servidor: ${response.status} - ${errorText}`);
            }

            toast.success("Código de ética.pdf creado correctamente");
            
            data.onClose();

        } catch (error) {
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
                    <p className="text-gray-600">Generando Código de ética.pdf...</p>
                </div>
            </div>
        );
    }

    return null;
};