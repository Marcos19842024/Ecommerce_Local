import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { Employee } from '../../interfaces/orgchartinteractive.interface';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    image: {
        width: 'auto',
        height: '3in',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    clinicName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    folderTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 50,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 15,
        textDecoration: 'underline',
    },
    workerData: {
        marginBottom: 15,
    },
    workerText: {
        fontSize: 11,
        marginBottom: 5,
        marginLeft: 10,
    },
    documentsSection: {
        marginTop: 10,
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
    },
    documentText: {
        fontSize: 11,
        flex: 1,
    },
});

// Componente para el documento PDF
export const PdfEmployeeRecord = ({ employeeData }: { employeeData: Employee }) => (
    <Document>
        <Page size="LETTER" style={styles.page}>
            {/* Imagen de la clínica (requiere tener la imagen en public/img) */}
            <Image
                src="./media/Logo.png"
                style={styles.image}
            />
            
            {/* Títulos */}
            <Text style={styles.clinicName}>Clínica Veterinaria Baalak'</Text>
            <Text style={styles.folderTitle}>Carpeta de Expediente del Personal</Text>
        
            {/* Sección de datos del trabajador */}
            <Text style={styles.sectionTitle}>Datos del Trabajador</Text>
            <View style={styles.workerData}>
                <Text style={styles.workerText}>
                <Text style={{fontWeight: 'bold'}}>Nombre completo: </Text>
                {employeeData.name}
                </Text>
                <Text style={styles.workerText}>
                <Text style={{fontWeight: 'bold'}}>Puesto: </Text>
                {employeeData.puesto}
                </Text>
                <Text style={styles.workerText}>
                <Text style={{fontWeight: 'bold'}}>Área/Departamento: </Text>
                {employeeData.area}
                </Text>
            </View>
        
            {/* Sección de documentos */}
            <Text style={styles.sectionTitle}>Documentos en el Expediente</Text>
            <View style={styles.documentsSection}>
                <View style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>Acta de nacimiento</Text>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>Alta del personal</Text>
                </View>
                
                <View style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>Identificación oficial</Text>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>Contrato laboral</Text>
                </View>
            
                <View style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>Comprobante de domicilio</Text>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>Autorización para la dispersión de nómina (APDN)</Text>
                </View>
            
                <View style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>CURP</Text>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>Acuerdo de confidencialidad</Text>
                </View>
                
                <View style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>RFC</Text>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>Código de ética</Text>
                </View>
            
                <View style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>Número de seguro social</Text>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>Reglamento interno de bienestar animal (RIBA)</Text>
                </View>
                
                <View style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>Solicitud de Empleo</Text>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>Reglamento interior de trabajo (RIT)</Text>
                </View>
            
                <View style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>Constancias / Certificados</Text>
                <View style={styles.checkbox} />
                <Text style={styles.documentText}>Perfil de puesto</Text>
                </View>
            </View>
        </Page>
    </Document>
);