import { useState } from "react";
import { Cliente } from "../../../interfaces";
import { toast } from "react-hot-toast/headless";
import { VscSend } from "react-icons/vsc";
import { PiPaperclipBold } from "react-icons/pi";

interface Props {
	clientes: Cliente[];
}

export const Reminders = ({ clientes }: Props) => {
    const [index, setIndex] = useState(0);
    const [msjo, setMsjo] = useState("");
    const [imo, setImo] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Mensaje enviado correctamente", {
            position: 'bottom-right'
        });
        console.log("Mensaje enviado:", sendMesage());
    }

    const sendMesage = () => {
        let msj

        if (imo) {
            msj = `Hola ${clientes[index].nombre}.\n\nLa clínica veterinaria Baalak', le informa que ${clientes[index].mensaje}\n\n${msjo}`;
        } else {
            msj = `Hola ${clientes[index].nombre}.\n\nLa clínica veterinaria Baalak', le informa que ${clientes[index].mensaje}`;
        }
        return msj
    }

    const adjustHeight = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;
        textarea.style.height = 'auto'; // Resetea la altura para que se ajuste al contenido
        textarea.style.height = textarea.scrollHeight + 'px'; // Establece la altura a la altura del contenido
    }

    return (
        <div className='flex flex-col gap-6 relative'>
            {clientes.length > 0 ?
                <form
                    className='grid grid-cols-1 lg:grid-cols-2 gap-2 auto-rows-max flex-1'
                    onSubmit={handleSubmit}>
                    <div className='bg-white border border-gray-300 shadow-sm rounded-md flex flex-col gap-2 p-5 h-fit lg:row-span-2'>
                        <h2 className='font-bold tracking-tight text-xl'>Clientes</h2>
                            <select
                                className='w-full p-2 border border-gray-600 rounded-md'
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
                        <p>Mascotas: {clientes[index].mascotas.map(mascota => (
                            <span key={mascota.nombre}>{mascota.nombre}</span>
                        ))}</p>
                    </div>
                    <div className='bg-white border shadow-sm rounded-md flex flex-col gap-2 p-5 h-fit'>
                        <h2 className='font-bold tracking-tight text-xl'>Mensaje</h2>
                        <div
                            className='w-full p-2 rounded-md text-white bg-gray-800'>
                            <div className="flex max-w-sm bg-gray-800 py-2">
                                <div className="wrap-anywhere">
                                    <p className='text-white bg-green-900 rounded-md p-5'>{sendMesage()}</p>
                                </div>
                            </div>
                            <hr className='border-black w-full' />
                            <div className='flex gap-3 items-center justify-between bg-gray-900 w-full p-2 rounded-md'>
                                <button
                                    className='hover:bg-gray-800 rounded-md p-2 shadow-sm transition-all group hover:scale-105'
                                    type='button'>
                                    <PiPaperclipBold className='hover:bg-gray-800 text-gray-400 rounded-md shadow-sm transition-all group hover:scale-105' />
                                </button>
                                <label className='text-gray-400 items-center w-full flex hover:bg-gray-800 rounded-md p-2 transition-all group hover:scale-105'>
                                    <input
                                        className='cursor-pointer mr-2'
                                        type='checkbox'
                                        onChange={(e) => {
                                            setImo(e.target.checked)
                                        }}
                                    />{'  Incluir mensaje opcional'}
                                </label>
                                <button
                                    className='hover:bg-gray-800 rounded-md p-2 shadow-sm transition-all group hover:scale-105'
                                    type='submit'>
                                    <VscSend className='hover:bg-gray-800 text-gray-400 rounded-md shadow-sm transition-all group hover:scale-105' />
                                </button>
                            </div>
                            {imo && (
                                <textarea
                                    className='w-full text-gray-900 p-2 border border-gray-600 rounded-md'
                                    value={msjo}
                                    onChange={(e) => {
                                        setMsjo(e.target.value)
                                    }}
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