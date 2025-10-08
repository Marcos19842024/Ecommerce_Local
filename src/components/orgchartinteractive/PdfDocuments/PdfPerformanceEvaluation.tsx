import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { EvaluationData } from '../../../interfaces/orgchartinteractive.interface';

// Estilos mejorados
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoContainer: {
        width: '20%',
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 50,
    },
    companyInfo: {
        width: '60%',
        alignItems: 'center',
    },
    companyTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    companySubtitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2,
        textAlign: 'center',
    },
    locationDate: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
        alignItems: 'center',
    },
    dateField: {
        width: 40,
        borderBottom: '1px solid black',
        textAlign: 'center',
        marginHorizontal: 2,
    },
    employeeInfo: {
        marginBottom: 15,
    },
    employeeRow: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
    },
    employeeLabel: {
        width: 150,
        fontWeight: 'bold',
    },
    instruction: {
        marginBottom: 10,
        fontSize: 9,
    },
    scaleLegend: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        padding: 8,
        backgroundColor: '#f0f0f0',
    },
    section: {
        marginBottom: 15,
        border: '1px solid black',
    },
    sectionHeader: {
        flexDirection: 'row',
        backgroundColor: '#dddddd',
        padding: 8,
        borderBottom: '1px solid black',
    },
    sectionTitle: {
        flex: 3,
        fontWeight: 'bold',
    },
    scaleHeader: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    criteriaRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #999',
        minHeight: 30,
    },
    criteriaText: {
        flex: 3,
        padding: 8,
        fontSize: 9,
        borderRight: '1px solid #999',
    },
    scaleCell: {
        flex: 1,
        borderRight: '1px solid #999',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        position: 'relative',
    },
    scaleCellLast: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        position: 'relative',
    },
    checkmark: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    decisionSection: {
        marginTop: 20,
        border: '1px solid black',
    },
    decisionRow: {
        flexDirection: 'row',
    },
    decisionOptions: {
        flex: 1,
        padding: 15,
        borderRight: '1px solid black',
    },
    decisionSignature: {
        flex: 1,
        padding: 15,
    },
    signatureLine: {
        borderBottom: '1px solid black',
        marginTop: 30,
        marginBottom: 5,
        paddingBottom: 4,
    },
    checkboxRow: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 10,
        height: 10,
        border: '1px solid black',
        marginRight: 5,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxText: {
        fontSize: 10,
    },
    checkmarkImage: {
        width: 8,
        height: 8,
        position: 'absolute',
        top: 0,
        left: 0,
        color: 'black',
        fontWeight: 'bold',
    },
});

interface PdfPerformanceEvaluationProps {
    data: EvaluationData;
}

