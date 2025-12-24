import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ExcelRow } from '../../interfaces/debtors.interface';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontSize: 10,
    },
    header: {
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#1e40af',
        borderBottomStyle: 'solid',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#4b5563',
        marginBottom: 10,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: '#f3f4f6',
        padding: 10,
        borderRadius: 5,
    },
    summaryItem: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 10,
        color: '#6b7280',
        marginBottom: 2,
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#d1d5db',
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#d1d5db',
        borderBottomStyle: 'solid',
    },
    tableHeader: {
        backgroundColor: '#e5e7eb',
        fontWeight: 'bold',
        padding: 8,
        flex: 1,
        textAlign: 'left',
        fontSize: 9,
        color: '#374151',
    },
    tableCell: {
        padding: 8,
        flex: 1,
        fontSize: 9,
        color: '#1f2937',
        textAlign: 'left',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        color: '#6b7280',
        fontSize: 8,
    },
    tag: {
        backgroundColor: '#e5e7eb',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
        fontSize: 8,
        fontWeight: 'bold',
    },
    positiveValue: {
        color: '#059669',
        fontWeight: 'bold',
    },
    negativeValue: {
        color: '#dc2626',
        fontWeight: 'bold',
    },
    filterInfo: {
        backgroundColor: '#dbeafe',
        padding: 8,
        borderRadius: 3,
        marginBottom: 15,
        fontSize: 9,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 10,
        marginTop: 15,
    },
});

export const PdfDebtorsMain = ({ 
    data, 
    totals, 
    filterActive, 
    summary 
}: { 
    data: ExcelRow[], 
    totals: any,
    filterActive: string | null,
    summary: any 
}) => (
    <Document>
        <Page size="LETTER" style={styles.page} orientation="landscape">
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Reporte de Deudores</Text>
                <Text style={styles.subtitle}>
                    Generado el: {new Date().toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>
            </View>

            {/* Información del filtro activo */}
            {filterActive && (
                <View style={styles.filterInfo}>
                    <Text>Filtro activo: {filterActive}</Text>
                </View>
            )}

            {/* Resumen de datos */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Total Registros</Text>
                    <Text style={styles.summaryValue}>{data.length}</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Importe Total</Text>
                    <Text style={styles.summaryValue}>${totals?.totalImporte?.toLocaleString() || '0'}</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Total Cobrado</Text>
                    <Text style={[styles.summaryValue, styles.positiveValue]}>
                        ${totals?.totalCobrado?.toLocaleString() || '0'}
                    </Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Total Deuda</Text>
                    <Text style={[styles.summaryValue, styles.negativeValue]}>
                        ${totals?.totalDeuda?.toLocaleString() || '0'}
                    </Text>
                </View>
            </View>

            {/* Resumen de etiquetas */}
            {summary && Object.keys(summary.resumen).length > 0 && (
                <>
                    <Text style={styles.sectionTitle}>Resumen de Etiquetas</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
                            <Text style={[styles.tableHeader, { flex: 2 }]}>Etiqueta</Text>
                            <Text style={styles.tableHeader}>Registros</Text>
                            <Text style={styles.tableHeader}>Total Deuda</Text>
                        </View>
                        {Object.entries(summary.resumen).map(([etiqueta, count], index) => (
                            <View 
                                key={etiqueta} 
                                style={[
                                    styles.tableRow,
                                    { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }
                                ]}
                            >
                                <Text style={[styles.tableCell, { flex: 2 }]}>{etiqueta}</Text>
                                <Text style={styles.tableCell}>{(count as number).toString()}</Text>
                                <Text style={[styles.tableCell, styles.negativeValue]}>
                                    ${summary.deudaPorEtiqueta[etiqueta]?.toLocaleString() || '0'}
                                </Text>
                            </View>
                        ))}
                    </View>
                </>
            )}

            {/* Tabla principal */}
            <Text style={styles.sectionTitle}>Registros de Excel ({data.length})</Text>
            <View style={styles.table}>
                {/* Encabezados */}
                <View style={[styles.tableRow, { backgroundColor: '#e5e7eb' }]}>
                    <Text style={[styles.tableHeader, { flex: 1.5 }]}>Etiqueta</Text>
                    <Text style={styles.tableHeader}>Fecha</Text>
                    <Text style={[styles.tableHeader, { flex: 2 }]}>Cliente</Text>
                    <Text style={styles.tableHeader}>Paciente</Text>
                    <Text style={styles.tableHeader}>Importe</Text>
                    <Text style={styles.tableHeader}>Cobrado</Text>
                    <Text style={styles.tableHeader}>Deuda</Text>
                </View>

                {/* Filas de datos */}
                {data.map((row, index) => (
                    <View 
                        key={row.id} 
                        style={[
                            styles.tableRow,
                            { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }
                        ]}
                    >
                        <Text style={[styles.tableCell, { flex: 1.5 }]}>
                            {row.etiqueta || '-'}
                        </Text>
                        <Text style={styles.tableCell}>
                            {row.fechaAlbaran || '-'}
                        </Text>
                        <Text style={[styles.tableCell, { flex: 2 }]}>
                            {row.clienteNombre || 'Sin nombre'}
                        </Text>
                        <Text style={styles.tableCell}>
                            {row.paciente || '-'}
                        </Text>
                        <Text style={styles.tableCell}>
                            ${row.totalImporte.toLocaleString()}
                        </Text>
                        <Text style={[styles.tableCell, styles.positiveValue]}>
                            ${row.cobradoLinea.toLocaleString()}
                        </Text>
                        <Text style={[styles.tableCell, styles.negativeValue]}>
                            ${row.deuda.toLocaleString()}
                        </Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);