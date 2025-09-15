import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { PersonalFormData } from '../../interfaces/staffrecruitment.interface';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontSize: 10,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f3f4f6',
    padding: 5,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  }
});

// Componente para el PDF
export const PdfStaffRecruitment = ({ data }: { data: PersonalFormData }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Alta de Personal</Text>
        
        {/* Información básica */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Nombre(s)</Text></View>
            <View style={styles.tableColHeader}><Text>Apellido Paterno</Text></View>
            <View style={styles.tableColHeader}><Text>Apellido Materno</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text>{data.nombres}</Text></View>
            <View style={styles.tableCol}><Text>{data.apellidoPaterno}</Text></View>
            <View style={styles.tableCol}><Text>{data.apellidoMaterno}</Text></View>
          </View>
        </View>
        
        {/* Domicilio */}
        <Text style={{...styles.title, marginTop: 15}}>Domicilio</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Calle</Text></View>
            <View style={styles.tableColHeader}><Text>Número</Text></View>
            <View style={styles.tableColHeader}><Text>Colonia</Text></View>
            <View style={styles.tableColHeader}><Text>C.P.</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text>{data.domicilio.calle}</Text></View>
            <View style={styles.tableCol}><Text>{data.domicilio.numero}</Text></View>
            <View style={styles.tableCol}><Text>{data.domicilio.colonia}</Text></View>
            <View style={styles.tableCol}><Text>{data.domicilio.cp}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Ciudad</Text></View>
            <View style={styles.tableColHeader}><Text>Estado</Text></View>
            <View style={styles.tableCol}><Text></Text></View>
            <View style={styles.tableCol}><Text></Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text>{data.domicilio.ciudad}</Text></View>
            <View style={styles.tableCol}><Text>{data.domicilio.estado}</Text></View>
            <View style={styles.tableCol}><Text></Text></View>
            <View style={styles.tableCol}><Text></Text></View>
          </View>
        </View>
        
        {/* Datos personales */}
        <Text style={{...styles.title, marginTop: 15}}>Datos personales</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Número de celular</Text></View>
            <View style={styles.tableColHeader}><Text>RFC</Text></View>
            <View style={styles.tableColHeader}><Text>Fecha de nacimiento</Text></View>
            <View style={styles.tableColHeader}><Text>CURP</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text>{data.datosPersonales.celular}</Text></View>
            <View style={styles.tableCol}><Text>{data.datosPersonales.rfc}</Text></View>
            <View style={styles.tableCol}><Text>{data.datosPersonales.fechaNacimiento}</Text></View>
            <View style={styles.tableCol}><Text>{data.datosPersonales.curp}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Ciudad de nacimiento</Text></View>
            <View style={styles.tableColHeader}><Text>Estado de nacimiento</Text></View>
            <View style={styles.tableColHeader}><Text>Número IMSS</Text></View>
            <View style={styles.tableColHeader}><Text>Fecha de ingreso</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text>{data.datosPersonales.ciudadNacimiento}</Text></View>
            <View style={styles.tableCol}><Text>{data.datosPersonales.estadoNacimiento}</Text></View>
            <View style={styles.tableCol}><Text>{data.datosPersonales.numeroIMSS}</Text></View>
            <View style={styles.tableCol}><Text>{data.datosPersonales.fechaIngreso}</Text></View>
          </View>
        </View>
        
        {/* Datos familiares */}
        <Text style={{...styles.title, marginTop: 15}}>Datos familiares</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Nombre del cónyuge</Text></View>
            <View style={styles.tableCol}><Text>{data.datosFamiliares.nombreConyuge}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Colonia</Text></View>
            <View style={styles.tableColHeader}><Text>C.P.</Text></View>
            <View style={styles.tableColHeader}><Text>Ciudad</Text></View>
            <View style={styles.tableColHeader}><Text>Estado</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text>{data.datosFamiliares.colonia}</Text></View>
            <View style={styles.tableCol}><Text>{data.datosFamiliares.cp}</Text></View>
            <View style={styles.tableCol}><Text>{data.datosFamiliares.ciudad}</Text></View>
            <View style={styles.tableCol}><Text>{data.datosFamiliares.estado}</Text></View>
          </View>
        </View>
        
        {/* Datos de emergencia */}
        <Text style={{...styles.title, marginTop: 15}}>Datos de emergencia</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Persona 1</Text></View>
            <View style={styles.tableCol}><Text>{data.datosEmergencia.persona1.nombre}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Número de celular</Text></View>
            <View style={styles.tableColHeader}><Text>Parentesco</Text></View>
            <View style={styles.tableCol}><Text></Text></View>
            <View style={styles.tableCol}><Text></Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text>{data.datosEmergencia.persona1.celular}</Text></View>
            <View style={styles.tableCol}><Text>{data.datosEmergencia.persona1.parentesco}</Text></View>
            <View style={styles.tableCol}><Text></Text></View>
            <View style={styles.tableCol}><Text></Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Persona 2</Text></View>
            <View style={styles.tableCol}><Text>{data.datosEmergencia.persona2.nombre}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Número de celular</Text></View>
            <View style={styles.tableColHeader}><Text>Parentesco</Text></View>
            <View style={styles.tableCol}><Text></Text></View>
            <View style={styles.tableCol}><Text></Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text>{data.datosEmergencia.persona2.celular}</Text></View>
            <View style={styles.tableCol}><Text>{data.datosEmergencia.persona2.parentesco}</Text></View>
            <View style={styles.tableCol}><Text></Text></View>
            <View style={styles.tableCol}><Text></Text></View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const PersonalForm: React.FC = () => {
  const [formData, setFormData] = useState<PersonalFormData>({
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    domicilio: {
      calle: '',
      numero: '',
      colonia: '',
      cp: '',
      ciudad: '',
      estado: ''
    },
    datosPersonales: {
      celular: '',
      rfc: '',
      fechaNacimiento: '',
      curp: '',
      ciudadNacimiento: '',
      estadoNacimiento: '',
      numeroIMSS: '',
      fechaIngreso: ''
    },
    datosFamiliares: {
      nombreConyuge: '',
      colonia: '',
      cp: '',
      ciudad: '',
      estado: ''
    },
    datosEmergencia: {
      persona1: {
        nombre: '',
        celular: '',
        parentesco: ''
      },
      persona2: {
        nombre: '',
        celular: '',
        parentesco: ''
      }
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      
      if (subChild) {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...((prev[parent as keyof PersonalFormData] ?? {}) as object),
            [child]: {
              ...(prev[parent as keyof PersonalFormData] as any)[child],
              [subChild]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...((prev[parent as keyof PersonalFormData] ?? {}) as object),
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleGeneratePDF = async () => {
    const blob = await pdf(<PdfStaffRecruitment data={formData} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Alta de Personal</h1>
      
      <form className="bg-white p-6 rounded-lg shadow-md">
        {/* Información básica */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
              <input
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
              <input
                type="text"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Domicilio */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Domicilio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calle</label>
              <input
                type="text"
                name="domicilio.calle"
                value={formData.domicilio.calle}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input
                type="text"
                name="domicilio.numero"
                value={formData.domicilio.numero}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Colonia</label>
              <input
                type="text"
                name="domicilio.colonia"
                value={formData.domicilio.colonia}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">C.P.</label>
              <input
                type="text"
                name="domicilio.cp"
                value={formData.domicilio.cp}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <input
                type="text"
                name="domicilio.ciudad"
                value={formData.domicilio.ciudad}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <input
                type="text"
                name="domicilio.estado"
                value={formData.domicilio.estado}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Datos personales */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Datos Personales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de celular</label>
              <input
                type="text"
                name="datosPersonales.celular"
                value={formData.datosPersonales.celular}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RFC</label>
              <input
                type="text"
                name="datosPersonales.rfc"
                value={formData.datosPersonales.rfc}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
              <input
                type="date"
                name="datosPersonales.fechaNacimiento"
                value={formData.datosPersonales.fechaNacimiento}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CURP</label>
              <input
                type="text"
                name="datosPersonales.curp"
                value={formData.datosPersonales.curp}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad de nacimiento</label>
              <input
                type="text"
                name="datosPersonales.ciudadNacimiento"
                value={formData.datosPersonales.ciudadNacimiento}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado de nacimiento</label>
              <input
                type="text"
                name="datosPersonales.estadoNacimiento"
                value={formData.datosPersonales.estadoNacimiento}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número IMSS</label>
              <input
                type="text"
                name="datosPersonales.numeroIMSS"
                value={formData.datosPersonales.numeroIMSS}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de ingreso</label>
              <input
                type="date"
                name="datosPersonales.fechaIngreso"
                value={formData.datosPersonales.fechaIngreso}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Datos familiares */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Datos Familiares</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del cónyuge</label>
            <input
              type="text"
              name="datosFamiliares.nombreConyuge"
              value={formData.datosFamiliares.nombreConyuge}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Colonia</label>
              <input
                type="text"
                name="datosFamiliares.colonia"
                value={formData.datosFamiliares.colonia}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">C.P.</label>
              <input
                type="text"
                name="datosFamiliares.cp"
                value={formData.datosFamiliares.cp}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <input
                type="text"
                name="datosFamiliares.ciudad"
                value={formData.datosFamiliares.ciudad}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <input
                type="text"
                name="datosFamiliares.estado"
                value={formData.datosFamiliares.estado}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Datos de emergencia */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Datos de Emergencia</h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Persona 1</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="datosEmergencia.persona1.nombre"
                  value={formData.datosEmergencia.persona1.nombre}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de celular</label>
                <input
                  type="text"
                  name="datosEmergencia.persona1.celular"
                  value={formData.datosEmergencia.persona1.celular}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parentesco</label>
              <input
                type="text"
                name="datosEmergencia.persona1.parentesco"
                value={formData.datosEmergencia.persona1.parentesco}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Persona 2</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="datosEmergencia.persona2.nombre"
                  value={formData.datosEmergencia.persona2.nombre}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de celular</label>
                <input
                  type="text"
                  name="datosEmergencia.persona2.celular"
                  value={formData.datosEmergencia.persona2.celular}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parentesco</label>
              <input
                type="text"
                name="datosEmergencia.persona2.parentesco"
                value={formData.datosEmergencia.persona2.parentesco}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={handleGeneratePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
          >
            Generar PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalForm;