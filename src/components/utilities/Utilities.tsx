import { useState } from "react";
import { PdfUtilitiesRDC } from "./PdfUtilitiesRDC";
import { pdf } from '@react-pdf/renderer';
import toast from "react-hot-toast";

export const Utilities = () => {
  const [activeReport, setActiveReport] = useState<string>('rpc');
  const [formData, setFormData] = useState({
    fechaProblema: '',
    nombreCliente: '',
    telefono: '',
    nombreMascota: '',
    telefonoCelular: '',
    raza: '',
    area: '',
    personal: '',
    retroalimentacion: '',
    planAccion: '',
    responsable: '',
    comoResolver: '',
    contactoCliente: '',
    pasosResolver: '',
    quejaResuelta: 'SI',
    costoArea: '',
    observaciones: '',
    firmaGerente: '',
  });

  const reportTypes = [
    { id: 'rpc', title: 'Reporte de Problema del Cliente', icon: '👤', description: 'Problemas o quejas de clientes' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearForm = () => {
    setFormData({
      fechaProblema: '',
      nombreCliente: '',
      telefono: '',
      nombreMascota: '',
      telefonoCelular: '',
      raza: '',
      area: '',
      personal: '',
      retroalimentacion: '',
      planAccion: '',
      responsable: '',
      comoResolver: '',
      contactoCliente: '',
      pasosResolver: '',
      quejaResuelta: 'SI',
      costoArea: '',
      observaciones: '',
      firmaGerente: '',
    });
  };

  const loadExampleData = () => {
    setFormData({
      ...formData,
      fechaProblema: '18/12/2025',
      nombreCliente: 'ADRIANA ORLAINETA',
      telefono: '555-1234',
      nombreMascota: 'RICKY',
      telefonoCelular: '555-9876',
      raza: 'Yorkie',
      area: 'RECEPCIÓN',
      personal: 'ALICIA GOMEZ',
      retroalimentacion: 'La señora Adriana Orlaineta comenta que envió un mensaje pidiendo una cita para baño y corte de su mascota llamada Ricky NHC 7382 el día jueves 11/12/2025, le respondieron que el día jueves 18/12/2025 podría agendarlo a las 10am...',
      planAccion: '18/12/2025',
      responsable: 'Mayte colli',
      comoResolver: 'Mayte se dirige a su jefe directo que es marco chable y le comenta dicho caso responde que tiene que comunicarse con el cliente y explicarle que fue error de nosotros y que se le dará el corte sin costo alguno.',
      contactoCliente: '17/12/2025',
      pasosResolver: 'Mayte le marca a la clienta pidiendo de antemano una disculpa y aceptando que fue error de nosotros y comentando que si ella gusta le podemos agendar a su mascota el dia 24/12/2025 alas 9:30 para su corte, la señora aceptó sin problema.',
      quejaResuelta: 'SI',
      costoArea: '250.00',
      observaciones: 'Cuidar que no vuelva a pasar lo ocurrido reforzando con qvet.',
      firmaGerente: 'Marcos Chable',
    });
  };

  const getPDFComponent = () => {
    switch (activeReport) {
      case 'rpc':
        return <PdfUtilitiesRDC data={formData} />;
      default:
        return <PdfUtilitiesRDC data={formData} />;
    }
  };

  const getFileName = () => {
    const baseName = formData.nombreCliente 
      ? `Reporte_${formData.nombreCliente.replace(/\s+/g, '_')}`
      : `Reporte_${activeReport.toUpperCase()}`;
    return `${baseName}_${new Date().toISOString().slice(0, 10)}.pdf`;
  };

  // Función para descargar el PDF usando Blob
  const downloadPDF = async () => {
    try {
      const pdfComponent = getPDFComponent();
      const blob = await pdf(pdfComponent).toBlob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = getFileName();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar el objeto URL después de un tiempo
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al generar el PDF: ${errorMessage}`);
    }
  };

  const renderRPCForm = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reporte de Problema del Cliente (RPC)</h2>
        <div className="flex gap-3">
          <button
            onClick={clearForm}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Limpiar
          </button>
          <button
            onClick={loadExampleData}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Cargar Ejemplo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna 1 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha del problema <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="fechaProblema"
              value={formData.fechaProblema}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Cliente <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombreCliente"
              value={formData.nombreCliente}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: ADRIANA ORLAINETA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Teléfono fijo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Mascota <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombreMascota"
              value={formData.nombreMascota}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: RICKY"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Raza
            </label>
            <input
              type="text"
              name="raza"
              value={formData.raza}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Yorkie"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área <span className="text-red-500">*</span>
            </label>
            <select
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar área</option>
              <option value="RECEPCIÓN">RECEPCIÓN</option>
              <option value="ESTÉTICA">ESTÉTICA</option>
              <option value="CONSULTA">CONSULTA</option>
              <option value="LABORATORIO">LABORATORIO</option>
            </select>
          </div>
        </div>

        {/* Columna 2 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono celular
            </label>
            <input
              type="tel"
              name="telefonoCelular"
              value={formData.telefonoCelular}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Teléfono móvil"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Personal involucrado <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="personal"
              value={formData.personal}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: ALICIA GOMEZ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsable del plan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="responsable"
              value={formData.responsable}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Mayte colli"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costó al área ($)
            </label>
            <input
              type="number"
              name="costoArea"
              value={formData.costoArea}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Queja resuelta
            </label>
            <select
              name="quejaResuelta"
              value={formData.quejaResuelta}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="SI">Sí</option>
              <option value="NO">No</option>
              <option value="EN PROCESO">En proceso</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Firma del gerente
            </label>
            <input
              type="text"
              name="firmaGerente"
              value={formData.firmaGerente}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre del gerente responsable"
            />
          </div>
        </div>
      </div>

      {/* Áreas de texto grandes */}
      <div className="mt-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Retroalimentación del cliente <span className="text-red-500">*</span>
          </label>
          <textarea
            name="retroalimentacion"
            value={formData.retroalimentacion}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describa detalladamente la queja o problema reportado por el cliente..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cómo se va a resolver el problema
          </label>
          <textarea
            name="comoResolver"
            value={formData.comoResolver}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describa el plan de acción para resolver el problema..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pasos seguidos para resolver
          </label>
          <textarea
            name="pasosResolver"
            value={formData.pasosResolver}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describa los pasos específicos tomados para resolver la queja..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones adicionales
          </label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cualquier observación adicional o comentario..."
          />
        </div>
      </div>

      {/* Botón de descarga PDF - VERSIÓN BLOB */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-end">
          <button
            onClick={downloadPDF}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Descargar Reporte PDF
          </button>
        </div>
      </div>
    </div>
  );

  const renderForm = () => {
    switch (activeReport) {
      case 'rpc':
        return renderRPCForm();
      default:
        return renderRPCForm();
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full min-h-screen p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Generador de Reportes</h1>
          <p className="text-gray-600 mt-2">Seleccione el tipo de reporte que desea generar</p>
        </div>

        {/* Botones de tipos de reporte */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              className={`p-5 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 ${
                activeReport === report.id
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-2 ring-blue-300'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl mb-3">{report.icon}</span>
                <h3 className="font-semibold mb-1">{report.title}</h3>
                <p className={`text-sm ${activeReport === report.id ? 'text-blue-100' : 'text-gray-500'}`}>
                  {report.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Formulario activo */}
        {renderForm()}
      </div>
    </div>
  );
};