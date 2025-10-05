import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
        lineHeight: 1.3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
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
        marginTop: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signatureBox: {
        width: '45%',
        alignItems: 'center',
        marginTop: 40,
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
});

interface PdfCodeOfEthicsProps {
    name: string;
}

export const PdfCodeOfEthics: React.FC<PdfCodeOfEthicsProps> = ({ name }) => {
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
                        <Text style={styles.companyTitle}>CÓDIGO DE ÉTICA</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                </View>

                {/* Sección 1: Criterios */}
                <Text style={styles.sectionTitle}>1. Criterios.</Text>
                
                <View style={styles.paragraph}>
                    <Text style={styles.bold}>1.1</Text>
                    <Text>
                        {" "}El presente código de ética es observado por todos los integrantes del equipo de
                        Trabajo de la clínica y funciona como una guía amplia y una base de cuestionamiento y
                        razonamiento para el proceder y toma de decisiones de todos, formando una ideología de
                        la Empresa con la cual debemos ser coherentes e íntegros.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>1.2</Text>
                    <Text>
                        {" "}El presente reglamento contiene el conjunto de disposiciones obligatorias por los
                        trabajadores en el desarrollo de sus actividades, para garantizar en todo momento la
                        ETICA PROFESIONAL Y PERSONAL. La sanción por incumplimiento al incurrir en omitirlas,
                        no respetarlas, ni seguirlas tiene fuerza y ejercicio legal.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>1.3</Text>
                    <Text>
                        {" "}Está basado en los valores que ostentamos que son:
                    </Text>
                    <View style={styles.listItem}>
                        <Text style={styles.listNumber}>a)</Text>
                        <Text style={styles.listText}>Comunicación</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.listNumber}>b)</Text>
                        <Text style={styles.listText}>Mejora Continua</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.listNumber}>c)</Text>
                        <Text style={styles.listText}>Innovación</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.listNumber}>d)</Text>
                        <Text style={styles.listText}>Pasión</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.listNumber}>e)</Text>
                        <Text style={styles.listText}>Trabajo en Equipo</Text>
                    </View>
                </View>

                {/* Sección 2: De la relación con la Empresa */}
                <Text style={styles.sectionTitle}>2. De la relación con la Empresa.</Text>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>2.1</Text>
                    <Text>
                        {" "}En todo momento se debe respetar y tratar por igual a todas las personas con las que tengamos relación 
                        independientemente de su sexo, apariencia, nivel económico, religión, nacionalidad, raza, edad, 
                        evitando la discriminación por cualquier razón.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>2.2</Text>
                    <Text>
                        {" "}Los Empleados deben cuidar y respetar las propiedades de la Empresa, deben evitar tomar cosas que no son 
                        de su propiedad y no obtener beneficios propios con los medios de la Empresa o del trabajo de otros.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>2.3</Text>
                    <Text>
                        {" "}Se debe cumplir cabalmente con sus obligaciones y procurar el desarrollo y crecimiento de la Empresa y 
                        sus compañeros en el entendimiento que ello beneficia también a todos los trabajadores.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>2.4</Text>
                    <Text>
                        {" "}Se debe guardar total confidencialidad sobre los datos de la Empresa, de los clientes y pacientes, 
                        evitar hacer uso de esta información, ya sea que se entere o tenga conocimiento para otros fines que 
                        puedan poner en situación incómoda o dañar a terceros.
                    </Text>
                </View>

                {/* Sección 3: De la relación con los clientes */}
                <Text style={styles.sectionTitle}>3. De la relación con los clientes.</Text>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>3.1</Text>
                    <Text>
                        {" "}Brindar siempre la atención a quien la solicite, únicamente negarse ante situaciones que pongan en peligro 
                        la integridad del personal o de otros clientes, mascotas o propiedades. Y en casos en que los clientes 
                        se nieguen a pagar por los servicios.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>3.2</Text>
                    <Text>
                        {" "}Aceptar solo trabajos que estén dentro de nuestras capacidades, de lo contrario derivar o recomendar a 
                        especialistas de confianza. Estaremos siempre al tanto de nuestras habilidades, puntos fuertes y limitaciones.
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
                        <Text style={styles.companyTitle}>CÓDIGO DE ÉTICA</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                </View>

                {/* Continuación Sección 3 */}
                <View style={styles.paragraph}>
                    <Text style={styles.bold}>3.3</Text>
                    <Text>
                        {" "}Se debe tratar con todo respeto y confidencialidad a los clientes, ser discretos con datos sobre ellos y 
                        otros clientes, si se tiene que dar ejemplos evitar mencionar nombres. Debemos respetar sus puntos de vista y creencias.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>3.4</Text>
                    <Text>
                        {" "}Se conserva toda la información de los clientes de manera confidencial, a menos que sea autorizado por los mismos, 
                        requerido por la ley, o por otra razón obligatoria donde exista el inminente daño a otros. Este material puede ser de 
                        entrevistas en persona, por teléfono, computadora o correo de voz.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>3.5</Text>
                    <Text>
                        {" "}Ser honestos con el cliente y hablar siempre con la verdad, aunque ponga de manifiesto nuestra impericia, 
                        malas noticias sobre la salud de sus mascotas o peligros de zoonosis.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>3.6</Text>
                    <Text>
                        {" "}Hacernos responsables moral y económicamente de nuestros errores si estos causaran daño a las mascotas, 
                        propiedades o persona de los clientes, ya sea tangible o intangible.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>3.7</Text>
                    <Text>
                        {" "}Cobrar precios justos y competitivos, no cobrar por servicios no realizados, no ofrecer servicios y/o productos 
                        innecesarios. Si hay un problema con el pago de los honorarios, se deberá de tomar las medidas necesarias para 
                        discutir este problema oportunamente y decidir junto con el cliente que hacer.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>3.8</Text>
                    <Text>
                        {" "}Se respetan todos los acuerdos y promesas hechas a los clientes.
                    </Text>
                </View>

                {/* Sección 4: De la relación con los pacientes */}
                <Text style={styles.sectionTitle}>4. De la relación con los pacientes.</Text>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>4.1</Text>
                    <Text>
                        {" "}Tratar dignamente a las mascotas, respetar y poner en práctica el protocolo interno de bienestar animal, 
                        hacerlo del conocimiento de los clientes y no permitir el maltrato animal dentro de la clínica ni por los mismos propietarios.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>4.2</Text>
                    <Text>
                        {" "}Entender, practicar y difundir el sentimiento de respeto por los seres vivos que sienten dolor y emociones. 
                        Que esto sea la base de nuestro trato hacia los animales, que ellos estén antes de los intereses económicos y 
                        personales de nosotros mismos y de los clientes.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>4.3</Text>
                    <Text>
                        {" "}Procurar siempre evitar el sufrimiento y el dolor, tanto el generado por la naturaleza de sus padecimientos, 
                        como los derivados de los estudios, tratamientos, manejo y cualquier procedimiento a que sea sometido dentro de la clínica, 
                        entendiendo que la tranquilidad mental y emocional del paciente es indiscutiblemente prioritaria y no se puede dejar 
                        a un lado por ningún motivo.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>4.4</Text>
                    <Text>
                        {" "}Nuestro fin es curar o brindar alivio a las enfermedades de los pacientes, no debemos lucrar con estudios o 
                        procedimientos innecesarios que los afecten y/o pongan en peligro, evitando someterlo a procesos que sean dolorosos 
                        y molestos si no llevan a un buen fin en su enfermedad. Cuando su calidad de vida sea mala y no haya esperanzas de 
                        mejoría, debemos hablar claro con los clientes y mantener a los pacientes sin sufrimiento.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>4.5</Text>
                    <Text>
                        {" "}Proponer y practicar la eutanasia solo en aquellos casos en que el animal este sufriendo y/o no se pueda 
                        solventar el tratamiento necesario y no exista otro medio de evitar el sufrimiento de los animales. Realizar 
                        estas con sumo respeto y con medios no dolorosos y sin sufrimiento.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>4.6</Text>
                    <Text>
                        {" "}Daremos siempre lo mejor de nuestros conocimientos y habilidades a cada uno de nuestros clientes.
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
                        <Text style={styles.companyTitle}>CÓDIGO DE ÉTICA</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
                    </View>
                </View>

                {/* Sección 5: De la relación con los colegas */}
                <Text style={styles.sectionTitle}>5. De la relación con los colegas.</Text>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>5.1</Text>
                    <Text>
                        {" "}Respetar los puntos de vista y los trabajos de los colegas, no hacer comentarios que dañen su integridad 
                        frente a los clientes, cualquier observación hacerla personalmente y con fines de mejora profesional, con el mayor respeto.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>5.2</Text>
                    <Text>
                        {" "}No tomar ventajas de nuestra posición junto a los colegas nuevos, sino al contrario ayudarles en su desarrollo 
                        profesional, compartiendo nuestros conocimientos.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>5.3</Text>
                    <Text>
                        {" "}Tratar a los colegas y hablar de ellos con todo respeto en todos los ámbitos, procurando dignificar la profesión 
                        y al gremio a través de los demás y nosotros mismos.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>5.4</Text>
                    <Text>
                        {" "}Regresar a los clientes con su médico original cuando nos sean derivados y no tratar de quedarnos con ellos 
                        utilizando métodos indignos.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>5.5</Text>
                    <Text>
                        {" "}Hasta donde sea posible no tomaremos casos que estén siendo tratados por otro colega y que pudieran causar 
                        conflicto de intereses. Si estos se presentan, haremos lo mejor posible para resolverlo dentro del marco de las 
                        normas y estándares éticos.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>5.6</Text>
                    <Text>
                        {" "}Donde profesionalmente sea apropiado, podremos cooperar con otros profesionales para ayudar a los pacientes, 
                        siempre con la autorización del cliente.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>5.7</Text>
                    <Text>
                        {" "}Manejar una tarifa especial a los médicos que nos compran productos o que nos solicitan servicios personales, 
                        no ofrecer o pedir cuotas o igualas por pacientes derivados.
                    </Text>
                </View>

                {/* Sección 6: De la relación con la sociedad */}
                <Text style={styles.sectionTitle}>6. De la relación con la sociedad.</Text>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>6.1</Text>
                    <Text>
                        {" "}Desarrollar una Empresa no contaminante con el medio ambiente, utilizando productos y procesos seguros.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>6.2</Text>
                    <Text>
                        {" "}No ofrecer, publicitar o afirmar cosas que falsas, que congruentemente no realizamos o que no sabemos hacer bien. 
                        No ostentaremos títulos que no sean verdaderos, ni nos atribuiremos habilidades, credenciales o profesiones que no sustentemos, 
                        ni permitiremos que otros hagan uso de los nuestros en su favor ya sea en documentos por escrito o declaraciones verbales.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>6.3</Text>
                    <Text>
                        {" "}Superarnos constantemente como Empresas y profesionales para ofrecer mejores servicios. Nos esforzaremos por conocer 
                        las mejores prácticas actuales y las nuevas tecnologías, deberemos mejorar y ampliar nuestros conocimientos por medio de 
                        la lectura, talleres, entrenamiento directo y por los medios que sea prudente.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>6.4</Text>
                    <Text>
                        {" "}Ayudar a los animales con todas nuestras posibilidades en casos de desastre o situaciones extremas.
                    </Text>
                </View>

                <View style={styles.paragraph}>
                    <Text style={styles.bold}>6.5</Text>
                    <Text>
                        {" "}Realizar obras benéficas dentro de nuestra especialidad y rubro, que beneficien a la sociedad y a los animales de nuestro medio.
                    </Text>
                </View>
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
                        <Text style={styles.companyTitle}>CÓDIGO DE ÉTICA</Text>
                        <Text style={styles.companySubtitle}>Animalia - Baalak</Text>
                        <Text style={styles.companySubtitle}>Clínica Veterinaria</Text>
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