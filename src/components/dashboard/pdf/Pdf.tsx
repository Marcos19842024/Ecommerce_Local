import React, { useEffect, useState } from "react";
import { Document, Text, Page, View, StyleSheet } from "@react-pdf/renderer";
import { Cliente } from "../../../interfaces";

interface PdfProps {
    data1: Cliente[];
    data2: Cliente[];
}

export const Pdf: React.FC<PdfProps> = ({ data1, data2 }) => {
    const [sending, setSending] = useState<Cliente[]>([]);
    const [notsending, setNotsending] = useState<Cliente[]>([]);
    
    useEffect(() => {
        setSending(data1);
        setNotsending(data2);
        console.log('este es el pdf')
    },[]);

    const styles = StyleSheet.create({
        page: {
            padding: 20,
            flexDirection: "column",
            display: "flex",
        },
        section: {
            display: "flex",
            justifyContent: "center",
            alignContent: "flex-end",
            flexDirection: "column",
        },
        title: {
            textAlign: "center",
            flexDirection: "column",
            display: "flex",
            alignItems: "center",
        },
        column: {
            flexDirection: "row",
            borderBottom: "1px solid #ccc",
        },
        table: {
            width: "50%",
            padding: 3,
            fontSize: 10,
            display: "flex",
            flexDirection: "column",
        },
        rowtable: {
            flexDirection: "row",
            backgroundColor: "#4682B4",
        },
        row: {
            flexDirection: "row",
            borderBottom: "1px solid #ccc",
            marginTop: 2,
            padding: 2,
        },
        header: {
            width: "100%",
            textAlign: "center",
            fontWeight: 800,
            color: "#4682B4",
            marginTop: 3,
            padding: 3,
        },
        headerid: {
            width: "8%",
            textAlign: "center",
            fontWeight: 800,
            color: "white",
            marginTop: 2,
            padding: 2,
        },
        headername: {
            width: "62%",
            textAlign: "center",
            fontWeight: 800,
            color: "white",
            marginTop: 2,
            padding: 2,
        },
        headertelefono: {
            width: "30%",
            textAlign: "center",
            fontWeight: 800,
            color: "white",
            marginTop: 2,
            padding: 2,
        },
        cellid: {
            width: "8%",
            textAlign: "center",
            color: "#4682B4",
            marginTop: 2,
            padding: 2,
        },
        cellname: {
            width: "62%",
            textAlign: "left",
            color: "#4682B4",
            marginTop: 2,
            padding: 2,
        },
        celltelefono: {
            width: "30%",
            textAlign: "right",
            color: "#4682B4",
            marginTop: 2,
            padding: 2,
        },
        footer: {
            textAlign: "right",
            display: "flex",
            borderTop: "1px solid #ccc",
            marginTop: 2,
            padding: 2,
            fontSize: 8,
        },
  });

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.title}>Lista de recordatorios</Text>
                </View>
                <View style={styles.column}>
                    {/* Enviados */}
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <View style={styles.header}>
                                <Text>Enviados</Text>
                            </View>
                        </View>
                        <View style={styles.rowtable}>
                            <View style={styles.headerid}>
                                <Text>Id</Text>
                            </View>
                            <View style={styles.headername}>
                                <Text>Nombre</Text>
                            </View>
                            <View style={styles.headertelefono}>
                                <Text>Teléfono</Text>
                            </View>
                        </View>
                        {sending?.map((cliente, index) => (
                            <View key={`sent-${index}`} style={styles.row}>
                                <View style={styles.cellid}>
                                    <Text>{index + 1}</Text>
                                </View>
                                <View style={styles.cellname}>
                                    <Text>{cliente.nombre}</Text>
                                </View>
                                <View style={styles.celltelefono}>
                                    <Text>{cliente.telefono}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                    {/* No enviados */}
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <View style={styles.header}>
                                <Text>No enviados</Text>
                            </View>
                        </View>
                        <View style={styles.rowtable}>
                            <View style={styles.headerid}>
                                <Text>Id</Text>
                            </View>
                            <View style={styles.headername}>
                                <Text>Nombre</Text>
                            </View>
                            <View style={styles.headertelefono}>
                                <Text>Teléfono</Text>
                            </View>
                        </View>
                        {notsending?.map((cliente, index) => (
                            <View key={`notsent-${index}`} style={styles.row}>
                                <View style={styles.cellid}>
                                    <Text>{index + 1}</Text>
                                </View>
                                <View style={styles.cellname}>
                                    <Text>{cliente.nombre}</Text>
                                </View>
                                <View style={styles.celltelefono}>
                                    <Text>{cliente.telefono}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text
                        render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => `Página ${pageNumber} de ${totalPages}`}
                        fixed
                    />
                </View>
            </Page>
        </Document>
    );
};