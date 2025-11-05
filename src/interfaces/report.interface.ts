export type FormValues = {
    fecha: string;
    factura: string;
    proveedor: string;
    concepto: string;
    subtotal: number | null;
    descuento: number | null;
    iva: number | null;
    total: number | null;
};

export type SelectValues = {
    tipoPago: string;
    mes: string;
    anio: number | null;
};

export interface FilePreviewModalProps {
  url: string;
  type: "pdf" | "xml";
}