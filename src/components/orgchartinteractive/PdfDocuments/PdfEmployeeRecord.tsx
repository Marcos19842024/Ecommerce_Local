import { Document, Page, Text, View, Image, StyleSheet, Path, Svg } from '@react-pdf/renderer';
import { Employee } from '../../../interfaces/orgchartinteractive.interface';

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
    checkboxContainer: {
        width: 10,
        height: 10,
        border: '1px solid black',
        marginRight: 5,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkImage: {
        width: 8,
        height: 8,
        position: 'absolute',
        top: 0,
        left: 0,
        color: 'black',
        fontWeight: 'bold',
    },
    documentText: {
        fontSize: 11,
        flex: 1,
        marginRight: 15,
    },
});

const PdfCheckmark = () => (
    <Svg width="8" height="8" viewBox="0 0 24 24">
        <Path 
            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" 
            fill="#000000"
            stroke="#000000"
            strokeWidth="1.2"
        />
    </Svg>
);

export const PdfEmployeeRecord = ({ employeeData, isChecked }: { employeeData: Employee, isChecked: Record<string, boolean> }) => (
    <Document>
        <Page size="LETTER" style={styles.page}>
            <Image
                src="./media/Logo.png"
                style={styles.image}
            />
            
            <Text style={styles.clinicName}>Clínica Veterinaria Baalak'</Text>
            <Text style={styles.folderTitle}>Carpeta de Expediente del Personal</Text>
        
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

            <Text style={styles.sectionTitle}>Documentos en el Expediente</Text>
            <View style={styles.documentsSection}>
                <View style={styles.checkboxRow}>
                    <View style={styles.checkboxContainer}>
                        {
                            isChecked['Acta de nacimiento.pdf'] &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>Acta de nacimiento</Text>
                    <View style={styles.checkboxContainer}>
                        {
                            isChecked['Alta del personal.pdf'] &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>Alta del personal</Text>
                </View>
                
                <View style={styles.checkboxRow}>
                    <View style={styles.checkboxContainer}>
                        {
                            isChecked['Identificacion oficial.pdf'] &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>Identificación oficial</Text>
                    <View style={styles.checkboxContainer}>
                        {
                            isChecked['Contrato laboral.pdf'] &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>Contrato laboral</Text>
                </View>
            
                <View style={styles.checkboxRow}>
                    <View style={styles.checkboxContainer}>
                        {
                            isChecked['Comprobante de domicilio.pdf'] &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>Comprobante de domicilio</Text>
                    <View style={styles.checkboxContainer}>
                        {
                            isChecked['APDN.pdf'] &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>Autorización para la dispersión de nómina (APDN)</Text>
                </View>
            
                <View style={styles.checkboxRow}>
                    <View style={styles.checkboxContainer}>
                        {
                            isChecked['CURP.pdf'] &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>CURP</Text>
                    <View style={styles.checkboxContainer}>
                        {
                            isChecked['Acuerdo de confidencialidad.pdf'] &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>Acuerdo de confidencialidad</Text>
                </View>
                
                <View style={styles.checkboxRow}>
                    <View style={styles.checkboxContainer}>
                        {
                            isChecked['RFC.pdf'] &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>RFC</Text>
                    <View style={styles.checkboxContainer}>
                        {
                            isChecked['Codigo de etica.pdf'] &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>Código de ética</Text>
                </View>
            
                <View style={styles.checkboxRow}>
                    <View style={styles.checkboxContainer}>
                        {
                            isChecked['NSS.pdf'] &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>Número de seguro social</Text>
                    <View style={styles.checkboxContainer}>
                        {
                            isChecked['RIBA.pdf'] &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>Reglamento interno de bienestar animal (RIBA)</Text>
                </View>
                
                <View style={styles.checkboxRow}>
                    <View style={styles.checkboxContainer}>
                        {
                            isChecked['Solicitud de empleo.pdf'] &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>Solicitud de Empleo</Text>
                    <View style={styles.checkboxContainer}>
                        {
                            isChecked['RIT.pdf'] &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>Reglamento interior de trabajo (RIT)</Text>
                </View>
            
                <View style={styles.checkboxRow}>
                    <View style={styles.checkboxContainer}>
                        {
                            (isChecked['Certificado de estudios.pdf'] || isChecked['Cedula profesional.pdf']) &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>Certificado de estudios / Cédula profesional</Text>
                    <View style={styles.checkboxContainer}>
                        {
                            isChecked['Perfil de puesto.pdf'] &&
                            <PdfCheckmark />
                        }
                    </View>
                    <Text style={styles.documentText}>Perfil de puesto</Text>
                </View>
            </View>
        </Page>
    </Document>
);