import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { getFileTypes } from "../utils/files";
import { Cliente, MessageBubble, RemindersProps } from "../interfaces/reminders.interface";
import { url } from "../server/url";
import { cel, center } from "../server/user";
import { FileWithPreview } from "../interfaces/shared.interface";
import { createNewMsg } from "../utils/messages";

export const useReminders = ({clientes}: RemindersProps) => {
  const [messages, setMessages] = useState<MessageBubble[]>([]);
  const [msjo, setMsjo] = useState("");
  const [loader, setLoader] = useState(false);
  const enviados = useMemo(() => clientes.filter((c) => c.status), [clientes]);
  const noEnviados = useMemo(() => clientes.filter((c) => !c.status), [clientes]);

  const handleUpload = (fileList: FileList | null) => {
    setLoader(true);
    if (!fileList || fileList.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append("files", fileList[i]);
    }
    fetch(`${url}wwebjs/upload`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.err) {
          const newFilesWhitPreview: FileWithPreview[] = res.statusText.map((filename: string) => {
            const ext = filename.split(".").pop() || "";
            const [icon, color] = getFileTypes(ext);
            return {
              id: crypto.randomUUID(),
              name: filename,
              type: ext,
              icon,
              color,
              url: `${url}media/${filename}`,
            };
          });
          const newFiles = newFilesWhitPreview.map((file) =>
            createNewMsg(file)
          );
          // Evitar duplicados
          setMessages((prev) => {
            // Separar strings de files
            const strings = prev.filter(msg => typeof msg.message === 'string');
            const existingFiles = prev.filter(msg => typeof msg.message !== 'string');
            
            // Filtrar nuevos archivos que no existen
            const uniqueNewFiles = newFiles.filter(nf =>
              !existingFiles.some(f => (f.message as FileWithPreview).name === (nf.message as FileWithPreview).name)
            );
            
            // Combinar strings + archivos existentes + archivos nuevos únicos
            return [...strings, ...existingFiles, ...uniqueNewFiles];
          });
          toast.success("Archivos subidos correctamente");
          setLoader(false);
        } else {
          toast.error("Error al subir los archivos");
          setLoader(false);
        }
      })
      .catch(() => toast.error("Error en la respuesta del servidor"));
      setLoader(false);
  };

  const handleSend = async (cliente: Cliente) => {
    setLoader(true);
    
    // Separar strings de files
    const messagesStrings = messages.filter(msg => typeof msg.message === 'string');
    const messagesFiles = messages.filter(msg => typeof msg.message !== 'string');
    let data = {
      message: [...cliente.mensajes.map((msg) => msg.message), ...messagesStrings.map((msj) => msj.message)],
      phone: `521${cliente.telefono}`,
      pathtofiles: messagesFiles.map((file) => (file.message as FileWithPreview).name),
    };
    await fetch(`${url}wwebjs/send/${center}/${cel}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((res) => {
      if (!res.err) {
        cliente.status = true;
        cliente.mensajes.push(...messages.map((msj) => msj));
        toast.success("Mensaje enviado correctamente");
      } else {
        toast.error(res.statusText);
      }

      setLoader(false);
    })
    .catch(() => toast.error("Error en la respuesta del servidor"));
    setLoader(false);
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

  const deleteMessage = (id: string) => {
    const messageToDelete = messages.find((msj) => msj.id === id);
    
    if (id) {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }
    
    if (messageToDelete?.message && typeof messageToDelete.message !== "string") {
      setLoader(true);
      fetch(`${url}wwebjs/${(messageToDelete.message as FileWithPreview).name}`, { 
        method: "DELETE" 
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.err) {
            toast.success("Archivo eliminado correctamente");
          } else {
            toast.error(res.err);
          }
          setLoader(false);
        })
        .catch(() => {
          toast.error("Error en la respuesta del servidor");
          setLoader(false);
        });
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