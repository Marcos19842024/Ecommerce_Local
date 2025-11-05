import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { getFileTypes } from "../utils/files";
import { Cliente, MessageBubble, RemindersProps } from "../interfaces/reminders.interface";
import { apiService } from "../services/api";
import { cel, center } from "../server/user";
import { FileWithPreview } from "../interfaces/shared.interface";
import { createNewMsg } from "../utils/messages";

export const useReminders = ({clientes}: RemindersProps) => {
  const [messages, setMessages] = useState<MessageBubble[]>([]);
  const [msjo, setMsjo] = useState("");
  const [loader, setLoader] = useState(false);
  const enviados = useMemo(() => clientes.filter((c) => c.status), [clientes]);
  const noEnviados = useMemo(() => clientes.filter((c) => !c.status), [clientes]);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    
    setLoader(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        formData.append("files", fileList[i]);
      }

      // ✅ Usar apiService para subir archivos - pero necesitamos parsear la respuesta
      const response = await apiService.uploadWhatsAppFile(formData);
      
      // Si la respuesta es un objeto Response de fetch, necesitamos parsearla
      let responseData;
      if (response instanceof Response) {
        responseData = await response.json();
      } else {
        responseData = response;
      }

      // Función para generar IDs únicos (compatible con todos los navegadores)
      const generateId = () => {
        return 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      };

      // Función helper para extraer nombres de archivo
      const extractFilenames = (data: any): string[] => {
        // Si el servidor responde con un array de nombres de archivo
        if (Array.isArray(data)) {
          return data.filter(item => typeof item === 'string');
        }
            
        // Si el servidor responde con un objeto que contiene los nombres
        if (data && typeof data === 'object') {
          // Buscar en propiedades comunes
          if (Array.isArray(data.files)) {
            return data.files.filter((item: any) => typeof item === 'string');
          }
          if (Array.isArray(data.uploadedFiles)) {
            return data.uploadedFiles.filter((item: any) => typeof item === 'string');
          }
          if (Array.isArray(data.filenames)) {
            return data.filenames.filter((item: any) => typeof item === 'string');
          }
          
          // Si hay una propiedad con el nombre del archivo
          if (data.filename && typeof data.filename === 'string') {
            return [data.filename];
          }
          if (data.name && typeof data.name === 'string') {
            return [data.name];
          }
                
          // Buscar cualquier propiedad que sea un string que parezca un nombre de archivo
          const filenames: string[] = [];
          Object.values(data).forEach(value => {
            if (typeof value === 'string' && value.includes('.') && value !== 'OK') {
              filenames.push(value);
            }
          });
          if (filenames.length > 0) {
              return filenames;
          }
        }
            
        // Si es un string simple (pero no "OK")
        if (typeof data === 'string' && data !== 'OK' && data.includes('.')) {
          return [data];
        }
        
        console.warn('No se pudieron extraer nombres de archivo de:', data);
        return [];
      };

      const uploadedFiles = extractFilenames(responseData);

      if (uploadedFiles.length > 0) {
        const newFilesWhitPreview: FileWithPreview[] = uploadedFiles.map((filename: string) => {
          const ext = filename.split(".").pop()?.toLowerCase() || "";
          const [icon, color] = getFileTypes(ext);
          return {
            id: generateId(),
            name: filename,
            type: ext,
            icon,
            color,
            url: `/media/${filename}`,
          };
        });
          
        const newFiles = newFilesWhitPreview.map((file) =>
          createNewMsg(file)
        );
          
        setMessages((prev) => {
          const strings = prev.filter(msg => typeof msg.message === 'string');
          const existingFiles = prev.filter(msg => typeof msg.message !== 'string');
          
          const uniqueNewFiles = newFiles.filter(nf =>
            !existingFiles.some(f => (f.message as FileWithPreview).name === (nf.message as FileWithPreview).name)
          );
            
          return [...strings, ...existingFiles, ...uniqueNewFiles];
        });
          
        toast.success(`Archivos subidos correctamente: ${uploadedFiles.length} archivo(s)`);
      } else {
        // Si no se pudieron extraer nombres, pero la respuesta fue exitosa
        // Podemos usar los nombres originales de los archivos subidos
        console.log('Using original file names since no filenames were returned');
            
        const originalFiles: FileWithPreview[] = Array.from(fileList).map((file) => {
          const ext = file.name.split(".").pop()?.toLowerCase() || "";
          const [icon, color] = getFileTypes(ext);
          return {
            id: generateId(),
            name: file.name,
            type: ext,
            icon,
            color,
            url: URL.createObjectURL(file),
          };
        });
            
        const newFiles = originalFiles.map((file) =>
          createNewMsg(file)
        );
            
        setMessages((prev) => {
          const strings = prev.filter(msg => typeof msg.message === 'string');
          const existingFiles = prev.filter(msg => typeof msg.message !== 'string');
          
          const uniqueNewFiles = newFiles.filter(nf =>
            !existingFiles.some(f => (f.message as FileWithPreview).name === (nf.message as FileWithPreview).name)
          );
            
          return [...strings, ...existingFiles, ...uniqueNewFiles];
        });
            
        toast.success(`Archivos preparados localmente: ${fileList.length} archivo(s)`);
      }
    } catch (error) {
      toast.error("Error al subir los archivos");
    } finally {
      setLoader(false);
    }
  };

  const handleSend = async (cliente: Cliente) => {
    setLoader(true);
    
    try {
      // Separar strings de files
      const messagesStrings = messages.filter(msg => typeof msg.message === 'string');
      const messagesFiles = messages.filter(msg => typeof msg.message !== 'string');
      
      const data = {
        message: [...cliente.mensajes.map((msg) => msg.message), ...messagesStrings.map((msj) => msj.message)],
        phone: `521${cliente.telefono}`,
        pathtofiles: messagesFiles.map((file) => (file.message as FileWithPreview).name),
      };
      
      // ✅ Usar apiService para enviar mensajes de WhatsApp
      const response = await apiService.sendWhatsAppMessage(center, cel, data);
      
      if (!response.err) {
        cliente.status = true;
        cliente.mensajes.push(...messages.map((msj) => msj));
        toast.success("Mensaje enviado correctamente");
      } else {
        toast.error(response.statusText || response.message || "Error al enviar el mensaje");
      }
    } catch (error) {
      toast.error("Error en la respuesta del servidor");
    } finally {
      setLoader(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (msjo.trim() === "") {
        toast.error("Por favor, escribe un mensaje antes de enviar.");
      } else {
        const msjob = createNewMsg(msjo);
        setMessages((prev) => [...prev, msjob]);
        setMsjo("");
      }
    }
  };

  const deleteMessage = async (id: string) => {
    const messageToDelete = messages.find((msj) => msj.id === id);
    
    // Eliminar inmediatamente del estado para mejor UX
    if (id) {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }
    
    // Si es un archivo, eliminarlo también del servidor
    if (messageToDelete?.message && typeof messageToDelete.message !== "string") {
      setLoader(true);
      try {
        const fileName = (messageToDelete.message as FileWithPreview).name;
        
        // ✅ Usar apiService para eliminar archivos
        await apiService.deleteWhatsAppFile(fileName);
        
        toast.success("Archivo eliminado correctamente");
      } catch (error) {
        console.error('Error deleting file:', error);
        toast.error("Error al eliminar el archivo del servidor");
      } finally {
        setLoader(false);
      }
    }
  };

  return {
    enviados,
    noEnviados,
    loader,
    messages,
    msjo,
    setMsjo,
    handleUpload,
    handleSend,
    handleKeyDown,
    deleteMessage,
  };
};