import { PDFViewer } from "@react-pdf/renderer";
import { Cliente } from "../interfaces/client.interface";
import { PdfReminders } from "./PdfReminders";

interface Props {
    sending?: Cliente[];
    notsending?: Cliente[];
}

export const PdfViewer = ({ sending = [], notsending = [] }: Props) => {

    return (
        <div>
            <div className="w-full h-[80vh] border shadow">
                <PDFViewer width="100%" height="100%">
                    <PdfReminders sending={sending} notsending={notsending} />
                </PDFViewer>
            </div>
        </div>
    );
};