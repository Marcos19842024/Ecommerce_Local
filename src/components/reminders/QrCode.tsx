import React, { useState, useEffect, useRef } from "react";
import { runtimeConfig } from "../../services/config";
import { io, Socket } from "socket.io-client";
import { QrCodeProps } from "../../interfaces/reminders.interface";

export const QrCode: React.FC<QrCodeProps> = ({ onWhatsAppConnected }) => {
    const [qr, setQr] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [whatsappStatus, setWhatsappStatus] = useState('disconnected');
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);

    // Función para construir la URL completa del QR
    const getQrUrl = (withTimestamp = false) => {
        const baseUrl = runtimeConfig.getApiUrl();
        const timestamp = withTimestamp ? `?t=${new Date().getTime()}` : '';
        return `${baseUrl}/qr.png${timestamp}`;
    };

    // Inicializar WebSocket y QR
    const initializeConnection = async () => {
        try {
            setIsLoading(true);
            setConnectionError(null);
            
            // Asegurarnos de que la configuración esté cargada
            await runtimeConfig.loadConfig();
            setQr(getQrUrl());

            // Configurar WebSocket
            const baseUrl = runtimeConfig.getApiUrl();
            
            socketRef.current = io(baseUrl, {
                transports: ['websocket', 'polling'],
                timeout: 10000
            });

            socketRef.current.on('connect', () => {
                setIsConnected(true);
                setConnectionError(null);
                socketRef.current?.emit('subscribe-whatsapp');
            });

            socketRef.current.on('whatsapp-qr-updated', () => {
                setQr(getQrUrl(true));
                setIsLoading(false);
            });

            socketRef.current.on('whatsapp-status', (data) => {
                console.log('📱 Estado WhatsApp:', data);
                setWhatsappStatus(data.status);
                
                // Si WhatsApp se conecta, dejar de cargar y notificar
                if (data.status === 'connected') {
                    setIsLoading(false);
                    // Notificar al componente padre que WhatsApp se conectó
                    if (onWhatsAppConnected) {
                        onWhatsAppConnected();
                    }
                }
            });

            socketRef.current.on('disconnect', (reason) => {
                setIsConnected(false);
                setWhatsappStatus('disconnected');
                
                if (reason === 'io server disconnect') {
                    setConnectionError('Servidor desconectado');
                }
            });

            socketRef.current.on('connect_error', (error) => {
                setIsConnected(false);
                setConnectionError(`Error de conexión: ${error.message}`);
                setIsLoading(false);
                
                // Fallback: intentar recargar QR manualmente
                setTimeout(() => {
                    reloadQr();
                }, 3000);
            });

            // Timeout para conexión
            setTimeout(() => {
                if (!isConnected && isLoading) {
                    setConnectionError('Timeout de conexión. Usando modo fallback.');
                    setIsLoading(false);
                }
            }, 15000);

        } catch (error: any) {
            setConnectionError(`Error de inicialización: ${error.message}`);
            setIsLoading(false);
        }
    };

    // Cargar el QR al montar el componente
    useEffect(() => {
        initializeConnection();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const reloadQr = () => {
        setQr(getQrUrl(true));
        setIsLoading(true);
        
        // Simular carga
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    const getStatusColor = () => {
        switch (whatsappStatus) {
            case 'connected': return 'text-green-600 bg-green-100 px-2 py-1 rounded';
            case 'auth_failure': return 'text-red-600 bg-red-100 px-2 py-1 rounded';
            case 'disconnected': return 'text-red-600 bg-red-100 px-2 py-1 rounded';
            case 'qr_generated': return 'text-blue-600 bg-blue-100 px-2 py-1 rounded';
            case 'initializing': return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded';
            default: return 'text-gray-600 bg-gray-100 px-2 py-1 rounded';
        }
    };

    const getStatusText = () => {
        switch (whatsappStatus) {
            case 'connected': return '✓ WhatsApp Conectado';
            case 'auth_failure': return '✗ Error de Autenticación';
            case 'disconnected': return '✗ WhatsApp Desconectado';
            case 'qr_generated': return '📱 Escanear Código QR';
            case 'initializing': return '⏳ Inicializando WhatsApp...';
            case 'error': return '❌ Error de Conexión';
            default: return '⏳ Esperando QR...';
        }
    };

    const getConnectionStatusColor = () => {
        return isConnected ? 'text-green-600 bg-green-100 px-2 py-1 rounded' : 'text-red-600 bg-red-100 px-2 py-1 rounded';
    };

    const getConnectionStatusText = () => {
        return isConnected ? '✓ Servidor Conectado' : '✗ Servidor Desconectado';
    };

    return (
        <div className="flex bg-gray-200 rounded-md overflow-hidden h-full">
            <div className="flex flex-col justify-center items-center gap-3 p-4 w-full">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center bg-cyan-600 p-4 w-full max-w-xs h-64 rounded-md">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                        <span className="text-white text-sm">Cargando código QR...</span>
                        {connectionError && (
                            <span className="text-yellow-300 text-xs mt-2 text-center">
                                {connectionError}
                            </span>
                        )}
                    </div>
                ) : (
                    <>
                        <img
                            className="bg-cyan-600 p-1 w-full max-w-xs object-contain rounded-md shadow-lg"
                            src={qr}
                            alt="Código QR de WhatsApp"
                            onError={() => {
                                reloadQr();
                            }}
                        />
                        
                        {/* Estados de conexión */}
                        <div className="flex flex-col gap-2 w-full max-w-xs">
                            <div className={getStatusColor()}>
                                <span className="text-xs font-medium">{getStatusText()}</span>
                            </div>
                            
                            <div className={getConnectionStatusColor()}>
                                <span className="text-xs font-medium">{getConnectionStatusText()}</span>
                            </div>
                            
                            {whatsappStatus === 'connected' && (
                                <div className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-medium">
                                    ✅ ¡WhatsApp conectado! Cerrando automáticamente...
                                </div>
                            )}
                        </div>

                        {/* Información adicional */}
                        <div className="text-xs text-gray-500 text-center mt-2">
                            {isConnected 
                                && "El QR se actualizará automáticamente"
                            }
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};