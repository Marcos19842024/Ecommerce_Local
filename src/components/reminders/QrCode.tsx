import React, { useState, useEffect } from "react";
import { IoReload } from "react-icons/io5";
import { runtimeConfig } from "../../services/config";

export const QrCode: React.FC = () => {
    const [qr, setQr] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Función para construir la URL completa del QR
    const getQrUrl = (withTimestamp = false) => {
        const baseUrl = runtimeConfig.getApiUrl();
        const timestamp = withTimestamp ? `?t=${new Date().getTime()}` : '';
        return `${baseUrl}/qr.png${timestamp}`;
    };

    // Cargar el QR al montar el componente
    useEffect(() => {
        const initializeQr = async () => {
            try {
                setIsLoading(true);
                // Asegurarnos de que la configuración esté cargada
                await runtimeConfig.loadConfig();
                setQr(getQrUrl());
            } catch (error) {
                console.error('Error initializing QR code:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeQr();
    }, []);

    const reloadQr = () => {
        setQr(getQrUrl(true));
    };

    return (
        <div className="flex bg-gray-200 rounded-md overflow-hidden h-full">
            {/* QR y botón */}
            <div className="flex flex-col justify-center items-center gap-2 p-4 w-full">
                {isLoading ? (
                    <div className="flex items-center justify-center bg-cyan-600 p-1 w-full max-w-xs h-64 rounded-md">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <img
                        className="bg-cyan-600 p-1 w-full max-w-xs object-contain rounded-md"
                        src={qr}
                        alt="Qr Code"
                        onError={() => {
                            console.error('Error loading QR image');
                            reloadQr();
                        }}
                    />
                )}
                <button
                    className="flex items-center gap-2 text-white rounded-md px-4 py-2 transition-all bg-cyan-600 hover:bg-yellow-500 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    type="button"
                    onClick={reloadQr}
                    disabled={isLoading}
                >
                    <IoReload className={`text-lg ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Cargando...' : 'Recargar'}
                </button>
            </div>
        </div>
    );
}
