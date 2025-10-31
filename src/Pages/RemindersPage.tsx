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
import { apiService } from "../services/api";

export const RemindersPage = () => {
  const [showQr, setShowQr] = useState(false);
  const [statustext, setStatustext] = useState("Conectar WhatsApp al Servidor");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [info, setInfo] = useState<string | null>(null);
  const [showIb, setShowIb] = useState(true);
  const [list, setList] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleStatus = async () => {
    setLoader(true);
    try {
      const res = await apiService.getWhatsAppStatus();
      if (!res.err) {
        setStatustext(res.statusText);
      } else {
        const response = await apiService.startWhatsApp();
        if (response.statusText === 'WhatsApp inicializándose...') {
            setTimeout(async () => {
              setShowQr(true);
              setStatustext('Escanea el código QR para conectar WhatsApp');
              toast.success('WhatsApp iniciándose, por favor escanea el código QR', {
                position: "top-right"
              });
            }, 5000);
        } else {
          setStatustext(response.statusText);
          toast.error(`Error ${response.status}: ${response.statusText}`, {
            position: "top-right"
          });
          setTimeout(() => setStatustext('Conectar WhatsApp al Servidor'), 4000);
        }
      }
    } catch (error: any) {
      toast.error("Error en la respuesta del servidor", {
        position: "top-right"
      });
      setStatustext("Error en la respuesta del servidor");
      setTimeout(() => setStatustext('Conectar WhatsApp al Servidor'), 4000);
    } finally {
      setLoader(false);
    }
  };

  const getContact = async () => {
    setLoader(true);
    try {
      // ✅ Usar apiService para obtener contactos de WhatsApp
      const response = await apiService.getWhatsAppContacts();
      
      if (!response.err) {
        const clientes: Cliente[] = prepareContacts((response as ContactResponse).statusText);
        setClientes(clientes);
        setInfo('Contactos de WhatsApp');
        setShowIb(false);
        setList(true);
        toast.success('Contactos obtenidos con éxito!', {
          position: "top-right"
        });
      } else {
        toast.error(`Error ${response.status}: ${response.statusText}`, {
          position: "top-right"
        });
      }
    } catch (error) {
      console.error('Error getting WhatsApp contacts:', error);
      toast.error("Error en la respuesta del servidor", {
        position: "top-right"
      });
    } finally {
      setLoader(false);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLoader(true);
      try {
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
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error("Error al procesar el archivo");
      } finally {
        setLoader(false);
      }
    }
  };

  const handleModalContainerClick = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

  return (
    <div className="flex flex-col flex-1 w-full min-h-screen p-4">
      <div className="overflow-y-auto rounded-md bg-white p-2 shadow-md">
        {showQr && 
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowQr(false)}
          >
            <div onClick={handleModalContainerClick}>
              <div
                className="bg-gray-900 rounded-lg shadow-lg text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <QrCode />  
              </div>
            </div>
          </div>
        }

        {/* Controles superiores */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Botones de control */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="flex items-center gap-2 text-white rounded-md px-3 py-2 transition-all bg-cyan-600 hover:bg-yellow-500 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              type="button"
              onClick={handleStatus}
              disabled={loader}
            >
              <FaWhatsapp /> 
              {loader ? "WhatsApp iniciándose..." : statustext}
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
                className="flex items-center gap-2 text-white rounded-md px-3 py-2 transition-all bg-cyan-600 hover:bg-yellow-500 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={getContact}
                disabled={loader}
              >
                <RiMobileDownloadLine />
                {loader ? "Cargando..." : "Descargar Contactos"}
              </button>

              <label
                htmlFor="inputfile"
                className="cursor-pointer bg-cyan-600 text-white flex items-center px-3 py-2 rounded-md gap-2 hover:bg-yellow-500 hover:scale-105 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <GrDocumentUpload />
                {loader ? "Cargando..." : "Subir Lista desde Excel"}
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
      </div>

      {/* Componente de mensajes */}
      {loader ? <Loader /> : <Reminders clientes={clientes} />}
    </div>
  );
};