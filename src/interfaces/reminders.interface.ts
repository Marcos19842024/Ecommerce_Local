import { FileWithPreview } from "./shared.interface";

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

export interface MessageBubble {
    id: string;
    message: string;
    file?: FileWithPreview | null;
    senderName: string;
    timestamp: string; // Formato como "10:30 AM"
    avatarUrl: string;
    isOwnMessage: boolean;
    editable: boolean;
}

export interface ContactId {
    server: string
}

export interface ContactItem {
    number: string;
    name: string;
    isMyContact: boolean;
    id: ContactId;
}

export interface ContactResponse {
    statusText: ContactItem[];
}