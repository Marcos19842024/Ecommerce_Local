// src/services/api.ts
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
        console.log('🌐 API Call:', fullUrl);
        
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

    // Métodos específicos para checklist
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

    // Métodos específicos para orgchart
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
            console.error(`Error loading file ${fileName} for employee ${employeeName}:`, error);
            throw error;
        }
    }

    // Métodos para invoices
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

    // Métodos para WhatsApp
    async getWhatsAppStatus(center: string, cel: string): Promise<any> {
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
}

export const apiService = new ApiService();