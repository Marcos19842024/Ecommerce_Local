export interface AppConfig {
    apiUrl: string;
    backendIp: string;
    backendPort: number;
    environment: string;
    timestamp: string;
}

class RuntimeConfig {
    private config: AppConfig | null = null;
    private isLoaded = false;

    async loadConfig(): Promise<AppConfig> {
        if (this.isLoaded && this.config) {
            return this.config;
        }

        try {
            console.log('🔄 Cargando configuración del backend...');
            
            const response = await fetch('/api/config', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(3000)
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            this.config = await response.json();
            this.isLoaded = true;
            console.log('✅ Configuración cargada:', this.config);
            return this.config !;

        } catch (error) {
            console.warn('⚠️ No se pudo cargar configuración del backend, usando variable de entorno');
        
            this.config = {
                apiUrl: import.meta.env.VITE_URL_SERVER || 'http://localhost:3001/',
                backendIp: 'localhost',
                backendPort: 3001,
                environment: 'development',
                timestamp: new Date().toISOString()
            };
            
            this.isLoaded = true;
            return this.config;
        }
    }

    getApiUrl(): string {
        // Remover la barra final si existe para consistencia
        const url = this.config?.apiUrl || import.meta.env.VITE_URL_SERVER || 'http://localhost:3001/';
        return url.endsWith('/') ? url.slice(0, -1) : url;
    }

    isConfigLoaded(): boolean {
        return this.isLoaded;
    }
}

export const runtimeConfig = new RuntimeConfig();