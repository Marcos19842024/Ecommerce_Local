export interface ChecklistItem {
    id: string;
    area: string;
    aspecto: string;
    cumplimiento: 'malo' | 'regular' | 'bueno' | '';
    observaciones: string;
}

export interface ChecklistData {
    fecha: string;
    hora: string;
    responsable: string;
    supervisor: string;
    items: ChecklistItem[];
    comentariosAdicionales: string;
}

export interface ChecklistSupervisionProps {
    employee?: {
        name: string;
        puesto: string;
    };
    onClose?: () => void;
}