import React from "react";
import { FileWithPreview } from "../../../interfaces";

export const FileViewer: React.FC<{ file: FileWithPreview }> = ({ file }) => {
    const { url, type } = file;

    if (type.startsWith("image/")) {
        return (
            <img
                src={url}
                alt="preview"
                className="max-w-full h-auto rounded"
            />
        );
    }

    if (type === "application/pdf") {
        return (
            <iframe
                src={url}
                title="PDF Viewer"
                className="w-full h-[500px] border rounded"
            />
        );
    }

    if (type.startsWith("text/")) {
        return (
            <iframe
                src={url}
                title="Text Viewer"
                className="w-full h-[400px] border rounded bg-white text-black"
            />
        );
    }

    if (type.startsWith("video/")) {
        return (
            <video
                controls
                className="w-full h-auto rounded">
                <source
                    src={url}
                    type={type}
                />
                Tu navegador no soporta el video.
            </video>
        );
    }

    if (type.startsWith("audio/")) {
        return (
            <audio
                controls
                className="w-full">
                <source
                    src={url}
                    type={type}
                />
                Tu navegador no soporta el audio.
            </audio>
        );
    }

    return (
        <div
            className="p-4 border rounded bg-gray-100">
            <p>No se puede previsualizar este archivo.</p>
            <a
                href={url}
                download
                className="text-blue-500 underline">
                Descargar archivo
            </a>
        </div>
    );
};