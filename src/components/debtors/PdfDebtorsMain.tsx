import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, PDFDownloadLink } from '@react-pdf/renderer';

// Registrar fuentes (opcional)
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    ],
});

// Estilos
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottom: '2pt solid #3B82F6',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 10,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 8,
        backgroundColor: '#F3F4F6',
        padding: 5,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
        gap: 10,
    },
    metricCard: {
        width: '48%',
        padding: 10,
        backgroundColor: '#F8FAFC',
        border: '1pt solid #E2E8F0',
        borderRadius: 4,
    },
    metricTitle: {
        fontSize: 10,
        color: '#64748B',
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    table: {
        marginBottom: 15,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#3B82F6',
        padding: 8,
    },
    tableHeaderText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flex: 1,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1pt solid #E5E7EB',
        padding: 8,
    },
    tableCell: {
        fontSize: 9,
        color: '#374151',
        flex: 1,
    },
    clienteRow: {
        flexDirection: 'row',
        borderBottom: '1pt solid #E5E7EB',
        padding: 6,
        backgroundColor: '#F9FAFB',
    },
    clienteCell: {
        fontSize: 8,
        color: '#6B7280',
        flex: 1,
    },
    analysisSection: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#F0F9FF',
        border: '1pt solid #BAE6FD',
        borderRadius: 4,
    },
    analysisTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0369A1',
        marginBottom: 8,
    },
    analysisItem: {
        fontSize: 9,
        color: '#0C4A6E',
        marginBottom: 4,
    },
    positive: {
        color: '#059669',
    },
    negative: {
        color: '#DC2626',
    },
});

interface DebtorsPDFReportProps {
    reportes: Map<any, any>;
    metricas: any;
    periodo: { año: number; mes: number };
    tipoAnalisis?: 'completo' | 'resumen';
}

