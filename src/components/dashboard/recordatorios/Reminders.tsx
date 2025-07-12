import { useRef, useState, useMemo } from "react";
import { VscSend } from "react-icons/vsc";
import { PiAppWindowBold, PiPaperclipBold } from "react-icons/pi";
import { TfiPrinter } from "react-icons/tfi";
import { PdfViewer } from "../pdf/PdfViewer";
import { useReminders } from "../../../hooks";
import { Cliente } from "../../../interfaces";
import { createNewMsg, getMascotas } from "../../../utils/messages";
import { MessageBubble } from "./MessageBubble";
import { MessageBubbleFile } from "./MessageBubbleFile";

interface Props {
  clientes: Cliente[];
  url: string;
  center: string;
  cel: string;
}

export const Reminders = ({ clientes, url, center, cel }: Props) => {
    if (!clientes.length) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-600">No tienes transportes pendientes.</p>
            </div>
        );
    }

    const [index, setIndex] = useState(0);
    const [x5, setX5] = useState(false);
    const [showPdf, setShowPdf] = useState(false);
    const clienteRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Usar hook custom para manejar mensajes, archivos y funciones
    const {
        messages,
        msjo,
        setMsjo,
        files,
        handleUpload,
        handleSend,
        handleKeyDown,
        deleteMessage,
    } = useReminders(url, center, cel);

    const enviados = useMemo(() => clientes.filter((c) => c.status), [clientes]);
    const noEnviados = useMemo(() => clientes.filter((c) => !c.status), [clientes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientes[index].status) {
            if (x5) {
                const clientessend = clientes.filter((cliente) => !cliente.status).slice(0, 5);
                clientessend.forEach((cliente) => {
                    cliente.mensaje.push(...messages.map((msj) => msj.message));
                    handleSend(cliente);
                });
            } else {
                clientes[index].mensaje.push(...messages.map((msj) => msj.message));
                handleSend(clientes[index]);
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4 h-screen"
            >
            <div className="lg:col-span-5 flex justify-between items-center">
                <label className="flex items-center gap-2 p-2 w-fit rounded-md text-cyan-600 transition-all group hover:bg-cyan-600 hover:text-white hover:scale-105">
                    <input
                        type="checkbox"
                        checked={x5}
                        onChange={() => setX5(!x5)}
                    />{" "}
                    Enviar 5 en 5
                </label>
                <div>
                    Enviados: {enviados.length} | No enviados: {noEnviados.length}
                </div>
                <button
                    className="gap-1 p-2 w-fit rounded-md text-white transition-all group bg-cyan-600 hover:bg-yellow-500 hover:scale-105"
                    type="button"
                    onClick={() => setShowPdf(!showPdf)}>
                    {showPdf ? <PiAppWindowBold /> : <TfiPrinter />}
                </button>
            </div>

            {showPdf ? (
                <div className="lg:col-span-5 transition-all group hover:bg-cyan-600 hover:text-white hover:scale-105">
                    <PdfViewer sending={enviados} notsending={noEnviados} fechas={[]} />
                </div>
            ) : (
                <>
                    <div className="lg:col-span-2 overflow-y-auto overscroll-contain h-2/3 w-full max-w-md mx-auto bg-gray-900 rounded p-4">
                        <div className="sticky top-0 bg-gray-900">
                            <h2 className='font-bold justify-between text-white tracking-tight text-xl py-4 px-4'>Chats</h2>
                            <hr className='border-slate-100 w-full rounded-md' />
                        </div>
                        {clientes.map((cliente, i) => (
                            <div
                                key={i}
                                ref={(el) => (clienteRefs.current[i] = el)}
                                onClick={() => setIndex(i)}
                                className={`p-2 cursor-pointer rounded ${
                                index === i ? "bg-cyan-600 text-white" : "text-white"
                                }`}
                            >
                                <img
                                    src={'/img/User.png'}
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div className="flex-1 border-slate-600 border-b pb-2">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-white">
                                            {cliente.nombre}
                                        </span>
                                        <span className="text-sm text-white">
                                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    {cliente.status && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400 truncate w-48">
                                                {cliente.mensaje[cliente.mensaje.length - 1]}
                                            </span>
                                            <span
                                                className="ml-2 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                                                style={{ color: '#34B7F1' }}>✔✔
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-2/3 lg:col-span-3 flex flex-col bg-gray-800 rounded p-4">
                        <div className="mb-4">
                            <h2 className="text-white font-bold text-xl">{clientes[index].nombre}</h2>
                            <p className="text-gray-400">{clientes[index].telefono}</p>
                            {clientes[index].mascotas.length > 0 && (
                                <p className="text-sm text-gray-400">
                                    Mascotas: {getMascotas(clientes[index].mascotas)}
                                </p>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto overscroll-contain w-full space-y-2">
                            {clientes[index].mensaje.map((msg, idx) => (
                                <MessageBubble
                                    key={`cmsg-${idx}`}
                                    {...createNewMsg(msg)}
                                    editable={false}
                                />
                            ))}
                            {messages.map((msg) => (
                                <MessageBubble
                                    key={msg.id}
                                    {...msg}
                                    editable={true}
                                    onDelete={() => deleteMessage(msg.id)}
                                />
                            ))}
                            {files.map((file) => (
                                <MessageBubbleFile
                                    key={file.id}
                                    file={file}
                                    {...createNewMsg("")}
                                    editable={true}
                                    onDelete={() => deleteMessage('',file)}
                                />
                            ))}
                        </div>

                        <div className="mt-4 flex gap-2 items-center">
                            <label htmlFor="upload" className="cursor-pointer">
                                <PiPaperclipBold className="text-white" />
                            </label>
                            <input
                                id="upload"
                                type="file"
                                multiple
                                hidden
                                onChange={(e) => handleUpload(e.target.files)}
                            />
                            <textarea
                                className="flex-1 p-2 rounded bg-gray-900 text-white overflow-hidden"
                                value={msjo}
                                onChange={(e) => setMsjo(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, createNewMsg(msjo))}
                                placeholder="Escribe un mensaje..."
                                style={{ resize: 'none', height: '28px' }}
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