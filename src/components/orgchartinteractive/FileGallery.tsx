import { useState, useEffect, useRef, useCallback } from 'react';
import { url } from '../../server/url';
import { getFileTypes } from '../../utils/files';
import { FileViewer } from '../shared/FileViewer';
import { FileWithPreview } from '../../interfaces/shared.interface';
import { Employee } from '../../interfaces/orgchartinteractive.interface';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { IoCloseOutline } from 'react-icons/io5';
import { EmployeeRecord } from './Documents/EmployeeRecord';
import Modal from '../shared/Modal';
import toast from 'react-hot-toast';
import PasswordPrompt from '../shared/PasswordPrompt';
import StaffRecruitment from './Documents/StaffRecruitment';
import EmployeementContract from './Documents/EmploymentContract';
import APDN from './Documents/APDN';
import ConfidentialityAgreement from './Documents/ConfidentialityAgreement';
import CodeOfEthics from './Documents/CodeOfEthics';
import RIBA from './Documents/RIBA';
import RIT from './Documents/RIT';
import JobProfile from './Documents/JobProfile';
import PerformanceEvaluation from './Documents/PerformanceEvaluation';

const RECORD_DOCUMENTS = [
  "Caratula.pdf",
  "Alta del personal.pdf",
  "Contrato laboral.pdf",
  "APDN.pdf",
  "Acuerdo de confidencialidad.pdf",
  "Codigo de etica.pdf",
  "RIBA.pdf",
  "RIT.pdf",
  "Perfil de puesto.pdf",
  "Evaluacion de desempeño.pdf"
];

const INITIAL_FILES: FileWithPreview[] = [
  {
    id: '0',
    name: 'Documento importante',
    url: `${url}qr.png`,
    type: 'pdf',
    size: '4.7 MB',
    icon: 'fa fa-file-pdf-o',
    color: 'red',
    uploadDate: '2023-06-21',
  }
];

