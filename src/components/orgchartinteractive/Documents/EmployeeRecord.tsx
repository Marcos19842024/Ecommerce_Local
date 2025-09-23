import { pdf } from "@react-pdf/renderer";
import { Employee } from "../../../interfaces/orgchartinteractive.interface";
import { FileWithPreview } from "../../../interfaces/shared.interface";
import { url } from "../../../server/url";
import toast from "react-hot-toast";
import { PdfEmployeeRecord } from "../PdfDocuments/PdfEmployeeRecord";

interface RecordStatus {
    [key: string]: boolean;
}

const RECORD_DOCUMENTS = {
    incluir: [
        "Caratula.pdf",
        "Alta del personal.pdf",
        "Contrato laboral.pdf",
        "APDN.pdf",
        "Acuerdo de confidencialidad.pdf",
        "Codigo de etica.pdf",
        "RIBA.pdf",
        "RIT.pdf",
        "Perfil de puesto.pdf",
        "Evaluacion de desempeño"
    ],
    excluir: [
        "Acta de nacimiento.pdf",
        "Identificacion oficial.pdf",
        "Comprobante de domicilio.pdf",
        "CURP.pdf",
        "NSS.pdf",
        "RFC.pdf",
        "Solicitud de empleo.pdf",
        "Certificado de estudios.pdf",
        "Cedula profesional.pdf"
    ]
};

export const EmployeeRecord = async (
    files: FileWithPreview[],
    employee: Employee,
    loadFiles: () => Promise<void>
): Promise<void> => {

    let blob: Blob | null = null;

    try {
        // Validar que employee esté definido
        if (!employee) {
            throw new Error("Datos del empleado no proporcionados");
        }

        const allRecordStatus: RecordStatus = {};
    
        // Inicializar todos los documentos como false
        [...RECORD_DOCUMENTS.incluir, ...RECORD_DOCUMENTS.excluir].forEach(doc => { 
            allRecordStatus[doc] = false; 
        });

        // Marcar como true los documentos existentes
        files.forEach(file => {
            if (allRecordStatus.hasOwnProperty(file.name)) {
                allRecordStatus[file.name] = true;
            }
        });

        blob = await pdf(
            <PdfEmployeeRecord employeeData={employee} isChecked={allRecordStatus} />
        ).toBlob();

        if (!blob) {
            throw new Error("No se pudo generar el documento Caratula.pdf");
        }

        const formData = new FormData();
        formData.append('file', blob, "Caratula.pdf");
        
        const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(employee.name)}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error("Error al guardar en el servidor");

        toast.success("Caratula.pdf creada correctamente");
        
        await loadFiles();

    } catch (error) {
        toast.error("No se pudo generar el documento Caratula.pdf");
    }
    return
};