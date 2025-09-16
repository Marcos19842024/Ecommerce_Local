import { MessageBubble } from "../../interfaces/reminders.interface";
import { FileViewer } from "../shared/FileViewer";

export const MessageBubbles = ({
  id,
  message,
  file,
  senderName,
  timestamp,
  avatarUrl,
  isOwnMessage,
  editable,
  onDelete
}: MessageBubble & { onDelete?: (id: string) => void }) => {
  const alignment = isOwnMessage ? "justify-end" : "justify-start";
  const bgColor = isOwnMessage ? "bg-green-900" : "bg-gray-800";
  const flexDirection = isOwnMessage ? "flex-row-reverse" : "flex-row";

  return (
    <div className={`flex ${alignment}`}>
      <div className={`flex ${flexDirection} items-start gap-2 max-w-md`}>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={senderName}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div>
          <p className="text-xs text-gray-400 text-pretty">
            {senderName} • {timestamp}
          </p>
          <div className={`text-white text-xs ${bgColor} rounded-md p-2 mt-1`}>
            {file && <FileViewer file={file} />}
            <div className="flex justify-between items-center border p-2 rounded bg-slate-100">
              {file && (
                <a
                  className="left flex items-center gap-1"
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={file.icon} style={{ color: file.color }}></i>
                  <h5 className="text-xs text-cyan-800">{file.name}</h5>
                </a>
              )}
            </div>
          </div>
          <p className={`text-white text-sm ${bgColor} rounded-md p-2 mt-1 text-pretty`}>{message}</p>
        </div>
        {editable && onDelete && (
          <span
            className="cursor-pointer text-xl text-red-500"
            onClick={() => onDelete(id)}
          >
            &times;
          </span>
        )}
      </div>
    </div>
  );
};