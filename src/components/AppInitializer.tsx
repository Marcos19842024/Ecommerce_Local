// src/components/AppInitializer.tsx
import { useEffect, useState } from 'react';
import { runtimeConfig } from '../services/config';

interface AppInitializerProps {
    children: React.ReactNode;
}

export const AppInitializer = ({ children }: AppInitializerProps) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                console.log('🚀 Inicializando aplicación...');
                await runtimeConfig.loadConfig();
                setIsInitialized(true);
                console.log('✅ Aplicación inicializada correctamente');
            } catch (err) {
                console.error('❌ Error inicializando aplicación:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
                // Aún así permitimos que la aplicación continúe
                setIsInitialized(true);
            }
        };

        initializeApp();
    }, []);

    // Mientras carga, mostrar un loading sutil o nada
    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando configuración...</p>
                </div>
            </div>
        );
    }

    // Si hay error pero la app puede continuar
    if (error) {
        console.warn('Aplicación ejecutándose con configuración por defecto:', error);
    }

    return <>{children}</>;
};