import React from "react";
import { FileWithPreview } from "../../interfaces/shared.interface";

export const FileViewer: React.FC<{ file: FileWithPreview }> = ({ file }) => {
    const { url, type } = file;

    switch (type) {
        case "pdf":
            return (
                <div className={`w-full rounded-md`}>
                    <iframe
                        src={url}
                        title="preview"
                        className="w-full h-[80px] rounded-md bg-white"
                    />
                </div>
            );
        case "mp3":
        case "wav":
        case "m4a":
        case "ogg":
            return (
                <audio
                    controls
                    className="w-full rounded-md">
                    <source
                        src={url}
                    />
                    Tu navegador no soporta el audio.
                </audio>
            );
        case "mp4":
        case "mov":
        case "avi":
        case "wmv":
        case "flv":
        case "3gp":
            return (
                <video
                    controls
                    className="w-full h-auto rounded">
                    <source
                        src={url}
                    />
                    Tu navegador no soporta el video.
                </video>
            );
        case "png":
        case "jpg":
        case "ico":
        case "gif":
        case "jpeg":
        case "svg":
            return (
                <img
                    src={url}
                    alt="preview"
                    className="max-w-full h-auto rounded"
                />
            );
        default:
            return
    }
};