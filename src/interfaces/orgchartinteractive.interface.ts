import { EvaluationSection } from "../utils/orgchartinteractive";
import { FileWithPreview } from "./shared.interface";

export interface OrgNode {
  id?: string;
  name: string;
  attributes?: {
    alias?: string;
    puesto?: string;
    area?: string;
  };
  children?: OrgNode[];
}

export interface Employee {
  id: string;
  name: string;
  alias: string;
  puesto: string;
  area: string;
}

export interface NodeActionProps {
  modalAction?: string;
  modalEmployee?: Employee | null;
  onSuccess: any
}

export interface StaffRecruitmentProps {
  employee: Employee;
  onClose: () => void;
}

export interface EmploymentContractProps {
  employee: Employee;
  file: FileWithPreview | undefined;
  onClose: () => void;
}

export interface PersonalFormData {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  domicilio: {
    calle: string;
    numero: string;
    colonia: string;
    cp: string;
    ciudad: string;
    estado: string;
  };
  datosPersonales: {
    celular: string;
    rfc: string;
    fechaNacimiento: string;
    curp: string;
    ciudadNacimiento: string;
    estadoNacimiento: string;
    numeroIMSS: string;
    fechaIngreso: string;
  };
  datosFamiliares: {
    nombreConyuge: string;
    colonia: string;
    cp: string;
    ciudad: string;
    estado: string;
  };
  datosEmergencia: {
    persona1: {
      nombre: string;
      celular: string;
      parentesco: string;
    };
    persona2: {
      nombre: string;
      celular: string;
      parentesco: string;
    };
  };
}

export interface ContractData {
  trabajador: string;
  estadoOrigen: string;
  curp: string;
  rfc: string;
  type: string;
  duracionContrato: string;
  puesto: string;
  salarioDiario: string;
  salarioSemanal: string;
  fechaContrato: string;
  actividades: string[];
}

export interface APDNData {
  fechaDia: string;
  fechaMes: string;
  fechaAnio: string;
  banco: string;
  numeroCuenta: string;
  numeroTarjeta: string;
  email: string;
  trabajador: string;
}

export interface GeneralInfo {
  position: string;
  numberOfPositions: string;
  location: string;
  department: string;
  reportsTo: string;
  objective: string;
  schedule: string;
  capacity: {physical: 'si' | 'no', mental: 'si' | 'no'};
}

export interface Requirements {
  education: string;
  degree: string;
  experience: string;
}

export interface Responsibility {
  id: number;
  description: string;
}

export interface SpecificFunction {
  id: number;
  description: string;
  periodicidadData: { periodicidad: string, indicador: string };
}

export interface Skill {
  id: number;
  skill: string;
  level: 'basic' | 'competent' | 'expert';
}

export interface Competency {
  id: number;
  competency: string;
  level: 'basic' | 'competent' | 'expert';
}

export interface JobProfileData {
  generalInfo: GeneralInfo;
  requirements: Requirements;
  responsibilities: Responsibility[];
  specificFunctions: SpecificFunction[];
  skills: Skill[];
  competencies: Competency[];
}

export interface EvaluationData {
  ciudad: string;
  fecha: {
    dia: string;
    mes: string;
    año: string;
  };
  nombreTrabajador: string;
  area: string;
  puesto: string;
  actitudTrabajo: {
    interesErrores: number;
    aprendizaje: number;
    seguimientoReglas: number;
    sentidoUrgencia: number;
  };
  cooperacion: {
    cooperacionSolicitada: number;
    cooperacionNoSolicitada: number;
    sugerencias: number;
    integracion: number;
  };
  calidadTrabajo: {
    calidadForma: number;
    calidadTiempo: number;
    adaptacion: number;
    dominio: number;
  };
  relaciones: {
    conCompaneros: number;
    conSuperiores: number;
    conSubordinados: number;
    conClientes: number;
  };
  asistencia: {
    asistencia: number;
    puntualidad: number;
    rotarTurno: number;
    guardias: number;
  };
  
  // Decisión del contrato
  decisionContrato: 'prorroga' | 'indefinido' | 'termina';
  nombreEvaluador: string;
}

export interface RecordStatus {
  [key: string]: boolean;
}

export interface RadioGroupProps {
  section: EvaluationSection;
  field: string;
  value: number;
  label: string;
}

export interface Documents {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  icon: string;
  color: string;
  uploadDate: string;
  folder: string;
  folderPath: string;
}

export interface FolderState {
  [key: string]: boolean;
}