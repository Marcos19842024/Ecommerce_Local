import { useState } from "react";
import { Reminders, Shellinabox } from "../../components/dashboard";
import { useClients } from "../../hooks";
import { Cliente, ContactResponse } from "../../interfaces";
import { PiTerminalWindow } from "react-icons/pi";
import { FaWhatsapp } from "react-icons/fa6";
import toast from "react-hot-toast";
import { prepareContacts } from "../../helpers";

export const DashboardRemindersPage = () => {
  const [showShell, setShowShell] = useState(false);
  const [status, setStatus] = useState("Conectar WhatsApp al Servidor");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [info, setInfo] = useState<string | null>(null);
  const [showIb, setShowIb] = useState(true);
  const [list, setList] = useState(false)
  const url = 'http://veterinariabaalak.com/';
  const center = 'Baalak';
  const cel = '9812062582';

  const handleStatus = () => {
    fetch(`${url}status/${center}/${cel}`, {
      method: "GET",
    })
    .then(res => res.json())
    .then(res => {
      if (!res.err) {
        setStatus(res.statusText)
        toast.success(res.statusText, {
          position: "top-right"
        });
      } else {
        setStatus(res.statusText)
        toast.error(`Error ${res.status}: ${res.statusText}`, {
          position: "top-right"
        });
        setTimeout(() => setStatus('Conectar WhatsApp al Servidor'), 4000)
      }
    })
    .catch(() => {
      toast.error("Error en la respuesta del servidor", {
        position: "top-right"
      });
      setStatus("Error en la respuesta del servidor")
      setTimeout(() => setStatus('Conectar WhatsApp al Servidor'), 4000)
    })
    .finally();
  };

  const getContact = async () => {
    fetch(`${url}contact`, {
      method: "GET",
    })
    .then(res => res.json())
    .then(res => {
      if (!res.err) {
        const clientes: Cliente[] = prepareContacts((res as ContactResponse).statusText)
        setClientes(clientes);
        setInfo('Contactos de WhatsApp');
        setShowIb(false);
        setList(true);
        toast.success('Contactos obtenidos con exito!', {
          position: "top-right"
        });
      } else {
        toast.error(`Error ${res.status}: ${res.statusText}`, {
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

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const { data } = useClients({ e });
      if ((await data).length > 0) {
        setClientes(await data);
        setInfo(e.target.files[0].name);
        setShowIb(false);
        setList(false);
      } else {
        setClientes([]);
        e.target.value = "";
      }
    }
  }

  return (
    <div className="relative h-full flex flex-col gap-1">
      {showShell && <Shellinabox/>}
      <h1 className="text-2xl font-bold">Envío de mensajes</h1>
      <div className="flex items-center justify-between">
        <div className="flex justify-between items-center">
          <button
            className='hover:bg-cyan-600 flex justify-between items-center gap-1 py-2 p-3 justify-between w-fit text-cyan-600 hover:text-white rounded-md p-2 transition-all group hover:scale-105'
            type="button"
            onClick={handleStatus}>
            <FaWhatsapp />
            <span className="text-sm font-medium">
              {status}
            </span>
          </button>
          <button
            className='hover:bg-cyan-600 flex justify-between items-center gap-1 py-2 p-3 justify-between w-fit text-cyan-600 hover:text-white rounded-md p-2 transition-all group hover:scale-105'
            type="button"
            onClick={() => setShowShell(!showShell)}>
            <PiTerminalWindow />
            <span className="text-sm font-medium">
                Acceder al Servidor
            </span>
          </button>
        </div>
        {showIb ?
          <div className="flex items-center justify-between">
            <input
              type="file"
              id="inputfile"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFile}
              className="file-input file-input-bordered w-full max-w-xs"
              hidden
            />
            <label
              className='bg-black text-white flex items-center m-1 self-end py-[6px] px-2 rounded-md text-sm gap-1 font-semibold hover:bg-cyan-600 hover:scale-105'
              onClick={getContact}>
              <span><i className="fa fa-cloud-download fa-2x"></i></span>
              <p>Click To Download Contacts</p>
            </label>
            <label
              htmlFor="inputfile"
              className='bg-black text-white flex items-center m-1 self-end py-[6px] px-2 rounded-md text-sm gap-1 font-semibold hover:bg-cyan-600 hover:scale-105'>
              <span><i className="fa fa-cloud-upload fa-2x"></i></span>
              <p>Click To Upload List</p>
            </label>
          </div>
        :
          <div className="flex w-fit items-center justify-between gap-1 text-cyan-600">
            {list  ?
              <FaWhatsapp />
            :
              <i
                className="fa fa-file-excel-o fa-1x"
                style={{color:"green"}}>
              </i>
            }
            <span
              className='w-fit'>{`  ${info} (${clientes ? clientes.length : 0} Registros)`}
            </span>
          </div>
        }
      </div>
      <Reminders
        clientes={clientes}
        url={url}
        center={center}
        cel={cel}
      />
    </div>
  )
}