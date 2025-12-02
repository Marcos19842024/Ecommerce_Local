import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { PersonalFormData } from '../../../interfaces/orgchartinteractive.interface';

// Registrar fuentes
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

// Estilos optimizados para una sola página
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontSize: 9,
    fontFamily: 'Helvetica',
    lineHeight: 1.3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
    paddingBottom: 2,
    borderBottom: '1pt solid #2563eb',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: '#1e293b',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#334155',
    marginBottom: 8,
    marginTop: 10,
    paddingBottom: 2,
    borderBottom: '1pt solid #e2e8f0',
  },
  logoContainer: {
    width: 50,
    height: 35,
    marginLeft: 15,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  rowLabel: {
    width: '30%',
    fontWeight: 600,
    color: '#475569',
    paddingRight: 8,
    fontSize: 9,
  },
  rowValue: {
    width: '70%',
    color: '#0f172a',
    fontWeight: 400,
    fontSize: 9,
  },
  table: {
    display: 'flex',
    width: '100%',
    marginBottom: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    minHeight: 20,
  },
  tableColHeader: {
    width: '25%',
    backgroundColor: '#f1f5f9',
    padding: 4,
    fontWeight: 600,
    fontSize: 8,
    color: '#334155',
    borderRightWidth: 1,
    borderRightColor: '#cbd5e1',
  },
  tableCol: {
    width: '25%',
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#cbd5e1',
    fontSize: 9,
  },
  tableColHeaderLast: {
    width: '25%',
    backgroundColor: '#f1f5f9',
    padding: 4,
    fontWeight: 600,
    fontSize: 8,
    color: '#334155',
  },
  tableColLast: {
    width: '25%',
    padding: 4,
    fontSize: 9,
  },
  fullWidthCell: {
    width: '100%',
    padding: 4,
    fontSize: 9,
  },
  fullWidthHeader: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    padding: 4,
    fontWeight: 600,
    fontSize: 8,
    color: '#334155',
  },
  twoColHeader: {
    width: '50%',
    backgroundColor: '#f1f5f9',
    padding: 4,
    fontWeight: 600,
    fontSize: 8,
    color: '#334155',
    borderRightWidth: 1,
    borderRightColor: '#cbd5e1',
  },
  twoCol: {
    width: '50%',
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#cbd5e1',
    fontSize: 9,
  },
  twoColLast: {
    width: '50%',
    padding: 4,
    fontSize: 9,
  },
  generationDate: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 3,
  },
  compactSection: {
    marginBottom: 2,
  }
});

