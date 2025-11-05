export const CATEGORIAS = {
    ESTETICA: ['Baño', 'Corte', 'Limpieza oídos', 'Corte uñas', 'Estética completa'],
    PENSION: ['Pensión diaria', 'Guardería', 'Alojamiento', 'Pensión especial'],
    TRANSPORTE: ['Transporte local', 'Recogida a domicilio', 'Transporte urgente'],
    HOSPITALIZACION: ['Hospitalización', 'Monitoreo', 'Cuidados intensivos', 'Observación'],
    CIRUGIAS: ['Cirugía mayor', 'Cirugía menor', 'Esterilización', 'Castración', 'Cirugía reconstructiva'],
    LABORATORIOS: ['Análisis sangre', 'Orina', 'Heces', 'Perfil bioquímico', 'Citología'],
    CONSULTAS: ['Consulta general', 'Urgencia', 'Control', 'Especialista', 'Segunda opinión'],
    TRATAMIENTOS: ['Fisioterapia', 'Quimioterapia', 'Terapia', 'Rehabilitación', 'Tratamiento prolongado'],
    FARMACIA: ['Medicamentos', 'Inyecciones', 'Pomadas', 'Antibióticos', 'Analgésicos'],
    TIENDA: ['Alimento', 'Juguetes', 'Accesorios', 'Camas', 'Correas']
} as const;

export type CategoriaType = keyof typeof CATEGORIAS;