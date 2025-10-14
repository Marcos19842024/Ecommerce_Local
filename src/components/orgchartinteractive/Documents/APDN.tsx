import { useCallback, useState, useEffect } from 'react';
import { APDNData, StaffRecruitmentProps } from '../../../interfaces/orgchartinteractive.interface';
import toast from 'react-hot-toast';
import { PdfAPDN } from '../PdfDocuments/PdfAPDN';
import { pdf } from '@react-pdf/renderer';
import { url } from '../../../server/url';

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

    // Cargar datos existentes al montar el componente
    useEffect(() => {
        const loadExistingData = async () => {
            try {
                const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(employee.name)}`);
                
                if (response.ok) {
                    const serverFiles = await response.json();
                    const apdnJsonFile = serverFiles.find((file: any) => file.name === 'APDN.json');
                    
                    if (apdnJsonFile) {
                        const jsonResponse = await fetch(`${url}orgchart/employees/${encodeURIComponent(employee.name)}/${encodeURIComponent('APDN.json')}`);
                        if (jsonResponse.ok) {
                            const existingData = await jsonResponse.json();
                            setFormData(prev => ({
                                ...prev,
                                ...existingData,
                                trabajador: employee.name
                            }));
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading existing APDN data:', error);
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

            // Generar y subir PDF con JSON en una sola operación
            const blob = await pdf(<PdfAPDN data={formData} />).toBlob();
            const formDataUpload = new FormData();
            formDataUpload.append('file', blob, "APDN.pdf");
            formDataUpload.append('jsonData', JSON.stringify(formData));
            
            const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(formData.trabajador)}`, {
                method: 'POST',
                body: formDataUpload,
            });

            if (!response.ok) throw new Error("Error al guardar en el servidor");

            toast.success("APDN.pdf creado correctamente");
            onClose();
        } catch (error) {
            toast.error("Error al generar el APDN.pdf");
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto rounded-lg shadow-md bg-white p-6 w-[500px] space-y-3">
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <form className="max-w-2xl mx-auto rounded-lg shadow-md bg-white p-6 w-[500px] space-y-3">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Autorización de Pago de Nómina</h2>
            
            {/* Fecha */}
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
                    Nombre del banco
                </label>
                <input
                    type="text"
                    value={formData.banco}
                    onChange={(e) => handleChange('banco', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de cuenta
                </label>
                <input
                    type="text"
                    value={formData.numeroCuenta}
                    onChange={(e) => handleChange('numeroCuenta', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            
            <div className="flex justify-center mt-8 gap-4">
                <button
                    type="button"
                    onClick={handleGeneratePdf}
                    className="bg-cyan-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-md"
                >
                    {formData.fechaDia ? 'Actualizar PDF' : 'Generar PDF'}
                </button>
            </div>
        </form>
    );
};

export default APDN;