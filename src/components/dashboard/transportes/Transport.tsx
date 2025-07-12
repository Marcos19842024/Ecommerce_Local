import { ClienteTransporte, Fechas, MascotaTransporte } from "../../../interfaces";
import { PdfViewer } from "../pdf/PdfViewer";
import { PiAppWindowBold } from "react-icons/pi";
import { TfiPrinter } from "react-icons/tfi";
import { FiEdit } from "react-icons/fi";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";

interface TransportProps {
    fechas: Fechas[];
}

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

    const openEditModal = (mascota?: MascotaTransporte, cliente?: ClienteTransporte) => {
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
            <div className="flex grid grid-col-5 gap-2 p-2 h-screen">
                <div className="col-span-4 flex justify-center items-center p-2 text-cyan-600">
                    Clientes: {fechasState.reduce((total,fecha) => {return total + fecha.clientes.length},0)}
                </div>
                <div className="col-span-1 flex justify-end items-center p-2">
                    <button
                        className="ggap-1 p-2 w-fit rounded-md text-white transition-all group bg-cyan-600 hover:bg-yellow-500 hover:scale-105"
                        type="button"
                        onClick={() => setShowPdf(!showPdf)}
                    >
                        {showPdf ? <PiAppWindowBold /> : <TfiPrinter />}
                    </button>
                </div>

                {showPdf ? (
                    <div className="w-full col-span-5">
                        <PdfViewer fechas={fechasState} sending={[]} notsending={[]} />
                    </div>
                ) : (
                    <div className="h-screen w-full flex col-span-5 gap-2">
                        <div className="col-span-1 overflow-y-auto overscroll-contain font-medium text-white h-fit h-max-1/3 w-2/5 mx-auto bg-gray-900 rounded p-2">
                            <div className="sticky top-0 bg-gray-900">
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
                                        <span className="font-medium">{fecha.fecha}</span>
                                        <button
                                            className="text-red-400 text-sm hover:underline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEliminarFecha(fecha.fecha);
                                            }}
                                            >
                                            <MdDeleteOutline
                                                className="text-yellow-400 hover:text-red-500 cursor-pointer"
                                                size={20}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="col-span-2 overflow-y-auto overscroll-contain font-medium text-white h-2/3 h-max-2/3 w-full mx-auto bg-gray-900 rounded p-2">
                            <div className="sticky top-0 bg-gray-900">
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
                                        <span className="font-medium">{cliente.hora} - {cliente.nombre}</span>
                                        <button
                                            className="text-red-400 text-sm hover:underline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEliminarCliente(fechasState[index].fecha, cliente.nombre);
                                            }}
                                            >
                                            <MdDeleteOutline
                                                className="text-yellow-400 hover:text-red-500 cursor-pointer"
                                                size={20}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="col-span-2 overflow-y-auto overscroll-contain font-medium text-white h-fit h-max-1/3 w-full mx-auto bg-gray-900 rounded p-2">
                            <div>{currentCliente?.hora} Hrs.</div>
                            <span>{currentCliente?.nombre}</span>
                            <div className="w-full m-2 rounded-md bg-gray-800">
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
                                            <tr
                                                key={i}
                                                className="cursor-pointer hover:bg-gray-600"
                                            >
                                                <td className="flex gap-2 p-2">
                                                    <FiEdit
                                                        className="text-yellow-400 hover:text-green-500 cursor-pointer"
                                                        size={20}
                                                        onClick={() => openEditModal(mascota, currentCliente)}
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
                            <span>Observaciones: {currentCliente?.status}</span>
                        </div>
                    </div>
                )}
            </div>

            {modalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setModalOpen(false)}
                    >
                    <div
                        className="bg-white text-black p-6 rounded-lg w-96"
                        onClick={handleModalContainerClick}
                    >
                        <h2 className="text-lg font-bold mb-4">Editar Registro</h2>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            <div>
                                <label className="block text-sm font-medium">Nombre</label>
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
                                <label className="block text-sm font-medium">Raza</label>
                                <input
                                    type="text"
                                    name="raza"
                                    value={formValues.raza}
                                    onChange={handleFormChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Asunto</label>
                                <input
                                    type="text"
                                    name="asunto"
                                    value={formValues.asunto}
                                    onChange={handleFormChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Observaciones</label>
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
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-cyan-600"
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