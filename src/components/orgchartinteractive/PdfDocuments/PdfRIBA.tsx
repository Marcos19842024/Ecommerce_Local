import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        lineHeight: 1.3,
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
        width: 50,
        height: 50,
    },
    companyInfo: {
        width: '80%',
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
    paragraph: {
        marginBottom: 8,
        textAlign: 'justify',
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 6,
        marginTop: 10,
    },
    subsectionTitle: {
        fontSize: 10,
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
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 15,
    },
    acceptanceText: {
        fontSize: 10,
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
        fontSize: 9,
    },
    tableHeader: {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
    },
    underline: {
        textDecoration: 'underline',
    },
});

interface PdfRIBAProps {
    name: string;
}

export const PdfRIBA: React.FC<PdfRIBAProps> = ({ name }) => {
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
                        <Text style={styles.companyTitle}>REGLAMENTO INTERNO DE BIENESTAR ANIMAL</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                    <View style={styles.logoContainer}>
                    </View>
                </View>

                {/* Texto introductorio */}
                <View style={styles.paragraph}>
                    <Text style={[styles.bold, {fontStyle: 'italic'}]}>
                        El presente reglamento contiene el conjunto de disposiciones obligatorias por los trabajadores 
                        en el desarrollo de sus actividades, para garantizar en todo momento el BIENESTAR ANIMAL, la 
                        sanción por incumplimiento al incurrir en omitirlas, no respetarlas, ni seguirlas tiene fuerza 
                        y ejercicio legal.
                    </Text>
                </View>

                {/* Sección a) Concepto e importancia del Bienestar Animal */}
                <Text style={styles.sectionTitle}>a) Concepto e importancia del Bienestar Animal.</Text>
                
                <View style={styles.paragraph}>
                    <Text>
                        La Organización Mundial de la Salud Animal considera que un animal se encuentra en un estado 
                        satisfactorio de bienestar <Text style={styles.underline}>cuando está sano, confortable, bien 
                        alimentado, puede expresar su comportamiento innato, y no sufre dolor, miedo o distrés</Text> 
                        (WOAH, 2008).
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text>
                        El bienestar animal incluye tres elementos:
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>1.</Text>
                    <Text style={styles.listText}>
                        <Text style={styles.bold}>El funcionamiento adecuado del organismo</Text> (los animales deben 
                        estar sanos y bien alimentados)
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>2.</Text>
                    <Text style={styles.listText}>
                        <Text style={styles.bold}>El estado emocional del animal</Text> (ausencia de emociones 
                        negativas como dolor, ansiedad y miedo crónico)
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>3.</Text>
                    <Text style={styles.listText}>
                        <Text style={styles.bold}>La posibilidad de expresar algunas conductas normales propias de la especie.</Text>
                    </Text>
                </View>

                {/* Sección b) Principio de 5 libertades */}
                <Text style={styles.sectionTitle}>b) Principio de 5 libertades.</Text>

                <View style={styles.paragraph}>
                    <Text>
                        Es obligatorio que en todo momento se aplique el principio de las cinco libertades, garantizando 
                        el bienestar del animal (FAWC, 1992; 1993) cumpliendo con:
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>1.</Text>
                    <Text style={styles.listText}>
                        El animal no sufre sed, hambre ni malnutrición, porque tiene acceso a agua de bebida y se les 
                        suministra una dieta adecuada a sus necesidades.
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>2.</Text>
                    <Text style={styles.listText}>
                        El animal no sufre estrés físico ni térmico, porque se le proporciona un ambiente adecuado, 
                        incluyendo refugio frente a las inclemencias climáticas y un área de descanso cómoda.
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>3.</Text>
                    <Text style={styles.listText}>
                        El animal no sufre dolor, lesiones ni enfermedades, gracias a una prevención adecuada y/o a un 
                        diagnóstico y tratamientos rápidos.
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>4.</Text>
                    <Text style={styles.listText}>
                        El animal es capaz de mostrar la mayoría de sus patrones de conducta, porque se le proporciona 
                        el espacio necesario y las instalaciones adecuadas, y se aloja en compañía de otros individuos 
                        de su especie.
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>5.</Text>
                    <Text style={styles.listText}>
                        El animal no experimenta miedo ni distrés, porque se garantizan las condiciones necesarias para 
                        evitar el sufrimiento mental.
                    </Text>
                </View>

                {/* Sección c) Preguntas de valoración */}
                <Text style={styles.sectionTitle}>c) Preguntas de valoración.</Text>

                <View style={styles.paragraph}>
                    <Text>
                        Se debe seguir valoración del bienestar animal, de acuerdo con el proyecto Welfare Quality, 
                        haciendo estas cuatro preguntas:
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>1.</Text>
                    <Text style={styles.listText}>¿Se alimenta a los animales de forma correcta?</Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>2.</Text>
                    <Text style={styles.listText}>¿Se alojan a los animales de forma adecuada?</Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>3.</Text>
                    <Text style={styles.listText}>¿Es adecuado el estado sanitario de los animales?</Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>4.</Text>
                    <Text style={styles.listText}>¿Refleja el comportamiento de los animales un estado emocional adecuado?</Text>
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
                        <Text style={styles.companyTitle}>REGLAMENTO INTERNO DE BIENESTAR ANIMAL</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                    <View style={styles.logoContainer}>
                    </View>
                </View>

                {/* Sección d) 12 Criterios */}
                <Text style={styles.sectionTitle}>d) 12 Criterios</Text>

                <View style={styles.paragraph}>
                    <Text>
                        Se debe considerar los 12 criterios del sistema de valoración del bienestar, siendo:
                    </Text>
                </View>

                {/* Tabla de criterios */}
                <View style={styles.table}>
                    {/* Fila 1 - Alimentación */}
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.tableHeader, {flex: 1}]}>
                            <Text>Alimentación</Text>
                        </View>
                        <View style={[styles.tableCell, {flex: 2}]}>
                            <Text>1. Ausencia de hambre prolongada (y dieta adecuada)</Text>
                            <Text>2. Ausencia de sed prolongada (agua fresca y limpia siempre disponible)</Text>
                        </View>
                    </View>

                    {/* Fila 2 - Alojamiento */}
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.tableHeader, {flex: 1}]}>
                            <Text>Alojamiento</Text>
                        </View>
                        <View style={[styles.tableCell, {flex: 2}]}>
                            <Text>3. Confort en relación con el descanso (cama, casa)</Text>
                            <Text>4. Confort térmico</Text>
                            <Text>5. Facilidad de movimiento (espacio suficiente acostado en estética y clínica, mayor en pensión)</Text>
                        </View>
                    </View>

                    {/* Fila 3 - Estado sanitario */}
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.tableHeader, {flex: 1}]}>
                            <Text>Estado sanitario</Text>
                        </View>
                        <View style={[styles.tableCell, {flex: 2}]}>
                            <Text>6. Ausencia de lesiones</Text>
                            <Text>7. Ausencia de enfermedad (agudas y crónico degenerativas no controladas)</Text>
                            <Text>8. Ausencia de dolor causado por prácticas de manejo tales como castración, corte de cola y corte de orejas (correcta terapia de manejo del dolor)</Text>
                        </View>
                    </View>

                    {/* Fila 4 - Comportamiento */}
                    <View style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.tableHeader, {flex: 1}]}>
                            <Text>Comportamiento</Text>
                        </View>
                        <View style={[styles.tableCell, {flex: 2}]}>
                            <Text>9. Expresión de un comportamiento social adecuado, de forma que exista un equilibrio entre los aspectos negativos (agresividad, por ejemplo) y los positivos (confianza y alegría en la interacción)</Text>
                            <Text>10. Expresión adecuada de otras conductas, de forma que exista un equilibrio adecuado entre los aspectos negativos (estereotipias(manías), por ejemplo) y los positivos (capacidad de jugar y sentirse a gusto)</Text>
                            <Text>11. Interacción adecuada entre los animales y sus cuidadores, de forma que aquellos no muestren miedo a las personas, aun mejor si muestran agrado.</Text>
                            <Text>12. Estado emocional positivo</Text>
                        </View>
                    </View>
                </View>

                {/* Sección e) Diferentes situaciones */}
                <Text style={styles.sectionTitle}>e) Diferentes situaciones.</Text>

                <View style={styles.paragraph}>
                    <Text>
                        Es importante conocer y recordar en todo momento lo siguiente:
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>1.</Text>
                    <Text style={styles.listText}>
                        Las situaciones que causan sufrimiento, tales como el dolor la ansiedad o el miedo, constituyen un problema de bienestar.
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>2.</Text>
                    <Text style={styles.listText}>
                        La incapacidad del animal de adaptarse al entorno causa sufrimiento y por lo tanto estudiar los parámetros que permiten cuantificar el grado de adaptación de los animales* aporta información útil sobre su bienestar.
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>3.</Text>
                    <Text style={styles.listText}>
                        Hay conductas "naturales y normales" que son importantes en si mismas y por lo tanto los animales deberían mantenerse en un ambiente que permitiera la expresión de dichas conductas.
                    </Text>
                </View>

                <View style={styles.listItem}>
                    <Text style={styles.listNumber}>4.</Text>
                    <Text style={styles.listText}>
                        Bienestar no es sinónimo de salud. En efecto, la salud es un aspecto importante del bienestar, pero el concepto de bienestar es mas amplio e incluye otros aspectos.
                    </Text>
                </View>
            </Page>

            {/* Página 3 */}
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
                        <Text style={styles.companyTitle}>REGLAMENTO INTERNO DE BIENESTAR ANIMAL</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                    <View style={styles.logoContainer}>
                    </View>
                </View>

                {/* Sección f) Manejo del perro y del gato en la clínica */}
                <Text style={styles.sectionTitle}>f) Manejo del perro y del gato en la clínica</Text>

                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                    <View key={num} style={styles.listItem}>
                        <Text style={styles.listNumber}>{num}.</Text>
                        <Text style={styles.listText}>
                            {getManejoText(num)}
                        </Text>
                    </View>
                ))}
            </Page>

            {/* Página 4 */}
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
                        <Text style={styles.companyTitle}>REGLAMENTO INTERNO DE BIENESTAR ANIMAL</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                    <View style={styles.logoContainer}>
                    </View>
                </View>

                {/* Continuación Sección f) */}
                {[16, 17, 18, 19, 20].map((num) => (
                    <View key={num} style={styles.listItem}>
                        <Text style={styles.listNumber}>{num}.</Text>
                        <Text style={styles.listText}>
                            {getManejoText(num)}
                        </Text>
                    </View>
                ))}

                {/* Sección g) Comportamientos que pueden aparecer durante la hospitalización */}
                <Text style={styles.sectionTitle}>g) Comportamientos que pueden aparecer durante la hospitalización</Text>

                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
                    <View key={num} style={styles.listItem}>
                        <Text style={styles.listNumber}>{num}.</Text>
                        <Text style={styles.listText}>
                            {getComportamientosText(num)}
                        </Text>
                    </View>
                ))}
            </Page>

            {/* Página 5 - Firmas */}
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
                        <Text style={styles.companyTitle}>REGLAMENTO INTERNO DE BIENESTAR ANIMAL</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                    <View style={styles.logoContainer}>
                    </View>
                </View>

                {[14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26].map((num) => (
                    <View key={num} style={styles.listItem}>
                        <Text style={styles.listNumber}>{num}.</Text>
                        <Text style={styles.listText}>
                            {getComportamientosText(num)}
                        </Text>
                    </View>
                ))}
            </Page>

            {/* Página 6 - Firmas */}
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
                        <Text style={styles.companyTitle}>REGLAMENTO INTERNO DE BIENESTAR ANIMAL</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                    <View style={styles.logoContainer}>
                    </View>
                </View>

                {/* Texto de advertencia */}
                <Text style={styles.warningText}>
                    De no cumplir con las normas del presente reglamento, será motivo de suspensión de uno a tres días, 
                    y la amonestación quedará a juicio de la empresa e incluso causa de recisión de contrato conforme a la 
                    gravedad de la norma no cumplida conforme al reglamento interno de trabajo.
                </Text>

                {/* Texto de aceptación */}
                <Text style={styles.acceptanceText}>
                    He leído, comprendido y aceptado este Reglamento.
                </Text>

                {/* Sección de firmas */}
                <View style={styles.signatureSection}>
                    {/* Patrón */}
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureText}>FRANCISCO JULIAN GOMEZ CANCINO</Text>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureText}>PATRÓN Y PROPIETARIO DE LA FUENTE</Text>
                        <Text style={styles.signatureText}>DE TRABAJO.</Text>
                    </View>

                    {/* Trabajador */}
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureText}>{name}</Text>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureText}>TRABAJADOR</Text>
                    </View>
                </View>

                {/* Huella del Trabajador */}
                <View style={[styles.signatureSection, { marginTop: 10 }]}>
                    <View style={[styles.signatureBox, { width: '45%' }]}>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureText}>HUELLA del trabajador</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

