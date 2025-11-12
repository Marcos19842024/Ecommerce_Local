import { useState, useRef, useCallback, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye, MdFolder, MdExpandMore, MdExpandLess } from "react-icons/md";
import { apiService } from "../../../services/api";
import { getFileTypes } from "../../../utils/files";
import { FileViewer } from "../../shared/FileViewer";
import toast from "react-hot-toast";
import Modal from "../../shared/Modal";
import PasswordPrompt from "../../shared/PasswordPrompt";
import { Documents, FolderState } from "../../../interfaces/orgchartinteractive.interface";
import { FOLDERS } from "../../../utils/orgchartinteractive";

const generateUniqueId = (): string => {
  return `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const MyDocuments = () => {
    const [documents, setDocuments] = useState<Documents[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [fileToDelete, setFileToDelete] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [selectedFolder, setSelectedFolder] = useState<string>('all');
    const [folderStates, setFolderStates] = useState<FolderState>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const initialFolderStates: FolderState = {};
        FOLDERS.forEach(folder => {
            initialFolderStates[folder.id] = true;
        });
        setFolderStates(initialFolderStates);
    }, []);

    const toggleFolder = useCallback((folderId: string) => {
        setFolderStates(prev => ({
            ...prev,
            [folderId]: !prev[folderId]
        }));
    }, []);

    const loadDocuments = useCallback(async () => {
        try {
            setIsLoading(true);
            const allDocuments: Documents[] = [];

            // Cargar documentos de cada carpeta
            for (const folder of FOLDERS) {
                try {
                    const folderDocuments = await apiService.getMyDocumentsFiles(folder.id);
                    
                    const formattedDocuments: Documents[] = folderDocuments.map((doc: any) => {
                        const ext = doc.name.split('.').pop()?.toLowerCase() || '';
                        const [icon, color] = getFileTypes(ext);
                        
                        return {
                            id: doc.id || generateUniqueId(),
                            name: doc.name,
                            url: doc.url || `/orgchart/mydocuments/${folder.id}/${doc.name}`,
                            type: ext,
                            size: doc.size ? `${(doc.size / (1024 * 1024)).toFixed(1)} MB` : 'N/A',
                            icon,
                            color,
                            uploadDate: doc.uploadDate ? new Date(doc.uploadDate).toISOString().split('T')[0] : 'N/A',
                            folder: folder.id,
                            folderPath: folder.path
                        };
                    });

                    allDocuments.push(...formattedDocuments);
                } catch (error) {
                    console.error(`Error loading documents from folder ${folder.name}:`, error);
                    // Continuar con las siguientes carpetas incluso si una falla
                }
            }
            
            setDocuments(allDocuments);
        } catch (error) {
            console.error('Error loading documents:', error);
            toast.error('Error al cargar los documentos');
            setDocuments([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    // ✅ FILTRAR Y AGRUPAR DOCUMENTOS
    const filteredDocuments = documents.filter(doc => {
        const matchesType = filterType === 'all' || doc.type === filterType;
        const matchesFolder = selectedFolder === 'all' || doc.folder === selectedFolder;
        return matchesType && matchesFolder;
    });

    // ✅ AGRUPAR DOCUMENTOS POR CARPETA
    const documentsByFolder = filteredDocuments.reduce((acc, doc) => {
        if (!acc[doc.folder]) {
            acc[doc.folder] = [];
        }
        acc[doc.folder].push(doc);
        return acc;
    }, {} as Record<string, Documents[]>);

    // ✅ ELIMINAR DOCUMENTO
    const handleDeleteDocument = useCallback(async () => {
        if (!fileToDelete) return;

        const documentToDelete = documents.find(doc => doc.id === fileToDelete);
        if (!documentToDelete) return;

        const loadingToast = toast.loading('Eliminando documento...');
        
        try {
            await apiService.deleteMyDocumentsFile(documentToDelete.folder, documentToDelete.name);
            await loadDocuments();
            toast.success('Documento eliminado correctamente');
        } catch (error) {
            toast.error('Error al eliminar el documento');
        } finally {
            toast.dismiss(loadingToast);
            setFileToDelete(null)
            setShowDeleteModal(false);
        }
    }, [fileToDelete, documents, loadDocuments]);

    const requestDeleteFile = useCallback((fileId: string) => {
        setFileToDelete(fileId);
        setShowDeleteModal(true);
    }, []);

    // ✅ SUBIR DOCUMENTOS A CARPETA ESPECÍFICA
    const uploadSingleDocument = useCallback(async (file: File, folderId: string): Promise<void> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            await apiService.uploadMyDocumentsFile(folderId, formData);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('400')) throw new Error('Tipo de archivo no permitido');
                if (error.message.includes('413')) throw new Error('El archivo excede el límite de tamaño');
            }
            throw new Error('Error al subir el documento');
        }
    }, []);

    const handleDocumentsUpload = useCallback(async (filesToUpload: File[]) => {
        const validFiles: File[] = [];
        const invalidFiles: string[] = [];
        
        // Definir tipos de archivo permitidos
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'image/jpeg',
            'image/png',
            'image/gif',
            'text/plain'
        ];
        
        filesToUpload.forEach(file => {
            const isValidType = allowedTypes.includes(file.type);
            const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB max
        
            isValidType && isValidSize ? validFiles.push(file) : invalidFiles.push(file.name);
        });
        
        if (invalidFiles.length > 0) {
            toast.error(`${invalidFiles.length} archivo(s) no válidos. Tipos permitidos: PDF, Word, Excel, PowerPoint, imágenes y texto (hasta 50MB)`);
        }
        
        if (validFiles.length === 0) return;
        
        try {
            const targetFolder = selectedFolder !== 'all' ? selectedFolder : FOLDERS[0].id;
            await Promise.all(validFiles.map(file => uploadSingleDocument(file, targetFolder)));
            await loadDocuments();
            toast.success(`${validFiles.length} documento(s) subido(s) correctamente`);
        } catch (error) {
            toast.error('Error al subir algunos documentos');
        }
    }, [uploadSingleDocument, loadDocuments, selectedFolder]);

    // ✅ DRAG & DROP
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) handleDocumentsUpload(droppedFiles);
    }, [handleDocumentsUpload]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles?.length) {
            handleDocumentsUpload(Array.from(selectedFiles));
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [handleDocumentsUpload]);

    // ✅ TIPOS DE ARCHIVO ÚNICOS PARA FILTRO
    const fileTypes = ['all', ...Array.from(new Set(documents.map(doc => doc.type)))].sort();

    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-6">
            {/* HEADER */}
            <div className="mb-6">
                <p className="text-gray-600">Documentos organizados por categorías</p>
            </div>

            {/* CONTROLES */}
            <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {fileTypes.map(type => (
                                <option key={type} value={type}>
                                    {type === 'all' ? 'Todos los tipos' : `.${type}`}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedFolder}
                            onChange={(e) => setSelectedFolder(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Todas las carpetas</option>
                            {FOLDERS.map(folder => (
                                <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* CONTADOR */}
                    <div className="text-sm text-gray-600">
                        {filteredDocuments.length} de {documents.length} documentos
                    </div>
                </div>
            </div>

            {/* ZONA DE SUBIDA */}
            <div
                className={`mb-2 p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
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
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
                    className="hidden"
                    multiple
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                    <svg className="w-12 h-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-gray-600">
                        <span className="font-medium text-blue-600">Haz clic para subir</span> o arrastra y suelta aquí
                    </p>
                    <p className="text-sm text-gray-500">
                        Los archivos se subirán a: {selectedFolder !== 'all' 
                            ? FOLDERS.find(f => f.id === selectedFolder)?.name 
                            : FOLDERS[0].name
                        }
                    </p>
                    <p className="text-xs text-gray-400">
                        PDF, Word, Excel, PowerPoint, imágenes y texto (hasta 50MB cada uno)
                    </p>
                </div>
            </div>

            {/* LISTA DE DOCUMENTOS POR CARPETA */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {filteredDocuments.length > 0 && (
                    <div className="space-y-4 p-4">
                        {/* Si hay filtro de carpeta específica, mostrar solo esa carpeta */}
                        {selectedFolder !== 'all' ? (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    {FOLDERS.find(f => f.id === selectedFolder)?.name}
                                </h3>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                    {documentsByFolder[selectedFolder]?.map((file) => (
                                        <div key={file.id} className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md relative">
                                            <div className="flex flex-row-reverse items-center gap-1 max-w-md">
                                                <div className="w-full">
                                                    <div className="flex justify-end items-center bg-slate-100 border rounded">
                                                        <p className="text-xs text-gray-400 p-2">{`Subido: ${file.uploadDate}`}</p>
                                                        <a
                                                            className="cursor-pointer text-xl text-cyan-600 p-2 hover:bg-yellow-500 hover:text-white rounded-md"
                                                            href={file.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <MdOutlineRemoveRedEye />
                                                        </a>
                                                        {file.id !== "0" && (
                                                            <button
                                                                className="cursor-pointer text-xl text-red-500 p-2 hover:bg-red-500 hover:text-white rounded-md"
                                                                onClick={() => requestDeleteFile(file.id)}
                                                            >
                                                                <IoCloseOutline />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <FileViewer file={file} />

                                                    <div className="flex justify-between items-center gap-2 border p-2 rounded bg-slate-100">
                                                        <span className={file.icon} style={{ color: file.color }}></span>
                                                        <span className="text-xs text-cyan-800 truncate flex-1 mx-2">{file.name}</span>
                                                        <span className="text-xs text-cyan-800 whitespace-nowrap">{file.size}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Mostrar todas las carpetas organizadas */
                            FOLDERS.map(folder => {
                                const folderDocs = documentsByFolder[folder.id];
                                if (!folderDocs || folderDocs.length === 0) return null;

                                return (
                                    <div key={folder.id} className="border border-gray-200 rounded-lg">
                                        {/* HEADER DE CARPETA */}
                                        <div 
                                            className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                                            onClick={() => toggleFolder(folder.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <MdFolder className="text-blue-500 text-xl" />
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{folder.name}</h3>
                                                    <p className="text-sm text-gray-500">{folderDocs.length} documento(s)</p>
                                                </div>
                                            </div>
                                            {folderStates[folder.id] ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                                        </div>

                                        {/* CONTENIDO DE CARPETA */}
                                        {folderStates[folder.id] && (
                                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                                {folderDocs.map((file) => (
                                                    <div key={file.id} className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md relative">
                                                        <div className="flex flex-row-reverse items-center gap-1 max-w-md">
                                                            <div className="w-full">
                                                                <div className="flex justify-end items-center bg-slate-100 border rounded">
                                                                    <p className="text-xs text-gray-400 p-2">{`Subido: ${file.uploadDate}`}</p>
                                                                    <a
                                                                        className="cursor-pointer text-xl text-cyan-600 p-2 hover:bg-yellow-500 hover:text-white rounded-md"
                                                                        href={file.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <MdOutlineRemoveRedEye />
                                                                    </a>
                                                                    {file.id !== "0" && (
                                                                        <button
                                                                            className="cursor-pointer text-xl text-red-500 p-2 hover:bg-red-500 hover:text-white rounded-md"
                                                                            onClick={() => requestDeleteFile(file.id)}
                                                                        >
                                                                            <IoCloseOutline />
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                <FileViewer file={file} />

                                                                <div className="flex justify-between items-center gap-2 border p-2 rounded bg-slate-100">
                                                                    <span className={file.icon} style={{ color: file.color }}></span>
                                                                    <span className="text-xs text-cyan-800 truncate flex-1 mx-2">{file.name}</span>
                                                                    <span className="text-xs text-cyan-800 whitespace-nowrap">{file.size}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            {showDeleteModal && (
                <Modal
                    className1="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
                    className2="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6"
                    closeModal={() => setShowDeleteModal(false)}
                >
                    <PasswordPrompt
                        onSuccess={handleDeleteDocument}
                        message="Ingrese la contraseña para eliminar el documento"
                    />
                </Modal>
            )}
        </div>
    );
};

export default MyDocuments;