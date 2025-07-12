import React, { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import pdfWorker from "../../../utils/pdf.worker";

GlobalWorkerOptions.workerPort = new pdfWorker();

interface PdfReaderFacturaProps {
    file: File;
    info: string;
}

interface DatosFactura {
    empresa?: string;
    folio?: string;
    fecha?: string;
    concepto?: string;
    subtotal?: string;
    iva?: string;
    total?: string;
}

export const ExpenseReport: React.FC<PdfReaderFacturaProps> = ({ file, info }) => {
    const [datos, setDatos] = useState<DatosFactura | null>(null);
    const [rawText, setRawText] = useState<string>("");

    useEffect(() => {
        const readPdf = async () => {
            const reader = new FileReader();
            reader.onload = async () => {
                const typedArray = new Uint8Array(reader.result as ArrayBuffer);
                const pdf: PDFDocumentProxy = await getDocument({ data: typedArray }).promise;

                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const strings = content.items.map((item: any) => item.str);
                    fullText += strings.join(" ") + "\n";
                }

                setRawText(fullText);
                const extracted = parseFacturaData(fullText);
                setDatos(extracted);
            };

            reader.readAsArrayBuffer(file);
        };

        readPdf();
    }, [file]);

    return (
        <div className="p-4">
            <h2 className="font-bold text-lg mb-2">Datos extraídos de la factura:</h2>
            <div className="flex w-fit items-center justify-between gap-1 text-cyan-600">
                <i
                    className="fa fa-file-pdf-o fa-1x"
                    style={{color:"red"}}>
                </i>
                <span
                    className='w-fit'>{`  ${info}`}
                </span>
            </div>
            {datos ? (
                <ul className="list-disc ml-6 space-y-1">
                    <li><strong>Empresa:</strong> {datos.empresa ?? "No encontrada"}</li>
                    <li><strong>Folio:</strong> {datos.folio ?? "No encontrado"}</li>
                    <li><strong>Fecha:</strong> {datos.fecha ?? "No encontrada"}</li>
                    <li><strong>Concepto:</strong> {datos.concepto ?? "No encontrado"}</li>
                    <li><strong>Subtotal:</strong> {datos.subtotal ?? "No encontrado"}</li>
                    <li><strong>IVA:</strong> {datos.iva ?? "No encontrado"}</li>
                    <li><strong>Total:</strong> {datos.total ?? "No encontrado"}</li>
                </ul>
            ) : (
                <p>Procesando PDF...</p>
            )}

            <details className="mt-6">
                <summary className="text-sm text-blue-600 cursor-pointer">Ver texto completo</summary>
                <pre className="bg-gray-100 p-2 rounded mt-2 max-h-64 overflow-auto whitespace-pre-wrap">
                    {rawText}
                </pre>
            </details>
        </div>
    );
};

// 🧠 Función para extraer datos de texto plano
const parseFacturaData = (text: string): DatosFactura => {
    const empresa = text.match(/Factura Electrónica.*?\s([A-Z\s]+)\s+Domicilio/i)?.[1]?.trim();
    const folio = text.match(/Folio Fiscal:\s*([\w-]+)/i)?.[1];
    const fecha = text.match(/Fecha Factura:\s*([\d\/:\s]+)/i)?.[1];
    const conceptoMatches = [...text.matchAll(/CONSULTA VETERINARIA|CEFAXAL SUSP.*?|FUROSIPETS.*?/gi)];
    const concepto = conceptoMatches.map((m) => m[0]).join(", ");
    const subtotal = text.match(/SubTotal\s+([\d,]+\.\d{2})/)?.[1];
    const iva = text.match(/IVA .*?([\d,]+\.\d{2})\s+[\d,]+\.\d{2}/i)?.[1];
    const total = text.match(/TOTAL\s*\$\s*([\d,]+\.\d{2})/i)?.[1];

    return {
        empresa,
        folio,
        fecha,
        concepto,
        subtotal,
        iva,
        total,
    };
};