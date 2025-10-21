export interface ChecklistItem {
    id: string;
    area: string;
    aspecto: string;
    cumplimiento: 'malo' | 'regular' | 'bueno' | '';
    observaciones: string;
}

export interface ChecklistData {
    fecha: string;
    horaInicio: string;
    horaFin: string;
    responsable: string;
    items: ChecklistItem[];
    comentariosAdicionales: string;
}

export interface ChecklistSupervisionProps {
    onClose?: () => void;
}