// Función para formatear la fecha
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Componente para el PDF optimizado para una página
export const PdfStaffRecruitment = ({ data }: { data: PersonalFormData }) => {
  
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Encabezado con logo */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Alta del Personal</Text>
          </View>
          <View style={styles.logoContainer}>
            <Image 
              style={styles.logo} 
              src="./media/Logo Small.png"
            />
          </View>
        </View>

        {/* Información básica - más compacta */}
        <View style={styles.compactSection}>
          <Text style={styles.subtitle}>Información Básica</Text>
          
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}><Text>Nombre(s)</Text></View>
              <View style={styles.tableColHeader}><Text>Apellido Paterno</Text></View>
              <View style={styles.tableColHeaderLast}><Text>Apellido Materno</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text>{data.nombres || '-'}</Text></View>
              <View style={styles.tableCol}><Text>{data.apellidoPaterno || '-'}</Text></View>
              <View style={styles.tableColLast}><Text>{data.apellidoMaterno || '-'}</Text></View>
            </View>
          </View>
        </View>

        {/* Domicilio - más compacto */}
        <View style={styles.compactSection}>
          <Text style={styles.subtitle}>Domicilio</Text>
          
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}><Text>Calle</Text></View>
              <View style={styles.tableColHeader}><Text>Número</Text></View>
              <View style={styles.tableColHeader}><Text>Colonia</Text></View>
              <View style={styles.tableColHeaderLast}><Text>C.P.</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text>{data.domicilio.calle || '-'}</Text></View>
              <View style={styles.tableCol}><Text>{data.domicilio.numero || '-'}</Text></View>
              <View style={styles.tableCol}><Text>{data.domicilio.colonia || '-'}</Text></View>
              <View style={styles.tableColLast}><Text>{data.domicilio.cp || '-'}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, {width: '50%'}]}><Text>Ciudad</Text></View>
              <View style={[styles.tableColHeaderLast, {width: '50%'}]}><Text>Estado</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, {width: '50%'}]}><Text>{data.domicilio.ciudad || '-'}</Text></View>
              <View style={[styles.tableColLast, {width: '50%'}]}><Text>{data.domicilio.estado || '-'}</Text></View>
            </View>
          </View>
        </View>

        {/* Datos personales - optimizado */}
        <View style={styles.compactSection}>
          <Text style={styles.subtitle}>Datos Personales</Text>
          
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}><Text>Celular</Text></View>
              <View style={styles.tableColHeader}><Text>RFC</Text></View>
              <View style={styles.tableColHeader}><Text>Nacimiento</Text></View>
              <View style={styles.tableColHeaderLast}><Text>CURP</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text>{data.datosPersonales.celular || '-'}</Text></View>
              <View style={styles.tableCol}><Text>{data.datosPersonales.rfc || '-'}</Text></View>
              <View style={styles.tableCol}><Text>{formatDate(data.datosPersonales.fechaNacimiento) || '-'}</Text></View>
              <View style={styles.tableColLast}><Text>{data.datosPersonales.curp || '-'}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}><Text>Ciudad nac.</Text></View>
              <View style={styles.tableColHeader}><Text>Estado nac.</Text></View>
              <View style={styles.tableColHeader}><Text>N° IMSS</Text></View>
              <View style={styles.tableColHeaderLast}><Text>Ingreso</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text>{data.datosPersonales.ciudadNacimiento || '-'}</Text></View>
              <View style={styles.tableCol}><Text>{data.datosPersonales.estadoNacimiento || '-'}</Text></View>
              <View style={styles.tableCol}><Text>{data.datosPersonales.numeroIMSS || '-'}</Text></View>
              <View style={styles.tableColLast}><Text>{formatDate(data.datosPersonales.fechaIngreso) || '-'}</Text></View>
            </View>
          </View>
        </View>

        {/* Datos familiares - optimizado */}
        <View style={styles.compactSection}>
          <Text style={styles.subtitle}>Datos Familiares</Text>
          
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.twoColHeader}><Text>Cónyuge</Text></View>
              <View style={styles.twoColHeader}><Text>Estado</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.twoCol}><Text>{data.datosFamiliares.nombreConyuge || '-'}</Text></View>
              <View style={styles.twoColLast}><Text>{data.datosFamiliares.estado || '-'}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}><Text>Colonia</Text></View>
              <View style={styles.tableColHeader}><Text>C.P.</Text></View>
              <View style={styles.tableColHeader}><Text>Ciudad</Text></View>
              <View style={styles.tableColHeaderLast}><Text>Estado</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text>{data.datosFamiliares.colonia || '-'}</Text></View>
              <View style={styles.tableCol}><Text>{data.datosFamiliares.cp || '-'}</Text></View>
              <View style={styles.tableCol}><Text>{data.datosFamiliares.ciudad || '-'}</Text></View>
              <View style={styles.tableColLast}><Text>{data.datosFamiliares.estado || '-'}</Text></View>
            </View>
          </View>
        </View>

        {/* Datos de emergencia - optimizado */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Datos de Emergencia</Text>
          
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.fullWidthHeader}><Text>Persona 1</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.fullWidthCell}><Text>{data.datosEmergencia.persona1.nombre || '-'}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}><Text>Celular</Text></View>
              <View style={styles.tableColHeaderLast}><Text>Parentesco</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text>{data.datosEmergencia.persona1.celular || '-'}</Text></View>
              <View style={styles.tableColLast}><Text>{data.datosEmergencia.persona1.parentesco || '-'}</Text></View>
            </View>
            
            <View style={[styles.tableRow, { marginTop: 5 }]}>
              <View style={styles.fullWidthHeader}><Text>Persona 2</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.fullWidthCell}><Text>{data.datosEmergencia.persona2.nombre || '-'}</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}><Text>Celular</Text></View>
              <View style={styles.tableColHeaderLast}><Text>Parentesco</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text>{data.datosEmergencia.persona2.celular || '-'}</Text></View>
              <View style={styles.tableColLast}><Text>{data.datosEmergencia.persona2.parentesco || '-'}</Text></View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};