import { useEffect, useState, DragEvent } from "react";
import { formatString } from "../helpers";
import { FiEdit } from "react-icons/fi";
import { BsFiletypePdf, BsFiletypeXml } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { FormValues, SelectValues } from "../interfaces/report.interface";
import { PiAppWindowBold } from "react-icons/pi";
import { TfiPrinter } from "react-icons/tfi";
import { PdfViewer } from "../components/PdfViewer";
import FilePreviewModal from "./FilePreviewModal";
import { url } from "../server/url";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export const ExpenseReport = () => {
  const [showPdf, setShowPdf] = useState(false);
  const [errores, setErrores] = useState<{ [key: string]: boolean }>({});
  const [rows, setRows] = useState<FormValues[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<{ url: string; type: "pdf" | "xml" } | null>(null);
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
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear];
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Drag state para XML
  const [isDraggingXml, setIsDraggingXml] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "pdf" | "xml") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === "pdf") {
        if (file.type !== "application/pdf") {
          toast.error("Solo se permiten archivos PDF");
          return;
        }
        setPdfFile(file);
      }
      if (type === "xml") {
        if (!file.name.endsWith(".xml")) {
          toast.error("Solo se permiten archivos XML");
          return;
        }
        setXmlFile(file);
      }
    }
  };

  // Dropzone XML
  const handleXmlDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingXml(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.name.endsWith(".xml")) {
        toast.error("Solo se permiten archivos XML");
        return;
      }
      setXmlFile(file);
    }
  };
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

  useEffect(() => {
    const { subtotal, descuento, iva } = formValues;
    const safeSubtotal = subtotal ?? 0;
    const safeDescuento = descuento ?? 0;
    const safeIva = iva ?? 0;
    const total = safeSubtotal - safeDescuento + safeIva;
    setFormValues((prev) => ({ ...prev, total }));
  }, [formValues.subtotal, formValues.descuento, formValues.iva]);

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
    setEditIndex(null);
    setPdfFile(null);
    setXmlFile(null);
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
    const facturaExistente = rows.find(r => r.factura === formValues.factura);
    if (editIndex === null && facturaExistente) {
      toast.error("Ya existe una factura con ese número.");
      return;
    }
    if (!formValues.factura || !formValues.fecha || !formValues.proveedor) {
      toast.error("Completa todos los campos requeridos");
      return;
    }
    const formData = new FormData();
    formData.append("fecha", formValues.fecha);
    formData.append("proveedor", formValues.proveedor);
    formData.append("factura", formValues.factura);
    formData.append("concepto", formValues.concepto);
    formData.append("subtotal", String(formValues.subtotal));
    formData.append("iva", String(formValues.iva));
    formData.append("total", String(formValues.total));
    if (pdfFile) formData.append("pdf", pdfFile);
    if (xmlFile) formData.append("xml", xmlFile);

    let nuevasFilas = [...rows];
    try {
      const method = editIndex !== null ? "PUT" : "POST";
      const res = await fetch(`${url}invoices`, { method, body: formData });
      if (!res.ok) throw new Error("Error en el servidor");

      if (editIndex !== null) {
        const updated = [...rows];
        updated[editIndex] = formValues;
        setRows(updated);
        toast.success("Factura actualizada");
      } else {
        nuevasFilas.push(formValues);
        toast.success("Factura agregada");
      }
    } catch (error) {
      toast.error("Error al guardar la factura");
    }

    setRows(ordenarFilas(nuevasFilas));
    resetForm();
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

  const handleEdit = (index: number) => {
    setFormValues(rows[index]);
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
    if (editIndex === index) resetForm();
  };

  const formatCurrency = (value: number) => currencyFormatter.format(value);

  const handleModalContainerClick = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

    return (
        <div className="w-full gap-2 p-2">
            {/* Botón de PDF general */}
            <div className="flex w-full gap-2 p-2 items-center justify-end">
                {rows.length > 0 && (
                    <button
                        className="gap-1 p-2 w-fit rounded-md text-white transition-all group bg-cyan-600 hover:bg-yellow-500 hover:scale-105"
                        type="button"
                        onClick={() => setShowPdf(!showPdf)}
                    >
                        {showPdf ? <PiAppWindowBold /> : <TfiPrinter />}
                    </button>
                )}
            </div>
            {/* PDF Viewer */}
            {showPdf ? (
                <PdfViewer facturas={rows} header={selectValues} />
            ) : (
                <>
                    {/* Selección tipo pago / mes / año */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 p-2">
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
                                {meses.map((mes) => <option key={mes} value={mes}>{mes}</option>)}
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
                                {years.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col justify-end text-center text-cyan-600">
                            <span>Registros: {rows.length}</span>
                        </div>
                        <div className="flex flex-col justify-end">
                            <button
                                onClick={() => { resetForm(); handleSelectSave(); }}
                                className="bg-cyan-600 text-white rounded hover:bg-yellow-500 p-2"
                            >
                                Agregar factura
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
                            <div className="bg-gray-900 p-2 rounded-lg shadow-lg text-white space-y-4">
                                <h2 className="text-xl text-center font-bold mb-2">{editIndex !== null ? "Editar factura" : "Nueva factura"}</h2>
                                <form
                                    className="bg-gray-900 text-sm gap-2 p-2 w-[273px] space-y-2 text-white rounded-md"
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
                                            {`Total: ${formatCurrency(formValues.total ?? 0)}`}
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
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const file = e.dataTransfer.files[0];
                                                if (!file) return;
                                                if (file.type !== "application/pdf") {
                                                    toast.error("Solo se permiten archivos PDF");
                                                    return;
                                                }
                                                setPdfFile(file);
                                            }}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDragLeave={(e) => e.preventDefault()}
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
                                                />{pdfFile?.name || "Upload pdf"}
                                            </label>
                                        </div>
                                        {/* Dropzone XML */}
                                        <div
                                            onDrop={handleXmlDrop}
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
                                                    className={`transition-transform duration-500 ${isDraggingXml ? "animate-bounce text-cyan-600" : "text-cyan-500"}`}
                                                />{xmlFile?.name || "Upload xml"}
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
                                </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </div>
                )}
                </>
            )}
            {/* Modal de preview */}
            {previewFile && (
                <FilePreviewModal
                    url={previewFile.url}
                    type={previewFile.type}
                    onClose={() => setPreviewFile(null)}
                />
            )}
        </div>
    );
};