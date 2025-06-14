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
    mensaje: string;
}