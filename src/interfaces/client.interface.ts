export interface Tipo {
    nombre: string;
    fecha: string;
}

export interface Recordatorio {
    nombre: string;
    tipos: Tipo[];
}

export interface Mascota {
    nombre: string;
    recordatorios: Recordatorio[];
}

export interface Cliente {
    nombre: string;
    telefono: string;
    mascotas: Mascota[];
    mensaje: string[];
    status: boolean;
}

export interface MessageBubbleProps {
    id: string;
    message: string;
    senderName: string;
    timestamp: string; // Formato como "10:30 AM"
    avatarUrl: string;
    isOwnMessage: boolean;
    editable: boolean;
}

export interface MessageBubbleFileProps {
    id: string;
    file: FileWithPreview;
    senderName: string;
    timestamp: string; // Formato como "10:30 AM"
    avatarUrl: string;
    isOwnMessage: boolean;
    editable: boolean;
}

export interface FileWithPreview {
    id: string
    file: File;
    name: string;
    url: string;
    type: string;
    icon: string;
    color: string;
}