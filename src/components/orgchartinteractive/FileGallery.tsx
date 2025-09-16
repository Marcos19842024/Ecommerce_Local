import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { url } from '../../server/url';
import { getFileTypes } from '../../utils/files';
import { FileViewer } from '../shared/FileViewer';
import PasswordPrompt from '../shared/PasswordPrompt';
import { password } from '../../server/user';
import { FileWithPreview } from '../../interfaces/shared.interface';
import { Employee } from '../../interfaces/orgchartinteractive.interface';
import { pdf } from '@react-pdf/renderer';
import { PdfEmployeeRecord } from './PdfEmployeeRecord';
import Modal from '../shared/Modal';

// Datos de ejemplo para la galería - solo documentos
const initialFiles: FileWithPreview[] = [
  {
    id: '1',
    name: 'Documento importante',
    url: `${url}qr.png`,
    type: 'pdf',
    size: '4.7 MB',
    icon: 'fa fa-file-pdf-o',
    color: 'red',
    uploadDate: '2023-06-21',
  },
  {
    id: '2',
    name: 'Otro Documento importante',
    url: '#',
    type: 'docx',
    size: '4.7 MB',
    icon: 'fa fa-file-word-o',
    color: 'blue',
    uploadDate: '2023-06-21',
  }
];

interface FileGalleryProps {
  employee: Employee;
}

