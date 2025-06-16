import { useState } from "react";
import { Cliente } from "../../../interfaces";
import { toast } from "react-hot-toast/headless";

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
        <div className='flex flex-col items-center h-full'>
            <h1 className='text-2xl font-bold mb-2'>Recordatorios</h1>
            {clientes.length > 0 ?
                <>
                    <form
                        className='flex flex-col gap-4 w-full max-w-md'
                        onSubmit={handleSubmit}>
                        <div className={`bg-white border border-gray-300 shadow-sm rounded-md flex flex-col gap-2 p-5 h-fit lg:col-span-2 lg:row-span-2`}>
                            <h2 className='font-bold tracking-tight text-xl'>Clientes</h2>
                                <select
                                    className="w-full p-2 border border-gray-600 rounded-md"
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
                        <div className={`bg-white border border-gray-300 shadow-sm rounded-md flex flex-col gap-2 p-5 h-fit lg:col-span-2 lg:row-span-2`}>
                            <h2 className='font-bold tracking-tight text-xl'>Mensaje</h2>
                            <textarea
                                className="w-full p-2 border border-gray-600 rounded-md"
                                value={sendMesage()}
                                readOnly
                                onChange={adjustHeight}>
                            </textarea>
                            <label>
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        setImo(e.target.checked)
                                    }}
                                />{'  Incluir mensaje opcional'}
                            </label>
                            {imo && (
                                <textarea
                                    className="w-full p-2 border border-gray-600 rounded-md"
                                    value={msjo}
                                    onChange={(e) => {
                                        setMsjo(e.target.value)
                                    }}
                                    autoComplete="on"
                                    autoCorrect="on"
                                    onInput={adjustHeight}
                                />
                            )}
                        </div>
                        <button
						    className='btn-primary hover:bg-cyan-600'
						    type='submit'>Enviar mensaje
					    </button>
                    </form>
                </>
                :
                <p className='text-gray-600'>No tienes envíos de mensajes pendientes.</p>
            }
        </div>
    );
}