import { useEffect, useState } from "react";

interface FilePreviewModalProps {
  url: string | null;
  type: "pdf" | "xml" | null;
}

export default function FilePreviewModal({ url, type }: FilePreviewModalProps) {
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
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-full">
      <div className="flex justify-between items-center p-2 border-b">
        <h2 className="font-bold text-lg">{type === "pdf" ? "Vista PDF" : "Vista XML"}</h2>
      </div>

      <div className="flex-1 overflow-auto">
        {type === "pdf" ? (
          <iframe src={url} className="w-full h-full" title="PDF Preview"></iframe>
        ) : (
          <pre className="whitespace-pre-wrap p-4 text-sm bg-gray-100 text-gray-800 w-full h-full overflow-auto">
            {xmlContent}
          </pre>
        )}
      </div>
    </div>
  );
}