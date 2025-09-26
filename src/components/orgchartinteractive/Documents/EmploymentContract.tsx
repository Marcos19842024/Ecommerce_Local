import { pdf } from "@react-pdf/renderer";
import { useState, useEffect } from "react";
import { ContractData, EmployeeContractProps } from "../../../interfaces/orgchartinteractive.interface";
import { url } from "../../../server/url";
import { PdfEmployeeContract } from "../PdfDocuments/PdfEmployeeContract";
import { formatDateLong } from "../../../helpers";
import toast from "react-hot-toast";
import { getDocument } from "pdfjs-dist";

// Configurar pdfjs-dist
import * as pdfjs from 'pdfjs-dist';

const EmployeementContract = ({ file, name, onClose }: EmployeeContractProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [contractData, setContractData] = useState<ContractData>({
        trabajador: '',
        estadoOrigen: '',
        curp: '',
        rfc: '',
        duracionContrato: '',
        salarioDiario: '',
        salarioSemanal: '',
        fechaContrato: ''
    });

    // Estados para controlar los checkboxes
    const [isIndefinido, setIsIndefinido] = useState<boolean>(false);
    const [isTemporal, setIsTemporal] = useState<boolean>(true);
    const [fechaInput, setFechaInput] = useState<string>(new Date().toISOString().split('T')[0]);

    const parseFacturaData = (texto: string): ContractData => {

        // EXTRAER VALORES BASADO EN LAS POSICIONES EXACTAS DEL CONSOLE.LOG
        let rfc = '';
        let curp = '';
        let estadoOrigen = '';
        let fechaIngreso = '';

        // Buscar después de "RFC"
        const afterRfc = texto.split('RFC')[1];
        if (afterRfc) {
            const parts = afterRfc.split(/\s+/).filter(p => p.trim() !== '');
            
            if (parts.length > 3) {
                rfc = parts[3];
            }
        }

        // Buscar después de "CURP" 
        const afterCurp = texto.split('CURP')[1];
        if (afterCurp) {
            const parts = afterCurp.split(/\s+/).filter(p => p.trim() !== '');
            
            if (parts.length > 5) {
                curp = parts[5];
            }
        }

        // Buscar después de "Estado nac."
        const afterEstado = texto.split('Estado nac.')[1];
        if (afterEstado) {
            const parts = afterEstado.split(/\s+/).filter(p => p.trim() !== '');

            if (parts.length > 7) {
                estadoOrigen = parts[7]; // "Camp."
            }
        }

        // Buscar después de "Ingreso"
        const afterIngreso = texto.split('Ingreso')[1];
        if (afterIngreso) {
            const parts = afterIngreso.split(/\s+/).filter(p => p.trim() !== '');

            if (parts.length > 8) {
                fechaIngreso = parts[6] + ' ' + parts[7] + ' ' + parts[8];
            }
        }

        if (estadoOrigen === 'Camp.') estadoOrigen = 'Campeche';

        // Formatear fecha
        const formatFecha = (fechaStr: string): string => {
            if (!fechaStr) return new Date().toISOString().split('T')[0];
            
            try {
                const meses: { [key: string]: string } = {
                    'ene': '01', 'feb': '02', 'mar': '03', 'abr': '04',
                    'may': '05', 'jun': '06', 'jul': '07', 'ago': '08',
                    'sep': '09', 'oct': '10', 'nov': '11', 'dic': '12'
                };
                
                const parts = fechaStr.toLowerCase().split(/\s+/);
                if (parts.length === 3) {
                    const dia = parts[0].padStart(2, '0');
                    const mes = meses[parts[1]] || '01';
                    const anio = parts[2];
                    return `${anio}-${mes}-${dia}`;
                }
            } catch (error) {
                console.error('Error formateando fecha:', error);
            }
            
            return new Date().toISOString().split('T')[0];
        };

        const fechaIngresoFormateada = formatFecha(fechaIngreso);

        return {
            trabajador: name,
            estadoOrigen: estadoOrigen,
            curp: curp,
            rfc: rfc,
            duracionContrato: '30',
            salarioDiario: '$0.00',
            salarioSemanal: '',
            fechaContrato: formatDateLong(fechaIngresoFormateada)
        };
    };

    // Leer el contenido del PDF desde la URL
    useEffect(() => {
        const readPdfFromUrl = async () => {
            if (!file || !file.url) {
                setIsLoading(false);
                toast.error('No hay archivo PDF para procesar');
                onClose();
                return;
            }
            
            setIsLoading(true);
            try {
                // Configurar el worker de pdfjs
                pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

                // Descargar el PDF desde la URL
                const response = await fetch(file.url);
                if (!response.ok) {
                    throw new Error(`Error al descargar el PDF: ${response.status}`);
                }

                const arrayBuffer = await response.arrayBuffer();
                const typedArray = new Uint8Array(arrayBuffer);
                const pdfDoc = await getDocument({ data: typedArray }).promise;

                let fullText = "";
                for (let i = 1; i <= pdfDoc.numPages; i++) {
                    const page = await pdfDoc.getPage(i);
                    const content = await page.getTextContent();
                    const strings = content.items.map((item: any) => item.str);
                    fullText += strings.join(" ") + "\n";
                }

                const extractedData = parseFacturaData(fullText);
                
                setContractData(prev => ({
                    ...prev,
                    ...extractedData
                }));
                
            } catch (error) {
                onClose();
                toast.error('Error al leer el archivo PDF');
            } finally {
                setIsLoading(false);
            }
        };

        readPdfFromUrl();
    }, [file, name, onClose]);

    // Resto del código se mantiene igual...
    const extractNumericValue = (salaryString: string): number => {
        const numericString = salaryString.replace(/[^\d.]/g, '');
        return parseFloat(numericString) || 0;
    };

    const formatCurrency = (amount: number): string => {
        return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    };

    useEffect(() => {
        const dailySalary = extractNumericValue(contractData.salarioDiario);
        const weeklySalary = dailySalary * 7;
        
        setContractData(prev => ({
            ...prev,
            salarioSemanal: formatCurrency(weeklySalary)
        }));
    }, [contractData.salarioDiario]);

    useEffect(() => {
        if (fechaInput) {
            const fechaFormateada = formatDateLong(fechaInput);
            setContractData(prev => ({
                ...prev,
                fechaContrato: fechaFormateada
            }));
        }
    }, [fechaInput]);

    const handleInputChange = (field: keyof ContractData, value: string) => {
        setContractData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTipoContratoChange = (tipo: 'indefinido' | 'temporal') => {
        if (tipo === 'indefinido') {
            setIsIndefinido(true);
            setIsTemporal(false);
            setContractData(prev => ({ ...prev, duracionContrato: '' }));
        } else {
            setIsIndefinido(false);
            setIsTemporal(true);
            if (!contractData.duracionContrato || contractData.duracionContrato === '') {
                setContractData(prev => ({ ...prev, duracionContrato: '30' }));
            }
        }
    };

    const handleGeneratePdf = async () => {
        try {
            if (!isIndefinido && !isTemporal) {
                toast.error("Por favor, seleccione un tipo de contrato");
                return;
            }

            if (isTemporal && (!contractData.duracionContrato || contractData.duracionContrato.trim() === '')) {
                toast.error("Para contrato temporal, ingrese la duración en días");
                return;
            }

            const dailySalary = extractNumericValue(contractData.salarioDiario);
            if (dailySalary <= 0) {
                toast.error("Por favor, ingrese un salario diario válido");
                return;
            }

            if (!contractData.fechaContrato || contractData.fechaContrato.trim() === '') {
                toast.error("Por favor, ingrese una fecha válida");
                return;
            }

            const blob = await pdf(<PdfEmployeeContract data={contractData} />).toBlob();
            const formDataUpload = new FormData();
            formDataUpload.append('file', blob, "Contrato laboral.pdf");
            
            const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(name)}`, {
                method: 'POST',
                body: formDataUpload,
            });

            if (!response.ok) throw new Error("Error al guardar en el servidor");

            toast.success("Contrato laboral.pdf creado correctamente");
            onClose();
        } catch (error) {
            toast.error("Error al generar el Contrato laboral.pdf");
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Leyendo PDF y extrayendo datos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center">Contrato laboral</h1>
            <form className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold m-4">Información Personal (extraída del PDF)</h2>
                <div className="bg-gray-100 p-2 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="font-semibold">Nombre del Trabajador:</span>
                        <input
                            type="text"
                            value={contractData.trabajador}
                            onChange={(e) => handleInputChange('trabajador', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Nombre completo"
                        />
                    </div>
                    <div>
                        <span className="font-semibold">Estado de Origen:</span>
                        <input
                            type="text"
                            value={contractData.estadoOrigen}
                            onChange={(e) => handleInputChange('estadoOrigen', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Estado"
                        />
                    </div>
                    <div>
                        <span className="font-semibold">CURP:</span>
                        <input
                            type="text"
                            value={contractData.curp}
                            onChange={(e) => handleInputChange('curp', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="CURP"
                        />
                    </div>
                    <div>
                        <span className="font-semibold">RFC:</span>
                        <input
                            type="text"
                            value={contractData.rfc}
                            onChange={(e) => handleInputChange('rfc', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="RFC"
                        />
                    </div>
                </div>

                <h2 className="text-xl font-bold m-4">Información del contrato (a completar)</h2>
                <div className="bg-gray-100 p-2 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="m-1 gap-2 flex flex-col">
                        <label className="block text-sm font-medium font-semibold mb-1">
                            Tipo de contrato:
                        </label>
                        <label className="flex items-center gap-1 text-cyan-600 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={isIndefinido} 
                                onChange={() => handleTipoContratoChange('indefinido')}
                                className="rounded text-cyan-600 focus:ring-cyan-500"
                            />
                            Indefinido
                        </label>
                        <label className="flex items-center gap-1 text-cyan-600 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={isTemporal} 
                                onChange={() => handleTipoContratoChange('temporal')}
                                className="rounded text-cyan-600 focus:ring-cyan-500"
                            />
                            Temporal
                        </label>
                        
                        {isTemporal && (
                            <div>
                                <label className="block text-sm font-medium font-semibold mb-1">
                                    Duración del Contrato (días):
                                </label>
                                <input
                                    type="text"
                                    value={contractData.duracionContrato}
                                    onChange={(e) => handleInputChange('duracionContrato', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                    required={isTemporal}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium font-semibold mb-1">
                            Salario diario *:
                        </label>
                        <input
                            type="text"
                            value={contractData.salarioDiario}
                            onChange={(e) => handleInputChange('salarioDiario', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            required
                            placeholder="$0.00"
                        />
                    
                        <p className="text-xs text-gray-500 mt-1">
                            Salario semanal: {contractData.salarioSemanal} 
                        </p>

                        <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                            Fecha del contrato:
                        </label>
                        <input
                            type="date"
                            value={fechaInput}
                            onChange={(e) => setFechaInput(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                            <strong>Fecha formateada:</strong> {contractData.fechaContrato}
                        </p>
                    </div>
                </div>
            </form>

            <div className="flex justify-center mt-8 gap-4">
                <button
                    type="button"
                    onClick={handleGeneratePdf}
                    className="bg-cyan-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-md"
                    disabled={isLoading}
                >
                    {isLoading ? 'Procesando...' : 'Generar PDF'}
                </button>
            </div>
        </div>
    );
};

export default EmployeementContract;