const PdfPerformanceEvaluation: React.FC<PdfPerformanceEvaluationProps> = ({ data }) => {
    // Función para renderizar palomita
    const Checkmark = () => 
    <Text style={styles.checkmark}>
        <Image
            src="https://img.icons8.com/ios-filled/20/000000/checkmark--v1.png"
            style={styles.checkmarkImage}
        />
    </Text>;

    const renderEvaluationSection = (
        title: string,
        criteria: { field: string; label: string }[],
        sectionData: any
    ) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Text style={styles.scaleHeader}>NA</Text>
                <Text style={styles.scaleHeader}>S</Text>
                <Text style={styles.scaleHeader}>R</Text>
                <Text style={styles.scaleHeader}>B</Text>
                <Text style={styles.scaleHeader}>E</Text>
            </View>
        
            {criteria.map((criterion) => (
                <View key={criterion.field} style={styles.criteriaRow}>
                <Text style={styles.criteriaText}>{criterion.label}</Text>
                {[0, 1, 2, 3, 4].map((value, index) => (
                    <View key={value} style={index === 4 ? styles.scaleCellLast : styles.scaleCell}>
                    {sectionData && sectionData[criterion.field] === value && <Checkmark />}
                    </View>
                ))}
                </View>
            ))}
        </View>
    );

    const sections = [
        {
            title: "1. ACTITUD HACIA EL TRABAJO",
            data: data.actitudTrabajo,
            criteria: [
                { field: 'interesErrores', label: 'Interés por no cometer errores.' },
                { field: 'aprendizaje', label: 'Aprendizaje eficiente de sus funciones' },
                { field: 'seguimientoReglas', label: 'Seguimiento de reglas y procedimientos' },
                { field: 'sentidoUrgencia', label: 'Sentido de urgencia' }
            ]
        },
        {
            title: "2. COOPERACIÓN/INTEGRACIÓN",
            data: data.cooperacion,
            criteria: [
                { field: 'cooperacionSolicitada', label: 'Cooperación cuando se lo solicitan' },
                { field: 'cooperacionNoSolicitada', label: 'Cooperación cuando NO se lo solicitan' },
                { field: 'sugerencias', label: 'Sugerencias para la mejora continua' },
                { field: 'integracion', label: 'Integración con sus compañeros' }
            ]
        },
        {
            title: "3. CALIDAD EN EL TRABAJO",
            data: data.calidadTrabajo,
            criteria: [
                { field: 'calidadForma', label: 'Calidad de resultados (en forma)' },
                { field: 'calidadTiempo', label: 'Calidad de resultados (en tiempo)' },
                { field: 'adaptacion', label: 'Adaptación ante los cambios' },
                { field: 'dominio', label: 'Dominio de funciones' }
            ]
        },
        {
            title: "4. RELACIONES",
            data: data.relaciones,
            criteria: [
                { field: 'conCompaneros', label: 'Relaciones con sus compañeros' },
                { field: 'conSuperiores', label: 'Relaciones con sus superiores' },
                { field: 'conSubordinados', label: 'Relaciones con sus subordinados' },
                { field: 'conClientes', label: 'Relaciones con clientes/proveedores' }
            ]
        },
        {
            title: "5. ASISTENCIA Y PUNTUALIDAD",
            data: data.asistencia,
            criteria: [
                { field: 'asistencia', label: 'Asistencia laboral' },
                { field: 'puntualidad', label: 'Puntualidad de llegada' },
                { field: 'rotarTurno', label: 'Disponibilidad para rotar turno' },
                { field: 'guardias', label: 'Disponibilidad para guardias' }
            ]
        }
    ];

    return (
        <Document>
            {/* Página 1 */}
            <Page size="LETTER" style={styles.page}>
                {/* Encabezado con logo */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image
                            style={styles.logo}
                            src="./media/Logo Small.png"
                        />
                    </View>
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyTitle}>EVALUACIÓN PARA PERSONAL EN PERIODO DE PRUEBA</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                    <View style={styles.logoContainer} />
                </View>

                {/* Fecha y ubicación */}
                <View style={styles.locationDate}>
                    <Text>{data.ciudad}. A </Text>
                    <Text style={styles.dateField}>{data.fecha.dia}</Text>
                    <Text> días del mes </Text>
                    <Text style={styles.dateField}>{data.fecha.mes}</Text>
                    <Text> de </Text>
                    <Text style={styles.dateField}>{data.fecha.año}</Text>
                </View>

                {/* Información del trabajador */}
                <View style={styles.employeeInfo}>
                    <View style={styles.employeeRow}>
                        <Text style={styles.employeeLabel}>Nombre del trabajador:</Text>
                        <Text>{data.nombreTrabajador}</Text>
                    </View>
                    <View style={styles.employeeRow}>
                        <Text style={styles.employeeLabel}>Área:</Text>
                        <Text>{data.area}</Text>
                        <Text style={[styles.employeeLabel, {marginLeft: 20}]}>Puesto:</Text>
                        <Text>{data.puesto}</Text>
                    </View>
                </View>

                <Text style={styles.instruction}>
                INSTRUCCIÓN: Por favor evalúe los siguientes aspectos de acuerdo con la siguiente escala:
                </Text>

                <View style={styles.scaleLegend}>
                    <Text>NA - No aplica</Text>
                    <Text>S - Suficiente</Text>
                    <Text>R - Regular</Text>
                    <Text>B - Bueno</Text>
                    <Text>E - Excelente</Text>
                </View>

                {/* Secciones de evaluación */}
                {sections.slice(0, 3).map((section) => 
                    renderEvaluationSection(section.title, section.criteria, section.data)
                )}
            </Page>

            {/* Página 2 */}
            <Page size="LETTER" style={styles.page}>
                {/* Encabezado con logo */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image
                            style={styles.logo}
                            src="./media/Logo Small.png"
                        />
                    </View>
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyTitle}>EVALUACIÓN PARA PERSONAL EN PERIODO DE PRUEBA</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                    <View style={styles.logoContainer} />
                </View>

                {/* Últimas 2 secciones */}
                {sections.slice(3).map((section) => 
                    renderEvaluationSection(section.title, section.criteria, section.data)
                )}

                {/* Decisión del contrato */}
                <View style={styles.decisionSection}>
                    <View style={styles.decisionRow}>
                        <View style={styles.decisionOptions}>
                            <Text>Por lo anterior el contrato:</Text>
                            <View style={{marginTop: 10}}>
                                <View style={styles.checkboxRow}>
                                    <View style={styles.checkbox}>
                                        {data.decisionContrato === 'prorroga' && 
                                            <Image
                                                src="https://img.icons8.com/ios-filled/20/000000/checkmark--v1.png"
                                                style={styles.checkmarkImage}
                                            />
                                        }
                                    </View>
                                    <Text style={styles.checkboxText}>Se prorroga por un mes</Text>
                                </View>
                                <View style={styles.checkboxRow}>
                                    <View style={styles.checkbox}>
                                        {data.decisionContrato === 'indefinido' && 
                                            <Image
                                                src="https://img.icons8.com/ios-filled/20/000000/checkmark--v1.png"
                                                style={styles.checkmarkImage}
                                            />
                                        }
                                    </View>
                                    <Text style={styles.checkboxText}>Se otorga por tiempo indefinido</Text>
                                </View>
                                <View style={styles.checkboxRow}>
                                    <View style={styles.checkbox}>
                                        {data.decisionContrato === 'termina' && 
                                            <Image
                                                src="https://img.icons8.com/ios-filled/20/000000/checkmark--v1.png"
                                                style={styles.checkmarkImage}
                                            />
                                        }
                                    </View>
                                    <Text style={styles.checkboxText}>Se termina</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.decisionSignature}>
                            <Text style={styles.signatureLine}>{data.nombreEvaluador}</Text>
                            <Text>Nombre y Firma del evaluador</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default PdfPerformanceEvaluation;