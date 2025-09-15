import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Fechas } from "../../interfaces/transport.interface";

interface PdfProps {
    fechas: Fechas[];
}

const ROW_HEIGHT = 16; // Altura por mascota en puntos
const BASE_CLIENT_HEIGHT = 90; // Encabezados + márgenes
const MAX_HEIGHT_PER_PAGE = 700; // Altura máxima utilizable en cada página

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        fontFamily: "Helvetica",
        flexDirection: "column",
    },
    section: {
        marginBottom: 10,
    },
    title: {
        textAlign: "center",
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 5,
    },
    subtitle: {
        textAlign: "center",
        fontSize: 10,
        marginBottom: 10,
    },
    column: {
        flexDirection: "row",
        gap: 5,
        marginBottom: 6,
    },
    table: {
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: 3,
        padding: 3,
    },
    rowtable: {
        flexDirection: "row",
        backgroundColor: "#4682B4",
        paddingVertical: 4,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    row: {
        flexDirection: "row",
        borderBottom: "1px solid #ccc",
        paddingVertical: 2,
        paddingHorizontal: 2,
    },
    verticalTextBox: {
        width: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    verticalText: {
        transform: "rotate(-90deg)",
        fontSize: 10,
        textAlign: "center",
        color: "#4682B4",
    },
    header: {
        fontWeight: 800,
        color: "#4682B4",
        marginVertical: 3,
        fontSize: 11,
    },
    tableHeader: {
        width: "33%",
        textAlign: "center",
        color: "white",
        fontWeight: 700,
    },
    tableCel: {
        width: "33%",
        textAlign: "center",
        color: "#4682B4",
    },
    tableFooter: {
        width: "100%",
        marginVertical: 3,
        textAlign: "left",
        color: "#4682B4",
    },
    groupHeader: {
        backgroundColor: "#E8F4FC",
        padding: 4,
        borderRadius: 4,
        marginBottom: 6,
        marginTop: 12,
        borderLeft: "3px solid #4682B4",
    },
    groupTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#1E3A8A",
    },
    totals: {
        marginTop: 15,
        fontSize: 10,
        textAlign: "left",
    },
    footer: {
        textAlign: "right",
        fontSize: 8,
        marginTop: 10,
        borderTop: "1px solid #ccc",
        paddingTop: 5,
    },
});

type ClienteItem = {
    fecha: string;
    hora: string;
    nombre: string;
    status: string;
    mascotas: {
        nombre: string;
        raza: string;
        asunto: string;
    }[];
};

const flattenClientes = (fechas: Fechas[]): ClienteItem[] => {
    const result: ClienteItem[] = [];
    fechas.forEach((fecha) => {
        fecha.clientes.forEach((cliente) => {
            result.push({
                fecha: fecha.fecha,
                hora: cliente.hora,
                nombre: cliente.nombre,
                status: cliente.status,
                mascotas: cliente.mascotas,
            });
        });
    });
    return result;
};

const paginateByHeight = (clientes: ClienteItem[]): ClienteItem[][] => {
    const pages: ClienteItem[][] = [];
    let currentPage: ClienteItem[] = [];
    let currentHeight = 0;

    for (const cliente of clientes) {
        const estimatedHeight = BASE_CLIENT_HEIGHT + cliente.mascotas.length * ROW_HEIGHT;
        if (currentHeight + estimatedHeight > MAX_HEIGHT_PER_PAGE) {
            pages.push(currentPage);
            currentPage = [];
            currentHeight = 0;
        }
        currentPage.push(cliente);
        currentHeight += estimatedHeight;
    }

    if (currentPage.length > 0) pages.push(currentPage);
    return pages;
};

export const PdfTransport = ({ fechas }: PdfProps) => {
    const now = new Date().toLocaleString("es-MX");
    const clientes = flattenClientes(fechas);
    const pages = paginateByHeight(clientes);
    const totalPages = pages.length;

    return (
        <Document>
            {pages.map((clientesPage, pageIndex) => {
                let lastFecha = "";

                return (
                    <Page size="LETTER" style={styles.page} key={pageIndex}>
                        <View style={styles.section}>
                            <Text style={styles.title}>Lista de transportes</Text>
                            <Text style={styles.subtitle}>Fecha de creación: {now}</Text>
                        </View>

                        {clientesPage.map((cliente, i) => {
                            const showFecha = cliente.fecha !== lastFecha;
                            lastFecha = cliente.fecha;

                            const totalClientesPorFecha = clientes.filter(
                                (c) => c.fecha === cliente.fecha
                            ).length;

                            return (
                                <View key={i} style={styles.section}>
                                    {showFecha && (
                                        <View style={styles.groupHeader}>
                                            <Text style={styles.groupTitle}>
                                                Fecha: {cliente.fecha} (Total de transportes: {totalClientesPorFecha})
                                            </Text>
                                        </View>
                                    )}
                                    <View style={styles.column}>
                                        <View style={styles.verticalTextBox}>
                                            <Text style={styles.verticalText}>{cliente.hora} hrs.</Text>
                                        </View>
                                        <View style={styles.table}>
                                            <Text style={styles.header}>Cliente: {cliente.nombre}</Text>
                                            <View style={styles.rowtable} wrap={false}>
                                                <Text style={styles.tableHeader}>Nombre</Text>
                                                <Text style={styles.tableHeader}>Raza</Text>
                                                <Text style={styles.tableHeader}>Asunto</Text>
                                            </View>
                                            {cliente.mascotas.map((mascota, j) => (
                                                <View key={j} style={styles.row}>
                                                    <Text style={styles.tableCel}>{mascota.nombre}</Text>
                                                    <Text style={styles.tableCel}>{mascota.raza}</Text>
                                                    <Text style={styles.tableCel}>{mascota.asunto}</Text>
                                                </View>
                                            ))}
                                            <View style={styles.row}>
                                                <Text style={styles.tableFooter}>Observaciones: {cliente.status}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}

                        {pageIndex === totalPages - 1 && (
                            <View style={styles.totals}>
                                <Text>Total general de transportes: {clientes.length}</Text>
                            </View>
                        )}

                        <View style={styles.footer}>
                            <Text render={() => `Página ${pageIndex + 1} de ${totalPages}`} fixed />
                        </View>
                    </Page>
                );
            })}
        </Document>
    );
};