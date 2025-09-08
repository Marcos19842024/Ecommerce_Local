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
    mensajes: string[];
    archivos: FileWithPreview[];
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
    name: string;
    url: string;
    type: string;
    size?: string;
    icon: string;
    color: string;
    uploadDate?: string;
}

export interface Fechas {
    fecha: string;
    clientes: ClienteTransporte[];
}

export interface ClienteTransporte {
    hora: string;
    nombre: string;
    status: string;
    mascotas: MascotaTransporte[];
}

export interface MascotaTransporte {
    nombre: string;
    raza: string;
    asunto: string;
}