const FileGallery = ({ employee }: FileGalleryProps) => {
  const { name, alias, puesto, area } = employee;
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [send, setSend] = useState(false);
  const [download, setDownload] = useState(false);
  const [email, setEmail] = useState('');
  const [isChecked, setIsChecked] = useState({
    "Acta de nacimiento.pdf": Boolean(false),
    "Alta del personal.pdf": Boolean(false),
    "Identificacion oficial.pdf": Boolean(false),
    "Contrato laboral.pdf": Boolean(false),
    "Comprobante de domicilio.pdf": Boolean(false),
    "APDN.pdf": Boolean(false),
    "CURP.pdf": Boolean(false),
    "Acuerdo de confidencialidad.pdf": Boolean(false),
    "RFC.pdf": Boolean(false),
    "Codigo de etica.pdf": Boolean(false),
    "NSS.pdf": Boolean(false),
    "RIBA.pdf": Boolean(false),
    "Solicitud de empleo.pdf": Boolean(false),
    "RIT.pdf": Boolean(false),
    "Certificado de estudios.pdf / Cedula profesional.pdf": Boolean(false),
    "Perfil de puesto.pdf": Boolean(false)
  });
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Cargar archivos desde el backend
  const loadFiles = useCallback(async () => {
    if (!name) {
      setFiles(initialFiles);
      setIsActive(false);
      setIsLoading(false);
      return;
    }
  
    try {
      setIsLoading(true);
      const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(name)}`);
      
      if (response.ok) {
        const serverFiles = await response.json();
        
        if (serverFiles.length > 0) {
          // Convertir archivos del backend al formato GalleryFile
          const formattedFiles: FileWithPreview[] = serverFiles.map((file: any, index: number) => {
            setIsChecked((prev) => ({...prev, [file.name]: true}));
            const ext = file.name.split('.').pop() || ''
            const [icon, color] = getFileTypes(ext)
            return {
              id: index + 1,
              name: file.name,
              url: `${url}orgchart/employees/${encodeURIComponent(name)}/${encodeURIComponent(file.name)}`,
              type: ext,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              icon,
              color,
              uploadDate: new Date(file.uploadDate).toISOString().split('T')[0]
            }
          });
          
          setFiles(formattedFiles);
          setIsActive(true);
        } else {
          setFiles(initialFiles);
          setIsActive(false)
        }
      } else {
        setFiles(initialFiles);
        setIsActive(false)
      }
    } catch (error) {
      console.error('Error loading files:', error);
      setFiles(initialFiles);
      setIsActive(false)
    } finally {
      setIsLoading(false);
    }
  }, [name]);

  // Cargar archivos cuando el nombre cambia
  useEffect(() => {
    loadFiles();
  }, [loadFiles, name]);

  const handleSendDownload = async () => {
    if (!send && !download) {
      toast.error("Selecciona enviar o descargar antes de aceptar");
      return;
    }

    // Validar email si se seleccionó enviar
    if (send && !email) {
      toast.error("Por favor ingresa un correo electrónico");
      return;
    }

    if (send && !isValidEmail(email)) {
      toast.error("Por favor ingresa un correo electrónico válido");
      return;
    }

    try {
      const data = {
        send: send,
        download: download,
        email: send ? email : undefined
      };

      // Remover email si es undefined para evitar enviarlo cuando no se necesita
      if (!send) {
        delete data.email;
      }

      const res = await fetch(`${url}orgchart/download-send-mail-zip/${encodeURIComponent(name)}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const contentType = res.headers.get("content-type");
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP: ${res.status}`);
      }

      // Manejar respuesta según el tipo de contenido
      if (contentType?.includes("application/json")) {
        const data = await res.json();
        if (send) {
          toast.success(data.message || `Expediente enviado a ${email} correctamente`);
        }
      } else if (contentType?.includes("application/zip")) {
        const zipBlob = await res.blob();
        const urlZip = window.URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = urlZip;
        a.download = `Expediente de ${name}.zip`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          window.URL.revokeObjectURL(urlZip);
          document.body.removeChild(a);
        }, 100);
        
        if (send) {
          toast.success(`Expediente enviado a ${email} y descargado correctamente`);
        } else {
          toast.success("Expediente descargado correctamente");
        }
      }

      // Limpiar formulario después de éxito
      if (send) {
        setEmail('');
        setShowEmailInput(false);
      }

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Error al procesar el expediente";
      toast.error(errorMessage);
    }
  };

  // Función para eliminar archivo después de verificación
  const handleDeleteFile = async () => {
    if (!fileToDelete) return;

    const loadingToast = toast.loading('Eliminando archivo...', {
      position: 'top-right',
    });

    try {
      const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(name)}/${encodeURIComponent(fileToDelete)}`, {
        method: 'DELETE',
      });

      toast.dismiss(loadingToast);

      if (response.status === 200) {
        // Recargar archivos desde el backend
        await loadFiles();
        
        toast.success('Archivo eliminado correctamente', {
          duration: 4000,
          position: 'top-right',
        });
      } else {
        toast.error('Error al eliminar el archivo', {
          duration: 5000,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.dismiss(loadingToast);
      toast.error('Error al eliminar el archivo', {
        duration: 5000,
        position: 'top-right',
      });
    } finally {
      setFileToDelete(null);
      setShowModal(false);
    }
  };

  // Manejar cambio en checkbox de enviar
  const handleSendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSend(isChecked);
    setShowEmailInput(isChecked);
    
    // Si deselecciona enviar, limpiar el email
    if (!isChecked) {
      setEmail('');
    }
  };

  // Función para validar email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para manejar la subida de múltiples archivos
  const handleFilesUpload = useCallback(async (filesToUpload: File[]) => {
    // Validar cada archivo
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    filesToUpload.forEach(file => {
      // Validar tipo de archivo
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const isValidType = validTypes.includes(file.type) || ['pdf', 'doc', 'docx'].includes(extension);
      
      // Validar tamaño (máximo 10MB)
      const isValidSize = file.size <= 10 * 1024 * 1024;
      
      if (isValidType && isValidSize) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });
    
    // Mostrar advertencia para archivos inválidos
    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length} archivo(s) no válidos. Solo se permiten PDF y Word (hasta 10MB)`, {
        duration: 5000,
        position: 'top-right',
      });
    }
    
    if (validFiles.length === 0) return;
    
    // Subir archivos válidos
    const uploadPromises = validFiles.map(file => uploadSingleFile(file));
    
    try {
      await Promise.all(uploadPromises);
      // Recargar archivos desde el backend después de subir todos
      await loadFiles();
      
      toast.success(`${validFiles.length} archivo(s) subido(s) correctamente`, {
        duration: 4000,
        position: 'top-right',
      });
      
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Error al subir algunos archivos', {
        duration: 5000,
        position: 'top-right',
      });
    }
  }, [name, loadFiles]);

  // Función para subir un solo archivo
  const uploadSingleFile = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadUrl = `${url}orgchart/employees/${encodeURIComponent(name)}`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Tipo de archivo no permitido');
        } else if (response.status === 413) {
          throw new Error('El archivo excede el límite de 10MB');
        } else {
          throw new Error('Error al subir el archivo');
        }
      }
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      throw error;
    }
  };

  // Función para solicitar contraseña antes de eliminar
  const requestDeleteFile = (fileName: string) => {
    setFileToDelete(fileName);
    setShowModal(true);
  };

  // Manejadores para drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFilesUpload(droppedFiles);
    }
  };

  const handleGeneratePDF = async () => {

    await loadFiles();
    const blob = await pdf(<PdfEmployeeRecord employeeData={employee} isChecked={isChecked} />).toBlob();
    const formData = new FormData();
    formData.append('file', blob, 'Caratula.pdf');

    try {
      const uploadUrl = `${url}orgchart/employees/${encodeURIComponent(name)}`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Error al guardar");
      
      toast.success("Carátula creada correctamente");

      await loadFiles();
      
    } catch {
      toast.error("Error al crear carátula");
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFilesUpload(Array.from(selectedFiles));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-2 py-2 w-[80vw]">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-1 py-1 w-[80vw]">
      <div className="m-1 gap-1 flex justify-between">
        <div className="m-1 gap-1 justify-between">
          <h2 className="mb-1 text-2xl font-bold text-gray-800">{alias}</h2>
          <p className="text-gray-600">{area}</p>
          <p className="text-gray-600">{puesto}</p>
        </div>
        <div className="m-1 gap-2 flex flex-col justify-start">
          <button
            onClick={() => handleGeneratePDF()}
            className="inline-flex items-center px-3 py-1.5 w-fit border border-gray-300 text-xs font-medium rounded-full shadow-sm text-white bg-cyan-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            Crear caratula
          </button>
        </div>
        {isActive && (
          <>
            <div className="m-1 gap-2 flex flex-col justify-start">
              <label className="flex items-center gap-1 text-cyan-600">
                <input
                  type="checkbox"
                  checked={send}
                  onChange={handleSendChange}
                />
                Enviar expediente
              </label>
              <label className="flex items-center gap-1 text-cyan-600">
                <input
                  type="checkbox"
                  checked={download}
                  onChange={(e) => setDownload(e.target.checked)}
                />
                Descargar expediente
              </label>
              {/* Campo de email (solo visible cuando se selecciona enviar) */}
              {showEmailInput && (
                <input
                  className="flex items-center gap-1 text-sm text-cyan-600 w-fit px-2"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu email"
                  required={send}
                />
              )}
              {(send || download) && (
                <button
                  onClick={() => handleSendDownload()}
                  className="inline-flex items-center px-3 py-1.5 w-fit border border-gray-300 text-xs font-medium rounded-full shadow-sm text-white bg-cyan-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  {send && download ? 'Enviar y descargar expediente' : send ? 'Enviar expediente' : 'Descargar expediente'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Área para subir archivos con drag & drop - MODIFICADA PARA MÚLTIPLES ARCHIVOS */}
      <div
        className={`mt-1 p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragging ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          className="hidden"
          multiple
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg className="w-12 h-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-gray-600">
            <span className="font-medium text-cyan-600">Haz clic para subir</span> o arrastra y suelta aquí
          </p>
          <p className="text-xs text-gray-500">Se aceptan múltiples archivos PDF y Word (hasta 10MB cada uno)</p>
        </div>
      </div>
      
      {/* Miniaturas */}
      <div className="mt-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Todos los archivos</h3>
        {files.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md relative group"
                onClick={() => isActive && window.open(file.url, '_blank')}
              >
                {isActive && (
                  <div className="flex justify-end mb-1 absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => requestDeleteFile(file.name)}
                      className="flex items-center px-1 w-full h-fullborder text-sm rounded-md shadow-sm text-white bg-slate-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      x
                    </button>
                  </div>
                )}
                <div
                  className="h-40">
                  <FileViewer file={file} />
                </div>
                <div className="m-2 w-fit h-fit">
                  <div className="gap-2 flex grid-col-2 items-center justify-between text-sm text-gray-500">
                    <i className={file.icon} style={{ color: file.color }}></i>
                    <span className='w-full'>{file.name}</span>
                  </div>
                  <div className="flex w-full gap-2 grid-col-2 items-center justify-between text-xs text-gray-500">
                    <span className='justify-start w-fit m-2'>Subido: {file.uploadDate}</span>
                    <span className='justify-end w-fit m-2'>{file.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay archivos para mostrar</p>
        )}
      </div>

      {/* Modal de contraseña - Usando el componente importado */}
      {showModal && (
          <Modal
            className1="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
            className2="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6"
            closeModal={() => setShowModal(false)}
          >
            <PasswordPrompt
              onSuccess={handleDeleteFile}
              message="Ingrese la contraseña para eliminar el archivo"
              correctPassword={password}
            />
          </Modal>
        )}
    </div>
  );
};

export default FileGallery;