import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Estilos para el PDF (mismos que PdfRIBA)
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 8,
        fontFamily: 'Helvetica',
        lineHeight: 1.3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        borderBottomStyle: 'solid',
        paddingBottom: 8,
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
        width: '80%',
        alignItems: 'center',
    },
    companyTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    companySubtitle: {
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 1,
        color: '#333333',
    },
    paragraph: {
        marginBottom: 8,
        textAlign: 'justify',
    },
    sectionTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        marginBottom: 6,
        marginTop: 10,
    },
    subsectionTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        marginBottom: 4,
        marginTop: 8,
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    listNumber: {
        width: 20,
    },
    listText: {
        flex: 1,
    },
    signatureSection: {
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signatureBox: {
        width: '45%',
        alignItems: 'center',
        marginTop: 30,
    },
    signatureLine: {
        width: '100%',
        borderBottom: '1px solid black',
        marginBottom: 4,
    },
    signatureText: {
        fontSize: 8,
        textAlign: 'center',
    },
    bold: {
        fontWeight: 'bold',
    },
    warningText: {
        fontSize: 8,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 15,
    },
    acceptanceText: {
        fontSize: 8,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
    },
    table: {
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#000000',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
    },
    tableCell: {
        flex: 1,
        padding: 6,
        fontSize: 8,
    },
    tableHeader: {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
    },
    underline: {
        textDecoration: 'underline',
    },
});

interface PdfRITProps {
    name: string;
}

