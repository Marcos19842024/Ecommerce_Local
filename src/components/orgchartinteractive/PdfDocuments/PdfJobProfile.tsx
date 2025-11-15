import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { JobProfileData } from '../../../interfaces/orgchartinteractive.interface';

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
    // Primera línea: Puesto(16.66%) | Valor(16.66%) | Posiciones(16.66%) | Valor(16.66%) | Ubicación(16.66%) | Valor(16.66%)
    tableColHeader16: {
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
    tableColValue16: {
        width: '16.66%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 9,
    },
    // Segunda línea: Departamento(33.33%) | Valor(33.33%) | Reporta a:(16.66%) | Valor(16.66%)
    tableColHeader33: {
        width: '33.33%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        backgroundColor: '#dfdfdfff',
        fontWeight: 'bold',
        fontSize: 9,
    },
    tableColValue33: {
        width: '33.33%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 9,
    },
    tableColHeader16_6: {
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
    tableColValue16_6: {
        width: '16.66%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 9,
    },
    // Tercera línea: Objetivo(16.66%) | Valor(83.34%)
    tableColHeader16_66: {
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
    tableColValue83: {
        width: '83.34%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 9,
    },
    // Cuarta línea: Horario(16.66%) | Valor(83.34%)
    tableColHeader16_66_horario: {
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
    tableColValue83_horario: {
        width: '83.34%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 9,
    },
    // Quinta línea: Capacidad(16.66%) | Física(8.33%) | Valor(16.66%) | Mental(8.33%) | Valor(16.66%) | (Espacio vacío 33.33%)
    tableColHeader16_66_capacidad: {
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
    tableColHeader8: {
        width: '8.33%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        backgroundColor: '#dfdfdfff',
        fontWeight: 'bold',
        fontSize: 9,
    },
    tableColValue16_capacidad: {
        width: '16.66%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 9,
    },
    tableColEmpty33: {
        width: '33.33%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 9,
    },
    // Estilos para el resto de las tablas (se mantienen igual)
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
    tableColFunc70: {
        width: '70%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 3,
        fontSize: 8,
    },
    tableColFunc65: {
        width: '65%',
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
    },
    center: {
        textAlign: 'center',
    }
});

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
                    {/* Primera línea: Puesto | "" | Posiciones | "" | Ubicación | "" */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader16}><Text>Puesto</Text></View>
                        <View style={styles.tableColValue16}><Text>{data.generalInfo.position}</Text></View>
                        <View style={styles.tableColHeader16}><Text>Posiciones</Text></View>
                        <View style={styles.tableColValue16}><Text>{data.generalInfo.numberOfPositions}</Text></View>
                        <View style={styles.tableColHeader16}><Text>Ubicación</Text></View>
                        <View style={styles.tableColValue16}><Text>{data.generalInfo.location}</Text></View>
                    </View>

                    {/* Segunda línea: Departamento | "" | Reporta a: | "" */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader33}><Text>Departamento</Text></View>
                        <View style={styles.tableColValue33}><Text>{data.generalInfo.department}</Text></View>
                        <View style={styles.tableColHeader16_6}><Text>Reporta a:</Text></View>
                        <View style={styles.tableColValue16_6}><Text>{data.generalInfo.reportsTo}</Text></View>
                    </View>

                    {/* Tercera línea: Objetivo | "" */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader16_66}><Text>Objetivo</Text></View>
                        <View style={styles.tableColValue83}>
                            <Text>{data.generalInfo.objective}</Text>
                        </View>
                    </View>

                    {/* Cuarta línea: Horario | "" */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader16_66_horario}><Text>Horario</Text></View>
                        <View style={styles.tableColValue83_horario}>
                            <Text>{data.generalInfo.schedule}</Text>
                        </View>
                    </View>

                    {/* Quinta línea: Capacidad | Física | "" | Mental | "" */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader16_66_capacidad}><Text>Capacidad</Text></View>
                        <View style={styles.tableColHeader8}><Text>Física</Text></View>
                        <View style={styles.tableColValue16_capacidad}><Text>{data.generalInfo.capacity.physical}</Text></View>
                        <View style={styles.tableColHeader8}><Text>Mental</Text></View>
                        <View style={styles.tableColValue16_capacidad}><Text>{data.generalInfo.capacity.mental}</Text></View>
                        <View style={styles.tableColEmpty33}><Text></Text></View>
                    </View>
                </View>
            </View>

            {/* Requisitos del Puesto */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>2. Requisitos del puesto</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderReq25}><Text>Educación</Text></View>
                        <View style={styles.tableColReq25}><Text>{data.requirements.education}</Text></View>
                        <View style={styles.tableColHeaderReq25}><Text>Grado</Text></View>
                        <View style={styles.tableColReq25}><Text>{data.requirements.degree}</Text></View>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderReq25}><Text>Experiencia</Text></View>
                        <View style={[styles.tableColReq25, {width: '75%'}]}>
                            <Text>{data.requirements.experience}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Responsabilidades Clave */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>3. Responsabilidades clave del puesto</Text>
                <View style={styles.table}>
                    {data.responsibilities.map((func, index) => (
                        <View key={index} style={styles.tableRow}>
                            <View style={styles.tableColHeaderReq5}>
                                <Text style={styles.bold}>{index}</Text>
                            </View>
                            <View style={[styles.tableColReq5, {width: '95%'}]}>
                                <Text>{func.description}</Text>
                            </View>
                        </View>
                    ))}
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
                            <Text>Indicador a</Text>
                            <Text>Evaluar</Text>
                        </View>
                    </View>
                
                    {/* Primera página - primeras 7 funciones */}
                    {data.specificFunctions.slice(0, 8).map((func, index) => (
                        <View key={func.id} style={styles.tableRow}>
                            <View style={styles.tableColHeaderReq5}>
                                <Text style={styles.bold}>{index}</Text>
                            </View>
                            <View style={styles.tableColFunc65}>
                                <Text>{func.description}</Text>
                            </View>
                            <View style={styles.tableColFunc15}>
                                <Text>{func.periodicidadData.periodicidad}</Text>
                            </View>
                            <View style={styles.tableColFunc15}>
                                <Text>{func.periodicidadData.indicador}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </Page>

        {/* Página 2 */}
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

            {/* Continuación de Funciones Específicas */}
            {data.specificFunctions.length > 8 &&
                <View style={styles.section}>
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

                        {/* Continuación de la tabla desde la función 8) */}
                        {data.specificFunctions.slice(8).map((func, index) => (
                            <View key={func.id} style={styles.tableRow}>
                                <View style={styles.tableColHeaderReq5}>
                                    <Text style={styles.bold}>{index + 8}</Text>
                                </View>
                                <View style={styles.tableColFunc65}>
                                    <Text>{func.description}</Text>
                                </View>
                                <View style={styles.tableColFunc15}>
                                    <Text>{func.periodicidadData.periodicidad}</Text>
                                </View>
                                <View style={styles.tableColFunc15}>
                                    <Text>{func.periodicidadData.indicador}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            }

            {/* Conocimientos, Habilidades y Destrezas */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>5. Conocimientos. habilidades y destrezas</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderComp60}><Text>Conocimientos, habilidades y destrezas</Text></View>
                        <View style={styles.tableColHeaderComp13}><Text>Básico</Text></View>
                        <View style={styles.tableColHeaderComp13}><Text>Competente</Text></View>
                        <View style={styles.tableColHeaderComp13}><Text>Experto</Text></View>
                    </View>
                    {data.skills.map((func, index) => (
                        <View key={func.id} style={styles.tableRow}>
                            <View style={styles.tableColComp60}>
                                <Text>{String.fromCharCode(97 + index)}) {func.skill}</Text>
                            </View>
                            <View style={styles.tableColComp13}>
                                <Text style={styles.center}>{func.level === 'basic' ? 'X' : ''}</Text>
                            </View>
                            <View style={styles.tableColComp13}>
                                <Text style={styles.center}>{func.level === 'competent' ? 'X' : ''}</Text>
                            </View>
                            <View style={styles.tableColComp13}>
                                <Text style={styles.center}>{func.level === 'expert' ? 'X' : ''}</Text>
                            </View>
                        </View>
                    ))}
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
                    {data.competencies.map((func, index) => (
                        <View key={func.id} style={styles.tableRow}>
                            <View style={styles.tableColComp60}><Text>{String.fromCharCode(97 + index)}) {func.competency}</Text></View>
                            <View style={styles.tableColComp13}>
                                <Text style={styles.center}>{func.level === 'basic' ? 'X' : ''}</Text>
                            </View>
                            <View style={styles.tableColComp13}>
                                <Text style={styles.center}>{func.level === 'competent' ? 'X' : ''}</Text>
                            </View>
                            <View style={styles.tableColComp13}>
                                <Text style={styles.center}>{func.level === 'expert' ? 'X' : ''}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Cambios en los registros históricos */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>7. Cambios en los registros históricos</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeaderFunc15}><Text>Revisión</Text></View>
                        <View style={styles.tableColHeaderFunc70}><Text>Cambios</Text></View>
                        <View style={styles.tableColHeaderFunc15}><Text>Fecha (mes, año)</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColFunc15}><Text>0</Text></View>
                        <View style={styles.tableColFunc70}><Text>Nueva Creación</Text></View>
                        <View style={styles.tableColFunc15}><Text>Julio, 2025</Text></View>
                    </View>
                </View>
            </View>
        </Page>
    </Document>
);