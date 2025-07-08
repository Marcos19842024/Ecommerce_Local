import { useRef, useState } from "react";
import { Cliente, FileWithPreview, MessageBubbleFileProps, MessageBubbleProps } from "../../../interfaces";
import { toast } from "react-hot-toast";
import { VscSend } from "react-icons/vsc";
import { PiAppWindowBold, PiPaperclipBold } from "react-icons/pi";
import { v4 as uuidv4 } from "uuid";
import { PdfViewer } from "../pdf/PdfViewer";
import { TfiPrinter } from "react-icons/tfi";
import { FileViewer } from "../file/FileViewer";

interface Props {
	clientes: Cliente[];
    url: string;
    center: string;
    cel: string;
}

export const Reminders = ({ clientes, url, center, cel }: Props) => {
    const [index, setIndex] = useState(0);
    const [msjo, setMsjo] = useState("");
    const [x5, setX5] = useState(false);
    const [showPdf, setShowPdf] = useState(false);
    const [messages, setMessages] = useState<MessageBubbleProps[]>([]);
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const clienteRefs = useRef<(HTMLDivElement | null)[]>([]);

    const getMascotas = (mascotas: { nombre: string }[]) => {
        if (mascotas.length === 1) {
            return `${mascotas[0].nombre}.`;
        } else {
            let mascotaList = '';
            for (let i = 0; i < mascotas.length; i++) {
                if (i === 0) {
                    mascotaList += mascotas[i].nombre;
                } else {
                    if (i === (mascotas.length - 1)) {
                        mascotaList += " y " + mascotas[i].nombre + ".";
                    } else {
                        mascotaList += ", " + mascotas[i].nombre;
                    }
                }
            }
            return mascotaList;
        }
    }

    const newMsg: MessageBubbleProps = {
        id: uuidv4(),
        message: msjo,
        senderName: `Baalak Veterinaria`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatarUrl: '/img/Baalak-logo-banner-small.png',
        isOwnMessage: true,
        editable: true,
    };

    const MessageBubble = ({
        id,
        message,
        senderName,
        timestamp,
        avatarUrl,
        isOwnMessage,
        editable,
    }: MessageBubbleProps) => {
        const alignment = isOwnMessage ? "justify-end" : "justify-start";
        const bgColor = isOwnMessage ? "bg-green-900" : "bg-gray-800";
        const flexDirection = isOwnMessage ? "flex-row-reverse" : "flex-row";

        return (
            <div className={`flex ${alignment}`}>
                <div className={`flex ${flexDirection} items-start gap-2 max-w-md`}>
                    {avatarUrl && (
                        <img
                            src={avatarUrl}
                            alt={senderName}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    )}
                    <div>
                        <p className={`text-xs text-gray-400 text-pretty`}>
                            {senderName} • {timestamp}
                        </p>
                        <p
                            className={`text-white text-sm ${bgColor} rounded-md p-2 mt-1 text-pretty`}>{message}
                        </p>
                    </div>
                    {editable && (
                        <span
                            className="cursor-pointer text-xl text-red-500"
                            onClick={() => deleteMessage(id)}
                        >
                            &times;
                        </span>
                    )}
                </div>
            </div>
        );
    };

    const MessageBubbleFile = ({
        file,
        senderName,
        timestamp,
        avatarUrl,
        isOwnMessage,
        editable,
    }: MessageBubbleFileProps) => {
        const alignment = isOwnMessage ? "justify-end" : "justify-start";
        const bgColor = isOwnMessage ? "bg-green-900" : "bg-gray-800";
        const flexDirection = isOwnMessage ? "flex-row-reverse" : "flex-row";

        return (
            <div className={`flex ${alignment}`}>
                <div className={`flex ${flexDirection} items-start gap-2 max-w-md`}>
                    {avatarUrl && (
                        <img
                            src={avatarUrl}
                            alt={senderName}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    )}
                    <div>
                        <p className={`text-xs text-gray-400 text-pretty`}>
                            {senderName} • {timestamp}
                        </p>
                        <p
                            className={`text-white text-xs ${bgColor} rounded-md p-2 mt-1 text-pretty`}>
                            <FileViewer file={file} />
                            <div className="flex justify-between items-center border p-2 rounded bg-slate-100">
                                <a
                                    className="left flex items-center gap-1"
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i
                                        className={file.icon}
                                        style={{ color: file.color }}
                                    >
                                    </i>
                                    <h5 className="text-xs text-cyan-800">{file.name}</h5>
                                </a>
                            </div>
                        </p>
                    </div>
                    {editable && (
                        <span
                            className="cursor-pointer text-xl text-red-500"
                            onClick={() => deleteMessage('',file)}
                        >
                            &times;
                        </span>
                    )}
                </div>
            </div>
        );
    };

    const handleUpload = (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;
        const formData = new FormData();
        for (let i = 0; i < fileList.length; i++) {
            formData.append("files", fileList[i]);
        }
        fetch(`${url}upload`, {
            method: "POST",
            body: formData,
        })
        .then(res => res.json())
        .then(res => {
            if (!res.err) {
                const newFiles: FileWithPreview[] = res.statusText.map((filename: string) => {
                    const ext = filename.split(".").pop() || "";
                    const [icon, color] = getFileTypes(ext);
                    return {
                        id: uuidv4(),
                        name: filename,
                        type: ext,
                        icon,
                        color,
                        url: `${url}media/${filename}`,
                    };
                });
                setFiles(prev => [
                    ...prev,
                    ...newFiles.filter(nf => !prev.find(f => f.name === nf.name)),
                ]);
                toast.success("Archivos subidos correctamente", {
                    position: "top-right"
                });
            } else {
                toast.error("Error al subir los archivos", {
                    position: "top-right"
                });
            }
        })
        .catch(() => {
            toast.error("Error en la respuesta del servidor", {
                position: "top-right"
            });
        })
        .finally();
    };

    const getFileTypes = (filetype: string): [string, string] => {
        switch (filetype) {
            case "xlsx":
            case "xls":
            case "xlsm":
                return ["fa fa-file-excel-o", "green"];
            case "zip":
            case "rar":
            case "7zip":
                return ["fa fa-file-archive-o", "orange"];
            case "doc":
            case "docx":
                return ["fa fa-file-word-o", "blue"];
            case "pptx":
                return ["fa fa-file-powerpoint-o", "red"];
            case "mp3":
            case "wav":
            case "m4a":
                return ["fa fa-file-sound-o", "blue"];
            case "mp4":
            case "mov":
            case "avi":
            case "wmv":
            case "flv":
            case "3gp":
                return ["fa fa-file-video-o", "blue"];
            case "png":
            case "jpg":
            case "ico":
            case "gif":
            case "jpeg":
            case "svg":
                return ["fa fa-file-picture-o", "black"];
            case "pdf":
                return ["fa fa-file-pdf-o", "red"];
            case "css":
            case "html":
            case "cs":
                return ["fa fa-file-code-o", "black"];
            case "txt":
                return ["fa fa-file-text-o", "blue"];
            default:
                return ["fa fa-file", "black"];
        }
    };

    const handleDelete = (filename: string) => {
        fetch(`${url}delete/${filename}`, { method: "DELETE" })
        .then(res => res.json())
        .then(res => {
            if (!res.err) {
                toast.success("Archivo eliminado correctamente", {
                    position: "top-right"
                });
                setFiles(prev => prev.filter(file => file.name !== filename));
            } else {
                toast.error(`Error al eliminar el archivo: ${res.err}`, {
                    position: "top-right"
                });
            }
        })
        .catch(() => {
            toast.error("Error en la respuesta del servidor", {
                position: "top-right"
            });
        })
        .finally();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            if (msjo.trim() === "") {
                toast.error("Por favor, escribe un mensaje antes de enviar.", {
                    position: 'top-right'
                });
            } else {
                newMsg.message = msjo;
                setMessages((prev) => [...prev, newMsg]);
                setMsjo("")
            }
        }
    }

    const deleteMessage = (idMessageToDelete?: string, fileToDelete?: FileWithPreview) => {
        if (idMessageToDelete)setMessages((prev) => prev.filter((msg) => msg.id !== idMessageToDelete))
        if (fileToDelete) {
            setFiles((prev) => prev.filter((file) => file.id !== fileToDelete?.id))
            handleDelete(fileToDelete.name)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!clientes[index].status) {
            if (x5) {
                const clientessend = clientes.filter((cliente) => {
                    return cliente.status === false;
                }).slice(0,5);
                clientessend.map((cliente) => (
                    cliente.mensaje.push(...messages.map((msj) => msj.message)),
                    handleSend(cliente)
                ))
            } else {
                clientes[index].mensaje.push(...messages.map((msj) => msj.message))
                handleSend(clientes[index])
            }
        }
    }

    const handleSend = async (cliente: Cliente) => {
        let data = {
            "message": cliente.mensaje,
            "phone": `521${cliente.telefono}`,
            "pathtofiles": files.map(file => file.name),
        };
        await fetch(`${url}send/${center}/${cel}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type':'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            if(!res.err) {
                cliente.status = true
                toast.success("Mensaje enviado correctamente", {
                    position: "top-right"
                });
            } else {
                toast.error(res.statusText,{
                    position: 'top-right'
                });
            }
        }).catch(() => {
            toast.error(`Error en la respuesta del servidor`,{
                position: 'top-right'
            });
        })
        .finally(() => {
            const indexsend = clientes.indexOf(cliente)
            if (clienteRefs.current[indexsend]) {
                clienteRefs.current[indexsend + 1]?.click()
            }
        });
    }

    return (
        <>
            {clientes.length > 0 ?
                <form
                    className='h-screen grid grid-cols-1 lg:grid-cols-5 bg-white w-full p-1 rounded-md flex flex-col'
                    onSubmit={handleSubmit}>
                    <div className="lg:col-span-5 p-3 rounded-md flex justify-between items-center px-4 py-2 bg-gray-200 border-b border-gray-300 shadow-sm select-none">
                        <label
                            className='p-2 items-center hover:bg-cyan-600 text-cyan-600 hover:text-white justify-between text-sm w-fit flex rounded-md transition-all group hover:scale-105'
                            htmlFor="x5">
                            <input
                                className='cursor-pointer mr-2'
                                id="x5"
                                type='checkbox'
                                onChange={() => setX5(!x5)}
                            />Enviar mensajes de 5 en 5
                        </label>
                        <div className='space-x-2 text-cyan-600 justify-between px-2 text-sm w-fit flex rounded-md p-1 transition-all group hover:scale-105'>
                            <span className="text-sm text-gray-800 py-1 font-medium">Mensajes enviados:</span>
                            <span className="text-sm py-1 font-medium">
                                {` (Enviados ${clientes.filter(n => n.status === true).length})`}
                            </span>
                            <span className="text-sm text-red-600 py-1 font-medium">
                                {` (No enviados ${clientes.filter(n => n.status === false).length})`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <button
                                className='hover:bg-cyan-600 text-cyan-600 hover:text-white rounded-md p-2 transition-all group hover:scale-105'
                                type="button"
                                onClick={() => setShowPdf(!showPdf)}>
                                {showPdf ? <PiAppWindowBold /> : <TfiPrinter />}
                            </button>
                        </div>
                    </div>
                    {showPdf ?
                        <div className="lg:col-span-5">
                            <PdfViewer
                                sending={
                                    clientes.filter(cliente => {
                                        return cliente.status === true
                                    })
                                }
                                notsending={
                                    clientes.filter(cliente => {
                                        return cliente.status === false
                                    })
                                }
                            />
                        </div>
                    :
                        <>
                            <div className="lg:col-span-2 overflow-y-auto overscroll-contain ... h-2/3 w-full max-w-md mx-auto bg-gray-900 border border-grey-900 rounded-md shadow-sm">
                                <h2 className='font-bold text-white tracking-tight text-xl py-4 px-4'>Chats</h2>
                                <hr className='border-slate-600 w-full rounded-md' />
                                {clientes.map((cliente, i) => (
                                    <div
                                        className={`flex items-center px-2 py-3 cursor-pointer hover:bg-cyan-600 transition focus:bg-cyan-600 ${index === i ? 'bg-cyan-600 text-white' : 'bg-gray-900'}`}
                                        key={i}
                                        ref={(el) => (clienteRefs.current[i] = el)}
                                        onClick={() => {
                                            setIndex(i)
                                        }}
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
                            <div className='relative lg:col-span-3 w-full flex flex-col rounded-md text-white bg-gray-800 h-2/3'>
                                <div className='rounded-md flex gap-3 items-center justify-between bg-gray-900 w-full p-2'>
                                    <img
                                        className="size-7 rounded-full bg-gray-800 text-gray-700"
                                        src='/img/User.png'
                                        alt='User'
                                    />
                                    <div className='flex flex-col bg-gray-900 w-full'>
                                        <p className='text-white w-full rounded-md'>{clientes[index].nombre}</p>
                                        <p className='text-gray-400 italic text-sm rounded-md'>{clientes[index].telefono}</p>
                                    </div>
                                    {clientes[index].mascotas.length > 0 &&
                                        <p className='text-gray-400 w-full items-start text-pretty md:text-balance text-sm rounded-md'>
                                            Mascotas: {getMascotas(clientes[index].mascotas)}
                                        </p>
                                    }
                                </div>
                                <hr className='border-slate-600 w-full rounded-md' />
                                <div className='overflow-y-auto overscroll-contain rounded-md flex flex-col bg-gray-800 gap-2 right-0 p-5'>
                                    {clientes[index].mensaje.map((msg, index) => (
                                        <MessageBubble
                                            key={index}
                                            id={newMsg.id}
                                            message={msg}
                                            senderName={newMsg.senderName}
                                            timestamp={newMsg.timestamp}
                                            avatarUrl={newMsg.avatarUrl}
                                            isOwnMessage={newMsg.isOwnMessage}
                                            editable={false}
                                        />
                                    ))}
                                    {messages && (
                                        messages.map((msg, index) => (
                                            <MessageBubble
                                                key={index}
                                                id={msg.id}
                                                message={msg.message}
                                                senderName={msg.senderName}
                                                timestamp={msg.timestamp}
                                                avatarUrl={msg.avatarUrl}
                                                isOwnMessage={msg.isOwnMessage}
                                                editable={msg.editable}
                                            />
                                        ))
                                    )}
                                    {files && (
                                        files.map((file, index) => (
                                            <MessageBubbleFile
                                                key={index}
                                                id={file.id}
                                                file={file}
                                                senderName={newMsg.senderName}
                                                timestamp={newMsg.timestamp}
                                                avatarUrl={newMsg.avatarUrl}
                                                isOwnMessage={true}
                                                editable={true}
                                            />
                                        ))
                                    )}
                                </div>
                                <div className='mt-auto'>
                                    <hr className='border-slate-600 w-full rounded-md' />
                                    <div className="flex items-center rounded-md justify-between bg-gray-900 w-full gap-2 p-2">
                                        <input
                                            type="file"
                                            id="upload"
                                            hidden
                                            multiple
                                            onChange={(e) => handleUpload(e.target.files)}
                                        />
                                        <label
                                            className="hover:bg-gray-800 rounded-md p-1 shadow-sm transition-all group hover:scale-105"
                                            htmlFor="upload">
                                            <PiPaperclipBold className='hover:bg-gray-800 gap-2 text-gray-400 rounded-md shadow-sm transition-all group hover:scale-105' />
                                        </label>
                                        <textarea
                                            className='min-h-[15px] text-gray-400 items-center text-sm w-full flex bg-gray-900 hover:bg-gray-800 rounded-md p-1 transition-all'
                                            value={msjo}
                                            placeholder="Escribe un mensaje opcional..."
                                            onChange={(e) => setMsjo(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            autoComplete='on'
                                            autoCorrect='on'
                                            style={{ resize: 'none', height: '28px' }}
                                        />
                                        <button
                                            className='hover:bg-gray-800 rounded-md p-1 shadow-sm transition-all group hover:scale-105'
                                            type='submit'>
                                            <VscSend className='hover:bg-gray-800 text-gray-400 rounded-md shadow-sm transition-all group hover:scale-105' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </form>
            :
                <div className='flex gap-3 items-center justify-center h-full'>
                    <p className='text-gray-600'>No tienes envíos de mensajes pendientes.</p>
                </div>
            }
        </>
    );
}