export const PdfRIT: React.FC<PdfRITProps> = ({ name }) => {
    return (
        <Document>
            {/* Página 1 */}
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
                        <Text style={styles.companyTitle}>REGLAMENTO INTERIOR DE TRABAJO</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                </View>

                {/* Capítulo I - Disposiciones Generales */}
                <Text style={styles.sectionTitle}>CAPÍTULO I - DISPOSICIONES GENERALES</Text>
                
                <Text style={styles.subsectionTitle}>Artículo 1</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Están sujetos al presente reglamento, todas las personas que cuenten con una relación laboral con las fuentes de trabajo denominadas BAALAK CLINICA VETERINARIA con domicilio en Avenida Central #33 colonia Santa Ana, C.P. 24250 entre calles Colosio y Costa Rica, en la ciudad de Campeche, Campeche. En términos del artículo 20 de la Ley Federal del Trabajo.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 2</Text>
                <View style={styles.paragraph}>
                    <Text>
                        El presente reglamento es de observancia obligatoria tanto para la empresa como para los trabajadores a su servicio, incluyendo todas las personas trabajadoras que ingresen con posterioridad a la fecha de depósito del mismo, a los cuales se les hará entrega de un ejemplar para su conocimiento además que se fijará en los lugares más visibles del establecimiento en observancia al artículo 425 de la ley en comento.
                    </Text>
                </View>

                {/* Capítulo II - Horarios */}
                <Text style={styles.sectionTitle}>CAPÍTULO II - HORAS DE ENTRADA - TIEMPO DESTINADO PARA COMIDAS DESCANSO DURANTE LA JORNADA DE TRABAJO</Text>

                <Text style={styles.subsectionTitle}>Artículo 3</Text>
                <View style={styles.paragraph}>
                    <Text>
                        El trabajador y el patrón fijarán la duración de la jornada de trabajo, sin que pueda exceder los máximos legales. Con las siguientes opciones de jornada:
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>•</Text>
                    <Text style={styles.listText}>
                        <Text style={styles.bold}>Jornada 1:</Text> De las 8:00 horas a las 16:00 horas con 30 minutos a la mitad de la jornada de trabajo para descanso y/o tomar alimentos (como el trabajador decida) de lunes a sábado.
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>•</Text>
                    <Text style={styles.listText}>
                        <Text style={styles.bold}>Jornada 2:</Text> De las 12:00 horas a las 20:00 horas con 30 minutos a la mitad de la jornada de trabajo para descanso y/o tomar alimentos (como el trabajador decida) de lunes a sábado.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 4</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Los trabajadores y el patrón podrán repartir las horas de trabajo, a fin de descansar el sábado para laborar domingo, o cualquier modalidad equivalente como lo dispone el artículo 59 de la Ley Federal del Trabajo, descansando el día que sea acordado conforme a las cargas de trabajo y a cada contrato individual de trabajo.
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>4.1</Text>
                    <Text style={styles.listText}>
                        El patrón está facultado para cambiar los horarios del trabajo y la rotación de los trabajadores conforme a las necesidades de la empresa, respetando en todo momento el tiempo laborado conforme a la ley de 48 horas semanales.
                    </Text>
                </View>

                {/* Capítulo III - Inicio y término */}
                <Text style={styles.sectionTitle}>CAPÍTULO III - INICIO Y TERMINO DE LA JORNADA DE TRABAJO</Text>

                <Text style={styles.subsectionTitle}>Artículo 5</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Los trabajadores deberán iniciar y concluir sus labores exactamente a la hora señalada en el domicilio en el cual fueron contratados, o en su caso, en el que señale el patrón por la naturaleza de los servicios prestados.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 6</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Los trabajadores están obligados a marcar personalmente su huella en el reloj checador, firmar las listas de asistencia o registrar su entrada y salida en los medios previstos para tal efecto a la entrada y salida de sus labores, así como su hora de comida. El incumplimiento de este requisito se tomará como falta injustificada para todos los efectos legales.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 7</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Los trabajadores contarán con un periodo de tolerancia de 10 minutos posteriores a la hora fijada como inicio de labores, con un máximo de 3 (tres) incidencias en una misma semana. La falta de observancia a esta disposición será sancionada en los términos previstos en el Capítulo XI del presente reglamento.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 8</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Cuando por la naturaleza del trabajo, el trabajador deba realizar su actividad fuera de las instalaciones de la empresa, quedará exento de la obligación de registrar su asistencia, pero deberá reportarse con el patrón al inicio y conclusión de la jornada, así como realizar las actividades que le fueron encomendadas dentro de la jornada laboral pactada.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 9</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Los trabajadores <Text style={styles.underline}>no podrán abandonar su área de trabajo durante su jornada laboral</Text> sin permiso de su jefe inmediato y sin causa justificada.
                    </Text>
                </View>
            </Page>

            {/* Página 2 */}
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
                        <Text style={styles.companyTitle}>REGLAMENTO INTERIOR DE TRABAJO</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                </View>

                {/* Capítulo IV - Limpieza */}
                <Text style={styles.sectionTitle}>CAPÍTULO IV - DÍAS Y HORAS FIJADOS PARA HACER LA LIMPIEZA DE LOS ESTABLECIMIENTOS, MAQUINARIA, APARATOS Y ÚTILES DE TRABAJO</Text>

                <Text style={styles.subsectionTitle}>Artículo 10</Text>
                <View style={styles.paragraph}>
                    <Text>
                        La limpieza de los establecimientos, maquinaria, aparatos y útiles de trabajo se llevará a cabo todos los días por el responsable(s) de las áreas de trabajo. Al término de la jornada laboral, debe quedar completamente limpio, ordenado y sanitizada el área.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 11</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Es obligación del patrón proporcionar oportunamente a los trabajadores los útiles, instrumentos y materiales necesarios para la ejecución del trabajo, debiendo darlos de buena calidad, siempre que aquéllos no se hayan comprometido a usar herramienta propia. El patrón no podrá exigir indemnización alguna por el desgaste natural que sufran los útiles, instrumentos y materiales de trabajo.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 12</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Es obligación del patrón proporcionar local seguro para la guarda de los instrumentos y útiles de trabajo pertenecientes al trabajador, siempre que deban permanecer en el lugar en que prestan los servicios, sin que sea lícito al patrón retenerlos a título de indemnización, garantía o cualquier otro. El registro de instrumentos o útiles de trabajo deberá hacerse siempre que el trabajador lo solicite.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 13</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Es obligación de los trabajadores conservar en buen estado, limpios y ordenados los instrumentos y útiles que el patrón les haya dado para el trabajo, no siendo responsables por el deterioro que origine el uso de estos objetos, ni el ocasionado por el caso fortuito, fuerza mayor o por mala calidad o defectuosa construcción.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 14</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Queda prohibido a los trabajadores sustraer de la empresa o establecimiento los útiles y herramientas de trabajo, así como usarlos para objeto distinto de aquel a que están destinados.
                    </Text>
                </View>

                {/* Capítulo V - Pagos */}
                <Text style={styles.sectionTitle}>CAPÍTULO V - DÍAS Y LUGARES DE PAGO</Text>

                <Text style={styles.subsectionTitle}>Artículo 15</Text>
                <View style={styles.paragraph}>
                    <Text>
                        El salario será cubierto a los trabajadores los sábados. El pago del salario se efectuará en el lugar donde los trabajadores presten sus servicios, en día laborable durante las horas de trabajo o inmediatamente después de su terminación.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 16</Text>
                <View style={styles.paragraph}>
                    <Text>
                        El salario se pagará directamente al trabajador. Sólo en los casos en que éste imposibilitado para efectuar directamente el cobro, el pago se le hará a la persona que designe como apoderado mediante carta poder suscrita por dos testigos.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 17</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Previo consentimiento del trabajador, el pago del salario podrá efectuarse por medio de depósito en cuenta bancaria, tarjeta de débito, transferencias o cualquier otro medio electrónico. Los gastos o costos que originen estos medios alternativos de pago serán cubiertos por el patrón.
                    </Text>
                </View>

                {/* Capítulo VI - Asientos */}
                <Text style={styles.sectionTitle}>CAPÍTULO VI - NORMAS PARA EL USO DE ASIENTOS O SILLAS</Text>

                <Text style={styles.subsectionTitle}>Artículo 18</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Es obligación del patrón mantener el número suficiente de asientos o sillas a disposición de los trabajadores durante toda la jornada laboral cuando lo permita la naturaleza del trabajo desempeñado.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 19</Text>
                <View style={styles.paragraph}>
                    <Text>
                        El patrón proporcionará asientos o sillas suficientes en las áreas de descanso o comedores en su caso.
                    </Text>
                </View>
            </Page>

            {/* Página 3 - Capítulo VII */}
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
                        <Text style={styles.companyTitle}>REGLAMENTO INTERIOR DE TRABAJO</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                </View>

                {/* Capítulo VII - Seguridad y Salud */}
                <Text style={styles.sectionTitle}>CAPÍTULO VII - NORMAS PARA PREVENIR LOS RIESGOS DE TRABAJO E INSTRUCCIONES PARA PRESTAR LOS PRIMEROS AUXILIOS</Text>

                <Text style={styles.subsectionTitle}>Artículo 20</Text>
                <View style={styles.paragraph}>
                    <Text>
                        En relación con los edificios, locales, instalaciones y áreas en los Centros de Trabajo, ya sean temporales o permanentes, el patrón deberá:
                    </Text>
                </View>

                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((num) => (
                    <View key={num} style={styles.listItem}>
                        <Text style={styles.listNumber}>{getRomanNumeral(num)}</Text>
                        <Text style={styles.listText}>
                            {getArticulo20Text(num)}
                        </Text>
                    </View>
                ))}

                <Text style={styles.subsectionTitle}>Artículo 21</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Para la prevención y protección contra incendios, los patrones deberán:
                    </Text>
                </View>

                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((num) => (
                    <View key={num} style={styles.listItem}>
                        <Text style={styles.listNumber}>{getRomanNumeral(num)}</Text>
                        <Text style={styles.listText}>
                            {getArticulo21Text(num)}
                        </Text>
                    </View>
                ))}
            </Page>

            {/* Página 4 - Capítulo VIII y IX */}
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
                        <Text style={styles.companyTitle}>REGLAMENTO INTERIOR DE TRABAJO</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>{getRomanNumeral(18)}</Text>
                    <Text style={styles.listText}>
                        {getArticulo21Text(18)}
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 22</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Es obligación del patrón observar en lo correspondiente a su centro de trabajo, las disposiciones del Reglamento Federal de Seguridad y Salud en el Trabajo, así como las que determine la autoridad competente.
                    </Text>
                </View>
                <View style={styles.paragraph}>
                    <Text>
                        También es obligación del patrón cumplir el reglamento y las normas oficiales mexicanas en materia de seguridad, salud y medio ambiente de trabajo, así como disponer de un botiquín de primeros auxilios.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 23</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Es obligación de los trabajadores observar las disposiciones contenidas en el reglamento y las normas oficiales mexicanas en materia de seguridad, salud y medio ambiente de trabajo, así como las que indique el patrón para su seguridad y protección personal.
                    </Text>
                </View>

                {/* Capítulo VIII - Menores y Mujeres Embarazadas */}
                <Text style={styles.sectionTitle}>MENORES DE EDAD Y MUJERES TRABAJADORAS EMBARAZADAS</Text>

                <Text style={styles.subsectionTitle}>Artículo 24</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Los mayores de quince y menores de dieciocho años, No pueden laborar en la Clínica Veterinaria Baalak, ya que por ley no se permite trabajar a menores atendiendo animales.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 25</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Cuando se ponga en peligro la salud de la mujer, o la del producto, ya sea durante el estado de gestación o el de lactancia y sin que sufra perjuicio en su salario, prestaciones y derechos, no se podrá utilizar su trabajo en labores insalubres o peligrosas, trabajo nocturno industrial, en establecimientos comerciales o de servicio después de las diez de la noche, así como en horas extraordinarias.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 26</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Para los efectos de este capítulo, son labores peligrosas o insalubres las que, por la naturaleza del trabajo, por las condiciones físicas, químicas y biológicas del medio en que se presta, o por la composición de la materia prima que se utilice, son capaces de actuar sobre la vida y la salud física y mental de la mujer en estado de gestación, o del producto.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 27</Text>
                <View style={styles.paragraph}>
                    <Text>
                        En caso de que las autoridades competentes emitan una declaratoria de contingencia sanitaria, conforme a las disposiciones aplicables, no podrá utilizarse el trabajo de mujeres en periodos de gestación o de lactancia. Las trabajadoras que se encuentren en este supuesto no sufrirán perjuicio en su salario, prestaciones y derechos.
                    </Text>
                </View>
                <View style={styles.paragraph}>
                    <Text>
                        Cuando con motivo de la declaratoria de contingencia sanitaria se ordene la suspensión general de labores, a las mujeres en periodos de gestación o de lactancia les será aplicable lo dispuesto por el artículo 429, fracción IV de la Ley Federal del Trabajo.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 28</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Las madres trabajadoras tendrán los derechos que marca la ley para este caso. Garantizando, protegiendo y cuidando en todo momento la integridad de la madre y él bebé en gestación.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 29</Text>
                <View style={styles.paragraph}>
                    <Text>
                        El patrón debe mantener un número suficiente de asientos o sillas a disposición de las madres trabajadoras.
                    </Text>
                </View>

                {/* Capítulo IX - Exámenes Médicos */}
                <Text style={styles.sectionTitle}>CAPÍTULO IX - TIEMPO Y FORMA EN QUE LOS TRABAJADORES DEBEN SOMETERSE A LOS EXÁMENES MÉDICOS, PREVIOS O PERIÓDICOS, Y A LAS MEDIDAS PROFILÁCTICAS QUE DICTEN LAS AUTORIDADES</Text>

                <Text style={styles.subsectionTitle}>Artículo 30</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Es obligación de los trabajadores someterse a los reconocimientos médicos ordenados por el patrón, para comprobar que no padecen alguna incapacidad o enfermedad de trabajo, contagiosa o incurable.
                    </Text>
                </View>
                <View style={styles.paragraph}>
                    <Text>
                        También es obligación de los trabajadores poner en conocimiento del patrón las enfermedades contagiosas que padezcan, tan pronto como tengan conocimiento de las mismas.
                    </Text>
                </View>
            </Page>

            {/* Página 5 - Capítulo X */}
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
                        <Text style={styles.companyTitle}>REGLAMENTO INTERIOR DE TRABAJO</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 31</Text>
                <View style={styles.paragraph}>
                    <Text>
                        El patrón cuidará del estado de salud de sus trabajadores y por tanto proporcionará las facilidades para la práctica de exámenes médicos que aquellos deberán presentar por lo menos una vez al año o cuando las circunstancias generales del entorno lo requieran observando las disposiciones de las autoridades competentes.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 32</Text>
                <View style={styles.paragraph}>
                    <Text>
                        En caso de brotes epidémicos, los trabajadores, tienen la obligación de someterse a los reconocimientos que ordenen las autoridades competentes; asimismo, se sujetarán a las prácticas de profilaxis por medio de vacunas, sueros y otros medicamentos que tengan por objeto prevenirlos contra enfermedades contagiosas o de peligro social.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 33</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Los exámenes médicos y medidas profilácticas que este reglamento establece para trabajadores, deben llevarse a cabo dentro de las horas de trabajo, salvo los casos de epidemia o de urgencia en que podrán efectuarse dichos exámenes en cualquier día y hora.
                    </Text>
                </View>

                {/* Capítulo X - Permisos y Licencias */}
                <Text style={styles.sectionTitle}>CAPÍTULO X - PERMISOS Y LICENCIAS</Text>

                <Text style={styles.subsectionTitle}>Artículo 34</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Queda prohibido a los trabajadores faltar al trabajo sin causa justificada o sin permiso del patrón.
                    </Text>
                </View>
                <View style={styles.paragraph}>
                    <Text>
                        Toda inasistencia de un trabajador no amparada por autorización escrita del médico de la institución de seguridad social o del servicio de salud que otorgue el patrón, o en su defecto, por autorización por escrita concedida por el patrón, se considera como falta injustificada.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 35</Text>
                <View style={styles.paragraph}>
                    <Text>
                        El trabajador que necesite retirarse de la empresa dentro de su jornada de trabajo por enfermedad, razones personales o extraordinarias, deberá solicitar el permiso al patrón a efecto de que se le entregue por escrito la autorización correspondiente.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 36</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Se consideran incapacidades únicamente las expedidas por el médico de la institución de seguridad social que le corresponda o, en su caso, del servicio de salud que otorgue el patrón.
                    </Text>
                </View>
                <View style={styles.paragraph}>
                    <Text>
                        Es obligación del trabajador hacer llegar al patrón las incapacidades que amparen su inasistencia a su empleo.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 37</Text>
                <View style={styles.paragraph}>
                    <Text>
                        El patrón podrá conceder a los trabajadores permisos sin goce de sueldo, siempre y cuando no se altere la prestación normal de los servicios de la empresa.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 38</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Es obligación del patrón otorgar permiso de paternidad de cinco días laborables con goce de sueldo, a los hombres trabajadores, por el nacimiento de sus hijos y de igual manera en el caso de la adopción de un infante.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 39</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Asimismo, es obligación del patrón conceder a los trabajadores el tiempo necesario para el ejercicio del voto en las elecciones populares y para el cumplimiento de los servicios de jurados, electorales y censales, a que se refiere el artículo 5o., de la Constitución, cuando esas actividades deban cumplirse dentro de sus horas de trabajo.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 40</Text>
                <View style={styles.paragraph}>
                    <Text>
                        El patrón deberá permitir a los trabajadores faltar a su trabajo para desempeñar una comisión accidental o permanente de su sindicato o del Estado, siempre que avisen con la oportunidad debida y que el número de trabajadores comisionados no sea tal que perjudique la buena marcha del establecimiento. El tiempo perdido podrá descontarse al trabajador a no ser que lo compense con un tiempo igual de trabajo efectivo.
                    </Text>
                </View>
                <View style={styles.paragraph}>
                    <Text>
                        Cuando la comisión sea de carácter permanente, el trabajador o trabajadores podrán volver al puesto que ocupaban, conservando todos sus derechos, siempre y cuando regresen a su trabajo dentro del término de seis años. Los substitutos tendrán el carácter de interinos, considerándolos como de planta después de seis años.
                    </Text>
                </View>
            </Page>

            {/* Página 6 - Continuación Capítulo X y XI */}
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
                        <Text style={styles.companyTitle}>REGLAMENTO INTERIOR DE TRABAJO</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                </View>

                {/* Continuación Capítulo X */}
                <Text style={styles.subsectionTitle}>Artículo 41</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Las madres trabajadoras disfrutarán de un descanso de seis semanas anteriores y seis posteriores al parto. A solicitud expresa de la trabajadora, previa autorización escrita del médico de la institución de seguridad social que le corresponda o, en su caso, del servicio de salud que otorgue el patrón, tomando en cuenta la opinión del patrón y la naturaleza del trabajo que desempeñe, se podrá transferir hasta cuatro de las seis semanas de descanso previas al parto para después del mismo.
                    </Text>
                </View>
                <View style={styles.paragraph}>
                    <Text>
                        En caso de que los hijos hayan nacido con cualquier tipo de discapacidad o requieran atención médica hospitalaria, el descanso podrá ser de hasta ocho semanas posteriores al parto, previa presentación del certificado médico correspondiente.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 42</Text>
                <View style={styles.paragraph}>
                    <Text>
                        En caso de adopción de un infante, las madres trabajadoras disfrutarán de un descanso de seis semanas con goce de sueldo, posteriores al día en que lo reciban.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 43</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Son días de descanso obligatorio de los trabajadores:
                    </Text>
                </View>

                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <View key={num} style={styles.listItem}>
                        <Text style={styles.listNumber}>{num}.</Text>
                        <Text style={styles.listText}>
                            {getDiasDescansoText(num)}
                        </Text>
                    </View>
                ))}

                <Text style={styles.subsectionTitle}>Artículo 44</Text>
                <View style={styles.paragraph}>
                    <Text>
                        En los casos del artículo anterior los trabajadores y los patrones determinarán el número de trabajadores que deban prestar sus servicios.
                    </Text>
                </View>
                <View style={styles.paragraph}>
                    <Text>
                        Los trabajadores quedarán obligados a prestar los servicios y tendrán derecho a que se les pague, independientemente del salario que les corresponda por el descanso obligatorio, un salario doble por el servicio prestado.
                    </Text>
                </View>

                {/* Capítulo XI - Disciplina */}
                <Text style={styles.sectionTitle}>CAPÍTULO XI - DISPOSICIONES DISCIPLINARIAS Y PROCEDIMIENTOS PARA SU APLICACIÓN</Text>

                <Text style={styles.subsectionTitle}>Artículo 45</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Cualquier violación de los trabajadores a las obligaciones estipuladas en su contrato individual de trabajo, al presente reglamento o a la Ley Federal del Trabajo serán sancionadas en los términos previstos en el presente capítulo.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 46</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Está prohibida la imposición de multas a los trabajadores, cualquiera que sea su causa o concepto.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 47</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Las disposiciones disciplinarias que pueden aplicarse a los trabajadores son las siguientes:
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>I.</Text>
                    <Text style={styles.listText}>Amonestación verbal o por escrito.</Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>II.</Text>
                    <Text style={styles.listText}>La suspensión en el trabajo, como medida disciplinaria que no podrá exceder de ocho días.</Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>III.</Text>
                    <Text style={styles.listText}>Rescisión de la relación de trabajo sin responsabilidad para el patrón.</Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 48</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Las disposiciones disciplinarias se aplicarán a criterio del patrón tomando en consideración los antecedentes del trabajador, la gravedad de la falta y las circunstancias del caso.
                    </Text>
                </View>
            </Page>

            {/* Página 7 - Continuación Capítulo XI y XII */}
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
                        <Text style={styles.companyTitle}>REGLAMENTO INTERIOR DE TRABAJO</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 49</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Son causales de amonestación verbal o por escrito o de suspensión en el trabajo como medida disciplinaria las faltas que no ameriten la rescisión de la relación de trabajo sin responsabilidad para el trabajador previstas por el artículo 47 de la Ley Federal del Trabajo.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 50</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Es causal de descuento de un día de salario íntegro del trabajador, su inasistencia injustificada a laborar en términos del Capítulo X del presente reglamento sin menoscabo de las que se le impusieren las que correspondan por tener el trabajador más de tres faltas de asistencia en un período de treinta días, sin permiso del patrón o sin causa justificada.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 51</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Son causales de rescisión de la relación de trabajo sin responsabilidad para el patrón las previstas en la Ley Federal del Trabajo.
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 52</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Queda prohibido a los trabajadores, lo plasmado en el artículo 135 de la Ley Federal del Trabajo:
                    </Text>
                </View>

                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((num) => (
                    <View key={num} style={styles.listItem}>
                        <Text style={styles.listNumber}>{getRomanNumeral(num)}</Text>
                        <Text style={styles.listText}>
                            {getProhibicionesText(num)}
                        </Text>
                    </View>
                ))}

                <Text style={styles.subsectionTitle}>Artículo 53</Text>
                <View style={styles.paragraph}>
                    <Text>
                        Los trabajadores deberán observar lo siguiente:
                    </Text>
                </View>

                {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((letra) => (
                    <View key={letra} style={styles.listItem}>
                        <Text style={styles.listNumber}>{letra})</Text>
                        <Text style={styles.listText}>
                            {getArticulo53Text(letra)}
                        </Text>
                    </View>
                ))}
            </Page>

            {/* Página 8 - Firmas */}
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
                        <Text style={styles.companyTitle}>REGLAMENTO INTERIOR DE TRABAJO</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                </View>

                <Text style={styles.subsectionTitle}>Artículo 54</Text>
                <View style={styles.paragraph}>
                    <Text>
                        El procedimiento para aplicación de las disposiciones disciplinarias se iniciará levantando el acta administrativa correspondiente en las instalaciones de la fuente de trabajo por conducto del representante legal del patrón, ante la presencia de testigos de asistencia haciéndose constar cuando menos:
                    </Text>
                </View>

                {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((letra) => (
                    <View key={letra} style={styles.listItem}>
                        <Text style={styles.listNumber}>{letra})</Text>
                        <Text style={styles.listText}>
                            {getArticulo54Text(letra)}
                        </Text>
                    </View>
                ))}

                {/* Capítulo XII - Visitantes */}
                <Text style={styles.sectionTitle}>CAPÍTULO XII - VISITANTES</Text>

                <Text style={styles.subsectionTitle}>Artículo 55</Text>
                <View style={styles.paragraph}>
                    <Text style={styles.bold}>
                        Todo visitante acatará las medidas de seguridad e higiene de este reglamento.
                    </Text>
                </View>

                {/* Texto de advertencia */}
                <Text style={styles.warningText}>
                    El incumplimiento de las disposiciones contenidas en el presente reglamento será sancionado conforme 
                    a lo establecido en el Capítulo XI, pudiendo llegar hasta la rescisión de la relación de trabajo sin 
                    responsabilidad para el patrón.
                </Text>

                {/* Texto de aceptación */}
                <Text style={styles.acceptanceText}>
                    He leído, comprendido y aceptado este Reglamento Interno de Trabajo.
                </Text>

                {/* Sección de firmas */}
                <View style={styles.signatureSection}>
                    {/* Patrón */}
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureText}>FRANCISCO JULIAN GOMEZ CANCINO</Text>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureText}>PATRÓN Y PROPIETARIO DE LA FUENTE</Text>
                        <Text style={styles.signatureText}>DE TRABAJO</Text>
                    </View>

                    {/* Trabajador */}
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureText}>{name}</Text>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureText}>TRABAJADOR</Text>
                    </View>
                </View>

                <Text>{"\n"}</Text>
                <Text>{"\n"}</Text>
                <Text>{"\n"}</Text>
                
                {/* Huella del Trabajador */}
                <View style={[styles.signatureSection, { marginTop: 10 }]}>
                    <View style={[styles.signatureBox, { width: '45%' }]}>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureText}>HUELLA del trabajador</Text>
                    </View>
                </View>

                {/* Información de ubicaciones */}
                <View style={[styles.paragraph, { marginTop: 20 }]}>
                    <Text style={styles.bold}>DOMICILIOS DE LAS FUENTES DE TRABAJO:</Text>
                    <Text style={styles.bold}>1. Clínica Veterinaria Animalia</Text>
                    <Text>
                        con domicilio en Calle Baja California #402,
                        entre Av. Adolfo López Mateos y Calle Sonora,
                        Colonia Petrolera, C.P. 96500, Coatzacoalcos,
                        Veracruz de Ignacio de la Llave. Y
                    </Text>
                    <Text>{"\n"}</Text>
                    <Text style={styles.bold}>2. Clínica Veterinaria Baalak'</Text>
                    <Text>
                        con domicilio en Av. Central #33,
                        entre Av. Luis Donaldo Colosio Murrieta y Calle Costa Rica,
                        Barrio de Santa Ana, C.P. 24050, San Francisco de Campeche,
                        Campeche.
                    </Text>
                </View>

                {/* Texto final */}
                <View style={[styles.paragraph, { marginTop: 15 }]}>
                    <Text style={styles.bold}>UNICO.</Text>
                    <Text>
                        - Este reglamento interior del trabajo, entrará en vigor desde el día en que sea depositado ante el
                        CENTRO FEDERAL DE CONCILIACIÓN Y REGISTRO LABORAL.
                    </Text>
                    <Text>
                        Considerando su aplicación en las Veterinarias Animalia y Baalak.
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

