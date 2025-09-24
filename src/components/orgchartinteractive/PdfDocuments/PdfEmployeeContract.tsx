import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ContractData } from '../../../interfaces/orgchartinteractive.interface';

// Opcional: Registrar fuentes si necesitas caracteres especiales
Font.register({ family: 'Arial', src: '/path/to/arial.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    lineHeight: 1.5,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  clauseTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  clauseContent: {
    textAlign: 'justify',
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
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    borderTop: '1pt solid black',
    paddingTop: 10,
    textAlign: 'center',
  },
  table: {
    border: '1pt solid black',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid black',
  },
  tableCell: {
    padding: 5,
    borderRight: '1pt solid black',
    flex: 1,
  },
  tableLastCell: {
    padding: 5,
    flex: 1,
  },
});

export const PdfEmployeeContract = ({ data }: { data: ContractData }) => (
    <Document>
        <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>CONTRATO LABORAL</Text>
        
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
            solicitud de trabajo adjuntos también a este contrato, con 
            <Text style={styles.bold}> RFC: {data.rfc}</Text>, Así como no consumir o ser adicto a 
            droga alguna. De igual forma EL TRABAJADOR a manifiesta estar conforme en desempeñar los 
            requerimientos del PATRÓN y en aceptar las condiciones generales de trabajo...
        </Text>

        <Text style={styles.clauseTitle}>C L Á U S U L A S</Text>

        <Text style={styles.clauseContent}>
            PRIMERA. - Se denominará en lo sucesivo a la Ley Federal del Trabajo como "LA LEY", al 
            referirse al presente documento como "EL CONTRATO", y a los que suscriben como "LAS PARTES".
        </Text>

        <Text style={styles.clauseContent}>
            SEGUNDA. - Este "CONTRATO" se celebra por TIEMPO <Text style={styles.bold}>DETERMINADO</Text> de 
            <Text style={styles.bold}> {data.duracionContrato}</Text> ({data.duracionContrato} días) e 
            <Text style={styles.underline}> iniciará a la firma de este contrato.</Text>
        </Text>

        {/* Continuar con las demás cláusulas... */}

        <Text style={styles.clauseContent}>
            LAS PARTES acuerdan que el <Text style={styles.bold}>SALARIO DIARIO</Text> que percibirá 
            "EL TRABAJADOR" por lo convenido en este contrato será de: 
            <Text style={styles.bold}> {data.salarioDiario}</Text> ({data.salarioDiario} pesos m.n), 
            haciendo un total <Text style={styles.bold}>SEMANAL</Text> de 
            <Text style={styles.bold}> {data.salarioSemanal}</Text> ({data.salarioSemanal} pesos m.n)
        </Text>

        <View style={styles.table}>
            <View style={styles.tableRow}>
            <Text style={styles.tableCell}>ENTRE LAS ACTIVIDADES QUE REALIZARÁ "EL TRABAJADOR" consisten en realizar las funciones son las siguientes:</Text>
            </View>
            <View style={styles.tableRow}>
            <Text style={styles.tableLastCell}>
                a) Realizar la limpieza y sanitización por las mañanas de las áreas de consultorios, sala de espera, recepción y oficinas.{"\n"}
                b) Mantener el área de pensión limpia y sanitizada.{"\n"}
                c) Mantener sanitarios limpios.{"\n"}
                {/* Continuar con las demás actividades... */}
            </Text>
            </View>
        </View>

        <Text style={styles.clauseContent}>
            El PUESTO a desempeñar es: <Text style={styles.bold}>AUXILIAR GENERAL</Text>
        </Text>

        <Text style={styles.clauseContent}>
            La JORNADA DE TRABAJO que realizará "EL TRABAJADOR" será de 48 horas semanales, con el siguiente horario:{"\n"}
            LUNES A VIERNES de 8 a 16 horas. Una semana y se rotará la semana que sigue de 12 a 20 horas.{"\n"}
            SABADO de 8 a 16 Hrs. Una semana y se rotará la semana que sigue de 9 a 17 Hrs.{"\n"}
            DOMINGO de 8 a 16 horas.{"\n"}
            Día de descanso Rotativo por guardia Sábado o Domingo.
        </Text>

        <Text style={styles.clauseContent}>
            Leído que fue el presente contrato por quienes en él intervienen lo firman y ratifican, 
            enterados de su contenido lo suscriben por triplicado quedando el original en depósito 
            ante la junta de conciliación y arbitraje y las copias una vez registradas en poder de 
            cada parte. Se firma, por duplicado, en San Francisco de Campeche, en el Estado de 
            Campeche, a los <Text style={styles.bold}>{data.fechaContrato}</Text>. 
            Quedando un ejemplar de poder de cada una de las partes.
        </Text>

        <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
            <Text>PATRÓN Y PROPIETARIO DE LA FUENTE DE TRABAJO.</Text>
            <Text>FRANCISCO JULIAN GOMEZ CANCINO</Text>
            </View>
            
            <View style={styles.signatureBox}>
            <Text>TRABAJADOR</Text>
            <Text style={styles.bold}>{data.trabajador}</Text>
            <Text>HUELLA del trabajador</Text>
            </View>
        </View>
        </Page>
    </Document>
);