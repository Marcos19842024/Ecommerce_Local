import { PiAppWindowBold } from "react-icons/pi";
import { TfiPrinter } from "react-icons/tfi";
import { FiEdit } from "react-icons/fi";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { Cliente, Fechas, Mascota, TransportProps } from "../../interfaces/transport.interface";
import { PDFViewer } from "@react-pdf/renderer";
import { PdfTransport } from "./PdfTransport";

export const Transport = ({ fechas }: TransportProps) => {

    useEffect(() => {
        setFechasState(ordenarFechasYClientes(fechas));
    }, [fechas]);

    const ordenarFechasYClientes = (fechas: Fechas[]) => fechas.map((f) => ({
        ...f, clientes: f.clientes.sort(
            (a, b) => horaToNumber(a.hora) - horaToNumber(b.hora)
        ),
    })).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    const horaToNumber = (hora: string) => {
        const [h, m] = hora.split(":" ).map(Number);
        return h * 60 + m;
    };

    const [fechasState, setFechasState] = useState<Fechas[]>(ordenarFechasYClientes(fechas));
    const [showPdf, setShowPdf] = useState(false);
    const [index, setIndex] = useState(0);
    const [idc, setIdc] = useState(0);
    const [selectedMascota, setSelectedMascota] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({ status: "", nombre: "", raza: "", asunto: "" });

    const actualizarFechas = (nuevasFechas: Fechas[]) => setFechasState(ordenarFechasYClientes(nuevasFechas));

    const handleEliminarFecha = (fecha: string) => actualizarFechas(fechasState.filter((f) => f.fecha !== fecha));

    const handleEliminarCliente = (fecha: string, cliente: string) => actualizarFechas(
        fechasState.map((f) => f.fecha !== fecha ? f : { ...f, clientes: f.clientes.filter((c) => c.nombre !== cliente) }
    ));

    const openEditModal = (mascota?: Mascota, cliente?: Cliente) => {
        setSelectedMascota(mascota);
        setFormValues({
            status: cliente?.status ?? "",
            nombre: mascota?.nombre ?? "",
            raza: mascota?.raza ?? "",
            asunto: mascota?.asunto ?? "",
        });
        setModalOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const updatedFechas = [...fechasState];
        const cliente = updatedFechas[index].clientes[idc];
        const mascotaIndex = cliente.mascotas.findIndex((m) => m === selectedMascota);

        if (mascotaIndex !== -1) {
            cliente.mascotas[mascotaIndex] = { ...formValues };
            cliente.status = formValues.status;
            setFechasState(updatedFechas);
        }

        setModalOpen(false);
    };

    const handleModalContainerClick = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

    if (!fechas.length) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-600">No tienes transportes pendientes.</p>
            </div>
        );
    }

    const currentCliente = fechasState[index]?.clientes[idc];

    return (
        <>
            <div className="flex flex-col lg:grid lg:grid-cols-5 gap-2 p-2 min-h-screen">
                {/* Header Info */}
                <div className="lg:col-span-4 flex justify-center items-center p-2 text-cyan-600">
                    Clientes: {fechasState.reduce((total, fecha) => total + fecha.clientes.length, 0)}
                </div>
                <div className="lg:col-span-1 flex justify-end items-center p-2">
                    <button
                        className="p-2 w-fit rounded-md text-white transition-all group bg-cyan-600 hover:bg-yellow-500 hover:scale-105"
                        type="button"
                        onClick={() => setShowPdf(!showPdf)}
                    >
                        {showPdf ? <PiAppWindowBold /> : <TfiPrinter />}
                    </button>
                </div>

                {showPdf ? (
                    <div className="w-full col-span-5">
                        <div className="w-full h-[80vh] border shadow">
                            <PDFViewer width="100%" height="100%">
                                <PdfTransport fechas={fechasState} />
                            </PDFViewer>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row w-full col-span-5 gap-2">
                        {/* Columna Fechas */}
                        <div className="overflow-y-auto font-medium text-white w-full lg:w-1/3 bg-gray-900 rounded p-2 h-[170px] lg:h-fit">
                            <div className="sticky top-0 bg-gray-900 z-10">
                                <h2 className="font-bold text-white text-xl py-4 px-4">Fechas</h2>
                                <hr className="border-slate-100 w-full rounded-md" />
                            </div>
                            {fechasState.map((fecha, i) => (
                                <div
                                    key={i}
                                    onClick={() => setIndex(i)}
                                    className={`p-2 cursor-pointer rounded ${index === i ? "bg-cyan-600 text-white" : "text-white"}`}
                                >
                                    <div className="flex justify-between items-center border-slate-600 border-b pb-2">
                                        <span>{fecha.fecha}</span>
                                        <MdDeleteOutline
                                            className="text-yellow-500 hover:text-red-500 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEliminarFecha(fecha.fecha);
                                            }}
                                            title="Eliminar Fecha"
                                            size={20}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Columna Clientes */}
                        <div className="overflow-y-auto font-medium text-white w-full lg:w-1/3 bg-gray-900 rounded p-2 h-[310px] lg:h-1/3">
                            <div className="sticky top-0 bg-gray-900 z-10">
                                <h2 className="font-bold text-white text-xl py-4 px-4">Clientes</h2>
                                <hr className="border-slate-100 w-full rounded-md" />
                            </div>
                            {fechasState[index]?.clientes.map((cliente, i) => (
                                <div
                                    key={i}
                                    onClick={() => setIdc(i)}
                                    className={`p-2 cursor-pointer rounded ${idc === i ? "bg-cyan-600 text-white" : "text-white"}`}
                                >
                                    <div className="flex justify-between items-center border-slate-600 border-b pb-2">
                                        <span>{cliente.hora} - {cliente.nombre}</span>
                                        <MdDeleteOutline
                                            className="text-yellow-500 hover:text-red-500 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEliminarCliente(fechasState[index].fecha, cliente.nombre);
                                            }}
                                            title="Eliminar Cliente"
                                            size={20}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Columna Detalles */}
                        <div className="overflow-y-auto font-medium text-white w-full lg:w-1/3 bg-gray-900 rounded p-2 h-fit">
                            <div className="p-2">{currentCliente?.hora} Hrs.</div>
                            <span className="p-2">{currentCliente?.nombre}</span>
                            <div className="w-full m-2 rounded-md bg-gray-800 overflow-x-auto">
                                <table className="w-full text-sm text-white">
                                    <thead>
                                        <tr className="bg-gray-700 text-left">
                                            <th className="p-2">Nombre</th>
                                            <th className="p-2">Raza</th>
                                            <th className="p-2">Asunto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentCliente?.mascotas.map((mascota, i) => (
                                            <tr key={i} className="cursor-pointer hover:bg-gray-600">
                                                <td className="flex gap-2 p-2">
                                                    <FiEdit
                                                        className="text-yellow-500 hover:text-green-500 cursor-pointer"
                                                        onClick={() => openEditModal(mascota, currentCliente)}
                                                        title="Editar Mascota"
                                                        size={20}
                                                    />
                                                    {mascota.nombre}
                                                </td>
                                                <td className="p-2">{mascota.raza}</td>
                                                <td className="p-2">{mascota.asunto}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <span className="p-2">Observaciones: {currentCliente?.status}</span>
                        </div>
                    </div>
                )}
            </div>
            {modalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="bg-white text-black p-6 rounded-lg w-full max-w-md mx-4"
                        onClick={handleModalContainerClick}
                    >
                        <h2 className="text-lg font-bold mb-4">Editar Registro</h2>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formValues.nombre}
                                    onChange={handleFormChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Raza</label>
                                <input
                                    type="text"
                                    name="raza"
                                    value={formValues.raza}
                                    onChange={handleFormChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Asunto</label>
                                <input
                                    type="text"
                                    name="asunto"
                                    value={formValues.asunto}
                                    onChange={handleFormChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Observaciones</label>
                                <input
                                    type="text"
                                    name="status"
                                    value={formValues.status}
                                    onChange={handleFormChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-yellow-500"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};