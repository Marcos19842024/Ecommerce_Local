import { useState } from "react";
import { Reminders } from "../components/reminders/Reminders";
import { QrCode } from "../components/reminders/QrCode";
import { useClients } from "../hooks/useClients";
import { Cliente, ContactResponse } from "../interfaces/reminders.interface";
import { BsQrCodeScan } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa6";
import toast from "react-hot-toast";
import { prepareContacts } from "../helpers";
import { GrDocumentUpload } from "react-icons/gr";
import { RiMobileDownloadLine } from "react-icons/ri";
import { Loader } from "../components/shared/Loader";
import { url } from "../server/url";
import { center, cel } from "../server/user";

export const RemindersPage = () => {
  const [showQr, setShowQr] = useState(false);
  const [status, setStatus] = useState("Conectar WhatsApp al Servidor");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [info, setInfo] = useState<string | null>(null);
  const [showIb, setShowIb] = useState(true);
  const [list, setList] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleStatus = () => {
    setLoader(true);
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
        setLoader(false);
      } else {
        setStatus(res.statusText)
        toast.error(`Error ${res.status}: ${res.statusText}`, {
          position: "top-right"
        });
        setTimeout(() => setStatus('Conectar WhatsApp al Servidor'), 4000);
        setLoader(false);
      }
    })
    .catch(() => {
      toast.error("Error en la respuesta del servidor", {
        position: "top-right"
      });
      setStatus("Error en la respuesta del servidor")
      setTimeout(() => setStatus('Conectar WhatsApp al Servidor'), 4000)
      setLoader(false);
    })
    .finally();
  };

  const getContact = async () => {
    setLoader(true);
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
        setLoader(false);
      } else {
        toast.error(`Error ${res.status}: ${res.statusText}`, {
          position: "top-right"
        });
        setLoader(false);
      }
    })
    .catch(() => {
      toast.error("Error en la respuesta del servidor", {
        position: "top-right"
      });
      setLoader(false);
    })
    .finally();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLoader(true);
      const { data } = useClients({ e });
      if ((await data).length > 0) {
        setClientes(await data);
        setInfo(e.target.files[0].name);
        setShowIb(false);
        setList(false);
        setLoader(false);
      } else {
        setClientes([]);
        setLoader(false);
        e.target.value = "";
      }
    }
  }

  const handleModalContainerClick = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

  return (
    <div className="relative h-full flex flex-col gap-4 p-4">
      {showQr && 
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowQr(false)}
        >
          <div onClick={handleModalContainerClick}>
            <div
                className="bg-gray-900 rounded-lg shadow-lg text-white"
                onClick={(e) => e.stopPropagation()} // evita cerrar al hacer clic dentro
            >
              <QrCode />  
            </div>
          </div>
        </div>
      }
      {/* Título */}
      <h1 className="text-2xl font-bold">Envío de mensajes</h1>

      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        {/* Botones de control */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="flex items-center gap-2 text-white rounded-md px-3 py-2 transition-all bg-cyan-600 hover:bg-yellow-500 hover:scale-105"
            type="button"
            onClick={handleStatus}
          >
            <FaWhatsapp /> {status}
          </button>

          <button
            className="flex items-center gap-2 text-white rounded-md px-3 py-2 transition-all bg-cyan-600 hover:bg-yellow-500 hover:scale-105"
            type="button"
            onClick={() => setShowQr(!showQr)}
          >
            <BsQrCodeScan /> Escanear QR
          </button>
        </div>

        {/* Lista o carga de archivo */}
        {showIb ? (
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              id="inputfile"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFile}
              hidden
            />

            <button
              className="flex items-center gap-2 text-white rounded-md px-3 py-2 transition-all bg-cyan-600 hover:bg-yellow-500 hover:scale-105"
              onClick={getContact}
            >
              <RiMobileDownloadLine />
              Descargar Contactos
            </button>

            <label
              htmlFor="inputfile"
              className="cursor-pointer bg-cyan-600 text-white flex items-center px-3 py-2 rounded-md gap-2 hover:bg-yellow-500 hover:scale-105 transition-all"
            >
              <GrDocumentUpload />
              Subir Lista
            </label>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-cyan-700 text-sm font-medium">
            {list ? (
              <FaWhatsapp />
            ) : (
              <i className="fa fa-file-excel-o text-green-600" />
            )}
            <span>{`${info} (${clientes?.length || 0} Registros)`}</span>
          </div>
        )}
      </div>

      {/* Componente de mensajes */}
      {loader ? <Loader /> : <Reminders clientes={clientes} />}
    </div>
  )
}