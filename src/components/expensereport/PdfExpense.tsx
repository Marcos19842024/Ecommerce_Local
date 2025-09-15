import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { FormValues, SelectValues } from "../../interfaces/report.interface";

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        flexDirection: "column",
    },
    title: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: "center",
    },
    tableHeader: {
        flexDirection: "row",
        borderBottom: "1pt solid black",
        fontWeight: "bold",
        paddingBottom: 4,
        marginBottom: 4,
        marginTop: 10,
        fontSize: 10,
        textTransform: "uppercase",
        color: "#4682B4",
    },
    row: {
        flexDirection: "row",
        borderBottom: "0.5pt solid #ccc",
        paddingVertical: 2,
        color: "#4682B4",
    },
    colFecha: { width: "8%" },
    colFactura: { width: "10%" },
    colProveedor: { width: "25%" },
    colConcepto: { width: "25%" },
    colNum: { width: "8%", textAlign: "right" },
    totalRow: {
        flexDirection: "row",
        marginTop: 8,
        borderTop: "1pt solid black",
        paddingTop: 4,
        color: "#4682B4",
    },
    footer: {
        marginTop: 20,
        textAlign: "right",
        fontSize: 10,
    },
});


interface ExpensePdfProps {
    data: FormValues[];
    filters: SelectValues;
}

export const PdfExpense = ({ data, filters }: ExpensePdfProps) => {
    const formatCurrency = (value: number) => new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
    }).format(value);

    const sum = (field: keyof FormValues) => data.reduce((acc, row) => acc + (typeof row[field] === "number" ? row[field] : Number(row[field]) || 0), 0);

    const ITEMS_PER_PAGE = 30;
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

    const renderTableHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={styles.colFecha}>Fecha</Text>
            <Text style={styles.colFactura}>Factura</Text>
            <Text style={styles.colProveedor}>Proveedor</Text>
            <Text style={styles.colConcepto}>Concepto</Text>
            <Text style={styles.colNum}>Subtotal</Text>
            <Text style={styles.colNum}>Dto.</Text>
            <Text style={styles.colNum}>IVA</Text>
            <Text style={styles.colNum}>Total</Text>
        </View>
    );

    const renderRow = (row: FormValues, i: number) => (
        <View key={i} style={styles.row}>
            <Text style={styles.colFecha}>{row.fecha}</Text>
            <Text style={styles.colFactura}>{row.factura}</Text>
            <Text style={styles.colProveedor}>{row.proveedor}</Text>
            <Text style={styles.colConcepto}>{row.concepto}</Text>
            <Text style={styles.colNum}>{formatCurrency(row.subtotal ?? 0)}</Text>
            <Text style={styles.colNum}>{formatCurrency(row.descuento ?? 0)}</Text>
            <Text style={styles.colNum}>{formatCurrency(row.iva ?? 0)}</Text>
            <Text style={styles.colNum}>{formatCurrency(row.total ?? 0)}</Text>
        </View>
    );

    return (
        <Document>
            {Array.from({ length: totalPages }).map((_, pageIndex) => {
                const start = pageIndex * ITEMS_PER_PAGE;
                const end = start + ITEMS_PER_PAGE;
                const currentData = data.slice(start, end);

                return (
                    <Page
                        size="LETTER"
                        orientation="landscape"
                        style={styles.page}
                        key={pageIndex}
                    >
                        <Text style={styles.title}>Reporte de Gastos</Text>
                        <Text>{`Tipo de pago: ${filters.tipoPago} | Mes: ${filters.mes} | Año: ${filters.anio}`}</Text>

                        {renderTableHeader()}
                        {currentData.map(renderRow)}

                        {pageIndex === totalPages - 1 && (
                        <View style={styles.totalRow}>
                            <Text style={styles.colFecha}>Totales:</Text>
                            <Text style={styles.colFactura}></Text>
                            <Text style={styles.colProveedor}></Text>
                            <Text style={styles.colConcepto}></Text>
                            <Text style={styles.colNum}>{formatCurrency(sum("subtotal"))}</Text>
                            <Text style={styles.colNum}>{formatCurrency(sum("descuento"))}</Text>
                            <Text style={styles.colNum}>{formatCurrency(sum("iva"))}</Text>
                            <Text style={styles.colNum}>{formatCurrency(sum("total"))}</Text>
                        </View>
                        )}

                        <Text style={styles.footer}>
                            Página {pageIndex + 1} de {totalPages}
                        </Text>
                    </Page>
                );
            })}
        </Document>
    );
};