// Funciones auxiliares para obtener el texto de los artículos
function getRomanNumeral(num: number): string {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII'];
    return romanNumerals[num - 1] || num.toString();
}

function getArticulo20Text(num: number): string {
    const textos: { [key: number]: string } = {
        1: "Edificarlos conforme a las disposiciones reglamentarias en materia de construcción y las Normas pertinentes;",
        2: "Asegurarse de que soporten las cargas fijas o móviles que correspondan a las actividades que en ellos se desarrollen;",
        3: "Disponer de espacios seguros y delimitados en las zonas de producción, mantenimiento, circulación de personas y vehículos, almacenamiento y servicio para los trabajadores;",
        4: "Señalizar las áreas donde existan Riesgos;",
        5: "Proveer ventilación natural o artificial adecuada;",
        6: "Integrar y aplicar un programa específico para el mantenimiento de las instalaciones del Centro de Trabajo;",
        7: "Contar con escaleras, rampas, escalas fijas, escalas móviles, puentes o plataformas elevadas, bajo condiciones seguras, así como con puertas de acceso y salidas de emergencia;",
        8: "Poner a disposición de los trabajadores tomas de agua potable y vasos desechables o bebederos;",
        9: "Instalar sanitarios para mujeres y hombres, y lavabos limpios y seguros para el servicio de los trabajadores;",
        10: "Contar con regaderas y vestidores, de acuerdo con las actividades que se desarrollen o cuando se requiera la descontaminación de los trabajadores;",
        11: "Tener lugares higiénicos para el consumo de alimentos, en su caso;",
        12: "Mantener con orden y limpieza permanentes las áreas de trabajo y los pasillos exteriores a los edificios, estacionamientos y otras áreas comunes del Centro de Trabajo;",
        13: "Informar a los trabajadores sobre el uso y conservación de las áreas donde realizan sus actividades, y",
        14: "Llevar los registros sobre la ejecución del programa específico de mantenimiento de las instalaciones del Centro de Trabajo."
    };
    return textos[num] || "";
}

