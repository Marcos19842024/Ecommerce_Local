import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { url } from '../server/url';
import { GrDocumentPdf, GrDocumentWord } from 'react-icons/gr';

// Definimos los tipos de archivo - solo documentos ahora
type FileType = 'document';

interface GalleryFile {
  id: number;
  name: string;
  type: FileType;
  url: string;
  extension: string;
  size?: string;
  uploadDate?: string;
}

// Datos de ejemplo para la galería - solo documentos
const initialFiles: GalleryFile[] = [
  {
    id: 1,
    name: 'Documento importante',
    type: 'document',
    url: '#',
    extension: 'pdf',
    size: '4.7 MB',
    uploadDate: '2023-06-21'
  },
  {
    id: 2,
    name: 'Presentación ejecutiva',
    type: 'document',
    url: '#',
    extension: 'docx',
    size: '8.2 MB',
    uploadDate: '2023-07-03'
  },
  {
    id: 3,
    name: 'Planificación mensual',
    type: 'document',
    url: '#',
    extension: 'docx',
    size: '1.8 MB',
    uploadDate: '2023-09-05'
  },
  {
    id: 4,
    name: 'Reporte financiero',
    type: 'document',
    url: '#',
    extension: 'pdf',
    size: '3.5 MB',
    uploadDate: '2023-10-15'
  }
];

const FileGallery = ({ nombre, alias, puesto }: { nombre: string, alias: string, puesto: string }) => {
  const [files, setFiles] = useState<GalleryFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Cargar archivos iniciales desde el backend
  useEffect(() => {
    const loadFiles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(nombre)}/files`);
        
        if (response.ok) {
          const serverFiles = await response.json();
          
          if (serverFiles.length > 0) {
            // Convertir archivos del backend al formato GalleryFile
            const formattedFiles = serverFiles.map((file: any, index: number) => ({
              id: index + 1,
              name: file.name,
              type: 'document' as FileType,
              url: `${url}orgchart/${file.path}`,
              extension: file.name.split('.').pop() || '',
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              uploadDate: new Date(file.uploadDate).toISOString().split('T')[0]
            }));
            
            setFiles(formattedFiles);
          } else {
            // Usar archivos iniciales si no hay archivos en el backend
            setFiles(initialFiles);
          }
        } else {
          // En caso de error, usar archivos iniciales
          setFiles(initialFiles);
        }
      } catch (error) {
        console.error('Error loading files:', error);
        // Usar archivos iniciales en caso de error
        setFiles(initialFiles);
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, [nombre]);

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

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
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
        // Eliminar archivo del estado local
        setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
        
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

      const uploadUrl = `${url}orgchart/employees/${encodeURIComponent(nombre)}`;

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      toast.dismiss(loadingToast);

      if (response.status === 200) {
        // Agregar el nuevo archivo a la galería
        const newFile: GalleryFile = {
          id: files.length > 0 ? Math.max(...files.map(f => f.id)) + 1 : 1,
          name: file.name,
          type: 'document',
          url: `${url}employees/${encodeURIComponent(nombre)}/${encodeURIComponent(file.name)}`,
          extension: file.name.split('.').pop() || '',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadDate: new Date().toISOString().split('T')[0]
        };

        setFiles(prevFiles => [...prevFiles, newFile]);
        
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
  }, [nombre, files]);

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

  // Función para obtener el icono según el tipo de archivo
  const getFileIcon = (file: GalleryFile, isLarge: boolean = false) => {
    const bgColor = 'bg-red-100';
    const icon = file.extension.toLowerCase() === 'pdf' ? <GrDocumentPdf /> : <GrDocumentWord />;

    return (
      <div className={`flex h-full w-full items-center justify-center rounded-lg ${bgColor}`}>
        <div className="text-center">
          <div className={`mx-auto ${isLarge ? 'text-5xl' : 'text-2xl'}`}>{icon}</div>
          <p className="mt-1 text-xs font-medium text-gray-700">.{file.extension}</p>
        </div>
      </div>
    );
  };

  // Función para calcular la posición 3D de cada elemento
  const calculate3DPosition = (index: number) => {
    const totalItems = files.length;
    const position = (index - currentIndex + totalItems) % totalItems;
    
    if (position === 0) {
      return { transform: 'translateZ(0px) scale(1)', opacity: 1, zIndex: 10 };
    } else if (position === 1 || position === totalItems - 1) {
      return { transform: 'translateZ(-100px) translateX(200px) scale(0.9)', opacity: 0.8, zIndex: 5 };
    } else if (position === 2 || position === totalItems - 2) {
      return { transform: 'translateZ(-200px) translateX(100px) scale(0.8)', opacity: 0.6, zIndex: 4 };
    } else {
      return { transform: 'translateZ(-300px) translateX(0px) scale(0.7)', opacity: 0.4, zIndex: 3 };
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
        className={`mt-2 p-1 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
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

      {/* Carrusel 3D */}
      {files.length > 0 ? (
        <>
          <div className="relative h-80 overflow-hidden rounded-xl mt-2">
            <div 
              ref={carouselRef}
              className="absolute inset-0 flex items-center justify-center perspective-1000"
            >
              {files.map((file, index) => {
                const position = calculate3DPosition(index);
                
                return (
                  <div
                    key={file.id}
                    className="absolute w-64 transition-all duration-700 ease-in-out"
                    style={{
                      transform: position.transform,
                      opacity: position.opacity,
                      zIndex: position.zIndex
                    }}
                  >
                    <div className="rounded-xl bg-white p-4 shadow-xl">
                      <div className="h-44">
                        {getFileIcon(file, true)}
                      </div>
                      <div className="mt-4">
                        <h3 className="truncate text-lg font-semibold text-gray-800">{file.name}</h3>
                        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                          <span>.{file.extension}</span>
                          <span>{file.size}</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                          Subido: {file.uploadDate}
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <a 
                            href={file.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-cyan-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Abrir archivo
                          </a>
                          <button
                            onClick={() => handleDeleteFile(file.name)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full shadow-sm text-white bg-red-500 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Indicadores */}
          <div className="mt-2 flex justify-center space-x-2">
            {files.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-blue-500 scale-125' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-6 p-8 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay archivos disponibles</p>
        </div>
      )}
      
      {/* Miniaturas */}
      <div className="mt-4">
        <h3 className="mb-2 text-xl font-semibold text-gray-700">Todos los archivos</h3>
        {files.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map((file, index) => (
              <div
                key={file.id}
                className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md relative group"
              >
                <div 
                  onClick={() => goToSlide(index)}
                  className={`${index === currentIndex ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="h-20">
                    {getFileIcon(file)}
                  </div>
                  <div className="mt-2">
                    <p className="truncate text-sm font-medium text-gray-700">{file.name}</p>
                    <p className="text-xs text-gray-500">.{file.extension} • {file.size}</p>
                  </div>
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