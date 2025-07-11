// Archivo: components/MessageBubbleFile.tsx
import { FileViewer } from "../file/FileViewer";
import { MessageBubbleFileProps } from "../../../interfaces";

export const MessageBubbleFile = ({
  file,
  senderName,
  timestamp,
  avatarUrl,
  isOwnMessage,
  editable,
  onDelete
}: MessageBubbleFileProps & { onDelete?: () => void }) => {
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
          <p className="text-xs text-gray-400">
            {senderName} • {timestamp}
          </p>
          <div className={`text-white text-xs ${bgColor} rounded-md p-2 mt-1`}>
            <FileViewer file={file} />
            <div className="flex justify-between items-center border p-2 rounded bg-slate-100">
              <a
                className="left flex items-center gap-1"
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className={file.icon} style={{ color: file.color }}></i>
                <h5 className="text-xs text-cyan-800">{file.name}</h5>
              </a>
            </div>
          </div>
        </div>
        {editable && (
          <span
            className="cursor-pointer text-xl text-red-500"
            onClick={onDelete}
          >
            &times;
          </span>
        )}
      </div>
    </div>
  );
};