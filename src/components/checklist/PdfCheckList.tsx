import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ChecklistData } from '../../interfaces/checklist.interface';

// Registrar fuentes (opcional, pero mejora la apariencia)
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    ],
});

// Estilos para el PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 5,
        paddingBottom: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#0195a8ff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 5,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        backgroundColor: '#f3f4f6',
        padding: 5,
        borderRadius: 5,
    },
    infoColumn: {
        flexDirection: 'column',
        width: '48%',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    infoLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#374151',
        width: '40%',
    },
    infoValue: {
        fontSize: 10,
        color: '#111827',
        width: '60%',
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: '#0195a8ff',
        color: '#FFFFFF',
        padding: 8,
        marginBottom: 8,
        textAlign: 'center',
    },
    table: {
        Display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginBottom: 10,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '37%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: '#e5e7eb',
        padding: 3,
    },
    tableColHeaderMiddle: {
        width: '26%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: '#e5e7eb',
        padding: 3,
    },
    tableCol: {
        width: '37%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
    },
    tableColMiddle: {
        width: '26%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
    },
    tableCellHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableCell: {
        fontSize: 8,
        textAlign: 'left',
    },
    cumplimientoBadge: {
        padding: 2,
        borderRadius: 3,
        textAlign: 'center',
        fontSize: 7,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        flexWrap: 'wrap',
    },
    statCard: {
        width: '30%',
        backgroundColor: '#f8fafc',
        border: '1pt solid #e2e8f0',
        borderRadius: 5,
        padding: 5,
        marginBottom: 5,
    },
    statTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#374151',
        textAlign: 'center',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 9,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#0195a8ff',
    },
    commentsSection: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#fef3c7',
        border: '1pt solid #f59e0b',
        borderRadius: 5,
    },
    commentsTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#92400e',
        marginBottom: 5,
    },
    commentsText: {
        fontSize: 8,
        color: '#78350f',
        lineHeight: 1.3,
    },
    signature: {
        width: '45%',
        alignItems: 'center',
    },
    signatureLine: {
        width: '100%',
        borderTop: '1pt solid #000',
        marginTop: 20,
        marginBottom: 5,
    },
    signatureText: {
        fontSize: 9,
        color: '#374151',
    },
    pageNumber: {
        position: 'absolute',
        bottom: 15,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 8,
        color: '#6b7280',
    },
});

interface PdfChecklistProps {
    data: ChecklistData;
}

// Función para obtener el color según el cumplimiento
const getCumplimientoColor = (cumplimiento: string) => {
    switch (cumplimiento) {
        case 'bueno': return '#10b981';
        case 'regular': return '#f59e0b';
        case 'malo': return '#ef4444';
        default: return '#6b7280';
    }
};