const FileGallery = ({employee}: {employee: Employee}) => {
  const { name, alias, puesto, area } = employee;
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [send, setSend] = useState(false);
  const [download, setDownload] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [optionSelected, setOptionSelected] = useState<string>('');
  const [showComponent, setShowComponent] = useState<typeof optionSelected | 'Delete' | ''>('');
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Función para verificar si un archivo existe
  const checkIfFileExists = useCallback((fileName: string): boolean => {
    return files.some(file => file.name === fileName);
  }, [files]);

  // Función para determinar el texto del botón
  const getButtonText = useCallback(() => {
    if (!optionSelected) return "Crear ...";
    
    const fileExists = checkIfFileExists(optionSelected);
    return fileExists ? `Actualizar ${optionSelected}` : `Crear ${optionSelected}`;
  }, [optionSelected, checkIfFileExists]);

  // Cargar archivos desde el backend
  const loadFiles = useCallback(async () => {
    if (!name) {
      setFiles(INITIAL_FILES);
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
          const formattedFiles: FileWithPreview[] = serverFiles.map((file: any) => {
            const ext = file.name.split('.').pop() || '';
            const [icon, color] = getFileTypes(ext);
            return {
              id: crypto.randomUUID,
              name: file.name,
              url: `${url}orgchart/employees/${encodeURIComponent(name)}/${encodeURIComponent(file.name)}`,
              type: ext,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              icon,
              color,
              uploadDate: new Date(file.uploadDate).toISOString().split('T')[0]
            };
          });
          
          setFiles(formattedFiles);
          setIsActive(true);
        } else {
          setFiles(INITIAL_FILES);
          setIsActive(false);
        }
      } else {
        setFiles(INITIAL_FILES);
        setIsActive(false);
      }
    } catch (error) {
      console.error('Error loading files:', error);
      setFiles(INITIAL_FILES);
      setIsActive(false);
    } finally {
      setIsLoading(false);
    }
  }, [name]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const isValidEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const handleSendDownload = useCallback(async () => {
    if (!send && !download) {
      toast.error("Selecciona enviar o descargar antes de aceptar");
      return;
    }

    if (send && (!email || !isValidEmail(email))) {
      toast.error("Por favor ingresa un correo electrónico válido");
      return;
    }

    try {
      const data = {
        send,
        download,
        ...(send && { email })
      };

      const res = await fetch(`${url}orgchart/download-send-mail-zip/${encodeURIComponent(name)}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP: ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      
      if (contentType?.includes("application/zip")) {
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
      }

      const successMessage = send && download 
        ? `Expediente enviado a ${email} y descargado correctamente`
        : send ? `Expediente enviado a ${email} correctamente`
        : "Expediente descargado correctamente";
      
      toast.success(successMessage);

      // Limpiar formulario
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
  }, [send, download, email, name, isValidEmail]);

  const handleDeleteFile = useCallback(async () => {
    if (!fileToDelete) return;

    const loadingToast = toast.loading('Eliminando archivo...');
    
    try {
      const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(name)}/${encodeURIComponent(fileToDelete)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadFiles();
        toast.success('Archivo eliminado correctamente');
      } else {
        throw new Error('Error al eliminar el archivo');
      }
    } catch (error) {
      toast.error('Error al eliminar el archivo');
    } finally {
      toast.dismiss(loadingToast);
      setFileToDelete(null);
      setShowComponent('');
    }
  }, [fileToDelete, name, loadFiles]);

  const handleSendChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSend(isChecked);
    setShowEmailInput(isChecked);
    if (!isChecked) setEmail('');
  }, []);

  const uploadSingleFile = useCallback(async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${url}orgchart/employees/${encodeURIComponent(name)}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 400) throw new Error('Tipo de archivo no permitido');
        if (response.status === 413) throw new Error('El archivo excede el límite de 10MB');
        throw new Error('Error al subir el archivo');
      }
    } catch (error) {
      throw error;
    }
  }, [name]);

  const handleFilesUpload = useCallback(async (filesToUpload: File[]) => {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    filesToUpload.forEach(file => {
      const validTypes = ['application/pdf'];
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const isValidType = validTypes.includes(file.type) || ['pdf'].includes(extension);
      const isValidSize = file.size <= 10 * 1024 * 1024;
      
      isValidType && isValidSize ? validFiles.push(file) : invalidFiles.push(file.name);
    });
    
    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length} archivo(s) no válidos. Solo se permiten PDF (hasta 10MB)`);
    }
    
    if (validFiles.length === 0) return;
    
    try {
      await Promise.all(validFiles.map(uploadSingleFile));
      await loadFiles();
      toast.success(`${validFiles.length} archivo(s) subido(s) correctamente`);
    } catch (error) {
      toast.error('Error al subir algunos archivos');
    }
  }, [uploadSingleFile, loadFiles]);

  const requestDeleteFile = useCallback((fileName: string) => {
    setFileToDelete(fileName);
    setShowComponent('Delete');
  }, []);

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
    if (droppedFiles.length > 0) handleFilesUpload(droppedFiles);
  }, [handleFilesUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles?.length) {
      handleFilesUpload(Array.from(selectedFiles));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [handleFilesUpload]);

  const handlePdfGeneration = useCallback(async () => {
    if (optionSelected === "Caratula.pdf") {
      EmployeeRecord(files, employee, loadFiles);
      setOptionSelected('');
    }
    else if (optionSelected === "Contrato laboral.pdf") {
      const fileExists = checkIfFileExists("Alta del personal.pdf");
      fileExists ? setShowComponent(optionSelected) : toast.error('Error: No existe el documento "Alta del personal.pdf" para crear el contrato "laboral.pdf" debes crear primero el "Alta del personal.pdf"');
    }
    else {
      setShowComponent(optionSelected);
    }
  }, [optionSelected, files, employee, loadFiles]);

  const handleCloseForm = useCallback(async () => {
    setShowComponent('');
    setOptionSelected('');
    await loadFiles();
  }, [loadFiles]);

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
      <div className="m-1 gap-1 flex justify-between flex-wrap">
        <div className="m-1 gap-2 flex flex-col">
          <h2 className="text-1xl font-bold text-gray-800">{alias}</h2>
          <p className="text-gray-600">{`(${area} - ${puesto})`}</p>
        </div>
        
        <div className="m-1 gap-2 flex flex-col">
          <label htmlFor="documento" className="text-sm font-medium">Documentos</label>
          <div className="flex gap-2">
            <select
              value={optionSelected}
              onChange={(e) => setOptionSelected(e.target.value)}
              className="text-cyan-600 rounded p-1 border"
            >
              <option value="">Selecciona el tipo de documento</option>
              {RECORD_DOCUMENTS.map((documento) => (
                <option key={documento} value={documento}>{documento}</option>
              ))}
            </select>
            <button
              onClick={handlePdfGeneration}
              disabled={!optionSelected}
              className={`inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 ${
                !optionSelected ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {getButtonText()}
            </button>
          </div>
        </div>

        {isActive && (
          <div className="m-1 gap-2 flex flex-col">
            <label className="flex items-center gap-1 text-cyan-600">
              <input type="checkbox" checked={send} onChange={handleSendChange} />
              Enviar expediente
            </label>
            <label className="flex items-center gap-1 text-cyan-600">
              <input type="checkbox" checked={download} onChange={(e) => setDownload(e.target.checked)} />
              Descargar expediente
            </label>
            
            {showEmailInput && (
              <input
                className="text-sm text-cyan-600 px-2 py-1 border rounded"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu email"
                required
              />
            )}
            
            {(send || download) && (
              <button
                onClick={handleSendDownload}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-yellow-500"
              >
                {send && download ? 'Enviar y descargar' : send ? 'Enviar expediente' : 'Descargar expediente'}
              </button>
            )}
          </div>
        )}
      </div>
      
      <div
        className={`mt-1 p-2 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
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
          accept=".pdf,application/pdf"
          className="hidden"
          multiple
        />
        <div className="flex flex-col items-center justify-center space-y-1">
          <svg className="w-10 h-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-gray-600">
            <span className="font-medium text-cyan-600">Haz clic para subir</span> o arrastra y suelta aquí
          </p>
          <p className="text-xs text-gray-500">Se aceptan múltiples archivos PDF (hasta 10MB cada uno)</p>
        </div>
      </div>
      
      <div className="mt-2">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Todos los archivos</h3>
        {files.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map((file) => (
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
                          onClick={() => requestDeleteFile(file.name)}
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
        ) : (
          <p className="text-gray-500 text-center py-4">No hay archivos disponibles</p>
        )}
      </div>

      {(showComponent) && (
        <Modal
          className1="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
          className2={`relative bg-white rounded-lg shadow-lg ${optionSelected ? 'max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto' : 'max-w-md w-full p-6'}`}
          closeModal={() => setShowComponent('')}
        >
          {showComponent === "Delete" && (
            <PasswordPrompt
              onSuccess={handleDeleteFile}
              message="Ingrese la contraseña para eliminar el archivo"
            />
          )}
          {showComponent === "Alta del personal.pdf" && (
            <StaffRecruitment
              employee={employee}
              onClose={handleCloseForm}
            />
          )}
          {showComponent === "Contrato laboral.pdf" && (
            <EmployeementContract
              file={files.find((file) => file.name === "Alta del personal.json")}
              onClose={handleCloseForm}
            />
          )}
          {showComponent === "APDN.pdf" && (
            <APDN
            />
          )}
          {showComponent === "Acuerdo de confidencialidad.pdf" && (
            <ConfidentialityAgreement
            />
          )}
          {showComponent === "Codigo de etica.pdf" && (
            <CodeOfEthics
            />
          )}
          {showComponent === "RIBA.pdf" && (
            <RIBA
            />
          )}
          {showComponent === "RIT.pdf" && (
            <RIT
            />
          )}
          {showComponent === "Perfil de puesto.pdf" && (
            <JobProfile
            />
          )}
          {showComponent === "Evaluacion de desempeño.pdf" && (
            <PerformanceEvaluation
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default FileGallery;