import { v4 as uuidv4 } from "uuid";
import { MessageBubbleProps } from "../interfaces/client.interface";

export const createNewMsg = (message: string): MessageBubbleProps => ({
  id: uuidv4(),
  message,
  senderName: "Baalak Veterinaria",
  timestamp: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  avatarUrl: "/img/Baalak-logo-banner-small.png",
  isOwnMessage: true,
  editable: true,
});

export const getMascotas = (mascotas: { nombre: string }[]) => {
  if (mascotas.length === 1) return `${mascotas[0].nombre}.`;
  const nombres = mascotas.map((m) => m.nombre);
  return `${nombres.slice(0, -1).join(", ")} y ${nombres.at(-1)}.`;
};