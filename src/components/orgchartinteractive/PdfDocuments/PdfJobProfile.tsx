import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { JobProfileData } from '../../../interfaces/orgchartinteractive.interface';

// Estilos exactos para coincidir con el documento de muestra
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 35,
        paddingVertical: 15,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        borderBottomStyle: 'solid',
        paddingBottom: 5,
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
        paddingTop: 10,
    },
    companyTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 1,
        textTransform: 'uppercase',
    },
    dateContainer: {
        width: '30%',
        alignItems: 'center',
        paddingTop: 10,
    },
    companySubtitle: {
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 1,
        color: '#333333',
    },
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    table: {
        Display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginBottom: 8,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    // Para tabla de información general (6 columnas)
    tableColInfo16: {
        width: '16.66%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 9,
    },
    tableColHeaderInfo16: {
        width: '16.66%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        backgroundColor: '#dfdfdfff',
        fontWeight: 'bold',
        fontSize: 9,
    },
    // Para tabla de requisitos (4 columnas)
    tableColReq25: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 9,
    },
    tableColHeaderReq25: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        backgroundColor: '#dfdfdfff',
        fontWeight: 'bold',
        fontSize: 9,
    },
    tableColReq5: {
        width: '5%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 9,
    },
    tableColHeaderReq5: {
        width: '5%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        backgroundColor: '#dfdfdfff',
        fontWeight: 'bold',
        fontSize: 9,
    },
    // Para tabla de funciones específicas (3 columnas)
    tableColFunc70: {
        width: '70%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 8,
    },
    tableColHeaderFunc70: {
        width: '70%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        backgroundColor: '#f8f8f8',
        fontWeight: 'bold',
        fontSize: 9,
        textAlign: 'center'
    },
    tableColFunc15: {
        width: '15%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 8,
    },
    tableColHeaderFunc15: {
        width: '15%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        backgroundColor: '#f8f8f8',
        fontWeight: 'bold',
        fontSize: 9,
        textAlign: 'center'
    },
    // Para tabla de conocimientos (5 columnas)
    tableColKnow40: {
        width: '40%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 8,
    },
    tableColKnow15: {
        width: '15%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 9,
        textAlign: 'center',
    },
    tableColHeaderKnow40: {
        width: '40%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        backgroundColor: '#f8f8f8',
        fontWeight: 'bold',
        fontSize: 9,
    },
    tableColHeaderKnow15: {
        width: '15%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        backgroundColor: '#f8f8f8',
        fontWeight: 'bold',
        fontSize: 9,
        textAlign: 'center',
    },
    // Para tabla de competencias (4 columnas)
    tableColComp60: {
        width: '60%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 9,
    },
    tableColComp13: {
        width: '13.33%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 9,
        textAlign: 'center',
    },
    tableColHeaderComp60: {
        width: '60%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        backgroundColor: '#f8f8f8',
        fontWeight: 'bold',
        fontSize: 9,
    },
    tableColHeaderComp13: {
        width: '13.33%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        backgroundColor: '#f8f8f8',
        fontWeight: 'bold',
        fontSize: 9,
        textAlign: 'center',
    },
    bold: {
        fontWeight: 'bold',
    },
    italic: {
        fontStyle: 'italic',
        fontSize: 8,
    }
});

// Datos de periodicidad e indicadores predefinidos según el documento
const periodicidadData = [
  { periodicidad: 'Diario', indicador: 'Plantilla completa' },
  { periodicidad: 'Diario', indicador: "SS's" },
  { periodicidad: 'Diario', indicador: 'Logro de Objetivo Mensual' },
  { periodicidad: 'Siempre', indicador: 'Ambiente laboral' },
  { periodicidad: 'Mensual', indicador: 'Logro de Objetivo Mensual' },
  { periodicidad: 'Siempre', indicador: 'Satisfacción del cliente' },
  { periodicidad: 'Mensual', indicador: 'Logro de Objetivo Mensual' },
  { periodicidad: 'Semanal', indicador: 'Satisfacción del cliente' },
  { periodicidad: 'Diario', indicador: 'Logro de Objetivo Mensual' },
  { periodicidad: 'Diario', indicador: 'Logro de Objetivo Mensual' },
  { periodicidad: 'Diario', indicador: 'Logro de Objetivo Mensual' },
  { periodicidad: 'Diario', indicador: 'Logro de Objetivo Mensual' },
];