// Funciones auxiliares para obtener el texto de las secciones largas
function getManejoText(num: number): string {
    const textos: { [key: number]: string } = {
        1: "Para el traslado de la casa a la clínica siempre se debe llevar a los perros con un collar apropiado a su talla y una correa firme, nunca extensible.",
        2: "De ser transportado en automóvil y de necesitarlo es posible prescribir antieméticos.",
        3: "El traslado de los gatos preferiblemente debe ser en una caja transportadora, si el estado del gato lo permite, intentar que sea el gato el que entre a la transportadora para posteriormente taparla con una toalla para imposibilitar la visión hacia el exterior.",
        4: "Se debe separar a los gatos de los perros, de no tener espacio, los recepcionistas encargados podrán solicitar la caja transportadora con el gato con la finalidad de llevarlo dentro de la consulta o a un lugar aislado, si esto resultara imposible, proporcionar toallas a los propietarios de gatos para imposibilitar la visión del mismo.",
        5: "En la sala de espera evitar una aproximación amenazante por parte del veterinario y del personal, nunca acercarse al animal por la parte superior, siempre a su nivel o por debajo de el y dejar que sea el animal el que se acerque al humano, una vez conseguido, reforzar positivamente el acercamiento.",
        6: "La consulta deberá transcurrir en una habitación tranquila y libre de ruidos inesperados, sin la aparición de otros animales, con una mesa de exploración adecuada con una toalla o una goma antiderrapante debajo del animal y la mesa y evitando luces parpadeantes o demasiado intensas; evaluar si la consulta podrá realizarse con o sin la presencia del propietario.",
        7: "Durante la consulta en el caso de mascotas dentro de una caja transportadora, siempre esperar a que el animal salga por si solo, mientras se puede realizar preguntas habituales acerca del comportamiento e historia clínica del animal al propietario.",
        8: "Si el animal no sale de la caja transportadora, una opción es sacar la parte superior de la misma y realizar la primera exploración manteniendo al animal en su interior, también se puede sacar al animal de la caja transportadora con suavidad.",
        9: "Tener en todo momento un manejo suave, evitar los movimientos bruscos y retirarnos si el animal muestra alguna señal de miedo y/o agresividad.",
        10: "Realizar un proceso de condicionamiento durante la consulta. Si durante la manipulación el animal no muestra señales de miedo/agresividad y si la comida no interfiere en la prueba que se vaya a realizar, ofrecer una recompensa al animal (comida húmeda o semihumeda, premios habituales de casa).",
        11: "En el caso de las vacunaciones, siempre minimizar las situaciones dolorosas.",
        12: "Fármacos que se conservan refrigerados, por ejemplo, las vacunas, deberían ser atemperados con anterioridad, siempre vigilando la cadena fría del mismo. La inyección deberá ser en zonas poco dolorosas y hacerse de forma lenta.",
        13: "La contención del animal debe ser de la intensidad mínima como para que el animal no se mueva al inyectar.",
        14: "Ofrecer al animal algo de comida unos segundos antes de proceder a la inyección y mantener la comida durante la misma (en algunos casos y si la inyección es muy dolorosa, el animal puede hacer la asociación inversa, es decir asociar el dolor a la comida ofrecida).",
        15: "Antes de realizar algún método de contención brusca o traumática para los animales considerar la posibilidad de realizar una sedación leve o contención media en animales sanos, los fármacos propuestos suelen ser acepromacina o midazolam /buprenorfina en perros y gatos y para contención mayor ketamina con acepromacina o midazolam.",
        16: "En cuanto a la estancia en la zona de hospitalización, deberán de estar separados los perros de los gatos, todos los gatos deberán contar con arenero y una caja donde el mismo pueda refugiarse, se puede solicitar al propietario del gato alguna franela o tela con olor a el para hacer la estancia del gato mas placentera ya que se ha demostrado que los gatos son muy susceptibles a los aromas.",
        17: "También es de utilidad proporcionar aroma a lavanda dentro del área de hospitalización. Mientras que en el caso de los perros, de ser posible deberá proporcionarse un objeto propio del animal (manta, cojín, juguetes).",
        18: "En relación con las manipulaciones, deberán de ser las mínimas posibles.",
        19: "Deberán agruparse: medicaciones y chequeos.",
        20: "En gatos el acercamiento a la jaula debe ser preciso y calculado, fijándose siempre en la postura adoptada por el animal (gatos muy agresivos 1ml de ketamina V.O)."
    };
    return textos[num] || "";
}

