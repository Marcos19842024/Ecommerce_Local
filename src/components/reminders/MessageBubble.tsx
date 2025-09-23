import { MessageBubble } from "../../interfaces/reminders.interface";
import { FileWithPreview } from "../../interfaces/shared.interface";
import { FileViewer } from "../shared/FileViewer";

export const MessageBubbles = ({...props}: MessageBubble) => {
  const alignment = props.isOwnMessage ? "justify-end" : "justify-start";
  const bgColor = props.isOwnMessage ? "bg-green-900" : "bg-gray-800";
  const flexDirection = props.isOwnMessage ? "flex-row-reverse" : "flex-row";

  return (
    <div className={`flex ${alignment}`}>
      <div className={`flex ${flexDirection} items-start gap-2 max-w-md`}>
        {props.avatarUrl && (
          <img
            src={props.avatarUrl}
            alt={props.senderName}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div>
          <p className="text-xs text-gray-400 text-pretty">
            {props.senderName} • {props.timestamp}
          </p>
          {typeof props.message === "object" && props.message !== null && "url" in props.message &&
            <div className={`text-white text-xs ${bgColor} rounded-md p-2 mt-1`}>
              <FileViewer file={props.message as FileWithPreview} />
              <div className="flex justify-between items-center border p-2 rounded bg-slate-100">
                <a
                  className="left flex items-center gap-1"
                  href={(props.message as FileWithPreview).url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={(props.message as FileWithPreview).icon} style={{ color: (props.message as FileWithPreview).color }}></i>
                  <h5 className="text-xs text-cyan-800">{(props.message as FileWithPreview).name}</h5>
                </a>
              </div>
            </div>
          }
          {typeof props.message === "string" && (
            <p className={`text-white text-sm ${bgColor} rounded-md p-2 mt-1 text-pretty`}>
              {props.message}
            </p>
          )}
        </div>
        {props.editable && props.onDelete && (
          <span
            className="cursor-pointer text-xl text-red-500"
            onClick={() => props.onDelete?.(props.id)}
          >
            &times;
          </span>
        )}
      </div>
    </div>
  );
};