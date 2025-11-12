import { OrgNode } from "../interfaces/orgchartinteractive.interface";
import { FileWithPreview } from "../interfaces/shared.interface";

export const RECORD_DOCUMENTS = {
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
        "Evaluacion de desempeno.pdf"
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

export const INITIAL_FILES: FileWithPreview[] = [
    {
        id: '0',
        name: 'Documento importante',
        url: '/qr.png',
        type: 'pdf',
        size: '4.7 MB',
        icon: 'fa fa-file-pdf-o',
        color: 'red',
        uploadDate: '2023-06-21',
    }
];


export const withIds = (node: OrgNode): OrgNode => ({
    ...node,
    id: node.id ?? uid(),
    children: node.children?.map(withIds) ?? [],
});

export const FOLDERS = [
    { id: 'contratacion', name: 'Contratación', path: 'orgchart/mydocuments/contratacion' },
    { id: 'leyes', name: 'Leyes, Procedimientos y Reglamentos', path: 'leyes, procedimientos y protocolos' },
    { id: 'reportes', name: 'Reportes y Memorandums', path: 'reportes y memorandums' },
    { id: 'router', name: 'Router', path: 'router' }
];

export const uid = () => Math.random().toString(36).slice(2, 9);

export type EvaluationSection = | 'actitudTrabajo' | 'cooperacion' | 'calidadTrabajo' | 'relaciones' | 'asistencia';