function getArticulo21Text(num: number): string {
    const textos: { [key: number]: string } = {
        1: "Clasificar el Riesgo de incendio del Centro de Trabajo, de modo integral o por áreas específicas;",
        2: "Contar con los medios de detección y equipos contra incendio, así como con sistemas fijos de protección y alarmas de incendio, de conformidad con lo que señala la Norma respectiva;",
        3: "Establecer y dar seguimiento a un programa de revisión a extintores;",
        4: "Establecer y dar seguimiento a un programa de revisión a los medios de detección y equipos contra incendio, al igual que los sistemas fijos de protección y alarmas de incendio;",
        5: "Establecer y dar seguimiento a un programa de revisión a las instalaciones eléctricas y de gas licuado de petróleo y natural;",
        6: "Contar con la señalización pertinente en las áreas donde se produzcan, almacenen o manejen sustancias inflamables o explosivas;",
        7: "Contar con instrucciones de seguridad para la prevención y protección de incendios al alcance de los trabajadores;",
        8: "Contar con un croquis, plano o mapa general del Centro de Trabajo, o por áreas que lo integran, que identifique al menos las principales áreas o zonas con Riesgo de incendio, la ubicación de los medios de detección de incendio y de los equipos y sistemas contra incendio, así como las rutas de evacuación;",
        9: "Prohibir y evitar el bloqueo, daño, inutilización o uso inadecuado de los equipos y sistemas contra incendio, el Equipo de Protección Personal para la respuesta a emergencias, así como los señalamientos de evacuación, prevención y de equipos y sistemas contra incendio;",
        10: "Adoptar medidas de seguridad para prevenir la generación y acumulación de electricidad estática en las áreas donde se manejen sustancias inflamables o explosivas;",
        11: "Contar con un plan de atención a emergencias de incendio;",
        12: "Disponer de rutas de evacuación que cumplan con las medidas de seguridad dispuestas por la Norma de la especialidad;",
        13: "Contar con brigadas contra incendio en los Centros de Trabajo, cuando así lo exija la Norma aplicable;",
        14: "Desarrollar simulacros de emergencias de incendio;",
        15: "Proporcionar el Equipo de Protección Personal a las brigadas contra incendio;",
        16: "Capacitar y adiestrar a los trabajadores y, en su caso, a los integrantes de las brigadas contra incendio, y",
        17: "Llevar los registros sobre los resultados de los programas de revisión y pruebas, así como de los simulacros de emergencias de incendio.",
        18: "La comprobación del cumplimiento de las obligaciones para la prevención y protección contra incendios se realizará con base en las modalidades que establezca la Norma correspondiente."
    };
    return textos[num] || "";
}

