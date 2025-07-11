// Archivo: hooks/useReminders.ts
import { useState } from "react";
import { toast } from "react-hot-toast";
import { getFileTypes } from "../../utils/files";
import { Cliente, FileWithPreview, MessageBubbleProps } from "../../interfaces";

export const useReminders = (url: string, center: string, cel: string) => {
  const [messages, setMessages] = useState<MessageBubbleProps[]>([]);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [msjo, setMsjo] = useState("");

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
      .then((res) => res.json())
      .then((res) => {
        if (!res.err) {
          const newFiles: FileWithPreview[] = res.statusText.map((filename: string) => {
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
          setFiles((prev) => [
            ...prev,
            ...newFiles.filter((nf) => !prev.find((f) => f.name === nf.name)),
          ]);
          toast.success("Archivos subidos correctamente");
        } else {
          toast.error("Error al subir los archivos");
        }
      })
      .catch(() => toast.error("Error en la respuesta del servidor"));
  };

  const handleSend = async (cliente: Cliente) => {
    let data = {
      message: cliente.mensaje,
      phone: `521${cliente.telefono}`,
      pathtofiles: files.map((file) => file.name),
    };
    await fetch(`${url}send/${center}/${cel}`, {
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
          toast.success("Mensaje enviado correctamente");
        } else {
          toast.error(res.statusText);
        }
      })
      .catch(() => toast.error("Error en la respuesta del servidor"));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, newMsg: MessageBubbleProps) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (msjo.trim() === "") {
        toast.error("Por favor, escribe un mensaje antes de enviar.");
      } else {
        newMsg.message = msjo;
        setMessages((prev) => [...prev, newMsg]);
        setMsjo("");
      }
    }
  };

  const deleteMessage = (id?: string, fileToDelete?: FileWithPreview) => {
    if (id) setMessages((prev) => prev.filter((msg) => msg.id !== id));
    if (fileToDelete) {
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      fetch(`${url}delete/${fileToDelete.name}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((res) => {
          if (!res.err) toast.success("Archivo eliminado correctamente");
          else toast.error(res.err);
        })
        .catch(() => toast.error("Error en la respuesta del servidor"));
    }
  };

  return {
    messages,
    setMessages,
    msjo,
    setMsjo,
    files,
    setFiles,
    handleUpload,
    handleSend,
    handleKeyDown,
    deleteMessage,
  };
};