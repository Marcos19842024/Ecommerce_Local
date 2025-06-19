import { useState } from "react";
import { Cliente } from "../../../interfaces";
import { toast } from "react-hot-toast/headless";
import { VscSend } from "react-icons/vsc";
import { PiPaperclipBold } from "react-icons/pi";
import { UploaderFiles } from "./UploaderFiles";

interface Props {
	clientes: Cliente[];
}

export const Reminders = ({ clientes }: Props) => {
    const [index, setIndex] = useState(0);
    const [msjo, setMsjo] = useState("");
    const [imo, setImo] = useState(false);
    const [fileShow, setFileShow] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Mensaje enviado correctamente", {
            position: 'bottom-right'
        });
    }

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

    const adjustHeight = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;
        textarea.style.height = 'auto'; // Resetea la altura para que se ajuste al contenido
        textarea.style.height = textarea.scrollHeight + 'px'; // Establece la altura a la altura del contenido
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setMsjo(""); // Limpia el mensaje después de enviar
        }
    }

    type MessageBubbleProps = {
        message: string;
        senderName: string;
        timestamp: string; // Formato como "10:30 AM"
        avatarUrl?: string;
        isOwnMessage?: boolean;
    };

    const MessageBubble = ({
        message,
        senderName,
        timestamp,
        avatarUrl,
        isOwnMessage = false,
    }: MessageBubbleProps) => {
        const alignment = isOwnMessage ? "justify-end" : "justify-start";
        const bgColor = isOwnMessage ? "bg-green-900" : "bg-gray-800";
        const textAlign = "text-pretty";
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
                        <p className={`text-xs text-gray-400 ${textAlign}`}>
                            {senderName} • {timestamp}
                        </p>
                        <p
                            className={`text-white text-sm ${bgColor} rounded-md p-2 mt-1 ${textAlign}`}>{message}
                        </p>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className='flex flex-col gap-6 relative'>
            {clientes.length > 0 ?
                <form
                    className='grid grid-cols-1 lg:grid-cols-3 gap-2 auto-rows-max flex-1'
                    onSubmit={handleSubmit}>
                    <div className='bg-white border border-gray-300 shadow-sm rounded-md flex flex-col gap-2 p-5 h-fit'>
                        <h2 className='font-bold tracking-tight text-xl'>Clientes</h2>
                            <select
                                className='p-2 border border-gray-600 rounded-md'
                                onChange={(e) => {
                                    setIndex(e.target.selectedIndex);
                                }}> {
                                clientes && clientes.map(item => (
                                    <option
                                        key={item.nombre}
                                        value={item.nombre}> {item.nombre}
                                    </option>
                                ))
                            }
                        </select>
                        <p>Telefono: {clientes[index].telefono}</p>
                    </div>
                    <div className='bg-white border w-full shadow-sm rounded-md flex flex-col gap-2 p-5 h-fit lg:col-span-2'>
                        <h2 className='font-bold tracking-tight text-xl'>Mensaje</h2>
                        <div
                            className='w-full rounded-md text-white bg-gray-800'>
                            <div className='flex gap-3 items-center justify-between bg-gray-900 w-full p-2 rounded-md'>
                                <img className="size-7 rounded-full bg-gray-800 text-gray-700" src='/img/user.png' alt='User'/>
                                <div className='flex flex-col bg-gray-900 w-full'>
                                    <p className='text-white w-full rounded-md'>{clientes[index].nombre}</p>
                                    <p className='text-gray-400 italic text-sm rounded-md'>{clientes[index].telefono}</p>
                                </div>
                                <p
                                    className='text-gray-400 w-full items-start text-pretty md:text-balance text-sm rounded-md'>Mascotas: {getMascotas(clientes[index].mascotas)}
                                </p>
                            </div>
                            <div className='relative flex flex-col bg-gray-800 rounded-md gap-2 right-0 p-5 h-fit lg:row-span-2'>
                                {MessageBubble({
                                    message: `Hola ${clientes[index].nombre}.`,
                                    senderName: "Baalak",
                                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    avatarUrl: '/img/Baalak-logo-banner-small.png',
                                    isOwnMessage: true,
                                })}
                                {MessageBubble({
                                    message: `La clínica veterinaria Baalak', le informa que ${clientes[index].mensaje}`,
                                    senderName: "Baalak",
                                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    avatarUrl: '/img/Baalak-logo-banner-small.png',
                                    isOwnMessage: true,
                                })}
                                {MessageBubble({
                                    message: msjo,
                                    senderName: "Baalak",
                                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    avatarUrl: '/img/Baalak-logo-banner-small.png',
                                    isOwnMessage: false,
                                })}
                                {fileShow && <div className='absolute bottom-0 left-0 bg-gray-900 p-2 rounded-md w-max h-fit'>
                                    <UploaderFiles />
                                </div>}
                                {msjo && (
                                    <div className='wrap-anywhere flex justify-end'>
                                        <p className='text-white w-auto text-sm text-pretty md:text-balance bg-green-900 rounded-md p-2'>{msjo}</p>
                                    </div>
                                )}
                            </div>
                            <hr className='border-black w-full' />
                            <div className="flex items-center justify-between bg-gray-900 w-full p-2 rounded-md">
                                <button
                                    className='hover:bg-gray-800 rounded-md p-1 shadow-sm transition-all group hover:scale-105'
                                    type='button'
                                    onClick={() => {
                                        if (fileShow) setFileShow(false);
                                        else setFileShow(true);
                                    }}>
                                    <PiPaperclipBold className='hover:bg-gray-800 text-gray-400 rounded-md shadow-sm transition-all group hover:scale-105' />
                                </button>
                                <label className='text-gray-400 items-center text-sm w-full flex hover:bg-gray-800 rounded-md p-1 transition-all group hover:scale-100'>
                                    <input
                                        className='cursor-pointer mr-2'
                                        type='checkbox'
                                        onChange={(e) => {
                                            setImo(e.target.checked)
                                            if (!e.target.checked) {
                                                setMsjo("");
                                            }
                                        }}
                                    />{'  Incluir mensaje opcional'}
                                </label>
                                <button
                                    className='hover:bg-gray-800 rounded-md p-1 shadow-sm transition-all group hover:scale-105'
                                    type='submit'>
                                    <VscSend className='hover:bg-gray-800 text-gray-400 rounded-md shadow-sm transition-all group hover:scale-105' />
                                </button>
                            </div>
                            {imo && (
                                <textarea
                                    className='w-full text-gray-900 border border-gray-600 p-2 rounded-md'
                                    value={msjo}
                                    onChange={(e) => {
                                        setMsjo(e.target.value)
                                    }}
                                    onKeyDown={handleKeyDown}
                                    autoComplete='on'
                                    autoCorrect='on'
                                    onInput={adjustHeight}
                                />
                            )}
                        </div>
                    </div>
                </form>
                :
                <div className='flex gap-3 items-center justify-center h-full'>
                    <p className='text-gray-600'>No tienes envíos de mensajes pendientes.</p>
                </div>
            }
        </div>
    );
}