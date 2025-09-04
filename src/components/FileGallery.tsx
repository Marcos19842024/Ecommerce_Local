import { useState, useEffect, useRef } from 'react';

// Definimos los tipos de archivo
type FileType = 'image' | 'document' | 'video' | 'audio' | 'archive';

interface GalleryFile {
  id: number;
  name: string;
  type: FileType;
  url: string;
  extension: string;
  size?: string;
  uploadDate?: string;
}

// Datos de ejemplo para la galería
const initialFiles: GalleryFile[] = [
  {
    id: 1,
    name: 'Imagen de montañas',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    extension: 'jpg',
    size: '2.4 MB',
    uploadDate: '2023-05-15'
  },
  {
    id: 2,
    name: 'Documento importante',
    type: 'document',
    url: '#',
    extension: 'pdf',
    size: '4.7 MB',
    uploadDate: '2023-06-21'
  },
  {
    id: 3,
    name: 'Presentación ejecutiva',
    type: 'document',
    url: '#',
    extension: 'pptx',
    size: '8.2 MB',
    uploadDate: '2023-07-03'
  },
  {
    id: 4,
    name: 'Foto de playa',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    extension: 'jpg',
    size: '3.1 MB',
    uploadDate: '2023-08-12'
  },
  {
    id: 5,
    name: 'Planificación mensual',
    type: 'document',
    url: '#',
    extension: 'xlsx',
    size: '1.8 MB',
    uploadDate: '2023-09-05'
  },
  {
    id: 6,
    name: 'Imagen urbana',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
    extension: 'jpg',
    size: '5.3 MB',
    uploadDate: '2023-10-18'
  },
  {
    id: 7,
    name: 'Video de vacaciones',
    type: 'video',
    url: '#',
    extension: 'mp4',
    size: '15.7 MB',
    uploadDate: '2023-11-22'
  },
  {
    id: 8,
    name: 'Grabación de audio',
    type: 'audio',
    url: '#',
    extension: 'mp3',
    size: '2.9 MB',
    uploadDate: '2023-12-10'
  }
];

const FileGallery = ({ nombre, puesto }: { nombre: string, puesto: string }) => {
  const [files, setFiles] = useState<GalleryFile[]>(initialFiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Efecto para el carrusel automático
  useEffect(() => {
    setFiles(initialFiles);
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === files.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Función para obtener el icono según el tipo de archivo
  const getFileIcon = (file: GalleryFile, isLarge: boolean = false) => {
    const iconSize = isLarge ? 'h-16 w-16' : 'h-8 w-8';
    
    if (file.type === 'image') {
      return (
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          <img 
            src={file.url} 
            alt={file.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />{iconSize}
        </div>
      );
    }
    
    // Para otros tipos de archivo
    const bgColors: Record<FileType, string> = {
      image: 'bg-blue-100',
      document: 'bg-red-100',
      video: 'bg-purple-100',
      audio: 'bg-green-100',
      archive: 'bg-yellow-100'
    };
    
    const icons: Record<FileType, string> = {
      image: '🖼️',
      document: '📄',
      video: '🎬',
      audio: '🎵',
      archive: '📦'
    };
    
    return (
      <div className={`flex h-full w-full items-center justify-center rounded-lg ${bgColors[file.type]}`}>
        <div className="text-center">
          <div className={`mx-auto ${isLarge ? 'text-5xl' : 'text-2xl'}`}>{icons[file.type]}</div>
          <p className="mt-1 text-xs font-medium text-gray-700">.{file.extension}</p>
        </div>
      </div>
    );
  };

  // Función para calcular la posición 3D de cada elemento
  const calculate3DPosition = (index: number) => {
    const totalItems = files.length;
    const position = (index - currentIndex + totalItems) % totalItems;
    
    // Ajustamos los valores para el efecto 3D
    if (position === 0) {
      return {
        transform: 'translateZ(0px) scale(1)',
        opacity: 1,
        zIndex: 10
      };
    } else if (position === 1 || position === totalItems - 1) {
      return {
        transform: 'translateZ(-100px) translateX(200px) scale(0.9)',
        opacity: 0.8,
        zIndex: 5
      };
    } else if (position === 2 || position === totalItems - 2) {
      return {
        transform: 'translateZ(-200px) translateX(100px) scale(0.8)',
        opacity: 0.6,
        zIndex: 4
      };
    } else {
      return {
        transform: 'translateZ(-300px) translateX(0px) scale(0.7)',
        opacity: 0.4,
        zIndex: 3
      };
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-2 py-2 w-[80vw]">
      <h2 className="mb-2 text-3xl font-bold text-gray-800">{nombre}</h2>
      <p className="mb-2 text-gray-600">{puesto}</p>
      
      {/* Carrusel 3D */}
      <div className="relative h-96 overflow-hidden rounded-xl">
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Indicadores */}
      <div className="mt-4 flex justify-center space-x-2">
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
      
      {/* Miniaturas */}
      <div className="mt-4">
        <h3 className="mb-2 text-xl font-semibold text-gray-700">Todos los archivos</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {files.map((file, index) => (
            <div
              key={file.id}
              onClick={() => goToSlide(index)}
              className={`cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md ${
                index === currentIndex ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="h-20">
                {getFileIcon(file)}
              </div>
              <div className="mt-2">
                <p className="truncate text-sm font-medium text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-500">.{file.extension} • {file.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Información del archivo actual */}
      <div className="mt-4 rounded-lg bg-blue-50 p-6">
        <h3 className="text-lg font-semibold text-blue-800">Archivo actual</h3>
        <div className="mt-2 flex items-center">
          <div className="mr-4 h-12 w-12">
            {getFileIcon(files[currentIndex])}
          </div>
          <div>
            <p className="font-medium text-gray-800">{files[currentIndex].name}</p>
            <p className="text-sm text-gray-600">Tipo: {files[currentIndex].type} • Tamaño: {files[currentIndex].size}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileGallery;