// src/components/expensereport/FilePreviewModal.tsx
import { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import { FilePreviewModalProps } from "../../interfaces/report.interface";

export const FilePreviewModal = ({ url, type }: FilePreviewModalProps) => {
  const [fileContent, setFileContent] = useState<string>("");

  useEffect(() => {
    const loadFile = async () => {
      try {
        const response = await apiService.fetchDirect(url);
        
        if (type === "pdf") {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setFileContent(blobUrl);
        } else if (type === "xml") {
          const text = await response.text();
          setFileContent(text);
        }
      } catch (error) {
        console.error("Error loading file:", error);
      }
    };

    loadFile();
  }, [url, type]);

  if (type === "pdf") {
    return (
      <iframe
        src={fileContent}
        width="100%"
        height="100%"
        title="PDF Preview"
      />
    );
  }

  return (
    <pre className="p-4 overflow-auto h-full bg-white">
      {fileContent}
    </pre>
  );
};

export default FilePreviewModal;