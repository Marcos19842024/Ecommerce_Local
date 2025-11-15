import toast from 'react-hot-toast';
import { cel, center } from '../server/user';
import { runtimeConfig } from './config';

class ApiService {
    private async ensureConfigLoaded(): Promise<void> {
        if (!runtimeConfig.isConfigLoaded()) {
            await runtimeConfig.loadConfig();
        }
    }

    private async fetchWithConfig(url: string, options: RequestInit = {}): Promise<any> {
        await this.ensureConfigLoaded();
        
        const fullUrl = `${runtimeConfig.getApiUrl()}${url}`;
        
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

    // Método para verificar conectividad
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

    // Métodos genéricos
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

    // Métodos para upload de archivos (FormData)
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
    // 🔥 MÉTODOS PARA REMINDERS
    // =============================================

    async disconnectWhatsApp(): Promise<any> {
        return this.post('/wwebjs/disconnect', {});
    }

    async reconnectWhatsApp(): Promise<any> {
        return this.post('/wwebjs/reconnect', {});
    }

    async startWhatsApp(): Promise<any> {
        return this.post('/wwebjs/start', {});
    }

    async getWhatsAppStatus(): Promise<any> {
        return this.get(`/wwebjs/status/${center}/${cel}`);
    }

    async getWhatsAppContacts(): Promise<any> {
        return this.get('/wwebjs/contact');
    }

    async sendWhatsAppMessage(center: string, cel: string, data: any): Promise<any> {
        return this.post(`/wwebjs/send/${center}/${cel}`, data);
    }

    async uploadWhatsAppFile(formData: FormData): Promise<any> {
        return this.uploadFile('/wwebjs/upload', formData);
    }

    async deleteWhatsAppFile(fileName: string): Promise<any> {
        return this.delete(`/wwebjs/${fileName}`);
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
    // 🔥 MÉTODOS PARA CHECKLIST
    // =============================================

    async saveChecklist(formData: FormData): Promise<any> {
        await this.ensureConfigLoaded();
        const url = `${runtimeConfig.getApiUrl()}/checklist/save`;
        
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    }

    async getChecklistFiles(): Promise<any> {
        return this.get('/checklist/files');
    }

    async getChecklistFile(filename: string): Promise<any> {
        return this.get(`/checklist/file/${encodeURIComponent(filename)}`);
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
    // 🔥 MÉTODOS PARA DEBTORS
    // =============================================

    // 👥 CLIENTES
    async getDebtorsClientes(): Promise<any> {
        return this.get('/debtors/clientes');
    }

    async getDebtorsClienteById(id: string): Promise<any> {
        return this.get(`/debtors/clientes/${id}`);
    }

    async getDebtorsClienteByNombre(nombre: string): Promise<any> {
        return this.get(`/debtors/clientes/buscar?nombre=${encodeURIComponent(nombre)}`);
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

    // 📊 REPORTES
    async getDebtorsReporteTipoCliente(tipoCliente: string, año: number, mes: number): Promise<any> {
        return this.get(`/debtors/reportes/tipo-cliente?tipo=${tipoCliente}&año=${año}&mes=${mes}`);
    }

    async getDebtorsMetricasGlobales(año: number, mes: number): Promise<any> {
        return this.get(`/debtors/reportes/metricas-globales?año=${año}&mes=${mes}`);
    }
}

export const apiService = new ApiService();