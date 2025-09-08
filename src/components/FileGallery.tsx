import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { url } from '../server/url';
import { getFileTypes } from '../utils/files';
import { FileWithPreview } from '../interfaces/client.interface';
import { FileViewer } from './FileViewer';

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

const FileGallery = ({ nombre, alias, puesto }: { nombre: string, alias: string, puesto: string }) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Cargar archivos desde el backend
  const loadFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(nombre)}`);
      
      if (response.ok) {
        const serverFiles = await response.json();
        
        if (serverFiles.length > 0) {
          // Convertir archivos del backend al formato GalleryFile
          const formattedFiles: FileWithPreview[] = serverFiles.map((file: any, index: number) => {
            const ext = file.name.split('.').pop() || ''
            const [icon, color] = getFileTypes(ext)
            return {
              id: index + 1,
              name: file.name,
              url: `${url}orgchart/employees/${encodeURIComponent(nombre)}/${encodeURIComponent(file.name)}`,
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
  }, [nombre]);

  // Cargar archivos cuando el nombre cambia
  useEffect(() => {
    loadFiles();
  }, [loadFiles, nombre]);

  // Efecto para el carrusel automático
  useEffect(() => {
    if (files.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [files, currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === files.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Función para eliminar archivo
  const handleDeleteFile = async (fileName: string) => {
    const loadingToast = toast.loading('Eliminando archivo...', {
      position: 'top-right',
    });

    try {
      const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(nombre)}/${encodeURIComponent(fileName)}`, {
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
    }
  };

  // Función para manejar la subida de archivos
  const handleFileUpload = useCallback(async (file: File) => {
    // Validar tipo de archivo
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(file.type)) {
      toast.error('Solo se permiten archivos PDF y Word (.doc, .docx)', {
        duration: 5000,
        position: 'top-right',
      });
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('El archivo no puede ser mayor a 10MB', {
        duration: 5000,
        position: 'top-right',
      });
      return;
    }

    const loadingToast = toast.loading('Subiendo archivo...', {
      position: 'top-right',
    });

    try {
      const formData = new FormData();
      formData.append('file', file);

      // URL corregida - agregar /upload al final
      const uploadUrl = `${url}orgchart/employees/${encodeURIComponent(nombre)}`;

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      toast.dismiss(loadingToast);

      if (response.status === 200) {
        // Recargar archivos desde el backend
        await loadFiles();
        
        toast.success('Archivo subido correctamente', {
          duration: 4000,
          position: 'top-right',
        });
        
      } else if (response.status === 400) {
        toast.error('Tipo de archivo no permitido', {
          duration: 5000,
          position: 'top-right',
        });
      } else if (response.status === 413) {
        toast.error('El archivo excede el límite de 10MB', {
          duration: 5000,
          position: 'top-right',
        });
      } else {
        toast.error('Error al subir el archivo', {
          duration: 5000,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.dismiss(loadingToast);
      toast.error('No se pudo conectar con el servidor', {
        duration: 5000,
        position: 'top-right',
      });
    }
  }, [nombre, loadFiles]);

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
      handleFileUpload(droppedFiles[0]);
    }
  };

  // Manejador para selección de archivo por botón
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileUpload(selectedFiles[0]);
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
      <h2 className="mb-1 text-2xl font-bold text-gray-800">{alias}</h2>
      <p className="text-gray-600">{puesto}</p>
      
      {/* Área para subir archivos con drag & drop */}
      <div 
        className={`mt-1 p-1 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
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
        />
        <div className="flex flex-col items-center justify-center space-y-1">
          <svg className="w-12 h-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-gray-600">
            <span className="font-medium text-cyan-600">Haz clic para subir</span> o arrastra y suelta aquí
          </p>
          <p className="text-xs text-gray-500">Solo se aceptan archivos PDF y Word (hasta 10MB)</p>
        </div>
      </div>
      
      {/* Miniaturas */}
      <div className="mt-2">
        <h3 className="mb-2 text-xl font-semibold text-gray-700">Todos los archivos</h3>
        {files.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md relative group"
              >
                <div className="h-20">
                  <FileViewer file={file} />
                </div>
                <div className="m-2 w-full">
                      <div className="gap-2 flex grid-col-2 items-center justify-between text-sm text-gray-500">
                        <i className={file.icon}
                          style={{ color: file.color }}>
                        </i>
                        <span className='w-full'>{file.name}</span>
                      </div>
                      <div className="flex w-full gap-2 grid-col-2 items-center justify-between text-xs text-gray-500">
                        <span className='justify-start w-fit m-2'>Subido: {file.uploadDate}</span>
                        <span className='justify-end w-fit m-2'>{file.size}</span>
                      </div>
                      {isActive && (
                        <div className="m-3 gap-2 justify-between">
                          <a 
                            href={file.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className=" w-fit m-2 items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-cyan-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                          >
                            Abrir archivo
                          </a>
                          <button
                            onClick={() => handleDeleteFile(file.name)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay archivos para mostrar</p>
        )}
      </div>
    </div>
  );
};

export default FileGallery;