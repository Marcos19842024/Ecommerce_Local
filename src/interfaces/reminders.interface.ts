import { TypeContent } from "../utils/clients";

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
    mensajes: MessageBubble[];
    status: boolean;
}

export interface MessageBubble {
    id: string;
    message: TypeContent;
    senderName: string;
    timestamp: string; // Formato como "10:30 AM"
    avatarUrl: string;
    isOwnMessage: boolean;
    editable: boolean;
    onDelete?: (id: string) => void;
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

export interface RemindersProps {
  clientes: Cliente[];
}

export interface QrCodeProps {
  onWhatsAppConnected?: () => void;
}