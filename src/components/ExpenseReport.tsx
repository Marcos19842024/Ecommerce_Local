import { useState, DragEvent, useMemo } from "react";
import { formatString } from "../helpers";
import { FiEdit } from "react-icons/fi";
import { BsFiletypePdf, BsFiletypeXml } from "react-icons/bs";
import { CgCalendarNext } from "react-icons/cg";
import { TfiLayoutListThumbAlt } from "react-icons/tfi";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { FormValues, SelectValues } from "../interfaces/report.interface";
import { PiAppWindowBold } from "react-icons/pi";
import { TfiPrinter } from "react-icons/tfi";
import { PdfViewer } from "../components/PdfViewer";
import FilePreviewModal from "./FilePreviewModal";
import { url } from "../server/url";
import { pdf } from "@react-pdf/renderer";
import { PdfExpense } from "./PdfExpense";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

// Constantes globales
const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const ExpenseReport = () => {
  const [showPdf, setShowPdf] = useState(false);
  const [errores, setErrores] = useState<{ [key: string]: boolean }>({});
  const [rows, setRows] = useState<FormValues[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [send, setSend] = useState(true);
  const [download, setDownload] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<{ url: string; type: "pdf" | "xml" } | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [xmlPreview, setXmlPreview] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({
    fecha: "",
    factura: "",
    proveedor: "",
    concepto: "",
    subtotal: null,
    descuento: null,
    iva: null,
    total: null,
  });
  const [selectValues, setSelectValues] = useState<SelectValues>({
    tipoPago: "",
    mes: "",
    anio: null,
  });
  const [isDraggingXml, setIsDraggingXml] = useState(false);

  // ✅ calcular total con useMemo
  const total = useMemo(() => {
    const subtotal = Number(formValues.subtotal ?? 0);
    const descuento = Number(formValues.descuento ?? 0);
    const iva = Number(formValues.iva ?? 0);
    return subtotal - descuento + iva;
  }, [formValues.subtotal, formValues.descuento, formValues.iva]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "pdf" | "xml") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === "pdf" && file.type === "application/pdf") {
        setPdfFile(file);
        setPdfPreview(file.name);
      } else if (type === "xml" && file.name.endsWith(".xml")) {
        setXmlFile(file);
        setXmlPreview(file.name);
      } else {
        toast.error(`Solo se permiten archivos ${type.toUpperCase()}`);
      }
    }
  };

  // ✅ Unificar dropzones
  const handleDrop = (e: DragEvent<HTMLDivElement>, type: "pdf" | "xml") => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (type === "pdf" && file.type === "application/pdf") {
      setPdfFile(file);
      setPdfPreview(file.name);
    } else if (type === "xml" && file.name.endsWith(".xml")) {
      setXmlFile(file);
      setXmlPreview(file.name);
    } else {
      toast.error(`Solo se permiten archivos ${type.toUpperCase()}`);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleXmlDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingXml(true);
  };
  const handleXmlDragLeave = () => setIsDraggingXml(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (["subtotal", "descuento", "iva"].includes(name)) {
      const numericValue = parseFloat(value) || 0;
      setFormValues((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === "fecha") {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: formatString(value) }));
    }
  };

  const handleFormChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "anio") {
      setSelectValues((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setSelectValues((prev) => ({ ...prev, [name]: value }));
    }
    setErrores((prev) => ({ ...prev, [name]: false }));
  };

  const resetForm = () => {
    setFormValues({
      fecha: "",
      factura: "",
      proveedor: "",
      concepto: "",
      subtotal: null,
      descuento: null,
      iva: null,
      total: null,
    });
    setErrores({});
    setEditIndex(null);
    setPdfFile(null);
    setXmlFile(null);
    setPdfPreview(null);
    setXmlPreview(null);
  };

  const ordenarFilas = (filas: FormValues[]) => {
    return [...filas].sort((a, b) => {
      const fechaA = new Date(a.fecha).getTime();
      const fechaB = new Date(b.fecha).getTime();
      if (fechaA !== fechaB) return fechaA - fechaB;
      return a.proveedor.localeCompare(b.proveedor);
    });
  };

  const handleSave = async () => {
    if (!formValues.factura || !formValues.fecha || !formValues.proveedor || !formValues.concepto || formValues.subtotal === null || formValues.iva === null) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    if (pdfFile === null || xmlFile === null) {
      if (pdfPreview === null || xmlPreview === null) {
        toast.error("Sube los archivos PDF y XML");
        return;
      }
    }

    const facturaExistente = rows.find(r => r.factura === formValues.factura);
    if (editIndex === null && facturaExistente) {
      toast.error("Ya existe una factura con ese número.");
      return;
    }

    const formData = new FormData();
    Object.entries({ ...formValues, total }).forEach(([k, v]) =>
      formData.append(k, String(v ?? ""))
    );
    if (pdfFile) formData.append("pdf", pdfFile);
    if (xmlFile) formData.append("xml", xmlFile);

    // si estás editando, mandas la factura original
    if (editIndex !== null) {
      formData.append("oldFactura", rows[editIndex].factura);
    }

    try {
      const res = await fetch(`${url}invoices`, {
        method: "POST", // siempre POST
        body: formData,
      });
      if (!res.ok) throw new Error("Error en el servidor");

      let nuevasFilas = [...rows];
      if (editIndex !== null) {
        nuevasFilas[editIndex] = { ...formValues, total };
        toast.success("Factura actualizada");
      } else {
        nuevasFilas.push({ ...formValues, total });
        toast.success("Factura agregada");
      }

      setRows(ordenarFilas(nuevasFilas));
      resetForm();
    } catch (error) {
      toast.error("Error al guardar la factura");
    }
  };

  const handleSelectSave = () => {
    const nuevosErrores: { [key: string]: boolean } = {};
    if (!selectValues.tipoPago) nuevosErrores.tipoPago = true;
    if (!selectValues.mes) nuevosErrores.mes = true;
    if (!selectValues.anio) nuevosErrores.anio = true;

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      toast.error("Debes completar tipo de pago, mes y año.");
      return;
    }
    setShowForm(true);
  };

  const handleEdit = async (index: number) => {
    const factura = rows[index];
    setFormValues(factura);
    setEditIndex(index);
    try {
      // Guardar previsualizaciones
      setPdfPreview(`${factura.factura}.pdf`);
      setXmlPreview(`${factura.factura}.xml`);
    } catch (err) {
      toast.error("No se pudieron cargar los archivos");
    }
  };

  const handleDelete = async (index: number) => {
    const row = rows[index];
    if (!row.factura || !row.fecha || !row.proveedor) {
      toast.error("Datos insuficientes para eliminar la factura");
      return;
    }

    try {
      const res = await fetch(
          `${url}invoices/${row.fecha}/${row.proveedor}/${row.factura}`,{ method: "DELETE" }
      );

      if (!res.ok) throw new Error("Error al eliminar en el servidor");

      // ✅ eliminar en estado local
      setRows(rows.filter((_, i) => i !== index));
      if (editIndex === index) resetForm();
      toast.success("Factura eliminada correctamente");
    } catch (error) {
      toast.error("No se pudo eliminar la factura");
    }
  };

  const handleSendReport = async () => {
    if (!send && !download) {
      toast.error("Selecciona enviar o descargar antes de terminar el reporte");
      return;
    }

    try {
      const blob = await pdf(<PdfExpense data={rows} filters={selectValues} />).toBlob();
      const formData = new FormData();
      formData.append("pdf", blob);
      formData.append("pdfName", `Reporte de gastos ${selectValues.tipoPago} ${selectValues.mes} ${selectValues.anio}.pdf`);
      formData.append("send", send.toString());
      formData.append("download", download.toString());

      const res = await fetch(`${url}invoices/download-send-mail-zip`, {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type");
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP: ${res.status}`);
      }

      // Manejar respuesta según el tipo de contenido
      if (contentType?.includes("application/json")) {
        // Solo enviar por correo (sin descarga)
        const data = await res.json();
        if (send) {
          toast.success(data.message || "Reporte enviado por correo correctamente");
        }
      } else if (contentType?.includes("application/zip")) {
        // Descargar ZIP
        const zipBlob = await res.blob();
        const urlZip = window.URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = urlZip;
        a.download = `Reporte de Gastos ${selectValues.tipoPago} ${selectValues.mes} ${selectValues.anio}.zip`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          window.URL.revokeObjectURL(urlZip);
          document.body.removeChild(a);
        }, 100);
        
        if (send) {
          toast.success("Reporte generado, enviado y descargado correctamente");
        } else {
          toast.success("Reporte descargado correctamente");
        }
      }

      // Limpiar estado
      setRows([]);
      setSelectValues({
        tipoPago: "",
        mes: "",
        anio: null,
      });
      
      if (resetForm) {
        resetForm();
      }

    } catch (error) {
      const errorMessage = typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message
        : undefined;
      toast.error(errorMessage || "Error al procesar el reporte");
    }
  };

  const formatCurrency = (value: number) => currencyFormatter.format(value);
  const handleModalContainerClick = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

  return (
    <div className="w-full gap-2 p-2">
      {/* Botón de PDF general */}
      <div className="flex w-full gap-2 p-2 items-center justify-end">
        {rows.length > 0 && (
          <>
            <label className="flex items-center gap-1 text-cyan-600">
              <input
                disabled={rows.length === 0} // 🔹 desactiva si no hay filas
                type="checkbox"
                checked={send}
                onChange={(e) => setSend(e.target.checked)}
              />
              Enviar reporte
            </label>
            <label className="flex items-center gap-1 text-cyan-600">
              <input
                disabled={rows.length === 0} // 🔹 desactiva si no hay filas
                type="checkbox"
                checked={download}
                onChange={(e) => setDownload(e.target.checked)}
              />
              Descargar reporte
            </label>
            <button
              className="gap-1 p-2 w-fit rounded-md text-white transition-all group bg-cyan-600 hover:bg-yellow-500 hover:scale-105"
              type="button"
              onClick={() => setShowPdf(!showPdf)}
              >
              {showPdf ? <PiAppWindowBold /> : <TfiPrinter />}
            </button>
          </> 
        )}
      </div>
      {/* PDF Viewer */}
      {showPdf ? (
        <PdfViewer facturas={rows} header={selectValues} />
      ) : (
        <>
          {/* Selección tipo pago / mes / año */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-1 p-2">
            <div className="flex flex-col">
              <label htmlFor="tipoPago" className="text-sm font-medium">Tipo de pago</label>
              <select
                name="tipoPago"
                value={selectValues.tipoPago}
                onChange={handleFormChangeSelect}
                className={`border ${errores.tipoPago ? "border-red-500" : "border-white"} text-cyan-600 rounded p-1`}
                >
                <option value="">Tipo de pago...</option>
                <option value="Efectivo">Efectivo</option>
                <option value="TC">Tarjeta Crédito</option>
                <option value="TD">Tarjeta Débito</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="mes" className="text-sm font-medium">Mes</label>
              <select
                name="mes"
                value={selectValues.mes}
                onChange={handleFormChangeSelect}
                className={`border ${errores.mes ? "border-red-500" : "border-white"} text-cyan-600 rounded p-1`}
                >
                <option value="">Mes...</option>
                {MESES.map((mes) => <option key={mes} value={mes}>{mes}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="anio" className="text-sm font-medium">Año</label>
              <select
                name="anio"
                value={selectValues.anio ?? ""}
                onChange={handleFormChangeSelect}
                className={`border ${errores.anio ? "border-red-500" : "border-white"} text-cyan-600 rounded p-1`}
                >
                <option value="">Año...</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex flex-col justify-end text-center text-cyan-600">
              <span>Registros: {rows.length}</span>
            </div>
            <div className="flex col-span-2 gap-2 w-full items-center justify-end">
              <button
                disabled={rows.length === 0} // 🔹 desactiva si no hay filas
                onClick={() => handleSendReport()}
                className={`flex w-full items-center gap-2 p-2 rounded-md text-white text-sm transition-all group 
                  ${rows.length === 0 
                    ? "bg-gray-400 cursor-not-allowed"   // 🔹 estilo deshabilitado
                    : "bg-cyan-600 hover:bg-yellow-500 hover:scale-105"
                  }`}
              >
                <CgCalendarNext size={18} color="white"/> Terminar Reporte
              </button>
              <button
                onClick={() => { resetForm(); handleSelectSave(); }}
                className="flex w-full items-center gap-2 p-2 rounded-md text-white text-sm transition-all group bg-cyan-600 hover:bg-yellow-500 hover:scale-105"
                >
                <TfiLayoutListThumbAlt size={18} color="white"/> Agregar factura
              </button>
            </div>
          </div>
          {/* Modal de formulario */}
          {showForm && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-start z-50"
              onClick={() => setShowForm(false)}
              >
              <div onClick={handleModalContainerClick}>
                <div className="bg-gray-900 p-1 rounded-lg shadow-lg text-white space-y-1">
                  <h2 className="text-xl text-center font-bold">{editIndex !== null ? "Editar factura" : "Nueva factura"}</h2>
                  <form
                    className="bg-gray-900 text-sm gap-2 p-2 w-[273px] space-y-1 text-white rounded-md"
                    onSubmit={(e) => { e.preventDefault(); handleSave(); }}
                    >
                    {/* Fecha y Factura */}
                    <section className="flex gap-2 text-center w-full">
                      <div>
                        <label>Fecha
                          <input
                            type="date"
                            name="fecha"
                            value={formValues.fecha}
                            onChange={handleFormChange}
                            className="w-[130px] border border-gray-300 text-cyan-600 rounded p-1"
                            required
                          />
                        </label>
                      </div>
                      <div>
                        <label>Factura
                          <input
                            type="text"
                            name="factura"
                            value={formValues.factura}
                            onChange={handleFormChange}
                            className="w-[120px] border border-gray-300 text-cyan-600 rounded p-1"
                            required
                          />
                        </label>
                      </div>
                    </section>
                    {/* Proveedor y Concepto */}
                    <section className="flex flex-col gap-2 text-center w-full">
                      <div>
                        <label>Proveedor
                          <input
                            type="text"
                            name="proveedor"
                            value={formValues.proveedor}
                            onChange={handleFormChange}
                            className="w-full border border-gray-300 text-cyan-600 rounded p-1"
                            required
                          />
                        </label>
                      </div>
                      <div>
                        <label>Concepto
                          <input
                            type="text"
                            name="concepto"
                            value={formValues.concepto}
                            onChange={handleFormChange}
                            className="w-full border border-gray-300 text-cyan-600 rounded p-1"
                            required
                          />
                        </label>
                      </div>
                    </section>
                    {/* Subtotal, Descuento, IVA */}
                    <section className="flex text-center w-full">
                      {["subtotal", "descuento", "iva"].map((field) => (
                        <div className="w-full" key={field}>
                          <label className="capitalize">{field}
                            <input
                              type="number"
                              name={field}
                              value={formValues[field as keyof typeof formValues] ?? ""}
                              onChange={handleFormChange}
                              className="w-[81px] border border-gray-300 text-cyan-600 rounded p-1"
                              required
                            />
                          </label>
                        </div>
                      ))}
                    </section>
                    {/* Total y Guardar */}
                    <div className="flex justify-end space-x-2">
                      <label className="w-fit text-white rounded p-1">
                        {`Total: ${formatCurrency(total)}`}
                      </label>
                      <button
                        type="submit"
                        className="p-1 bg-cyan-600 text-white rounded hover:bg-yellow-500"
                        >
                        {editIndex !== null ? "Actualizar" : "Guardar"}
                      </button>
                    </div>
                    {/* Contenedor de botones con flex-wrap */}
                    <div className="flex flex-wrap gap-2 w-full">
                      {/* Dropzone PDF */}
                      <div
                        onDrop={(e) => handleDrop(e, "pdf")}
                        onDragOver={handleDragOver}
                        className={`
                          flex-1 min-w-[200px] max-w-full border-2 border-dashed rounded-md 
                          p-2 flex items-center gap-2 cursor-pointer
                          ${pdfFile ? "border-cyan-500 bg-white" : "border-cyan-600 bg-white"}
                        `}
                        >
                        <input
                          id="pdf-upload"
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleFileChange(e, "pdf")}
                          hidden
                        />
                        <label
                          htmlFor="pdf-upload"
                          className="flex items-center gap-2 text-cyan-600 hover:text-yellow-500 cursor-pointer truncate w-full"
                          >
                          <BsFiletypePdf
                            size={24}
                            className={`transition-transform duration-500 ${pdfFile ? "animate-bounce text-cyan-600" : "text-cyan-500"}`}
                          />
                          {pdfPreview || "Upload pdf"}
                        </label>
                      </div>
                      {/* Dropzone XML */}
                      <div
                        onDrop={(e) => handleDrop(e, "xml")}
                        onDragOver={handleXmlDragOver}
                        onDragLeave={handleXmlDragLeave}
                        className={`
                          flex-1 min-w-[200px] max-w-full border-2 border-dashed rounded-md 
                          p-2 flex items-center gap-2 cursor-pointer
                          ${isDraggingXml ? "border-cyan-500 bg-white" : "border-cyan-600 bg-white"}
                        `}
                        >
                        <input
                          id="xml-upload"
                          type="file"
                          accept=".xml"
                          onChange={(e) => handleFileChange(e, "xml")}
                          hidden
                        />
                        <label
                          htmlFor="xml-upload"
                          className="flex items-center gap-2 text-cyan-600 hover:text-yellow-500 cursor-pointer truncate w-full"
                          >
                          <BsFiletypeXml
                            size={24}
                            className={`transition-transform duration-500 ${xmlFile ? "animate-bounce text-cyan-600" : "text-cyan-500"}`}
                          />
                          {xmlPreview || "Upload xml"}
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          {/* Tabla */}
          {rows.length > 0 && (
            <div className="flex-1 overflow-y-auto overflow-x-auto rounded-md border max-h-[calc(100vh-300px)]">
              <div className="flex flex-col h-full max-h-[calc(100vh-200px)] overflow-y-auto">
                <table className="table-auto min-w-full text-sm text-white bg-gray-800">
                  <thead className="bg-gray-800 sticky top-0 z-10">
                    <tr>
                      <th className="px-2 py-2 text-left whitespace-nowrap">Fecha</th>
                      <th className="px-2 py-2 text-left whitespace-nowrap">Factura</th>
                      <th className="px-2 py-2 text-left">Proveedor</th>
                      <th className="px-2 py-2 text-left">Concepto</th>
                      <th className="px-2 py-2 text-right whitespace-nowrap">Subtotal</th>
                      <th className="px-2 py-2 text-right whitespace-nowrap">Descuento</th>
                      <th className="px-2 py-2 text-right whitespace-nowrap">IVA</th>
                      <th className="px-2 py-2 text-right whitespace-nowrap">Total</th>
                      <th className="px-2 py-2 text-center whitespace-nowrap">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index} className="border-t border-gray-500 bg-gray-900 hover:bg-gray-700">
                        <td className="px-2 py-2">{row.fecha}</td>
                        <td className="px-2 py-2">{row.factura}</td>
                        <td className="px-2 py-2">{row.proveedor}</td>
                        <td className="px-2 py-2">{row.concepto}</td>
                        <td className="px-2 py-2 text-right">{formatCurrency(row.subtotal ?? 0)}</td>
                        <td className="px-2 py-2 text-right">{formatCurrency(row.descuento ?? 0)}</td>
                        <td className="px-2 py-2 text-right">{formatCurrency(row.iva ?? 0)}</td>
                        <td className="px-2 py-2 text-right">{formatCurrency(row.total ?? 0)}</td>
                        <td className="px-2 py-2 text-center">
                          <div className="flex justify-center gap-2">
                            <FiEdit onClick={() => { handleEdit(index); handleSelectSave(); }} className="text-yellow-500 hover:text-green-500 cursor-pointer" title="Editar" size={18} />
                            <MdDeleteOutline onClick={() => handleDelete(index)} className="text-yellow-500 hover:text-red-500 cursor-pointer" title="Eliminar" size={20} />
                            <BsFiletypePdf
                              onClick={() => {
                                if (row.factura) {
                                  setPreviewFile({ url: `${url}invoices/${row.fecha}/${row.proveedor}/${row.factura}.pdf`, type: "pdf" });
                                } else {
                                  toast.error("No hay PDF disponible");
                                }
                              }}
                              className="text-yellow-500 hover:text-cyan-500 cursor-pointer"
                              title="Ver PDF"
                              size={18}
                            />
                            <BsFiletypeXml
                              onClick={() => {
                                if (row.factura) {
                                  setPreviewFile({ url: `${url}invoices/${row.fecha}/${row.proveedor}/${row.factura}.xml`, type: "xml" });
                                } else {
                                  toast.error("No hay XML disponible");
                                }
                              }}
                              className="text-yellow-500 hover:text-cyan-500 cursor-pointer"
                              title="Ver XML"
                              size={18}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Fila de totales */}
                  <tfoot className="bg-gray-800 font-bold sticky bottom-0 z-10 border-t border-gray-500">
                    <tr>
                      <td colSpan={4} className="px-2 py-2 text-right">Totales:</td>
                      <td className="px-2 py-2 text-right">
                        {formatCurrency(rows.reduce((acc, row) => acc + (row.subtotal ?? 0), 0))}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {formatCurrency(rows.reduce((acc, row) => acc + (row.descuento ?? 0), 0))}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {formatCurrency(rows.reduce((acc, row) => acc + (row.iva ?? 0), 0))}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {formatCurrency(rows.reduce((acc, row) => acc + (row.total ?? 0), 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </>
      )}
      {/* Modal de preview */}
      {previewFile && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
          onClick={() => setPreviewFile(null)}
          >
          <div
            onClick={handleModalContainerClick}
            className="relative bg-white rounded-lg shadow-lg w-[80vw] h-[80vh] max-w-7xl overflow-hidden flex flex-col"
            >
            {/* Contenido ajustado al modal */}
            <div className="flex-1 overflow-auto h-full">
              <FilePreviewModal
                url={previewFile.url}
                type={previewFile.type}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};