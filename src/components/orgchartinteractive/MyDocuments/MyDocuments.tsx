import { useState, useRef, useCallback, useEffect } from "react";
import { IoCloseOutline, IoFolderOpen } from "react-icons/io5";
import { MdOutlineRemoveRedEye, MdFolder, MdExpandMore, MdExpandLess, MdCreateNewFolder } from "react-icons/md";
import { apiService } from "../../../services/api";
import { getFileTypes } from "../../../utils/files";
import { FileViewer } from "../../shared/FileViewer";
import { Documents, FolderState, Subfolder } from "../../../interfaces/orgchartinteractive.interface";
import { FOLDERS, generateUniqueId } from "../../../utils/orgchartinteractive";
import toast from "react-hot-toast";
import Modal from "../../shared/Modal";
import PasswordPrompt from "../../shared/PasswordPrompt";

const MyDocuments = () => {
    const [documents, setDocuments] = useState<Documents[]>([]);
    const [subfolders, setSubfolders] = useState<{[key: string]: Subfolder}>({});
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [fileToDelete, setFileToDelete] = useState<string | null>(null);
    const [folderToDelete, setFolderToDelete] = useState<{folderId: string, path: string} | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [selectedFolder, setSelectedFolder] = useState<string>('all');
    const [selectedSubfolder, setSelectedSubfolder] = useState<string>('');
    const [folderStates, setFolderStates] = useState<FolderState>({});
    const [subfolderStates, setSubfolderStates] = useState<{[key: string]: boolean}>({});
    const [newFolderName, setNewFolderName] = useState('');
    const [creatingFolderFor, setCreatingFolderFor] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loadingError, setLoadingError] = useState<string | null>(null);

    // En MyDocuments.tsx - función de inicialización mejorada
    const initializeFolders = useCallback(async () => {
        try {
            await apiService.initializeMyDocuments();
            setLoadingError(null)
        } catch (error) {
            toast.error(`❌ Error inicializando carpetas: ${error}`);
            // No bloquear la carga si la inicialización falla
        }
    }, []);

    const toggleFolder = useCallback((folderId: string) => {
        setFolderStates(prev => ({
            ...prev,
            [folderId]: !prev[folderId]
        }));
    }, []);

    const toggleSubfolder = useCallback((subfolderPath: string) => {
        setSubfolderStates(prev => ({
            ...prev,
            [subfolderPath]: !prev[subfolderPath]
        }));
    }, []);

    // Cargar estructura de carpetas
    const loadFolderStructure = useCallback(async (folderId: string) => {
        try {
            const structure = await apiService.getMyDocumentsStructure(folderId);
            
            if (!structure || !structure.items) {
                return { name: folderId, path: '', type: 'folder', items: [] };
            }
            
            return structure;
        } catch (error) {
            return { name: folderId, path: '', type: 'folder', items: [] };
        }
    }, []);

    const flattenFiles = useCallback((items: any[], folderId: string, currentPath = ''): Documents[] => {
        let files: Documents[] = [];
    
        items.forEach(item => {
            if (item.isFile) {
                // Es un archivo
                const ext = item.type;
                const [icon, color] = getFileTypes(ext);
        
                files.push({
                    id: generateUniqueId(),
                    name: item.name,
                    url: item.path,
                    type: ext,
                    size: item.size ? `${(item.size / (1024 * 1024)).toFixed(1)} MB` : 'N/A',
                    icon,
                    color,
                    uploadDate: item.uploadDate ? new Date(item.uploadDate).toISOString().split('T')[0] : 'N/A',
                    folder: folderId,
                    folderPath: currentPath,
                    fullPath: item.fullPath
                });
            } else if (item.items && item.items.length > 0) {
                // Es una carpeta con items - llamada recursiva
                files = files.concat(flattenFiles(item.items, folderId, item.path));
            }
        });
    
        return files;
    }, []);

    // SOLUCIÓN SIMPLE - cargar todo en una sola operación
    const loadDocuments = useCallback(async () => {
        try {
            setIsLoading(true);

            // 1. Cargar TODAS las estructuras primero
            const structures = await Promise.all(
                FOLDERS.map(async (folder) => {
                    try {
                        const structure = await apiService.getMyDocumentsStructure(folder.id);
                        return {
                            folderId: folder.id,
                            folderName: folder.name,
                            structure: structure || { name: folder.id, path: '', type: 'folder', items: [] }
                        };
                    } catch (error) {
                        return {
                            folderId: folder.id,
                            folderName: folder.name,
                            structure: { name: folder.id, path: '', type: 'folder', items: [] }
                        };
                    }
                })
            );

            // 2. Actualizar el estado subfolders con todas las estructuras
            const newSubfolders: { [key: string]: Subfolder } = {};
            structures.forEach(({ folderId, structure }) => {
                newSubfolders[folderId] = structure;
            });
            setSubfolders(newSubfolders);

            // 3. Procesar documentos de todas las estructuras
            const allDocuments: Documents[] = [];
            structures.forEach(({ folderId, structure }) => {
                if (structure.items && structure.items.length > 0) {
                    const folderFiles = flattenFiles(structure.items, folderId);
                    allDocuments.push(...folderFiles);
                }
            });
            setDocuments(allDocuments);

        } catch (error) {
            toast.error('Error al cargar los documentos');
            setDocuments([]);
        } finally {
            setIsLoading(false);
        }
    }, [flattenFiles]);

    // Crear nueva subcarpeta
    const handleCreateFolder = useCallback(async (folderId: string, parentPath = '') => {
        if (!newFolderName.trim()) {
            toast.error('El nombre de la carpeta no puede estar vacío');
            return;
        }

        try {
            await apiService.createMyDocumentsSubfolder(folderId, newFolderName, parentPath);
            await loadFolderStructure(folderId);
            await loadDocuments();
            setNewFolderName('');
            setShowFolderModal(false);
            setCreatingFolderFor('');
            toast.success('Subcarpeta creada correctamente');
        } catch (error) {
            toast.error('Error al crear la subcarpeta');
        }
    }, [newFolderName, loadFolderStructure, loadDocuments]);

    // Eliminar subcarpeta
    const handleDeleteFolder = useCallback(async () => {
        if (!folderToDelete) return;

        try {
            await apiService.deleteMyDocumentsSubfolder(folderToDelete.folderId, folderToDelete.path);
            await loadFolderStructure(folderToDelete.folderId);
            await loadDocuments();
            setFolderToDelete(null);
            setShowDeleteModal(false);
            toast.success('Carpeta eliminada correctamente');
        } catch (error) {
            toast.error('Error al eliminar la carpeta');
        }
    }, [folderToDelete, loadFolderStructure, loadDocuments]);

    // Eliminar documento
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
    const uploadSingleDocument = useCallback(async (file: File, folderId: string, subfolderPath = ''): Promise<void> => {
        const formData = new FormData();
        formData.append('file', file);

        // Si hay subcarpeta, agregarla al formData
        if (subfolderPath) {
            formData.append('subfolder', subfolderPath);
        }

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
            const targetSubfolder = selectedSubfolder || '';
            
            await Promise.all(validFiles.map(file => uploadSingleDocument(file, targetFolder, targetSubfolder)));
            await loadDocuments();
            toast.success(`${validFiles.length} documento(s) subido(s) correctamente`);
        } catch (error) {
            toast.error('Error al subir algunos documentos');
        }
    }, [uploadSingleDocument, loadDocuments, selectedFolder, selectedSubfolder]);

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

    // Renderizar estructura de carpetas recursivamente
    const renderFolderStructure = (items: any[], folderId: string, level = 0, parentPath = '') => {
        return items.map((item, index) => {
            if (item.isFile) {
                // Renderizar archivo
                const file = documents.find(d => d.name === item.name && d.folder === folderId && d.folderPath === parentPath);
                if (!file) return null;

                return (
                    <div key={`${file.id}-${index}`} className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md relative ml-4">
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
                                    <button
                                        className="cursor-pointer text-xl text-red-500 p-2 hover:bg-red-500 hover:text-white rounded-md"
                                        onClick={() => requestDeleteFile(file.id)}
                                    >
                                        <IoCloseOutline />
                                    </button>
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
                );
            } else {
                // Renderizar subcarpeta
                const subfolderKey = `${folderId}-${item.path}`;
                const isExpanded = subfolderStates[subfolderKey] || false;
                const itemFiles = flattenFiles([item], folderId, item.path);

                return (
                    <div key={subfolderKey} className="ml-4">
                        {/* HEADER DE SUBCARPETA */}
                        <div 
                            className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 border rounded-lg my-2"
                            onClick={() => toggleSubfolder(subfolderKey)}
                        >
                            <div className="flex items-center gap-3">
                                <IoFolderOpen className="text-green-500 text-xl" />
                                <div>
                                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{itemFiles.length} documento(s)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-1 text-blue-500 hover:bg-blue-100 rounded"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCreatingFolderFor(folderId);
                                        setNewFolderName('');
                                        setShowFolderModal(true);
                                    }}
                                    title="Crear subcarpeta"
                                >
                                    <MdCreateNewFolder size={18} />
                                </button>
                                <button
                                    className="p-1 text-red-500 hover:bg-red-100 rounded"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFolderToDelete({ folderId, path: item.path });
                                        setShowDeleteModal(true);
                                    }}
                                    title="Eliminar carpeta"
                                >
                                    <IoCloseOutline size={18} />
                                </button>
                                {isExpanded ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                            </div>
                        </div>

                        {/* CONTENIDO DE SUBCARPETA */}
                        {isExpanded && (
                            <div className="space-y-2">
                                {renderFolderStructure(item.items, folderId, level + 1, item.path)}
                            </div>
                        )}
                    </div>
                );
            }
        }).filter(Boolean);
    };

    // Función para resetear todos los estados de expansión
    const resetAllExpansionStates = useCallback(() => {
        // Cerrar todas las carpetas principales
        const closedFolderStates: FolderState = {};
        FOLDERS.forEach(folder => {
            closedFolderStates[folder.id] = false;
        });
        setFolderStates(closedFolderStates);
        
        // Cerrar todas las subcarpetas
        setSubfolderStates({});
        
        // Resetear selección de subcarpeta
        setSelectedSubfolder('');
    }, []);

    useEffect(() => {
        const initialize = async () => {
            await initializeFolders();
            await loadDocuments();
        };
        initialize();
    }, [initializeFolders]);

    useEffect(() => {
        // Carpeta principal cerrada
        const initialFolderStates: FolderState = {};
        FOLDERS.forEach(folder => {
            initialFolderStates[folder.id] = false;
        });
        setFolderStates(initialFolderStates);
        // Subcarpetas también cerradas (el estado vacío significa todas cerradas)
        setSubfolderStates({});
        // Resetear selección de subcarpeta
        setSelectedSubfolder('');
    }, []);

    // Opcional: Expandir solo la carpeta seleccionada
    useEffect(() => {
        if (selectedFolder !== 'all') {
            setFolderStates(prev => {
                const newState = { ...prev };
                // Cerrar todas primero
                FOLDERS.forEach(folder => {
                    newState[folder.id] = false;
                });
                // Abrir solo la seleccionada
                newState[selectedFolder] = true;
                return newState;
            });
        }
    }, [selectedFolder]);

    useEffect(() => {
        resetAllExpansionStates();
    }, [selectedFolder, resetAllExpansionStates]);

    // ✅ FILTRAR Y AGRUPAR DOCUMENTOS
    const filteredDocuments = documents.filter(doc => {
        const matchesType = filterType === 'all' || doc.type === filterType;
        const matchesFolder = selectedFolder === 'all' || doc.folder === selectedFolder;
        return matchesType && matchesFolder;
    });

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

    if (loadingError) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                        Error al cargar los documentos
                    </h3>
                    <p className="text-red-600 mb-4">
                        {loadingError}
                    </p>
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
                            onChange={(e) => {
                                setSelectedFolder(e.target.value);
                                setSelectedSubfolder('');
                            }}
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
                        {selectedSubfolder && ` / ${selectedSubfolder}`}
                    </p>
                    <p className="text-xs text-gray-400">
                        PDF, Word, Excel, PowerPoint, imágenes y texto (hasta 50MB cada uno)
                    </p>
                </div>
            </div>

            {/* LISTA DE DOCUMENTOS CON ESTRUCTURA DE CARPETAS */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {filteredDocuments.length > 0 ? (
                    <div className="space-y-4 p-4">
                        {selectedFolder !== 'all' ? (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    {FOLDERS.find(f => f.id === selectedFolder)?.name}
                                </h3>
                                {subfolders[selectedFolder] && (
                                    <div className="space-y-2">
                                        {renderFolderStructure(subfolders[selectedFolder].items, selectedFolder)}
                                    </div>
                                )}
                            </div>
                        ) : (
                            FOLDERS.map(folder => {
                                const folderDocs = filteredDocuments.filter(doc => doc.folder === folder.id);
                                if (folderDocs.length === 0) return null;

                                return (
                                    <div key={folder.id} className="border border-gray-200 rounded-lg">
                                        {/* HEADER DE CARPETA PRINCIPAL */}
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
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="p-1 text-blue-500 hover:bg-blue-100 rounded"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCreatingFolderFor(folder.id);
                                                        setNewFolderName('');
                                                        setShowFolderModal(true);
                                                    }}
                                                    title="Crear subcarpeta"
                                                >
                                                    <MdCreateNewFolder size={18} />
                                                </button>
                                                {folderStates[folder.id] ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                                            </div>
                                        </div>

                                        {/* CONTENIDO DE CARPETA PRINCIPAL */}
                                        {folderStates[folder.id] && subfolders[folder.id] && (
                                            <div className="p-4">
                                                {renderFolderStructure(subfolders[folder.id].items, folder.id)}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay documentos</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Comienza subiendo algunos documentos.
                        </p>
                    </div>
                )}
            </div>

            {/* MODAL PARA CREAR CARPETA */}
            {showFolderModal && (
                <Modal
                    className1="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
                    className2="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6"
                    closeModal={() => {
                        setShowFolderModal(false);
                        setCreatingFolderFor('');
                    }}
                >
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Crear nueva carpeta</h3>
                        <p className="text-sm text-gray-600 mb-3">
                            En: {creatingFolderFor ? FOLDERS.find(f => f.id === creatingFolderFor)?.name : 'Carpeta principal'}
                        </p>
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Nombre de la carpeta"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleCreateFolder(creatingFolderFor);
                                }
                            }}
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => handleCreateFolder(creatingFolderFor)}
                            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-yellow-500"
                        >
                            Crear
                        </button>
                    </div>
                </Modal>
            )}

            {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            {showDeleteModal && (
                <Modal
                    className1="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
                    className2="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6"
                    closeModal={() => setShowDeleteModal(false)}
                >
                    <PasswordPrompt
                        onSuccess={fileToDelete ? handleDeleteDocument : handleDeleteFolder}
                        message={fileToDelete 
                            ? "Ingrese la contraseña para eliminar el documento" 
                            : "Ingrese la contraseña para eliminar la carpeta y todo su contenido"
                        }
                    />
                </Modal>
            )}
        </div>
    );
};

export default MyDocuments;