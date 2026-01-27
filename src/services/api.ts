import toast from 'react-hot-toast';
import { runtimeConfig } from './config';

class ApiService {
    // =============================================
    // 🔥 MÉTODOS AUXILIARES
    // =============================================

    private async ensureConfigLoaded(): Promise<void> {
        if (!runtimeConfig.isConfigLoaded()) {
            await runtimeConfig.loadConfig();
        }
    }

    private async fetchWithConfig(url: string, options: RequestInit = {}): Promise<any> {
        await this.ensureConfigLoaded();
        
        const fullUrl = `${runtimeConfig.getApiUrl()}${url}`;
        console.log('🔍 URL generada:', fullUrl);
        const response = await fetch(fullUrl, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    }

    // =============================================
    // 🔥 MÉTODO DE CHECK DE CONECTIVIDAD
    // =============================================

    async checkConnectivity(): Promise<boolean> {
        try {
            await this.ensureConfigLoaded();
            const apiUrl = runtimeConfig.getApiUrl();
            
            const response = await fetch(`${apiUrl}/api/config`, {
                method: 'HEAD',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            return response.ok;
        } catch (error) {
            toast.error(`❌ Error de conectividad: ${error}`);
            return false;
        }
    }

    // =============================================
    // 🔥 MÉTODOS BÁSICOS DE API (GET, POST, PUT, DELETE)
    // =============================================

    async get(endpoint: string): Promise<any> {
        return this.fetchWithConfig(endpoint);
    }

    async post(endpoint: string, data: any): Promise<any> {
        return this.fetchWithConfig(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put(endpoint: string, data: any): Promise<any> {
        return this.fetchWithConfig(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete(endpoint: string): Promise<any> {
        return this.fetchWithConfig(endpoint, {
            method: 'DELETE',
        });
    }

    // =============================================
    // 🔥 MÉTODOS DE AUTENTICACIÓN
    // =============================================

    /**
     * Verificar contraseña de administrador
     */
    async verifyAdminPassword(password: string): Promise<any> {
        try {
            const response = await this.post('/auth/verify', { password });
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(`Error en verificación de contraseña: ${errorMessage}`);
            throw error;
        }
    }

    // =============================================
    // 🔥 MÉTODOS PARA UPLOAD Y FETCH DIRECTO
    // =============================================

    async uploadFile(endpoint: string, formData: FormData): Promise<any> {
        await this.ensureConfigLoaded();
        const url = `${runtimeConfig.getApiUrl()}${endpoint}`;
        
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response;
    }

    // Método para fetch directo (para casos especiales como FilePreviewModal)
    async fetchDirect(url: string, options: RequestInit = {}): Promise<Response> {
        await this.ensureConfigLoaded();
        const fullUrl = url.startsWith('http') ? url : `${runtimeConfig.getApiUrl()}${url}`;
        
        const response = await fetch(fullUrl, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response;
    }

    // =============================================
    // 🔥 MÉTODOS PARA EXPENSEREPORT
    // =============================================

    async getInvoices(): Promise<any> {
        return this.get('/invoices');
    }

    async uploadInvoice(formData: FormData): Promise<any> {
        return this.uploadFile('/invoices', formData);
    }

    async deleteInvoice(fecha: string, proveedor: string, factura: string): Promise<any> {
        return this.delete(`/invoices/${fecha}/${proveedor}/${factura}`);
    }

    async downloadInvoiceZip(formData: FormData): Promise<Response> {
        await this.ensureConfigLoaded();
        const url = `${runtimeConfig.getApiUrl()}/invoices/download-send-mail-zip`;
        
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response;
    }

    // =============================================
    // 🔥 MÉTODOS PARA ORGCHARTINTERACTIVE
    // =============================================
    
    async getOrgChart(): Promise<any> {
        return this.get('/orgchart');
    }

    async saveOrgChart(data: any): Promise<any> {
        return this.post('/orgchart', data);
    }

    async getEmployeeFiles(employeeName: string): Promise<any> {
        return this.get(`/orgchart/employees/${encodeURIComponent(employeeName)}`);
    }

    async uploadEmployeeFile(employeeName: string, formData: FormData): Promise<any> {
        return this.uploadFile(`/orgchart/employees/${encodeURIComponent(employeeName)}`, formData);
    }

    async deleteEmployeeFile(employeeName: string, fileName: string): Promise<any> {
        return this.delete(`/orgchart/employees/${encodeURIComponent(employeeName)}/${encodeURIComponent(fileName)}`);
    }

    async sendMailZip(employeeName: string, data: { email: string }): Promise<any> {
        const response = await fetch(`/orgchart/send-mail-zip/${encodeURIComponent(employeeName)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al enviar el correo');
        }

        return await response.json();
    }

    async downloadZip(employeeName: string): Promise<Blob> {
        const response = await fetch(`/orgchart/download-zip/${encodeURIComponent(employeeName)}`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error en la descarga');
        }

        return await response.blob();
    }

    async getEmployeeFile(employeeName: string, fileName: string): Promise<any> {
        try {
            const response = await this.fetchWithConfig(
                `/orgchart/employees/${encodeURIComponent(employeeName)}/${encodeURIComponent(fileName)}`
            );
            return response;
        } catch (error) {
            toast.error(`Error loading file ${fileName} for employee ${employeeName}: ${error}`);
            throw error;
        }
    }

    // =============================================
    // 🔥 MÉTODOS PARA MYDOCUMENTS
    // =============================================

    async getMyDocumentsFiles(folderName: string): Promise<any> {
        try {
            // Usar encodeURIComponent para manejar caracteres especiales en los nombres de carpetas
            const encodedFolderName = encodeURIComponent(folderName);
            const response = await this.get(`/orgchart/mydocuments/${encodedFolderName}`);
            return response;
        } catch (error) {
            toast.error(`Error loading documents from folder ${folderName}: ${error}`);
            throw error;
        }
    }

    async getMyDocumentFile(folderName: string, fileName: string): Promise<any> {
        try {
            const encodedFolderName = encodeURIComponent(folderName);
            const encodedFileName = encodeURIComponent(fileName);
            const response = await this.get(`/orgchart/mydocuments/${encodedFolderName}/${encodedFileName}`);
            return response;
        } catch (error) {
            toast.error(`Error loading file ${fileName} from folder ${folderName}: ${error}`);
            throw error;
        }
    }

    async uploadMyDocumentsFile(folderName: string, formData: FormData): Promise<any> {
        try {
            const encodedFolderName = encodeURIComponent(folderName);
            const response = await this.uploadFile(`/orgchart/mydocuments/${encodedFolderName}`, formData);
            return response;
        } catch (error) {
            toast.error(`Error uploading file to folder ${folderName}: ${error}`);
            throw error;
        }
    }

    async deleteMyDocumentsFile(folderName: string, fileName: string): Promise<any> {
        try {
            const encodedFolderName = encodeURIComponent(folderName);
            const encodedFileName = encodeURIComponent(fileName);
            const response = await this.delete(`/orgchart/mydocuments/${encodedFolderName}/${encodedFileName}`);
            return response;
        } catch (error) {
            toast.error(`Error deleting file ${fileName} from folder ${folderName}: ${error}`);
            throw error;
        }
    }

    async initializeMyDocuments(): Promise<any> {
    try {
        const response = await this.get('/orgchart/mydocuments-init');
        return response;
    } catch (error) {
        toast.error(`Error initializing MyDocuments: ${error}`);
        throw error;
    }
    }

    // =============================================
    // 🔥 MÉTODOS PARA SUBCARPETAS EN MYDOCUMENTS
    // =============================================

    async getMyDocumentsStructure(folderId: string): Promise<any> {
        try {
            const encodedFolderId = encodeURIComponent(folderId);
            const response = await this.get(`/orgchart/mydocuments-structure/${encodedFolderId}`);
            return response;
        } catch (error) {
            toast.error(`Error loading structure for folder ${folderId}: ${error}`);
            throw error;
        }
    }

    async createMyDocumentsSubfolder(folderId: string, subfolderName: string, parentPath = ''): Promise<any> {
        try {
            const encodedFolderId = encodeURIComponent(folderId);
            const response = await this.post(`/orgchart/mydocuments/${encodedFolderId}/subfolder`, {
                subfolderName,
                parentPath
            });
            return response;
        } catch (error) {
            toast.error(`Error creating subfolder in ${folderId}: ${error}`);
            throw error;
        }
    }

    async deleteMyDocumentsSubfolder(folderId: string, subfolderPath: string): Promise<any> {
        try {
            const encodedFolderId = encodeURIComponent(folderId);
            // Usamos fetchWithConfig directamente porque necesitamos enviar un body en DELETE
            const response = await this.fetchWithConfig(`/orgchart/mydocuments/${encodedFolderId}/subfolder`, {
                method: 'DELETE',
                body: JSON.stringify({ subfolderPath })
            });
            return response;
        } catch (error) {
            toast.error(`Error deleting subfolder from ${folderId}: ${error}`);
            throw error;
        }
    }

    async getMyDocumentsFilesFromSubfolder(folderId: string, subfolder = ''): Promise<any> {
        try {
            const encodedFolderId = encodeURIComponent(folderId);
            const params = subfolder ? `?subfolder=${encodeURIComponent(subfolder)}` : '';
            const response = await this.get(`/orgchart/mydocuments/${encodedFolderId}/files${params}`);
            return response;
        } catch (error) {
            toast.error(`Error loading files from subfolder in ${folderId}: ${error}`);
            throw error;
        }
    }

    // =============================================
    // 🔥 MÉTODOS PARA DEBTORS - ACTUALIZADOS
    // =============================================

    // 👥 CLIENTES
    async getDebtorsClientes(): Promise<any> {
        return this.get('/debtors/clientes');
    }

    async getDebtorsClienteById(id: string): Promise<any> {
        return this.get(`/debtors/clientes/${id}`);
    }

    async createDebtorsCliente(clienteData: any): Promise<any> {
        return this.post('/debtors/clientes', clienteData);
    }

    async updateDebtorsCliente(id: string, clienteData: any): Promise<any> {
        return this.put(`/debtors/clientes/${id}`, clienteData);
    }

    async deleteDebtorsCliente(id: string): Promise<any> {
        return this.delete(`/debtors/clientes/${id}`);
    }

    // 📊 MÉTRICAS
    async getDebtorsMetricas(): Promise<any> {
        return this.get('/debtors/metricas');
    }

    /**
     * Obtener comparativa por período
     */
    async getComparativaPorPeriodo(periodo: string, tipo: string): Promise<any> {
        try {
            const response = await this.get(
                `/debtors/deudas/comparativa?periodo=${periodo}&tipo=${tipo}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener deudas por período (día, semana, mes)
     */
    async getDeudasPorPeriodo(periodo: string, tipo: string): Promise<any> {
        try {
            console.log(`📊 Llamando a API: /debtors/deudas/por-periodo?periodo=${periodo}&tipo=${tipo}`);
            
            const response = await this.get(
                `/debtors/deudas/por-periodo?periodo=${periodo}&tipo=${tipo}`
            );
            
            console.log('🔍 Respuesta completa de API:', {
                periodo,
                tipo,
                success: response?.success,
                totalRegistros: response?.totalRegistros,
                totalClientes: response?.totalClientes,
                totalDeuda: response?.totalDeuda,
                tieneDeudas: Array.isArray(response?.deudas),
                deudasCount: Array.isArray(response?.deudas) ? response.deudas.length : 0,
                tieneDatos: Array.isArray(response?.datos),
                datosCount: Array.isArray(response?.datos) ? response.datos.length : 0
            });
            
            // Los datos están en la propiedad "deudas" según el log
            const datos = Array.isArray(response?.deudas) ? response.deudas : 
                        Array.isArray(response?.datos) ? response.datos : [];
            
            console.log(`✅ Datos finales: ${datos.length} registros`);
            
            return {
                success: response?.success || true,
                periodo,
                tipo,
                totalRegistros: response?.totalRegistros || datos.length,
                totalClientes: response?.totalClientes || new Set(datos.map((d: any) => d.clienteId || d.clienteNombre)).size,
                totalDeuda: response?.totalDeuda || datos.reduce((sum: number, item: any) => 
                    sum + (item?.deudaTotal || item?.deuda || 0), 0),
                datos: datos
            };
            
        } catch (error) {
            console.error('❌ Error en getDeudasPorPeriodo:', error);
            return {
                success: false,
                periodo,
                tipo,
                totalRegistros: 0,
                totalClientes: 0,
                totalDeuda: 0,
                datos: []
            };
        }
    }

    /**
     * Obtener deudas detalladas por período (versión alternativa si el otro endpoint no funciona)
     */
    async getDeudasDetalladasPorPeriodo(periodo: string, tipo: string): Promise<any> {
        try {
            console.log(`🔍 Llamando endpoint alternativo: /debtors/deudas/detalladas?periodo=${periodo}&tipo=${tipo}`);
            
            const response = await this.get(
                `/debtors/deudas/detalladas?periodo=${periodo}&tipo=${tipo}`
            );
            
            return response;
        } catch (error) {
            console.error('Error en getDeudasDetalladasPorPeriodo:', error);
            // Intentar otro endpoint posible
            try {
                const response2 = await this.get(
                    `/debtors/deudas?periodo=${periodo}&tipo=${tipo}`
                );
                return response2;
            } catch (error2) {
                return {
                    success: false,
                    periodo,
                    tipo,
                    datos: []
                };
            }
        }
    }

    /**
     * Obtener comparativa entre dos fechas de Excel
     */
    async getComparativaExcel(fechaActual: string, fechaAnterior: string): Promise<any> {
        try {
            const response = await this.get(
                `/debtors/registros-excel/comparativa?fechaActual=${fechaActual}&fechaAnterior=${fechaAnterior}`
            );
            return response;
        } catch (error) {
            console.error('Error en getComparativaExcel:', error);
            throw error;
        }
    }

    /**
     * Obtener estadísticas por período (para cuando no hay datos detallados)
     */
    async getEstadisticasPorPeriodo(periodo: string, tipo: string): Promise<any> {
        try {
            const response = await this.get(
                `/debtors/estadisticas?periodo=${periodo}&tipo=${tipo}`
            );
            return response;
        } catch (error) {
            console.error('Error en getEstadisticasPorPeriodo:', error);
            return null;
        }
    }

    /**
     * Obtener historial completo de un cliente
     */
    async getHistorialCliente(clienteId: string, fechaInicio: string, fechaFin: string): Promise<any[]> {
        try {
            const response = await this.get(
                `/debtors/deudas/historial/${clienteId}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Procesar Excel con datos de comparativa
     */
    async procesarExcelComparativa(datos: any[], periodo: string, tipo: string): Promise<any> {
        try {
            const response = await this.post('/debtors/deudas/procesar-excel-comparativa', {
                datos,
                periodo,
                tipo
            });
            return response;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            toast.error(`Error en procesarExcelComparativa: ${message}`);
            throw error;
        }
    }

    /**
     * Obtener resumen comparativo
     */
    async getResumenComparativo(tipo: string, fecha?: string): Promise<any> {
        try {
            let url = `/debtors/deudas/resumen-comparativo?tipo=${tipo}`;
            if (fecha) {
                url += `&fecha=${fecha}`;
            }
            
            const response = await this.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtener registros de Excel por fecha específica (para comparación)
     */
    async getRegistrosExcelPorFecha(fecha: string): Promise<any> {
        try {
            console.log(`📅 Obteniendo registros Excel para fecha: ${fecha}`);
            
            const response = await this.get(
                `/debtors/registros-excel/fecha/${fecha}`
            );
            
            console.log(`✅ Registros Excel para ${fecha}:`, {
                count: Array.isArray(response) ? response.length : 0,
                tieneDatos: Array.isArray(response) && response.length > 0
            });
            
            return response;
        } catch (error) {
            console.error(`❌ Error obteniendo registros Excel para ${fecha}:`, error);
            return [];
        }
    }

    /**
     * Obtener las fechas disponibles de Excel subidos
     */
    async getFechasDisponiblesExcel(): Promise<string[]> {
        try {
            const response = await this.get('/debtors/registros-excel/fechas');
            return Array.isArray(response) ? response : [];
        } catch (error) {
            console.error('Error obteniendo fechas disponibles:', error);
            return [];
        }
    }

    /**
     * Obtener el último Excel subido
     */
    async getUltimoExcel(): Promise<any> {
        try {
            const response = await this.get('/debtors/registros-excel/ultimo');
            return response;
        } catch (error) {
            console.error('Error obteniendo último Excel:', error);
            return null;
        }
    }

    // 📊 MÉTRICAS Y TENDENCIAS
    async getDebtorsTendencias(): Promise<any> {
        return this.get('/debtors/tendencias');
    }

    async getDebtorsRegistrosExcel(params?: { 
        periodo?: string; 
        cliente?: string; 
        page?: number; 
        limit?: number; 
    }): Promise<any> {
        const queryParams = new URLSearchParams();
        if (params?.periodo) queryParams.append('periodo', params.periodo);
        if (params?.cliente) queryParams.append('cliente', params.cliente);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        
        const queryString = queryParams.toString();
        return this.get(`/debtors/registros-excel${queryString ? `?${queryString}` : ''}`);
    }

    // 🔍 BÚSQUEDA
    async searchDebtorsClientes(query: string): Promise<any> {
        return this.get(`/debtors/clientes/buscar?q=${encodeURIComponent(query)}`);
    }
}

export const apiService = new ApiService();