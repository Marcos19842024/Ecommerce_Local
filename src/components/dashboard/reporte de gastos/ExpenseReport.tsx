import { useEffect, useState } from "react";
import { formatString } from "../../../helpers";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { FormValues, SelectValues } from "../../../interfaces";
import { PiAppWindowBold } from "react-icons/pi";
import { TfiPrinter } from "react-icons/tfi";
import { PdfViewer } from "../pdf/PdfViewer";

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
        setErrores((prev) => ({ ...prev, [name]: false })); // Limpiar error al cambiar select
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
    };

    const handleSave = async  () => {
        const facturaExistente = rows.find(r => r.factura === formValues.factura);
        if (editIndex === null && facturaExistente) {
            toast.error("Ya existe una factura con ese número.");
            return;
        }
        if (editIndex !== null) {
            // Editar fila existente
            const updated = [...rows];
            updated[editIndex] = formValues;
            setRows(updated);
            toast.success("Factura actualizada correctamente.");
        } else {
            // Agregar nueva fila
            setRows((prev) => [...prev, formValues]);
            toast.success("Factura guardada correctamente.");
        }
        resetForm();
    };

    const handleSelectSave = () => {
        const nuevosErrores: { [key: string]: boolean } = {};
        // Validaciones de selects
        if (!selectValues.tipoPago) nuevosErrores.tipoPago = true;
        if (!selectValues.mes) nuevosErrores.mes = true;
        if (!selectValues.anio) nuevosErrores.anio = true;

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            toast.error("Debes completar tipo de pago, mes y año.");
            return;
        }
        setShowForm(true);
    }

    const handleEdit = (index: number) => {
        setFormValues(rows[index]);
        setEditIndex(index);
    };

    const handleDelete = (index: number) => {
        const updated = rows.filter((_, i) => i !== index);
        setRows(updated);
        if (editIndex === index) resetForm();
    };

    const formatCurrency = (value: number) => currencyFormatter.format(value);

    const handleModalContainerClick = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

    return (
        <div className="w-full gap-2 p-2">
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
            {showPdf ? (
                <div>
                    <PdfViewer facturas={rows} header={selectValues} />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-5 justify-center items-center gap-2 p-2">
                        <label htmlFor="tipoPago" className="col-span-1 text-center">Tipo de pago</label>
                        <label htmlFor="mes" className="col-span-1 text-center">Mes</label>
                        <label htmlFor="anio" className="col-span-1 text-center">Año</label>
                        <span className="col-span-2 text-center">Acciones</span>
                        <select
                            name="tipoPago"
                            value={selectValues.tipoPago}
                            onChange={handleFormChangeSelect}
                            required
                            className={`col-span-1 border ${errores.tipoPago ? "border-red-500" : "border-white"} text-cyan-600 rounded p-1`}
                        >
                            <option value="">Selecciona</option>
                            <option value="Efectivo">Efectivo</option>
                            <option value="TC">Tarjeta Crédito</option>
                            <option value="TD">Tarjeta Débito</option>
                        </select>
                        <select
                            name="mes"
                            value={selectValues.mes}
                            onChange={handleFormChangeSelect}
                            required
                            className={`col-span-1 border ${errores.mes ? "border-red-500" : "border-white"} text-cyan-600 rounded p-1`}
                        >
                            <option value="">Selecciona</option>
                            {meses.map((mes) => (
                                <option key={mes} value={mes}>{mes}</option>
                            ))}
                        </select>
                        <select
                            name="anio"
                            value={selectValues.anio ?? ""}
                            onChange={handleFormChangeSelect}
                            required
                            className={`col-span-1 border ${errores.anio ? "border-red-500" : "border-white"} text-cyan-600 rounded p-1`}
                        >
                            <option value="">Selecciona</option>
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <span
                            className="w-fit text-cyan-600 text-center">
                            Registros: {rows.length}
                        </span>
                        <button
                            onClick={() => {
                                resetForm();
                                handleSelectSave();
                            }}
                            className="col-span-1 bg-cyan-600 text-white rounded hover:bg-yellow-500 p-2"
                        >
                            Agregar factura
                        </button>
                    </div>
                    {showForm && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-start z-50"
                            onClick={() => setShowForm(false)}
                        >
                            <div onClick={handleModalContainerClick}>
                                <div
                                    className="bg-gray-900 p-2 rounded-lg shadow-lg text-white space-y-4"
                                    onClick={(e) => e.stopPropagation()} // evita cerrar al hacer clic dentro
                                >
                                    <h2 className="text-xl font-bold mb-2">{editIndex !== null ? "Editar factura" : "Nueva factura"}</h2>
                                    <form
                                        className="bg-gray-900 text-sm gap-2 p-2 w-[273px] space-y-2 text-white rounded-md"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSave();
                                        }}
                                    >
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

                                        <section className="flex text-center w-full">
                                            {["subtotal", "descuento", "iva"].map((field) => (
                                                <div
                                                    className="w-full"
                                                    key={field}>
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

                                        <div className="flex justify-end space-x-2">
                                            <label
                                                className="w-fit text-white rounded p-1">
                                                {`Total: ${formatCurrency(formValues.total ?? 0)}`}
                                            </label>
                                            <button
                                                type="submit"
                                                className="p-1 bg-cyan-600 text-white rounded hover:bg-yellow-500"
                                            >
                                                {editIndex !== null ? "Actualizar" : "Guardar"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                    {rows.length > 0 && (
                        <div className="overflow-x-auto max-h-[80vh] rounded-md border">
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
                                                    <FiEdit
                                                        onClick={() => {
                                                        handleEdit(index);
                                                        handleSelectSave();
                                                        }}
                                                        className="text-yellow-500 hover:text-green-500 cursor-pointer"
                                                        title="Editar"
                                                        size={18}
                                                    />
                                                    <MdDeleteOutline
                                                        onClick={() => handleDelete(index)}
                                                        className="text-yellow-500 hover:text-red-500 cursor-pointer"
                                                        title="Eliminar"
                                                        size={20}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {rows.length > 0 && (
                                    <tfoot className="bg-gray-800 border-t border-gray-500 sticky bottom-0 z-10 font-bold">
                                        <tr>
                                            <td colSpan={4} className="px-2 py-2 text-right">Totales:</td>
                                            <td className="px-2 py-2 text-right">
                                                {formatCurrency(rows.reduce((acc, r) => acc + (r.subtotal ?? 0), 0))}
                                            </td>
                                            <td className="px-2 py-2 text-right">
                                                {formatCurrency(rows.reduce((acc, r) => acc + (r.descuento ?? 0), 0))}
                                            </td>
                                            <td className="px-2 py-2 text-right">
                                                {formatCurrency(rows.reduce((acc, r) => acc + (r.iva ?? 0), 0))}
                                            </td>
                                            <td className="px-2 py-2 text-right">
                                                {formatCurrency(rows.reduce((acc, r) => acc + (r.total ?? 0), 0))}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};