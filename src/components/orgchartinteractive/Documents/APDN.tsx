import { useCallback, useState, useEffect } from 'react';
import { APDNData, StaffRecruitmentProps } from '../../../interfaces/orgchartinteractive.interface';
import toast from 'react-hot-toast';
import { PdfAPDN } from '../PdfDocuments/PdfAPDN';
import { pdf } from '@react-pdf/renderer';
import { apiService } from "../../../services/api";

const APDN = ({employee, onClose }: StaffRecruitmentProps) => {
    const [formData, setFormData] = useState<APDNData>({
        fechaDia: '',
        fechaMes: '',
        fechaAnio: '',
        banco: '',
        numeroCuenta: '',
        numeroTarjeta: '',
        email: '',
        trabajador: employee.name
    });
    const [isLoading, setIsLoading] = useState(true);

    // ✅ Cargar datos existentes - CORREGIDO
    useEffect(() => {
        const loadExistingData = async () => {
            try {
                setIsLoading(true);
                
                // ✅ Usar el nuevo método para cargar el JSON específico
                const existingData = await apiService.getEmployeeFile(employee.name, 'APDN.json');
                if (existingData) {
                    setFormData(prev => ({
                        ...prev,
                        ...existingData,
                        trabajador: employee.name // Mantener el nombre actualizado
                    }));
                }
                
                console.log('Datos APDN cargados correctamente');
            } catch (error) {
                // Si el archivo no existe (404) o hay error (500), usar datos iniciales
                if (error instanceof Error) {
                    if (error.message.includes('404') || error.message.includes('500')) {
                        console.log('No se encontró APDN existente, usando datos iniciales');
                        // Ya tenemos los datos iniciales, no es necesario hacer nada
                    } else {
                        console.error('Error inesperado:', error);
                        toast.error('Error al cargar los datos APDN existentes');
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadExistingData();
    }, [employee.name]);

    const handleChange = (field: keyof APDNData, value: string) => {
        const newData = {
            ...formData,
            [field]: value
        };
        setFormData(newData);
    };

    const isValidEmail = useCallback((email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }, []);

    // Generar PDF
    const handleGeneratePdf = async () => {
        try {
            // Validaciones
            if (!formData.email || !isValidEmail(formData.email)) {
                toast.error("Por favor ingresa un correo electrónico válido");
                return;
            }

            if (!formData.banco || formData.banco.trim() === '') {
                toast.error("Por favor ingresa un banco");
                return;
            }

            if (!formData.fechaAnio || formData.fechaAnio.trim() === '') {
                toast.error("Por favor ingresa el año");
                return;
            }

            if (!formData.fechaMes || formData.fechaMes.trim() === '') {
                toast.error("Por favor ingresa el mes");
                return;
            }

            if (!formData.fechaDia || formData.fechaDia.trim() === '') {
                toast.error("Por favor ingresa el dia");
                return;
            }

            if (!formData.numeroCuenta || formData.numeroCuenta.trim() === '') {
                toast.error("Por favor ingresa el numero de cuenta");
                return;
            }

            if (!formData.trabajador || formData.trabajador.trim() === '') {
                toast.error("Por favor ingresa el nombre");
                return;
            }

            // ✅ Generar y subir PDF con JSON usando apiService
            const blob = await pdf(<PdfAPDN data={formData} />).toBlob();
            const formDataUpload = new FormData();
            formDataUpload.append('file', blob, "APDN.pdf");
            formDataUpload.append('jsonData', JSON.stringify(formData, null, 2));
            
            // ✅ Usar apiService en lugar de fetch directo
            await apiService.uploadEmployeeFile(formData.trabajador, formDataUpload);

            toast.success("APDN.pdf creado correctamente");
            onClose();
        } catch (error) {
            console.error('Error generating APDN:', error);
            toast.error(`No se pudo generar el documento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto rounded-lg shadow-md bg-white p-6 w-[500px] space-y-3">
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="ml-2 text-gray-600">Cargando datos APDN...</p>
                </div>
            </div>
        );
    }

    return (
        <form className="max-w-2xl mx-auto rounded-lg shadow-md bg-white p-6 w-[500px] space-y-3">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Autorización de Pago de Nómina</h2>
            
            {/* Fecha */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Día"
                            value={formData.fechaDia}
                            onChange={(e) => handleChange('fechaDia', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Mes"
                            value={formData.fechaMes}
                            onChange={(e) => handleChange('fechaMes', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Año"
                            value={formData.fechaAnio}
                            onChange={(e) => handleChange('fechaAnio', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Datos del Trabajador */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Trabajador
                </label>
                <input
                    type="text"
                    value={formData.trabajador}
                    onChange={(e) => handleChange('trabajador', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre completo del trabajador"
                    required
                />
            </div>

            {/* Datos Bancarios */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del banco <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.banco}
                    onChange={(e) => handleChange('banco', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: BBVA, Santander, etc."
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de cuenta <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.numeroCuenta}
                    onChange={(e) => handleChange('numeroCuenta', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Número de cuenta bancaria"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Tarjeta
                </label>
                <input
                    type="text"
                    value={formData.numeroTarjeta}
                    onChange={(e) => handleChange('numeroTarjeta', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Número de tarjeta débito (opcional)"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ejemplo@correo.com"
                    required
                />
            </div>
            
            <div className="flex justify-center mt-8 gap-4">
                <button
                    type="button"
                    onClick={handleGeneratePdf}
                    className="bg-cyan-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-md transition-colors"
                    disabled={!formData.banco || !formData.numeroCuenta || !formData.email || !formData.trabajador}
                >
                    {formData.fechaDia ? 'Actualizar APDN' : 'Generar APDN'}
                </button>
            </div>
            
            {(!formData.banco || !formData.numeroCuenta || !formData.email || !formData.trabajador) && (
                <p className="text-red-500 text-sm text-center mt-2">
                    Complete los campos obligatorios (*) para generar el PDF
                </p>
            )}
        </form>
    );
};

export default APDN;