function getProhibicionesText(num: number): string {
    const textos: { [key: number]: string } = {
        1: "Ejecutar cualquier acto que pueda poner en peligro su propia seguridad, la de sus compañeros de trabajo o la de terceras personas, así como la de los establecimientos o lugares en que el trabajo se desempeñe;",
        2: "Faltar al trabajo sin causa justificada o sin permiso del patrón;",
        3: "Substraer de la empresa o establecimiento útiles de trabajo o materia prima o elaborada;",
        4: "Presentarse al trabajo en estado de embriaguez;",
        5: "Presentarse al trabajo bajo la influencia de algún narcótico o droga enervante, salvo que exista prescripción médica. Antes de iniciar su servicio, el trabajador deberá poner el hecho en conocimiento del patrón y presentarle la prescripción suscrita por el médico;",
        6: "Portar armas de cualquier clase durante las horas de trabajo, salvo que la naturaleza de éste lo exija. Se exceptúan de esta disposición las punzantes y punzo-cortantes que formen parte de las herramientas o útiles propios del trabajo;",
        7: "Suspender las labores sin autorización del patrón;",
        8: "Hacer colectas en el establecimiento o lugar de trabajo;",
        9: "Usar los útiles y herramientas suministrados por el patrón, para objeto distinto de aquél a que están destinados;",
        10: "Hacer cualquier clase de propaganda en las horas de trabajo, dentro del establecimiento; y",
        11: "Acosar sexualmente a cualquier persona o realizar actos inmorales en los lugares de trabajo.",
        12: "Difundir con las personas información el patrón o la fuente de trabajo o sus trabajadores ciertas o falsas con terceras personas.",
        13: "Lastimar a los animales, o no cumplir con las medidas de trato digno y respetuoso hacia los animales o no respetar sus 5 libertades: Libre de hambre, sed y desnutrición; Libre de miedos y angustia; Libre de incomodidades físicas o térmicas; Libre de dolor, lesiones o enfermedades; y Libre para expresar las pautas propias de comportamiento.",
        14: "Usar el celular en horario de trabajo",
        15: "3 Retardos en la semana será acreedor a 1 falta injustificada;",
        16: "3 faltas seguidas en el mismo mes es acreedor a rescisión de contrato."
    };
    return textos[num] || "";
}

