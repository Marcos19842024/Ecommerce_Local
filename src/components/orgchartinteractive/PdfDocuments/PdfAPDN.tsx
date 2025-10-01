import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { APDNData } from '../../../interfaces/orgchartinteractive.interface';

// Estilos para el PDF
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: 'Helvetica',
        lineHeight: 1.4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        borderBottomStyle: 'solid',
        paddingBottom: 10,
    },
    logoContainer: {
        width: '20%',
        alignItems: 'center',
    },
    logo: {
        width: '50',
        height: '50',
    },
    companyInfo: {
        width: '100%',
        alignItems: 'center',
    },
    companyTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    companySubtitle: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 1,
        color: '#333333',
    },
    documentTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
        textTransform: 'uppercase',
        textDecoration: 'underline',
    },
    dateSection: {
        marginBottom: 20,
        textAlign: 'center',
    },
    dateText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    text: {
        marginBottom: 12,
        textAlign: 'justify',
        fontSize: 11,
    },
    atttext: {
        marginBottom: 2,
        textAlign: 'center',
        fontSize: 11,
    },
    table: {
        width: '100%',
        marginVertical: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000000',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        borderBottomStyle: 'solid',
        minHeight: 10,
    },
    tableCol: {
        width: '40%',
        borderRightWidth: 1,
        borderRightColor: '#000000',
        borderRightStyle: 'solid',
        padding: 8,
        backgroundColor: '#f8f8f8',
    },
    tableCol2: {
        width: '60%',
        padding: 8,
    },
    tableCell: {
        fontSize: 8,
    },
    tableCellBold: {
        fontSize: 8,
        fontWeight: 'bold',
    },
    nota: {
        marginTop: 15,
        fontSize: 8,
        fontStyle: 'italic',
        textAlign: 'justify',
        color: '#555555',
    },
    firmaSection: {
        marginTop: 50,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000000',
        padding: 20,
    },
    firmaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    firmaCol: {
        width: '48%',
    },
    firmaColRight: {
        width: '48%',
        alignItems: 'center',
    },
    firmaLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    espacioFirma: {
        height: 45,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: '#000000',
        marginBottom: 15,
    },
    espacioTexto: {
        height: 25,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: '#000000',
        paddingBottom: 2,
    },
});

export const PdfAPDN = ({ data }: {data: APDNData}) => {
    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                {/* Encabezado con logo e información de la empresa */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image
                            style={styles.logo}
                            src="./media/Logo Small.png"
                        />
                    </View>
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyTitle}>AUTORIZACIÓN PARA LA DISPERSIÓN DE NÓMINA</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                </View>

                {/* Fecha */}
                <View style={styles.dateSection}>
                    <Text style={styles.dateText}>
                        San Francisco de Campeche, Campeche. A {data.fechaDia || '______'} días del mes de {data.fechaMes || '____________________'} de {data.fechaAnio || '______'}
                    </Text>
                </View>

                {/* Contenido principal */}
                <Text style={styles.text}>
                    Por medio de la presente, autorizo y acepto que la empresa Baalak' realice el pago de mi nómina a través de la dispersión a mi cuenta la cual se describe a continuación.
                </Text>

                <Text style={styles.text}>
                    Teniendo en entendido que el depósito de mi salario semanal en su totalidad se verá reflejado los días sábado de cada semana.
                </Text>

                <Text style={styles.text}>
                    También autorizo para que me sea enviado a mi correo electrónico el recibo de nomina.
                </Text>

                {/* Tabla de datos bancarios */}
                <View style={styles.table}>
                    {/* Fila 1: Nombre del banco */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCellBold}>Nombre del banco:</Text>
                        </View>
                        <View style={styles.tableCol2}>
                            <Text style={styles.tableCell}>{data.banco || ''}</Text>
                        </View>
                    </View>
                
                    {/* Fila 2: Número de cuenta */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCellBold}>Número de cuenta:</Text>
                        </View>
                        <View style={styles.tableCol2}>
                            <Text style={styles.tableCell}>{data.numeroCuenta || ''}</Text>
                        </View>
                    </View>
                
                    {/* Fila 3: Número de Tarjeta */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCellBold}>Número de Tarjeta:</Text>
                        </View>
                        <View style={styles.tableCol2}>
                            <Text style={styles.tableCell}>{data.numeroTarjeta || ''}</Text>
                        </View>
                    </View>
                
                    {/* Fila 4: Email */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCellBold}>Email</Text>
                        </View>
                        <View style={styles.tableCol2}>
                            <Text style={styles.tableCell}>{data.email || ''}</Text>
                        </View>
                    </View>
                </View>

                {/* Nota */}
                <Text style={styles.nota}>
                    NOTA: Se anexa a este documento la copia de los datos arriba mencionados en el estado de cuenta para cotejar datos.
                </Text>

                <Text style={styles.atttext}>Atentamente.</Text>

                {/* Sección de firma - Réplica exacta del formato del documento */}
                <View style={styles.firmaSection}>
                    <View style={styles.firmaRow}>
                        {/* Columna izquierda - Trabajador */}
                        <View style={styles.firmaCol}>
                            <Text style={styles.firmaLabel}>Trabajador:</Text>
                            
                            <View style={styles.espacioTexto}>
                                <Text style={styles.firmaLabel}>Nombre:</Text>
                                <Text style={{ fontSize: 10, paddingTop: 3 }}>{data.trabajador || ''}</Text>
                            </View>
                            
                            <Text style={styles.firmaLabel}>Firma:</Text>
                            <View style={styles.espacioFirma} />
                        </View>
                        
                        {/* Columna derecha - Huella */}
                        <View style={styles.firmaColRight}>
                            <Text style={styles.firmaLabel}>Huella</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};