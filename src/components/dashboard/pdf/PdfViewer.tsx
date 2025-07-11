import { PDFViewer } from "@react-pdf/renderer";
import { Cliente, Fechas } from "../../../interfaces";
import { PdfTransport } from "./PdfTransport";
import { PdfReminders } from "./PdfReminders";

interface Props {
    sending: Cliente[];
    notsending: Cliente[];
    fechas: Fechas[];
}

export const PdfViewer = ({ sending, notsending, fechas }: Props) => {

    return (
        <div>
            <div className="w-full h-[80vh] border shadow">
                {fechas.length > 0 ? (
                    <PDFViewer width="100%" height="100%">
                        <PdfTransport fechas={fechas} />
                    </PDFViewer>
                ) : (
                    <PDFViewer width="100%" height="100%">
                        <PdfReminders sending={sending} notsending={notsending} />
                    </PDFViewer>
                )}
            </div>
        </div>
  );
};