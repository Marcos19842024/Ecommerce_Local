import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Registrar fuentes (puedes cambiar estas fuentes por las que necesites)
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: '/fonts/Helvetica.ttf' },
        { src: '/fonts/Helvetica-Bold.ttf', fontWeight: 'bold' },
    ]
});

// Estilos
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.4,
    },
    header: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 12,
        fontWeight: 'bold',
    },
    title: {
        textAlign: 'center',
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 15,
        textDecoration: 'underline',
        textTransform: 'uppercase',
    },
    paragraph: {
        marginBottom: 10,
        textAlign: 'justify',
    },
    declarationSection: {
        marginBottom: 15,
    },
    declarationTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    clauseSection: {
        marginTop: 20,
    },
    signatureSection: {
        marginTop: 30,
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
        marginBottom: 5,
    },
    signatureText: {
        fontSize: 9,
        textAlign: 'center',
    },
    underline: {
        textDecoration: 'underline',
    },
    bold: {
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 20,
        fontSize: 8,
        textAlign: 'center',
        color: '#666',
    },
});

// CORRECCIÓN: Definir la interfaz correctamente
interface PdfConfidentialityAgreementProps {
    name: string;
}

export const PdfConfidentialityAgreement: React.FC<PdfConfidentialityAgreementProps> = ({ name }) => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('es-ES', { month: 'long' });
    const year = currentDate.getFullYear();
    const city = "San Francisco de Campeche";
    const municipality = "Campeche";

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                <Text style={styles.title}>
                    CONVENIO DE CONFIDENCIALIDAD
                    ENTRE EL PATRON Y EL TRABAJADOR.
                </Text>

                {/* Encabezado */}
                <Text style={styles.paragraph}>
                    En LA FUENTE de TRABAJO: AV. CENTRAL N.33 COLONIA SANTA ANA C.P. 24250 ENTRE CALLES
                    COLOSIO Y COSTA RICA, CAMPECHE, celebran el presente convenio de confidencialidad, el PATRON
                    "FRANCISCO JULIAN GOMEZ CANCINO y el (la) TRABAJADOR(A)
                    "<Text style={styles.bold}>{name || "[Nombre del trabajador]"}</Text>", con el objeto de
                    establecer la responsabilidad del trabajador antes citado, de guardar estricto secreto de las
                    actividades comerciales del patrón y sobre la información confidencial que conozca, ya sea que
                    el patrón le facilite o de las que conozca por motivo de su trabajo para el patrón antes
                    descrito, y para tal efecto, se sujetan al tenor de la siguiente declaraciones y cláusulas:
                </Text>

                <Text style={styles.title}>D E C L A R A C I O N E S:</Text>

                {/* Declaración I - PATRON */}
                <View style={styles.declarationSection}>
                    <Text style={styles.declarationTitle}>I.- PATRON:</Text>
                    <Text style={styles.paragraph}>
                        Manifiesta que por motivo de la prestación de servicios que brinda a sus clientes y proveedores, 
                        guarda secreto sobre información confidencial que debe guardar su secreto en términos de la ley 
                        federal de protección de datos personales en posesión de los particulares y las demás leyes 
                        disposiciones normativas aplicables, así como por motivo de su práctica comercial, posee secretos 
                        e información confidencial que necesita guardar en secreto, en atención a lo anterior, se estima 
                        prioritaria la protección, manejo y buen uso de la información confidencial, secretos industriales, 
                        comerciales, profesionales y datos personales que el patrón use, transfiera o reciba, de conformidad 
                        a las leyes aplicables, y en atención a sus políticas de manejo y protección de la información, 
                        datos personales y desarrollo y obtención de propiedad intelectual, y con el propósito de asegurar 
                        el buen uso y protección de sus derechos y propiedades sobre bienes intangibles, así como cumplir 
                        con sus obligaciones frente a terceros que le correspondan, por lo que requiere que todas aquellas 
                        personas, incluyendo sus trabajadores que tengan acceso a dicha Información Confidencial se obliguen 
                        a respetar dicho carácter. Motivo por lo que celebra el presente convenio con su trabajador a que 
                        refiere el contrato anexo al presente escrito.
                    </Text>
                </View>

                {/* Declaración II - TRABAJADOR */}
                <View style={styles.declarationSection}>
                    <Text style={styles.declarationTitle}>II.- TRABAJADOR:</Text>
                    <Text style={styles.paragraph}>
                        Manifiesta por su parte que dentro de sus actividades laborales que desarrolla para el patrón tiene 
                        acceso a información confidencial y a secretos industriales, profesionales y comerciales, propiedad 
                        de terceros y/o del patrón. Que está consciente de que el patrón es legítimo propietario y/o poseedor 
                        de secretos industriales, profesionales y comerciales propios y de terceros, relacionados con las 
                        actividades de la empresa y el patrón, como son los expedientes clínicos, directorios, reportes, 
                        bitácoras y su contenido, entre otros, así como sistemas, metodologías, procedimientos, estrategias, 
                        conocimientos comerciales, profesionales e industriales y listados de clientes y/o proveedores, entre otros.
                    </Text>
                    <Text style={styles.paragraph}>
                        Que con anterioridad a su relación con el patrón no tenía conocimiento de la información confidencial 
                        del patrón y/o de los terceros de los cuales el patrón posee información confidencial, como se define 
                        en el presente convenio, y que por lo tanto, su conocimiento de dicha información confidencial y el 
                        desarrollo de nueva información derivada de la misma ha sido una consecuencia directa de los trabajos 
                        que desarrolla para el patrón, por lo que no tenía manera de conocerla a partir de información disponible 
                        por otros medios. Que la confidencialidad a la que se obliga como trabajador en virtud de este convenio 
                        no afecta su libertad de trabajo, puesto que sus conocimientos y experiencia profesionales le permiten 
                        desarrollar diversas actividades sin necesidad de usar, comercializar y/o revelar a terceros la información 
                        confidencial, en caso de que dejara de prestar sus servicios para el patrón, toda vez que dicha información 
                        que le es y/o fue revelada y/o se genere como consecuencia de los trabajos realizados por el trabajador 
                        para el patrón no hubiera estado en su poder de no haber sido por la entrega y acceso que le da el patrón.
                    </Text>
                    <Text style={styles.paragraph}>
                        Que está enterado de que el éxito de los servicios del patrón y de su empresa depende de la estricta 
                        confidencialidad que se guarde sobre su secreto industrial, profesional y comercial, y/o de terceros, 
                        los cuales le permiten obtener y mantener una ventaja competitiva y económica en la realización de sus 
                        actividades. Que está enterado de que revelar la información confidencial por cualquier medio a terceros 
                        sin el consentimiento formal del patrón y/o de su legítimo propietario, podría tener como consecuencia 
                        incurrir en las conductas delictivas que se sancionan con penas privativas de libertad y/o multas
                    </Text>
                </View>
            </Page>

            <Page size="LETTER" style={styles.page}>
                <Text style={styles.title}>
                    CONVENIO DE CONFIDENCIALIDAD
                    ENTRE EL PATRON Y EL TRABAJADOR.
                </Text>

                <View style={styles.declarationSection}>
                    <Text style={styles.paragraph}> 
                        administrativas, sin perjuicio de las sanciones laborales previstas por el patrón y los ordenamientos 
                        aplicables,y la obligación de reparar y pagar los daños y perjuicios causados al patrón y/o a sus 
                        legítimos dueños o causahabientes como consecuencia de tal revelación y/o uso no autorizado.
                    </Text>
                    <Text style={styles.paragraph}>
                        Que es consciente de la importancia de su responsabilidades en cuanto a no poner en peligro la integridad, 
                        disponibilidad y confidencialidad de la información que maneja el patrón o su empresa y me comprometo a 
                        cumplir, todas las disposiciones relativas a la política de la empresa en materia de uso y divulgación de 
                        información, y a no divulgar la información que reciba a lo largo de mi relación con el patrón y su empresa, 
                        subsistiendo este deber de secreto, aun después de que finalice dicha relación.
                    </Text>
                </View>

                {/* Declaración TRABAJADOR Y PATRON */}
                <View style={styles.declarationSection}>
                    <Text style={styles.declarationTitle}>TRABAJADOR Y PATRON:</Text>
                    <Text style={styles.paragraph}>
                        Manifiestan tener una relación laboral en común, en términos del contrato anexo al presente convenio y que 
                        es su deseo celebrar y cumplir el presente convenio, por lo que declaran, estar en pleno goce de capacidad 
                        legal para obligarse en los términos del presente convenio, por lo que acuerdan obligarse en los términos 
                        de las siguientes:
                    </Text>
                </View>

                <Text style={styles.title}>C L A U S U L A S</Text>
                
                {/* Cláusulas */}
                <View style={styles.clauseSection}>
                    {/* Cláusula 1 */}
                    <View style={styles.paragraph}>
                        <Text>
                            1.- El trabajador se compromete a no vender , rentar, prestar, revelar, publicar, divulgar, grabarla, 
                            negociarla, disponer, traficar, modificar, retirar de las instalaciones de la empresa del patrón, 
                            hacer uso distinto al que expresamente se le ha indicado, ni a hacer cualquier otro tipo de intercambio 
                            con la información confidencial y los secretos industriales, comerciales y profesionales a los cuales 
                            tenga acceso en virtud de su relación con el patrón o su empresa, independientemente de que éstos sean 
                            propiedad del patrón o su empresa o de terceros. Lo anterior ya sea de forma escrita, verbal, o virtual 
                            o de cualquier otra forma a persona alguna presente o futura.
                        </Text>
                    </View>

                    {/* Cláusula 2 */}
                    <View style={styles.paragraph}>
                        <Text>
                            2.- El trabajador se obliga a guardar escrupulosamente los secretos técnicos, comerciales, profesionales , 
                            atención a clientes y bases de datos de clientes, concurran directa o indirectamente con él, así como 
                            de la información confidencial o de los cuales tengan conocimiento por razón del trabajo que desempeñen, 
                            de los asuntos administrativos reservados, cuya divulgación pueda causar perjuicios a la empresa, 
                            compañeros de trabajo, del patrón o de la empresa o establecimiento, o de los clientes y proveedores 
                            del patrón, por lo que el trabajador mantendrá en total y absoluto secreto la información confidencial, 
                            aún y cuando por cualquier causa su relación con el patrón terminare. en atención a lo anterior, de 
                            manera enunciativa más no limitativa, el trabajador se compromete a no utilizar la información 
                            confidencial en su provecho o en el de terceros, ni a darle un uso diverso al que expresamente se le 
                            autorizó o indicó al momento de darle acceso a la información confidencial; no divulgar, publicar o 
                            revelar en forma alguna y por ningún medio la información confidencial; en general, se obliga a manejar 
                            como secreto industrial, profesional y comercial toda la información confidencial, sabedor de las medidas 
                            que deben aplicarse para garantizar el manejo confidencial de dicha información así como la de las 
                            violaciones en que incurre quién obra en contravención a lo acordado en este instrumento; para lo cual 
                            se tienen como reproducidos en este instrumento, los preceptos de las leyes respectivas. no obstante 
                            lo señalado en esta cláusula, las obligaciones aquí estipuladas podrían admitir la salvedad de que medie 
                            autorización expresa para que el trabajador actúe en forma distinta a lo previsto, únicamente si dicha 
                            autorización es otorgada por escrito a través de un legítimo representante legal del patrón, el trabajador 
                            entiende y acepta que el patrón únicamente revela información confidencial a sus empleados, colaboradores, 
                            trabajadores bajo el principio de divulgación estricta; es decir, solo aquellas personas que sean 
                            estrictamente necesarias para el cumplimiento del objeto de su prestación de servicio comercial podrán 
                            tener acceso a la información confidencial.
                        </Text>
                    </View>

                    {/* Cláusula 3 */}
                    <View style={styles.paragraph}>
                        <Text>
                            3.- Las partes del presente instrumento jurídico acuerdan que para los efectos del presente convenio, establecen que le
                        </Text>
                    </View>
                </View>
            </Page>

            <Page size="LETTER" style={styles.page}>
                <Text style={styles.title}>
                    CONVENIO DE CONFIDENCIALIDAD
                    ENTRE EL PATRON Y EL TRABAJADOR.
                </Text>

                {/* Cláusula 3 */}
                <View style={styles.paragraph}>
                    <Text>
                        denomina información confidencial, a toda aquella información plasmada en cualquier tipo de documentos, medios de almacenamientos
                        electrónicos o magnéticos, información incorporada en software de computadoras discos ópticos, microfilmes, películas u otros
                        instrumentos similares o análogos, incluyendo de manera enunciativa instalaciones, materiales, equipo y cualquier tipo de dispositivos
                        o diseños; así mismo, se considera información confidencial aquella que aún sin estar plasmada en los términos antes referidos,
                        le signifique al patrón ventajas competitivas o económicas frente a terceros en el desarrollo de sus actividades profesionales o
                        comerciales o le hubiera a su vez sido confiada por sus terceros por cualquier título legal. la información confidencial se refiere a
                        todos aquellos conocimientos, documentos, información y/o secretos industriales o profesionales, existentes o desarrollados durante su
                        trabajos que  en los que participe o realice para el patrón, relacionados con  todo aspecto técnico científico, económico, comercial,
                        profesional  o industrial de tecnología relacionada con los servicios que preste el patrón, independientemente de que el trabajador
                        esté o no involucrado en el mismo, directa o indirectamente, así como a los métodos o procesos de operación y prácticas, diseños,
                        esquemas, estrategias, fondos o administración de los servicios. La información confidencial podrá, aunque no necesariamente,
                        venir marcada con la(s) leyenda(s) “confidencial”, “privilegiada” u otra(s) análoga(s). Así mismo se le denomina secreto profesional,
                        a toda información de aplicación comercial, o industrial que le signifique obtener una ventaja competitiva o económica frente a
                        terceros al patrón y/o al tercero que le haya divulgado el mismo patrón.
                    </Text>
                </View>

                {/* Cláusula 4 */}
                <View style={styles.paragraph}>
                    <Text>
                        4.- El trabajador tiene la obligación de comunicar al patrón o a su representante las deficiencias que adviertan en el manejo
                        de la información confidencial antes referida, a fin de evitar daños o perjuicios a los intereses y vidas de sus compañeros de
                        trabajo, del patrón o de la empresa o establecimiento, o de los clientes y proveedores del patrón.
                    </Text>
                </View>

                {/* Cláusula 5 */}
                <View style={styles.paragraph}>
                    <Text>
                        5.- El trabajador mantendrá en total y absoluto secreto la información confidencial, aún y cuando por cualquier causa su relación
                        con el patrón terminare,  en atención a lo anterior, de manera enunciativa más no limitativa, el trabajador  se compromete a no
                        utilizar la información confidencial en su provecho o en el de terceros, ni a darle un uso diverso al que expresamente se le
                        autorizó o indicó al momento de darle acceso a la información confidencial; no divulgar, publicar o revelar en forma alguna y por
                        ningún medio la información confidencial;  en general, se obliga a manejar como secreto  profesional toda la información confidencial,
                        sabedor de las medidas que deben aplicarse para garantizar el manejo confidencial de dicha información así como la de las violaciones
                        en que incurre quién obra en contravención a lo acordado en este instrumento; para lo cual se tienen como reproducidos en este
                        instrumento, los preceptos de la leyes respectivas. 
                    </Text>
                </View>

                {/* Cláusula 6 */}
                <View style={styles.paragraph}>
                    <Text>
                        6.- El incumplimiento de lo acordado por el trabajador en el presente convenio, da lugar a su responsabilidad civil que resulte al
                        respecto, en los términos del artículo 32 de la Ley Federal del Trabajo, por lo que le trabajador responderá por el pago de daño y
                        perjuicios que origine por el incumplimiento a lo pactado en el presente instrumento jurídico. Además el trabajador en caso del
                        incumplimiento antes citado, pagara al patrón los gastos y honorarios de los procedimientos extrajudiciales y judiciales que tengan
                        lugar. El trabajador responderá por los daños y perjuicios que puedan llegar a ocasionarse por la violación de la confidencialidad
                        a la que se refiere el presente convenio, en el momento en el que le sea solicitado y sin necesidad de previa declaración judicial,
                        sin perjuicio de las acciones legales a que hubiere lugar. 
                    </Text>
                </View>

                {/* Cláusula 7 */}
                <View style={styles.paragraph}>
                    <Text>
                        7.- Las partes del presente convenio acuerdan que será causas de rescisión de la relación de trabajo, sin responsabilidad para el
                        patrón, en los términos del artículo 47 de la Ley Federal del Trabajo, que el trabajador no observe cuidado apropiado las disposiciones
                        contenidas en las leyes, reglamento y las normas oficiales Mexicanas en materia de seguridad de la información confidencial, tanto de
                        sus compañeros de trabajo, del patrón o de la empresa o establecimiento, o de los clientes y proveedores del patrón, que conozca por
                        cualquier motivo, así como las que se acuerdan en el presente convenio y las que  indique el patrones para la seguridad y protección
                        de la información antes citada, así mismo será causa de rescisión en los términos antes señalados,  el revelar el trabajador los secretos
                        o dar a conocer asuntos de carácter reservado, con perjuicio de de sus compañeros de trabajo, del patrón o de la empresa o establecimiento,
                        o de los clientes y proveedores del patrón, así como Incurrir el trabajador, durante sus labores, en faltas de probidad u honradez, en
                        actos en contra del patrón o de la empresa o establecimiento, o en contra de clientes y proveedores del patrón y de sus compañeros de
                        trabajo, al igual que ocasionar el trabajador, intencionalmente, perjuicios y daños con dolo o sin él, 
                    </Text>
                </View>
            </Page>

            <Page size="LETTER" style={styles.page}>
                <Text style={styles.title}>
                    CONVENIO DE CONFIDENCIALIDAD
                    ENTRE EL PATRON Y EL TRABAJADOR.
                </Text>

                {/* Cláusula 7 */}
                <View style={styles.paragraph}>
                    <Text>
                        o con negligencia en materiales durante el desempeño de las labores o con motivo de ellas, en todo objetos relacionados con el trabajo,
                        incluyendo con la información de todo tipo, del patrón o la empresa o establecimiento de la que tenga conocimiento por cualquier circunstancia,
                        al igual que comprometer el trabajador, por su imprudencia o descuido inexcusable, la seguridad del patrón, o de la empresa o establecimiento,
                        o en contra de clientes y proveedores del patrón o de las personas que se encuentren en él, incluyendo la  originada por revelar de toda forma,
                        publicar, divulgar, vender, disponer, traficar, modificar, sustraer,  retirar de las instalaciones de la empresa o establecimiento, hacer uso
                        distinto al que expresamente se le ha indicado, ni a hacer cualquier otro tipo de intercambio con la información confidencial y los
                        secretos industriales,  comerciales y de prestación de servicios y  fabricación de los productos a cuya elaboración concurran directa o
                        indirectamente, o de los cuales tengan conocimiento por razón del trabajo que desempeñen, así como de los asuntos administrativos
                        reservados, cuya divulgación pueda causar perjuicios de sus compañeros de trabajo, del patrón o de la empresa o establecimiento, o de
                        los clientes y proveedores del patrón a los cuales tenga acceso en virtud de su relación con el patrón, la empresa o establecimiento,
                        independientemente de que éstos sean propiedad del  patrón, la empresa o establecimiento o de tercero, incluyendo sus compañeros de
                        trabajo. Lo anterior aún ocurriera durante la prestación de su trabajo o fuera de su prestación de servicio o cuando por cualquier
                        causa su relación de trabajo con el patrón o la empresa o establecimiento, o sus compañeros de trabajo, terminare y fuera en su
                        provecho o de un tercero y sea por uso diverso de la información confidencial al que expresamente se le autorizó para tener acceso a ella.
                    </Text>
                </View>

                {/* Cláusula 8 */}
                <View style={styles.paragraph}>
                    <Text>
                        8.- La duración del presente Convenio es indefinida mientras se encuentra vigente la relación del trabajador con el patrón, y en caso que
                        concluyera por cualquier motivo las obligaciones de confidencialidad se mantendrán como tales hasta que la misma sea considerada como
                        información pública o de dominio público en virtud de que su legítimo propietario o la del patrón la hayan colocado en tal estatus, hasta por
                        99 años, a partir de la firma del presente convenio. En ningún caso se entenderá que la información confidencial es de dominio público por
                        el hecho de que trabajador haya incumplido con sus obligaciones en los términos de este convenio, en donde además de las penas aquí establecidas,
                        el trabajador deberá reparar los daños y perjuicios provocados. En todo caso, la obligación de confidencialidad que se termine solo será respecto
                        a aquella parte de la información confidencial que encuadre en el supuesto del párrafo anterior, el resto de la información deberá de mantenerse
                        y considerarse como información confidencial. El trabajador acepta que el patrón podrá terminar por anticipado la relación que los vincule,
                        en caso de que éste incumpla con sus obligaciones establecidas en el presente instrumento. Lo anterior no demerita o anula el hecho de que las
                        obligaciones de confidencialidad continúen vigentes respecto del resto de la información confidencial. El trabajador se obliga a devolver la
                        información confidencial que hubiera tenido acceso y que tenga en su dominio o posesión por cualquier medio, en el momento que termine su
                        relación laboral o se la solicite el patrón. Asimismo, el trabajador está consciente de que el incumplimiento a lo dispuesto en el presente
                        convenio es causal suficiente para la rescisión de su contrato con el patrón, por lo que independientemente de las penas y reparación que el
                        patrón pueda exigir en términos del presente instrumento, esto no limitará las acciones que el patrón o el tercero afectado contra el trabajador.
                        Las partes del presente convenio manifiestan haber leído, entendido sus alcances legales y aceptado lo contenido en las declaraciones y cláusulas
                        que constituyen el presente instrumento jurídico y manifiestan que no existe dolo o mala fe en su celebración, dejando sin efecto cualquier
                        acuerdo o negociación sostenido por ellas previamente, prevaleciendo lo dispuesto en el presente instrumento, acordando para la interpretación
                        y cumplimiento del presente convenio, las partes se someten a la jurisdicción de los tribunales competentes en la ciudad de Guadalajara, Jalisco,
                        renunciando expresamente al fuero que por cual quiere cosa les pudiera corresponderles.
                    </Text>
                </View>
            </Page>

            <Page size="LETTER" style={styles.page}>
                <Text style={styles.title}>
                    CONVENIO DE CONFIDENCIALIDAD
                    ENTRE EL PATRON Y EL TRABAJADOR.
                </Text>

                {/* Fecha y lugar */}
                <View style={styles.paragraph}>
                    <Text>
                        Se firma, por duplicado, en <Text style={styles.underline}>{city}</Text> municipio de 
                        <Text style={styles.underline}> {municipality}</Text>, a los <Text style={styles.underline}>{day}</Text> 
                        días del mes de <Text style={styles.underline}>{month}</Text> del Año <Text style={styles.underline}>{year}</Text>. 
                        Quedando un ejemplar de poder de cada una de las partes.
                    </Text>
                </View>

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
                <View style={styles.signatureSection}>
                    {/* Huella del Trabajador */}
                    <View style={styles.signatureBox}>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureText}>HUELLA del trabajador</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};