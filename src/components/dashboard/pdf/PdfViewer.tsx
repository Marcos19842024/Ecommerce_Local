import { PDFViewer } from "@react-pdf/renderer";
import { Cliente } from "../../../interfaces";
import { Pdf } from "./Pdf";

interface PdfViewerProps {
    sending: Cliente[];
    notsending: Cliente[];
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ sending, notsending }) => {

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Visor en línea */}
            <div className="w-full h-screen border shadow">
                <PDFViewer width="100%" height="100%">
                    <Pdf sending={sending} notsending={notsending} />
                </PDFViewer>
            </div>
            {/* Botón para descargar PDF */}
            {/* <BlobProvider document={<Pdf sending={sending} notsending={notsending} />}>
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
            </BlobProvider> */}
        </div>
    );
};