function getComportamientosText(num: number): string {
    const textos: { [key: number]: string } = {
        1: "Agresividad como consecuencia del estrés ya que la hospitalización conlleva cambios importantes como un nuevo territorio, malestar generalizado y nuevas personas o animales. También la agresividad puede deberse al dolor como una conducta de evitación o en el caso de estrés crónico debido a la disminución de niveles de serotonina.",
        2: "Tener cuidado con los animales que manifiesten el dolor de diferentes formas a las habituales.",
        3: "Síntomas positivos: vocalizaciones e inquietud.",
        4: "Síntomas negativos: apatía e inactividad.",
        5: "Que un gato o un perro este quieto en una jaula no significa que no tenga dolor, para eso necesitamos un protocolo analgésico oportuno (morfina o fentanilo).",
        6: "Miedo, como consecuencia de experiencias traumáticas o mala socialización.",
        7: "Anorexia, como consecuencia del estrés o neofobia alimentaria, esto es especialmente importante en gatos, en gatos hospitalizados con anorexia, primero habrá que descartar problemas orgánicos y posteriormente enfocar el problema hacia algo relacionado con el entorno.",
        8: "Lo 'normal' es que un gato hospitalizado no coma, así que si la analítica sanguínea es correcta en ese momento hay que darlo de alta para que coma en casa, de resultar negativa la analítica sanguínea deberá inducirse el apetito al gato con la finalidad de evitar una complicación como lipidosis hepática por anorexia.",
        9: "Dolor, como mecanismo responsable de homeostasis en el organismo se activa el sistema nociceptivo, encargado de la percepción del dolor. Dado que el dolor es un mecanismo de defensa del organismo frente a las fuentes del daño, este mejora la probabilidad de supervivencia de una especie. No obstante, existen patologías en que el dolor se convierte en un síntoma capital que llega a ser el centro de la enfermedad.",
        10: "Sufrimiento. Esto denota distrés mental y viene reflejado en un cambio en los receptores moleculares que se sitúan en el sistema nervioso central.",
        11: "Un animal que muestre dolor por un daño físico también sentirá sufrimiento por la incapacidad de poder ejercer su conducta habitual debido al dolor que le produce.",
        12: "Eutanasia. Se define como una muerte sin sufrimiento físico. Se trata de un acto clínico orientado a dar fin a la vida de un animal como última alternativa ante situaciones entendidas como terminales para los pacientes (cuando el animal sufre dolor físico o distrés o es probable que los sufra en un futuro inmediato).",
        13: "La palabra eutanasia deriva del griego: eu (bueno), thanatos (muerte). Así pues, 'buena muerte', puede ser considerada una muerte en la que no hay dolor ni sufrimiento.",
        14: "Por eutanasia animal entendemos un acto clínico (supone un diagnóstico, historia clínica completa y un razonamiento sobre la situación actual del animal y del futuro inmediato que le espera consideradas todas las circunstancias), efectuado por personal especializado (se precisa de un conocimiento del animal, su comportamiento y las técnicas adecuadas), consistente en provocar la muerte del animal (al suministrar la inyección se busca la muerte del animal como único y mejor método de evitar sufrimiento) de la mejor forma posible, es decir, sin dolor ni angustia (mediante el dominio de las cuestiones técnicas que implican también cuidar las cuestiones de tipo psíquico, sensación de abandono, etc.), en aras de evitarle un sufrimiento grande que de forma segura le espera si se alarga su vida.",
        15: "La definición de eutanasia difiere ligeramente en medicina veterinaria y en medicina humana. A diferencia de la medicina humana, en veterinaria la eutanasia es activa básicamente. La diferencia entre eutanasia activa y pasiva está en que la eutanasia pasiva permite morir (suprimiendo el tratamiento o la maquinaria que en ese momento evita que muera) y en la eutanasia activa se realizan acciones para acabar con la vida del paciente.",
        16: "El proceso de eutanasia debe: I. Producir el mínimo estrés II. Ser indoloro III. Ser seguro para el personal IV. Actuar rápidamente V. Fácilmente administrable VI. Eficaz VII. Producir una muerte estética (no desagradable a la vista como podría ser ver sangre) VIII. Adecuado para la especie IX. Que no interfiera con las pruebas post-mortem más usuales.",
        17: "Protocolo para la toma de decisión: se realizan estas preguntas: ¿Podrá mantener el animal una calidad de vida aceptable?, ¿Existe algún hogar con deseos de adoptar al paciente una vez recuperado, a pesar de las discapacidades y tratamientos posteriores?, ¿Existen posibilidades reales (físicas, técnicas, económicas) de suministrar tratamientos, albergue, alimentos y cubrir otras necesidades que le puedan aportar un bienestar físico y psíquico?, ¿El animal es inofensivo para las personas u otros animales?",
        18: "Se propone: Si la respuesta a alguna de estas preguntas es NO, la eutanasia es una alternativa válida.",
        19: "Para la autorización de eutanasia: el propietario o persona con capacidad de autorizar la eutanasia del animal, debe firmar una solicitud/autorización en la que muestre conformidad con la decisión y protocolo del proceso. También debe estar firmada por el veterinario, quien pone de manifiesto que ha dado al propietario toda la información necesaria al respecto.",
        20: "Es importante la elección del agente eutanásico ya que de él depende que el animal sufra o no.",
        21: "Es totalmente inaceptable el uso de sustancias como: estricnina, nicotina, cloruro potásico, sulfato magnésico, detergentes, disolventes u otras sales o tóxicos, así como todos los bloqueantes neuromusculares o Sustancias inhalatorias: éter, monóxido de carbono, dióxido de carbono, óxido nitroso, halotano, isoflurano, etc. Apenas se usan actualmente ya que se requieren concentraciones muy elevadas del fármaco. Además, supone un riesgo para el personal (explosión, narcosis, hipoxemia...). El animal sufre mayor estrés durante la inducción.",
        22: "Sustancias inyectables: Es la forma más ética y estética, tranquila, indolora, rápida, segura y recomendable en la práctica de pequeños animales.",
        23: "Se usará preferentemente la vía endovenosa y, en casos excepcionales, vía intraperitoneal.",
        24: "La vía intracardíaca sólo debe ser usada en animales anestesiados o comatosos.",
        25: "Las vías intramuscular, subcutánea, intrapulmonar, intrahepática, intrarenal, intraesplénica o cualquier otra vía son totalmente inaceptables.",
        26: "Se trata de provocar una sobredosificación con un anestésico general. Los más frecuentemente usados son: Derivados barbitúricos: Tiopental, pentobarbital. Su principal ventaja se basa en la rapidez de acción. Deprimen el SNC en orden descendente, empezando por el córtex cerebral con pérdida de la consciencia que lleva a la anestesia."
    };
    return textos[num] || "";
}

export default PdfRIBA;