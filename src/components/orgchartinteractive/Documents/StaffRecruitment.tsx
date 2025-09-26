import React, { useState } from 'react';
import { PersonalFormData, StaffRecruitmentProps } from '../../../interfaces/orgchartinteractive.interface';
import { url } from '../../../server/url';
import { pdf } from '@react-pdf/renderer';
import { PdfStaffRecruitment } from '../PdfDocuments/PdfStaffRecruitment';
import toast from 'react-hot-toast';

const StaffRecruitment = ({employee, onClose}: StaffRecruitmentProps) => {

  // Función para dividir el nombre completo si es necesario
  const splitFullName = (fullName: string) => {
    if (!fullName) return { nombres: '', apellidoPaterno: '', apellidoMaterno: '' };
    
    const nameParts = fullName.trim().split(' ');
    
    if (nameParts.length === 1) {
      return { nombres: nameParts[0], apellidoPaterno: '', apellidoMaterno: '' };
    }
    
    if (nameParts.length === 2) {
      return { nombres: nameParts[0], apellidoPaterno: nameParts[1], apellidoMaterno: '' };
    }
    
    // Para 3 o más partes, asumimos que el último es apellido materno, el anterior paterno y el resto nombres
    const apellidoMaterno = nameParts.pop() || '';
    const apellidoPaterno = nameParts.pop() || '';
    const nombres = nameParts.join(' ');
    
    return { nombres, apellidoPaterno, apellidoMaterno };
  };

  const { nombres, apellidoPaterno, apellidoMaterno } = splitFullName(employee.name)

  const [formData, setFormData] = useState<PersonalFormData>({
    nombres,
    apellidoPaterno,
    apellidoMaterno,
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

  const handleGeneratePdf = async () => {
    try {
      const blob = await pdf(<PdfStaffRecruitment data={formData} />).toBlob();
      const formDataUpload = new FormData();
      formDataUpload.append('file', blob, "Alta del personal.pdf");
      
      const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(employee.name)}`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) throw new Error("Error al guardar en el servidor");

      toast.success("Alta del personal.pdf creado correctamente");
      onClose(); // Cerrar el modal después de generar
    } catch (error) {
      toast.error("Error al generar el Alta de personal.pdf");
    }
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
              <label 
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="nombres">Nombre(s)
              </label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="apellidoPaterno">Apellido Paterno
              </label>
              <input
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="apellidoMaterno">Apellido Materno
              </label>
              <input
                type="text"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        </div>

        {/* Domicilio */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Domicilio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="domicilio.calle">Calle
              </label>
              <input
                type="text"
                name="domicilio.calle"
                value={formData.domicilio.calle}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="domicilio.numero">Número
              </label>
              <input
                type="text"
                name="domicilio.numero"
                value={formData.domicilio.numero}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label 
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="domicilio.colonia">Colonia
              </label>
              <input
                type="text"
                name="domicilio.colonia"
                value={formData.domicilio.colonia}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="domicilio.cp">C.P.
              </label>
              <input
                type="text"
                name="domicilio.cp"
                value={formData.domicilio.cp}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="domicilio.ciudad">Ciudad
              </label>
              <input
                type="text"
                name="domicilio.ciudad"
                value={formData.domicilio.ciudad}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="domicilio.estado">Estado
              </label>
              <input
                type="text"
                name="domicilio.estado"
                value={formData.domicilio.estado}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        </div>

        {/* Datos personales */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Datos Personales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="datosPersonales.celular">Número de celular
              </label>
              <input
                type="text"
                name="datosPersonales.celular"
                value={formData.datosPersonales.celular}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="datosPersonales.rfc">RFC
              </label>
              <input
                type="text"
                name="datosPersonales.rfc"
                value={formData.datosPersonales.rfc}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="datosPersonales.fechaNacimiento">Fecha de nacimiento
              </label>
              <input
                type="date"
                name="datosPersonales.fechaNacimiento"
                value={formData.datosPersonales.fechaNacimiento}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="datosPersonales.curp">CURP
              </label>
              <input
                type="text"
                name="datosPersonales.curp"
                value={formData.datosPersonales.curp}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="datosPersonales.ciudadNacimiento">Ciudad de nacimiento
              </label>
              <input
                type="text"
                name="datosPersonales.ciudadNacimiento"
                value={formData.datosPersonales.ciudadNacimiento}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="datosPersonales.estadoNacimiento">Estado de nacimiento
              </label>
              <input
                type="text"
                name="datosPersonales.estadoNacimiento"
                value={formData.datosPersonales.estadoNacimiento}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="datosPersonales.numeroIMSS">Número IMSS
              </label>
              <input
                type="text"
                name="datosPersonales.numeroIMSS"
                value={formData.datosPersonales.numeroIMSS}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="datosPersonales.fechaIngreso">Fecha de ingreso
              </label>
              <input
                type="date"
                name="datosPersonales.fechaIngreso"
                value={formData.datosPersonales.fechaIngreso}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        </div>

        {/* Datos familiares */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Datos Familiares</h2>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="datosFamiliares.nombreConyuge">Nombre del cónyuge
            </label>
            <input
              type="text"
              name="datosFamiliares.nombreConyuge"
              value={formData.datosFamiliares.nombreConyuge}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="datosFamiliares.colonia">Colonia
              </label>
              <input
                type="text"
                name="datosFamiliares.colonia"
                value={formData.datosFamiliares.colonia}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="datosFamiliares.cp">C.P.
              </label>
              <input
                type="text"
                name="datosFamiliares.cp"
                value={formData.datosFamiliares.cp}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="datosFamiliares.ciudad">Ciudad
              </label>
              <input
                type="text"
                name="datosFamiliares.ciudad"
                value={formData.datosFamiliares.ciudad}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label 
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="datosFamiliares.estado">Estado
              </label>
              <input
                type="text"
                name="datosFamiliares.estado"
                value={formData.datosFamiliares.estado}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
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
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="datosEmergencia.persona1.nombre">Nombre
                </label>
                <input
                  type="text"
                  name="datosEmergencia.persona1.nombre"
                  value={formData.datosEmergencia.persona1.nombre}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="datosEmergencia.persona1.celular">Número de celular
                </label>
                <input
                  type="text"
                  name="datosEmergencia.persona1.celular"
                  value={formData.datosEmergencia.persona1.celular}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="datosEmergencia.persona1.parentesco">Parentesco
              </label>
              <input
                type="text"
                name="datosEmergencia.persona1.parentesco"
                value={formData.datosEmergencia.persona1.parentesco}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Persona 2</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="datosEmergencia.persona2.nombre">Nombre
                </label>
                <input
                  type="text"
                  name="datosEmergencia.persona2.nombre"
                  value={formData.datosEmergencia.persona2.nombre}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="datosEmergencia.persona2.celular">Número de celular
                </label>
                <input
                  type="text"
                  name="datosEmergencia.persona2.celular"
                  value={formData.datosEmergencia.persona2.celular}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="datosEmergencia.persona2.parentesco">Parentesco
              </label>
              <input
                type="text"
                name="datosEmergencia.persona2.parentesco"
                value={formData.datosEmergencia.persona2.parentesco}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={handleGeneratePdf}
            className="bg-cyan-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-md"
          >
            Generar Pdf
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffRecruitment