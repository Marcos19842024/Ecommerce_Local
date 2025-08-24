import { useEffect, useState } from "react";

interface FilePreviewModalProps {
  url: string | null;
  type: "pdf" | "xml" | null;
  onClose: () => void;
}

export default function FilePreviewModal({ url, type, onClose }: FilePreviewModalProps) {
  const [xmlContent, setXmlContent] = useState<string>("");

  useEffect(() => {
    if (type === "xml" && url) {
      fetch(url)
        .then((res) => res.text())
        .then(setXmlContent)
        .catch(() => setXmlContent("Error al cargar XML"));
    }
  }, [url, type]);

  if (!url || !type) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 h-5/6 flex flex-col">
        <div className="flex justify-between items-center p-2 border-b">
          <h2 className="font-bold text-lg">{type === "pdf" ? "Vista PDF" : "Vista XML"}</h2>
          <button onClick={onClose} className="px-3 py-1 bg-red-500 text-white rounded">Cerrar</button>
        </div>

        <div className="flex-1 overflow-auto">
          {type === "pdf" ? (
            <iframe src={url} className="w-full h-full" title="PDF Preview"></iframe>
          ) : (
            <pre className="whitespace-pre-wrap p-4 text-sm bg-gray-100 text-gray-800 h-full overflow-auto">
              {xmlContent}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}