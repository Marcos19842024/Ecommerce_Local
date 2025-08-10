import { MessageBubbleProps } from "../interfaces/client.interface";

export const MessageBubble = ({ id, message, senderName, timestamp, avatarUrl, isOwnMessage, editable, onDelete }: MessageBubbleProps & { onDelete?: (id: string) => void }) => {
  const alignment = isOwnMessage ? "justify-end" : "justify-start";
  const bgColor = isOwnMessage ? "bg-green-900" : "bg-gray-800";
  const flexDirection = isOwnMessage ? "flex-row-reverse" : "flex-row";

  return (
    <div className={`flex ${alignment}`}>
      <div className={`flex ${flexDirection} items-start gap-2 max-w-md`}>
        {avatarUrl && <img src={avatarUrl} alt={senderName} className="w-8 h-8 rounded-full object-cover" />}
        <div>
          <p className="text-xs text-gray-400 text-pretty">
            {senderName} • {timestamp}
          </p>
          <p className={`text-white text-sm ${bgColor} rounded-md p-2 mt-1 text-pretty`}>{message}</p>
        </div>
        {editable && onDelete && (
          <span className="cursor-pointer text-xl text-red-500" onClick={() => onDelete(id)}>
            &times;
          </span>
        )}
      </div>
    </div>
  );
};