export interface ChecklistItem {
    id: string;
    area: string;
    aspecto: string;
    cumplimiento: 'malo' | 'regular' | 'bueno' | '';
    observaciones: string;
}

export interface ChecklistPhoto {
  id: string;
  area: string;
  photoUrl: string;
  timestamp: string;
  description?: string;
}

export interface ChecklistData {
    fecha: string;
    horaInicio: string;
    horaFin: string;
    responsable: string;
    items: ChecklistItem[];
    comentariosAdicionales: string;
    photos?: ChecklistPhoto[];
}

export interface ChecklistSupervisionProps {
    onClose?: () => void;
}

export interface ChecklistPhoto {
    id: string;
    area: string;
    photoUrl: string;
    timestamp: string;
    description?: string;
}