// Función para formatear la fecha
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const PdfChecklist: React.FC<PdfChecklistProps> = ({ data }) => {
    // Agrupar items por área
    const itemsByArea = data.items.reduce((acc, item) => {
        if (!acc[item.area]) {
            acc[item.area] = [];
        }
        acc[item.area].push(item);
        return acc;
    }, {} as Record<string, typeof data.items>);

    // Calcular estadísticas
    const getAreaStats = (area: string) => {
        const areaItems = itemsByArea[area];
        const total = areaItems.length;
        const bueno = areaItems.filter(item => item.cumplimiento === 'bueno').length;
        const regular = areaItems.filter(item => item.cumplimiento === 'regular').length;
        const malo = areaItems.filter(item => item.cumplimiento === 'malo').length;
        
        return { total, bueno, regular, malo };
    };

    // Estadísticas generales - CORREGIDO: solo las necesarias
    const totalEvaluado = data.items.filter(item => item.cumplimiento !== '').length;
    const porcentajeCompletado = (totalEvaluado / data.items.length) * 100;

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Checklist General de Supervisión</Text>
                
                    {/* Información general */}
                    <View style={styles.infoContainer}>
                        <View style={styles.infoColumn}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Fecha:</Text>
                                <Text style={styles.infoValue}>{formatDate(data.fecha)}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Hora de Inicio:</Text>
                                <Text style={styles.infoValue}>{data.horaInicio} hrs.</Text>
                            </View>
                        </View>
                        <View style={styles.infoColumn}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Responsable:</Text>
                                <Text style={styles.infoValue}>{data.responsable}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Hora de Fin:</Text>
                                <Text style={styles.infoValue}>{data.horaFin} hrs.</Text>
                            </View>
                        </View>
                    </View>

                    {/* Estadísticas generales - CORREGIDO */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statTitle}>Total Evaluado</Text>
                            <Text style={styles.statValue}>
                                {totalEvaluado} / {data.items.length}
                            </Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statTitle}>Porcentaje</Text>
                            <Text style={styles.statValue}>
                                {porcentajeCompletado.toFixed(1)}%
                            </Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statTitle}>Calificación</Text>
                            <Text style={[styles.statValue, { color: 
                                porcentajeCompletado >= 80 ? '#10b981' :
                                porcentajeCompletado >= 60 ? '#f59e0b' : '#ef4444'
                            }]}>
                                {porcentajeCompletado >= 80 ? 'EXCELENTE' :
                                porcentajeCompletado >= 60 ? 'ACEPTABLE' : 'REQUIERE MEJORA'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Detalle por áreas */}
                {Object.entries(itemsByArea).map(([area, items]) => {
                    const stats = getAreaStats(area);
                    const areaProgress = ((stats.bueno + stats.regular + stats.malo) / stats.total) * 100;

                    return (
                        <View key={area} style={styles.section} break={area !== 'ESTACIONAMIENTO'}>
                            <Text style={styles.sectionTitle}>
                                {area} - {stats.bueno + stats.regular + stats.malo}/{stats.total} ({areaProgress.toFixed(0)}%)
                            </Text>
                        
                            <View style={styles.table}>
                                {/* Header de la tabla */}
                                <View style={styles.tableRow}>
                                    <View style={styles.tableColHeader}>
                                        <Text style={styles.tableCellHeader}>Aspecto a Evaluar</Text>
                                    </View>
                                    <View style={styles.tableColHeaderMiddle}>
                                        <Text style={styles.tableCellHeader}>Cumplimiento</Text>
                                    </View>
                                    <View style={styles.tableColHeader}>
                                        <Text style={styles.tableCellHeader}>Observaciones</Text>
                                    </View>
                                </View>

                                {/* Filas de datos */}
                                {items.map((item, index) => (
                                    <View key={index} style={styles.tableRow}>
                                        <View style={styles.tableCol}>
                                            <Text style={styles.tableCell}>
                                                {item.aspecto}
                                            </Text>
                                        </View>
                                        <View style={styles.tableColMiddle}>
                                            <Text style={[
                                                styles.cumplimientoBadge,
                                                { 
                                                    backgroundColor: getCumplimientoColor(item.cumplimiento) + '20',
                                                    color: getCumplimientoColor(item.cumplimiento)
                                                }
                                            ]}>
                                                {item.cumplimiento ? item.cumplimiento.toUpperCase() : 'PENDIENTE'}
                                            </Text>
                                        </View>
                                        <View style={styles.tableCol}>
                                            {item.observaciones && (
                                                <Text style={{ color: '#6b7280', fontSize: 6 }}>
                                                    {item.observaciones ? item.observaciones.toUpperCase() : 'N/A'}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>

                            {/* Estadísticas del área */}
                            <View style={styles.statsContainer}>
                                <View style={styles.statCard}>
                                    <Text style={[styles.statTitle, { color: '#10b981' }]}>Bueno</Text>
                                    <Text style={[styles.statValue, { color: '#10b981' }]}>{stats.bueno}</Text>
                                </View>
                                <View style={styles.statCard}>
                                    <Text style={[styles.statTitle, { color: '#f59e0b' }]}>Regular</Text>
                                    <Text style={[styles.statValue, { color: '#f59e0b' }]}>{stats.regular}</Text>
                                </View>
                                <View style={styles.statCard}>
                                    <Text style={[styles.statTitle, { color: '#ef4444' }]}>Malo</Text>
                                    <Text style={[styles.statValue, { color: '#ef4444' }]}>{stats.malo}</Text>
                                </View>
                            </View>
                        </View>
                    );
                })}

                {/* Comentarios Adicionales */}
                {data.comentariosAdicionales && (
                    <View style={styles.commentsSection}>
                        <Text style={styles.commentsTitle}>Comentarios Adicionales:</Text>
                        <Text style={styles.commentsText}>{data.comentariosAdicionales}</Text>
                    </View>
                )}

                {/* Número de página */}
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => 
                    `Página ${pageNumber} de ${totalPages}`
                } fixed />
            </Page>
        </Document>
    );
};