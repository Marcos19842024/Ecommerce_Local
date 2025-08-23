import { PDFViewer } from "@react-pdf/renderer";
import { PdfReminders } from "./PdfReminders";
import { PdfExpense } from "./PdfExpense";
import { PdfTransport } from "./PdfTransport";
import { Cliente, Fechas } from "../interfaces/client.interface";
import { FormValues, SelectValues } from "../interfaces/report.interface";

interface Props {
    sending?: Cliente[];
    notsending?: Cliente[];
    fechas?: Fechas[];
    facturas?: FormValues[];
    header?: SelectValues;
}

export const PdfViewer = ({ sending = [], notsending = [], fechas = [], facturas = [], header = {
    tipoPago: "",
    mes: "",
    anio: null
} }: Props) => {

    const renderPdfContent = () => {
        if (fechas.length > 0) return <PdfTransport fechas={fechas} />;
        if (sending.length > 0 || notsending.length > 0) return <PdfReminders sending={sending} notsending={notsending} />;
        return <PdfExpense data={facturas} filters={header} />;
    };

    return (
        <div>
            <div className="w-full h-[80vh] border shadow">
                <PDFViewer width="100%" height="100%">
                    {renderPdfContent()}
                </PDFViewer>
            </div>
        </div>
    );
};