// Componente del documento PDF
export const PdfJobProfile: React.FC<{ data: JobProfileData }> = ({ data }) => (
    <Document>
        {/* Página 1 */}
        <Page size="LETTER" style={styles.page}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        src="./media/Logo Small.png"
                    />
                </View>
                <View style={styles.companyInfo}>
                    <Text style={styles.companyTitle}>PERFIL DE PUESTO</Text>
                    <Text style={styles.companySubtitle}>{data.generalInfo.department}</Text>
                </View>
                <View style={styles.dateContainer}>
                    <Text style={styles.companySubtitle}>Fecha de revisión:</Text>
                    <Text style={styles.companySubtitle}>Julio 2025</Text>
                </View>
            </View>

            {/* Información General */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>1. Información general</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderInfo16}><Text>Puesto</Text></View>
                        <View style={styles.tableColInfo16}><Text>Coordinador Administrativo</Text></View>
                        <View style={styles.tableColHeaderInfo16}><Text>No. Posiciones</Text></View>
                        <View style={styles.tableColInfo16}><Text>1</Text></View>
                        <View style={styles.tableColHeaderInfo16}><Text>Ubicación</Text></View>
                        <View style={styles.tableColInfo16}><Text>Campeche, Camp.</Text></View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderInfo16}><Text>Departamento</Text></View>
                        <View style={styles.tableColInfo16}><Text>Administración</Text></View>
                        <View style={styles.tableColHeaderInfo16}><Text>Reporta a:</Text></View>
                        <View style={styles.tableColInfo16}><Text>Director General</Text></View>
                        <View style={styles.tableColHeaderInfo16}><Text>Horario</Text></View>
                        <View style={styles.tableColInfo16}><Text>Lunes a Sábado de 12:00 a 20:00 horas</Text></View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderReq25}><Text>Capacidad Física</Text></View>
                        <View style={styles.tableColReq25}><Text>No</Text></View>
                        <View style={styles.tableColHeaderReq25}><Text>Mental</Text></View>
                        <View style={styles.tableColReq25}><Text>Si</Text></View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderReq25}><Text>Objetivo</Text></View>
                        <View style={[styles.tableColReq25, {width: '75%'}]}>
                            <Text>
                                Garantizar que todas las actividades administrativas se desarrollen de manera
                                eficiente y sin interrupciones. Su visión estratégica y capacidad de ejecución
                                apoyan a que los recursos de la empresa se utilicen de manera óptima, asegurando
                                la salud animal y el Servicio al Cliente, enfocado en el cumplimiento del presupuesto,
                                logro de los objetivos y con los más altos estándares de calidad.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Requisitos del Puesto */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>2. Requisitos del puesto</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderReq25}><Text>Educación</Text></View>
                        <View style={styles.tableColReq25}><Text>Lic. en Administración o carrera afín.</Text></View>
                        <View style={styles.tableColHeaderReq25}><Text>Grado</Text></View>
                        <View style={styles.tableColReq25}><Text>Pasante o Titulado</Text></View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderReq25}><Text>Experiencia</Text></View>
                        <View style={[styles.tableColReq25, {width: '75%'}]}>
                            <Text>Experiencia laboral al menos 3 años en puestos similares o en gestión administrativa, capacidad de organización y comunicación.</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Responsabilidades Clave */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>3. Responsabilidades clave del puesto</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderReq5}>
                            <Text style={styles.bold}>1.</Text>
                        </View>
                        <View style={[styles.tableColReq5, {width: '95%'}]}>
                            <Text>Planificar, coordinar y realizar seguimiento a la gestión de los recursos humanos y financieros del área para alcanzar los objetivos e identificar oportunidades de mejora en procesos y actividades del área.</Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderReq5}>
                            <Text style={styles.bold}>2.</Text>
                        </View>
                        <View style={[styles.tableColReq5, {width: '95%'}]}>
                            <Text>Mantener el buen ambiente de trabajo y la comunicación abierta y cordial entre todo el personal.</Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderReq5}>
                            <Text style={styles.bold}>3.</Text>
                        </View>
                        <View style={[styles.tableColReq5, {width: '95%'}]}>
                            <Text>Asegurar el cumplimiento de los procedimientos y políticas establecidas por la empresa.</Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderReq5}>
                            <Text style={styles.bold}>4.</Text>
                        </View>
                        <View style={[styles.tableColReq5, {width: '95%'}]}>
                            <Text>Planificar y realizar seguimiento a la gestión de los recursos humanos y financieros del área para alcanzar los objetivos.</Text>
                        </View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderReq5}>
                            <Text style={styles.bold}>5.</Text>
                        </View>
                        <View style={[styles.tableColReq5, {width: '95%'}]}>
                            <Text>Colaborar con otros departamentos para asegurar un flujo eficiente de la información.</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Responsabilidades y Funciones Específicas - Primera parte */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>4. Responsabilidades y funciones específicas</Text>
                <Text style={styles.italic}>*El orden implica un nivel de importancia para el desempeño exitoso del trabajo.</Text>
                
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderFunc70}><Text>Funciones y Actividades</Text></View>
                        <View style={styles.tableColHeaderFunc15}>
                            <Text>Periodicidad</Text>
                            <Text style={styles.italic}>(diario, semanal,</Text>
                            <Text style={styles.italic}>mensual, siempre)</Text>
                        </View>
                        <View style={styles.tableColHeaderFunc15}>
                            <Text>Indicador</Text>
                            <Text>a Evaluar</Text>
                        </View>
                    </View>
                
                    {/* Primera página - primeras 7 funciones */}
                    {data.specificFunctions.slice(0, 7).map((func, index) => (
                        <View key={func.id} style={styles.tableRow}>
                            <View style={styles.tableColFunc70}>
                                <Text>{String.fromCharCode(97 + index)}) {func.description}</Text>
                            </View>
                            <View style={styles.tableColFunc15}>
                                <Text>{periodicidadData[index]?.periodicidad}</Text>
                            </View>
                            <View style={styles.tableColFunc15}>
                                <Text>{periodicidadData[index]?.indicador}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </Page>

        {/* Página 2 */}
        <Page size="LETTER" style={styles.page}>
        {/* Logo */}
        <View style={styles.logoContainer}>
            <Image 
            src="/logo.png"
            style={styles.logo}
            />
        </View>

        <View style={styles.header}>
            <View >
            <Text>Código:</Text>
            <Text>Fecha de revisión: Julio 2025</Text>
            </View>
        </View>

        {/* Continuación de Funciones Específicas */}
        <View style={styles.section}>
            <View style={styles.table}>
            {/* Continuación de la tabla desde la función h) */}
            {data.specificFunctions.slice(7).map((func, index) => (
                <View key={func.id} style={styles.tableRow}>
                <View style={styles.tableColFunc15}>
                    <Text>{String.fromCharCode(97 + 7 + index)}) {func.description}</Text>
                </View>
                <View style={styles.tableColFunc15}>
                    <Text>{periodicidadData[7 + index]?.periodicidad}</Text>
                </View>
                <View style={styles.tableColFunc15}>
                    <Text>{periodicidadData[7 + index]?.indicador}</Text>
                </View>
                </View>
            ))}
            </View>
        </View>

        {/* Conocimientos, Habilidades y Destrezas */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Conocimientos. habilidades y destrezas</Text>
            <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={styles.tableColHeaderKnow40}><Text>Conocimientos, habilidades y destrezas</Text></View>
                <View style={styles.tableColHeaderKnow15}><Text>Básico</Text></View>
                <View style={styles.tableColHeaderKnow15}><Text>Competente</Text></View>
                <View style={styles.tableColHeaderKnow15}><Text>Experto</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColKnow40}><Text>a) Analítico para la resolución de problemas y conflictos</Text></View>
                <View style={styles.tableColKnow15}><Text></Text></View>
                <View style={styles.tableColKnow15}><Text></Text></View>
                <View style={styles.tableColKnow15}><Text>X</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColKnow40}><Text>b) Conocimiento y habilidad en manejo de personal.</Text></View>
                <View style={styles.tableColKnow15}><Text></Text></View>
                <View style={styles.tableColKnow15}><Text>X</Text></View>
                <View style={styles.tableColKnow15}><Text></Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColKnow40}><Text>c) Normas de inocuidad, sanitización y seguridad laboral.</Text></View>
                <View style={styles.tableColKnow15}><Text>X</Text></View>
                <View style={styles.tableColKnow15}><Text></Text></View>
                <View style={styles.tableColKnow15}><Text></Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColKnow40}><Text>d) Reglamento interno de Bienestar Animal (RIBA)</Text></View>
                <View style={styles.tableColKnow15}><Text></Text></View>
                <View style={styles.tableColKnow15}><Text>X</Text></View>
                <View style={styles.tableColKnow15}><Text></Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColKnow40}><Text>e) Manejo de Excel y PP</Text></View>
                <View style={styles.tableColKnow15}><Text>X</Text></View>
                <View style={styles.tableColKnow15}><Text></Text></View>
                <View style={styles.tableColKnow15}><Text></Text></View>
            </View>
            </View>
        </View>

        {/* Habilidades y Competencias */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Habilidades y competencias</Text>
            <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={styles.tableColHeaderComp60}><Text>Nivel de competencia</Text></View>
                <View style={styles.tableColHeaderComp13}><Text>Básico</Text></View>
                <View style={styles.tableColHeaderComp13}><Text>Competente</Text></View>
                <View style={styles.tableColHeaderComp13}><Text>Experto</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColComp60}><Text>1. Optimización en los procesos de trabajo</Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
                <View style={styles.tableColComp13}><Text>X</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColComp60}><Text>2. Trabajo en equipo</Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
                <View style={styles.tableColComp13}><Text>X</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColComp60}><Text>3. Toma de decisiones</Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
                <View style={styles.tableColComp13}><Text>X</Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColComp60}><Text>4. Solución de problemas y manejo de conflictos</Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
                <View style={styles.tableColComp13}><Text>X</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColComp60}><Text>5. Trabajo bajo presión</Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
                <View style={styles.tableColComp13}><Text>X</Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColComp60}><Text>6. Coordinación de labores con las otras áreas</Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
                <View style={styles.tableColComp13}><Text>X</Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColComp60}><Text>7. Comunicación efectiva</Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
                <View style={styles.tableColComp13}><Text>X</Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColComp60}><Text>8. Liderazgo</Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
                <View style={styles.tableColComp13}><Text>X</Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColComp60}><Text>9. Interacción y empatía con el cliente</Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
                <View style={styles.tableColComp13}><Text></Text></View>
                <View style={styles.tableColComp13}><Text>X</Text></View>
            </View>
            </View>
        </View>
        </Page>

        {/* Página 3 */}
        <Page size="A4" style={styles.page}>
        {/* Logo */}
        <View style={styles.logoContainer}>
            <Image 
            src="/logo.png"
            style={styles.logo}
            />
        </View>

        <View style={styles.header}>
            <View>
            <Text>Código:</Text>
            <Text>Fecha de revisión: Julio 2025</Text>
            </View>
        </View>

        {/* Cambios en los registros históricos */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Cambios en los registros históricos</Text>
            <View style={styles.table}>
            <View style={styles.tableRow}>
                <View style={styles.tableColHeaderFunc15}><Text>Revisión</Text></View>
                <View style={styles.tableColHeaderFunc15}><Text>Cambios</Text></View>
                <View style={styles.tableColHeaderFunc15}><Text>Fecha (mes, año)</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColFunc15}><Text>0</Text></View>
                <View style={styles.tableColFunc15}><Text>Nueva Creación</Text></View>
                <View style={styles.tableColFunc15}><Text>Julio, 2025</Text></View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tableColFunc15}><Text></Text></View>
                <View style={styles.tableColFunc15}><Text></Text></View>
                <View style={styles.tableColFunc15}><Text></Text></View>
            </View>
            </View>
        </View>
        </Page>
  </Document>
);