export interface PdfReaderFacturaProps {
    file: File;
    info: string;
}

export interface DatosFactura {
    empresa?: string;
    folio?: string;
    fecha?: string;
    concepto?: string;
    subtotal?: string;
    iva?: string;
    total?: string;
}