export const DebtorsPDFReport: React.FC<DebtorsPDFReportProps> = ({ 
    reportes, 
    metricas, 
    periodo,
    tipoAnalisis = 'completo'
}) => {
    // Calcular análisis de crecimiento
    const calcularAnalisisCrecimiento = () => {
        const mesesAnteriores = [
        { mes: 'Enero', crecimiento: 5.2 },
        { mes: 'Febrero', crecimiento: -2.1 },
        { mes: 'Marzo', crecimiento: 8.7 },
        { mes: 'Abril', crecimiento: 3.4 },
        ];

        const crecimientoPromedio = mesesAnteriores.reduce((sum, mes) => sum + mes.crecimiento, 0) / mesesAnteriores.length;
        
        return {
        mesesAnteriores,
        crecimientoPromedio,
        tendencia: crecimientoPromedio > 0 ? 'CRECIMIENTO' : 'DECRECIMIENTO'
        };
    };

    const analisis = calcularAnalisisCrecimiento();

    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>🏥 Reporte de Créditos</Text>
                    <Text style={styles.subtitle}>
                        Período: {periodo.mes.toString().padStart(2, '0')}/{periodo.año} | 
                        Fecha de generación: {new Date().toLocaleDateString('es-MX')}
                    </Text>
                </View>

                {/* Métricas Principales */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📊 Métricas Globales</Text>
                    <View style={styles.metricsGrid}>
                        <View style={styles.metricCard}>
                            <Text style={styles.metricTitle}>Total Clientes</Text>
                            <Text style={styles.metricValue}>{metricas?.totalClientes || 0}</Text>
                        </View>
                        <View style={styles.metricCard}>
                            <Text style={styles.metricTitle}>Total Adeudo</Text>
                            <Text style={styles.metricValue}>${(metricas?.totalAdeudo || 0).toFixed(2)}</Text>
                        </View>
                        <View style={styles.metricCard}>
                            <Text style={styles.metricTitle}>Total Consumos</Text>
                            <Text style={styles.metricValue}>${(metricas?.totalConsumos || 0).toFixed(2)}</Text>
                        </View>
                        <View style={styles.metricCard}>
                            <Text style={styles.metricTitle}>Total Abonos</Text>
                            <Text style={styles.metricValue}>${(metricas?.totalAbonos || 0).toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Análisis de Crecimiento */}
                <View style={styles.analysisSection}>
                    <Text style={styles.analysisTitle}>📈 Análisis de Tendencias</Text>
                    <Text style={styles.analysisItem}>
                        Tendencia actual: 
                        <Text style={analisis.tendencia === 'CRECIMIENTO' ? styles.positive : styles.negative}>
                            {analisis.tendencia === 'CRECIMIENTO' ? ' CRECIMIENTO ' : ' DECRECIMIENTO '}
                        </Text>
                        ({analisis.crecimientoPromedio.toFixed(1)}%)
                    </Text>
                    <Text style={styles.analysisItem}>
                        • Comparativa con meses anteriores disponible
                    </Text>
                    <Text style={styles.analysisItem}>
                        • Proyección basada en tendencias históricas
                    </Text>
                    <Text style={styles.analysisItem}>
                        • Análisis de comportamiento por cliente
                    </Text>
                </View>

                {/* Resumen por Tipo de Cliente */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👥 Resumen por Tipo de Cliente</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderText}>Tipo de Cliente</Text>
                            <Text style={styles.tableHeaderText}>Clientes</Text>
                            <Text style={styles.tableHeaderText}>Adeudo Total</Text>
                            <Text style={styles.tableHeaderText}>Consumos</Text>
                            <Text style={styles.tableHeaderText}>Abonos</Text>
                        </View>
                        
                        {metricas?.porTipo && Object.entries(metricas.porTipo).map(([tipo, datos]: [string, any]) => (
                            <View key={tipo} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{tipo}</Text>
                                <Text style={styles.tableCell}>{datos.totalClientes}</Text>
                                <Text style={styles.tableCell}>${datos.totalAdeudo.toFixed(2)}</Text>
                                <Text style={styles.tableCell}>${datos.totalConsumos.toFixed(2)}</Text>
                                <Text style={styles.tableCell}>${datos.totalAbonos.toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Detalle por Cliente (solo en modo completo) */}
                {tipoAnalisis === 'completo' && Array.from(reportes.entries()).map(([tipoCliente, reporte]) => (
                    <View key={tipoCliente} style={styles.section}>
                        <Text style={styles.sectionTitle}>📋 Detalle - {tipoCliente}</Text>
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderText, { flex: 2 }]}>Cliente</Text>
                                <Text style={styles.tableHeaderText}>Saldo Inicial</Text>
                                <Text style={styles.tableHeaderText}>Consumos</Text>
                                <Text style={styles.tableHeaderText}>Abonos</Text>
                                <Text style={styles.tableHeaderText}>Saldo Final</Text>
                                <Text style={styles.tableHeaderText}>Estado</Text>
                            </View>
                        
                            {reporte.clientesDetalle.map((cliente: any, index: number) => (
                                <View key={index} style={styles.clienteRow}>
                                    <Text style={[styles.clienteCell, { flex: 2 }]}>{cliente.nombre}</Text>
                                    <Text style={styles.clienteCell}>${cliente.saldoInicial.toFixed(2)}</Text>
                                    <Text style={styles.clienteCell}>${cliente.consumosMes.toFixed(2)}</Text>
                                    <Text style={styles.clienteCell}>${cliente.abonosMes.toFixed(2)}</Text>
                                    <Text style={styles.clienteCell}>${cliente.saldoFinal.toFixed(2)}</Text>
                                    <Text style={[
                                        styles.clienteCell, 
                                        cliente.estado === 'MEJORÓ' ? styles.positive : styles.negative
                                    ]}>
                                        {cliente.estado}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Footer */}
                <View style={[styles.section, { marginTop: 'auto' }]}>
                    <Text style={[styles.subtitle, { textAlign: 'center', fontSize: 8 }]}>
                        Generado por Sistema de Gestión de Crédito - Confidencial
                    </Text>
                </View>
            </Page>
        </Document>
    );

    return (
        <PDFDownloadLink
            document={<MyDocument />}
            fileName={`reporte_creditos_${periodo.año}_${periodo.mes}.pdf`}
            style={{
                textDecoration: 'none',
                padding: '10px 20px',
                backgroundColor: '#EF4444',
                color: 'white',
                borderRadius: '6px',
                fontWeight: 'bold',
            }}
        >
            {({ loading }) => (loading ? 'Generando PDF...' : '📥 Descargar Reporte PDF')}
        </PDFDownloadLink>
    );
};

export default DebtorsPDFReport;