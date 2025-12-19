import { useState } from "react";
import { Reminders } from "../components/reminders/Reminders";
import { QrCode } from "../components/reminders/QrCode";
import { useClients } from "../hooks/useClients";
import { Cliente, ContactResponse } from "../interfaces/reminders.interface";
import { FaWhatsapp } from "react-icons/fa6";
import toast from "react-hot-toast";
import { prepareContacts } from "../helpers";
import { GrDocumentUpload } from "react-icons/gr";
import { RiMobileDownloadLine } from "react-icons/ri";
import { Loader } from "../components/shared/Loader";
import { apiService } from "../services/api";
import { useReminders } from "../hooks/useReminders";

export const RemindersPage = () => {
  const [showQr, setShowQr] = useState(false);
  const [statustext, setStatustext] = useState("Conectar WhatsApp al Servidor");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [info, setInfo] = useState<string | null>(null);
  const [showIb, setShowIb] = useState(true);
  const [list, setList] = useState(false);
  const [loader, setLoader] = useState(false);
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const { handleCloseWhatsApp } = useReminders({ clientes });

  const handleStatus = async () => {
    setLoader(true);
    try {
      const res = await apiService.getWhatsAppStatus();
      if (!res.err) {
        if (res.statusText.includes('Conectado')) {
          setStatustext('WhatsApp Conectado');
          setWhatsappConnected(true);
          toast.success('WhatsApp ya está conectado', {
            position: "top-right"
          });
        } else {
          setStatustext(res.statusText);
        }
      } else {
        const response = await apiService.startWhatsApp();
        if (response.statusText === 'WhatsApp inicializándose...') {
            setShowQr(true);
            setStatustext('WhatsApp iniciándose, escanea el código QR');
            setWhatsappConnected(false);
            toast.success('WhatsApp iniciándose, escanea el código QR', {
              position: "top-right"
            });
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

  // Función que se ejecuta cuando WhatsApp se conecta
  const handleWhatsAppConnected = () => {
    setWhatsappConnected(true);
    setStatustext('WhatsApp Conectado');
    setShowQr(false);
    
    toast.success('¡WhatsApp conectado exitosamente!', {
      position: "top-right",
      duration: 3000
    });
  };

  const getContact = async () => {
    if (!whatsappConnected) {
      toast.error('Primero debes conectar WhatsApp', {
        position: "top-right"
      });
      return;
    }

    setLoader(true);
    try {
      // ✅ Usar apiService para obtener contactos de WhatsApp
      const response = await apiService.getWhatsAppContacts();
      
      if (!response.err) {
        const clientes: Cliente[] = prepareContacts((response as ContactResponse).statusText);
        setClientes(clientes);
        setInfo('Contactos');
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
      toast.error("Error en la respuesta del servidor", {
        position: "top-right"
      });
    } finally {
      setLoader(false);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!whatsappConnected) {
      toast.error('Primero debes conectar WhatsApp', {
        position: "top-right"
      });
      e.target.value = "";
      return;
    }

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
        toast.error("Error al procesar el archivo");
      } finally {
        setLoader(false);
      }
    }
  };

  const handleModalContainerClick = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

  // Función para obtener las clases del botón según el estado
  const getButtonClasses = (isDisabled: boolean) => {
    const baseClasses = "flex items-center gap-2 text-white rounded-md px-3 py-2 transition-all hover:scale-105";
    
    if (isDisabled) {
      return `${baseClasses} bg-gray-400 cursor-not-allowed opacity-60`;
    }
    
    return `${baseClasses} bg-cyan-600 hover:bg-yellow-500`;
  };

  // Función para obtener las clases del label del input file
  const getLabelClasses = (isDisabled: boolean) => {
    const baseClasses = "cursor-pointer text-white flex items-center px-3 py-2 rounded-md gap-2 transition-all hover:scale-105";
    
    if (isDisabled) {
      return `${baseClasses} bg-gray-400 cursor-not-allowed opacity-60`;
    }
    
    return `${baseClasses} bg-cyan-600 hover:bg-yellow-500`;
  };

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
                {/* Pasar la función callback para cuando WhatsApp se conecte */}
                <QrCode onWhatsAppConnected={handleWhatsAppConnected} />  
              </div>
            </div>
          </div>
        }

        {/* Controles superiores */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Botones de control */}
          <div className="flex flex-wrap items-center gap-2">
            {whatsappConnected ? (
              // Mostrar texto cuando WhatsApp está conectado (mismo estilo que total de registros)
              <button
                className="flex items-center gap-2 text-white rounded-md px-3 py-2 transition-all bg-cyan-600 hover:bg-yellow-500 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                type="button"
                onClick={handleCloseWhatsApp}
                disabled={loader}
              >
                <FaWhatsapp className="text-green-600" />
                <span>WhatsApp Conectado</span>
              </button>
            ) : (
              // Mostrar botón cuando WhatsApp no está conectado
              <button
                className="flex items-center gap-2 text-white rounded-md px-3 py-2 transition-all bg-cyan-600 hover:bg-yellow-500 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                type="button"
                onClick={handleStatus}
                disabled={loader}
              >
                <FaWhatsapp /> 
                {loader ? "WhatsApp iniciándose..." : statustext}
              </button>
            )}
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
                disabled={!whatsappConnected || loader}
              />

              <button
                className={getButtonClasses(!whatsappConnected || loader)}
                onClick={getContact}
                disabled={!whatsappConnected || loader}
              >
                <RiMobileDownloadLine />
                {loader ? "Cargando..." : "Descargar Contactos"}
              </button>

              <label
                htmlFor="inputfile"
                className={getLabelClasses(!whatsappConnected || loader)}
              >
                <GrDocumentUpload />
                {loader ? "Cargando..." : "Subir Lista desde Excel"}
              </label>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-cyan-700 text-sm font-medium">
              {list ? (
                // Cuando son contactos de WhatsApp
                <FaWhatsapp className="text-green-600" />
              ) : (
                // Cuando es una lista subida desde Excel
                <i className="fa fa-file-excel-o text-green-600" />
              )}
              <span>
                {list 
                  ? `${clientes?.length || 0} Contactos`  // Para contactos de WhatsApp
                  : `${info} (${clientes?.length || 0} Registros)`  // Para lista de Excel
                }
              </span>
            </div>
          )}
        </div>

        {/* Indicador de estado de WhatsApp */}
        {!whatsappConnected && (
          <div className="mt-3 p-2 bg-yellow-100 border border-yellow-400 rounded-md">
            <p className="text-yellow-800 text-sm text-center">
              ⚠️ <strong>Conecta WhatsApp primero</strong> para poder descargar contactos o subir listas
            </p>
          </div>
        )}
      </div>

      {/* Componente de mensajes */}
      {loader ? <Loader /> : <Reminders clientes={clientes} />}
    </div>
  );
};