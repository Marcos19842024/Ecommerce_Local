import toast from "react-hot-toast";

export interface AppConfig {
    apiUrl: string;
    backendIp: string;
    backendPort: number;
    environment: string;
    timestamp: string;
    clientInfo?: {
        origin?: string;
        host?: string;
        ip?: string;
    };
}

class RuntimeConfig {
    private config: AppConfig | null = null;
    private isLoaded = false;

    async loadConfig(): Promise<AppConfig> {
        if (this.isLoaded && this.config) {
            return this.config;
        }

        try {
            const backendUrl = this.getBackendBaseUrl();
            
            const response = await fetch(`${backendUrl}/api/config`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const configData: AppConfig = await response.json();
            this.config = configData;
            return configData;

        } catch (error) {
            toast.error('⚠️ No se pudo cargar configuración del backend, usando configuración local');
            toast.error(`Error details: ${error}`);
            
            const envUrl = import.meta.env.VITE_URL_SERVER;
            let apiUrl = 'http://localhost:3001';
            
            if (envUrl) {
                apiUrl = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
                toast.success(`🔗 Usando VITE_URL_SERVER: ${apiUrl}`);
            } else if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
                // Si estamos en ngrok, usar la misma URL del frontend para el backend
                apiUrl = window.location.origin;
                toast.success(`🔗 Usando window.origin (ngrok): ${apiUrl}`);
            } else {
                toast.success('🔗 Usando localhost por defecto');
            }
            
            const fallbackConfig: AppConfig = {
                apiUrl: apiUrl,
                backendIp: 'localhost',
                backendPort: 3001,
                environment: 'development',
                timestamp: new Date().toISOString()
            };
            
            this.config = fallbackConfig;
            this.isLoaded = true;
            return fallbackConfig;
        }
    }

    private getBackendBaseUrl(): string {
        // Si estamos en desarrollo local, usar localhost:3001
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
            if (window.location.port !== '3001') {
                return 'http://localhost:3001';
            }
        }
        
        // Si estamos en ngrok, usar la misma origen
        // Si el origin es undefined (puede pasar con ngrok), usar location.origin
        return window.location.origin || 'http://localhost:3001';
    }

    getApiUrl(): string {
        if (!this.isLoaded && !this.config) {
            // Si no está cargada, devolver URL por defecto
            const envUrl = import.meta.env.VITE_URL_SERVER;
            if (envUrl) {
                return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
            }
            return window.location.origin || 'http://localhost:3001';
        }
        
        const url = this.config?.apiUrl || import.meta.env.VITE_URL_SERVER || (window.location.origin || 'http://localhost:3001');
        return url.endsWith('/') ? url.slice(0, -1) : url;
    }

    isConfigLoaded(): boolean {
        return this.isLoaded;
    }

    // Método para forzar recarga de configuración
    async reloadConfig(): Promise<AppConfig> {
        this.isLoaded = false;
        this.config = null;
        return this.loadConfig();
    }

    // Método para obtener la configuración actual (puede ser null si no se ha cargado)
    getCurrentConfig(): AppConfig | null {
        return this.config;
    }
}

export const runtimeConfig = new RuntimeConfig();