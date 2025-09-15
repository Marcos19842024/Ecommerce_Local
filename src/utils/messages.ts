import { v4 as uuidv4 } from "uuid";
import { MessageBubble } from "../interfaces/reminders.interface";

export const createNewMsg = (message: string): MessageBubble => ({
  id: uuidv4(),
  message,
  file: null,
  senderName: "Baalak Veterinaria",
  timestamp: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  avatarUrl: "/img/Baalak-logo-small.png",
  isOwnMessage: true,
  editable: true,
});

export const getMascotas = (mascotas: { nombre: string }[]) => {
  if (mascotas.length === 1) return `${mascotas[0].nombre}.`;
  const nombres = mascotas.map((m) => m.nombre);
  return `${nombres.slice(0, -1).join(", ")} y ${nombres.at(-1)}.`;
};