function getDiasDescansoText(num: number): string {
    const textos: { [key: number]: string } = {
        1: "El 1o. de enero;",
        2: "El primer lunes de febrero en conmemoración del 5 de febrero;",
        3: "El tercer lunes de marzo en conmemoración del 21 de marzo;",
        4: "El 1o. de mayo;",
        5: "El 16 de septiembre;",
        6: "El tercer lunes de noviembre en conmemoración del 20 de noviembre;",
        7: "El 1o. de Octubre de cada seis años, cuando corresponda a la transmisión del Poder Ejecutivo Federal;",
        8: "El 25 de diciembre, y",
        9: "El que determinen las leyes federales y locales electorales, en el caso de elecciones ordinarias, para efectuar la jornada electoral."
    };
    return textos[num] || "";
}

function getArticulo53Text(letra: string): string {
    const textos: { [key: string]: string } = {
        'a': "Asumir íntegramente sus responsabilidades en el trabajo y responder por los daños y perjuicios que originen.",
        'b': "Actuar con honestidad en la ejecución de sus labores, orientados siempre por la veracidad, probidad, esfuerzo, creatividad y productividad.",
        'c': "Capacitarse para elevar la productividad como medio de superación personal y colectiva.",
        'd': "Realizar sus labores con calidad, esmero y cuidados apropiados.",
        'e': "Respetar a todos sus compañeros y al personal directivo de la empresa, procurando ayudarlos en todo aquello que tienda al mejor desempeño de su trabajo.",
        'f': "Mantener una actitud de dialogo con todos los miembros de la empresa, personal directivo y demás trabajadores, privilegiando a los argumentos apegados a la razón y las normas.",
        'g': "Guardar la lealtad y confidencialidad, debidas con respeto a los procesos productivos, administrativos y técnicos de la empresa en que laboran, de conformidad al CONVENIO DE CONFIDENCIALIDAD respectivo celebrado con el patrón y la fuente trabajo.",
        'h': "Abstenerse de obstaculizar la debida marcha de los procesos laborales."
    };
    return textos[letra] || "";
}

function getArticulo54Text(letra: string): string {
    const textos: { [key: string]: string } = {
        'a': "Día, hora y lugar en que se levante el acta.",
        'b': "Nombre y firma de las personas que intervienen en ella.",
        'c': "En caso de que alguno de las personas que intervienen se negaren a intervenir o bien a firmar el acta, se deberá hacer constar los motivos de su negativa.",
        'd': "El nombre de la(s) persona(s) que denuncian la(s) falta(s) cometida(s).",
        'e': "Narración circunstanciada de los hechos constitutivos de la falta, narrados por el quien denuncia y en su caso por los testigos que los presenciaron.",
        'f': "Las manifestaciones que desee realizar el trabajador a quien se pretende sancionar, puesto que tendrá derecho a ser oído antes de que se aplique la sanción.",
        'g': "En caso de proceder, se determinará la disposición disciplinaria que se aplicará al trabajador infractor."
    };
    return textos[letra] || "";
}

export default PdfRIT;