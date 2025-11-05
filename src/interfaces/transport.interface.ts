export interface Mascota {
    nombre: string;
    raza: string;
    asunto: string;
}

export interface Cliente {
    hora: string;
    nombre: string;
    status: string;
    mascotas: Mascota[];
}

export interface Fechas {
    fecha: string;
    clientes: Cliente[];
}

export interface TransportProps {
    fechas: Fechas[];
}