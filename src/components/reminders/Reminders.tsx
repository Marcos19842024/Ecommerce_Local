import { useRef, useState, useEffect } from "react";
import { VscSend } from "react-icons/vsc";
import { PiAppWindowBold, PiPaperclipBold } from "react-icons/pi";
import { TfiPrinter } from "react-icons/tfi";
import { RiUserSearchLine } from "react-icons/ri";
import { useReminders } from "../../hooks/useReminders";
import { Cliente } from "../../interfaces/reminders.interface";
import { createNewMsg, getMascotas } from "../../utils/messages";
import { MessageBubbles } from "./MessageBubble";
import { MessageBubbleFile } from "./MessageBubbleFile";
import { Loader } from "../shared/Loader";
import { PDFViewer } from "@react-pdf/renderer";
import { PdfReminders } from "./PdfReminders";

interface Props {
    clientes: Cliente[];
}

export const Reminders = ({clientes}: Props) => {
    if (!clientes.length) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-600">No tienes mensajes pendientes.</p>
            </div>
        );
    }

    const [index, setIndex] = useState(0);
    const [x5, setX5] = useState(false);
    const [showPdf, setShowPdf] = useState(false);
    const clienteRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const {
        enviados,
        noEnviados,
        loader,
        messages,
        msjo,
        setMsjo,
        files,
        handleUpload,
        handleSend,
        handleKeyDown,
        deleteMessage,
    } = useReminders({clientes});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientes[index].status) {
            if (x5) {
                const clientessend = clientes.filter((cliente) => !cliente.status).slice(0, 5);
                clientessend.forEach((cliente) => {
                    handleSend(cliente);
                });
            } else {
                handleSend(clientes[index]);
            }
            clienteRefs.current[index + 1]?.focus();
        }
    };

    const filteredClientes = clientes.filter((cliente) =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.telefono?.includes(searchTerm)
    );

    // Scroll automático al cliente seleccionado
    useEffect(() => {
        if (clienteRefs.current[index]) {
            clienteRefs.current[index].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [index]);

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4 min-h-screen"
        >
            {/* Controles superiores */}
            <div className="lg:col-span-5 flex flex-wrap justify-between items-center gap-4">
                <label className="flex items-center gap-2 p-2 rounded-md text-cyan-600 transition-all group hover:bg-cyan-600 hover:text-white hover:scale-105">
                    <input
                        type="checkbox"
                        checked={x5}
                        onChange={() => setX5(!x5)}
                    />
                    Enviar 5 en 5
                </label>

                <div className="text-sm">
                    Enviados: {enviados.length} | No enviados: {noEnviados.length}
                </div>

                <button
                    className="flex items-center gap-1 p-2 rounded-md text-white bg-cyan-600 hover:bg-yellow-500 hover:scale-105 transition-all"
                    type="button"
                    onClick={() => setShowPdf(!showPdf)}
                >
                    {showPdf ? <PiAppWindowBold /> : <TfiPrinter />}
                </button>
            </div>

            {/* Vista PDF o Vista Conversación */}
            {showPdf ? (
                <div className="w-full h-[80vh] border shadow">
                    <PDFViewer width="100%" height="100%">
                        <PdfReminders sending={enviados} notsending={noEnviados} />
                    </PDFViewer>
                </div>
            ) : (
                <>
                    {/* Lista de clientes/chat */}
                    <div className="lg:col-span-2 overflow-y-auto max-h-[70vh] w-full mx-auto bg-gray-900 rounded">
                        <div className="sticky top-0 z-10 bg-gray-900">
                            {/* Buscador */}
                            <div className="px-4 p-2 relative">
                                <RiUserSearchLine size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar por nombre o teléfono"
                                    className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700"
                                />
                            </div>
                            <h2 className="font-bold text-white border-b-2 border-slate-100 text-xl p-2">Chats</h2>
                        </div>
                        {/* Lista filtrada */}
                        {filteredClientes.map((cliente) => {
                            // Buscar el índice real del cliente en la lista completa
                            const actualIndex = clientes.findIndex((c) => c === cliente);
                            return (
                                <div
                                    key={actualIndex}
                                    ref={(el) => (clienteRefs.current[actualIndex] = el)}
                                    onClick={() => {
                                        setIndex(actualIndex);
                                        setSearchTerm(""); // Limpiar búsqueda al seleccionar
                                    }}
                                    className={`flex items-center gap-2 p-2 cursor-pointer rounded ${
                                        index === actualIndex ? "bg-cyan-600 text-white" : "text-white"
                                    }`}
                                >
                                    <img src="/img/User.png" className="w-12 h-12 rounded-full" />
                                    <div className="flex-1 border-b border-slate-600 pb-2">
                                        <div className="flex justify-between">
                                            <span className="font-medium">{cliente.nombre}</span>
                                            <span className="text-sm">
                                                {new Date().toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                        {cliente.status && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-400 truncate w-48">
                                                    {cliente.mensajes.at(-1)}
                                                </span>
                                                <span className="text-cyan-400 text-xs font-bold px-2">✔✔</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Conversación actual */}
                    <div className="relative lg:col-span-3 flex flex-col bg-gray-800 rounded p-4 max-h-[70vh]">
                        <div className="mb-4 border-b-2 border-slate-100 flex items-start gap-4">
                            <img src="/img/User.png" className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <h2 className="text-white font-bold text-xl">{clientes[index].nombre}</h2>
                                <p className="text-gray-400">{clientes[index].telefono}</p>
                                {clientes[index].mascotas?.length > 0 && (
                                    <p className="text-sm text-gray-400">
                                        Mascotas: {getMascotas(clientes[index].mascotas)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="absolute left-80 top-0">
                            {loader && <Loader />}
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {clientes[index].mensajes.map((msg, idx) => (
                                <MessageBubbles key={`msg-${idx}`} {...createNewMsg(msg)} editable={false} />
                            ))}
                            {clientes[index].archivos.map((file, idx) => (
                                <MessageBubbleFile key={`file-${idx}`} file={file} {...createNewMsg("")} editable={false} />
                            ))}
                            {!clientes[index].status && messages.map((msg) => (
                                <MessageBubbles key={msg.id} {...msg} editable onDelete={() => deleteMessage(msg.id)} />
                            ))}
                            {!clientes[index].status && files.map((file) => (
                                <MessageBubbleFile key={file.id} file={file} {...createNewMsg("")} editable onDelete={() => deleteMessage('', file)} />
                            ))}
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            <label htmlFor="upload" className="cursor-pointer">
                                <PiPaperclipBold className="text-white" />
                            </label>
                            <input id="upload" type="file" multiple hidden onChange={(e) => handleUpload(e.target.files)} />
                                <textarea
                                    className="flex-1 p-2 rounded bg-gray-900 text-white resize-none"
                                    value={msjo}
                                    onChange={(e) => setMsjo(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, createNewMsg(msjo))}
                                    placeholder="Escribe un mensaje..."
                                    style={{ height: '28px' }}
                                />
                            <button type="submit" className="text-white">
                                <VscSend />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </form>
    );
};