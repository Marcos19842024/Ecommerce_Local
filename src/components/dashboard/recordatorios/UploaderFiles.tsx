import { useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "../../shared/Loader";

interface UploadedFile {
  filename: string;
  filetype: string;
  icon: string;
  color: string;
}

export const UploaderFiles = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleUpload = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append("files", fileList[i]);
    }

    setLoading(true);

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(res => {
        if (!res.err) {
          const newFiles: UploadedFile[] = res.statusText.map((filename: string) => {
            const ext = filename.split(".").pop();
            const [icon, color] = getFileTypes(ext);
            return { filename, filetype: ext, icon, color };
          });

          setFiles(prev => [
            ...prev,
            ...newFiles.filter(nf => !prev.find(f => f.filename === nf.filename)),
          ]);

          toast.success("Archivos subidos correctamente", { position: "bottom-right" });
        } else {
          toast.error("Error en la respuesta del servidor", { position: "bottom-right" });
        }
      })
      .catch(() => {
        toast.error("Error al subir los archivos", { position: "bottom-right" });
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (filename: string) => {
    fetch(`/delete/${filename}`, { method: "DELETE" })
      .then(res => res.json())
      .then(res => {
        if (res.err) {
          toast.error(`Error al eliminar el archivo: ${res.err}`, { position: "bottom-right" });
        } else {
          setFiles(prev => prev.filter(file => file.filename !== filename));
        }
      })
      .catch(() => {
        toast.error("Error al eliminar el archivo", { position: "bottom-right" });
      });
  };

  const getFileTypes = (filetype: string): [string, string] => {
    switch (filetype) {
      case "xlsx":
      case "xls":
      case "xlsm":
        return ["fa fa-file-excel-o", "green"];
      case "zip":
      case "rar":
      case "7zip":
        return ["fa fa-file-archive-o", "orange"];
      case "doc":
      case "docx":
        return ["fa fa-file-word-o", "blue"];
      case "pptx":
        return ["fa fa-file-powerpoint-o", "red"];
      case "mp3":
      case "wav":
      case "m4a":
        return ["fa fa-file-sound-o", "blue"];
      case "mp4":
      case "mov":
      case "avi":
      case "wmv":
      case "flv":
      case "3gp":
        return ["fa fa-file-video-o", "blue"];
      case "png":
      case "jpg":
      case "ico":
      case "gif":
      case "jpeg":
      case "svg":
        return ["fa fa-file-picture-o", "black"];
      case "pdf":
        return ["fa fa-file-pdf-o", "red"];
      case "css":
      case "html":
      case "cs":
        return ["fa fa-file-code-o", "black"];
      case "txt":
        return ["fa fa-file-text-o", "blue"];
      default:
        return ["fa fa-file", "black"];
    }
  };

  return (
    <div>
      <div className="wrapper">
        <div className="box">
          <div className="uploadbox">
            <input
              type="file"
              id="upload"
              hidden
              multiple
              onChange={(e) => handleUpload(e.target.files)}
            />
            <label htmlFor="upload" className="flex flex-row items-center justify-start cursor-pointer">
              <span className="mr-2"><i className="fa fa-cloud-upload"></i></span>
              <p className="text-sm">Click para subir archivos</p>
            </label>
          </div>

          <div id="filewrapper" className="flex flex-col gap-2 mt-4">
            {files.map(file => (
              <div key={file.filename} className="showfilebox flex justify-between items-center border p-2 rounded">
                <div className="left flex items-center gap-2">
                  <a
                    href={`/media/${file.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className={file.icon} style={{ color: file.color }}></i>
                  </a>
                  <h5>{file.filename}</h5>
                </div>
                <div className="right">
                  <span
                    className="cursor-pointer text-xl text-red-500"
                    onClick={() => handleDelete(file.filename)}
                  >
                    &times;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading && <div className="loader"><Loader /></div>}
    </div>
  );
};
