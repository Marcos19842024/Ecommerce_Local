import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ContractData } from '../../../interfaces/orgchartinteractive.interface';

// Registrar fuentes para mejor compatabilidad
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: '/fonts/Helvetica.ttf' },
    { src: '/fonts/Helvetica-Bold.ttf', fontWeight: 'bold' },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    lineHeight: 1.3,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 8,
    textAlign: 'justify',
  },
  clauseTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  clauseContent: {
    textAlign: 'justify',
    marginBottom: 6,
  },
  bold: {
    fontWeight: 'bold',
  },
  underline: {
    textDecoration: 'underline',
  },
  center: {
    textAlign: 'center',
  },
  signatureSection: {
    marginTop: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    borderTop: '1pt solid black',
    paddingTop: 8,
    textAlign: 'center',
    fontSize: 9,
  },
  table: {
    border: '1pt solid black',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 5,
    flex: 1,
  },
  listItem: {
    marginBottom: 3,
  },
  romanList: {
    marginLeft: 10,
    marginBottom: 3,
  },
  actividadItem: {
    marginBottom: 4,
    textAlign: 'justify',
  }
});

export const PdfEmploymentContract = ({ data }: { data: ContractData }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      {/* Encabezado del contrato */}
      <Text style={styles.title}>
        CONTRATO INDIVIDUAL DE TRABAJO POR TIEMPO
        <Text style={styles.bold}> {data.type}</Text>
      </Text>
      
      <Text style={styles.section}>
        CELEBRAN EL PRESENTE CONTRATO, POR UNA PARTE, EL PATRON "FRANCISCO JULIAN GOMEZ CANCINO" 
        Y POR LA OTRA EL TRABAJADOR "<Text style={styles.bold}>{data.trabajador}</Text>", 
        PERSONAS ANTES CITADAS, QUE EN FORMA CONJUNTA SE LE REFERIRÁ EN LO SUCESIVO EN ESTE 
        CONTRATO COMO "LAS PARTES", POR LO ANTES MANIFESTADO "LAS PARTES", SE OBLIGAN A LO 
        ACORDADO EN ESTE INSTRUMENTO JURIDICO AL TENOR DE LOS SIGUIENTES ANTECEDENTES Y CLÁUSULAS:
      </Text>

      <Text style={styles.clauseTitle}>A N T E C E D E N T E S</Text>

      <Text style={styles.clauseContent}>
        1.- EL PATRON declara, ser mexicano, mayor de edad y el legítimo propietario de LA FUENTE 
        DE TRABAJO referida en este instrumento jurídico. Así como ser su deseo de celebrar este 
        contrato, por requerir los servicios de personal apto para el desarrollo de sus actividades, 
        y de modo especial para el puesto o funciones descrito en este contrato.
      </Text>

      <Text style={styles.clauseContent}>
        2.- EL TRABAJADOR, manifiesta Bajo protesta de decir verdad, ser originario del estado de 
        <Text style={styles.bold}> {data.estadoOrigen}</Text>, mexicano, mayor de edad, con 
        <Text style={styles.bold}> CURP {data.curp}</Text> ser la persona que se indica en el acta 
        de nacimiento agregada a este contrato, así como ser el de la foto que se aprecia en las 
        copias fotostáticas de la identificación oficial vigente anexa a este instrumento, tener 
        su domicilio para recibir notificaciones que se aprecia en los recibos agregados y la 
        solicitud de trabajo adjuntos también a este contrato, con <Text style={styles.bold}>RFC: {data.rfc}</Text>, 
        Así como no consumir o ser adicto a droga alguna. De igual forma EL TRABAJADOR a manifiesta 
        estar conforme en desempeñar los requerimientos del PATRÓN y en aceptar las condiciones 
        generales de trabajo, las contenidas en el reglamento interior de trabajo, circulares, 
        el presente instrumento jurídico, manuales de operaciones, reglamentos de la fuente de 
        trabajo y demás documentos que contengan las obligaciones sobre las cuales prestará sus 
        servicios personales, por lo que es su deseo de celebrar este contrato, para prestar su 
        trabajo subordinado en los términos acordados en este instrumento jurídico.
      </Text>

      <Text style={styles.clauseContent}>
        3.- LAS PARTES declaran que tiene la capacidad y aptitudes para desarrollar las actividades 
        indicadas en los antecedentes que preceden y por ello se obligan en términos de las siguientes:
      </Text>

      <Text style={styles.clauseTitle}>C L Á U S U L A S</Text>

      {/* Cláusula PRIMERA */}
      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>PRIMERA.</Text> - Se denominará en lo sucesivo a la Ley Federal del Trabajo 
        como "LA LEY", al referirse al presente documento como "EL CONTRATO", y a los que suscriben como "LAS PARTES".
      </Text>

      {/* Cláusula SEGUNDA */}
      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>SEGUNDA.</Text> - Este "CONTRATO" se celebra por TIEMPO <Text style={styles.bold}>{data.type}</Text>
          {data.type === "DETERMINADO" && <Text style={styles.bold}> de ({data.duracionContrato} días)</Text>}  e 
        <Text style={styles.underline}> iniciará a la firma de este contrato.</Text>
      </Text>

      {/* Cláusula TERCERA */}
      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>TERCERA.</Text> Las actividades por realizar de "EL TRABAJADOR" consistirán 
        en realizar funciones que se especifican en este contrato y en el perfil del puesto anexo a este 
        contrato, las cuales manifiesta EL TRABAJADOR haber leido y entendido, por lo que se obliga a 
        realizar de forma subordinada a las órdenes del PATRON o de su personal que tenga para coordinar 
        tales actividades en la fuente de trabajo o sus sucursales.
      </Text>
      <Text style={styles.clauseContent}>
        De igual forma "EL TRABAJADOR" se obliga a realizar toda actividad de apoyo en todas las labores 
        generales que desarrolla la fuente de trabajo en todas las sucursales que tenga y demás funciones 
        a fines a lo antes mencionado en termino de lo acordado en este contrato.
      </Text>

      {/* Continuar con todas las cláusulas restantes... */}
      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>CUARTA.</Text> El lugar donde desempeñara sus actividades "EL TRABAJADOR" 
        será el domicilio de "EL PATRÓN" o en cualquier otra que le requiera "EL PATRÓN" en cualquiera de 
        las sucursales de conformidad a las necesidades que presente la FUENTE DE TRABAJO, por lo que "LAS PARTES" 
        convienen y aceptan que "EL TRABAJADOR" cuando por razones administrativas o de desarrollo de la 
        actividad sea necesario removerlo, podrá trasladarse al lugar que "EL PATRÓN" le asigne, siempre. 
        En este caso el "EL PATRÓN" le comunicará con anticipación la remoción del lugar de prestación de 
        servicios indicándole el nuevo lugar asignado.
      </Text>

      <Text style={styles.clauseContent}>
        Para el caso que en el nuevo lugar de prestación de servicios que le fuera asignado variará el 
        horario de labores, desde este momento "EL TRABAJADOR" acepta allanarse a dicha modalidad.
      </Text>
    </Page>

    <Page size="LETTER" style={styles.page}>
      {/* Encabezado del contrato */}
      <Text style={styles.title}>
        CONTRATO INDIVIDUAL DE TRABAJO POR TIEMPO
        <Text style={styles.bold}> {data.type}</Text>
      </Text>

      {/* Cláusula QUINTA */}
      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>QUINTA.</Text> - La duración de la jornada de trabajo y su día de descanso será 
        la señalada en este contrato.
      </Text>
      <Text style={styles.clauseContent}>
        Acordando las PARTES que cuando el horario de labores sea continuo "EL TRABAJADOR" tendrá derecho 
        al tiempo previsto por la ley federal del trabajo para tomar alimentos y le será computado dicho 
        periodo dentro de su jornada de trabajo.
      </Text>

      <Text style={styles.clauseContent}>
        "EL TRABAJADOR" únicamente podrá laborar tiempo extraordinario cuando "EL PATRÓN" se lo indique y 
        mediante orden por escrito, en la que señalará el día o los días y el horario en el cual se 
        desempeñará el mismo. Para el caso de computar el tiempo extraordinario laborado deberá "EL TRABAJADOR" 
        recabar y conservar la orden referida a fin de que en su momento quede debidamente pagado el tiempo 
        extra laborado; la falta de presentación de esa orden sólo es imputable a "EL TRABAJADOR". Las partes 
        manifiestan que salvo esta forma queda prohibido en el centro de trabajo laborar horas extras. Lo 
        anterior con apoyo en la tesis de jurisprudencia 16/94 de la Cuarta Sala de la Suprema Corte de 
        Justicia de la Nación.
      </Text>
      <Text style={styles.clauseContent}>
        En caso de existir en el establecimiento controles de asistencia por escrito, "EL TRABAJADOR" 
        registrará si inicio de jornada, salida tomar alimentos, su retorno, así como la conclusión de la jornada.
      </Text>

      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>SEXTA.</Text> - "EL TRABAJADOR" percibirá por el desempeño de su trabajo como salario diario la cantidad
        señalada en este contrato y referida en el perfil del puesto anexo a este contrato.
        Los cuáles serán cubiertos en efectivo en el centro de trabajo, por periodos semanales vencidos, al término de su jornada
        laboral, en el que se incluye el pago proporcional tanto del séptimo día o de descanso semanal a que se
        refiere el artículo 69 de la Ley Federal del Trabajo, como la correspondiente prima dominical.
      </Text>

      <Text style={styles.clauseContent}>
        "EL PATRÓN" hará por cuenta del “TRABAJADOR" las deducciones legales correspondientes, las
        aportaciones respecto a las prestaciones de ley y demás descuentos legales en los términos de las
        legislaciones respectivas. "EL TRABAJADOR" deberá cada vez que le sea pagado su salario extender a
        favor de "EL PATRÓN" el recibo correspondiente en los documentos que el mismo le presente para tales fines. 
      </Text>

      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>SEPTIMA.</Text> - "EL TRABAJADOR" tendrá derecho por cada seis días de labores a descansar uno con el
        pago de salario diario correspondiente.
      </Text>

      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>OCTAVA.</Text> - Queda establecida preferentemente como día de descanso el acordado con “EL PATRON”
        de conformidad a cualquiera de necesidades en las sucursales donde sea asignado para prestar los
        servicios “EL TRABAJADOR”, pudiendo ser cambiado el mismo.
      </Text>

      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>NOVENA.</Text> - "EL PATRÓN” pagará al TRABAJADOR las prestaciones de ley a las que tenga derecho. 
      </Text>

      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>DÉCIMA.</Text> - Quedan establecidos como días de descanso obligatorios con pago de salario íntegro los
        señalados en el artículo 74 de ''LA LEY''.
      </Text>

      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>DÉCIMA PRIMERA.</Text> - "EL TRABAJADOR" tendrá derecho a disfrutar de un periodo anual de vacaciones
        según lo establecido en el artículo 76 de "LA LEY".
      </Text>

      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>DÉCIMA SEGUNDA.</Text> - "EL TRABAJADOR" tendrá derecho a recibir por parte de "EL PATRÓN", el día 20
        de diciembre de cada año, el importe correspondiente a quince días de salario como pago del aguinaldo
        a que se refiere el artículo 87 de "LA LEY", o su parte proporcional por fracción de año.
      </Text>

      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>DÉCIMA TERCERA.</Text> - "EL TRABAJADOR" acepta someterse a los exámenes médicos que
        periódicamente establezca "EL PATRÓN" en los términos del artículo 134 fracción de "LA LEY", a fin de
        mantener en forma óptima sus facultades físicas e intelectuales, para el mejor desempeño de sus
        funciones. El médico que practique los reconocimientos será designado y retribuido por "EL PATRÓN".
      </Text>

      <Text style={styles.clauseContent}>
        "EL TRABAJADOR" SE OBLIGA A:
      </Text>

      <Text style={styles.clauseContent}>
        I.- Cumplir las disposiciones de las normas de trabajo que les sean aplicables, así como todas las
        disposiciones contenidas en las condiciones generales de trabajo, el reglamento interior, circulares, el
        presente instrumento jurídico, manuales de operaciones, reglamentos de la fuente de trabajo y demás
        documentos que contengan las obligaciones sobre las cuales prestará sus servicios personales;
      </Text>
    </Page>

    <Page size="LETTER" style={styles.page}>
      {/* Encabezado del contrato */}
      <Text style={styles.title}>
        CONTRATO INDIVIDUAL DE TRABAJO POR TIEMPO
        <Text style={styles.bold}> {data.type}</Text>
      </Text>

      <Text style={styles.clauseContent}>
        II. Observar las disposiciones contenidas en el reglamento y las normas oficiales mexicanas en materia
        de seguridad, salud y medio ambiente de trabajo, así como las que indiquen los patrones para su
        seguridad y protección personal;
      </Text>

      <Text style={styles.clauseContent}>
        III.- Desempeñar el servicio bajo la dirección del patrón o de su representante, a cuya autoridad estarán
        subordinados en todo lo concerniente al trabajo;
      </Text>

      <Text style={styles.clauseContent}>
        IV.- Ejecutar el trabajo con la intensidad, cuidado y esmero apropiados y en la forma, tiempo y lugar
        convenidos;
      </Text>

      <Text style={styles.clauseContent}>
        V.- Dar aviso inmediato al patrón, salvo caso fortuito o de fuerza mayor, de las causas justificadas que le
        impidan concurrir a su trabajo;
      </Text>

      <Text style={styles.clauseContent}>
        VI.- Restituir al patrón los materiales no usados y conservar en buen estado los instrumentos y útiles que
        les haya dado para el trabajo, no siendo responsables por el deterioro que origine el uso de estos objetos,
        ni del ocasionado por caso fortuito, fuerza mayor, o por mala calidad o defectuosa construcción;
      </Text>

      <Text style={styles.clauseContent}>
        VII.- Observar buenas costumbres durante el servicio;
      </Text>
      
      <Text style={styles.clauseContent}>
        VIII.- Prestar auxilios en cualquier tiempo que se necesiten, cuando por siniestro o riesgo inminente
        peligren las personas o los intereses del patrón o de sus compañeros de trabajo;
      </Text>

      <Text style={styles.clauseContent}>
        IX.- Integrar los organismos que establece esta Ley;
      </Text>

      <Text style={styles.clauseContent}>
        X.- Someterse a los reconocimientos médicos previstos en el reglamento interior y demás normas vigentes
        en la empresa o establecimiento, para comprobar que no padecen alguna incapacidad o enfermedad de
        trabajo, contagiosa o incurable; Así como para determinar si es adicto a droga alguna o padecimiento
        mental. 
      </Text>

      <Text style={styles.clauseContent}>
        XI. Poner en conocimiento del patrón las enfermedades contagiosas que padezcan, tan pronto como
        tengan conocimiento de las mismas;
      </Text>

      <Text style={styles.clauseContent}>
        XII. Comunicar al patrón o a su representante las deficiencias que adviertan, a fin de evitar daños o
        perjuicios a los intereses y vidas de sus compañeros de trabajo o de los patrones; y
      </Text>

      <Text style={styles.clauseContent}>
        XIII. Guardar escrupulosamente los secretos técnicos, comerciales y de fabricación de los productos a
        cuya elaboración concurran directa o indirectamente, o de los cuales tengan conocimiento por razón del
        trabajo que desempeñen, así como de los asuntos administrativos reservados, cuya divulgación pueda
        causar perjuicios a la empresa en términos de LA LEY y el CONVENIO DE CONFIDENCIALIDAD anexo
        a este contrato. 
      </Text>
  
      <Text style={styles.clauseContent}>
        Al TRABAJADOR LE QUEDA PROHIBIDO:
      </Text>
      
      <Text style={styles.clauseContent}>
        I. Ejecutar cualquier acto que pueda poner en peligro su propia seguridad, la de sus compañeros de
        trabajo o la de terceras personas, así como la de los establecimientos o lugares en que el trabajo se
        desempeñe;
      </Text>

      <Text style={styles.clauseContent}>
        II. Faltar al trabajo sin causa justificada o sin permiso del patrón;
      </Text>

      <Text style={styles.clauseContent}>
        III. Substraer de la empresa o establecimiento útiles de trabajo o materia prima o elaborada;
      </Text>

      <Text style={styles.clauseContent}>
        IV. Presentarse al trabajo en estado de embriaguez o bajo los efectos de cualquier droga o sustancia
        similar;
      </Text>

      <Text style={styles.clauseContent}>
        V. Presentarse al trabajo bajo la influencia de algún narcótico o droga enervante, salvo que exista
        prescripción médica. Antes de iniciar su servicio, el trabajador deberá poner el hecho en conocimiento del
        patrón y presentarle la prescripción suscrita por el médico;
      </Text>

      <Text style={styles.clauseContent}>
        VI. Portar armas de cualquier clase durante las horas de trabajo, salvo que la naturaleza de éste lo exija.
        Se exceptúan de esta disposición las punzantes y punzocortantes que formen parte de las herramientas
        o útiles propios del trabajo;
      </Text>

      <Text style={styles.clauseContent}>
        VII. Suspender las labores sin autorización del patrón;
      </Text>

      <Text style={styles.clauseContent}>
        VIII. Hacer colectas en el establecimiento o lugar de trabajo;
      </Text>

      <Text style={styles.clauseContent}>
        IX. Usar los útiles y herramientas suministrados por el patrón, para objeto distinto de aquél a que están
        destinados;
      </Text>

      <Text style={styles.clauseContent}>
        X. Hacer cualquier clase de propaganda en las horas de trabajo, dentro del establecimiento; y
      </Text>

      <Text style={styles.clauseContent}>
        XI. Acosar sexualmente a cualquier persona o realizar actos inmorales en los lugares de trabajo.
      </Text>
    </Page>
    
    <Page size="LETTER" style={styles.page}>
      {/* Encabezado del contrato */}
      <Text style={styles.title}>
        CONTRATO INDIVIDUAL DE TRABAJO POR TIEMPO
        <Text style={styles.bold}> {data.type}</Text>
      </Text>

      <Text style={styles.clauseContent}>
        XII. Usar su celular o cualquier otro aparato similar en horas de trabajo en su jornada laboral.
      </Text>

      <Text style={styles.clauseContent}>
        SON CAUSAS DE RESCISIÓN DE LA RELACIÓN DE TRABAJO, SIN RESPONSABILIDAD PARA EL PATRÓN:
      </Text>

      <Text style={styles.clauseContent}>
        I. Engañarlo el trabajador o en su caso, el sindicato que lo hubiese propuesto o recomendado con
        certificados falsos o referencias en los que se atribuyan al trabajador capacidad, aptitudes o facultades
        de que carezca. 
      </Text>

      <Text style={styles.clauseContent}>
        II. Incurrir el trabajador, durante sus labores, en faltas de probidad u honradez, en actos de violencia,
        amagos, injurias o malos tratamientos en contra del patrón, sus familiares o del personal directivo o
        administrativo de la empresa o establecimiento, o en contra de clientes y proveedores del patrón,
        salvo que medie provocación o que obre en defensa propia;
      </Text>

      <Text style={styles.clauseContent}>
        III. Cometer el trabajador contra alguno de sus compañeros, cualquiera de los actos enumerados en la
        fracción anterior, si como consecuencia de ellos se altera la disciplina del lugar en que se desempeña el
        trabajo;
      </Text>

      <Text style={styles.clauseContent}>
        IV. Cometer el trabajador, fuera del servicio, contra el patrón, sus familiares o personal directivo
        administrativo, alguno de los actos a que se refiere la fracción II, si son de tal manera graves que hagan
        imposible el cumplimiento de la relación de trabajo;
      </Text>

      <Text style={styles.clauseContent}>
        V. Ocasionar el trabajador, intencionalmente, perjuicios materiales durante el desempeño de las labores
        o con motivo de ellas, en los edificios, obras, maquinaria, instrumentos, materias primas y demás objetos
        relacionados con el trabajo;
      </Text>

      <Text style={styles.clauseContent}>
        VI. Ocasionar el trabajador los perjuicios de que habla la fracción anterior siempre que sean graves, sin
        dolo, pero con negligencia tal, que ella sea la causa única del perjuicio;
      </Text>

      <Text style={styles.clauseContent}>
        VII. Comprometer el trabajador, por su imprudencia o descuido inexcusable, la seguridad del
        establecimiento o de las personas que se encuentren en él;
      </Text>

      <Text style={styles.clauseContent}>
        VIII. Cometer el trabajador actos inmorales o de hostigamiento y/o acoso sexual contra cualquier persona
        en el establecimiento o lugar de trabajo;
      </Text>

      <Text style={styles.clauseContent}>
        IX. Revelar el trabajador los secretos de fabricación o dar a conocer asuntos de carácter reservado, con
        perjuicio de la empresa;
      </Text>

      <Text style={styles.clauseContent}>
        X. Tener el trabajador más de tres faltas de asistencia en un período de treinta días, sin permiso del patrón
        o sin causa justificada;
      </Text>

      <Text style={styles.clauseContent}>
        XI. Desobedecer el trabajador al patrón o a sus representantes, sin causa justificada, siempre que se trate
        del trabajo contratado;
      </Text>

      <Text style={styles.clauseContent}>
        XII. Negarse el trabajador a adoptar las medidas preventivas o a seguir los procedimientos indicados para
        evitar accidentes o enfermedades;
      </Text>

      <Text style={styles.clauseContent}>
        XIII. Concurrir el trabajador a sus labores en estado de embriaguez o bajo la influencia de algún narcótico
        o droga enervante, salvo que, en este último caso, exista prescripción médica. Antes de iniciar su servicio,
        el trabajador deberá poner el hecho en conocimiento del patrón y presentar la prescripción suscrita por el
        médico;
      </Text>

      <Text style={styles.clauseContent}>
        XIV. La sentencia ejecutoriada que imponga al trabajador una pena de prisión, que le impida el
        cumplimiento de la relación de trabajo;
      </Text>

      <Text style={styles.clauseContent}>
        XIV Bis. La falta de documentos que exijan las leyes y reglamentos, necesarios para la prestación del
        servicio cuando sea imputable al trabajador y que exceda del periodo a que se refiere la fracción IV del
        artículo 43; y
      </Text>

      <Text style={styles.clauseContent}>
        XV. Las análogas a las establecidas en las fracciones anteriores, de igual manera grave y de
        consecuencias semejantes en lo que al trabajo se refiere.
      </Text>

      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>DÉCIMA CUARTA.</Text> - "EL TRABAJADOR" deberá integrarse a los Planes, Programas y Comisiones Mixtas
        de Capacitación y Adiestramiento, así como a los de Seguridad e Higiene en el Trabajo que tiene
        constituidos "EL PATRÓN", tomando parte active dentro de los mismos según los cursos establecidos y
        medidas preventivas de riesgos de trabajo.
      </Text>

      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>DÉCIMA QUINTA.</Text> - "EL TRABAJADOR" deberá observar y cumplir todo lo contenido en el Reglamento
        Interior de Trabajo y demás reglamentos, manuales y demás disposiciones establecidas por el
        "EL PATRÓN" los cuales han sido enterado previamente al TRABAJADORR a la firma d este contrato. 
      </Text>
    </Page>
    
    <Page size="LETTER" style={styles.page}>
      {/* Encabezado del contrato */}
      <Text style={styles.title}>
        CONTRATO INDIVIDUAL DE TRABAJO POR TIEMPO
        <Text style={styles.bold}> {data.type}</Text>
      </Text>

      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>DÉCIMA SEXTA.</Text> - "EL TRABAJADOR" acepta y por ende queda establecido que cuando por razones
        convenientes para "EL PATRÓN" éste modifique el horario de trabajo, podrá desempeñar su jornada en
        el que quede establecido ya que sus actividades al servicio de "EL PATRÓN" son prioritarias y no se
        contraponen a otras que pudiere llegar a desarrollar.
      </Text>

      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>DÉCIMA SEPTIMA.</Text> - "EL TRABAJADOR", deberá dar fiel cumplimiento a las disposiciones contenidas en
        el artículo 134 de "LA LEY" y que corresponden a las obligaciones de los trabajadores en el desempeño
        de sus labores al servicio de "EL PATRÓN".
      </Text>

      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>DÉCIMA OCTAVA.</Text> - "EL TRABAJADOR" deberá presentarse puntualmente a sus labores en el horario de
        trabajo establecido, con su uniforme completo y demás requerimientos que le haga el PATRON y los
        requeridos en todas las disposiciones contenidas en las condiciones generales de trabajo, el reglamento
        interior, circulares, el presente instrumento jurídico, manuales de operaciones, reglamentos de la fuente
        de trabajo y demás documentos que contengan las obligaciones sobre las cuales prestará sus servicios
        personales; Así como firmar las listas de asistencia acostumbradas diariamente. En caso de retraso o
        falta de asistencia injustificada podrá "EL PATRÓN" imponerle cualquier corrección disciplinaria de las
        que contempla el Reglamento Interior de Trabajo o "LA LEY" o los reglamentos  y disposiciones contenidas
        en las condiciones generales de trabajo, el reglamento interior, circulares, el presente instrumento jurídico,
        manuales de operaciones, reglamentos de la fuente de trabajo y demás documentos que contengan las
        obligaciones sobre las cuales prestará sus servicios personales al respecto.
      </Text>

      <Text style={styles.clauseContent}>
        <Text style={styles.bold}>DÉCIMA NOVENA.</Text> - Para todo lo no previsto en el presente CONTRATO se estará a lo contenido en el
        Contrato Colectivo de Trabajo con que cuente "EL PATRÓN" o bien lo prescrito por "LA LEY" o el Contrato
        Ley respectivo en su caso, así como el Reglamento Interior de Trabajo y demás reglamentos que el
        PATRON establezca.
      </Text>

      {/* Salario */}
      <Text style={styles.clauseContent}>
        LAS PARTES acuerdan que el <Text style={styles.bold}>SALARIO DIARIO</Text> que percibirá "EL TRABAJADOR" 
        por lo convenido en este contrato será de: <Text style={styles.bold}>{data.salarioDiario}</Text> 
        ({data.salarioDiario} pesos m.n), haciendo un total <Text style={styles.bold}>SEMANAL</Text> de 
        <Text style={styles.bold}> {data.salarioSemanal}</Text> ({data.salarioSemanal} pesos m.n)
      </Text>

      <Text style={styles.clauseContent}>
        El PUESTO a desempeñar es: <Text style={styles.bold}>{data.puesto}</Text>
      </Text>

      {/* Tabla de actividades */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>
            ENTRE LAS ACTIVIDADES QUE REALIZARÁ "EL TRABAJADOR" consisten en realizar las funciones siguientes:
          </Text>
        </View>

        <View style={[styles.tableRow, {padding: 5}]}>
          <View style={styles.tableCell}>
            {data.actividades.map((actividad, index) => (
              <Text key={index} style={styles.actividadItem}>
                {String.fromCharCode(97 + index)}) {actividad}
              </Text>
            ))}
            <Text style={styles.actividadItem}>
              {String.fromCharCode(97 + data.actividades.length)}) Estas actividades no son limitativas.
            </Text>
          </View>
        </View>
      </View>
    </Page>
    
    <Page size="LETTER" style={styles.page}>
      {/* Encabezado del contrato */}
      <Text style={styles.title}>
        CONTRATO INDIVIDUAL DE TRABAJO POR TIEMPO
        <Text style={styles.bold}> {data.type}</Text>
      </Text>

      <Text style={styles.clauseContent}>
        La JORNADA DE TRABAJO que realizará "EL TRABAJADOR" será de 48 horas semanales, con el siguiente horario {"\n"}
        el cual puede cambiar de acuerdo a las necesidades del "PATRON":{"\n"}
        LUNES A VIERNES de 8 a 16 horas. Una semana y se rotará la semana que sigue de 12 a 20 horas.{"\n"}
        SABADO de 8 a 16 Hrs. Una semana y se rotará la semana que sigue de 9 a 17 Hrs.{"\n"}
        DOMINGO de 8 a 16 horas.{"\n"}
        Día de descanso Rotativo por guardia Sábado o Domingo.
      </Text>
      
      <Text> </Text>

      <Text> </Text>

      {/* Texto final */}
      <Text style={styles.clauseContent}>
        Leído que fue el presente contrato por quienes en él intervienen lo firman y ratifican, 
        enterados de su contenido lo suscriben por triplicado quedando el original en depósito 
        ante la junta de conciliación y arbitraje y las copias una vez registradas en poder de 
        cada parte. Se firma, por duplicado, en San Francisco de Campeche, en el Estado de 
        Campeche, a los <Text style={styles.bold}>{data.fechaContrato}</Text>. 
        Quedando un ejemplar de poder de cada una de las partes.
      </Text>

      {/* Sección de firmas */}
      <View style={styles.signatureSection}>
        <View style={styles.signatureBox}>
          <Text>PATRÓN Y PROPIETARIO DE LA FUENTE</Text>
          <Text>DE TRABAJO.</Text>
          <Text> </Text>
          <Text>FRANCISCO JULIAN GOMEZ CANCINO</Text>
        </View>
      </View>

      <View style={styles.signatureSection}>
        <View style={styles.signatureBox}>
          <Text>TRABAJADOR.</Text>
          <Text> </Text>
          <Text style={styles.bold}>{data.trabajador}</Text>
        </View>

        <View style={styles.signatureBox}>
          <Text>HUELLA del trabajador</Text>
        </View>
      </View>
    </Page>
  </Document>
);