import React from "react";
import { PDFViewer, BlobProvider } from "@react-pdf/renderer";
import Pdf from "./Pdf";
import { saveAs } from "file-saver";
import { Cliente } from "../../../interfaces";

interface PdfViewerProps {
    data1: Cliente[];
    data2: Cliente[];
}

const PdfViewer: React.FC<PdfViewerProps> = ({ data1, data2 }) => {
    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-lg font-bold">Vista previa PDF</h1>
            {/* Visor en línea */}
            <div className="w-full h-[600px] border shadow">
                <PDFViewer width="100%" height="100%">
                    <Pdf data1={data1} data2={data2} />
                </PDFViewer>
            </div>
            {/* Botón para descargar PDF */}
            <BlobProvider document={<Pdf data1={data1} data2={data2} />}>
                {({ blob, loading }) =>
                    loading ? (
                        <button disabled className="bg-gray-400 px-4 py-2 rounded">
                            Generando...
                        </button>
                    ) : (
                        <button
                            onClick={() => blob && saveAs(blob, "recordatorios.pdf")}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Descargar PDF
                        </button>
                    )
                }
            </BlobProvider>
        </div>
    );
};

export default PdfViewer;