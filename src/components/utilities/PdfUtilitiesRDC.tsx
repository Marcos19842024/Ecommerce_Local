import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const pdfStyles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        paddingBottom: 10,
        borderBottom: '2 solid #3B82F6',
    },
    title: {
        fontSize: 24,
        color: '#1E40AF',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 15,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        color: '#3B82F6',
        marginBottom: 8,
        fontWeight: 'bold',
        backgroundColor: '#EFF6FF',
        padding: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        fontSize: 10,
        color: '#4B5563',
        width: 150,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 10,
        color: '#1F2937',
        flex: 1,
    },
    textArea: {
        fontSize: 10,
        color: '#1F2937',
        marginTop: 3,
        lineHeight: 1.4,
    },
    separator: {
        borderBottom: '1 solid #E5E7EB',
        marginVertical: 10,
    },
    signature: {
        marginTop: 40,
        paddingTop: 10,
        borderTop: '1 solid #000',
        width: 250,
    },
});

export const PdfUtilitiesRDC = ({ data }: any) => (
    <Document>
        <Page size="LETTER" style={pdfStyles.page}>
            <View style={pdfStyles.header}>
                <Text style={pdfStyles.title}>REPORTE DE PROBLEMA DEL CLIENTE (RPC)</Text>
            </View>

            <View style={pdfStyles.section}>
                <Text style={pdfStyles.sectionTitle}>INFORMACIÓN DEL CLIENTE</Text>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Fecha del problema:</Text>
                    <Text style={pdfStyles.value}>{data.fechaProblema || 'N/A'}</Text>
                </View>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Nombre del Cliente:</Text>
                    <Text style={pdfStyles.value}>{data.nombreCliente || 'N/A'}</Text>
                </View>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Teléfono:</Text>
                    <Text style={pdfStyles.value}>{data.telefono || 'N/A'}</Text>
                </View>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Teléfono Celular:</Text>
                    <Text style={pdfStyles.value}>{data.telefonoCelular || 'N/A'}</Text>
                </View>
            </View>

            <View style={pdfStyles.separator} />

            <View style={pdfStyles.section}>
                <Text style={pdfStyles.sectionTitle}>INFORMACIÓN DE LA MASCOTA</Text>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Nombre de la Mascota:</Text>
                    <Text style={pdfStyles.value}>{data.nombreMascota || 'N/A'}</Text>
                </View>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Raza:</Text>
                    <Text style={pdfStyles.value}>{data.raza || 'N/A'}</Text>
                </View>
            </View>

            <View style={pdfStyles.separator} />

            <View style={pdfStyles.section}>
                <Text style={pdfStyles.sectionTitle}>DETALLES DEL SERVICIO</Text>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Área:</Text>
                    <Text style={pdfStyles.value}>{data.area || 'N/A'}</Text>
                </View>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Personal:</Text>
                    <Text style={pdfStyles.value}>{data.personal || 'N/A'}</Text>
                </View>
            </View>

            <View style={pdfStyles.separator} />

            <View style={pdfStyles.section}>
                <Text style={pdfStyles.sectionTitle}>RETROALIMENTACIÓN DEL CLIENTE</Text>
                <Text style={pdfStyles.textArea}>{data.retroalimentacion || 'N/A'}</Text>
            </View>

            <View style={pdfStyles.separator} />

            <View style={pdfStyles.section}>
                <Text style={pdfStyles.sectionTitle}>PLAN DE ACCIÓN</Text>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Fecha:</Text>
                    <Text style={pdfStyles.value}>{data.planAccion || 'N/A'}</Text>
                </View>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Responsable:</Text>
                    <Text style={pdfStyles.value}>{data.responsable || 'N/A'}</Text>
                </View>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Cómo se resolverá:</Text>
                    <Text style={pdfStyles.value}>{data.comoResolver || 'N/A'}</Text>
                </View>
            </View>

            <View style={pdfStyles.separator} />

            <View style={pdfStyles.section}>
                <Text style={pdfStyles.sectionTitle}>CONTACTO CON EL CLIENTE</Text>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Fecha:</Text>
                    <Text style={pdfStyles.value}>{data.contactoCliente || 'N/A'}</Text>
                </View>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Pasos seguidos:</Text>
                    <Text style={pdfStyles.value}>{data.pasosResolver || 'N/A'}</Text>
                </View>
            </View>

            <View style={pdfStyles.separator} />

            <View style={pdfStyles.section}>
                <Text style={pdfStyles.sectionTitle}>RESOLUCIÓN</Text>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Queja resuelta:</Text>
                    <Text style={pdfStyles.value}>{data.quejaResuelta || 'N/A'}</Text>
                </View>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Costo al área:</Text>
                    <Text style={pdfStyles.value}>{data.costoArea ? `$${data.costoArea}` : 'N/A'}</Text>
                </View>
                <View style={pdfStyles.row}>
                    <Text style={pdfStyles.label}>Observaciones:</Text>
                    <Text style={pdfStyles.value}>{data.observaciones || 'N/A'}</Text>
                </View>
            </View>

            <View style={pdfStyles.signature}>
                <Text style={pdfStyles.label}>Firma del gerente responsable:</Text>
                <Text style={{...pdfStyles.value, marginTop: 20}}>{data.firmaGerente || '________________________'}</Text>
            </View>
        </Page>
    </Document>
);